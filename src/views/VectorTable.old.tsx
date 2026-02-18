import React, { useState } from 'react';
import { Plus, Trash2, Save, Play, X, Download } from 'lucide-react';
import { Player } from '@remotion/player';
import { SequenceComposition } from '../remotion/SequenceComposition';
import { PrimitiveType, GlyphVerb, SetupTransition, AnimationSpeed, SizeLevel, type VectorRow } from '../types';
import GlyphSuggester from '../components/GlyphSuggester';

// --- Data Structure matching Addendum B (Part 2) ---
// interface VectorRow {
//     id: string;
//     beatNumber: number;
//     timeStart: string; // "00:00"
//     timeEnd: string;   // "00:05"

//     // Glyph details
//     glyphCount: number;
//     glyphPosture: string; // "Equilibrium"
//     glyphPosition: string; // "[0.5, 0.5]"
//     glyphSize: SizeLevel; // "M"
//     glyphColor: string;   // "#FFFFFF"

//     // Shape details
//     shapeType: PrimitiveType;
//     shapeFunction: string; // "Frame"
//     shapePosition: string; // "[0.5, 0.5]"
//     shapeScale: string;   // "1.0"
//     shapeRotation: number; // 0, 15, 30...

//     // Composition
//     compositionRule: string; // "Center"

//     // Motion
//     motionVerb: GlyphVerb;
//     motionSpeed: AnimationSpeed;
//     motionTransition: SetupTransition;
//     motionEasing: string; // "EaseInOut"

//     textSync: string; // "Line 1-2"
//     notes: string;
// }

// Initial placeholder data
// const INITIAL_DATA: VectorRow[] = [
//     {
//         id: '1',
//         beatNumber: 1,
//         timeStart: '00:00',
//         timeEnd: '00:08',
//         glyphCount: 0,
//         glyphPosture: '-',
//         glyphPosition: '-',
//         glyphSize: SizeLevel.M,
//         glyphColor: '-',
//         shapeType: PrimitiveType.Line,
//         shapeFunction: 'Horizon',
//         shapePosition: '[0.5, 0.8]',
//         shapeScale: '1.0',
//         shapeRotation: 0,
//         compositionRule: 'Golden Ratio',
//         motionVerb: GlyphVerb.Emerge,
//         motionSpeed: AnimationSpeed.Slow,
//         motionTransition: SetupTransition.FadeIn,
//         motionEasing: 'EaseOut',
//         textSync: '1-3',
//         notes: 'Subtle horizon line appearance',
//     },
// ];

interface VectorTableProps {
    rows: VectorRow[];
    setRows: (rows: VectorRow[] | ((prev: VectorRow[]) => VectorRow[])) => void;
}

import GlyphLibrary from '../components/GlyphLibrary';

