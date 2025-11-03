import { useReducer, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { IPuzzleState, IPuzzleAction, PuzzleSize } from '../../types';
import { shuffleBoard, isSolved, createSolvedBoard } from '../utils/puzzleLogic';

const initialState: IPuzzleState = {
  board: shuffleBoard(3),
  size: 3,
  startTime: null,
  endTime: null,
  isComplete: false,
  gameMode: 'number',
  imageUri: undefined,
};

const puzzleReducer = (state: IPuzzleState, action: IPuzzleAction): IPuzzleState => {
  switch (action.type) {
    case 'MOVE_TILE':
      const newBoard = action.payload;
      const isGameComplete = isSolved(newBoard);
      
      return {
        ...state,
        board: newBoard,
        isComplete: isGameComplete,
        endTime: isGameComplete ? Date.now() : null,
        startTime: state.startTime || Date.now(),
      };

    case 'SHUFFLE':
      return {
        ...state,
        board: shuffleBoard(state.size),
        startTime: null,
        endTime: null,
        isComplete: false,
      };

    case 'SET_SIZE':
      const newSize = action.payload;
      return {
        ...state,
        size: newSize,
        board: shuffleBoard(newSize),
        startTime: null,
        endTime: null,
        isComplete: false,
      };

    case 'RESET_TIMER':
      return {
        ...state,
        startTime: Date.now(),
        endTime: null,
      };

    case 'SET_COMPLETE':
      return {
        ...state,
        isComplete: action.payload,
        endTime: action.payload ? Date.now() : null,
      };

    case 'SET_MODE':
      return {
        ...state,
        gameMode: action.payload,
      };

    case 'SET_IMAGE':
      return {
        ...state,
        imageUri: action.payload,
      };

    default:
      return state;
  }
};

export const usePuzzleGame = () => {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);

  const handleMove = useCallback((newBoard: number[]) => {
    dispatch({ type: 'MOVE_TILE', payload: newBoard });
  }, []);

  const handleShuffle = useCallback(() => {
    dispatch({ type: 'SHUFFLE' });
  }, []);

  const handleSizeChange = useCallback((size: PuzzleSize) => {
    dispatch({ type: 'SET_SIZE', payload: size });
  }, []);

  const handleModeToggle = useCallback(() => {
    const newMode = state.gameMode === 'number' ? 'photo' : 'number';
    dispatch({ type: 'SET_MODE', payload: newMode });
  }, [state.gameMode]);

  const handleImageSet = useCallback((imageUri: string) => {
    dispatch({ type: 'SET_IMAGE', payload: imageUri });
  }, []);

  const getElapsedTime = useCallback((): number => {
    if (!state.startTime) return 0;
    const endTime = state.endTime || Date.now();
    return Math.floor((endTime - state.startTime) / 1000);
  }, [state.startTime, state.endTime]);

  // Show completion alert
  useEffect(() => {
    if (state.isComplete && state.startTime) {
    }
  }, [state.isComplete, state.startTime, getElapsedTime]);

  return {
    puzzleState: state,
    handleMove,
    handleShuffle,
    handleSizeChange,
    handleModeToggle,
    handleImageSet,
    getElapsedTime,
  };
};
