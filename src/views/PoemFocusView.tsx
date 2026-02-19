import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Smartphone } from 'lucide-react';
import type { VectorRow } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PoemFocusViewProps {
    vectorRows: VectorRow[];
    audioUrl?: string; // Optional for now
}

export const PoemFocusView: React.FC<PoemFocusViewProps> = ({ vectorRows, audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Default audio if none provided
    const effectiveAudioUrl = audioUrl || "https://actions.google.com/sounds/v1/science_fiction/scifi_drone_1.ogg";

    useEffect(() => {
        let animationFrame: number;
        const updateTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                if (!audioRef.current.paused) {
                    animationFrame = requestAnimationFrame(updateTime);
                }
            }
        };

        if (isPlaying) {
            animationFrame = requestAnimationFrame(updateTime);
        } else {
            cancelAnimationFrame(animationFrame);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Find active line based on time
    const activeIndex = useMemo(() => {
        // Find the row that starts <= currentTime
        // Note: This matches the *start* time.
        // We assume rows are sorted by timeStart.
        let active = -1;
        for (let i = 0; i < vectorRows.length; i++) {
            const row = vectorRows[i];
            const start = parseFloat(row.timeStart || "0");
            const duration = row.duration || 5; // Default duration
            const end = start + duration;

            if (currentTime >= start && currentTime < end) {
                active = i;
                break;
            }
        }
        return active;
    }, [vectorRows, currentTime]);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeIndex !== -1 && containerRef.current) {
            const activeElement = containerRef.current.children[activeIndex] as HTMLElement;
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [activeIndex]);

    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={effectiveAudioUrl}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Mobile Frame Simulation */}
            <div className="flex-1 max-w-md mx-auto w-full bg-slate-950 border-x border-slate-800 relative shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm z-20 absolute top-0 left-0 right-0">
                    <span className="text-white/50 text-xs font-mono uppercase tracking-widest">Focus Mode</span>
                    <Smartphone size={16} className="text-white/30" />
                </div>

                {/* Scrolling Content */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto scrollbar-hide py-[50vh] px-8 space-y-12"
                >
                    {vectorRows.map((row, idx) => {
                        const isActive = idx === activeIndex;
                        const isPast = activeIndex !== -1 && idx < activeIndex;

                        return (
                            <motion.div
                                key={row.beatId}
                                initial={{ opacity: 0.3, scale: 0.9 }}
                                animate={{
                                    opacity: isActive ? 1 : isPast ? 0.2 : 0.4,
                                    scale: isActive ? 1.1 : 0.95,
                                    y: isActive ? 0 : 0
                                }}
                                transition={{ duration: 0.5 }}
                                className={`flex flex-col items-center gap-6 transition-all duration-500 ${isActive ? 'brightness-150' : 'grayscale'}`}
                            >
                                {/* Glyph Container - Animated when active */}
                                <div className="h-24 w-24 relative flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Placeholder Glyph representation */}
                                    <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors duration-300
                                        ${isActive ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-900'}`}>
                                        <span className="text-xs font-mono text-slate-500">
                                            {/* Just show count for now or first shape */}
                                            {row.glyphs.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="text-center max-w-[280px]">
                                    <p className={`font-serif text-2xl leading-relaxed transition-colors duration-300
                                        ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-600'}`}>
                                        {row.notes || "(No text)"}
                                        {/* Assuming 'notes' contains the poem text snippet? 
                                           Wait, row.notes might be just notes. 
                                           The actual poem text is in 'poemData' but mapped to rows?
                                           Ideally vectorRows should have the text.
                                           Let's check 'textSync' field or 'notes'.
                                           Looking at provided types, VectorRow has 'textSync'.
                                           I'll use textSync first, fallback to notes.
                                         */}
                                        {row.textSync || row.notes}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Play/Pause CTA */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
                    <button
                        onClick={handlePlayPause}
                        className="pointer-events-auto flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                        <span>{isPlaying ? "Pause" : "Play Reel"}</span>
                    </button>
                </div>

                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
};
