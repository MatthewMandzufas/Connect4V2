import { Uuid } from "@/global";
import UserService from "@/user/user-service";
import Express, { RequestHandler } from "express";
import halson from "halson";
import SessionService from "./session-service";

const createGetSessionRequestHandler =
  (sessionService: SessionService, userService: UserService): RequestHandler =>
  async (req, res, next) => {
    const {
      uuid,
      status,
      invitee: { uuid: inviteeUuid },
      inviter: { uuid: inviterUuid },
    } = await sessionService.getSession(req.params.sessionUuid as Uuid);

    const { email: inviteeEmail } = await userService.getUserDetailsByUuid(
      inviteeUuid
    );
    const { email: inviterEmail } = await userService.getUserDetailsByUuid(
      inviterUuid
    );
    res.status(200).json(
      halson({
        uuid,
        status,
        invitee: inviteeEmail,
        inviter: inviterEmail,
      })
        .addLink("self", req.originalUrl)
        .addLink("startGame", {
          href: `/session/${uuid}/startGame`,
          // @ts-ignore
          method: "POST",
        })
        .addLink("leave", {
          href: `/session/${uuid}/leave`,
          // @ts-ignore
          method: "GET",
        })
    );
  };
const sessionRouterFactory = (
  sessionService: SessionService,
  userService: UserService
) => {
  const sessionRouter = Express.Router();
  sessionRouter.get(
    "/:sessionUuid",
    createGetSessionRequestHandler(sessionService, userService)
  );

  return sessionRouter;
};

export default sessionRouterFactory;
