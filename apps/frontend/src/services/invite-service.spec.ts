import BackendApi from "@/backend-api";
import nock from "nock";
import InviteService from "./invite-service";

const backendApi = new BackendApi({ url: "http://localhost:3001" });
nock("http://localhost:3001")
  .persist()
  .post("/invite")
  .reply(201, { isSuccess: true });
const inviteService = new InviteService({ backendApi });

describe(`invite-service`, () => {
  describe(`to an existing user`, () => {
    describe(`sends an an invite`, () => {
      it(`successfully sends the invite`, async () => {
        expect(
          await inviteService.sendInvite({
            invitee: "john@mail.com",
            inviter: "paul@mail.com",
          })
        ).toEqual(expect.objectContaining({ isSuccess: true }));
      });
    });
  });
});
