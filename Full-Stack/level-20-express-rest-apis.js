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
    "Learn Express.js from the ground up: applications, routes, middleware, request and response objects, REST API design, CRUD operations, status codes, error handling, and professional project structure.",

  duration: "3–4 Hours",

  difficulty: "Intermediate",

  concepts: 16,

  outcomes: [
    "Understand why Express.js is used with Node.js.",
    "Create and start an Express application.",
    "Understand the Express request-response lifecycle.",
    "Create GET, POST, PUT, PATCH, and DELETE routes.",
    "Understand and use Express middleware.",
    "Parse JSON request bodies with express.json().",
    "Use route parameters and query parameters.",
    "Send structured JSON responses.",
    "Use appropriate HTTP status codes.",
    "Design REST-style resource endpoints.",
    "Build a small in-memory CRUD API.",
    "Handle unknown routes with 404 responses.",
    "Create Express error-handling middleware.",
    "Understand professional Express project organization."
  ],

  sections: [

    /* =====================================================
       SECTION 1
       ===================================================== */

    {
      number: 1,

      title: "Why Express.js?",

      intro:
        "Node.js provides the runtime for server-side JavaScript. Express.js is a lightweight web framework that makes it much easier to build HTTP servers and REST APIs with Node.js.",

      points: [
        "Express runs on top of Node.js.",
        "It simplifies routing and request handling.",
        "It provides a middleware system.",
        "It makes JSON APIs easier to build.",
        "It supports scalable application structures.",
        "It is widely used in MERN applications."
      ],

      comparison: {
        title: "Node HTTP vs Express",
        leftTitle: "Node.js HTTP",
        left: [
          "Lower-level API",
          "More manual request handling",
          "Manual routing logic",
          "More boilerplate"
        ],
        rightTitle: "Express.js",
        right: [
          "Higher-level framework",
          "Simple route definitions",
          "Middleware support",
          "Cleaner API development"
        ]
      },

      code: `const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,

      keyIdea:
        "Express does not replace Node.js. Express uses Node.js and provides a simpler programming model for web servers and APIs."
    },

    /* =====================================================
       SECTION 2
       ===================================================== */

    {
      number: 2,

      title: "Creating an Express Application",

      intro:
        "An Express application starts by importing Express, creating an application object, defining routes, and starting a server.",

      points: [
        "Install Express using npm.",
        "Import the Express package.",
        "Create an Express application.",
        "Define routes.",
        "Start listening on a port."
      ],

      code: `const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to CodeBhavya");
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});`,

      terminal: `npm init -y
npm install express
node server.js`,

      keyIdea:
        "The app object represents your Express application. Routes and middleware are attached to this object."
    },

    /* =====================================================
       SECTION 3
       ===================================================== */

    {
      number: 3,

      title: "Express Request-Response Lifecycle",

      intro:
        "Every HTTP request enters the Express application and moves through middleware and route handlers before a response is sent back to the client.",

      points: [
        "Client sends an HTTP request.",
        "Express receives the request.",
        "Middleware can inspect or modify the request.",
        "Express finds a matching route.",
        "The route handler performs the required work.",
        "The server sends a response.",
        "The client receives the response."
      ],

      comparison: {
        title: "Request Flow",
        leftTitle: "Incoming",
        left: [
          "Browser",
          "Mobile application",
          "Frontend JavaScript",
          "API client"
        ],
        rightTitle: "Processing",
        right: [
          "Middleware",
          "Route matching",
          "Controller logic",
          "Response"
        ]
      },

      code: `Client
  |
  v
Express Application
  |
  v
Middleware
  |
  v
Route
  |
  v
Route Handler
  |
  v
Response
  |
  v
Client`,

      keyIdea:
        "Middleware and routes form the processing pipeline between an incoming request and the final response."
    },

    /* =====================================================
       SECTION 4
       ===================================================== */

    {
      number: 4,

      title: "GET Routes",

      intro:
        "GET routes are normally used when a client wants to retrieve data from the server.",

      points: [
        "app.get() creates a GET route.",
        "The first argument is the URL path.",
        "The second argument is the request handler.",
        "req represents the request.",
        "res represents the response."
      ],

      code: `const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("About CodeBhavya");
});

