import Game from "./game";

describe("game", () => {
  describe("creating a game", () => {
    describe("given no arguments", () => {
      it("creates a new Game instance", () => {
        const game = new Game();
        expect(game).toBeInstanceOf(Game);
      });
    });
  });
});
