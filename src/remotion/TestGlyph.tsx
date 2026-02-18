import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { PNSCircle } from '../components/primitives'; // Ensuring lowercase 'primitives' folder import
import { HumanPosture, SizeLevel, GlyphVerb, MotionSpeed, SetupTransition } from '../types';
import type { VectorRow } from '../types';

// Define the Props interface
interface TestGlyphProps {
    row?: VectorRow; // Optional to satisfy "defaultProps" behavior in some Remotion contexts, though strictly should be passed
}

// Default Mock Data
export const MOCK_TEST_ROW: VectorRow = {
    beatId: 'test-1',
    timeStart: '0:00',
    duration: 5,
    glyphs: [{
        count: 1,
        posture: HumanPosture.Posture1,
        position: [0.5, 0.5],
        size: SizeLevel.L,
        faceColor: '#FFFFFF'
    }],
    shapes: [],
    compositionRule: 'Center',
    motion: {
        verb: GlyphVerb.Static,
        speed: MotionSpeed.Medium,
        transition: SetupTransition.None,
        easing: 'linear'
    },
    textSync: 'Test',
    notes: 'Test Glyph'
};

export const TestGlyph: React.FC<TestGlyphProps> = ({ row = MOCK_TEST_ROW }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animation Parameters
    const durationInSeconds = 2;
    const durationInFrames = durationInSeconds * fps;

    // Emerge Animation: Opacity 0->1, Scale 0.8->1
    const opacity = interpolate(
        frame,
        [0, durationInFrames],
        [0, 1],
        { extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) }
    );

    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [0.8, 1],
        { extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) }
    );

    return (
        <AbsoluteFill className="bg-slate-950 flex items-center justify-center">
            <div style={{
                transform: `scale(${scale})`,
                opacity: opacity,
                width: '100%',
                height: '100%',
                position: 'relative'
            }}>
                <PNSCircle
                    size={3}
                    position={[0.5, 0.5]}
                    rotation={0}
                    fillColor="#10b981"
                    opacity={1}
                />
            </div>

            <div className="absolute bottom-10 left-10 text-white font-mono text-sm opacity-50">
                Frame: {frame} / {durationInFrames} (Animation Window)<br />
                Opacity: {opacity.toFixed(2)}<br />
                Scale: {scale.toFixed(2)}
            </div>
        </AbsoluteFill>
    );
};
