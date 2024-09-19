import { Uuid } from "@/global";
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

const createGetInviteReceivedRequestHandler =
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

const createGetInviteRequestHandler =
  (inviteService: InviteService): RequestHandler =>
  async (req, res, next) => {
    const inviteDetails = await inviteService.getInvite(
      req.params.inviteUuid as Uuid
    );
    res.status(200).send({ invite: inviteDetails });
  };

const inviteRouterFactory = (
  inviteService: InviteService,
  sessionService: SessionService
) =>
  pipe(
    (router) => router.use(createAuthorizationMiddleware),
    (router) =>
      router.get(
        "/inbox",
        createGetInviteReceivedRequestHandler(inviteService)
      ),
    (router) => registerInviteCreationMiddleware(router, inviteService),
    (router) =>
      registerInviteAcceptanceMiddleware(router, inviteService, sessionService),
    (router) =>
      router.get("/:inviteUuid", createGetInviteRequestHandler(inviteService))
  )(express.Router());

export default inviteRouterFactory;
