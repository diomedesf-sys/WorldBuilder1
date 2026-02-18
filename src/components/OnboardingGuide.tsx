
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Table, MonitorPlay, HelpCircle, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Simple Markdown Content
const HOW_TO_USE_CONTENT = `
# How to Use WorldBuilder

**WorldBuilder** is a tool for creating abstract narrative animations based on poetry.

### 1. Select a Stanza
- Go to the **Poem Source** view.
- Click on any stanza (e.g., *Line 1*, *Line 34*).
- This loads the initial data for that section.

### 2. Define Your Intent
- Switch to the **Storyboard Table**.
- For each beat, describe the **Intent/Pacing** (e.g., "Explosive movement", "Slow fade").
- This guides the emotional tone of the animation.

### 3. Generate & Preview
- Go to the **Preview** view.
- Watch the animation generated from your data.
- Adjust **Timing** and **Motion Verbs** in the Vector Table if needed.

### 4. Export
- When satisfied, use the **Export** tools to render a video file.
`;

export const OnboardingGuide: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showFullGuide, setShowFullGuide] = useState(false);

    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('wb_has_seen_guide');
        if (!hasSeenGuide) {
            setIsVisible(true);
        }
    }, []);

    // Expose a global event listener to re-open the guide
    useEffect(() => {
        const handleOpenHelp = () => {
            setIsVisible(true);
            setShowFullGuide(false);
        };
        window.addEventListener('wb_open_help', handleOpenHelp);
        return () => window.removeEventListener('wb_open_help', handleOpenHelp);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('wb_has_seen_guide', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {showFullGuide ? (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <button
                            onClick={() => setShowFullGuide(false)}
                            className="mb-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                        >
                            ← Back to Welcome
                        </button>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <ReactMarkdown>{HOW_TO_USE_CONTENT}</ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="p-8">
                        <h2 className="text-3xl font-light text-slate-100 mb-2 tracking-wide">Welcome to <span className="font-bold text-indigo-400">WorldBuilder</span></h2>
                        <p className="text-slate-400 mb-8 text-lg font-light leading-relaxed">
                            Create abstract, geometric narrative animations from poetry.
                        </p>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-indigo-500/10 rounded-xl h-fit">
                                    <BookOpen className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-200 mb-1">Click here to select a paragraph</h3>
                                    <p className="text-sm text-slate-500">Choose a stanza from the Poem Source to load its data.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-pink-500/10 rounded-xl h-fit">
                                    <Table className="text-pink-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-200 mb-1">Fill intent here</h3>
                                    <p className="text-sm text-slate-500">Describe the desired pacing and emotion in the Storyboard.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-blue-500/10 rounded-xl h-fit">
                                    <MonitorPlay className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-200 mb-1">Hit Generate to see motion</h3>
                                    <p className="text-sm text-slate-500">Watch your composition come to life in the Preview.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                            <button
                                onClick={() => setShowFullGuide(true)}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                <HelpCircle size={18} />
                                How to Use
                            </button>

                            <button
                                onClick={handleDismiss}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </div>
        </div>
    );
};
