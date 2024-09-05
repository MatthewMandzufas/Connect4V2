/* eslint-disable @typescript-eslint/no-explicit-any */

describe("toBeDeeplyUnequal", () => {
  it("should fail when given objects are the same object", () => {
    const firstObject = { a: 1, b: 2 };
    const secondObject = firstObject;
    expect(firstObject).not.toBeDeeplyUnequal(secondObject);
  });
  it("should pass when given objects are different objects", () => {
    const firstObject = {};
    const secondObject = {};
    expect(firstObject).toBeDeeplyUnequal(secondObject);
  });
  it("should pass when objects are unequal at a shallow level", () => {
    const object1 = { a: 1, b: 2 };
    const object2 = { a: 1, b: 2 };
    expect(object1).toBeDeeplyUnequal(object2);
  });
  it("should pass where the first object has an additional key at a shallow level", () => {
    const object1 = { a: 1, b: 2, c: 3 };
    const object2 = { a: 1, b: 2 };
    expect(object1).toBeDeeplyUnequal(object2);
  });
  it("should pass where the second object has an additional key at a shallow level", () => {
    const object1 = { a: 1, b: 2 };
    const object2 = { a: 1, b: 2, c: 3 };
    expect(object1).toBeDeeplyUnequal(object2);
  });
  it("should fail when one object has an additional key, and shares a reference to a value", () => {
    const innerArray: any[] = [];
    const object1 = { a: 1, b: innerArray };
    const object2 = { a: 1, b: innerArray, c: 3 };
    expect(object1).not.toBeDeeplyUnequal(object2);
  });
  it("should pass when two nested objects are deeply unequal", () => {
    const object1 = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const object2 = {
      a: 1,
      b: {
        c: 2,
      },
    };
    expect(object1).toBeDeeplyUnequal(object2);
  });
  it("should fail when two nested objects are not deeply unequal", () => {
    const innerObject = {};
    const object1 = {
      a: 1,
      b: {
        c: innerObject,
      },
    };
    const object2 = {
      a: 1,
      b: {
        c: innerObject,
      },
    };
    expect(object1).not.toBeDeeplyUnequal(object2);
  });
  it("it should pass, given an object and an array", () => {
    const arr: any[] = [];
    const obj = {};
    expect(obj).toBeDeeplyUnequal(arr);
  });
  it("should pass, given null and an object", () => {
    const obj = {};
    expect(null).toBeDeeplyUnequal(obj);
  });
  it("should pass, given undefined and an object", () => {
    const obj = {};
    expect(undefined).toBeDeeplyUnequal(obj);
  });
  it("should fail, given two arrays that are the same", () => {
    const firstArray: any[] = [];
    const secondArray = firstArray;
    expect(firstArray).not.toBeDeeplyUnequal(secondArray);
  });
  it("should pass given two arrays that are different", () => {
    const firstArray: any[] = [];
    const secondArray: any[] = [];
    expect(firstArray).toBeDeeplyUnequal(secondArray);
  });
  it("should pass when arrays are unequal at a shallow level", () => {
    const firstArray = [1, 2];
    const secondArray = [1, 3];
    expect(firstArray).toBeDeeplyUnequal(secondArray);
  });
  it("should pass when the first array has an extra value, and arrays are unequal", () => {
    const firstArray = [1, 2, 3];
    const secondArray = [1, 2];
    expect(firstArray).toBeDeeplyUnequal(secondArray);
  });
  it("should pass when the second array has an extra value, and arrays are unequal", () => {
    const firstArray = [1, 2];
    const secondArray = [1, 2, 3];
    expect(firstArray).toBeDeeplyUnequal(secondArray);
  });
  it("should fail when arrays are equal at a shallow level", () => {
    const innerArray: any[] = [];
    const firstArray = [innerArray];
    const secondArray = [innerArray];
    expect(firstArray).not.toBeDeeplyUnequal(secondArray);
  });
  it("should pass when arrays are unequal at a nested level", () => {
    const array1 = [[1]];
    const array2 = [[1]];
    expect(array1).toBeDeeplyUnequal(array2);
  });
  it("should fail when arrays are not unequal at a nested level", () => {
    const innerArray: any = [];
    const array1 = [[innerArray]];
    const array2 = [[innerArray]];
    expect(array1).not.toBeDeeplyUnequal(array2);
  });
});
