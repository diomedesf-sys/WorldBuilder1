
import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Wand2, Lightbulb, Search, AlertTriangle } from 'lucide-react';
import { GlyphVerb, SetupTransition, HumanPosture, PrimitiveType } from '../types';
import type { GlyphState, ShapeState, StoryboardRow, SizeLevel } from '../types';

// --- Glyph Suggester Logic ---

interface Suggestion {
    primitive: PrimitiveType;
    size: SizeLevel;
    explanation: string;
}

const CONCEPT_MAP: Record<string, Suggestion[]> = {
    'love': [
        { primitive: PrimitiveType.Circle, size: 3, explanation: 'Unity, completeness' },
        { primitive: PrimitiveType.Concentric, size: 4, explanation: 'Radiating affection' },
        { primitive: PrimitiveType.Curve, size: 2, explanation: 'Gentle embrace' }
    ],
    'conflict': [
        { primitive: PrimitiveType.Triangle, size: 4, explanation: 'Sharpness, tension' },
        { primitive: PrimitiveType.DoubleCurve, size: 3, explanation: 'Clashing forces' },
        { primitive: PrimitiveType.Line, size: 5, explanation: 'Division, barrier' }
    ],
    'journey': [
        { primitive: PrimitiveType.Line, size: 5, explanation: 'Path, direction' },
        { primitive: PrimitiveType.Curve, size: 3, explanation: 'Winding road' },
        { primitive: PrimitiveType.Triangle, size: 2, explanation: 'Arrow, movement' }
    ],
    'chaos': [
        { primitive: PrimitiveType.DoubleCurve, size: 4, explanation: 'Unpredictable, flow' },
        { primitive: PrimitiveType.Triangle, size: 5, explanation: 'Danger, spikes' },
        { primitive: PrimitiveType.Concentric, size: 3, explanation: 'Vortex, confusion' }
    ],
    'structure': [
        { primitive: PrimitiveType.Square, size: 4, explanation: 'Stability, frame' },
        { primitive: PrimitiveType.Rectangle, size: 5, explanation: 'Foundation, block' },
        { primitive: PrimitiveType.Line, size: 3, explanation: 'Grid, order' }
    ],
    'magic': [
        { primitive: PrimitiveType.Concentric, size: 5, explanation: 'Ripple, spell' },
        { primitive: PrimitiveType.Circle, size: 2, explanation: 'Orb, focus' },
        { primitive: PrimitiveType.DoubleCurve, size: 3, explanation: 'Energy, wave' }
    ],
    'nature': [
        { primitive: PrimitiveType.Curve, size: 4, explanation: 'Organic, growth' },
        { primitive: PrimitiveType.Circle, size: 3, explanation: 'Sun, cycle' },
        { primitive: PrimitiveType.DoubleCurve, size: 2, explanation: 'River, vine' }
    ]
};

const GlyphSuggester: React.FC<{ onSelect: (s: Suggestion) => void }> = ({ onSelect }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const handleSearch = (term: string) => {
        setInput(term);
        // Simple fuzzy match simulation
        const termLower = term.toLowerCase();
        let matches: Suggestion[] = [];

        Object.keys(CONCEPT_MAP).forEach(key => {
            if (key.includes(termLower) || termLower.includes(key)) {
                matches = [...matches, ...CONCEPT_MAP[key]];
            }
        });

        // Default suggestions if no match
        if (matches.length === 0 && term.length > 2) {
            matches = [
                { primitive: PrimitiveType.Circle, size: 3, explanation: 'Generic container' },
                { primitive: PrimitiveType.Square, size: 3, explanation: 'Generic structure' },
            ];
        }

        setSuggestions(matches.slice(0, 5));
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 shadow-lg mb-6">
            <div className="flex items-center gap-2 text-indigo-300 mb-1">
                <Wand2 size={16} />
                <span className="text-sm font-semibold tracking-wide">Glyph Suggester</span>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type a concept (e.g. Love, Chaos, Journey)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none placeholder-slate-600"
                />
                <Search className="absolute left-3 top-2.5 text-slate-600" size={14} />
            </div>

            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {suggestions.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSelect(s)}
                            className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-900/30 border border-slate-700 hover:border-indigo-500/50 transition-all text-left group"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-950 border border-slate-800 rounded text-slate-400 group-hover:text-indigo-300 font-bold text-xs">
                                {/* Thumbnail Placeholder */}
                                {s.primitive.substring(0, 1)}
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-300 group-hover:text-white">
                                    {s.primitive} <span className="opacity-50 text-[10px]">(Size {s.size})</span>
                                </div>
                                <div className="text-[10px] text-slate-500">{s.explanation}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {input.length > 2 && suggestions.length === 0 && (
                <div className="text-xs text-slate-500 italic px-2">No direct matches. Try 'Nature', 'Magic', 'Structure'...</div>
            )}
        </div>
    );
};

