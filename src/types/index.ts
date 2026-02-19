
export enum PrimitiveType {
    Line = 'Line',
    Curve = 'Curve',
    DoubleCurve = 'DoubleCurve',
    Circle = 'Circle',
    Square = 'Square',
    Triangle = 'Triangle',
    Rectangle = 'Rectangle',
    Concentric = 'Concentric',
}
export enum SizeLevel {
    S = 1,
    M = 2,
    L = 3,
    XL = 4,
    XXL = 5,
    XXXL = 6,
}

export enum GlyphVerb {
    Emerge = 'Emerge',
    ApproachGather = 'ApproachGather',
    CompressCrowd = 'CompressCrowd',
    ExpandRelease = 'ExpandRelease',
    Pulse = 'Pulse',
    CollapseImplode = 'CollapseImplode',
    ScatterDisperse = 'ScatterDisperse',
    Oscillate = 'Oscillate',
    EncircleSurround = 'EncircleSurround',
    Static = 'Static',
}

export enum MovementType {
    Linear = 'Linear',      // Standard straight line
    Walking = 'Walking',    // Slower, steady
    Running = 'Running',    // Faster, maybe bobbing
    Jumping = 'Jumping',    // Parabolic arc
    Teleport = 'Teleport',  // Instant move
    EaseInOut = 'EaseInOut' // Smooth start/stop
}

export enum MotionSpeed {
    Slow = 'Slow',
    Medium = 'Medium',
    Fast = 'Fast',
    Normal = 'Normal',
}

export enum SetupTransition {
    FadeIn = 'FadeIn',
    FadeOut = 'FadeOut',
    SlideIn = 'SlideIn',
    PopIn = 'PopIn',
    PulseIn = 'PulseIn',
    Dissolve = 'Dissolve',
    None = 'None'
}

export enum HumanPosture {
    Posture1 = 'Posture1',
    Posture2 = 'Posture2',
    Posture3 = 'Posture3',
    Posture4 = 'Posture4',
    Posture5 = 'Posture5',
    Posture6 = 'Posture6',
    Posture7 = 'Posture7',
    Posture8 = 'Posture8',
    Posture9 = 'Posture9',
    Equilibrium = 'Equilibrium',
}

export interface Waypoint {
    x: number;
    y: number;
    time: number; // The "Timer": relative seconds from start of scene (e.g., 3.5s)
    movement: MovementType; // The "Way they move" to this point
}

// Export a type for StoryboardRow (one row in Storyboard Table)
export interface StoryboardRow {
    id: string;
    beatId: number;
    linesCovered: string;
    imageType: 'Metaphor' | 'Literal' | 'Abstract' | 'Solo' | 'Conceptual' | 'Cluster' | 'Expansion' | 'Graphic';
    glyphCount: number;
    postures: HumanPosture[];
    faceColors: string[];
    shapesIntroduced: PrimitiveType[];
    glyphVerb: GlyphVerb;
    setupTransition: SetupTransition;
    intentPacing: string;
    sfxOverride?: string;
    sfxMute?: boolean; // Mute sound for this beat
}

// Export a type for VectorRow (one row in Vector Table)
export interface VectorRow {
    beatId: string;
    timeStart: string; // Changed from startTime to match usage
    duration: number;
    sfxOverride?: string; // Optional override for sound effect on this specific beat
    sfxMute?: boolean; // If true, no sound effect plays for this beat
    glyphs: Array<{
        count: number;
        posture: HumanPosture;
        position: [number, number]; // Initial position (Point A)
        size: SizeLevel;
        faceColor: string;
        waypoints?: Waypoint[]; // The movement path (Point B, C, etc.)
    }>;
    shapes: Array<{
        type: PrimitiveType;
        function: string;
        position: [number, number];
        size: SizeLevel;
        rotation: number;
    }>;
    compositionRule: string;
    motion: {
        verb: GlyphVerb;
        speed: MotionSpeed;
        transition: SetupTransition;
        easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
    };
    textSync: string;
    textConfig?: {
        position: [number, number];
        motion: {
            verb: GlyphVerb;
            speed: MotionSpeed;
            transition: SetupTransition;
        };
        scale?: number; // Optional scaling
        opacity?: number;
        isLocked?: boolean; // Default should be true
        fontFamily?: string;
        fontSize?: number;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        lineHeight?: number;
    };
    notes?: string;
}
// ... existing types ...

export interface GlyphState {
    count: number;
    posture: HumanPosture;
    faceColor: string;
    position: [number, number];
    size: SizeLevel;
    waypoints?: Waypoint[];
}

export interface ShapeState {
    type: PrimitiveType;
    function: string;
    position: [number, number];
    size: SizeLevel;
    rotation: number;
}

export interface SavedGlyph {
    id: string;
    name: string;
    glyphs: GlyphState[];
    shapes: ShapeState[];
    motion: {
        verb: GlyphVerb;
        speed: MotionSpeed;
        transition: SetupTransition;
    };
    compositionRule: string;
}

export type ViewName = 'dashboard' | 'poem' | 'storyboard' | 'vector' | 'preview' | 'thumbnail' | 'studio' | 'focus' | 'animation';

export interface AudioSettings {
    bgmUrl: string;
    bgmVolume: number;
    narrationUrl: string;
    narrationVolume: number;
    enableSfx: boolean;
    sfxUrl: string; // URL for the sound effect played at each scene transition
    sfxVolume: number;
}
