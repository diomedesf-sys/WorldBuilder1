
import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export function useHistory<T>(initialPresent: T, historyLimit: number = 50) {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialPresent,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        setState((currentState) => {
            const { past, present, future } = currentState;
            if (past.length === 0) return currentState;

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [present, ...future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState((currentState) => {
            const { past, present, future } = currentState;
            if (future.length === 0) return currentState;

            const next = future[0];
            const newFuture = future.slice(1);

            return {
                past: [...past, present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const set = useCallback((newPresent: T) => {
        setState((currentState) => {
            const { past, present } = currentState;
            if (newPresent === present) return currentState;

            const newPast = [...past, present];
            if (newPast.length > historyLimit) {
                newPast.shift(); // Remove oldest
            }

            return {
                past: newPast,
                present: newPresent,
                future: [],
            };
        });
    }, [historyLimit]);

    const reset = useCallback((newPresent: T) => {
        setState({
            past: [],
            present: newPresent,
            future: [],
        });
    }, []);

    return {
        state: state.present,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
        historyState: state,
        reset
    };
}
