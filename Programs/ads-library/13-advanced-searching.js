"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 13 — Advanced Searching";

function program(options) {
  return makeAds({ topic, concepts: ["Binary search", "Search boundaries"], difficulty: "Intermediate", space: "O(1)", ...options });
}

module.exports = [
  program({
    slug: "ads-lower-bound-search",
    title: "Find the First Value Not Less Than a Target",
    source: cMain(`    int values[] = {1, 2, 2, 2, 4, 7}, target = 2, low = 0, high = 6;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] < target) low = middle + 1; else high = middle; }
    printf("Lower bound index = %d\\n", low); return 0;`),
    sampleOutput: "Lower bound index = 1",
    time: "O(log n)",
    method: "Keep the first position whose value can be at least the target."
  }),
  program({
    slug: "ads-upper-bound-search",
    title: "Find the First Value Greater Than a Target",
    source: cMain(`    int values[] = {1, 2, 2, 2, 4, 7}, target = 2, low = 0, high = 6;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] <= target) low = middle + 1; else high = middle; }
    printf("Upper bound index = %d\\n", low); return 0;`),
    sampleOutput: "Upper bound index = 4",
    time: "O(log n)",
    method: "Move past every value equal to the target and preserve the first strictly greater position."
  }),
  program({
    slug: "ads-first-last-occurrence-binary-search",
    title: "Find First and Last Occurrences",
    source: cMain(`    int values[] = {1, 2, 2, 2, 4, 7}, target = 2;
    int first = boundary(values, 6, target, 1), last = boundary(values, 6, target, 0);
    printf("First = %d Last = %d\\n", first, last); return 0;`, ["stdio.h"], `int boundary(const int values[], int count, int target, int first)
{
    int low = 0, high = count - 1, answer = -1;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] == target) { answer = middle; if (first) high = middle - 1; else low = middle + 1; } else if (values[middle] < target) low = middle + 1; else high = middle - 1; }
    return answer;
}`),
    sampleOutput: "First = 1 Last = 3",
    time: "O(log n)",
    method: "Run two biased binary searches, continuing left after a match for first and right for last."
  }),
  program({
    slug: "ads-search-rotated-sorted-array",
    title: "Search a Rotated Sorted Array",
    source: cMain(`    int values[] = {4, 5, 6, 7, 0, 1, 2}, target = 0, low = 0, high = 6;
    while (low <= high) {
        int middle = low + (high - low) / 2;
        if (values[middle] == target) { printf("Index = %d\\n", middle); break; }
        if (values[low] <= values[middle]) { if (values[low] <= target && target < values[middle]) high = middle - 1; else low = middle + 1; }
        else { if (values[middle] < target && target <= values[high]) low = middle + 1; else high = middle - 1; }
    }
    return 0;`),
    sampleOutput: "Index = 4",
    time: "O(log n)",
    method: "Identify the sorted half at every step and retain only the half that can contain the target."
  }),
  program({
    slug: "ads-find-peak-element",
    title: "Find a Peak Element by Binary Search",
    source: cMain(`    int values[] = {1, 3, 20, 4, 1, 0}, low = 0, high = 5;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] < values[middle + 1]) low = middle + 1; else high = middle; }
    printf("Peak = %d at index %d\\n", values[low], low); return 0;`),
    sampleOutput: "Peak = 20 at index 2",
    time: "O(log n)",
    method: "Follow an ascending slope because at least one peak exists in that direction."
  }),
  program({
    slug: "ads-exponential-search",
    title: "Search an Unbounded-Style Array Exponentially",
    source: cMain(`    int values[] = {2, 3, 4, 10, 40, 55, 70, 90}, target = 55, bound = 1;
    while (bound < 8 && values[bound] < target) bound *= 2;
    int low = bound / 2, high = bound < 7 ? bound : 7;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] == target) { printf("Index = %d\\n", middle); break; } if (values[middle] < target) low = middle + 1; else high = middle - 1; }
    return 0;`),
    sampleOutput: "Index = 5",
    time: "O(log position)",
    method: "Double the bound until it crosses the target, then binary-search that bounded interval."
  }),
  program({
    slug: "ads-interpolation-search",
    title: "Search Uniform Data with Interpolation Search",
    source: cMain(`    int values[] = {10, 20, 30, 40, 50, 60, 70}, target = 50, low = 0, high = 6;
    while (low <= high && target >= values[low] && target <= values[high]) {
        int position = low + (int) (((double) (high - low) * (target - values[low])) / (values[high] - values[low]));
        if (values[position] == target) { printf("Index = %d\\n", position); break; }
        if (values[position] < target) low = position + 1; else high = position - 1;
    }
    return 0;`),
    sampleOutput: "Index = 4",
    time: "Average O(log log n)",
    method: "Estimate the likely target position from its numeric proportion within the current range."
  }),
  program({
    slug: "ads-integer-square-root-binary-answer",
    title: "Binary-Search an Integer Square Root",
    source: cMain(`    long long number = 50, low = 0, high = number, answer = 0;
    while (low <= high) { long long middle = low + (high - low) / 2; if (middle <= number / (middle ? middle : 1)) { answer = middle; low = middle + 1; } else high = middle - 1; }
    printf("Floor square root = %lld\\n", answer); return 0;`),
    sampleOutput: "Floor square root = 7",
    time: "O(log n)",
    method: "Search the monotonic answer space for the greatest integer whose square does not exceed the input."
  })
];
