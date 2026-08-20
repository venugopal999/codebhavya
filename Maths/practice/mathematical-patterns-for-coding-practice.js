(function () {
    "use strict";

    window.CodeBhavyaMathQuestions = [
        {
            question: "Find the next square number: 1, 4, 9, 16, ...",
            options: ["25", "20", "24", "32"],
            answer: 0,
            difficulty: "easy",
            solution: "The terms are 1², 2², 3² and 4². The next term is 5² = 25."
        },
        {
            question: "What is the common difference in 5, 9, 13, 17, ...?",
            options: ["3", "4", "5", "8"],
            answer: 1,
            difficulty: "easy",
            solution: "Subtract consecutive terms: 9 − 5 = 4, 13 − 9 = 4 and 17 − 13 = 4."
        },
        {
            question: "Find the next Fibonacci term: 0, 1, 1, 2, 3, ...",
            options: ["4", "6", "5", "8"],
            answer: 2,
            difficulty: "easy",
            solution: "A Fibonacci term is the sum of the previous two terms. Therefore, 2 + 3 = 5."
        },
        {
            question: "Find the next triangular number: 1, 3, 6, 10, ...",
            options: ["12", "13", "14", "15"],
            answer: 3,
            difficulty: "easy",
            solution: "The differences are 2, 3 and 4. Add the next difference 5 to obtain 10 + 5 = 15."
        },
        {
            question: "Find the next term in the geometric pattern 3, 6, 12, 24, ...",
            options: ["48", "36", "42", "54"],
            answer: 0,
            difficulty: "easy",
            solution: "Every term is multiplied by 2. Therefore, 24 × 2 = 48."
        },
        {
            question: "Find the next term: 4, 7, 12, 19, 28, ...",
            options: ["37", "39", "41", "43"],
            answer: 1,
            difficulty: "medium",
            solution: "The differences are 3, 5, 7 and 9. The next difference is 11, so 28 + 11 = 39."
        },
        {
            question: "The pattern is n(n + 1): 2, 6, 12, 20, 30, ... What is the next term?",
            options: ["36", "40", "42", "48"],
            answer: 2,
            difficulty: "medium",
            solution: "The sixth term is 6(6 + 1) = 6 × 7 = 42."
        },
        {
            question: "A loop performs 1 + 2 + ... + 10 operations. How many operations are performed?",
            options: ["45", "50", "60", "55"],
            answer: 3,
            difficulty: "medium",
            solution: "Use n(n + 1)/2. For n = 10, the total is 10 × 11 / 2 = 55."
        },
        {
            question: "The cycle [A, B, C] starts at index 0. Which value appears at index 14?",
            options: ["C", "A", "B", "The index is invalid"],
            answer: 0,
            difficulty: "medium",
            solution: "14 % 3 = 2. Index 2 in [A, B, C] contains C."
        },
        {
            question: "Which expression produces a checkerboard alternation for a matrix cell?",
            options: ["row × column", "(row + column) % 2", "row + column", "row % column"],
            answer: 1,
            difficulty: "medium",
            solution: "The parity of row + column alternates between adjacent cells, so (row + column) % 2 creates a checkerboard."
        },
        {
            question: "How many unordered pairs can be formed from 6 distinct items?",
            options: ["12", "18", "15", "30"],
            answer: 2,
            difficulty: "medium",
            solution: "The number of unordered pairs is n(n − 1)/2. For n = 6, it is 6 × 5 / 2 = 15."
        },
        {
            question: "An inner loop runs i times for i = 1 through 8. What is the total number of executions?",
            options: ["28", "32", "40", "36"],
            answer: 3,
            difficulty: "medium",
            solution: "The total is 1 + 2 + ... + 8 = 8 × 9 / 2 = 36."
        },
        {
            question: "What is the sum of the first 7 odd numbers?",
            options: ["49", "42", "56", "64"],
            answer: 0,
            difficulty: "medium",
            solution: "The first n odd numbers add to n². For n = 7, the sum is 7² = 49."
        },
        {
            question: "What is the sum of the entries in Pascal’s Triangle row 4 when the top is row 0?",
            options: ["8", "16", "20", "32"],
            answer: 1,
            difficulty: "medium",
            solution: "The sum of row n is 2ⁿ. Therefore, row 4 has sum 2⁴ = 16."
        },
        {
            question: "Given a₁ = 1 and aₙ = 2aₙ₋₁ + 1, what is a₅?",
            options: ["15", "25", "31", "63"],
            answer: 2,
            difficulty: "medium",
            solution: "The terms are 1, 3, 7, 15 and 31. Therefore, a₅ = 31."
        },
        {
            question: "Find the next term: 1, 2, 6, 24, 120, ...",
            options: ["240", "360", "600", "720"],
            answer: 3,
            difficulty: "hard",
            solution: "The terms are factorials: 1!, 2!, 3!, 4! and 5!. The next term is 6! = 720."
        },
        {
            question: "How many divisions by 2 change 64 to 1?",
            options: ["6", "5", "7", "8"],
            answer: 0,
            difficulty: "hard",
            solution: "64 → 32 → 16 → 8 → 4 → 2 → 1 requires 6 divisions. This matches log₂64 = 6."
        },
        {
            question: "Which invariant must a valid parentheses string satisfy while scanning from left to right?",
            options: ["The balance must always be positive", "Every prefix balance is non-negative and the final balance is zero", "Open and close counts must alternate", "The final balance alone must be zero"],
            answer: 1,
            difficulty: "hard",
            solution: "A closing parenthesis cannot appear without an unmatched opening parenthesis, so every prefix balance is non-negative. All openings must be closed, so the final balance is zero."
        },
        {
            question: "Which formula moves to the next circular-array index and wraps after the final position?",
            options: ["current + size", "current % size + 1", "(current + 1) % size", "(current − 1) % size"],
            answer: 2,
            difficulty: "hard",
            solution: "Adding 1 moves forward. Taking modulo size converts size back to 0, producing circular movement."
        },
        {
            question: "Find the next term: 1, 4, 13, 40, ...",
            options: ["80", "100", "120", "121"],
            answer: 3,
            difficulty: "hard",
            solution: "Each term is three times the previous term plus 1: 1×3+1=4, 4×3+1=13 and 13×3+1=40. Therefore, 40×3+1 = 121."
        }
    ];
}());
