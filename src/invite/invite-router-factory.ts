import express, { RequestHandler } from "express";
import InviteService from "./invite-service";

const createCreateInvitationRequestHandlerFactory =
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

const createAuthorizationMiddleware: RequestHandler = (req, res, next) => {
  res.locals.claims?.email
    ? next()
    : res.status(401).send({
        errors: ["You must be logged in to send an invitation"],
      });
};

const createInviteAuthorizationMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  const { inviter } = req.body;
  res.locals.claims.email === inviter
    ? next()
    : res.status(401).send({
        errors: ["You must be the authorized user to send an invitation"],
      });
};

const inviteRouterFactory = (inviteService: InviteService) => {
  const inviteRouter = express.Router();

  inviteRouter.use(createAuthorizationMiddleware);
  inviteRouter.post(
    "/",
    createInviteAuthorizationMiddleware,
    createCreateInvitationRequestHandlerFactory(inviteService)
  );
  return inviteRouter;
};

export default inviteRouterFactory;
