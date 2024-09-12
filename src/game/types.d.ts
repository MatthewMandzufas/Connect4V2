import { Uuid } from "@/global";
import Game from "./game";

export interface GameRepository {
  saveGame: (game: GameDetails) => Promise<PersistedGameDetails>;
  loadGame: (gameUuid: Uuid) => Promise<PersistedGameDetails>;
}

export type GameDetails = {
  board?: Board;
  activePlayer?: PlayerNumber;
  players?: Record<PlayerNumber, PlayerStats>;
  status?: GameStatus;
  playerColors?: PlayerColorsType;
  boardDimensions?: {
    rows: number;
    columns: number;
  };
};

export type PlayerMoveDetails = {
  player: 1 | 2;
  targetCell: {
    row: number;
    column: number;
  };
};

export type PlayerMoveResult = {
  moveSuccessful: boolean;
  message?: string;
};

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

export type ValidCellOnBoard = {
  isValidRow: boolean;
  isValidColumn: boolean;
};

export type PersistedGameDetails = GameDetails & { uuid: Uuid };

export type Board = Array<Array<BoardCell>>;

export type BoardCell = {
  occupyingPlayer?: PlayerNumber;
};

export type PlayerNumber = 1 | 2;

export interface PlayerStats {
  player: PlayerNumber;
  discsLeft: number;
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  PLAYER_ONE_WIN = "PLAYER_ONE_WIN",
  PLAYER_TWO_WIN = "PLAYER_TWO_WIN",
  DRAW = "DRAW",
}

export type PlayerColorsType = {
  playerOneColor: string;
  playerTwoColor: string;
};

export interface GameServiceInterface {
  createGame: () => Promise<Uuid>;
  getGameDetails: (gameUuid: Uuid) => Promise<GameDetails>;
  submitMove: (
    gameUuid: Uuid,
    moveDetails: PlayerMoveDetails
  ) => Promise<PlayerMovedResult>;
}

export type PlayerMovedResult = {
  moveSuccessful: boolean;
  reason?: string;
};

export type PlayerMove = {
  player: PlayerNumber;
  position: {
    row: number;
    column: number;
  };
};
export interface GameInterface {
  getBoard: () => Board;
  getDetails: () => GameDetails;
}
export type BoardDimensions = {
  rows: number;
  columns: number;
};

export type GameFactory = (...args: ConstructorParameters<typeof Game>) => Game;