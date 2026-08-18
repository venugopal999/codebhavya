const questions = [

    {
        question: "Which description best defines a set?",
        options: [
            "An unordered collection of distinct, well-defined objects",
            "A list that must contain repeated objects",
            "A collection that must always be numerical",
            "An ordered sequence with a fixed first element"
        ],
        answer: 0,
        difficulty: "easy",
        solution: "A set is a well-defined collection of distinct objects. Order and repetition do not change a set."
    },

    {
        question: "What is the cardinality of A = {2, 4, 4, 6, 6, 6}?",
        options: ["3", "4", "5", "6"],
        answer: 0,
        difficulty: "easy",
        solution: "Repeated elements are written only once in a set. A = {2, 4, 6}, so n(A) = 3."
    },

    {
        question: "If V = {a, e, i, o, u}, which statement is true?",
        options: ["b ∈ V", "e ∈ V", "u ∉ V", "a ∉ V"],
        answer: 1,
        difficulty: "easy",
        solution: "The symbol ∈ means ‘is an element of’. Because e is listed in V, e ∈ V is true."
    },

    {
        question: "Which symbol represents the empty set?",
        options: ["U", "∅", "∈", "⊆"],
        answer: 1,
        difficulty: "easy",
        solution: "The empty set contains no elements and is represented by ∅ or {}."
    },

    {
        question: "If A = {1, 2, 3} and B = {3, 4}, what is A ∪ B?",
        options: [
            "{3}",
            "{1, 2, 4}",
            "{1, 2, 3, 4}",
            "{1, 2, 3, 3, 4}"
        ],
        answer: 2,
        difficulty: "easy",
        solution: "Union combines every distinct element appearing in either set: A ∪ B = {1, 2, 3, 4}."
    },

    {
        question: "If A = {1, 2, 3} and B = {3, 4}, what is A ∩ B?",
        options: ["{1, 2}", "{3}", "{4}", "∅"],
        answer: 1,
        difficulty: "easy",
        solution: "Intersection contains elements common to both sets. Only 3 occurs in A and B, so A ∩ B = {3}."
    },

    {
        question: "Which condition shows that A and B are disjoint?",
        options: ["A ∪ B = A", "A ∩ B = ∅", "A = B", "A ⊆ B"],
        answer: 1,
        difficulty: "medium",
        solution: "Disjoint sets have no common elements. Therefore, their intersection is the empty set."
    },

    {
        question: "Let A = {2, 4} and B = {1, 2, 3, 4}. Which statement is correct?",
        options: ["A ⊆ B", "B ⊆ A", "A ∩ B = ∅", "A = B"],
        answer: 0,
        difficulty: "medium",
        solution: "Every element of A is present in B, so A is a subset of B: A ⊆ B."
    },

    {
        question: "How many subsets does a set with 4 elements have?",
        options: ["4", "8", "12", "16"],
        answer: 3,
        difficulty: "medium",
        solution: "A set with n elements has 2ⁿ subsets. For n = 4, 2⁴ = 16."
    },

    {
        question: "If A = {1, 2, 3, 4} and B = {3, 4, 5}, what is A − B?",
        options: ["{1, 2}", "{3, 4}", "{5}", "{1, 2, 5}"],
        answer: 0,
        difficulty: "medium",
        solution: "A − B keeps elements that are in A but not in B. Removing 3 and 4 leaves {1, 2}."
    },

    {
        question: "U = {1, 2, 3, 4, 5} and A = {1, 3, 5}. What is A′?",
        options: ["{1, 3, 5}", "{2, 4}", "{1, 2, 3, 4, 5}", "∅"],
        answer: 1,
        difficulty: "medium",
        solution: "The complement A′ contains elements of U that are not in A. Hence A′ = {2, 4}."
    },

    {
        question: "A = {1, 2, 3} and B = {3, 4, 5}. What is A △ B?",
        options: ["{3}", "{1, 2, 4, 5}", "{1, 2, 3, 4, 5}", "∅"],
        answer: 1,
        difficulty: "medium",
        solution: "The symmetric difference contains elements in exactly one set. Excluding the common element 3 gives {1, 2, 4, 5}."
    },

    {
        question: "Which expression is equal to (A ∪ B)′?",
        options: ["A′ ∪ B′", "A′ ∩ B′", "A ∩ B", "A − B"],
        answer: 1,
        difficulty: "medium",
        solution: "By De Morgan’s law for sets, the complement of a union equals the intersection of the complements: (A ∪ B)′ = A′ ∩ B′."
    },

    {
        question: "In a class, 28 students like chess, 22 like badminton and 10 like both. How many like at least one?",
        options: ["40", "50", "60", "18"],
        answer: 0,
        difficulty: "medium",
        solution: "n(C ∪ B) = 28 + 22 − 10 = 40. The common students are subtracted once because they were counted twice."
    },

    {
        question: "A survey has 60 people. If 40 belong to A ∪ B, how many belong to neither A nor B?",
        options: ["10", "20", "40", "100"],
        answer: 1,
        difficulty: "medium",
        solution: "People in neither set are outside A ∪ B. Therefore, 60 − 40 = 20."
    },

    {
        question: "If a set A has 5 elements, what is n(P(A))?",
        options: ["5", "10", "25", "32"],
        answer: 3,
        difficulty: "hard",
        solution: "The power set contains every subset of A. Therefore, n(P(A)) = 2⁵ = 32."
    },

    {
        question: "Simplify (A ∪ B) ∩ A.",
        options: ["A", "B", "A ∪ B", "∅"],
        answer: 0,
        difficulty: "hard",
        solution: "By the absorption law, intersecting A with A ∪ B leaves A: (A ∪ B) ∩ A = A."
    },

    {
        question: "If n(A) = 35 and n(A ∩ B) = 15, how many elements are in A only?",
        options: ["15", "20", "35", "50"],
        answer: 1,
        difficulty: "hard",
        solution: "A only excludes the common part. Therefore, n(A − B) = 35 − 15 = 20."
    },

    {
        question: "U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3}, B = {3, 4, 5}. What is (A ∪ B)′?",
        options: ["{3}", "{1, 2, 4, 5}", "{6}", "∅"],
        answer: 2,
        difficulty: "hard",
        solution: "A ∪ B = {1, 2, 3, 4, 5}. The only element of U outside that union is 6, so (A ∪ B)′ = {6}."
    },

    {
        question: "Which programming task is most directly modeled by a set?",
        options: [
            "Preserving every duplicate in exact input order",
            "Storing unique user IDs and checking membership quickly",
            "Representing a fixed sequence of animation frames",
            "Keeping a stack in last-in, first-out order"
        ],
        answer: 1,
        difficulty: "hard",
        solution: "Sets naturally store unique values and support membership tests, making them suitable for unique user IDs, visited nodes and permission collections."
    }

];


