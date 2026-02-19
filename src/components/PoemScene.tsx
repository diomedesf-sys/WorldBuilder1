import React, { useMemo } from 'react';
import { PencilShape } from './PencilShape';

export type PoemSceneType = 'creation' | 'yaya' | 'bones' | 'sea' | 'caves';
export type Stability = 'stable' | 'balanced' | 'dynamic' | 'mixed';

interface PoemSceneProps {
    scene: PoemSceneType;
    stability?: Stability;
    seed?: number;
    width?: number;
    height?: number;
}

export const PoemScene: React.FC<PoemSceneProps> = ({
    scene,
    stability = 'mixed',
    seed = 0,
    width = 800,
    height = 450
}) => {
    return (
        <div
            style={{
                width: width,
                height: height,
                border: '2px dashed #94a3b8',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
            }}
        >
            <h3 className="text-2xl font-serif font-bold mb-2 uppercase tracking-wide">Scene: {scene}</h3>
            <p className="font-mono text-sm max-w-md text-center">
                Rendering disabled for debugging.<br />
                Stability: {stability} | Seed: {seed}
            </p>
        </div>
    );
};
