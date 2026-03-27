import { useReducer, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import { IPuzzleState, IPuzzleAction, PuzzleSize } from '../../types';
import { shuffleBoard, isSolved, findEmptyTile, findBestHintMove } from '../utils/puzzleLogic';

const initialState: IPuzzleState = {
  board: shuffleBoard(3),
  size: 3,
  startTime: null,
  endTime: null,
  isComplete: false,
  gameMode: 'number',
  imageUri: undefined,
  history: [],
  hintIndex: null,
};

const puzzleReducer = (state: IPuzzleState, action: IPuzzleAction): IPuzzleState => {
  switch (action.type) {
    case 'MOVE_TILE':
      const newBoard = action.payload;
      const isGameComplete = isSolved(newBoard);
      
      return {
        ...state,
        history: [...state.history, state.board],
        board: newBoard,
        isComplete: isGameComplete,
        endTime: isGameComplete ? Date.now() : null,
        startTime: state.startTime || Date.now(),
        hintIndex: null,
      };

    case 'SHUFFLE':
      return {
        ...state,
        board: shuffleBoard(state.size),
        startTime: null,
        endTime: null,
        isComplete: false,
        history: [],
        hintIndex: null,
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
        history: [],
        hintIndex: null,
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

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const previousBoard = state.history[state.history.length - 1];
      const nextHistory = state.history.slice(0, -1);
      const complete = isSolved(previousBoard);

      return {
        ...state,
        board: previousBoard,
        history: nextHistory,
        isComplete: complete,
        endTime: complete ? (state.endTime || Date.now()) : null,
        hintIndex: null,
      };
    }

    case 'SHOW_HINT':
      return {
        ...state,
        hintIndex: action.payload,
      };

    case 'CLEAR_HINT':
      return {
        ...state,
        hintIndex: null,
      };

    default:
      return state;
  }
};

export const usePuzzleGame = () => {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const handleMove = useCallback((newBoard: number[]) => {
    dispatch({ type: 'MOVE_TILE', payload: newBoard });
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
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

  const handleHint = useCallback(() => {
    if (state.isComplete) return;
    const hintTileIndex = findBestHintMove(state.board, state.size);
    if (hintTileIndex === null) return;
    dispatch({ type: 'SHOW_HINT', payload: hintTileIndex });
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    hintTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_HINT' });
      hintTimeoutRef.current = null;
    }, 3000);
  }, [state.board, state.size, state.isComplete]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const getElapsedTime = useCallback((): number => {
    if (!state.startTime) return 0;
    const endTime = state.endTime || Date.now();
    return Math.floor((endTime - state.startTime) / 1000);
  }, [state.startTime, state.endTime]);

  // Play tada sound on win
  useEffect(() => {
    if (state.isComplete && state.startTime) {
      const playWinSound = async () => {
        try {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/tada.mp3')
          );
          soundRef.current = sound;
          await sound.playAsync();
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
              soundRef.current = null;
            }
          });
        } catch (e) {
          // Sound playback failure is non-critical
        }
      };
      playWinSound();
    }
  }, [state.isComplete, state.startTime, getElapsedTime]);

  return {
    puzzleState: state,
    handleMove,
    handleUndo,
    canUndo: state.history.length > 0,
    handleHint,
    handleShuffle,
    handleSizeChange,
    handleModeToggle,
    handleImageSet,
    getElapsedTime,
  };
};
