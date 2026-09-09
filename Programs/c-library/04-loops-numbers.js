"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Loops & Number Problems";

module.exports = [
  makeProgram({
    slug: "print-one-to-n",
    title: "Print Numbers from 1 to N",
    topic,
    concepts: ["for loop", "Counter", "Sequence"],
    source: cMain(`    int limit;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++)
        printf("%d%c", number, number == limit ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5",
    sampleOutput: "1 2 3 4 5",
    time: "O(n)",
    method: "Increment a loop counter from 1 through N and print each value."
  }),
  makeProgram({
    slug: "print-n-to-one",
    title: "Print Numbers from N to 1",
    topic,
    concepts: ["for loop", "Decrement", "Reverse sequence"],
    source: cMain(`    int limit;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = limit; number >= 1; number--)
        printf("%d%c", number, number == 1 ? '\\n' : ' ');
    return 0;`),
    sampleInput: "5",
    sampleOutput: "5 4 3 2 1",
    time: "O(n)",
    method: "Initialize the counter at N and decrement it until 1."
  }),
  makeProgram({
    slug: "sum-natural-numbers-loop",
    title: "Find the Sum of the First N Natural Numbers",
    topic,
    concepts: ["Loop accumulation", "Natural numbers", "long long"],
    source: cMain(`    int limit;
    long long sum = 0;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 1; number <= limit; number++)
        sum += number;
    printf("Sum = %lld\\n", sum);
    return 0;`),
    sampleInput: "10",
    sampleOutput: "Sum = 55",
    time: "O(n)",
    method: "Accumulate each integer from 1 to N in a long long sum."
  }),
  makeProgram({
    slug: "sum-even-numbers-to-n",
    title: "Find the Sum of Even Numbers up to N",
    topic,
    concepts: ["Loop step", "Even numbers", "Accumulator"],
    source: cMain(`    int limit;
    long long sum = 0;

    printf("Enter N: ");
    scanf("%d", &limit);
    for (int number = 2; number <= limit; number += 2)
        sum += number;
    printf("Even sum = %lld\\n", sum);
    return 0;`),
    sampleInput: "10",
    sampleOutput: "Even sum = 30",
    time: "O(n)",
    method: "Visit only even values by increasing the counter by two."
  }),
  makeProgram({
    slug: "multiplication-table",
    title: "Print a Multiplication Table",
    topic,
    concepts: ["for loop", "Multiplication", "Formatted output"],
    source: cMain(`    int number, limit;

    printf("Enter number and table limit: ");
    scanf("%d %d", &number, &limit);
    for (int multiplier = 1; multiplier <= limit; multiplier++)
        printf("%d x %d = %d\\n", number, multiplier, number * multiplier);
    return 0;`),
    sampleInput: "7 5",
    sampleOutput: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35",
    time: "O(n)",
    method: "Multiply the selected number by each counter value from 1 to the requested limit."
  }),
  makeProgram({
    slug: "factorial-iterative",
    title: "Calculate Factorial Using a Loop",
    topic,
    concepts: ["Factorial", "for loop", "Accumulator"],
    source: cMain(`    int number;
    unsigned long long factorial = 1;

    printf("Enter a non-negative integer up to 20: ");
    scanf("%d", &number);
    if (number < 0 || number > 20) {
        printf("Input must be between 0 and 20.\\n");
        return 0;
    }
    for (int value = 2; value <= number; value++)
        factorial *= (unsigned long long) value;
    printf("%d! = %llu\\n", number, factorial);
    return 0;`),
    sampleInput: "6",
    sampleOutput: "6! = 720",
    time: "O(n)",
    method: "Multiply all integers from 2 through N while limiting N to avoid integer overflow."
  }),
  makeProgram({
    slug: "power-using-loop",
    title: "Calculate Integer Power Using a Loop",
    topic,
    concepts: ["Exponent", "Loop multiplication", "long long"],
    source: cMain(`    long long base, result = 1;
    int exponent;

    printf("Enter integer base and non-negative exponent: ");
    scanf("%lld %d", &base, &exponent);
    if (exponent < 0) {
        printf("Exponent must be non-negative.\\n");
        return 0;
    }
    for (int count = 0; count < exponent; count++)
        result *= base;
    printf("Result = %lld\\n", result);
    return 0;`),
    sampleInput: "3 5",
    sampleOutput: "Result = 243",
    time: "O(n)",
    method: "Multiply the result by the base once for every unit in the exponent."
  }),
  makeProgram({
    slug: "count-digits",
    title: "Count Digits in an Integer",
    topic,
    concepts: ["while loop", "Integer division", "Digits"],
    source: cMain(`    long long number, value;
    int count = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    do {
        count++;
        value /= 10;
    } while (value != 0);
    printf("Digit count = %d\\n", count);
    return 0;`),
    sampleInput: "-90872",
    sampleOutput: "Digit count = 5",
    time: "O(d)",
    method: "Repeatedly divide the absolute value by 10; a do-while correctly counts zero as one digit."
  }),
  makeProgram({
    slug: "sum-digits-loop",
    title: "Find the Sum of Digits Using a Loop",
    topic,
    concepts: ["while loop", "Modulus", "Digit sum"],
    source: cMain(`    long long number, value;
    int sum = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    while (value > 0) {
        sum += (int) (value % 10);
        value /= 10;
    }
    printf("Digit sum = %d\\n", sum);
    return 0;`),
    sampleInput: "5729",
    sampleOutput: "Digit sum = 23",
    time: "O(d)",
    method: "Add the last digit and remove it repeatedly until no digits remain."
  }),
  makeProgram({
    slug: "reverse-integer-loop",
    title: "Reverse an Integer Using a Loop",
    topic,
    concepts: ["while loop", "Digit extraction", "Reverse"],
    source: cMain(`    long long number, value, reversed = 0;

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    while (value > 0) {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    }
    if (number < 0) reversed = -reversed;
    printf("Reversed = %lld\\n", reversed);
    return 0;`),
    sampleInput: "-12045",
    sampleOutput: "Reversed = -54021",
    time: "O(d)",
    method: "Shift the reversed value left by one decimal place and append each extracted digit."
  }),
  makeProgram({
    slug: "palindrome-number",
    title: "Check Whether a Number Is a Palindrome",
    topic,
    concepts: ["Reverse number", "Comparison", "Palindrome"],
    source: cMain(`    long long number, value, reversed = 0;

    printf("Enter a non-negative integer: ");
    scanf("%lld", &number);
    if (number < 0) {
        printf("Negative numbers are not considered palindromes here.\\n");
        return 0;
    }
    value = number;
    do {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    } while (value > 0);
    printf(number == reversed ? "Palindrome\\n" : "Not a palindrome\\n");
    return 0;`),
    sampleInput: "12321",
    sampleOutput: "Palindrome",
    time: "O(d)",
    method: "Reverse all digits and compare the reconstructed number with the original."
  }),
  makeProgram({
    slug: "armstrong-number",
    title: "Check Whether a Number Is an Armstrong Number",
    topic,
    difficulty: "Intermediate",
    concepts: ["Digit count", "Power", "Armstrong number"],
    source: cMain(`    int number, value, digits = 0, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\\n");
        return 0;
    }
    value = number;
    do {
        digits++;
        value /= 10;
    } while (value > 0);
    value = number;
    do {
        int digit = value % 10;
        int power = 1;
        for (int count = 0; count < digits; count++) power *= digit;
        sum += power;
        value /= 10;
    } while (value > 0);
    printf(sum == number ? "Armstrong number\\n" : "Not an Armstrong number\\n");
    return 0;`),
    sampleInput: "153",
    sampleOutput: "Armstrong number",
    time: "O(d²)",
    method: "Count the digits, raise each digit to that count, add the powers and compare with the original."
  }),
  makeProgram({
    slug: "prime-number-check",
    title: "Check Whether a Number Is Prime",
    topic,
    concepts: ["Prime number", "Loop bound", "Divisibility"],
    source: cMain(`    int number, isPrime = 1;

    printf("Enter an integer: ");
    scanf("%d", &number);
    if (number < 2) isPrime = 0;
    for (int divisor = 2; divisor <= number / divisor && isPrime; divisor++) {
        if (number % divisor == 0) isPrime = 0;
    }
    printf(isPrime ? "Prime number\\n" : "Not a prime number\\n");
    return 0;`),
    sampleInput: "29",
    sampleOutput: "Prime number",
    time: "O(√n)",
    method: "Test divisors only through the square root because factors occur in pairs."
  }),
  makeProgram({
    slug: "prime-numbers-in-range",
    title: "Print Prime Numbers in a Range",
    topic,
    difficulty: "Intermediate",
    concepts: ["Nested loops", "Prime test", "Range"],
    source: cMain(`    int start, end;

    printf("Enter start and end: ");
    scanf("%d %d", &start, &end);
    if (start > end) {
        int temporary = start; start = end; end = temporary;
    }
    for (int number = start < 2 ? 2 : start; number <= end; number++) {
        int isPrime = 1;
        for (int divisor = 2; divisor <= number / divisor; divisor++) {
            if (number % divisor == 0) { isPrime = 0; break; }
        }
        if (isPrime) printf("%d ", number);
    }
    printf("\\n");
    return 0;`),
    sampleInput: "10 30",
    sampleOutput: "11 13 17 19 23 29",
    time: "O(n√n)",
    method: "Run a square-root prime test for every number inside the inclusive range."
  }),
  makeProgram({
    slug: "factors-of-number",
    title: "Print All Factors of a Number",
    topic,
    concepts: ["Factors", "Modulus", "Loop"],
    source: cMain(`    int number;

    printf("Enter a positive integer: ");
    scanf("%d", &number);
    if (number <= 0) {
        printf("Use a positive integer.\\n");
        return 0;
    }
    printf("Factors: ");
    for (int divisor = 1; divisor <= number; divisor++) {
        if (number % divisor == 0) printf("%d ", divisor);
    }
    printf("\\n");
    return 0;`),
    sampleInput: "24",
    sampleOutput: "Factors: 1 2 3 4 6 8 12 24",
    time: "O(n)",
    method: "Print each integer that divides the number with zero remainder."
  }),
  makeProgram({
    slug: "perfect-number",
    title: "Check Whether a Number Is Perfect",
    topic,
    concepts: ["Proper divisors", "Accumulator", "Perfect number"],
    source: cMain(`    int number, sum = 0;

    printf("Enter a positive integer: ");
    scanf("%d", &number);
    for (int divisor = 1; divisor <= number / 2; divisor++) {
        if (number % divisor == 0) sum += divisor;
    }
    printf(number > 0 && sum == number ? "Perfect number\\n" : "Not a perfect number\\n");
    return 0;`),
    sampleInput: "28",
    sampleOutput: "Perfect number",
    time: "O(n)",
    method: "Add every proper divisor and compare the sum with the original number."
  }),
  makeProgram({
    slug: "strong-number",
    title: "Check Whether a Number Is Strong",
    topic,
    difficulty: "Intermediate",
    concepts: ["Digit factorial", "Nested loop", "Strong number"],
    source: cMain(`    int number, value, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\\n");
        return 0;
    }
    value = number;
    do {
        int digit = value % 10;
        int factorial = 1;
        for (int item = 2; item <= digit; item++) factorial *= item;
        sum += factorial;
        value /= 10;
    } while (value > 0);
    printf(sum == number ? "Strong number\\n" : "Not a strong number\\n");
    return 0;`),
    sampleInput: "145",
    sampleOutput: "Strong number",
    time: "O(d)",
    method: "Add the factorial of every digit and compare the sum with the original number."
  }),
  makeProgram({
    slug: "automorphic-number",
    title: "Check Whether a Number Is Automorphic",
    topic,
    concepts: ["Square", "Place value", "Automorphic number"],
    source: cMain(`    long long number, square, divisor = 10;

    printf("Enter a non-negative integer: ");
    scanf("%lld", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\\n");
        return 0;
    }
    square = number * number;
    for (long long value = number; value >= 10; value /= 10) divisor *= 10;
    printf(square % divisor == number ? "Automorphic number\\n" : "Not an automorphic number\\n");
    return 0;`),
    sampleInput: "25",
    sampleOutput: "Automorphic number",
    time: "O(d)",
    method: "Square the number and compare its last d digits with the original d-digit number."
  }),
  makeProgram({
    slug: "neon-number",
    title: "Check Whether a Number Is Neon",
    topic,
    concepts: ["Square", "Digit sum", "Neon number"],
    source: cMain(`    int number, square, sum = 0;

    printf("Enter a non-negative integer: ");
    scanf("%d", &number);
    if (number < 0) {
        printf("Use a non-negative integer.\\n");
        return 0;
    }
    square = number * number;
    do {
        sum += square % 10;
        square /= 10;
    } while (square > 0);
    printf(sum == number ? "Neon number\\n" : "Not a neon number\\n");
    return 0;`),
    sampleInput: "9",
    sampleOutput: "Neon number",
    time: "O(d)",
    method: "Square the number, sum the square's digits and compare that sum with the original."
  }),
  makeProgram({
    slug: "fibonacci-series",
    title: "Print the Fibonacci Series",
    topic,
    concepts: ["Sequence", "Loop", "State update"],
    source: cMain(`    int terms;
    unsigned long long first = 0, second = 1;

    printf("Enter number of terms: ");
    scanf("%d", &terms);
    if (terms < 1 || terms > 94) {
        printf("Use a term count from 1 to 94.\\n");
        return 0;
    }
    for (int index = 0; index < terms; index++) {
        printf("%llu%c", first, index == terms - 1 ? '\\n' : ' ');
        unsigned long long next = first + second;
        first = second;
        second = next;
    }
    return 0;`),
    sampleInput: "8",
    sampleOutput: "0 1 1 2 3 5 8 13",
    time: "O(n)",
    method: "Print the current term, then shift the pair forward using their sum."
  }),
  makeProgram({
    slug: "gcd-iterative",
    title: "Find GCD Using Euclid's Loop",
    topic,
    difficulty: "Intermediate",
    concepts: ["Euclid's algorithm", "while loop", "Modulus"],
    source: cMain(`    int first, second;

    printf("Enter two positive integers: ");
    scanf("%d %d", &first, &second);
    if (first < 0) first = -first;
    if (second < 0) second = -second;
    while (second != 0) {
        int remainder = first % second;
        first = second;
        second = remainder;
    }
    printf("GCD = %d\\n", first);
    return 0;`),
    sampleInput: "84 30",
    sampleOutput: "GCD = 6",
    time: "O(log min(a,b))",
    method: "Replace the pair with divisor and remainder until the remainder becomes zero."
  }),
  makeProgram({
    slug: "lcm-of-two-numbers",
    title: "Find the LCM of Two Numbers",
    topic,
    difficulty: "Intermediate",
    concepts: ["GCD", "LCM", "Euclid's algorithm"],
    source: cMain(`    long long first, second, a, b;

    printf("Enter two positive integers: ");
    scanf("%lld %lld", &first, &second);
    if (first == 0 || second == 0) {
        printf("LCM = 0\\n");
        return 0;
    }
    a = first < 0 ? -first : first;
    b = second < 0 ? -second : second;
    while (b != 0) {
        long long remainder = a % b;
        a = b;
        b = remainder;
    }
    printf("LCM = %lld\\n", (first < 0 ? -first : first) / a * (second < 0 ? -second : second));
    return 0;`),
    sampleInput: "12 18",
    sampleOutput: "LCM = 36",
    time: "O(log min(a,b))",
    method: "Find the GCD with Euclid's algorithm and apply LCM(a,b)=|a|/GCD×|b|."
  }),
  makeProgram({
    slug: "decimal-to-binary",
    title: "Convert Decimal to Binary",
    topic,
    concepts: ["Base conversion", "Remainders", "Array"],
    source: cMain(`    unsigned int number, value;
    int bits[32], count = 0;

    printf("Enter a non-negative decimal integer: ");
    scanf("%u", &number);
    value = number;
    do {
        bits[count++] = (int) (value % 2);
        value /= 2;
    } while (value > 0);
    printf("Binary = ");
    for (int index = count - 1; index >= 0; index--) printf("%d", bits[index]);
    printf("\\n");
    return 0;`),
    sampleInput: "45",
    sampleOutput: "Binary = 101101",
    time: "O(log n)",
    space: "O(log n)",
    method: "Collect remainders from repeated division by two and print them in reverse order."
  }),
  makeProgram({
    slug: "binary-to-decimal",
    title: "Convert Binary to Decimal",
    topic,
    concepts: ["Base conversion", "Place value", "Validation"],
    source: cMain(`    char binary[65];
    unsigned long long decimal = 0;

    printf("Enter a binary number up to 64 bits: ");
    scanf("%64s", binary);
    for (int index = 0; binary[index] != '\\0'; index++) {
        if (binary[index] != '0' && binary[index] != '1') {
            printf("Invalid binary number.\\n");
            return 0;
        }
        decimal = decimal * 2 + (unsigned long long) (binary[index] - '0');
    }
    printf("Decimal = %llu\\n", decimal);
    return 0;`),
    sampleInput: "101101",
    sampleOutput: "Decimal = 45",
    time: "O(d)",
    method: "Scan left to right, doubling the accumulated value before adding each bit."
  }),
  makeProgram({
    slug: "digit-frequency-number",
    title: "Count the Frequency of Every Digit",
    topic,
    difficulty: "Intermediate",
    concepts: ["Frequency array", "Digits", "Counting"],
    source: cMain(`    long long number, value;
    int frequency[10] = {0};

    printf("Enter an integer: ");
    scanf("%lld", &number);
    value = number < 0 ? -number : number;
    do {
        frequency[value % 10]++;
        value /= 10;
    } while (value > 0);
    for (int digit = 0; digit <= 9; digit++) {
        if (frequency[digit] > 0)
            printf("%d occurs %d time(s)\\n", digit, frequency[digit]);
    }
    return 0;`),
    sampleInput: "1202205",
    sampleOutput: "0 occurs 2 time(s)\n1 occurs 1 time(s)\n2 occurs 3 time(s)\n5 occurs 1 time(s)",
    time: "O(d)",
    space: "O(1)",
    method: "Use the extracted digit as an index into a fixed ten-element frequency array."
  })
];
