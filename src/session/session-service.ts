import GameService from "@/game/game-service";
import { PlayerNumber } from "@/game/types";
import { NoSuchSessionError } from "./errors";
import {
  ActiveGameInProgressError,
  GameMetaData,
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

  async getGameMetaData(sessionUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    return sessionDetails.games;
  }

  async getActiveGameUuid(sessionUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    return sessionDetails.activeGameUuid;
  }

  async addNewGame(
    sessionUuid: Uuid,
    playerOneUuid: Uuid,
    playerTwoUuid: Uuid
  ) {
    if ((await this.getActiveGameUuid(sessionUuid)) === undefined) {
      const newGameUuid = await this.#gameService.createGame();
      await this.#sessionRepository.addGame(
        sessionUuid,
        newGameUuid,
        playerOneUuid,
        playerTwoUuid
      );
      await this.#sessionRepository.setActiveGame(sessionUuid, newGameUuid);
      return newGameUuid;
    } else {
      throw new ActiveGameInProgressError(
        "You cannot add games whilst a game is in progress."
      );
    }
  }

  async submitMove({ sessionUuid, playerUuid, targetCell }) {
    const {
      inviter: { uuid: inviterUuid },
      activeGameUuid,
    } = await this.getSession(sessionUuid);

    return this.#gameService.submitMove(activeGameUuid, {
      player: playerUuid === inviterUuid ? 1 : 2,
      targetCell,
    });
  }

  async #mapPlayerNumberToPlayerUuid(
    playerNumber: PlayerNumber,
    gameMetaData: GameMetaData
  ) {
    return playerNumber === 1
      ? gameMetaData.playerOneUuid
      : gameMetaData.playerTwoUuid;
  }

  async getActivePlayer(sessionUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    const activeGameUuid = sessionDetails.activeGameUuid;
    const { activePlayer } = await this.#gameService.getGameDetails(
      activeGameUuid
    );
    const gameMetaData = await this.getGameMetaData(sessionUuid);
    return await this.#mapPlayerNumberToPlayerUuid(
      activePlayer,
      gameMetaData.at(-1)
    );
  }
}