app.get("/courses", (req, res) => {
  res.json([
    "C Programming",
    "Data Structures",
    "Python",
    "Full Stack"
  ]);
});

app.listen(3000);`,

      keyIdea:
        "Use GET when the main purpose of the request is retrieving a resource."
    },

    /* =====================================================
       SECTION 5
       ===================================================== */

    {
      number: 5,

      title: "POST, PUT, PATCH and DELETE",

      intro:
        "REST APIs use different HTTP methods to communicate the intended operation on a resource.",

      points: [
        "POST usually creates a new resource.",
        "PUT usually replaces an existing resource.",
        "PATCH partially updates an existing resource.",
        "DELETE removes a resource."
      ],

      comparison: {
        title: "HTTP Methods",
        leftTitle: "Method",
        left: [
          "POST → Create",
          "PUT → Replace",
          "PATCH → Partially update",
          "DELETE → Remove"
        ],
        rightTitle: "Example",
        right: [
          "POST /products",
          "PUT /products/10",
          "PATCH /products/10",
          "DELETE /products/10"
        ]
      },

      code: `app.post("/products", (req, res) => {
  res.send("Create product");
});

app.put("/products/10", (req, res) => {
  res.send("Replace product 10");
});

app.patch("/products/10", (req, res) => {
  res.send("Update product 10");
});

app.delete("/products/10", (req, res) => {
  res.send("Delete product 10");
});`,

      keyIdea:
        "HTTP methods communicate the intended operation while the URL identifies the resource."
    },

    /* =====================================================
       SECTION 6
       ===================================================== */

    {
      number: 6,

      title: "Middleware",

      intro:
        "Middleware functions run during the request-response pipeline. They can inspect requests, modify data, perform authentication, log activity, or stop a request.",

      points: [
        "Middleware receives req, res, and next.",
        "next() passes control to the next middleware or route.",
        "Middleware can execute before route handlers.",
        "Multiple middleware functions can be chained.",
        "Authentication and logging are common use cases."
      ],

      code: `const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

app.use(logger);

app.get("/courses", (req, res) => {
  res.json({
    message: "Courses loaded"
  });
});`,

      keyIdea:
        "Calling next() is important when middleware should allow the request to continue."
    },

    /* =====================================================
       SECTION 7
       ===================================================== */

    {
      number: 7,

      title: "Built-in JSON Middleware",

      intro:
        "REST APIs commonly receive JSON data in POST, PUT, and PATCH requests. Express provides express.json() to parse JSON request bodies.",

      points: [
        "JSON request data is available through req.body.",
        "express.json() should normally be registered before routes that need it.",
        "Without JSON parsing middleware, req.body may be undefined.",
        "The parsed object can be validated before storing it."
      ],

      code: `const express = require("express");

const app = express();

app.use(express.json());

app.post("/students", (req, res) => {
  const student = req.body;

  res.status(201).json({
    message: "Student received",
    data: student
  });
});

