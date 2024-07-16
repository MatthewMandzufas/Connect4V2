// import { expect } from "@jest/globals";
// import { MatcherFunction } from "expect";

// const UUID_REGEX =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// const toBeUUID: MatcherFunction<[received: string]> = function (
//   this: { isNot: boolean },
//   received: string
// ) {
//   const isNot = this?.isNot ?? false;

//   return {
//     pass: received.match(UUID_REGEX) !== null,
//     message: () => `${received} is${isNot ? " a valid" : " an invalid"} UUID.`,
//   };
// };

// expect.extend({
//   toBeUUID,
// });

// export default toBeUUID;

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

// declare global {
//   namespace jest {
//     interface Matchers<R> {
//       toBeUUID(): R;
//     }
//   }
// }
