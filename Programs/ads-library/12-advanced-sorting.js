"use strict";

const { cMain, makeAds } = require("./helpers");
const topic = "Level 12 — Advanced Sorting";
const print = `void print_values(const int values[], int count) { for (int i = 0; i < count; i++) printf("%d%c", values[i], i == count - 1 ? '\\n' : ' '); }`;

function program(options) {
  return makeAds({ topic, concepts: ["Advanced sorting", "Ordering"], difficulty: "Advanced", ...options });
}

module.exports = [
  program({
    slug: "ads-stable-counting-sort",
    title: "Perform Stable Counting Sort",
    source: cMain(`    int values[] = {4, 2, 2, 8, 3, 3, 1}, count[9] = {0}, output[7];
    for (int i = 0; i < 7; i++) count[values[i]]++;
    for (int i = 1; i < 9; i++) count[i] += count[i - 1];
    for (int i = 6; i >= 0; i--) output[--count[values[i]]] = values[i];
    print_values(output, 7); return 0;`, ["stdio.h"], print),
    sampleOutput: "1 2 2 3 3 4 8",
    time: "O(n + k)",
    space: "O(n + k)",
    method: "Use cumulative frequencies and place elements from right to left to preserve equal-element order."
  }),
  program({
    slug: "ads-lsd-radix-sort",
    title: "Sort Integers with LSD Radix Sort",
    source: cMain(`    int values[] = {170, 45, 75, 90, 802, 24, 2, 66};
    for (int exponent = 1; 802 / exponent > 0; exponent *= 10) {
        int count[10] = {0}, output[8];
        for (int i = 0; i < 8; i++) count[(values[i] / exponent) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = 7; i >= 0; i--) output[--count[(values[i] / exponent) % 10]] = values[i];
        for (int i = 0; i < 8; i++) values[i] = output[i];
    }
    print_values(values, 8); return 0;`, ["stdio.h"], print),
    sampleOutput: "2 24 45 66 75 90 170 802",
    time: "O(d(n + b))",
    space: "O(n + b)",
    method: "Apply stable counting sort to digits from least to most significant."
  }),
  program({
    slug: "ads-shell-sort-gap-reduction",
    title: "Sort with Shell Gap Reduction",
    source: cMain(`    int values[] = {12, 34, 54, 2, 3};
    for (int gap = 5 / 2; gap > 0; gap /= 2)
        for (int i = gap; i < 5; i++) {
            int value = values[i], j = i;
            while (j >= gap && values[j - gap] > value) { values[j] = values[j - gap]; j -= gap; }
            values[j] = value;
        }
    print_values(values, 5); return 0;`, ["stdio.h"], print),
    sampleOutput: "2 3 12 34 54",
    time: "Depends on gap sequence",
    space: "O(1)",
    method: "Insertion-sort distant elements first, then reduce the gap until it becomes one."
  }),
  program({
    slug: "ads-comb-sort",
    title: "Sort with Comb Sort",
    source: cMain(`    int values[] = {8, 4, 1, 56, 3, -44, 23, -6}, gap = 8, swapped = 1;
    while (gap > 1 || swapped) {
        gap = gap * 10 / 13; if (gap < 1) gap = 1; swapped = 0;
        for (int i = 0; i + gap < 8; i++) if (values[i] > values[i + gap]) { int t = values[i]; values[i] = values[i + gap]; values[i + gap] = t; swapped = 1; }
    }
    print_values(values, 8); return 0;`, ["stdio.h"], print),
    sampleOutput: "-44 -6 1 3 4 8 23 56",
    time: "Average O(n^2 / 2^p)",
    space: "O(1)",
    method: "Shrink a large comparison gap to remove turtles before the final adjacent pass."
  }),
  program({
    slug: "ads-cycle-sort-minimum-writes",
    title: "Minimize Array Writes with Cycle Sort",
    source: cMain(`    int values[] = {1, 8, 3, 9, 10, 10, 2, 4}, writes = 0;
    for (int start = 0; start < 7; start++) {
        int item = values[start], position = start;
        for (int i = start + 1; i < 8; i++) if (values[i] < item) position++;
        if (position == start) continue;
        while (item == values[position]) position++;
        int temp = values[position]; values[position] = item; item = temp; writes++;
        while (position != start) {
            position = start;
            for (int i = start + 1; i < 8; i++) if (values[i] < item) position++;
            while (item == values[position]) position++;
            temp = values[position]; values[position] = item; item = temp; writes++;
        }
    }
    print_values(values, 8); printf("Writes = %d\\n", writes); return 0;`, ["stdio.h"], print),
    sampleOutput: "1 2 3 4 8 9 10 10\nWrites = 6",
    time: "O(n^2)",
    space: "O(1)",
    method: "Rotate each permutation cycle so every value is written directly to its final rank."
  }),
  program({
    slug: "ads-pancake-sort",
    title: "Sort by Prefix Flips with Pancake Sort",
    source: cMain(`    int values[] = {23, 10, 20, 11, 12, 6, 7};
    for (int size = 7; size > 1; size--) {
        int maximum = 0;
        for (int i = 1; i < size; i++) if (values[i] > values[maximum]) maximum = i;
        if (maximum == size - 1) continue;
        for (int left = 0, right = maximum; left < right; left++, right--) { int t = values[left]; values[left] = values[right]; values[right] = t; }
        for (int left = 0, right = size - 1; left < right; left++, right--) { int t = values[left]; values[left] = values[right]; values[right] = t; }
    }
    print_values(values, 7); return 0;`, ["stdio.h"], print),
    sampleOutput: "6 7 10 11 12 20 23",
    time: "O(n^2)",
    space: "O(1)",
    method: "Bring the largest unsorted item to the front and then flip it into its final position."
  }),
  program({
    slug: "ads-bitonic-sort-network",
    title: "Sort a Power-of-Two Array with Bitonic Sort",
    source: cMain(`    int values[] = {3, 7, 4, 8, 6, 2, 1, 5};
    bitonic_sort(values, 0, 8, 1);
    print_values(values, 8); return 0;`, ["stdio.h"], `${print}
void compare(int values[], int first, int second, int ascending) { if (ascending == (values[first] > values[second])) { int t = values[first]; values[first] = values[second]; values[second] = t; } }
void merge_bitonic(int values[], int low, int count, int ascending) { if (count > 1) { int half = count / 2; for (int i = low; i < low + half; i++) compare(values, i, i + half, ascending); merge_bitonic(values, low, half, ascending); merge_bitonic(values, low + half, half, ascending); } }
void bitonic_sort(int values[], int low, int count, int ascending) { if (count > 1) { int half = count / 2; bitonic_sort(values, low, half, 1); bitonic_sort(values, low + half, half, 0); merge_bitonic(values, low, count, ascending); } }`),
    sampleOutput: "1 2 3 4 5 6 7 8",
    time: "O(n log^2 n)",
    space: "O(log n)",
    method: "Build ascending and descending bitonic halves, then merge them with a fixed comparison network."
  }),
  program({
    slug: "ads-k-way-merge-sorted-arrays",
    title: "Merge K Sorted Arrays with a Min Heap",
    source: cMain(`    int arrays[3][4] = {{1, 4, 7, 10}, {2, 5, 8, 11}, {3, 6, 9, 12}};
    int position[3] = {0};
    for (int output = 0; output < 12; output++) {
        int selected = -1;
        for (int array = 0; array < 3; array++) if (position[array] < 4 && (selected < 0 || arrays[array][position[array]] < arrays[selected][position[selected]])) selected = array;
        printf("%d%c", arrays[selected][position[selected]++], output == 11 ? '\\n' : ' ');
    }
    return 0;`),
    sampleOutput: "1 2 3 4 5 6 7 8 9 10 11 12",
    time: "O(total * k) demonstration",
    space: "O(k)",
    method: "Track the current head of every sorted input and repeatedly emit the smallest available head."
  })
];