const VectorTable: React.FC<VectorTableProps> = ({ rows, setRows }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // Validation Logic
    const getDensityWarning = (row: VectorRow) => {
        if (row.glyphCount > 5) return 'High Density';
        if (row.glyphCount === 0 && row.shapeType === PrimitiveType.Line) return 'Empty?';
        return null;
    };

    const handleInputChange = (id: string, field: keyof VectorRow, value: any) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleLibrarySelect = (preset: any) => {
        if (selectedRowId) {
            // Apply to selected row
            setRows(rows.map(row => row.id === selectedRowId ? {
                ...row,
                glyphCount: preset.glyphCount,
                glyphPosture: preset.glyphPosture,
                glyphSize: preset.glyphSize,
                shapeType: preset.shapeType,
                shapeFunction: preset.shapeFunction,
                compositionRule: preset.compositionRule,
                motionVerb: preset.motionVerb,
                notes: `Applied preset: ${preset.name}`
            } : row));
        } else {
            // Add new row with preset
            const newRow: VectorRow = {
                id: Date.now().toString(),
                beatNumber: rows.length + 1,
                timeStart: '00:00',
                timeEnd: '00:05',
                glyphCount: preset.glyphCount,
                glyphPosture: preset.glyphPosture,
                glyphPosition: '[0.5, 0.5]',
                glyphSize: preset.glyphSize,
                glyphColor: '#FFFFFF',
                shapeType: preset.shapeType,
                shapeFunction: preset.shapeFunction,
                shapePosition: '[0.5, 0.5]',
                shapeScale: '1.0',
                shapeRotation: 0,
                compositionRule: preset.compositionRule,
                motionVerb: preset.motionVerb,
                motionSpeed: AnimationSpeed.Normal,
                motionTransition: SetupTransition.ZoomIn,
                motionEasing: 'EaseInOut',
                textSync: '',
                notes: `Preset: ${preset.name}`,
            };
            setRows([...rows, newRow]);
        }
    };

    const handleSuggestionSelect = (suggestion: any) => {
        // Auto-fill a new row with the suggestion
        const newRow: VectorRow = {
            id: Date.now().toString(),
            beatNumber: rows.length + 1,
            timeStart: '00:00',
            timeEnd: '00:05',
            glyphCount: suggestion.glyphCount,
            glyphPosture: 'Standing',
            glyphPosition: '[0.5, 0.5]',
            glyphSize: SizeLevel.M,
            glyphColor: '#FFFFFF',
            shapeType: suggestion.shapeType,
            shapeFunction: suggestion.shapeFunction,
            shapePosition: '[0.5, 0.5]',
            shapeScale: '1.0',
            shapeRotation: 0,
            compositionRule: 'Center',
            motionVerb: suggestion.glyphVerb,
            motionSpeed: suggestion.motionSpeed,
            motionTransition: SetupTransition.ZoomIn,
            motionEasing: 'EaseInOut',
            textSync: '',
            notes: `Auto-filled from '${suggestion.label}'`,
        };
        setRows([...rows, newRow]);
    };

    const addRow = () => {
        const newRow: VectorRow = {
            id: Date.now().toString(),
            beatNumber: rows.length + 1,
            timeStart: '00:00',
            timeEnd: '00:05',
            glyphCount: 1,
            glyphPosture: 'Standing',
            glyphPosition: '[0.5, 0.5]',
            glyphSize: SizeLevel.M,
            glyphColor: '#FFFFFF',
            shapeType: PrimitiveType.Circle,
            shapeFunction: 'Halo',
            shapePosition: '[0.5, 0.5]',
            shapeScale: '1.0',
            shapeRotation: 0,
            compositionRule: 'Center',
            motionVerb: GlyphVerb.Pulse,
            motionSpeed: AnimationSpeed.Normal,
            motionTransition: SetupTransition.ZoomIn,
            motionEasing: 'EaseInOut',
            textSync: '',
            notes: '',
        };
        setRows([...rows, newRow]);
    };

    const removeRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id));
    };

    // Calculate total duration for the player
    const totalDurationInFrames = rows.reduce((acc, row) => {
        const parseTime = (t: string) => {
            const [m, s] = t.split(':').map(Number);
            return (m * 60 + s) * 30;
        };
        const start = parseTime(row.timeStart);
        const end = parseTime(row.timeEnd);
        return acc + (end - start || 90);
    }, 0);
    const parseTime = (t: string) => {
        const [m, s] = t.split(':').map(Number);
        return (m * 60 + s) * 30;
    };
    const start = parseTime(row.timeStart);
    const end = parseTime(row.timeEnd);
    return acc + (end - start || 90);
}, 0);