app.listen(3000);`,

      keyIdea:
        "express.json() converts an incoming JSON request body into a JavaScript object available through req.body."
    },

    /* =====================================================
       SECTION 8
       ===================================================== */

    {
      number: 8,

      title: "Route Parameters",

      intro:
        "Route parameters represent dynamic values inside a URL path. They are useful when addressing one specific resource.",

      points: [
        "Parameters are defined using :name syntax.",
        "Values are available through req.params.",
        "Route parameters are commonly used for IDs.",
        "A route such as /students/:id can represent one student."
      ],

      code: `app.get("/students/:id", (req, res) => {
  const studentId = req.params.id;

  res.json({
    message: "Student requested",
    id: studentId
  });
});`,

      keyIdea:
        "Route parameters identify a specific resource inside the URL path."
    },

    /* =====================================================
       SECTION 9
       ===================================================== */

    {
      number: 9,

      title: "Query Parameters",

      intro:
        "Query parameters are optional values placed after a question mark in a URL. They are commonly used for filtering, searching, sorting, and pagination.",

      points: [
        "Query parameters are accessed through req.query.",
        "They are optional by nature.",
        "Multiple query parameters can be supplied.",
        "They are useful for search and filtering."
      ],

      code: `app.get("/courses", (req, res) => {
  const category = req.query.category;
  const page = req.query.page;

  res.json({
    category: category,
    page: page
  });
});`,

      comparison: {
        title: "Parameter Types",
        leftTitle: "Route Parameter",
        left: [
          "/students/101",
          "req.params.id",
          "Identifies a resource"
        ],
        rightTitle: "Query Parameter",
        right: [
          "/students?page=2",
          "req.query.page",
          "Filters or modifies a request"
        ]
      },

      keyIdea:
        "Use route parameters for resource identity and query parameters for optional request controls."
    },

    /* =====================================================
       SECTION 10
       ===================================================== */

    {
      number: 10,

      title: "Sending JSON Responses",

      intro:
        "REST APIs generally communicate using JSON. Express provides res.json() for sending JavaScript objects and arrays as JSON responses.",

      points: [
        "res.json() automatically serializes JavaScript values.",
        "Objects are useful for structured API responses.",
        "Arrays are useful for collections.",
        "A consistent response structure improves frontend development."
      ],

      code: `app.get("/profile", (req, res) => {
  res.json({
    id: 101,
    name: "Bhavya",
    role: "Student",
    skills: [
      "JavaScript",
      "Node.js",
      "Express.js"
    ]
  });
});`,

      keyIdea:
        "JSON creates a common language between frontend clients and backend APIs."
    },

    /* =====================================================
       SECTION 11
       ===================================================== */

    {
      number: 11,

      title: "HTTP Status Codes",

      intro:
        "Status codes tell the client what happened when the server processed a request.",

      points: [
        "200 means the request succeeded.",
        "201 means a resource was created.",
        "204 means the request succeeded without a response body.",
        "400 means the request is invalid.",
        "401 means authentication is required or invalid.",
        "403 means access is forbidden.",
        "404 means the requested resource was not found.",
        "409 indicates a conflict.",
        "500 indicates an unexpected server-side failure."
      ],

      comparison: {
        title: "Important API Status Codes",
        leftTitle: "Success",
        left: [
          "200 OK",
          "201 Created",
          "204 No Content"
        ],
        rightTitle: "Failure",
        right: [
          "400 Bad Request",
          "401 Unauthorized",
          "403 Forbidden",
          "404 Not Found",
          "500 Internal Server Error"
        ]
      },

      code: `app.post("/products", (req, res) => {
  const product = req.body;

  res.status(201).json({
    message: "Product created",
    data: product
  });
});`,

      keyIdea:
        "A good API communicates both the result and the appropriate HTTP status code."
    },

    /* =====================================================
       SECTION 12
       ===================================================== */

    {
      number: 12,

      title: "REST Resource Design",

      intro:
        "REST-style APIs organize application data around resources. URLs normally use nouns, while HTTP methods communicate actions.",

      points: [
        "Use resource names instead of action-heavy URLs.",
        "Prefer plural resource names for collections.",
        "Use HTTP methods to express operations.",
        "Use IDs to identify individual resources.",
        "Keep endpoint naming consistent."
      ],

      comparison: {
        title: "Resource-Oriented Design",
        leftTitle: "Preferred",
        left: [
          "GET /products",
          "GET /products/10",
          "POST /products",
          "PATCH /products/10",
          "DELETE /products/10"
        ],
        rightTitle: "Avoid Action URLs",
        right: [
          "GET /getProducts",
          "POST /createProduct",
          "POST /deleteProduct",
          "POST /updateProduct"
        ]
      },

      code: `GET     /products
