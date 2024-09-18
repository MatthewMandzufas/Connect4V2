import SessionService from "@/session/session-service";
import express, { RequestHandler } from "express";
import { mergeRight, pipe } from "ramda";
import InviteService from "./invite-service";
import registerInviteAcceptanceMiddleware from "./register-invite-acceptance-middleware";
import registerInviteCreationMiddleware from "./register-invite-creation-middleware";

const createAuthorizationMiddleware: RequestHandler = (req, res, next) => {
  // console.log(res.locals.claims.email);
  res.locals.claims?.email
    ? next()
    : res.status(401).send({
        errors: ["You must be logged in to send an invitation"],
      });
};

const createGetInviteRequestHandler =
  (inviteService: InviteService): RequestHandler =>
  async (req, res, next) => {
    await inviteService
      .getInvitesReceivedByUser(res.locals.claims.email)
      .then((invites) => {
        res.status(200).send({
          invites: invites.map((inviteDetails) =>
            mergeRight(inviteDetails, {
              _links: {
                accept: {
                  href: `/invite/${inviteDetails.uuid}/accept`,
                  method: "POST",
                },
                decline: {
                  href: `/invite/${inviteDetails.uuid}/decline`,
                  method: "POST",
                },
              },
            })
          ),
        });
      });
  };

const inviteRouterFactory = (
  inviteService: InviteService,
  sessionService: SessionService
) =>
  pipe(
    (router) => router.use(createAuthorizationMiddleware),
    (router) =>
      router.get("/inbox", createGetInviteRequestHandler(inviteService)),
    (router) => registerInviteCreationMiddleware(router, inviteService),
    (router) =>
      registerInviteAcceptanceMiddleware(router, inviteService, sessionService)
  )(express.Router());

export default inviteRouterFactory;
