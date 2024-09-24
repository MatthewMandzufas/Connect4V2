import parseAsciiTable from "./parse-ascii-table";

describe("parse-ascii-table", () => {
  describe("given a table with no rows or columns", () => {
    it("returns an empty grid", () => {
      const asciiTable = "";
      expect(parseAsciiTable(asciiTable)).toEqual([]);
    });
  });
  describe("given a table with 1 row and 1 column", () => {
    describe("with an empty cell", () => {
      it("returns a 1x1 grid", () => {
        const asciiTable = `
|--|
|  |
|--|`;

        expect(parseAsciiTable(asciiTable)).toEqual([[undefined]]);
      });
    });
    describe("with a non-empty cell", () => {
      it("returns a 1x1 grid", () => {
        const asciiTable = `
|---|
| 1 |
|---|`;
        expect(parseAsciiTable(asciiTable)).toEqual([["1"]]);
      });
      describe("with trailing whitespace", () => {
        it("returns a 1x1 grid, trimming trailing whitespace", () => {
          const asciiTable = `
    |-----|
    | 1   |
    |-----|`;
          expect(parseAsciiTable(asciiTable)).toEqual([["1"]]);
        });
      });
      describe("with leading whitespace", () => {
        it("returns a 1x1 grid without trimming the leading whitespace", () => {
          const asciiTable = `
|----|
|  1 |
|----|`;
          expect(parseAsciiTable(asciiTable)).toEqual([[" 1"]]);
        });
      });
      describe("and a custom cell-resolver", () => {
        it("returns a 1x1 grid with a resolved value", () => {
          const customResolver = (value: string) => Number(value);
          const asciiTable = `
|---|
| 1 |
|---|`;
          expect(parseAsciiTable(asciiTable, customResolver)).toEqual([[1]]);
        });
      });
    });
  });
  describe("given an ascii table with 2 rows and 1 column", () => {
    describe("where cells have content of the same size", () => {
      it("returns a 2x1 grid", () => {
        const asciiTable = `
|---|
| 1 |
|---|
| 2 |
|---|`;
        expect(parseAsciiTable(asciiTable)).toEqual([["1"], ["2"]]);
      });
    });
    describe("where cells have content of a differing size", () => {
      it("returns a 2x1 grid", () => {
        const asciiTable = `
|----|
| 1  |
|----|
| 10 |
|----|`;
        expect(parseAsciiTable(asciiTable)).toEqual([["1"], ["10"]]);
      });
    });
  });
  describe("given an ascii table with 1 row and 2 columns", () => {
    it("returns a 1x2 asciiTable", () => {
      const asciiTable = `
|---|---|
| 1 | 2 |
|---|---|`;
      expect(parseAsciiTable(asciiTable)).toEqual([["1", "2"]]);
    });
    describe("where cells hold values of different lengths", () => {
      it("returns a 1x2 grid", () => {
        const asciiTable = `
|----|---|
| 12 | 1 |
|----|---|`;
        expect(parseAsciiTable(asciiTable)).toEqual([["12", "1"]]);
      });
    });
  });
  describe("given a 2x2 ascii table", () => {
    it("returns a 2x2 grid", () => {
      const asciiTable = `
|----|----|
|  1 |    |
|----|----|
| 12 | 10 |
|----|----|`;
      expect(parseAsciiTable(asciiTable)).toEqual([
        [" 1", undefined],
        ["12", "10"],
      ]);
    });
    describe("and a custom cell resolver", () => {
      it("returns a 2x2 grid with resolved values", () => {
        const customResolver = (value: string): number | undefined => {
          const parsedValue = Number.parseInt(value);
          return Number.isNaN(parsedValue) ? undefined : parsedValue;
        };
        const asciiTable = `
|----|----|
|  1 |    |
|----|----|
| 12 | 10 |
|----|----|`;
        expect(parseAsciiTable(asciiTable, customResolver)).toEqual([
          [1, undefined],
          [12, 10],
        ]);
      });
    });
  });
});
