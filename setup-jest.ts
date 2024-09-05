import { expect } from "@jest/globals";
import toBeUUID from "./src/to-Be-UUID";
import toBeDeeplyUnequal from "./src/util/to-be-deeply-unequal";

expect.extend({
  toBeUUID,
  toBeDeeplyUnequal,
});
