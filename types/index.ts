export interface IPuzzleState {
  board: number[];
  size: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  gameMode: 'number' | 'photo';
  imageUri?: string;
}

export interface ITileProps {
  value: number;
  index: number;
  size: number;
  onTilePress: (index: number) => void;
  gameMode: 'number' | 'photo';
  imageUri?: string;
  tileSize: number;
}

export interface IPuzzleAction {
  type: 'MOVE_TILE' | 'SHUFFLE' | 'SET_SIZE' | 'RESET_TIMER' | 'SET_COMPLETE' | 'SET_MODE' | 'SET_IMAGE';
  payload?: any;
}

export interface IGameStats {
  isComplete: boolean;
}

export type PuzzleSize = 3 | 4 | 5;
