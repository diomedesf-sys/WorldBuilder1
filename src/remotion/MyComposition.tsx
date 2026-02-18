import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, random } from 'remotion';
import type { VectorRow } from '../types';
import { SetupTransition, GlyphVerb, MotionSpeed, PrimitiveType, HumanPosture } from '../types';
import { GlyphPerson } from '../components/GlyphPerson';
import { PrimitiveComponents } from '../components/primitives';
import { calculateWaypointPosition } from './animation-utils';

interface MyCompositionProps {
    row: VectorRow;
}

export const MyComposition: React.FC<MyCompositionProps> = ({ row }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Duration in frames
    const durationInFrames = row.duration * fps;

    // --- 1. Speed Logic ---
    let speedDuration = durationInFrames;
    let speedMultiplier = 1;

    // Defined speeds: Slow=3s, Medium=1.5s, Fast=0.5s for the *Animation Cycle* usually
    // But here we might just map it to the intensity or speed of the loop/transition
    if (row.motion.speed === MotionSpeed.Fast) {
        speedMultiplier = 2; // Twice as fast
        speedDuration = fps * 0.5;
    } else if (row.motion.speed === MotionSpeed.Slow) {
        speedMultiplier = 0.5; // Half speed
        speedDuration = fps * 3;
    } else {
        speedDuration = fps * 1.5;
    }

    // --- 2. Setup Transition Logic (Entry) ---
    // Standardize transition time
    const transitionFrames = 30; // 1 second default 

    let containerOpacity = 1;
    let containerScale = 1;
    let containerY = 0;

    const tProgress = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });

    switch (row.motion.transition) {
        case SetupTransition.FadeIn:
            containerOpacity = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });
            break;
        case SetupTransition.FadeOut:
            // Starts visible, fades out (Note: Rare for "Setup", but implies exit behavior)
            containerOpacity = interpolate(frame, [0, transitionFrames], [1, 0], { extrapolateRight: 'clamp' });
            break;
        case SetupTransition.PopIn:
            containerScale = interpolate(frame, [0, transitionFrames], [0, 1], {
                extrapolateRight: 'clamp',
                easing: Easing.elastic(1)
            });
            break;
        case SetupTransition.SlideIn:
            containerY = interpolate(frame, [0, transitionFrames], [height, 0], {
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic)
            });
            break;
        case SetupTransition.PulseIn:
            containerScale = interpolate(frame, [0, transitionFrames], [0.5, 1], { extrapolateRight: 'clamp' });
            containerOpacity = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });
            break;
        case SetupTransition.Dissolve:
            // Linear fade
            containerOpacity = interpolate(frame, [0, transitionFrames * 2], [0, 1], { extrapolateRight: 'clamp' });
            break;
    }

    // --- 3. Glyph Verb Logic (Continuous or Action) ---

    // We calculate per-glyph modifiers
    // verbKeyframe is 0 to 1 over the 'speedDuration' or 'durationInFrames'
    const verbProgress = (frame % (speedDuration * 2)) / speedDuration; // Loops? Or single shot?
    // Let's make continuous verbs loop, and action verbs play once?
    // For simplicity, we drive mostly with `frame`.

    const getVerbTransforms = (index: number, total: number, baseX: number, baseY: number) => {
        let x = 0;
        let y = 0;
        let s = 1;
        let r = 0;
        let o = 1;

        const time = frame * speedMultiplier;

        switch (row.motion.verb) {
            case GlyphVerb.Emerge:
                // Gentle rise and settle
                y = interpolate(time, [0, 60], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
                o = interpolate(time, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
                break;

            case GlyphVerb.ApproachGather:
                // Start scattered, move to center/position
                // We assume 'baseX/Y' is the target. We add an offset that decreases.
                const spreadX = (random(index) - 0.5) * width * 0.5; // Random start offset
                const spreadY = (random(index + 100) - 0.5) * height * 0.5;
                const gatherProgress = interpolate(time, [0, speedDuration], [1, 0], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
                x = spreadX * gatherProgress;
                y = spreadY * gatherProgress;
                break;

            case GlyphVerb.CompressCrowd:
                // Move closer to center of *group* (simplified to screen center for now)
                // Actually, let's just scale spacing down.
                // We'll approximate by pulling towards [0.5, 0.5]
                // 0 = normal, 1 = compressed
                const compressFactor = interpolate(Math.sin(time * 0.05), [-1, 1], [0, 0.2]); // Oscillate compression
                // Calculate vector to center
                const dx = 0.5 * width - baseX;
                const dy = 0.5 * height - baseY;
                x = dx * compressFactor;
                y = dy * compressFactor;
                break;

            case GlyphVerb.ExpandRelease:
                // Reverse of compress - push away from center
                const expandFactor = interpolate(time, [0, speedDuration], [0, 0.3], { extrapolateRight: 'clamp' });
                const dx2 = baseX - 0.5 * width;
                const dy2 = baseY - 0.5 * height;
                x = dx2 * expandFactor;
                y = dy2 * expandFactor;
                break;

            case GlyphVerb.Pulse:
                // Scale up and down
                const pulse = Math.sin(time * 0.1);
                s = 1 + (pulse * 0.1);
                break;

            case GlyphVerb.CollapseImplode:
                // Rapidly suck into center and fade
                const implodeT = interpolate(time, [0, speedDuration], [0, 1], { extrapolateRight: 'clamp', easing: Easing.exp });
                const dx3 = 0.5 * width - baseX;
                const dy3 = 0.5 * height - baseY;
                x = dx3 * implodeT;
                y = dy3 * implodeT;
                o = 1 - implodeT;
                s = 1 - (implodeT * 0.5);
                break;

            case GlyphVerb.ScatterDisperse:
                // Start at pos, fly apart
                const scatterT = interpolate(time, [0, speedDuration], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) });
                const rx = (random(index) - 0.5) * width;
                const ry = (random(index + 50) - 0.5) * height;
                x = rx * scatterT;
                y = ry * scatterT;
                o = 1 - (scatterT * 0.5);
                break;

            case GlyphVerb.Oscillate:
                // Left/Right sway
                x = Math.sin(time * 0.1 + index) * 20;
                break;

            case GlyphVerb.EncircleSurround:
                // Rotate around center [0.5, 0.5]
                // We need to convert Cartesian to Polar, add angle, convert back.
                // Current pos relative to center:
                const cx = baseX - 0.5 * width;
                const cy = baseY - 0.5 * height;
                const angle = Math.atan2(cy, cx);
                const radius = Math.sqrt(cx * cx + cy * cy);
                const rotSpeed = time * 0.05; // rads
                const newAngle = angle + rotSpeed;

                const newCx = Math.cos(newAngle) * radius;
                const newCy = Math.sin(newAngle) * radius;

                x = newCx - cx;
                y = newCy - cy;
                break;

            case GlyphVerb.Static:
            default:
                break;
        }

        return { x, y, s, r, o };
    };


    return (
        <AbsoluteFill className="bg-white flex justify-center items-center overflow-hidden">

            {/* Background Grid/Noise (Optional) */}


            {/* Main Container applying Setup Transitions */}
            <div
                style={{
                    opacity: containerOpacity,
                    transform: `scale(${containerScale}) translateY(${containerY}px)`,
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            >
                {/* Shapes Layer */}
                {row.shapes.map((shape, idx) => {
                    const ShapeComponent = PrimitiveComponents[shape.type];
                    if (!ShapeComponent) return null;

                    // Apply simple pulse to shapes if verb is Pulse
                    let shapeScale = 1;
                    if (row.motion.verb === GlyphVerb.Pulse) {
                        shapeScale = 1 + (Math.sin(frame * 0.1 * speedMultiplier) * 0.05);
                    }

                    return (
                        <div
                            key={`shape - ${idx} `}
                            className="absolute inset-0"
                            style={{
                                transform: `scale(${shapeScale})`,
                                transformOrigin: `${shape.position[0] * 100}% ${shape.position[1] * 100}%`
                            }}
                        >
                            <ShapeComponent
                                size={shape.size}
                                position={shape.position}
                                rotation={shape.rotation}
                                fillColor="#64748b"
                                opacity={0.5}
                            />
                        </div>
                    );
                })}

                {/* Glyphs Layer */}
                {row.glyphs.map((glyph, idx) => {
                    // Calculate interpolated position based on Waypoints & Time
                    let currentPos = { x: glyph.position[0], y: glyph.position[1] };
                    if (glyph.waypoints && glyph.waypoints.length > 0) {
                        currentPos = calculateWaypointPosition(
                            { x: glyph.position[0], y: glyph.position[1] }, // Start Point
                            glyph.waypoints,
                            frame,
                            fps
                        );
                    }

                    const baseX = currentPos.x * width;
                    const baseY = currentPos.y * height;

                    const { x, y, s, r, o } = getVerbTransforms(idx, row.glyphs.length, baseX, baseY);

                    return (
                        <div
                            key={`glyph - ${idx} `}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform" // Optimized
                            style={{
                                left: baseX,
                                top: baseY,
                                transform: `translate(-50 %, -50 %) translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`,
                                opacity: o
                            }}
                        >
                            <GlyphPerson
                                posture={glyph.posture}
                                size={glyph.size}
                                faceColor={glyph.faceColor}
                            />
                        </div>
                    );
                })}

            </div>

            {/* Text Sync Layer - Configurable */}
            {(() => {
                const textConfig = row.textConfig || {
                    position: [0.5, 0.5],
                    motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn }
                };

                const textBaseX = textConfig.position[0] * width;
                const textBaseY = textConfig.position[1] * height;

                // Calculate Text Transition
                let textOpacity = 1;
                let textScale = 1;
                let textYOffset = 0;

                // Reuse transitionFrames constant
                const tProgress = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });

                switch (textConfig.motion.transition) {
                    case SetupTransition.FadeIn:
                        textOpacity = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });
                        break;
                    case SetupTransition.SlideIn:
                        textYOffset = interpolate(frame, [0, transitionFrames], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
                        textOpacity = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp' });
                        break;
                    case SetupTransition.PopIn:
                        textScale = interpolate(frame, [0, transitionFrames], [0, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1) });
                        break;
                    default:
                        // Default subtle fade
                        textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
                }

                // Calculate Text Verb (Motion)
                // We can reuse getVerbTransforms or simplify for text
                let verbX = 0;
                let verbY = 0;
                const time = frame * speedMultiplier; // Reuse speedMultiplier from row

                switch (textConfig.motion.verb) {
                    case GlyphVerb.Pulse:
                        textScale *= (1 + Math.sin(time * 0.05) * 0.05);
                        break;
                    case GlyphVerb.Oscillate:
                        verbX = Math.sin(time * 0.05) * 10;
                        break;
                    case GlyphVerb.Emerge:
                        verbY = interpolate(time, [0, 60], [20, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
                        break;
                }

                return (
                    <div
                        className="absolute flex flex-col items-center justify-center pointer-events-none z-50 p-12"
                        style={{
                            left: textBaseX,
                            top: textBaseY,
                            opacity: textOpacity,
                            transform: `translate(-50%, -50%) translate(${verbX}px, ${verbY + textYOffset}px) scale(${textScale})`,
                            width: 'auto',
                            maxWidth: '80%'
                        }}
                    >
                        <h2 className="text-black text-5xl font-light tracking-[0.2em] uppercase drop-shadow-sm text-center leading-relaxed">
                            {row.textSync.split('/').map((line, i) => (
                                <div key={i}>{line.trim()}</div>
                            ))}
                        </h2>
                    </div>
                );
            })()}


        </AbsoluteFill >
    );
};

