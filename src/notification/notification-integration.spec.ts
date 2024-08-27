import { appFactory } from "@/app";
import TestFixture from "@/test-fixture";
import { Express } from "express";
import { generateKeyPair } from "jose";
import { last, pipe, split } from "ramda";
import { io as ioc, Socket } from "socket.io-client";

describe(`notification-integration`, () => {
  let app: Express;
  beforeEach(async () => {
    const jwtKeyPair = await generateKeyPair("RS256");
    app = appFactory({
      stage: "test",
      keys: { jwtKeyPair: jwtKeyPair },
      publishEvent: () => Promise.resolve(),
      port: 3014,
    });
  });
  describe(`given a user exists`, () => {
    describe(`and they are logged in`, () => {
      describe(`when they connect to the notification endpoint`, () => {
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
    });
  });
});
