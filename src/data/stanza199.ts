
import type { StoryboardRow, VectorRow } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition, PrimitiveType, SizeLevel, HumanPosture } from '../types';

export const STANZA_199_STORYBOARD: StoryboardRow[] = [
    {
        id: 'sb-199-1',
        beatId: 1,
        linesCovered: '199-204',
        imageType: 'Metaphor',
        glyphCount: 3,
        postures: [HumanPosture.Posture4, HumanPosture.Posture4, HumanPosture.Posture1],
        faceColors: ['#10B981', '#10B981', '#34D399'],
        shapesIntroduced: [PrimitiveType.Circle],
        glyphVerb: GlyphVerb.ExpandRelease,
        setupTransition: SetupTransition.Dissolve,
        intentPacing: 'New beginnings / Nature - Gentle'
    },
    {
        id: 'sb-199-2',
        beatId: 2,
        linesCovered: '205-210',
        imageType: 'Cluster',
        glyphCount: 6,
        postures: [HumanPosture.Posture1],
        faceColors: ['#059669'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.EncircleSurround,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Community / Connection - Flowing'
    }
];

export const STANZA_199_VECTOR: VectorRow[] = [
    {
        beatId: 'sb-199-1',
        timeStart: '0:00',
        duration: 8,
        glyphs: [
            { count: 1, posture: HumanPosture.Posture4, position: [0.4, 0.6], size: 3, faceColor: '#10B981' },
            { count: 1, posture: HumanPosture.Posture4, position: [0.6, 0.6], size: 3, faceColor: '#10B981' },
            { count: 1, posture: HumanPosture.Posture1, position: [0.5, 0.45], size: 2, faceColor: '#34D399' }
        ],
        shapes: [{
            type: PrimitiveType.Circle,
            function: 'Sun/Nature',
            position: [0.5, 0.5],
            size: SizeLevel.XXL,
            rotation: 0
        }],
        compositionRule: 'Circular',
        motion: {
            verb: GlyphVerb.ExpandRelease,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.Dissolve,
            easing: 'easeInOut'
        },
        textSync: 'El futuro de esta historia / nace con una familia',
        notes: 'Organic blooming motion'
    },
    {
        beatId: 'sb-199-2',
        timeStart: '0:08',
        duration: 8,
        glyphs: Array(6).fill(null).map((_, i) => ({
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.5 + Math.cos(i / 6 * Math.PI * 2) * 0.25, 0.5 + Math.sin(i / 6 * Math.PI * 2) * 0.25] as [number, number],
            size: 2,
            faceColor: '#059669'
        })),
        shapes: [],
        compositionRule: 'Radial Balance',
        motion: {
            verb: GlyphVerb.EncircleSurround,
            speed: MotionSpeed.Medium,
            transition: SetupTransition.FadeIn,
            easing: 'linear'
        },
        textSync: 'Comprendieron que la clave era volver a empezar',
        notes: 'Orbiting, connected movement'
    }
];