return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 relative">
        {/* Preview Modal */}
        {showPreview && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col justify-center items-center backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl relative">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
                    >
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <span className="text-sm font-semibold">Close Preview</span>
                            <X size={16} />
                        </div>
                    </button>

                    <div className="rounded-lg overflow-hidden border border-slate-800 shadow-xl">
                        <Player
                            component={SequenceComposition}
                            inputProps={{ rows }}
                            durationInFrames={Math.max(1, totalDurationInFrames)}
                            compositionWidth={640} // Scaled down for preview
                            compositionHeight={360}
                            fps={30}
                            controls
                            style={{
                                width: 640,
                                height: 360,
                            }}
                        />
                    </div>
                    <div className="mt-4 text-center text-slate-500 text-xs font-mono">
                        Previewing {rows.length} beats • {Math.round(totalDurationInFrames / 30)}s
                    </div>
                </div>
            </div>
        )}

        {/* Header / Toolbar */}
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div>
                <h2 className="text-xl font-bold text-slate-200">Vector Table (Part 2)</h2>
                <p className="text-sm text-slate-500">Remotion Instructions & Animation Logic</p>
            </div>
            <div className="flex gap-3">
                <GlyphLibrary
                    onSelect={handleLibrarySelect}
                    currentVectorRow={rows.find(r => r.id === selectedRowId)}
                />
                <button
                    onClick={() => console.log('Saved Vector', rows)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <Save size={18} />
                    <span>Save</span>
                </button>
                <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors shadow-lg shadow-rose-500/20"
                >
                    <Play size={18} />
                    <span>Render Preview</span>
                </button>
                <button
                    onClick={() => alert("To export MP4: \n1. Click Save \n2. Run 'npx tsx scripts/render-video.ts' in terminal")}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Download size={18} />
                    <span>Export MP4</span>
                </button>
            </div>
        </div>

        {/* Glyph Suggester */}
        <GlyphSuggester onSelectCallback={handleSuggestionSelect} />

        {/* Table Container */}
        <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 overflow-auto">
            <table className="w-full text-left text-xs text-slate-400 whitespace-nowrap">
                <thead className="bg-slate-950/50 text-slate-200 sticky top-0 z-10 font-bold">
                    <tr>
                        <th className="p-3 w-12 text-center">Beat</th>
                        <th className="p-3 w-24">Timing</th>
                        <th className="p-3 w-48 text-center border-l border-slate-800">Glyphs (Cnt/Pos/Size/Col)</th>
                        <th className="p-3 w-64 text-center border-l border-slate-800">Shapes (Type/Func/Pos/Scl/Rot)</th>
                        <th className="p-3 w-32 border-l border-slate-800">Composition</th>
                        <th className="p-3 w-64 text-center border-l border-slate-800">Motion (Verb/Spd/Trans/Ease)</th>
                        <th className="p-3 w-24 border-l border-slate-800">Text Sync</th>
                        <th className="p-3 flex-1 border-l border-slate-800">Notes</th>
                        <th className="p-3 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => setSelectedRowId(row.id)}
                            className={`transition-colors group cursor-pointer ${selectedRowId === row.id ? 'bg-indigo-900/40' : 'hover:bg-slate-800/30'}`}
                        >
                            {/* Beat # */}
                            <td className="p-3 text-center font-mono text-slate-500 relative">
                                {row.beatNumber}
                                {getDensityWarning(row) === 'High Density' && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                    </span>
                                )}
                            </td>

                            {/* Timing */}
                            <td className="p-3">
                                <div className="flex gap-1">
                                    <input
                                        type="text" className="w-12 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-center"
                                        value={row.timeStart} onChange={(e) => handleInputChange(row.id, 'timeStart', e.target.value)} placeholder="00:00"
                                    />
                                    <span>-</span>
                                    <input
                                        type="text" className="w-12 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-center"
                                        value={row.timeEnd} onChange={(e) => handleInputChange(row.id, 'timeEnd', e.target.value)} placeholder="00:00"
                                    />
                                </div>
                            </td>

                            {/* GLYPHS GROUP */}
                            <td className="p-3 border-l border-slate-800">
                                <div className="grid grid-cols-4 gap-2">
                                    <input
                                        type="number" className="w-8 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-center"
                                        value={row.glyphCount} onChange={(e) => handleInputChange(row.id, 'glyphCount', parseInt(e.target.value))}
                                    />
                                    <input
                                        type="text" className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.glyphPosition} onChange={(e) => handleInputChange(row.id, 'glyphPosition', e.target.value)} placeholder="Pos"
                                    />
                                    <select
                                        className="w-12 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.glyphSize} onChange={(e) => handleInputChange(row.id, 'glyphSize', e.target.value)}
                                    >
                                        {Object.values(SizeLevel).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <input
                                        type="text" className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.glyphColor} onChange={(e) => handleInputChange(row.id, 'glyphColor', e.target.value)} placeholder="#Hex"
                                    />
                                </div>
                            </td>

                            {/* SHAPES GROUP */}
                            <td className="p-3 border-l border-slate-800">
                                <div className="grid grid-cols-5 gap-2">
                                    <select
                                        className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.shapeType} onChange={(e) => handleInputChange(row.id, 'shapeType', e.target.value)}
                                    >
                                        {Object.values(PrimitiveType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <input
                                        type="text" className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.shapeFunction} onChange={(e) => handleInputChange(row.id, 'shapeFunction', e.target.value)} placeholder="Func"
                                    />
                                    <input
                                        type="text" className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.shapePosition} onChange={(e) => handleInputChange(row.id, 'shapePosition', e.target.value)} placeholder="Pos"
                                    />
                                    <input
                                        type="text" className="w-10 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.shapeScale} onChange={(e) => handleInputChange(row.id, 'shapeScale', e.target.value)} placeholder="Scl"
                                    />
                                    <input
                                        type="number" step={15} className="w-10 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.shapeRotation} onChange={(e) => handleInputChange(row.id, 'shapeRotation', parseInt(e.target.value))} placeholder="Rot"
                                    />
                                </div>
                            </td>

                            {/* COMPOSITION */}
                            <td className="p-3 border-l border-slate-800">
                                <input
                                    type="text" className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                    value={row.compositionRule} onChange={(e) => handleInputChange(row.id, 'compositionRule', e.target.value)}
                                />
                            </td>

                            {/* MOTION GROUP */}
                            <td className="p-3 border-l border-slate-800">
                                <div className="grid grid-cols-4 gap-2">
                                    <select
                                        className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.motionVerb} onChange={(e) => handleInputChange(row.id, 'motionVerb', e.target.value)}
                                    >
                                        {Object.values(GlyphVerb).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                    <select
                                        className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.motionSpeed} onChange={(e) => handleInputChange(row.id, 'motionSpeed', e.target.value)}
                                    >
                                        {Object.values(AnimationSpeed).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <select
                                        className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.motionTransition} onChange={(e) => handleInputChange(row.id, 'motionTransition', e.target.value)}
                                    >
                                        {Object.values(SetupTransition).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <input
                                        type="text" className="w-16 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                        value={row.motionEasing} onChange={(e) => handleInputChange(row.id, 'motionEasing', e.target.value)} placeholder="Ease"
                                    />
                                </div>
                            </td>

                            {/* TEXT SYNC */}
                            <td className="p-3 border-l border-slate-800">
                                <input
                                    type="text" className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                    value={row.textSync} onChange={(e) => handleInputChange(row.id, 'textSync', e.target.value)}
                                />
                            </td>

                            {/* NOTES */}
                            <td className="p-3 border-l border-slate-800">
                                <input
                                    type="text" className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                                    value={row.notes} onChange={(e) => handleInputChange(row.id, 'notes', e.target.value)}
                                />
                            </td>

                            {/* Actions */}
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => removeRow(row.id)}
                                    className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Empty State / Add Row */}
            {rows.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    No vectors added yet. Start by adding a row.
                </div>
            )}

            <button
                onClick={addRow}
                className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/30 transition-colors border-t border-slate-800"
            >
                <Plus size={18} />
                <span>Add Vector Row</span>
            </button>
        </div>
    </div>
);

export default VectorTable;
