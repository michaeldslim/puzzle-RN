import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Audio } from 'expo-av';
import { IPuzzleState, IPuzzleAction, PuzzleSize } from '../../types';
import { shuffleBoard, isSolved, findEmptyTile, findHintMoveSequence } from '../utils/puzzleLogic';

const initialState: IPuzzleState = {
  board: shuffleBoard(3),
  size: 3,
  isComplete: false,
  gameMode: 'number',
  imageUri: undefined,
  history: [],
  hintIndex: null,
  hintSequence: [],
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
        hintIndex: null,
        hintSequence: [],
      };

    case 'SHUFFLE':
      return {
        ...state,
        board: shuffleBoard(state.size),
        isComplete: false,
        history: [],
        hintIndex: null,
        hintSequence: [],
      };

    case 'SET_SIZE':
      const newSize = action.payload;
      return {
        ...state,
        size: newSize,
        board: shuffleBoard(newSize),
        isComplete: false,
        history: [],
        hintIndex: null,
        hintSequence: [],
      };

    case 'SET_COMPLETE':
      return {
        ...state,
        isComplete: action.payload,
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
        hintIndex: null,
        hintSequence: [],
      };
    }

    case 'SHOW_HINT': {
      const payload = action.payload;
      if (typeof payload === 'number') {
        return {
          ...state,
          hintIndex: payload,
          hintSequence: payload === null ? [] : [payload],
        };
      }

      const sequence = Array.isArray(payload?.sequence) ? payload.sequence : [];
      const index = typeof payload?.index === 'number' ? payload.index : (sequence[0] ?? null);
      return {
        ...state,
        hintIndex: index,
        hintSequence: sequence,
      };
    }

    case 'CLEAR_HINT':
      return {
        ...state,
        hintIndex: null,
        hintSequence: [],
      };

    default:
      return state;
  }
};

export const usePuzzleGame = () => {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintFeedback, setHintFeedback] = useState<string | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintRequestIdRef = useRef(0);
  const hintInteractionRef = useRef<ReturnType<typeof InteractionManager.runAfterInteractions> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const cardSoundRef = useRef<Audio.Sound | null>(null);

  const cancelHintSearch = useCallback(() => {
    hintRequestIdRef.current += 1;
    hintInteractionRef.current?.cancel();
    hintInteractionRef.current = null;
    setHintLoading(false);
    if (hintFeedbackTimeoutRef.current) {
      clearTimeout(hintFeedbackTimeoutRef.current);
      hintFeedbackTimeoutRef.current = null;
    }
    setHintFeedback(null);
  }, []);

  const showHintFeedback = useCallback((message: string) => {
    if (hintFeedbackTimeoutRef.current) {
      clearTimeout(hintFeedbackTimeoutRef.current);
      hintFeedbackTimeoutRef.current = null;
    }
    setHintFeedback(message);
    hintFeedbackTimeoutRef.current = setTimeout(() => {
      setHintFeedback(null);
      hintFeedbackTimeoutRef.current = null;
    }, 2500);
  }, []);

  const scheduleHintClear = useCallback(() => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    hintTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_HINT' });
      hintTimeoutRef.current = null;
    }, 3000);
  }, []);

  const playCardSound = useCallback(async () => {
    try {
      if (!cardSoundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/swoosh.mp3')
        );
        cardSoundRef.current = sound;
      }
      await cardSoundRef.current.stopAsync();
      await cardSoundRef.current.setPositionAsync(0);
      await cardSoundRef.current.playAsync();
    } catch (e) {
      // Sound playback failure is non-critical
    }
  }, []);

  const handleMove = useCallback((newBoard: number[]) => {
    playCardSound();
    dispatch({ type: 'MOVE_TILE', payload: newBoard });
  }, [playCardSound]);

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
    if (state.isComplete || state.size !== 3) return;

    const requestId = ++hintRequestIdRef.current;
    hintInteractionRef.current?.cancel();
    setHintLoading(true);

    const board = state.board;
    const size = state.size;
    const previousBoard = state.history.length > 0 ? state.history[state.history.length - 1] : null;
    const excludedReverseMove = previousBoard ? findEmptyTile(previousBoard) : null;

    hintInteractionRef.current = InteractionManager.runAfterInteractions(() => {
      const hintSequence = findHintMoveSequence(board, size, excludedReverseMove, 3);

      if (requestId !== hintRequestIdRef.current) return;

      setHintLoading(false);
      hintInteractionRef.current = null;

      if (hintSequence.length === 0) {
        showHintFeedback('No hint available');
        return;
      }

      dispatch({
        type: 'SHOW_HINT',
        payload: {
          index: hintSequence[0],
          sequence: hintSequence,
        },
      });
      scheduleHintClear();
    });
  }, [state.board, state.size, state.isComplete, state.history, scheduleHintClear, showHintFeedback]);

  useEffect(() => {
    cancelHintSearch();
  }, [state.board, cancelHintSearch]);

  // Preload card sound on mount so first move plays instantly
  useEffect(() => {
    Audio.Sound.createAsync(require('../../assets/sounds/swoosh.mp3')).then(({ sound }) => {
      cardSoundRef.current = sound;
    }).catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      cancelHintSearch();
      if (hintFeedbackTimeoutRef.current) {
        clearTimeout(hintFeedbackTimeoutRef.current);
        hintFeedbackTimeoutRef.current = null;
      }
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (cardSoundRef.current) {
        cardSoundRef.current.unloadAsync();
        cardSoundRef.current = null;
      }
    };
  }, []);

  // Play tada sound on win
  useEffect(() => {
    if (state.isComplete) {
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
  }, [state.isComplete]);

  return {
    puzzleState: state,
    handleMove,
    handleUndo,
    canUndo: state.history.length > 0,
    handleHint,
    hintLoading,
    hintFeedback,
    handleShuffle,
    handleSizeChange,
    handleModeToggle,
    handleImageSet,
  };
};
