/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import deepClone from "@/connect-4-domain/deep-clone";

describe("deepClone", () => {
  it("should return a primitive value as is ", () => {
    expect(deepClone(2)).toBe(2);
  });
  it("should return a deep copy of an array", () => {
    const originalArray: [{ a: number }, number, number[]] = [
      { a: 1 },
      2,
      [3, 4],
    ];
    const clonedArray = deepClone(originalArray);
    expect(clonedArray).not.toBe(originalArray);
    expect(clonedArray[0]).not.toBe(originalArray[0]);
    expect(clonedArray[0].a).toStrictEqual(originalArray[0].a);
    expect(Object.keys(clonedArray[0]).length).toEqual(1);
    expect(Object.hasOwn(clonedArray[0], "a")).toBeTruthy;
    expect(clonedArray[1]).toStrictEqual(originalArray[1]);
    expect(clonedArray[1]).toBe(originalArray[1]);
    expect(clonedArray[2]).not.toBe(originalArray[2]);
    expect(clonedArray[2][0]).toBe(originalArray[2][0]);
    expect(clonedArray[2][1]).toBe(originalArray[2][1]);
  });
  it("should return a deep copy of an object", () => {
    const originalObject: {
      a: number;
      b: { c: string; d: number };
      e: number[];
    } = { a: 42, b: { c: "hi", d: 9 }, e: [3, 4] };
    const clonedObject = deepClone(originalObject);
    expect(clonedObject).not.toBe(originalObject);
    expect(clonedObject.a).toStrictEqual(originalObject.a);
    expect(clonedObject.b).not.toBe(originalObject.b);
    expect(clonedObject.b.c).toStrictEqual(originalObject.b.c);
    expect(clonedObject.b.d).toStrictEqual(originalObject.b.d);
    expect(clonedObject.e).not.toBe(originalObject.e);
    expect(clonedObject.e[0]).toStrictEqual(originalObject.e[0]);
    expect(clonedObject.e[1]).toStrictEqual(originalObject.e[1]);
  });
  it("should return functions by reference", () => {
    const originalFunction = (x: any) => 2 * x;
    const clonedFunction = deepClone(originalFunction);
    expect(originalFunction(3)).toStrictEqual(clonedFunction(3));
    expect(originalFunction).toBe(clonedFunction);
  });
  it("should return the original symbol", () => {
    const originalSymbol = Symbol("1");
    const clonedSymbol = deepClone(originalSymbol);
    expect(originalSymbol).toBe(clonedSymbol);
  });
  it("should deeply clone objects with circular references", () => {
    const originalObject: { a: number; b?: object } = { a: 1 };
    originalObject.b = originalObject;
    const clonedObject = deepClone(originalObject);
    expect(clonedObject).not.toBe(originalObject);
    expect(clonedObject.b).toBe(clonedObject);
  });
  it("should properly deeply clone objects that use symbols as keys", () => {
    const symB: unique symbol = Symbol("b");
    const symD: unique symbol = Symbol("d");
    const originalObject: { a: number; [symB]: { c: number; [symD]: number } } =
      { a: 1, [symB]: { c: 2, [symD]: 4 } };
    const clonedObject = deepClone(originalObject);
    expect(clonedObject[symB]).not.toBe(originalObject[symB]);
    expect(clonedObject[symB].c).toStrictEqual(originalObject[symB].c);
    expect(clonedObject[symB][symD]).toStrictEqual(originalObject[symB][symD]);
  });
  it('should return "null" as is', () => {
    const original = null;
    const cloned = deepClone(original);
    expect(cloned).toBe(original);
  });
  it('should return "undefined" as is', () => {
    const original = undefined;
    const cloned = deepClone(original);
    expect(cloned).toBe(original);
  });
});
