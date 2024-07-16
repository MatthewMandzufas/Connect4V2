import { expect } from "@jest/globals";
import toBeUUID from "./src/to-Be-UUID";

expect.extend({
  toBeUUID,
});
