import {
  SessionCreationDetails,
  SessionDetails,
  SessionRepository,
  Uuid,
} from "./session-service.d";

export default class InMemorySessionRepository implements SessionRepository {
  #sessions: Map<Uuid, SessionDetails>;

  constructor() {
    this.#sessions = new Map();
  }

  create({ inviterUuid, inviteeUuid }: SessionCreationDetails) {
    const sessionUuid = crypto.randomUUID();
    const sessionDetails = {
      uuid: sessionUuid,
      inviter: {
        uuid: inviterUuid,
      },
      invitee: {
        uuid: inviteeUuid,
      },
    };
    this.#sessions.set(sessionUuid, sessionDetails);
    return Promise.resolve(sessionDetails);
  }

  getSession(sessionUuid: Uuid) {
    return Promise.resolve(this.#sessions.get(sessionUuid));
  }
}
