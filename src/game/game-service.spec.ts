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

  describe("creating a game", () => {
    let gameService: GameService;

    beforeEach(() => {
      const gameRepository = new InMemoryGameRepository();
      gameService = new GameService(
        gameRepository,
        (...args: ConstructorParameters<typeof Game>) => new Game(...args)
      );
    });

    describe("given no arguments", () => {
      it("creates a game with a 6x7 board", async () => {
        const gameUuid = await gameService.createGame();
        expect(gameUuid).toBeUUID();
        const gameDetails = await gameService.getGameDetails();
        expect(gameDetails).toEqual({
          rows: 6,
          columns: 7,
        });
      });
    });
  });
});