let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;


function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        "Question " + (currentQuestion + 1) + " of " + questions.length;

    const difficulty = document.getElementById("difficulty");

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

    document.getElementById("questionText").textContent = q.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    q.options.forEach(function (option, index) {
        const choice = document.createElement("div");
        choice.className = "option";
        choice.textContent = String.fromCharCode(65 + index) + ". " + option;
        choice.onclick = function () {
            selectOption(index, choice);
        };
        optionsContainer.appendChild(choice);
    });

    document.getElementById("feedback").style.display = "none";
    document.getElementById("solution").style.display = "none";
    document.getElementById("checkButton").style.display = "inline-block";
    document.getElementById("nextButton").style.display = "none";

    selectedAnswer = null;
    answered = false;

    document.getElementById("progressBar").style.width =
        ((currentQuestion + 1) / questions.length) * 100 + "%";
}


function selectOption(index, element) {
    if (answered) {
        return;
    }

    selectedAnswer = index;
    document.querySelectorAll(".option").forEach(function (option) {
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
        if (index === selectedAnswer && selectedAnswer !== q.answer) {
            option.classList.add("wrong");
        }
    });

    const feedback = document.getElementById("feedback");

    if (selectedAnswer === q.answer) {
        score++;
        feedback.textContent = "✅ Correct! Excellent set reasoning.";
        feedback.className = "feedback correct-feedback";
    }
    else {
        feedback.textContent = "❌ Incorrect. Check the explanation below.";
        feedback.className = "feedback wrong-feedback";
    }

    feedback.style.display = "block";

    const solution = document.getElementById("solution");
    solution.innerHTML = "<strong>💡 Detailed Solution</strong><br><br>" + q.solution;
    solution.style.display = "block";

    document.getElementById("checkButton").style.display = "none";
    document.getElementById("nextButton").style.display = "inline-block";
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
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").textContent = score + " / " + questions.length;

    const percentage = (score / questions.length) * 100;
    let message;

    if (percentage >= 90) {
        message = "🏆 Excellent! Your set operations and Venn-diagram reasoning are very strong.";
    }
    else if (percentage >= 70) {
        message = "👏 Very good! Review complements and counting to reach full marks.";
    }
    else if (percentage >= 50) {
        message = "👍 Good start. Revisit set notation, differences and inclusion–exclusion.";
    }
    else {
        message = "📚 Keep practicing. Draw the Venn regions before calculating each answer.";
    }

    document.getElementById("resultMessage").textContent = message;
}


function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    document.getElementById("quiz").style.display = "block";
    document.getElementById("result").style.display = "none";
    loadQuestion();
}


loadQuestion();
