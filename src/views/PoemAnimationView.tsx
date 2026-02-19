import React, { useState, useEffect } from 'react';
import { PoemScene, PoemSceneType } from '../components/PoemScene';
import { Play, Pause, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

const STANZA_1 = [
    { text: "Todo empezó en un instante", scene: 'creation' },
    { text: "Nació con YaYá", scene: 'yaya' },
    { text: "Espíritu material y espíritu inmaterial", scene: 'yaya' },
    { text: "YaYa quería a su hijo Yayael", scene: 'bones' },
    { text: "Y lo mató", scene: 'bones' },
    { text: "Y puso una tinaja con los huesos de su hijo", scene: 'bones' },
    { text: "Y la colgó en su casa", scene: 'bones' },
    { text: "Un día se cayó la tinaja", scene: 'sea' },
    { text: "Y el agua del mar cubrió la tierra", scene: 'sea' },
    { text: "De ahí salieron los peces", scene: 'sea' },
    { text: "Y la gente que vivía en cuevas...", scene: 'caves' }
];

export const PoemAnimationView: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [seed, setSeed] = useState(0);

    // Boiling effect loop - DISABLED FOR STABILITY CHECK
    /*
    useEffect(() => {
        const interval = setInterval(() => {
            setSeed(Math.random());
        }, 200); 
        return () => clearInterval(interval);
    }, []);
    */

    // Auto-advance loop
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= STANZA_1.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 3000); // 3 seconds per line
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const currentLine = STANZA_1[currentIndex];
    const progress = ((currentIndex + 1) / STANZA_1.length) * 100;

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex justify-between items-center z-10">
                <div>
                    <h1 className="text-xl font-serif text-slate-800 tracking-tight">Stanza 1: Creation</h1>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">BOLD INK STYLE • DIRECTED STABILITY</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentIndex(0)} className="p-2 hover:bg-slate-100 rounded-full" title="Restart">
                        <RefreshCw size={18} className="text-slate-600" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${isPlaying ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play Sequence</>}
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">

                {/* Paper Background Wrapper */}
                <div className="relative w-full max-w-4xl aspect-video bg-white shadow-2xl rounded-sm border-8 border-white overflow-hidden flex items-center justify-center">

                    {/* The Scene */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#fdfdfd]">
                        <PoemScene
                            scene={currentLine.scene as PoemSceneType}
                            stability="mixed"
                            seed={seed}
                            width={800}
                            height={450}
                        />
                    </div>

                    {/* Subtitles Overlay */}
                    <div className="absolute bottom-12 left-0 right-0 text-center px-12">
                        <p className="text-2xl md:text-3xl font-serif font-bold text-slate-800 drop-shadow-md bg-white/80 backdrop-blur-sm inline-block px-6 py-3 rounded-lg border border-slate-200/50">
                            {currentLine.text}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex items-center gap-4">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                        className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="font-mono text-sm text-slate-400">
                        {currentIndex + 1} / {STANZA_1.length}
                    </span>

                    <button
                        disabled={currentIndex === STANZA_1.length - 1}
                        onClick={() => setCurrentIndex(c => Math.min(STANZA_1.length - 1, c + 1))}
                        className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
