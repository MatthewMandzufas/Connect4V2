import Express from "express";
import SessionService from "./session-service";

const sessionRouterFactory = (sessionService: SessionService) => {
  const sessionRouter = Express.Router();
  return sessionRouter;
};

export default sessionRouterFactory;
