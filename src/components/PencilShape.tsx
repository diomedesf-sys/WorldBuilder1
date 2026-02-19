
import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface PencilShapeProps {
    type: 'rectangle' | 'circle' | 'line' | 'path' | 'polygon';
    data: any[] | string; // [x, y, w, h] or [x1, y1, x2, y2] etc.
    options?: any; // roughjs options (stroke, fill, roughness, bowing, etc.)
    size?: number; // Size/Width of the SVG container
    height?: number; // Height of the SVG container
    className?: string; // Additional CSS classes
}

export const PencilShape: React.FC<PencilShapeProps> = ({
    type,
    data,
    options = {},
    size = 200,
    height = 200,
    className = ''
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous content
        while (svgRef.current.firstChild) {
            svgRef.current.removeChild(svgRef.current.firstChild);
        }

        const rc = rough.svg(svgRef.current);
        let node;

        // Default pencil-like options
        const defaultOptions = {
            roughness: 1.5,      // How "sketchy" (0=perfect, >2=very chaotic)
            bowing: 1,           // Curve of straight lines
            stroke: '#000',      // Default black lead
            strokeWidth: 1.5,      // Thin pencil line
            fillWeight: 2,       // Spacing of hatch lines (lower = denser)
            hachureAngle: -41,   // Angle of shading lines (natural hand angle)
            hachureGap: 4,       // Gap between hatch lines
            fillStyle: 'hachure', // "hachure", "solid", "zigzag", "cross-hatch", "dots"
            ...options
        };

        try {
            switch (type) {
                case 'rectangle':
                    node = rc.rectangle(data[0], data[1], data[2], data[3], defaultOptions);
                    break;
                case 'circle':
                    node = rc.circle(data[0], data[1], data[2], defaultOptions);
                    break;
                case 'line':
                    node = rc.line(data[0], data[1], data[2], data[3], defaultOptions);
                    break;
                case 'path':
                    // data should be SVG path string
                    const pathD = typeof data === 'string' ? data : data[0];
                    node = rc.path(pathD, defaultOptions);
                    break;
                case 'polygon':
                    // data[0] should be array of points [[x,y], [x,y]]
                    node = rc.polygon(data[0], defaultOptions);
                    break;
            }

            if (node) {
                svgRef.current.appendChild(node);
            }
        } catch (e) {
            console.error("Error drawing rough shape:", e);
        }

    }, [type, data, options, size, height]);

    return (
        <svg
            ref={svgRef}
            width={size}
            height={height}
            viewBox={`0 0 ${size} ${height}`}
            className={className}
            style={{ overflow: 'visible' }} // Allow sketchy lines to go outside bound slightly
        />
    );
};
