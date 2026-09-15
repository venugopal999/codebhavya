"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Arrays, Searching & Sorting";

function arrayProgram(options) {
  return makeProgram({
    topic,
    concepts: ["Arrays", "Loops", "Indexing"],
    time: "O(n)",
    space: "O(n)",
    ...options
  });
}

module.exports = [
  arrayProgram({
    slug: "read-and-display-array",
    title: "Read and Display Array Elements",
    source: cMain(`    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    printf("Enter %d integers: ", size);
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Array: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5\n8 3 6 1 9",
    sampleOutput: "Array: 8 3 6 1 9",
    method: "Store each input at its array index, then visit the same indices to print the values."
  }),
  arrayProgram({
    slug: "array-sum-and-average",
    title: "Calculate Array Sum and Average",
    source: cMain(`    int size, values[100];
    long long sum = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    printf("Enter %d integers: ", size);
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        sum += values[index];
    }
    printf("Sum = %lld\\nAverage = %.2f\\n", sum, (double) sum / size);
    return 0;`),
    sampleInput: "5\n10 20 30 40 50",
    sampleOutput: "Sum = 150\nAverage = 30.00",
    method: "Accumulate values while reading, then divide the sum by the number of elements."
  }),
  arrayProgram({
    slug: "array-maximum-and-minimum",
    title: "Find the Maximum and Minimum Array Elements",
    source: cMain(`    int size, values[100], minimum, maximum;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    minimum = maximum = values[0];
    for (int index = 1; index < size; index++) {
        if (values[index] < minimum) minimum = values[index];
        if (values[index] > maximum) maximum = values[index];
    }
    printf("Minimum = %d\\nMaximum = %d\\n", minimum, maximum);
    return 0;`),
    sampleInput: "6\n12 -4 35 7 0 18",
    sampleOutput: "Minimum = -4\nMaximum = 35",
    method: "Initialize both results with the first element and update them during one traversal."
  }),
  arrayProgram({
    slug: "second-largest-array-element",
    title: "Find the Second-Largest Distinct Array Element",
    difficulty: "Intermediate",
    source: cMain(`    int size, values[100], largest = 0, second = 0;
    int hasLargest = 0, hasSecond = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 2 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        int value = values[index];
        if (!hasLargest || value > largest) {
            if (hasLargest) { second = largest; hasSecond = 1; }
            largest = value; hasLargest = 1;
        } else if (value != largest && (!hasSecond || value > second)) {
            second = value; hasSecond = 1;
        }
    }
    if (hasSecond) printf("Second largest = %d\\n", second);
    else printf("No second distinct value.\\n");
    return 0;`),
    sampleInput: "6\n9 4 9 7 2 7",
    sampleOutput: "Second largest = 7",
    method: "Maintain the largest and second-largest distinct values in a single pass."
  }),
  arrayProgram({
    slug: "reverse-array",
    title: "Reverse an Array",
    concepts: ["Arrays", "Two pointers", "In-place swap"],
    source: cMain(`    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int left = 0, right = size - 1; left < right; left++, right--) {
        int temporary = values[left];
        values[left] = values[right];
        values[right] = temporary;
    }
    printf("Reversed: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "Reversed: 5 4 3 2 1",
    method: "Swap elements at symmetric left and right indices until the pointers meet."
  }),
  arrayProgram({
    slug: "copy-array",
    title: "Copy One Array into Another",
    source: cMain(`    int size, source[100], destination[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &source[index]);
    for (int index = 0; index < size; index++) destination[index] = source[index];
    printf("Copied array: ");
    for (int index = 0; index < size; index++) printf("%d%c", destination[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "4\n6 8 2 5",
    sampleOutput: "Copied array: 6 8 2 5",
    method: "Assign every source element to the destination element at the same index."
  }),
  arrayProgram({
    slug: "count-even-odd-array",
    title: "Count Even and Odd Array Elements",
    source: cMain(`    int size, values[100], even = 0, odd = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        if (values[index] % 2 == 0) even++; else odd++;
    }
    printf("Even = %d\\nOdd = %d\\n", even, odd);
    return 0;`),
    sampleInput: "7\n1 2 3 4 6 9 10",
    sampleOutput: "Even = 4\nOdd = 3",
    method: "Classify each element by its remainder after division by two."
  }),
  arrayProgram({
    slug: "count-positive-negative-zero-array",
    title: "Count Positive, Negative and Zero Array Elements",
    source: cMain(`    int size, values[100], positive = 0, negative = 0, zero = 0;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        if (values[index] > 0) positive++;
        else if (values[index] < 0) negative++;
        else zero++;
    }
    printf("Positive = %d\\nNegative = %d\\nZero = %d\\n", positive, negative, zero);
    return 0;`),
    sampleInput: "7\n-2 0 8 4 -1 0 3",
    sampleOutput: "Positive = 3\nNegative = 2\nZero = 2",
    method: "Use a three-way comparison for each element and increment the matching counter."
  }),
  arrayProgram({
    slug: "frequency-of-array-elements",
    title: "Count the Frequency of Every Array Element",
    difficulty: "Intermediate",
    concepts: ["Arrays", "Frequency", "Visited markers"],
    time: "O(n²)",
    source: cMain(`    int size, values[100], counted[100] = {0};

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        if (counted[index]) continue;
        int frequency = 1;
        for (int next = index + 1; next < size; next++) {
            if (values[next] == values[index]) { frequency++; counted[next] = 1; }
        }
        printf("%d occurs %d time(s)\\n", values[index], frequency);
    }
    return 0;`),
    sampleInput: "7\n4 2 4 5 2 4 9",
    sampleOutput: "4 occurs 3 time(s)\n2 occurs 2 time(s)\n5 occurs 1 time(s)\n9 occurs 1 time(s)",
    method: "For each uncounted element, scan the remaining array and mark matching positions."
  }),
  arrayProgram({
    slug: "remove-duplicate-array-elements",
    title: "Remove Duplicate Elements from an Array",
    difficulty: "Intermediate",
    concepts: ["Arrays", "Duplicate removal", "Nested loops"],
    time: "O(n²)",
    source: cMain(`    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 0; index < size; index++) {
        for (int next = index + 1; next < size;) {
            if (values[next] == values[index]) {
                for (int shift = next; shift < size - 1; shift++) values[shift] = values[shift + 1];
                size--;
            } else {
                next++;
            }
        }
    }
    printf("Unique array: ");
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "8\n3 5 3 2 5 7 2 9",
    sampleOutput: "Unique array: 3 5 2 7 9",
    method: "When a duplicate is found, shift later elements left and reduce the logical size."
  }),
  arrayProgram({
    slug: "insert-array-element",
    title: "Insert an Element into an Array",
    concepts: ["Arrays", "Insertion", "Right shift"],
    source: cMain(`    int size, values[100], position, value;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size >= 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter position (1 to %d) and value: ", size + 1);
    scanf("%d %d", &position, &value);
    if (position < 1 || position > size + 1) return 1;
    for (int index = size; index >= position; index--) values[index] = values[index - 1];
    values[position - 1] = value;
    size++;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "4\n10 20 30 40\n3 25",
    sampleOutput: "10 20 25 30 40",
    method: "Shift elements right from the insertion point, store the new value and increase the size."
  }),
  arrayProgram({
    slug: "delete-array-element",
    title: "Delete an Element from an Array",
    concepts: ["Arrays", "Deletion", "Left shift"],
    source: cMain(`    int size, values[100], position;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter position to delete (1 to %d): ", size);
    scanf("%d", &position);
    if (position < 1 || position > size) return 1;
    for (int index = position - 1; index < size - 1; index++) values[index] = values[index + 1];
    size--;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5\n10 20 30 40 50\n3",
    sampleOutput: "10 20 40 50",
    method: "Overwrite the deleted position by shifting all later elements one place left."
  }),
  arrayProgram({
    slug: "rotate-array-left-once",
    title: "Rotate an Array Left by One Position",
    concepts: ["Arrays", "Rotation", "Shift"],
    source: cMain(`    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    int first = values[0];
    for (int index = 0; index < size - 1; index++) values[index] = values[index + 1];
    values[size - 1] = first;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "2 3 4 5 1",
    method: "Save the first element, shift the others left and place the saved value at the end."
  }),
  arrayProgram({
    slug: "rotate-array-right-once",
    title: "Rotate an Array Right by One Position",
    concepts: ["Arrays", "Rotation", "Shift"],
    source: cMain(`    int size, values[100];

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    int last = values[size - 1];
    for (int index = size - 1; index > 0; index--) values[index] = values[index - 1];
    values[0] = last;
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "5 1 2 3 4",
    method: "Save the last element, shift the others right and place the saved value first."
  }),
  arrayProgram({
    slug: "left-rotate-array-k-positions",
    title: "Left-Rotate an Array by K Positions",
    difficulty: "Intermediate",
    concepts: ["Arrays", "Modulus", "Temporary array"],
    source: cMain(`    int size, values[100], rotated[100], positions;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    printf("Enter left-rotation count: ");
    scanf("%d", &positions);
    positions = ((positions % size) + size) % size;
    for (int index = 0; index < size; index++) rotated[index] = values[(index + positions) % size];
    for (int index = 0; index < size; index++) printf("%d%c", rotated[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "6\n1 2 3 4 5 6\n2",
    sampleOutput: "3 4 5 6 1 2",
    method: "Map every output index to its source index using (index+K) modulo N."
  }),
  arrayProgram({
    slug: "merge-two-arrays",
    title: "Merge Two Arrays",
    concepts: ["Arrays", "Merge", "Sequential copy"],
    source: cMain(`    int firstSize, secondSize, first[50], second[50], merged[100];

    scanf("%d", &firstSize);
    if (firstSize < 0 || firstSize > 50) return 1;
    for (int index = 0; index < firstSize; index++) scanf("%d", &first[index]);
    scanf("%d", &secondSize);
    if (secondSize < 0 || secondSize > 50) return 1;
    for (int index = 0; index < secondSize; index++) scanf("%d", &second[index]);
    for (int index = 0; index < firstSize; index++) merged[index] = first[index];
    for (int index = 0; index < secondSize; index++) merged[firstSize + index] = second[index];
    for (int index = 0; index < firstSize + secondSize; index++)
        printf("%d%c", merged[index], index == firstSize + secondSize - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "3\n1 3 5\n4\n2 4 6 8",
    sampleOutput: "1 3 5 2 4 6 8",
    method: "Copy the first array, then append the second array starting at the first array's size."
  }),
  arrayProgram({
    slug: "common-elements-two-arrays",
    title: "Find Common Elements in Two Arrays",
    difficulty: "Intermediate",
    concepts: ["Arrays", "Nested search", "Common elements"],
    time: "O(nm)",
    source: cMain(`    int firstSize, secondSize, first[100], second[100];

    scanf("%d", &firstSize);
    if (firstSize < 0 || firstSize > 100) return 1;
    for (int index = 0; index < firstSize; index++) scanf("%d", &first[index]);
    scanf("%d", &secondSize);
    if (secondSize < 0 || secondSize > 100) return 1;
    for (int index = 0; index < secondSize; index++) scanf("%d", &second[index]);
    printf("Common: ");
    for (int index = 0; index < firstSize; index++) {
        int alreadyPrinted = 0;
        for (int previous = 0; previous < index; previous++)
            if (first[previous] == first[index]) alreadyPrinted = 1;
        if (alreadyPrinted) continue;
        for (int next = 0; next < secondSize; next++) {
            if (first[index] == second[next]) { printf("%d ", first[index]); break; }
        }
    }
    printf("\\n");
    return 0;`),
    sampleInput: "5\n1 2 3 4 5\n5\n3 4 4 5 6",
    sampleOutput: "Common: 3 4 5",
    method: "Search each distinct element of the first array inside the second array."
  }),
  arrayProgram({
    slug: "linear-search",
    title: "Search an Array Using Linear Search",
    concepts: ["Linear search", "Arrays", "Early exit"],
    source: cMain(`    int size, values[100], target, position = -1;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    for (int index = 0; index < size; index++) {
        if (values[index] == target) { position = index; break; }
    }
    if (position >= 0) printf("Found at position %d\\n", position + 1);
    else printf("Not found\\n");
    return 0;`),
    sampleInput: "6\n8 2 9 4 7 1\n4",
    sampleOutput: "Found at position 4",
    method: "Compare the target with elements from left to right and stop at the first match."
  }),
  arrayProgram({
    slug: "binary-search",
    title: "Search a Sorted Array Using Binary Search",
    difficulty: "Intermediate",
    concepts: ["Binary search", "Sorted array", "Divide and conquer"],
    time: "O(log n)",
    source: cMain(`    int size, values[100], target, left = 0, right, position = -1;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    right = size - 1;
    while (left <= right) {
        int middle = left + (right - left) / 2;
        if (values[middle] == target) { position = middle; break; }
        if (values[middle] < target) left = middle + 1;
        else right = middle - 1;
    }
    if (position >= 0) printf("Found at position %d\\n", position + 1);
    else printf("Not found\\n");
    return 0;`),
    sampleInput: "7\n2 5 8 12 16 23 38\n16",
    sampleOutput: "Found at position 5",
    method: "Repeatedly discard the half that cannot contain the target; the input must already be sorted."
  }),
  arrayProgram({
    slug: "bubble-sort",
    title: "Sort an Array Using Bubble Sort",
    difficulty: "Intermediate",
    concepts: ["Bubble sort", "Adjacent swap", "Early stop"],
    time: "O(n²)",
    space: "O(1)",
    source: cMain(`    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int pass = 0; pass < size - 1; pass++) {
        int swapped = 0;
        for (int index = 0; index < size - pass - 1; index++) {
            if (values[index] > values[index + 1]) {
                int temporary = values[index]; values[index] = values[index + 1]; values[index + 1] = temporary;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "6\n5 1 4 2 8 3",
    sampleOutput: "1 2 3 4 5 8",
    method: "Swap adjacent inversions so the largest unsorted value moves to the end after each pass."
  }),
  arrayProgram({
    slug: "selection-sort",
    title: "Sort an Array Using Selection Sort",
    difficulty: "Intermediate",
    concepts: ["Selection sort", "Minimum selection", "Swap"],
    time: "O(n²)",
    space: "O(1)",
    source: cMain(`    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int start = 0; start < size - 1; start++) {
        int minimum = start;
        for (int index = start + 1; index < size; index++)
            if (values[index] < values[minimum]) minimum = index;
        int temporary = values[start]; values[start] = values[minimum]; values[minimum] = temporary;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "6\n64 25 12 22 11 9",
    sampleOutput: "9 11 12 22 25 64",
    method: "Select the smallest remaining element and swap it into the next sorted position."
  }),
  arrayProgram({
    slug: "insertion-sort",
    title: "Sort an Array Using Insertion Sort",
    difficulty: "Intermediate",
    concepts: ["Insertion sort", "Sorted prefix", "Shift"],
    time: "O(n²)",
    space: "O(1)",
    source: cMain(`    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    for (int index = 1; index < size; index++) {
        int key = values[index], position = index - 1;
        while (position >= 0 && values[position] > key) {
            values[position + 1] = values[position];
            position--;
        }
        values[position + 1] = key;
    }
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "6\n12 11 13 5 6 7",
    sampleOutput: "5 6 7 11 12 13",
    method: "Remove each key from the unsorted part and insert it into its position in the sorted prefix."
  }),
  arrayProgram({
    slug: "quick-sort",
    title: "Sort an Array Using Quick Sort",
    difficulty: "Advanced",
    concepts: ["Quick sort", "Partition", "Recursion"],
    time: "O(n log n) average",
    space: "O(log n) average",
    source: cMain(`    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    quickSort(values, 0, size - 1);
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`, ["stdio.h"], `int partition(int values[], int low, int high)
{
    int pivot = values[high], smaller = low - 1;
    for (int index = low; index < high; index++) {
        if (values[index] <= pivot) {
            smaller++;
            int temporary = values[smaller]; values[smaller] = values[index]; values[index] = temporary;
        }
    }
    int temporary = values[smaller + 1]; values[smaller + 1] = values[high]; values[high] = temporary;
    return smaller + 1;
}

void quickSort(int values[], int low, int high)
{
    if (low < high) {
        int pivot = partition(values, low, high);
        quickSort(values, low, pivot - 1);
        quickSort(values, pivot + 1, high);
    }
}`),
    sampleInput: "7\n10 7 8 9 1 5 3",
    sampleOutput: "1 3 5 7 8 9 10",
    method: "Partition around a pivot and recursively sort the values on both sides."
  }),
  arrayProgram({
    slug: "merge-sort",
    title: "Sort an Array Using Merge Sort",
    difficulty: "Advanced",
    concepts: ["Merge sort", "Divide and conquer", "Recursion"],
    time: "O(n log n)",
    space: "O(n)",
    source: cMain(`    int size, values[100];

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    mergeSort(values, 0, size - 1);
    for (int index = 0; index < size; index++) printf("%d%c", values[index], index == size - 1 ? '\\n' : ' ');
    return 0;`, ["stdio.h"], `void merge(int values[], int left, int middle, int right)
{
    int temporary[100], first = left, second = middle + 1, count = 0;
    while (first <= middle && second <= right)
        temporary[count++] = values[first] <= values[second] ? values[first++] : values[second++];
    while (first <= middle) temporary[count++] = values[first++];
    while (second <= right) temporary[count++] = values[second++];
    for (int index = 0; index < count; index++) values[left + index] = temporary[index];
}

void mergeSort(int values[], int left, int right)
{
    if (left < right) {
        int middle = left + (right - left) / 2;
        mergeSort(values, left, middle);
        mergeSort(values, middle + 1, right);
        merge(values, left, middle, right);
    }
}`),
    sampleInput: "7\n38 27 43 3 9 82 10",
    sampleOutput: "3 9 10 27 38 43 82",
    method: "Recursively split the array, then merge each pair of sorted halves."
  }),
  arrayProgram({
    slug: "kth-largest-array-element",
    title: "Find the Kth-Largest Array Element",
    difficulty: "Intermediate",
    concepts: ["Arrays", "Sorting", "Rank"],
    time: "O(n²)",
    space: "O(1)",
    source: cMain(`    int size, values[100], rank;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &rank);
    if (rank < 1 || rank > size) return 1;
    for (int start = 0; start < size - 1; start++) {
        int maximum = start;
        for (int index = start + 1; index < size; index++)
            if (values[index] > values[maximum]) maximum = index;
        int temporary = values[start]; values[start] = values[maximum]; values[maximum] = temporary;
    }
    printf("%dth largest = %d\\n", rank, values[rank - 1]);
    return 0;`),
    sampleInput: "6\n7 10 4 3 20 15\n3",
    sampleOutput: "3th largest = 10",
    method: "Sort in descending order and select the element at index K−1."
  })
];
