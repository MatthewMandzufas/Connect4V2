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
      gameUuids: [],
      activeGame: "",
    };
    this.#sessions.set(sessionUuid, sessionDetails);
    return Promise.resolve(sessionDetails);
  }

  async getSession(sessionUuid: Uuid) {
    return this.#sessions.get(sessionUuid);
  }

  async addGame(sessionUuid: Uuid, gameUuid: Uuid) {
    const sessionDetails = await this.getSession(sessionUuid);
    sessionDetails.gameUuids.push(gameUuid);
    return sessionDetails;
  }
}
