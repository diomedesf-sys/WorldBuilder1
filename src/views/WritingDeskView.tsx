import React, { useState } from 'react';
import { ProceduralPerson } from '../components/ProceduralPerson';
import { analyzeTextSemantics, type SemanticAnalysis } from '../data/ai-service';
import { Play, Loader2, PenTool } from 'lucide-react';

export const WritingDeskView = () => {
    const [stanzaText, setStanzaText] = useState("Dicen que con explosión\nOtros que con un soplido\nAquí nació con YaYá...");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Store the semantic data returned from Gemini
    const [semantics, setSemantics] = useState<SemanticAnalysis | null>({
        tension: 0.2, // Default calm
        energy: 0.2,
        palette: '#1e293b' // Midnight
    });

    const handleGenerate = async () => {
        if (!stanzaText.trim()) return;
        setIsAnalyzing(true);
        try {
            // Call Gemini
            const result = await analyzeTextSemantics(stanzaText);
            setSemantics(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-row bg-slate-900 overflow-hidden relative">

            {/* The Writing Desk (Text Environment) */}
            <div className="flex-1 max-w-[50%] flex flex-col relative bg-slate-950/80 border-r border-slate-800/50 p-10 shrink-0">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <PenTool size={20} />
                    </div>
                    <h2 className="text-xl font-bold tracking-wider text-slate-200 uppercase">The Writing Desk</h2>
                </div>

                <p className="text-slate-400 text-sm mb-4 tracking-wide leading-relaxed block">
                    Focus on the words. Write a single narrative unit or stanza.<br />
                    When you are ready, hit Generate Vision to preview its emotional translation.
                </p>

                <textarea
                    value={stanzaText}
                    onChange={(e) => setStanzaText(e.target.value)}
                    placeholder="Enter a line or stanza here..."
                    className="flex-1 w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 text-xl text-slate-200 font-serif leading-loose resize-none focus:outline-none focus:border-indigo-500 shadow-inner"
                />

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isAnalyzing}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 shadow-lg 
                            ${isAnalyzing
                                ? 'bg-indigo-600/50 text-indigo-300 cursor-wait'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-1'
                            }`}
                    >
                        {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                        <span>{isAnalyzing ? 'Translating Emotion...' : 'Generate Vision (G-3.1 AI)'}</span>
                    </button>
                </div>
            </div>

            {/* The Screening Room (Preview Pane) */}
            <div className="flex-1 flex flex-col relative items-center justify-center bg-slate-900 p-10">
                <div className="absolute top-10 left-10 flex flex-col gap-2 opacity-50">
                    <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">The Screening Room</h2>
                    <p className="text-xs text-slate-500 font-mono tracking-widest max-w-[200px]">
                        AI Parametric Model: G-3.1
                    </p>
                </div>

                {/* The Stage */}
                <div className="w-[500px] h-[500px] relative flex flex-col items-center justify-center p-8 bg-[#EAE8E3] rounded-sm shadow-2xl border border-[#D5D2CC] transition-all duration-1000">

                    {semantics ? (
                        <>
                            <div className="flex-1 w-full flex items-center justify-center mb-10 transition-colors duration-1000">
                                <ProceduralPerson
                                    tension={semantics.tension}
                                    energy={semantics.energy}
                                    color={semantics.palette}
                                />
                            </div>

                            {/* Subtle subtitle echoing the words */}
                            <div className="h-16 flex items-center justify-center w-[80%] opacity-80 border-t border-slate-300/50 pt-4">
                                <p className="text-[#3b3531] font-serif italic text-sm text-center leading-relaxed font-semibold">
                                    "{stanzaText.split('\n')[0]}..."
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-[#968e82] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                            <PenTool size={16} /> Awaiting Text
                        </p>
                    )}
                </div>

                {/* Real-time telemetry (Read Only) */}
                {semantics && (
                    <div className="absolute bottom-10 flex gap-12 font-mono text-[10px] text-slate-500 uppercase tracking-widest opacity-60">
                        <div>Tension: {(semantics.tension * 100).toFixed(0)}%</div>
                        <div>Energy: {(semantics.energy * 100).toFixed(0)}%</div>
                        <div>Code: {semantics.palette}</div>
                    </div>
                )}
            </div>

        </div>
    );
};
