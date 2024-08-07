import TestFixture from "./test-fixture";

describe(`test-fixture.js`, () => {
  describe(`Given no parameters`, () => {
    it(`returns a text fixture, generating a default app`, () => {
      const testFixture = new TestFixture();
      expect(testFixture).toBeInstanceOf(TestFixture);
    });
    describe(`signing up users`, () => {
      describe(`signing up a single user`, () => {
        describe(`given a users details`, () => {
          it(`signs up a user`, async () => {
            const testFixture = new TestFixture();
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
          it(`signs up all users`, async () => {
            const testFixture = new TestFixture();
            const user1Details = {
              firstName: "joe",
              lastName: "blogs",
              email: "joe.blogs@email.com",
              password: "somethingSafe",
            };
            const user2Details = {
              firstName: "joe1",
              lastName: "blogs",
              email: "joe1.blogs@email.com",
              password: "somethingSafe",
            };
            const firstResponse = await testFixture.signUpUser(user1Details);
            const secondResponse = await testFixture.signUpUser(user2Details);
            expect(firstResponse.statusCode).toBe(201);
            expect(secondResponse.statusCode).toBe(201);
            expect(firstResponse.body).toEqual({
              firstName: "joe",
              lastName: "blogs",
              email: "joe.blogs@email.com",
              uuid: expect.toBeUUID(),
            });
            expect(secondResponse.body).toEqual({
              firstName: "joe1",
              lastName: "blogs",
              email: "joe1.blogs@email.com",
              uuid: expect.toBeUUID(),
            });
          });
        });
      });
    });
    describe(`logging in a user`, () => {
      describe(`given an existing users credentials`, () => {
        it(`logs in the user`, async () => {
          const testFixture = new TestFixture();
          const userDetails = {
            firstName: "Jeremy",
            lastName: "Cameron",
            email: "Jez@email.com",
            password: "SuperDuperSafe",
          };
          await testFixture.signUpUser(userDetails);
          const userCredentials = {
            userName: "Jez@email.com",
            password: "SuperDuperSafe",
          };
          const response = await testFixture.loginUser(userCredentials);
          expect(response.statusCode).toBe(200);
        });
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
