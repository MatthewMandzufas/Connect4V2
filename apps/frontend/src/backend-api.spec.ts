import BackendApi from "@/backend-api";
import nock from "nock";

const backendApi = new BackendApi({ url: "http://localhost:3001" });
nock("http://localhost:3001")
  .persist()
  .post("/user/signup")
  .reply(201, { isSuccess: true });

nock("http://localhost:3001")
  .persist()
  .post("/user/delete")
  .reply(200, { isSuccess: true });

nock("http://localhost:3001")
  .persist()
  .defaultReplyHeaders({ authorization: "token" })
  .post("/user/login")
  .reply(200, { isSuccess: true });

nock("http://localhost:3001")
  .persist()
  .defaultReplyHeaders({ authorization: "token" })
  .post("/invite")
  .reply(201, { isSuccess: true });

describe(`backend-api`, () => {
  describe(`signup`, () => {
    describe(`given signup credentials`, () => {
      it(`sends a request and receives a response object`, async () => {
        const response = await backendApi.signUp({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@gmail.com",
          password: "Hello123",
        });

        expect(response).toBeInstanceOf(Response);
      });
    });
  });
  describe(`login`, () => {
    describe(`given login credentials`, () => {
      it(`sends a request and receives a response object`, async () => {
        const response = await backendApi.login({
          email: "john@mail.com",
          password: "Hello123",
        });
        expect(response).toBeInstanceOf(Response);
      });
    });
  });
  describe("delete a user", () => {
    describe("given an existing user", () => {
      describe("and the email of the existing user to delete", () => {
        it("deletes the user", async () => {
          await backendApi.signUp({
            firstName: "Joe",
            lastName: "Bloggs",
            email: "joe.bloggs@gmail.com",
            password: "Hello123",
          });

          const response = await backendApi.deleteUser("joe.bloggs@gmail.com");
          expect(response).toBeInstanceOf(Response);
        });
      });
    });
  });
  describe(`invite`, () => {
    describe(`given invite details`, () => {
      it(`sends the email to the backend and gets a response`, async () => {
        await backendApi.signUp({
          firstName: "Joe",
          lastName: "Bloggs",
          email: "joe@mail.com",
          password: "Hello123",
        });
        await backendApi.signUp({
          firstName: "Paul",
          lastName: "Bloggs",
          email: "paul@mail.com",
          password: "Hello123",
        });
        await backendApi.login({
          email: "john@mail.com",
          password: "Hello123",
        });

        expect(
          await backendApi.sendInvite({
            inviter: "john@mail.com",
            invitee: "paul@mail.com",
          })
        ).toBeInstanceOf(Response);
      });
    });
  });
});
