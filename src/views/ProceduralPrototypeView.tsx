import React, { useState } from 'react';
import { ProceduralPerson } from '../components/ProceduralPerson';
import { SlidersHorizontal, Eye } from 'lucide-react';

export const ProceduralPrototypeView = () => {
    const [tension, setTension] = useState(0.2);
    const [energy, setEnergy] = useState(0.5);
    const [alignment, setAlignment] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [colorPalette, setColorPalette] = useState<'midnight' | 'dawn' | 'void' | 'ember'>('dawn');

    return (
        <div className="h-full w-full flex flex-col bg-slate-900 overflow-hidden relative">
            <div className="flex-1 flex w-full relative">

                {/* Play Area / Canvas */}
                <div className="flex-1 flex flex-col relative items-center justify-center bg-slate-950/50">
                    <div className="absolute top-4 left-6 flex items-center gap-2 text-indigo-400 opacity-70">
                        <Eye size={20} />
                        <span className="font-semibold tracking-wide uppercase text-sm">G-3.1 Prototype Matrix</span>
                    </div>

                    <div className="w-[400px] h-[400px] relative flex items-center justify-center p-8 bg-[#EAE8E3] rounded-sm shadow-md border border-[#D5D2CC]">
                        <ProceduralPerson
                            tension={tension}
                            energy={energy}
                            color={colorPalette === 'midnight' ? '#1e293b' : colorPalette === 'void' ? '#2e1065' : colorPalette === 'ember' ? '#7c2d12' : '#334155'}
                        />
                    </div>
                </div>
            </div>

            {/* Controls Sidebar */}
            <div className="w-80 bg-slate-950/80 border-l border-slate-800/50 flex flex-col p-6 z-10 backdrop-blur-xl shrink-0 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <SlidersHorizontal size={20} />
                    </div>
                    <h2 className="text-xl font-bold tracking-wider text-slate-200 uppercase">Parameters</h2>
                </div>

                <div className="space-y-8">
                    {/* Tension */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tension</label>
                            <span className="text-xs font-mono text-indigo-400">{tension.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={tension} onChange={(e) => setTension(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <p className="text-[10px] text-slate-500 uppercase">Controls chaos and organic noise.</p>
                    </div>

                    {/* Energy */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Energy</label>
                            <span className="text-xs font-mono text-emerald-400">{energy.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={energy} onChange={(e) => setEnergy(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 uppercase">Controls speed, thickness, and glow.</p>
                    </div>

                    {/* Alignment */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alignment / Rotation</label>
                            <span className="text-xs font-mono text-amber-400">{alignment}°</span>
                        </div>
                        <input
                            type="range" min="0" max="360" step="1"
                            value={alignment} onChange={(e) => setAlignment(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <p className="text-[10px] text-slate-500 uppercase">Global angle offset.</p>
                    </div>

                    {/* ScaleFactor */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scale</label>
                            <span className="text-xs font-mono text-pink-400">{scaleFactor.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={scaleFactor} onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">Palette</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['dawn', 'void', 'midnight', 'ember'].map(pal => (
                                <button
                                    key={pal}
                                    onClick={() => setColorPalette(pal as any)}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                      ${colorPalette === pal
                                            ? 'bg-slate-800 text-white border border-slate-600'
                                            : 'bg-slate-900/50 text-slate-500 border border-slate-800/50 hover:bg-slate-800/80 hover:text-slate-300'
                                        }`}
                                >
                                    {pal}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
