
const questions = [

    /* =========================
       EASY - 1
    ========================= */

    {
        question: "Which of the following is a natural number?",
        options: ["0", "-2", "5", "-7"],
        answer: 2,
        difficulty: "easy",
        solution:
            "Natural numbers are counting numbers starting from 1. Therefore, 5 is a natural number."
    },


    /* EASY - 2 */

    {
        question: "Which number is neither prime nor composite?",
        options: ["0", "1", "2", "3"],
        answer: 1,
        difficulty: "easy",
        solution:
            "The number 1 has only one positive factor, so it is neither prime nor composite."
    },


    /* EASY - 3 */

    {
        question: "Which number is divisible by 5?",
        options: ["123", "247", "350", "421"],
        answer: 2,
        difficulty: "easy",
        solution:
            "A number is divisible by 5 if its last digit is 0 or 5. 350 ends in 0."
    },


    /* EASY - 4 */

    {
        question: "Which of the following is a prime number?",
        options: ["9", "15", "17", "21"],
        answer: 2,
        difficulty: "easy",
        solution:
            "17 has exactly two factors: 1 and 17. Therefore, it is prime."
    },


    /* EASY - 5 */

    {
        question: "What is the HCF of 8 and 12?",
        options: ["2", "4", "6", "8"],
        answer: 1,
        difficulty: "easy",
        solution:
            "Factors of 8 are 1, 2, 4, 8. Factors of 12 are 1, 2, 3, 4, 6, 12. The greatest common factor is 4."
    },


    /* =========================
       MEDIUM - 6
    ========================= */

    {
        question: "Which number is divisible by 9?",
        options: ["235", "342", "451", "527"],
        answer: 1,
        difficulty: "medium",
        solution:
            "For 342, digit sum = 3 + 4 + 2 = 9. Since 9 is divisible by 9, 342 is divisible by 9."
    },


    /* MEDIUM - 7 */

    {
        question: "Find the LCM of 6 and 8.",
        options: ["12", "18", "24", "48"],
        answer: 2,
        difficulty: "medium",
        solution:
            "Multiples of 6: 6, 12, 18, 24. Multiples of 8: 8, 16, 24. Therefore LCM = 24."
    },


    /* MEDIUM - 8 */

    {
        question: "Find the HCF of 24 and 36.",
        options: ["6", "8", "12", "18"],
        answer: 2,
        difficulty: "medium",
        solution:
            "The common factors include 1, 2, 3, 4, 6 and 12. Therefore HCF = 12."
    },


    /* MEDIUM - 9 */

    {
        question: "Which number is divisible by both 2 and 3?",
        options: ["25", "36", "49", "55"],
        answer: 1,
        difficulty: "medium",
        solution:
            "A number divisible by both 2 and 3 is divisible by 6. 36 is divisible by 6."
    },


    /* MEDIUM - 10 */

    {
        question: "How many factors does 12 have?",
        options: ["4", "5", "6", "8"],
        answer: 2,
        difficulty: "medium",
        solution:
            "Factors of 12 are 1, 2, 3, 4, 6 and 12. Therefore, 12 has 6 factors."
    },


    /* MEDIUM - 11 */

    {
        question: "What is the LCM of 12 and 18?",
        options: ["24", "30", "36", "48"],
        answer: 2,
        difficulty: "medium",
        solution:
            "Multiples of 12 include 12, 24, 36. Multiples of 18 include 18, 36. Therefore LCM = 36."
    },


    /* MEDIUM - 12 */

    {
        question: "Which of these is an irrational number?",
        options: ["1/2", "3", "√2", "0.25"],
        answer: 2,
        difficulty: "medium",
        solution:
            "√2 cannot be expressed as p/q where p and q are integers and q is not zero. Therefore it is irrational."
    },


    /* MEDIUM - 13 */

    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        answer: 2,
        difficulty: "medium",
        solution:
            "2 is the smallest prime number and the only even prime number."
    },


    /* MEDIUM - 14 */

    {
        question: "If HCF of two numbers is 6 and their LCM is 72, what is their product?",
        options: ["78", "432", "720", "864"],
        answer: 1,
        difficulty: "medium",
        solution:
            "HCF × LCM = Product of the two numbers. Therefore 6 × 72 = 432."
    },


    /* MEDIUM - 15 */

    {
        question: "Which number is divisible by 10?",
        options: ["125", "230", "345", "457"],
        answer: 1,
        difficulty: "medium",
        solution:
            "A number is divisible by 10 when its last digit is 0. Therefore 230 is divisible by 10."
    },


    /* =========================
       HARD - 16
    ========================= */

    {
        question: "The HCF of two numbers is 12 and their LCM is 420. If one number is 60, find the other.",
        options: ["72", "84", "96", "108"],
        answer: 1,
        difficulty: "hard",
        solution:
            "Using HCF × LCM = Product of numbers: 12 × 420 = 60 × x. Therefore x = 5040 / 60 = 84."
    },


    /* HARD - 17 */

    {
        question: "What is the smallest number which is divisible by 12, 15 and 20?",
        options: ["30", "40", "60", "120"],
        answer: 2,
        difficulty: "hard",
        solution:
            "Prime factors: 12 = 2²×3, 15 = 3×5, 20 = 2²×5. LCM = 2²×3×5 = 60."
    },


    /* HARD - 18 */

    {
        question: "A number leaves remainder 3 when divided by 5. Which could be the number?",
        options: ["22", "25", "28", "30"],
        answer: 2,
        difficulty: "hard",
        solution:
            "28 ÷ 5 gives quotient 5 and remainder 3. Therefore 28 is the correct answer."
    },


    /* HARD - 19 */

    {
        question: "Find the greatest number that divides 43 and 91 leaving the same remainder.",
        options: ["12", "16", "24", "48"],
        answer: 2,
        difficulty: "hard",
        solution:
            "If the same remainder is left, the divisor must divide the difference. 91 - 43 = 48. The greatest suitable divisor is 48."
    },


    /* HARD - 20 */

    {
        question: "Find the least number which when divided by 8, 12 and 15 leaves remainder 5 in each case.",
        options: ["115", "120", "125", "135"],
        answer: 2,
        difficulty: "hard",
        solution:
            "LCM of 8, 12 and 15 = 120. Therefore the required number = 120 + 5 = 125."
    }

];


