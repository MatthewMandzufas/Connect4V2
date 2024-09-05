import toAsciiTable from "@/util/to-ascii-table";
import Game from "./game";

describe("game", () => {
  describe("creating a game", () => {
    describe("given no arguments", () => {
      it("creates a new Game instance", () => {
        const game = new Game();
        expect(game).toBeInstanceOf(Game);
      });
    });
    it("creates a game with an empty board of default size", () => {
      const game = new Game();
      const board = game.getBoard();
      expect(toAsciiTable(board)).toMatchInlineSnapshot();
    });
  });
});
