import InMemoryGameRepository from "./in-memory-game-repository";

describe("game-service", () => {
  describe("creating a game service", () => {
    describe("given a game repository", () => {
      describe("and a game factory", () => {
        it("creates a game service", () => {
          const gameRepository = new InMemoryGameRepository();
          const gameService = new GameService(gameRepository, createGame);
          expect(gameService).toBeInstanceOf(GameService);
        });
      });
    });
  });
});
