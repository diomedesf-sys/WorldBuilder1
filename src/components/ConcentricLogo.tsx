
import React from 'react';

export const ConcentricLogo = ({ className = "w-8 h-8", onClick }: { className?: string, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center justify-center group ${className}`}
        title="Return to Dashboard"
    >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-600 group-hover:border-indigo-500 transition-all duration-300" />

        {/* Middle Ring */}
        <div className="absolute inset-[15%] rounded-full border-2 border-slate-400 group-hover:border-indigo-400 transition-all duration-300 delay-75" />

        {/* Center Dot */}
        <div className="absolute inset-[35%] rounded-full bg-slate-200 group-hover:bg-indigo-300 transition-all duration-300 delay-150" />
    </button>
);
