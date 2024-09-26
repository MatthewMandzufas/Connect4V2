interface GameRepository {
  saveGame: (game: GameDetails) => Promise<PersistedGameDetails>;
  loadGame: (gameUuid: Uuid) => Promise<PersistedGameDetails>;
  updateGame: (gameUuid: Uuid, gameDetails: GameDetails) => Promise<void>;
}

type GameDetails = {
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

type PlayerMoveDetails = {
  player: 1 | 2;
  targetCell: {
    row: number;
    column: number;
  };
};

type PlayerMoveResult = {
  moveSuccessful: boolean;
  message?: string;
};

type ValidCellOnBoard = {
  isValidRow: boolean;
  isValidColumn: boolean;
};

type MoveValidationResult = {
  isValid: boolean;
  message: string;
};

type PersistedGameDetails = GameDetails & { uuid: Uuid };

type Board = Array<Array<BoardCell>>;

type BoardCell = {
  occupyingPlayer?: PlayerNumber;
};

type PlayerNumber = 1 | 2;

interface PlayerStats {
  player: PlayerNumber;
  discsLeft: number;
}

type PlayerColorsType = {
  playerOneColor: string;
  playerTwoColor: string;
};

type PlayerMovedResult = {
  moveSuccessful: boolean;
  reason?: string;
};

type PlayerMove = {
  player: PlayerNumber;
  position: {
    row: number;
    column: number;
  };
};
interface GameInterface {
  getBoard: () => Board;
  getDetails: () => GameDetails;
}
type BoardDimensions = {
  rows: number;
  columns: number;
};

type GameFactory = (...args: ConstructorParameters<typeof Game>) => Game;
