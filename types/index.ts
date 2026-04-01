export interface IPuzzleState {
  board: number[];
  size: number;
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
  isInvalidPress?: boolean;
}

export interface IPuzzleAction {
  type: 'MOVE_TILE' | 'SHUFFLE' | 'SET_SIZE' | 'SET_COMPLETE' | 'SET_MODE' | 'SET_IMAGE' | 'UNDO' | 'SHOW_HINT' | 'CLEAR_HINT';
  payload?: any;
}

export interface IGameStats {
  isComplete: boolean;
}

export type PuzzleSize = 3 | 4 | 5;
