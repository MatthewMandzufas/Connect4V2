import Game from "./game";
import { GameFactory, GameRepository } from "./game-service.d";
import InMemoryGameRepository from "./in-memory-game-repository";

export default class GameService {
  #gameRepository: GameRepository;
  #gameFactory: GameFactory;

  constructor(
    gameRepository: InMemoryGameRepository,
    gameFactory: (...args: ConstructorParameters<typeof Game>) => Game
  ) {
    this.#gameRepository = gameRepository;
    this.#gameFactory = gameFactory;
  }
}
