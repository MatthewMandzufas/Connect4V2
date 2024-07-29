import InMemoryUserRepositoryFactory from "@/user/in-memory-user-repository";
import UserService from "@/user/user-service";
import InviteService from "./invite-service";

const createUserServiceWithInviterAndInvitee = () => {
  const userRepository = new InMemoryUserRepositoryFactory();
  const userService = new UserService(userRepository);
  const inviterUserDetails = {
    firstName: "Player",
    lastName: "1",
    email: "player1@email.com",
    password: "awejoajseojase",
  };

  const inviteeUserDetails = {
    firstName: "Player",
    lastName: "2",
    email: "player2@email.com",
    password: "aksjdnlksdlkasd",
  };
  userService.create(inviterUserDetails);
  userService.create(inviteeUserDetails);
  return userService;
};

describe("invite-service", () => {
  const lengthOfDayInMilliseconds = 1000 * 60 * 60 * 24;
  describe("given an inviter who is an existing user", () => {
    describe("and an invitee who is an existing user", () => {
      it("creates an invite", () => {
        jest.useFakeTimers({ doNotFake: ["setImmediate"] });
        const currentTime = Date.now();
        jest.setSystemTime(currentTime);

        const userService = createUserServiceWithInviterAndInvitee();
        const inviteService = new InviteService(userService);
        const inviteDetails = inviteService.create({
          invitee: "player2@email.com",
          inviter: "player1@email.com",
        });

        expect(inviteDetails).toEqual({
          uuid: expect.toBeUUID(),
          exp: currentTime + lengthOfDayInMilliseconds,
        });
      });
    });
  });
});
