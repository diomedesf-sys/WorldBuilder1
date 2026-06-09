import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProceduralEntityProps {
  tension: number;       // 0 to 1
  energy: number;        // 0 to 1
  alignment: number;     // 0 to 360
  scaleFactor: number;   // e.g. 1
  colorPalette: 'midnight' | 'dawn' | 'void' | 'ember';
}

const PALETTES = {
  midnight: ['#3b82f6', '#1d4ed8', '#1e3a8a', '#0f172a'],
  dawn:     ['#f97316', '#ef4444', '#b91c1c', '#450a0a'],
  void:     ['#a855f7', '#7e22ce', '#581c87', '#111827'],
  ember:    ['#f59e0b', '#d97706', '#b45309', '#78350f']
};

export const ProceduralEntity: React.FC<ProceduralEntityProps> = ({
  tension,
  energy,
  alignment,
  scaleFactor,
  colorPalette
}) => {
  const colors = PALETTES[colorPalette];
  
  // Base configuration
  const center = 200;
  const radius = 100 * scaleFactor;
  
  // Create rings
  const rings = Array.from({ length: 5 }).map((_, i) => {
    // Determine number of segments for the ring shape based on energy/tension
    const basePoints = 3 + Math.floor(energy * 20) + (i * 2); 
    
    // The inner rings start smaller, outer rings larger
    const rBase = radius * 0.2 + (radius * 0.8 * (i / 4));
    
    let pathObj = "";
    
    for (let j = 0; j < basePoints; j++) {
      const angle = (j / basePoints) * Math.PI * 2;
      
      // Tension distorts the radius randomly
      const perturbation = tension * radius * 0.4 * (Math.sin(angle * 4 + i) + Math.cos(angle * 7));
      const currentR = rBase + perturbation;
      
      const x = center + Math.cos(angle) * currentR;
      const y = center + Math.sin(angle) * currentR;
      
      if (j === 0) {
        pathObj += `M ${x} ${y} `;
      } else {
        pathObj += `L ${x} ${y} `;
      }
    }
    // Close the path
    pathObj += "Z";
    
    return {
      d: pathObj,
      strokeWidth: 1 + (1 - energy) * 3,
      strokeColor: colors[i % colors.length],
      rotation: alignment + (i % 2 === 0 ? 1 : -1) * energy * 45
    };
  });

  return (
    <div className="flex items-center justify-center w-full h-full text-slate-200">
      <svg width={400} height={400} viewBox="0 0 400 400" className="overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation={3 + energy * 8} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.g 
          animate={{ rotate: alignment }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {rings.map((ring, i) => (
            <motion.path
              key={`ring-${i}`}
              initial={false}
              animate={{ 
                d: ring.d, 
                rotate: ring.rotation,
                strokeWidth: ring.strokeWidth 
              }}
              transition={{ 
                type: "spring", stiffness: 30 + tension * 100, damping: 15,
              }}
              fill="none"
              stroke={ring.strokeColor}
              style={{ originX: '200px', originY: '200px' }}
              filter="url(#glow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Core Eye/Heart */}
          <motion.circle
            cx={center}
            cy={center}
            r={10 + tension * 30 + energy * 10}
            animate={{ 
                r: 10 + tension * 30 + energy * 10, 
                fill: colors[0],
                opacity: 0.5 + energy * 0.5 
            }}
            transition={{ type: "spring", stiffness: 100 }}
            filter="url(#glow)"
          />

           <motion.circle
            cx={center}
            cy={center}
            r={5 + tension * 10}
            animate={{ 
                r: 5 + tension * 10,
                fill: "#ffffff"
            }}
            transition={{ type: "spring", stiffness: 150 }}
            filter="url(#glow)"
          />

        </motion.g>
      </svg>
    </div>
  );
};
