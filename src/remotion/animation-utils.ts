import { interpolate, Easing } from 'remotion';
import { MovementType } from '../types';
import type { Waypoint } from '../types';

interface Point {
    x: number;
    y: number;
}

interface Keyframe {
    frame: number;
    value: Point;
    movement: MovementType;
}

/**
 * Calculates the interpolated position of a glyph based on its waypoints and current frame.
 * Returns null if no waypoints or outside valid range (optional, can return start/end).
 */
export const calculateWaypointPosition = (
    startPos: Point,
    waypoints: Waypoint[],
    currentFrame: number,
    fps: number
): Point => {
    if (!waypoints || waypoints.length === 0) {
        return startPos;
    }

    // 1. Build a sorted list of all keyframes including the start point
    const frames: Keyframe[] = [
        {
            frame: 0,
            value: startPos,
            movement: MovementType.Linear // Initial movement out of start
        },
        ...waypoints.map(wp => ({
            frame: Math.round(wp.time * fps),
            value: { x: wp.x, y: wp.y },
            movement: wp.movement
        }))
    ].sort((a, b) => a.frame - b.frame);

    // 2. Find the current segment
    // We look for the first keyframe *after* the current frame
    const nextKeyframeIndex = frames.findIndex(kf => kf.frame > currentFrame);

    // If currentFrame is past the last waypoint, stay at the last waypoint
    if (nextKeyframeIndex === -1) {
        const last = frames[frames.length - 1];
        return last.value;
    }

    // If currentFrame is before the first waypoint (which starts at 0 anyway), use start
    if (nextKeyframeIndex === 0) {
        return frames[0].value;
    }

    const startKf = frames[nextKeyframeIndex - 1];
    const endKf = frames[nextKeyframeIndex];

    // 3. Interpolate
    // The movement type is determined by the *destination* waypoint (endKf)
    const movementType = endKf.movement;

    const progress = interpolate(
        currentFrame,
        [startKf.frame, endKf.frame],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    let x = 0;
    let y = 0;

    switch (movementType) {
        case MovementType.Teleport:
            // Stay at start until the very last frame, then jump
            // Or immediate jump? Let's keep at start until arrival time
            return progress < 1 ? startKf.value : endKf.value;

        case MovementType.Jumping:
            // Linear X, Parabolic Y
            x = interpolate(progress, [0, 1], [startKf.value.x, endKf.value.x]);

            // Parabola for Y: y = 4*h*x*(1-x)  where h is jump height intensity
            const linearY = interpolate(progress, [0, 1], [startKf.value.y, endKf.value.y]);
            // Jump "up" (negative Y) relative to the linear path
            // Max height factor: e.g. 0.2 (20% of screen height)
            const jumpHeight = 0.2;
            const arc = 4 * jumpHeight * progress * (1 - progress);
            y = linearY - arc;
            break;

        case MovementType.EaseInOut:
            x = interpolate(progress, [0, 1], [startKf.value.x, endKf.value.x], { easing: Easing.inOut(Easing.cubic) });
            y = interpolate(progress, [0, 1], [startKf.value.y, endKf.value.y], { easing: Easing.inOut(Easing.cubic) });
            break;

        case MovementType.Walking:
        case MovementType.Running:
            // Linear path, but maybe add a "bobbing" effect later in the verb transform
            // For now, treat as linear path + verb handling elsewhere
            x = interpolate(progress, [0, 1], [startKf.value.x, endKf.value.x]);
            y = interpolate(progress, [0, 1], [startKf.value.y, endKf.value.y]);
            break;

        case MovementType.Linear:
        default:
            x = interpolate(progress, [0, 1], [startKf.value.x, endKf.value.x]);
            y = interpolate(progress, [0, 1], [startKf.value.y, endKf.value.y]);
            break;
    }

    return { x, y };
};
