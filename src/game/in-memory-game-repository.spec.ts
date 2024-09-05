import { GameDetails, GameStatus } from "./game-service.d";
import InMemoryGameRepository from "./in-memory-game-repository";

describe("in-memory-game-repository", () => {
  let gameRepository: InMemoryGameRepository;
  const gameDetails = {
    board: [[{ occupyingPlayer: 1 }]],
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
  } satisfies GameDetails;
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
    describe("given a game to save", () => {
      it("saves the game", () => {
        expect(gameRepository.saveGame(gameDetails)).resolves.toEqual(
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
  describe("loading a game", () => {
    describe("given a game has been saved", () => {
      describe("when given the uuid", () => {
        it("returns the game", async () => {
          const game = await gameRepository.saveGame(gameDetails);
          const uuid = game.uuid;

          expect(gameRepository.loadGame(uuid)).resolves.toEqual({
            uuid,
            ...gameDetails,
          });
        });
      });
    });
  });
});
