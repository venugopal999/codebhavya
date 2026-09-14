"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 13 — MODULES & ERROR DESIGN

  ES Modules, import/export, module boundaries,
  custom errors, validation, defensive programming
  and maintainable browser architecture.
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[13] = {

  number: 13,

  title: "Modules & Error Design",

  kicker: "JavaScript Engineering · Level 13",

  subtitle:
    "Organize JavaScript into modules, design clear boundaries, validate data and handle failures with professional error strategies.",

  estimatedTime: "4–5 hours",

  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 13 · PROFESSIONAL JAVASCRIPT",
    description:
      "Large JavaScript applications become difficult to maintain when every " +
      "function, variable and API operation lives in one file. ES modules provide " +
      "boundaries that make code easier to understand, reuse and test. In this level, " +
      "you will learn import/export, named and default exports, module design, " +
      "validation, custom errors, defensive programming and application-level error handling."
  },

  objectives: [

    "Understand why JavaScript modules are necessary.",

    "Understand module scope.",

    "Use named exports and imports.",

    "Use default exports and imports.",

    "Understand the difference between named and default exports.",

    "Use aliases when importing or exporting.",

    "Understand live bindings in ES modules.",

    "Understand module dependency relationships.",

    "Design modules around responsibilities.",

    "Separate UI, API and data logic.",

    "Avoid unnecessary circular dependencies.",

    "Understand browser module scripts.",

    "Understand dynamic import().",

    "Validate data at application boundaries.",

    "Understand thrown errors.",

    "Create custom Error classes.",

    "Use error.name, message and stack appropriately.",

    "Distinguish expected failures from programming bugs.",

    "Use defensive programming carefully.",

    "Design centralized error handling.",

    "Build maintainable JavaScript architecture.",

    "Prepare JavaScript code for the transition to React and Node.js."

  ],


  sections: [

    {
      number: 1,

      title: "Why Modules Matter",

      intro:
        "A small JavaScript file can eventually become hundreds or thousands of lines long.",

      explanation:
        "Without clear boundaries, unrelated functionality becomes tightly coupled. " +
        "Modules allow developers to group related functionality and explicitly control " +
        "what other parts of an application can access.",

      comparison: {
        headers: [
          "Single large file",
          "Modular application"
        ],

        rows: [
          [
            "Many unrelated responsibilities",
            "Related responsibilities grouped together"
          ],
          [
            "Harder to locate code",
            "Files communicate purpose"
          ],
          [
            "Hidden dependencies",
            "Explicit imports and exports"
          ],
          [
            "Difficult to test independently",
            "Individual modules can be tested"
          ],
          [
            "Higher coupling",
            "Clearer boundaries"
          ]
        ]
      },

      keyIdea:
        "Modules are not simply about splitting files. They are about creating meaningful boundaries between responsibilities."
    },


    {
      number: 2,

      title: "Module Scope",

      intro:
        "Variables declared inside an ES module are not automatically global.",

      code:
`const apiBase =
  "/api";

function getCourses() {
  return fetch(
    apiBase + "/courses"
  );
}`,

      explanation:
        "Module-level variables belong to the module unless explicitly exported. " +
        "This prevents unrelated scripts from accidentally depending on internal variables.",

      comparison: {
        headers: [
          "Global-style code",
          "Module code"
        ],

        rows: [
          [
            "Names can collide",
            "Names are scoped to the module"
          ],
          [
            "Hidden communication",
            "Explicit imports and exports"
          ],
          [
            "More accidental coupling",
            "Clear dependency boundaries"
          ]
        ]
      },

      keyIdea:
        "A good module exposes only the functionality that other parts of the application actually need."
    },


    {
      number: 3,

      title: "Named Exports",

      intro:
        "Named exports allow a module to expose specific values or functions.",

      code:
`export function formatPrice(price) {

  return "₹" + price.toFixed(2);

}

export function formatDate(date) {

  return date.toLocaleDateString();

}`,

      explanation:
        "A module can provide multiple named exports. Consumers import them using their exported names unless they choose an alias.",

      keyIdea:
        "Named exports make the public API of a module explicit."
    },


    {
      number: 4,

      title: "Named Imports",

      intro:
        "Named exports are imported using matching names inside curly braces.",

      code:
`import {
  formatPrice,
  formatDate
} from "./formatters.js";

console.log(
  formatPrice(499)
);

console.log(
  formatDate(new Date())
);`,

      methods: [
        {
          name: "Named import",
          purpose:
            "Imports a specific named export.",
          example:
            'import { formatPrice } from "./formatters.js"'
        },
        {
          name: "Multiple import",
          purpose:
            "Imports several named exports.",
          example:
            'import { formatPrice, formatDate } from "./formatters.js"'
        },
        {
          name: "Aliased import",
          purpose:
            "Gives an imported name a different local name.",
          example:
            'import { formatPrice as price } from "./formatters.js"'
        }
      ],

      keyIdea:
        "Named imports clearly communicate which capabilities a module depends on."
    },


    {
      number: 5,

      title: "Default Exports",

      intro:
        "A module can also provide one primary default export.",

      code:
`export default class CourseService {

  getCourses() {

    return fetch("/api/courses");

  }

}`,

      explanation:
        "A default export represents the module's primary exported value. The importing code can choose its local name.",

      keyIdea:
        "Use a default export when a module has one clearly primary public value."
    },


    {
      number: 6,

      title: "Default Imports vs Named Imports",

      intro:
        "Default and named imports have different syntax and semantics.",

      comparison: {
        headers: [
          "Named",
          "Default"
        ],

        rows: [
          [
            "export function getCourses() {}",
            "export default function getCourses() {}"
          ],
          [
            "import { getCourses } from './api.js'",
            "import getCourses from './api.js'"
          ],
          [
            "Import name normally matches export",
            "Importer chooses the local name"
          ],
          [
            "A module can have multiple named exports",
            "A module has at most one default export"
          ]
        ]
      },

      warning:
        "Do not mix up the curly-brace syntax. Named imports use braces; default imports do not.",

      keyIdea:
        "Choose named or default exports based on the module's API design rather than using one style blindly."
    },


    {
      number: 7,

      title: "Aliases and Namespace Imports",

      intro:
        "Imports can be renamed or grouped when that improves readability.",

      code:
`import {
  formatPrice as price,
  formatDate as date
} from "./formatters.js";`,

      code:
`import * as validators
  from "./validators.js";

validators.isEmail(value);
validators.isRequired(value);`,

      methods: [
        {
          name: "Alias",
          purpose:
            "Renames an imported binding locally.",
          example:
            'import { save as saveCourse } from "./api.js"'
        },
        {
          name: "Namespace import",
          purpose:
            "Collects named exports under one namespace object.",
          example:
            'import * as utils from "./utils.js"'
        }
      ],

      keyIdea:
        "Import syntax can make dependencies more readable when modules expose several related operations."
    },


    {
      number: 8,

      title: "Browser JavaScript Modules",

      intro:
        "Browsers can execute ES modules using type=\"module\".",

      code:
`<script
  type="module"
  src="/js/main.js">
</script>`,

      explanation:
        "Module scripts use ES module semantics. Their imports and exports define explicit dependencies between files.",

      comparison: {
        headers: [
          "Classic script",
          "Module script"
        ],

        rows: [
          [
            "<script src='app.js'>",
            "<script type='module' src='app.js'>"
          ],
          [
            "No ES import/export by default",
            "Supports import/export"
          ],
          [
            "Top-level names can interact with global scope",
            "Module code has its own scope"
          ],
          [
            "Traditional script loading",
            "Module dependency graph"
          ]
        ]
      },

      keyIdea:
        "The browser can load modules directly, allowing frontend applications to use modern JavaScript module syntax."
    },


    {
      number: 9,

      title: "Module Dependency Graph",

      intro:
        "When modules import other modules, the application forms a dependency graph.",

      architecture: [
        {
          title: "UI Module",
          items: [
            "Handles DOM rendering and user interaction.",
            "Depends on application services."
          ]
        },
        {
          title: "Service Module",
          items: [
            "Coordinates application operations.",
            "Depends on API modules."
          ]
        },
        {
          title: "API Module",
          items: [
            "Communicates with backend endpoints.",
            "Returns application data or errors."
          ]
        },
        {
          title: "Utility Module",
          items: [
            "Contains small reusable pure functions.",
            "Should remain independent where possible."
          ]
        }
      ],

      flow: [
        "User interacts with UI",
        "UI calls service",
        "Service calls API module",
        "API module communicates with server",
        "Result returns through service",
        "UI renders the result"
      ],

      keyIdea:
        "A dependency graph becomes easier to maintain when dependencies mostly point in predictable directions."
    },


    {
      number: 10,

      title: "Separation of Responsibilities",

      intro:
        "A module should have a focused responsibility.",

      comparison: {
        headers: [
          "Poor boundary",
          "Better boundary"
        ],

        rows: [
          [
            "One file fetches data, validates it, renders HTML and manages state",
            "Separate API, validation and UI responsibilities"
          ],
          [
            "UI knows URL construction details",
            "API module owns request details"
          ],
          [
            "Formatting logic duplicated everywhere",
            "Reusable formatter module"
          ],
          [
            "Business rules hidden in click handlers",
            "Business logic separated from event handling"
          ]
        ]
      },

      keyIdea:
        "A useful module boundary reduces the amount of knowledge each part of the application needs."
    },


    {
      number: 11,

      title: "Dynamic import()",

      intro:
        "JavaScript can load a module only when it is needed.",

      code:
`button.addEventListener(
  "click",
  async () => {

    const module =
      await import("./chart.js");

    module.renderChart(data);

  }
);`,

      explanation:
        "Dynamic import() returns a Promise for a module namespace object. It can be useful when functionality is optional or expensive to load.",

      flow: [
        "Application starts",
        "Optional feature is not loaded yet",
        "User requests the feature",
        "import() starts loading the module",
        "Promise fulfills",
        "Module becomes available",
        "Feature executes"
      ],

      keyIdea:
        "Dynamic imports can defer loading code until the application actually needs it."
    },


    {
      number: 12,

      title: "What Is an Error?",

      intro:
        "An error represents a failure or exceptional condition that application code needs to handle or report.",

      code:
`function withdraw(balance, amount) {

  if (amount > balance) {

    throw new Error(
      "Insufficient balance"
    );

  }

  return balance - amount;

}`,

      explanation:
        "throw transfers control to an appropriate error handler. If an error is never handled, it can propagate and eventually appear as an unhandled error.",

      keyIdea:
        "Errors should communicate meaningful failure conditions instead of silently producing invalid results."
    },


    {
      number: 13,

      title: "try, catch and finally",

      intro:
        "try/catch/finally provides structured error handling.",

      code:
`try {

  const result =
    withdraw(1000, 1500);

  console.log(result);

} catch (error) {

  console.error(
    error.message
  );

} finally {

  console.log(
    "Operation finished"
  );

}`,

      flow: [
        "Enter try block",
        "Execute risky operation",
        "If successful → continue",
        "If error is thrown → enter catch",
        "Run cleanup in finally",
        "Continue application execution"
      ],

      keyIdea:
        "Use finally for cleanup that should happen regardless of whether an operation succeeds or fails."
    },


    {
      number: 14,

      title: "Built-in Error Types",

      intro:
        "JavaScript provides several built-in error classes.",

      comparison: {
        headers: [
          "Error type",
          "Typical meaning"
        ],

        rows: [
          [
            "Error",
            "General application error"
          ],
          [
            "TypeError",
            "A value is used in an incompatible way"
          ],
          [
            "ReferenceError",
            "A referenced variable or binding cannot be resolved"
          ],
          [
            "SyntaxError",
            "JavaScript syntax is invalid"
          ],
          [
            "RangeError",
            "A value is outside an allowed range"
          ]
        ]
      },

      code:
`try {

  null.toUpperCase();

} catch (error) {

  console.log(error.name);
  console.log(error.message);

}`,

      keyIdea:
        "The error type provides useful information about the category of failure."
    },


    {
      number: 15,

      title: "Custom Error Classes",

      intro:
        "Applications can create custom errors when domain-specific failure information is useful.",

      code:
`class ValidationError
  extends Error {

  constructor(message, field) {

    super(message);

    this.name =
      "ValidationError";

    this.field =
      field;
  }

}

throw new ValidationError(
  "Email is required",
  "email"
);`,

      architecture: [
        {
          title: "Base Error",
          items: [
            "Extends JavaScript's Error class."
          ]
        },
        {
          title: "Error name",
          items: [
            "Identifies the application-specific error type."
          ]
        },
        {
          title: "Message",
          items: [
            "Explains what went wrong."
          ]
        },
        {
          title: "Additional context",
          items: [
            "Properties such as field can provide structured information."
          ]
        }
      ],

      keyIdea:
        "Custom errors are useful when callers need to distinguish meaningful categories of failure."
    },


    {
      number: 16,

      title: "Validation at Boundaries",

      intro:
        "Data should be validated when it crosses an important application boundary.",

      code:
`function createStudent(data) {

  if (!data) {
    throw new ValidationError(
      "Student data is required",
      "student"
    );
  }

  if (!data.name) {
    throw new ValidationError(
      "Name is required",
      "name"
    );
  }

  if (!data.email) {
    throw new ValidationError(
      "Email is required",
      "email"
    );
  }

  return data;
}`,

      flow: [
        "Receive external data",
        "Check that the expected structure exists",
        "Validate required fields",
        "Validate important values",
        "Reject invalid data",
        "Continue with trusted-enough application data"
      ],

      warning:
        "Client-side validation improves user experience but does not replace server-side validation. Data received by a backend must be validated again.",

      keyIdea:
        "Never treat external input as trustworthy merely because it came from your own interface."
    },


    {
      number: 17,

      title: "Expected Failures vs Programming Bugs",

      intro:
        "Not every error should be handled in exactly the same way.",

      comparison: {
        headers: [
          "Expected failure",
          "Programming bug"
        ],

        rows: [
          [
            "Invalid user input",
            "Incorrect variable name"
          ],
          [
            "API unavailable",
            "Calling a nonexistent function"
          ],
          [
            "Authentication expired",
            "Broken application invariant"
          ],
          [
            "Can often be handled gracefully",
            "Usually requires fixing the code"
          ]
        ]
      },

      keyIdea:
        "Good error handling should recover from expected operational failures without hiding genuine programming defects."
    },


    {
      number: 18,

      title: "Defensive Programming",

      intro:
        "Defensive programming anticipates invalid or unexpected inputs at important boundaries.",

      code:
`function calculateAverage(numbers) {

  if (!Array.isArray(numbers)) {
    throw new TypeError(
      "numbers must be an array"
    );
  }

  if (numbers.length === 0) {
    throw new Error(
      "Cannot average an empty array"
    );
  }

  return numbers.reduce(
    (sum, value) => sum + value,
    0
  ) / numbers.length;
}`,

      points: [
        "Validate assumptions at important boundaries.",
        "Fail clearly when required data is invalid.",
        "Do not silently convert serious errors into meaningless values.",
        "Keep validation proportional to the risk.",
        "Prefer clear contracts over defensive checks everywhere."
      ],

      warning:
        "Over-defensive code can become noisy. Validate important assumptions rather than adding pointless checks to every line.",

      keyIdea:
        "Defensive programming is about protecting important boundaries, not making every function unnecessarily complicated."
    },


    {
      number: 19,

      title: "Centralized Application Error Handling",

      intro:
        "Applications become easier to maintain when error presentation follows a consistent strategy.",

      code:
`function showApplicationError(error) {

  if (
    error.name ===
    "ValidationError"
  ) {

    showFieldError(
      error.field,
      error.message
    );

    return;
  }

  console.error(error);

  showMessage(
    "Something went wrong."
  );
}`,

      architecture: [
        {
          title: "Low-level operation",
          items: [
            "Detects or creates the error."
          ]
        },
        {
          title: "Service layer",
          items: [
            "Allows meaningful errors to propagate."
          ]
        },
        {
          title: "Application layer",
          items: [
            "Decides how the error should be presented."
          ]
        },
        {
          title: "User interface",
          items: [
            "Shows a clear and useful message."
          ]
        }
      ],

      keyIdea:
        "The layer that understands the user experience should usually decide how an error is presented."
    },


    {
      number: 20,

      title: "Maintainable JavaScript Architecture",

      intro:
        "Modules, asynchronous APIs and error handling work together to form a maintainable application structure.",

      architecture: [
        {
          title: "Components / UI",
          items: [
            "Handle interaction and rendering.",
            "Should avoid owning low-level networking details."
          ]
        },
        {
          title: "Services",
          items: [
            "Coordinate application operations.",
            "Contain business-level workflows."
          ]
        },
        {
          title: "API modules",
          items: [
            "Handle HTTP communication.",
            "Convert unsuccessful responses into meaningful errors."
          ]
        },
        {
          title: "Utilities",
          items: [
            "Contain focused reusable functions.",
            "Prefer pure behaviour when practical."
          ]
        },
        {
          title: "Error layer",
          items: [
            "Defines meaningful error categories.",
            "Provides consistent application-level handling."
          ]
        }
      ],

      flow: [
        "User action",
        "UI handler",
        "Application service",
        "API module",
        "Backend request",
        "Response or error",
        "Service returns result",
        "UI renders success or error state"
      ],

      keyIdea:
        "Professional JavaScript is easier to scale when modules have clear responsibilities and failures have predictable paths."
    }

  ],


  visualizer: {

    title: "Module Dependency & Error Flow Visualizer",

    description:
      "Follow a user action from the UI through service and API modules, then observe how success and failure travel back through the application.",

    steps: [

      {
        title: "User action",
        operation: "User clicks Save",
        detail:
          "The UI receives the interaction and starts the application operation."
      },

      {
        title: "UI module",
        operation: "saveStudent(data)",
        detail:
          "The UI delegates the operation instead of implementing HTTP details itself."
      },

      {
        title: "Service module",
        operation: "studentService.save(data)",
        detail:
          "The service coordinates validation and API communication."
      },

      {
        title: "Validation",
        operation: "validateStudent(data)",
        detail:
          "Important input assumptions are checked before sending the request."
      },

      {
        title: "API module",
        operation: "studentApi.create(data)",
        detail:
          "The API module owns the Fetch request and HTTP response handling."
      },

      {
        title: "Success path",
        operation: "Response → data → UI",
        detail:
          "Valid server data returns through the application layers and is rendered."
      },

      {
        title: "Failure path",
        operation: "Error → handler → user message",
        detail:
          "A meaningful error travels upward until the appropriate layer decides how to present it."
      }

    ]

  },


  trace: {

    title: "Module & Error Propagation Tracer",

    lines: [

      {
        line: 1,
        code: 'import { saveStudent } from "./student-service.js";'
      },

      {
        line: 2,
        code: 'async function handleSave(data) {'
      },

      {
        line: 3,
        code: '  try {'
      },

      {
        line: 4,
        code: '    const student = await saveStudent(data);'
      },

      {
        line: 5,
        code: '    showSuccess(student);'
      },

      {
        line: 6,
        code: '  } catch (error) {'
      },

      {
        line: 7,
        code: '    showApplicationError(error);'
      },

      {
        line: 8,
        code: '  }'
      },

      {
        line: 9,
        code: '}'
      }

    ],

    steps: [

      {
        line: 1,
        title: "Import service",
        detail:
          "The UI module declares that it depends on saveStudent from the service module."
      },

      {
        line: 2,
        title: "Start handler",
        detail:
          "The async event handler begins processing the submitted data."
      },

      {
        line: 3,
        title: "Enter try",
        detail:
          "The potentially failing asynchronous operation is protected by try/catch."
      },

      {
        line: 4,
        title: "Call service",
        detail:
          "The service performs its validation and API workflow."
      },

      {
        line: 4,
        title: "Await result",
        detail:
          "The handler waits for the service Promise to settle."
      },

      {
        line: 5,
        title: "Success path",
        detail:
          "If the Promise fulfills, the returned student is passed to the success UI."
      },

      {
        line: 6,
        title: "Failure path",
        detail:
          "If the Promise rejects, control moves to catch."
      },

      {
        line: 7,
        title: "Central error handling",
        detail:
          "The application error handler decides how the failure should be presented."
      }

    ]

  },


  revision: [

    [
      "Module",
      "A JavaScript unit with its own scope and explicit imports and exports."
    ],

    [
      "Named export",
      "An exported binding identified by its name."
    ],

    [
      "Named import",
      "An import that selects one or more named exports."
    ],

    [
      "Default export",
      "The primary exported value of a module."
    ],

    [
      "Module scope",
      "The scope belonging to a module rather than the global script scope."
    ],

    [
      "Dependency graph",
      "The network of relationships created when modules import other modules."
    ],

    [
      "Dynamic import",
      "The import() expression that loads a module asynchronously when needed."
    ],

    [
      "Error",
      "An object representing an exceptional or failed operation."
    ],

    [
      "throw",
      "Transfers control by raising an error or other thrown value."
    ],

    [
      "try/catch",
      "A structured mechanism for handling thrown errors."
    ],

    [
      "finally",
      "A block that runs after try/catch processing for cleanup."
    ],

    [
      "Custom Error",
      "An application-specific error class extending Error."
    ],

    [
      "Validation",
      "Checking whether data satisfies required conditions."
    ],

    [
      "Boundary",
      "A point where data or control enters another part of an application."
    ],

    [
      "Defensive programming",
      "Protecting important assumptions by validating inputs and failing clearly."
    ],

    [
      "Error propagation",
      "The movement of an error through function or Promise call boundaries until it is handled."
    ],

    [
      "Separation of concerns",
      "Organizing code so different responsibilities remain appropriately separated."
    ]

  ],


  interview: [

    {
      question: "Why are JavaScript modules important?",
      answer:
        "Modules create boundaries between related functionality, make dependencies explicit and reduce accidental coupling."
    },

    {
      question: "What is module scope?",
      answer:
        "It is the scope belonging to an ES module. Variables are not automatically exposed globally."
    },

    {
      question: "What is a named export?",
      answer:
        "A named export exposes a binding under a specific export name that consumers can import by name."
    },

    {
      question: "What is a default export?",
      answer:
        "A default export represents a module's primary exported value and can be imported without curly braces."
    },

    {
      question: "Can a module have multiple named exports?",
      answer:
        "Yes. A module can have multiple named exports."
    },

    {
      question: "How many default exports can a module have?",
      answer:
        "A module can have at most one default export."
    },

    {
      question: "What is the difference between named and default imports?",
      answer:
        "Named imports use curly braces and refer to named exports, while default imports do not use curly braces and refer to the module's default export."
    },

    {
      question: "What is an import alias?",
      answer:
        "It gives an imported binding a different local name using the as keyword."
    },

    {
      question: "What does import * as utils do?",
      answer:
        "It creates a namespace object containing the module's accessible named exports."
    },

    {
      question: "What does type='module' do on a script element?",
      answer:
        "It tells the browser to treat the script as an ES module, enabling import/export semantics."
    },

    {
      question: "What is dynamic import()?",
      answer:
        "It loads a module dynamically and returns a Promise for the module namespace object."
    },

    {
      question: "What is separation of concerns?",
      answer:
        "It means organizing responsibilities so different parts of the application focus on appropriate tasks rather than mixing unrelated logic."
    },

    {
      question: "What does throw do?",
      answer:
        "It raises a value, commonly an Error object, and transfers control to an appropriate error handler."
    },

    {
      question: "What is the purpose of try/catch?",
      answer:
        "It provides structured handling for errors thrown during execution."
    },

    {
      question: "What is finally used for?",
      answer:
        "It is useful for cleanup or actions that should occur regardless of whether an operation succeeds or fails."
    },

    {
      question: "What is a TypeError?",
      answer:
        "It is an error indicating that a value is being used in an incompatible way."
    },

    {
      question: "Why create custom Error classes?",
      answer:
        "They allow applications to represent meaningful domain-specific error categories and attach useful structured information."
    },

    {
      question: "Where should validation happen?",
      answer:
        "Important application boundaries should validate incoming data. Server-side systems must independently validate client-provided data."
    },

    {
      question: "Should every error be caught?",
      answer:
        "No. Expected operational failures should be handled appropriately, while programming bugs should not be silently hidden."
    },

    {
      question: "What is defensive programming?",
      answer:
        "It is the practice of protecting important assumptions through appropriate validation and clear failure behaviour."
    },

    {
      question: "What is a dependency graph?",
      answer:
        "It is the network of relationships between modules based on which modules import other modules."
    },

    {
      question: "Why should circular dependencies be avoided when possible?",
      answer:
        "They can make initialization order and program behaviour harder to understand and maintain."
    },

    {
      question: "What makes a module boundary good?",
      answer:
        "A good boundary groups a focused responsibility and exposes only the functionality that other parts of the application need."
    },

    {
      question: "Where should HTTP details normally live?",
      answer:
        "A dedicated API or service layer is usually a better place than spreading Fetch details throughout UI event handlers."
    },

    {
      question: "Why should errors contain useful context?",
      answer:
        "Useful context helps the appropriate layer decide whether to recover, log, retry or present a meaningful message to the user."
    }

  ],


  practice: [

    {
      title: "Create a Utility Module",

      difficulty: "Basic",

      task:
        "Create a formatters.js module containing named exports formatPrice() and formatPercentage(), then import and use both functions from main.js.",

      hints: [
        "Use export before each function.",
        "Import both functions using curly braces.",
        "Keep formatting logic inside the formatter module."
      ]
    },


    {
      title: "Create a Default Export",

      difficulty: "Basic",

      task:
        "Create a Course class and export it as the default export of course.js. Import it using any local name in main.js.",

      hints: [
        "Use export default before the class.",
        "Default imports do not use curly braces.",
        "Instantiate the imported class normally."
      ]
    },


    {
      title: "Use an Import Alias",

      difficulty: "Basic",

      task:
        "Import a named function called calculateTotal as total from a utility module and use the aliased name.",

      hints: [
        "Use the as keyword.",
        "Named imports require curly braces.",
        "The local name can be different from the exported name."
      ]
    },


    {
      title: "Build an API Module",

      difficulty: "Intermediate",

      task:
        "Create a courses-api.js module containing a getCourses() function that uses Fetch and returns parsed JSON.",

      hints: [
        "Make getCourses() async.",
        "Use fetch().",
        "Check response.ok.",
        "Return await response.json().",
        "Export the function."
      ]
    },


    {
      title: "Create a Validation Error",

      difficulty: "Intermediate",

      task:
        "Create a ValidationError class extending Error. Store the field name in a field property.",

      hints: [
        "Use class ValidationError extends Error.",
        "Call super(message).",
        "Set this.name.",
        "Store the field property."
      ]
    },


    {
      title: "Validate Student Data",

      difficulty: "Intermediate",

      task:
        "Create validateStudent() that rejects missing name or email using ValidationError.",

      hints: [
        "Check whether data exists.",
        "Check required fields.",
        "Throw ValidationError for invalid fields.",
        "Return valid data."
      ]
    },


    {
      title: "Handle API Errors",

      difficulty: "Intermediate",

      task:
        "Create a loadCourses() function that catches API failures and displays a generic user-friendly error message.",

      hints: [
        "Use async/await.",
        "Use try/catch.",
        "Check response.ok inside the API layer.",
        "Keep technical error details out of the user-facing message."
      ]
    },


    {
      title: "Dynamic Module Loading",

      difficulty: "Advanced",

      task:
        "Create a button that dynamically imports a chart module only when the user clicks 'Show Chart'.",

      hints: [
        "Use an async click handler.",
        "Call await import('./chart.js').",
        "Use the returned module namespace.",
        "Call the exported chart function."
      ]
    },


    {
      title: "Separate UI and API",

      difficulty: "Advanced",

      task:
        "Refactor a single JavaScript file so that API requests live in courses-api.js, application logic lives in course-service.js and DOM rendering lives in course-ui.js.",

      hints: [
        "API module should know about Fetch.",
        "UI module should know about DOM elements.",
        "Service module should coordinate application operations.",
        "Use imports and exports to connect the layers."
      ]
    },


    {
      title: "Central Error Handler",

      difficulty: "Advanced",

      task:
        "Create a central error handler that displays validation errors next to fields and displays a generic message for unexpected errors.",

      hints: [
        "Check error.name.",
        "ValidationError can provide a field property.",
        "Handle known errors specifically.",
        "Log unexpected errors for debugging.",
        "Do not expose internal stack traces to normal users."
      ]
    },


    {
      title: "Professional Module Architecture",

      difficulty: "Advanced",

      task:
        "Build a small Student Dashboard using separate UI, service, API, validation and utility modules. The dashboard should load students, validate a new student, submit it through the API layer and display meaningful errors.",

      hints: [
        "Keep each module focused.",
        "Use named exports for reusable operations.",
        "Use async/await for API calls.",
        "Use a custom ValidationError.",
        "Do not place Fetch code directly inside DOM event handlers.",
        "Create a clear success and failure path."
      ]
    }

  ],


  quiz: [

    {
      question: "What is the primary purpose of JavaScript modules?",
      options: [
        "To make CSS faster",
        "To create clear code boundaries and dependencies",
        "To remove functions",
        "To replace HTML"
      ],
      answer: 1
    },

    {
      question: "Which syntax creates a named export?",
      options: [
        "public function test() {}",
        "export function test() {}",
        "module function test() {}",
        "share function test() {}"
      ],
      answer: 1
    },

    {
      question: "Which syntax imports a named export?",
      options: [
        "import test from './file.js'",
        "import { test } from './file.js'",
        "include test from './file.js'",
        "require named test"
      ],
      answer: 1
    },

    {
      question: "Which syntax imports a default export?",
      options: [
        "import { Course } from './course.js'",
        "import Course from './course.js'",
        "import default Course from './course.js'",
        "include Course"
      ],
      answer: 1
    },

    {
      question: "How many default exports can one module have?",
      options: [
        "One",
        "Two",
        "Unlimited",
        "None"
      ],
      answer: 0
    },

    {
      question: "Which attribute enables browser ES module semantics?",
      options: [
        "type='javascript'",
        "type='module'",
        "module='true'",
        "script='es'"
      ],
      answer: 1
    },

    {
      question: "What does dynamic import() return?",
      options: [
        "A Promise",
        "A string",
        "A DOM node",
        "A CSS file"
      ],
      answer: 0
    },

    {
      question: "Which keyword raises an error?",
      options: [
        "raise",
        "throw",
        "error",
        "fail"
      ],
      answer: 1
    },

    {
      question: "Which block handles a thrown error?",
      options: [
        "catch",
        "handle",
        "error",
        "except"
      ],
      answer: 0
    },

    {
      question: "Which block is useful for cleanup?",
      options: [
        "finally",
        "cleanup",
        "finish",
        "always"
      ],
      answer: 0
    },

    {
      question: "Which built-in error usually represents incompatible value usage?",
      options: [
        "SyntaxError",
        "TypeError",
        "NetworkError",
        "LogicError"
      ],
      answer: 1
    },

    {
      question: "How can you create an application-specific error?",
      options: [
        "Extend Error",
        "Extend String",
        "Create a CSS class",
        "Use console.error only"
      ],
      answer: 0
    },

    {
      question: "Why should external input be validated?",
      options: [
        "External data is always trustworthy",
        "It protects important application assumptions",
        "It makes HTML shorter",
        "It removes APIs"
      ],
      answer: 1
    },

    {
      question: "Should client-side validation replace server-side validation?",
      options: [
        "Yes",
        "No",
        "Only for passwords",
        "Only for GET requests"
      ],
      answer: 1
    },

    {
      question: "What is separation of concerns?",
      options: [
        "Putting everything in one file",
        "Separating unrelated responsibilities appropriately",
        "Removing modules",
        "Avoiding functions"
      ],
      answer: 1
    }

  ],


  glossary: [

    {
      term: "Module",
      definition:
        "A JavaScript unit with its own scope and explicit imports and exports."
    },

    {
      term: "Export",
      definition:
        "Makes a module binding available to other modules."
    },

    {
      term: "Import",
      definition:
        "Brings an exported binding into another module."
    },

    {
      term: "Named export",
      definition:
        "An export identified by a specific name."
    },

    {
      term: "Default export",
      definition:
        "The primary exported value of a module."
    },

    {
      term: "Module scope",
      definition:
        "The private scope belonging to an ES module."
    },

    {
      term: "Dependency graph",
      definition:
        "The graph formed by relationships between importing and imported modules."
    },

    {
      term: "Dynamic import",
      definition:
        "An asynchronous mechanism for loading a module when needed."
    },

    {
      term: "Error",
      definition:
        "An object representing a failure or exceptional condition."
    },

    {
      term: "throw",
      definition:
        "Raises a value and transfers control to an error handler."
    },

    {
      term: "try/catch",
      definition:
        "A structure for executing code and handling thrown errors."
    },

    {
      term: "finally",
      definition:
        "A block that runs after try/catch processing and is useful for cleanup."
    },

    {
      term: "Custom Error",
      definition:
        "An application-specific error class extending JavaScript's Error."
    },

    {
      term: "Validation",
      definition:
        "Checking data against required application rules."
    },

    {
      term: "Boundary",
      definition:
        "A point where data or control enters another part of an application."
    },

    {
      term: "Defensive programming",
      definition:
        "Protecting important assumptions through suitable validation and failure handling."
    },

    {
      term: "Separation of concerns",
      definition:
        "Keeping different responsibilities appropriately separated."
    },

    {
      term: "Error propagation",
      definition:
        "The movement of an error through application layers until it is handled."
    }

  ],


  completion: {

    title: "Level 13 Complete — Write Professional JavaScript",

    message:
      "You have completed the JavaScript Engineering section. You can now " +
      "organize code with modules, communicate with APIs, reason about asynchronous " +
      "execution, validate external data and design structured error handling.",

    challenge:
      "Build a CodeBhavya Student Management Dashboard using ES modules. " +
      "Create separate modules for API communication, validation, services, UI " +
      "rendering and utilities. Load students from an API, display loading, empty, " +
      "success and error states, validate a new student before submission, use a " +
      "custom ValidationError for field-specific problems, and dynamically import " +
      "a statistics module only when the user opens the analytics section. Keep " +
      "Fetch logic out of DOM event handlers and maintain a clear dependency flow."
  },


  takeaway:
    "Professional JavaScript is more than knowing syntax. Modules create boundaries, " +
    "validation protects application assumptions, errors communicate failures, and " +
    "clear architecture keeps applications maintainable as they grow. With Levels " +
    "08–13 complete, you are ready to move from JavaScript engineering into React applications."

};


console.log(
  "CodeBhavya Full Stack Level 13 loaded: Modules & Error Design"
);
