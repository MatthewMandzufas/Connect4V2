import { Uuid } from "@/global";
import Game from "./game";
import InMemoryGameRepository from "./in-memory-game-repository";
import {
  GameFactory,
  GameRepository,
  GameServiceInterface,
  PlayerMoveDetails,
} from "./types.d";

export default class GameService implements GameServiceInterface {
  #gameRepository: GameRepository;
  #gameFactory: GameFactory;

  constructor(
    gameRepository: InMemoryGameRepository = new InMemoryGameRepository(),
    gameFactory: (...args: ConstructorParameters<typeof Game>) => Game,
  ) {
    this.#gameRepository = gameRepository;
    this.#gameFactory = gameFactory;
  }

  async createGame() {
    const game = this.#gameFactory();
    const { uuid: gameUuid } = await this.#gameRepository.saveGame(
      game.getDetails(),
    );
    return gameUuid;
  }

  async getGameDetails(gameUuid: Uuid) {
    return this.#gameRepository.loadGame(gameUuid);
  }

  async submitMove(gameUuid: Uuid, moveDetails: PlayerMoveDetails) {
    const gameDetails = await this.#gameRepository.loadGame(gameUuid);
    const game = new Game(gameDetails);
    const moveResult = game.move(moveDetails);
    await this.#gameRepository.updateGame(gameUuid, game.getDetails());
    return moveResult;
  }
}
