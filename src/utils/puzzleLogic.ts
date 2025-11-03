import { PuzzleSize } from '../../types';

/**
 * Creates a solved puzzle board
 */
export const createSolvedBoard = (size: number): number[] => {
  const board = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  board.push(0); // Empty tile at the end
  return board;
};

/**
 * Checks if the puzzle is solved
 */
export const isSolved = (board: number[]): boolean => {
  const size = Math.sqrt(board.length);
  const solvedBoard = createSolvedBoard(size);
  return board.every((tile, index) => tile === solvedBoard[index]);
};

/**
 * Gets the position (row, col) from index
 */
export const getPosition = (index: number, size: number): { row: number; col: number } => {
  return {
    row: Math.floor(index / size),
    col: index % size,
  };
};

/**
 * Gets the index from position (row, col)
 */
export const getIndex = (row: number, col: number, size: number): number => {
  return row * size + col;
};

/**
 * Finds the empty tile index
 */
export const findEmptyTile = (board: number[]): number => {
  return board.findIndex(tile => tile === 0);
};

/**
 * Gets valid moves for a given position
 */
export const getValidMoves = (index: number, size: number): number[] => {
  const { row, col } = getPosition(index, size);
  const moves: number[] = [];

  // Up
  if (row > 0) moves.push(getIndex(row - 1, col, size));
  // Down
  if (row < size - 1) moves.push(getIndex(row + 1, col, size));
  // Left
  if (col > 0) moves.push(getIndex(row, col - 1, size));
  // Right
  if (col < size - 1) moves.push(getIndex(row, col + 1, size));

  return moves;
};

/**
 * Checks if a move is valid (tile is adjacent to empty space)
 */
export const isValidMove = (board: number[], tileIndex: number): boolean => {
  const emptyIndex = findEmptyTile(board);
  const size = Math.sqrt(board.length);
  const validMoves = getValidMoves(emptyIndex, size);
  return validMoves.includes(tileIndex);
};

/**
 * Makes a move by swapping tile with empty space
 */
export const makeMove = (board: number[], tileIndex: number): number[] => {
  if (!isValidMove(board, tileIndex)) return board;

  const newBoard = [...board];
  const emptyIndex = findEmptyTile(board);
  
  // Swap tiles
  [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];
  
  return newBoard;
};

/**
 * Counts inversions for solvability check
 */
const countInversions = (board: number[]): number => {
  let inversions = 0;
  const filteredBoard = board.filter(tile => tile !== 0);
  
  for (let i = 0; i < filteredBoard.length - 1; i++) {
    for (let j = i + 1; j < filteredBoard.length; j++) {
      if (filteredBoard[i] > filteredBoard[j]) {
        inversions++;
      }
    }
  }
  
  return inversions;
};

/**
 * Checks if a puzzle state is solvable
 */
export const isSolvable = (board: number[]): boolean => {
  const size = Math.sqrt(board.length);
  const inversions = countInversions(board);
  
  if (size % 2 === 1) {
    // Odd grid size: solvable if inversions are even
    return inversions % 2 === 0;
  } else {
    // Even grid size: more complex rules
    const emptyIndex = findEmptyTile(board);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyRowFromBottom = size - emptyRow;
    
    if (emptyRowFromBottom % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      return inversions % 2 === 1;
    }
  }
};

/**
 * Shuffles the puzzle ensuring it remains solvable
 */
export const shuffleBoard = (size: number): number[] => {
  let board: number[];
  let attempts = 0;
  const maxAttempts = 1000;
  
  do {
    board = createSolvedBoard(size);
    
    // Fisher-Yates shuffle
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
    
    attempts++;
  } while ((!isSolvable(board) || isSolved(board)) && attempts < maxAttempts);
  
  // If we couldn't generate a solvable puzzle, create one manually
  if (attempts >= maxAttempts) {
    board = createSolvedBoard(size);
    // Make a few valid moves to shuffle
    const emptyIndex = findEmptyTile(board);
    const validMoves = getValidMoves(emptyIndex, size);
    
    for (let i = 0; i < 100; i++) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      board = makeMove(board, randomMove);
      const newEmptyIndex = findEmptyTile(board);
      const newValidMoves = getValidMoves(newEmptyIndex, size);
      validMoves.length = 0;
      validMoves.push(...newValidMoves);
    }
  }
  
  return board;
};
