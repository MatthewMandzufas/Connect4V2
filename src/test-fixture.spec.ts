import TestFixture from "./test-fixture";

describe(`test-fixture.js`, () => {
  describe(`Given no parameters`, () => {
    const testFixture = new TestFixture();
    it(`returns a text fixture, generating a default app`, () => {
      expect(testFixture).toBeInstanceOf(TestFixture);
    });
    describe(`signing up users`, () => {
      describe(`signing up a single user`, () => {
        describe(`given a users details`, () => {
          it(`signs up a user`, async () => {
            const userDetails = {
              firstName: "joe",
              lastName: "blogs",
              email: "joe.blogs@email.com",
              password: "somethingSafe",
            };
            const response = await testFixture.signUpUser(userDetails);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({
              firstName: "joe",
              lastName: "blogs",
              email: "joe.blogs@email.com",
              uuid: expect.toBeUUID(),
            });
          });
        });
      });
      describe(`signing up multiple users`, () => {
        describe(`given multiple users details`, () => {
          it.todo(`signs up all users`);
        });
      });
    });
    describe(`logging in a user`, () => {
      describe(`given an existing users details`, () => {
        it.todo(`logs in the user`);
      });
    });
    describe(`sending an invite`, () => {
      describe(`given a valid inviter/invitee`, () => {
        it.todo(`creates an invite`);
      });
    });
  });
  describe(`Given an app`, () => {
    it.todo(`returns a text fixture`);
  });
});
