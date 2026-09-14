"use strict";

/*
 * =========================================================
 * CodeBhavya Full Stack MERN
 * Level 09 — Control Flow & Functions
 * =========================================================
 */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[9] = {

    n: 9,

    kicker: "JAVASCRIPT ENGINEERING",

    title: "Control Flow & Functions",

    summary:
        "Learn how JavaScript makes decisions, repeats work and organises logic into reusable functions. Build a clear mental model of conditions, loops, branching, function calls, parameters, return values and modern arrow functions before moving deeper into JavaScript engineering.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Beginner → Intermediate",

    concepts: 18,

    outcomes: [
        "Explain how JavaScript executes statements from top to bottom unless control flow changes the order.",
        "Use if, if...else and else if for decision making.",
        "Choose between if statements, switch and the ternary operator appropriately.",
        "Understand truthy and falsy values without memorising isolated rules.",
        "Use &&, || and ! to combine conditions and understand short-circuit evaluation.",
        "Write while, do...while and for loops correctly.",
        "Use break and continue deliberately inside loops.",
        "Understand nested loops and their execution cost.",
        "Define reusable JavaScript functions.",
        "Distinguish parameters from arguments.",
        "Return values from functions and use those values in later expressions.",
        "Understand function declarations, function expressions and arrow functions.",
        "Choose an appropriate control structure for a real programming problem.",
        "Trace JavaScript execution step by step."
    ],

    sections: [

        {
            title: "Control Flow — How JavaScript Decides What Happens Next",

            intro:
                "A JavaScript program is not always a simple list of statements executed without interruption. Control-flow statements allow the program to choose paths, repeat operations or transfer execution into functions.",

            points: [
                "Normal execution moves from one statement to the next.",
                "A condition can choose whether a block executes.",
                "A loop can execute a block multiple times.",
                "A function call temporarily transfers control to reusable logic.",
                "return transfers control back to the caller with a value when one is provided."
            ],

            flow: [
                {
                    name: "Statement",
                    detail: "JavaScript reaches the next executable statement."
                },
                {
                    name: "Decision",
                    detail: "A condition may select one path."
                },
                {
                    name: "Loop",
                    detail: "A block may execute repeatedly."
                },
                {
                    name: "Function",
                    detail: "Execution can enter reusable logic."
                },
                {
                    name: "Return",
                    detail: "Control comes back to the caller."
                }
            ],

            keyIdea:
                "Control flow determines not only what JavaScript does, but also the order in which the program does it."
        },

        {
            title: "if — The Basic Decision",

            intro:
                "Use an if statement when a block of code should execute only when a condition is true.",

            code:
`const score = 82;

if (score >= 60) {
    console.log("Pass");
}`,

            output:
`Pass`,

            points: [
                "The expression inside parentheses is evaluated.",
                "If the result is truthy, the block executes.",
                "If the result is falsy, JavaScript skips the block.",
                "Braces are strongly recommended even when the block contains one statement."
            ],

            commonMistake:
                "Confusing assignment with comparison. Use = to assign a value and comparison operators such as === when testing equality.",

            example: {
                title: "Placement Eligibility",
                text:
                    "A placement portal can check whether a student's CGPA reaches a minimum requirement before displaying an eligible status.",
                code:
`const cgpa = 7.8;

if (cgpa >= 7.0) {
    console.log("Eligible");
}`
            }
        },

        {
            title: "if...else — Choose Between Two Paths",

            intro:
                "if...else is useful when exactly one of two main paths should execute.",

            code:
`const marks = 54;

if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}`,

            output:
`Pass`,

            points: [
                "JavaScript evaluates the condition first.",
                "A truthy condition selects the if block.",
                "A falsy condition selects the else block.",
                "Only one of the two branches executes for that evaluation."
            ],

            keyIdea:
                "if...else expresses a two-way decision clearly."
        },

        {
            title: "else if — Multiple Conditions",

            intro:
                "Use an else-if chain when several mutually exclusive conditions need to be tested in order.",

            code:
`const score = 76;

if (score >= 90) {
    console.log("A");
} else if (score >= 75) {
    console.log("B");
} else if (score >= 60) {
    console.log("C");
} else {
    console.log("D");
}`,

            output:
`B`,

            points: [
                "Conditions are checked from top to bottom.",
                "The first truthy condition selects its block.",
                "Remaining branches are skipped after a matching branch is selected.",
                "Order matters when conditions overlap."
            ],

            warning:
                "Always consider the order of overlapping conditions. Testing score >= 60 before score >= 75 would make the 75+ branch unreachable for those values."
        },

        {
            title: "Ternary Operator — A Compact Decision",

            intro:
                "The ternary operator is an expression that chooses between two values.",

            code:
`const age = 20;

const status =
    age >= 18
        ? "Adult"
        : "Minor";

console.log(status);`,

            output:
`Adult`,

            points: [
                "The condition comes first.",
                "The expression after ? is selected when the condition is truthy.",
                "The expression after : is selected when the condition is falsy.",
                "Ternary is useful for short value-selection logic.",
                "Large nested ternaries reduce readability and should normally be avoided."
            ],

            comparison: {
                headers: [
                    "Situation",
                    "Preferred Structure"
                ],
                rows: [
                    [
                        "One simple value choice",
                        "Ternary"
                    ],
                    [
                        "Two blocks of statements",
                        "if...else"
                    ],
                    [
                        "Many ordered conditions",
                        "else if"
                    ],
                    [
                        "Many fixed discrete cases",
                        "switch"
                    ]
                ]
            }
        },

        {
            title: "switch — Fixed Cases",

            intro:
                "switch is useful when one expression needs to be compared against several discrete case values.",

            code:
`const role = "student";

switch (role) {
    case "student":
        console.log("Learning dashboard");
        break;

    case "faculty":
        console.log("Faculty dashboard");
        break;

    default:
        console.log("Guest dashboard");
}`,

            output:
`Learning dashboard`,

            points: [
                "The switch expression is evaluated.",
                "JavaScript searches for a matching case.",
                "break prevents execution from continuing into later cases.",
                "default handles the situation where no case matches."
            ],

            commonMistake:
                "Forgetting break can cause fall-through into later cases. Fall-through can be intentional, but accidental fall-through is a common bug."
        },

        {
            title: "Truthy and Falsy Values",

            intro:
                "JavaScript conditions do not require the condition itself to be literally true or false. Values are converted to a Boolean context.",

            comparison: {
                headers: [
                    "Category",
                    "Examples"
                ],
                rows: [
                    [
                        "Common falsy values",
                        "false, 0, -0, 0n, \"\", null, undefined, NaN"
                    ],
                    [
                        "Common truthy values",
                        "true, non-zero numbers, non-empty strings, objects, arrays"
                    ]
                ]
            },

            code:
`const name = "";

if (name) {
    console.log("Name exists");
} else {
    console.log("Name is empty");
}`,

            output:
`Name is empty`,

            warning:
                "An empty array [] and an empty object {} are truthy in JavaScript. They are not equivalent to false."
        },

        {
            title: "Logical Operators and Short-Circuiting",

            intro:
                "Logical operators combine conditions, but they also control whether the right-hand expression needs to be evaluated.",

            methods: [
                {
                    name: "&&",
                    purpose:
                        "Evaluates the right side only when the left side is truthy.",
                    example:
                        "isLoggedIn && showDashboard()"
                },
                {
                    name: "||",
                    purpose:
                        "Uses the right side when the left side is falsy.",
                    example:
                        "name || \"Guest\""
                },
                {
                    name: "!",
                    purpose:
                        "Converts a value to Boolean and reverses its truth value.",
                    example:
                        "!isLoggedIn"
                }
            ],

            code:
`const username = "";

const displayName =
    username || "Guest";

console.log(displayName);`,

            output:
`Guest`,

            keyIdea:
                "Short-circuiting is both a control-flow mechanism and a common JavaScript programming pattern."
        },

        {
            title: "while — Repeat While a Condition Holds",

            intro:
                "A while loop checks its condition before every iteration.",

            code:
`let count = 1;

while (count <= 3) {
    console.log(count);
    count++;
}`,

            output:
`1
2
3`,

            flow: [
                "Check condition",
                "Execute body",
                "Update state",
                "Check condition again",
                "Stop when condition becomes falsy"
            ],

            commonMistake:
                "Forgetting to update the loop state can create an infinite loop."
        },

        {
            title: "do...while — Execute at Least Once",

            intro:
                "A do...while loop executes its body first and checks the condition afterward.",

            code:
`let choice = "menu";

do {
    console.log("Showing menu");
} while (choice === "again");`,

            output:
`Showing menu`,

            points: [
                "The body executes before the condition is tested.",
                "Therefore the body executes at least once.",
                "This is useful for menu-style interactions where one attempt must happen before deciding whether to repeat."
            ],

            comparison: {
                headers: [
                    "Loop",
                    "Condition Check"
                ],
                rows: [
                    [
                        "while",
                        "Before body"
                    ],
                    [
                        "do...while",
                        "After body"
                    ]
                ]
            }
        },

        {
            title: "for — Controlled Repetition",

            intro:
                "The for loop is ideal when initialization, a continuation condition and an update can be expressed together.",

            code:
`for (let i = 1; i <= 5; i++) {
    console.log(i);
}`,

            output:
`1
2
3
4
5`,

            points: [
                "Initialization runs once.",
                "The condition is checked before each iteration.",
                "The body runs when the condition is truthy.",
                "The update expression runs after the body.",
                "The cycle continues until the condition becomes falsy."
            ],

            flow: [
                "Initialize i",
                "Check i <= 5",
                "Run loop body",
                "Increment i",
                "Repeat condition check"
            ]
        },

        {
            title: "break and continue",

            intro:
                "break stops the current loop completely, while continue skips the remaining body of the current iteration and moves toward the next iteration.",

            code:
`for (let i = 1; i <= 6; i++) {

    if (i === 3) {
        continue;
    }

    if (i === 5) {
        break;
    }

    console.log(i);
}`,

            output:
`1
2
4`,

            comparison: {
                headers: [
                    "Statement",
                    "Effect"
                ],
                rows: [
                    [
                        "break",
                        "Exit the loop"
                    ],
                    [
                        "continue",
                        "Skip current iteration"
                    ]
                ]
            },

            commonMistake:
                "Using break when the requirement is only to skip one value."
        },

        {
            title: "Nested Loops",

            intro:
                "A nested loop is a loop inside another loop. The inner loop can run multiple times for every outer-loop iteration.",

            code:
`for (let row = 1; row <= 3; row++) {

    for (let col = 1; col <= 2; col++) {
        console.log(row, col);
    }
}`,

            output:
`1 1
1 2
2 1
2 2
3 1
3 2`,

            points: [
                "The outer loop controls the larger repetition.",
                "For each outer iteration, the inner loop starts again.",
                "Nested loops are common for tables, grids and matrix-style problems.",
                "Two loops over n values can lead to O(n²) work."
            ],

            keyIdea:
                "Nested loops are powerful, but their combined execution count should always be considered."
        },

        {
            title: "Function Declarations",

            intro:
                "A function groups reusable logic under a name.",

            code:
`function add(a, b) {
    return a + b;
}

const total = add(10, 20);

console.log(total);`,

            output:
`30`,

            points: [
                "function introduces a function declaration.",
                "a and b are parameters.",
                "10 and 20 are arguments supplied during the call.",
                "return sends a value back to the caller.",
                "The returned value can be stored, compared or passed into another function."
            ],

            flow: [
                "Call add(10, 20)",
                "Create function execution context",
                "Assign a = 10 and b = 20",
                "Evaluate a + b",
                "Return 30",
                "Resume caller"
            ],

            keyIdea:
                "A function turns a piece of logic into a reusable unit."
        },

        {
            title: "Parameters vs Arguments",

            intro:
                "Parameters are names written in the function definition. Arguments are the actual values supplied when the function is called.",

            code:
`function greet(name) {
    return "Hello " + name;
}

greet("Anita");`,

            output:
`Hello Anita`,

            comparison: {
                headers: [
                    "Term",
                    "Meaning",
                    "Example"
                ],
                rows: [
                    [
                        "Parameter",
                        "Variable listed in function definition",
                        "name"
                    ],
                    [
                        "Argument",
                        "Value supplied during call",
                        "\"Anita\""
                    ]
                ]
            }
        },

        {
            title: "return — Sending a Result Back",

            intro:
                "return ends the current function execution and optionally sends a value to the caller.",

            code:
`function calculateGrade(score) {

    if (score >= 75) {
        return "A";
    }

    if (score >= 60) {
        return "B";
    }

    return "C";
}

console.log(calculateGrade(82));`,

            output:
`A`,

            points: [
                "return immediately leaves the current function.",
                "Statements after a return in the same execution path do not run.",
                "A function without an explicit return value produces undefined.",
                "Returning values makes functions easier to compose and test."
            ],

            commonMistake:
                "Using console.log when the caller actually needs a value. Printing and returning are different operations."
        },

        {
            title: "Function Expressions",

            intro:
                "A function can be stored in a variable. This is called a function expression.",

            code:
`const multiply = function (a, b) {
    return a * b;
};

console.log(multiply(4, 5));`,

            output:
`20`,

            points: [
                "The function is created as part of an expression.",
                "The resulting function value is assigned to multiply.",
                "The variable can then be used to call the function.",
                "Functions are values in JavaScript and can be stored, passed and returned."
            ],

            keyIdea:
                "JavaScript treats functions as first-class values."
        },

        {
            title: "Arrow Functions",

            intro:
                "Arrow functions provide a concise function syntax and are widely used in modern JavaScript.",

            code:
`const square = number => number * number;

console.log(square(6));`,

            output:
`36`,

            comparison: {
                headers: [
                    "Style",
                    "Example"
                ],
                rows: [
                    [
                        "Function declaration",
                        "function add(a, b) { return a + b; }"
                    ],
                    [
                        "Function expression",
                        "const add = function(a, b) { return a + b; };"
                    ],
                    [
                        "Arrow function",
                        "const add = (a, b) => a + b;"
                    ]
                ]
            },

            warning:
                "Arrow functions are not simply shorter syntax in every situation. They also have different this behaviour, which becomes important in later JavaScript engineering levels."
        },

        {
            title: "Choosing the Right Structure",

            intro:
                "Good JavaScript is not only about knowing syntax. It is about selecting the simplest structure that clearly expresses the required behaviour.",

            comparison: {
                headers: [
                    "Requirement",
                    "Good Starting Choice"
                ],
                rows: [
                    [
                        "One condition",
                        "if"
                    ],
                    [
                        "Two alternative paths",
                        "if...else"
                    ],
                    [
                        "Several ordered conditions",
                        "else if"
                    ],
                    [
                        "Several fixed values",
                        "switch"
                    ],
                    [
                        "Simple value selection",
                        "ternary"
                    ],
                    [
                        "Known repetition count",
                        "for"
                    ],
                    [
                        "Repeat until condition changes",
                        "while"
                    ],
                    [
                        "Reusable logic",
                        "function"
                    ]
                ]
            },

            keyIdea:
                "Readable control flow makes the program easier to debug, test, explain and maintain."
        }
    ],

    visualizer: {

        title: "Control Flow Decision & Loop Visualizer",

        description:
            "Follow one JavaScript program as it evaluates a condition, enters a loop, skips an iteration and finally calls a function.",

        steps: [

            {
                title: "Program starts",
                operation: "let total = 0;",
                detail:
                    "JavaScript begins executing the statements in order. total starts at 0."
            },

            {
                title: "for loop initializes",
                operation: "let i = 1;",
                detail:
                    "The loop variable i is initialized to 1."
            },

            {
                title: "Condition is checked",
                operation: "i <= 5 → true",
                detail:
                    "Because 1 <= 5 is true, the loop body executes."
            },

            {
                title: "Decision inside loop",
                operation: "i % 2 === 0 → false",
                detail:
                    "1 is odd, so the continue statement is not reached."
            },

            {
                title: "Function call",
                operation: "add(total, i)",
                detail:
                    "Control enters the add function with the current total and i."
            },

            {
                title: "Function returns",
                operation: "return a + b",
                detail:
                    "The function calculates the new total and returns the result to the loop."
            },

            {
                title: "Loop updates",
                operation: "i++",
                detail:
                    "The loop increments i from 1 to 2."
            },

            {
                title: "Even value detected",
                operation: "i % 2 === 0 → true",
                detail:
                    "The value 2 is even, so continue skips the remaining body."
            },

            {
                title: "Next iteration",
                operation: "i = 3",
                detail:
                    "The loop continues with the next value."
            },

            {
                title: "Function runs again",
                operation: "add(total, i)",
                detail:
                    "The function receives the current total and the new value."
            },

            {
                title: "Loop continues",
                operation: "i = 4 → continue",
                detail:
                    "The even value is skipped."
            },

            {
                title: "Final iteration",
                operation: "i = 5",
                detail:
                    "The last valid value reaches the function."
            },

            {
                title: "Condition becomes false",
                operation: "i <= 5 → false",
                detail:
                    "The loop terminates when i becomes 6."
            },

            {
                title: "Program completes",
                operation: "console.log(total)",
                detail:
                    "Execution continues after the loop and prints the final result."
            }
        ]
    },

    trace: {

        title: "Program Tracing — Control Flow & Functions",

        lines: [

            {
                line: 1,
                code: "function add(a, b) {",
                explanation:
                    "JavaScript registers the function declaration. The function body executes only when add() is called."
            },

            {
                line: 2,
                code: "    return a + b;",
                explanation:
                    "When called, the function will return the sum of its two parameters."
            },

            {
                line: 3,
                code: "}",
                explanation:
                    "The function declaration ends."
            },

            {
                line: 4,
                code: "",
                explanation:
                    "Blank line. No executable statement."
            },

            {
                line: 5,
                code: "let total = 0;",
                explanation:
                    "Execution begins in the main program. total is initialized to 0."
            },

            {
                line: 6,
                code: "for (let i = 1; i <= 5; i++) {",
                explanation:
                    "The for loop creates i = 1 and checks whether i <= 5."
            },

            {
                line: 7,
                code: "    if (i % 2 === 0) {",
                explanation:
                    "The current value is tested for evenness."
            },

            {
                line: 8,
                code: "        continue;",
                explanation:
                    "For an even i, continue skips the remaining statements in the current iteration."
            },

            {
                line: 9,
                code: "    }",
                explanation:
                    "The inner if block ends."
            },

            {
                line: 10,
                code: "    total = add(total, i);",
                explanation:
                    "For odd values, add() is called. Control temporarily enters the function."
            },

            {
                line: 11,
                code: "    console.log(total);",
                explanation:
                    "The returned value is stored in total and printed."
            },

            {
                line: 12,
                code: "}",
                explanation:
                    "The loop body ends. JavaScript performs i++ and checks the loop condition again."
            },

            {
                line: 13,
                code: "",
                explanation:
                    "Blank line. No executable statement."
            },

            {
                line: 14,
                code: "console.log(\"Done\");",
                explanation:
                    "After the loop terminates, execution continues with the next statement."
            }
        ]
    },

    revision: [

        [
            "if",
            "Executes a block when a condition is truthy."
        ],

        [
            "if...else",
            "Chooses between two alternative paths."
        ],

        [
            "else if",
            "Tests multiple ordered conditions."
        ],

        [
            "ternary",
            "Compact expression for choosing between two values."
        ],

        [
            "switch",
            "Useful for fixed discrete cases."
        ],

        [
            "truthy",
            "A value that behaves as true in a Boolean context."
        ],

        [
            "falsy",
            "A value that behaves as false in a Boolean context."
        ],

        [
            "while",
            "Repeats while a condition remains truthy."
        ],

        [
            "do...while",
            "Runs the body at least once before checking the condition."
        ],

        [
            "for",
            "Combines initialization, condition and update for controlled repetition."
        ],

        [
            "break",
            "Immediately exits the current loop or switch."
        ],

        [
            "continue",
            "Skips the remaining body of the current loop iteration."
        ],

        [
            "parameter",
            "A named variable in a function definition."
        ],

        [
            "argument",
            "An actual value supplied to a function call."
        ],

        [
            "return",
            "Ends function execution and optionally sends a value back."
        ],

        [
            "arrow function",
            "Concise function syntax introduced by modern JavaScript."
        ]
    ],

    interview: [

        {
            q: "What is control flow in JavaScript?",
            a:
                "Control flow is the order in which JavaScript executes statements. Conditions, loops, function calls, return statements and other constructs can change the normal top-to-bottom execution path."
        },

        {
            q: "What is the difference between if and if...else?",
            a:
                "if executes a block only when its condition is truthy. if...else provides an alternative block when the condition is falsy."
        },

        {
            q: "When should you use switch instead of else if?",
            a:
                "switch is often clearer when one expression is compared against several fixed discrete values. else if is generally more flexible for ranges and different Boolean conditions."
        },

        {
            q: "What is a truthy value?",
            a:
                "A truthy value is any JavaScript value that behaves as true when evaluated in a Boolean context. Objects and arrays are truthy even when they are empty."
        },

        {
            q: "What is short-circuit evaluation?",
            a:
                "Short-circuit evaluation means JavaScript may stop evaluating a logical expression as soon as its final result is known. For example, with A && B, B is not evaluated when A is falsy."
        },

        {
            q: "What is the difference between while and do...while?",
            a:
                "while checks the condition before the first iteration. do...while executes the body first and checks the condition afterward, so it always executes at least once."
        },

        {
            q: "What is the difference between break and continue?",
            a:
                "break terminates the loop completely. continue skips the remaining statements of the current iteration and proceeds toward the next iteration."
        },

        {
            q: "What is a function parameter?",
            a:
                "A parameter is a named variable listed in a function definition. It receives a value when the function is called."
        },

        {
            q: "What is the difference between a parameter and an argument?",
            a:
                "A parameter is part of the function definition, while an argument is the actual value supplied during the function call."
        },

        {
            q: "Why is return different from console.log?",
            a:
                "console.log displays a value. return sends a value back to the caller and ends the current function execution."
        },

        {
            q: "What is a function expression?",
            a:
                "A function expression creates a function as part of an expression and can store that function in a variable."
        },

        {
            q: "What is an arrow function?",
            a:
                "An arrow function is a concise function syntax using =>. Arrow functions also have different this behaviour from normal functions, which becomes important in later JavaScript topics."
        }
    ],

    practice: [

        {
            title: "Placement Eligibility",
            difficulty: "Easy",
            prompt:
                "Create a function that receives a student's CGPA. Print Eligible when CGPA is at least 7.0; otherwise print Not Eligible.",
            hints: [
                "Use a function with one parameter.",
                "Use if...else.",
                "Return or print the required result."
            ]
        },

        {
            title: "Grade Calculator",
            difficulty: "Easy",
            prompt:
                "Write a function that accepts marks and returns A, B, C, D or F using an ordered grading system.",
            hints: [
                "Check the highest range first.",
                "Use else if for the remaining ranges.",
                "Return the grade."
            ]
        },

        {
            title: "Day Selector",
            difficulty: "Easy",
            prompt:
                "Use switch to convert numbers 1–7 into weekday names.",
            hints: [
                "Use one switch expression.",
                "Each case should represent one day.",
                "Remember break."
            ]
        },

        {
            title: "Login Check",
            difficulty: "Easy",
            prompt:
                "Create a Boolean variable isLoggedIn and print Dashboard when it is true, otherwise print Login Required.",
            hints: [
                "Use if...else.",
                "The condition itself can be Boolean."
            ]
        },

        {
            title: "Default Username",
            difficulty: "Easy",
            prompt:
                "Use the || operator to assign Guest when a username variable contains an empty string.",
            hints: [
                "Empty string is falsy.",
                "Use username || \"Guest\"."
            ]
        },

        {
            title: "Count to N",
            difficulty: "Easy",
            prompt:
                "Write a function that prints numbers from 1 to n using a for loop.",
            hints: [
                "Use a parameter n.",
                "Initialize i to 1.",
                "Continue while i <= n."
            ]
        },

        {
            title: "Skip Multiples",
            difficulty: "Medium",
            prompt:
                "Print numbers from 1 to 30 but skip every multiple of 5 using continue.",
            hints: [
                "Use i % 5 === 0.",
                "Use continue before console.log."
            ]
        },

        {
            title: "First Match",
            difficulty: "Medium",
            prompt:
                "Search numbers from 1 to 100 and stop when the first number divisible by both 7 and 11 is found.",
            hints: [
                "Use a for loop.",
                "Use && between the two divisibility conditions.",
                "Use break after finding the first match."
            ]
        },

        {
            title: "Factorial Function",
            difficulty: "Medium",
            prompt:
                "Create a function factorial(n) that calculates n! using a loop and returns the result.",
            hints: [
                "Start result at 1.",
                "Multiply result by every value from 1 to n.",
                "Return result."
            ]
        },

        {
            title: "Maximum of Three",
            difficulty: "Medium",
            prompt:
                "Write a function maxOfThree(a, b, c) that returns the largest of three numbers.",
            hints: [
                "Use comparisons.",
                "You can solve it using if...else if...else."
            ]
        },

        {
            title: "Nested Grid",
            difficulty: "Hard",
            prompt:
                "Use nested loops to print a 4 × 4 coordinate grid where each position contains row and column numbers.",
            hints: [
                "Use one loop for rows.",
                "Use another loop inside it for columns."
            ]
        },

        {
            title: "Mini Placement Utility",
            difficulty: "Hard",
            prompt:
                "Build a function that receives CGPA and backlogs and returns Eligible only when CGPA is at least 7.0 and backlogs are 0.",
            hints: [
                "Use &&.",
                "Keep the eligibility rule inside the function.",
                "Return the final status."
            ]
        }
    ],

    quiz: [

        {
            q: "Which statement is used to execute a block only when a condition is truthy?",
            options: [
                "if",
                "for",
                "return",
                "switch"
            ],
            answer: 0,
            explanation:
                "if evaluates a condition and executes its block when that condition is truthy."
        },

        {
            q: "Which operator is commonly used for a compact two-value decision?",
            options: [
                "++",
                "?:",
                "=>",
                "..."
            ],
            answer: 1,
            explanation:
                "The ternary operator uses the ?: syntax."
        },

        {
            q: "What happens when break executes inside a loop?",
            options: [
                "The loop pauses for one iteration",
                "The current iteration repeats",
                "The loop terminates",
                "The program restarts"
            ],
            answer: 2,
            explanation:
                "break immediately exits the current loop."
        },

        {
            q: "Which loop checks its condition after executing the body?",
            options: [
                "for",
                "while",
                "do...while",
                "switch"
            ],
            answer: 2,
            explanation:
                "do...while executes its body first and checks the condition afterward."
        },

        {
            q: "What is a parameter?",
            options: [
                "A value printed by console.log",
                "A named variable in a function definition",
                "A loop keyword",
                "A Boolean operator"
            ],
            answer: 1,
            explanation:
                "Parameters are the named inputs written in a function definition."
        },

        {
            q: "What does return do inside a function?",
            options: [
                "Only prints a value",
                "Creates a loop",
                "Ends the function and can send a value back",
                "Changes a variable to Boolean"
            ],
            answer: 2,
            explanation:
                "return ends the current function execution and can provide a value to the caller."
        },

        {
            q: "Which value is falsy?",
            options: [
                "[]",
                "{}",
                "\"\"",
                "\"hello\""
            ],
            answer: 2,
            explanation:
                "An empty string is falsy. Empty arrays and objects are truthy."
        },

        {
            q: "What does continue do?",
            options: [
                "Terminates the entire program",
                "Exits the current loop",
                "Skips the current iteration's remaining body",
                "Calls a function"
            ],
            answer: 2,
            explanation:
                "continue skips the remaining body of the current iteration."
        },

        {
            q: "Which construct is often suitable for several fixed discrete cases?",
            options: [
                "switch",
                "while",
                "return",
                "continue"
            ],
            answer: 0,
            explanation:
                "switch is commonly used when one expression is compared against several fixed case values."
        },

        {
            q: "Which syntax represents an arrow function?",
            options: [
                "function => add()",
                "add -> function()",
                "const add = (a, b) => a + b",
                "arrow add(a, b)"
            ],
            answer: 2,
            explanation:
                "The => syntax is used for arrow functions."
        },

        {
            q: "What is an argument?",
            options: [
                "A value supplied during a function call",
                "A function's return keyword",
                "A loop condition",
                "A switch case"
            ],
            answer: 0,
            explanation:
                "Arguments are the actual values supplied when calling a function."
        },

        {
            q: "Which statement best describes short-circuiting?",
            options: [
                "JavaScript always evaluates every part of a logical expression",
                "JavaScript can stop evaluating when the result is already known",
                "Loops automatically stop after two iterations",
                "Functions always return immediately"
            ],
            answer: 1,
            explanation:
                "Logical operators can stop evaluation once the final result is known."
        },

        {
            q: "What is the main purpose of a function?",
            options: [
                "To make every program longer",
                "To create reusable logic",
                "To replace all loops",
                "To disable conditions"
            ],
            answer: 1,
            explanation:
                "Functions package logic into reusable units."
        },

        {
            q: "Which loop is commonly preferred when initialization, condition and update naturally belong together?",
            options: [
                "for",
                "switch",
                "if",
                "return"
            ],
            answer: 0,
            explanation:
                "The for loop combines initialization, condition and update in one structure."
        },

        {
            q: "What is the difference between console.log(value) and return value?",
            options: [
                "They are always identical",
                "console.log returns the value to the caller",
                "return only displays the value",
                "console.log displays while return sends a value back"
            ],
            answer: 3,
            explanation:
                "console.log displays information. return provides a result to the function caller."
        }
    ],

    glossary: [

        {
            term: "Control Flow",
            definition:
                "The order in which program statements execute."
        },

        {
            term: "Condition",
            definition:
                "An expression whose value determines which path executes."
        },

        {
            term: "Branch",
            definition:
                "One possible execution path selected by a decision."
        },

        {
            term: "Loop",
            definition:
                "A construct that repeats a block of code."
        },

        {
            term: "Iteration",
            definition:
                "One execution of a loop body."
        },

        {
            term: "Truthy",
            definition:
                "A value that behaves as true in a Boolean context."
        },

        {
            term: "Falsy",
            definition:
                "A value that behaves as false in a Boolean context."
        },

        {
            term: "Short-circuit",
            definition:
                "Stopping logical expression evaluation when the final result is already known."
        },

        {
            term: "Function",
            definition:
                "A reusable unit of JavaScript logic."
        },

        {
            term: "Parameter",
            definition:
                "A named input variable in a function definition."
        },

        {
            term: "Argument",
            definition:
                "An actual value supplied to a function call."
        },

        {
            term: "Return Value",
            definition:
                "The value sent from a function back to its caller."
        },

        {
            term: "Function Expression",
            definition:
                "A function created as part of an expression and commonly assigned to a variable."
        },

        {
            term: "Arrow Function",
            definition:
                "A concise function syntax using the => operator."
        }
    ],

    completion: {

        title: "You now control JavaScript execution.",

        message:
            "You can now make JavaScript choose paths, repeat work and organise logic into reusable functions. These ideas form the execution foundation for the more advanced JavaScript engineering topics ahead.",

        challenge:
            "Build a small Placement Eligibility utility. Create a function that receives CGPA, backlogs and attendance. Use conditions to determine eligibility, a loop to process multiple students, and return a clear result for every student. Before moving on, trace the execution manually and explain why every branch executes."
    },

    takeaway:
        "Strong JavaScript is not about memorising syntax. It is about controlling execution clearly: choose the right branch, repeat only what is necessary, isolate reusable logic inside functions and return meaningful results."
};
