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
    inviteService
      .create({ invitee, inviter })
      .then(({ uuid, exp }) =>
        res.status(201).send({ invite: { inviter, invitee, uuid, exp } })
      )
      .catch((error) => res.status(403).send({ errors: [error.message] }));
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
