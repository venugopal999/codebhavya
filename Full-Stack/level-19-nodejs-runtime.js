
"use strict";

/* =========================================================
   CODEBHAVYA FULL STACK / MERN
   LEVEL 19 — NODE.JS RUNTIME & SERVER-SIDE JAVASCRIPT
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[19] = {

    n: 19,

    kicker: "PART 4 • NODE & EXPRESS • LEVEL 19",

    title: "Node.js Runtime & Server-Side JavaScript",

    summary:
        "Understand how Node.js runs JavaScript outside the browser, how the runtime works, how modules and npm packages are used, how asynchronous server-side code works, and how to build your first Node.js server.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Intermediate",

    concepts: 15,


    /* =====================================================
       LEARNING OUTCOMES
       ===================================================== */

    outcomes: [

        "Explain what Node.js is and why it is different from browser JavaScript.",

        "Understand the Node.js runtime and V8 JavaScript engine.",

        "Explain the role of the Node.js event loop.",

        "Understand synchronous and asynchronous server-side operations.",

        "Use the Node.js command line to execute JavaScript.",

        "Understand CommonJS and ES module concepts.",

        "Use built-in Node.js modules.",

        "Read environment information through process.",

        "Understand package.json and npm dependencies.",

        "Create a simple HTTP server using the Node.js http module.",

        "Understand request and response objects.",

        "Serve different responses based on the request URL.",

        "Understand why blocking operations can hurt server performance.",

        "Handle asynchronous work using callbacks, Promises and async/await.",

        "Prepare for the Express.js layer in the next level."

    ],


    /* =====================================================
       MAIN CONCEPTS
       ===================================================== */

    sections: [

        {
            number: 1,

            title: "What Is Node.js?",

            intro:
                "Node.js allows JavaScript to run outside the browser. Instead of using JavaScript only to control a webpage, developers can use it to build servers, APIs, command-line tools and backend applications.",

            points: [

                "<strong>Node.js is a JavaScript runtime environment.</strong>",

                "It allows JavaScript code to execute on a computer or server without requiring a browser.",

                "Node.js uses the V8 JavaScript engine to execute JavaScript.",

                "Node.js provides APIs for tasks such as files, networking, processes and streams.",

                "Node.js is widely used for backend APIs and web servers."

            ],

            comparison: {

                headers: [
                    "Browser JavaScript",
                    "Node.js JavaScript"
                ],

                rows: [

                    [
                        "Runs inside a browser",
                        "Runs directly in a runtime environment"
                    ],

                    [
                        "Works with DOM APIs",
                        "Does not provide the browser DOM by default"
                    ],

                    [
                        "Uses browser APIs",
                        "Uses Node.js APIs"
                    ],

                    [
                        "Commonly controls UI",
                        "Commonly builds servers, APIs and tools"
                    ]

                ]

            },

            keyIdea:
                "Node.js does not make JavaScript a different language. It provides a different runtime environment and APIs for executing JavaScript."

        },


        {
            number: 2,

            title: "Node.js Runtime vs Browser Runtime",

            intro:
                "JavaScript syntax is shared, but the environment around the JavaScript engine is different.",

            points: [

                "The browser provides objects such as window, document and location.",

                "Node.js provides objects and modules for server-side operations.",

                "A Node.js program normally does not have access to document.",

                "A browser application normally cannot directly read arbitrary files from the server's filesystem.",

                "The same JavaScript language can therefore be used in two very different environments."

            ],

            comparison: {

                headers: [
                    "Feature",
                    "Browser",
                    "Node.js"
                ],

                rows: [

                    [
                        "DOM",
                        "Available",
                        "Not available by default"
                    ],

                    [
                        "document",
                        "Available",
                        "Not available by default"
                    ],

                    [
                        "Filesystem",
                        "Restricted browser APIs",
                        "Node.js filesystem APIs"
                    ],

                    [
                        "HTTP server",
                        "Not normally responsible for hosting server logic",
                        "Can create HTTP servers"
                    ],

                    [
                        "process",
                        "Different browser model",
                        "Node.js process object"
                    ]

                ]

            },

            code: `console.log(typeof window);
console.log(typeof document);

console.log(process.version);`,

            keyIdea:
                "The language is JavaScript, but the available runtime APIs depend on where that JavaScript executes."

        },


        {
            number: 3,

            title: "V8 and the Node.js Runtime",

            intro:
                "Node.js uses Google's V8 JavaScript engine, the same major JavaScript engine family used by Chromium-based browsers.",

            points: [

                "V8 parses and executes JavaScript.",

                "V8 uses techniques such as JIT compilation to efficiently execute JavaScript.",

                "Node.js adds runtime capabilities around the JavaScript engine.",

                "Node.js also provides native APIs that allow JavaScript to interact with the operating system and network.",

                "Understanding this separation helps explain why Node.js can access files and networking while browser JavaScript normally cannot."

            ],

            architecture: [

                {
                    title: "Your JavaScript",

                    items: [
                        "Variables",
                        "Functions",
                        "Objects",
                        "Promises"
                    ]
                },

                {
                    title: "V8",

                    items: [
                        "Parses JavaScript",
                        "Executes JavaScript",
                        "Optimizes JavaScript"
                    ]
                },

                {
                    title: "Node.js Runtime",

                    items: [
                        "Filesystem APIs",
                        "HTTP APIs",
                        "Process APIs",
                        "Streams and networking"
                    ]
                },

                {
                    title: "Operating System",

                    items: [
                        "Files",
                        "Network",
                        "Processes",
                        "Hardware resources"
                    ]
                }

            ],

            keyIdea:
                "V8 executes JavaScript; Node.js supplies the runtime APIs and infrastructure needed for server-side development."

        },


        {
            number: 4,

            title: "Running JavaScript with Node.js",

            intro:
                "Before creating a web server, you should know how to execute a simple JavaScript file using Node.js.",

            points: [

                "Install Node.js on the development machine.",

                "Create a JavaScript file such as app.js.",

                "Open a terminal in the project directory.",

                "Run the file with the node command.",

                "Node executes the JavaScript without opening a browser."

            ],

            code: `// app.js

const name = "CodeBhavya";

console.log("Hello from " + name);`,

            terminal: `node app.js`,

            flow: [

                "Create app.js",
                "Open terminal",
                "Run node app.js",
                "Node loads the file",
                "V8 executes JavaScript",
                "Console output appears"

            ],

            keyIdea:
                "The node command is the basic entry point for executing a JavaScript program through Node.js."

        },


        {
            number: 5,

            title: "The process Object",

            intro:
                "Node.js provides a global process object that exposes information and controls related to the currently running Node.js process.",

            points: [

                "process.version provides the Node.js version.",

                "process.platform identifies the operating system platform.",

                "process.argv contains command-line arguments.",

                "process.env provides environment variables.",

                "process.exit() can terminate the current process."

            ],

            code: `console.log("Node:", process.version);

console.log("Platform:", process.platform);

console.log("Arguments:", process.argv);

console.log(
    "Environment:",
    process.env.NODE_ENV
);`,

            comparison: {

                headers: [
                    "Property",
                    "Purpose"
                ],

                rows: [

                    [
                        "process.version",
                        "Shows the Node.js version"
                    ],

                    [
                        "process.platform",
                        "Shows the operating system platform"
                    ],

                    [
                        "process.argv",
                        "Reads command-line arguments"
                    ],

                    [
                        "process.env",
                        "Reads environment variables"
                    ]

                ]

            },

            warning:
                "Environment variables often contain configuration or secrets. Never expose sensitive environment values to the browser or commit secret values into source control."

        },


        {
            number: 6,

            title: "Modules in Node.js",

            intro:
                "Large applications are divided into modules so that code can be organized and reused.",

            points: [

                "A module is a reusable unit of code.",

                "Node.js supports built-in modules such as fs, path, http and os.",

                "Applications can also create their own modules.",

                "External packages can be installed through npm.",

                "Node.js projects commonly use either CommonJS or ES module syntax."

            ],

            code: `// CommonJS

const path = require("path");

console.log(
    path.basename("/app/index.js")
);`,

            keyIdea:
                "Modules allow a large backend application to be separated into manageable pieces."

        },


        {
            number: 7,

            title: "CommonJS and ES Modules",

            intro:
                "Node.js applications can use two major module styles. Modern projects frequently use ES module syntax, while many existing Node.js projects still use CommonJS.",

            comparison: {

                headers: [
                    "Concept",
                    "CommonJS",
                    "ES Modules"
                ],

                rows: [

                    [
                        "Import",
                        "require()",
                        "import"
                    ],

                    [
                        "Export",
                        "module.exports",
                        "export"
                    ],

                    [
                        "Typical syntax",
                        "const fs = require('fs')",
                        "import fs from 'fs'"
                    ],

                    [
                        "Modern JavaScript style",
                        "Widely used in existing projects",
                        "Standard JavaScript module syntax"
                    ]

                ]

            },

            code: `// CommonJS

const math = require("./math");

console.log(
    math.add(2, 3)
);`,

            code2: `// ES Modules

import { add } from "./math.js";

console.log(
    add(2, 3)
);`,

            keyIdea:
                "Both module systems solve the same broad problem—organizing and sharing code—but use different syntax and configuration."

        },


        {
            number: 8,

            title: "Built-in Modules: path, os and fs",

            intro:
                "Node.js includes many built-in modules that provide useful server-side capabilities.",

            points: [

                "path helps work with filesystem paths safely.",

                "os provides operating-system information.",

                "fs provides filesystem operations.",

                "Built-in modules do not need to be downloaded from npm.",

                "Filesystem operations should usually use asynchronous APIs in server applications."

            ],

            code: `const path = require("path");
const os = require("os");

console.log(
    path.join(
        "users",
        "codebhavya",
        "data.txt"
    )
);

console.log(
    os.platform()
);

console.log(
    os.cpus().length
);`,

            comparison: {

                headers: [
                    "Module",
                    "Purpose",
                    "Example"
                ],

                rows: [

                    [
                        "path",
                        "Work with paths",
                        "path.join()"
                    ],

                    [
                        "os",
                        "Operating-system information",
                        "os.platform()"
                    ],

                    [
                        "fs",
                        "Read/write files",
                        "fs.readFile()"
                    ],

                    [
                        "http",
                        "Create HTTP servers",
                        "http.createServer()"
                    ]

                ]

            }

        },


        {
            number: 9,

            title: "Synchronous vs Asynchronous Operations",

            intro:
                "Backend applications frequently perform operations that take time, such as reading files, making network requests or querying databases.",

            points: [

                "A synchronous operation blocks the current JavaScript execution until it finishes.",

                "An asynchronous operation allows other work to continue while the operation is waiting.",

                "Blocking operations can reduce the ability of a server to handle multiple requests efficiently.",

                "Node.js is designed around asynchronous, non-blocking I/O.",

                "Not every operation must be asynchronous, but server-side I/O should be considered carefully."

            ],

            code: `const fs = require("fs");

console.log("Start");

const data = fs.readFileSync(
    "message.txt",
    "utf8"
);

console.log(data);

console.log("End");`,

            code2: `const fs = require("fs");

console.log("Start");

fs.readFile(
    "message.txt",
    "utf8",
    (error, data) => {

        if (error) {
            console.error(error);
            return;
        }

        console.log(data);
    }
);

console.log("End");`,

            comparison: {

                headers: [
                    "Synchronous",
                    "Asynchronous"
                ],

                rows: [

                    [
                        "Waits for operation",
                        "Does not block while I/O is waiting"
                    ],

                    [
                        "Simple control flow",
                        "Requires callback, Promise or async/await handling"
                    ],

                    [
                        "Can block server work",
                        "Better suited to concurrent I/O workloads"
                    ]

                ]

            },

            keyIdea:
                "The important distinction is not simply 'fast versus slow'. It is whether the current JavaScript execution is blocked while waiting for I/O."

        },


        {
            number: 10,

            title: "The Node.js Event Loop",

            intro:
                "Node.js can handle many I/O operations efficiently because asynchronous work can be coordinated through the event loop.",

            points: [

                "JavaScript execution in Node.js uses a main event-loop-driven model.",

                "When asynchronous I/O is started, Node.js can continue processing other work.",

                "When the asynchronous operation completes, its callback or continuation can be scheduled for execution.",

                "Promises and timers also participate in the broader event-loop scheduling model.",

                "CPU-heavy JavaScript can still block the event loop."

            ],

            code: `console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");`,

            expected: `A
C
B`,

            flow: [

                "Execute synchronous code",
                "Schedule timer",
                "Continue synchronous code",
                "Synchronous stack becomes clear",
                "Timer callback becomes eligible",
                "Callback executes"

            ],

            keyIdea:
                "A timer of 0 milliseconds does not mean 'execute immediately'. It means the callback becomes eligible after the relevant scheduling conditions are met."

        },


        {
            number: 11,

            title: "Callbacks, Promises and async/await",

            intro:
                "Node.js applications commonly deal with asynchronous operations. JavaScript provides several ways to represent those operations.",

            points: [

                "Callbacks receive a function to execute after an operation completes.",

                "Promises represent a future result or failure.",

                "async functions provide a convenient way to work with Promises.",

                "await pauses that async function until the Promise settles; it does not block the entire Node.js process.",

                "try/catch can be used with await to handle rejected Promises."

            ],

            code: `function getUser() {
    return Promise.resolve({
        id: 101,
        name: "Anita"
    });
}

async function showUser() {

    try {

        const user = await getUser();

        console.log(user.name);

    } catch (error) {

        console.error(error);

    }

}

showUser();`,

            comparison: {

                headers: [
                    "Style",
                    "Main idea"
                ],

                rows: [

                    [
                        "Callback",
                        "Function runs after operation completes"
                    ],

                    [
                        "Promise",
                        "Represents eventual success or failure"
                    ],

                    [
                        "async/await",
                        "Readable syntax for Promise-based workflows"
                    ]

                ]

            }

        },


        {
            number: 12,

            title: "package.json and npm",

            intro:
                "A Node.js project normally needs a package manifest that describes the project, scripts and dependencies.",

            points: [

                "package.json describes a Node.js project.",

                "The dependencies section lists packages required by the application.",

                "The devDependencies section commonly contains development-only tools.",

                "The scripts section can define reusable commands.",

                "npm is the package manager commonly used with Node.js projects."

            ],

            code: `{
    "name": "codebhavya-api",
    "version": "1.0.0",
    "description": "CodeBhavya backend",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "dev": "node --watch server.js"
    }
}`,

            terminal: `npm init -y

npm install express

npm run start`,

            keyIdea:
                "package.json becomes the central project manifest for dependencies, scripts and basic project metadata."

        },


        {
            number: 13,

            title: "Creating Your First HTTP Server",

            intro:
                "Node.js includes the built-in http module, which can be used to create a basic HTTP server without Express.",

            points: [

                "The http module provides server functionality.",

                "http.createServer() creates a server.",

                "The request object describes the incoming HTTP request.",

                "The response object is used to send a response.",

                "server.listen() starts listening for incoming connections."

            ],

            code: `const http = require("http");

const server = http.createServer(
    (req, res) => {

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end(
            "Hello from CodeBhavya!"
        );
    }
);

server.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});`,

            flow: [

                "Client sends HTTP request",
                "Node.js HTTP server receives request",
                "Request callback executes",
                "Application prepares response",
                "Response headers are sent",
                "Response body is sent",
                "Client receives response"

            ],

            keyIdea:
                "The HTTP server callback is the bridge between an incoming network request and the response produced by your backend code."

        },


        {
            number: 14,

            title: "Request and Response Objects",

            intro:
                "The request and response objects provide the basic tools required to understand an HTTP interaction.",

            points: [

                "req.method identifies the HTTP method.",

                "req.url identifies the requested URL path and query string.",

                "req.headers contains request headers.",

                "res.writeHead() can define response status and headers.",

                "res.end() finishes the response.",

                "The response should be completed exactly once for a normal request."

            ],

            code: `const http = require("http");

const server = http.createServer(
    (req, res) => {

        console.log(
            "Method:",
            req.method
        );

        console.log(
            "URL:",
            req.url
        );

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end(
            "Request received"
        );
    }
);

server.listen(3000);`,

            comparison: {

                headers: [
                    "Object",
                    "Useful property",
                    "Purpose"
                ],

                rows: [

                    [
                        "req",
                        "req.method",
                        "HTTP method"
                    ],

                    [
                        "req",
                        "req.url",
                        "Requested URL"
                    ],

                    [
                        "req",
                        "req.headers",
                        "Request metadata"
                    ],

                    [
                        "res",
                        "res.writeHead()",
                        "Status and headers"
                    ],

                    [
                        "res",
                        "res.end()",
                        "Finish response"
                    ]

                ]

            }

        },


        {
            number: 15,

            title: "Routing with the Built-in HTTP Module",

            intro:
                "Even without Express, a Node.js server can respond differently depending on the HTTP method and URL.",

            code: `const http = require("http");

const server = http.createServer(
    (req, res) => {

        res.setHeader(
            "Content-Type",
            "text/plain"
        );

        if (
            req.method === "GET" &&
            req.url === "/"
        ) {

            res.statusCode = 200;

            res.end(
                "Home Page"
            );

            return;
        }

        if (
            req.method === "GET" &&
            req.url === "/about"
        ) {

            res.statusCode = 200;

            res.end(
                "About CodeBhavya"
            );

            return;
        }

        res.statusCode = 404;

        res.end(
            "Page Not Found"
        );
    }
);

server.listen(3000);`,

            comparison: {

                headers: [
                    "Request",
                    "Response"
                ],

                rows: [

                    [
                        "GET /",
                        "Home Page"
                    ],

                    [
                        "GET /about",
                        "About CodeBhavya"
                    ],

                    [
                        "GET /unknown",
                        "404 Page Not Found"
                    ]

                ]

            },

            keyIdea:
                "Routing means deciding which server-side code should handle a particular HTTP request."

        }

    ],


    /* =====================================================
       PREMIUM VISUALIZER
       ===================================================== */

    visualizer: {

        title: "Node.js Event Loop & HTTP Request Laboratory",

        description:
            "Trace an incoming HTTP request while Node.js continues handling asynchronous work.",

        steps: [

            {
                title: "Server Starts",

                operation:
                    "server.listen(3000)",

                detail:
                    "Node.js starts listening for incoming connections on the configured port."
            },

            {
                title: "Client Sends Request",

                operation:
                    "GET /products",

                detail:
                    "A client sends an HTTP request to the server."
            },

            {
                title: "Request Callback",

                operation:
                    "createServer callback executes",

                detail:
                    "Node.js provides the request and response objects to the server callback."
            },

            {
                title: "Application Logic",

                operation:
                    "Check method and URL",

                detail:
                    "The application determines which route should handle the request."
            },

            {
                title: "Async Operation",

                operation:
                    "Read data / query database",

                detail:
                    "An asynchronous operation can begin without blocking all other event-loop work."
            },

            {
                title: "Event Loop Continues",

                operation:
                    "Process other available work",

                detail:
                    "Node.js can continue handling other callbacks and requests while asynchronous I/O is waiting."
            },

            {
                title: "I/O Completes",

                operation:
                    "Data becomes available",

                detail:
                    "The asynchronous operation finishes and its continuation becomes eligible to run."
            },

            {
                title: "Prepare Response",

                operation:
                    "res.end(data)",

                detail:
                    "The server sends the result to the client."
            },

            {
                title: "Client Receives Response",

                operation:
                    "HTTP 200",

                detail:
                    "The client receives the server response."
            },

            {
                title: "Next Request",

                operation:
                    "GET /about",

                detail:
                    "The same Node.js process remains available for additional requests."
            }

        ]

    },


    /* =====================================================
       PROGRAM TRACING
       ===================================================== */

    trace: {

        title: "Trace a Node.js HTTP Server",

        lines: [

            {
                line: 1,
                code: 'const http = require("http");'
            },

            {
                line: 2,
                code: "const server = http.createServer("
            },

            {
                line: 3,
                code: "    (req, res) => {"
            },

            {
                line: 4,
                code: '        if (req.url === "/") {'
            },

            {
                line: 5,
                code: "            res.statusCode = 200;"
            },

            {
                line: 6,
                code: '            res.end("Home Page");'
            },

            {
                line: 7,
                code: "            return;"
            },

            {
                line: 8,
                code: "        }"
            },

            {
                line: 9,
                code: "        res.statusCode = 404;"
            },

            {
                line: 10,
                code: '        res.end("Not Found");'
            },

            {
                line: 11,
                code: "    }"
            },

            {
                line: 12,
                code: ");"
            },

            {
                line: 13,
                code: "server.listen(3000);"
            }

        ],

        steps: [

            {
                line: 1,
                state: "Module",

                explain:
                    "Node.js loads the built-in HTTP module."
            },

            {
                line: 2,
                state: "Server",

                explain:
                    "A new HTTP server is created."
            },

            {
                line: 3,
                state: "Request handler",

                explain:
                    "The callback receives the incoming request and response objects."
            },

            {
                line: 4,
                state: "Routing",

                explain:
                    "The application checks whether the requested URL is the home route."
            },

            {
                line: 5,
                state: "Status",

                explain:
                    "A successful HTTP status code is selected."
            },

            {
                line: 6,
                state: "Response",

                explain:
                    "The server sends the Home Page response."
            },

            {
                line: 7,
                state: "Stop",

                explain:
                    "return prevents the fallback 404 response from executing."
            },

            {
                line: 8,
                state: "Fallback check",

                explain:
                    "If the URL was not '/', execution would continue here."
            },

            {
                line: 9,
                state: "404",

                explain:
                    "The server prepares a Not Found response."
            },

            {
                line: 10,
                state: "Response",

                explain:
                    "The fallback response is sent to the client."
            },

            {
                line: 11,
                state: "Handler complete",

                explain:
                    "The request callback finishes."
            },

            {
                line: 12,
                state: "Server object",

                explain:
                    "The HTTP server object has been fully configured."
            },

            {
                line: 13,
                state: "Listening",

                explain:
                    "The server starts listening on port 3000."
            }

        ]

    },


    /* =====================================================
       QUICK REVISION
       ===================================================== */

    revision: [

        [
            "Node.js",
            "A JavaScript runtime used to execute JavaScript outside the browser."
        ],

        [
            "V8",
            "The JavaScript engine used by Node.js to execute JavaScript."
        ],

        [
            "Runtime",
            "The environment that provides the APIs and infrastructure surrounding JavaScript execution."
        ],

        [
            "process",
            "A Node.js global object containing information about the running process."
        ],

        [
            "Module",
            "A reusable unit of application code."
        ],

        [
            "CommonJS",
            "A Node.js module system using require() and module.exports."
        ],

        [
            "ES Modules",
            "JavaScript's standard import/export module syntax."
        ],

        [
            "npm",
            "A package manager and ecosystem commonly used with Node.js."
        ],

        [
            "package.json",
            "The project manifest containing metadata, scripts and dependencies."
        ],

        [
            "Event Loop",
            "The mechanism that coordinates asynchronous callbacks and other scheduled work."
        ],

        [
            "HTTP Server",
            "A program that receives HTTP requests and sends HTTP responses."
        ],

        [
            "Request",
            "The information sent by a client to a server."
        ],

        [
            "Response",
            "The information returned by a server to a client."
        ],

        [
            "Non-blocking I/O",
            "An approach where JavaScript can continue processing while asynchronous I/O is waiting."
        ]

    ],


    /* =====================================================
       INTERVIEW QUESTIONS
       ===================================================== */

    interview: [

        {
            question:
                "What is Node.js?",

            answer:
                "Node.js is a JavaScript runtime environment that allows JavaScript to execute outside the browser and provides APIs for server-side operations."
        },

        {
            question:
                "Is Node.js a programming language?",

            answer:
                "No. Node.js is a runtime environment for executing JavaScript."
        },

        {
            question:
                "What JavaScript engine does Node.js use?",

            answer:
                "Node.js uses the V8 JavaScript engine."
        },

        {
            question:
                "What is the difference between Node.js and browser JavaScript?",

            answer:
                "They execute JavaScript in different runtime environments. Browsers provide DOM and browser APIs, while Node.js provides server-side APIs such as filesystem, process and HTTP functionality."
        },

        {
            question:
                "What is the event loop?",

            answer:
                "The event loop coordinates JavaScript execution with asynchronous callbacks and other scheduled work so Node.js can efficiently handle I/O."
        },

        {
            question:
                "Why is blocking code dangerous in a Node.js server?",

            answer:
                "Long-running synchronous JavaScript can block the event loop and prevent the process from handling other work during that period."
        },

        {
            question:
                "What is package.json?",

            answer:
                "It is the main project manifest containing information such as project metadata, scripts and dependencies."
        },

        {
            question:
                "What is npm?",

            answer:
                "npm is a package manager and package ecosystem commonly used to install and manage Node.js dependencies."
        },

        {
            question:
                "What does http.createServer() do?",

            answer:
                "It creates an HTTP server and accepts a callback that handles incoming requests."
        },

        {
            question:
                "What are req and res?",

            answer:
                "req represents the incoming HTTP request and res represents the response that the server sends back."
        },

        {
            question:
                "What is the difference between require and import?",

            answer:
                "require() belongs to the CommonJS module style, while import/export belongs to the ES module syntax."
        },

        {
            question:
                "Does await block the entire Node.js server?",

            answer:
                "No. await pauses the current async function until its Promise settles; it does not mean that the entire Node.js event loop is synchronously blocked."
        }

    ],


    /* =====================================================
       PRACTICE
       ===================================================== */

    practice: [

        {
            title: "First Node Program",

            task:
                "Create app.js that prints the CodeBhavya name, your Node.js version and the current operating-system platform.",

            hint:
                "Use console.log(), process.version and process.platform.",

            answer:
                "Use process.version for the Node.js version and process.platform for the operating-system platform."
        },

        {
            title: "Command-Line Arguments",

            task:
                "Run a Node.js program using a name supplied from the terminal and print a greeting using process.argv.",

            hint:
                "process.argv contains command-line arguments.",

            answer:
                "Read the appropriate argument from process.argv and include it in a greeting."
        },

        {
            title: "Module Practice",

            task:
                "Create a math module containing add() and multiply() functions and import them into another Node.js file.",

            hint:
                "Practice either CommonJS or ES module syntax consistently.",

            answer:
                "Export the functions from one file and import or require them from the main application file."
        },

        {
            title: "HTTP Server",

            task:
                "Create a Node.js HTTP server on port 3000 that returns 'Welcome to CodeBhavya' for GET /.",

            hint:
                "Use http.createServer() and res.end().",

            answer:
                "Create the server, check req.method and req.url, then send the appropriate response with res.end()."
        },

        {
            title: "Simple Routing",

            task:
                "Add GET /about and GET /contact routes. Return a 404 response for unknown routes.",

            hint:
                "Check req.url and set res.statusCode appropriately.",

            answer:
                "Use conditional routing for the known paths and a final 404 response for everything else."
        },

        {
            title: "Async Investigation",

            task:
                "Write a program containing normal console output and a setTimeout callback. Predict the output order before running it.",

            hint:
                "Synchronous code executes before the timer callback.",

            answer:
                "The synchronous statements execute first. The timer callback executes later when it becomes eligible through the event-loop scheduling process."
        },

        {
            title: "package.json Practice",

            task:
                "Initialize a Node.js project and create a start script that executes server.js.",

            hint:
                "Use npm init and the scripts section.",

            answer:
                "Initialize the project and add a start script such as 'start': 'node server.js'."
        },

        {
            title: "Performance Decision",

            task:
                "A server reads a very large file synchronously for every request. Explain why this may become a scalability problem.",

            hint:
                "Think about event-loop blocking.",

            answer:
                "A synchronous file read blocks JavaScript execution while the file operation completes, which can delay other requests handled by the same process."
        }

    ],


    /* =====================================================
       MCQ
       ===================================================== */

    quiz: [

        {
            question:
                "What is Node.js?",

            options: [
                "A database",
                "A JavaScript runtime",
                "A CSS framework",
                "A browser"
            ],

            answer: 1,

            explanation:
                "Node.js is a runtime environment for executing JavaScript outside the browser."
        },

        {
            question:
                "Which JavaScript engine does Node.js use?",

            options: [
                "V8",
                "Gecko",
                "WebKit",
                "SpiderMonkey only"
            ],

            answer: 0,

            explanation:
                "Node.js uses the V8 JavaScript engine."
        },

        {
            question:
                "Which object provides information about the current Node.js process?",

            options: [
                "window",
                "document",
                "process",
                "browser"
            ],

            answer: 2,

            explanation:
                "Node.js provides the global process object."
        },

        {
            question:
                "Which module is used to create a basic HTTP server?",

            options: [
                "http",
                "html",
                "browser",
                "dom"
            ],

            answer: 0,

            explanation:
                "Node.js provides the built-in http module."
        },

        {
            question:
                "What does package.json normally contain?",

            options: [
                "Only HTML",
                "Only CSS",
                "Project metadata, scripts and dependencies",
                "Browser cookies"
            ],

            answer: 2,

            explanation:
                "package.json is the main manifest for a Node.js project."
        },

        {
            question:
                "Which syntax belongs to CommonJS?",

            options: [
                "require()",
                "document.querySelector()",
                "className",
                "window.alert()"
            ],

            answer: 0,

            explanation:
                "require() is commonly used with the CommonJS module system."
        },

        {
            question:
                "What is a major risk of long synchronous operations in a Node.js server?",

            options: [
                "They automatically improve concurrency",
                "They can block the event loop",
                "They remove all HTTP headers",
                "They disable JavaScript"
            ],

            answer: 1,

            explanation:
                "Long synchronous JavaScript or blocking operations can prevent the event loop from handling other work."
        },

        {
            question:
                "What does req.url generally provide?",

            options: [
                "The requested URL",
                "The database password",
                "The server CPU temperature",
                "The Node.js version"
            ],

            answer: 0,

            explanation:
                "req.url provides the URL information associated with the incoming HTTP request."
        },

        {
            question:
                "What does res.end() do?",

            options: [
                "Starts npm",
                "Finishes the HTTP response",
                "Installs Node.js",
                "Creates a database"
            ],

            answer: 1,

            explanation:
                "res.end() finishes the HTTP response."
        },

        {
            question:
                "Which statement about await is correct?",

            options: [
                "It blocks the entire Node.js process",
                "It pauses the current async function until the Promise settles",
                "It removes the event loop",
                "It only works in CSS"
            ],

            answer: 1,

            explanation:
                "await pauses the current async function while allowing the broader Node.js runtime to continue handling other work."
        }

    ],


    /* =====================================================
       GLOSSARY
       ===================================================== */

    glossary: [

        {
            term: "Node.js",
            definition:
                "A JavaScript runtime environment for executing JavaScript outside the browser."
        },

        {
            term: "Runtime",
            definition:
                "The environment that provides the facilities required to execute a program."
        },

        {
            term: "V8",
            definition:
                "The JavaScript engine used by Node.js."
        },

        {
            term: "process",
            definition:
                "A Node.js global object containing information and controls related to the running process."
        },

        {
            term: "Module",
            definition:
                "A reusable unit of application code."
        },

        {
            term: "CommonJS",
            definition:
                "A module system commonly associated with Node.js using require() and module.exports."
        },

        {
            term: "ES Module",
            definition:
                "The standard JavaScript module system using import and export syntax."
        },

        {
            term: "npm",
            definition:
                "A package manager and ecosystem commonly used with Node.js."
        },

        {
            term: "package.json",
            definition:
                "A Node.js project manifest containing metadata, scripts and dependency information."
        },

        {
            term: "Event Loop",
            definition:
                "A scheduling mechanism that coordinates asynchronous callbacks and other work in Node.js."
        },

        {
            term: "Non-blocking I/O",
            definition:
                "An approach that allows JavaScript to continue processing while asynchronous I/O is waiting."
        },

        {
            term: "HTTP Server",
            definition:
                "A program that receives HTTP requests and produces HTTP responses."
        },

        {
            term: "Request",
            definition:
                "Information sent from a client to a server."
        },

        {
            term: "Response",
            definition:
                "Information returned from a server to a client."
        },

        {
            term: "Routing",
            definition:
                "The process of deciding which server-side logic should handle a particular request."
        }

    ],


    /* =====================================================
       COMPLETION
       ===================================================== */

    completion: {

        title: "Node.js Runtime & Server-Side JavaScript Completed",

        message:
            "You now understand how JavaScript moves from the browser into the backend world. You can explain the Node.js runtime, modules, npm, asynchronous execution, the event loop and basic HTTP servers.",

        achievements: [

            "You understand what Node.js is and why it is used for backend development.",

            "You understand the difference between browser JavaScript and Node.js.",

            "You understand V8 and the Node.js runtime model.",

            "You can execute JavaScript using the node command.",

            "You understand process and environment information.",

            "You understand CommonJS and ES module concepts.",

            "You can use Node.js built-in modules.",

            "You understand synchronous and asynchronous operations.",

            "You understand the Node.js event loop.",

            "You understand callbacks, Promises and async/await.",

            "You understand package.json and npm.",

            "You can create a basic HTTP server.",

            "You understand request, response and basic routing.",

            "You are ready to learn Express.js."

        ],

        nextLevel:
            "Level 20 — Express.js Fundamentals & REST APIs"

    }

};

