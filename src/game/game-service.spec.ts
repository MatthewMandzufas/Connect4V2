import Game from "./game";
import GameService from "./game-service";
import InMemoryGameRepository from "./in-memory-game-repository";

describe("game-service", () => {
  describe("creating a game service", () => {
    describe("given a game repository", () => {
      describe("and a game constructor ", () => {
        it("creates a game service", () => {
          const gameRepository = new InMemoryGameRepository();
          const gameService = new GameService(
            gameRepository,
            (...args: ConstructorParameters<typeof Game>) => new Game(...args)
          );
          expect(gameService).toBeInstanceOf(GameService);
        });
      });
    });
  });
});