let currentQuestion = 0;

let score = 0;

let selectedAnswer = null;

let answered = false;



function loadQuestion() {

    const q = questions[currentQuestion];


    document.getElementById("questionNumber")
        .textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;


    const difficulty =
        document.getElementById("difficulty");


    if (q.difficulty === "easy") {

        difficulty.textContent = "🟢 Easy";

        difficulty.className =
            "difficulty easy";

    }
    else if (q.difficulty === "medium") {

        difficulty.textContent = "🟡 Medium";

        difficulty.className =
            "difficulty medium";

    }
    else {

        difficulty.textContent = "🔴 Hard";

        difficulty.className =
            "difficulty hard";

    }


    document.getElementById("questionText")
        .textContent = q.question;


    const optionsContainer =
        document.getElementById("options");


    optionsContainer.innerHTML = "";


    q.options.forEach(function(option, index) {

        const div =
            document.createElement("div");

        div.className = "option";

        div.textContent =
            String.fromCharCode(65 + index) +
            ". " +
            option;


        div.onclick = function() {

            selectOption(index, div);

        };


        optionsContainer.appendChild(div);

    });


    document.getElementById("feedback")
        .style.display = "none";


    document.getElementById("solution")
        .style.display = "none";


    document.getElementById("checkButton")
        .style.display = "inline-block";


    document.getElementById("nextButton")
        .style.display = "none";


    selectedAnswer = null;

    answered = false;


    const progress =
        ((currentQuestion + 1)
        / questions.length) * 100;


    document.getElementById("progressBar")
        .style.width = progress + "%";

}



function selectOption(index, element) {

    if (answered) {
        return;
    }


    selectedAnswer = index;


    const options =
        document.querySelectorAll(".option");


    options.forEach(function(option) {

        option.classList.remove("selected");

    });


    element.classList.add("selected");

}



function checkAnswer() {

    if (selectedAnswer === null) {

        alert("Please select an answer first.");

        return;

    }


    if (answered) {
        return;
    }


    answered = true;


    const q = questions[currentQuestion];


    const options =
        document.querySelectorAll(".option");


    options.forEach(function(option, index) {

        if (index === q.answer) {

            option.classList.add("correct");

        }

        if (
            index === selectedAnswer &&
            selectedAnswer !== q.answer
        ) {

            option.classList.add("wrong");

        }

    });


    const feedback =
        document.getElementById("feedback");


    if (selectedAnswer === q.answer) {

        score++;


        feedback.textContent =
            "✅ Correct! Excellent work.";


        feedback.className =
            "feedback correct-feedback";

    }
    else {

        feedback.textContent =
            "❌ Incorrect. Check the solution below.";

        feedback.className =
            "feedback wrong-feedback";

    }


    feedback.style.display = "block";


    const solution =
        document.getElementById("solution");


    solution.innerHTML =
        "<strong>💡 Detailed Solution</strong><br><br>" +
        q.solution;


    solution.style.display = "block";


    document.getElementById("checkButton")
        .style.display = "none";


    document.getElementById("nextButton")
        .style.display = "inline-block";

}



function nextQuestion() {

    currentQuestion++;


    if (currentQuestion >= questions.length) {

        showResult();

        return;

    }


    loadQuestion();

}



function showResult() {

    document.getElementById("quiz")
        .style.display = "none";


    document.getElementById("result")
        .style.display = "block";


    document.getElementById("score")
        .textContent =
        score + " / " + questions.length;


    let message;


    const percentage =
        (score / questions.length) * 100;


    if (percentage >= 90) {

        message =
            "🏆 Excellent! Your number-system skills are very strong.";

    }
    else if (percentage >= 70) {

        message =
            "👏 Very good! Keep practicing to reach the next level.";

    }
    else if (percentage >= 50) {

        message =
            "👍 Good start. Review the concepts and try again.";

    }
    else {

        message =
            "📚 Keep learning and practicing. You will improve.";

    }


    document.getElementById("resultMessage")
        .textContent = message;

}



function restartQuiz() {

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    answered = false;


    document.getElementById("quiz")
        .style.display = "block";


    document.getElementById("result")
        .style.display = "none";


    loadQuestion();

}



loadQuestion();
