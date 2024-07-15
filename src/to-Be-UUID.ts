import { expect } from "@jest/globals";
import { MatcherFunction } from "expect";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const toBeUUID: MatcherFunction<[received: string]> = function (
  this: { isNot: boolean },
  received: string
) {
  const isNot = this?.isNot ?? false;

  return {
    pass: received.match(UUID_REGEX) !== null,
    message: () => `${received} is${isNot ? " a valid" : " an invalid"} UUID.`,
  };
};

expect.extend({
  toBeUUID,
});

export default toBeUUID;
