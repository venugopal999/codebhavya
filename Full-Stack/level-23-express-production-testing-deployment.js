"use strict";

/* =========================================================
CODEBHAVYA FULL STACK / MERN
LEVEL 23 — EXPRESS PRODUCTION APIs, TESTING & DEPLOYMENT
========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[23] = {
  n: 23,

  kicker: "PART 4 • NODE & EXPRESS • LEVEL 23",

  title: "Express Production APIs, Testing & Deployment",

  summary:
    "Turn an Express application into a production-ready backend by learning professional project structure, environment configuration, centralized errors, validation, logging, health checks, graceful shutdown, automated API testing, documentation, deployment preparation, monitoring and production practices.",

  duration: "4–5 Hours",

  difficulty: "Advanced Beginner",

  concepts: 16,

  outcomes: [
    "Understand what makes an Express API production-ready.",
    "Organize a Node and Express project using maintainable layers.",
    "Separate configuration for development, testing and production.",
    "Create consistent API validation and error responses.",
    "Implement application and request logging.",
    "Build health-check and readiness endpoints.",
    "Understand graceful server shutdown.",
    "Write automated tests for Express APIs.",
    "Understand unit, integration and end-to-end API testing.",
    "Prepare an Express application for deployment.",
    "Understand process management and horizontal scaling.",
    "Create useful API documentation.",
    "Understand monitoring, observability and production alerts.",
    "Apply a complete Express production checklist."
  ],

  sections: [

    /* =====================================================
       SECTION 1
    ===================================================== */

    {
      number: 1,
      title: "Production API Mindset",

      intro:
        "An API that works on a developer laptop is not automatically ready for real users. Production engineering adds reliability, security, observability, testing and operational discipline.",

      points: [
        "Development focuses on building features quickly.",
        "Production focuses on reliability as well as features.",
        "Errors must be predictable and safe.",
        "Configuration must not be hard-coded.",
        "Logs must help developers diagnose failures.",
        "Health checks help infrastructure understand service state.",
        "Automated tests reduce regression risk.",
        "Graceful shutdown prevents incomplete requests and corrupted work.",
        "Monitoring helps detect problems after deployment."
      ],

      comparison: {
        title: "Development vs Production",
        headers: ["Development", "Production"],
        rows: [
          ["Console debugging", "Structured logging"],
          ["Hard-coded configuration", "Environment variables"],
          ["Manual testing", "Automated testing"],
          ["Basic errors", "Centralized error handling"],
          ["Local process", "Managed service/process"],
          ["No monitoring", "Health checks and monitoring"]
        ]
      },

      code:
`const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "codebhavya-api"
  });
});

app.listen(3000, () => {
  console.log("API started");
});`,

      keyIdea:
        "Production readiness means designing the API to remain understandable, observable and reliable when something goes wrong."
    },

    /* =====================================================
       SECTION 2
    ===================================================== */

    {
      number: 2,
      title: "Environment-Based Configuration",

      intro:
        "Applications normally run in different environments such as development, testing and production. Configuration should change without changing application source code.",

      points: [
        "Development may use local databases.",
        "Testing may use a separate test database.",
        "Production uses production services.",
        "Environment variables allow configuration outside source code.",
        "Secrets should never be committed to Git.",
        "A configuration module can centralize environment values.",
        "Defaults can be useful for safe local development."
      ],

      code:
`const PORT = process.env.PORT || 3000;

const NODE_ENV = process.env.NODE_ENV || "development";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL && NODE_ENV === "production") {
  throw new Error("DATABASE_URL is required in production");
}

module.exports = {
  PORT,
  NODE_ENV,
  DATABASE_URL
};`,

      keyIdea:
        "The same application code should be able to run in different environments through configuration rather than source-code changes."
    },

    /* =====================================================
       SECTION 3
    ===================================================== */

    {
      number: 3,
      title: "Professional Project Structure",

      intro:
        "As an Express application grows, placing everything inside one file becomes difficult to maintain. A layered structure separates responsibilities.",

      points: [
        "Routes define API endpoints.",
        "Controllers coordinate HTTP requests and responses.",
        "Services contain business logic.",
        "Models represent database structures.",
        "Middleware handles reusable request processing.",
        "Configuration contains environment-related settings.",
        "Utilities contain reusable helper functions.",
        "Tests should be organized separately."
      ],

      code:
`project/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   ├── routes/
│   │   └── user.routes.js
│   │
│   ├── controllers/
│   │   └── user.controller.js
│   │
│   ├── services/
│   │   └── user.service.js
│   │
│   ├── middleware/
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   └── user.model.js
│   │
│   └── utils/
│       └── logger.js
│
├── tests/
│   └── user.test.js
│
├── package.json
└── .env`,

      keyIdea:
        "Separate responsibilities so that each part of the application has a clear purpose."
    },

    /* =====================================================
       SECTION 4
    ===================================================== */

    {
      number: 4,
      title: "Centralized API Error Handling",

      intro:
        "Errors should be handled consistently instead of writing different response formats throughout the application.",

      points: [
        "Express error middleware normally receives four parameters.",
        "Error handling should be centralized.",
        "Clients should receive predictable error structures.",
        "Internal stack traces should not be exposed in production.",
        "Expected application errors can have explicit status codes.",
        "Unexpected errors should be logged for investigation."
      ],

      code:
`function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode === 500
          ? "Internal server error"
          : err.message
    }
  });
}

app.use(errorHandler);`,

      keyIdea:
        "Centralized error handling gives every API endpoint a predictable failure format."
    },

    /* =====================================================
       SECTION 5
    ===================================================== */

    {
      number: 5,
      title: "Request Validation & Consistent Responses",

      intro:
        "Validation prevents malformed data from reaching business logic or the database.",

      points: [
        "Validate required fields.",
        "Validate data types.",
        "Validate string lengths.",
        "Validate allowed values.",
        "Validate IDs and identifiers.",
        "Reject invalid requests with HTTP 400.",
        "Use consistent success and error response formats."
      ],

      code:
`function validateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Name and email are required"
      }
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid email"
      }
    });
  }

  next();
}

app.post("/users", validateUser, (req, res) => {
  res.status(201).json({
    success: true,
    data: req.body
  });
});`,

      keyIdea:
        "Validate data at the API boundary before it enters application logic."
    },

    /* =====================================================
       SECTION 6
    ===================================================== */

    {
      number: 6,
      title: "Logging and Debugging",

      intro:
        "Production applications need useful logs. A developer should be able to understand what happened without reproducing every issue locally.",

      points: [
        "Log important application events.",
        "Log request method and path.",
        "Log response status where appropriate.",
        "Log important errors.",
        "Avoid logging passwords and secrets.",
        "Use structured logging for larger systems.",
        "Production logging should support searching and filtering."
      ],

      code:
`function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: duration + "ms"
    });
  });

  next();
}

app.use(requestLogger);`,

      keyIdea:
        "Good logs answer three questions: what happened, where did it happen, and when did it happen?"
    },

    /* =====================================================
       SECTION 7
    ===================================================== */

    {
      number: 7,
      title: "Health Checks and Readiness",

      intro:
        "A health endpoint allows infrastructure or monitoring systems to determine whether a service is responding.",

      points: [
        "A liveness check asks whether the process is running.",
        "A readiness check asks whether the service can handle traffic.",
        "Health endpoints should be lightweight.",
        "Database connectivity may be checked for readiness.",
        "Health responses should be machine-readable."
      ],

      code:
`app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.get("/ready", async (req, res) => {
  const databaseReady = true;

  if (!databaseReady) {
    return res.status(503).json({
      status: "not-ready"
    });
  }

  res.json({
    status: "ready"
  });
});`,

      keyIdea:
        "Liveness answers 'Is the process alive?' while readiness answers 'Can this service accept traffic safely?'"
    },

    /* =====================================================
       SECTION 8
    ===================================================== */

    {
      number: 8,
      title: "Graceful Shutdown",

      intro:
        "When a server is stopped or restarted, it should finish important in-progress work instead of abruptly terminating.",

      points: [
        "Servers receive operating-system signals during shutdown.",
        "The application should stop accepting new requests.",
        "Existing connections should be allowed to finish when possible.",
        "Database connections should be closed.",
        "Resources should be cleaned up.",
        "The process should eventually exit."
      ],

      code:
`const server = app.listen(3000, () => {
  console.log("Server running");
});

async function shutdown(signal) {
  console.log(signal + " received");

  server.close(() => {
    console.log("HTTP server closed");

    // Close database connections here.

    process.exit(0);
  });
}

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});`,

      keyIdea:
        "Graceful shutdown allows an application to stop safely instead of cutting off active work."
    },

    /* =====================================================
       SECTION 9
    ===================================================== */

    {
      number: 9,
      title: "API Testing Fundamentals",

      intro:
        "Automated tests verify that an API continues to behave as expected after changes.",

      points: [
        "Unit tests test small pieces of logic.",
        "Integration tests test multiple components together.",
        "API tests send HTTP requests and inspect responses.",
        "Tests should check both success and failure cases.",
        "Important business rules should have automated coverage.",
        "Tests should be repeatable."
      ],

      comparison: {
        title: "Testing Levels",
        headers: ["Type", "Focus"],
        rows: [
          ["Unit", "Individual function or module"],
          ["Integration", "Multiple application components"],
          ["API", "HTTP endpoint behavior"],
          ["End-to-End", "Complete user workflow"]
        ]
      },

      code:
`const test = require("node:test");
const assert = require("node:assert");

test("addition works", () => {
  const result = 2 + 3;

  assert.strictEqual(result, 5);
});`,

      keyIdea:
        "Automated tests turn expected behavior into executable documentation."
    },

    /* =====================================================
       SECTION 10
    ===================================================== */

    {
      number: 10,
      title: "Testing Express Routes",

      intro:
        "Express routes can be tested by starting the application in a test environment and sending HTTP requests to it.",

      points: [
        "Keep application creation separate from server startup.",
        "This makes the app easier to import during tests.",
        "Tests can call endpoints without permanently starting the production server.",
        "Check HTTP status codes.",
        "Check response bodies.",
        "Check validation and authentication failures."
      ],

      code:
`// app.js

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

module.exports = app;`,

      keyIdea:
        "Separating app creation from server startup makes Express applications much easier to test."
    },

    /* =====================================================
       SECTION 11
    ===================================================== */

    {
      number: 11,
      title: "Integration Tests and Test Databases",

      intro:
        "Real applications often need tests that involve the database, authentication and several application layers together.",

      points: [
        "Integration tests verify interactions between components.",
        "A test database should be isolated from production data.",
        "Tests should prepare their required data.",
        "Tests should clean up after themselves.",
        "External services may be mocked when appropriate.",
        "Tests should not depend on another developer's local data."
      ],

      code:
`async function createTestUser(database) {
  return database.users.insert({
    name: "Test User",
    email: "test@example.com"
  });
}

async function cleanupTestDatabase(database) {
  await database.users.deleteMany({});
}

async function runTest(database) {
  await cleanupTestDatabase(database);

  const user = await createTestUser(database);

  if (!user) {
    throw new Error("Test user was not created");
  }

  await cleanupTestDatabase(database);
}`,

      keyIdea:
        "Integration tests should use isolated test resources so they never damage real production data."
    },

    /* =====================================================
       SECTION 12
    ===================================================== */

    {
      number: 12,
      title: "API Documentation",

      intro:
        "An API is much easier to use when developers can clearly understand endpoints, parameters, request bodies and responses.",

      points: [
        "Document HTTP methods.",
        "Document endpoint paths.",
        "Document required authentication.",
        "Document request body fields.",
        "Document response structures.",
        "Document common error responses.",
        "Document example requests and responses.",
        "OpenAPI is a common standard for describing APIs."
      ],

      code:
`GET /api/users

Response:

{
  "success": true,
  "data": [
    {
      "id": "101",
      "name": "Bhavya"
    }
  ]
}`,

      keyIdea:
        "Good API documentation reduces the time required for another developer to understand and integrate with your backend."
    },

    /* =====================================================
       SECTION 13
    ===================================================== */

    {
      number: 13,
      title: "Deployment Preparation",

      intro:
        "Deployment means moving the application from development into an environment where users or other systems can access it.",

      points: [
        "Set production environment variables.",
        "Never deploy development secrets.",
        "Install production dependencies correctly.",
        "Use the platform-provided port when required.",
        "Configure the production database.",
        "Run automated tests before deployment.",
        "Verify health endpoints.",
        "Use HTTPS through the deployment infrastructure.",
        "Review CORS configuration.",
        "Review authentication and authorization."
      ],

      code:
`const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development"
  });
});

app.listen(port, () => {
  console.log("Production-ready API listening on " + port);
});`,

      keyIdea:
        "Deployment is not just uploading code; configuration, security, testing and operational readiness must also be considered."
    },

    /* =====================================================
       SECTION 14
    ===================================================== */

    {
      number: 14,
      title: "Process Management and Scaling",

      intro:
        "A production backend may need to run continuously, restart after failures and handle more traffic.",

      points: [
        "A Node process can terminate because of an error or infrastructure event.",
        "Production environments commonly provide process supervision.",
        "Multiple application instances can increase capacity.",
        "A load balancer can distribute requests.",
        "Stateless APIs are easier to scale horizontally.",
        "Shared session state requires an appropriate external store when multiple instances are used."
      ],

      code:
`const express = require("express");

const app = express();

app.get("/api/status", (req, res) => {
  res.json({
    instance: process.pid,
    status: "running"
  });
});

app.listen(process.env.PORT || 3000);`,

      keyIdea:
        "Horizontal scaling means running multiple application instances and distributing traffic between them."
    },

    /* =====================================================
       SECTION 15
    ===================================================== */

    {
      number: 15,
      title: "Monitoring and Observability",

      intro:
        "Monitoring tells you whether the application is healthy. Observability helps you understand why a problem occurred.",

      points: [
        "Track request errors.",
        "Track response latency.",
        "Track service availability.",
        "Monitor CPU and memory where appropriate.",
        "Monitor database failures.",
        "Use logs for event details.",
        "Use metrics for numerical trends.",
        "Use traces when following requests across multiple services.",
        "Create alerts for important failures."
      ],

      comparison: {
        title: "Observability Signals",
        headers: ["Signal", "Question"],
        rows: [
          ["Logs", "What happened?"],
          ["Metrics", "How often or how much?"],
          ["Traces", "Where did the request spend time?"],
          ["Health checks", "Is the service available?"]
        ]
      },

      code:
`function recordRequestMetric(req, res, duration) {
  return {
    method: req.method,
    path: req.originalUrl,
    status: res.statusCode,
    durationMs: duration
  };
}

const metric = recordRequestMetric(
  { method: "GET", originalUrl: "/api/users" },
  { statusCode: 200 },
  42
);

console.log(metric);`,

      keyIdea:
        "Monitoring tells you that something is wrong; observability provides information that helps explain why."
    },

    /* =====================================================
       SECTION 16
    ===================================================== */

    {
      number: 16,
      title: "Complete Express Production Checklist",

      intro:
        "Before considering an Express backend production-ready, review the application systematically.",

      points: [
        "Project structure is maintainable.",
        "Environment variables are configured.",
        "Secrets are outside source control.",
        "Input validation is implemented.",
        "Authentication is protected.",
        "Authorization rules are enforced.",
        "CORS is configured intentionally.",
        "Security headers are enabled where appropriate.",
        "Rate limiting is considered for sensitive endpoints.",
        "Errors are handled centrally.",
        "Logs are useful and do not expose secrets.",
        "Health endpoints are available.",
        "Graceful shutdown is implemented.",
        "Automated tests are available.",
        "API documentation exists.",
        "Production configuration is reviewed.",
        "Database connections are managed correctly.",
        "Monitoring and alerts are considered.",
        "Deployment process is repeatable."
      ],

      code:
`const productionChecklist = {
  configuration: true,
  validation: true,
  authentication: true,
  authorization: true,
  security: true,
  errorHandling: true,
  logging: true,
  healthChecks: true,
  gracefulShutdown: true,
  testing: true,
  documentation: true,
  monitoring: true
};

const ready = Object.values(productionChecklist)
  .every(Boolean);

console.log(
  ready
    ? "Production checklist passed"
    : "Production checklist needs attention"
);`,

      keyIdea:
        "Production readiness is a collection of engineering practices rather than one single feature."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
  ========================================================= */

  visualizer: {
    title: "Production Express API Pipeline",

    description:
      "Visualize how a production HTTP request moves through configuration, middleware, routing, validation, business logic, database access, error handling, logging and the final response.",

    steps: [
      {
        label: "Client Request",
        detail: "A browser, mobile application or another service sends an HTTP request."
      },
      {
        label: "Server",
        detail: "The Express server receives the request."
      },
      {
        label: "Middleware",
        detail: "Authentication, validation, logging and other middleware process the request."
      },
      {
        label: "Router",
        detail: "Express selects the route matching the HTTP method and path."
      },
      {
        label: "Controller",
        detail: "The controller coordinates the HTTP-level operation."
      },
      {
        label: "Service",
        detail: "Business rules are executed inside the service layer."
      },
      {
        label: "Database",
        detail: "Required data is read or changed."
      },
      {
        label: "Error Handler",
        detail: "Expected or unexpected errors are converted into safe API responses."
      },
      {
        label: "Logger",
        detail: "Important request and error information is recorded."
      },
      {
        label: "Response",
        detail: "The client receives the final HTTP response."
      }
    ]
  },

  /* =========================================================
     TRACE
  ========================================================= */

  trace: {
    title: "Trace an API Test from Request to Assertion",

    description:
      "Follow an automated API test from the test case through the Express application and finally to the assertion.",

    steps: [
      {
        line: 1,
        code: 'test("GET /api/users returns users", async () => {',
        explanation: "The test starts by defining the expected API behavior."
      },
      {
        line: 2,
        code: 'const response = await request.get("/api/users");',
        explanation: "The test sends a GET request to the users endpoint."
      },
      {
        line: 3,
        code: "router.get('/api/users', controller);",
        explanation: "Express matches the request with the appropriate route."
      },
      {
        line: 4,
        code: "const users = await userService.getUsers();",
        explanation: "The controller asks the service layer for user data."
      },
      {
        line: 5,
        code: "return users;",
        explanation: "The service returns the requested data."
      },
      {
        line: 6,
        code: "res.status(200).json({ success: true, data: users });",
        explanation: "The controller sends the API response."
      },
      {
        line: 7,
        code: "assert.strictEqual(response.status, 200);",
        explanation: "The test checks whether the HTTP status is correct."
      },
      {
        line: 8,
        code: "assert.strictEqual(response.body.success, true);",
        explanation: "The test checks whether the response has the expected structure."
      },
      {
        line: 9,
        code: "});",
        explanation: "The test finishes successfully if all assertions pass."
      }
    ]
  },

  /* =========================================================
     REVISION
  ========================================================= */

  revision: [
    [
      "Production API",
      "An API designed for reliability, security, testing and operational use."
    ],
    [
      "Environment Variable",
      "Configuration supplied outside application source code."
    ],
    [
      "Project Structure",
      "Organization of files according to their responsibilities."
    ],
    [
      "Controller",
      "Coordinates HTTP requests and responses."
    ],
    [
      "Service",
      "Contains reusable business logic."
    ],
    [
      "Centralized Error Handler",
      "Middleware responsible for consistent API error responses."
    ],
    [
      "Validation",
      "Checking whether incoming data satisfies application requirements."
    ],
    [
      "Health Check",
      "Endpoint used to determine whether a service is operating."
    ],
    [
      "Readiness",
      "Whether a service is prepared to receive traffic."
    ],
    [
      "Graceful Shutdown",
      "Controlled termination that allows cleanup and active work to finish."
    ],
    [
      "Unit Test",
      "Test of a small isolated piece of application logic."
    ],
    [
      "Integration Test",
      "Test of multiple components working together."
    ],
    [
      "API Test",
      "Automated test that verifies HTTP endpoint behavior."
    ],
    [
      "Documentation",
      "Information explaining how an API should be used."
    ],
    [
      "Monitoring",
      "Observing system health and operational behavior."
    ],
    [
      "Observability",
      "Ability to understand internal system behavior using outputs such as logs, metrics and traces."
    ]
  ],

  /* =========================================================
     INTERVIEW
  ========================================================= */

  interview: [
    {
      question: "Why should configuration be stored in environment variables?",

      answer:
        "Environment variables allow the same source code to run with different configuration in development, testing and production. They also help keep secrets outside the source code."
    },

    {
      question: "Why separate app.js and server.js?",

      answer:
        "app.js can create and configure the Express application while server.js starts the HTTP server. This separation makes automated testing easier."
    },

    {
      question: "What is centralized error handling?",

      answer:
        "It is the practice of handling application errors in one dedicated middleware instead of implementing different error-response logic throughout the application."
    },

    {
      question: "What is graceful shutdown?",

      answer:
        "Graceful shutdown is the controlled process of stopping a server, allowing important active work to finish and closing resources such as database connections."
    },

    {
      question: "What is the difference between liveness and readiness?",

      answer:
        "Liveness indicates whether the process is running. Readiness indicates whether the service is prepared to handle traffic."
    },

    {
      question: "What is the difference between unit and integration testing?",

      answer:
        "Unit testing focuses on isolated logic, while integration testing checks how multiple application components work together."
    },

    {
      question: "Why should an API have consistent response formats?",

      answer:
        "Consistent responses make client-side development easier because consumers know how to interpret success and failure responses."
    },

    {
      question: "Why should production logs avoid sensitive information?",

      answer:
        "Logs can be stored, copied or viewed by operators. Passwords, tokens and other secrets should therefore never be unnecessarily exposed through logs."
    },

    {
      question: "What is horizontal scaling?",

      answer:
        "Horizontal scaling means running multiple instances of an application and distributing incoming traffic among them."
    },

    {
      question: "What are logs, metrics and traces?",

      answer:
        "Logs record events, metrics provide numerical measurements and traces show the path and timing of a request across application components."
    },

    {
      question: "Why are health-check endpoints useful?",

      answer:
        "They provide a simple way for infrastructure and monitoring systems to determine whether a service is alive and ready."
    },

    {
      question: "What makes an Express application production-ready?",

      answer:
        "Production readiness involves configuration management, validation, security, error handling, logging, testing, health checks, graceful shutdown, deployment preparation and monitoring."
    }
  ],

  /* =========================================================
     PRACTICE
  ========================================================= */

  practice: [
    {
      title: "Build a Health Endpoint",

      task:
        "Create a GET /health endpoint that returns a JSON object containing status: ok.",

      hint:
        "Use app.get() and res.json().",

      answer:
`app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});`
    },

    {
      title: "Create Error Middleware",

      task:
        "Create Express error middleware that returns HTTP 500 and a safe error message.",

      hint:
        "Remember that Express error middleware has four parameters.",

      answer:
`function errorHandler(err, req, res, next) {
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error"
    }
  });
}

app.use(errorHandler);`
    },

    {
      title: "Validate a Product",

      task:
        "Reject a POST /products request when the product name is missing.",

      hint:
        "Check req.body before calling next().",

      answer:
`function validateProduct(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Product name is required"
      }
    });
  }

  next();
}`
    },

    {
      title: "Add Request Logging",

      task:
        "Create middleware that logs the HTTP method and requested path.",

      hint:
        "Use req.method and req.originalUrl.",

      answer:
`function logger(req, res, next) {
  console.log(req.method, req.originalUrl);
  next();
}

app.use(logger);`
    },

    {
      title: "Environment Configuration",

      task:
        "Read the application port from process.env.PORT and use 3000 as a fallback.",

      hint:
        "Use the || operator.",

      answer:
`const port = process.env.PORT || 3000;

app.listen(port);`
    },

    {
      title: "Write an Assertion",

      task:
        "Write a Node test assertion verifying that 10 + 5 equals 15.",

      hint:
        "Use node:assert.",

      answer:
`const assert = require("node:assert");

assert.strictEqual(10 + 5, 15);`
    }
  ],

  /* =========================================================
     QUIZ
  ========================================================= */

  quiz: [

    {
      question:
        "Which mechanism is commonly used to store environment-specific configuration?",

      options: [
        "HTML comments",
        "Environment variables",
        "CSS variables",
        "URL fragments"
      ],

      answer: 1,

      explanation:
        "Environment variables allow configuration to change without modifying application source code."
    },

    {
      question:
        "Which Express middleware signature identifies error-handling middleware?",

      options: [
        "(req, res)",
        "(req, next)",
        "(err, req, res, next)",
        "(error)"
      ],

      answer: 2,

      explanation:
        "Express error middleware receives err, req, res and next."
    },

    {
      question:
        "What does a health endpoint usually provide?",

      options: [
        "A CSS stylesheet",
        "Service health information",
        "A database password",
        "A JavaScript bundle"
      ],

      answer: 1,

      explanation:
        "Health endpoints provide machine-readable information about service availability."
    },

    {
      question:
        "What is graceful shutdown?",

      options: [
        "Deleting the application",
        "Stopping without cleanup",
        "Controlled server termination",
        "Changing the API URL"
      ],

      answer: 2,

      explanation:
        "Graceful shutdown allows the application to clean up resources and handle active work appropriately."
    },

    {
      question:
        "Which test focuses on an isolated function?",

      options: [
        "Unit test",
        "Integration test",
        "Deployment test",
        "Load balancer test"
      ],

      answer: 0,

      explanation:
        "Unit tests focus on small isolated pieces of application logic."
    },

    {
      question:
        "What does horizontal scaling mean?",

      options: [
        "Making code shorter",
        "Running multiple application instances",
        "Increasing font size",
        "Adding more database columns"
      ],

      answer: 1,

      explanation:
        "Horizontal scaling increases capacity by running multiple instances."
    },

    {
      question:
        "Which signal records discrete application events?",

      options: [
        "Logs",
        "CSS",
        "HTML",
        "DNS"
      ],

      answer: 0,

      explanation:
        "Logs record application and operational events."
    },

    {
      question:
        "Why should app creation be separated from server startup?",

      options: [
        "To make CSS faster",
        "To make testing easier",
        "To remove HTTP",
        "To avoid JavaScript"
      ],

      answer: 1,

      explanation:
        "Tests can import the configured Express application without automatically starting a production server."
    },

    {
      question:
        "What is readiness?",

      options: [
        "Whether a service can safely accept traffic",
        "Whether CSS loaded",
        "Whether a password is long",
        "Whether JavaScript is minified"
      ],

      answer: 0,

      explanation:
        "Readiness indicates whether a service is prepared to handle requests."
    },

    {
      question:
        "Which three signals are commonly associated with observability?",

      options: [
        "HTML, CSS, DNS",
        "Logs, metrics, traces",
        "Git, npm, HTML",
        "Cookies, forms, CSS"
      ],

      answer: 1,

      explanation:
        "Logs, metrics and traces provide complementary views into system behavior."
    }
  ],

  /* =========================================================
     GLOSSARY
  ========================================================= */

  glossary: [
    {
      term: "Production",
      definition:
        "An environment where software is operated for real users or real workloads."
    },

    {
      term: "Environment Variable",
      definition:
        "External configuration value available to an application through the environment."
    },

    {
      term: "Controller",
      definition:
        "Application component responsible for coordinating HTTP request and response behavior."
    },

    {
      term: "Service Layer",
      definition:
        "Layer that contains reusable business logic."
    },

    {
      term: "Middleware",
      definition:
        "Function that processes a request before it reaches the final route handler."
    },

    {
      term: "Validation",
      definition:
        "Process of checking whether input satisfies expected rules."
    },

    {
      term: "Health Check",
      definition:
        "Endpoint or mechanism used to determine whether a service is functioning."
    },

    {
      term: "Readiness",
      definition:
        "State indicating whether an application is prepared to receive traffic."
    },

    {
      term: "Graceful Shutdown",
      definition:
        "Controlled termination of an application with resource cleanup."
    },

    {
      term: "Unit Test",
      definition:
        "Automated test for a small isolated piece of logic."
    },

    {
      term: "Integration Test",
      definition:
        "Test that verifies multiple components work correctly together."
    },

    {
      term: "API Test",
      definition:
        "Automated verification of HTTP endpoint behavior."
    },

    {
      term: "Deployment",
      definition:
        "Process of making software available in a target runtime environment."
    },

    {
      term: "Scaling",
      definition:
        "Increasing system capacity to handle additional workload."
    },

    {
      term: "Monitoring",
      definition:
        "Continuous observation of system health and performance."
    },

    {
      term: "Observability",
      definition:
        "Ability to understand system behavior using outputs such as logs, metrics and traces."
    },

    {
      term: "Liveness",
      definition:
        "Indication that an application process is running."
    },

    {
      term: "API Documentation",
      definition:
        "Technical information explaining how to consume an API."
    }
  ],

  /* =========================================================
     COMPLETION
  ========================================================= */

  completion: {
    title: "Node & Express Complete!",

    message:
      "You have completed the Node & Express section of the CodeBhavya Full Stack / MERN course. You now understand server-side JavaScript, Express APIs, middleware, validation, authentication, security and production backend engineering.",

    achievements: [
      "Node.js Runtime Fundamentals",
      "Express Server Development",
      "REST API Design",
      "Middleware Architecture",
      "Request Validation",
      "Authentication & Authorization",
      "API Security",
      "Production Error Handling",
      "Logging & Health Checks",
      "Graceful Shutdown",
      "Automated API Testing",
      "Deployment Preparation",
      "Monitoring & Observability"
    ],

    nextLevel:
      "Level 24 — MongoDB Fundamentals & NoSQL Data Modeling"
  }
};
