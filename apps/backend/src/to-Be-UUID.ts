import { expect } from "@jest/globals";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const toBeUUID: jest.CustomMatcher = function (
  this: jest.MatcherContext,
  received: string
) {
  const isNot = this?.isNot ?? false;
  const pass = UUID_REGEX.test(received);

  return {
    pass,
    message: () => `${received} is${isNot ? " a valid" : " an invalid"} UUID.`,
  };
};

expect.extend({
  toBeUUID,
});

export default toBeUUID;
