import React, { useState, useMemo } from 'react';
import scoreData from '../data/master-score-analyzed.json';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Beat {
    globalLineIndex: number;
    text: string;
    era: string;
    poemIndex: number;
    stanzaIndex: number;
    lineIndex: number;
    aiParams: {
        tension: number;
        energy: number;
        archetype: string;
        petroglyph: string;
    };
    directorOverride: string;
}

// ─── Archetype Colour Map ─────────────────────────────────────────────────────

const ARCHETYPE_COLORS: Record<string, { bg: string; border: string; dot: string; label: string }> = {
    Mars: { bg: 'rgba(185,28,28,0.15)', border: '#b91c1c', dot: '#ef4444', label: 'Mars · The Force' },
    Sun: { bg: 'rgba(180,130,0,0.15)', border: '#b45309', dot: '#f59e0b', label: 'Sun · The Light' },
    Venus: { bg: 'rgba(20,110,60,0.15)', border: '#15803d', dot: '#22c55e', label: 'Venus · The Beauty' },
    Mercury: { bg: 'rgba(8,100,170,0.15)', border: '#0369a1', dot: '#38bdf8', label: 'Mercury · The Brains' },
    Moon: { bg: 'rgba(100,80,160,0.15)', border: '#7c3aed', dot: '#c4b5fd', label: 'Moon · The Fairy' },
    Saturn: { bg: 'rgba(50,50,80,0.20)', border: '#4338ca', dot: '#818cf8', label: 'Saturn · The Judge' },
    Jupiter: { bg: 'rgba(100,30,180,0.15)', border: '#7c3aed', dot: '#a855f7', label: 'Jupiter · The Queen' },
};

