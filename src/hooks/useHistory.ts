
import { useState, useCallback, useEffect } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

const STORAGE_KEY = 'world_builder_state_v1';

export function useHistory<T>(initialPresent: T, historyLimit: number = 50) {
    // Initialize from localStorage if available, otherwise use initialPresent
    const [state, setState] = useState<HistoryState<T>>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate structure briefly? assume safe for now.
                // We MUST update 'present' structure if data model changed?
                // For now, trust storage. If corrupted, user can clear cache.
                // Or maybe merge with initialPresent to ensure new fields exists?
                return parsed;
            }
        } catch (e) {
            console.error("Failed to load history from storage", e);
        }
        return {
            past: [],
            present: initialPresent,
            future: [],
        };
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save history to storage", e);
        }
    }, [state]);

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
        const newState = {
            past: [],
            present: newPresent,
            future: [],
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); // Force save immediately
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
