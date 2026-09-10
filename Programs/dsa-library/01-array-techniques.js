"use strict";

const { cMain, makeDsa } = require("./helpers");
const topic = "Array Techniques";

module.exports = [
  makeDsa({
    slug: "dsa-prefix-sum-range-query",
    title: "Answer Range-Sum Queries with Prefix Sums",
    topic,
    concepts: ["Prefix sum", "Range query", "Preprocessing"],
    source: cMain(`    int values[] = {3, 1, 4, 1, 5, 9};
    int prefix[7] = {0};
    for (int index = 0; index < 6; index++) prefix[index + 1] = prefix[index] + values[index];
    int left = 1, right = 4;
    printf("Range sum [%d,%d] = %d\\n", left, right, prefix[right + 1] - prefix[left]);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Range sum [1,4] = 11",
    time: "O(n) preprocessing, O(1) query",
    space: "O(n)",
    method: "Store cumulative sums so a range is the difference between two prefix positions."
  }),
  makeDsa({
    slug: "dsa-difference-array-range-update",
    title: "Apply Range Updates with a Difference Array",
    topic,
    difficulty: "Intermediate",
    concepts: ["Difference array", "Range update", "Prefix reconstruction"],
    source: cMain(`    int values[] = {10, 10, 10, 10, 10};
    int difference[6] = {values[0], 0, 0, 0, 0, 0};
    for (int index = 1; index < 5; index++) difference[index] = values[index] - values[index - 1];
    int left = 1, right = 3, amount = 5;
    difference[left] += amount;
    difference[right + 1] -= amount;
    int current = 0;
    for (int index = 0; index < 5; index++) {
        current += difference[index];
        printf("%d ", current);
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "10 15 15 15 10",
    time: "O(1) update, O(n) reconstruction",
    space: "O(n)",
    method: "Mark only the update boundaries, then recover final values with a prefix sum."
  }),
  makeDsa({
    slug: "dsa-kadane-maximum-subarray",
    title: "Find the Maximum Subarray Sum with Kadane's Algorithm",
    topic,
    difficulty: "Intermediate",
    concepts: ["Kadane", "Dynamic choice", "Running maximum"],
    source: cMain(`    int values[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int current = values[0], best = values[0];
    for (int index = 1; index < 9; index++) {
        current = values[index] > current + values[index] ? values[index] : current + values[index];
        if (current > best) best = current;
    }
    printf("Maximum subarray sum = %d\\n", best);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Maximum subarray sum = 6",
    time: "O(n)",
    method: "At every position, choose between starting a new subarray and extending the current one."
  }),
  makeDsa({
    slug: "dsa-fixed-sliding-window-sum",
    title: "Find the Maximum Fixed-Window Sum",
    topic,
    concepts: ["Sliding window", "Fixed size", "Rolling sum"],
    source: cMain(`    int values[] = {2, 1, 5, 1, 3, 2};
    int window_size = 3, window_sum = 0;
    for (int index = 0; index < window_size; index++) window_sum += values[index];
    int best = window_sum;
    for (int index = window_size; index < 6; index++) {
        window_sum += values[index] - values[index - window_size];
        if (window_sum > best) best = window_sum;
    }
    printf("Maximum window sum = %d\\n", best);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Maximum window sum = 9",
    time: "O(n)",
    method: "Add the entering value and remove the leaving value instead of recalculating each window."
  }),
  makeDsa({
    slug: "dsa-two-pointer-pair-sum",
    title: "Find a Pair Sum with Two Pointers",
    topic,
    concepts: ["Two pointers", "Sorted array", "Pair sum"],
    source: cMain(`    int values[] = {1, 2, 4, 6, 10, 14};
    int target = 16, left = 0, right = 5;
    while (left < right) {
        int sum = values[left] + values[right];
        if (sum == target) {
            printf("Pair = %d, %d\\n", values[left], values[right]);
            return 0;
        }
        if (sum < target) left++;
        else right--;
    }
    puts("No pair found.");
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Pair = 2, 14",
    time: "O(n)",
    method: "Move the left pointer for a small sum and the right pointer for a large sum."
  }),
  makeDsa({
    slug: "dsa-dutch-national-flag",
    title: "Sort 0s, 1s and 2s with the Dutch National Flag Algorithm",
    topic,
    difficulty: "Intermediate",
    concepts: ["Three pointers", "Partitioning", "In-place sort"],
    source: cMain(`    int values[] = {2, 0, 2, 1, 1, 0};
    int low = 0, middle = 0, high = 5;
    while (middle <= high) {
        if (values[middle] == 0) {
            int temporary = values[low]; values[low++] = values[middle]; values[middle++] = temporary;
        } else if (values[middle] == 1) middle++;
        else {
            int temporary = values[middle]; values[middle] = values[high]; values[high--] = temporary;
        }
    }
    for (int index = 0; index < 6; index++) printf("%d ", values[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "0 0 1 1 2 2",
    time: "O(n)",
    method: "Maintain finished zero and two regions while classifying the middle element."
  }),
  makeDsa({
    slug: "dsa-boyer-moore-majority",
    title: "Find a Majority Element with Boyer-Moore Voting",
    topic,
    difficulty: "Intermediate",
    concepts: ["Boyer-Moore", "Candidate", "Verification"],
    source: cMain(`    int values[] = {2, 2, 1, 1, 1, 2, 2};
    int candidate = 0, votes = 0;
    for (int index = 0; index < 7; index++) {
        if (votes == 0) candidate = values[index];
        votes += values[index] == candidate ? 1 : -1;
    }
    int frequency = 0;
    for (int index = 0; index < 7; index++) if (values[index] == candidate) frequency++;
    if (frequency > 7 / 2) printf("Majority = %d\\n", candidate);
    else puts("No majority element.");
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Majority = 2",
    time: "O(n)",
    method: "Cancel different values, then verify that the surviving candidate occurs more than half the time."
  }),
  makeDsa({
    slug: "dsa-missing-number-xor",
    title: "Find a Missing Number Using XOR",
    topic,
    concepts: ["XOR", "Cancellation", "Missing value"],
    source: cMain(`    int values[] = {3, 0, 1};
    int missing = 3;
    for (int index = 0; index < 3; index++) missing ^= index ^ values[index];
    printf("Missing number = %d\\n", missing);
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "Missing number = 2",
    time: "O(n)",
    method: "XOR all expected indices with all stored values so equal numbers cancel."
  }),
  makeDsa({
    slug: "dsa-array-rotation-reversal",
    title: "Rotate an Array with the Reversal Algorithm",
    topic,
    difficulty: "Intermediate",
    concepts: ["Reversal algorithm", "Rotation", "In-place"],
    source: cMain(`    int values[] = {1, 2, 3, 4, 5, 6, 7};
    int length = 7, positions = 2;
    reverse(values, 0, positions - 1);
    reverse(values, positions, length - 1);
    reverse(values, 0, length - 1);
    for (int index = 0; index < length; index++) printf("%d ", values[index]);
    putchar('\\n');
    return 0;`, ["stdio.h"], `void reverse(int values[], int left, int right)
{
    while (left < right) {
        int temporary = values[left];
        values[left++] = values[right];
        values[right--] = temporary;
    }
}`),
    sampleInput: "No input required",
    sampleOutput: "3 4 5 6 7 1 2",
    time: "O(n)",
    method: "Reverse the two rotation segments separately, then reverse the complete array."
  }),
  makeDsa({
    slug: "dsa-merge-overlapping-intervals",
    title: "Merge Overlapping Intervals",
    topic,
    difficulty: "Advanced",
    concepts: ["Intervals", "Sorting", "Greedy merge"],
    source: cMain(`    struct Interval intervals[] = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    int count = 4, write = 0;
    for (int index = 1; index < count; index++) {
        if (intervals[index].start <= intervals[write].end) {
            if (intervals[index].end > intervals[write].end) intervals[write].end = intervals[index].end;
        } else intervals[++write] = intervals[index];
    }
    for (int index = 0; index <= write; index++)
        printf("[%d,%d] ", intervals[index].start, intervals[index].end);
    putchar('\\n');
    return 0;`, ["stdio.h"], `struct Interval { int start; int end; };`),
    sampleInput: "No input required",
    sampleOutput: "[1,6] [8,10] [15,18]",
    time: "O(n log n) including sorting",
    method: "After sorting by start time, extend the current interval or begin a new merged interval."
  }),
  makeDsa({
    slug: "dsa-count-inversions",
    title: "Count Array Inversions with Merge Sort",
    topic,
    difficulty: "Advanced",
    concepts: ["Merge sort", "Inversions", "Divide and conquer"],
    source: cMain(`    int values[] = {2, 4, 1, 3, 5};
    int temporary[5];
    long long inversions = merge_count(values, temporary, 0, 4);
    printf("Inversions = %lld\\n", inversions);
    return 0;`, ["stdio.h"], `long long merge_count(int values[], int temporary[], int left, int right)
{
    if (left >= right) return 0;
    int middle = left + (right - left) / 2;
    long long count = merge_count(values, temporary, left, middle)
                    + merge_count(values, temporary, middle + 1, right);
    int first = left, second = middle + 1, write = left;
    while (first <= middle && second <= right) {
        if (values[first] <= values[second]) temporary[write++] = values[first++];
        else {
            temporary[write++] = values[second++];
            count += middle - first + 1;
        }
    }
    while (first <= middle) temporary[write++] = values[first++];
    while (second <= right) temporary[write++] = values[second++];
    for (int index = left; index <= right; index++) values[index] = temporary[index];
    return count;
}`),
    sampleInput: "No input required",
    sampleOutput: "Inversions = 3",
    time: "O(n log n)",
    space: "O(n)",
    method: "During merging, every right-side value chosen before remaining left values forms inversions."
  }),
  makeDsa({
    slug: "dsa-next-permutation",
    title: "Generate the Next Lexicographic Permutation",
    topic,
    difficulty: "Advanced",
    concepts: ["Permutation", "Pivot", "Suffix reversal"],
    source: cMain(`    int values[] = {1, 2, 3, 6, 5, 4};
    int length = 6, pivot = length - 2;
    while (pivot >= 0 && values[pivot] >= values[pivot + 1]) pivot--;
    if (pivot >= 0) {
        int successor = length - 1;
        while (values[successor] <= values[pivot]) successor--;
        int temporary = values[pivot]; values[pivot] = values[successor]; values[successor] = temporary;
    }
    for (int left = pivot + 1, right = length - 1; left < right; left++, right--) {
        int temporary = values[left]; values[left] = values[right]; values[right] = temporary;
    }
    for (int index = 0; index < length; index++) printf("%d ", values[index]);
    putchar('\\n');
    return 0;`),
    sampleInput: "No input required",
    sampleOutput: "1 2 4 3 5 6",
    time: "O(n)",
    method: "Find the rightmost increasing pivot, swap with its smallest larger suffix value, then reverse the suffix."
  })
];
