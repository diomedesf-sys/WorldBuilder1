
import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './MyComposition';
import { SequenceComposition } from './SequenceComposition'; // Import
import { TestGlyph, MOCK_TEST_ROW } from './TestGlyph';
import type { VectorRow } from '../types';
import { PrimitiveType, GlyphVerb, SetupTransition, MotionSpeed, HumanPosture, SizeLevel } from '../types';

// Mock Data for Preview that matches new VectorRow interface
const MOCK_ROW: VectorRow = {
    beatId: 'preview-1',
    timeStart: '0:00',
    duration: 10, // 10 seconds as requested
    glyphs: [{
        count: 1,
        posture: HumanPosture.Posture1,
        position: [0.5, 0.5],
        size: SizeLevel.L,
        faceColor: '#FFCC00'
    }],
    shapes: [{
        type: PrimitiveType.Circle,
        function: 'Halo',
        position: [0.5, 0.5],
        size: SizeLevel.L,
        rotation: 0
    }],
    compositionRule: 'Center',
    motion: {
        verb: GlyphVerb.Emerge,
        speed: MotionSpeed.Medium,
        transition: SetupTransition.FadeIn,
        easing: 'easeInOut'
    },
    textSync: 'In the beginning...',
    notes: 'Preview Animation Sequence',
};

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="WorldBuilderPreview"
                component={MyComposition as any}
                durationInFrames={300} // 10 seconds at 30fps
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    row: MOCK_ROW,
                }}
            />
            <Composition
                id="TestGlyph"
                component={TestGlyph as any}
                durationInFrames={300} // 10 seconds
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    row: MOCK_TEST_ROW,
                }}
            />
            <Composition
                id="FullSequence"
                component={SequenceComposition as any}
                durationInFrames={900} // Default 30s
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    rows: [MOCK_ROW], // Start with mock, override via inputProps
                }}
            />
        </>
    );
};
