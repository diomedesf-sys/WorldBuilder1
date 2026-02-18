
import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <h1 className="text-4xl font-light mb-4 tracking-wider">World Builder</h1>
            <p className="text-slate-500 font-mono">Select a module from the navigation sidebar.</p>
        </div>
    );
};

export default Dashboard;
