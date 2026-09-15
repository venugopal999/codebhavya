"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Pattern Programs";

function pattern(options) {
  return makeProgram({
    difficulty: "Intermediate",
    topic,
    concepts: ["Nested loops", "Rows and columns", "Pattern"],
    time: "O(n²)",
    ...options
  });
}

module.exports = [
  pattern({
    slug: "solid-square-star-pattern",
    title: "Print a Solid Square Star Pattern",
    source: cMain(`    int size;

    printf("Enter size: ");
    scanf("%d", &size);
    for (int row = 1; row <= size; row++) {
        for (int column = 1; column <= size; column++) printf("* ");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "* * * *\n* * * *\n* * * *\n* * * *",
    method: "Use one loop for rows and another to print the same number of stars in every row."
  }),
  pattern({
    slug: "right-triangle-star-pattern",
    title: "Print a Right-Triangle Star Pattern",
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int column = 1; column <= row; column++) printf("* ");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "*\n* *\n* * *\n* * * *",
    method: "Print exactly row-number stars on each successive line."
  }),
  pattern({
    slug: "inverted-right-triangle-star-pattern",
    title: "Print an Inverted Right-Triangle Pattern",
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = rows; row >= 1; row--) {
        for (int column = 1; column <= row; column++) printf("* ");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "* * * *\n* * *\n* *\n*",
    method: "Start with N stars and decrease the inner-loop limit after every row."
  }),
  pattern({
    slug: "centered-pyramid-star-pattern",
    title: "Print a Centred Pyramid Star Pattern",
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int space = 1; space <= rows - row; space++) printf("  ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("* ");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "      *\n    * * *\n  * * * * *\n* * * * * * *",
    method: "Decrease leading spaces while increasing the odd number of stars in each row."
  }),
  pattern({
    slug: "inverted-pyramid-star-pattern",
    title: "Print an Inverted Pyramid Star Pattern",
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = rows; row >= 1; row--) {
        for (int space = 0; space < rows - row; space++) printf("  ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("* ");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "* * * * * * *\n  * * * * *\n    * * *\n      *",
    method: "Increase indentation and reduce the odd star count from 2N−1 down to one."
  }),
  pattern({
    slug: "diamond-star-pattern",
    title: "Print a Diamond Star Pattern",
    source: cMain(`    int rows;

    printf("Enter half-height: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int space = row; space < rows; space++) printf(" ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("*");
        printf("\\n");
    }
    for (int row = rows - 1; row >= 1; row--) {
        for (int space = rows; space > row; space--) printf(" ");
        for (int star = 1; star <= 2 * row - 1; star++) printf("*");
        printf("\\n");
    }
    return 0;`),
    sampleInput: "3",
    sampleOutput: "  *\n ***\n*****\n ***\n  *",
    method: "Combine an increasing centred pyramid with a decreasing one."
  }),
  pattern({
    slug: "floyds-triangle",
    title: "Print Floyd's Triangle",
    concepts: ["Nested loops", "Running number", "Number pattern"],
    source: cMain(`    int rows, value = 1;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int column = 1; column <= row; column++) printf("%d ", value++);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "1\n2 3\n4 5 6\n7 8 9 10",
    method: "Maintain one running number while each row prints one more value than the previous row."
  }),
  pattern({
    slug: "pascals-triangle",
    title: "Print Pascal's Triangle",
    difficulty: "Advanced",
    concepts: ["Binomial coefficients", "Nested loops", "Recurrence"],
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 0; row < rows; row++) {
        unsigned long long value = 1;
        for (int space = 0; space < rows - row - 1; space++) printf(" ");
        for (int column = 0; column <= row; column++) {
            printf("%llu ", value);
            value = value * (unsigned long long) (row - column) / (unsigned long long) (column + 1);
        }
        printf("\\n");
    }
    return 0;`),
    sampleInput: "5",
    sampleOutput: "    1\n   1 1\n  1 2 1\n 1 3 3 1\n1 4 6 4 1",
    method: "Generate every binomial coefficient from the previous coefficient in the same row."
  }),
  pattern({
    slug: "increasing-number-triangle",
    title: "Print an Increasing Number Triangle",
    concepts: ["Nested loops", "Column value", "Number pattern"],
    source: cMain(`    int rows;

    printf("Enter number of rows: ");
    scanf("%d", &rows);
    for (int row = 1; row <= rows; row++) {
        for (int value = 1; value <= row; value++) printf("%d ", value);
        printf("\\n");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "1\n1 2\n1 2 3\n1 2 3 4",
    method: "Print column numbers from one through the current row number."
  }),
  pattern({
    slug: "hollow-square-star-pattern",
    title: "Print a Hollow Square Star Pattern",
    source: cMain(`    int size;

    printf("Enter size: ");
    scanf("%d", &size);
    for (int row = 1; row <= size; row++) {
        for (int column = 1; column <= size; column++) {
            if (row == 1 || row == size || column == 1 || column == size)
                printf("* ");
            else
                printf("  ");
        }
        printf("\\n");
    }
    return 0;`),
    sampleInput: "5",
    sampleOutput: "* * * * *\n*       *\n*       *\n*       *\n* * * * *",
    method: "Print stars only on the first row, last row, first column and last column."
  })
];
