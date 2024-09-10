import GameService from "@/game/game-service";
import { NoSuchSessionError } from "./errors";
import {
  SessionCreationDetails,
  SessionInterface,
  SessionRepository,
  Uuid,
} from "./types";

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
    const newGameUuid = await this.#gameService.createGame();
    await this.#sessionRepository.addGame(newGameUuid);
    await this.#sessionRepository.updateActiveGame(newGameUuid);
    return newGameUuid;
  }
}
