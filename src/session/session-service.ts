import {
  SessionCreationDetails,
  SessionInterface,
  SessionRepository,
  Uuid,
} from "./session-service.d";

export default class SessionService implements SessionInterface {
  #sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.#sessionRepository = sessionRepository;
  }

  createSession(sessionDetails: SessionCreationDetails) {
    return this.#sessionRepository.create(sessionDetails);
  }

  getSession(sessionId: Uuid) {
    return this.#sessionRepository.getSession(sessionId);
  }
}
