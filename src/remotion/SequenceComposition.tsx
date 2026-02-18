import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio as RemotionAudio } from 'remotion';
import type { VectorRow, AudioSettings } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition, PrimitiveType, SizeLevel, HumanPosture } from '../types';
import { MyComposition } from './MyComposition';

export interface SequenceCompositionProps {
    rows: VectorRow[];
    audioSettings: AudioSettings;
}

export const SequenceComposition: React.FC<SequenceCompositionProps> = ({ rows, audioSettings }) => {
    const { fps } = useVideoConfig();

    let accumulatedFrames = 0;

    return (
        <AbsoluteFill className="bg-white">
            {/* 1. Global Background Music (BGM) */}
            {audioSettings.bgmUrl && (
                <RemotionAudio
                    src={audioSettings.bgmUrl}
                    volume={audioSettings.bgmVolume}
                    startFrom={0}
                />
            )}

            {/* 2. Global Narration / Voiceover (VO) */}
            {audioSettings.narrationUrl && (
                <RemotionAudio
                    src={audioSettings.narrationUrl}
                    volume={audioSettings.narrationVolume}
                />
            )}

            {rows.map((row, index) => {
                const sfxMuted = row.sfxMute;
                const sfxSrc = sfxMuted ? undefined : (row.sfxOverride || audioSettings.sfxUrl);
                const durationInFrames = Math.max(Math.floor(row.duration * fps), 1);
                const from = accumulatedFrames;
                accumulatedFrames += durationInFrames;

                return (
                    <React.Fragment key={`group-${row.beatId}-${index}`}>
                        {/* 3. Per-Row Sound Effects (SFX) */}
                        {audioSettings.enableSfx && sfxSrc && (
                            <Sequence from={from} durationInFrames={30}>
                                <RemotionAudio
                                    src={sfxSrc}
                                    volume={audioSettings.sfxVolume}
                                    startFrom={0}
                                />
                            </Sequence>
                        )}

                        {/* Visual Composition */}
                        <Sequence
                            from={from}
                            durationInFrames={durationInFrames}
                            layout="none"
                        >
                            <MyComposition row={row} />
                        </Sequence>
                    </React.Fragment>
                );
            })}
        </AbsoluteFill>
    );
};
