import React, { useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Tile from './Tile';
import { IPuzzleState } from '../../types';
import { isValidMove, makeMove, getPosition, findEmptyTile } from '../utils/puzzleLogic';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IPuzzleBoardProps {
  puzzleState: IPuzzleState;
  onMove: (newBoard: number[]) => void;
  hintIndex: number | null;
  hintSequence?: number[];
}

interface IGestureTileProps {
  value: number;
  index: number;
  size: number;
  onTilePress: (index: number) => void;
  gameMode: 'number' | 'photo';
  imageUri?: string;
  tileSize: number;
  isHint?: boolean;
  hintDirection?: string;
  onSwipe: (gestureState: any, tileIndex: number) => void;
}

const GestureTile: React.FC<IGestureTileProps> = React.memo(({ value, index, size, onTilePress, gameMode, imageUri, tileSize, isHint, hintDirection, onSwipe }) => {
  const panGesture = useMemo(
    () => Gesture.Pan().runOnJS(true).onEnd((event) => onSwipe(event, index)),
    [index, onSwipe]
  );
  return (
    <GestureDetector gesture={panGesture}>
      <View>
        <Tile
          value={value}
          index={index}
          size={size}
          onTilePress={onTilePress}
          gameMode={gameMode}
          imageUri={imageUri}
          tileSize={tileSize}
          isHint={isHint}
          hintDirection={hintDirection}
        />
      </View>
    </GestureDetector>
  );
});

const PuzzleBoard: React.FC<IPuzzleBoardProps> = ({ puzzleState, onMove, hintIndex, hintSequence = [] }) => {
  const screenWidth = Dimensions.get('window').width;
  const boardSize = Math.min(screenWidth - 40, 400);
  // Adjust tile size calculation to account for margins and padding
  const tilePadding = 4; // 2px margin on each side
  const boardPadding = 16; // 8px padding on each side of the board
  const availableSpace = boardSize - boardPadding;
  const tileSize = (availableSpace - (puzzleState.size - 1) * tilePadding) / puzzleState.size;

  const isMoving = useRef(false);

  const emptyIndex = findEmptyTile(puzzleState.board);

  const handleTilePress = (index: number) => {
    if (puzzleState.isComplete || isMoving.current) return;

    if (isValidMove(puzzleState.board, index)) {
      isMoving.current = true;
      try {
        LayoutAnimation.configureNext(
          LayoutAnimation.Presets.easeInEaseOut,
          () => { isMoving.current = false; }
        );
        const newBoard = makeMove(puzzleState.board, index);
        onMove(newBoard);
      } catch (e) {
        console.error('move error', e);
      } finally {
        setTimeout(() => { isMoving.current = false; }, 350);
      }
    }
  };


  const handleSwipe = useCallback((gestureState: any, tileIndex: number) => {
    if (puzzleState.isComplete || isMoving.current) return;

    const { translationX, translationY } = gestureState;
    const threshold = 50;

    // Determine swipe direction
    let targetIndex = -1;
    const { row, col } = getPosition(tileIndex, puzzleState.size);

    if (Math.abs(translationX) > Math.abs(translationY)) {
      // Horizontal swipe
      if (translationX > threshold && col < puzzleState.size - 1) {
        // Swipe right
        targetIndex = tileIndex + 1;
      } else if (translationX < -threshold && col > 0) {
        // Swipe left
        targetIndex = tileIndex - 1;
      }
    } else {
      // Vertical swipe
      if (translationY > threshold && row < puzzleState.size - 1) {
        // Swipe down
        targetIndex = tileIndex + puzzleState.size;
      } else if (translationY < -threshold && row > 0) {
        // Swipe up
        targetIndex = tileIndex - puzzleState.size;
      }
    }

    // Check if target position is empty and make move
    if (targetIndex >= 0 && targetIndex < puzzleState.board.length && puzzleState.board[targetIndex] === 0) {
      isMoving.current = true;
      try {
        LayoutAnimation.configureNext(
          LayoutAnimation.Presets.easeInEaseOut,
          () => { isMoving.current = false; }
        );
        const newBoard = makeMove(puzzleState.board, tileIndex);
        onMove(newBoard);
      } catch (e) {
        console.error('swipe error', e);
      } finally {
        setTimeout(() => { isMoving.current = false; }, 350);
      }
    }
  }, [puzzleState, onMove, isMoving]);

  const renderTile = (value: number, index: number) => {
    const stepIndex = hintSequence.indexOf(index);
    const isHint = stepIndex !== -1 || hintIndex === index;
    const hintDirection = stepIndex !== -1 ? String(stepIndex + 1) : (isHint ? '1' : undefined);

    if (value === 0) {
      return (
        <Tile
          key={`${index}-${value}`}
          value={value}
          index={index}
          size={puzzleState.size}
          onTilePress={handleTilePress}
          gameMode={puzzleState.gameMode}
          imageUri={puzzleState.imageUri}
          tileSize={tileSize}
          isHint={false}
        />
      );
    }

    return (
      <GestureTile
        key={`gesture-${index}-${value}`}
        value={value}
        index={index}
        size={puzzleState.size}
        onTilePress={handleTilePress}
        gameMode={puzzleState.gameMode}
        imageUri={puzzleState.imageUri}
        tileSize={tileSize}
        isHint={isHint}
        hintDirection={hintDirection}
        onSwipe={handleSwipe}
      />
    );
  };

  // Create rows and columns for better grid layout
  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < puzzleState.size; i++) {
      const rowTiles = [];
      for (let j = 0; j < puzzleState.size; j++) {
        const index = i * puzzleState.size + j;
        const value = puzzleState.board[index];
        rowTiles.push(renderTile(value, index));
      }
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowTiles}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { width: boardSize, height: boardSize }]}>
        {renderBoard()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PuzzleBoard;
