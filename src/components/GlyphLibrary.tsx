import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, Plus, X, LayoutGrid, Trash2 } from 'lucide-react';
import { PrimitiveType, GlyphVerb, MotionSpeed, SizeLevel, HumanPosture, SetupTransition } from '../types';
import type { VectorRow, SavedGlyph, GlyphState, ShapeState } from '../types';

interface GlyphLibraryProps {
    onSelect: (preset: SavedGlyph) => void;
    currentVectorRow?: VectorRow; // Pass this to allow saving the current selection
}

const STORAGE_KEY = 'world-builder-glyph-library';

// Default presets adapted to new SavedGlyph structure (arrays)
const DEFAULTS: SavedGlyph[] = [
    {
        id: 'default-1',
        name: 'Creation Spark',
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture1,
            position: [50, 50],
            size: SizeLevel.M,
            faceColor: '#ffffff'
        }],
        shapes: [{
            type: PrimitiveType.Circle,
            function: 'Halo',
            position: [50, 50],
            size: SizeLevel.M,
            rotation: 0
        }],
        motion: { // Using simplified motion for presets
            verb: GlyphVerb.Pulse,
            speed: MotionSpeed.Normal,
            transition: SetupTransition.FadeIn
        },
        compositionRule: 'Center'
    },
    {
        id: 'default-2',
        name: 'Horizon Line',
        glyphs: [],
        shapes: [{
            type: PrimitiveType.Line,
            function: 'Horizon',
            position: [50, 50],
            size: SizeLevel.L,
            rotation: 0
        }],
        motion: {
            verb: GlyphVerb.Emerge,
            speed: MotionSpeed.Normal,
            transition: SetupTransition.SlideIn
        },
        compositionRule: 'Golden Ratio'
    },
    {
        id: 'default-3',
        name: 'Chaos Swarm',
        glyphs: [{
            count: 5,
            posture: HumanPosture.Posture4, // Falling
            position: [50, 50],
            size: SizeLevel.S,
            faceColor: '#ffffff'
        }],
        shapes: [{
            type: PrimitiveType.Triangle,
            function: 'Scattered',
            position: [50, 50],
            size: SizeLevel.S,
            rotation: 45
        }],
        motion: { // Using simplified motion for presets
            verb: GlyphVerb.Oscillate,
            speed: MotionSpeed.Fast,
            transition: SetupTransition.PopIn
        },
        compositionRule: 'Random'
    }
];

const GlyphLibrary: React.FC<GlyphLibraryProps> = ({ onSelect, currentVectorRow }) => {
    const [presets, setPresets] = useState<SavedGlyph[]>(DEFAULTS);
    const [isOpen, setIsOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    const loadPresets = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Basic migration check: if item has 'glyphCount' (old prop), ignore or migrate.
                // For now, let's filter out incompatible ones or try to adapt.
                // Assuming we just filter for valid SavedGlyph structure (has 'glyphs' array).
                const validCustom = parsed.filter((p: any) => Array.isArray(p.glyphs));

                // Ensure no ID collisions
                const uniqueSaved = validCustom.filter((p: SavedGlyph) => !DEFAULTS.some(d => d.id === p.id));
                setPresets([...DEFAULTS, ...uniqueSaved]);
            } catch (e) {
                console.error("Failed to load presets", e);
            }
        }
    };

    useEffect(() => {
        loadPresets();

        // Listen for updates from GlyphCreator
        const handleUpdate = () => loadPresets();
        window.addEventListener('glyph-library-update', handleUpdate);
        return () => window.removeEventListener('glyph-library-update', handleUpdate);
    }, []);

    const saveCurrent = () => {
        if (!currentVectorRow || !saveName.trim()) return;

        const newPreset: SavedGlyph = {
            id: `custom-${Date.now()}`,
            name: saveName,
            glyphs: currentVectorRow.glyphs,
            shapes: currentVectorRow.shapes,
            motion: {
                verb: currentVectorRow.motion.verb,
                speed: currentVectorRow.motion.speed,
                transition: currentVectorRow.motion.transition
            },
            compositionRule: currentVectorRow.compositionRule
        };

        const customPresets = presets.filter(p => !p.id.startsWith('default-'));
        const updated = [...customPresets, newPreset];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setPresets([...DEFAULTS, ...updated]);
        setSaveName('');

        // Notify others
        window.dispatchEvent(new Event('glyph-library-update'));
    };

    const deletePreset = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (id.startsWith('default-')) return;

        const customPresets = presets.filter(p => !p.id.startsWith('default-') && p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
        setPresets([...DEFAULTS, ...customPresets]);

        // Notify others
        window.dispatchEvent(new Event('glyph-library-update'));
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${isOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
                <LayoutGrid size={16} />
                <span>Glyph Library</span>
            </button>

            {/* Full Screen Overlay Modal - Portalled to Body */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[85vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <LayoutGrid className="text-indigo-400" />
                                    Glyph Library
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">Select a preset to apply it to your scene immediately.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Area */}

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30">

                            {/* Save New Section */}
                            {currentVectorRow && (
                                <div className="mb-8 bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wide">Save Current Scene as Preset</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none text-white focus:border-indigo-500 transition-colors placeholder-slate-600"
                                                placeholder="Name your custom preset..."
                                                value={saveName}
                                                onChange={e => setSaveName(e.target.value)}
                                            />
                                            <button
                                                onClick={saveCurrent}
                                                disabled={!saveName.trim()}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 font-medium flex items-center gap-2 transition-colors"
                                            >
                                                <Plus size={16} />
                                                Save Preset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preset Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {presets.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            onSelect(p);
                                        }}
                                        className="relative group text-left p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 hover:shadow-lg transition-all duration-200 flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-lg text-slate-200 group-hover:text-white">{p.name}</div>
                                            {!p.id.startsWith('default-') && (
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => deletePreset(p.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete Preset"
                                                >
                                                    <Trash2 size={14} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-400 font-mono">
                                                {p.glyphs.length} Glyphs
                                            </span>
                                            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-400 font-mono">
                                                {p.shapes.length} Shapes
                                            </span>
                                            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-400 font-mono">
                                                {p.motion.verb}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center text-xs text-slate-500">
                            Click anywhere outside to close • Selected presets apply instantly
                        </div>
                    </div>

                    {/* Backdrop Click to Close */}
                    <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
                </div>,
                document.body
            )}
        </>
    );
};

export default GlyphLibrary;
