function defaultResolver<T>(value: T): string {
  return value === undefined || value === null ? "" : `${value}`;
}

function createBorder(cellWidthPerColumn: Array<number>): string {
  const borderChar = "-";

  return cellWidthPerColumn.reduce((borderString, width) => {
    return borderString.concat(borderChar.repeat(width + 2), "|");
  }, "|");
}

function getLargestCellWidthPerColumn(
  grid: Array<Array<string>>
): Array<number> {
  return grid.reduce((maxColumnWidths, currentRow) => {
    return currentRow.reduce((maxColumnWidths, cell, columnIndex) => {
      if (cell.length > maxColumnWidths[columnIndex]) {
        maxColumnWidths[columnIndex] = cell.length;
      }
      return maxColumnWidths;
    }, maxColumnWidths);
  }, Array(grid[0].length).fill(0));
}

function resolveGridCells<T>(
  grid: Array<Array<T>>,
  customResolver: (value: T) => string = defaultResolver
): Array<Array<string>> {
  return grid.map((row) => row.map((cell) => customResolver(cell)));
}

function toAsciiTable<T>(
  grid: Array<Array<T>>,
  customerResolver: (value: T) => string = defaultResolver
): string {
  if (grid.length === 0) {
    return "";
  }

  const resolvedGrid = resolveGridCells(grid, customerResolver);
  const largestCellWidthForEachColumn =
    getLargestCellWidthPerColumn(resolvedGrid);
  const table = resolvedGrid.reduce((tableRows, currentRow) => {
    tableRows.push(
      currentRow.reduce((tableRow: string, currentElement, currentRowIndex) => {
        return tableRow.concat(
          ` ${currentElement.padEnd(
            largestCellWidthForEachColumn[currentRowIndex],
            " "
          )} |`
        );
      }, "|")
    );
    return tableRows;
  }, [] as Array<string>);

  const border = createBorder(largestCellWidthForEachColumn);
  return table.reduce((stringRepresentation, currentRow) => {
    const line = ["", currentRow, border].join("\n");
    return stringRepresentation.concat(line);
  }, `\n${border}`);
}

export default toAsciiTable;
