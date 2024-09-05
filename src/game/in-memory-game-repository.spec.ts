import { GameStatus } from "./game-service.d";
import InMemoryGameRepository from "./in-memory-game-repository";

describe("in-memory-game-repository", () => {
  let gameRepository: InMemoryGameRepository;
  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
  });
  describe("creating a game repository", () => {
    it("creates an in memory game repository", () => {
      const repository = new InMemoryGameRepository();
      expect(repository).toBeInstanceOf(InMemoryGameRepository);
    });
  });
  describe("saving a game", () => {
    describe("given a gam to save", () => {
      it("saves the game", () => {
        const game = {
          board: [[1]],
          activePlayer: 1,
          players: {
            1: {
              player: 1,
              discsLeft: 1,
            },
            2: {
              player: 2,
              discsLeft: 2,
            },
          },
          status: GameStatus.IN_PROGRESS,
          playerColors: {
            playerOneColor: "red",
            playerTwoColor: "yellow",
          },
        };
        expect(gameRepository.saveGame(game)).resolves.toEqual(
          expect.objectContaining({
            uuid: expect.toBeUUID(),
            board: [[{ occupyingPlayer: 1 }]],
            players: {
              1: {
                player: 1,
                discsLeft: 1,
              },
              2: {
                player: 2,
                discsLeft: 2,
              },
            },
            status: GameStatus.IN_PROGRESS,
            playerColors: {
              playerOneColor: "red",
              playerTwoColor: "yellow",
            },
          })
        );
      });
    });
  });
});
