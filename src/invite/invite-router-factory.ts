import express, { RequestHandler } from "express";
import { pipe } from "ramda";
import InviteService from "./invite-service";
import registerInviteCreationMiddleware from "./register-invite-creation-middleware";

const createAuthorizationMiddleware: RequestHandler = (req, res, next) => {
  res.locals.claims?.email
    ? next()
    : res.status(401).send({
        errors: ["You must be logged in to send an invitation"],
      });
};

const createGetInviteMiddleware =
  (inviteService: InviteService): RequestHandler =>
  (req, res, next) => {
    inviteService.getUsersInvites(res.locals.claims.email).then((invites) => {
      res.status(200).send({ invites });
    });
  };

const inviteRouterFactory = (inviteService: InviteService) =>
  pipe(
    (router) => router.use(createAuthorizationMiddleware),
    (router) => router.get("/inbox", createGetInviteMiddleware(inviteService)),
    (router) => registerInviteCreationMiddleware(router, inviteService)
  )(express.Router());

export default inviteRouterFactory;
