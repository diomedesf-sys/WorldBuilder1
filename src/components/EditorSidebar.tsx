import React, { useState } from 'react';
import { PrimitiveType, HumanPosture, SizeLevel, GlyphVerb, MotionSpeed, SetupTransition, MovementType } from '../types';
import type { VectorRow, Waypoint, AudioSettings } from '../types';
import { PrimitiveComponents, PRIMITIVE_ASSETS } from './primitives';
import { GlyphPerson, HUMAN_ASSETS, POSTURE_COMPONENTS } from './GlyphPerson';
import { Plus, Trash2, X, Maximize, Music, Mic, Volume2, Layers, Box } from 'lucide-react';

interface EditorSidebarProps {
    activeRow: VectorRow | null;
    selection: { type: 'glyph' | 'shape' | 'text', index: number } | null;
    onUpdateRow: (updates: Partial<VectorRow>) => void;
    onSelect: (selection: { type: 'glyph' | 'shape' | 'text', index: number } | null) => void;
    audioSettings: AudioSettings;
    onUpdateAudio: (settings: AudioSettings) => void;
    showTextLayer: boolean;
    onToggleTextLayer: (show: boolean) => void;
    showGlyphCreator: boolean;
    onToggleGlyphCreator: (show: boolean) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ activeRow, selection, onUpdateRow, onSelect, audioSettings, onUpdateAudio, showTextLayer, onToggleTextLayer, showGlyphCreator, onToggleGlyphCreator }) => {
    const [activeTab, setActiveTab] = useState<'scene' | 'assets' | 'audio'>('scene');

    // Switch to Scene tab if selection changes
    React.useEffect(() => {
        if (selection) setActiveTab('scene');
    }, [selection]);

    if (!activeRow) return <div className="p-4 text-slate-500 text-sm">No active beat to edit.</div>;

    const handleAddGlyph = (posture: HumanPosture) => {
        const newGlyph = {
            count: 1,
            posture,
            position: [0.5, 0.5] as [number, number],
            size: SizeLevel.M,
            faceColor: '#ffffff'
        };
        onUpdateRow({ glyphs: [...activeRow.glyphs, newGlyph] });
    };

    const handleAddShape = (type: PrimitiveType) => {
        const newShape = {
            type,
            function: 'Decoration',
            position: [0.5, 0.5] as [number, number],
            size: SizeLevel.M,
            rotation: 0
        };
        onUpdateRow({ shapes: [...activeRow.shapes, newShape] });
    };

    const handleDeleteSelection = () => {
        if (!selection) return;
        if (selection.type === 'glyph') {
            const newGlyphs = [...activeRow.glyphs];
            newGlyphs.splice(selection.index, 1);
            onUpdateRow({ glyphs: newGlyphs });
        } else {
            const newShapes = [...activeRow.shapes];
            newShapes.splice(selection.index, 1);
            onUpdateRow({ shapes: newShapes });
        }
        onSelect(null);
    };

    const updateSelectedGlyph = (updates: any) => {
        if (!selection || selection.type !== 'glyph') return;
        const newGlyphs = [...activeRow.glyphs];
        newGlyphs[selection.index] = { ...newGlyphs[selection.index], ...updates };
        onUpdateRow({ glyphs: newGlyphs });
    };

    const updateSelectedShape = (updates: any) => {
        if (!selection || selection.type !== 'shape') return;
        const newShapes = [...activeRow.shapes];
        newShapes[selection.index] = { ...newShapes[selection.index], ...updates };
        onUpdateRow({ shapes: newShapes });
    };

    const updateTextConfig = (updates: any) => {
        const currentConfig = activeRow.textConfig || {
            position: [0.5, 0.5],
            motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn },
        };

        // Deep merge for motion object
        const newConfig = { ...currentConfig, ...updates };
        if (updates.motion) {
            newConfig.motion = { ...currentConfig.motion, ...updates.motion };
        }

        onUpdateRow({ textConfig: newConfig });
    };

    // Render Logic
    const safeAudio = audioSettings || {
        bgmUrl: '', bgmVolume: 0.5, narrationUrl: '', narrationVolume: 1, enableSfx: true, sfxVolume: 0.2
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-80 shrink-0">
            {/* TABS HEADER */}
            <div className="flex border-b border-slate-800 bg-slate-950">
                <button
                    onClick={() => setActiveTab('assets')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'assets' ? 'text-white border-indigo-500 bg-slate-900' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900'}`}
                >
                    <Box size={14} /> Assets
                </button>
                <button
                    onClick={() => setActiveTab('audio')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'audio' ? 'text-white border-indigo-500 bg-slate-900' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900'}`}
                >
                    <Music size={14} /> Audio
                </button>
                <button
                    onClick={() => setActiveTab('scene')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'scene' ? 'text-white border-indigo-500 bg-slate-900' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900'}`}
                >
                    <Layers size={14} /> Scene
                </button>
            </div>

            {/* TAB: SCENE EDITOR */}
            {activeTab === 'scene' && (
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                        {selection ? `Start Editing ${selection.type}` : 'Beat Properties'}
                    </h3>

                    {selection ? (
                        <div className="space-y-4">
                            {/* Selected Item Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-white capitalize">
                                    {selection.type} #{selection.index + 1}
                                </div>
                                <button onClick={handleDeleteSelection} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Glyph Config */}
                            {selection.type === 'glyph' && activeRow.glyphs[selection.index] && (
                                <>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Face Color</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE', '#ffffff', '#808080', '#000000'].map(color => (
                                                <button
                                                    key={color}
                                                    className={`w-5 h-5 rounded-full border ${activeRow.glyphs[selection.index].faceColor === color ? 'border-white ring-1 ring-white' : 'border-transparent'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => updateSelectedGlyph({ faceColor: color })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Size</label>
                                        <select
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm text-slate-300"
                                            value={activeRow.glyphs[selection.index].size}
                                            onChange={(e) => updateSelectedGlyph({ size: parseInt(e.target.value) })}
                                        >
                                            {Object.values(SizeLevel).filter(x => typeof x === 'number').map(val => (
                                                <option key={val} value={val}>Size {val}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* MOVEMENT PATH SECTION */}
                                    <div className="pt-4 border-t border-slate-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase">Movement Path</h4>
                                            <button
                                                onClick={() => {
                                                    const currentWaypoints = activeRow.glyphs[selection.index].waypoints || [];
                                                    const newWaypoint: Waypoint = { x: 0.6, y: 0.5, time: 2.0, movement: MovementType.Walking };
                                                    updateSelectedGlyph({ waypoints: [...currentWaypoints, newWaypoint] });
                                                }}
                                                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Step
                                            </button>
                                        </div>
                                        {/* Existing Waypoint Map Logic */}
                                        <div className="space-y-2">
                                            <div className="bg-slate-800/50 p-2 rounded border border-slate-800 opacity-75">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded">Start (0s)</span>
                                                </div>
                                            </div>
                                            {(activeRow.glyphs[selection.index].waypoints || []).map((wp, i) => (
                                                <div key={i} className="bg-slate-800 p-2 rounded border border-slate-700 relative group">
                                                    <div className="flex gap-2 mb-2">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] text-slate-500 block">Time</label>
                                                            <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-600 rounded px-1 text-xs text-white" value={wp.time} onChange={(e) => { const newWps = [...(activeRow.glyphs[selection.index].waypoints || [])]; newWps[i].time = parseFloat(e.target.value); updateSelectedGlyph({ waypoints: newWps }); }} />
                                                        </div>
                                                        <div className="flex-[2]">
                                                            <label className="text-[10px] text-slate-500 block">Action</label>
                                                            <select className="w-full bg-slate-900 border border-slate-600 rounded px-1 text-xs text-white" value={wp.movement} onChange={(e) => { const newWps = [...(activeRow.glyphs[selection.index].waypoints || [])]; newWps[i].movement = e.target.value as MovementType; updateSelectedGlyph({ waypoints: newWps }); }}>
                                                                {Object.values(MovementType).map(m => (<option key={m} value={m}>{m}</option>))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <input type="number" step="0.05" className="w-full bg-slate-900 border border-slate-600 rounded px-1 text-xs text-slate-400" value={wp.x} onChange={(e) => { const newWps = [...(activeRow.glyphs[selection.index].waypoints || [])]; newWps[i].x = parseFloat(e.target.value); updateSelectedGlyph({ waypoints: newWps }); }} />
                                                        <input type="number" step="0.05" className="w-full bg-slate-900 border border-slate-600 rounded px-1 text-xs text-slate-400" value={wp.y} onChange={(e) => { const newWps = [...(activeRow.glyphs[selection.index].waypoints || [])]; newWps[i].y = parseFloat(e.target.value); updateSelectedGlyph({ waypoints: newWps }); }} />
                                                    </div>
                                                    <button onClick={() => { const newWps = [...(activeRow.glyphs[selection.index].waypoints || [])]; newWps.splice(i, 1); updateSelectedGlyph({ waypoints: newWps }); }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Shape Config */}
                            {selection.type === 'shape' && activeRow.shapes[selection.index] && (
                                <>
                                    <div><label className="text-xs text-slate-500 block mb-1">Rotation</label><input type="range" min="0" max="360" className="w-full" value={activeRow.shapes[selection.index].rotation} onChange={(e) => updateSelectedShape({ rotation: parseInt(e.target.value) })} /></div>
                                    <div><label className="text-xs text-slate-500 block mb-1">Size</label><select className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" value={activeRow.shapes[selection.index].size} onChange={(e) => updateSelectedShape({ size: parseInt(e.target.value) })}><option value={SizeLevel.S}>S</option><option value={SizeLevel.M}>M</option><option value={SizeLevel.L}>L</option></select></div>
                                </>
                            )}

                            {/* Text Config */}
                            {selection.type === 'text' && (
                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs text-slate-400 font-bold uppercase">Position Lock</label>
                                            <input
                                                type="checkbox"
                                                checked={activeRow.textConfig?.isLocked ?? true}
                                                onChange={(e) => updateTextConfig({ isLocked: e.target.checked })}
                                                className="w-4 h-4 accent-indigo-500"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-tight">
                                            {(activeRow.textConfig?.isLocked ?? true)
                                                ? "Text is locked. Uncheck to move."
                                                : "Text position is unlocked."}
                                        </p>
                                    </div>

                                    {/* Optional: Add other text controls here if needed later */}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={activeRow.sfxMute || false}
                                                onChange={(e) => onUpdateRow({ sfxMute: e.target.checked })}
                                                className="accent-red-500 w-3 h-3"
                                            />
                                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mute Sound</label>
                                        </div>
                                    </div>
                                    <div className={activeRow.sfxMute ? 'opacity-40 pointer-events-none' : ''}>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">SFX Override URL</label>
                                        <input
                                            type="text"
                                            value={activeRow.sfxOverride || ''}
                                            onChange={(e) => onUpdateRow({ sfxOverride: e.target.value })}
                                            placeholder="Default (Global SFX)"
                                            className="w-full bg-slate-900 border border-slate-600 rounded p-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1 italic">Leave empty to use global settings.</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Duration (Seconds)</label>
                                        <input
                                            type="number" step="0.1" min="0.1"
                                            value={activeRow.duration}
                                            onChange={(e) => onUpdateRow({ duration: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-600 rounded p-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Text Layer Controller</label>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] uppercase font-bold ${showTextLayer ? 'text-indigo-400' : 'text-slate-600'}`}>
                                                    {showTextLayer ? 'On' : 'Off'}
                                                </span>
                                                <button
                                                    onClick={() => onToggleTextLayer(!showTextLayer)}
                                                    className={`w-8 h-4 rounded-full transition-colors relative ${showTextLayer ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showTextLayer ? 'left-4.5 translate-x-0' : 'left-0.5'}`} style={{ left: showTextLayer ? 'calc(100% - 14px)' : '2px' }} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-600 italic">Toggle to show/edit the text position controller on canvas.</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Glyph Creator</label>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] uppercase font-bold ${showGlyphCreator ? 'text-indigo-400' : 'text-slate-600'}`}>
                                                    {showGlyphCreator ? 'On' : 'Off'}
                                                </span>
                                                <button
                                                    onClick={() => onToggleGlyphCreator(!showGlyphCreator)}
                                                    className={`w-8 h-4 rounded-full transition-colors relative ${showGlyphCreator ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showGlyphCreator ? 'left-4.5 translate-x-0' : 'left-0.5'}`} style={{ left: showGlyphCreator ? 'calc(100% - 14px)' : '2px' }} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-600 italic">Toggle to open the Glyph Studio overlay.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-slate-600 text-xs italic text-center pt-4 border-t border-slate-800">
                                Select a glyph or shape on the canvas to edit its specific properties.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: ASSETS LIBRARY */}
            {activeTab === 'assets' && (
                <div className="flex-1 overflow-y-auto bg-slate-950 p-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Asset Library</h3>
                    {/* Humans */}
                    <div className="mb-6">
                        <h4 className="text-[10px] uppercase text-slate-600 font-bold mb-2">Humans</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(HumanPosture).map((posture, i) => (
                                <button key={posture} className="aspect-square bg-slate-900 border border-slate-800 rounded hover:border-indigo-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 group" onClick={() => handleAddGlyph(posture)}>
                                    <div className="w-8 h-8 group-hover:bg-indigo-400 transition-colors flex items-center justify-center p-1">
                                        {POSTURE_COMPONENTS[posture] && React.createElement(POSTURE_COMPONENTS[posture], { width: '100%', height: '100%', fill: 'currentColor', className: 'text-slate-500 group-hover:text-indigo-300' })}
                                    </div>
                                    <span className="text-[8px] text-slate-500 group-hover:text-indigo-300">{i + 1}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Shapes */}
                    <div>
                        <h4 className="text-[10px] uppercase text-slate-600 font-bold mb-2">Shapes</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(PRIMITIVE_ASSETS).map((typeKey) => {
                                const type = typeKey as PrimitiveType;
                                const PrimitiveComponent = PrimitiveComponents[type];
                                if (!PrimitiveComponent) return null;
                                return (
                                    <button key={type} className="aspect-square bg-slate-900 border border-slate-800 rounded hover:border-blue-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 group" onClick={() => handleAddShape(type)}>
                                        <div className="w-8 h-8 flex items-center justify-center relative"><div className="absolute inset-0 pointer-events-none text-slate-500 group-hover:text-blue-400"><PrimitiveComponent size={3} position={[0.5, 0.5]} rotation={0} fillColor="currentColor" opacity={1} preview={true} /></div></div>
                                        <span className="text-[8px] text-slate-500 group-hover:text-blue-300 truncate w-full px-1">{type}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: AUDIO MANAGER (NEW) */}
            {activeTab === 'audio' && (
                <div className="flex-1 overflow-y-auto bg-slate-950 p-4 space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Audio Manager</h3>

                    {/* Background Music */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-indigo-400 font-medium text-sm">
                            <Music size={16} /> Background Music
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Source URL</label>
                                <input
                                    type="text"
                                    value={safeAudio.bgmUrl}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, bgmUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-600 mt-1">Paste a linking URL.</p>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Volume ({Math.round(safeAudio.bgmVolume * 100)}%)</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={safeAudio.bgmVolume}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, bgmVolume: parseFloat(e.target.value) })}
                                    className="w-full accent-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Narration */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-sm">
                            <Mic size={16} /> Voice / Narration
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Source URL</label>
                                <input
                                    type="text"
                                    value={safeAudio.narrationUrl}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, narrationUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-300 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Volume ({Math.round(safeAudio.narrationVolume * 100)}%)</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={safeAudio.narrationVolume}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, narrationVolume: parseFloat(e.target.value) })}
                                    className="w-full accent-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sound Effects */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
                                <Volume2 size={16} /> Sound Effects
                            </div>
                            <input
                                type="checkbox"
                                checked={safeAudio.enableSfx}
                                onChange={(e) => onUpdateAudio({ ...safeAudio, enableSfx: e.target.checked })}
                                className="accent-blue-500"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className={safeAudio.enableSfx ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Effect URL</label>
                                <input
                                    type="text"
                                    value={safeAudio.sfxUrl || ''}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, sfxUrl: e.target.value })}
                                    placeholder="e.g. /audio/clank.mp3"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-300 focus:border-blue-500 outline-none mb-2"
                                />
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Volume ({Math.round(safeAudio.sfxVolume * 100)}%)</label>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={safeAudio.sfxVolume}
                                    onChange={(e) => onUpdateAudio({ ...safeAudio, sfxVolume: parseFloat(e.target.value) })}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
