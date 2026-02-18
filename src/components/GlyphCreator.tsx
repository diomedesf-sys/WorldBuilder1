import React, { useState, useRef, useEffect } from 'react';
import {
    PenTool, Save, Trash2, User, Circle, Square, Triangle,
    Minus, Activity, RectangleHorizontal, Target, Spline,
    ChevronDown, Type
} from 'lucide-react';
import DraggableCanvas from './DraggableCanvas';
import { PrimitiveType, GlyphVerb, MotionSpeed, SizeLevel, HumanPosture, SetupTransition } from '../types';
import type { VectorRow, SavedGlyph } from '../types';
import { PRIMITIVES } from './primitives/GlyphPrimitives';
import { GlyphPerson } from './GlyphPerson';

interface GlyphCreatorProps {
    onClose?: () => void;
}

const STORAGE_KEY = 'world-builder-glyph-library';

const GlyphCreator: React.FC<GlyphCreatorProps> = ({ onClose }) => {
    const [name, setName] = useState('My Custom Glyph');
    const [draftRow, setDraftRow] = useState<VectorRow>({
        beatId: 'draft',
        timeStart: '0:00',
        duration: 5,
        glyphs: [],
        shapes: [],
        compositionRule: 'Manual',
        motion: {
            verb: GlyphVerb.Static,
            speed: MotionSpeed.Normal,
            transition: SetupTransition.None,
            easing: 'linear'
        },
        textSync: '',
    });

    const [selection, setSelection] = useState<{ type: 'glyph' | 'shape' | 'text', index: number } | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeLevel>(SizeLevel.M);

    // UI States
    const [showHumanMenu, setShowHumanMenu] = useState(false);
    const [showSizeMenu, setShowSizeMenu] = useState(false);

    const handleSave = () => {
        if (!name.trim()) return;

        const savedPresets = localStorage.getItem(STORAGE_KEY);
        let presets: SavedGlyph[] = [];
        try {
            if (savedPresets) {
                presets = JSON.parse(savedPresets);
                if (!Array.isArray(presets)) presets = [];
            }
        } catch (e) {
            console.error(e);
        }

        const newPreset: SavedGlyph = {
            id: `custom-${Date.now()}`,
            name: name,
            glyphs: draftRow.glyphs,
            shapes: draftRow.shapes,
            motion: {
                verb: draftRow.motion.verb,
                speed: draftRow.motion.speed,
                transition: draftRow.motion.transition
            },
            compositionRule: draftRow.compositionRule
        };

        const updated = [...presets, newPreset];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Notify
        window.dispatchEvent(new Event('glyph-library-update'));

        // Flash feedback or logs
        console.log('Saved preset:', newPreset);

        if (onClose) onClose();
    };

    const addGlyph = (posture: HumanPosture) => {
        setDraftRow(prev => ({
            ...prev,
            glyphs: [...prev.glyphs, {
                count: 1,
                posture: posture,
                position: [0.5, 0.5],
                size: selectedSize,
                faceColor: '#ffffff'
            }]
        }));
        setShowHumanMenu(false);
    };

    const addShape = (type: PrimitiveType) => {
        setDraftRow(prev => ({
            ...prev,
            shapes: [...prev.shapes, {
                type,
                function: 'Decoration',
                position: [0.5, 0.5],
                size: selectedSize,
                rotation: 0
            }]
        }));
    };

    const clearCanvas = () => {
        setDraftRow(prev => ({ ...prev, glyphs: [], shapes: [] }));
        setSelection(null);
    };

    // Helper to render the static visual layer (under handles)
    const renderVisualLayer = () => {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Shapes */}
                {draftRow.shapes.map((shape, i) => {
                    const ShapeComponent = PRIMITIVES[shape.type];
                    if (!ShapeComponent) return null;

                    return (
                        <div
                            key={`shape-vis-${i}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${shape.position[0] * 100}%`,
                                top: `${shape.position[1] * 100}%`,
                                width: '100px', // Base size, component handles scaling via props or we scale here
                                height: '100px',
                                opacity: 1
                            }}
                        >
                            <ShapeComponent
                                size={shape.size}
                                position={[0.5, 0.5]} // Centered in the container div we just positioned
                                rotation={shape.rotation}
                                fill="transparent" // Primitives usually stroke? Or fill? 
                                opacity={1}
                                // If components rely on exact props:
                                {...shape} // Pass everything
                            />
                        </div>
                    );
                })}

                {/* Glyphs */}
                {draftRow.glyphs.map((glyph, i) => (
                    <div
                        key={`glyph-vis-${i}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${glyph.position[0] * 100}%`,
                            top: `${glyph.position[1] * 100}%`,
                        }}
                    >
                        <GlyphPerson
                            posture={glyph.posture}
                            size={glyph.size}
                            faceColor={glyph.faceColor}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const humanPostures = [
        HumanPosture.Posture1, HumanPosture.Posture2, HumanPosture.Posture3,
        HumanPosture.Posture4, HumanPosture.Posture5, HumanPosture.Posture6,
        HumanPosture.Posture7, HumanPosture.Posture8, HumanPosture.Posture9
    ];

    return (
        <div className="w-[450px] h-[550px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950">
                <div className="flex items-center gap-2 text-indigo-400">
                    <PenTool size={16} />
                    <span className="font-bold text-sm">Glyph Studio</span>
                </div>
                <div className="flex gap-2">
                    <input
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-32 outline-none focus:border-indigo-500"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Preset Name"
                    />
                    <button onClick={handleSave} className="p-1 hover:bg-slate-800 rounded text-emerald-400" title="Save">
                        <Save size={16} />
                    </button>
                    <button onClick={clearCanvas} className="p-1 hover:bg-slate-800 rounded text-red-400" title="Clear">
                        <Trash2 size={16} />
                    </button>
                    {onClose && (
                        <div className='w-px h-4 bg-slate-800 mx-1' />
                    )}
                    {onClose && (
                        <button onClick={onClose} className="text-slate-500 hover:text-white text-[10px] uppercase">
                            Close
                        </button>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="h-12 border-b border-slate-800 flex items-center px-2 gap-2 bg-slate-900 overflow-visible relative z-50">
                {/* Human Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowHumanMenu(!showHumanMenu)}
                        className={`p-1.5 rounded flex items-center gap-1 transition-colors ${showHumanMenu ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                        title="Add Human"
                    >
                        <User size={18} />
                        <ChevronDown size={12} />
                    </button>

                    {showHumanMenu && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl grid grid-cols-3 gap-1 p-2 z-50">
                            {humanPostures.map((posture, idx) => (
                                <button
                                    key={posture}
                                    onClick={() => addGlyph(posture)}
                                    className="aspect-square flex flex-col items-center justify-center hover:bg-slate-800 rounded text-slate-300 hover:text-white text-[10px] border border-transparent hover:border-slate-600"
                                    title={posture}
                                >
                                    <User size={16} />
                                    <span className="scale-75">{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-slate-800" />

                {/* Primitives */}
                <div className="flex items-center gap-1">
                    <button onClick={() => addShape(PrimitiveType.Circle)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Circle"><Circle size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Square)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Square"><Square size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Triangle)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Triangle"><Triangle size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Line)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Line"><Minus size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.DoubleCurve)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="DoubleCurve"><Activity size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Curve)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Curve"><Spline size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Rectangle)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Rectangle"><RectangleHorizontal size={18} /></button>
                    <button onClick={() => addShape(PrimitiveType.Concentric)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Concentric"><Target size={18} /></button>
                </div>

                <div className="w-px h-6 bg-slate-800 flex-1 ml-2" />

                {/* Size Dropdown */}
                <div className="relative ml-auto">
                    <button
                        onClick={() => setShowSizeMenu(!showSizeMenu)}
                        className={`px-2 py-1.5 rounded flex items-center gap-1 transition-colors border ${showSizeMenu ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                        title="Size"
                    >
                        <span className="text-xs font-mono w-4 text-center">{Object.keys(SizeLevel).find(key => SizeLevel[key as any] === selectedSize)}</span>
                        <ChevronDown size={12} />
                    </button>

                    {showSizeMenu && (
                        <div className="absolute top-full right-0 mt-2 w-20 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex flex-col py-1 z-50">
                            {[SizeLevel.S, SizeLevel.M, SizeLevel.L, SizeLevel.XL, SizeLevel.XXL, SizeLevel.XXXL].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setShowSizeMenu(false); }}
                                    className={`px-3 py-1.5 text-xs text-left hover:bg-slate-800 ${selectedSize === size ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
                                >
                                    {Object.keys(SizeLevel).find(key => SizeLevel[key as any] === size)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-black relative overflow-hidden group">
                {/* Visual Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* VISUAL RENDER LAYER (Underneath interactions) */}
                {renderVisualLayer()}

                {/* INTERACTION LAYER */}
                <DraggableCanvas
                    activeRow={draftRow}
                    selection={selection}
                    onUpdateRow={(updates) => setDraftRow(prev => ({ ...prev, ...updates }))}
                    onSelect={setSelection}
                    showTextLayer={false}
                />

                {/* Empty State Hint */}
                {draftRow.glyphs.length === 0 && draftRow.shapes.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                        <PenTool size={32} className="mb-2 opacity-50" />
                        <p className="text-xs">Select a tool above to start</p>
                    </div>
                )}
            </div>

            {/* Footer Status */}
            <div className="h-6 bg-slate-950 border-t border-slate-800 flex items-center px-3 justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                    {draftRow.glyphs.length} Glyphs • {draftRow.shapes.length} Shapes
                </span>
                <span className="text-[10px] text-slate-600">
                    Draft Mode • Size: {Object.keys(SizeLevel).find(key => SizeLevel[key as any] === selectedSize)}
                </span>
            </div>

            {/* Backdrop for menus */}
            {(showHumanMenu || showSizeMenu) && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => { setShowHumanMenu(false); setShowSizeMenu(false); }} />
            )}
        </div>
    );
};

export default GlyphCreator;
