import { useReducer, useCallback, Dispatch } from 'react';

// Action types
const UNDO = 'UNDO';
const REDO = 'REDO';
const SET = 'SET';
const RESET = 'RESET';

interface State<T> {
  past: T[];
  present: T;
  future: T[];
}

type Action<T> = 
  | { type: typeof UNDO }
  | { type: typeof REDO }
  | { type: typeof SET; payload: T | ((prev: T) => T) }
  | { type: typeof RESET; payload: T };

function undoRedoReducer<T>(state: State<T>, action: Action<T>): State<T> {
  const { past, present, future } = state;

  switch (action.type) {
    case UNDO:
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
      
    case REDO:
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
      
    case SET:
      const newPresent = typeof action.payload === 'function' 
        ? (action.payload as (prev: T) => T)(present) 
        : action.payload;
      
      if (newPresent === present) return state;

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };

    case RESET:
      return {
        past: [],
        present: action.payload as T,
        future: []
      };
      
    default:
      return state;
  }
}

export function useUndoRedo<T>(initialState: T) {
  const [state, dispatch] = useReducer(undoRedoReducer, {
    past: [],
    present: initialState,
    future: []
  }) as [State<T>, Dispatch<Action<T>>]; // Casting to help inference in some TS versions

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);
  const redo = useCallback(() => dispatch({ type: REDO }), []);
  
  const setState = useCallback((payload: T | ((prev: T) => T)) => {
    dispatch({ type: SET, payload });
  }, []);

  const resetState = useCallback((payload: T) => {
    dispatch({ type: RESET, payload });
  }, []);

  return {
    state: state.present,
    setState,
    resetState,
    undo,
    redo,
    canUndo,
    canRedo,
    pastHistory: state.past,
    futureHistory: state.future
  };
}