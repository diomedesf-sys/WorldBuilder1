import React from 'react';
import RectangleSvg from '../../assets/primitives/WBM_rectangle.svg?react';

interface PrimitiveProps {
    size: number;
    position: [number, number];
    rotation: number;
    fillColor?: string;
    opacity?: number;
    preview?: boolean;
}

const PNSRectangle: React.FC<PrimitiveProps> = ({ size, position, rotation, fillColor = 'currentColor', opacity = 1, preview = false }) => {
    const scale = size * 0.5;

    if (preview) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RectangleSvg width="80%" height="80%" fill={fillColor} style={{ overflow: 'visible' }} />
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position[0] * 100}%`,
                top: `${position[1] * 100}%`,
                width: '100px',
                height: '100px',
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity,
                pointerEvents: 'none'
            }}
        >
            <RectangleSvg
                width="100%"
                height="100%"
                fill={fillColor}
                style={{ overflow: 'visible' }}
            />
        </div>
    );
};

export default PNSRectangle;
