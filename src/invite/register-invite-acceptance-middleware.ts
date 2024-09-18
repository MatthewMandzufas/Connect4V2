import SessionService from "@/session/session-service";
import { RequestHandler, Router } from "express";
import halson from "halson";
import InviteService from "./invite-service";

const createAcceptInvitation =
  (
    InviteService: InviteService,
    sessionService: SessionService
  ): RequestHandler =>
  (req, res) => {
    console.log("params", req.params.invite_uuid);
    // InviteService.markInviteAsAccepted(req.params.invite_uuid);
    res.status(200).send(
      halson({
        _links: {
          related: [{ href: `/session/${sessionUuid}` }],
        },
      }).addLink("self", req.originalUrl)
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