GET     /products/:id
POST    /products
PUT     /products/:id
PATCH   /products/:id
DELETE  /products/:id`,

      keyIdea:
        "REST design separates the resource name from the operation being performed on that resource."
    },

    /* =====================================================
       SECTION 13
       ===================================================== */

    {
      number: 13,

      title: "Building a Small CRUD API",

      intro:
        "A CRUD API supports Create, Read, Update, and Delete operations. The following example uses an in-memory array so you can understand the Express flow before introducing a database.",

      points: [
        "Create with POST.",
        "Read all resources with GET.",
        "Read one resource using a route parameter.",
        "Update with PATCH.",
        "Delete with DELETE.",
        "A real application would normally persist data in a database."
      ],

      code: `const express = require("express");

const app = express();

app.use(express.json());

let products = [
  {
    id: 1,
    name: "Laptop",
    price: 55000
  },
  {
    id: 2,
    name: "Keyboard",
    price: 1500
  }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find(item => item.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const product = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price
  };

  products.push(product);

  res.status(201).json(product);
});

app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find(item => item.id === id);

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
  const id = Number(req.params.id);

  const index = products.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  products.splice(index, 1);

  res.status(204).send();
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});`,

      keyIdea:
        "CRUD is the foundation of many business APIs. Databases replace the in-memory array when the application becomes persistent."
    },

    /* =====================================================
       SECTION 14
       ===================================================== */

    {
      number: 14,

      title: "404 Handling",

      intro:
        "If no route matches the incoming request, Express can return a custom 404 response.",

      points: [
        "A 404 means the requested route or resource was not found.",
        "The 404 handler should normally be placed after valid routes.",
        "It can return JSON for an API.",
        "Clear error messages help frontend developers."
      ],

      code: `app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});`,

      keyIdea:
        "Put the catch-all 404 middleware after your normal route definitions so valid routes get a chance to respond first."
    },

    /* =====================================================
       SECTION 15
       ===================================================== */

    {
      number: 15,

      title: "Error-Handling Middleware",

      intro:
        "Express supports special error-handling middleware with four parameters: err, req, res, and next.",

      points: [
        "Error middleware has four parameters.",
        "It should normally be registered after routes.",
        "next(error) can pass an error to the error handler.",
        "A centralized handler keeps error responses consistent.",
        "Production applications should avoid exposing sensitive internal details."
      ],

      code: `app.get("/demo-error", (req, res, next) => {
  const error = new Error("Something went wrong");

  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    error: "Internal server error"
  });
});`,

      keyIdea:
        "Centralized error handling prevents every route from implementing completely different error-response logic."
    },

    /* =====================================================
       SECTION 16
       ===================================================== */

    {
      number: 16,

      title: "Organizing an Express Application",

      intro:
        "As an Express project grows, keeping everything inside one server.js file becomes difficult. A professional application separates responsibilities.",

      points: [
        "Routes define API endpoints.",
        "Controllers contain request-handling logic.",
        "Services contain reusable business logic.",
        "Middleware contains cross-cutting request processing.",
        "Models represent database structures.",
        "Configuration stores environment-specific settings."
      ],

      comparison: {
        title: "Example Project Structure",
        leftTitle: "Folder",
        left: [
          "routes/",
          "controllers/",
          "services/",
          "middleware/"
        ],
        rightTitle: "Purpose",
        right: [
          "API endpoint definitions",
          "Request handling",
          "Business logic",
          "Reusable request processing"
        ]
      },

      code: `project/
