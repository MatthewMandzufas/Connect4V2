import toBeUUID from "./to-Be-UUID";

describe("toBeUUID", () => {
  describe("given a valid v4 UUID string", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";
    it("returns a positive MatcherResult objects", () => {
      // @ts-ignore
      // TODO: fix linter
      expect(toBeUUID(validUUID)).toEqual({
        pass: true,
        message: expect.any(Function),
      });
    });
    it("the return message function, returns a valid message", async () => {
      // @ts-ignore
      const message = await toBeUUID(validUUID).message;
      expect(message()).toEqual(`${validUUID} is an invalid UUID.`);
    });
    describe("and we use the negated matcher", () => {
      it("should return a negative MatcherResult", () => {
        const boundToBeUUID = toBeUUID.bind({
          isNot: true,
        });

        expect(boundToBeUUID(validUUID)).toEqual({
          pass: true,
          message: expect.any(Function),
        });
      });
      it("returns a message function, indicating the provided UUID is invalid", () => {
        const negatedToBeUUID = toBeUUID.bind({
          isNot: true,
        });
        const { message } = negatedToBeUUID(validUUID);

        expect(message()).toEqual(`${validUUID} is a valid UUID.`);
      });
    });
  });
  describe("given an invalid v4 UUID string", () => {
    const invalidUUID = "23214323";

    it("returns a negative MatcherResult", () => {
      // @ts-ignore
      expect(toBeUUID(invalidUUID)).toEqual({
        pass: false,
        message: expect.any(Function),
      });
    });
    it("the return message function, returns a valid message", () => {
      // @ts-ignore
      const { message } = toBeUUID(invalidUUID);

      expect(message()).toEqual(`${invalidUUID} is an invalid UUID.`);
    });
    describe("and we use the negated matcher", () => {
      it("should return a negative MatcherResult", () => {
        const negatedToBeUUID = toBeUUID.bind({
          isNot: true,
        });

        expect(negatedToBeUUID(invalidUUID)).toEqual({
          pass: false,
          message: expect.any(Function),
        });
      });
      it("returns a message function, indicating the provided UUID is invalid", () => {
        const negatedToBeUUID = toBeUUID.bind({
          isNot: true,
        });
        const { message } = negatedToBeUUID(invalidUUID);
        expect(message()).toEqual(`${invalidUUID} is a valid UUID.`);
      });
    });
  });
});
