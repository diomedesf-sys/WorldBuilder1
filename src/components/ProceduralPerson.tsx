import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProceduralPersonProps {
    tension: number; // 0 (relaxed) to 1 (aggressive/tense)
    energy: number;  // 0 (still) to 1 (vibrating/active)
    color?: string;
}

export const ProceduralPerson: React.FC<ProceduralPersonProps> = ({
    tension,
    energy,
    color = '#cbd5e1'
}) => {
    // Center of our 100x100 viewport
    const centerC = { x: 50, y: 50 };

    // Calculate Skeleton (Inverse Kinematics based on Tension)

    // Head & Spine
    const headPos = { x: 50, y: 15 + tension * 5 }; // Head tucks down when tense
    const spineTop = { ...headPos, y: headPos.y + 10 };
    const spineBottom = { x: 50, y: 55 };

    // Arms
    const shoulderWidth = 12 - tension * 4; // Shoulders bunch up when tense
    const shoulderL = { x: 50 - shoulderWidth, y: spineTop.y + 2 - tension * 3 };
    const shoulderR = { x: 50 + shoulderWidth, y: spineTop.y + 2 - tension * 3 };

    // Calculate arm angles
    // Relaxed: Arms down. Tense: Arms bent upwards
    const armLength = 15;
    const leftElbowAngle = tension * Math.PI * 0.8 + Math.PI * 0.1; // swings out and up
    const leftHandAngle = tension * Math.PI - Math.PI * 0.2;

    const elbowL = {
        x: shoulderL.x - Math.sin(leftElbowAngle) * armLength,
        y: shoulderL.y + Math.cos(leftElbowAngle) * armLength
    };
    const handL = {
        x: elbowL.x - Math.sin(leftHandAngle) * armLength,
        y: elbowL.y + Math.cos(leftHandAngle) * armLength
    };

    const rightElbowAngle = -tension * Math.PI * 0.8 - Math.PI * 0.1;
    const rightHandAngle = -tension * Math.PI + Math.PI * 0.2;

    const elbowR = {
        x: shoulderR.x - Math.sin(rightElbowAngle) * armLength,
        y: shoulderR.y + Math.cos(rightElbowAngle) * armLength
    };
    const handR = {
        x: elbowR.x - Math.sin(rightHandAngle) * armLength,
        y: elbowR.y + Math.cos(rightHandAngle) * armLength
    };

    // Legs
    const hipWidth = 6;
    const hipL = { x: 50 - hipWidth, y: spineBottom.y };
    const hipR = { x: 50 + hipWidth, y: spineBottom.y };

    const legLength = 18;
    const squarTension = tension * tension; // Exponential bends for legs

    const leftKneeAngle = squarTension * Math.PI * 0.5 + Math.PI * 0.1;
    const kneeL = {
        x: hipL.x - Math.sin(leftKneeAngle) * legLength,
        y: hipL.y + Math.cos(leftKneeAngle) * legLength
    };
    const footL = {
        x: kneeL.x,
        y: kneeL.y + legLength
    };

    const rightKneeAngle = -squarTension * Math.PI * 0.5 - Math.PI * 0.1;
    const kneeR = {
        x: hipR.x - Math.sin(rightKneeAngle) * legLength,
        y: hipR.y + Math.cos(rightKneeAngle) * legLength
    };
    const footR = {
        x: kneeR.x,
        y: kneeR.y + legLength
    };

    // Compile Path Data
    // We draw the stick figure as a single continuous line where possible, or separate grouped strokes
    const createPath = (points: { x: number, y: number }[]) =>
        `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

    const bodyPath = createPath([spineTop, spineBottom]);
    const leftArmPath = createPath([spineTop, shoulderL, elbowL, handL]);
    const rightArmPath = createPath([spineTop, shoulderR, elbowR, handR]);
    const leftLegPath = createPath([spineBottom, hipL, kneeL, footL]);
    const rightLegPath = createPath([spineBottom, hipR, kneeR, footR]);

    const springConfig = { type: 'spring' as const, stiffness: 120, damping: 14 };

    // "Wooden Pencil" aesthetic settings
    // The higher the energy, the more the pencil strokes jitter and multiply
    const jitterFreq = energy > 0.5 ? 0.1 : 0.05;

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* SVG Filters for "Petroglyph / Pencil" organic look */}
            <defs>
                <filter id="pencil-texture">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={0.08 + energy * 0.1}
                        numOctaves="3"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={2 + energy * 4}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="glow-ambient">
                    <feGaussianBlur stdDeviation={energy * 2} result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <motion.g
                filter="url(#pencil-texture) url(#glow-ambient)"
                stroke={color}
                strokeWidth={1.5 + energy * 0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            >
                {/* We double the strokes slightly if energy is high to create a sketchy overlay effect */}
                {[0, 1].map((layerIndex) => (
                    <motion.g
                        key={`layer-${layerIndex}`}
                        opacity={layerIndex === 1 ? energy * 0.5 : 1}
                        animate={{
                            x: layerIndex === 1 ? [0, energy * 2, -energy * 2, 0] : 0,
                            y: layerIndex === 1 ? [0, -energy * 2, energy * 2, 0] : 0,
                        }}
                        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
                    >
                        {/* SKELETON */}
                        <motion.path d={bodyPath} animate={{ d: bodyPath }} transition={springConfig} />
                        <motion.path d={leftArmPath} animate={{ d: leftArmPath }} transition={springConfig} />
                        <motion.path d={rightArmPath} animate={{ d: rightArmPath }} transition={springConfig} />
                        <motion.path d={leftLegPath} animate={{ d: leftLegPath }} transition={springConfig} />
                        <motion.path d={rightLegPath} animate={{ d: rightLegPath }} transition={springConfig} />

                        {/* HEAD */}
                        <motion.circle
                            cx={headPos.x}
                            cy={headPos.y}
                            r={7}
                            animate={{ cx: headPos.x, cy: headPos.y }}
                            transition={springConfig}
                        />
                    </motion.g>
                ))}

            </motion.g>

            {/* Vibration/Shaking for high energy */}
            {energy > 0.8 && (
                <motion.circle
                    cx={centerC.x}
                    cy={centerC.y}
                    r={45}
                    stroke={color}
                    strokeWidth={0.5}
                    fill="none"
                    opacity={0.3}
                    style={{ transformOrigin: '50px 50px' }}
                    animate={{ scale: [1, 1.05, 0.95, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
                    filter="url(#pencil-texture)"
                />
            )}
        </svg>
    );
};