|
├── server.js
├── app.js
|
├── routes/
|   └── product.routes.js
|
├── controllers/
|   └── product.controller.js
|
├── services/
|   └── product.service.js
|
├── middleware/
|   └── error.middleware.js
|
├── models/
|   └── product.model.js
|
└── package.json`,

      keyIdea:
        "Separation of concerns makes an Express application easier to test, maintain, debug, and extend."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
     ========================================================= */

  visualizer: {

    title: "Express Request → Middleware → Route Laboratory",

    description:
      "Follow an HTTP request as it enters Express, passes through middleware, matches a route, executes application logic, and returns a response.",

    steps: [
      {
        title: "1. Client Request",
        operation: "GET /products/10",
        detail:
          "A browser, frontend application, mobile app, or API client sends an HTTP request."
      },
      {
        title: "2. Express Receives Request",
        operation: "Request enters the Express application",
        detail:
          "Express creates the request and response objects and starts processing the request pipeline."
      },
      {
        title: "3. Middleware",
        operation: "logger(req, res, next)",
        detail:
          "Middleware can log the request, authenticate the user, validate data, or modify request information."
      },
      {
        title: "4. Route Matching",
        operation: "GET /products/:id",
        detail:
          "Express identifies the route that matches the HTTP method and URL."
      },
      {
        title: "5. Parameters",
        operation: "req.params.id = 10",
        detail:
          "The dynamic route parameter becomes available through req.params."
      },
      {
        title: "6. Handler",
        operation: "Find product",
        detail:
          "The route handler performs the required application logic."
      },
      {
        title: "7. Response",
        operation: "res.json(product)",
        detail:
          "Express converts the JavaScript object into JSON and sends it to the client."
      },
      {
        title: "8. Client Receives Data",
        operation: "HTTP 200 OK",
        detail:
          "The client receives the final response and can display or process the data."
      }
    ]
  },

  /* =========================================================
     REQUEST TRACE
     ========================================================= */

  trace: {

    title: "Trace an Express CRUD Request",

    lines: [
      {
        line: 1,
        code: "app.use(express.json());"
      },
      {
        line: 2,
        code: "app.get('/products/:id', (req, res) => {"
      },
      {
        line: 3,
        code: "  const id = Number(req.params.id);"
      },
      {
        line: 4,
        code: "  const product = products.find(item => item.id === id);"
      },
      {
        line: 5,
        code: "  if (!product) {"
      },
      {
        line: 6,
        code: "    return res.status(404).json({ error: 'Product not found' });"
      },
      {
        line: 7,
        code: "  }"
      },
      {
        line: 8,
        code: "  res.json(product);"
      },
      {
        line: 9,
        code: "});"
      }
    ],

    steps: [
      {
        line: 1,
        state: "JSON middleware registered",
        explain:
          "Express is prepared to parse JSON request bodies."
      },
      {
        line: 2,
        state: "Route matched",
        explain:
          "The incoming GET request matches /products/:id."
      },
      {
        line: 3,
        state: "id = 10",
        explain:
          "The route parameter is converted from a string to a number."
      },
      {
        line: 4,
        state: "Search products",
        explain:
          "The array is searched for a product whose ID matches the requested ID."
      },
      {
        line: 5,
        state: "Check result",
        explain:
          "The application checks whether a matching product exists."
      },
      {
        line: 6,
        state: "404 if missing",
        explain:
          "If the product does not exist, the API immediately returns a 404 response."
      },
      {
        line: 7,
        state: "Continue",
        explain:
          "If the product exists, execution continues to the response."
      },
      {
        line: 8,
        state: "JSON response",
        explain:
          "The product object is sent to the client as JSON with the default 200 status."
      },
      {
        line: 9,
        state: "Request complete",
        explain:
          "The Express route handler finishes processing the request."
      }
    ]
  },

  /* =========================================================
     REVISION
     ========================================================= */

  revision: [
    [
      "Express.js",
      "A web framework running on top of Node.js."
    ],
    [
      "Application",
      "The Express app object that holds routes and middleware."
    ],
    [
      "Route",
      "A method and path combination that handles a request."
    ],
    [
      "Middleware",
      "A function that runs during the request-response pipeline."
    ],
    [
      "next()",
      "Passes control to the next middleware or handler."
    ],
    [
      "req",
      "Express request object."
    ],
    [
      "res",
      "Express response object."
    ],
    [
      "req.params",
      "Contains route parameter values."
    ],
    [
      "req.query",
      "Contains query parameter values."
    ],
    [
      "req.body",
      "Contains parsed request body data."
    ],
    [
      "res.json()",
      "Sends a JavaScript value as JSON."
    ],
    [
      "REST",
      "A resource-oriented approach to designing HTTP APIs."
    ],
    [
      "CRUD",
      "Create, Read, Update, and Delete."
    ],
    [
      "404",
      "Indicates that a requested route or resource was not found."
    ],
    [
      "Error Middleware",
      "Express middleware using the signature err, req, res, next."
    ]
  ],

  /* =========================================================
     INTERVIEW
     ========================================================= */

  interview: [

    {
      question: "What is Express.js?",
      answer:
        "Express.js is a lightweight web framework for Node.js that simplifies routing, middleware, HTTP request handling, and REST API development."
    },

    {
      question: "Is Express.js a replacement for Node.js?",
      answer:
        "No. Express.js runs on top of Node.js and provides higher-level tools for building web applications and APIs."
    },

    {
      question: "What is middleware?",
      answer:
        "Middleware is a function that runs during the request-response lifecycle and can inspect or modify the request, send a response, or pass control using next()."
    },

    {
      question: "What is req.params?",
      answer:
        "req.params contains values captured from dynamic route parameters such as /users/:id."
    },

    {
      question: "What is req.query?",
      answer:
        "req.query contains optional query-string values such as ?page=2 or ?search=node."
    },

    {
      question: "Why is express.json() used?",
      answer:
        "express.json() parses incoming JSON request bodies so that the data becomes available through req.body."
    },

    {
      question: "What is the difference between PUT and PATCH?",
      answer:
        "PUT is commonly used to replace an entire resource, while PATCH is commonly used to partially update a resource."
    },

    {
      question: "What does REST mean?",
      answer:
        "REST is an architectural style that commonly organizes APIs around resources and uses HTTP methods to represent operations."
    },

    {
      question: "What is a 404 response?",
      answer:
        "A 404 response indicates that the requested route or resource could not be found."
    },

    {
      question: "What is special about Express error middleware?",
      answer:
        "Express error-handling middleware uses four parameters: err, req, res, and next."
    }
  ],

  /* =========================================================
     PRACTICE
     ========================================================= */

  practice: [

    {
      title: "Hello Express Server",

      task:
        "Create an Express server on port 3000 with a GET / route that returns a welcome message.",

      hint:
        "Import express, create app, define app.get(), and call app.listen().",

      answer:
        'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Welcome to CodeBhavya");\n});\n\napp.listen(3000);'
    },

    {
      title: "Course API",

      task:
        "Create GET /courses that returns an array containing three course names as JSON.",

      hint:
        "Use res.json() inside the GET route.",

      answer:
        'app.get("/courses", (req, res) => {\n  res.json(["C", "Python", "Full Stack"]);\n});'
    },

    {
      title: "Student Parameter",

      task:
        "Create GET /students/:id and return the requested student ID.",

      hint:
        "Read req.params.id.",

      answer:
        'app.get("/students/:id", (req, res) => {\n  res.json({\n    id: req.params.id\n  });\n});'
    },

    {
      title: "Search API",

      task:
        "Create GET /search and read a query parameter named q.",

      hint:
        "Use req.query.q.",

      answer:
        'app.get("/search", (req, res) => {\n  res.json({\n    search: req.query.q\n  });\n});'
    },

    {
      title: "Create Product",

      task:
        "Create POST /products that reads name and price from req.body and returns a 201 response.",

      hint:
        "Remember to use app.use(express.json()).",

      answer:
        'app.use(express.json());\n\napp.post("/products", (req, res) => {\n  res.status(201).json({\n    name: req.body.name,\n    price: req.body.price\n  });\n});'
    },

    {
      title: "404 Middleware",

      task:
        "Create a catch-all middleware that returns JSON with status 404.",

      hint:
        "Register app.use() after your valid routes.",

      answer:
        'app.use((req, res) => {\n  res.status(404).json({\n    error: "Route not found"\n  });\n});'
    }
  ],

  /* =========================================================
     QUIZ
     ========================================================= */

  quiz: [

    {
      question: "Express.js is primarily used with which runtime?",
      options: [
        "Node.js",
        "Python",
        "Java",
        "PHP"
      ],
      answer: 0,
      explanation:
        "Express.js is a web framework that runs on Node.js."
    },

    {
      question: "Which method is normally used to retrieve a resource?",
      options: [
        "POST",
        "GET",
        "DELETE",
        "PATCH"
      ],
      answer: 1,
      explanation:
        "GET is normally used to retrieve resources."
    },

    {
      question: "Which object contains route parameters?",
      options: [
        "req.body",
        "req.query",
        "req.params",
        "req.routeData"
      ],
      answer: 2,
      explanation:
        "Dynamic route parameters such as :id are available through req.params."
    },

    {
      question: "Which middleware parses JSON request bodies?",
      options: [
        "express.json()",
        "express.body()",
        "express.parse()",
        "express.data()"
      ],
      answer: 0,
      explanation:
        "express.json() parses incoming JSON request bodies."
    },

    {
      question: "Which method is commonly used for partial updates?",
      options: [
        "GET",
        "POST",
        "PATCH",
        "OPTIONS"
      ],
      answer: 2,
      explanation:
        "PATCH is commonly used for partial resource updates."
    },

    {
      question: "Which status code means Created?",
      options: [
        "200",
        "201",
        "204",
        "404"
      ],
      answer: 1,
      explanation:
        "HTTP 201 means the request successfully created a resource."
    },

    {
      question: "Which status code represents Not Found?",
      options: [
        "201",
        "301",
        "404",
        "500"
      ],
      answer: 2,
      explanation:
        "404 indicates that the requested route or resource was not found."
    },

    {
      question: "How many parameters does Express error middleware normally define?",
      options: [
        "2",
        "3",
        "4",
        "5"
      ],
      answer: 2,
      explanation:
        "Error middleware uses err, req, res, and next."
    },

    {
      question: "Which method sends JSON to the client?",
      options: [
        "res.json()",
        "res.data()",
        "res.object()",
        "res.sendJsonData()"
      ],
      answer: 0,
      explanation:
        "res.json() sends a JavaScript value as a JSON response."
    },

    {
      question: "What does next() usually do in middleware?",
      options: [
        "Stops the server",
        "Starts a database",
        "Passes control forward",
        "Deletes the request"
      ],
      answer: 2,
      explanation:
        "next() passes control to the next middleware or route handler."
    }
  ],

  /* =========================================================
     GLOSSARY
     ========================================================= */

  glossary: [

    {
      term: "Express.js",
      definition:
        "A lightweight Node.js web framework for building web applications and APIs."
    },

    {
      term: "Route",
      definition:
        "A combination of an HTTP method and URL path that handles a request."
    },

    {
      term: "Middleware",
      definition:
        "A function executed during the Express request-response lifecycle."
    },

    {
      term: "Request",
      definition:
        "Information sent from a client to the server."
    },

    {
      term: "Response",
      definition:
        "Information sent by the server back to the client."
    },

    {
      term: "REST API",
      definition:
        "An HTTP API designed around resources and standard HTTP methods."
    },

    {
      term: "CRUD",
      definition:
        "Create, Read, Update, and Delete operations."
    },

    {
      term: "Route Parameter",
      definition:
        "A dynamic value embedded in a URL path."
    },

    {
      term: "Query Parameter",
      definition:
        "An optional value supplied after the question mark in a URL."
    },

    {
      term: "HTTP Status Code",
      definition:
        "A numeric code describing the result of an HTTP request."
    },

    {
      term: "JSON",
      definition:
        "A text-based data format commonly used for communication between applications."
    },

    {
      term: "Error Middleware",
      definition:
        "Special Express middleware used to centrally process application errors."
    }
  ],

  /* =========================================================
     COMPLETION
     ========================================================= */

  completion: {

    title: "Level 20 Complete — Express.js Fundamentals & REST APIs",

    message:
      "You can now create Express applications, design routes, use middleware, handle JSON requests, build REST-style CRUD APIs, return correct status codes, and structure Express applications for larger projects.",

    achievements: [
      "Express application creation",
      "HTTP routing",
      "Request and response handling",
      "Middleware",
      "JSON APIs",
      "Route parameters",
      "Query parameters",
      "REST API design",
      "CRUD operations",
      "HTTP status codes",
      "404 handling",
      "Error handling",
      "Express project architecture"
    ],

    nextLevel:
      "Level 21 — Express Middleware, Validation & API Architecture"
  }
};
