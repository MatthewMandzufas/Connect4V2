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
    const sessionDetails = {
      inviter: {
        uuid: inviterUuid,
      },
      invitee: {
        uuid: inviteeUuid,
      },
    };
    const sessionUuid = crypto.randomUUID();
    this.#session.set(sessionUuid, sessionDetails);
    return sessionDetails;
  }
}
