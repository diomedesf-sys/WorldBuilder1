
import React, { useState, useEffect } from 'react';
import { Save, Clock, Trash2, RotateCcw } from 'lucide-react';

interface Snapshot {
    id: string;
    timestamp: number;
    note: string;
    data: any; // Full app state
}

const STORAGE_KEY = 'world-builder-snapshots';

interface VersionSnapshotsProps {
    currentData: any;
    onLoad: (data: any) => void;
}

const VersionSnapshots: React.FC<VersionSnapshotsProps> = ({ currentData, onLoad }) => {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [note, setNote] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setSnapshots(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load snapshots", e);
            }
        }
    }, []);

    const saveSnapshot = () => {
        if (!note.trim()) return;
        const newSnapshot: Snapshot = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            note,
            data: currentData
        };
        const updated = [newSnapshot, ...snapshots];
        setSnapshots(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setNote('');
    };

    const deleteSnapshot = (id: string) => {
        const updated = snapshots.filter(s => s.id !== id);
        setSnapshots(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const loadSnapshot = (snapshot: Snapshot) => {
        if (confirm(`Load snapshot "${snapshot.note}"? Unsaved changes will be lost.`)) {
            onLoad(snapshot.data);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
                title="Version Snapshots"
            >
                <Clock size={20} />
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2">
                        <Save size={16} className="text-emerald-400" /> Version Snapshots
                    </h3>

                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-emerald-500"
                            placeholder="Snapshot note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button
                            onClick={saveSnapshot}
                            disabled={!note.trim()}
                            className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium"
                        >
                            Save
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mt-2">
                        {snapshots.length === 0 && (
                            <div className="text-center text-slate-600 text-xs py-4">No snapshots saved</div>
                        )}
                        {snapshots.map(s => (
                            <div key={s.id} className="bg-slate-800/50 p-2 rounded border border-slate-800 hover:border-slate-700 group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm text-slate-300 font-medium truncate w-40">{s.note}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{new Date(s.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteSnapshot(s.id)}
                                        className="text-slate-500 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => loadSnapshot(s)}
                                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs"
                                    >
                                        <RotateCcw size={14} /> Load
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionSnapshots;
