(function () {
    "use strict";

    window.CodeBhavyaMathQuestions = [
        {
            question:
                "What is the average of 10, 20 and 30?",
            options: [
                "20",
                "15",
                "25",
                "30"
            ],
            answer: 0,
            difficulty: "easy",
            solution:
                "The sum is 60 and there are 3 values. Average = 60/3 = 20."
        },
        {
            question:
                "What is the average of the first five natural numbers 1, 2, 3, 4 and 5?",
            options: [
                "2",
                "3",
                "4",
                "5"
            ],
            answer: 1,
            difficulty: "easy",
            solution:
                "The sum is 15. Average = 15/5 = 3."
        },
        {
            question:
                "Find the average of 12, 18, 20 and 10.",
            options: [
                "12",
                "14",
                "15",
                "16"
            ],
            answer: 2,
            difficulty: "easy",
            solution:
                "Sum = 60. Average = 60/4 = 15."
        },
        {
            question:
                "The average of 8 numbers is 14. What is their total?",
            options: [
                "96",
                "104",
                "108",
                "112"
            ],
            answer: 3,
            difficulty: "easy",
            solution:
                "Total = average × count = 14 × 8 = 112."
        },
        {
            question:
                "Find the average of 6, 8, 10, 12 and 14.",
            options: [
                "10",
                "9",
                "11",
                "12"
            ],
            answer: 0,
            difficulty: "easy",
            solution:
                "These are equally spaced values, so the average is the middle value, 10."
        },
        {
            question:
                "Four numbers have an average of 15. Three of them are 12, 18 and 14. Find the fourth number.",
            options: [
                "14",
                "16",
                "18",
                "20"
            ],
            answer: 1,
            difficulty: "medium",
            solution:
                "Required total = 4 × 15 = 60. Known total = 44. Missing value = 60 − 44 = 16."
        },
        {
            question:
                "Five numbers average 24. When one more number is added, the average becomes 26. What number was added?",
            options: [
                "30",
                "32",
                "36",
                "40"
            ],
            answer: 2,
            difficulty: "medium",
            solution:
                "Old total = 5 × 24 = 120. New total = 6 × 26 = 156. Added number = 156 − 120 = 36."
        },
        {
            question:
                "Twenty students average 60 marks and thirty students average 70 marks. What is the combined average?",
            options: [
                "64",
                "65",
                "68",
                "66"
            ],
            answer: 3,
            difficulty: "medium",
            solution:
                "Combined average = (20 × 60 + 30 × 70)/50 = 3300/50 = 66."
        },
        {
            question:
                "A score of 80 has weight 2 and a score of 90 has weight 3. Find the weighted average.",
            options: [
                "86",
                "84",
                "85",
                "88"
            ],
            answer: 0,
            difficulty: "medium",
            solution:
                "Weighted average = (80 × 2 + 90 × 3)/(2 + 3) = 430/5 = 86."
        },
        {
            question:
                "The average of 10 values was calculated as 35 because 46 was entered instead of 64. What is the correct average?",
            options: [
                "35.8",
                "36.8",
                "37.8",
                "38.8"
            ],
            answer: 1,
            difficulty: "medium",
            solution:
                "Recorded total = 350. Correct total = 350 − 46 + 64 = 368. Correct average = 368/10 = 36.8."
        },
        {
            question:
                "The average age of 12 people is 20 years. One person aged 24 is replaced by a person aged 30. Find the new average.",
            options: [
                "20",
                "21",
                "20.5",
                "21.5"
            ],
            answer: 2,
            difficulty: "medium",
            solution:
                "The total rises by 6, so the average rises by 6/12 = 0.5. New average = 20.5."
        },
        {
            question:
                "What is the average of the consecutive odd numbers 11, 13, 15, 17 and 19?",
            options: [
                "13",
                "14",
                "16",
                "15"
            ],
            answer: 3,
            difficulty: "medium",
            solution:
                "For an equally spaced symmetric list, the average is the middle value, 15."
        },
        {
            question:
                "A team has 8 members. If one member's score increases by 16, by how much does the team average increase?",
            options: [
                "2",
                "4",
                "8",
                "16"
            ],
            answer: 0,
            difficulty: "medium",
            solution:
                "Change in average = change in total/count = 16/8 = 2."
        },
        {
            question:
                "The average of n numbers is 18. After adding 30, the average becomes 20. Find n.",
            options: [
                "4",
                "5",
                "6",
                "7"
            ],
            answer: 1,
            difficulty: "medium",
            solution:
                "18n + 30 = 20(n + 1). Therefore, 18n + 30 = 20n + 20, so n = 5."
        },
        {
            question:
                "A car travels equal distances at 60 km/h and 40 km/h. What is its average speed?",
            options: [
                "45 km/h",
                "50 km/h",
                "48 km/h",
                "52 km/h"
            ],
            answer: 2,
            difficulty: "medium",
            solution:
                "For equal distances, average speed = 2 × 60 × 40/(60 + 40) = 48 km/h."
        },
        {
            question:
                "A vehicle travels for equal amounts of time at 40 km/h and 60 km/h. What is its average speed?",
            options: [
                "48 km/h",
                "45 km/h",
                "55 km/h",
                "50 km/h"
            ],
            answer: 3,
            difficulty: "hard",
            solution:
                "For equal times, the ordinary mean applies: (40 + 60)/2 = 50 km/h."
        },
        {
            question:
                "The average mark of 30 students is 56. Eighteen boys average 60. What is the average mark of the 12 girls?",
            options: [
                "50",
                "48",
                "52",
                "54"
            ],
            answer: 0,
            difficulty: "hard",
            solution:
                "Class total = 30 × 56 = 1680. Boys' total = 18 × 60 = 1080. Girls' total = 600, so their average = 600/12 = 50."
        },
        {
            question:
                "Twenty kilograms of rice costing ₹30/kg is mixed with thirty kilograms costing ₹40/kg. Find the average cost per kilogram.",
            options: [
                "₹34",
                "₹36",
                "₹38",
                "₹35"
            ],
            answer: 1,
            difficulty: "hard",
            solution:
                "Weighted average = (20 × 30 + 30 × 40)/50 = 1800/50 = ₹36 per kg."
        },
        {
            question:
                "Every value in a dataset with average 45 is increased by 20%. What is the new average?",
            options: [
                "49",
                "50",
                "54",
                "55"
            ],
            answer: 2,
            difficulty: "hard",
            solution:
                "Scaling every value by 1.20 scales the average by 1.20. New average = 45 × 1.20 = 54."
        },
        {
            question:
                "Forty students average 68 marks. Five students who average 80 leave the group. What is the average of the remaining 35 students?",
            options: [
                "65.50",
                "66.00",
                "66.50",
                "66.29"
            ],
            answer: 3,
            difficulty: "hard",
            solution:
                "Original total = 40 × 68 = 2720. Removed total = 5 × 80 = 400. Remaining average = 2320/35 ≈ 66.29."
        }
    ];
}());
