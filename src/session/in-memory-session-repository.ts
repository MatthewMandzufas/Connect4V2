import {
  SessionCreationDetails,
  SessionDetails,
  SessionRepository,
  Uuid,
} from "./session-service.d";

export default class InMemorySessionRepository implements SessionRepository {
  #session: Map<Uuid, SessionDetails>;

  constructor() {
    this.#session = new Map();
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
    this.#session.set(sessionUuid, sessionDetails);
    return sessionDetails;
  }

  getSession(sessionUuid: Uuid) {
    return this.#session.get(sessionUuid);
  }
}
