import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import type { PlayerRef } from '@remotion/player';
import { SequenceComposition } from '../remotion/SequenceComposition';
import type { VectorRow, StoryboardRow, AudioSettings } from '../types';
import { MonitorPlay, Image as ImageIcon, Download, Check, Copy, Loader2, Edit3, Move, Play, Pause } from 'lucide-react';
import DraggableCanvas from '../components/DraggableCanvas';
import { EditorSidebar } from '../components/EditorSidebar';
import GlyphLibrary from '../components/GlyphLibrary';
import { PrimitiveType, GlyphVerb, MotionSpeed, SizeLevel, HumanPosture } from '../types';
import GlyphCreator from '../components/GlyphCreator';

// ... (imports remain)

interface PreviewViewProps {
    vectorRows: VectorRow[];
    storyRows: StoryboardRow[];
    onUpdateRow?: (index: number, updates: Partial<VectorRow>) => void;
    initialFrame?: number | null;
}

const PreviewView: React.FC<PreviewViewProps> = ({ vectorRows, storyRows, onUpdateRow, initialFrame }) => {
    const playerRef = useRef<PlayerRef>(null);
    const [isExportingStills, setIsExportingStills] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [copiedCommand, setCopiedCommand] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(!isEditing);

    const [selection, setSelection] = useState<{ type: 'glyph' | 'shape' | 'text', index: number } | null>(null);
    const [showTextLayer, setShowTextLayer] = useState(false);
    const [showGlyphCreator, setShowGlyphCreator] = useState(false);
    const [audioSettings, setAudioSettings] = useState<AudioSettings>({
        bgmUrl: "https://actions.google.com/sounds/v1/science_fiction/scifi_drone_1.ogg", // Default Sci-Fi Drone
        bgmVolume: 0.2,
        narrationUrl: "",
        narrationVolume: 1.0,
        enableSfx: true,
        sfxUrl: "",
        sfxVolume: 0.5
    });

    // Seek to initial frame if provided
    useEffect(() => {
        if (initialFrame !== undefined && initialFrame !== null && playerRef.current) {
            playerRef.current.seekTo(initialFrame);
            // Optionally pause or play? User said "take me... into the video".
            // Typically seeking pauses or continues state. Let's ensure it updates.
        }
    }, [initialFrame]);

    // Calculate total duration based on all rows
    const totalDurationInFrames = Math.max(
        vectorRows.reduce((acc, row) => acc + (row.duration * 30), 0),
        30 // Minimum 1 second
    );

    // Determine Active Row based on Current Frame
    const getActiveRowIndex = (frame: number) => {
        let accumulated = 0;
        for (let i = 0; i < vectorRows.length; i++) {
            const duration = Math.max(Math.floor(vectorRows[i].duration * 30), 1);
            if (frame >= accumulated && frame < accumulated + duration) {
                return i;
            }
            accumulated += duration;
        }
        return -1;
    };

    const activeRowIndex = getActiveRowIndex(currentFrame);
    const activeRow = activeRowIndex !== -1 ? vectorRows[activeRowIndex] : null;

    // Polling for Current Frame (Player Ref)
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current) {
                setCurrentFrame(playerRef.current.getCurrentFrame());
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Clear selection when changing rows or exiting editing
    useEffect(() => {
        if (!isEditing) setSelection(null);
    }, [isEditing]);

    useEffect(() => {
        setSelection(null);
    }, [activeRowIndex]);

    // Force pause when entering edit mode to ensure clean state
    useEffect(() => {
        if (isEditing && playerRef.current) {
            playerRef.current.pause();
            setIsPlaying(false);
        }
    }, [isEditing]);


    const handleExportVideo = () => {
        const command = "npm run render";
        navigator.clipboard.writeText(command);
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
    };

    const handleExportStills = async () => {
        if (!playerRef.current) return;

        setIsExportingStills(true);
        setDownloadProgress(0);

        try {
            for (let i = 0; i <= 100; i += 10) {
                setDownloadProgress(i);
                await new Promise(r => setTimeout(r, 100));
            }
            // Mock alert
            console.log("To export high-quality stills batch, run: npm run render-stills");
        } catch (e) {
            console.error(e);
        } finally {
            setIsExportingStills(false);
        }
    };

    const handleRowUpdate = (updates: Partial<VectorRow>) => {
        if (activeRowIndex !== -1 && onUpdateRow) {
            onUpdateRow(activeRowIndex, updates);
        }
    };

    const togglePlayback = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
                setIsPlaying(false);
            } else {
                playerRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300 overflow-hidden">

            {/* Toolbar */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur shrink-0">
                <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                    <MonitorPlay size={20} className="text-blue-400" />
                    Preview & Export
                </h2>
                <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlayback}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        <span className="text-sm font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <div className="h-6 w-px bg-slate-800 mx-2" />

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${isEditing
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {isEditing ? <Move size={16} className="animate-pulse" /> : <Edit3 size={16} />}
                        <span className="text-sm font-medium">{isEditing ? 'Editing Active' : 'Edit Glyphs'}</span>
                    </button>

                    <GlyphLibrary
                        currentVectorRow={activeRow || undefined}
                        onSelect={(preset) => {
                            if (activeRowIndex !== -1) {
                                handleRowUpdate({
                                    compositionRule: preset.compositionRule,
                                    motion: {
                                        ...activeRow!.motion,
                                        verb: preset.motion.verb,
                                        speed: preset.motion.speed,
                                        transition: preset.motion.transition
                                    },
                                    glyphs: preset.glyphs,
                                    shapes: preset.shapes
                                });
                            }
                        }}
                    />
                    <div className="text-sm text-slate-500 font-mono pl-4 border-l border-slate-800">
                        {totalDurationInFrames} Frames • 30 FPS • {(totalDurationInFrames / 30).toFixed(1)}s
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Player Container */}
                <div className="flex-1 flex items-center justify-center bg-black/50 p-8 relative">
                    <div className="shadow-2xl shadow-indigo-500/10 rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video h-full max-h-[600px] w-auto relative">
                        {vectorRows.length > 0 ? (
                            <>
                                <Player
                                    ref={playerRef}
                                    component={SequenceComposition as any}
                                    inputProps={{ rows: vectorRows, audioSettings }}
                                    durationInFrames={totalDurationInFrames}
                                    fps={30}
                                    compositionWidth={1920}
                                    compositionHeight={1080}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    controls={!isEditing}
                                    autoPlay={!isEditing}
                                    loop
                                />
                                {isEditing && (
                                    <DraggableCanvas
                                        activeRow={activeRow}
                                        selection={selection}
                                        onUpdateRow={handleRowUpdate}
                                        onSelect={setSelection}
                                        showTextLayer={showTextLayer}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                                <MonitorPlay size={48} opacity={0.5} />
                                <p>No vector data to preview</p>
                            </div>
                        )}
                    </div>

                    {/* Glyph Creator Overlay */}
                    {showGlyphCreator && (
                        <div className="absolute bottom-4 left-4 z-50 shadow-2xl shadow-black/50">
                            <GlyphCreator onClose={() => setShowGlyphCreator(false)} />
                        </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                {isEditing ? (
                    <EditorSidebar
                        activeRow={activeRow}
                        selection={selection}
                        onUpdateRow={handleRowUpdate}
                        onSelect={setSelection}
                        audioSettings={audioSettings}
                        onUpdateAudio={setAudioSettings}
                        showTextLayer={showTextLayer}
                        onToggleTextLayer={setShowTextLayer}
                        showGlyphCreator={showGlyphCreator}
                        onToggleGlyphCreator={setShowGlyphCreator}
                    />
                ) : (
                    <div className="w-80 border-l border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto">

                        {/* Active Row Info */}
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Beat</h3>
                            {activeRow ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Beat ID:</span>
                                        <span className="text-white font-mono text-sm">{activeRow.beatId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Glyphs:</span>
                                        <span className="text-emerald-400 font-mono text-sm">{activeRow.glyphs.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Shapes:</span>
                                        <span className="text-blue-400 font-mono text-sm">{activeRow.shapes.length}</span>
                                    </div>
                                    <div className="mt-2 text-[10px] text-slate-600 font-mono border-t border-slate-800 pt-2">
                                        Row Index: {activeRowIndex}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-slate-600 text-sm italic">Playing intro/outro or no data matches.</span>
                            )}
                        </div>

                        {/* Export MP4 Section */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Export Video</h3>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <MonitorPlay size={20} />
                                    </div>
                                    <div>
                                        <div className="text-slate-200 font-medium">MP4 Render</div>
                                        <div className="text-xs text-slate-500">1080p • H.264</div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    High-quality server-side render. Run the command below in your terminal.
                                </p>

                                <div className="bg-black/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-slate-600 transition-colors" onClick={handleExportVideo}>
                                    <code className="text-xs font-mono text-blue-300">npm run render</code>
                                    {copiedCommand ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500 group-hover:text-slate-300" />}
                                </div>

                                <button
                                    onClick={handleExportVideo}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {copiedCommand ? 'Command Copied!' : 'Copy Render Command'}
                                </button>
                            </div>
                        </div>

                        {/* Export Stills Section */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Export Stills</h3>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div>
                                        <div className="text-slate-200 font-medium">Keyframe Stills</div>
                                        <div className="text-xs text-slate-500">PNG • Transparent</div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Save current frame or all keyframes as high-res PNGs.
                                </p>

                                <button
                                    onClick={handleExportStills}
                                    disabled={isExportingStills}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
                                >
                                    {isExportingStills ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Processing... {downloadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <Download size={14} />
                                            Export Stills Command
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewView;
