"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Basics & Input/Output";

module.exports = [
  makeProgram({
    slug: "print-personal-details",
    title: "Print Personal Details",
    topic,
    concepts: ["printf()", "Escape sequences", "Program structure"],
    source: cMain(`    printf("Name: Bhavya\\n");
    printf("Course: C Programming\\n");
    printf("Goal: Learn by practising\\n");
    return 0;`),
    sampleOutput: "Name: Bhavya\nCourse: C Programming\nGoal: Learn by practising",
    method: "Use separate printf() calls and newline escape sequences to format multiple lines of output."
  }),
  makeProgram({
    slug: "read-display-values",
    title: "Read and Display Different Data Types",
    topic,
    concepts: ["scanf()", "int", "float", "char"],
    source: cMain(`    int age;
    float percentage;
    char grade;

    printf("Enter age, percentage and grade: ");
    scanf("%d %f %c", &age, &percentage, &grade);
    printf("Age = %d\\nPercentage = %.2f\\nGrade = %c\\n", age, percentage, grade);
    return 0;`),
    sampleInput: "18 86.5 A",
    sampleOutput: "Age = 18\nPercentage = 86.50\nGrade = A",
    method: "Read values with matching format specifiers and print them using controlled formatting."
  }),
  makeProgram({
    slug: "ascii-value-character",
    title: "Find the ASCII Value of a Character",
    topic,
    concepts: ["char", "ASCII", "Type representation"],
    source: cMain(`    char character;

    printf("Enter a character: ");
    scanf(" %c", &character);
    printf("ASCII value of %c = %d\\n", character, character);
    return 0;`),
    sampleInput: "A",
    sampleOutput: "ASCII value of A = 65",
    method: "Print a character with the integer format specifier to reveal its numeric character code."
  }),
  makeProgram({
    slug: "size-of-data-types",
    title: "Display the Size of C Data Types",
    topic,
    concepts: ["sizeof", "Data types", "size_t"],
    source: cMain(`    printf("char: %zu byte(s)\\n", sizeof(char));
    printf("int: %zu byte(s)\\n", sizeof(int));
    printf("float: %zu byte(s)\\n", sizeof(float));
    printf("double: %zu byte(s)\\n", sizeof(double));
    return 0;`),
    sampleOutput: "Sizes are displayed for the current compiler.",
    method: "Use sizeof to obtain the number of bytes reserved for each data type on the current platform."
  }),
  makeProgram({
    slug: "celsius-to-fahrenheit",
    title: "Convert Celsius to Fahrenheit",
    topic,
    concepts: ["float", "Formula", "Conversion"],
    source: cMain(`    double celsius, fahrenheit;

    printf("Enter temperature in Celsius: ");
    scanf("%lf", &celsius);
    fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
    printf("Fahrenheit = %.2f\\n", fahrenheit);
    return 0;`),
    sampleInput: "25",
    sampleOutput: "Fahrenheit = 77.00",
    method: "Multiply the Celsius value by 9/5 and add 32."
  }),
  makeProgram({
    slug: "fahrenheit-to-celsius",
    title: "Convert Fahrenheit to Celsius",
    topic,
    concepts: ["double", "Formula", "Conversion"],
    source: cMain(`    double fahrenheit, celsius;

    printf("Enter temperature in Fahrenheit: ");
    scanf("%lf", &fahrenheit);
    celsius = (fahrenheit - 32.0) * 5.0 / 9.0;
    printf("Celsius = %.2f\\n", celsius);
    return 0;`),
    sampleInput: "98.6",
    sampleOutput: "Celsius = 37.00",
    method: "Subtract 32 from Fahrenheit and multiply the result by 5/9."
  }),
  makeProgram({
    slug: "circle-area-circumference",
    title: "Calculate Circle Area and Circumference",
    topic,
    concepts: ["Constants", "Floating-point arithmetic", "Geometry"],
    source: cMain(`    const double pi = 3.141592653589793;
    double radius;

    printf("Enter radius: ");
    scanf("%lf", &radius);
    printf("Area = %.2f\\n", pi * radius * radius);
    printf("Circumference = %.2f\\n", 2.0 * pi * radius);
    return 0;`),
    sampleInput: "5",
    sampleOutput: "Area = 78.54\nCircumference = 31.42",
    method: "Apply πr² for area and 2πr for circumference."
  }),
  makeProgram({
    slug: "rectangle-area-perimeter",
    title: "Calculate Rectangle Area and Perimeter",
    topic,
    concepts: ["Arithmetic", "Geometry", "Variables"],
    source: cMain(`    double length, width;

    printf("Enter length and width: ");
    scanf("%lf %lf", &length, &width);
    printf("Area = %.2f\\n", length * width);
    printf("Perimeter = %.2f\\n", 2.0 * (length + width));
    return 0;`),
    sampleInput: "8 5",
    sampleOutput: "Area = 40.00\nPerimeter = 26.00",
    method: "Multiply length and width for area, then double their sum for perimeter."
  }),
  makeProgram({
    slug: "simple-interest",
    title: "Calculate Simple Interest",
    topic,
    concepts: ["Formula", "Percentage", "double"],
    source: cMain(`    double principal, rate, time, interest;

    printf("Enter principal, annual rate and time: ");
    scanf("%lf %lf %lf", &principal, &rate, &time);
    interest = principal * rate * time / 100.0;
    printf("Simple interest = %.2f\\n", interest);
    printf("Total amount = %.2f\\n", principal + interest);
    return 0;`),
    sampleInput: "10000 6.5 2",
    sampleOutput: "Simple interest = 1300.00\nTotal amount = 11300.00",
    method: "Use P×R×T/100 and add the interest to the principal."
  }),
  makeProgram({
    slug: "compound-interest",
    title: "Calculate Compound Interest",
    topic,
    difficulty: "Intermediate",
    concepts: ["pow()", "Formula", "Compounding"],
    source: cMain(`    double principal, rate, time, amount;

    printf("Enter principal, annual rate and time: ");
    scanf("%lf %lf %lf", &principal, &rate, &time);
    amount = principal * pow(1.0 + rate / 100.0, time);
    printf("Compound interest = %.2f\\n", amount - principal);
    printf("Total amount = %.2f\\n", amount);
    return 0;`, ["stdio.h", "math.h"]),
    sampleInput: "10000 10 2",
    sampleOutput: "Compound interest = 2100.00\nTotal amount = 12100.00",
    method: "Compute P(1+R/100)^T using pow(), then subtract the principal."
  }),
  makeProgram({
    slug: "kilometres-to-miles",
    title: "Convert Kilometres to Miles",
    topic,
    concepts: ["Unit conversion", "double", "Constants"],
    source: cMain(`    double kilometres;

    printf("Enter distance in kilometres: ");
    scanf("%lf", &kilometres);
    printf("Miles = %.3f\\n", kilometres * 0.621371);
    return 0;`),
    sampleInput: "10",
    sampleOutput: "Miles = 6.214",
    method: "Multiply kilometres by the conversion factor 0.621371."
  }),
  makeProgram({
    slug: "days-to-years-weeks-days",
    title: "Convert Days into Years, Weeks and Days",
    topic,
    concepts: ["Integer division", "Remainder", "Unit conversion"],
    source: cMain(`    int totalDays, years, weeks, days;

    printf("Enter total days: ");
    scanf("%d", &totalDays);
    years = totalDays / 365;
    totalDays %= 365;
    weeks = totalDays / 7;
    days = totalDays % 7;
    printf("%d year(s), %d week(s), %d day(s)\\n", years, weeks, days);
    return 0;`),
    sampleInput: "800",
    sampleOutput: "2 year(s), 10 week(s), 0 day(s)",
    method: "Repeatedly use integer division and remainder from the largest unit to the smallest."
  })
];
