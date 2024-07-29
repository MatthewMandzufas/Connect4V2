import express, { RequestHandler } from "express";

const createInvitationRequestHandler: RequestHandler =
  (inviteService: InviteService): RequestHandler =>
  (req, res, next) => {
    const { invitee, inviter } = req.body;
    const { uuid, exp } = inviteService({ invitee, inviter });
    const inviteDetails = {
      inviter,
      invitee,
      uuid,
      exp,
    };
    res.status(201).send({ invite: inviteDetails });
  };

const inviteRouterFactory = () => {
  const inviteRouter = express.Router();

  inviteRouter.post("/", createInvitationRequestHandler(inviteService));
  return inviteRouter;
};

export default inviteRouterFactory;
