export interface IPuzzleState {
  board: number[];
  size: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  gameMode: 'number' | 'photo';
  imageUri?: string;
  history: number[][];
  hintIndex: number | null;
  hintSequence: number[];
}

export interface ITileProps {
  value: number;
  index: number;
  size: number;
  onTilePress: (index: number) => void;
  gameMode: 'number' | 'photo';
  imageUri?: string;
  tileSize: number;
  isHint?: boolean;
  hintDirection?: string;
}

export interface IPuzzleAction {
  type: 'MOVE_TILE' | 'SHUFFLE' | 'SET_SIZE' | 'RESET_TIMER' | 'SET_COMPLETE' | 'SET_MODE' | 'SET_IMAGE' | 'UNDO' | 'SHOW_HINT' | 'CLEAR_HINT';
  payload?: any;
}

export interface IGameStats {
  isComplete: boolean;
}

export type PuzzleSize = 3 | 4 | 5;
