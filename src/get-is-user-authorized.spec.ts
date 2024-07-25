import getIsUserAuthorized from "@/get-is-user-authorized";
import { EncryptJWT, generateKeyPair } from "jose";

describe("get-is-user-authorized", () => {
  describe("given a token", () => {
    describe("which cannot be decrypted using the private key", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = "pakhjsfdokjahbnsokrdh";
        expect(
          getIsUserAuthorized(token, privateKey, "someEma@email.com")
        ).resolves.toBe(false);
      });
    });
    describe("which is expired", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = await new EncryptJWT()
          .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A128CBC-HS256" })
          .setExpirationTime("1 day ago")
          .encrypt(publicKey);
        expect(
          getIsUserAuthorized(token, privateKey, "ksdaksnd@email.com")
        ).resolves.toBe(false);
      });
    });
    describe("which was not issued for the user", () => {
      it("returns false", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = await new EncryptJWT({ userName: "notEmail@email.com" })
          .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A128CBC-HS256" })
          .encrypt(publicKey);
        expect(
          getIsUserAuthorized(token, privateKey, "email@email.com")
        ).resolves.toBe(false);
      });
    });
    describe("which is valid for the user", () => {
      it("returns true", async () => {
        const { privateKey, publicKey } = await generateKeyPair("RS256");
        const token = await new EncryptJWT({
          userName: "Harley.Reid@email.com",
        })
          .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A128CBC-HS256" })
          .encrypt(publicKey);
        expect(
          getIsUserAuthorized(token, privateKey, "Harley.Reid@email.com")
        ).resolves.toBe(true);
      });
    });
  });
});
