import { describe, expect, it } from 'vitest';
import {
  createSolvedBoard,
  findEmptyTile,
  findHintMoveSequence,
  getValidMoves,
  isSolved,
  isValidMove,
  makeMove,
  shuffleBoard,
} from './puzzleLogic';

const SOLVED_3X3 = [1, 2, 3, 4, 5, 6, 7, 8, 0];

describe('findHintMoveSequence', () => {
  it('returns empty sequence for solved board', () => {
    expect(findHintMoveSequence(SOLVED_3X3, 3, null, 3)).toEqual([]);
  });

  it('returns one move when puzzle is one step from solved', () => {
    const oneMoveAway = makeMove(SOLVED_3X3, 7);
    const sequence = findHintMoveSequence(oneMoveAway, 3, null, 3);

    expect(sequence).toHaveLength(1);
    expect(sequence[0]).toBe(8);
    expect(isSolved(makeMove(oneMoveAway, sequence[0]))).toBe(true);
  });

  it('returns valid moves for random shuffled 3x3 boards', () => {
    for (let i = 0; i < 20; i++) {
      const board = shuffleBoard(3);
      const sequence = findHintMoveSequence(board, 3, null, 3);

      expect(sequence.length).toBeGreaterThan(0);
      expect(sequence.length).toBeLessThanOrEqual(3);

      let current = board;
      for (const move of sequence) {
        expect(isValidMove(current, move)).toBe(true);
        current = makeMove(current, move);
      }
    }
  });

  it('allows reverse move when it solves the puzzle', () => {
    const afterMove = makeMove(SOLVED_3X3, 7);
    const reverseMove = findEmptyTile(SOLVED_3X3);
    const sequence = findHintMoveSequence(afterMove, 3, reverseMove, 3);

    expect(sequence[0]).toBe(8);
    expect(isSolved(makeMove(afterMove, sequence[0]))).toBe(true);
  });

  it('does not suggest undo when other moves exist and undo does not solve', () => {
    let verified = false;

    for (let i = 0; i < 40; i++) {
      const board = shuffleBoard(3);
      const empty = findEmptyTile(board);
      const moves = getValidMoves(empty, 3);
      const firstMove = moves[0];
      const nextBoard = makeMove(board, firstMove);
      const reverseMove = findEmptyTile(board);

      if (isSolved(makeMove(nextBoard, reverseMove))) continue;

      const sequence = findHintMoveSequence(nextBoard, 3, reverseMove, 3);
      if (sequence.length === 0) continue;

      expect(sequence[0]).not.toBe(reverseMove);
      verified = true;
      break;
    }

    expect(verified).toBe(true);
  });

  it('returns empty sequence for unsupported board sizes', () => {
    const board4 = createSolvedBoard(4);
    const board5 = createSolvedBoard(5);

    expect(findHintMoveSequence(board4, 4, null, 3)).toEqual([]);
    expect(findHintMoveSequence(board5, 5, null, 3)).toEqual([]);
  });

  it('resolves hints quickly on 3x3 boards', () => {
    const times: number[] = [];

    for (let i = 0; i < 30; i++) {
      const board = shuffleBoard(3);
      const start = performance.now();
      findHintMoveSequence(board, 3, null, 3);
      times.push(performance.now() - start);
    }

    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];

    expect(median).toBeLessThan(100);
  });
});
