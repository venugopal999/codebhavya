"use strict";

/* =========================================================
CODEBHAVYA FULL STACK / MERN
LEVEL 20 — EXPRESS.JS FUNDAMENTALS & REST APIs
========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[20] = {


n: 20,

kicker: "PART 4 • NODE & EXPRESS • LEVEL 20",

title: "Express.js Fundamentals & REST APIs",

summary:
    "Learn how Express.js simplifies Node.js HTTP development through routing, middleware, request and response handling, REST API design, parameters, JSON responses and structured server-side applications.",

duration: "Estimated learning time: 3–4 hours",

difficulty: "Intermediate",

concepts: 16,


/* =====================================================
   LEARNING OUTCOMES
   ===================================================== */

outcomes: [

    "Explain why Express.js is used with Node.js.",

    "Create a basic Express application.",

    "Understand the request-response lifecycle in Express.",

    "Create GET, POST, PUT, PATCH and DELETE routes.",

    "Understand middleware and middleware execution order.",

    "Use express.json() to process JSON request bodies.",

    "Read route parameters and query parameters.",

    "Return JSON responses with appropriate HTTP status codes.",

    "Understand REST resource-oriented API design.",

    "Separate routes from application logic.",

    "Handle 404 responses for unknown routes.",

    "Create centralized error-handling middleware.",

    "Understand route chaining and reusable middleware.",

    "Design a small CRUD API.",

    "Test API endpoints using tools such as Postman or curl.",

    "Prepare for validation, authentication and security in the next Express levels."

],


/* =====================================================
   MAIN CONCEPTS
   ===================================================== */

