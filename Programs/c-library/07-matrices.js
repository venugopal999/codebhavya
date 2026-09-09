"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Matrices";

function matrixProgram(options) {
  return makeProgram({
    topic,
    difficulty: "Intermediate",
    concepts: ["2D arrays", "Nested loops", "Matrices"],
    time: "O(rows × columns)",
    space: "O(rows × columns)",
    ...options
  });
}

module.exports = [
  matrixProgram({
    slug: "matrix-addition",
    title: "Add Two Matrices",
    source: cMain(`    int rows, columns, first[10][10], second[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &first[row][column]);
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &second[row][column]);
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) printf("%d ", first[row][column] + second[row][column]);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "2 2\n1 2\n3 4\n5 6\n7 8",
    sampleOutput: "6 8\n10 12",
    method: "Add elements at identical row and column positions."
  }),
  matrixProgram({
    slug: "matrix-subtraction",
    title: "Subtract Two Matrices",
    source: cMain(`    int rows, columns, first[10][10], second[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &first[row][column]);
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &second[row][column]);
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) printf("%d ", first[row][column] - second[row][column]);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "2 2\n9 8\n7 6\n1 2\n3 4",
    sampleOutput: "8 6\n4 2",
    method: "Subtract the second element from the first at every matching position."
  }),
  matrixProgram({
    slug: "matrix-multiplication",
    title: "Multiply Two Matrices",
    difficulty: "Advanced",
    concepts: ["2D arrays", "Matrix multiplication", "Triple loop"],
    time: "O(r₁ × c₁ × c₂)",
    source: cMain(`    int firstRows, firstColumns, secondRows, secondColumns;
    int first[10][10], second[10][10], product[10][10] = {0};

    scanf("%d %d", &firstRows, &firstColumns);
    scanf("%d %d", &secondRows, &secondColumns);
    if (firstRows < 1 || firstRows > 10 || firstColumns < 1 || firstColumns > 10 ||
        secondRows < 1 || secondRows > 10 || secondColumns < 1 || secondColumns > 10 ||
        firstColumns != secondRows) {
        printf("Matrices cannot be multiplied.\\n");
        return 0;
    }
    for (int row = 0; row < firstRows; row++)
        for (int column = 0; column < firstColumns; column++) scanf("%d", &first[row][column]);
    for (int row = 0; row < secondRows; row++)
        for (int column = 0; column < secondColumns; column++) scanf("%d", &second[row][column]);
    for (int row = 0; row < firstRows; row++)
        for (int column = 0; column < secondColumns; column++)
            for (int index = 0; index < firstColumns; index++)
                product[row][column] += first[row][index] * second[index][column];
    for (int row = 0; row < firstRows; row++) {
        for (int column = 0; column < secondColumns; column++) printf("%d ", product[row][column]);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "2 3\n3 2\n1 2 3\n4 5 6\n7 8\n9 10\n11 12",
    sampleOutput: "58 64\n139 154",
    method: "For each result cell, calculate the dot product of one row and one column."
  }),
  matrixProgram({
    slug: "matrix-transpose",
    title: "Find the Transpose of a Matrix",
    concepts: ["2D arrays", "Transpose", "Index swap"],
    source: cMain(`    int rows, columns, matrix[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &matrix[row][column]);
    for (int column = 0; column < columns; column++) {
        for (int row = 0; row < rows; row++) printf("%d ", matrix[row][column]);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "2 3\n1 2 3\n4 5 6",
    sampleOutput: "1 4\n2 5\n3 6",
    method: "Print columns as rows by exchanging the row and column access order."
  }),
  matrixProgram({
    slug: "sum-matrix-elements",
    title: "Find the Sum of All Matrix Elements",
    source: cMain(`    int rows, columns, matrix[10][10];
    long long sum = 0;

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            sum += matrix[row][column];
        }
    printf("Sum = %lld\\n", sum);
    return 0;`),
    sampleInput: "2 3\n1 2 3\n4 5 6",
    sampleOutput: "Sum = 21",
    method: "Accumulate each element while reading the matrix."
  }),
  matrixProgram({
    slug: "matrix-row-column-sums",
    title: "Calculate Every Matrix Row and Column Sum",
    source: cMain(`    int rows, columns, matrix[10][10];

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < rows; row++) {
        int sum = 0;
        for (int column = 0; column < columns; column++) sum += matrix[row][column];
        printf("Row %d sum = %d\\n", row + 1, sum);
    }
    for (int column = 0; column < columns; column++) {
        int sum = 0;
        for (int row = 0; row < rows; row++) sum += matrix[row][column];
        printf("Column %d sum = %d\\n", column + 1, sum);
    }
    return 0;`),
    sampleInput: "2 3\n1 2 3\n4 5 6",
    sampleOutput: "Row 1 sum = 6\nRow 2 sum = 15\nColumn 1 sum = 5\nColumn 2 sum = 7\nColumn 3 sum = 9",
    method: "Traverse by rows for row sums and by columns for column sums."
  }),
  matrixProgram({
    slug: "matrix-diagonal-sums",
    title: "Find Primary and Secondary Diagonal Sums",
    concepts: ["Square matrix", "Diagonals", "Index relationship"],
    time: "O(n)",
    source: cMain(`    int size, matrix[10][10], primary = 0, secondary = 0;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int index = 0; index < size; index++) {
        primary += matrix[index][index];
        secondary += matrix[index][size - index - 1];
    }
    printf("Primary diagonal sum = %d\\nSecondary diagonal sum = %d\\n", primary, secondary);
    return 0;`),
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: "Primary diagonal sum = 15\nSecondary diagonal sum = 15",
    method: "Use indices (i,i) for the primary diagonal and (i,n−i−1) for the secondary diagonal."
  }),
  matrixProgram({
    slug: "upper-triangular-matrix",
    title: "Display the Upper-Triangular Matrix",
    concepts: ["Square matrix", "Upper triangle", "Index comparison"],
    source: cMain(`    int size, matrix[10][10];

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size; row++) {
        for (int column = 0; column < size; column++)
            printf("%d ", column >= row ? matrix[row][column] : 0);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: "1 2 3\n0 5 6\n0 0 9",
    method: "Keep elements whose column index is at least their row index and replace lower elements with zero."
  }),
  matrixProgram({
    slug: "lower-triangular-matrix",
    title: "Display the Lower-Triangular Matrix",
    concepts: ["Square matrix", "Lower triangle", "Index comparison"],
    source: cMain(`    int size, matrix[10][10];

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size; row++) {
        for (int column = 0; column < size; column++)
            printf("%d ", column <= row ? matrix[row][column] : 0);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: "1 0 0\n4 5 0\n7 8 9",
    method: "Keep elements whose column index does not exceed their row index."
  }),
  matrixProgram({
    slug: "symmetric-matrix-check",
    title: "Check Whether a Matrix Is Symmetric",
    concepts: ["Square matrix", "Symmetry", "Transpose relationship"],
    source: cMain(`    int size, matrix[10][10], symmetric = 1;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size && symmetric; row++)
        for (int column = row + 1; column < size; column++)
            if (matrix[row][column] != matrix[column][row]) { symmetric = 0; break; }
    printf(symmetric ? "Symmetric matrix\\n" : "Not a symmetric matrix\\n");
    return 0;`),
    sampleInput: "3\n1 2 3\n2 5 6\n3 6 9",
    sampleOutput: "Symmetric matrix",
    method: "Compare every element above the main diagonal with its reflected element below it."
  }),
  matrixProgram({
    slug: "identity-matrix-check",
    title: "Check Whether a Matrix Is an Identity Matrix",
    concepts: ["Square matrix", "Identity matrix", "Condition"],
    source: cMain(`    int size, matrix[10][10], identity = 1;

    scanf("%d", &size);
    if (size < 1 || size > 10) return 1;
    for (int row = 0; row < size; row++)
        for (int column = 0; column < size; column++) scanf("%d", &matrix[row][column]);
    for (int row = 0; row < size && identity; row++) {
        for (int column = 0; column < size; column++) {
            int expected = row == column ? 1 : 0;
            if (matrix[row][column] != expected) { identity = 0; break; }
        }
    }
    printf(identity ? "Identity matrix\\n" : "Not an identity matrix\\n");
    return 0;`),
    sampleInput: "3\n1 0 0\n0 1 0\n0 0 1",
    sampleOutput: "Identity matrix",
    method: "Require ones on the main diagonal and zeros in every other position."
  }),
  matrixProgram({
    slug: "sparse-matrix-check",
    title: "Check Whether a Matrix Is Sparse",
    concepts: ["2D arrays", "Zero count", "Sparse matrix"],
    source: cMain(`    int rows, columns, matrix[10][10], zeroCount = 0;

    scanf("%d %d", &rows, &columns);
    if (rows < 1 || rows > 10 || columns < 1 || columns > 10) return 1;
    for (int row = 0; row < rows; row++)
        for (int column = 0; column < columns; column++) {
            scanf("%d", &matrix[row][column]);
            if (matrix[row][column] == 0) zeroCount++;
        }
    printf(zeroCount > rows * columns / 2 ? "Sparse matrix\\n" : "Not a sparse matrix\\n");
    return 0;`),
    sampleInput: "3 3\n1 0 0\n0 0 2\n0 0 0",
    sampleOutput: "Sparse matrix",
    method: "Count zeros and classify the matrix as sparse when more than half of its entries are zero."
  })
];
