import { appFactory } from "@/app";
import { createSocketServer } from "@/create-server-side-web-socket";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import http from "http";
import { generateKeyPair } from "jose";
import { AddressInfo } from "net";
import { last, pipe, split } from "ramda";
import { io as ioc, Socket } from "socket.io-client";
import createDispatchNotification from "./create-dispatch-notification";

describe(`notification-integration`, () => {
  describe(`given a user exists`, () => {
    describe(`and they are logged in`, () => {
      describe(`when they connect to the notification endpoint`, () => {
        let app: Express;
        beforeEach(async () => {
          const httpServer = http.createServer().listen();
          const port = (httpServer.address() as AddressInfo).port;
          const authority = `localhost:${port}`;
          const jwtKeyPair = await generateKeyPair("RS256");
          app = appFactory({
            stage: "test",
            keys: { jwtKeyPair: jwtKeyPair },
            publishEvent: () => Promise.resolve(),
            authority,
          });
          httpServer.close();
          const { io } = createSocketServer(app, {
            port,
            path: "/notification",
            privateKey: jwtKeyPair.privateKey,
          });
        });
        let clientSocket: Socket;
        afterEach(() => {
          clientSocket.disconnect();
          clientSocket.close();
        });
        it(`the connection succeeds`, async () => {
          expect.assertions(2);

          const testFixture = new TestFixture(app);
          const loginResponse = await testFixture.signUpAndLoginEmailResponse(
            "myNewUser@email.com"
          );

          const {
            body: {
              notification: { uri },
            },
            headers: { authorization },
          } = loginResponse;

          const token = pipe(split(" "), last)(authorization);

          clientSocket = ioc(uri, {
            auth: {
              token,
            },
          });

          let resolvePromiseWhenSocketConnects;
          const promiseToBeResolvedWhenSocketConnects = new Promise(
            (resolve) => {
              resolvePromiseWhenSocketConnects = resolve;
            }
          );

          clientSocket.on("connect", () => {
            expect(clientSocket.connected).toBe(true);
            resolvePromiseWhenSocketConnects("Success!");
          });

          return expect(promiseToBeResolvedWhenSocketConnects).resolves.toBe(
            "Success!"
          );
        });
      });
      describe(`and they are connected to the notification endpoint`, () => {
        let clientSocket;
        let dispatchNotification;
        let app: Express;
        beforeEach(async () => {
          const httpServer = http.createServer().listen();
          const port = (httpServer.address() as AddressInfo).port;
          const authority = `localhost:${port}`;
          const jwtKeyPair = await generateKeyPair("RS256");
          app = appFactory({
            stage: "test",
            keys: { jwtKeyPair: jwtKeyPair },
            publishEvent: () => Promise.resolve(),
            authority,
          });
          httpServer.close();
          const { io } = createSocketServer(app, {
            port,
            path: "/notification",
            privateKey: jwtKeyPair.privateKey,
          });
          dispatchNotification = createDispatchNotification(io);
        });
        afterEach(() => {
          clientSocket.disconnect();
          clientSocket.close();
        });
        describe(`when a notification is dispatched to the user`, () => {
          it(`they receive the notification`, async () => {
            expect.assertions(1);

            const testFixture = new TestFixture(app);
            const loginResponse = await testFixture.signUpAndLoginEmailResponse(
              "myFav!@email.com"
            );

            const {
              body: {
                notification: { uri },
              },
              headers: { authorization },
            } = loginResponse;

            const token = pipe(split(" "), last)(authorization);

            clientSocket = ioc(uri, {
              auth: {
                token,
              },
            });

            let resolvePromiseWhenSocketReceivesEvent;
            const promiseToBeResolvedWhenSocketReceivesEvent = new Promise(
              (resolve) => {
                resolvePromiseWhenSocketReceivesEvent = resolve;
              }
            );

            let resolvePromiseWhenSocketConnects;
            const promiseToBeResolvedWhenSocketConnects = new Promise(
              (resolve) => (resolvePromiseWhenSocketConnects = resolve)
            );

            clientSocket
              .on("connection_established", () => {
                resolvePromiseWhenSocketConnects();
              })
              .on("example_event", (payload) => {
                resolvePromiseWhenSocketReceivesEvent(payload);
              });

            await promiseToBeResolvedWhenSocketConnects;

            dispatchNotification({
              recipient: "myFav!@email.com",
              type: "example_event",
              payload: {
                someData: "Good Job",
              },
            });

            return expect(
              promiseToBeResolvedWhenSocketReceivesEvent
            ).resolves.toEqual({
              someData: "Good Job",
            });
          });
        });
      });
    });
  });
});