sections: [

    {
        number: 1,

        title: "Why Express.js?",

        intro:
            "Node.js can create HTTP servers directly, but manually handling every method and URL quickly becomes difficult as an application grows. Express.js provides a simpler application framework on top of Node.js HTTP capabilities.",

        points: [

            "Express.js is a lightweight web application framework for Node.js.",

            "It simplifies routing and middleware handling.",

            "It provides convenient request and response APIs.",

            "It makes REST API development easier to organize.",

            "It does not replace Node.js. Express runs on top of Node.js."

        ],

        comparison: {

            headers: [

                "Node.js http module",

                "Express.js"

            ],

            rows: [

                [

                    "Manual route checks",

                    "Declarative route methods"

                ],

                [

                    "More low-level request handling",

                    "Convenient req and res APIs"

                ],

                [

                    "Middleware must be designed manually",

                    "Built-in middleware patterns and ecosystem"

                ],

                [

                    "More boilerplate",

                    "Less boilerplate for common web applications"

                ]

            ]

        },

        keyIdea:
            "Express is a framework that makes common Node.js web-server tasks easier without changing the underlying JavaScript language."

    },


    {
        number: 2,

        title: "Creating an Express Application",

        intro:
            "An Express application begins with installing Express, importing it, creating an application object and starting a server.",

        terminal:


npm init -y

npm install express`,


        code:


const express = require("express");

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
console.log(
"Server running on port " + PORT
);
});`,


        points: [

            "express() creates an Express application.",

            "The app object provides methods for routing and middleware.",

            "app.listen() starts the HTTP server.",

            "Express uses Node.js underneath to handle HTTP communication."

        ],

        flow: [

            "Install Express",

            "Import Express",

            "Create app",

            "Configure middleware and routes",

            "Start server",

            "Wait for requests"

        ],

        keyIdea:
            "The Express app object becomes the central place where server behaviour is configured."

    },


    {
        number: 3,

        title: "The Express Request-Response Lifecycle",

        intro:
            "Every HTTP request passes through the Express application before a response is returned to the client.",

        points: [

            "A client sends an HTTP request.",

            "Express receives the request.",

            "Middleware can inspect or modify the request.",

            "Express matches the request to a route.",

            "Route logic performs the required work.",

            "The server sends a response.",

            "The request lifecycle ends."

        ],

        flow: [

            "Client",

            "HTTP Request",

            "Express Application",

            "Middleware",

            "Route Matching",

            "Controller / Route Logic",

            "Response",

            "Client"

        ],

        keyIdea:
            "Middleware and routing together form the core request-processing pipeline in an Express application."

    },


    {
        number: 4,

        title: "GET Routes",

        intro:
            "A GET route normally retrieves information from the server.",

        code:


const express = require("express");

const app = express();

app.get("/", (req, res) => {


res.send("Welcome to CodeBhavya");


});

app.get("/about", (req, res) => {


res.send("About Page");


});

app.listen(3000);`,


        points: [

            "app.get() defines a route for GET requests.",

            "The first argument is the route path.",

            "The callback receives req and res.",

            "res.send() sends a response.",

            "Different URLs can have different route handlers."

        ],

        comparison: {

            headers: [

                "Request",

                "Route",

                "Purpose"

            ],

            rows: [

                [

                    "GET /",

                    "/",

                    "Home"

                ],

                [

                    "GET /about",

                    "/about",

                    "About information"

                ],

                [

                    "GET /students",

                    "/students",

                    "Retrieve students"

                ]

            ]

        }

    },


    {
        number: 5,

        title: "POST, PUT, PATCH and DELETE",

        intro:
            "REST APIs use HTTP methods to communicate the intended operation on a resource.",

        comparison: {

            headers: [

                "Method",

                "Typical meaning",

                "Example"

            ],

            rows: [

                [

                    "GET",

                    "Read",

                    "GET /students"

                ],

                [

                    "POST",

                    "Create",

                    "POST /students"

                ],

                [

                    "PUT",

                    "Replace an existing resource",

                    "PUT /students/101"

                ],

                [

                    "PATCH",

                    "Partially update a resource",

                    "PATCH /students/101"

                ],

                [

                    "DELETE",

                    "Remove",

                    "DELETE /students/101"

                ]

            ]

        },

        code:


app.post("/students", (req, res) => {

res.status(201).json({
    message: "Student created"
});


});

app.put("/students/:id", (req, res) => {


res.json({
    message: "Student replaced",
    id: req.params.id
});


});

app.patch("/students/:id", (req, res) => {


res.json({
    message: "Student updated",
    id: req.params.id
});


});

app.delete("/students/:id", (req, res) => {


res.json({
    message: "Student deleted",
    id: req.params.id
});


});,


        keyIdea:
            "HTTP methods communicate the intended action while the URL identifies the resource."

    },


    {
        number: 6,

        title: "Middleware",

        intro:
            "Middleware is one of the most important Express concepts. Middleware functions run during the request-response lifecycle and can inspect, modify or control the request flow.",

        points: [

            "Middleware receives req, res and next.",

            "It can execute code before a route handler.",

            "It can modify request or response objects.",

            "It can terminate the request by sending a response.",

            "It can call next() to continue to the next middleware or route."

        ],

        code:


app.use((req, res, next) => {


console.log(
    req.method,
    req.url
);

next();


});,


        flow: [

            "Request arrives",

            "Middleware 1 runs",

            "next()",

            "Middleware 2 runs",

            "next()",

            "Route handler runs",

            "Response sent"

        ],

        warning:
            "If middleware neither sends a response nor calls next(), the request can remain pending."

    },


    {
        number: 7,

        title: "Built-in JSON Middleware",

        intro:
            "APIs frequently receive JSON data from clients. Express provides express.json() to parse JSON request bodies.",

        code:


const express = require("express");

const app = express();

app.use(express.json());

app.post("/students", (req, res) => {


console.log(req.body);

res.status(201).json({
    message: "Student received",
    student: req.body
});


});

app.listen(3000);`,

        points: [

            "express.json() is middleware.",

            "It parses incoming JSON request bodies.",

            "After parsing, the data is available through req.body.",

            "The middleware should be registered before routes that need parsed JSON bodies."

        ],

        flow: [

            "Client sends JSON",

            "Request enters Express",

            "express.json() parses body",

            "req.body becomes available",

            "POST route runs",

            "JSON response is returned"

        ],

        keyIdea:
            "Middleware converts raw incoming request information into a convenient form that route handlers can use."

    },


    {
        number: 8,

        title: "Route Parameters",

        intro:
            "Route parameters represent dynamic values embedded in a URL path.",

        code:


app.get("/students/:id", (req, res) => {


const studentId = req.params.id;

res.json({
    message: "Student requested",
    id: studentId
});


});,


        points: [

            "A route parameter is written with a colon.",

            "For example, /students/:id defines an id parameter.",

            "The value is available through req.params.",

            "Route parameters are useful for identifying individual resources."

        ],

        comparison: {

            headers: [

                "Request",

                "Parameter value"

            ],

            rows: [

                [

                    "GET /students/101",

                    "id = 101"

                ],

                [

                    "GET /students/205",

                    "id = 205"

                ],

                [

                    "GET /students/999",

                    "id = 999"

                ]

            ]

        },

        keyIdea:
            "Route parameters usually identify a particular resource."

    },


    {
        number: 9,

        title: "Query Parameters",

        intro:
            "Query parameters are values placed after the ? in a URL and are commonly used for filtering, searching, sorting and pagination.",

        code:


app.get("/students", (req, res) => {


const course = req.query.course;

const page = req.query.page;

res.json({
    course,
    page
});


});,


        example:


GET /students?course=aiml&page=2`,


        points: [

            "Query parameters are available through req.query.",

            "They are useful for optional filtering or configuration.",

            "They should not normally be confused with resource identity.",

            "A route parameter and query parameter serve different purposes."

        ],

        comparison: {

            headers: [

                "URL",

                "Type",

                "Typical purpose"

            ],

            rows: [

                [

                    "/students/101",

                    "Route parameter",

                    "Identify student 101"

                ],

                [

                    "/students?course=aiml",

                    "Query parameter",

                    "Filter students"

                ]

            ]

        }

    },


    {
        number: 10,

        title: "Sending JSON Responses",

        intro:
            "REST APIs commonly communicate using JSON rather than HTML pages.",

        code:


app.get("/api/course", (req, res) => {


res.json({

    course: "Full Stack / MERN",

    provider: "CodeBhavya",

    level: 20,

    status: "active"

});


});,


        points: [

            "res.json() sends a JSON response.",

            "Express automatically sets an appropriate JSON content type.",

            "JSON is easy for frontend JavaScript applications to consume.",

            "Consistent response structures make APIs easier to use."

        ],

        example:


{
    "course": "Full Stack / MERN",
    "provider": "CodeBhavya",
    "level": 20,
    "status": "active"
},


        keyIdea:
            "A REST API should return predictable, machine-readable responses."

    },


    {
        number: 11,

        title: "HTTP Status Codes",

        intro:
            "Status codes tell the client what happened during request processing.",

        comparison: {

            headers: [

                "Status",

                "Meaning",

                "Typical use"

            ],

            rows: [

                [

                    "200",

                    "OK",

                    "Successful read or operation"

                ],

                [

                    "201",

                    "Created",

                    "Resource successfully created"

                ],

                [

                    "204",

                    "No Content",

                    "Successful operation with no response body"

                ],

                [

                    "400",

                    "Bad Request",

                    "Invalid client input"

                ],

                [

                    "401",

                    "Unauthorized",

                    "Authentication is required or invalid"

                ],

                [

                    "403",

                    "Forbidden",

                    "Authenticated client lacks permission"

                ],

                [

                    "404",

                    "Not Found",

                    "Requested resource does not exist"

                ],

                [

                    "500",

                    "Internal Server Error",

                    "Unexpected server-side failure"

                ]

            ]

        },

        code:


app.get("/students/:id", (req, res) => {


const student = findStudent(
    req.params.id
);

if (!student) {

    return res.status(404).json({
        message: "Student not found"
    });

}

res.status(200).json(student);


});,


        keyIdea:
            "Status codes are part of the API contract. Clients use them to understand the outcome of a request."

    },


    {
        number: 12,

        title: "REST Resource Design",

        intro:
            "REST APIs are easier to understand when URLs represent resources rather than actions.",

        comparison: {

            headers: [

                "Less resource-oriented",

                "Resource-oriented"

            ],

            rows: [

                [

                    "GET /getStudents",

                    "GET /students"

                ],

                [

                    "POST /createStudent",

                    "POST /students"

                ],

                [

                    "GET /getStudentById/101",

                    "GET /students/101"

                ],

                [

                    "DELETE /deleteStudent/101",

                    "DELETE /students/101"

                ]

            ]

        },

        points: [

            "Use nouns to represent resources.",

            "Use HTTP methods to communicate actions.",

            "Use route parameters to identify individual resources.",

            "Use query parameters for filtering, searching, sorting and pagination.",

            "Keep URL structures predictable."

        ],

        keyIdea:
            "A clean REST API lets the HTTP method and resource URL communicate the intended operation."

    },


    {
        number: 13,

        title: "Building a Small CRUD API",

        intro:
            "CRUD means Create, Read, Update and Delete. A student API is a useful example for understanding the complete REST flow.",

        code:


const express = require("express");

const app = express();

app.use(express.json());

let students = [
{
id: 1,
name: "Anita"
},
{
id: 2,
name: "Rahul"
}
];

app.get("/students", (req, res) => {
res.json(students);
});

app.get("/students/:id", (req, res) => {


const student = students.find(
    item => item.id === Number(req.params.id)
);

if (!student) {
    return res.status(404).json({
        message: "Student not found"
    });
}

res.json(student);


});

app.post("/students", (req, res) => {


const student = {
    id: students.length + 1,
    name: req.body.name
};

students.push(student);

res.status(201).json(student);


});

app.delete("/students/:id", (req, res) => {


const id = Number(req.params.id);

students = students.filter(
    student => student.id !== id
);

res.status(204).send();


});

app.listen(3000);`,


        comparison: {

            headers: [

                "CRUD operation",

                "HTTP request"

            ],

            rows: [

                [

                    "Create",

                    "POST /students"

                ],

                [

                    "Read all",

                    "GET /students"

                ],

                [

                    "Read one",

                    "GET /students/:id"

                ],

                [

                    "Update",

                    "PUT or PATCH /students/:id"

                ],

                [

                    "Delete",

                    "DELETE /students/:id"

                ]

            ]

        },

        keyIdea:
            "CRUD APIs connect HTTP methods, resources, application logic and data operations."

    },


    {
        number: 14,

        title: "404 Handling",

        intro:
            "A well-designed Express application should provide a clear response when no route matches the request.",

        code:


app.use((req, res) => {


res.status(404).json({
    message: "Route not found"
});


});,


        points: [

            "Express processes middleware and routes in registration order.",

            "A final catch-all middleware can handle unmatched requests.",

            "A 404 means the requested route or resource could not be found.",

            "A 404 is different from a server crash."

        ],

        keyIdea:
            "Route order matters. A fallback 404 handler should normally appear after the routes it is intended to protect."

    },


    {
        number: 15,

        title: "Error-Handling Middleware",

        intro:
            "Production applications need a predictable way to handle unexpected errors.",

        code:


app.use((err, req, res, next) => {


console.error(err);

res.status(500).json({
    message: "Internal server error"
});


});,


        points: [

            "Express error-handling middleware has four parameters: err, req, res and next.",

            "Errors can be passed to the error handler using next(error).",

            "Centralized handling keeps error responses consistent.",

            "Sensitive internal error information should not normally be exposed to clients."

        ],

        flow: [

            "Request arrives",

            "Route executes",

            "Unexpected error occurs",

            "next(error)",

            "Error middleware receives error",

            "Server logs useful details",

            "Client receives safe error response"

        ],

        keyIdea:
            "Separate internal debugging information from the safe error information returned to API clients."

    },


    {
        number: 16,

        title: "Organizing an Express Application",

        intro:
            "As an application grows, putting every route in server.js becomes difficult to maintain. A professional Express project separates responsibilities.",

        architecture: [

            {

                title: "server.js",

                items: [

                    "Start server",

                    "Load application"

                ]

            },

            {

                title: "app.js",

                items: [

                    "Create Express app",

                    "Register middleware",

                    "Register routes"

                ]

            },

            {

                title: "routes/",

                items: [

                    "Define URL endpoints",

                    "Connect routes to handlers"

                ]

            },

            {

                title: "controllers/",

                items: [

                    "Application request logic",

                    "Prepare responses"

                ]

            },

            {

                title: "services/",

                items: [

                    "Business logic",

                    "Reusable operations"

                ]

            },

            {

                title: "models/",

                items: [

                    "Data structures",

                    "Database interaction"

                ]

            }

        ],

        code:


project/
│
├── server.js
├── app.js
├── package.json
│
├── routes/
│   └── studentRoutes.js
│
├── controllers/
│   └── studentController.js
│
├── services/
│   └── studentService.js
│
└── models/
    └── studentModel.js`,


        keyIdea:
            "Separation of responsibilities makes an Express application easier to test, maintain and extend."

    }

],


/* =====================================================
   PREMIUM VISUALIZER
   ===================================================== */

visualizer: {

    title: "Express Request → Middleware → Route Laboratory",

    description:
        "Trace an HTTP request through Express middleware, route matching and response generation.",

    steps: [

        {
            title: "Client Request",

            operation:
                "POST /students",

            detail:
                "The frontend sends an HTTP request containing a JSON student object."
        },

        {
            title: "Express Receives",

            operation:
                "app receives request",

            detail:
                "Node.js accepts the network request and Express begins processing it."
        },

        {
            title: "JSON Middleware",

            operation:
                "express.json()",

            detail:
                "Express parses the JSON request body and exposes it through req.body."
        },

        {
            title: "Logger Middleware",

            operation:
                "console.log(req.method, req.url)",

            detail:
                "A custom middleware records useful request information."
        },

        {
            title: "next()",

            operation:
                "Continue pipeline",

            detail:
                "The middleware calls next() so Express can continue processing."
        },

        {
            title: "Route Match",

            operation:
                "POST /students",

            detail:
                "Express finds the route registered for the POST /students request."
        },

        {
            title: "Read Request Body",

            operation:
                "req.body.name",

            detail:
                "The route handler reads the parsed student data."
        },

        {
            title: "Create Resource",

            operation:
                "students.push(student)",

            detail:
                "The application creates a new student resource."
        },

        {
            title: "Status Code",

            operation:
                "201 Created",

            detail:
                "The API communicates that a new resource was created."
        },

        {
            title: "JSON Response",

            operation:
                "res.status(201).json(student)",

            detail:
                "Express serializes the object and sends it back to the client."
        }

    ]

},


/* =====================================================
   PROGRAM TRACING
   ===================================================== */

trace: {

    title: "Trace an Express CRUD Request",

    lines: [

        {
            line: 1,
            code: 'const express = require("express");'
        },

        {
            line: 2,
            code: "const app = express();"
        },

        {
            line: 3,
            code: "app.use(express.json());"
        },

        {
            line: 4,
            code: 'app.get("/students/:id",'
        },

        {
            line: 5,
            code: "    (req, res) => {"
        },

        {
            line: 6,
            code: "        const id = req.params.id;"
        },

        {
            line: 7,
            code: "        const student = findStudent(id);"
        },

        {
            line: 8,
            code: "        if (!student) {"
        },

        {
            line: 9,
            code: "            return res.status(404).json({"
        },

        {
            line: 10,
            code: '                message: "Student not found"'
        },

        {
            line: 11,
            code: "            });"
        },

        {
            line: 12,
            code: "        }"
        },

        {
            line: 13,
            code: "        res.json(student);"
        },

        {
            line: 14,
            code: "    }"
        },

        {
            line: 15,
            code: ");"
        }

    ],

    steps: [

        {
            line: 1,
            state: "Module",

            explain:
                "Node.js loads the Express package."
        },

        {
            line: 2,
            state: "Application",

            explain:
                "Express creates the application object."
        },

        {
            line: 3,
            state: "Middleware",

            explain:
                "JSON parsing middleware is registered."
        },

        {
            line: 4,
            state: "Route",

            explain:
                "The application defines a GET route containing a dynamic id parameter."
        },

        {
            line: 5,
            state: "Handler",

            explain:
                "The route handler receives req and res."
        },

        {
            line: 6,
            state: "Parameter",

            explain:
                "The student ID is read from req.params."
        },

        {
            line: 7,
            state: "Lookup",

            explain:
                "Application logic searches for the requested student."
        },

        {
            line: 8,
            state: "Condition",

            explain:
                "The application checks whether the student exists."
        },

        {
            line: 9,
            state: "404",

            explain:
                "If no student exists, the API prepares a 404 response."
        },

        {
            line: 10,
            state: "Message",

            explain:
                "A safe error message is included in the JSON response."
        },

        {
            line: 11,
            state: "Response",

            explain:
                "The JSON error response is completed."
        },

        {
            line: 12,
            state: "Branch",

            explain:
                "If a student exists, execution continues past the not-found condition."
        },

        {
            line: 13,
            state: "Success",

            explain:
                "The student object is returned as JSON."
        },

        {
            line: 14,
            state: "Complete",

            explain:
                "The route handler finishes."
        },

        {
            line: 15,
            state: "Route complete",

            explain:
                "Express has completed this route definition."
        }

    ]

},


/* =====================================================
   QUICK REVISION
   ===================================================== */

revision: [

    [
        "Express.js",
        "A web application framework for Node.js."
    ],

    [
        "Express App",
        "The application object used to configure routes and middleware."
    ],

    [
        "Route",
        "A combination of HTTP method and URL path handled by the server."
    ],

    [
        "Middleware",
        "A function that participates in the Express request-response pipeline."
    ],

    [
        "next()",
        "Continues processing to the next middleware or matching handler."
    ],

    [
        "req.body",
        "Parsed request body data, commonly populated by express.json()."
    ],

    [
        "req.params",
        "Object containing dynamic route parameter values."
    ],

    [
        "req.query",
        "Object containing URL query parameters."
    ],

    [
        "res.json()",
        "Sends a JSON response to the client."
    ],

    [
        "REST",
        "An architectural approach commonly used to design resource-oriented HTTP APIs."
    ],

    [
        "CRUD",
        "Create, Read, Update and Delete operations."
    ],

    [
        "Status Code",
        "HTTP response code describing the outcome of a request."
    ],

    [
        "404",
        "Indicates that the requested route or resource was not found."
    ],

    [
        "Error Middleware",
        "Express middleware designed to handle errors centrally."
    ],

    [
        "Route Parameter",
        "A dynamic value embedded in a URL path."
    ],

    [
        "Query Parameter",
        "An optional value supplied after ? in a URL."
    ]

],


/* =====================================================
   INTERVIEW QUESTIONS
   ===================================================== */

interview: [

    {
        question:
            "What is Express.js?",

        answer:
            "Express.js is a lightweight web application framework for Node.js that simplifies routing, middleware and HTTP application development."
    },

    {
        question:
            "Why use Express instead of only Node's http module?",

        answer:
            "Express provides convenient routing, middleware and request-response APIs, reducing boilerplate for common web applications."
    },

    {
        question:
            "What is middleware?",

        answer:
            "Middleware is a function that participates in the Express request-response pipeline and can inspect, modify or control request processing."
    },

    {
        question:
            "What does next() do?",

        answer:
            "next() tells Express to continue processing with the next applicable middleware or route handler."
    },

    {
        question:
            "What does express.json() do?",

        answer:
            "It parses incoming JSON request bodies and makes the resulting data available through req.body."
    },

    {
        question:
            "What is req.params?",

        answer:
            "req.params contains values captured from dynamic route parameters such as /students/:id."
    },

    {
        question:
            "What is req.query?",

        answer:
            "req.query contains values supplied through the query string, such as ?page=2."
    },

    {
        question:
            "What is the difference between PUT and PATCH?",

        answer:
            "PUT is commonly used to replace a resource representation, while PATCH is commonly used for partial updates."
    },

    {
        question:
            "What does res.json() do?",

        answer:
            "It sends a JavaScript value as a JSON HTTP response."
    },

    {
        question:
            "What is REST?",

        answer:
            "REST is an architectural approach for designing networked resources and their interactions, commonly using HTTP methods and resource-oriented URLs."
    },

    {
        question:
            "What is CRUD?",

        answer:
            "CRUD stands for Create, Read, Update and Delete."
    },

    {
        question:
            "Why are HTTP status codes important?",

        answer:
            "They communicate the outcome of a request so clients can respond appropriately."
    },

    {
        question:
            "What is Express error-handling middleware?",

        answer:
            "It is middleware with the signature err, req, res, next that handles errors passed through the Express pipeline."
    },

    {
        question:
            "Why should routes and business logic eventually be separated?",

        answer:
            "Separating responsibilities makes the application easier to test, maintain and extend as it grows."
    }

],


/* =====================================================
   PRACTICE
   ===================================================== */

practice: [

    {
        title: "First Express Server",

        task:
            "Create an Express server on port 3000 with GET / returning a CodeBhavya welcome message.",

        hint:
            "Use express(), app.get() and app.listen().",

        answer:
            "Create the Express app, define GET / and start the server on port 3000."
    },

    {
        title: "Multiple Routes",

        task:
            "Create GET /, GET /about and GET /contact routes with different responses.",

        hint:
            "Each route can have its own app.get() handler.",

        answer:
            "Register three GET routes and return a different response from each."
    },

    {
        title: "Logger Middleware",

        task:
            "Create middleware that logs the HTTP method and URL of every incoming request.",

        hint:
            "Use req.method, req.url and next().",

        answer:
            "Log req.method and req.url, then call next() so the request continues."
    },

    {
        title: "JSON POST Request",

        task:
            "Create POST /students that receives JSON containing name and returns the created student.",

        hint:
            "Use express.json(), req.body and res.status(201).json().",

        answer:
            "Register express.json(), read req.body.name and return the student with status 201."
    },

    {
        title: "Route Parameter",

        task:
            "Create GET /students/:id and return the requested student ID.",

        hint:
            "Use req.params.id.",

        answer:
            "Read req.params.id and include it in the JSON response."
    },

    {
        title: "Query Filtering",

        task:
            "Create GET /students?course=aiml and return the selected course from req.query.",

        hint:
            "Read req.query.course.",

        answer:
            "Use req.query.course to read the optional course filter."
    },

    {
        title: "CRUD API",

        task:
            "Build a small in-memory student API supporting GET all, GET by ID, POST and DELETE.",

        hint:
            "Use an array as temporary storage.",

        answer:
            "Create routes for each CRUD operation and use appropriate HTTP methods and status codes."
    },

    {
        title: "404 Middleware",

        task:
            "Add a final middleware that returns JSON status 404 for unknown routes.",

        hint:
            "Register it after all normal routes.",

        answer:
            "Use app.use() after the route definitions to return a 404 JSON response."
    },

    {
        title: "Error Middleware",

        task:
            "Create centralized error middleware that logs the internal error and returns status 500 with a safe JSON message.",

        hint:
            "Remember the four-argument signature.",

        answer:
            "Use (err, req, res, next), log the error server-side and return a safe 500 response."
    }

],


/* =====================================================
   MCQ
   ===================================================== */

quiz: [

    {
        question:
            "What is Express.js?",

        options: [

            "A database",

            "A Node.js web framework",

            "A CSS preprocessor",

            "A browser"

        ],

        answer: 1,

        explanation:
            "Express.js is a web application framework commonly used with Node.js."
    },

    {
        question:
            "Which method defines a GET route in Express?",

        options: [

            "app.get()",

            "app.read()",

            "app.fetch()",

            "app.routeGetOnly()"

        ],

        answer: 0,

        explanation:
            "app.get() registers a route for HTTP GET requests."
    },

    {
        question:
            "What is middleware primarily used for?",

        options: [

            "Only database storage",

            "Processing requests during the Express pipeline",

            "Creating CSS files",

            "Replacing JavaScript"

        ],

        answer: 1,

        explanation:
            "Middleware participates in request processing and can inspect, modify or control the flow."
    },

    {
        question:
            "What does next() normally do?",

        options: [

            "Stops the server",

            "Deletes the request",

            "Continues to the next middleware or handler",

            "Restarts Node.js"

        ],

        answer: 2,

        explanation:
            "next() passes control to the next applicable middleware or handler."
    },

    {
        question:
            "Where is parsed JSON request data commonly available?",

        options: [

            "req.body",

            "req.html",

            "req.jsonOnly",

            "res.body"

        ],

        answer: 0,

        explanation:
            "express.json() parses JSON request bodies and exposes them through req.body."
    },

    {
        question:
            "Where are route parameters available?",

        options: [

            "req.params",

            "req.routeDataOnly",

            "res.params",

            "app.paramsOnly"

        ],

        answer: 0,

        explanation:
            "Dynamic route values such as :id are available through req.params."
    },

    {
        question:
            "Which request is commonly used to create a new resource?",

        options: [

            "GET",

            "POST",

            "HEAD",

            "OPTIONS"

        ],

        answer: 1,

        explanation:
            "POST is commonly used to create a new resource."
    },

    {
        question:
            "Which status code commonly represents a newly created resource?",

        options: [

            "200",

            "201",

            "301",

            "404"

        ],

        answer: 1,

        explanation:
            "201 Created commonly indicates that a resource was successfully created."
    },

    {
        question:
            "Which object contains query-string parameters?",

        options: [

            "req.query",

            "req.bodyOnly",

            "res.query",

            "app.queryOnly"

        ],

        answer: 0,

        explanation:
            "Express exposes query-string parameters through req.query."
    },

    {
        question:
            "What does res.json() do?",

        options: [

            "Starts a database",

            "Sends a JSON response",

            "Creates a route",

            "Installs Express"

        ],

        answer: 1,

        explanation:
            "res.json() sends the supplied value as a JSON HTTP response."
    },

    {
        question:
            "Which status code means Not Found?",

        options: [

            "200",

            "201",

            "404",

            "500"

        ],

        answer: 2,

        explanation:
            "404 indicates that the requested route or resource was not found."
    },

    {
        question:
            "Which method is commonly used for deleting a resource?",

        options: [

            "GET",

            "POST",

            "DELETE",

            "READ"

        ],

        answer: 2,

        explanation:
            "DELETE is the HTTP method commonly used to remove a resource."
    }

],


/* =====================================================
   GLOSSARY
   ===================================================== */

glossary: [

    {
        term: "Express.js",
        definition:
            "A lightweight web application framework for Node.js."
    },

    {
        term: "Express App",
        definition:
            "The application object created by calling express()."
    },

    {
        term: "Route",
        definition:
            "An HTTP method and path associated with server-side handling logic."
    },

    {
        term: "Middleware",
        definition:
            "A function that participates in the Express request-response processing pipeline."
    },

    {
        term: "next()",
        definition:
            "A function used to pass control to the next applicable middleware or handler."
    },

    {
        term: "req",
        definition:
            "The Express request object containing incoming request information."
    },

    {
        term: "res",
        definition:
            "The Express response object used to send information back to the client."
    },

    {
        term: "req.body",
        definition:
            "Parsed request body data."
    },

    {
        term: "req.params",
        definition:
            "Object containing values captured from route parameters."
    },

    {
        term: "req.query",
        definition:
            "Object containing query-string parameters."
    },

    {
        term: "REST",
        definition:
            "An architectural approach commonly used for resource-oriented HTTP APIs."
    },

    {
        term: "CRUD",
        definition:
            "Create, Read, Update and Delete operations."
    },

    {
        term: "HTTP Status Code",
        definition:
            "A numeric response code describing the outcome of an HTTP request."
    },

    {
        term: "404",
        definition:
            "HTTP status indicating that the requested route or resource was not found."
    },

    {
        term: "Error Middleware",
        definition:
            "Express middleware with an error-first signature used for centralized error handling."
    },

    {
        term: "Route Parameter",
        definition:
            "A dynamic value embedded inside a URL path."
    },

    {
        term: "Query Parameter",
        definition:
            "An optional URL value supplied after the question-mark portion of a URL."
    }

],


/* =====================================================
   COMPLETION
   ===================================================== */

completion: {

    title: "Express.js Fundamentals & REST APIs Completed",

    message:
        "You can now build the basic backend layer of a MERN application using Express.js. You understand routing, middleware, request data, JSON responses, REST resources, CRUD operations and error handling.",

    achievements: [

        "You understand why Express.js is used with Node.js.",

        "You can create an Express application.",

        "You understand the Express request-response lifecycle.",

        "You can create GET, POST, PUT, PATCH and DELETE routes.",

        "You understand middleware and next().",

        "You can process JSON request bodies.",

        "You can use route parameters.",

        "You can use query parameters.",

        "You can return JSON API responses.",

        "You understand important HTTP status codes.",

        "You understand resource-oriented REST API design.",

        "You can build a basic CRUD API.",

        "You can create 404 handling.",

        "You understand centralized error middleware.",

        "You understand how a professional Express project can be organized.",

        "You are ready for request validation and robust API input handling."

    ],

    nextLevel:
        "Level 21 — Express Middleware, Validation & API Architecture"

}
};
