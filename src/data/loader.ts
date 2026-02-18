
import type { StoryboardRow, VectorRow } from '../types';
import { GlyphVerb, MotionSpeed, SetupTransition, PrimitiveType, SizeLevel, HumanPosture } from '../types';
import { PARAGRAPH_1_STORYBOARD, PARAGRAPH_1_VECTOR } from './stanza1';
import { STANZA_34_STORYBOARD, STANZA_34_VECTOR } from './stanza34';
import { STANZA_100_STORYBOARD, STANZA_100_VECTOR } from './stanza100';
import { STANZA_199_STORYBOARD, STANZA_199_VECTOR } from './stanza199';

interface ParagraphData {
    storyRows: StoryboardRow[];
    vectorRows: VectorRow[];
}

const EMPTY_STORY_ROW: StoryboardRow = {
    id: 'placeholder-1',
    beatId: 1,
    linesCovered: '-',
    imageType: 'Abstract',
    glyphCount: 0,
    postures: [],
    faceColors: [],
    shapesIntroduced: [],
    glyphVerb: GlyphVerb.Static,
    setupTransition: SetupTransition.FadeIn,
    intentPacing: '-'
};

const EMPTY_VECTOR_ROW: VectorRow = {
    beatId: 'placeholder-1',
    timeStart: '0:00',
    duration: 5,
    glyphs: [],
    shapes: [],
    compositionRule: 'Center',
    motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Medium, transition: SetupTransition.FadeIn, easing: 'linear' },
    textSync: '',
    notes: ''
};

export const loadStanzaData = (lineId: number): ParagraphData => {
    // ID corresponds to the starting line number of the stanza
    switch (lineId) {
        case 1:
            return {
                storyRows: PARAGRAPH_1_STORYBOARD,
                vectorRows: PARAGRAPH_1_VECTOR
            };
        case 34:
            return {
                storyRows: STANZA_34_STORYBOARD,
                vectorRows: STANZA_34_VECTOR
            };
        case 100:
            return {
                storyRows: STANZA_100_STORYBOARD,
                vectorRows: STANZA_100_VECTOR
            };
        case 199:
            return {
                storyRows: STANZA_199_STORYBOARD,
                vectorRows: STANZA_199_VECTOR
            };
        default:
            return {
                storyRows: [EMPTY_STORY_ROW],
                vectorRows: [EMPTY_VECTOR_ROW]
            };
    }
};

export const loadInitialData = (): VectorRow[] => {
    return [
        {
            beatId: '1',
            timeStart: '0:00',
            duration: 5,
            glyphs: [
                {
                    count: 1,
                    posture: HumanPosture.Posture1,
                    size: SizeLevel.M,
                    position: [50, 50],
                    faceColor: '#ffffff'
                }
            ],
            shapes: [
                {
                    type: PrimitiveType.Circle,
                    function: 'Container',
                    position: [50, 50],
                    size: SizeLevel.M,
                    rotation: 0
                }
            ],
            motion: {
                verb: GlyphVerb.Static,
                speed: MotionSpeed.Normal,
                transition: SetupTransition.FadeIn,
                easing: 'linear'
            },
            textSync: '',
            compositionRule: 'Rule of Thirds'
        },
        {
            beatId: '2',
            timeStart: '0:05',
            duration: 5,
            glyphs: [
                {
                    count: 2,
                    posture: HumanPosture.Posture5,
                    size: SizeLevel.L,
                    position: [30, 50],
                    faceColor: '#ffffff'
                }
            ],
            shapes: [
                {
                    type: PrimitiveType.Square,
                    function: 'Ground',
                    position: [50, 80],
                    size: SizeLevel.L,
                    rotation: 0
                }
            ],
            motion: {
                verb: GlyphVerb.ApproachGather,
                speed: MotionSpeed.Slow,
                transition: SetupTransition.FadeIn,
                easing: 'easeInOut'
            },
            textSync: '',
            compositionRule: 'Centered'
        }
    ];
};
