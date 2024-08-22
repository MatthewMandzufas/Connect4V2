import TestFixture from "@/test-fixture";
import { last, pipe, split } from "ramda";
import { io as ioc } from "socket.io-client";

describe(`notification-integration`, () => {
  describe(`given a user exists`, () => {
    describe(`and they are logged in`, () => {
      describe(`when they connect to the notification endpoint`, () => {
        it(`the connection succeeds`, async () => {
          const testFixture = new TestFixture();
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

          const socket = ioc(uri, {
            auth: {
              token,
            },
          });

          socket.connect();

          expect(socket.connected).toBeTruthy();
        });
      });
    });
  });
});
