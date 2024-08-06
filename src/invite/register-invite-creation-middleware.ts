import { RequestHandler, Router } from "express";
import InviteService from "./invite-service";

const authorizeInvitationCreationRequest: RequestHandler = (req, res, next) => {
  const { inviter } = req.body;
  res.locals.claims.email === inviter
    ? next()
    : res.status(403).send({
        errors: ["You must be the authorized user to send an invitation"],
      });
};

const createCreateInvitation =
  (inviteService: InviteService): RequestHandler =>
  async (req, res, next) => {
    const { invitee, inviter } = req.body;
    const { uuid, exp } = await inviteService.create({ invitee, inviter });
    const inviteDetails = {
      inviter,
      invitee,
      uuid,
      exp,
    };

    res.status(201).send({ invite: inviteDetails });
  };

const registerInviteCreationMiddleware = (
  router: Router,
  inviteService: InviteService
) =>
  router.post(
    "/",
    authorizeInvitationCreationRequest,
    createCreateInvitation(inviteService)
  );

export default registerInviteCreationMiddleware;
