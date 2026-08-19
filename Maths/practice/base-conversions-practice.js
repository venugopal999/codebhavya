(function () {
    "use strict";

    window.CodeBhavyaMathQuestions = [
        {
            question: "Which digits are valid in the binary number system?",
            options: ["0 and 1", "0 to 7", "0 to 9", "0 to 9 and A to F"],
            answer: 0,
            difficulty: "easy",
            solution: "Binary has base 2, so it uses exactly two digits: 0 and 1."
        },
        {
            question: "What is (13)₁₀ in binary?",
            options: ["1011", "1100", "1101", "1110"],
            answer: 2,
            difficulty: "easy",
            solution: "13 = 8 + 4 + 1 = 2³ + 2² + 2⁰. Therefore the binary digits are 1101."
        },
        {
            question: "What is (1010)₂ in decimal?",
            options: ["8", "10", "12", "14"],
            answer: 1,
            difficulty: "easy",
            solution: "(1010)₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 2 = 10."
        },
        {
            question: "Which digit is not valid in an octal number?",
            options: ["5", "7", "8", "0"],
            answer: 2,
            difficulty: "easy",
            solution: "Octal has base 8 and uses only the digits 0 through 7. Therefore 8 is invalid."
        },
        {
            question: "What decimal value does the hexadecimal digit A represent?",
            options: ["9", "10", "11", "16"],
            answer: 1,
            difficulty: "easy",
            solution: "Hexadecimal continues after 9 with A, B, C, D, E and F. Therefore A represents decimal 10."
        },
        {
            question: "Convert (45)₁₀ to binary.",
            options: ["101101", "101011", "110101", "111001"],
            answer: 0,
            difficulty: "medium",
            solution: "45 = 32 + 8 + 4 + 1. Marking the 32, 16, 8, 4, 2 and 1 positions gives 101101."
        },
        {
            question: "Convert (111001)₂ to decimal.",
            options: ["49", "53", "57", "61"],
            answer: 2,
            difficulty: "medium",
            solution: "(111001)₂ = 32 + 16 + 8 + 1 = 57."
        },
        {
            question: "Convert (73)₈ to decimal.",
            options: ["51", "56", "59", "63"],
            answer: 2,
            difficulty: "medium",
            solution: "(73)₈ = 7×8¹ + 3×8⁰ = 56 + 3 = 59."
        },
        {
            question: "Convert (2F)₁₆ to decimal.",
            options: ["45", "46", "47", "48"],
            answer: 2,
            difficulty: "medium",
            solution: "F represents 15. Therefore (2F)₁₆ = 2×16 + 15 = 47."
        },
        {
            question: "Convert (11010110)₂ to hexadecimal.",
            options: ["C6", "D5", "D6", "E6"],
            answer: 2,
            difficulty: "medium",
            solution: "Group the bits as 1101 0110. The groups represent D and 6, so the result is (D6)₁₆."
        },
        {
            question: "Convert (642)₈ to binary.",
            options: ["110100010", "110010100", "101100010", "110101000"],
            answer: 0,
            difficulty: "medium",
            solution: "Replace each octal digit with three bits: 6 = 110, 4 = 100 and 2 = 010. Joining them gives 110100010."
        },
        {
            question: "Which binary value is equal to (3A7)₁₆?",
            options: ["001110100111", "001101101111", "001110101101", "001111100111"],
            answer: 0,
            difficulty: "medium",
            solution: "Convert each hexadecimal digit to four bits: 3 = 0011, A = 1010 and 7 = 0111. The result is 001110100111."
        },
        {
            question: "Convert (156)₁₀ to hexadecimal.",
            options: ["8C", "9B", "9C", "AC"],
            answer: 2,
            difficulty: "medium",
            solution: "156 ÷ 16 gives quotient 9 and remainder 12. Remainder 12 is C, so the result is (9C)₁₆."
        },
        {
            question: "Convert (0.101)₂ to decimal.",
            options: ["0.5", "0.625", "0.75", "0.875"],
            answer: 1,
            difficulty: "medium",
            solution: "(0.101)₂ = 1×2⁻¹ + 0×2⁻² + 1×2⁻³ = 0.5 + 0.125 = 0.625."
        },
        {
            question: "Convert (0.375)₁₀ to binary.",
            options: ["0.001", "0.010", "0.011", "0.101"],
            answer: 2,
            difficulty: "medium",
            solution: "0.375×2 gives digit 0, 0.75×2 gives digit 1 and 0.5×2 gives digit 1. Therefore the result is (0.011)₂."
        },
        {
            question: "Convert (725)₈ to hexadecimal.",
            options: ["1C5", "1D5", "1E5", "2D5"],
            answer: 1,
            difficulty: "hard",
            solution: "Octal 725 becomes binary 111010101. Regrouping as 0001 1101 0101 gives hexadecimal 1D5."
        },
        {
            question: "Convert (7B)₁₆ to octal.",
            options: ["163", "171", "173", "175"],
            answer: 2,
            difficulty: "hard",
            solution: "(7B)₁₆ = 7×16 + 11 = 123 decimal. Dividing 123 by 8 gives octal 173."
        },
        {
            question: "Convert (101101.011)₂ to decimal.",
            options: ["45.125", "45.25", "45.375", "45.625"],
            answer: 2,
            difficulty: "hard",
            solution: "The integer part 101101₂ is 45. The fraction .011₂ is 1/4 + 1/8 = 0.375. Total = 45.375."
        },
        {
            question: "Which pair correctly represents decimal 255?",
            options: ["11111111₂ and FF₁₆", "11111110₂ and FE₁₆", "11111111₂ and F0₁₆", "11110111₂ and FF₁₆"],
            answer: 0,
            difficulty: "hard",
            solution: "255 = 128+64+32+16+8+4+2+1, so its binary form is 11111111. Grouping as 1111 1111 gives FF in hexadecimal."
        },
        {
            question: "A memory address ends with hexadecimal 2A. What is 2A in decimal and binary?",
            options: ["40 and 00101000", "41 and 00101001", "42 and 00101010", "44 and 00101100"],
            answer: 2,
            difficulty: "hard",
            solution: "(2A)₁₆ = 2×16 + 10 = 42. Converting the digits separately gives 2 = 0010 and A = 1010, so the binary form is 00101010."
        }
    ];
}());
