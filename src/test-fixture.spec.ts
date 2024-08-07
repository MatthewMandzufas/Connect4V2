import TestFixture from "./test-fixture";

describe(`test-fixture.js`, () => {
  describe(`Given no parameters`, () => {
    it(`returns a text fixture, generating a default app`, () => {
      const testFixture = new TestFixture();
      expect(testFixture).toBeInstanceOf(TestFixture);
    });
  });
  it.todo(`finish test cases for a test fixture`);
});
