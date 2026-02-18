import React, { useRef, useState, useEffect } from 'react';
import { Move, Maximize, Trash2, Lock, Unlock } from 'lucide-react';
import type { VectorRow } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition } from '../types';

interface DraggableCanvasProps {
    activeRow: VectorRow | null;
    selection: { type: 'glyph' | 'shape' | 'text', index: number } | null;
    onUpdateRow: (updates: Partial<VectorRow>) => void;

    onSelect: (selection: { type: 'glyph' | 'shape' | 'text', index: number } | null) => void;
    showTextLayer: boolean;
}

const DraggableCanvas: React.FC<DraggableCanvasProps> = ({ activeRow, selection, onUpdateRow, onSelect, showTextLayer }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // Measure container size on mount and resize
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        // Initial measure
        updateSize();

        // Measure again after a short delay to ensure layout is stable
        setTimeout(updateSize, 100);

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    if (!activeRow) return null;

    // Helper: Convert % to pixels based on CURRENT measured size
    const toPx = (pct: number, dim: number) => pct * dim;
    // Helper: Convert pixels to %
    const toPct = (px: number, dim: number) => Number((px / dim).toFixed(4));

    const handleMouseDown = (e: React.MouseEvent, type: 'glyph' | 'shape' | 'text', index: number) => {
        e.stopPropagation();

        if (type === 'text') {
            const isLocked = activeRow.textConfig?.isLocked ?? true;
            onSelect({ type, index });
            if (!isLocked) {
                setDraggingId(`${type}-${index}`);
            }
            return;
        }

        setDraggingId(`${type}-${index}`);
        onSelect({ type, index });
    };

    // Deselect background click
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            onSelect(null);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selection || !activeRow) return;

        const { type, index } = selection;

        if (type === 'glyph') {
            const newGlyphs = activeRow.glyphs.filter((_, i) => i !== index);
            onUpdateRow({ glyphs: newGlyphs });
        } else if (type === 'shape') {
            const newShapes = activeRow.shapes.filter((_, i) => i !== index);
            onUpdateRow({ shapes: newShapes });
        }

        onSelect(null);
    };

    useEffect(() => {
        if (!draggingId) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !activeRow) return;

            // Re-measure on drag start to be safe, or just use current rect from ref
            const rect = containerRef.current.getBoundingClientRect();

            // Mouse relative to container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Clamp to bounds
            const clampedX = Math.max(0, Math.min(x, rect.width));
            const clampedY = Math.max(0, Math.min(y, rect.height));

            const newX = toPct(clampedX, rect.width);
            const newY = toPct(clampedY, rect.height);

            const [type, indexStr] = draggingId.split('-');
            const index = parseInt(indexStr);

            if (type === 'glyph') {
                const parts = draggingId.split('-');
                // parts could be ['glyph', '0'] or ['glyph', '0', 'wp', '1']

                const glyphIndex = parseInt(parts[1]);
                const newGlyphs = [...activeRow.glyphs];

                if (newGlyphs[glyphIndex]) {
                    if (parts.length > 2 && parts[2] === 'wp') {
                        // Dragging a Waypoint
                        const wpIndex = parseInt(parts[3]);
                        const waypoints = [...(newGlyphs[glyphIndex].waypoints || [])];
                        if (waypoints[wpIndex]) {
                            waypoints[wpIndex] = { ...waypoints[wpIndex], x: newX, y: newY };
                            newGlyphs[glyphIndex] = { ...newGlyphs[glyphIndex], waypoints };
                            onUpdateRow({ glyphs: newGlyphs });
                        }
                    } else {
                        // Dragging the Main Glyph (Start Point)
                        newGlyphs[glyphIndex] = { ...newGlyphs[glyphIndex], position: [newX, newY] };
                        onUpdateRow({ glyphs: newGlyphs });
                    }
                }
            } else if (type === 'shape') {
                const newShapes = [...activeRow.shapes];
                if (newShapes[index]) {
                    newShapes[index] = { ...newShapes[index], position: [newX, newY] };
                    onUpdateRow({ shapes: newShapes });
                }
            } else if (type === 'text') {
                const textConfig = activeRow.textConfig || {
                    position: [0.5, 0.5],
                    motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn }
                };
                onUpdateRow({
                    textConfig: {
                        ...textConfig,
                        position: [newX, newY]
                    }
                });
            }
        };

        const handleMouseUp = () => {
            setDraggingId(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId, activeRow, onUpdateRow]);


    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-50 w-full h-full"
            onMouseDown={handleBackgroundClick}
        >
            <div className="absolute top-4 left-4 flex gap-2">


                {selection && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-auto flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={12} />
                        DELETE SELECTED
                    </button>
                )}
            </div>

            {/* Render Shape Handles */}
            {activeRow.shapes.map((shape, i) => {
                const isSelected = selection?.type === 'shape' && selection.index === i;
                return (
                    <div
                        key={`shape-handle-${i}`}
                        className="absolute pointer-events-auto cursor-move group"
                        style={{
                            left: toPx(shape.position[0], dimensions.width),
                            top: toPx(shape.position[1], dimensions.height),

                            opacity: dimensions.width > 0 ? 1 : 0,
                            zIndex: isSelected ? 20 : 10
                        }}
                        onMouseDown={(e) => handleMouseDown(e, 'shape', i)}
                    >
                        {/* Visual Handle - Offset to not cover center - Moved further out */}
                        <div className={`absolute -top-10 -right-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm backdrop-blur-sm ${isSelected
                            ? 'border-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] scale-110'
                            : 'border-blue-400 bg-blue-500/30 hover:bg-blue-500/50 hover:scale-110'
                            }`}>
                            <Maximize size={10} className={isSelected ? "text-white" : "text-blue-200"} />
                        </div>

                        {/* Bounding Box to show selection area */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed rounded-lg pointer-events-none transition-opacity ${isSelected ? 'border-blue-400 opacity-60' : 'border-transparent opacity-0 group-hover:opacity-30 border-blue-300'}`} />
                        {/* Label */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/70 text-blue-200 text-[10px] px-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                            {shape.type}
                        </div>
                    </div>
                );
            })}

            {activeRow.textSync && showTextLayer && (
                <div
                    className={`absolute pointer-events-auto group flex items-center justify-center ${(activeRow.textConfig?.isLocked ?? true) ? 'cursor-pointer' : 'cursor-move'}`}
                    style={{
                        left: toPx(activeRow.textConfig?.position[0] ?? 0.5, dimensions.width),
                        top: toPx(activeRow.textConfig?.position[1] ?? 0, dimensions.height), // Start near top if undefined
                        zIndex: selection?.type === 'text' ? 50 : 30,
                        transform: 'translate(-50%, -50%)',
                        // Render a placeholder box for the text
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'text', 0)}
                >
                    {/* Lock/Unlock Control */}
                    <button
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const currentConfig = activeRow.textConfig || {
                                position: [0.5, 0.5],
                                motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn },
                                isLocked: true
                            };
                            onUpdateRow({
                                textConfig: {
                                    ...currentConfig,
                                    isLocked: !(currentConfig.isLocked ?? true)
                                }
                            });
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all z-50 shadow-sm border ${(activeRow.textConfig?.isLocked ?? true)
                            ? 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700 hover:text-white'
                            : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500'
                            } ${selection?.type === 'text' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        title={(activeRow.textConfig?.isLocked ?? true) ? "Unlock Position" : "Lock Position"}
                    >
                        {(activeRow.textConfig?.isLocked ?? true) ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>

                    {/* Text content preview */}
                    <div className={`
                        p-4 rounded-lg border-2 transition-all 
                        ${selection?.type === 'text'
                            ? 'border-white bg-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                            : 'border-dashed border-slate-600 hover:border-indigo-400 bg-slate-900/10 hover:bg-slate-900/50'
                        }
                    `}>
                        <div className="text-xs font-mono text-slate-400 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis pointer-events-none">
                            {activeRow.textSync}
                        </div>
                        {selection?.type === 'text' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Stanza
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Render Glyph Handles */}
            {activeRow.glyphs.map((glyph, i) => {
                const isSelected = selection?.type === 'glyph' && selection.index === i;
                const waypoints = glyph.waypoints || [];

                return (
                    <React.Fragment key={`glyph-group-${i}`}>
                        {/* PATH & GHOSTS (Only if selected) */}
                        {isSelected && waypoints.length > 0 && (
                            <>
                                {/* Connector Line */}
                                <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 15 }}>
                                    <polyline
                                        points={[
                                            [toPx(glyph.position[0], dimensions.width), toPx(glyph.position[1], dimensions.height)],
                                            ...waypoints.map(wp => [toPx(wp.x, dimensions.width), toPx(wp.y, dimensions.height)])
                                        ].map(pt => pt.join(',')).join(' ')}
                                        fill="none"
                                        stroke={glyph.faceColor || '#10b981'}
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        className="opacity-50"
                                    />
                                </svg>

                                {/* Ghost Waypoint Handles */}
                                {waypoints.map((wp, wpIndex) => (
                                    <div
                                        key={`wp-${i}-${wpIndex}`}
                                        className="absolute pointer-events-auto cursor-move group z-20"
                                        style={{
                                            left: toPx(wp.x, dimensions.width),
                                            top: toPx(wp.y, dimensions.height),
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            // Set ID as: type-index-subtype-subindex
                                            // Here: "glyph-{i}-wp-{wpIndex}"
                                            setDraggingId(`glyph-${i}-wp-${wpIndex}`);
                                        }}
                                    >
                                        <div className="w-4 h-4 rounded-full border border-white bg-slate-900/80 shadow-sm flex items-center justify-center relative hover:scale-125 transition-transform group-hover:border-indigo-400">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: glyph.faceColor || '#10b981' }} />

                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-black/90 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-slate-700">
                                                {wp.time}s • {wp.movement}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Main Glyph Handle */}
                        <div
                            className="absolute pointer-events-auto cursor-move group"
                            style={{
                                left: toPx(glyph.position[0], dimensions.width),
                                top: toPx(glyph.position[1], dimensions.height),
                                opacity: dimensions.width > 0 ? 1 : 0,
                                zIndex: isSelected ? 20 : 10
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'glyph', i)}
                        >
                            {/* Visual Handle - Offset */}
                            <div
                                className={`absolute -top-6 -right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-sm backdrop-blur-sm ${isSelected
                                    ? 'border-white shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-110 z-30'
                                    : 'border-emerald-400 bg-emerald-500/30 hover:bg-emerald-500/50 hover:scale-110'
                                    }`}
                                style={{
                                    borderColor: isSelected ? '#fff' : (glyph.faceColor || '#10b981'),
                                    backgroundColor: isSelected ? glyph.faceColor : undefined
                                }}
                            >
                                <span className={`font-bold text-[10px] ${isSelected ? 'text-white' : 'text-emerald-100'}`}>{glyph.count}</span>
                                {isSelected && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white bg-black/50 px-1 rounded whitespace-nowrap">Start (0s)</span>}
                            </div>

                            {/* Bounding Box */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-32 border-2 border-dashed rounded-lg pointer-events-none transition-opacity ${isSelected ? 'border-emerald-400 opacity-60' : 'border-transparent opacity-0 group-hover:opacity-30 border-emerald-300'}`} />

                            {/* Label */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/70 text-emerald-200 text-[10px] px-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                {glyph.posture}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
            {/* Directions / Notes (Edit Mode Only - Bottom Left) */}

        </div>
    );
};


export default DraggableCanvas;
