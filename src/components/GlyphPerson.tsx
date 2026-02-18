
import React from 'react';
import { HumanPosture } from '../types';

// Import SVGs as Components (for rendering)
import Posture1Svg from '../assets/humans/WBM_human_1.svg?react';
import Posture2Svg from '../assets/humans/WBM_human_2.svg?react';
import Posture3Svg from '../assets/humans/WBM_human_3.svg?react';
import Posture4Svg from '../assets/humans/WBM_human_4.svg?react';
import Posture5Svg from '../assets/humans/WBM_human_5.svg?react';
import Posture6Svg from '../assets/humans/WBM_human_6.svg?react';
import Posture7Svg from '../assets/humans/WBM_human_7.svg?react';
import Posture8Svg from '../assets/humans/WBM_human_8.svg?react';
import Posture9Svg from '../assets/humans/WBM_human_9.svg?react';

// Import SVGs as URLs (for sidebar previews)
import posture1Url from '../assets/humans/WBM_human_1.svg?url';
import posture2Url from '../assets/humans/WBM_human_2.svg?url';
import posture3Url from '../assets/humans/WBM_human_3.svg?url';
import posture4Url from '../assets/humans/WBM_human_4.svg?url';
import posture5Url from '../assets/humans/WBM_human_5.svg?url';
import posture6Url from '../assets/humans/WBM_human_6.svg?url';
import posture7Url from '../assets/humans/WBM_human_7.svg?url';
import posture8Url from '../assets/humans/WBM_human_8.svg?url';
import posture9Url from '../assets/humans/WBM_human_9.svg?url';

// Export Asset Map for Sidebar
export const HUMAN_ASSETS: Record<HumanPosture, string> = {
    [HumanPosture.Posture1]: posture1Url,
    [HumanPosture.Posture2]: posture2Url,
    [HumanPosture.Posture3]: posture3Url,
    [HumanPosture.Posture4]: posture4Url,
    [HumanPosture.Posture5]: posture5Url,
    [HumanPosture.Posture6]: posture6Url,
    [HumanPosture.Posture7]: posture7Url,
    [HumanPosture.Posture8]: posture8Url,
    [HumanPosture.Posture9]: posture9Url,
    [HumanPosture.Equilibrium]: posture1Url, // Fallback
};

// Map Postures to Components
export const POSTURE_COMPONENTS: Record<HumanPosture, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [HumanPosture.Posture1]: Posture1Svg,
    [HumanPosture.Posture2]: Posture2Svg,
    [HumanPosture.Posture3]: Posture3Svg,
    [HumanPosture.Posture4]: Posture4Svg,
    [HumanPosture.Posture5]: Posture5Svg,
    [HumanPosture.Posture6]: Posture6Svg,
    [HumanPosture.Posture7]: Posture7Svg,
    [HumanPosture.Posture8]: Posture8Svg,
    [HumanPosture.Posture9]: Posture9Svg,
    [HumanPosture.Equilibrium]: Posture1Svg, // Fallback
};

interface GlyphPersonProps {
    posture: HumanPosture;
    size?: number;
    faceColor?: string;
    opacity?: number;
}

export const GlyphPerson: React.FC<GlyphPersonProps & { className?: string }> = ({ posture, size = 2, faceColor = '#fff', opacity = 1, className = '' }) => {
    const PostureComponent = POSTURE_COMPONENTS[posture] || Posture1Svg;
    const scale = size * 0.5;



    return (
        <div
            className={className}
            style={{
                width: '100px',
                height: '100px',
                opacity,
                transform: `scale(${scale})`,
                color: faceColor
            }}
        >
            <PostureComponent
                width="100%"
                height="100%"
                fill={faceColor}
                style={{
                    display: 'block',
                    fill: faceColor
                }}
            />
        </div>
    );
};
