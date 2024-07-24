import { generateKeyPair } from "jose";

describe("get-is-user-authorized", () => {
  describe("given a token", () => {
    describe("which cannot be decrypted using the private key", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = "pakhjsfdokjahbnsokrdh";
        expect(getIsUserAuthorized(token, privateKey)).toBe(false);
      });
    });
  });
});
