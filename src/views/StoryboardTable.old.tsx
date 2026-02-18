```
import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowRight } from 'lucide-react';
import { PrimitiveType, GlyphVerb, SetupTransition, StoryboardRow } from '../types';

// --- Data Structure matching Addendum B ---
interface StoryboardRow {
    id: string;
    beatNumber: number;
    linesCovered: string; // e.g. "1-2"
    imageType: string;    // e.g. "Solo", "Cluster"
    numGlyphs: number;
    posturesFaceColors: string; // e.g. "Equilibrium #555"
    shapesIntroduced: PrimitiveType[];
    glyphVerb: GlyphVerb;
    setupTransition: SetupTransition;
    intentPacing: string; // "Calm / Slow"
}

interface StoryboardTableProps {
  rows: StoryboardRow[];
  setRows: (rows: StoryboardRow[]) => void;
}

const StoryboardTable: React.FC<StoryboardTableProps> = ({ rows, setRows }) => {
    // Local state removed, using props

    const handleInputChange = (id: string, field: keyof StoryboardRow, value: any) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const addRow = () => {
        const newRow: StoryboardRow = {
            id: Date.now().toString(),
            beatNumber: rows.length + 1,
            linesCovered: '',
            imageType: 'Solo',
            numGlyphs: 1,
            posturesFaceColors: '',
            shapesIntroduced: [],
            glyphVerb: GlyphVerb.Emerge,
            setupTransition: SetupTransition.FadeIn,
            intentPacing: '',
        };
        setRows([...rows, newRow]);
    };

    const removeRow = (id: string) => {
        setRows(rows.filter(row => row.id !== id));
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
            {/* Header / Toolbar */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div>
                    <h2 className="text-xl font-bold text-slate-200">Storyboard Table (Part 1)</h2>
                    <p className="text-sm text-slate-500">Poetic beats & Visual Strategy</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => console.log('Saved', rows)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <Save size={18} />
                        <span>Save Draft</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                        <span>To Vector Table</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 overflow-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950/50 text-slate-200 sticky top-0 z-10 font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">Beat</th>
                            <th className="p-4 w-24">Lines</th>
                            <th className="p-4 w-32">Image Type</th>
                            <th className="p-4 w-20 text-center">Glyphs</th>
                            <th className="p-4 w-48">Postures / Colors</th>
                            <th className="p-4 w-40">Shapes</th>
                            <th className="p-4 w-32">Verb</th>
                            <th className="p-4 w-32">Transition</th>
                            <th className="p-4 flex-1">Intent & Pacing</th>
                            <th className="p-4 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                {/* Beat # */}
                                <td className="p-4 text-center font-mono text-slate-500">
                                    {row.beatNumber}
                                </td>

                                {/* Lines Covered */}
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.linesCovered}
                                        onChange={(e) => handleInputChange(row.id, 'linesCovered', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300 placeholder-slate-600"
                                        placeholder="1-2"
                                    />
                                </td>

                                {/* Image Type */}
                                <td className="p-4">
                                    <select
                                        value={row.imageType}
                                        onChange={(e) => handleInputChange(row.id, 'imageType', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300"
                                    >
                                        <option value="Solo">Solo</option>
                                        <option value="Cluster">Cluster</option>
                                        <option value="Conceptual">Conceptual</option>
                                        <option value="Duality">Duality</option>
                                        <option value="Expansion">Expansion</option>
                                    </select>
                                </td>

                                {/* # Glyphs */}
                                <td className="p-4">
                                    <input
                                        type="number"
                                        min={0}
                                        value={row.numGlyphs}
                                        onChange={(e) => handleInputChange(row.id, 'numGlyphs', parseInt(e.target.value))}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300 text-center"
                                    />
                                </td>

                                {/* Postures / Colors */}
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.posturesFaceColors}
                                        onChange={(e) => handleInputChange(row.id, 'posturesFaceColors', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300 placeholder-slate-600"
                                        placeholder="Equilibrium #FFF"
                                    />
                                </td>

                                {/* Shapes Introduced (Multi-select simplified for now) */}
                                <td className="p-4">
                                    <div className="text-xs text-slate-400">
                                        {row.shapesIntroduced.join(', ') || '-'}
                                    </div>
                                </td>

                                {/* Verb */}
                                <td className="p-4">
                                    <select
                                        value={row.glyphVerb}
                                        onChange={(e) => handleInputChange(row.id, 'glyphVerb', e.target.value as GlyphVerb)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300"
                                    >
                                        {Object.values(GlyphVerb).map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Transition */}
                                <td className="p-4">
                                    <select
                                        value={row.setupTransition}
                                        onChange={(e) => handleInputChange(row.id, 'setupTransition', e.target.value as SetupTransition)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300"
                                    >
                                        {Object.values(SetupTransition).map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Intent & Pacing */}
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.intentPacing}
                                        onChange={(e) => handleInputChange(row.id, 'intentPacing', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none text-slate-300 placeholder-slate-600"
                                        placeholder="Emotion / Speed"
                                    />
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-center">
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
                        No beats added yet. Start by adding a row.
                    </div>
                )}

                <button
                    onClick={addRow}
                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/30 transition-colors border-t border-slate-800"
                >
                    <Plus size={18} />
                    <span>Add Beat</span>
                </button>
            </div>
        </div>
    );
};

export default StoryboardTable;
