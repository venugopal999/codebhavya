"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Operators & Conversions";

module.exports = [
  makeProgram({
    slug: "quotient-and-remainder",
    title: "Find Quotient and Remainder",
    topic,
    concepts: ["Division", "Modulus", "Integers"],
    source: cMain(`    int dividend, divisor;

    printf("Enter dividend and divisor: ");
    scanf("%d %d", &dividend, &divisor);
    if (divisor == 0) {
        printf("Division by zero is not allowed.\\n");
        return 1;
    }
    printf("Quotient = %d\\n", dividend / divisor);
    printf("Remainder = %d\\n", dividend % divisor);
    return 0;`),
    sampleInput: "29 6",
    sampleOutput: "Quotient = 4\nRemainder = 5",
    method: "Use integer division for the quotient and the modulus operator for the remainder."
  }),
  makeProgram({
    slug: "all-arithmetic-operations",
    title: "Perform All Arithmetic Operations",
    topic,
    concepts: ["Arithmetic operators", "Division", "Modulus"],
    source: cMain(`    int first, second;

    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    printf("Sum = %d\\nDifference = %d\\nProduct = %d\\n", first + second, first - second, first * second);
    if (second != 0) {
        printf("Quotient = %.2f\\nRemainder = %d\\n", (double) first / second, first % second);
    } else {
        printf("Division and remainder are undefined for zero.\\n");
    }
    return 0;`),
    sampleInput: "20 6",
    sampleOutput: "Sum = 26\nDifference = 14\nProduct = 120\nQuotient = 3.33\nRemainder = 2",
    method: "Apply each arithmetic operator and guard division against a zero divisor."
  }),
  makeProgram({
    slug: "average-of-three-numbers",
    title: "Calculate the Average of Three Numbers",
    topic,
    concepts: ["Type casting", "Average", "Arithmetic"],
    source: cMain(`    double first, second, third;

    printf("Enter three numbers: ");
    scanf("%lf %lf %lf", &first, &second, &third);
    printf("Average = %.2f\\n", (first + second + third) / 3.0);
    return 0;`),
    sampleInput: "12 18 24",
    sampleOutput: "Average = 18.00",
    method: "Add the three numbers and divide by 3.0 to retain a fractional result."
  }),
  makeProgram({
    slug: "square-and-cube",
    title: "Find the Square and Cube of a Number",
    topic,
    concepts: ["Multiplication", "Expressions", "long long"],
    source: cMain(`    long long number;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    printf("Square = %lld\\n", number * number);
    printf("Cube = %lld\\n", number * number * number);
    return 0;`),
    sampleInput: "7",
    sampleOutput: "Square = 49\nCube = 343",
    method: "Multiply the number by itself two times for the square and three times for the cube."
  }),
  makeProgram({
    slug: "power-using-pow",
    title: "Calculate Power Using pow()",
    topic,
    concepts: ["pow()", "math.h", "Exponent"],
    source: cMain(`    double base, exponent;

    printf("Enter base and exponent: ");
    scanf("%lf %lf", &base, &exponent);
    printf("Result = %.4f\\n", pow(base, exponent));
    return 0;`, ["stdio.h", "math.h"]),
    sampleInput: "2 8",
    sampleOutput: "Result = 256.0000",
    method: "Pass the base and exponent to the standard-library pow() function."
  }),
  makeProgram({
    slug: "last-digit-of-number",
    title: "Find the Last Digit of an Integer",
    topic,
    concepts: ["Modulus", "abs()", "Integer digits"],
    source: cMain(`    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    printf("Last digit = %d\\n", abs(number % 10));
    return 0;`, ["stdio.h", "stdlib.h"]),
    sampleInput: "-483",
    sampleOutput: "Last digit = 3",
    method: "Take the remainder after division by 10 and use abs() for negative inputs."
  }),
  makeProgram({
    slug: "sum-digits-three-digit-number",
    title: "Find the Sum of Digits of a Three-Digit Number",
    topic,
    concepts: ["Division", "Modulus", "Digit extraction"],
    source: cMain(`    int number, sum;

    printf("Enter a three-digit positive integer: ");
    scanf("%d", &number);
    sum = number / 100 + (number / 10) % 10 + number % 10;
    printf("Digit sum = %d\\n", sum);
    return 0;`),
    sampleInput: "572",
    sampleOutput: "Digit sum = 14",
    method: "Extract hundreds, tens and ones with division and remainder, then add them."
  }),
  makeProgram({
    slug: "reverse-three-digit-number",
    title: "Reverse a Three-Digit Number",
    topic,
    concepts: ["Digit extraction", "Place value", "Arithmetic"],
    source: cMain(`    int number, reversed;

    printf("Enter a three-digit positive integer: ");
    scanf("%d", &number);
    reversed = (number % 10) * 100 + ((number / 10) % 10) * 10 + number / 100;
    printf("Reversed number = %d\\n", reversed);
    return 0;`),
    sampleInput: "572",
    sampleOutput: "Reversed number = 275",
    method: "Extract each digit and rebuild the number with reversed place values."
  }),
  makeProgram({
    slug: "swap-without-temporary-variable",
    title: "Swap Two Numbers Without a Temporary Variable",
    topic,
    concepts: ["Arithmetic assignment", "Swap", "Variables"],
    source: cMain(`    long long first, second;

    printf("Enter two integers: ");
    scanf("%lld %lld", &first, &second);
    first = first + second;
    second = first - second;
    first = first - second;
    printf("After swapping: %lld %lld\\n", first, second);
    return 0;`),
    sampleInput: "10 25",
    sampleOutput: "After swapping: 25 10",
    method: "Store the combined value temporarily in one variable and recover both values by subtraction.",
    errors: ["Arithmetic swapping may overflow for very large integers.", "Do not change the order of the three assignments.", "Prefer a temporary variable in production code for clarity."]
  }),
  makeProgram({
    slug: "bitwise-operations",
    title: "Demonstrate Bitwise Operators",
    topic,
    difficulty: "Intermediate",
    concepts: ["Bitwise AND", "Bitwise OR", "XOR"],
    source: cMain(`    unsigned int first, second;

    printf("Enter two non-negative integers: ");
    scanf("%u %u", &first, &second);
    printf("AND = %u\\n", first & second);
    printf("OR = %u\\n", first | second);
    printf("XOR = %u\\n", first ^ second);
    printf("First shifted left = %u\\n", first << 1);
    printf("First shifted right = %u\\n", first >> 1);
    return 0;`),
    sampleInput: "12 10",
    sampleOutput: "AND = 8\nOR = 14\nXOR = 6\nFirst shifted left = 24\nFirst shifted right = 6",
    method: "Apply bitwise operators directly to the binary representations of two unsigned integers."
  })
];
