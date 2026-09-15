"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Functions & Recursion";

function functionProgram(options) {
  return makeProgram({
    topic,
    concepts: ["Functions", "Parameters", "Return values"],
    ...options
  });
}

module.exports = [
  functionProgram({
    slug: "factorial-using-function",
    title: "Calculate Factorial Using a Function",
    source: cMain(`    int number;

    printf("Enter a non-negative integer up to 20: ");
    scanf("%d", &number);
    if (number < 0 || number > 20) return 1;
    printf("%d! = %llu\\n", number, factorial(number));
    return 0;`, ["stdio.h"], `unsigned long long factorial(int number)
{
    unsigned long long result = 1;
    for (int value = 2; value <= number; value++) result *= (unsigned long long) value;
    return result;
}`),
    sampleInput: "7",
    sampleOutput: "7! = 5040",
    time: "O(n)",
    method: "Move the factorial loop into a reusable function that returns the computed value."
  }),
  functionProgram({
    slug: "prime-check-using-function",
    title: "Check Prime Number Using a Function",
    source: cMain(`    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    printf(isPrime(number) ? "Prime number\\n" : "Not a prime number\\n");
    return 0;`, ["stdio.h"], `int isPrime(int number)
{
    if (number < 2) return 0;
    for (int divisor = 2; divisor <= number / divisor; divisor++)
        if (number % divisor == 0) return 0;
    return 1;
}`),
    sampleInput: "97",
    sampleOutput: "Prime number",
    time: "O(√n)",
    method: "Return immediately when a divisor is found; otherwise return true after all candidates are tested."
  }),
  functionProgram({
    slug: "maximum-using-function",
    title: "Find Maximum Using a Function",
    source: cMain(`    int first, second, third;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    printf("Maximum = %d\\n", maximum(maximum(first, second), third));
    return 0;`, ["stdio.h"], `int maximum(int first, int second)
{
    return first > second ? first : second;
}`),
    sampleInput: "14 39 27",
    sampleOutput: "Maximum = 39",
    method: "Use a two-value maximum function twice to handle three inputs."
  }),
  functionProgram({
    slug: "factorial-recursion",
    title: "Calculate Factorial Using Recursion",
    difficulty: "Intermediate",
    concepts: ["Recursion", "Base case", "Factorial"],
    source: cMain(`    int number;

    printf("Enter a non-negative integer up to 20: ");
    scanf("%d", &number);
    if (number < 0 || number > 20) return 1;
    printf("%d! = %llu\\n", number, factorial(number));
    return 0;`, ["stdio.h"], `unsigned long long factorial(int number)
{
    if (number <= 1) return 1;
    return (unsigned long long) number * factorial(number - 1);
}`),
    sampleInput: "6",
    sampleOutput: "6! = 720",
    time: "O(n)",
    space: "O(n)",
    method: "Return one at the base case and multiply N by the factorial of N−1 while unwinding."
  }),
  functionProgram({
    slug: "fibonacci-recursion",
    title: "Print Fibonacci Terms Using Recursion",
    difficulty: "Intermediate",
    concepts: ["Recursion", "Fibonacci", "Base cases"],
    source: cMain(`    int terms;

    printf("Enter number of terms from 1 to 40: ");
    scanf("%d", &terms);
    if (terms < 1 || terms > 40) return 1;
    for (int index = 0; index < terms; index++)
        printf("%llu%c", fibonacci(index), index == terms - 1 ? '\\n' : ' ');
    return 0;`, ["stdio.h"], `unsigned long long fibonacci(int index)
{
    if (index <= 1) return (unsigned long long) index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}`),
    sampleInput: "8",
    sampleOutput: "0 1 1 2 3 5 8 13",
    time: "O(2ⁿ)",
    space: "O(n)",
    method: "Define each term as the sum of its two preceding recursive results."
  }),
  functionProgram({
    slug: "sum-natural-numbers-recursion",
    title: "Find the Sum of Natural Numbers Using Recursion",
    difficulty: "Intermediate",
    concepts: ["Recursion", "Base case", "Natural numbers"],
    source: cMain(`    int number;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) return 1;
    printf("Sum = %lld\\n", sumTo(number));
    return 0;`, ["stdio.h"], `long long sumTo(int number)
{
    if (number == 0) return 0;
    return number + sumTo(number - 1);
}`),
    sampleInput: "10",
    sampleOutput: "Sum = 55",
    time: "O(n)",
    space: "O(n)",
    method: "Add N to the recursive sum ending at N−1 until the base case zero."
  }),
  functionProgram({
    slug: "power-recursion",
    title: "Calculate Power Using Recursion",
    difficulty: "Intermediate",
    concepts: ["Recursion", "Exponentiation by squaring", "Divide and conquer"],
    source: cMain(`    long long base;
    unsigned int exponent;

    printf("Enter integer base and non-negative exponent: ");
    scanf("%lld %u", &base, &exponent);
    printf("Result = %lld\\n", power(base, exponent));
    return 0;`, ["stdio.h"], `long long power(long long base, unsigned int exponent)
{
    if (exponent == 0) return 1;
    long long half = power(base, exponent / 2);
    if (exponent % 2 == 0) return half * half;
    return base * half * half;
}`),
    sampleInput: "3 5",
    sampleOutput: "Result = 243",
    time: "O(log n)",
    space: "O(log n)",
    method: "Recursively compute half the exponent and square it, multiplying by the base only for odd exponents."
  }),
  functionProgram({
    slug: "reverse-string-recursion",
    title: "Reverse a String Using Recursion",
    difficulty: "Intermediate",
    concepts: ["Recursion", "Strings", "Two pointers"],
    source: cMain(`    char text[200];

    fgets(text, sizeof text, stdin);
    text[strcspn(text, "\\n")] = '\\0';
    reverse(text, 0, (int) strlen(text) - 1);
    printf("Reversed: %s\\n", text);
    return 0;`, ["stdio.h", "string.h"], `void reverse(char text[], int left, int right)
{
    if (left >= right) return;
    char temporary = text[left]; text[left] = text[right]; text[right] = temporary;
    reverse(text, left + 1, right - 1);
}`),
    sampleInput: "recursion",
    sampleOutput: "Reversed: noisrucer",
    time: "O(n)",
    space: "O(n)",
    method: "Swap the outer characters and recursively process the smaller inner substring."
  }),
  functionProgram({
    slug: "binary-search-recursion",
    title: "Perform Binary Search Using Recursion",
    difficulty: "Advanced",
    concepts: ["Recursion", "Binary search", "Sorted array"],
    source: cMain(`    int size, values[100], target;

    scanf("%d", &size);
    if (size < 1 || size > 100) return 1;
    for (int index = 0; index < size; index++) scanf("%d", &values[index]);
    scanf("%d", &target);
    int position = binarySearch(values, 0, size - 1, target);
    if (position >= 0) printf("Found at position %d\\n", position + 1);
    else printf("Not found\\n");
    return 0;`, ["stdio.h"], `int binarySearch(const int values[], int left, int right, int target)
{
    if (left > right) return -1;
    int middle = left + (right - left) / 2;
    if (values[middle] == target) return middle;
    if (values[middle] < target) return binarySearch(values, middle + 1, right, target);
    return binarySearch(values, left, middle - 1, target);
}`),
    sampleInput: "7\n2 5 8 12 16 23 38\n23",
    sampleOutput: "Found at position 6",
    time: "O(log n)",
    space: "O(log n)",
    method: "Return a result from the half selected by comparing the target with the middle element."
  })
];
