import type { StoryboardRow, VectorRow } from '../types';
import { GlyphVerb, SetupTransition, MotionSpeed, HumanPosture, PrimitiveType, SizeLevel } from '../types';

export const PARAGRAPH_1_STORYBOARD: StoryboardRow[] = [
    {
        id: 'sb-1',
        beatId: 1,
        linesCovered: '1-3',
        imageType: 'Solo',
        glyphCount: 1,
        postures: [HumanPosture.Posture1],
        faceColors: ['#4A4A4A'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Emerge,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Establish singularity / origin – Slow'
    },
    {
        id: 'sb-2',
        beatId: 2,
        linesCovered: '4-7',
        imageType: 'Conceptual',
        glyphCount: 2,
        postures: [HumanPosture.Posture2, HumanPosture.Posture3],
        faceColors: ['#4A4A4A', '#4A4A4A'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.ApproachGather,
        setupTransition: SetupTransition.SlideIn,
        intentPacing: 'Present competing creation narratives – Moderate'
    },
    {
        id: 'sb-3',
        beatId: 3,
        linesCovered: '8-12',
        imageType: 'Solo',
        glyphCount: 1,
        postures: [HumanPosture.Posture1],
        faceColors: ['#8B5A2B'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Pulse,
        setupTransition: SetupTransition.PopIn,
        intentPacing: 'Name the origin figure / duality – Pause'
    },
    {
        id: 'sb-4',
        beatId: 4,
        linesCovered: '13-17',
        imageType: 'Cluster',
        glyphCount: 2,
        postures: [HumanPosture.Posture2, HumanPosture.Posture5],
        faceColors: ['#8B5A2B', '#D3D3D3'],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Pulse,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Duality of material / immaterial – Measured'
    },
    {
        id: 'sb-5',
        beatId: 5,
        linesCovered: '18-22',
        imageType: 'Cluster',
        glyphCount: 1,
        postures: [HumanPosture.Posture1],
        faceColors: ['#2F2F2F'],
        shapesIntroduced: [PrimitiveType.Rectangle],
        glyphVerb: GlyphVerb.CompressCrowd,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: 'Sacrifice / origin through loss – Slow'
    },
    {
        id: 'sb-6',
        beatId: 6,
        linesCovered: '23-27',
        imageType: 'Expansion',
        glyphCount: 8,
        postures: [HumanPosture.Posture5],
        faceColors: ['#007799'],
        shapesIntroduced: [PrimitiveType.Concentric],
        glyphVerb: GlyphVerb.ExpandRelease,
        setupTransition: SetupTransition.Dissolve,
        intentPacing: 'Life / abundance emerge – Expansive'
    },
    {
        id: 'sb-7',
        beatId: 7,
        linesCovered: '28-33',
        imageType: 'Cluster',
        glyphCount: 6,
        postures: [HumanPosture.Posture1],
        faceColors: ['#5C4033'],
        shapesIntroduced: [PrimitiveType.Concentric],
        glyphVerb: GlyphVerb.EncircleSurround,
        setupTransition: SetupTransition.PulseIn,
        intentPacing: 'Vulnerability / humility before nature – Quiet'
    }
];

export const PARAGRAPH_1_VECTOR: VectorRow[] = [
    {
        beatId: 'sb-1',
        timeStart: '0:00',
        duration: 6, // Extended for ceremonial opening
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.5, 0.5],
            size: 3,
            faceColor: '#4A4A4A'
        }],
        shapes: [],
        compositionRule: 'Center',
        motion: {
            verb: GlyphVerb.Emerge,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.FadeIn,
            easing: 'easeInOut'
        },
        textSync: 'Todo empezó en un instante',
        notes: 'Large negative space, silence'
    },
    {
        beatId: 'sb-2',
        timeStart: '0:06',
        duration: 7, // Extended to give time to read competing narratives
        glyphs: [
            { count: 1, posture: HumanPosture.Posture2, position: [0.4, 0.5], size: 3, faceColor: '#4A4A4A' },
            { count: 1, posture: HumanPosture.Posture3, position: [0.6, 0.5], size: 3, faceColor: '#4A4A4A' }
        ],
        shapes: [],
        compositionRule: 'Balanced Opposition',
        motion: {
            verb: GlyphVerb.ApproachGather,
            speed: MotionSpeed.Slow, // Slowed down
            transition: SetupTransition.SlideIn,
            easing: 'easeOut'
        },
        textSync: 'Dicen que con explosión / Otros que con un soplido',
        notes: 'Mirror symmetry, slight tension'
    },
    {
        beatId: 'sb-3',
        timeStart: '0:13',
        duration: 4,
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.5, 0.5],
            size: 3,
            faceColor: '#8B5A2B'
        }],
        shapes: [],
        compositionRule: 'Center',
        motion: {
            verb: GlyphVerb.Pulse,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.PopIn,
            easing: 'easeIn'
        },
        textSync: 'Aquí nació con YaYá',
        notes: 'Pause after name, reverence'
    },
    {
        beatId: 'sb-4',
        timeStart: '0:17',
        duration: 5,
        glyphs: [
            { count: 1, posture: HumanPosture.Posture2, position: [0.45, 0.5], size: 3, faceColor: '#8B5A2B' },
            { count: 1, posture: HumanPosture.Posture5, position: [0.55, 0.5], size: 3, faceColor: '#D3D3D3' }
        ],
        shapes: [],
        compositionRule: 'Horizontal Symmetry',
        motion: {
            verb: GlyphVerb.Pulse,
            speed: MotionSpeed.Medium,
            transition: SetupTransition.FadeIn,
            easing: 'easeOut'
        },
        textSync: 'Espíritu material y espíritu inmaterial',
        notes: 'Duality breathing, gentle oscillation'
    },
    {
        beatId: 'sb-5',
        timeStart: '0:22',
        duration: 8, // Heavy pause
        glyphs: [{
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.5, 0.65],
            size: 3,
            faceColor: '#2F2F2F'
        }],
        shapes: [{
            type: PrimitiveType.Rectangle,
            function: 'Container',
            position: [0.5, 0.35],
            size: 3,
            rotation: 0
        }],
        compositionRule: 'Vertical Stack',
        motion: {
            verb: GlyphVerb.CompressCrowd,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.FadeIn,
            easing: 'easeIn'
        },
        textSync: 'Que colgó sobre su cama una tinaja / Con los huesos de su hijo',
        notes: 'Heavy descent, emotional weight'
    },
    {
        beatId: 'sb-6',
        timeStart: '0:30',
        duration: 10, // Expansive bloom
        glyphs: Array(8).fill(null).map((_, i) => ({
            count: 1,
            posture: HumanPosture.Posture5,
            position: [0.5 + Math.cos(i / 8 * Math.PI * 2) * 0.3, 0.5 + Math.sin(i / 8 * Math.PI * 2) * 0.3] as [number, number],
            size: 2,
            faceColor: '#007799'
        })),
        shapes: [{
            type: PrimitiveType.Concentric,
            function: 'Water Mass',
            position: [0.5, 0.5],
            size: 5,
            rotation: 0
        }],
        compositionRule: 'Radial Expansion',
        motion: {
            verb: GlyphVerb.ExpandRelease,
            speed: MotionSpeed.Medium,
            transition: SetupTransition.Dissolve,
            easing: 'easeOut'
        },
        textSync: 'De ahí salieron los peces / Y toda el agua del mar',
        notes: 'Bloom feeling, abundance'
    },
    {
        beatId: 'sb-7',
        timeStart: '0:40',
        duration: 7,
        glyphs: Array(6).fill(null).map((_, i) => ({
            count: 1,
            posture: HumanPosture.Posture1,
            position: [0.4 + (i % 2) * 0.2, 0.4 + Math.floor(i / 2) * 0.1] as [number, number],
            size: 2,
            faceColor: '#5C4033'
        })),
        shapes: [{
            type: PrimitiveType.Concentric,
            function: 'Cave Darkness',
            position: [0.5, 0.5],
            size: 4,
            rotation: 0
        }],
        compositionRule: 'Compressed Inward',
        motion: {
            verb: GlyphVerb.EncircleSurround,
            speed: MotionSpeed.Slow,
            transition: SetupTransition.PulseIn,
            easing: 'easeIn'
        },
        textSync: 'Gentes que vivían en cuevas / Y temían a Juracán',
        notes: 'Quiet close, latent fear, slight tremble'
    }
];
