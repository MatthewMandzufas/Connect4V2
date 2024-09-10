import {
  SessionCreationDetails,
  SessionDetails,
  SessionRepository,
  SessionStatus,
  Uuid,
} from "./types.d";

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
      status: SessionStatus.IN_PROGRESS,
    };
    this.#sessions.set(sessionUuid, sessionDetails);
    return Promise.resolve(sessionDetails);
  }

  getSession(sessionUuid: Uuid) {
    return Promise.resolve(this.#sessions.get(sessionUuid));
  }
}
