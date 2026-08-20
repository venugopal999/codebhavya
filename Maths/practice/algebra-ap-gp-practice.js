(function () {
    "use strict";

    window.CodeBhavyaMathQuestions = [
        {
            question: "Solve x + 5 = 12.",
            options: ["7", "5", "12", "17"],
            answer: 0,
            difficulty: "easy",
            solution: "Subtract 5 from both sides: x = 12 − 5 = 7."
        },
        {
            question: "What is the coefficient of x in 4x + 3?",
            options: ["3", "4", "x", "7"],
            answer: 1,
            difficulty: "easy",
            solution: "The coefficient is the number multiplying the variable. In 4x, that number is 4."
        },
        {
            question: "What is the common difference in the AP 3, 7, 11, 15, ...?",
            options: ["3", "7", "4", "11"],
            answer: 2,
            difficulty: "easy",
            solution: "Subtract consecutive terms: 7 − 3 = 4 and 11 − 7 = 4."
        },
        {
            question: "What is the common ratio in the GP 2, 6, 18, 54, ...?",
            options: ["2", "4", "6", "3"],
            answer: 3,
            difficulty: "easy",
            solution: "Divide a term by the previous term: 6 ÷ 2 = 3 and 18 ÷ 6 = 3."
        },
        {
            question: "Find the sixth term of the AP with first term 5 and common difference 3.",
            options: ["20", "18", "23", "15"],
            answer: 0,
            difficulty: "easy",
            solution: "a₆ = a + (6 − 1)d = 5 + 5(3) = 20."
        },
        {
            question: "Find the sum of the first 10 terms of the AP 2, 5, 8, ...",
            options: ["145", "155", "165", "175"],
            answer: 1,
            difficulty: "medium",
            solution: "Here a = 2, d = 3 and n = 10. S₁₀ = 10/2[4 + 9(3)] = 5(31) = 155."
        },
        {
            question: "Find the fifth term of the GP whose first term is 3 and common ratio is 2.",
            options: ["24", "32", "48", "96"],
            answer: 2,
            difficulty: "medium",
            solution: "a₅ = ar⁴ = 3 × 2⁴ = 3 × 16 = 48."
        },
        {
            question: "Find the sum 2 + 6 + 18 + 54.",
            options: ["72", "78", "82", "80"],
            answer: 3,
            difficulty: "medium",
            solution: "This GP has a = 2, r = 3 and n = 4. S₄ = 2(3⁴ − 1)/(3 − 1) = 80."
        },
        {
            question: "Solve 3x − 7 = 11.",
            options: ["6", "4", "8", "12"],
            answer: 0,
            difficulty: "medium",
            solution: "Add 7 to obtain 3x = 18, then divide by 3. Therefore, x = 6."
        },
        {
            question: "Solve the inequality 2x + 3 < 11.",
            options: ["x > 4", "x < 4", "x < 7", "x > 7"],
            answer: 1,
            difficulty: "medium",
            solution: "Subtract 3: 2x < 8. Divide by positive 2, so the sign does not reverse: x < 4."
        },
        {
            question: "If x + y = 10 and x − y = 2, what is x?",
            options: ["4", "5", "6", "8"],
            answer: 2,
            difficulty: "medium",
            solution: "Add the equations: 2x = 12, so x = 6. Substitution gives y = 4."
        },
        {
            question: "Evaluate 2³ × 2⁴.",
            options: ["16", "32", "64", "128"],
            answer: 3,
            difficulty: "medium",
            solution: "For equal bases, add exponents: 2³ × 2⁴ = 2⁷ = 128."
        },
        {
            question: "Which term of the AP 7, 12, 17, ... is 52?",
            options: ["10th", "9th", "11th", "12th"],
            answer: 0,
            difficulty: "medium",
            solution: "52 = 7 + (n − 1)5. Thus 45 = 5(n − 1), n − 1 = 9 and n = 10."
        },
        {
            question: "Find the next term in the GP 5, 10, 20, 40, ...",
            options: ["60", "80", "100", "120"],
            answer: 1,
            difficulty: "medium",
            solution: "Every term is multiplied by 2, so the next term is 40 × 2 = 80."
        },
        {
            question: "If positions start at k = 1, which formula produces the kth positive even number?",
            options: ["k + 2", "k²", "2k", "2k + 1"],
            answer: 2,
            difficulty: "medium",
            solution: "The positive even numbers are 2, 4, 6, ... At position k, the value is 2k."
        },
        {
            question: "A sequence satisfies a₁ = 2 and aₙ = 3aₙ₋₁ − 2. What is a₄?",
            options: ["16", "20", "26", "28"],
            answer: 3,
            difficulty: "hard",
            solution: "The terms are a₁=2, a₂=4, a₃=10 and a₄=28."
        },
        {
            question: "A nested loop executes 1 + 2 + ... + 20 operations. How many operations occur?",
            options: ["210", "200", "220", "400"],
            answer: 0,
            difficulty: "hard",
            solution: "Use n(n + 1)/2: 20 × 21 / 2 = 210 operations."
        },
        {
            question: "An algorithm repeatedly halves a problem of size n. Which expression describes the number of halvings to reach 1 when n is a power of 2?",
            options: ["n/2", "log₂n", "2ⁿ", "n²"],
            answer: 1,
            difficulty: "hard",
            solution: "After k halvings, n/2ᵏ = 1, so 2ᵏ = n and k = log₂n."
        },
        {
            question: "Solve x + y = 9 and 2x − y = 3.",
            options: ["x=3, y=6", "x=5, y=4", "x=4, y=5", "x=6, y=3"],
            answer: 2,
            difficulty: "hard",
            solution: "Add the equations: 3x = 12, so x = 4. Then y = 9 − 4 = 5."
        },
        {
            question: "Find the sum of the GP 3 + 6 + 12 + ... + 192.",
            options: ["189", "255", "384", "381"],
            answer: 3,
            difficulty: "hard",
            solution: "Since 192 = 3 × 2⁶, there are 7 terms. S₇ = 3(2⁷ − 1)/(2 − 1) = 3 × 127 = 381."
        }
    ];
}());
