
import type { StoryboardRow, VectorRow } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition, PrimitiveType, SizeLevel, HumanPosture } from '../types';

export const STANZA_100_STORYBOARD: StoryboardRow[] = [
    {
        id: 'sb-100-1',
        beatId: 1,
        linesCovered: '100-105',
        imageType: 'Graphic',
        glyphCount: 1,
        postures: [HumanPosture.Posture1],
        faceColors: ['#FF0000'],
        shapesIntroduced: [PrimitiveType.Line],
        glyphVerb: GlyphVerb.Pulse,
        setupTransition: SetupTransition.PopIn,
        intentPacing: 'Demarcation / Division - Sharp'
    },
    {
        id: 'sb-100-2',
        beatId: 2,
        linesCovered: '106-110',
        imageType: 'Cluster',
        glyphCount: 4,
        postures: [HumanPosture.Posture5],
        faceColors: ['#333333'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.CompressCrowd,
        setupTransition: SetupTransition.SlideIn,
        intentPacing: 'Oppression / Conflict - Heavy'
    }
];

export const STANZA_100_VECTOR: VectorRow[] = [
    {
        beatId: 'sb-100-1',
        timeStart: '0:00',
        duration: 5,
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.5, 0.5],
            size: 3,
            faceColor: '#FF0000'
        }],
        shapes: [
            { type: PrimitiveType.Line, function: 'Border', position: [0.5, 0.2], size: 5, rotation: 0 },
            { type: PrimitiveType.Line, function: 'Border', position: [0.5, 0.8], size: 5, rotation: 0 }
        ],
        compositionRule: 'Vertical Split',
        motion: {
            verb: GlyphVerb.Pulse,
            speed: MotionSpeed.Fast,
            transition: SetupTransition.PopIn,
            easing: 'linear'
        },
        textSync: 'El principio del presente comienza en el siglo XX',
        notes: 'Sharp, rigid lines'
    },
    {
        beatId: 'sb-100-2',
        timeStart: '0:05',
        duration: 7,
        glyphs: Array(4).fill(null).map((_, i) => ({
            count: 1,
            posture: HumanPosture.Posture5,
            position: [0.3 + i * 0.13, 0.6] as [number, number],
            size: 2,
            faceColor: '#333333'
        })),
        shapes: [],
        compositionRule: 'Low Horizon',
        motion: {
            verb: GlyphVerb.CompressCrowd,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.SlideIn,
            easing: 'easeIn'
        },
        textSync: 'Cuando un grupo decidió demarcar todas las tierras',
        notes: 'Feeling of weight and boundary'
    }
];
