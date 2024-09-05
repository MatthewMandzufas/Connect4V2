/* eslint-disable @typescript-eslint/no-explicit-any */

function getIsPlainObjectOrArray(value: any): value is object | any[] {
  return (
    (value !== null &&
      typeof value === "object" &&
      Object.getPrototypeOf(value) === Object.prototype) ||
    Array.isArray(value)
  );
}

function getIfDeepUnequal(value1: any, value2: any): boolean {
  if (
    (getIsPlainObjectOrArray(value1) && !getIsPlainObjectOrArray(value2)) ||
    (!getIsPlainObjectOrArray(value1) && getIsPlainObjectOrArray(value2)) ||
    (!getIsPlainObjectOrArray(value1) && !getIsPlainObjectOrArray(value2))
  ) {
    return true;
  }

  if (value1 === value2) return false;

  const objectKeys1 = Object.keys(value1);

  const isDeeplyUnequal = objectKeys1.reduce(
    (isDeepUnequal, currentKey): boolean =>
      isDeepUnequal && getIfDeepUnequal(value1[currentKey], value2[currentKey]),
    true
  );

  return isDeeplyUnequal;
}

function toBeDeeplyUnequal(
  this: jest.MatcherContext,
  received: object,
  expected: object
): jest.CustomMatcherResult {
  const isNot = this?.isNot ?? false;
  const areObjectsDifferent = getIfDeepUnequal(received, expected);
  return {
    pass: areObjectsDifferent,
    message: () => `Objects are deeply ${isNot ? "un" : ""}equal`,
  };
}

export default toBeDeeplyUnequal;
