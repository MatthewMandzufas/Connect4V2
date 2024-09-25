import toBeUUID from "./to-Be-UUID";

describe("toBeUUID", () => {
  describe("given a valid v4 UUID string", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";

    it("returns a positive MatcherResult object", () => {
      const result = toBeUUID.call({ isNot: false }, validUUID);
      expect(result).toEqual({
        pass: true,
        message: expect.any(Function),
      });
    });

    it("the return message function returns a valid message", () => {
      const result = toBeUUID.call({ isNot: false }, validUUID);
      const message = result.message();
      expect(message).toEqual(`${validUUID} is an invalid UUID.`);
    });

    describe("and we use the negated matcher", () => {
      it("should return a negative MatcherResult", () => {
        const result = toBeUUID.call({ isNot: true }, validUUID);
        expect(result).toEqual({
          pass: true,
          message: expect.any(Function),
        });
      });

      it("returns a message function, indicating the provided UUID is invalid", () => {
        const result = toBeUUID.call({ isNot: true }, validUUID);
        const message = result.message();
        expect(message).toEqual(`${validUUID} is a valid UUID.`);
      });
    });
  });

  describe("given an invalid v4 UUID string", () => {
    const invalidUUID = "23214323";

    it("returns a negative MatcherResult", () => {
      const result = toBeUUID.call({ isNot: false }, invalidUUID);
      expect(result).toEqual({
        pass: false,
        message: expect.any(Function),
      });
    });

    it("the return message function returns a valid message", () => {
      const result = toBeUUID.call({ isNot: false }, invalidUUID);
      const message = result.message();
      expect(message).toEqual(`${invalidUUID} is an invalid UUID.`);
    });

    describe("and we use the negated matcher", () => {
      it("should return a negative MatcherResult", () => {
        const result = toBeUUID.call({ isNot: true }, invalidUUID);
        expect(result).toEqual({
          pass: false,
          message: expect.any(Function),
        });
      });

      it("returns a message function, indicating the provided UUID is invalid", () => {
        const result = toBeUUID.call({ isNot: true }, invalidUUID);
        const message = result.message();
        expect(message).toEqual(`${invalidUUID} is a valid UUID.`);
      });
    });
  });
});
