import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PrimitiveType, GlyphVerb, MotionSpeed } from '../types';

// Define the shape of a suggestion
interface GlyphSuggestion {
    keyword: string;
    label: string;
    description: string;
    // Fields to auto-fill
    shapeType: PrimitiveType;
    shapeFunction: string;
    glyphCount: number;
    glyphVerb: GlyphVerb;
    motionSpeed: MotionSpeed;
}

// Hardcoded rules
const PROMPT_RULES: GlyphSuggestion[] = [
    {
        keyword: 'tinaja',
        label: 'Tinaja (Jar)',
        description: 'Container of spirits. Box body with Arc neck.',
        shapeType: PrimitiveType.Square,
        shapeFunction: 'Container',
        glyphCount: 3,
        glyphVerb: GlyphVerb.Emerge, // Closest to Transform
        motionSpeed: MotionSpeed.Slow
    },
    {
        keyword: 'sol',
        label: 'Sol (Sun)',
        description: 'Life force. Central Circle with radiating Lines.',
        shapeType: PrimitiveType.Circle,
        shapeFunction: 'Source',
        glyphCount: 1,
        glyphVerb: GlyphVerb.Pulse,
        motionSpeed: MotionSpeed.Normal
    },
    {
        keyword: 'mar',
        label: 'Mar (Sea)',
        description: 'Undulating movement. Multiple Arcs or Curves.',
        shapeType: PrimitiveType.Curve,
        shapeFunction: 'Wave',
        glyphCount: 5,
        glyphVerb: GlyphVerb.Oscillate, // Closest to Move
        motionSpeed: MotionSpeed.Slow
    },
    {
        keyword: 'huracan',
        label: 'Juracán',
        description: 'Chaos and power. Spiral or concentric Circles.',
        shapeType: PrimitiveType.Concentric,
        shapeFunction: 'Vortex',
        glyphCount: 1,
        glyphVerb: GlyphVerb.ScatterDisperse, // Closest to Rotate/Chaos
        motionSpeed: MotionSpeed.Fast
    }
];

interface GlyphSuggesterProps {
    onSelectCallback: (suggestion: GlyphSuggestion) => void;
}

const GlyphSuggester: React.FC<GlyphSuggesterProps> = ({ onSelectCallback }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<GlyphSuggestion[]>([]);

    const handleSearch = () => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        const lowerInput = input.toLowerCase();
        const matches = PROMPT_RULES.filter(rule =>
            rule.keyword.includes(lowerInput) ||
            rule.label.toLowerCase().includes(lowerInput) ||
            rule.description.toLowerCase().includes(lowerInput)
        );
        setSuggestions(matches);
    };

    return (
        <div className="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/30 mb-4">
            <div className="flex gap-4 items-end mb-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>Glyph Suggester</span>
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter concept (e.g., tinaja, sol)..."
                            className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Suggest
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2">
                    {suggestions.map((s) => (
                        <button
                            key={s.keyword}
                            onClick={() => onSelectCallback(s)}
                            className="flex flex-col text-left p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-indigo-900/20 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="flex justify-between items-start w-full mb-1">
                                <span className="font-bold text-slate-200 text-sm">{s.label}</span>
                                <ArrowRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{s.description}</p>
                            <div className="mt-auto flex gap-2 text-[10px] font-mono text-slate-500">
                                <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{s.shapeType}</span>
                                <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{s.glyphVerb}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {suggestions.length === 0 && input && (
                <p className="text-xs text-slate-500 mt-2">No specific suggestions found. Try 'tinaja', 'sol', or 'huracan'.</p>
            )}
        </div>
    );
};

export default GlyphSuggester;
