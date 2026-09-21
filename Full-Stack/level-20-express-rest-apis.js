
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
        "Learn how Express.js simplifies Node.js server development, understand routing and middleware, work with HTTP methods and status codes, build REST APIs, handle errors, and organize a maintainable backend application.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Intermediate",

    concepts: 16,


    /* =====================================================
       LEARNING OUTCOMES
       ===================================================== */

    outcomes: [

        "Explain why Express.js is commonly used with Node.js.",

        "Create a basic Express application.",

        "Understand the Express request-response lifecycle.",

        "Create GET, POST, PUT, PATCH and DELETE routes.",

        "Understand Express middleware.",

        "Use express.json() to process JSON request bodies.",

        "Work with route parameters.",

        "Work with query parameters.",

        "Send structured JSON responses.",

        "Use appropriate HTTP status codes.",

        "Understand REST resource design.",

        "Build a small CRUD-style REST API.",

        "Handle unknown routes with a 404 response.",

        "Create centralized error-handling middleware.",

        "Understand basic Express project organization.",

        "Prepare for validation, authentication and production API architecture."

    ],


    /* =====================================================
       MAIN CONCEPTS
       ===================================================== */

    sections: [

        {
            number: 1,

            title: "Why Express.js?",

            intro:
                "Node.js provides the low-level HTTP functionality needed to build servers, but building a complete API directly with the http module can become repetitive. Express.js provides a higher-level framework that simplifies routing, middleware and request handling.",

            points: [

                "<strong>Express.js is a web framework for Node.js.</strong>",

                "It simplifies HTTP server and API development.",

                "Express provides convenient routing APIs.",

                "Express uses middleware to process requests.",

                "Express makes it easier to organize REST APIs.",

                "Express is commonly used as the backend layer of MERN applications."

            ],

            comparison: {

                headers: [
                    "Node.js HTTP",
                    "Express.js"
                ],

                rows: [

                    [
                        "Lower-level HTTP handling",
                        "Higher-level web framework"
                    ],

                    [
                        "Manual routing logic",
                        "Convenient route methods"
                    ],

                    [
                        "Manual request processing",
                        "Middleware-based processing"
                    ],

                    [
                        "More boilerplate",
                        "Less repetitive server code"
                    ],

                    [
                        "Built into Node.js",
                        "Installed as a project dependency"
                    ]

                ]

            },

            keyIdea:
                "Express does not replace Node.js. Express runs on top of Node.js and provides a more convenient way to build web servers and APIs."

        },


        {
            number: 2,

            title: "Creating an Express Application",

            intro:
                "An Express application starts with a Node.js project, the Express package and an application object created with express().",

            points: [

                "Create a Node.js project using npm.",

                "Install Express as a project dependency.",

                "Import or require Express.",

                "Create an Express application with express().",

                "Define routes.",

                "Start the server with app.listen()."

            ],

            terminal: `mkdir codebhavya-api

cd codebhavya-api

npm init -y

npm install express`,

            code: `const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to CodeBhavya");
});

app.listen(3000, () => {
    console.log(
        "Server running on port 3000"
    );
});`,

            flow: [

                "Create Node.js project",
                "Install Express",
                "Load Express",
                "Create app",
                "Define routes",
                "Start server",
                "Receive HTTP requests"

            ],

            keyIdea:
                "The Express app object becomes the central place where routes and middleware are registered."

        },


        {
            number: 3,

            title: "Express Request-Response Lifecycle",

            intro:
                "Every request entering an Express application passes through a sequence of processing steps before a response is returned to the client.",

            points: [

                "A client sends an HTTP request.",

                "The request enters the Express application.",

                "Middleware may inspect or modify the request.",

                "Express finds a matching route.",

                "The route handler executes application logic.",

                "The server sends a response.",

                "The response travels back to the client."

            ],

            flow: [

                "Client",
                "HTTP Request",
                "Express Application",
                "Middleware",
                "Route Matching",
                "Route Handler",
                "HTTP Response",
                "Client"

            ],

            comparison: {

                headers: [
                    "Stage",
                    "Purpose"
                ],

                rows: [

                    [
                        "Request",
                        "Client sends HTTP request"
                    ],

                    [
                        "Middleware",
                        "Process or inspect request"
                    ],

                    [
                        "Routing",
                        "Find matching endpoint"
                    ],

                    [
                        "Controller / Handler",
                        "Execute application logic"
                    ],

                    [
                        "Response",
                        "Send result to client"
                    ]

                ]

            },

            keyIdea:
                "Express applications are easier to understand when you think of every request as moving through a processing pipeline."

        },


        {
            number: 4,

            title: "GET Routes",

            intro:
                "GET routes are commonly used to retrieve resources from a server.",

            points: [

                "app.get() registers a GET route.",

                "The first argument is the route path.",

                "The second argument is the route handler.",

                "req represents the incoming request.",

                "res represents the outgoing response."

            ],

            code: `const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/about", (req, res) => {
    res.send("About CodeBhavya");
});

app.get("/contact", (req, res) => {
    res.send("Contact Page");
});

app.listen(3000);`,

            comparison: {

                headers: [
                    "Request",
                    "Handler"
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
                        "GET /contact",
                        "Contact Page"
                    ]

                ]

            },

            keyIdea:
                "A route connects an HTTP method and URL pattern to the server-side logic responsible for handling that request."

        },


        {
            number: 5,

            title: "POST, PUT, PATCH and DELETE",

            intro:
                "REST APIs use different HTTP methods to describe different operations on resources.",

            points: [

                "GET is commonly used to retrieve data.",

                "POST is commonly used to create a new resource.",

                "PUT is commonly used to replace or fully update a resource.",

                "PATCH is commonly used to partially update a resource.",

                "DELETE is commonly used to remove a resource."

            ],

            code: `app.get("/products", (req, res) => {
    res.json({
        message: "Get products"
    });
});

app.post("/products", (req, res) => {
    res.status(201).json({
        message: "Create product"
    });
});

app.put("/products/101", (req, res) => {
    res.json({
        message: "Replace product"
    });
});

app.patch("/products/101", (req, res) => {
    res.json({
        message: "Update product"
    });
});

app.delete("/products/101", (req, res) => {
    res.status(204).send();
});`,

            comparison: {

                headers: [
                    "Method",
                    "Typical purpose"
                ],

                rows: [

                    [
                        "GET",
                        "Read resource"
                    ],

                    [
                        "POST",
                        "Create resource"
                    ],

                    [
                        "PUT",
                        "Replace resource"
                    ],

                    [
                        "PATCH",
                        "Partially update resource"
                    ],

                    [
                        "DELETE",
                        "Delete resource"
                    ]

                ]

            },

            keyIdea:
                "HTTP methods communicate the intended operation on a resource and make an API easier to understand."

        },


        {
            number: 6,

            title: "Middleware",

            intro:
                "Middleware functions are one of the most important concepts in Express. Middleware can inspect requests, modify data, perform authentication, log activity and decide whether processing should continue.",

            points: [

                "Middleware receives req, res and next.",

                "Middleware can inspect the request.",

                "Middleware can modify the request or response.",

                "Middleware can end the response.",

                "Middleware can call next() to continue processing.",

                "Multiple middleware functions can form a request-processing pipeline."

            ],

            code: `const express = require("express");

const app = express();

function logger(req, res, next) {

    console.log(
        req.method,
        req.url
    );

    next();
}

app.use(logger);

app.get("/", (req, res) => {
    res.send("Home");
});

app.listen(3000);`,

            flow: [

                "Request arrives",
                "Logger middleware executes",
                "next() is called",
                "Route matching continues",
                "Route handler executes",
                "Response is sent"

            ],

            keyIdea:
                "Middleware is reusable request-processing logic placed between the incoming request and the final response."

        },


        {
            number: 7,

            title: "Built-in JSON Middleware",

            intro:
                "REST APIs frequently receive JSON data from clients. Express provides express.json() middleware to parse JSON request bodies.",

            points: [

                "Clients can send JSON in the HTTP request body.",

                "express.json() parses JSON request bodies.",

                "The parsed data becomes available through req.body.",

                "The middleware should normally be registered before routes that need the body."

            ],

            code: `const express = require("express");

const app = express();

app.use(express.json());

app.post("/products", (req, res) => {

    console.log(req.body);

    res.status(201).json({
        message: "Product received",
        product: req.body
    });

});

app.listen(3000);`,

            comparison: {

                headers: [
                    "Without JSON middleware",
                    "With express.json()"
                ],

                rows: [

                    [
                        "req.body may not contain parsed JSON",
                        "JSON body is parsed"
                    ],

                    [
                        "Manual parsing may be required",
                        "Express provides convenient parsing"
                    ],

                    [
                        "More boilerplate",
                        "Cleaner route handlers"
                    ]

                ]

            },

            keyIdea:
                "express.json() converts incoming JSON request data into a JavaScript object available through req.body."

        },


        {
            number: 8,

            title: "Route Parameters",

            intro:
                "Route parameters allow an API to capture dynamic values directly from the URL path.",

            points: [

                "A route parameter is defined using a colon.",

                "For example, /products/:id contains a dynamic id parameter.",

                "Express places route parameters inside req.params.",

                "Route parameters are useful for identifying individual resources."

            ],

            code: `app.get(
    "/products/:id",
    (req, res) => {

        const productId =
            req.params.id;

        res.json({
            productId: productId
        });
    }
);`,

            comparison: {

                headers: [
                    "URL",
                    "req.params"
                ],

                rows: [

                    [
                        "/products/101",
                        "{ id: '101' }"
                    ],

                    [
                        "/products/205",
                        "{ id: '205' }"
                    ],

                    [
                        "/products/999",
                        "{ id: '999' }"
                    ]

                ]

            },

            keyIdea:
                "Route parameters identify a resource as part of the URL path."

        },


        {
            number: 9,

            title: "Query Parameters",

            intro:
                "Query parameters provide optional information after the ? character in a URL. They are commonly used for filtering, searching, sorting and pagination.",

            points: [

                "Query parameters appear after ? in the URL.",

                "Multiple query parameters are separated with &.",

                "Express makes them available through req.query.",

                "Query parameters are useful when the URL identifies a collection rather than one specific resource."

            ],

            code: `app.get(
    "/products",
    (req, res) => {

        const category =
            req.query.category;

        const limit =
            req.query.limit;

        res.json({
            category: category,
            limit: limit
        });
    }
);`,

            comparison: {

                headers: [
                    "URL",
                    "Query values"
                ],

                rows: [

                    [
                        "/products?category=books",
                        "category = books"
                    ],

                    [
                        "/products?limit=10",
                        "limit = 10"
                    ],

                    [
                        "/products?category=books&limit=10",
                        "category = books, limit = 10"
                    ]

                ]

            },

            keyIdea:
                "Route parameters identify a specific resource, while query parameters commonly control how a collection is filtered or represented."

        },


        {
            number: 10,

            title: "Sending JSON Responses",

            intro:
                "REST APIs normally return structured JSON instead of HTML pages.",

            points: [

                "res.json() sends a JavaScript value as JSON.",

                "Express automatically sets an appropriate content type for JSON responses.",

                "Objects and arrays can be returned directly.",

                "Consistent response structures make APIs easier for frontend applications to consume."

            ],

            code: `app.get("/api/products", (req, res) => {

    res.json({
        success: true,

        data: [
            {
                id: 101,
                name: "Laptop"
            },
            {
                id: 102,
                name: "Keyboard"
            }
        ]
    });

});`,

            comparison: {

                headers: [
                    "Method",
                    "Purpose"
                ],

                rows: [

                    [
                        "res.send()",
                        "Send a general response"
                    ],

                    [
                        "res.json()",
                        "Send JSON response"
                    ],

                    [
                        "res.status()",
                        "Set HTTP status code"
                    ],

                    [
                        "res.end()",
                        "Finish response"
                    ]

                ]

            },

            keyIdea:
                "For REST APIs, res.json() is commonly used to return structured data to frontend applications."

        },


        {
            number: 11,

            title: "HTTP Status Codes",

            intro:
                "HTTP status codes communicate the result of an HTTP request to the client.",

            points: [

                "200 commonly indicates a successful request.",

                "201 indicates that a resource was created.",

                "204 indicates success with no response body.",

                "400 commonly indicates an invalid client request.",

                "401 indicates that authentication is required or has failed.",

                "403 indicates that the server understood the request but refuses access.",

                "404 indicates that the requested resource or route was not found.",

                "500 indicates an unexpected server-side failure."

            ],

            code: `app.post("/products", (req, res) => {

    const product = req.body;

    if (!product.name) {

        return res.status(400).json({
            error: "Product name is required"
        });

    }

    res.status(201).json({
        message: "Product created",
        product: product
    });

});`,

            comparison: {

                headers: [
                    "Status",
                    "Meaning"
                ],

                rows: [

                    [
                        "200",
                        "OK"
                    ],

                    [
                        "201",
                        "Created"
                    ],

                    [
                        "204",
                        "No Content"
                    ],

                    [
                        "400",
                        "Bad Request"
                    ],

                    [
                        "401",
                        "Unauthorized"
                    ],

                    [
                        "403",
                        "Forbidden"
                    ],

                    [
                        "404",
                        "Not Found"
                    ],

                    [
                        "500",
                        "Internal Server Error"
                    ]

                ]

            },

            keyIdea:
                "Good APIs use status codes to communicate the outcome of a request instead of returning 200 for every situation."

        },


        {
            number: 12,

            title: "REST Resource Design",

            intro:
                "REST API design focuses on resources and uses HTTP methods to describe actions performed on those resources.",

            points: [

                "Use nouns to represent resources.",

                "Use plural resource names consistently.",

                "Use HTTP methods to represent operations.",

                "Use route parameters for individual resources.",

                "Use query parameters for filtering and collection operations."

            ],

            comparison: {

                headers: [
                    "Endpoint",
                    "Purpose"
                ],

                rows: [

                    [
                        "GET /products",
                        "List products"
                    ],

                    [
                        "GET /products/101",
                        "Get product 101"
                    ],

                    [
                        "POST /products",
                        "Create product"
                    ],

                    [
                        "PUT /products/101",
                        "Replace product 101"
                    ],

                    [
                        "PATCH /products/101",
                        "Partially update product 101"
                    ],

                    [
                        "DELETE /products/101",
                        "Delete product 101"
                    ]

                ]

            },

            keyIdea:
                "A clean REST API models resources through URLs and uses HTTP methods to describe operations."

        },


        {
            number: 13,

            title: "Building a Small CRUD API",

            intro:
                "CRUD means Create, Read, Update and Delete. These four operations form the foundation of many backend applications.",

            points: [

                "Create is commonly represented by POST.",

                "Read is commonly represented by GET.",

                "Update can be represented by PUT or PATCH.",

                "Delete is commonly represented by DELETE.",

                "A database would normally store the resources in a real application."

            ],

            code: `const express = require("express");

const app = express();

app.use(express.json());

let products = [
    {
        id: 1,
        name: "Laptop",
        price: 60000
    },
    {
        id: 2,
        name: "Mouse",
        price: 1200
    }
];

app.get("/products", (req, res) => {

    res.json(products);

});

app.get("/products/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {

        return res.status(404).json({
            error: "Product not found"
        });

    }

    res.json(product);

});

app.post("/products", (req, res) => {

    const product = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    products.push(product);

    res.status(201).json(product);

});

app.patch("/products/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {

        return res.status(404).json({
            error: "Product not found"
        });

    }

    if (req.body.name !== undefined) {
        product.name = req.body.name;
    }

    if (req.body.price !== undefined) {
        product.price = req.body.price;
    }

    res.json(product);

});

app.delete("/products/:id", (req, res) => {

    const id =
        Number(req.params.id);

    const index =
        products.findIndex(
            item => item.id === id
        );

    if (index === -1) {

        return res.status(404).json({
            error: "Product not found"
        });

    }

    products.splice(index, 1);

    res.status(204).send();

});

app.listen(3000, () => {
    console.log(
        "API running on port 3000"
    );
});`,

            flow: [

                "Client sends request",
                "Express parses request",
                "Route is matched",
                "Application finds or changes resource",
                "Server prepares response",
                "HTTP response is returned"

            ],

            keyIdea:
                "CRUD APIs combine routing, request parsing, application logic, status codes and JSON responses."

        },


        {
            number: 14,

            title: "404 Handling",

            intro:
                "An Express application should provide a predictable response when no registered route matches the incoming request.",

            points: [

                "A 404 response means the requested route or resource was not found.",

                "A fallback middleware can handle unknown routes.",

                "The fallback should normally be registered after valid routes.",

                "Returning structured JSON makes the error easier for frontend applications to process."

            ],

            code: `app.use((req, res) => {

    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl
    });

});`,

            keyIdea:
                "The 404 fallback should be placed after the application's normal routes so that only unmatched requests reach it."

        },


        {
            number: 15,

            title: "Error-Handling Middleware",

            intro:
                "Production APIs need a consistent way to handle unexpected errors. Express supports dedicated error-handling middleware.",

            points: [

                "Error middleware has four parameters: err, req, res and next.",

                "It should normally be registered after the normal routes and middleware.",

                "Centralized handling prevents repetitive error-response code.",

                "The server should avoid exposing sensitive internal error details to clients."

            ],

            code: `app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(500).json({
            error: "Internal server error"
        });

    }
);`,

            comparison: {

                headers: [
                    "Normal middleware",
                    "Error middleware"
                ],

                rows: [

                    [
                        "req, res, next",
                        "err, req, res, next"
                    ],

                    [
                        "Processes normal requests",
                        "Handles errors"
                    ],

                    [
                        "Calls next() to continue",
                        "Can send centralized error response"
                    ]

                ]

            },

            keyIdea:
                "Centralized error middleware creates a predictable boundary for handling unexpected application failures."

        },


        {
            number: 16,

            title: "Organizing an Express Application",

            intro:
                "As an Express project grows, putting every route and piece of business logic in one file becomes difficult to maintain. A structured architecture separates responsibilities.",

            points: [

                "Routes define API endpoints.",

                "Controllers handle request and response coordination.",

                "Services contain reusable business logic.",

                "Models represent database-related data structures.",

                "Middleware handles cross-cutting request processing.",

                "Configuration stores environment-specific settings."

            ],

            architecture: [

                {
                    title: "Routes",

                    items: [
                        "URL definitions",
                        "HTTP methods",
                        "Controller mapping"
                    ]
                },

                {
                    title: "Controllers",

                    items: [
                        "Read request",
                        "Call services",
                        "Send response"
                    ]
                },

                {
                    title: "Services",

                    items: [
                        "Business rules",
                        "Reusable operations",
                        "Application logic"
                    ]
                },

                {
                    title: "Models",

                    items: [
                        "Data structure",
                        "Database interaction",
                        "Persistence"
                    ]
                },

                {
                    title: "Middleware",

                    items: [
                        "Logging",
                        "Authentication",
                        "Validation",
                        "Error handling"
                    ]
                }

            ],

            keyIdea:
                "Good backend architecture separates responsibilities so that routes, business logic, data access and cross-cutting concerns can evolve independently."

        }

    ],


    /* =====================================================
       PREMIUM VISUALIZER
       ===================================================== */

    visualizer: {

        title: "Express Request → Middleware → Route Laboratory",

        description:
            "Follow an HTTP request as it moves through Express middleware, route matching, application logic and the final response.",

        steps: [

            {
                title: "Client Request",

                operation:
                    "POST /products",

                detail:
                    "A client sends a request containing product data in JSON format."
            },

            {
                title: "Express Receives Request",

                operation:
                    "app receives req",

                detail:
                    "The Express application receives the incoming HTTP request."
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
                    "logger(req, res, next)",

                detail:
                    "Logging middleware records information about the incoming request."
            },

            {
                title: "Route Matching",

                operation:
                    "POST /products",

                detail:
                    "Express finds the route registered for POST /products."
            },

            {
                title: "Route Handler",

                operation:
                    "Create product",

                detail:
                    "The route handler validates and processes the submitted product data."
            },

            {
                title: "Application Logic",

                operation:
                    "products.push(product)",

                detail:
                    "The application creates a product object and stores it in the example collection."
            },

            {
                title: "HTTP Status",

                operation:
                    "201 Created",

                detail:
                    "The server selects 201 to indicate that a new resource was created."
            },

            {
                title: "JSON Response",

                operation:
                    "res.status(201).json(product)",

                detail:
                    "Express serializes the product object and sends it to the client."
            },

            {
                title: "Client Receives Response",

                operation:
                    "HTTP 201 + JSON",

                detail:
                    "The client receives the newly created resource."
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
                code: 'app.post("/products", (req, res) => {'
            },

            {
                line: 5,
                code: "    const product = {"
            },

            {
                line: 6,
                code: "        name: req.body.name"
            },

            {
                line: 7,
                code: "    };"
            },

            {
                line: 8,
                code: "    res.status(201).json(product);"
            },

            {
                line: 9,
                code: "});"
            },

            {
                line: 10,
                code: "app.listen(3000);"
            }

        ],

        steps: [

            {
                line: 1,
                state: "Load Express",

                explain:
                    "The Express package is loaded into the application."
            },

            {
                line: 2,
                state: "Create app",

                explain:
                    "express() creates the Express application object."
            },

            {
                line: 3,
                state: "JSON middleware",

                explain:
                    "Express is configured to parse JSON request bodies."
            },

            {
                line: 4,
                state: "POST route",

                explain:
                    "The application registers a route for creating products."
            },

            {
                line: 5,
                state: "Create object",

                explain:
                    "A new product object is prepared."
            },

            {
                line: 6,
                state: "Read body",

                explain:
                    "The product name is read from req.body."
            },

            {
                line: 7,
                state: "Object complete",

                explain:
                    "The product object is now ready for the response."
            },

            {
                line: 8,
                state: "Response",

                explain:
                    "The server returns HTTP 201 and the product as JSON."
            },

            {
                line: 9,
                state: "Route complete",

                explain:
                    "The POST route handler finishes."
            },

            {
                line: 10,
                state: "Listening",

                explain:
                    "The Express server begins listening for HTTP requests."
            }

        ]

    },


    /* =====================================================
       QUICK REVISION
       ===================================================== */

    revision: [

        [
            "Express.js",
            "A Node.js web framework that simplifies server and API development."
        ],

        [
            "Express Application",
            "The app object created using express() that manages routes and middleware."
        ],

        [
            "Route",
            "A combination of an HTTP method and URL pattern handled by server-side logic."
        ],

        [
            "Middleware",
            "Reusable request-processing logic that runs before or between route handlers."
        ],

        [
            "next()",
            "Function used by middleware to pass processing to the next middleware or handler."
        ],

        [
            "req",
            "The incoming Express request object."
        ],

        [
            "res",
            "The Express response object used to send data to the client."
        ],

        [
            "req.params",
            "Object containing route parameter values."
        ],

        [
            "req.query",
            "Object containing query-string parameters."
        ],

        [
            "req.body",
            "Object containing parsed request-body data when appropriate middleware is used."
        ],

        [
            "res.json()",
            "Method used to send a JSON response."
        ],

        [
            "REST API",
            "An API style that models resources through URLs and uses HTTP methods for operations."
        ],

        [
            "CRUD",
            "Create, Read, Update and Delete operations."
        ],

        [
            "HTTP Status Code",
            "Numeric code communicating the result of an HTTP request."
        ],

        [
            "404",
            "Status indicating that a requested route or resource was not found."
        ],

        [
            "Error Middleware",
            "Express middleware with err, req, res and next parameters used for centralized error handling."
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
                "Express.js is a web framework for Node.js that simplifies HTTP server development, routing and middleware-based request processing."
        },

        {
            question:
                "Why use Express instead of the Node.js http module directly?",

            answer:
                "Express provides convenient routing, middleware, request handling and response APIs that reduce repetitive low-level HTTP code."
        },

        {
            question:
                "What is middleware in Express?",

            answer:
                "Middleware is a function that can inspect or modify a request and response, perform processing and either end the response or call next() to continue."
        },

        {
            question:
                "What does express.json() do?",

            answer:
                "It parses incoming JSON request bodies and makes the parsed data available through req.body."
        },

        {
            question:
                "What is the difference between req.params and req.query?",

            answer:
                "req.params contains values captured from route paths such as /products/:id, while req.query contains optional query-string values such as ?limit=10."
        },

        {
            question:
                "What is REST?",

            answer:
                "REST is an architectural style commonly used to design APIs around resources, URLs and standard HTTP methods."
        },

        {
            question:
                "What is CRUD?",

            answer:
                "CRUD stands for Create, Read, Update and Delete."
        },

        {
            question:
                "What HTTP method is commonly used to create a resource?",

            answer:
                "POST is commonly used to create a new resource."
        },

        {
            question:
                "What is the difference between PUT and PATCH?",

            answer:
                "PUT is commonly used for replacing or fully updating a resource, while PATCH is commonly used for partial updates."
        },

        {
            question:
                "Why use HTTP status codes correctly?",

            answer:
                "Status codes communicate the outcome of an HTTP request and allow clients to handle success and failure conditions consistently."
        },

        {
            question:
                "How do you handle a 404 route in Express?",

            answer:
                "Register a fallback middleware after the normal routes that sends a 404 response when no route has handled the request."
        },

        {
            question:
                "What makes error middleware different?",

            answer:
                "Express error middleware has four parameters: err, req, res and next."
        },

        {
            question:
                "Why should large Express applications be organized into multiple modules?",

            answer:
                "Separating routes, controllers, services, models and middleware makes the application easier to maintain, test and extend."
        }

    ],


    /* =====================================================
       PRACTICE
       ===================================================== */

    practice: [

        {
            title: "First Express Server",

            task:
                "Create an Express application that runs on port 3000 and returns 'Welcome to CodeBhavya' from GET /.",

            hint:
                "Use express(), app.get() and app.listen().",

            answer:
                "Create an Express app, register GET / and start the application on port 3000."
        },

        {
            title: "Multiple Routes",

            task:
                "Create GET /, GET /about and GET /contact routes with different responses.",

            hint:
                "Use app.get() for each route.",

            answer:
                "Register three GET routes and send a different response from each handler."
        },

        {
            title: "JSON Middleware",

            task:
                "Create a POST /products route that receives a JSON product and returns it as JSON.",

            hint:
                "Use app.use(express.json()) and req.body.",

            answer:
                "Enable express.json(), read the submitted product from req.body and return it using res.json()."
        },

        {
            title: "Route Parameters",

            task:
                "Create GET /students/:id and return the student ID from req.params.",

            hint:
                "Use req.params.id.",

            answer:
                "Define /students/:id and read the dynamic value using req.params.id."
        },

        {
            title: "Query Parameters",

            task:
                "Create GET /products?category=books&limit=10 and return the query values as JSON.",

            hint:
                "Use req.query.",

            answer:
                "Read req.query.category and req.query.limit and return them through res.json()."
        },

        {
            title: "Status Codes",

            task:
                "Create a POST /users endpoint that returns HTTP 201 after creating a user.",

            hint:
                "Use res.status(201).json().",

            answer:
                "Return the newly created user with res.status(201).json(user)."
        },

        {
            title: "404 Handler",

            task:
                "Create an Express fallback that returns a JSON 404 response for unknown routes.",

            hint:
                "Register app.use() after your valid routes.",

            answer:
                "Add a final app.use() middleware that sends res.status(404).json(...)."
        },

        {
            title: "CRUD API",

            task:
                "Build a small in-memory products API supporting GET, POST, PATCH and DELETE.",

            hint:
                "Use an array to store products temporarily.",

            answer:
                "Create routes for listing products, adding products, updating products and deleting products."
        },

        {
            title: "Middleware Logger",

            task:
                "Create middleware that logs the HTTP method and URL for every incoming request.",

            hint:
                "Use req.method, req.url and next().",

            answer:
                "Log the request information and call next() so processing continues."
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
                "A CSS language",
                "A browser"
            ],

            answer: 1,

            explanation:
                "Express.js is a web framework commonly used with Node.js."
        },

        {
            question:
                "Which function creates an Express application?",

            options: [
                "express()",
                "createAppHTML()",
                "node.server()",
                "http.browser()"
            ],

            answer: 0,

            explanation:
                "Calling express() creates an Express application object."
        },

        {
            question:
                "Which method is commonly used to retrieve a resource?",

            options: [
                "GET",
                "POST",
                "DELETE",
                "PATCH"
            ],

            answer: 0,

            explanation:
                "GET is commonly used to retrieve resources."
        },

        {
            question:
                "Which HTTP method is commonly used to create a resource?",

            options: [
                "GET",
                "POST",
                "DELETE",
                "OPTIONS"
            ],

            answer: 1,

            explanation:
                "POST is commonly used to create a new resource."
        },

        {
            question:
                "What does express.json() do?",

            options: [
                "Creates a database",
                "Parses JSON request bodies",
                "Starts the server",
                "Deletes JSON"
            ],

            answer: 1,

            explanation:
                "express.json() parses incoming JSON request bodies."
        },

        {
            question:
                "Where are route parameters available?",

            options: [
                "req.params",
                "req.cookiesOnly",
                "res.params",
                "app.parameters"
            ],

            answer: 0,

            explanation:
                "Express exposes route parameters through req.params."
        },

        {
            question:
                "Where are query parameters available?",

            options: [
                "req.query",
                "req.routeOnly",
                "res.query",
                "app.search"
            ],

            answer: 0,

            explanation:
                "Express exposes query-string parameters through req.query."
        },

        {
            question:
                "Which method is commonly used to send JSON?",

            options: [
                "res.json()",
                "res.database()",
                "res.htmlOnly()",
                "res.route()"
            ],

            answer: 0,

            explanation:
                "res.json() sends a JSON response."
        },

        {
            question:
                "Which status code commonly means Not Found?",

            options: [
                "200",
                "201",
                "404",
                "500"
            ],

            answer: 2,

            explanation:
                "404 indicates that the requested resource or route was not found."
        },

        {
            question:
                "What does CRUD stand for?",

            options: [
                "Create, Read, Update, Delete",
                "Create, Run, Upload, Download",
                "Code, Route, Use, Deploy",
                "Cache, Read, Upload, Debug"
            ],

            answer: 0,

            explanation:
                "CRUD stands for Create, Read, Update and Delete."
        },

        {
            question:
                "How many parameters does Express error middleware normally receive?",

            options: [
                "1",
                "2",
                "3",
                "4"
            ],

            answer: 3,

            explanation:
                "Express error-handling middleware normally uses err, req, res and next."
        },

        {
            question:
                "Which method is commonly used for partial updates?",

            options: [
                "GET",
                "POST",
                "PATCH",
                "HEAD"
            ],

            answer: 2,

            explanation:
                "PATCH is commonly used for partial updates."
        }

    ],


    /* =====================================================
       GLOSSARY
       ===================================================== */

    glossary: [

        {
            term: "Express.js",
            definition:
                "A web framework for Node.js used to build servers and APIs."
        },

        {
            term: "Application",
            definition:
                "The Express app object that manages routes and middleware."
        },

        {
            term: "Route",
            definition:
                "A URL pattern and HTTP method connected to server-side logic."
        },

        {
            term: "Middleware",
            definition:
                "Reusable request-processing logic executed during the request lifecycle."
        },

        {
            term: "next()",
            definition:
                "Function used to continue processing to the next middleware or handler."
        },

        {
            term: "req",
            definition:
                "Express request object containing information about an incoming HTTP request."
        },

        {
            term: "res",
            definition:
                "Express response object used to send information back to the client."
        },

        {
            term: "req.params",
            definition:
                "Object containing dynamic values captured from route parameters."
        },

        {
            term: "req.query",
            definition:
                "Object containing query-string parameters."
        },

        {
            term: "req.body",
            definition:
                "Object containing parsed request-body data."
        },

        {
            term: "res.json()",
            definition:
                "Express method for sending JSON responses."
        },

        {
            term: "REST",
            definition:
                "An architectural style commonly used to design resource-oriented APIs."
        },

        {
            term: "CRUD",
            definition:
                "Create, Read, Update and Delete operations."
        },

        {
            term: "HTTP Method",
            definition:
                "Verb describing the intended operation of an HTTP request."
        },

        {
            term: "Status Code",
            definition:
                "Numeric HTTP response code describing the result of a request."
        },

        {
            term: "404",
            definition:
                "HTTP status indicating that a requested route or resource was not found."
        },

        {
            term: "Error Middleware",
            definition:
                "Express middleware designed to centrally process application errors."
        }

    ],


    /* =====================================================
       COMPLETION
       ===================================================== */

    completion: {

        title: "Express.js Fundamentals & REST APIs Completed",

        message:
            "You now understand how Express.js builds on Node.js to simplify backend development. You can create routes, use middleware, process JSON requests, work with parameters, design REST APIs, implement CRUD operations and handle errors.",

        achievements: [

            "You understand why Express.js is used with Node.js.",

            "You can create an Express application.",

            "You understand the Express request-response lifecycle.",

            "You can create GET routes.",

            "You understand POST, PUT, PATCH and DELETE.",

            "You understand Express middleware.",

            "You can process JSON request bodies.",

            "You understand route parameters.",

            "You understand query parameters.",

            "You can return JSON responses.",

            "You understand important HTTP status codes.",

            "You understand REST resource design.",

            "You can build a basic CRUD API.",

            "You can create 404 handling.",

            "You understand centralized error-handling middleware.",

            "You understand basic Express application architecture.",

            "You are ready to learn advanced middleware, validation and API architecture."

        ],

        nextLevel:
            "Level 21 — Express Middleware, Validation & API Architecture"

    }

};

