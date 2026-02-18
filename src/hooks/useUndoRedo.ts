import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export function useUndoRedo<T>(initialState: T) {
    const [history, setHistory] = useState<HistoryState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

    const undo = useCallback(() => {
        if (!canUndo) return;

        setHistory((curr) => {
            const previous = curr.past[curr.past.length - 1];
            const newPast = curr.past.slice(0, curr.past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [curr.present, ...curr.future],
            };
        });
    }, [canUndo]);

    const redo = useCallback(() => {
        if (!canRedo) return;

        setHistory((curr) => {
            const next = curr.future[0];
            const newFuture = curr.future.slice(1);

            return {
                past: [...curr.past, curr.present],
                present: next,
                future: newFuture,
            };
        });
    }, [canRedo]);

    const setState = useCallback((newState: T | ((prev: T) => T)) => {
        setHistory((curr) => {
            const resolvedState = typeof newState === 'function'
                ? (newState as (prev: T) => T)(curr.present)
                : newState;

            if (resolvedState === curr.present) return curr;

            return {
                past: [...curr.past, curr.present],
                present: resolvedState,
                future: [],
            };
        });
    }, []);

    return {
        state: history.present,
        setState,
        undo,
        redo,
        canUndo,
        canRedo,
        history // exposed for snapshots if needed
    };
}
