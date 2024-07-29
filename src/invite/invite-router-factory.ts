import express, { RequestHandler } from "express";
import InviteService from "./invite-service";

const createInvitationRequestHandler =
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
    next();
  };

const inviteRouterFactory = (inviteService: InviteService) => {
  const inviteRouter = express.Router();

  inviteRouter.post("/", createInvitationRequestHandler(inviteService));
  return inviteRouter;
};

export default inviteRouterFactory;
