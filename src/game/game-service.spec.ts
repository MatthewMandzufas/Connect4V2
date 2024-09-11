import Game from "./game";
import GameService from "./game-service";
import InMemoryGameRepository from "./in-memory-game-repository";

describe("game-service", () => {
  let mockedPlayerMovedEventHandler: jest.Mock;
  let gameService: GameService;
  beforeEach(() => {
    mockedPlayerMovedEventHandler = jest.fn();
    const gameRepository = new InMemoryGameRepository();
    gameService = new GameService(
      gameRepository,
      (...args: ConstructorParameters<typeof Game>) => new Game(...args)
    );
  });
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
    describe("given no arguments", () => {
      it("creates a game with a 6x7 board", async () => {
        const gameUuid = await gameService.createGame();
        expect(gameUuid).toBeUUID();
        const gameDetails = await gameService.getGameDetails(gameUuid);
        expect(gameDetails).toEqual(
          expect.objectContaining({
            activePlayer: 1,
            board: expect.anything(),
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
            uuid: expect.toBeUUID(),
          })
        );
      });
    });
  });
  describe("making a move", () => {
    describe("given the uuid of a game", () => {
      describe("and a valid move", () => {
        describe("and the service was created with a handler for playerMovedEvents", () => {
          it("calls the handler with the details of the move", async () => {
            const gameUuid = await gameService.createGame();

            await gameService.submitMove(gameUuid, {
              player: 1,
              position: {
                row: 0,
                column: 0,
              },
            });

            expect(mockedPlayerMovedEventHandler).toHaveBeenLastCalledWith({
              type: "player_moved",
              payload: {
                player: 1,
                position: {
                  row: 0,
                  column: 0,
                },
              },
            });
          });
        });
      });
    });
  });
});
