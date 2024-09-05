function defaultResolver(value: string): string | undefined {
  return value.length === 0 ? undefined : value;
}

function parseAsciiTable<T>(
  asciiTable: string,
  customResolver: (value: string) => T = defaultResolver as (value: string) => T
): Array<Array<T>> {
  if (asciiTable.length === 0) {
    return [];
  }

  const asciiTableRows = asciiTable.split("\n").slice(1);
  const gridFormat = asciiTableRows.reduce(
    (
      grid: Array<Array<T>>,
      currentRow: string,
      currentIndex: number
    ): Array<Array<T>> => {
      if (currentIndex % 2 === 0) {
        return grid;
      }

      const rowCells = currentRow.split("|");
      const rowCellsWithoutStartAndEnd = rowCells.slice(1, rowCells.length - 1);
      const gridRow = rowCellsWithoutStartAndEnd.reduce(
        (row: Array<T>, currentCell: string): Array<T> => {
          const trimmedVariable = currentCell.slice(1).trimEnd();
          row.push(customResolver(trimmedVariable));
          return row;
        },
        []
      );
      grid.push(gridRow);

      return grid;
    },
    []
  );

  return gridFormat;
}

export default parseAsciiTable;
