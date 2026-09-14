"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 12 — ASYNC JAVASCRIPT & APIs

  Topics:
  Promises, async/await, Fetch, JSON, HTTP responses,
  error handling, concurrency, AbortController and
  the JavaScript event loop.
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[12] = {

  number: 12,

  title: "Async JavaScript & APIs",

  kicker: "JavaScript Engineering · Level 12",

  subtitle:
    "Understand asynchronous execution, work with Promises and async/await, communicate with APIs using Fetch, and handle failures professionally.",

  estimatedTime: "4–5 hours",

  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 12 · ASYNC JAVASCRIPT",
    description:
      "Real web applications cannot wait for every network request, timer, " +
      "file operation or browser task to finish before doing anything else. " +
      "JavaScript uses asynchronous programming to keep applications responsive. " +
      "In this level, you will learn how Promises work, how async/await is built " +
      "on Promises, how Fetch communicates with APIs, and how the event loop " +
      "coordinates asynchronous work."
  },

  objectives: [

    "Understand synchronous and asynchronous execution.",

    "Understand why asynchronous programming is necessary in web applications.",

    "Understand the lifecycle of a Promise.",

    "Use then(), catch() and finally().",

    "Chain multiple Promises correctly.",

    "Avoid floating Promises and broken chains.",

    "Use async functions.",

    "Use await correctly.",

    "Handle async failures using try/catch.",

    "Understand that async functions return Promises.",

    "Understand the JavaScript event loop at a practical level.",

    "Understand tasks and microtasks.",

    "Use Fetch to communicate with APIs.",

    "Understand Response objects and HTTP status codes.",

    "Parse JSON responses.",

    "Send GET and POST requests.",

    "Handle network and HTTP failures separately.",

    "Use Promise.all() for independent requests.",

    "Understand Promise.allSettled(), Promise.race() and Promise.any().",

    "Cancel suitable requests using AbortController.",

    "Build reliable API-loading interfaces.",

    "Design useful loading, success and error states."

  ],

  sections: [

    {
      number: 1,

      title: "Why Asynchronous JavaScript Exists",

      intro:
        "JavaScript often needs to start work that finishes later.",

      explanation:
        "Browser applications regularly perform operations whose completion time " +
        "is unknown. Network requests, timers, user interactions and other browser " +
        "operations should not freeze the entire interface while JavaScript waits.",

      code:
`console.log("Start");

setTimeout(() => {
  console.log("Finished later");
}, 1000);

console.log("End");`,

      output:
`Start
End
Finished later`,

      flow: [
        "JavaScript starts executing",
        "Synchronous statements run immediately",
        "Timer is registered with the browser",
        "JavaScript continues",
        "The callback becomes eligible later",
        "The event loop eventually allows the callback to run"
      ],

      keyIdea:
        "Asynchronous JavaScript does not mean JavaScript runs everything simultaneously. It means work can be scheduled so the main execution flow does not wait unnecessarily."
    },


    {
      number: 2,

      title: "Synchronous vs Asynchronous Execution",

      intro:
        "Understanding the difference between synchronous and asynchronous code is the foundation of this entire level.",

      comparison: {
        headers: [
          "Synchronous",
          "Asynchronous"
        ],

        rows: [
          [
            "Runs in the current execution flow",
            "Schedules work for later completion"
          ],
          [
            "Next statement waits for the current statement",
            "Later work can complete after other code runs"
          ],
          [
            "Easy to reason about for simple operations",
            "Useful for network and time-dependent operations"
          ],
          [
            "Can block if an operation is expensive",
            "Can keep the interface responsive"
          ]
        ]
      },

      code:
`console.log("A");

console.log("B");

console.log("C");`,

      output:
`A
B
C`,

      keyIdea:
        "Synchronous code follows the current execution order. Asynchronous APIs allow completion to happen later."
    },


    {
      number: 3,

      title: "What Is a Promise?",

      intro:
        "A Promise represents the eventual result of an asynchronous operation.",

      explanation:
        "A Promise starts in a pending state. It can later become fulfilled when " +
        "the operation succeeds or rejected when the operation fails.",

      comparison: {
        headers: [
          "State",
          "Meaning"
        ],

        rows: [
          [
            "pending",
            "The operation has not completed yet."
          ],
          [
            "fulfilled",
            "The operation completed successfully."
          ],
          [
            "rejected",
            "The operation failed."
          ]
        ]
      },

      code:
`const promise = new Promise((resolve, reject) => {

  setTimeout(() => {
    resolve("Data received");
  }, 1000);

});`,

      keyIdea:
        "A Promise is a future result, not the final result itself."
    },


    {
      number: 4,

      title: "Creating and Settling Promises",

      intro:
        "A Promise is created with a function that receives resolve and reject.",

      code:
`function getUser() {

  return new Promise((resolve, reject) => {

    const success = true;

    if (success) {
      resolve({
        id: 1,
        name: "Ravi"
      });
    } else {
      reject(
        new Error("User not found")
      );
    }

  });

}`,

      methods: [
        {
          name: "resolve()",
          purpose:
            "Marks the Promise as successfully fulfilled.",
          example:
            'resolve("Success")'
        },
        {
          name: "reject()",
          purpose:
            "Marks the Promise as rejected.",
          example:
            'reject(new Error("Failed"))'
        }
      ],

      warning:
        "A Promise should represent a meaningful asynchronous operation. Creating unnecessary Promise wrappers around already-Promise-based APIs usually makes code harder to understand.",

      keyIdea:
        "resolve represents success; reject represents failure."
    },


    {
      number: 5,

      title: "then(), catch() and finally()",

      intro:
        "Promise methods allow code to react when asynchronous work succeeds or fails.",

      code:
`getUser()
  .then(user => {
    console.log(user.name);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => {
    console.log("Request finished");
  });`,

      methods: [
        {
          name: "then()",
          purpose:
            "Runs when the Promise is fulfilled.",
          example:
            'promise.then(value => console.log(value))'
        },
        {
          name: "catch()",
          purpose:
            "Handles rejection or errors propagated through the chain.",
          example:
            'promise.catch(error => console.error(error))'
        },
        {
          name: "finally()",
          purpose:
            "Runs after the Promise settles regardless of success or failure.",
          example:
            'promise.finally(() => hideLoader())'
        }
      ],

      keyIdea:
        "Promise chains provide a structured way to express success, failure and cleanup."
    },


    {
      number: 6,

      title: "Promise Chaining",

      intro:
        "The return value of one then() handler becomes the input to the next step.",

      code:
`getUser()

  .then(user => {
    return getProfile(user.id);
  })

  .then(profile => {
    return getCourses(profile.courseId);
  })

  .then(courses => {
    console.log(courses);
  })

  .catch(error => {
    console.error(error);
  });`,

      flow: [
        "Get user",
        "Wait for user Promise",
        "Use user id",
        "Get profile",
        "Wait for profile Promise",
        "Get courses",
        "Display courses",
        "Handle failures"
      ],

      warning:
        "Forgetting return inside a Promise chain can cause later handlers to run before the asynchronous operation has completed.",

      keyIdea:
        "Return the next Promise when the following step depends on it."
    },


    {
      number: 7,

      title: "Floating Promises",

      intro:
        "One of the most important professional Promise mistakes is starting asynchronous work without returning or handling it.",

      code:
`function loadData() {

  return getUser()
    .then(user => {

      getProfile(user.id);

    })

    .then(profile => {

      console.log(profile);

    });

}`,

      warning:
        "The getProfile() Promise is not returned. The next then() cannot reliably receive its result.",

      code:
`function loadData() {

  return getUser()

    .then(user => {

      return getProfile(user.id);

    })

    .then(profile => {

      console.log(profile);

    });

}`,

      keyIdea:
        "When a Promise operation belongs to a chain, return it so the chain can track its completion."
    },


    {
      number: 8,

      title: "async Functions",

      intro:
        "The async keyword creates a function whose return value is always a Promise.",

      code:
`async function getMessage() {

  return "Hello CodeBhavya";

}

const result = getMessage();

console.log(result);`,

      output:
`Promise { "Hello CodeBhavya" }`,

      explanation:
        "Even when an async function returns a normal value, JavaScript wraps that value in a fulfilled Promise.",

      comparison: {
        headers: [
          "Normal function",
          "Async function"
        ],

        rows: [
          [
            "return value",
            "Returns a Promise"
          ],
          [
            "Can use await?",
            "Yes"
          ],
          [
            "Failure",
            "Thrown errors become Promise rejections"
          ]
        ]
      },

      keyIdea:
        "async does not make a function synchronous. It makes Promise-based asynchronous code easier to write."
    },


    {
      number: 9,

      title: "await",

      intro:
        "await lets an async function wait for a Promise before continuing that function.",

      code:
`async function loadUser() {

  const user =
    await getUser();

  console.log(user);

}`,

      flow: [
        "Call async function",
        "Start getUser()",
        "Reach await",
        "Async function pauses at that point",
        "Other JavaScript work can continue",
        "Promise settles",
        "Async function resumes",
        "user receives the fulfilled value"
      ],

      warning:
        "await does not freeze the entire JavaScript runtime. It suspends the surrounding async function while the awaited Promise is pending.",

      keyIdea:
        "await makes asynchronous code read more like sequential code without blocking the entire program."
    },


    {
      number: 10,

      title: "try/catch with async/await",

      intro:
        "try/catch provides a natural error-handling structure for async/await.",

      code:
`async function loadUser() {

  try {

    const user =
      await getUser();

    console.log(user);

  } catch (error) {

    console.error(
      "Failed:",
      error.message
    );

  }

}`,

      flow: [
        "Start asynchronous operation",
        "await Promise",
        "Success → continue inside try",
        "Failure → control moves to catch",
        "Handle or report the error"
      ],

      keyIdea:
        "Use try/catch when an async operation can reject and the current function is responsible for handling that failure."
    },


    {
      number: 11,

      title: "Fetch API Fundamentals",

      intro:
        "Fetch is the modern browser API for making HTTP requests.",

      code:
`fetch("/api/courses")
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });`,

      explanation:
        "fetch() returns a Promise that fulfills with a Response object when the request receives a response. The response body is then read using methods such as json(), which are themselves asynchronous.",

      flow: [
        "Call fetch(url)",
        "Browser sends HTTP request",
        "Fetch returns a Promise",
        "Promise fulfills with Response",
        "Read response body",
        "Parse JSON",
        "Use application data"
      ],

      keyIdea:
        "Fetch separates receiving the HTTP response from reading and parsing its body."
    },


    {
      number: 12,

      title: "The Response Object",

      intro:
        "The Response object contains status and body information about an HTTP response.",

      code:
`const response =
  await fetch("/api/courses");

console.log(response.status);
console.log(response.ok);`,

      comparison: {
        headers: [
          "Property",
          "Purpose"
        ],

        rows: [
          [
            "status",
            "Numeric HTTP status code such as 200 or 404."
          ],
          [
            "ok",
            "True when the HTTP status is in the successful 200 range."
          ],
          [
            "headers",
            "Provides access to response headers."
          ],
          [
            "json()",
            "Asynchronously parses the response body as JSON."
          ],
          [
            "text()",
            "Asynchronously reads the response body as text."
          ]
        ]
      },

      warning:
        "fetch() does not automatically reject merely because the server returns 404 or 500. Check response.ok or response.status yourself.",

      keyIdea:
        "Network failure and HTTP failure are not exactly the same thing."
    },


    {
      number: 13,

      title: "Parsing JSON",

      intro:
        "Many web APIs return structured data in JSON format.",

      code:
`const response =
  await fetch("/api/student");

const student =
  await response.json();

console.log(student.name);`,

      flow: [
        "Receive Response",
        "Check response.ok",
        "Call response.json()",
        "Wait for JSON parsing",
        "Receive JavaScript value",
        "Use the data"
      ],

      comparison: {
        headers: [
          "Response method",
          "Use"
        ],

        rows: [
          [
            "json()",
            "Parse JSON response data"
          ],
          [
            "text()",
            "Read plain text"
          ],
          [
            "blob()",
            "Read binary/blob data"
          ],
          [
            "arrayBuffer()",
            "Read raw binary data"
          ]
        ]
      },

      keyIdea:
        "The HTTP response and the parsed application data are separate stages."
    },


    {
      number: 14,

      title: "Professional GET Request Pattern",

      intro:
        "A production-style GET request should explicitly handle HTTP failures.",

      code:
`async function loadCourses() {

  const response =
    await fetch("/api/courses");

  if (!response.ok) {

    throw new Error(
      \`HTTP error: \${response.status}\`
    );

  }

  return response.json();

}`,

      flow: [
        "Start request",
        "Await Response",
        "Check response.ok",
        "Throw if HTTP status is unsuccessful",
        "Parse JSON",
        "Return application data"
      ],

      keyIdea:
        "A clean API helper should convert an unsuccessful HTTP response into an error that its caller can handle."
    },


    {
      number: 15,

      title: "GET Request with Loading and Error States",

      intro:
        "A real interface needs more than a successful data path.",

      code:
`async function loadCourses() {

  showLoading();

  try {

    const response =
      await fetch("/api/courses");

    if (!response.ok) {
      throw new Error(
        \`HTTP \${response.status}\`
      );
    }

    const courses =
      await response.json();

    renderCourses(courses);

  } catch (error) {

    showError(
      "Unable to load courses."
    );

  } finally {

    hideLoading();

  }

}`,

      architecture: [
        {
          title: "Loading",
          items: [
            "Tell the user that work has started.",
            "Prevent confusing blank screens."
          ]
        },
        {
          title: "Success",
          items: [
            "Parse the response.",
            "Render the received data."
          ]
        },
        {
          title: "Failure",
          items: [
            "Show a useful error state.",
            "Do not expose unnecessary technical details."
          ]
        },
        {
          title: "Cleanup",
          items: [
            "Remove loading state regardless of success or failure."
          ]
        }
      ],

      keyIdea:
        "Professional async UI usually has loading, success, empty and error states."
    },


    {
      number: 16,

      title: "POST Requests",

      intro:
        "Fetch can also send data to a server.",

      code:
`async function createStudent(student) {

  const response =
    await fetch("/api/students", {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(student)

    });

  if (!response.ok) {
    throw new Error(
      \`HTTP error: \${response.status}\`
    );
  }

  return response.json();

}`,

      comparison: {
        headers: [
          "Option",
          "Purpose"
        ],

        rows: [
          [
            "method",
            "HTTP method such as POST"
          ],
          [
            "headers",
            "Metadata describing the request"
          ],
          [
            "body",
            "Data sent to the server"
          ],
          [
            "JSON.stringify()",
            "Converts a JavaScript value into JSON text"
          ]
        ]
      },

      warning:
        "Never assume that client-side validation alone is sufficient. The server must validate incoming data too.",

      keyIdea:
        "A POST request sends a representation of data to the server; the server decides whether that data is valid."
    },


    {
      number: 17,

      title: "Network Errors vs HTTP Errors",

      intro:
        "Not every failed request reaches the same stage.",

      comparison: {
        headers: [
          "Situation",
          "Typical Fetch behaviour"
        ],

        rows: [
          [
            "Network failure",
            "Fetch Promise rejects."
          ],
          [
            "Invalid request scheme",
            "Fetch can reject."
          ],
          [
            "Server returns 404",
            "Fetch fulfills with a Response; response.ok is false."
          ],
          [
            "Server returns 500",
            "Fetch fulfills with a Response; response.ok is false."
          ],
          [
            "Invalid JSON body",
            "response.json() can reject."
          ]
        ]
      },

      keyIdea:
        "Reliable API code handles transport failure, HTTP failure and data-parsing failure."
    },


    {
      number: 18,

      title: "Promise.all()",

      intro:
        "Independent asynchronous operations can often run concurrently.",

      code:
`const [
  courses,
  instructors,
  announcements
] = await Promise.all([

  fetchCourses(),
  fetchInstructors(),
  fetchAnnouncements()

]);`,

      flow: [
        "Start courses request",
        "Start instructors request",
        "Start announcements request",
        "Wait for all",
        "Receive all results",
        "Continue together"
      ],

      comparison: {
        headers: [
          "Sequential",
          "Concurrent"
        ],

        rows: [
          [
            "await A; await B;",
            "await Promise.all([A, B]);"
          ],
          [
            "B starts after A completes",
            "Both operations can be in progress together"
          ],
          [
            "Can take longer",
            "Can reduce total waiting time for independent work"
          ]
        ]
      },

      warning:
        "Do not use Promise.all merely because it exists. If operation B depends on the result of A, sequential execution may be necessary.",

      keyIdea:
        "Use concurrency when operations are independent."
    },


    {
      number: 19,

      title: "Promise.allSettled(), race() and any()",

      intro:
        "JavaScript provides several ways to coordinate multiple Promises.",

      comparison: {
        headers: [
          "Method",
          "Main idea"
        ],

        rows: [
          [
            "Promise.all()",
            "Fulfill when all fulfill; reject when one rejects."
          ],
          [
            "Promise.allSettled()",
            "Wait for every Promise and report each result."
          ],
          [
            "Promise.race()",
            "Settle using the first Promise that settles."
          ],
          [
            "Promise.any()",
            "Fulfill when the first Promise fulfills; reject if all reject."
          ]
        ]
      },

      code:
`const results =
  await Promise.allSettled([
    loadPrimary(),
    loadBackup(),
    loadOptional()
  ]);

results.forEach(result => {

  if (result.status === "fulfilled") {
    console.log(result.value);
  } else {
    console.log(result.reason);
  }

});`,

      keyIdea:
        "Choose the Promise combinator based on the business requirement, not simply on convenience."
    },


    {
      number: 20,

      title: "The JavaScript Event Loop",

      intro:
        "The event loop explains how JavaScript can coordinate asynchronous work while executing JavaScript on the main thread.",

      code:
`console.log("A");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("B");`,

      output:
`A
B
Promise
Timer`,

      explanation:
        "The synchronous code runs first. Promise reactions are scheduled as microtasks, while the timer callback is scheduled as a task. After the current synchronous work completes, the microtask is processed before the timer callback in this example.",

      flow: [
        "Run synchronous JavaScript",
        "Register timer task",
        "Register Promise reaction",
        "Finish synchronous code",
        "Process microtasks",
        "Process eligible task such as timer callback",
        "Continue event-loop processing"
      ],

      keyIdea:
        "The event loop coordinates when queued asynchronous callbacks become eligible to run."
    },


    {
      number: 21,

      title: "Tasks and Microtasks",

      intro:
        "Not all queued asynchronous callbacks are handled in exactly the same queue.",

      comparison: {
        headers: [
          "Microtasks",
          "Tasks"
        ],

        rows: [
          [
            "Promise reactions",
            "Timers such as setTimeout callbacks"
          ],
          [
            "queueMicrotask()",
            "Many browser event callbacks"
          ],
          [
            "Processed after the current JavaScript stack completes",
            "Processed by the event loop as tasks become eligible"
          ]
        ]
      },

      code:
`console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

queueMicrotask(() => {
  console.log("3");
});

console.log("4");`,

      output:
`1
4
3
2`,

      keyIdea:
        "A zero-delay timer does not mean 'run immediately'. It schedules a task that runs after the current work and applicable microtasks."
    },


    {
      number: 22,

      title: "Promise and Event Loop Tracer",

      intro:
        "Use the execution order to predict asynchronous output before running the code.",

      code:
`console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");`,

      output:
`Start
End
Promise
Timer`,

      breakdown: [
        {
          label: "Step 1",
          description:
            "Start is printed synchronously."
        },
        {
          label: "Step 2",
          description:
            "The timer callback is scheduled as a task."
        },
        {
          label: "Step 3",
          description:
            "The Promise reaction is scheduled as a microtask."
        },
        {
          label: "Step 4",
          description:
            "End is printed synchronously."
        },
        {
          label: "Step 5",
          description:
            "The microtask runs."
        },
        {
          label: "Step 6",
          description:
            "The timer task runs."
        }
      ],

      keyIdea:
        "Predicting event-loop ordering is an important JavaScript interview skill."
    },


    {
      number: 23,

      title: "AbortController and Request Cancellation",

      intro:
        "Some asynchronous requests should be cancelled when they are no longer useful.",

      code:
`const controller =
  new AbortController();

try {

  const response =
    await fetch("/api/search", {
      signal: controller.signal
    });

  const data =
    await response.json();

} catch (error) {

  if (error.name === "AbortError") {
    console.log("Request cancelled");
  } else {
    console.error(error);
  }

}

controller.abort();`,

      flow: [
        "Create AbortController",
        "Pass its signal to fetch",
        "Start request",
        "Decide the request is no longer needed",
        "Call controller.abort()",
        "Handle AbortError"
      ],

      keyIdea:
        "Cancellation is useful for requests that become irrelevant, such as stale searches or navigation-away scenarios."
    },


    {
      number: 24,

      title: "Designing Reliable API Functions",

      intro:
        "API code should have a clear responsibility and predictable error behaviour.",

      code:
`async function getCourses() {

  const response =
    await fetch("/api/courses");

  if (!response.ok) {

    throw new Error(
      \`Request failed: \${response.status}\`
    );

  }

  return response.json();

}`,

      architecture: [
        {
          title: "Request",
          items: [
            "Build the request.",
            "Send it with Fetch."
          ]
        },
        {
          title: "Validation",
          items: [
            "Check HTTP response status.",
            "Reject unsuccessful responses."
          ]
        },
        {
          title: "Parsing",
          items: [
            "Convert response data into JavaScript values."
          ]
        },
        {
          title: "Consumer",
          items: [
            "Let the caller decide how the UI should respond."
          ]
        }
      ],

      warning:
        "Avoid hiding every error inside a low-level API helper and returning undefined. Callers need a predictable success/failure contract.",

      keyIdea:
        "A reusable API function should either provide valid data or clearly communicate failure."
    }

  ],


  visualizer: {

    title: "Promise & Event Loop Visualizer",

    description:
      "Trace synchronous code, Promise microtasks and timer tasks to understand why asynchronous output appears in a particular order.",

    steps: [

      {
        title: "Synchronous code starts",
        operation: 'console.log("Start")',
        detail:
          "Start is printed immediately because it is part of the current execution stack."
      },

      {
        title: "Timer is scheduled",
        operation: "setTimeout(..., 0)",
        detail:
          "The timer callback is registered as a task. Zero milliseconds does not mean immediate execution."
      },

      {
        title: "Promise reaction is scheduled",
        operation: "Promise.resolve().then(...)",
        detail:
          "The then callback becomes a microtask."
      },

      {
        title: "Synchronous code continues",
        operation: 'console.log("End")',
        detail:
          "The current JavaScript execution finishes before queued asynchronous callbacks run."
      },

      {
        title: "Microtask runs",
        operation: 'console.log("Promise")',
        detail:
          "The Promise reaction runs before the timer task in this example."
      },

      {
        title: "Timer task runs",
        operation: 'console.log("Timer")',
        detail:
          "The timer callback becomes the next relevant task."
      }

    ]

  },


  trace: {

    title: "Async JavaScript Execution Tracer",

    lines: [

      {
        line: 1,
        code: 'console.log("Start");'
      },

      {
        line: 2,
        code: 'setTimeout(() => {'
      },

      {
        line: 3,
        code: '  console.log("Timer");'
      },

      {
        line: 4,
        code: '}, 0);'
      },

      {
        line: 5,
        code: 'Promise.resolve().then(() => {'
      },

      {
        line: 6,
        code: '  console.log("Promise");'
      },

      {
        line: 7,
        code: '});'
      },

      {
        line: 8,
        code: 'console.log("End");'
      }

    ],

    steps: [

      {
        line: 1,
        title: "Print Start",
        detail:
          "The first statement runs synchronously."
      },

      {
        line: 2,
        title: "Register timer",
        detail:
          "The timer callback is scheduled for later."
      },

      {
        line: 5,
        title: "Schedule Promise reaction",
        detail:
          "The then callback is scheduled as a microtask."
      },

      {
        line: 8,
        title: "Print End",
        detail:
          "The current synchronous execution continues and prints End."
      },

      {
        line: 6,
        title: "Run Promise callback",
        detail:
          "The microtask is processed after the current stack completes."
      },

      {
        line: 3,
        title: "Run timer callback",
        detail:
          "The timer callback runs as a later task."
      }

    ]

  },


  revision: [

    [
      "Asynchronous",
      "Work whose completion occurs later rather than immediately in the current execution flow."
    ],

    [
      "Promise",
      "An object representing the eventual success or failure of an asynchronous operation."
    ],

    [
      "Pending",
      "Initial Promise state before it fulfills or rejects."
    ],

    [
      "Fulfilled",
      "Promise state representing successful completion."
    ],

    [
      "Rejected",
      "Promise state representing failure."
    ],

    [
      "then()",
      "Registers handling for fulfilled Promise results."
    ],

    [
      "catch()",
      "Handles Promise rejection and errors propagated through a chain."
    ],

    [
      "finally()",
      "Runs after a Promise settles regardless of success or failure."
    ],

    [
      "async",
      "Declares a function that returns a Promise."
    ],

    [
      "await",
      "Suspends the surrounding async function until a Promise settles."
    ],

    [
      "Fetch",
      "Browser API for making HTTP requests."
    ],

    [
      "Response",
      "Object representing the HTTP response received by Fetch."
    ],

    [
      "response.ok",
      "Boolean indicating whether the HTTP status is in the successful 200 range."
    ],

    [
      "JSON",
      "Text-based data format commonly used for API communication."
    ],

    [
      "Promise.all()",
      "Waits for multiple Promises and rejects when one rejects."
    ],

    [
      "Promise.allSettled()",
      "Waits for every Promise and reports each outcome."
    ],

    [
      "Promise.race()",
      "Settles according to the first Promise to settle."
    ],

    [
      "Promise.any()",
      "Fulfills when the first Promise fulfills."
    ],

    [
      "Event loop",
      "The runtime mechanism that coordinates execution of queued asynchronous work."
    ],

    [
      "Microtask",
      "A high-priority queued job such as a Promise reaction."
    ],

    [
      "AbortController",
      "API used to signal cancellation to compatible asynchronous operations."
    ]

  ],


  interview: [

    {
      question: "What is asynchronous JavaScript?",
      answer:
        "It is a programming model where operations can complete later without forcing the current JavaScript execution to wait for them synchronously."
    },

    {
      question: "Why do we need asynchronous programming in browsers?",
      answer:
        "Browsers perform operations such as network requests and timers whose completion time is unknown. Asynchronous programming allows the application to remain responsive while those operations are pending."
    },

    {
      question: "What is a Promise?",
      answer:
        "A Promise represents the eventual result of an asynchronous operation and can be pending, fulfilled or rejected."
    },

    {
      question: "What are the three Promise states?",
      answer:
        "Pending, fulfilled and rejected."
    },

    {
      question: "What does then() do?",
      answer:
        "It registers a handler that runs when the Promise is fulfilled and returns another Promise for chaining."
    },

    {
      question: "What does catch() do?",
      answer:
        "It handles Promise rejection and errors propagated through the Promise chain."
    },

    {
      question: "What does finally() do?",
      answer:
        "It runs after a Promise settles regardless of whether it fulfilled or rejected."
    },

    {
      question: "What is Promise chaining?",
      answer:
        "It is connecting asynchronous operations by returning Promises from then() handlers and handling their results in subsequent handlers."
    },

    {
      question: "What is a floating Promise?",
      answer:
        "It is an asynchronous Promise that is started but not properly returned, awaited or otherwise handled by the surrounding logic."
    },

    {
      question: "What does async do to a function?",
      answer:
        "It makes the function return a Promise and allows await to be used inside the function."
    },

    {
      question: "What does await do?",
      answer:
        "It suspends the surrounding async function until the awaited Promise settles and then provides its fulfilled value or throws its rejection."
    },

    {
      question: "Does await block the entire JavaScript runtime?",
      answer:
        "No. It suspends the surrounding async function while allowing other work to continue."
    },

    {
      question: "What does fetch() return?",
      answer:
        "fetch() returns a Promise that fulfills with a Response object when a response is received."
    },

    {
      question: "Does fetch() reject when the server returns 404?",
      answer:
        "Normally no. Fetch fulfills with a Response, so application code should check response.ok or response.status."
    },

    {
      question: "Why should response.ok be checked?",
      answer:
        "Because an HTTP error status such as 404 or 500 does not by itself cause fetch() to reject."
    },

    {
      question: "How do you parse JSON from a Fetch response?",
      answer:
        "Call await response.json() inside an async function or return response.json() in a Promise chain."
    },

    {
      question: "What is Promise.all() used for?",
      answer:
        "It waits for multiple independent Promises and fulfills when all fulfill, while rejecting if one rejects."
    },

    {
      question: "When should Promise.all() be avoided?",
      answer:
        "It should not be used when operations depend on each other or when one failure should not discard all other results."
    },

    {
      question: "What is the difference between Promise.all() and Promise.allSettled()?",
      answer:
        "Promise.all() rejects when one Promise rejects, while Promise.allSettled() waits for every Promise and reports each result."
    },

    {
      question: "What is the event loop?",
      answer:
        "It is the runtime mechanism that coordinates execution of synchronous JavaScript and queued asynchronous callbacks."
    },

    {
      question: "What is a microtask?",
      answer:
        "A microtask is a queued job such as a Promise reaction that is processed after the current JavaScript stack completes and before the next eligible task."
    },

    {
      question: "Why can Promise callbacks run before setTimeout callbacks?",
      answer:
        "Promise reactions are microtasks, while timer callbacks are tasks. Microtasks are processed before the next task in the relevant event-loop cycle."
    },

    {
      question: "What is AbortController used for?",
      answer:
        "It provides a signal that can be used to cancel compatible operations such as Fetch requests."
    },

    {
      question: "What is the difference between a network error and an HTTP error?",
      answer:
        "A network error can cause fetch() to reject, while an HTTP error such as 404 normally produces a Response whose ok property is false."
    },

    {
      question: "Why should loading, success and error states be designed separately?",
      answer:
        "Because asynchronous operations have different phases and users need clear feedback about whether work is running, completed, empty or failed."
    }

  ],


  practice: [

    {
      title: "Create a Promise",

      difficulty: "Basic",

      task:
        "Create a Promise that resolves with the message 'Learning JavaScript' after one second.",

      hints: [
        "Use new Promise().",
        "Use setTimeout() inside the Promise.",
        "Call resolve() after one second."
      ]
    },


    {
      title: "Handle Promise Success",

      difficulty: "Basic",

      task:
        "Create a Promise that resolves with the number 100 and print the value using then().",

      hints: [
        "Create a Promise.",
        "Call resolve(100).",
        "Attach a then() handler."
      ]
    },


    {
      title: "Handle Promise Failure",

      difficulty: "Basic",

      task:
        "Create a rejected Promise containing an Error and display the error message using catch().",

      hints: [
        "Use reject(new Error(...)).",
        "Attach catch() to the Promise.",
        "Read error.message."
      ]
    },


    {
      title: "Promise Chain",

      difficulty: "Intermediate",

      task:
        "Create three asynchronous functions: getUser(), getProfile() and getCourses(). Chain them so the result of one operation is passed to the next.",

      hints: [
        "Each function should return a Promise.",
        "Return the next Promise from each then() handler.",
        "Use a final then() for the courses."
      ]
    },


    {
      title: "Fix the Floating Promise",

      difficulty: "Intermediate",

      task:
        "Fix this code so the second then() receives the profile data.",

      code:
`getUser()
  .then(user => {
    getProfile(user.id);
  })
  .then(profile => {
    console.log(profile);
  });`,

      hints: [
        "The getProfile() Promise is not being returned.",
        "Add return before getProfile().",
        "Then the next then() can receive its result."
      ]
    },


    {
      title: "Convert to async/await",

      difficulty: "Intermediate",

      task:
        "Convert a Promise chain that loads a user and profile into an async function using await.",

      hints: [
        "Create an async function.",
        "Use await for getUser().",
        "Pass the user id to getProfile().",
        "Use try/catch for failures."
      ]
    },


    {
      title: "Fetch JSON",

      difficulty: "Intermediate",

      task:
        "Use fetch() to retrieve JSON from an API endpoint and print the parsed JavaScript object.",

      hints: [
        "Use await fetch(url).",
        "Store the Response object.",
        "Use await response.json().",
        "Print the resulting data."
      ]
    },


    {
      title: "Handle HTTP Errors",

      difficulty: "Intermediate",

      task:
        "Create a Fetch function that throws an Error when response.ok is false.",

      hints: [
        "Await fetch().",
        "Check response.ok.",
        "Throw a new Error when it is false.",
        "Put the operation inside try/catch."
      ]
    },


    {
      title: "Parallel API Requests",

      difficulty: "Advanced",

      task:
        "Load courses, instructors and announcements concurrently using Promise.all().",

      hints: [
        "Call all three functions before awaiting the combined result.",
        "Pass the Promises into Promise.all().",
        "Destructure the resulting array if useful."
      ]
    },


    {
      title: "Event Loop Prediction",

      difficulty: "Advanced",

      task:
        "Predict the output before running this code:",

      code:
`console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`,

      hints: [
        "Run synchronous statements first.",
        "Remember that Promise reactions are microtasks.",
        "Remember that setTimeout creates a task.",
        "Write the output order before executing the program."
      ]
    },


    {
      title: "API Loading State",

      difficulty: "Advanced",

      task:
        "Build a loadCourses() function that displays a loading message, fetches courses, renders success data, displays an error on failure and always removes the loading state.",

      hints: [
        "Start with showLoading().",
        "Use try/catch/finally.",
        "Check response.ok.",
        "Use response.json().",
        "Use finally() or finally block for cleanup."
      ]
    },


    {
      title: "Cancellable Search",

      difficulty: "Advanced",

      task:
        "Create a search function using AbortController so a previous Fetch request can be cancelled when a new search begins.",

      hints: [
        "Keep the current controller in a variable.",
        "Abort the previous controller before creating a new one.",
        "Pass controller.signal to fetch().",
        "Handle AbortError separately."
      ]
    }

  ],


  quiz: [

    {
      question: "Which state means a Promise has not completed?",
      options: [
        "pending",
        "waiting",
        "open",
        "running"
      ],
      answer: 0
    },

    {
      question: "Which method handles a fulfilled Promise?",
      options: [
        "catch()",
        "then()",
        "error()",
        "resolve()"
      ],
      answer: 1
    },

    {
      question: "Which method handles Promise rejection?",
      options: [
        "catch()",
        "rejectHandler()",
        "error()",
        "fail()"
      ],
      answer: 0
    },

    {
      question: "What does async make a function return?",
      options: [
        "An array",
        "A callback",
        "A Promise",
        "A string"
      ],
      answer: 2
    },

    {
      question: "Where can await normally be used?",
      options: [
        "Only inside loops",
        "Inside async functions and supported module contexts",
        "Only inside callbacks",
        "Only inside classes"
      ],
      answer: 1
    },

    {
      question: "What does fetch() return?",
      options: [
        "Response",
        "Promise",
        "JSON",
        "Array"
      ],
      answer: 1
    },

    {
      question: "What should normally be checked after fetch() before treating an HTTP response as successful?",
      options: [
        "response.ok",
        "response.ready",
        "response.complete",
        "response.valid"
      ],
      answer: 0
    },

    {
      question: "Which method parses a JSON response body?",
      options: [
        "response.parse()",
        "response.json()",
        "JSON.response()",
        "response.data()"
      ],
      answer: 1
    },

    {
      question: "What happens when fetch receives a normal 404 response?",
      options: [
        "fetch always rejects",
        "fetch normally fulfills with a Response",
        "The browser crashes",
        "The Promise is cancelled"
      ],
      answer: 1
    },

    {
      question: "Which Promise combinator waits for all results and rejects if one rejects?",
      options: [
        "Promise.any()",
        "Promise.race()",
        "Promise.all()",
        "Promise.first()"
      ],
      answer: 2
    },

    {
      question: "Which combinator reports both fulfilled and rejected results?",
      options: [
        "Promise.allSettled()",
        "Promise.all()",
        "Promise.any()",
        "Promise.race()"
      ],
      answer: 0
    },

    {
      question: "Which combinator fulfills when the first Promise fulfills?",
      options: [
        "Promise.all()",
        "Promise.any()",
        "Promise.race()",
        "Promise.first()"
      ],
      answer: 1
    },

    {
      question: "What is a microtask?",
      options: [
        "A CSS task",
        "A queued JavaScript job such as a Promise reaction",
        "A network request",
        "A DOM element"
      ],
      answer: 1
    },

    {
      question: "Which normally runs before a zero-delay timer callback?",
      options: [
        "A Promise microtask",
        "A later timer",
        "The next page load",
        "Nothing"
      ],
      answer: 0
    },

    {
      question: "What does AbortController provide?",
      options: [
        "JSON parsing",
        "Request cancellation signaling",
        "Promise creation",
        "DOM selection"
      ],
      answer: 1
    }

  ],


  glossary: [

    {
      term: "Asynchronous",
      definition:
        "Work whose completion can occur later without blocking the current synchronous execution."
    },

    {
      term: "Promise",
      definition:
        "An object representing the eventual result of an asynchronous operation."
    },

    {
      term: "Pending",
      definition:
        "The initial Promise state before completion."
    },

    {
      term: "Fulfilled",
      definition:
        "The successful settled state of a Promise."
    },

    {
      term: "Rejected",
      definition:
        "The failed settled state of a Promise."
    },

    {
      term: "Promise chaining",
      definition:
        "Connecting asynchronous operations by returning Promises from handlers."
    },

    {
      term: "async",
      definition:
        "A keyword that makes a function return a Promise."
    },

    {
      term: "await",
      definition:
        "An expression that waits for a Promise within an async function without blocking the entire runtime."
    },

    {
      term: "Fetch API",
      definition:
        "A browser API for making HTTP requests."
    },

    {
      term: "Response",
      definition:
        "The object returned by a fulfilled fetch Promise representing the HTTP response."
    },

    {
      term: "JSON",
      definition:
        "A text-based data representation commonly used for API communication."
    },

    {
      term: "HTTP status",
      definition:
        "A numeric response code describing the result of an HTTP request."
    },

    {
      term: "response.ok",
      definition:
        "A boolean that is true when the HTTP status is in the successful 200 range."
    },

    {
      term: "Event loop",
      definition:
        "The runtime mechanism that coordinates synchronous execution and queued asynchronous work."
    },

    {
      term: "Microtask",
      definition:
        "A queued job such as a Promise reaction that is processed after the current stack."
    },

    {
      term: "Task",
      definition:
        "A unit of queued work such as a timer callback or many browser event callbacks."
    },

    {
      term: "Concurrency",
      definition:
        "Allowing independent asynchronous operations to be in progress during overlapping periods."
    },

    {
      term: "AbortController",
      definition:
        "An API that provides a signal for cancelling compatible asynchronous operations."
    },

    {
      term: "Floating Promise",
      definition:
        "A Promise started without being correctly returned, awaited or otherwise handled by surrounding logic."
    }

  ],


  completion: {

    title: "Level 12 Complete — Master Asynchronous JavaScript",

    message:
      "You can now reason about Promises, async/await, Fetch, HTTP failures, " +
      "concurrent requests and event-loop execution. You are ready to build " +
      "browser applications that communicate with real backend services.",

    challenge:
      "Build a CodeBhavya Course Dashboard that loads courses from an API. " +
      "Display a loading state while the request is pending, handle HTTP and " +
      "network failures, render an empty state when no courses exist, display " +
      "course cards on success, support a retry button, and use Promise.all() " +
      "to load courses and instructor information concurrently. Add a search " +
      "feature using AbortController so stale requests can be cancelled."
  },


  takeaway:
    "Asynchronous JavaScript is the foundation of modern web applications. " +
    "Promises provide the underlying model, async/await provides readable syntax, " +
    "Fetch connects the browser to APIs, and the event loop explains when asynchronous " +
    "callbacks actually execute."

};


console.log(
  "CodeBhavya Full Stack Level 12 loaded: Async JavaScript & APIs"
);
