/* eslint-disable @typescript-eslint/no-explicit-any */

function deepClone<T>(
  value: T,
  visited: WeakMap<any, any> = new WeakMap<any, any>()
): T {
  if (!(value instanceof Object) || typeof value === "function") {
    return value;
  } else if (visited.has(value)) {
    return visited.get(value);
  }

  const result: T = Array.isArray(value) ? ([] as T) : ({} as T);

  visited.set(value, result);

  const stringAndSymbolKeys = [
    ...Object.keys(value),
    ...Object.getOwnPropertySymbols(value),
  ];

  for (const key of stringAndSymbolKeys) {
    const nestedValue = (value as any)[key];
    const clonedValue = deepClone<typeof nestedValue>(nestedValue, visited);
    (result as any)[key] = clonedValue;
  }

  return result;
}

export default deepClone;
