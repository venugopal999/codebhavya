"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Pointers & Dynamic Memory";

module.exports = [
  makeProgram({
    slug: "swap-using-pointers",
    title: "Swap Two Numbers Using Pointers",
    topic,
    difficulty: "Intermediate",
    concepts: ["Pointers", "Address", "Pass by reference"],
    source: cMain(`    int first, second;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    swap(&first, &second);
    printf("After swapping: %d %d\\n", first, second);
    return 0;`, ["stdio.h"], `void swap(int *first, int *second)
{
    int temporary = *first;
    *first = *second;
    *second = temporary;
}`),
    sampleInput: "10 25",
    sampleOutput: "After swapping: 25 10",
    method: "Pass variable addresses and modify the original values through dereferenced pointers."
  }),
  makeProgram({
    slug: "array-sum-using-pointers",
    title: "Find Array Sum Using Pointer Arithmetic",
    topic,
    difficulty: "Intermediate",
    concepts: ["Pointers", "Pointer arithmetic", "Arrays"],
    source: cMain(`    int size, values[100];
    long long sum = 0;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", values + index);
    for (int *current = values; current < values + size; current++) sum += *current;
    printf("Sum = %lld\\n", sum);
    return 0;`),
    sampleInput: "5\n10 20 30 40 50",
    sampleOutput: "Sum = 150",
    time: "O(n)",
    space: "O(n)",
    method: "Move a pointer through the array and add each dereferenced value."
  }),
  makeProgram({
    slug: "dynamic-array-sum",
    title: "Create a Dynamic Array and Find Its Sum",
    topic,
    difficulty: "Intermediate",
    concepts: ["malloc()", "free()", "Dynamic array"],
    source: cMain(`    int size;

    printf("Enter array size: ");
    scanf("%d", &size);
    if (size < 1 || size > 100000) return 1;
    int *values = malloc((size_t) size * sizeof *values);
    if (values == NULL) {
        printf("Memory allocation failed.\\n");
        return 1;
    }
    long long sum = 0;
    for (int index = 0; index < size; index++) {
        scanf("%d", &values[index]);
        sum += values[index];
    }
    printf("Sum = %lld\\n", sum);
    free(values);
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "5\n3 6 9 12 15",
    sampleOutput: "Sum = 45",
    time: "O(n)",
    space: "O(n)",
    method: "Allocate exactly N integers, use the memory like an array and release it with free()."
  }),
  makeProgram({
    slug: "dynamic-array-using-realloc",
    title: "Expand a Dynamic Array Using realloc()",
    topic,
    difficulty: "Advanced",
    concepts: ["realloc()", "Dynamic memory", "Safe pointer update"],
    source: cMain(`    int initialSize, extraSize;

    scanf("%d", &initialSize);
    if (initialSize < 1 || initialSize > 1000) return 1;
    int *values = malloc((size_t) initialSize * sizeof *values);
    if (values == NULL) return 1;
    for (int index = 0; index < initialSize; index++) scanf("%d", &values[index]);
    scanf("%d", &extraSize);
    if (extraSize < 0 || initialSize + extraSize > 2000) { free(values); return 1; }
    int *expanded = realloc(values, (size_t) (initialSize + extraSize) * sizeof *values);
    if (expanded == NULL) { free(values); return 1; }
    values = expanded;
    for (int index = initialSize; index < initialSize + extraSize; index++) scanf("%d", &values[index]);
    for (int index = 0; index < initialSize + extraSize; index++)
        printf("%d%c", values[index], index == initialSize + extraSize - 1 ? '\\n' : ' ');
    free(values);
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "3\n10 20 30\n2\n40 50",
    sampleOutput: "10 20 30 40 50",
    time: "O(n)",
    space: "O(n)",
    method: "Store realloc() in a temporary pointer, verify success and then continue using the expanded block."
  })
];