const ERAS = ['Pasado', 'Presente', 'Futuro'];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ArchetypePill = ({ archetype }: { archetype: string }) => {
    const c = ARCHETYPE_COLORS[archetype] ?? ARCHETYPE_COLORS['Sun'];
    return (
        <span
            style={{ background: c.bg, borderColor: c.border, color: c.dot }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0"
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
            {archetype}
        </span>
    );
};

const EnergyBar = ({ value, color }: { value: number; color: string }) => (
    <div className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(value * 100)}%`, background: color }} />
    </div>
);

// ─── Beat Row ─────────────────────────────────────────────────────────────────

const BeatRow = ({
    beat,
    isActive,
    onClick,
    onOverrideChange,
}: {
    beat: Beat;
    isActive: boolean;
    onClick: () => void;
    onOverrideChange: (val: string) => void;
}) => {
    const [showNote, setShowNote] = useState(false);
    const [noteVal, setNoteVal] = useState(beat.directorOverride || '');
    const c = ARCHETYPE_COLORS[beat.aiParams.archetype] ?? ARCHETYPE_COLORS['Sun'];
    const hasNote = noteVal.trim().length > 0;

    return (
        <div
            className={`group relative rounded-lg border transition-all duration-200 ${isActive ? 'border-opacity-80' : 'border-transparent hover:border-opacity-40'}`}
            style={{
                borderColor: isActive ? c.dot : undefined,
                background: isActive ? c.bg : 'transparent',
            }}
        >
            {/* Main beat row */}
            <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                onClick={onClick}
            >
                {/* Line number */}
                <span className="text-[10px] font-mono text-slate-600 w-6 shrink-0 text-right">
                    {beat.globalLineIndex}
                </span>

                {/* Archetype dot */}
                <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: c.dot, opacity: 0.7 }}
                    title={c.label}
                />

                {/* Line text — the protagonist */}
                <span
                    className={`flex-1 font-serif text-sm leading-snug transition-colors duration-200 ${isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}
                >
                    {beat.text}
                </span>

                {/* Petroglyph tag */}
                <span className="hidden lg:block text-[10px] font-mono text-slate-600 group-hover:text-slate-400 shrink-0 ml-1 transition-colors">
                    {beat.aiParams.petroglyph}
                </span>

                {/* Energy bar */}
                <div className="hidden lg:block shrink-0">
                    <EnergyBar value={beat.aiParams.energy} color={c.dot} />
                </div>

                {/* Tension dot */}
                <span
                    className="hidden lg:block w-2 h-2 rounded-full shrink-0"
                    style={{ background: c.dot, opacity: beat.aiParams.tension }}
                    title={`Tension: ${(beat.aiParams.tension * 100).toFixed(0)}%`}
                />

                {/* Director note indicator */}
                {hasNote && (
                    <span className="text-amber-400 text-[9px] shrink-0" title="Has Director's Note">✎</span>
                )}
            </div>

            {/* Expanded active controls */}
            {isActive && (
                <div className="px-3 pb-3 flex flex-col gap-2">
                    {/* Stats row */}
                    <div className="flex items-center gap-3 pl-8">
                        <ArchetypePill archetype={beat.aiParams.archetype} />
                        <span className="text-[10px] text-slate-500">
                            T: <span style={{ color: c.dot }}>{(beat.aiParams.tension * 100).toFixed(0)}%</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                            E: <span style={{ color: c.dot }}>{(beat.aiParams.energy * 100).toFixed(0)}%</span>
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: c.dot }}>
                            {beat.aiParams.petroglyph}
                        </span>
                    </div>

                    {/* Rendering mode buttons */}
                    <div className="flex items-center gap-2 pl-8">
                        <button className="px-2 py-0.5 text-[10px] rounded border border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-300 transition-colors">
                            [Literal]
                        </button>
                        <button className="px-2 py-0.5 text-[10px] rounded border border-slate-600 text-slate-300 hover:border-violet-400 hover:text-violet-300 transition-colors">
                            [Abstract]
                        </button>

                        {/* Director's Note toggle */}
                        <button
                            className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${showNote ? 'border-amber-400 text-amber-300' : 'border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400'}`}
                            onClick={() => setShowNote(!showNote)}
                        >
                            {hasNote ? '✎ Edit Note' : '+ Director\'s Note'}
                        </button>
                    </div>

                    {/* Director's Note text box */}
                    {showNote && (
                        <div className="pl-8 pr-2">
                            <textarea
                                className="w-full text-xs bg-slate-900/70 border border-amber-500/30 rounded-md p-2 text-amber-100 placeholder-slate-600 resize-none focus:outline-none focus:border-amber-400/60 font-sans"
                                rows={2}
                                placeholder="Describe how you want this line visualized (e.g. 'a massive glowing sun slowly swallowed by black squares')..."
                                value={noteVal}
                                onChange={(e) => {
                                    setNoteVal(e.target.value);
                                    onOverrideChange(e.target.value);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Score View ──────────────────────────────────────────────────────────

export const ScoreView: React.FC = () => {
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [overrides, setOverrides] = useState<Record<number, string>>({});
    const [activeEra, setActiveEra] = useState<string>('Pasado');

    // Group beats into the fractal: era → poem → stanza → line
    const grouped = useMemo(() => {
        const beats = scoreData as Beat[];
        const result: Record<string, Record<number, Record<number, Beat[]>>> = {};
        for (const era of ERAS) result[era] = {};

        for (const beat of beats) {
            const era = beat.era === 'Post-Data' ? 'Futuro' : beat.era;
            if (!result[era]) result[era] = {};
            if (!result[era][beat.poemIndex]) result[era][beat.poemIndex] = {};
            if (!result[era][beat.poemIndex][beat.stanzaIndex]) result[era][beat.poemIndex][beat.stanzaIndex] = [];
            result[era][beat.poemIndex][beat.stanzaIndex].push(beat);
        }
        return result;
    }, []);

    const era = grouped[activeEra] ?? {};

    // Derived stats for the active era
    const eraBeats = useMemo(() => {
        const beats = scoreData as Beat[];
        return beats.filter(b => b.era === activeEra || (activeEra === 'Futuro' && b.era === 'Post-Data'));
    }, [activeEra]);

    const avgTension = eraBeats.reduce((s, b) => s + b.aiParams.tension, 0) / (eraBeats.length || 1);
    const avgEnergy = eraBeats.reduce((s, b) => s + b.aiParams.energy, 0) / (eraBeats.length || 1);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300 overflow-hidden">

            {/* Header */}
            <header className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-800/60">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-serif text-slate-100 tracking-wide">Score View</h1>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            Historia de la Isla · 300 líneas · Director's Panel
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>T̄ <span className="text-amber-400">{(avgTension * 100).toFixed(0)}%</span></span>
                        <span>Ē <span className="text-violet-400">{(avgEnergy * 100).toFixed(0)}%</span></span>
                        <span className="text-slate-600">{eraBeats.length} lines</span>
                    </div>
                </div>

                {/* Era tabs */}
                <div className="flex gap-1 mt-4">
                    {ERAS.map(e => (
                        <button
                            key={e}
                            onClick={() => setActiveEra(e)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeEra === e
                                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                                }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </header>

            {/* Body — 3 poem columns */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-800/30 min-h-full">
                    {[1, 2, 3].map(poemIdx => (
                        <div key={poemIdx} className="bg-slate-950 flex flex-col">
                            {/* Poem header */}
                            <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm px-4 pt-4 pb-2 border-b border-slate-800/40">
                                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                                    {activeEra} · Poem {poemIdx}
                                </span>
                            </div>

                            {/* Stanzas */}
                            <div className="flex-1 px-3 py-2">
                                {[1, 2, 3].map(stanzaIdx => {
                                    const beats = era[poemIdx]?.[stanzaIdx] ?? [];
                                    if (!beats.length) return null;
                                    return (
                                        <div key={stanzaIdx} className="mb-5">
                                            {/* Stanza label */}
                                            <div className="flex items-center gap-2 mb-1.5 px-1">
                                                <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
                                                    Stanza {stanzaIdx}
                                                </span>
                                                <div className="flex-1 h-px bg-slate-800/60" />
                                            </div>

                                            {/* Beat rows */}
                                            <div className="flex flex-col gap-0.5">
                                                {beats.map(beat => (
                                                    <BeatRow
                                                        key={beat.globalLineIndex}
                                                        beat={beat}
                                                        isActive={activeLine === beat.globalLineIndex}
                                                        onClick={() => setActiveLine(
                                                            activeLine === beat.globalLineIndex ? null : beat.globalLineIndex
                                                        )}
                                                        onOverrideChange={(val) =>
                                                            setOverrides(prev => ({ ...prev, [beat.globalLineIndex]: val }))
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
