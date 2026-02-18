import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Save, RotateCcw, Check, Music } from 'lucide-react';
import type { VectorRow } from '../types';

interface TapSyncToolProps {
    rows: VectorRow[];
    onApplySync: (syncedRows: VectorRow[]) => void;
    onCancel: () => void;
    audioUrl?: string;
}

const TapSyncTool: React.FC<TapSyncToolProps> = ({ rows, onApplySync, onCancel, audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timestamps, setTimestamps] = useState<number[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use local audio if provided, otherwise prop, otherwise fallback
    const effectiveAudioUrl = localAudioUrl || audioUrl || "https://actions.google.com/sounds/v1/science_fiction/scifi_drone_1.ogg";

    useEffect(() => {
        if (isPlaying && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isPlaying]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalAudioUrl(url);
        }
    };


    const handleStart = () => {
        if (!audioRef.current) return;
        setTimestamps([]);
        setCurrentIndex(0);
        setIsPlaying(true);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setStartTime(Date.now());
        // Record first timestamp as 0
        setTimestamps([0]);
    };

    const handleStop = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleTap = () => {
        if (!isPlaying || !audioRef.current) return;

        const now = audioRef.current.currentTime;
        setTimestamps(prev => [...prev, now]);
        setCurrentIndex(prev => prev + 1);

        // Auto-stop if we reach end
        if (currentIndex >= rows.length - 1) {
            handleStop();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isPlaying) {
                handleTap();
            } else {
                handleStart();
            }
        }
    };

    const handleApply = () => {
        // Convert timestamps to duration/start updates
        const newRows = [...rows];

        timestamps.forEach((time, idx) => {
            if (idx >= newRows.length) return;

            // Start time is the recorded time
            newRows[idx].timeStart = formatTime(time);

            // Duration is diff between this and next (or 2s default for last)
            const nextTime = timestamps[idx + 1] || (time + 2);
            const duration = nextTime - time;
            newRows[idx].duration = parseFloat(duration.toFixed(2));
        });

        // Ensure consecutive flow
        // The first row starts at 0 (timestamps[0])
        // The last row duration was estimated.

        onApplySync(newRows);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 outline-none"
            tabIndex={0}
            ref={containerRef}
            onKeyDown={handleKeyDown}
        >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl p-8 flex flex-col items-center gap-8 relative overflow-hidden">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-light text-slate-100">Performance Sync</h2>
                    <p className="text-slate-400">Press <span className="font-bold text-indigo-400 px-2 py-0.5 bg-indigo-900/30 rounded border border-indigo-500/30">SPACEBAR</span> to start the next line</p>
                </div>

                {/* Progress Indicators */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    {rows.map((row, i) => (
                        <div
                            key={i}
                            className={`h-full transition-all duration-300 border-r border-slate-900 ${i < currentIndex ? 'bg-emerald-500' :
                                i === currentIndex ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'
                                }`}
                            style={{ width: `${100 / rows.length}%` }}
                        />
                    ))}
                </div>

                {/* Teleprompter Display */}
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 min-h-[300px] perspective-1000">
                    {/* Previous Line (Faded) */}
                    {currentIndex > 0 && rows[currentIndex - 1] && (
                        <p className="text-2xl text-slate-700 font-serif blur-[1px] transform -translate-y-4 scale-90 transition-all duration-500 select-none">
                            {rows[currentIndex - 1].textSync || "(No Text)"}
                        </p>
                    )}

                    {/* Current Line (Active) */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
                        <p className="relative text-4xl md:text-5xl text-slate-100 font-serif font-medium text-center leading-relaxed transition-all duration-300 scale-100 select-none z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {rows[currentIndex]?.textSync || <span className="text-slate-600 italic">Wait for it...</span>}
                        </p>
                        <div className="text-center mt-4">
                            <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30">
                                Beat {currentIndex + 1} / {rows.length}
                            </span>
                        </div>
                    </div>

                    {/* Next Line (Faded) */}
                    {currentIndex < rows.length - 1 && rows[currentIndex + 1] && (
                        <p className="text-2xl text-slate-700 font-serif blur-[1px] transform translate-y-4 scale-90 transition-all duration-500 select-none">
                            {rows[currentIndex + 1].textSync || "(No Text)"}
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-4 z-20 items-end">
                    {!isPlaying ? (
                        <>
                            <div className="flex flex-col gap-4 items-center">
                                <label className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full cursor-pointer transition-colors text-sm border border-slate-700">
                                    <Music size={16} />
                                    <span>{localAudioUrl ? 'Audio Loaded' : 'Load Audio File'}</span>
                                    <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
                                </label>

                                <div className="flex gap-4">
                                    <button onClick={handleStart} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95">
                                        <Play size={24} fill="currentColor" />
                                        <span>Start Syncing</span>
                                    </button>

                                    {timestamps.length > 0 && (
                                        <button onClick={handleApply} className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95">
                                            <Check size={24} />
                                            <span>Save Timing</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button onClick={onCancel} className="px-6 py-4 text-slate-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={handleTap} className="flex items-center gap-3 px-12 py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-xl transition-all shadow-lg shadow-rose-600/20 animate-pulse hover:scale-[1.02] active:scale-95 border-4 border-rose-800/50">
                            TAP [Space]
                        </button>
                    )}
                </div>

                {/* Hidden Audio Element */}
                <audio ref={audioRef} src={effectiveAudioUrl} className="hidden" onEnded={handleStop} />

                {/* Audio Status */}
                <div className="absolute bottom-6 left-8 flex items-center gap-2 text-slate-600 text-xs font-mono border border-slate-800/50 px-3 py-1 rounded bg-slate-950/50">
                    <Music size={12} />
                    <span>{effectiveAudioUrl.split('/').pop()}</span>
                </div>

            </div>
        </div>
    );
};

export default TapSyncTool;
