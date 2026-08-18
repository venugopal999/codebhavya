const questions = [

    {
        question: "Which sentence is a proposition?",
        options: [
            "Please open the book.",
            "What time is it?",
            "11 is a prime number.",
            "x + 2 = 7, where x is unknown."
        ],
        answer: 2,
        difficulty: "easy",
        solution:
            "A proposition must have one definite truth value. ‘11 is a prime number’ is a true proposition. The other choices are a command, a question and an open sentence."
    },

    {
        question: "If P is true, what is the value of ¬P?",
        options: ["True", "False", "Both", "Undefined"],
        answer: 1,
        difficulty: "easy",
        solution:
            "NOT reverses the truth value. Therefore, when P is true, ¬P is false."
    },

    {
        question: "Evaluate P ∧ Q when P = T and Q = T.",
        options: ["T", "F", "Cannot be determined", "P only"],
        answer: 0,
        difficulty: "easy",
        solution:
            "AND is true only when both inputs are true. Hence, T ∧ T = T."
    },

    {
        question: "Evaluate P ∨ Q when P = F and Q = F.",
        options: ["T", "F", "Both", "Q only"],
        answer: 1,
        difficulty: "easy",
        solution:
            "OR requires at least one true input. Because both inputs are false, F ∨ F = F."
    },

    {
        question: "Evaluate P ⊕ Q when P = T and Q = T.",
        options: ["T", "F", "P", "Q"],
        answer: 1,
        difficulty: "easy",
        solution:
            "XOR is true only when exactly one input is true. Two true inputs produce false."
    },

    {
        question: "How many rows are required for a truth table with two variables?",
        options: ["2", "3", "4", "8"],
        answer: 2,
        difficulty: "easy",
        solution:
            "For n variables, the number of rows is 2ⁿ. With two variables, 2² = 4 rows."
    },

    {
        question: "For which values is P → Q false?",
        options: [
            "P = T and Q = T",
            "P = T and Q = F",
            "P = F and Q = T",
            "P = F and Q = F"
        ],
        answer: 1,
        difficulty: "medium",
        solution:
            "An implication is false only when its condition P occurs but its promised result Q does not occur: T → F = F."
    },

    {
        question: "When is P ↔ Q true?",
        options: [
            "Only when P is true",
            "Only when Q is false",
            "When P and Q have the same truth value",
            "When P and Q have different truth values"
        ],
        answer: 2,
        difficulty: "medium",
        solution:
            "The biconditional means ‘if and only if’. It is true when both inputs match: TT or FF."
    },

    {
        question: "Evaluate ¬P ∨ Q when P = T and Q = F.",
        options: ["T", "F", "P", "Undefined"],
        answer: 1,
        difficulty: "medium",
        solution:
            "¬P = F. Therefore, ¬P ∨ Q = F ∨ F = F."
    },

    {
        question: "Which operator is normally evaluated first when parentheses are absent?",
        options: ["OR", "Implication", "NOT", "Biconditional"],
        answer: 2,
        difficulty: "medium",
        solution:
            "The standard order begins with NOT, followed by AND, OR, implication and biconditional. Parentheses always take priority."
    },

    {
        question: "Which expression is equivalent to ¬(P ∧ Q)?",
        options: [
            "¬P ∧ ¬Q",
            "¬P ∨ ¬Q",
            "P ∨ Q",
            "P ∧ ¬Q"
        ],
        answer: 1,
        difficulty: "medium",
        solution:
            "By De Morgan’s law, negating an AND expression changes AND to OR and negates both inputs: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q."
    },

    {
        question: "How is P ∨ ¬P classified?",
        options: ["Contradiction", "Contingency", "Tautology", "Open sentence"],
        answer: 2,
        difficulty: "medium",
        solution:
            "P and ¬P always have opposite values, so at least one is always true. Therefore, P ∨ ¬P is a tautology."
    },

    {
        question: "How is P ∧ ¬P classified?",
        options: ["Tautology", "Contradiction", "Biconditional", "Implication"],
        answer: 1,
        difficulty: "medium",
        solution:
            "P and ¬P can never both be true. Therefore, P ∧ ¬P is always false and is a contradiction."
    },

    {
        question: "How many rows are required for three Boolean variables?",
        options: ["3", "6", "8", "9"],
        answer: 2,
        difficulty: "medium",
        solution:
            "Three variables have 2³ = 8 possible truth-value combinations."
    },

    {
        question: "Which condition correctly represents ‘age is at least 18 AND identity is verified’ in C-style syntax?",
        options: [
            "age >= 18 || verified",
            "age >= 18 && verified",
            "!(age >= 18)",
            "age >= 18 == verified"
        ],
        answer: 1,
        difficulty: "medium",
        solution:
            "Both requirements must hold, so the logical AND operator && is required: age >= 18 && verified."
    },

    {
        question: "Evaluate (P ∨ Q) ∧ ¬P when P = F and Q = T.",
        options: ["T", "F", "Q only", "Undefined"],
        answer: 0,
        difficulty: "hard",
        solution:
            "P ∨ Q = F ∨ T = T, and ¬P = T. Therefore, T ∧ T = T."
    },

    {
        question: "Which expression is logically equivalent to P → Q?",
        options: ["P ∧ Q", "¬P ∨ Q", "P ∨ ¬Q", "¬P ∧ Q"],
        answer: 1,
        difficulty: "hard",
        solution:
            "An implication can be rewritten as ¬P ∨ Q. Both expressions are false only when P = T and Q = F."
    },

    {
        question: "The expression (P → Q) ∧ (Q → P) is equivalent to which operator?",
        options: ["P ∧ Q", "P ∨ Q", "P ↔ Q", "P ⊕ Q"],
        answer: 2,
        difficulty: "hard",
        solution:
            "Both directions must hold, so P and Q must have matching truth values. This is exactly the biconditional P ↔ Q."
    },

    {
        question: "Evaluate ¬(P ∨ Q) when P = F and Q = F.",
        options: ["T", "F", "P", "Q"],
        answer: 0,
        difficulty: "hard",
        solution:
            "First, P ∨ Q = F ∨ F = F. Negating the result gives ¬F = T."
    },

    {
        question: "Evaluate (P ⊕ Q) ∧ R when P = T, Q = F and R = T.",
        options: ["T", "F", "P ⊕ Q only", "Cannot be evaluated"],
        answer: 0,
        difficulty: "hard",
        solution:
            "Exactly one of P and Q is true, so P ⊕ Q = T. Then T ∧ R = T ∧ T = T."
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
        difficulty.className = "difficulty easy";
    }
    else if (q.difficulty === "medium") {
        difficulty.textContent = "🟡 Medium";
        difficulty.className = "difficulty medium";
    }
    else {
        difficulty.textContent = "🔴 Hard";
        difficulty.className = "difficulty hard";
    }

    document.getElementById("questionText")
        .textContent = q.question;

    const optionsContainer =
        document.getElementById("options");

    optionsContainer.innerHTML = "";

    q.options.forEach(function (option, index) {

        const choice =
            document.createElement("div");

        choice.className = "option";
        choice.textContent =
            String.fromCharCode(65 + index) +
            ". " +
            option;

        choice.onclick = function () {
            selectOption(index, choice);
        };

        optionsContainer.appendChild(choice);

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
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar")
        .style.width = progress + "%";

}


function selectOption(index, element) {

    if (answered) {
        return;
    }

    selectedAnswer = index;

    document.querySelectorAll(".option")
        .forEach(function (option) {
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
    const options = document.querySelectorAll(".option");

    options.forEach(function (option, index) {

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

    const feedback = document.getElementById("feedback");

    if (selectedAnswer === q.answer) {
        score++;
        feedback.textContent = "✅ Correct! Excellent logical reasoning.";
        feedback.className = "feedback correct-feedback";
    }
    else {
        feedback.textContent = "❌ Incorrect. Check the explanation below.";
        feedback.className = "feedback wrong-feedback";
    }

    feedback.style.display = "block";

    const solution = document.getElementById("solution");

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
        .textContent = score + " / " + questions.length;

    const percentage =
        (score / questions.length) * 100;

    let message;

    if (percentage >= 90) {
        message = "🏆 Excellent! Your logic and truth-table skills are very strong.";
    }
    else if (percentage >= 70) {
        message = "👏 Very good! Review the difficult expressions and try for full marks.";
    }
    else if (percentage >= 50) {
        message = "👍 Good start. Revisit implication, equivalence and De Morgan’s laws.";
    }
    else {
        message = "📚 Keep practicing. Build small truth tables before evaluating each expression.";
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
