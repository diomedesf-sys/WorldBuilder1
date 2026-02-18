import type { StoryboardRow, VectorRow } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition, PrimitiveType, SizeLevel, HumanPosture } from '../types';

export const STANZA_34_STORYBOARD: StoryboardRow[] = [
    {
        id: 'sb-34-1',
        beatId: 1,
        linesCovered: '34-38',
        imageType: 'Conceptual',
        glyphCount: 3,
        postures: [HumanPosture.Posture2, HumanPosture.Posture2, HumanPosture.Posture2],
        faceColors: ['#8B4513', '#8B4513', '#8B4513'],
        shapesIntroduced: [PrimitiveType.Triangle],
        glyphVerb: GlyphVerb.ApproachGather,
        setupTransition: SetupTransition.SlideIn,
        intentPacing: 'Arrival of ships / directional movement - Steady'
    },
    {
        id: 'sb-34-2',
        beatId: 2,
        linesCovered: '39-44',
        imageType: 'Solo',
        glyphCount: 1,
        postures: [HumanPosture.Posture3],
        faceColors: ['#FFFFFF'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Oscillate,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Lookout / Discovery - Tension'
    },
    {
        id: 'sb-34-3',
        beatId: 3,
        linesCovered: '45-50',
        imageType: 'Metaphor',
        glyphCount: 5,
        postures: [HumanPosture.Posture1, HumanPosture.Posture5],
        faceColors: ['#D2691E', '#CD5C5C'],
        shapesIntroduced: [PrimitiveType.Rectangle],
        glyphVerb: GlyphVerb.ScatterDisperse,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Confusion / Exchange of goods and culture - Chaotic'
    }
];

export const STANZA_34_VECTOR: VectorRow[] = [
    {
        beatId: 'sb-34-1',
        timeStart: '0:00',
        duration: 8,
        glyphs: [
            { count: 1, posture: HumanPosture.Posture2, position: [0.2, 0.5], size: 3, faceColor: '#8B4513' },
            { count: 1, posture: HumanPosture.Posture2, position: [0.3, 0.4], size: 3, faceColor: '#8B4513' },
            { count: 1, posture: HumanPosture.Posture2, position: [0.1, 0.6], size: 3, faceColor: '#8B4513' }
        ],
        shapes: [{
            type: PrimitiveType.Triangle,
            function: 'Sails',
            position: [0.2, 0.2],
            size: 4,
            rotation: 90
        }],
        compositionRule: 'Directional Flow',
        motion: {
            verb: GlyphVerb.ApproachGather,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.SlideIn,
            easing: 'easeOut'
        },
        textSync: 'Del otro lado del mundo / Con el permiso del Rey',
        notes: 'Ships arriving from left to right'
    },
    {
        beatId: 'sb-34-2',
        timeStart: '0:08',
        duration: 6,
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture3,
            position: [0.7, 0.3],
            size: 4,
            faceColor: '#FFFFFF'
        }],
        shapes: [],
        compositionRule: 'Rule of Thirds',
        motion: {
            verb: GlyphVerb.Oscillate,
            speed: MotionSpeed.Medium,
            transition: SetupTransition.FadeIn,
            easing: 'easeInOut'
        },
        textSync: 'Se oyó a Rodrigo de Triana / Gritando con voz profunda',
        notes: 'High vantage point'
    },
    {
        beatId: 'sb-34-3',
        timeStart: '0:15',
        duration: 10,
        glyphs: Array(5).fill(null).map((_, i) => ({
            count: 1,
            posture: i % 2 === 0 ? HumanPosture.Posture1 : HumanPosture.Posture5,
            position: [0.5 + (Math.random() - 0.5) * 0.4, 0.5 + (Math.random() - 0.5) * 0.4] as [number, number],
            size: 2,
            faceColor: i % 2 === 0 ? '#D2691E' : '#CD5C5C'
        })),
        shapes: [{
            type: PrimitiveType.Rectangle,
            function: 'Exchange',
            position: [0.5, 0.5],
            size: SizeLevel.XXL,
            rotation: 45
        }],
        compositionRule: 'Scattered',
        motion: {
            verb: GlyphVerb.ScatterDisperse,
            speed: MotionSpeed.Fast,
            transition: SetupTransition.FadeIn,
            easing: 'easeOut'
        },
        textSync: 'Ellos trajeron la rueda / El hierro y los caballos',
        notes: 'Rapid introduction of elements'
    }
];
