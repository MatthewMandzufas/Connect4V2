import deepClone from "@/util/deep-clone";
import { Board, BoardDimensions, GameInterface } from "./game-service.d";
const DEFAULT_BOARD_DIMENSIONS: BoardDimensions = {
  rows: 6,
  columns: 7,
};

export default class Game implements GameInterface {
  #board: Board;
  constructor() {
    this.#board = this.#createBoard(DEFAULT_BOARD_DIMENSIONS);
  }

  getBoard() {
    return deepClone(this.#board);
  }

  #createBoard(boardDimensions: { rows: number; columns: number }): Board {
    const board = new Array(boardDimensions.rows).fill(undefined).map(() =>
      new Array(boardDimensions.columns).fill(undefined).map(() => {
        return { occupyingPlayer: undefined };
      })
    );
    return board;
  }
}
