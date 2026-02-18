import React, { useState } from 'react';
import { Trash2, Move, Video, X, Copy, RotateCw } from 'lucide-react';
import { GlyphVerb, MotionSpeed, SetupTransition, HumanPosture, SizeLevel, PrimitiveType } from '../types';
import type { VectorRow } from '../types';

import PreviewPlayer from '../components/PreviewPlayer';
import { PNSCircle } from '../components/primitives';

interface VectorTableViewProps {
    rows: VectorRow[];
    onUpdateRow: (index: number, updates: Partial<VectorRow>) => void;
    onAddRow: () => void;
    onDeleteRow: (id: string, index: number) => void;
    onBeatClick?: (beatId: string) => void;
}

const VectorTableView: React.FC<VectorTableViewProps> = ({ rows, onUpdateRow, onDeleteRow, onBeatClick }) => {
    const [showPreview, setShowPreview] = useState(false);

    // --- Helper Functions ---
    // (Existing helper functions remain unchanged, ensuring they are preserved)
    const updateGlyph = (rowIndex: number, glyphIndex: number, field: keyof VectorRow['glyphs'][0], value: any) => {
        const currentGlyphs = rows[rowIndex].glyphs;
        const newGlyphs = [...currentGlyphs];
        // Ensure glyph exists
        if (!newGlyphs[glyphIndex]) {
            newGlyphs[glyphIndex] = {
                count: 1,
                posture: HumanPosture.Equilibrium,
                position: [0.5, 0.5],
                size: SizeLevel.M,
                faceColor: '#FFFFFF'
            };
        }
        newGlyphs[glyphIndex] = { ...newGlyphs[glyphIndex], [field]: value };
        onUpdateRow(rowIndex, { glyphs: newGlyphs });
    };

    const updateShape = (rowIndex: number, shapeIndex: number, field: keyof VectorRow['shapes'][0], value: any) => {
        const currentShapes = rows[rowIndex].shapes;
        const newShapes = [...currentShapes];
        if (!newShapes[shapeIndex]) newShapes[shapeIndex] = {
            type: PrimitiveType.Circle,
            function: 'Halo',
            position: [0.5, 0.5],
            size: SizeLevel.M,
            rotation: 0
        };
        newShapes[shapeIndex] = { ...newShapes[shapeIndex], [field]: value };
        onUpdateRow(rowIndex, { shapes: newShapes });
    };

    const updateMotion = (rowIndex: number, field: keyof VectorRow['motion'], value: any) => {
        const currentMotion = rows[rowIndex].motion;
        onUpdateRow(rowIndex, { motion: { ...currentMotion, [field]: value } });
    };

    const handleExportVideo = () => {
        // In a real app, this would trigger a backend process
        const command = "npx tsx src/scripts/render.ts video";
        console.log(`To export video, run: ${command}`);
        alert(`Export started! \n(Simulation)\nIn a real build pipeline, this would run: \n${command}\n\nFor now, check the console for the row data JSON.`);
        console.log("Current Rows Data:", JSON.stringify(rows, null, 2));
    };

    const handleExportStills = () => {
        const command = "npx tsx src/scripts/render.ts stills";
        console.log(`To export stills, run: ${command}`);
        alert(`Export Stills started! \n(Simulation)\nIn a real build pipeline, this would run: \n${command}`);
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800/50 shadow-2xl p-6 h-full flex flex-col relative overflow-hidden">

            {/* Header with Preview Button */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg relative overflow-hidden">
                        <Move className="text-emerald-400 relative z-10" size={24} />
                        {/* TEST GLYPH: Circle size 3 at center */}
                        <div className="absolute inset-0 opacity-50 pointer-events-none">
                            <PNSCircle size={3} position={[0.5, 0.5]} rotation={0} fillColor="#10b981" opacity={0.5} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-light text-slate-100 tracking-wide flex items-center gap-2">
                            Part 2: Vector Table
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700">SVG INTEGRATED</span>
                        </h2>
                        <div className="text-xs text-slate-500 font-mono mt-1">ANIMATION PRINCIPLES & MOTION</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {showPreview && (
                        <>
                            <button
                                onClick={handleExportStills}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700"
                            >
                                <Copy size={16} />
                                <span className="text-sm">Export Stills</span>
                            </button>
                            <button
                                onClick={handleExportVideo}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700"
                            >
                                <Video size={16} />
                                <span className="text-sm">Export MP4</span>
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Video size={18} />
                        <span className="font-medium">Generate / Preview Remotion</span>
                    </button>

                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl flex flex-col shadow-2xl overflow-hidden max-h-full">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
                            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                                <Video size={18} className="text-indigo-400" />
                                Sequence Preview
                            </h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 bg-slate-950 flex-1 overflow-auto flex justify-center items-center">
                            <PreviewPlayer rows={rows} autoPlay={true} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-auto rounded-lg border border-slate-800/50 bg-slate-950/30 relative custom-scrollbar">
                {/* Table Content (Existing) */}
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-950 z-20 shadow-md">
                        <tr>
                            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-12 text-center">Beat</th>
                            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-24">Timing</th>
                            <th className="p-3 text-xs font-semibold text-rose-400/80 uppercase tracking-wider border-b border-slate-800 bg-rose-500/5 border-l border-rose-900/30 w-32 text-center">Audio</th>
                            <th className="p-3 text-xs font-semibold text-emerald-400/80 uppercase tracking-wider border-b border-slate-800 bg-emerald-500/5 border-l border-emerald-900/30 text-center" colSpan={5}>Glyphs</th>
                            <th className="p-3 text-xs font-semibold text-blue-400/80 uppercase tracking-wider border-b border-slate-800 bg-blue-500/5 border-l border-blue-900/30 text-center" colSpan={4}>Shapes / Primitives</th>
                            <th className="p-3 text-xs font-semibold text-purple-400/80 uppercase tracking-wider border-b border-slate-800 bg-purple-500/5 border-l border-purple-900/30 text-center" colSpan={4}>Motion / Composition</th>
                            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Context</th>
                            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 w-10"></th>
                        </tr>
                        {/* Sub-headers for grouped columns could go here if needed for more clarity */}
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {rows.map((row, i) => (
                            <tr key={row.beatId || i} className="group hover:bg-white/[0.02] transition-colors">
                                <td
                                    className="p-3 text-center font-mono text-slate-500 text-sm cursor-pointer hover:text-indigo-400 hover:bg-indigo-900/20 transition-colors"
                                    onClick={() => onBeatClick && onBeatClick(row.beatId)}
                                    title="Jump to Beat in Preview"
                                >
                                    {row.beatId || i + 1}
                                </td>
                                <td className="p-2">
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="text"
                                            value={row.timeStart}
                                            onChange={(e) => onUpdateRow(i, { timeStart: e.target.value })}
                                            className="bg-transparent w-16 text-xs text-slate-400 font-mono text-center focus:text-white outline-none border-b border-transparent focus:border-indigo-500"
                                            placeholder="00:00"
                                        />
                                        <input
                                            type="number"
                                            value={row.duration}
                                            onChange={(e) => onUpdateRow(i, { duration: parseFloat(e.target.value) })}
                                            className="bg-transparent w-16 text-xs text-slate-500 font-mono text-center focus:text-white outline-none border-b border-transparent focus:border-indigo-500"
                                            placeholder="5s"
                                        />
                                    </div>
                                </td>

                                {/* AUDIO */}
                                <td className="p-2 border-l border-slate-800/30 bg-rose-500/[0.01]">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 justify-center">
                                            <input
                                                type="checkbox"
                                                checked={row.sfxMute || false}
                                                onChange={(e) => onUpdateRow(i, { sfxMute: e.target.checked })}
                                                className="accent-rose-500 h-3 w-3"
                                                title="Mute SFX"
                                            />
                                            <span className="text-[10px] text-slate-500 font-mono uppercase">Mute</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={row.sfxOverride || ''}
                                            onChange={(e) => onUpdateRow(i, { sfxOverride: e.target.value })}
                                            className={`bg-transparent w-full text-[10px] outline-none text-center border-b border-transparent focus:border-rose-500 ${row.sfxMute ? 'text-slate-700 pointer-events-none' : 'text-slate-400 focus:text-white'}`}
                                            placeholder="URL..."
                                            disabled={row.sfxMute}
                                        />
                                    </div>
                                </td>

                                {/* GLYPHS */}
                                <td className="p-2 border-l border-slate-800/30 bg-emerald-500/[0.01]">
                                    <div className="flex items-center gap-1 relative">
                                        <input
                                            type="number" min="0" max="50"
                                            value={row.glyphs.reduce((acc, g) => acc + (g.count || 0), 0)}
                                            onChange={(e) => {
                                                const newTotal = parseInt(e.target.value);
                                                const currentTotal = row.glyphs.reduce((acc, g) => acc + (g.count || 0), 0);
                                                const firstCount = row.glyphs[0]?.count || 0;
                                                const othersCount = currentTotal - firstCount;
                                                updateGlyph(i, 0, 'count', Math.max(0, newTotal - othersCount));
                                            }}
                                            className={`bg-transparent w-8 text-center outline-none focus:text-emerald-400 ${(row.glyphs.reduce((acc, g) => acc + (g.count || 0), 0)) > 25 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                                        />

                                        {/* Validation Indicators */}
                                        {(() => {
                                            const glyphCount = row.glyphs.reduce((acc, g) => acc + (g.count || 0), 0);
                                            const shapeCount = row.shapes.length;
                                            const totalComplexity = glyphCount + shapeCount;
                                            const densityWarning = glyphCount > 25;
                                            const complexityWarning = totalComplexity > 30;

                                            if (densityWarning || complexityWarning) {
                                                return (
                                                    <div className="group/tooltip relative -ml-1">
                                                        <span className="text-amber-500 text-[10px] cursor-help">⚠</span>
                                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 bg-slate-900 border border-amber-900/50 text-slate-300 text-[10px] p-2 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                                                            {densityWarning && (
                                                                <div className="flex items-center gap-1 text-amber-400 mb-1">
                                                                    <span className="font-bold">Density Alert:</span> &gt;25 glyphs may impact readability.
                                                                </div>
                                                            )}
                                                            {complexityWarning && (
                                                                <div className="flex items-center gap-1 text-orange-300">
                                                                    <span className="font-bold">Reduction Suggested:</span> Total elements ({totalComplexity}) exceeds recommended limit of 30.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </td>
                                <td className="p-2 bg-emerald-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-400 outline-none w-20 hover:text-emerald-300"
                                        value={row.glyphs[0]?.posture || HumanPosture.Equilibrium}
                                        onChange={(e) => updateGlyph(i, 0, 'posture', e.target.value)}
                                    >
                                        {Object.values(HumanPosture).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-emerald-500/[0.01]">
                                    <div className="text-[10px] font-mono text-slate-600 text-center">
                                        [{row.glyphs[0]?.position.join(',') || '0.5,0.5'}]
                                    </div>
                                </td>
                                <td className="p-2 bg-emerald-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-400 outline-none w-12 text-center"
                                        value={row.glyphs[0]?.size || SizeLevel.M}
                                        onChange={(e) => updateGlyph(i, 0, 'size', parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-emerald-500/[0.01] border-r border-slate-800/30">
                                    <input
                                        type="color"
                                        value={row.glyphs[0]?.faceColor || '#ffffff'}
                                        onChange={(e) => updateGlyph(i, 0, 'faceColor', e.target.value)}
                                        className="w-4 h-4 rounded cursor-pointer bg-transparent border-none p-0"
                                    />
                                </td>

                                {/* SHAPES */}
                                <td className="p-2 bg-blue-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-300 font-medium outline-none w-20"
                                        value={row.shapes[0]?.type || PrimitiveType.Circle}
                                        onChange={(e) => updateShape(i, 0, 'type', e.target.value)}
                                    >
                                        {Object.values(PrimitiveType).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-blue-500/[0.01]">
                                    <input
                                        type="text"
                                        className="bg-transparent text-xs text-slate-400 outline-none w-16"
                                        value={row.shapes[0]?.function || ''}
                                        placeholder="Halo..."
                                        onChange={(e) => updateShape(i, 0, 'function', e.target.value)}
                                    />
                                </td>
                                <td className="p-2 bg-blue-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-400 outline-none w-12 text-center"
                                        value={row.shapes[0]?.size || SizeLevel.M}
                                        onChange={(e) => updateShape(i, 0, 'size', parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-blue-500/[0.01] border-r border-slate-800/30">
                                    <button className="text-slate-600 hover:text-blue-400 transition-colors">
                                        <RotateCw size={12} />
                                    </button>
                                </td>

                                {/* MOTION */}
                                <td className="p-2 bg-purple-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-300 outline-none w-20"
                                        value={row.motion.verb || GlyphVerb.Static}
                                        onChange={(e) => updateMotion(i, 'verb', e.target.value)}
                                    >
                                        {Object.values(GlyphVerb).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-purple-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-400 outline-none w-16"
                                        value={row.motion.speed || MotionSpeed.Normal}
                                        onChange={(e) => updateMotion(i, 'speed', e.target.value)}
                                    >
                                        {Object.values(MotionSpeed).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 bg-purple-500/[0.01]">
                                    <select
                                        className="bg-transparent text-xs text-slate-400 outline-none w-16"
                                        value={row.motion.transition || SetupTransition.FadeIn}
                                        onChange={(e) => updateMotion(i, 'transition', e.target.value)}
                                    >
                                        {Object.values(SetupTransition).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 border-l border-slate-800/30">
                                    <input
                                        type="text"
                                        value={row.textSync}
                                        onChange={(e) => onUpdateRow(i, { textSync: e.target.value })}
                                        className="bg-transparent w-16 text-[10px] text-slate-300 outline-none focus:text-emerald-400"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={row.notes || ''}
                                        onChange={(e) => onUpdateRow(i, { notes: e.target.value })}
                                        className="bg-transparent w-32 text-[10px] text-slate-500 outline-none focus:text-emerald-400 truncate focus:w-64 transition-all"
                                        placeholder="..."
                                    />
                                </td>

                                <td className="p-2 text-right">
                                    <button
                                        onClick={() => onDeleteRow('', i)}
                                        className="p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-emerald-500/50 font-mono flex justify-end">
                {rows.length} vector rows • {rows.reduce((acc, r) => acc + r.duration, 0).toFixed(1)}s total
            </div>
        </div>
    );
};

export default VectorTableView;
