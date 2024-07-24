import getIsUserAuthorized from "@/get-is-user-authorized";
import { EncryptJWT, generateKeyPair } from "jose";

describe("get-is-user-authorized", () => {
  describe("given a token", () => {
    describe("which cannot be decrypted using the private key", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = "pakhjsfdokjahbnsokrdh";
        expect(getIsUserAuthorized(token, privateKey)).resolves.toBe(false);
      });
    });
    describe("which is expired", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = await new EncryptJWT()
          .setProtectedHeader({ alg: "RSA-DAEP-256", enc: "A128CBC-HS256" })
          .setExpirationTime("1 day ago")
          .encrypt(publicKey);
        expect(getIsUserAuthorized(token, privateKey)).resolves.toBe(false);
      });
    });
  });
});
