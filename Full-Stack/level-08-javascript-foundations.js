"use strict";

/*
  CodeBhavya — Full Stack / MERN
  Level 08 — JavaScript Foundations

  Covers:
  - JavaScript and ECMAScript
  - Runtime and JavaScript engine
  - Values and data types
  - Primitive vs reference values
  - let, const, var
  - Operators and expressions
  - Strings and template literals
  - Numbers, NaN and Infinity
  - null and undefined
  - Truthy / falsy
  - == vs === and type coercion
  - Console debugging
  - JavaScript execution visualizer
  - Value and type tracer
  - Practice
  - Quiz
  - Placement / interview preparation
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[8] = {

  number: 8,

  title: "JavaScript Foundations",

  kicker: "LEVEL 08 · JAVASCRIPT ENGINEERING",

  subtitle:
    "Build a strong mental model of JavaScript values, types, variables, expressions, coercion and runtime execution before moving into control flow and functions.",

  estimatedTime: "5–7 hours",

  duration: "5–7 hours",

  difficulty: "Beginner → Intermediate",

  hero: {
    eyebrow: "PART B · JAVASCRIPT ENGINEERING",

    title: "JavaScript Foundations",

    description:
      "JavaScript is more than syntax. Learn how values are represented, how variables hold them, how expressions are evaluated, and why JavaScript sometimes behaves differently from what you expect.",

    actions: [
      {
        label: "Start Learning",
        target: "concepts"
      },
      {
        label: "Try Practice",
        target: "practice"
      }
    ]
  },

  objectives: [
    "Understand what JavaScript is and how it fits into modern web applications.",
    "Distinguish the JavaScript language, ECMAScript specification, runtime and JavaScript engine.",
    "Identify JavaScript primitive values and understand the role of objects.",
    "Use let, const and var correctly in modern JavaScript.",
    "Understand expressions, operators and evaluation order.",
    "Work confidently with strings, template literals and numbers.",
    "Understand NaN, Infinity, null and undefined without memorizing confusing rules.",
    "Predict truthy and falsy behaviour.",
    "Understand type coercion and the difference between == and ===.",
    "Use the browser console and DevTools for basic JavaScript debugging.",
    "Read simple JavaScript execution traces and predict program output."
  ],

  concepts: [

    {
      id: "js-role",

      title: "1. What JavaScript Actually Is",

      summary:
        "JavaScript is the programming language that adds behaviour and computation to web applications.",

      theory: [
        {
          heading: "JavaScript is a programming language",

          text:
            "HTML describes structure. CSS describes presentation. JavaScript provides programmable behaviour. It can respond to user actions, calculate values, update the DOM, communicate with servers and coordinate asynchronous work."
        },

        {
          heading: "JavaScript is not only a browser language",

          text:
            "JavaScript was originally created for web browsers, but modern runtimes also execute JavaScript outside the browser. Node.js is a major example and is widely used for backend development."
        },

        {
          heading: "JavaScript and ECMAScript",

          text:
            "ECMAScript is the language specification standardized by Ecma International. JavaScript is an implementation of that language specification together with the surrounding runtime environment."
        },

        {
          heading: "Why this distinction matters",

          text:
            "The language defines features such as variables, objects, functions and operators. A runtime provides additional capabilities such as browser APIs, timers, networking APIs or filesystem access."
        }
      ],

      example: {
        language: "javascript",

        code:
`const name = "Bhavya";
const score = 92;

console.log(name);
console.log(score);`,

        explanation:
          "The JavaScript engine evaluates the declarations and expressions, while console.log is provided by the surrounding runtime environment."
      },

      keyPoints: [
        "JavaScript is a programming language.",
        "ECMAScript defines the standardized language.",
        "A JavaScript engine executes JavaScript.",
        "A runtime provides additional environment-specific APIs.",
        "Browsers and Node.js provide different runtime capabilities."
      ]
    },

    {
      id: "runtime-engine",

      title: "2. Runtime, Engine and Execution Basics",

      summary:
        "Understand the basic path from JavaScript source code to observable behaviour.",

      theory: [
        {
          heading: "Source code",

          text:
            "You write JavaScript as source code. The runtime passes that code to a JavaScript engine."
        },

        {
          heading: "JavaScript engine",

          text:
            "The engine is responsible for understanding and executing JavaScript. Modern engines perform parsing, compilation and optimization internally."
        },

        {
          heading: "Runtime environment",

          text:
            "The runtime surrounds the engine with additional capabilities. In a browser, these include APIs related to the DOM, events, timers, storage and networking."
        },

        {
          heading: "Do not confuse the engine with the browser",

          text:
            "The browser is a much larger application. Its JavaScript engine is one component inside it. For example, a browser can provide the DOM while the JavaScript engine executes the language itself."
        }
      ],

      flow: [
        "JavaScript source code",
        "Parse and understand the program",
        "Create internal execution structures",
        "Evaluate expressions and statements",
        "Interact with runtime APIs when required",
        "Produce values or observable effects"
      ],

      example: {
        language: "javascript",

        code:
`const price = 100;
const tax = 18;

const total = price + tax;

console.log(total);`,

        explanation:
          "The engine evaluates the expressions step by step. The final expression produces 118, which is passed to console.log."
      },

      keyPoints: [
        "The engine executes JavaScript.",
        "The runtime supplies environment-specific APIs.",
        "Not every API you call is part of the JavaScript language itself.",
        "A browser runtime and Node.js runtime expose different capabilities."
      ]
    },

    {
      id: "values-types",

      title: "3. Values and Data Types",

      summary:
        "Everything your JavaScript program works with is represented through values.",

      theory: [
        {
          heading: "A value is data",

          text:
            "Examples include 25, true, 'CodeBhavya', undefined and objects. JavaScript operations work by producing, transforming and consuming values."
        },

        {
          heading: "Primitive values",

          text:
            "JavaScript has seven primitive data types: string, number, bigint, boolean, undefined, symbol and null."
        },

        {
          heading: "Objects",

          text:
            "Objects are non-primitive values. Arrays, functions, dates and many other structures are objects in JavaScript."
        },

        {
          heading: "typeof",

          text:
            "The typeof operator can help inspect a value's type, but it has historical quirks. Most importantly, typeof null returns 'object'."
        }
      ],

      comparison: {
        title: "Primitive vs object",

        columns: [
          {
            heading: "Primitive",

            points: [
              "string",
              "number",
              "bigint",
              "boolean",
              "undefined",
              "symbol",
              "null"
            ]
          },
          {
            heading: "Non-primitive",

            points: [
              "object",
              "array",
              "function",
              "date",
              "map",
              "set"
            ]
          }
        ]
      },

      example: {
        language: "javascript",

        code:
`console.log(typeof "Hello");
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);

console.log(typeof {});
console.log(typeof []);
console.log(typeof function () {});`,

        expected:
`string
number
boolean
undefined
object
object
object
function`,

        explanation:
          "Arrays are objects, functions have their own typeof result, and typeof null === 'object' is a historical JavaScript quirk."
      },

      keyPoints: [
        "JavaScript has seven primitive types.",
        "Objects are non-primitive values.",
        "Arrays are objects.",
        "Functions are callable objects.",
        "typeof null is 'object' because of a historical language quirk."
      ]
    },

    {
      id: "variables",

      title: "4. Variables: let, const and var",

      summary:
        "Variables provide names through which your program can work with values.",

      theory: [
        {
          heading: "const",

          text:
            "Use const when the variable binding should not be reassigned. const does not make an object or array immutable; it prevents reassignment of the variable itself."
        },

        {
          heading: "let",

          text:
            "Use let when a variable needs to be reassigned later."
        },

        {
          heading: "var",

          text:
            "var is an older declaration mechanism. Modern JavaScript normally prefers let and const because they have block scope and clearer declaration behaviour."
        },

        {
          heading: "Temporal Dead Zone",

          text:
            "Variables declared with let and const exist in their block but cannot be accessed before their declaration is evaluated. Accessing them during this period produces a ReferenceError."
        }
      ],

      example: {
        language: "javascript",

        code:
`const college = "CodeBhavya";
let score = 80;

score = 92;

console.log(college);
console.log(score);`,

        explanation:
          "college cannot be reassigned, while score can be updated."
      },

      comparison: {
        title: "let vs const vs var",

        columns: [
          {
            heading: "const",

            points: [
              "Block scoped",
              "Cannot be reassigned",
              "Preferred default"
            ]
          },
          {
            heading: "let",

            points: [
              "Block scoped",
              "Can be reassigned",
              "Use when state changes"
            ]
          },
          {
            heading: "var",

            points: [
              "Function scoped",
              "Can be reassigned",
              "Legacy code compatibility"
            ]
          }
        ]
      },

      example2: {
        language: "javascript",

        code:
`const student = {
  name: "Ravi"
};

student.name = "Kiran";

console.log(student.name);`,

        explanation:
          "The object can be changed even though the variable is declared with const. The binding remains fixed; the object itself is not automatically frozen."
      },

      keyPoints: [
        "Prefer const by default.",
        "Use let when reassignment is necessary.",
        "Avoid var in modern application code unless there is a specific reason.",
        "const does not mean deeply immutable.",
        "let and const have block scope."
      ]
    },

    {
      id: "operators-expressions",

      title: "5. Operators and Expressions",

      summary:
        "Expressions produce values. Operators tell JavaScript how values should be combined or transformed.",

      theory: [
        {
          heading: "Expression",

          text:
            "An expression is code that can be evaluated to produce a value. For example, 10 + 5 is an expression whose result is 15."
        },

        {
          heading: "Arithmetic operators",

          text:
            "Common arithmetic operators include +, -, *, /, %, ** and unary + or -."
        },

        {
          heading: "Comparison operators",

          text:
            "Comparison operators such as >, <, >= and <= compare values and produce a boolean result."
        },

        {
          heading: "Logical operators",

          text:
            "&&, || and ! are commonly used to combine or transform conditions. They can also return operand values rather than simply true or false."
        },

        {
          heading: "Assignment",

          text:
            "Operators such as =, +=, -=, *= and /= assign or update variable values."
        }
      ],

      example: {
        language: "javascript",

        code:
`const a = 10;
const b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);
console.log(a ** b);

console.log(a > b);
console.log(a === b);`,

        explanation:
          "Arithmetic expressions produce numbers while comparison expressions produce booleans."
      },

      keyPoints: [
        "Expressions produce values.",
        "Arithmetic operators work with numbers and can interact with strings.",
        "Comparison operators produce boolean results.",
        "Logical operators can return one of their operands.",
        "Operator precedence determines how combined expressions are evaluated."
      ]
    },

    {
      id: "strings",

      title: "6. Strings and Template Literals",

      summary:
        "Strings represent text and are one of the most frequently used JavaScript values.",

      theory: [
        {
          heading: "Creating strings",

          text:
            "Strings can be written using single quotes, double quotes or backticks."
        },

        {
          heading: "Template literals",

          text:
            "Backticks create template literals. They allow embedded expressions using ${...} and make multiline strings easier to write."
        },

        {
          heading: "Strings are primitive",

          text:
            "A string is a primitive value. String methods create new values rather than directly changing the original primitive."
        },

        {
          heading: "Useful operations",

          text:
            "Common operations include length, toUpperCase(), toLowerCase(), includes(), startsWith(), endsWith(), slice() and trim()."
        }
      ],

      example: {
        language: "javascript",

        code:
`const name = "Bhavya";
const course = "Full Stack";

const message = \`Welcome ${name}!
You are learning ${course}.\`;

console.log(message);`,

        explanation:
          "Template literals allow expressions to be embedded directly into a string."
      },

      example2: {
        language: "javascript",

        code:
`const text = "  JavaScript  ";

console.log(text.length);
console.log(text.trim());
console.log(text.toUpperCase());
console.log(text.includes("Script"));`,

        explanation:
          "String methods return new values. They do not mutate the original primitive string."
      },

      keyPoints: [
        "Strings are primitive values.",
        "Template literals use backticks.",
        "Use ${expression} for interpolation.",
        "String methods return useful results.",
        "trim(), includes(), slice() and case-conversion methods are common."
      ]
    },

    {
      id: "numbers",

      title: "7. Numbers, NaN and Infinity",

      summary:
        "JavaScript's number type handles ordinary numbers as well as special numeric values.",

      theory: [
        {
          heading: "One number type",

          text:
            "JavaScript uses the number type for ordinary numeric values such as integers and floating-point numbers."
        },

        {
          heading: "NaN",

          text:
            "NaN means Not-a-Number. It represents an invalid or unrepresentable numeric result. Despite its name, NaN itself has the JavaScript type number."
        },

        {
          heading: "Infinity",

          text:
            "Infinity represents a mathematical value larger than finite JavaScript numbers. -Infinity represents negative infinity."
        },

        {
          heading: "Number.isNaN",

          text:
            "Number.isNaN(value) is a reliable way to check whether a value is actually NaN without performing broad type coercion."
        }
      ],

      example: {
        language: "javascript",

        code:
`console.log(10 / 2);
console.log(10 / 0);
console.log(-10 / 0);

console.log(Number("hello"));
console.log(typeof NaN);
console.log(Number.isNaN(NaN));`,

        expected:
`5
Infinity
-Infinity
NaN
number
true`,

        explanation:
          "NaN is still a number according to JavaScript's type system."
      },

      example2: {
        language: "javascript",

        code:
`const result = Number("CodeBhavya");

if (Number.isNaN(result)) {
  console.log("Conversion failed");
}`,

        explanation:
          "Number.isNaN is useful when validating a numeric conversion."
      },

      keyPoints: [
        "JavaScript has a number type for ordinary numeric values.",
        "NaN has typeof 'number'.",
        "NaN !== NaN.",
        "Use Number.isNaN(value) to detect actual NaN.",
        "Division by zero can produce Infinity."
      ]
    },

    {
      id: "null-undefined",

      title: "8. null vs undefined",

      summary:
        "These values both represent absence, but they communicate different ideas.",

      theory: [
        {
          heading: "undefined",

          text:
            "undefined commonly means that a value has not been provided or a variable/property does not currently contain a value."
        },

        {
          heading: "null",

          text:
            "null is an intentional empty value. A programmer can explicitly assign null when they want to represent the absence of an object or value."
        },

        {
          heading: "Example",

          text:
            "A missing function argument may be undefined, while an application may deliberately set selectedUser = null to represent that no user is currently selected."
        }
      ],

      comparison: {
        title: "null and undefined",

        columns: [
          {
            heading: "undefined",

            points: [
              "Value is missing or not assigned",
              "Often produced automatically",
              "typeof → undefined"
            ]
          },
          {
            heading: "null",

            points: [
              "Intentional empty value",
              "Explicitly assigned",
              "typeof → object (historical quirk)"
            ]
          }
        ]
      },

      example: {
        language: "javascript",

        code:
`let username;

const selectedUser = null;

console.log(username);
console.log(selectedUser);

console.log(typeof username);
console.log(typeof selectedUser);`,

        expected:
`undefined
null
undefined
object`,

        explanation:
          "The final result demonstrates the historical typeof null quirk."
      },

      keyPoints: [
        "undefined often means a value is missing or not initialized.",
        "null is usually an intentional empty value.",
        "typeof null is 'object'.",
        "Do not treat null and undefined as identical concepts."
      ]
    },

    {
      id: "truthy-falsy",

      title: "9. Truthy, Falsy and Equality",

      summary:
        "JavaScript converts values to boolean contexts, and this is a major source of both power and confusion.",

      theory: [
        {
          heading: "Falsy values",

          text:
            "The main falsy values are false, 0, -0, 0n, an empty string, null, undefined and NaN."
        },

        {
          heading: "Truthy values",

          text:
            "Most other values are truthy. Importantly, empty arrays [] and empty objects {} are truthy."
        },

        {
          heading: "Strict equality",

          text:
            "=== compares values without performing the type coercion used by ==. It is generally the preferred equality operator in application code."
        },

        {
          heading: "Loose equality",

          text:
            "== can convert operands before comparing them. This can produce surprising results if you do not know the coercion rules."
        }
      ],

      example: {
        language: "javascript",

        code:
`console.log(Boolean(0));
console.log(Boolean(""));
console.log(Boolean(null));
console.log(Boolean(undefined));
console.log(Boolean(NaN));

console.log(Boolean([]));
console.log(Boolean({}));`,

        expected:
`false
false
false
false
false
true
true`,

        explanation:
          "Empty arrays and empty objects are objects and are truthy."
      },

      example2: {
        language: "javascript",

        code:
`console.log(5 === "5");
console.log(5 == "5");

console.log(false === 0);
console.log(false == 0);`,

        expected:
`false
true
false
true`,

        explanation:
          "Loose equality can perform type coercion. Strict equality does not."
      },

      keyPoints: [
        "0, '', false, null, undefined and NaN are falsy.",
        "[] and {} are truthy.",
        "=== avoids equality coercion.",
        "== performs coercion according to JavaScript's equality rules.",
        "Prefer === unless you deliberately need loose equality."
      ]
    },

    {
      id: "coercion",

      title: "10. Type Coercion",

      summary:
        "JavaScript sometimes converts one type into another during an operation.",

      theory: [
        {
          heading: "Explicit coercion",

          text:
            "You explicitly request a conversion using functions such as Number(), String() and Boolean()."
        },

        {
          heading: "Implicit coercion",

          text:
            "JavaScript may automatically convert values during certain operations, especially with operators and loose equality."
        },

        {
          heading: "The + operator",

          text:
            "The + operator can perform numeric addition or string concatenation. When strings are involved, the result can become a string."
        }
      ],

      example: {
        language: "javascript",

        code:
`console.log(Number("42"));
console.log(String(42));
console.log(Boolean(1));

console.log("10" + 5);
console.log("10" - 5);
console.log("10" * 2);`,

        expected:
`42
42
true
105
5
20`,

        explanation:
          "The + operator concatenates when string conversion is involved, while - and * require numeric conversion."
      },

      example2: {
        language: "javascript",

        code:
`console.log("5" + 2);
console.log("5" - 2);

console.log(0 == false);
console.log(0 === false);`,

        explanation:
          "These examples show why coercion must be understood rather than guessed."
      },

      keyPoints: [
        "Explicit conversion is easier to reason about.",
        "String + number can produce a string.",
        "Arithmetic operators such as - and * commonly trigger numeric conversion.",
        "Loose equality performs coercion.",
        "Use === for predictable equality checks."
      ]
    },

    {
      id: "debugging",

      title: "11. Debugging with the Console and DevTools",

      summary:
        "Professional JavaScript development requires inspecting values instead of guessing.",

      theory: [
        {
          heading: "console.log",

          text:
            "Use console.log to inspect values and understand program behaviour."
        },

        {
          heading: "console.table",

          text:
            "console.table is especially useful for arrays and collections of objects."
        },

        {
          heading: "typeof and value inspection",

          text:
            "When debugging unexpected behaviour, inspect both the value and its type."
        },

        {
          heading: "Breakpoints",

          text:
            "Browser DevTools can pause JavaScript execution at selected lines. You can then inspect variables and follow execution interactively."
        },

        {
          heading: "A professional debugging habit",

          text:
            "Do not randomly change code until it works. First reproduce the problem, inspect relevant values, identify the incorrect assumption, make one focused change and test again."
        }
      ],

      example: {
        language: "javascript",

        code:
`const quantity = "5";
const price = 100;

console.log("quantity:", quantity);
console.log("quantity type:", typeof quantity);

const total = quantity * price;

console.log("total:", total);
console.log("total type:", typeof total);`,

        explanation:
          "Inspecting both value and type makes coercion visible instead of mysterious."
      },

      keyPoints: [
        "Inspect values before changing code.",
        "Use typeof when a type-related bug is suspected.",
        "Use breakpoints for step-by-step inspection.",
        "console.table is useful for structured collections.",
        "Debugging is a reasoning process, not trial and error."
      ]
    }

  ],

  executionVisualizer: {

    title: "JavaScript Execution Visualizer",

    description:
      "Follow a small JavaScript program from source code to evaluated values.",

    code:
`const price = 100;
const quantity = 3;

const total = price * quantity;

console.log(total);`,

    steps: [
      {
        line: 1,
        title: "Read the declaration",

        operation: "const price = 100",

        explanation:
          "JavaScript evaluates the initializer 100 and associates the resulting value with the variable binding price."
      },

      {
        line: 2,
        title: "Read the next declaration",

        operation: "const quantity = 3",

        explanation:
          "The value 3 is evaluated and associated with quantity."
      },

      {
        line: 4,
        title: "Evaluate the expression",

        operation: "price * quantity",

        explanation:
          "JavaScript retrieves the values stored under price and quantity, multiplies 100 by 3 and produces 300."
      },

      {
        line: 4,
        title: "Store the result",

        operation: "const total = 300",

        explanation:
          "The resulting value 300 becomes the value associated with total."
      },

      {
        line: 6,
        title: "Call console.log",

        operation: "console.log(total)",

        explanation:
          "The runtime's console API receives the value 300 and displays it."
      }
    ]
  },

  visualizer: {

    title: "JavaScript Execution Visualizer",

    description:
      "Step through declarations and expressions to understand where values come from.",

    code:
`const price = 100;
const quantity = 3;
const discount = 20;

const subtotal = price * quantity;
const finalPrice = subtotal - discount;

console.log(finalPrice);`,

    steps: [
      {
        line: 1,
        label: "Create price",
        value: "price → 100",
        explanation: "The numeric value 100 is assigned to price."
      },
      {
        line: 2,
        label: "Create quantity",
        value: "quantity → 3",
        explanation: "The numeric value 3 is assigned to quantity."
      },
      {
        line: 3,
        label: "Create discount",
        value: "discount → 20",
        explanation: "The numeric value 20 is assigned to discount."
      },
      {
        line: 5,
        label: "Calculate subtotal",
        value: "100 × 3 → 300",
        explanation: "price and quantity are read and multiplied."
      },
      {
        line: 6,
        label: "Calculate final price",
        value: "300 − 20 → 280",
        explanation: "The discount is subtracted from the subtotal."
      },
      {
        line: 8,
        label: "Display result",
        value: "280",
        explanation: "console.log receives the final value."
      }
    ]
  },

  trace: {

    title: "Value & Type Tracer",

    description:
      "Track the value and type of expressions that commonly confuse JavaScript beginners.",

    code:
`const a = "10";
const b = 5;

const x = a + b;
const y = a - b;

console.log(x);
console.log(y);`,

    steps: [
      {
        line: 1,
        operation: 'const a = "10"',
        value: '"10"',
        type: "string",
        explanation:
          "The variable a contains the string value 10."
      },
      {
        line: 2,
        operation: "const b = 5",
        value: "5",
        type: "number",
        explanation:
          "The variable b contains the numeric value 5."
      },
      {
        line: 4,
        operation: "a + b",
        value: '"105"',
        type: "string",
        explanation:
          "Because a is a string, + performs string concatenation in this expression."
      },
      {
        line: 5,
        operation: "a - b",
        value: "5",
        type: "number",
        explanation:
          "The - operator requires numeric behaviour, so the string '10' is converted to the number 10."
      },
      {
        line: 7,
        operation: "console.log(x)",
        value: '"105"',
        type: "string",
        explanation:
          "The first output is the string 105."
      },
      {
        line: 8,
        operation: "console.log(y)",
        value: "5",
        type: "number",
        explanation:
          "The second output is the number 5."
      }
    ]
  },

  examples: [

    {
      title: "Value and type inspection",

      language: "javascript",

      code:
`const age = 21;
const name = "Bhavya";
const active = true;

console.log(age, typeof age);
console.log(name, typeof name);
console.log(active, typeof active);`,

      explanation:
        "Always remember that a value and its type are separate pieces of information."
    },

    {
      title: "const does not freeze objects",

      language: "javascript",

      code:
`const student = {
  name: "Anil",
  score: 80
};

student.score = 95;

console.log(student);`,

      explanation:
        "The student binding cannot point to another object, but properties inside the object can still change."
    },

    {
      title: "Truthy and falsy",

      language: "javascript",

      code:
`const username = "";

if (username) {
  console.log("Username available");
} else {
  console.log("Username missing");
}`,

      explanation:
        "An empty string is falsy, so the else branch executes."
    },

    {
      title: "Strict equality",

      language: "javascript",

      code:
`const input = "100";

console.log(input === 100);
console.log(Number(input) === 100);`,

      explanation:
        "The first comparison is false because the types differ. Explicit conversion makes the second comparison true."
    }

  ],

  practice: {

    title: "JavaScript Foundations Practice Arena",

    description:
      "Solve these problems without looking at the answer first. Use the browser console or CodeBhavya Compiler where appropriate.",

    levels: [

      {
        id: "type-detective",

        title: "Type Detective",

        difficulty: "Easy",

        story:
          "A student receives values from different parts of an application. Your job is to identify the value and its JavaScript type.",

        task:
`const values = [
  "CodeBhavya",
  42,
  true,
  null,
  undefined,
  [],
  {}
];

for (const value of values) {
  console.log(value, typeof value);
}`,

        questions: [
          "Which values are primitives?",
          "Why does typeof null return object?",
          "What does typeof [] return?"
        ]
      },

      {
        id: "variable-state",

        title: "Variable State Lab",

        difficulty: "Easy",

        story:
          "Track the changing marks of a student.",

        task:
`let marks = 70;

marks = marks + 10;
marks += 5;

console.log(marks);`,

        questions: [
          "What is the final value?",
          "Why is let required here?",
          "Could the declaration use const?"
        ]
      },

      {
        id: "coercion-lab",

        title: "Coercion Lab",

        difficulty: "Easy",

        story:
          "An online form sends numeric input as strings. Predict what JavaScript does with the values.",

        task:
`const quantity = "4";
const price = 250;

console.log(quantity + price);
console.log(quantity * price);
console.log(Number(quantity) + price);`,

        questions: [
          "Predict all three outputs.",
          "Which operation performs string concatenation?",
          "How would you make the intended numeric behaviour explicit?"
        ]
      },

      {
        id: "profile-card",

        title: "Template Literal Profile Card",

        difficulty: "Easy",

        story:
          "Create a small student profile message using template literals.",

        task:
`const name = "Ravi";
const branch = "CSE-AI&ML";
const year = 3;

const profile = \`
Name: ${name}
Branch: ${branch}
Year: ${year}
\`;

console.log(profile);`,

        questions: [
          "Why are backticks used?",
          "What does ${name} do?",
          "How would you add CGPA?"
        ]
      },

      {
        id: "nan-detector",

        title: "NaN Detector",

        difficulty: "Medium",

        story:
          "An application converts user input into numbers. Detect failed conversions safely.",

        task:
`const inputs = ["42", "100", "hello", "25"];

for (const input of inputs) {
  const value = Number(input);

  if (Number.isNaN(value)) {
    console.log(input, "is invalid");
  } else {
    console.log(input, value);
  }
}`,

        questions: [
          "Why does Number('hello') produce NaN?",
          "Why is Number.isNaN preferable here?",
          "What is typeof NaN?"
        ]
      },

      {
        id: "truthy-checker",

        title: "Truthy / Falsy Checker",

        difficulty: "Medium",

        story:
          "Build a utility that reports whether a value behaves as truthy or falsy.",

        task:
`const values = [
  0,
  1,
  "",
  "hello",
  null,
  undefined,
  [],
  {}
];

for (const value of values) {
  console.log(value, Boolean(value));
}`,

        questions: [
          "Which values are falsy?",
          "Why is [] truthy?",
          "Why is {} truthy?"
        ]
      },

      {
        id: "debugging-lab",

        title: "Debugging Lab",

        difficulty: "Medium",

        story:
          "A shopping cart calculates a strange total. Find the reason.",

        task:
`const quantity = "2";
const price = 500;

const total = quantity + price;

console.log("Total:", total);`,

        questions: [
          "What output does this produce?",
          "What is the type of quantity?",
          "How would you fix the calculation?"
        ]
      },

      {
        id: "foundation-challenge",

        title: "Foundation Challenge",

        difficulty: "Hard",

        story:
          "Create a student result summary that demonstrates variables, numbers, strings, booleans, conversion and template literals.",

        task:
`const studentName = "Bhavya";
const maths = "85";
const programming = 92;
const active = true;

const mathsMarks = Number(maths);
const total = mathsMarks + programming;
const average = total / 2;

const result = average >= 40;

console.log(\`
Student: ${studentName}
Total: ${total}
Average: ${average}
Active: ${active}
Pass: ${result}
\`);`,

        questions: [
          "Which variable requires explicit conversion?",
          "What is the final average?",
          "Which values are strings?",
          "Which values are numbers?",
          "What would happen if maths contained 'hello'?"
        ]
      }

    ]
  },

  quiz: {

    title: "Level 08 Knowledge Check",

    description:
      "Test whether you understand the concepts rather than simply remembering syntax.",

    questions: [

      {
        question: "Which language specification standardizes JavaScript?",

        options: [
          "HTML",
          "ECMAScript",
          "CSS",
          "HTTP"
        ],

        answer: 1,

        explanation:
          "ECMAScript is the standardized language specification implemented by JavaScript engines."
      },

      {
        question: "What is the primary role of a JavaScript engine?",

        options: [
          "Style HTML",
          "Store browser cookies",
          "Execute JavaScript",
          "Create database tables"
        ],

        answer: 2,

        explanation:
          "A JavaScript engine parses and executes JavaScript code."
      },

      {
        question: "Which declaration is normally preferred when a variable should not be reassigned?",

        options: [
          "var",
          "let",
          "const",
          "static"
        ],

        answer: 2,

        explanation:
          "const communicates that the variable binding should not be reassigned."
      },

      {
        question: "What is typeof null?",

        options: [
          "null",
          "undefined",
          "object",
          "boolean"
        ],

        answer: 2,

        explanation:
          "typeof null returns object because of a historical JavaScript language quirk."
      },

      {
        question: "Which value is falsy?",

        options: [
          "[]",
          "{}",
          "\"hello\"",
          "0"
        ],

        answer: 3,

        explanation:
          "0 is falsy. Empty arrays and empty objects are truthy."
      },

      {
        question: "What does NaN represent?",

        options: [
          "A string",
          "An invalid numeric result",
          "An empty object",
          "A boolean"
        ],

        answer: 1,

        explanation:
          "NaN represents an invalid or unrepresentable numeric result and has type number."
      },

      {
        question: "What is the result of 5 === \"5\"?",

        options: [
          "true",
          "false",
          "5",
          "undefined"
        ],

        answer: 1,

        explanation:
          "Strict equality requires both compatible value and type, so number 5 and string '5' are not strictly equal."
      },

      {
        question: "What is the result of \"10\" + 5?",

        options: [
          "15",
          "\"105\"",
          "NaN",
          "Error"
        ],

        answer: 1,

        explanation:
          "The + operator performs string concatenation when string conversion is involved."
      },

      {
        question: "Which is the safest common way to check whether a value is actually NaN?",

        options: [
          "value === NaN",
          "value == NaN",
          "Number.isNaN(value)",
          "typeof value === NaN"
        ],

        answer: 2,

        explanation:
          "NaN is not equal to itself, so Number.isNaN is the appropriate check."
      },

      {
        question: "Which value is truthy?",

        options: [
          "0",
          "\"\"",
          "null",
          "[]"
        ],

        answer: 3,

        explanation:
          "Arrays, including empty arrays, are objects and are truthy."
      },

      {
        question: "What does const prevent?",

        options: [
          "All object changes",
          "All mutations",
          "Reassignment of the variable binding",
          "Reading the variable"
        ],

        answer: 2,

        explanation:
          "const prevents reassignment of the binding; it does not automatically freeze referenced objects."
      },

      {
        question: "Which operator generally avoids type coercion during equality comparison?",

        options: [
          "==",
          "===",
          "=",
          "+="
        ],

        answer: 1,

        explanation:
          "=== performs strict equality without the coercion performed by ==."
      }

    ]
  },

  interview: {

    title: "Placement & Interview Preparation",

    questions: [

      {
        question: "What is JavaScript?",

        answer:
          "JavaScript is a high-level programming language standardized through ECMAScript and widely used for web applications as well as server-side and other environments."
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
          "A runtime provides the environment in which JavaScript executes, including APIs and capabilities surrounding the JavaScript engine."
      },

      {
        question: "Name the seven primitive data types.",

        answer:
          "string, number, bigint, boolean, undefined, symbol and null."
      },

      {
        question: "Are arrays primitive values?",

        answer:
          "No. Arrays are objects and therefore non-primitive values."
      },

      {
        question: "Why does typeof null return object?",

        answer:
          "It is a historical quirk of JavaScript that has been retained for compatibility."
      },

      {
        question: "What is the difference between let and const?",

        answer:
          "Both are block scoped. let permits reassignment, while const does not permit reassignment of its binding."
      },

      {
        question: "Does const make an object immutable?",

        answer:
          "No. const prevents reassignment of the variable binding. Properties of the referenced object can still be changed unless the object is separately made immutable."
      },

      {
        question: "Why should modern code generally prefer let and const over var?",

        answer:
          "let and const provide block scope and clearer declaration semantics, making modern code easier to reason about."
      },

      {
        question: "What is NaN?",

        answer:
          "NaN means Not-a-Number and represents an invalid or unrepresentable numeric result. Its JavaScript type is number."
      },

      {
        question: "Why does NaN !== NaN evaluate to true?",

        answer:
          "NaN is defined as not being equal to any value, including itself."
      },

      {
        question: "How should NaN normally be checked?",

        answer:
          "Use Number.isNaN(value) when you want to determine whether a value is actually NaN."
      },

      {
        question: "What is the difference between null and undefined?",

        answer:
          "undefined commonly indicates that a value is missing or has not been assigned, while null is usually an intentional representation of an empty value."
      },

      {
        question: "What is type coercion?",

        answer:
          "Type coercion is the conversion of a value from one type to another. It can be explicit, such as Number('10'), or implicit, such as conversions performed during some operators."
      },

      {
        question: "What is the difference between == and ===?",

        answer:
          "== allows equality coercion, while === performs strict equality without that coercion."
      },

      {
        question: "Why is '10' + 5 equal to '105'?",

        answer:
          "Because + can perform string concatenation and the presence of a string causes the other operand to participate in string concatenation."
      },

      {
        question: "Are empty arrays and empty objects falsy?",

        answer:
          "No. Both [] and {} are truthy."
      },

      {
        question: "What are the main falsy values?",

        answer:
          "false, 0, -0, 0n, empty string, null, undefined and NaN."
      },

      {
        question: "How would you debug an unexpected JavaScript value?",

        answer:
          "First reproduce the issue, then inspect the value and its type using tools such as console.log and typeof, use breakpoints when useful, identify the incorrect assumption and make a focused correction."
      }

    ]
  },

  revision: {

    title: "Level 08 Revision",

    summary:
      "The most important ideas from JavaScript Foundations.",

    points: [
      "JavaScript is a programming language standardized through ECMAScript.",
      "A JavaScript engine executes JavaScript.",
      "A runtime provides additional environment-specific APIs.",
      "Primitive types are string, number, bigint, boolean, undefined, symbol and null.",
      "Objects are non-primitive values.",
      "Arrays and functions are objects.",
      "typeof null is object because of a historical quirk.",
      "Prefer const by default and let when reassignment is required.",
      "var is mainly encountered in legacy code.",
      "Expressions evaluate to values.",
      "Template literals use backticks and support interpolation.",
      "NaN is a number type representing an invalid numeric result.",
      "Number.isNaN is useful for detecting actual NaN.",
      "null usually represents intentional absence.",
      "undefined commonly represents missing or unassigned data.",
      "0, empty string, false, null, undefined and NaN are falsy.",
      "Empty arrays and empty objects are truthy.",
      "=== is generally preferred over == for predictable equality.",
      "Type coercion can be explicit or implicit.",
      "Debugging should begin with observation rather than guessing."
    ]
  },

  glossary: [

    {
      term: "JavaScript",
      definition:
        "A programming language widely used for interactive web applications and many other environments."
    },

    {
      term: "ECMAScript",
      definition:
        "The standardized specification that defines the JavaScript language."
    },

    {
      term: "JavaScript engine",
      definition:
        "Software responsible for parsing, compiling and executing JavaScript."
    },

    {
      term: "Runtime",
      definition:
        "The environment surrounding the JavaScript engine that provides additional APIs and capabilities."
    },

    {
      term: "Primitive",
      definition:
        "A non-object value such as a string, number or boolean."
    },

    {
      term: "Object",
      definition:
        "A non-primitive JavaScript value that can represent collections, structures and behaviour."
    },

    {
      term: "Variable binding",
      definition:
        "A named association through which JavaScript code accesses a value."
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
        "A value that behaves as true when JavaScript expects a boolean context."
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
        "A string written with backticks that supports interpolation and multiline text."
    },

    {
      term: "Strict equality",
      definition:
        "Equality comparison using === without the type coercion performed by ==."
    }
  ],

  completion: {

    title: "Level 08 Final Challenge",

    description:
      "Build a small Student Result Analyzer using only the foundations learned in this level.",

    requirements: [
      "Create constants for student name, branch and roll number.",
      "Store at least three marks.",
      "Include at least one mark supplied as a string and explicitly convert it to a number.",
      "Calculate total and average.",
      "Determine whether the student passed using a boolean expression.",
      "Create a formatted result using a template literal.",
      "Display both the result and at least one value's type using typeof.",
      "Handle invalid numeric input using Number.isNaN.",
      "Use const and let appropriately.",
      "Avoid unnecessary use of ==."
    ],

    starterCode:
`const studentName = "Bhavya";
const branch = "CSE-AI&ML";

const maths = "85";
const programming = 92;
const dataStructures = 88;

// Convert and validate marks here.

// Calculate total and average.

// Decide pass/fail.

// Create a formatted result.

// Display the result.
`,

    successCriteria: [
      "The program produces the correct total.",
      "The average is calculated correctly.",
      "The program correctly identifies pass/fail.",
      "String input is converted safely.",
      "Invalid numeric input does not silently produce a misleading result.",
      "The output is formatted using a template literal.",
      "The solution demonstrates clear JavaScript fundamentals."
    ]
  }

};

console.log("CodeBhavya Level 08 — JavaScript Foundations loaded.");
