"use strict";

const { cMain, makeProgram } = require("./helpers");

module.exports = [
  makeProgram({
    slug: "hello-world",
    title: "Display Hello World",
    topic: "Basics & Input/Output",
    concepts: ["main()", "printf()", "Header files"],
    featured: true,
    customPage: true,
    source: cMain(`    printf("Hello, World!\\n");
    return 0;`),
    sampleOutput: "Hello, World!",
    summary: "Understand the smallest complete C program and trace how printf() produces output.",
    method: "Include stdio.h, start execution in main() and use printf() to write the message."
  }),
  makeProgram({
    slug: "add-two-numbers",
    title: "Add Two Integers",
    topic: "Basics & Input/Output",
    concepts: ["scanf()", "Addition", "Variables"],
    featured: true,
    customPage: true,
    source: cMain(`    int first, second, sum;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    sum = first + second;
    printf("Sum = %d\\n", sum);
    return 0;`),
    sampleInput: "12 8",
    sampleOutput: "Enter two integers: Sum = 20",
    summary: "Read two integers, add them and inspect how the result variable receives the calculated value.",
    method: "Read both operands, add them into a result variable and print the sum."
  }),
  makeProgram({
    slug: "swap-two-numbers",
    title: "Swap Two Numbers",
    topic: "Basics & Input/Output",
    concepts: ["Assignment", "Temporary variable", "Input"],
    featured: true,
    customPage: true,
    source: cMain(`    int first, second, temporary;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    temporary = first;
    first = second;
    second = temporary;
    printf("After swapping: %d %d\\n", first, second);
    return 0;`),
    sampleInput: "10 25",
    sampleOutput: "After swapping: 25 10",
    summary: "Preserve the first value in temporary storage before exchanging two integers.",
    method: "Use a temporary variable so the first value is not lost during assignment."
  }),
  makeProgram({
    slug: "even-or-odd",
    title: "Check Even or Odd",
    topic: "Decision Making",
    concepts: ["if-else", "Modulus", "Condition"],
    featured: true,
    customPage: true,
    source: cMain(`    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    if (number % 2 == 0)
        printf("%d is even.\\n", number);
    else
        printf("%d is odd.\\n", number);
    return 0;`),
    sampleInput: "17",
    sampleOutput: "17 is odd.",
    summary: "Use the remainder operator and an if-else decision to classify an integer.",
    method: "An integer is even when division by two leaves remainder zero."
  }),
  makeProgram({
    slug: "largest-of-three",
    title: "Largest of Three Numbers",
    topic: "Decision Making",
    concepts: ["if statement", "Comparison", "Running maximum"],
    featured: true,
    customPage: true,
    source: cMain(`    int first, second, third, largest;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    largest = first;
    if (second > largest) largest = second;
    if (third > largest) largest = third;
    printf("Largest = %d\\n", largest);
    return 0;`),
    sampleInput: "14 39 27",
    sampleOutput: "Largest = 39",
    summary: "Track a current largest value and update it after comparing each remaining number.",
    method: "Initialize the running maximum with the first value and update it after two comparisons."
  }),
  makeProgram({
    slug: "gcd-recursion",
    title: "Find GCD Using Recursion",
    topic: "Functions & Recursion",
    difficulty: "Intermediate",
    concepts: ["Functions", "Recursion", "Modulus"],
    featured: true,
    customPage: true,
    source: cMain(`    int first, second;

    printf("Enter two positive integers: ");
    scanf("%d %d", &first, &second);
    printf("GCD of %d and %d is %d.\\n", first, second, gcd(first, second));
    return 0;`, ["stdio.h"], `int gcd(int first, int second)
{
    if (second == 0) return first;
    return gcd(second, first % second);
}`),
    sampleInput: "84 30",
    sampleOutput: "GCD of 84 and 30 is 6.",
    time: "O(log min(a,b))",
    space: "O(log min(a,b))",
    summary: "Apply Euclid's algorithm recursively and inspect how the call stack reduces the problem.",
    method: "Replace the pair with divisor and remainder until the second value becomes zero."
  })
];
