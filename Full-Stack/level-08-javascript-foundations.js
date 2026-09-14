
"use strict";

/*
=========================================================
CodeBhavya Full Stack MERN
LEVEL 08 — JavaScript Foundations
Part B · JavaScript Engineering
=========================================================
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[8] = {

  number: 8,

  title: "JavaScript Foundations",

  kicker: "PART B · LEVEL 08",

  subtitle:
    "Build a strong mental model of JavaScript values, types, variables, expressions, coercion and runtime execution.",

  estimatedTime: "5–7 hours",

  difficulty: "Beginner → Intermediate",

  hero: {
    badge: "PART B · JAVASCRIPT ENGINEERING",

    description:
      "Before learning advanced JavaScript, understand what values are, how variables work, how expressions are evaluated and why JavaScript sometimes behaves differently from what you expect."
  },

  objectives: [
    "Understand the role of JavaScript in modern web applications.",
    "Distinguish JavaScript, ECMAScript, a JavaScript engine and a runtime environment.",
    "Identify primitive values and understand how objects differ from primitives.",
    "Use let, const and var correctly in modern JavaScript.",
    "Understand expressions, operators and basic evaluation order.",
    "Work confidently with strings, template literals and numbers.",
    "Understand NaN, Infinity, null and undefined.",
    "Predict truthy and falsy behaviour.",
    "Understand type coercion and the difference between == and ===.",
    "Use the browser console and DevTools for basic debugging.",
    "Trace simple JavaScript programs step by step."
  ],

  concepts: [

    {
      number: 1,

      title: "What JavaScript Actually Is",

      intro:
        "JavaScript is a programming language used to add behaviour, computation and interaction to applications. On the web, JavaScript works together with HTML and CSS to create interactive experiences.",

      points: [
        "HTML describes the structure and meaning of a page.",
        "CSS controls presentation and layout.",
        "JavaScript provides programmable behaviour.",
        "JavaScript can run in browsers, servers and other environments.",
        "ECMAScript is the standardized specification behind the JavaScript language.",
        "The runtime environment provides additional APIs around the JavaScript engine."
      ],

      keyIdea:
        "JavaScript is the language. The browser or Node.js provides a runtime environment around the JavaScript engine.",

      example: {
        title: "A simple JavaScript program",

        text:
          "The JavaScript engine evaluates the declarations and expressions. The console API is supplied by the surrounding runtime.",

        code:
`const name = "CodeBhavya";
const score = 92;

console.log(name);
console.log(score);`,

        output:
`CodeBhavya
92`
      },

      commonMistake:
        "Thinking that every API available in a browser is part of the JavaScript language itself. The DOM, fetch, localStorage and many browser APIs are runtime-provided capabilities."
    },

    {
      number: 2,

      title: "Runtime, Engine and Execution Basics",

      intro:
        "When JavaScript code runs, several layers cooperate. Understanding these layers gives you a better mental model than simply memorizing syntax.",

      points: [
        "Your source code is given to a JavaScript engine.",
        "The engine parses and evaluates JavaScript.",
        "Modern engines may compile and optimize code internally.",
        "The runtime provides environment-specific capabilities.",
        "A browser provides APIs such as the DOM and browser storage.",
        "Node.js provides server-side capabilities such as filesystem and networking APIs."
      ],

      flow: [
        "JavaScript source code",
        "Engine parses the program",
        "Declarations and expressions are evaluated",
        "Values are produced",
        "Runtime APIs are used when required",
        "Observable output or behaviour is produced"
      ],

      keyIdea:
        "The engine executes JavaScript; the runtime gives that JavaScript access to its environment.",

      example: {
        title: "Expression evaluation",

        code:
`const price = 100;
const tax = 18;

const total = price + tax;

console.log(total);`,

        output:
`118`
      }
    },

    {
      number: 3,

      title: "Values and Data Types",

      intro:
        "JavaScript programs continuously create, store, compare and transform values. Every value has a type.",

      points: [
        "The seven primitive types are string, number, bigint, boolean, undefined, symbol and null.",
        "Objects are non-primitive values.",
        "Arrays are objects.",
        "Functions are callable objects.",
        "typeof can be used to inspect many JavaScript values.",
        "typeof null returns object because of a historical JavaScript quirk."
      ],

      comparison: {
        headers: [
          "Category",
          "Examples",
          "Nature"
        ],

        rows: [
          [
            "Primitive",
            "string, number, boolean",
            "Individual primitive value"
          ],
          [
            "Primitive",
            "undefined, null",
            "Absence-related values"
          ],
          [
            "Primitive",
            "bigint, symbol",
            "Special primitive values"
          ],
          [
            "Object",
            "object, array",
            "Non-primitive structure"
          ],
          [
            "Object",
            "function, Date, Map",
            "Specialized object values"
          ]
        ]
      },

      example: {
        title: "Inspecting types",

        code:
`console.log(typeof "Hello");
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof []);
console.log(typeof {});`,

        output:
`string
number
boolean
undefined
object
object
object`
      },

      warning:
        "Do not use typeof as a complete type system. In particular, typeof null is object and typeof [] is also object."
    },

    {
      number: 4,

      title: "Variables: let, const and var",

      intro:
        "Variables give names to values so that programs can work with those values repeatedly.",

      points: [
        "const creates a binding that cannot be reassigned.",
        "let creates a binding that can be reassigned.",
        "Both let and const are block scoped.",
        "var is function scoped and belongs mainly to older JavaScript code.",
        "Modern application code normally prefers const and let.",
        "let and const cannot be accessed before their declaration is evaluated."
      ],

      comparison: {
        headers: [
          "Feature",
          "const",
          "let",
          "var"
        ],

        rows: [
          [
            "Block scoped",
            "Yes",
            "Yes",
            "No"
          ],
          [
            "Can reassign",
            "No",
            "Yes",
            "Yes"
          ],
          [
            "Modern default",
            "Yes",
            "When needed",
            "Usually no"
          ],
          [
            "Legacy usage",
            "No",
            "No",
            "Common"
          ]
        ]
      },

      example: {
        title: "Choosing const and let",

        code:
`const college = "CodeBhavya";

let score = 80;
score = 92;

console.log(college);
console.log(score);`,

        output:
`CodeBhavya
92`
      },

      commonMistake:
        "const does not make an object or array immutable. It only prevents reassignment of the variable binding."
    },

    {
      number: 5,

      title: "Operators and Expressions",

      intro:
        "An expression is code that can be evaluated to produce a value. Operators describe how values should be combined or transformed.",

      points: [
        "Arithmetic operators include +, -, *, /, %, and **.",
        "Comparison operators include >, <, >= and <=.",
        "Equality operators include == and ===.",
        "Logical operators include &&, || and !.",
        "Assignment operators include =, +=, -=, *= and /=.",
        "Operator precedence affects the order in which combined expressions are evaluated."
      ],

      example: {
        title: "Expressions produce values",

        code:
`const a = 10;
const b = 3;

console.log(a + b);
console.log(a * b);
console.log(a % b);
console.log(a > b);
console.log(a === b);`,

        output:
`13
30
1
true
false`
      },

      keyIdea:
        "When reading JavaScript, ask: what value does this expression produce?"
    },

    {
      number: 6,

      title: "Strings and Template Literals",

      intro:
        "Strings represent text. JavaScript supports single quotes, double quotes and template literals.",

      points: [
        "Strings can use single quotes or double quotes.",
        "Template literals use backticks.",
        "Template literals support embedded expressions.",
        "String interpolation uses ${expression}.",
        "Strings are primitive values.",
        "String methods return values rather than changing the original primitive string."
      ],

      example: {
        title: "Template literal",

        code:
`const name = "Ravi";
const course = "Full Stack";
const level = 8;

const message = \`Student: \${name}
Course: \${course}
Level: \${level}\`;

console.log(message);`,

        output:
`Student: Ravi
Course: Full Stack
Level: 8`
      },

      example2: {
        title: "Useful string operations",

        code:
`const text = "  JavaScript  ";

console.log(text.trim());
console.log(text.toUpperCase());
console.log(text.includes("Script"));
console.log(text.length);`,

        output:
`JavaScript
  JAVASCRIPT  
true
14`
      },

      commonMistake:
        "Confusing the string value '10' with the number 10. They look similar when printed but have different types."
    },

    {
      number: 7,

      title: "Numbers, NaN and Infinity",

      intro:
        "JavaScript uses the number type for ordinary numeric values and also represents special numeric states such as NaN and Infinity.",

      points: [
        "The JavaScript number type represents both integer and floating-point values.",
        "NaN means Not-a-Number.",
        "NaN has the type number.",
        "NaN is not equal to itself.",
        "Infinity represents positive infinity.",
        "-Infinity represents negative infinity.",
        "Number.isNaN(value) is useful for checking whether a value is actually NaN."
      ],

      example: {
        title: "Special numeric values",

        code:
`console.log(10 / 2);
console.log(10 / 0);
console.log(-10 / 0);

console.log(Number("hello"));
console.log(typeof NaN);
console.log(Number.isNaN(NaN));`,

        output:
`5
Infinity
-Infinity
NaN
number
true`
      },

      keyIdea:
        "NaN is a special numeric value, not a separate JavaScript data type.",

      warning:
        "Do not test NaN using value === NaN. That comparison is always false. Use Number.isNaN(value)."
    },

    {
      number: 8,

      title: "null vs undefined",

      intro:
        "Both null and undefined represent absence, but they communicate different ideas.",

      points: [
        "undefined commonly means that a value is missing or has not been assigned.",
        "null usually represents intentional absence.",
        "A variable declared without an initial value starts as undefined.",
        "A programmer can explicitly assign null.",
        "typeof undefined is undefined.",
        "typeof null is object because of a historical quirk."
      ],

      comparison: {
        headers: [
          "Value",
          "Common meaning",
          "typeof"
        ],

        rows: [
          [
            "undefined",
            "Missing or not assigned",
            "undefined"
          ],
          [
            "null",
            "Intentional empty value",
            "object"
          ]
        ]
      },

      example: {
        title: "Comparing null and undefined",

        code:
`let username;

const selectedUser = null;

console.log(username);
console.log(selectedUser);

console.log(typeof username);
console.log(typeof selectedUser);`,

        output:
`undefined
null
undefined
object`
      }
    },

    {
      number: 9,

      title: "Truthy, Falsy and Equality",

      intro:
        "JavaScript frequently evaluates values in boolean contexts. Understanding truthy and falsy values is essential for writing predictable conditions.",

      points: [
        "false, 0, -0, 0n, empty string, null, undefined and NaN are falsy.",
        "Most other values are truthy.",
        "Empty arrays are truthy.",
        "Empty objects are truthy.",
        "=== performs strict equality without the coercion performed by ==.",
        "== performs equality comparison with coercion."
      ],

      example: {
        title: "Truthy and falsy values",

        code:
`console.log(Boolean(0));
console.log(Boolean(""));
console.log(Boolean(false));
console.log(Boolean(null));
console.log(Boolean(undefined));
console.log(Boolean(NaN));

console.log(Boolean([]));
console.log(Boolean({}));`,

        output:
`false
false
false
false
false
false
true
true`
      },

      example2: {
        title: "Strict vs loose equality",

        code:
`console.log(5 === "5");
console.log(5 == "5");

console.log(false === 0);
console.log(false == 0);`,

        output:
`false
true
false
true`
      },

      keyIdea:
        "Prefer === in normal application code because it avoids implicit equality coercion."
    },

    {
      number: 10,

      title: "Type Coercion",

      intro:
        "Type coercion happens when JavaScript converts a value from one type to another during an operation.",

      points: [
        "Explicit coercion is requested by the programmer.",
        "Number('42') explicitly converts a string to a number.",
        "String(42) explicitly converts a number to a string.",
        "Boolean(value) explicitly converts a value to boolean.",
        "Some operators perform implicit coercion.",
        "The + operator has both numeric addition and string concatenation behaviour.",
        "Operators such as - and * commonly trigger numeric conversion."
      ],

      example: {
        title: "Explicit and implicit conversion",

        code:
`console.log(Number("42"));
console.log(String(42));
console.log(Boolean(1));

console.log("10" + 5);
console.log("10" - 5);
console.log("10" * 2);`,

        output:
`42
42
true
105
5
20`
      },

      warning:
        "Never guess the result of a coercion-heavy expression. Inspect the operand types and, when appropriate, convert values explicitly."
    },

    {
      number: 11,

      title: "Debugging with Console and DevTools",

      intro:
        "Professional JavaScript development depends on observing program state instead of guessing what the code is doing.",

      points: [
        "console.log() is useful for inspecting values.",
        "typeof can reveal unexpected types.",
        "console.table() is useful for arrays and collections of objects.",
        "Browser DevTools can pause code using breakpoints.",
        "Breakpoints allow you to inspect variables while execution is paused.",
        "Good debugging starts by reproducing the problem and observing the relevant state."
      ],

      example: {
        title: "Inspect both value and type",

        code:
`const quantity = "5";
const price = 100;

console.log("quantity:", quantity);
console.log("quantity type:", typeof quantity);

const total = quantity * price;

console.log("total:", total);
console.log("total type:", typeof total);`,

        output:
`quantity: 5
quantity type: string
total: 500
total type: number`
      },

      tryIt: {
        title: "Debugging habit",

        steps: [
          "Reproduce the unexpected behaviour.",
          "Inspect the relevant value.",
          "Inspect its type.",
          "Check the expression producing the value.",
          "Identify the incorrect assumption.",
          "Make one focused change.",
          "Run the test again."
        ]
      },

      keyIdea:
        "Debugging is a reasoning process. Observe first, change second."
    }

  ],

  visualizer: {

    title: "JavaScript Execution Visualizer",

    description:
      "Step through a small JavaScript program and watch how values are created and transformed.",

    steps: [

      {
        title: "Read the first declaration",

        operation: "const price = 100",

        detail:
          "JavaScript evaluates the initializer and associates the number 100 with the price binding."
      },

      {
        title: "Read the second declaration",

        operation: "const quantity = 3",

        detail:
          "The number 3 becomes the value associated with quantity."
      },

      {
        title: "Evaluate the multiplication",

        operation: "price * quantity",

        detail:
          "JavaScript retrieves 100 and 3, multiplies them and produces the number 300."
      },

      {
        title: "Create total",

        operation: "const total = 300",

        detail:
          "The result of the expression becomes the value associated with total."
      },

      {
        title: "Call the console API",

        operation: "console.log(total)",

        detail:
          "The value 300 is passed to the runtime's console API and displayed."
      }

    ]
  },

  trace: {

    title: "Value & Type Tracer",

    lines: [

      {
        line: 1,
        code: 'const a = "10";'
      },

      {
        line: 2,
        code: "const b = 5;"
      },

      {
        line: 4,
        code: "const x = a + b;"
      },

      {
        line: 5,
        code: "const y = a - b;"
      },

      {
        line: 7,
        code: "console.log(x);"
      },

      {
        line: 8,
        code: "console.log(y);"
      }

    ],

    steps: [

      {
        line: 1,
        title: "Create a",

        detail:
          'a receives the value "10". Its type is string.'
      },

      {
        line: 2,
        title: "Create b",

        detail:
          "b receives the value 5. Its type is number."
      },

      {
        line: 4,
        title: "Evaluate a + b",

        detail:
          'a is a string, so + performs string concatenation. The result is "105".'
      },

      {
        line: 5,
        title: "Evaluate a - b",

        detail:
          'The - operator requires numeric behaviour, so "10" is converted to 10. The result is 5.'
      },

      {
        line: 7,
        title: "Print x",

        detail:
          'x contains the string "105", so the console displays 105.'
      },

      {
        line: 8,
        title: "Print y",

        detail:
          "y contains the number 5, so the console displays 5."
      }

    ]
  },

  revision: [

    [
      "JavaScript",
      "A programming language used for application behaviour, computation and interaction."
    ],

    [
      "ECMAScript",
      "The standardized specification defining the JavaScript language."
    ],

    [
      "JavaScript engine",
      "Software responsible for parsing and executing JavaScript."
    ],

    [
      "Runtime",
      "The surrounding environment that provides additional APIs and capabilities."
    ],

    [
      "Primitive",
      "A non-object JavaScript value such as a string, number or boolean."
    ],

    [
      "Object",
      "A non-primitive JavaScript value used to represent structures and behaviour."
    ],

    [
      "const",
      "Use when the variable binding should not be reassigned."
    ],

    [
      "let",
      "Use when a variable needs to be reassigned."
    ],

    [
      "NaN",
      "A special numeric value representing an invalid or unrepresentable numeric result."
    ],

    [
      "null",
      "Usually represents intentional absence of a value."
    ],

    [
      "undefined",
      "Commonly represents a missing or unassigned value."
    ],

    [
      "Truthy",
      "A value that behaves like true in a boolean context."
    ],

    [
      "Falsy",
      "A value that behaves like false in a boolean context."
    ],

    [
      "Type coercion",
      "Conversion of a value from one type to another."
    ],

    [
      "===",
      "Strict equality that does not perform the coercion associated with ==."
    ]

  ],

  interview: [

    {
      question: "What is JavaScript?",

      answer:
        "JavaScript is a high-level programming language standardized through ECMAScript. It is widely used for browser applications, servers and other environments."
    },

    {
      question: "What is ECMAScript?",

      answer:
        "ECMAScript is the standardized specification that defines the JavaScript language."
    },

    {
      question: "What is a JavaScript engine?",

      answer:
        "A JavaScript engine is software that parses, compiles and executes JavaScript code."
    },

    {
      question: "What is a runtime environment?",

      answer:
        "A runtime environment surrounds the JavaScript engine with additional APIs and capabilities provided by the host environment."
    },

    {
      question: "Name the seven primitive data types in JavaScript.",

      answer:
        "string, number, bigint, boolean, undefined, symbol and null."
    },

    {
      question: "Are arrays primitive values?",

      answer:
        "No. Arrays are objects and therefore non-primitive values."
    },

    {
      question: "What is typeof null?",

      answer:
        "typeof null returns object. This is a historical JavaScript quirk retained for compatibility."
    },

    {
      question: "What is the difference between let and const?",

      answer:
        "Both are block scoped. let allows reassignment, while const does not allow reassignment of its binding."
    },

    {
      question: "Does const make an object immutable?",

      answer:
        "No. const prevents reassignment of the variable binding. Properties of the referenced object can still be changed."
    },

    {
      question: "Why is var generally avoided in modern JavaScript?",

      answer:
        "var is function scoped and has older declaration semantics. let and const provide clearer block-scoped behaviour."
    },

    {
      question: "What is NaN?",

      answer:
        "NaN means Not-a-Number. It represents an invalid or unrepresentable numeric result and has the JavaScript type number."
    },

    {
      question: "Why does NaN !== NaN return true?",

      answer:
        "NaN is defined as not being equal to any value, including itself."
    },

    {
      question: "How should you check for NaN?",

      answer:
        "Use Number.isNaN(value) when you want to determine whether a value is actually NaN."
    },

    {
      question: "What is the difference between null and undefined?",

      answer:
        "undefined commonly indicates that a value is missing or unassigned, while null is generally used to represent intentional absence."
    },

    {
      question: "What is type coercion?",

      answer:
        "Type coercion is the conversion of a value from one type to another. It can be explicit or implicit."
    },

    {
      question: "What is the difference between == and ===?",

      answer:
        "== performs equality comparison with coercion, while === performs strict equality without that coercion."
    },

    {
      question: "Why does '10' + 5 produce '105'?",

      answer:
        "The + operator can perform string concatenation. Because one operand is a string, the number participates in string concatenation."
    },

    {
      question: "Why does '10' - 5 produce 5?",

      answer:
        "The - operator performs numeric subtraction, so the string '10' is converted to the number 10."
    },

    {
      question: "Are [] and {} falsy?",

      answer:
        "No. Empty arrays and empty objects are truthy."
    },

    {
      question: "What is a good first step when debugging JavaScript?",

      answer:
        "Reproduce the problem and inspect the relevant values and types before changing the code."
    }

  ],

  practice: [

    {
      title: "Type Detective",

      difficulty: "Easy",

      task:
        "Predict the typeof result for each value before running the code.",

      hints: [
        "Remember that arrays are objects.",
        "Remember the historical typeof null behaviour.",
        "Functions have a special typeof result."
      ]
    },

    {
      title: "Variable State Lab",

      difficulty: "Easy",

      task:
        "Create a program with const studentName and let score. Update score twice and print the final value.",

      hints: [
        "Use const for a value that does not change.",
        "Use let for the changing score."
      ]
    },

    {
      title: "Coercion Lab",

      difficulty: "Easy",

      task:
        "Predict the results of '10' + 5, '10' - 5 and Number('10') + 5. Then explain why the results differ.",

      hints: [
        "Check the type of the first operand.",
        "The + operator can concatenate strings.",
        "Explicit conversion makes numeric intent clearer."
      ]
    },

    {
      title: "Student Profile",

      difficulty: "Easy",

      task:
        "Create a formatted student profile using a template literal containing name, branch, year and CGPA.",

      hints: [
        "Use backticks.",
        "Embed variables using ${expression}."
      ]
    },

    {
      title: "NaN Detector",

      difficulty: "Medium",

      task:
        "Convert several strings to numbers and use Number.isNaN() to detect invalid numeric input.",

      hints: [
        "Number('hello') produces NaN.",
        "Do not use value === NaN."
      ]
    },

    {
      title: "Truthy/Falsy Checker",

      difficulty: "Medium",

      task:
        "Create a list containing 0, 1, '', 'hello', null, undefined, [], and {}. Print Boolean(value) for each.",

      hints: [
        "Empty arrays are truthy.",
        "Empty objects are truthy.",
        "0 and empty strings are falsy."
      ]
    },

    {
      title: "Debug the Cart",

      difficulty: "Medium",

      task:
        "A shopping cart receives quantity as the string '2' and price as the number 500. Fix the calculation so the total is numeric.",

      hints: [
        "Inspect typeof quantity.",
        "Explicitly convert the quantity before multiplication or addition."
      ]
    },

    {
      title: "Foundation Challenge",

      difficulty: "Hard",

      task:
        "Build a Student Result Analyzer using variables, explicit number conversion, total, average, pass/fail logic, template literals and basic validation.",

      hints: [
        "Use const for fixed information.",
        "Use Number() for numeric input stored as text.",
        "Use Number.isNaN() before calculating.",
        "Use === for predictable comparisons."
      ]
    }

  ],

  quiz: [

    {
      question: "Which specification standardizes the JavaScript language?",

      options: [
        "HTML",
        "ECMAScript",
        "CSS",
        "HTTP"
      ],

      answer: 1
    },

    {
      question: "What is the primary job of a JavaScript engine?",

      options: [
        "Style HTML",
        "Execute JavaScript",
        "Store cookies",
        "Create databases"
      ],

      answer: 1
    },

    {
      question: "Which declaration is normally preferred when a binding should not be reassigned?",

      options: [
        "var",
        "let",
        "const",
        "static"
      ],

      answer: 2
    },

    {
      question: "Which of these is a primitive value?",

      options: [
        "[]",
        "{}",
        "42",
        "function() {}"
      ],

      answer: 2
    },

    {
      question: "What is typeof null?",

      options: [
        "null",
        "undefined",
        "object",
        "boolean"
      ],

      answer: 2
    },

    {
      question: "Which value is falsy?",

      options: [
        "[]",
        "{}",
        "\"hello\"",
        "0"
      ],

      answer: 3
    },

    {
      question: "What is the type of NaN?",

      options: [
        "NaN",
        "undefined",
        "number",
        "object"
      ],

      answer: 2
    },

    {
      question: "What is the result of 5 === \"5\"?",

      options: [
        "true",
        "false",
        "5",
        "undefined"
      ],

      answer: 1
    },

    {
      question: "What is the result of \"10\" + 5?",

      options: [
        "15",
        "\"105\"",
        "NaN",
        "Error"
      ],

      answer: 1
    },

    {
      question: "What is the recommended way to check whether a value is NaN?",

      options: [
        "value === NaN",
        "value == NaN",
        "Number.isNaN(value)",
        "typeof value === NaN"
      ],

      answer: 2
    },

    {
      question: "Which value is truthy?",

      options: [
        "0",
        "\"\"",
        "null",
        "[]"
      ],

      answer: 3
    },

    {
      question: "What does const prevent?",

      options: [
        "All object mutations",
        "All property changes",
        "Reassignment of the variable binding",
        "Reading the variable"
      ],

      answer: 2
    }

  ],

  glossary: [

    {
      term: "JavaScript",
      definition:
        "A programming language used for application behaviour and computation."
    },

    {
      term: "ECMAScript",
      definition:
        "The standardized specification defining the JavaScript language."
    },

    {
      term: "Runtime",
      definition:
        "The environment that surrounds the JavaScript engine and provides additional capabilities."
    },

    {
      term: "Primitive",
      definition:
        "A non-object JavaScript value."
    },

    {
      term: "Object",
      definition:
        "A non-primitive JavaScript value."
    },

    {
      term: "Expression",
      definition:
        "JavaScript code that can be evaluated to produce a value."
    },

    {
      term: "Type coercion",
      definition:
        "Conversion of a value from one type to another."
    },

    {
      term: "Truthy",
      definition:
        "A value that behaves as true in a boolean context."
    },

    {
      term: "Falsy",
      definition:
        "A value that behaves as false in a boolean context."
    },

    {
      term: "NaN",
      definition:
        "A special numeric value representing an invalid or unrepresentable numeric result."
    },

    {
      term: "Infinity",
      definition:
        "A special numeric value representing positive infinity."
    },

    {
      term: "Template literal",
      definition:
        "A backtick-delimited string that supports interpolation and multiline text."
    },

    {
      term: "Strict equality",
      definition:
        "Equality comparison using === without the coercion associated with ==."
    }

  ],

  completion: {

    title: "Level 08 Final Challenge",

    message:
      "You are ready to move from JavaScript values and types into control flow, functions and program logic.",

    challenge:
      "Build a Student Result Analyzer. Store student information, convert at least one mark from string to number, validate the conversion with Number.isNaN(), calculate total and average, determine pass/fail, and display the complete result using a template literal. Use const and let appropriately and prefer === for equality checks."
  }

};

console.log("CodeBhavya Level 08 — JavaScript Foundations loaded.");
