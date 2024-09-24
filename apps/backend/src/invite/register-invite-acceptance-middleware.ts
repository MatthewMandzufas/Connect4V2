import { Uuid } from "@/global";
import SessionService from "@/session/session-service";
import { RequestHandler, Router } from "express";
import halson from "halson";
import InviteService from "./invite-service";

const createAcceptInvitation =
  (
    inviteService: InviteService,
    sessionService: SessionService
  ): RequestHandler =>
  async (req, res) => {
    const sessionUuid = await inviteService.acceptInvite(
      req.params.invite_uuid as Uuid
    );
    res.status(200).send(
      halson({
        _links: {
          related: [{ href: `/session/${sessionUuid}` }],
        },
      }).addLink("self", `/invite/${req.params.invite_uuid}`)
    );
  };

const registerInviteAcceptanceMiddleware = (
  router: Router,
  inviteService: InviteService,
  sessionService: SessionService
) => {
  return router.post(
    "/:invite_uuid/accept",
    createAcceptInvitation(inviteService, sessionService)
  );
};

export default registerInviteAcceptanceMiddleware;
