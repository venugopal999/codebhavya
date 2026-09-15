"use strict";

const { cMain, makeProgram } = require("./helpers");

module.exports = [
  makeProgram({
    slug: "switch-calculator",
    title: "Build a Calculator Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Arithmetic", "Menu selection"],
    source: cMain(`    double first, second, result;
    char operator;

    printf("Enter an expression (example: 18 + 6): ");
    scanf("%lf %c %lf", &first, &operator, &second);
    switch (operator) {
        case '+': result = first + second; break;
        case '-': result = first - second; break;
        case '*': result = first * second; break;
        case '/':
            if (second == 0) { printf("Division by zero is not allowed.\\n"); return 0; }
            result = first / second;
            break;
        default: printf("Invalid operator.\\n"); return 0;
    }
    printf("Result = %.2f\\n", result);
    return 0;`),
    sampleInput: "18 + 6",
    sampleOutput: "Result = 24.00",
    method: "Use the entered operator as the switch expression and execute the matching arithmetic case."
  }),
  makeProgram({
    slug: "switch-day-of-week",
    title: "Display a Weekday Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "case labels", "default"],
    source: cMain(`    int day;
    printf("Enter weekday number (1-7): ");
    scanf("%d", &day);
    switch (day) {
        case 1: puts("Monday"); break;
        case 2: puts("Tuesday"); break;
        case 3: puts("Wednesday"); break;
        case 4: puts("Thursday"); break;
        case 5: puts("Friday"); break;
        case 6: puts("Saturday"); break;
        case 7: puts("Sunday"); break;
        default: puts("Invalid weekday number.");
    }
    return 0;`),
    sampleInput: "4",
    sampleOutput: "Thursday",
    method: "Map each number from one through seven to a weekday case and handle other values with default."
  }),
  makeProgram({
    slug: "switch-month-days",
    title: "Find the Number of Days in a Month Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Grouped cases", "Leap year"],
    source: cMain(`    int month, year, days;
    printf("Enter month number and year: ");
    scanf("%d %d", &month, &year);
    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            days = 31; break;
        case 4: case 6: case 9: case 11:
            days = 30; break;
        case 2:
            days = (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? 29 : 28;
            break;
        default: puts("Invalid month number."); return 0;
    }
    printf("Days = %d\\n", days);
    return 0;`),
    sampleInput: "2 2028",
    sampleOutput: "Days = 29",
    method: "Group months with equal lengths in shared cases and calculate February from the leap-year rule."
  }),
  makeProgram({
    slug: "switch-vowel-check",
    title: "Check a Vowel Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Character cases", "tolower()"],
    source: cMain(`    char character;
    printf("Enter an alphabet: ");
    scanf(" %c", &character);
    switch (tolower((unsigned char) character)) {
        case 'a': case 'e': case 'i': case 'o': case 'u':
            puts("The character is a vowel.");
            break;
        default:
            puts("The character is not a vowel.");
    }
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "E",
    sampleOutput: "The character is a vowel.",
    method: "Normalize the letter to lowercase and group all five vowel cases."
  }),
  makeProgram({
    slug: "switch-grade-description",
    title: "Display a Grade Description Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Character input", "default"],
    source: cMain(`    char grade;
    printf("Enter grade (A-F): ");
    scanf(" %c", &grade);
    switch (toupper((unsigned char) grade)) {
        case 'A': puts("Excellent"); break;
        case 'B': puts("Very good"); break;
        case 'C': puts("Good"); break;
        case 'D': puts("Needs improvement"); break;
        case 'E': puts("Pass"); break;
        case 'F': puts("Fail"); break;
        default: puts("Invalid grade");
    }
    return 0;`, ["stdio.h", "ctype.h"]),
    sampleInput: "B",
    sampleOutput: "Very good",
    method: "Convert the grade to uppercase and select the matching description."
  }),
  makeProgram({
    slug: "switch-temperature-converter",
    title: "Create a Temperature Converter Menu Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Unit conversion", "Menu"],
    source: cMain(`    int choice;
    double value;
    printf("1. Celsius to Fahrenheit\\n2. Fahrenheit to Celsius\\nChoose: ");
    scanf("%d", &choice);
    printf("Enter temperature: ");
    scanf("%lf", &value);
    switch (choice) {
        case 1: printf("Fahrenheit = %.2f\\n", value * 9.0 / 5.0 + 32.0); break;
        case 2: printf("Celsius = %.2f\\n", (value - 32.0) * 5.0 / 9.0); break;
        default: puts("Invalid choice.");
    }
    return 0;`),
    sampleInput: "1\n25",
    sampleOutput: "Fahrenheit = 77.00",
    method: "Use the menu choice to select one of the two temperature-conversion formulas."
  }),
  makeProgram({
    slug: "switch-area-calculator",
    title: "Calculate Shape Area Using a switch Menu",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Geometry", "Menu"],
    source: cMain(`    int choice;
    double first, second;
    printf("1. Circle  2. Rectangle  3. Triangle\\nChoose: ");
    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Enter radius: "); scanf("%lf", &first);
            printf("Area = %.2f\\n", 3.141592653589793 * first * first); break;
        case 2:
            printf("Enter length and width: "); scanf("%lf %lf", &first, &second);
            printf("Area = %.2f\\n", first * second); break;
        case 3:
            printf("Enter base and height: "); scanf("%lf %lf", &first, &second);
            printf("Area = %.2f\\n", 0.5 * first * second); break;
        default: puts("Invalid choice.");
    }
    return 0;`),
    sampleInput: "2\n8 5",
    sampleOutput: "Area = 40.00",
    method: "Choose the shape first and then read only the measurements needed by that case."
  }),
  makeProgram({
    slug: "switch-digit-to-word",
    title: "Convert a Digit to a Word Using switch",
    topic: "Switch & Menu Programs",
    concepts: ["switch", "Integer cases", "Input validation"],
    source: cMain(`    int digit;
    printf("Enter a digit: ");
    scanf("%d", &digit);
    switch (digit) {
        case 0: puts("Zero"); break; case 1: puts("One"); break;
        case 2: puts("Two"); break; case 3: puts("Three"); break;
        case 4: puts("Four"); break; case 5: puts("Five"); break;
        case 6: puts("Six"); break; case 7: puts("Seven"); break;
        case 8: puts("Eight"); break; case 9: puts("Nine"); break;
        default: puts("Input is not a single digit.");
    }
    return 0;`),
    sampleInput: "7",
    sampleOutput: "Seven",
    method: "Associate each integer digit with its word and reject values outside zero through nine."
  }),
  makeProgram({
    slug: "switch-bank-menu",
    title: "Build a Simple Banking Menu Using switch",
    topic: "Switch & Menu Programs",
    difficulty: "Intermediate",
    concepts: ["switch", "Balance update", "Validation"],
    source: cMain(`    int choice;
    double balance = 1000.0, amount;
    printf("1. Deposit  2. Withdraw  3. Balance\\nChoose: ");
    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Enter amount: "); scanf("%lf", &amount);
            if (amount > 0) balance += amount;
            else { puts("Invalid amount."); return 0; }
            break;
        case 2:
            printf("Enter amount: "); scanf("%lf", &amount);
            if (amount > 0 && amount <= balance) balance -= amount;
            else { puts("Invalid amount or insufficient balance."); return 0; }
            break;
        case 3: break;
        default: puts("Invalid choice."); return 0;
    }
    printf("Balance = %.2f\\n", balance);
    return 0;`),
    sampleInput: "1\n250",
    sampleOutput: "Balance = 1250.00",
    method: "Select one banking operation, validate its amount and update the balance safely."
  }),
  makeProgram({
    slug: "nested-switch-shape-menu",
    title: "Use a Nested switch for Shape Calculations",
    topic: "Switch & Menu Programs",
    difficulty: "Intermediate",
    concepts: ["Nested switch", "Area", "Perimeter"],
    source: cMain(`    int shape, operation;
    double value;
    printf("Shape: 1. Square  2. Circle: ");
    scanf("%d", &shape);
    printf("Operation: 1. Area  2. Perimeter: ");
    scanf("%d", &operation);
    printf("Enter side or radius: ");
    scanf("%lf", &value);
    switch (shape) {
        case 1:
            switch (operation) {
                case 1: printf("Result = %.2f\\n", value * value); break;
                case 2: printf("Result = %.2f\\n", 4.0 * value); break;
                default: puts("Invalid operation.");
            }
            break;
        case 2:
            switch (operation) {
                case 1: printf("Result = %.2f\\n", 3.141592653589793 * value * value); break;
                case 2: printf("Result = %.2f\\n", 2.0 * 3.141592653589793 * value); break;
                default: puts("Invalid operation.");
            }
            break;
        default: puts("Invalid shape.");
    }
    return 0;`),
    sampleInput: "1\n2\n6",
    sampleOutput: "Result = 24.00",
    method: "The outer switch chooses a shape and the inner switch chooses the calculation."
  }),

  makeProgram({
    slug: "for-loop-even-numbers",
    title: "Print Even Numbers Using a for Loop",
    topic: "Control Flow & Loop Forms",
    concepts: ["for loop", "Increment", "Range"],
    source: cMain(`    int limit;
    printf("Enter limit: ");
    scanf("%d", &limit);
    for (int number = 2; number <= limit; number += 2) printf("%d ", number);
    putchar('\\n');
    return 0;`),
    sampleInput: "10",
    sampleOutput: "2 4 6 8 10",
    time: "O(n)",
    method: "Initialize at two and increase by two in each for-loop iteration."
  }),
  makeProgram({
    slug: "while-loop-countdown",
    title: "Create a Countdown Using a while Loop",
    topic: "Control Flow & Loop Forms",
    concepts: ["while loop", "Decrement", "Condition"],
    source: cMain(`    int number;
    printf("Enter starting number: ");
    scanf("%d", &number);
    while (number >= 1) {
        printf("%d ", number);
        number--;
    }
    puts("Go!");
    return 0;`),
    sampleInput: "5",
    sampleOutput: "5 4 3 2 1 Go!",
    time: "O(n)",
    method: "Test the condition before each iteration and reduce the counter until it reaches zero."
  }),
  makeProgram({
    slug: "do-while-digit-sum",
    title: "Find a Digit Sum Using a do-while Loop",
    topic: "Control Flow & Loop Forms",
    concepts: ["do-while", "Digits", "Guaranteed iteration"],
    source: cMain(`    int number, sum = 0;
    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    do {
        sum += number % 10;
        number /= 10;
    } while (number != 0);
    printf("Digit sum = %d\\n", sum);
    return 0;`),
    sampleInput: "4205",
    sampleOutput: "Digit sum = 11",
    time: "O(d)",
    method: "Execute the digit-processing body once before testing whether digits remain."
  }),
  makeProgram({
    slug: "break-first-divisor",
    title: "Find the First Divisor Using break",
    topic: "Control Flow & Loop Forms",
    concepts: ["break", "Loop termination", "Divisibility"],
    source: cMain(`    int number, divisor = 0;
    printf("Enter an integer greater than 1: ");
    scanf("%d", &number);
    for (int candidate = 2; candidate < number; candidate++) {
        if (number % candidate == 0) {
            divisor = candidate;
            break;
        }
    }
    if (divisor) printf("First divisor = %d\\n", divisor);
    else puts("The number is prime.");
    return 0;`),
    sampleInput: "91",
    sampleOutput: "First divisor = 7",
    time: "O(n)",
    method: "Stop the search immediately after the first proper divisor is found."
  }),
  makeProgram({
    slug: "continue-skip-multiples",
    title: "Skip Multiples of Three Using continue",
    topic: "Control Flow & Loop Forms",
    concepts: ["continue", "Filtering", "for loop"],
    source: cMain(`    int limit;
    printf("Enter limit: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++) {
        if (number % 3 == 0) continue;
        printf("%d ", number);
    }
    putchar('\\n');
    return 0;`),
    sampleInput: "10",
    sampleOutput: "1 2 4 5 7 8 10",
    time: "O(n)",
    method: "Use continue to skip printing whenever the current value is divisible by three."
  }),
  makeProgram({
    slug: "nested-loops-coordinate-pairs",
    title: "Print Coordinate Pairs Using Nested Loops",
    topic: "Control Flow & Loop Forms",
    concepts: ["Nested loops", "Pairs", "Iteration"],
    source: cMain(`    int rows, columns;
    printf("Enter rows and columns: ");
    scanf("%d %d", &rows, &columns);
    for (int row = 1; row <= rows; row++) {
        for (int column = 1; column <= columns; column++)
            printf("(%d,%d) ", row, column);
        putchar('\\n');
    }
    return 0;`),
    sampleInput: "2 3",
    sampleOutput: "(1,1) (1,2) (1,3)\n(2,1) (2,2) (2,3)",
    time: "O(rows × columns)",
    method: "For every row iteration, run the complete inner loop of column values."
  }),
  makeProgram({
    slug: "ternary-largest-two",
    title: "Find the Larger Number Using the Conditional Operator",
    topic: "Control Flow & Loop Forms",
    concepts: ["?: operator", "Expression", "Comparison"],
    source: cMain(`    int first, second;
    printf("Enter two integers: ");
    scanf("%d %d", &first, &second);
    int largest = first > second ? first : second;
    printf("Largest = %d\\n", largest);
    return 0;`),
    sampleInput: "27 41",
    sampleOutput: "Largest = 41",
    method: "Evaluate one condition and select either the first or second expression as the result."
  }),
  makeProgram({
    slug: "goto-positive-input",
    title: "Validate Positive Input Using goto",
    topic: "Control Flow & Loop Forms",
    difficulty: "Intermediate",
    concepts: ["goto", "Label", "Input validation"],
    source: cMain(`    int number;
read_again:
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    if (number <= 0) {
        puts("Invalid input. Try again.");
        goto read_again;
    }
    printf("Accepted = %d\\n", number);
    return 0;`),
    sampleInput: "-3\n8",
    sampleOutput: "Invalid input. Try again.\nAccepted = 8",
    method: "Jump back to the labelled input statement when validation fails; prefer a loop in normal production code."
  })
];
