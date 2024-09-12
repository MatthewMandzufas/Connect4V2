import Game from "@/game/game";
import GameService from "@/game/game-service";
import InMemoryGameRepository from "@/game/in-memory-game-repository";
import { Uuid } from "@/global";
import { NoSuchSessionError } from "./errors";
import InMemorySessionRepository from "./in-memory-session-repository";
import SessionService from "./session-service";
import { ActiveGameInProgressError, SessionStatus } from "./types.d";

describe("session-service", () => {
  let sessionRepository: InMemorySessionRepository;
  let sessionService: SessionService;
  beforeEach(() => {
    sessionRepository = new InMemorySessionRepository();
    const gameRepository = new InMemoryGameRepository();
    const gameService = new GameService(
      gameRepository,
      (...args: ConstructorParameters<typeof Game>) => new Game(...args)
    );
    sessionService = new SessionService(sessionRepository, gameService);
  });

  describe("creating a session service", () => {
    describe("given a session repository", () => {
      it("creates a session service", () => {
        expect(sessionService).toBeInstanceOf(SessionService);
      });
    });
  });
  describe("creating a session", () => {
    describe("given the identities of two players", () => {
      it("creates an in-progress session", async () => {
        const sessionDetails = await sessionService.createSession({
          inviterUuid: "004be48d-d024-40b7-9b9e-e692adbd45ea",
          inviteeUuid: "53d13d08-6d6f-4d62-8753-52a91cc7b52e",
        });
        expect(sessionDetails).toEqual(
          expect.objectContaining({
            uuid: expect.toBeUUID(),
            inviter: expect.objectContaining({
              uuid: "004be48d-d024-40b7-9b9e-e692adbd45ea",
            }),
            invitee: expect.objectContaining({
              uuid: "53d13d08-6d6f-4d62-8753-52a91cc7b52e",
            }),
            status: "IN_PROGRESS",
          })
        );
      });
    });
  });
  describe("retrieving a session", () => {
    describe("given a session has been created", () => {
      describe("when provided with the id", () => {
        it("retrieves details about the session", async () => {
          const sessionDetails = await sessionService.createSession({
            inviterUuid: "6e07e2aa-f375-4020-838e-c3d7de8b79a6",
            inviteeUuid: "900821b2-fcec-414a-b1a6-02abbad7d35f",
          });

          const sessionId = sessionDetails.uuid;
          expect(sessionService.getSession(sessionId)).resolves.toEqual(
            expect.objectContaining({
              uuid: expect.toBeUUID(),
              inviter: {
                uuid: "6e07e2aa-f375-4020-838e-c3d7de8b79a6",
              },
              invitee: {
                uuid: "900821b2-fcec-414a-b1a6-02abbad7d35f",
              },
              status: SessionStatus.IN_PROGRESS,
            })
          );
        });
      });
    });
    describe("when provided with the uuid of a non-existent session", () => {
      it("throws a 'no such session' error", () => {
        const sessionUuid = "fakeNews" as Uuid;
        expect(sessionService.getSession(sessionUuid)).rejects.toThrow(
          new NoSuchSessionError()
        );
      });
    });
  });
  describe("adding games", () => {
    describe("given an in-progress session", () => {
      describe("with no games", () => {
        it("adds a new game to the session", async () => {
          const { uuid: sessionUuid } = await sessionService.createSession({
            inviterUuid: "70b9b52d-b993-4108-8719-8490878a3e35",
            inviteeUuid: "e5fef403-214c-46de-89be-655b90b9a79f",
          });

          expect(sessionService.getGameMetaData(sessionUuid)).resolves.toEqual(
            []
          );
          expect(
            sessionService.getActiveGameUuid(sessionUuid)
          ).resolves.toBeUndefined();
          expect(
            await sessionService.addNewGame(
              sessionUuid,
              "70b9b52d-b993-4108-8719-8490878a3e35",
              "e5fef403-214c-46de-89be-655b90b9a79f"
            )
          ).toBeUUID();
          const activeGameId = await sessionService.getActiveGameUuid(
            sessionUuid
          );
          expect(activeGameId).toBeUUID();
          expect(sessionService.getGameMetaData(sessionUuid)).resolves.toEqual([
            {
              gameUuid: activeGameId,
              playerOneUuid: "70b9b52d-b993-4108-8719-8490878a3e35",
              playerTwoUuid: "e5fef403-214c-46de-89be-655b90b9a79f",
            },
          ]);
          expect(await sessionService.getActivePlayer(sessionUuid)).toBe(
            "70b9b52d-b993-4108-8719-8490878a3e35"
          );
        });
      });
      describe("with an active game", () => {
        it("does not add a new game to the session", async () => {
          const { uuid: sessionUuid } = await sessionService.createSession({
            inviterUuid: "335f8389-9ff7-4027-9b16-1040c5018106",
            inviteeUuid: "637d72af-10c6-4421-a577-dd7a7d911075",
          });

          await sessionService.addNewGame(
            sessionUuid,
            "335f8389-9ff7-4027-9b16-1040c5018106",
            "637d72af-10c6-4421-a577-dd7a7d911075"
          );

          expect(
            sessionService.addNewGame(
              sessionUuid,
              "637d72af-10c6-4421-a577-dd7a7d911075",
              "335f8389-9ff7-4027-9b16-1040c5018106"
            )
          ).rejects.toThrow(
            new ActiveGameInProgressError(
              "You cannot add games whilst a game is in progress."
            )
          );
        });
      });
    });
  });
  describe("making moves", () => {
    describe("given a session", () => {
      describe("with an active game", () => {
        describe("and a valid move", () => {
          it("makes the move on the active game", async () => {
            const { uuid: sessionUuid } = await sessionService.createSession({
              inviterUuid: "73d67a64-9724-4a8a-9418-055a761e4df4",
              inviteeUuid: "ca1747c8-fe35-4807-9508-b88c0f39a8ff",
            });

            await sessionService.addNewGame(
              sessionUuid,
              "73d67a64-9724-4a8a-9418-055a761e4df4",
              "ca1747c8-fe35-4807-9508-b88c0f39a8ff"
            );

            const moveResult = await sessionService.submitMove({
              sessionUuid,
              playerUuid: "73d67a64-9724-4a8a-9418-055a761e4df4",
              targetCell: {
                row: 0,
                column: 0,
              },
            });
            expect(moveResult).toEqual({ moveSuccessful: true });
            expect(await sessionService.getActivePlayer(sessionUuid)).toBe(
              "ca1747c8-fe35-4807-9508-b88c0f39a8ff"
            );
          });
        });
        describe("and a move that is not valid for the active game", () => {
          it("does not make the move on the active game", async () => {
            const { uuid: sessionUuid } = await sessionService.createSession({
              inviterUuid: "5aff0192-5494-4488-84d5-387c6f499848",
              inviteeUuid: "bb896844-1cf8-4c87-b055-e75eb90aff39",
            });

            await sessionService.addNewGame(
              sessionUuid,
              "5aff0192-5494-4488-84d5-387c6f499848",
              "bb896844-1cf8-4c87-b055-e75eb90aff39"
            );

            const moveResult = await sessionService.submitMove({
              sessionUuid,
              playerUuid: "bb896844-1cf8-4c87-b055-e75eb90aff39",
              targetCell: {
                row: 0,
                column: 0,
              },
            });
            expect(moveResult).toEqual({
              moveSuccessful: false,
              message: "Player 2 cannot move as player 1 is currently active",
            });
            expect(await sessionService.getActivePlayer(sessionUuid)).toEqual(
              "5aff0192-5494-4488-84d5-387c6f499848"
            );
          });
        });
      });
    });
  });
});
