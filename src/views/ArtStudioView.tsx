import React, { useState, useEffect } from 'react';
import { PencilShape } from '../components/PencilShape';

// --- Reusable Scene Components ---

const SCENE_DATA = [
    // Background Mountains
    { type: 'mountain_back', x: 0, y: 150, w: 200, h: 100 },
    // Huts (Bohios)
    { type: 'bohio_body', x: 40, y: 120, w: 50, h: 40 },
    { type: 'bohio_roof', x: 35, y: 90, w: 60, h: 30 },
    { type: 'bohio_body', x: 130, y: 110, w: 60, h: 50 },
    { type: 'bohio_roof', x: 120, y: 70, w: 80, h: 40 },
    // Nature
    { type: 'sun', x: 160, y: 30, r: 20 },
    { type: 'ground', x: 0, y: 150, w: 200, h: 50 },
    // People
    { type: 'person', x: 90, y: 140, posture: 'standing' },
    { type: 'person', x: 110, y: 145, posture: 'sitting' },
];

type StabilityLevel = 'stable' | 'balanced' | 'dynamic' | 'mixed';

const VillageScene: React.FC<{ stability: StabilityLevel; seed: number }> = ({ stability, seed }) => {

    // Helper to generate options based on stability level
    const getOptions = (baseColor: string, fillStyle: string = 'hachure', itemType?: string) => {
        // Base Bold Ink settings
        const base = { seed, stroke: '#1e1b4b', bowing: 1, fill: baseColor, fillStyle, fillWeight: 4 };

        if (stability === 'mixed') {
            // MIXED MODE: Static background, Living foreground
            // Check type to determine stability
            const isBackground = itemType === 'mountain_back' || itemType === 'ground' || itemType === 'sun';
            const isStructure = itemType?.startsWith('bohio');

            if (isBackground) {
                // Background: Very stable, almost frozen (Roughness 0.3)
                return { ...base, roughness: 0.3, bowing: 0.2, strokeWidth: 3.5, stroke: '#334155' };
            } else if (isStructure) {
                // Structures: Balanced (Roughness 1.0)
                return { ...base, roughness: 1.0, bowing: 0.5, strokeWidth: 3 };
            } else {
                // Living things: Dynamic (Roughness 2.5) to show life
                return { ...base, roughness: 2.5, bowing: 1.5, strokeWidth: 2.5 };
            }
        }

        switch (stability) {
            case 'stable':
                return { ...base, roughness: 0.5, bowing: 0.2, strokeWidth: 3.5, fillWeight: 3 };
            case 'balanced':
                return { ...base, roughness: 1.5, bowing: 1, strokeWidth: 3 };
            case 'dynamic':
                return { ...base, roughness: 3, bowing: 2, strokeWidth: 2.5 };
            default:
                return base;
        }
    };

    const renderElement = (item: any, idx: number) => {
        const uniqueSeed = seed + idx;
        const opts = (color: string, fill?: string) => ({ ...getOptions(color, fill, item.type), seed: uniqueSeed });

        if (item.type === 'mountain_back') {
            return <PencilShape key={idx} type="path" data="M-20 150 L 50 80 L 120 140 L 160 90 L 220 150 Z" options={opts('#94a3b8', 'hachure')} size={200} height={200} className="absolute opacity-50" />;
        }
        if (item.type === 'bohio_body') return <PencilShape key={idx} type="rectangle" data={[item.x, item.y, item.w, item.h]} options={opts('#ea580c')} size={200} height={200} className="absolute" />;
        if (item.type === 'bohio_roof') return <PencilShape key={idx} type="path" data={`M${item.x} ${item.y + item.h} L${item.x + item.w / 2} ${item.y} L${item.x + item.w} ${item.y + item.h} Z`} options={opts('#7f1d1d', 'hachure')} size={200} height={200} className="absolute" />;

        if (item.type === 'ground') {
            return <PencilShape key={idx} type="path" data={`M0 ${item.y} Q 100 ${item.y - 10} 200 ${item.y} V 200 H 0 Z`} options={opts('#15803d', 'hachure')} size={200} height={200} className="absolute opacity-60" />;
        }

        if (item.type === 'sun') return <PencilShape key={idx} type="circle" data={[item.x, item.y, item.r * 2]} options={opts('#fde047', 'zigzag')} size={200} height={200} className="absolute" />;

        if (item.type === 'person') {
            const personOpts = opts('transparent', 'solid');
            // If mixed, ensure we don't override the colour too much, but allow distinguishing
            if (stability !== 'mixed') personOpts.stroke = '#312e81';
            return <PencilShape key={idx} type="path" data={`M${item.x} ${item.y} l 0 -20 m -10 -10 l 10 10 l 10 -10 m -10 10 l 0 10 l -5 10 m 5 -10 l 5 10`} options={personOpts} size={200} height={200} className="absolute" />;
        }
        return null;
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Paper Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
            <div className="relative w-full h-full">
                {SCENE_DATA.map((item, idx) => renderElement(item, idx))}
            </div>
        </div>
    );
};


export const ArtStudioView: React.FC = () => {
    const [seed, setSeed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeed(Math.random());
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] text-slate-900 overflow-y-auto">
            <div className="p-6 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
                <h1 className="text-3xl font-serif text-slate-800 tracking-tight">Bold Ink: Directed Stability</h1>
                <p className="text-slate-500 mt-1 font-light">
                    We can control the "energy" of each element independently. <br />
                    Check out <span className="font-bold text-indigo-900">Option 2 (Mixed)</span>: Stable Mountains, Living People.
                </p>
            </div>

            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                {[
                    { id: 'balanced', label: '1. Global Balanced (Baseline)', desc: 'Everything boils at the same rate (Roughness 1.5). Consistent, but maybe flat.' },
                    { id: 'mixed', label: '2. Directed / Mixed (Proposed)', desc: 'Static Background (Roughness 0.3) + Dynamic Foreground (Roughness 2.5). Creates depth and focus.', recommended: true },
                ].map((style) => (
                    <div key={style.id} className={`p-6 rounded-xl shadow-md border ${style.recommended ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'} hover:shadow-lg transition-shadow relative overflow-hidden group`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-900">{style.label}</h3>
                            {style.recommended && <span className="bg-indigo-900 text-white text-xs px-2 py-1 rounded-full font-semibold">Recommended</span>}
                        </div>
                        <div className="h-64 rounded-lg border border-slate-300 relative overflow-hidden bg-white shadow-inner">
                            <VillageScene stability={style.id as any} seed={seed} />
                        </div>
                        <p className="text-sm mt-4 text-slate-600 leading-relaxed">{style.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
