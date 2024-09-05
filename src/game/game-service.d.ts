import { Uuid } from "@/global";

export interface GameRepository {
  saveGame: (game: GameDetails) => Promise<PersistedGameDetails>;
}

export type GameDetails = {
  board: Board;
  activePlayer: PlayerNumber;
  players: Record<PlayerNumber, PlayerStats>;
  status: GameStatus;
  playerColors: PlayerColorsType;
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
