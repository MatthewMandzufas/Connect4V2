import { SessionRepository } from "./session-service.d";

export default class SessionService {
  #sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.#sessionRepository = sessionRepository;
  }
}
