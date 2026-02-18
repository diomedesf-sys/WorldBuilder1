import React from 'react';
import { Player } from '@remotion/player';
import { SequenceComposition } from '../remotion/SequenceComposition';
import type { SequenceCompositionProps } from '../remotion/SequenceComposition';
import type { VectorRow, StoryboardRow } from '../types';

import { Volume2, VolumeX } from 'lucide-react';

interface PreviewPlayerProps {
    rows: VectorRow[];
    width?: number;
    height?: number;
    fps?: number;
    autoPlay?: boolean;
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
    rows,
    width = 1280,
    height = 720,
    fps = 30,
    autoPlay = false
}) => {
    const [volume, setVolume] = React.useState(0.5);
    const [isMuted, setIsMuted] = React.useState(false);

    // Calculate total duration in frames
    const totalDurationInFrames = rows.reduce((acc, row) => {
        return acc + Math.max(Math.floor(row.duration * fps), 1);
    }, 0);

    // Fallback if no rows
    if (rows.length === 0) {
        return (
            <div className="flex items-center justify-center bg-slate-900 border border-slate-700 rounded-lg aspect-video text-slate-500">
                No data to preview
            </div>
        );
    }

    const effectiveVolume = isMuted ? 0 : volume;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-slate-700 bg-black relative">
                <Player
                    component={SequenceComposition as any}
                    inputProps={{ rows, narrationVolume: effectiveVolume }}
                    durationInFrames={totalDurationInFrames}
                    fps={fps}
                    compositionWidth={width}
                    compositionHeight={height}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    controls
                    autoPlay={autoPlay}
                    loop
                />
            </div>

            {/* Custom Audio Controls */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                    {effectiveVolume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono w-16">NARRATION</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            if (isMuted && parseFloat(e.target.value) > 0) setIsMuted(false);
                        }}
                        className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-emerald-400"
                    />
                    <span className="text-xs text-slate-500 font-mono w-8 text-right">
                        {Math.round(effectiveVolume * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PreviewPlayer;
