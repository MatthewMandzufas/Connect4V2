import GameService from "@/game/game-service";
import { NoSuchSessionError } from "./errors";
import {
  ActiveGameInProgressError,
  SessionCreationDetails,
  SessionInterface,
  SessionRepository,
  Uuid,
} from "./types.d";

export default class SessionService implements SessionInterface {
  #sessionRepository: SessionRepository;
  #gameService: GameService;

  constructor(sessionRepository: SessionRepository, gameService: GameService) {
    this.#sessionRepository = sessionRepository;
    this.#gameService = gameService;
  }

  createSession(sessionDetails: SessionCreationDetails) {
    return this.#sessionRepository.create(sessionDetails);
  }

  async getSession(sessionId: Uuid) {
    const sessionDetails = await this.#sessionRepository.getSession(sessionId);
    if (sessionDetails === undefined) {
      throw new NoSuchSessionError();
    }

    return sessionDetails;
  }

  async getGameUuids(sessionUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    return sessionDetails.gameUuids;
  }

  async getActiveGameUuid(sessionUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    return sessionDetails.activeGameUuid;
  }

  async addNewGame(sessionUuid: Uuid) {
    if ((await this.getActiveGameUuid(sessionUuid)) === undefined) {
      const newGameUuid = await this.#gameService.createGame();
      await this.#sessionRepository.addGame(sessionUuid, newGameUuid);
      await this.#sessionRepository.setActiveGame(sessionUuid, newGameUuid);
      return newGameUuid;
    } else {
      throw new ActiveGameInProgressError(
        "You cannot add games whilst a game is in progress."
      );
    }
  }
}
