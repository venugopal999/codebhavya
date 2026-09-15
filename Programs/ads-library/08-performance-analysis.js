"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 8 — Performance Analysis";

function program(options) {
  return makeAds({ topic, concepts: ["Operation counting", "Asymptotic analysis"], ...options });
}

module.exports = [
  program({
    slug: "ads-count-linear-loop-operations",
    title: "Count Operations in a Linear Loop",
    difficulty: "Beginner",
    source: cMain(`    int operations = 0;
    for (int index = 0; index < 10; index++) operations++;
    printf("Operations = %d\\n", operations);
    return 0;`),
    sampleOutput: "Operations = 10",
    time: "O(n)",
    method: "Increment a counter once per iteration to connect loop length with linear growth."
  }),
  program({
    slug: "ads-count-quadratic-loop-operations",
    title: "Count Operations in Nested Loops",
    difficulty: "Beginner",
    source: cMain(`    int operations = 0;
    for (int row = 0; row < 5; row++)
        for (int column = 0; column < 5; column++) operations++;
    printf("Operations = %d\\n", operations);
    return 0;`),
    sampleOutput: "Operations = 25",
    time: "O(n^2)",
    method: "Count every inner-loop visit to demonstrate quadratic growth."
  }),
  program({
    slug: "ads-count-logarithmic-halving-operations",
    title: "Count Logarithmic Halving Steps",
    source: cMain(`    int value = 64, operations = 0;
    while (value > 1) { value /= 2; operations++; }
    printf("Operations = %d\\n", operations);
    return 0;`),
    sampleOutput: "Operations = 6",
    time: "O(log n)",
    method: "Repeatedly halve the input and count how many reductions reach one."
  }),
  program({
    slug: "ads-binary-search-comparison-counter",
    title: "Measure Binary Search Comparisons",
    difficulty: "Intermediate",
    source: cMain(`    int values[31], target = 31, low = 0, high = 30, comparisons = 0;
    for (int index = 0; index < 31; index++) values[index] = index + 1;
    while (low <= high) {
        int middle = low + (high - low) / 2;
        comparisons++;
        if (values[middle] == target) break;
        if (values[middle] < target) low = middle + 1; else high = middle - 1;
    }
    printf("Comparisons = %d\\n", comparisons);
    return 0;`),
    sampleOutput: "Comparisons = 5",
    time: "O(log n)",
    method: "Count comparisons while binary search repeatedly discards half of the range."
  }),
  program({
    slug: "ads-recursive-fibonacci-call-counter",
    title: "Measure Recursive Fibonacci Calls",
    difficulty: "Intermediate",
    source: cMain(`    int calls = 0;
    int value = fibonacci(5, &calls);
    printf("Fibonacci = %d Calls = %d\\n", value, calls);
    return 0;`, ["stdio.h"], `int fibonacci(int number, int *calls)
{
    (*calls)++;
    if (number < 2) return number;
    return fibonacci(number - 1, calls) + fibonacci(number - 2, calls);
}`),
    sampleOutput: "Fibonacci = 5 Calls = 15",
    time: "O(2^n)",
    space: "O(n)",
    method: "Count every recursive activation to expose the repeated work in naive Fibonacci."
  }),
  program({
    slug: "ads-compare-growth-rates-table",
    title: "Compare Common Growth Rates",
    source: cMain(`    int n = 8, logarithm = 0;
    for (int value = n; value > 1; value /= 2) logarithm++;
    printf("Linear = %d Quadratic = %d Log2 = %d\\n", n, n * n, logarithm);
    return 0;`),
    sampleOutput: "Linear = 8 Quadratic = 64 Log2 = 3",
    time: "O(log n)",
    method: "Calculate representative operation counts for linear, quadratic and logarithmic algorithms."
  }),
  program({
    slug: "ads-dynamic-array-amortized-cost",
    title: "Simulate Dynamic Array Amortized Cost",
    difficulty: "Advanced",
    source: cMain(`    int capacity = 1, size = 0, copies = 0;
    for (int value = 0; value < 16; value++) {
        if (size == capacity) { copies += size; capacity *= 2; }
        size++;
    }
    printf("Writes = %d Copies = %d Total = %d\\n", size, copies, size + copies);
    return 0;`),
    sampleOutput: "Writes = 16 Copies = 15 Total = 31",
    time: "Amortized O(1) insertion",
    method: "Double capacity when full and count both ordinary writes and resize copies."
  }),
  program({
    slug: "ads-count-n-log-n-loop-operations",
    title: "Count N Log N Loop Operations",
    difficulty: "Intermediate",
    source: cMain(`    int operations = 0;
    for (int scale = 1; scale < 8; scale *= 2)
        for (int index = 0; index < 8; index++) operations++;
    printf("Operations = %d\\n", operations);
    return 0;`),
    sampleOutput: "Operations = 24",
    time: "O(n log n)",
    method: "Combine a logarithmic outer loop with a linear inner loop."
  })
];
