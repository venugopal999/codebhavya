"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Decision Making";

module.exports = [
  makeProgram({
    slug: "positive-negative-or-zero",
    title: "Check Whether a Number Is Positive, Negative or Zero",
    topic,
    concepts: ["if-else", "Comparison", "Three-way decision"],
    source: cMain(`    double number;

    printf("Enter a number: ");
    scanf("%lf", &number);
    if (number > 0)
        printf("Positive\\n");
    else if (number < 0)
        printf("Negative\\n");
    else
        printf("Zero\\n");
    return 0;`),
    sampleInput: "-8.5",
    sampleOutput: "Negative",
    method: "Compare the number with zero using an if–else-if chain."
  }),
  makeProgram({
    slug: "divisible-by-5-and-11",
    title: "Check Divisibility by 5 and 11",
    topic,
    concepts: ["Logical AND", "Modulus", "Divisibility"],
    source: cMain(`    int number;

    printf("Enter an integer: ");
    scanf("%d", &number);
    if (number % 5 == 0 && number % 11 == 0)
        printf("Divisible by both 5 and 11\\n");
    else
        printf("Not divisible by both 5 and 11\\n");
    return 0;`),
    sampleInput: "110",
    sampleOutput: "Divisible by both 5 and 11",
    method: "Both remainders must be zero, so combine the tests with logical AND."
  }),
  makeProgram({
    slug: "leap-year",
    title: "Check Whether a Year Is a Leap Year",
    topic,
    concepts: ["Nested conditions", "Logical operators", "Calendar"],
    source: cMain(`    int year;

    printf("Enter a year: ");
    scanf("%d", &year);
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        printf("%d is a leap year.\\n", year);
    else
        printf("%d is not a leap year.\\n", year);
    return 0;`),
    sampleInput: "2024",
    sampleOutput: "2024 is a leap year.",
    method: "A leap year is divisible by 400, or divisible by 4 but not by 100."
  }),
  makeProgram({
    slug: "vowel-or-consonant",
    title: "Check Whether a Character Is a Vowel or Consonant",
    topic,
    concepts: ["tolower()", "Character test", "Logical OR"],
    source: cMain(`    char character, lower;

    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    if (!isalpha((unsigned char) character)) {
        printf("The input is not an alphabet.\\n");
        return 0;
    }
    lower = (char) tolower((unsigned char) character);
    if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u')
        printf("Vowel\\n");
    else
        printf("Consonant\\n");
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "E",
    sampleOutput: "Vowel",
    method: "Normalize the letter to lowercase and compare it with the five vowels."
  }),
  makeProgram({
    slug: "alphabet-digit-or-special-character",
    title: "Identify an Alphabet, Digit or Special Character",
    topic,
    concepts: ["ctype.h", "isalpha()", "isdigit()"],
    source: cMain(`    char character;

    printf("Enter a character: ");
    scanf(" %c", &character);
    if (isalpha((unsigned char) character))
        printf("Alphabet\\n");
    else if (isdigit((unsigned char) character))
        printf("Digit\\n");
    else
        printf("Special character\\n");
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "#",
    sampleOutput: "Special character",
    method: "Use standard character-classification functions before treating the remaining input as special."
  }),
  makeProgram({
    slug: "uppercase-or-lowercase",
    title: "Check Uppercase or Lowercase Alphabet",
    topic,
    concepts: ["isupper()", "islower()", "Character classification"],
    source: cMain(`    char character;

    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    if (isupper((unsigned char) character))
        printf("Uppercase alphabet\\n");
    else if (islower((unsigned char) character))
        printf("Lowercase alphabet\\n");
    else
        printf("Not an alphabet\\n");
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "g",
    sampleOutput: "Lowercase alphabet",
    method: "Use isupper() and islower() rather than relying on manual ASCII ranges."
  }),
  makeProgram({
    slug: "maximum-of-two-numbers",
    title: "Find the Maximum of Two Numbers",
    topic,
    concepts: ["Conditional operator", "Comparison", "Maximum"],
    source: cMain(`    double first, second, maximum;

    printf("Enter two numbers: ");
    scanf("%lf %lf", &first, &second);
    maximum = first > second ? first : second;
    printf("Maximum = %.2f\\n", maximum);
    return 0;`),
    sampleInput: "14.5 9.2",
    sampleOutput: "Maximum = 14.50",
    method: "Use the conditional operator to select the larger value."
  }),
  makeProgram({
    slug: "smallest-of-three-numbers",
    title: "Find the Smallest of Three Numbers",
    topic,
    concepts: ["if statements", "Comparison", "Running minimum"],
    source: cMain(`    int first, second, third, smallest;

    printf("Enter three integers: ");
    scanf("%d %d %d", &first, &second, &third);
    smallest = first;
    if (second < smallest) smallest = second;
    if (third < smallest) smallest = third;
    printf("Smallest = %d\\n", smallest);
    return 0;`),
    sampleInput: "19 4 12",
    sampleOutput: "Smallest = 4",
    method: "Assume the first value is smallest and update the running minimum after each comparison."
  }),
  makeProgram({
    slug: "valid-triangle",
    title: "Check Whether Three Sides Form a Valid Triangle",
    topic,
    concepts: ["Triangle inequality", "Logical AND", "Validation"],
    source: cMain(`    double first, second, third;

    printf("Enter three side lengths: ");
    scanf("%lf %lf %lf", &first, &second, &third);
    if (first > 0 && second > 0 && third > 0 &&
        first + second > third && first + third > second && second + third > first)
        printf("Valid triangle\\n");
    else
        printf("Invalid triangle\\n");
    return 0;`),
    sampleInput: "5 6 7",
    sampleOutput: "Valid triangle",
    method: "Verify positive lengths and all three triangle inequalities."
  }),
  makeProgram({
    slug: "triangle-type-by-sides",
    title: "Classify a Triangle by Its Sides",
    topic,
    concepts: ["Nested decisions", "Equality", "Triangle types"],
    source: cMain(`    int first, second, third;

    printf("Enter three side lengths: ");
    scanf("%d %d %d", &first, &second, &third);
    if (first <= 0 || second <= 0 || third <= 0 ||
        first + second <= third || first + third <= second || second + third <= first)
        printf("Invalid triangle\\n");
    else if (first == second && second == third)
        printf("Equilateral triangle\\n");
    else if (first == second || second == third || first == third)
        printf("Isosceles triangle\\n");
    else
        printf("Scalene triangle\\n");
    return 0;`),
    sampleInput: "5 5 8",
    sampleOutput: "Isosceles triangle",
    method: "Validate the triangle first, then compare side equality patterns."
  }),
  makeProgram({
    slug: "quadratic-equation-roots",
    title: "Find the Roots of a Quadratic Equation",
    topic,
    difficulty: "Intermediate",
    concepts: ["Discriminant", "sqrt()", "Multiple branches"],
    source: cMain(`    double a, b, c, discriminant, firstRoot, secondRoot;

    printf("Enter coefficients a, b and c: ");
    scanf("%lf %lf %lf", &a, &b, &c);
    if (a == 0) {
        printf("The equation is not quadratic.\\n");
        return 0;
    }
    discriminant = b * b - 4.0 * a * c;
    if (discriminant > 0) {
        firstRoot = (-b + sqrt(discriminant)) / (2.0 * a);
        secondRoot = (-b - sqrt(discriminant)) / (2.0 * a);
        printf("Roots = %.2f and %.2f\\n", firstRoot, secondRoot);
    } else if (discriminant == 0) {
        printf("Repeated root = %.2f\\n", -b / (2.0 * a));
    } else {
        printf("Complex roots: %.2f + %.2fi and %.2f - %.2fi\\n",
               -b / (2.0 * a), sqrt(-discriminant) / (2.0 * a),
               -b / (2.0 * a), sqrt(-discriminant) / (2.0 * a));
    }
    return 0;`, ["stdio.h", "math.h"]),
    sampleInput: "1 -5 6",
    sampleOutput: "Roots = 3.00 and 2.00",
    method: "Use the discriminant b²−4ac to select two real, one repeated or two complex roots."
  }),
  makeProgram({
    slug: "student-grade-calculator",
    title: "Calculate a Student Grade",
    topic,
    concepts: ["Range checks", "else-if ladder", "Grades"],
    source: cMain(`    double marks;

    printf("Enter marks from 0 to 100: ");
    scanf("%lf", &marks);
    if (marks < 0 || marks > 100)
        printf("Invalid marks\\n");
    else if (marks >= 90)
        printf("Grade A\\n");
    else if (marks >= 80)
        printf("Grade B\\n");
    else if (marks >= 70)
        printf("Grade C\\n");
    else if (marks >= 60)
        printf("Grade D\\n");
    else
        printf("Grade F\\n");
    return 0;`),
    sampleInput: "86",
    sampleOutput: "Grade B",
    method: "Validate the range and test grade boundaries from highest to lowest."
  }),
  makeProgram({
    slug: "electricity-bill",
    title: "Calculate an Electricity Bill",
    topic,
    difficulty: "Intermediate",
    concepts: ["Slab calculation", "else-if", "Billing"],
    source: cMain(`    double units, bill;

    printf("Enter consumed units: ");
    scanf("%lf", &units);
    if (units < 0) {
        printf("Invalid units\\n");
        return 0;
    }
    if (units <= 100)
        bill = units * 1.50;
    else if (units <= 200)
        bill = 100 * 1.50 + (units - 100) * 2.50;
    else
        bill = 100 * 1.50 + 100 * 2.50 + (units - 200) * 4.00;
    printf("Bill amount = %.2f\\n", bill);
    return 0;`),
    sampleInput: "250",
    sampleOutput: "Bill amount = 600.00",
    method: "Accumulate the cost of each completed slab and charge only the remaining units at the current rate."
  })
];
