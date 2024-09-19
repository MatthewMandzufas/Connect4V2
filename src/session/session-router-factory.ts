import { Uuid } from "@/global";
import Express, { RequestHandler } from "express";
import halson from "halson";
import SessionService from "./session-service";

const createGetSessionRequestHandler =
  (sessionService: SessionService): RequestHandler =>
  async (req, res, next) => {
    const { uuid, status } = await sessionService.getSession(
      req.params.sessionUuid as Uuid
    );

    res.status(200).json(
      halson({
        uuid,
        status,
      })
        .addLink("self", req.originalUrl)
        .addLink("startGame", {
          href: `/session/${uuid}/startGame`,
          method: "POST",
        })
        .addLink("leave", {
          href: `/session/${uuid}/leave`,
          method: "GET",
        })
    );
  };
const sessionRouterFactory = (sessionService: SessionService) => {
  const sessionRouter = Express.Router();
  sessionRouter.get(
    "/:sessionUuid",
    createGetSessionRequestHandler(sessionService)
  );

  return sessionRouter;
};

export default sessionRouterFactory;
