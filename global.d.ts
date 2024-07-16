// declare module "expect" {
//   interface MatcherFunction<R> {
//     toBeUUID(received: string): R;
//   }
//   interface AsymmetricMatchers {
//     toBeUUID(received: string): void;
//   }
//   interface Matchers<R> {
//     toBeUUID(received: string): R;
//   }
// }

declare namespace jest {
  interface Matchers<R> {
    toBeUUID(): R;
  }
}
