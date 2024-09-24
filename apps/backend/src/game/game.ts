import deepClone from "@/util/deep-clone";
import getIsWinningMove from "./get-is-winning-move";
import {
  Board,
  BoardDimensions,
  GameDetails,
  GameInterface,
  GameStatus,
  PlayerColorsType,
  PlayerMoveDetails,
  PlayerMoveResult,
  PlayerNumber,
  PlayerStats,
  ValidationResult,
  ValidCellOnBoard,
} from "./types.d";
const DEFAULT_BOARD_DIMENSIONS: BoardDimensions = {
  rows: 6,
  columns: 7,
};

export default class Game implements GameInterface {
  #board: Board;
  #activePlayer: 1 | 2;
  #status: GameStatus;
  #players: Record<PlayerNumber, PlayerStats>;
  #playerColors: PlayerColorsType;
  #boardDimensions: {
    rows: number;
    columns: number;
  };

  constructor(
    {
      board = this.#createBoard(DEFAULT_BOARD_DIMENSIONS),
      boardDimensions = DEFAULT_BOARD_DIMENSIONS,
      activePlayer = 1,
      status = GameStatus.IN_PROGRESS,
      players = {
        1: {
          player: 1,
          discsLeft: 21,
        },
        2: {
          player: 2,
          discsLeft: 21,
        },
      },
    }: GameDetails = {
      board: this.#createBoard(DEFAULT_BOARD_DIMENSIONS),
      boardDimensions: DEFAULT_BOARD_DIMENSIONS,
      activePlayer: 1,
      status: GameStatus.IN_PROGRESS,
      players: {
        1: {
          player: 1,
          discsLeft: 21,
        },
        2: {
          player: 2,
          discsLeft: 21,
        },
      },
    }
  ) {
    (this.#board = board), (this.#boardDimensions = boardDimensions);
    this.#activePlayer = activePlayer;
    this.#status = status;
    this.#players = players;
    this.#playerColors = {
      playerOneColor: "FF5773",
      playerTwoColor: "fdfd96",
    };
  }

  getBoard() {
    return deepClone(this.#board);
  }

  getDetails() {
    const gameDetails = {
      board: this.#board,
      activePlayer: this.#activePlayer,
      status: this.#status,
      players: this.#players,
      playerColors: this.#playerColors,
    };
    return deepClone(gameDetails);
  }

  #createBoard(boardDimensions: { rows: number; columns: number }): Board {
    const board = new Array(boardDimensions.rows).fill(undefined).map(() =>
      new Array(boardDimensions.columns).fill(undefined).map(() => {
        return { occupyingPlayer: undefined };
      })
    );
    return board;
  }

  move = this.#createValidatedMove(this.#_move.bind(this));

  #_move({
    player,
    targetCell: { row, column },
  }: PlayerMoveDetails): PlayerMoveResult {
    const { isWin } = getIsWinningMove(this.getBoard(), {
      player,
      targetCell: { row, column },
    });

    this.#board[row][column] = { occupyingPlayer: player };
    this.#players[this.#activePlayer].discsLeft--;
    this.#activePlayer = this.#activePlayer === 2 ? 1 : 2;

    if (isWin) {
      this.#status =
        this.#activePlayer === 2
          ? GameStatus.PLAYER_ONE_WIN
          : GameStatus.PLAYER_TWO_WIN;
    } else if (
      this.#players[1].discsLeft === 0 &&
      this.#players[2].discsLeft === 0
    ) {
      this.#status = GameStatus.DRAW;
    }

    return {
      moveSuccessful: true,
    };
  }

  #createValidatedMove(
    moveFunction: (playerMoveDetails: PlayerMoveDetails) => PlayerMoveResult
  ): (playerMoveDetails: PlayerMoveDetails) => PlayerMoveResult {
    return (playerMoveDetails): PlayerMoveResult => {
      const { isValid, message } = this.#validateMove(playerMoveDetails);

      return isValid
        ? moveFunction(playerMoveDetails)
        : { moveSuccessful: false, message };
    };
  }

  #validateMove({
    player,
    targetCell: { row, column },
  }: PlayerMoveDetails): ValidationResult {
    if (this.#status === "PLAYER_ONE_WIN") {
      return {
        isValid: false,
        message: "You cannot make a move, player 1 has already won the game",
      };
    } else if (this.#status === GameStatus.PLAYER_TWO_WIN) {
      return {
        isValid: false,
        message: "You cannot make a move, player 2 has already won the game",
      };
    } else if (this.#status === GameStatus.DRAW) {
      return {
        isValid: false,
        message: "You cannot make a move, the game has already ended in a draw",
      };
    }

    if (this.#activePlayer !== player) {
      return {
        isValid: false,
        message: `Player ${player} cannot move as player ${
          this.#activePlayer
        } is currently active`,
      };
    }

    const { isValidRow, isValidColumn } = this.#getIsCellOnBoard(row, column);

    if (!isValidRow && !isValidColumn) {
      return {
        isValid: false,
        message: `Cell at row ${row} and column ${column} doesn't exist on the board. The row number must be >= 0 and <= ${
          this.#board.length - 1
        } and the column number must be >= 0 and <= ${
          this.#board[0].length - 1
        }`,
      };
    }

    if (!isValidRow || !isValidColumn) {
      return {
        isValid: false,
        message: `Cell at row ${row} and column ${column} doesn't exist on the board. ${
          !isValidRow
            ? `The row number must be >= 0 and <= ${this.#board.length - 1}`
            : ""
        }${
          !isValidColumn
            ? `The column number must be >= 0 and <= ${
                this.#board[0].length - 1
              }`
            : ""
        }`,
      };
    }

    if (this.#getIsCellOccupied(row, column)) {
      return {
        isValid: false,
        message: `The cell of row ${row} and column ${column} is already occupied`,
      };
    }

    if (!this.#getIsCellOccupied(row - 1, column)) {
      return {
        isValid: false,
        message: `The cell of row ${row} and column ${column} cannot be placed as there is no disc below it`,
      };
    }

    return {
      isValid: true,
      message: "",
    };
  }

  #getIsCellOnBoard(row: number, column: number): ValidCellOnBoard {
    return {
      isValidRow: row >= 0 && row <= this.#board.length - 1,
      isValidColumn: column >= 0 && column <= this.#board[0].length - 1,
    };
  }

  #getIsCellOccupied(row: number, column: number): boolean {
    if (row < 0) return true;
    return this.#board[row][column].occupyingPlayer !== undefined;
  }
}
