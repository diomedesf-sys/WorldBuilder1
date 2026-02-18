
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Split, Merge, Mic } from 'lucide-react';
import TapSyncTool from '../components/TapSyncTool';
import type { PoemLine } from '../data/poem';
import { type VectorRow, GlyphVerb, MotionSpeed, SetupTransition } from '../types';

interface PoemViewProps {
    poem: PoemLine[];
    onStanzaSelect?: (id: number) => void;
    activeParagraphId?: number | null;
    vectorRows?: VectorRow[];
    onUpdateVectorRow?: (index: number, updates: Partial<VectorRow>) => void;
    onRowOperation?: (action: 'split' | 'merge' | 'add', index: number, payload?: any) => void;
}

const SECTIONS = ['Pasado', 'Presente', 'Futuro', 'Post-Data'] as const;

const PoemView: React.FC<PoemViewProps> = ({ poem, onStanzaSelect, activeParagraphId, vectorRows, onUpdateVectorRow, onRowOperation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'Pasado': true,
        'Presente': true,
        'Futuro': true,
        'Post-Data': true,
    });
    const [selectedId, setSelectedId] = useState<number | null>(null); // Keep local tracking too
    const [isEditorMode, setIsEditorMode] = useState(false);
    const [showTapSync, setShowTapSync] = useState(false);

    // Formatting state (applied to selection or active row)
    const [activeFormat, setActiveFormat] = useState({
        fontFamily: 'serif',
        fontSize: 16,
        textAlign: 'left',
        lineHeight: 1.5
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleLineClick = (id: number) => {
        setSelectedId(id);
        if (onStanzaSelect) {
            onStanzaSelect(id);
        }
    };

    // Apply formatting to ALL rows (simple bulk action for now, or per row?)
    // User asked for "Word Editor" functions. Usually applies to selection.
    // For now, we'll apply to the Active Stanza's rows if Editor Mode is on.
    const applyFormat = (key: string, value: any) => {
        if (!vectorRows || !onUpdateVectorRow) return;
        setActiveFormat(prev => ({ ...prev, [key]: value }));

        // Sync to ALL rows in active stanza? Or just active?
        // Let's enable per-row styling. For now, pushing to ALL rows is a "Style All" feature which is useful.
        vectorRows.forEach((row, idx) => {
            onUpdateVectorRow(idx, {
                textConfig: {
                    ...row.textConfig,
                    position: row.textConfig?.position || [0.5, 0.5], // Ensure required fields
                    motion: row.textConfig?.motion || { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn },
                    [key]: value
                }
            });
        });
    };

    // Group poem by section
    const groupedPoem = useMemo(() => {
        const groups: Record<string, PoemLine[]> = {
            'Pasado': [],
            'Presente': [],
            'Futuro': [],
            'Post-Data': []
        };

        poem.forEach(line => {
            // Filter based on search
            const matchesSearch = line.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                line.id.toString().includes(searchQuery) ||
                (line.title && line.title.toLowerCase().includes(searchQuery.toLowerCase()));

            if (matchesSearch && groups[line.section]) {
                groups[line.section].push(line);
            }
        });

        return groups;
    }, [poem, searchQuery]);

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto">
            {/* Header / Search */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 text-indigo-400">
                    <BookOpen size={24} />
                    <h2 className="text-xl font-light tracking-wide">Poem Source</h2>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setShowTapSync(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg hover:bg-rose-600/30 transition-colors text-sm font-medium"
                    >
                        <Mic size={16} />
                        <span>Sync Audio</span>
                    </button>

                    {activeParagraphId && (
                        <button
                            onClick={() => setIsEditorMode(!isEditorMode)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isEditorMode
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <Type size={16} />
                            <span>Script Editor</span>
                        </button>
                    )}
                    <div className="relative group flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all shadow-sm"
                            placeholder="Search text, title or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Formatting Toolbar */}
            {isEditorMode && activeParagraphId && (
                <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-4 overflow-x-auto">
                    <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                        <span className="text-xs text-slate-500 uppercase font-mono">Font</span>
                        <select
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 outline-none focus:border-indigo-500"
                            onChange={(e) => applyFormat('fontFamily', e.target.value)}
                            value={activeFormat.fontFamily}
                        >
                            <option value="serif">Serif</option>
                            <option value="sans-serif">Sans Serif</option>
                            <option value="monospace">Monospace</option>
                            <option value="cursive">Handwriting</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                        <span className="text-xs text-slate-500 uppercase font-mono">Size</span>
                        <input
                            type="number"
                            min="8" max="72"
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-16 outline-none focus:border-indigo-500"
                            value={activeFormat.fontSize}
                            onChange={(e) => applyFormat('fontSize', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                        <span className="text-xs text-slate-500 uppercase font-mono">Align</span>
                        <div className="flex bg-slate-900 rounded border border-slate-700">
                            <button onClick={() => applyFormat('textAlign', 'left')} className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-l"><AlignLeft size={16} /></button>
                            <button onClick={() => applyFormat('textAlign', 'center')} className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white"><AlignCenter size={16} /></button>
                            <button onClick={() => applyFormat('textAlign', 'right')} className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-r"><AlignRight size={16} /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase font-mono">Spacing</span>
                        <input
                            type="number" step="0.1" min="0.5" max="3"
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-16 outline-none focus:border-indigo-500"
                            value={activeFormat.lineHeight}
                            onChange={(e) => applyFormat('lineHeight', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {showTapSync && (
                <TapSyncTool
                    rows={vectorRows || []}
                    onApplySync={(syncedRows) => {
                        syncedRows.forEach((row, idx) => {
                            if (vectorRows && idx < vectorRows.length && onUpdateVectorRow) { // Added null checks for vectorRows and onUpdateVectorRow
                                onUpdateVectorRow(idx, {
                                    timeStart: row.timeStart,
                                    duration: row.duration
                                });
                            }
                        });
                        setShowTapSync(false);
                    }}
                    onCancel={() => setShowTapSync(false)}
                />
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar pb-20">
                {SECTIONS.map(section => {
                    const lines = groupedPoem[section];
                    if (lines.length === 0 && searchQuery) return null; // Hide empty sections when searching

                    const isExpanded = expandedSections[section];

                    return (
                        <div key={section} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/20">
                            <button
                                onClick={() => toggleSection(section)}
                                className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? <ChevronDown size={18} className="text-indigo-400" /> : <ChevronRight size={18} className="text-slate-500" />}
                                    <h3 className="text-lg font-medium text-slate-200">{section}</h3>
                                    <span className="text-xs text-slate-600 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                                        {lines.length} paragraphs
                                    </span>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-4 space-y-4">
                                    {lines.map(line => (
                                        <PoemParagraph
                                            key={line.id}
                                            line={line}
                                            isSelected={activeParagraphId === line.id}
                                            isEditorMode={isEditorMode && activeParagraphId === line.id}
                                            searchQuery={searchQuery}
                                            onClick={() => handleLineClick(line.id)}
                                            vectorRows={activeParagraphId === line.id ? vectorRows : undefined}
                                            onUpdateVectorRow={onUpdateVectorRow}
                                            onRowOperation={onRowOperation}
                                        />
                                    ))}
                                    {lines.length === 0 && !searchQuery && (
                                        <div className="text-slate-500 italic p-4 text-center">No lines in this section.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {Object.values(groupedPoem).every(g => g.length === 0) && searchQuery && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                        <Search size={32} className="mb-2 opacity-50" />
                        <p>No matches found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PoemParagraph = ({ line, isSelected, isEditorMode, searchQuery, onClick, vectorRows, onUpdateVectorRow, onRowOperation }: {
    line: PoemLine,
    isSelected: boolean,
    isEditorMode?: boolean,
    searchQuery: string,
    onClick: () => void,
    vectorRows?: VectorRow[],
    onUpdateVectorRow?: (index: number, updates: Partial<VectorRow>) => void,
    onRowOperation?: (action: 'split' | 'merge' | 'add', index: number, payload?: any) => void;
}) => {

    // If active and we have rows, render editable inputs
    if (isSelected && vectorRows && onUpdateVectorRow) {
        return (
            <div
                className={`p-5 rounded-xl transition-all duration-200 border relative group shadow-lg shadow-indigo-900/10 bg-indigo-900/20 border-indigo-500/50`}
            >
                <div className="flex gap-5">
                    <div className={`flex flex-col items-center flex-shrink-0 w-10 pt-1 text-indigo-400`}>
                        <span className="text-sm font-mono font-bold">#{line.id}</span>
                        {isEditorMode ? (
                            <span className="text-[10px] mt-1 bg-amber-500/20 text-amber-300 px-1 rounded uppercase">Editor</span>
                        ) : (
                            <span className="text-[10px] mt-1 text-indigo-500/70 uppercase">View</span>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        {line.title && (
                            <h4 className={`text-sm font-semibold mb-2 uppercase tracking-wider text-indigo-300`}>
                                {line.title}
                            </h4>
                        )}

                        <div className="space-y-3">
                            {vectorRows.map((row, idx) => (
                                <div key={row.beatId || idx} className="group/input relative flex items-start gap-2">
                                    <span className="text-xs text-slate-600 mt-2 w-6 text-right select-none">{idx + 1}</span>
                                    <textarea
                                        value={row.textSync}
                                        onChange={(e) => onUpdateVectorRow(idx, { textSync: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (!isEditorMode || !onRowOperation) return;

                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const cursor = e.currentTarget.selectionStart;
                                                onRowOperation('split', idx, { cursor });
                                            } else if (e.key === 'Backspace' && e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
                                                e.preventDefault();
                                                onRowOperation('merge', idx);
                                            }
                                        }}
                                        className={`w-full bg-transparent border-l-2 ${isEditorMode ? 'border-indigo-500/50 hover:border-indigo-400' : 'border-transparent hover:border-slate-700/50'} focus:border-indigo-500 outline-none text-slate-200 font-serif text-lg pl-3 py-1 transition-all resize-none overflow-hidden placeholder-slate-600/50`}
                                        placeholder="Enter poem text for this beat..."
                                        rows={Math.max(1, (row.textSync.match(/\n/g) || []).length + 1)}
                                        style={{
                                            minHeight: '1.5em',
                                            fontFamily: row.textConfig?.fontFamily,
                                            fontSize: row.textConfig?.fontSize ? `${row.textConfig.fontSize}px` : undefined,
                                            textAlign: row.textConfig?.textAlign,
                                            lineHeight: row.textConfig?.lineHeight
                                        }}
                                        readOnly={!isEditorMode} // Require Editor Mode to type? Or just to split? User said "when i turn it on". Let's enable typing always but Split/Format only in Editor.
                                    // keeping typing enabled always for convenience, but advanced features in Editor Mode.
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-mono">
                                {isEditorMode ? 'Editor Mode: Enter to Split, Backspace to Merge' : 'Read-Only Mode'}
                            </span>
                            <span className="text-xs text-indigo-400 font-medium bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-500/20">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Read-Only View
    const renderText = () => {
        if (!searchQuery) return line.text;

        const parts = line.text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === searchQuery.toLowerCase()
                ? <span key={i} className="bg-amber-500/20 text-amber-200 rounded px-0.5">{part}</span>
                : part
        );
    };

    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border relative group hover:shadow-md bg-black/20 border-slate-800/50 hover:bg-slate-800/30 hover:border-slate-700`}
        >
            <div className="flex gap-5">
                <div className={`flex flex-col items-center flex-shrink-0 w-10 pt-1 text-slate-600 group-hover:text-slate-500`}>
                    <span className="text-sm font-mono font-bold">#{line.id}</span>
                </div>
                <div className="flex-1">
                    {line.title && (
                        <h4 className={`text-sm font-semibold mb-2 uppercase tracking-wider text-slate-500`}>
                            {line.title}
                        </h4>
                    )}
                    <p className={`text-base leading-relaxed font-serif text-slate-400 group-hover:text-slate-300`} style={{ whiteSpace: 'pre-line' }}>
                        {renderText()}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-mono">Range: {line.range}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoemView;
