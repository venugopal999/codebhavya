"use strict";

/* =========================================================
   CODEBHAVYA FULL STACK / MERN
   LEVEL 21 — EXPRESS MIDDLEWARE, VALIDATION & API ARCHITECTURE
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[21] = {
  n: 21,

  kicker: "PART 4 • NODE & EXPRESS • LEVEL 21",

  title: "Express Middleware, Validation & API Architecture",

  summary:
    "Move from basic Express routes to professional API architecture. Learn application middleware, router middleware, validation, authentication and authorization concepts, routers, controllers, services, async errors, centralized error handling, and scalable API organization.",

  duration: "3–4 Hours",

  difficulty: "Intermediate",

  concepts: 16,

  outcomes: [
    "Understand the role of middleware in Express applications.",
    "Create application-level middleware.",
    "Create router-level middleware.",
    "Build reusable request logging middleware.",
    "Understand authentication middleware concepts.",
    "Understand authorization middleware concepts.",
    "Validate incoming request data.",
    "Create useful validation error responses.",
    "Use express.Router() to organize endpoints.",
    "Separate routes from controllers.",
    "Understand the purpose of a service layer.",
    "Handle asynchronous API operations safely.",
    "Build centralized error-handling middleware.",
    "Create consistent API response structures.",
    "Understand professional Express project architecture."
  ],

  sections: [

    /* =====================================================
       SECTION 1
       ===================================================== */

    {
      number: 1,

      title: "Middleware: The Express Pipeline",

      intro:
        "Middleware is one of the most important ideas in Express. Middleware functions run between the incoming request and the final response. They allow an application to perform reusable processing before a route handler runs.",

      points: [
        "Middleware receives req, res, and next.",
        "Middleware can inspect the request.",
        "Middleware can modify request or response data.",
        "Middleware can terminate the request.",
        "Middleware can pass control using next().",
        "Multiple middleware functions can execute in sequence."
      ],

      comparison: {
        title: "Middleware Decisions",
        leftTitle: "Continue",
        left: [
          "Perform processing",
          "Call next()",
          "Next middleware runs",
          "Route may eventually execute"
        ],
        rightTitle: "Stop",
        right: [
          "Send response",
          "Return an error",
          "Request ends",
          "Later handlers do not execute"
        ]
      },

      code: `const middleware = (req, res, next) => {
  console.log("Middleware executed");
  next();
};

app.use(middleware);

app.get("/", (req, res) => {
  res.send("Home");
});`,

      keyIdea:
        "Middleware is a reusable processing layer inside the Express request-response pipeline."
    },

    /* =====================================================
       SECTION 2
       ===================================================== */

    {
      number: 2,

      title: "Application-Level Middleware",

      intro:
        "Application-level middleware is attached directly to the Express application using app.use(). It can run for many routes or for a selected path.",

      points: [
        "app.use() registers application middleware.",
        "It can run for every request.",
        "A path can limit middleware to a specific group of URLs.",
        "Logging, authentication, security, and parsing are common examples."
      ],

      code: `const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("Request received");
  next();
});

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/courses", (req, res) => {
  res.json(["C", "Python", "Full Stack"]);
});

app.listen(3000);`,

      keyIdea:
        "Application-level middleware is useful when the same processing should happen across many routes."
    },

    /* =====================================================
       SECTION 3
       ===================================================== */

    {
      number: 3,

      title: "Router-Level Middleware",

      intro:
        "Router-level middleware works like application middleware, but it is attached to an Express Router. This makes it useful for a particular group of related routes.",

      points: [
        "express.Router() creates a modular router.",
        "router.use() registers middleware for that router.",
        "Router middleware helps isolate route-specific logic.",
        "It is useful for authentication and authorization."
      ],

      code: `const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Product router middleware");
  next();
});

router.get("/", (req, res) => {
  res.json({
    message: "All products"
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: "One product"
  });
});

app.use("/products", router);`,

      keyIdea:
        "Router-level middleware keeps related middleware and routes together."
    },

    /* =====================================================
       SECTION 4
       ===================================================== */

    {
      number: 4,

      title: "Request Logging Middleware",

      intro:
        "Logging middleware records useful information about incoming requests. It helps developers understand application behavior and investigate problems.",

      points: [
        "HTTP method can be logged.",
        "Request URL can be logged.",
        "Timestamp can be recorded.",
        "Response status can also be recorded.",
        "Production applications usually use structured logging systems."
      ],

      code: `const logger = (req, res, next) => {
  const time = new Date().toISOString();

  console.log(
    time,
    req.method,
    req.originalUrl
  );

  next();
};

app.use(logger);`,

      comparison: {
        title: "Useful Request Information",
        leftTitle: "Request",
        left: [
          "HTTP method",
          "URL",
          "IP information",
          "Query parameters"
        ],
        rightTitle: "Response",
        right: [
          "Status code",
          "Response time",
          "Errors",
          "Completion"
        ]
      },

      keyIdea:
        "Good logging helps developers understand what the server is receiving and how it is responding."
    },

    /* =====================================================
       SECTION 5
       ===================================================== */

    {
      number: 5,

      title: "Authentication Middleware",

      intro:
        "Authentication answers the question: Who is the user? Middleware can inspect credentials such as a session or token before allowing access to protected routes.",

      points: [
        "Authentication verifies identity.",
        "Credentials may come from cookies, sessions, or tokens.",
        "Protected routes should verify credentials before business logic.",
        "Invalid credentials should result in an appropriate error response.",
        "Real applications should use established security practices."
      ],

      code: `const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  req.user = {
    id: 101,
    name: "Bhavya"
  };

  next();
};

app.get("/profile", authenticate, (req, res) => {
  res.json({
    user: req.user
  });
});`,

      keyIdea:
        "Authentication middleware establishes the identity of the requester before protected application logic runs."
    },

    /* =====================================================
       SECTION 6
       ===================================================== */

    {
      number: 6,

      title: "Authorization Middleware",

      intro:
        "Authorization answers a different question: What is this authenticated user allowed to do?",

      points: [
        "Authentication identifies the user.",
        "Authorization checks permissions.",
        "Roles can include admin, instructor, student, or user.",
        "A user may be authenticated but still not have permission.",
        "Authorization should be checked before sensitive operations."
      ],

      comparison: {
        title: "Authentication vs Authorization",
        leftTitle: "Authentication",
        left: [
          "Who are you?",
          "Verify identity",
          "Login or token",
          "Usually happens first"
        ],
        rightTitle: "Authorization",
        right: [
          "What can you do?",
          "Check permissions",
          "Role or permission",
          "Usually follows authentication"
        ]
      },

      code: `const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Access forbidden"
    });
  }

  next();
};

app.delete(
  "/users/:id",
  authenticate,
  requireAdmin,
  (req, res) => {
    res.json({
      message: "User deleted"
    });
  }
);`,

      keyIdea:
        "Authentication establishes identity; authorization determines whether that identity has permission to perform an operation."
    },

    /* =====================================================
       SECTION 7
       ===================================================== */

    {
      number: 7,

      title: "Request Validation",

      intro:
        "Never assume that incoming client data is correct. Validation checks whether request data has the expected structure and values before business logic processes it.",

      points: [
        "Required fields should be checked.",
        "String length can be validated.",
        "Numbers can be checked for valid ranges.",
        "Email formats can be checked.",
        "Unexpected or dangerous input should be handled safely.",
        "Validation should happen before database operations."
      ],

      code: `const validateProduct = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Product name is required"
    });
  }

  if (
    typeof price !== "number" ||
    price <= 0
  ) {
    return res.status(400).json({
      error: "Price must be greater than zero"
    });
  }

  next();
};

app.post(
  "/products",
  validateProduct,
  (req, res) => {
    res.status(201).json({
      message: "Product is valid"
    });
  }
);`,

      keyIdea:
        "Validation creates a boundary between untrusted client input and trusted application logic."
    },

    /* =====================================================
       SECTION 8
       ===================================================== */

    {
      number: 8,

      title: "Validation Error Responses",

      intro:
        "A useful API should clearly tell the client what went wrong. Instead of returning an unclear message, validation responses can identify individual fields.",

      points: [
        "Return HTTP 400 for invalid client input in common validation scenarios.",
        "Provide clear field-level messages.",
        "Keep response structures consistent.",
        "Do not expose internal implementation details.",
        "Frontend applications can use structured errors to show messages."
      ],

      code: `const validateStudent = (req, res, next) => {
  const errors = [];

  if (!req.body.name) {
    errors.push({
      field: "name",
      message: "Name is required"
    });
  }

  if (!req.body.email) {
    errors.push({
      field: "email",
      message: "Email is required"
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors
    });
  }

  next();
};`,

      comparison: {
        title: "Poor vs Structured Errors",
        leftTitle: "Poor",
        left: [
          "Invalid input",
          "Something went wrong",
          "Bad data"
        ],
        rightTitle: "Structured",
        right: [
          "Validation failed",
          "Field: email",
          "Message: Email is required"
        ]
      },

      keyIdea:
        "Structured validation errors make APIs easier for frontend applications and developers to consume."
    },

    /* =====================================================
       SECTION 9
       ===================================================== */

    {
      number: 9,

      title: "Express Router",

      intro:
        "As applications grow, placing every route inside server.js becomes difficult. Express Router allows related routes to be separated into their own modules.",

      points: [
        "express.Router() creates a modular routing object.",
        "Routes can be grouped by resource.",
        "The main application mounts the router with app.use().",
        "Router files become easier to maintain."
      ],

      code: `const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "All products"
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: "Product details"
  });
});

module.exports = router;`,

      keyIdea:
        "Router modules help divide a large Express API into manageable resource-based route files."
    },

    /* =====================================================
       SECTION 10
       ===================================================== */

    {
      number: 10,

      title: "Route and Controller Separation",

      intro:
        "Routes should describe which endpoint is being handled. Controllers should contain the request-handling logic. Separating these responsibilities makes applications easier to maintain.",

      points: [
        "Routes define URL and HTTP method.",
        "Controllers handle req and res.",
        "Controllers can call services.",
        "The route file remains small and readable."
      ],

      code: `const express = require("express");

const router = express.Router();

const getProducts = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Laptop"
    }
  ]);
};

router.get("/", getProducts);

module.exports = router;`,

      comparison: {
        title: "Responsibility",
        leftTitle: "Route",
        left: [
          "HTTP method",
          "URL",
          "Middleware",
          "Controller connection"
        ],
        rightTitle: "Controller",
        right: [
          "Read request",
          "Call application logic",
          "Build response",
          "Handle result"
        ]
      },

      keyIdea:
        "Thin routes and focused controllers make the API easier to understand and test."
    },

    /* =====================================================
       SECTION 11
       ===================================================== */

    {
      number: 11,

      title: "Service Layer",

      intro:
        "The service layer contains reusable business logic. It sits between controllers and data-access code in many professional applications.",

      points: [
        "Controllers focus on HTTP concerns.",
        "Services focus on business rules.",
        "Services can be reused by multiple controllers.",
        "Database access can be isolated in another layer.",
        "This separation improves maintainability."
      ],

      code: `const products = [
  {
    id: 1,
    name: "Laptop",
    price: 55000
  }
];

const findProductById = (id) => {
  return products.find(product => product.id === id);
};

const getProduct = (req, res) => {
  const id = Number(req.params.id);

  const product = findProductById(id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  res.json(product);
};`,

      keyIdea:
        "The service layer separates business rules from HTTP-specific controller code."
    },

    /* =====================================================
       SECTION 12
       ===================================================== */

    {
      number: 12,

      title: "Async Route Handling",

      intro:
        "Real Express applications frequently perform asynchronous operations such as database queries, file operations, or external API requests.",

      points: [
        "Async functions return promises.",
        "Database operations are usually asynchronous.",
        "Errors from asynchronous work must be handled correctly.",
        "try and catch can be used around awaited operations.",
        "Centralized error handling keeps responses consistent."
      ],

      code: `const getProducts = async (req, res, next) => {
  try {
    const products = await loadProducts();

    res.json({
      data: products
    });
  } catch (error) {
    next(error);
  }
};

app.get("/products", getProducts);`,

      keyIdea:
        "When asynchronous work fails, pass the error to centralized Express error handling instead of leaving the request unresolved."
    },

    /* =====================================================
       SECTION 13
       ===================================================== */

    {
      number: 13,

      title: "Centralized Error Handling",

      intro:
        "A professional API should have one consistent mechanism for processing unexpected errors. Express supports special error-handling middleware.",

      points: [
        "Error middleware has four parameters.",
        "Routes can call next(error).",
        "The centralized handler determines the response.",
        "Different errors can be mapped to different status codes.",
        "Sensitive implementation details should not be exposed to clients."
      ],

      code: `app.get("/demo", async (req, res, next) => {
  try {
    throw new Error("Database operation failed");
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});`,

      comparison: {
        title: "Error Flow",
        leftTitle: "Route",
        left: [
          "Operation fails",
          "Catch error",
          "Call next(error)"
        ],
        rightTitle: "Error Handler",
        right: [
          "Receives error",
          "Logs error",
          "Chooses status",
          "Sends response"
        ]
      },

      keyIdea:
        "Centralized error handling prevents every route from creating unrelated error-response formats."
    },

    /* =====================================================
       SECTION 14
       ===================================================== */

    {
      number: 14,

      title: "Consistent API Response Architecture",

      intro:
        "A consistent API response format makes frontend development easier because clients know what structure to expect.",

      points: [
        "Successful responses should have predictable structures.",
        "Error responses should be predictable.",
        "Metadata can be included when needed.",
        "Pagination information can be returned with collection responses.",
        "Consistency is more important than a single universal format."
      ],

      code: `res.status(200).json({
  success: true,
  data: products
});

res.status(400).json({
  success: false,
  error: "Validation failed",
  details: [
    {
      field: "name",
      message: "Name is required"
    }
  ]
});`,

      keyIdea:
        "Predictable response structures reduce frontend complexity and make APIs easier to document."
    },

    /* =====================================================
       SECTION 15
       ===================================================== */

    {
      number: 15,

      title: "Middleware Order Matters",

      intro:
        "Express executes middleware and routes in the order they are registered. Understanding order is essential for authentication, validation, parsing, 404 handling, and errors.",

      points: [
        "Earlier middleware runs before later middleware.",
        "express.json() should be registered before routes that need req.body.",
        "Authentication middleware should run before protected controllers.",
        "404 middleware should normally come after valid routes.",
        "Error middleware should normally be placed at the end."
      ],

      code: `app.use(express.json());

app.use(logger);

app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal server error"
  });
});`,

      keyIdea:
        "Express follows registration order, so middleware placement can directly affect application behavior."
    },

    /* =====================================================
       SECTION 16
       ===================================================== */

    {
      number: 16,

      title: "Professional Express API Architecture",

      intro:
        "A scalable Express application separates responsibilities into focused modules. The exact structure can vary, but the goal is to keep routing, business logic, data access, and infrastructure concerns organized.",

      points: [
        "server.js can start the HTTP server.",
        "app.js can configure Express.",
        "routes define API endpoints.",
        "controllers handle HTTP requests.",
        "services contain business logic.",
        "models represent persistent data.",
        "middleware contains reusable request processing.",
        "config contains application configuration."
      ],

      code: `project/
|
├── server.js
├── app.js
├── package.json
|
├── routes/
|   ├── product.routes.js
|   └── user.routes.js
|
├── controllers/
|   ├── product.controller.js
|   └── user.controller.js
|
├── services/
|   ├── product.service.js
|   └── user.service.js
|
├── models/
|   ├── product.model.js
|   └── user.model.js
|
├── middleware/
|   ├── auth.middleware.js
|   ├── validation.middleware.js
|   └── error.middleware.js
|
└── config/
    └── database.js`,

      comparison: {
        title: "Layer Responsibilities",
        leftTitle: "HTTP Layer",
        left: [
          "Routes",
          "Middleware",
          "Controllers"
        ],
        rightTitle: "Application Layer",
        right: [
          "Services",
          "Models",
          "Database",
          "Business rules"
        ]
      },

      keyIdea:
        "Good architecture reduces coupling and allows individual parts of the application to evolve independently."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
     ========================================================= */

  visualizer: {

    title: "Express Middleware Pipeline Laboratory",

    description:
      "Watch a protected POST request travel through JSON parsing, logging, authentication, validation, routing, controller logic, service logic, and the final response.",

    steps: [
      {
        title: "1. Client Request",
        operation: "POST /api/products",
        detail:
          "The client sends a request containing JSON product information."
      },
      {
        title: "2. JSON Parser",
        operation: "express.json()",
        detail:
          "Express parses the JSON request body and makes it available through req.body."
      },
      {
        title: "3. Logger",
        operation: "logger(req, res, next)",
        detail:
          "The application records the HTTP method and requested URL."
      },
      {
        title: "4. Authentication",
        operation: "authenticate(req, res, next)",
        detail:
          "The server checks whether the requester has valid authentication information."
      },
      {
        title: "5. Validation",
        operation: "validateProduct(req, res, next)",
        detail:
          "The incoming product data is checked before business logic runs."
      },
      {
        title: "6. Router",
        operation: "POST /api/products",
        detail:
          "Express selects the matching resource route."
      },
      {
        title: "7. Controller",
        operation: "createProduct(req, res, next)",
        detail:
          "The controller coordinates the HTTP request with application logic."
      },
      {
        title: "8. Service",
        operation: "productService.create()",
        detail:
          "Business rules and data operations are performed in the service layer."
      },
      {
        title: "9. Response",
        operation: "HTTP 201 Created",
        detail:
          "The API returns the newly created resource using a consistent response structure."
      }
    ]
  },

  /* =========================================================
     REQUEST TRACE
     ========================================================= */

  trace: {

    title: "Trace a Protected Product Request",

    lines: [
      {
        line: 1,
        code: "app.use(express.json());"
      },
      {
        line: 2,
        code: "app.use(logger);"
      },
      {
        line: 3,
        code: "app.post('/products', authenticate, validateProduct, createProduct);"
      },
      {
        line: 4,
        code: "const authenticate = (req, res, next) => {"
      },
      {
        line: 5,
        code: "  if (!req.headers.authorization) {"
      },
      {
        line: 6,
        code: "    return res.status(401).json({ error: 'Authentication required' });"
      },
      {
        line: 7,
        code: "  }"
      },
      {
        line: 8,
        code: "  next();"
      },
      {
        line: 9,
        code: "};"
      },
      {
        line: 10,
        code: "const validateProduct = (req, res, next) => {"
      },
      {
        line: 11,
        code: "  if (!req.body.name) {"
      },
      {
        line: 12,
        code: "    return res.status(400).json({ error: 'Name is required' });"
      },
      {
        line: 13,
        code: "  }"
      },
      {
        line: 14,
        code: "  next();"
      },
      {
        line: 15,
        code: "};"
      },
      {
        line: 16,
        code: "createProduct(req, res);"
      }
    ],

    steps: [
      {
        line: 1,
        state: "JSON parser ready",
        explain:
          "Incoming JSON data can now be accessed through req.body."
      },
      {
        line: 2,
        state: "Logger executes",
        explain:
          "The request is recorded before the protected route continues."
      },
      {
        line: 3,
        state: "Route selected",
        explain:
          "Express finds the POST /products route and begins its middleware chain."
      },
      {
        line: 4,
        state: "Authentication starts",
        explain:
          "The authentication middleware checks the incoming credentials."
      },
      {
        line: 5,
        state: "Credential check",
        explain:
          "The middleware checks whether an authorization value exists."
      },
      {
        line: 6,
        state: "401 if missing",
        explain:
          "If authentication information is missing, the request ends immediately."
      },
      {
        line: 7,
        state: "Authentication accepted",
        explain:
          "When credentials exist, execution can continue."
      },
      {
        line: 8,
        state: "next()",
        explain:
          "next() passes control to the validation middleware."
      },
      {
        line: 9,
        state: "Authentication complete",
        explain:
          "The authentication middleware has finished its work."
      },
      {
        line: 10,
        state: "Validation starts",
        explain:
          "The application now checks the incoming product data."
      },
      {
        line: 11,
        state: "Required field check",
        explain:
          "The application verifies that the product name exists."
      },
      {
        line: 12,
        state: "400 if invalid",
        explain:
          "Invalid input produces a client error response."
      },
      {
        line: 13,
        state: "Validation accepted",
        explain:
          "If the required fields are valid, processing continues."
      },
      {
        line: 14,
        state: "next()",
        explain:
          "Control moves to the controller."
      },
      {
        line: 15,
        state: "Validation complete",
        explain:
          "The request has passed the validation boundary."
      },
      {
        line: 16,
        state: "Controller executes",
        explain:
          "The controller can now safely coordinate the product creation operation."
      }
    ]
  },

  /* =========================================================
     REVISION
     ========================================================= */

  revision: [
    [
      "Middleware",
      "A function that runs during the Express request-response lifecycle."
    ],
    [
      "app.use()",
      "Registers application-level middleware."
    ],
    [
      "Router Middleware",
      "Middleware attached to an Express Router."
    ],
    [
      "Authentication",
      "The process of verifying the identity of a requester."
    ],
    [
      "Authorization",
      "The process of checking what an authenticated user is allowed to do."
    ],
    [
      "Validation",
      "Checking incoming data before application processing."
    ],
    [
      "express.Router()",
      "Creates a modular Express router."
    ],
    [
      "Controller",
      "Handles HTTP request and response responsibilities."
    ],
    [
      "Service",
      "Contains reusable business logic."
    ],
    [
      "next()",
      "Passes control to the next middleware or route handler."
    ],
    [
      "next(error)",
      "Passes an error to Express error-handling middleware."
    ],
    [
      "Error Middleware",
      "Special middleware with err, req, res, and next parameters."
    ],
    [
      "API Architecture",
      "The organization of routes, controllers, services, models, and middleware."
    ],
    [
      "Request Boundary",
      "The point where untrusted client input is checked before business logic."
    ],
    [
      "Separation of Concerns",
      "Dividing different responsibilities into focused modules."
    ]
  ],

  /* =========================================================
     INTERVIEW
     ========================================================= */

  interview: [

    {
      question: "What is Express middleware?",
      answer:
        "Middleware is a function that executes during the Express request-response lifecycle and can inspect data, modify the request or response, send a response, or pass control using next()."
    },

    {
      question: "What is the purpose of next()?",
      answer:
        "next() passes control from the current middleware to the next middleware or route handler."
    },

    {
      question: "What is the difference between authentication and authorization?",
      answer:
        "Authentication verifies who the user is, while authorization determines what that authenticated user is allowed to do."
    },

    {
      question: "Why is request validation important?",
      answer:
        "Client input is untrusted. Validation prevents invalid data from entering business logic or database operations."
    },

    {
      question: "What is express.Router()?",
      answer:
        "express.Router() creates a modular routing object that allows related routes and middleware to be organized separately."
    },

    {
      question: "Why separate routes and controllers?",
      answer:
        "Routes should focus on endpoint definitions while controllers handle request and response logic. This improves readability and maintainability."
    },

    {
      question: "What is a service layer?",
      answer:
        "A service layer contains reusable business logic and separates application rules from HTTP-specific controller code."
    },

    {
      question: "Why is middleware order important?",
      answer:
        "Express processes middleware in registration order, so parsing, authentication, validation, 404 handling, and error handling must be placed appropriately."
    },

    {
      question: "How do you pass an error to Express error middleware?",
      answer:
        "Call next(error) from a route or middleware."
    },

    {
      question: "What makes Express error middleware special?",
      answer:
        "Express error-handling middleware uses four parameters: err, req, res, and next."
    },

    {
      question: "Why should API errors have a consistent structure?",
      answer:
        "A predictable error format makes frontend handling, debugging, testing, and API documentation easier."
    },

    {
      question: "Where should validation normally happen?",
      answer:
        "Validation should happen before business logic and database operations so invalid client input is rejected early."
    }
  ],

  /* =========================================================
     PRACTICE
     ========================================================= */

  practice: [

    {
      title: "Logging Middleware",

      task:
        "Create middleware that prints the HTTP method and URL of every incoming request.",

      hint:
        "Use req.method, req.originalUrl, and next().",

      answer:
        'const logger = (req, res, next) => {\n  console.log(req.method, req.originalUrl);\n  next();\n};\n\napp.use(logger);'
    },

    {
      title: "Authentication Middleware",

      task:
        "Create middleware that returns 401 when the Authorization header is missing.",

      hint:
        "Read req.headers.authorization.",

      answer:
        'const authenticate = (req, res, next) => {\n  if (!req.headers.authorization) {\n    return res.status(401).json({\n      error: "Authentication required"\n    });\n  }\n\n  next();\n};'
    },

    {
      title: "Product Validation",

      task:
        "Validate that a product request contains a name and a positive numeric price.",

      hint:
        "Read name and price from req.body.",

      answer:
        'const validateProduct = (req, res, next) => {\n  const { name, price } = req.body;\n\n  if (!name) {\n    return res.status(400).json({\n      error: "Name is required"\n    });\n  }\n\n  if (typeof price !== "number" || price <= 0) {\n    return res.status(400).json({\n      error: "Price must be greater than zero"\n    });\n  }\n\n  next();\n};'
    },

    {
      title: "Router Module",

      task:
        "Create an Express Router containing GET / and GET /:id routes.",

      hint:
        "Use express.Router().",

      answer:
        'const express = require("express");\nconst router = express.Router();\n\nrouter.get("/", (req, res) => {\n  res.json({ message: "All products" });\n});\n\nrouter.get("/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});\n\nmodule.exports = router;'
    },

    {
      title: "Admin Authorization",

      task:
        "Create middleware that allows only users whose role is admin.",

      hint:
        "Check req.user.role and return 403 when it is not admin.",

      answer:
        'const requireAdmin = (req, res, next) => {\n  if (!req.user || req.user.role !== "admin") {\n    return res.status(403).json({\n      error: "Access forbidden"\n    });\n  }\n\n  next();\n};'
    },

    {
      title: "Central Error Handler",

      task:
        "Create Express error middleware that logs the error and returns a 500 JSON response.",

      hint:
        "Remember the four parameters.",

      answer:
        'app.use((err, req, res, next) => {\n  console.error(err);\n\n  res.status(500).json({\n    error: "Internal server error"\n  });\n});'
    }
  ],

  /* =========================================================
     QUIZ
     ========================================================= */

  quiz: [

    {
      question: "Which method registers application-level middleware?",
      options: [
        "app.use()",
        "app.middleware()",
        "app.routeMiddleware()",
        "app.add()"
      ],
      answer: 0,
      explanation:
        "app.use() is commonly used to register Express application-level middleware."
    },

    {
      question: "What does next() normally do?",
      options: [
        "Stops the server",
        "Passes control forward",
        "Deletes the request",
        "Restarts Express"
      ],
      answer: 1,
      explanation:
        "next() passes control to the next middleware or handler."
    },

    {
      question: "Authentication answers which question?",
      options: [
        "What can the user do?",
        "Who is the user?",
        "Where is the database?",
        "Which route is fastest?"
      ],
      answer: 1,
      explanation:
        "Authentication verifies the identity of a requester."
    },

    {
      question: "Authorization answers which question?",
      options: [
        "Who are you?",
        "What are you allowed to do?",
        "What is your password?",
        "Which browser are you using?"
      ],
      answer: 1,
      explanation:
        "Authorization checks permissions after identity has been established."
    },

    {
      question: "Which object contains JSON request data after express.json()?",
      options: [
        "req.params",
        "req.query",
        "req.body",
        "req.json"
      ],
      answer: 2,
      explanation:
        "express.json() parses JSON data and makes it available through req.body."
    },

    {
      question: "What should invalid client data commonly produce?",
      options: [
        "400",
        "301",
        "204",
        "304"
      ],
      answer: 0,
      explanation:
        "HTTP 400 is commonly used when the client sends an invalid request."
    },

    {
      question: "What does express.Router() create?",
      options: [
        "Database",
        "Modular router",
        "HTTP client",
        "JSON parser"
      ],
      answer: 1,
      explanation:
        "express.Router() creates a modular routing object."
    },

    {
      question: "Which layer usually contains business logic?",
      options: [
        "HTML",
        "Service",
        "Browser",
        "CSS"
      ],
      answer: 1,
      explanation:
        "The service layer commonly contains reusable business logic."
    },

    {
      question: "How is an error passed to Express error middleware?",
      options: [
        "next(error)",
        "error.next()",
        "sendError()",
        "throwNext()"
      ],
      answer: 0,
      explanation:
        "Calling next(error) passes the error to Express error-handling middleware."
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
      question: "Why does middleware order matter?",
      options: [
        "Express uses registration order",
        "Express sorts middleware alphabetically",
        "Middleware runs randomly",
        "Routes always run first"
      ],
      answer: 0,
      explanation:
        "Express processes middleware and routes according to their registration order."
    },

    {
      question: "Which middleware should normally appear near the end of the application?",
      options: [
        "express.json()",
        "404 handler",
        "Logger",
        "Authentication"
      ],
      answer: 1,
      explanation:
        "A catch-all 404 handler should normally appear after valid routes."
    }
  ],

  /* =========================================================
     GLOSSARY
     ========================================================= */

  glossary: [

    {
      term: "Middleware",
      definition:
        "A function that runs during the Express request-response lifecycle."
    },

    {
      term: "Application Middleware",
      definition:
        "Middleware registered directly on the Express application."
    },

    {
      term: "Router Middleware",
      definition:
        "Middleware registered on an Express Router."
    },

    {
      term: "Authentication",
      definition:
        "The process of verifying the identity of a requester."
    },

    {
      term: "Authorization",
      definition:
        "The process of checking whether an authenticated user has permission."
    },

    {
      term: "Validation",
      definition:
        "The process of checking whether incoming data meets expected rules."
    },

    {
      term: "Router",
      definition:
        "A modular Express object used to group related routes."
    },

    {
      term: "Controller",
      definition:
        "A module or function responsible for handling HTTP request and response logic."
    },

    {
      term: "Service Layer",
      definition:
        "A layer containing reusable business logic."
    },

    {
      term: "next()",
      definition:
        "Passes control to the next middleware or handler."
    },

    {
      term: "next(error)",
      definition:
        "Passes an error to Express error-handling middleware."
    },

    {
      term: "Error Middleware",
      definition:
        "Special Express middleware that handles application errors."
    },

    {
      term: "Separation of Concerns",
      definition:
        "The practice of dividing different responsibilities into focused components."
    },

    {
      term: "API Architecture",
      definition:
        "The organization of routes, middleware, controllers, services, models, and configuration."
    }
  ],

  /* =========================================================
     COMPLETION
     ========================================================= */

  completion: {

    title: "Level 21 Complete — Express Middleware, Validation & API Architecture",

    message:
      "You have moved beyond basic Express routes and learned how professional APIs are organized. You can now build middleware pipelines, validate requests, protect routes, separate controllers from services, handle errors centrally, and organize larger Express applications.",

    achievements: [
      "Express middleware",
      "Application-level middleware",
      "Router-level middleware",
      "Request logging",
      "Authentication concepts",
      "Authorization concepts",
      "Request validation",
      "Structured validation errors",
      "Express Router",
      "Controller architecture",
      "Service layer",
      "Async route handling",
      "Centralized error handling",
      "API response architecture",
      "Middleware ordering",
      "Professional Express structure"
    ],

    nextLevel:
      "Level 22 — Express Authentication, Security & Production APIs"
  }
};
