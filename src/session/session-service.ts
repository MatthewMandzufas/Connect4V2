import { NoSuchSessionError } from "./errors";
import {
  SessionCreationDetails,
  SessionInterface,
  SessionRepository,
  Uuid,
} from "./types";

export default class SessionService implements SessionInterface {
  #sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.#sessionRepository = sessionRepository;
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
}
