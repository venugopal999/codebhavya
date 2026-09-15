"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 10 — Sparse Matrices";

function program(options) {
  return makeAds({ topic, concepts: ["Sparse representation", "Triplet form"], difficulty: "Intermediate", space: "O(non-zero elements)", ...options });
}

module.exports = [
  program({
    slug: "ads-dense-matrix-to-triplet",
    title: "Convert a Dense Matrix to Triplet Form",
    source: cMain(`    int matrix[3][4] = {{0, 5, 0, 0}, {2, 0, 0, 7}, {0, 0, 3, 0}};
    for (int row = 0; row < 3; row++)
        for (int column = 0; column < 4; column++)
            if (matrix[row][column] != 0) printf("%d %d %d\\n", row, column, matrix[row][column]);
    return 0;`),
    sampleOutput: "0 1 5\n1 0 2\n1 3 7\n2 2 3",
    time: "O(rows * columns)",
    method: "Store only each non-zero value together with its row and column."
  }),
  program({
    slug: "ads-triplet-to-dense-matrix",
    title: "Reconstruct a Dense Matrix from Triplets",
    source: cMain(`    int triplets[][3] = {{0, 1, 5}, {1, 0, 2}, {1, 2, 7}};
    int matrix[2][3] = {{0}};
    for (int index = 0; index < 3; index++) matrix[triplets[index][0]][triplets[index][1]] = triplets[index][2];
    for (int row = 0; row < 2; row++)
        for (int column = 0; column < 3; column++) printf("%d%c", matrix[row][column], column == 2 ? '\\n' : ' ');
    return 0;`),
    sampleOutput: "0 5 0\n2 0 7",
    time: "O(rows * columns + non-zero)",
    method: "Initialize zeros and place every triplet value at its stored coordinates."
  }),
  program({
    slug: "ads-simple-transpose-triplet",
    title: "Transpose a Sparse Matrix by Column Scan",
    source: cMain(`    int triplets[][3] = {{0, 2, 4}, {1, 0, 5}, {2, 1, 6}};
    for (int column = 0; column < 3; column++)
        for (int index = 0; index < 3; index++)
            if (triplets[index][1] == column) printf("%d %d %d\\n", column, triplets[index][0], triplets[index][2]);
    return 0;`),
    sampleOutput: "0 1 5\n1 2 6\n2 0 4",
    time: "O(columns * non-zero)",
    method: "Visit source columns in order and exchange each matching row-column pair."
  }),
  program({
    slug: "ads-fast-transpose-triplet",
    title: "Fast-Transpose a Sparse Matrix",
    difficulty: "Advanced",
    source: cMain(`    int source[][3] = {{0, 2, 4}, {1, 0, 5}, {2, 1, 6}, {2, 2, 7}};
    int count[3] = {0}, position[3] = {0}, result[4][3];
    for (int index = 0; index < 4; index++) count[source[index][1]]++;
    for (int column = 1; column < 3; column++) position[column] = position[column - 1] + count[column - 1];
    for (int index = 0; index < 4; index++) {
        int slot = position[source[index][1]]++;
        result[slot][0] = source[index][1]; result[slot][1] = source[index][0]; result[slot][2] = source[index][2];
    }
    for (int index = 0; index < 4; index++) printf("%d %d %d\\n", result[index][0], result[index][1], result[index][2]);
    return 0;`),
    sampleOutput: "0 1 5\n1 2 6\n2 0 4\n2 2 7",
    time: "O(columns + non-zero)",
    method: "Count entries per destination row and use prefix positions to place each transposed triplet directly."
  }),
  program({
    slug: "ads-add-sparse-triplet-matrices",
    title: "Add Two Sparse Matrices in Triplet Form",
    source: cMain(`    int first[][3] = {{0, 0, 2}, {1, 2, 4}, {2, 1, 5}};
    int second[][3] = {{0, 0, 3}, {1, 1, 7}, {2, 1, -5}};
    int i = 0, j = 0;
    while (i < 3 || j < 3) {
        if (j == 3 || (i < 3 && (first[i][0] < second[j][0] || (first[i][0] == second[j][0] && first[i][1] < second[j][1])))) {
            printf("%d %d %d\\n", first[i][0], first[i][1], first[i][2]); i++;
        } else if (i == 3 || second[j][0] < first[i][0] || (second[j][0] == first[i][0] && second[j][1] < first[i][1])) {
            printf("%d %d %d\\n", second[j][0], second[j][1], second[j][2]); j++;
        } else {
            int sum = first[i][2] + second[j][2]; if (sum != 0) printf("%d %d %d\\n", first[i][0], first[i][1], sum); i++; j++;
        }
    }
    return 0;`),
    sampleOutput: "0 0 5\n1 1 7\n1 2 4",
    time: "O(nz1 + nz2)",
    method: "Merge coordinate-sorted triplet lists and combine values at identical positions."
  }),
  program({
    slug: "ads-multiply-sparse-matrices",
    title: "Multiply Two Sparse Matrices",
    difficulty: "Advanced",
    source: cMain(`    int first[2][3] = {{1, 0, 2}, {0, 3, 0}};
    int second[3][2] = {{0, 4}, {5, 0}, {0, 6}};
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 2; column++) {
            int sum = 0;
            for (int index = 0; index < 3; index++) if (first[row][index] && second[index][column]) sum += first[row][index] * second[index][column];
            printf("%d%c", sum, column == 1 ? '\\n' : ' ');
        }
    }
    return 0;`),
    sampleOutput: "0 16\n15 0",
    time: "O(rows * columns * shared)",
    method: "Skip zero products while accumulating compatible row-column pairs."
  }),
  program({
    slug: "ads-build-csr-sparse-matrix",
    title: "Build Compressed Sparse Row Storage",
    difficulty: "Advanced",
    source: cMain(`    int matrix[3][4] = {{0, 5, 0, 0}, {2, 0, 0, 7}, {0, 0, 3, 0}};
    int values[12], columns[12], row_start[4], count = 0;
    for (int row = 0; row < 3; row++) {
        row_start[row] = count;
        for (int column = 0; column < 4; column++) if (matrix[row][column]) { values[count] = matrix[row][column]; columns[count++] = column; }
    }
    row_start[3] = count;
    printf("Values:"); for (int i = 0; i < count; i++) printf(" %d", values[i]);
    printf("\\nColumns:"); for (int i = 0; i < count; i++) printf(" %d", columns[i]);
    printf("\\nRowStart:"); for (int i = 0; i < 4; i++) printf(" %d", row_start[i]);
    putchar('\\n'); return 0;`),
    sampleOutput: "Values: 5 2 7 3\nColumns: 1 0 3 2\nRowStart: 0 1 3 4",
    time: "O(rows * columns)",
    method: "Store non-zero values and columns contiguously while recording each row's start offset."
  }),
  program({
    slug: "ads-sparse-matrix-row-sums",
    title: "Calculate Row Sums from Sparse Triplets",
    source: cMain(`    int triplets[][3] = {{0, 1, 5}, {1, 0, 2}, {1, 3, 7}, {2, 2, 3}};
    int sums[3] = {0};
    for (int index = 0; index < 4; index++) sums[triplets[index][0]] += triplets[index][2];
    printf("%d %d %d\\n", sums[0], sums[1], sums[2]);
    return 0;`),
    sampleOutput: "5 9 3",
    time: "O(non-zero)",
    method: "Accumulate each stored value into the total for its triplet row."
  })
];
