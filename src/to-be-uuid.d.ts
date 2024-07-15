declare module "expect" {
  interface AsymmetricMatchers {
    toBeUUID(received: string): void;
  }
  interface Matchers<R> {
    toBeUUID(received: string): R;
  }
}
