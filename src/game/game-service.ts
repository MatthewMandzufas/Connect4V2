import Game from "./game";
import InMemoryGameRepository from "./in-memory-game-repository";
import { GameFactory, GameRepository, GameServiceInterface } from "./types.d";

export default class GameService implements GameServiceInterface {
  #gameRepository: GameRepository;
  #gameFactory: GameFactory;

  constructor(
    gameRepository: InMemoryGameRepository,
    gameFactory: (...args: ConstructorParameters<typeof Game>) => Game
  ) {
    this.#gameRepository = gameRepository;
    this.#gameFactory = gameFactory;
  }

  async createGame() {
    const game = this.#gameFactory();
    const { uuid: gameUuid } = await this.#gameRepository.saveGame(game);
    return gameUuid;
  }

  async getGameDetails() {
    return {
      row: 1,
      column: 2,
    };
  }
}
