import BackendApi from "@/backend-api";

const backendApi = new BackendApi({ url: "http://localhost:3001" });

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
});
