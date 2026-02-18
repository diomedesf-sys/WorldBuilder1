import React from 'react';
import type { SavedGlyph } from '../types';
import { Grid3X3 } from 'lucide-react';

interface ThumbnailViewProps {
    savedGlyphs?: SavedGlyph[];
    onInsertGlyph?: (glyph: SavedGlyph) => void;
}

const ThumbnailView: React.FC<ThumbnailViewProps> = ({ savedGlyphs = [], onInsertGlyph }) => {

    const handleDragStart = (e: React.DragEvent, glyph: SavedGlyph) => {
        e.dataTransfer.setData('application/json', JSON.stringify(glyph));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="h-full bg-slate-900/50 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center gap-2 text-amber-200 mb-2">
                <Grid3X3 size={20} />
                <h2 className="text-lg font-light tracking-wide">Glyph Library</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {savedGlyphs.length === 0 ? (
                    <div className="text-sm text-slate-500 italic text-center py-10 border border-dashed border-slate-800 rounded-xl">
                        No saved glyphs.<br />Save from Storyboard.
                    </div>
                ) : (
                    savedGlyphs.map((glyph) => (
                        <div
                            key={glyph.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, glyph)}
                            className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:bg-slate-900 transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{glyph.name}</span>
                                {onInsertGlyph && (
                                    <button
                                        onClick={() => onInsertGlyph(glyph)}
                                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Insert
                                    </button>
                                )}
                            </div>

                            {/* Mini Preview */}
                            <div className="grid grid-cols-2 gap-1 mb-2">
                                <div className="text-[10px] text-slate-500 bg-slate-900 rounded px-1 py-0.5">
                                    {glyph.glyphs.length} Glyphs
                                </div>
                                <div className="text-[10px] text-slate-500 bg-slate-900 rounded px-1 py-0.5">
                                    {glyph.shapes.length} Shapes
                                </div>
                            </div>

                            <div className="h-16 bg-black/50 rounded flex items-center justify-center relative overflow-hidden">
                                {/* Abstract Geometric Preview */}
                                {glyph.shapes.map((s, i) => (
                                    <div
                                        key={i}
                                        className="absolute border border-slate-600/50 rounded-full"
                                        style={{
                                            width: s.size * 4,
                                            height: s.size * 4,
                                            left: `${s.position[0] * 100}%`,
                                            top: `${s.position[1] * 100}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                ))}
                                <div className="text-xs text-slate-600 font-mono">PREVIEW</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ThumbnailView;