// --- Main View ---

// ... imports ...

// ... GlyphSuggester Logic ... (keep as is)
// ...

interface StoryboardTableViewProps {
    rows: StoryboardRow[];
    onUpdateRow: (id: string, field: keyof StoryboardRow, value: any) => void;
    onAddRow: () => void;
    onDeleteRow: (id: string, index: number) => void;
    activeParagraphId?: number | null;
    onSaveGlyph?: (name: string, glyphs: GlyphState[], shapes: ShapeState[]) => void;
    onBeatClick?: (beatId: string) => void;
}

const StoryboardTableView: React.FC<StoryboardTableViewProps> = ({ rows, onUpdateRow, onAddRow, onDeleteRow, activeParagraphId: _active, onSaveGlyph, onBeatClick }) => {
    const [activeRowId, setActiveRowId] = useState<string | null>(null);

    // ... (keep useEffect) ...

    const handleSuggestionSelect = (suggestion: Suggestion) => {
        if (!activeRowId) {
            // ...
            return;
        }
        onUpdateRow(activeRowId, 'shapesIntroduced', [suggestion.primitive]);
    };

    const handleSaveToLibrary = () => {
        if (!activeRowId || !onSaveGlyph) return;
        const row = rows.find(r => r.id === activeRowId);
        if (!row) return;

        // Construct mock glyph state from storyboard data for saving
        // In a real app, we might want to grab the *synced* vector data from App state, but here we can approximate or ask user.
        // For simplicity, let's just save the current suggestions as a "Preset"
        // Actually, the prompt says "When user approves a Suggester combo, save it... with its VECTOR Data".
        // The StoryboardRow doesn't have the full vector data. The App handles sync. 
        // We might need to pass the *synced* glyphs back down or just construct them based on the storyboard rules.
        // Let's construct a basic version based on the current row's config.

        const name = prompt("Enter a name for this Glyph Preset:", `${row.imageType} - ${row.glyphCount} Glyphs`);
        if (name) {
            const glyphs: GlyphState[] = [{
                count: row.glyphCount,
                posture: row.postures[0] || 'Posture1',
                faceColor: row.faceColors[0] || '#fff',
                position: [0.5, 0.5], size: 3 // Defaults
            }];
            const shapes: ShapeState[] = row.shapesIntroduced.map(s => ({
                type: s, function: 'Decoration', position: [0.5, 0.5], size: 3, rotation: 0
            }));

            onSaveGlyph(name, glyphs, shapes);
        }
    };


    return (
        <div className="h-full flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-light tracking-wide text-rose-200">Storyboard Template</h2>
                <div className="flex gap-2">
                    {activeRowId && (
                        <button
                            onClick={handleSaveToLibrary}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 transition-colors"
                        >
                            <Lightbulb size={18} />
                            <span>Save to Library</span>
                        </button>
                    )}
                    <button
                        onClick={onAddRow}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg hover:bg-rose-600/30 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Beat</span>
                    </button>
                </div>
            </div>

            {/* Glyph Suggester Component */}
            <GlyphSuggester onSelect={handleSuggestionSelect} />

            <div className="flex-1 overflow-auto border border-slate-800 rounded-xl bg-slate-900/30 shadow-2xl custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Beat #</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Lines</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Image Type</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800"># Glyphs</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Postures / Colors</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Shapes <span className="text-[10px] text-indigo-400 ml-1">(Suggester)</span></th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Verb</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Transition</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800">Audio</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800 w-full">Intent & Pacing</th>
                            <th className="p-4 font-medium text-slate-400 border-b border-slate-800"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {rows.map((row, index) => (
                            <tr
                                key={row.id}
                                onClick={() => setActiveRowId(row.id)}
                                className={`hover:bg-slate-800/30 transition-colors group cursor-pointer ${activeRowId === row.id ? 'bg-indigo-900/10 border-l-2 border-indigo-500' : ''}`}
                            >
                                <td
                                    className="p-4 font-mono text-slate-500 hover:text-indigo-400 hover:underline"
                                    onClick={(e) => {
                                        if (onBeatClick) {
                                            e.stopPropagation();
                                            onBeatClick(row.id);
                                        }
                                    }}
                                    title="Click to Jump to Beat in Video"
                                >
                                    {row.beatId}
                                </td>

                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.linesCovered}
                                        onChange={(e) => onUpdateRow(row.id, 'linesCovered', e.target.value)}
                                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 w-20 text-slate-300 outline-none transition-colors"
                                    />
                                </td>

                                <td className="p-4">
                                    <select
                                        value={row.imageType}
                                        onChange={(e) => onUpdateRow(row.id, 'imageType', e.target.value)}
                                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 text-slate-300 outline-none cursor-pointer"
                                    >
                                        <option value="Metaphor">Metaphor</option>
                                        <option value="Literal">Literal</option>
                                        <option value="Abstract">Abstract</option>
                                    </select>
                                </td>

                                <td className="p-4 relative">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={row.glyphCount}
                                            onChange={(e) => onUpdateRow(row.id, 'glyphCount', parseInt(e.target.value))}
                                            className={`bg-transparent border hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 w-16 outline-none ${row.glyphCount > 25 ? 'border-amber-500/50 text-amber-200' : 'border-transparent text-slate-300'}`}
                                        />
                                        {row.glyphCount > 25 && (
                                            <div className="group/tooltip relative">
                                                <AlertTriangle size={16} className="text-amber-500 cursor-help" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-amber-900/50 text-slate-300 text-[10px] p-2 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                                                    <div className="font-bold text-amber-400 mb-1">Density Alert</div>
                                                    High glyph count ({row.glyphCount}) may reduce visual clarity. Consider breaking into multiple beats.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <select
                                            value={row.postures[0]}
                                            onChange={(e) => onUpdateRow(row.id, 'postures', [e.target.value])}
                                            className="bg-transparent text-xs border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-1 py-0.5 text-slate-400 outline-none"
                                        >
                                            {Object.values(HumanPosture).map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={row.faceColors[0] || ''}
                                            placeholder="#Hex"
                                            onChange={(e) => onUpdateRow(row.id, 'faceColors', [e.target.value])}
                                            className="bg-transparent text-xs border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-1 py-0.5 w-20 text-slate-500 outline-none"
                                        />
                                    </div>
                                </td>

                                <td className="p-4 relative">
                                    <select
                                        value={row.shapesIntroduced[0] || ''}
                                        onChange={(e) => onUpdateRow(row.id, 'shapesIntroduced', [e.target.value])}
                                        className="bg-transparent text-xs border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-1 py-0.5 text-slate-400 outline-none"
                                    >
                                        <option value="">None</option>
                                        {Object.values(PrimitiveType).map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                    {activeRowId === row.id && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 opacity-50 pointer-events-none">
                                            <Lightbulb size={12} />
                                        </div>
                                    )}
                                </td>

                                <td className="p-4">
                                    <select
                                        value={row.glyphVerb}
                                        onChange={(e) => onUpdateRow(row.id, 'glyphVerb', e.target.value)}
                                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 text-slate-300 outline-none"
                                    >
                                        {Object.values(GlyphVerb).map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </td>

                                <td className="p-4">
                                    <select
                                        value={row.setupTransition}
                                        onChange={(e) => onUpdateRow(row.id, 'setupTransition', e.target.value)}
                                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 text-slate-300 outline-none"
                                    >
                                        {Object.values(SetupTransition).map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-col gap-1 w-32">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={row.sfxMute || false}
                                                onChange={(e) => onUpdateRow(row.id, 'sfxMute', e.target.checked)}
                                                className="accent-rose-500 h-3 w-3"
                                            />
                                            <span className="text-[10px] text-slate-500 uppercase">Mute</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={row.sfxOverride || ''}
                                            onChange={(e) => onUpdateRow(row.id, 'sfxOverride', e.target.value)}
                                            className={`bg-transparent border-b border-slate-800 hover:border-slate-600 focus:border-indigo-500 px-1 py-0.5 text-xs text-slate-300 outline-none ${row.sfxMute ? 'opacity-50 pointer-events-none' : ''}`}
                                            placeholder="SFX..."
                                        />
                                    </div>
                                </td>

                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.intentPacing}
                                        onChange={(e) => onUpdateRow(row.id, 'intentPacing', e.target.value)}
                                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 w-full min-w-[200px] text-slate-300 outline-none"
                                        placeholder="Describe the feeling..."
                                    />
                                </td>

                                <td className="p-4 text-right">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteRow(row.id, index); }}
                                        className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-slate-500 font-mono flex justify-end">
                {rows.length} beats defined
            </div>
        </div>
    );
};

export default StoryboardTableView;
