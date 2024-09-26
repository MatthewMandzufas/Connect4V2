type Uuid = `${string}-${string}-${string}-${string}-${string}`;

type SessionCreationDetails = {
  inviterUuid: Uuid;
  inviteeUuid: Uuid;
};

type GameMetaData = {
  gameUuid: Uuid;
  playerOneUuid: Uuid;
  playerTwoUuid: Uuid;
};

type SessionDetails = {
  uuid: Uuid;
  invitee: {
    uuid: Uuid;
  };
  inviter: {
    uuid: Uuid;
  };
  status: "IN_PROGRESS";
  games: Array<GameMetaData>;
  activeGameUuid?: Uuid;
};

type MoveDetails = {
  sessionUuid: Uuid;
  playerUuid: Uuid;
  targetCell: {
    row: number;
    column: number;
  };
};

interface SessionInterface {
  createSession: (
    sessionDetails: SessionCreationDetails,
  ) => Promise<SessionDetails>;
  getSession: (sessionId: Uuid) => Promise<SessionDetails>;
  getGameMetaData: (sessionUuid: Uuid) => Promise<Array<GameMetaData>>;
  getActiveGameUuid: (sessionUuid: Uuid) => Promise<Uuid>;
  addNewGame: (
    sessionUuid: Uuid,
    playerOneUuid: Uuid,
    playerTwoUuid: Uuid,
  ) => Promise<Uuid>;
  submitMove: (moveDetails: MoveDetails) => Promise<PlayerMoveResult>;
  getActivePlayer: (sessionUuid: Uuid) => Promise<Uuid>;
}

interface SessionRepository {
  create: (
    sessionCreationDetails: SessionCreationDetails,
  ) => Promise<SessionDetails>;
  getSession: (sessionUuid: Uuid) => Promise<SessionDetails>;
  addGame: (
    sessionUuid: Uuid,
    gameUuid: Uuid,
    playerOneUuid: Uuid,
    playerTwoUuid: Uuid,
  ) => Promise<SessionDetails>;
  setActiveGame: (sessionUuid: Uuid, gameUuid: Uuid) => Promise<SessionDetails>;
}
