import _toAsciiTable from "@/util/to-ascii-table";
import Game from "./game";
import { BoardCell } from "./types";

function toAsciiTable(board: Array<Array<BoardCell>>): string {
  const cellResolver = (cell: BoardCell) =>
    cell.occupyingPlayer === undefined ? "" : `${cell.occupyingPlayer}`;
  return _toAsciiTable(board, cellResolver);
}

describe("game", () => {
  describe("creating a game", () => {
    describe("given no arguments", () => {
      it("creates a new Game instance", () => {
        const game = new Game();
        expect(game).toBeInstanceOf(Game);
      });
      it("creates a game with an empty board of default size", () => {
        const game = new Game();
        const board = game.getBoard();
        expect(toAsciiTable(board)).toMatchInlineSnapshot(`
"
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|
|  |  |  |  |  |  |  |
|--|--|--|--|--|--|--|"
`);
      });
    });
  });

  describe("retrieving game details", () => {
    it("returns the games details", async () => {
      const game = new Game();
      expect(game.getDetails()).toEqual(
        expect.objectContaining({
          activePlayer: 1,
          playerColors: {
            playerOneColor: "FF5773",
            playerTwoColor: "fdfd96",
          },
          players: {
            1: {
              discsLeft: 21,
              player: 1,
            },
            2: {
              discsLeft: 21,
              player: 2,
            },
          },
          status: "IN_PROGRESS",
        })
      );
    });
  });
});
