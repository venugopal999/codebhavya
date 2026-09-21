"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[29] = {
  n: 29,
  kicker: "PART 6 • PRODUCTION MERN • LEVEL 29",
  title: "Deployment & Observability",
  summary:
    "Learn how to move a MERN application from development to production and understand hosting, configuration, logs, metrics, health checks, monitoring, backups and recovery.",
  duration: "80–100 min",
  difficulty: "Advanced Beginner",
  concepts: 17,

  outcomes: [
    "Understand the difference between development and production environments.",
    "Understand the architecture of a deployed MERN application.",
    "Prepare frontend and backend applications for deployment.",
    "Configure production environment variables safely.",
    "Understand frontend and backend hosting responsibilities.",
    "Understand production MongoDB configuration.",
    "Use HTTPS and secure transport.",
    "Understand production security configuration.",
    "Implement structured application logging.",
    "Understand metrics and monitoring.",
    "Design health and readiness checks.",
    "Understand error tracking and alerting.",
    "Apply caching, compression and scaling concepts.",
    "Understand backups and disaster recovery.",
    "Design a practical production incident-response process.",
    "Understand CI/CD deployment workflows.",
    "Build a complete MERN deployment and observability checklist."
  ],

  sections: [
    {
      number: 1,
      title: "Production Readiness Mindset",
      intro:
        "Deployment is not simply uploading files. A production application must be configured, secured, monitored and recoverable.",
      points: [
        "Development environments are designed for building and debugging.",
        "Production environments serve real users and require stronger operational discipline.",
        "Production configuration must be explicit.",
        "Failures must be observable.",
        "Sensitive information must be protected.",
        "Backups and recovery procedures must be considered before problems occur."
      ],
      comparison: {
        title: "Development vs Production",
        headers: ["Area", "Development", "Production"],
        rows: [
          ["Frontend", "Local development server", "Optimized deployed build"],
          ["Backend", "Local Node.js process", "Hosted application process"],
          ["Database", "Development database", "Protected production database"],
          ["Configuration", "Local environment", "Managed production configuration"],
          ["Debugging", "Detailed output", "Controlled logging"],
          ["Transport", "May use local HTTP", "HTTPS is expected"]
        ]
      },
      code: `// Production readiness

const productionRequirements = [
  "optimized frontend build",
  "stable backend process",
  "production database",
  "secure environment variables",
  "HTTPS",
  "logging",
  "health checks",
  "monitoring",
  "backups",
  "recovery plan"
];

console.log(
  productionRequirements
);`,
      keyIdea:
        "Production readiness means the application can serve users reliably and the team can detect and recover from problems."
    },

    {
      number: 2,
      title: "Deployment Architecture",
      intro:
        "A deployed MERN application normally consists of several cooperating services rather than one machine doing everything.",
      points: [
        "The frontend serves the React application.",
        "The backend exposes API endpoints.",
        "MongoDB stores persistent data.",
        "DNS connects domain names to deployed services.",
        "HTTPS protects network communication.",
        "Monitoring observes important system behavior."
      ],
      code: `// Simplified production architecture

User Browser
     |
     v
   HTTPS
     |
     v
React Frontend
     |
     | API requests
     v
Express / Node.js
     |
     v
Mongoose
     |
     v
MongoDB

Additional production services:

Logs
Metrics
Health Checks
Alerts
Backups`,
      keyIdea:
        "Deployment is a system of connected services, not just a single upload operation."
    },

    {
      number: 3,
      title: "Preparing the Frontend Build",
      intro:
        "React development code is normally transformed into optimized production assets before deployment.",
      points: [
        "The development server is not normally the production server.",
        "The production build bundles and optimizes application assets.",
        "Environment configuration must be supplied correctly.",
        "Build failures should stop deployment.",
        "The generated assets are then served by a hosting platform or web server."
      ],
      code: `// Typical frontend commands

npm install

npm run build

// The build creates optimized
// production assets.

// A hosting platform can then
// serve those assets to browsers.`,
      keyIdea:
        "A production frontend is normally deployed from an optimized build rather than the development server."
    },

    {
      number: 4,
      title: "Deploying the Backend",
      intro:
        "The Node.js and Express backend must run as a reliable server process in production.",
      points: [
        "Install production dependencies.",
        "Configure the application port.",
        "Provide production environment variables.",
        "Connect to the production database.",
        "Start the Node.js application using the hosting platform's process.",
        "Expose only the required API endpoints."
      ],
      code: `// server.js

import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    "Server running on port " + port
  );
});`,
      keyIdea:
        "A production backend needs predictable startup, configuration and process behavior."
    },

    {
      number: 5,
      title: "Production Environment Configuration",
      intro:
        "Production configuration should be supplied by the deployment environment rather than hard-coded into source files.",
      points: [
        "API URLs can differ between environments.",
        "Database connection strings belong in protected server configuration.",
        "Authentication secrets must remain private.",
        "Production configuration should be validated at startup.",
        "Never commit real production secrets to a public repository."
      ],
      code: `// Example production variables

NODE_ENV=production
PORT=5000
MONGODB_URI=<production-database-url>
JWT_SECRET=<private-secret>
CLIENT_URL=https://www.example.com

// Backend

const environment =
  process.env.NODE_ENV || "development";

console.log(
  "Environment:",
  environment
);`,
      keyIdea:
        "Environment variables separate deployment-specific configuration from application source code."
    },

    {
      number: 6,
      title: "Production MongoDB Configuration",
      intro:
        "The database is one of the most important production components because it contains persistent application data.",
      points: [
        "Use a dedicated production database.",
        "Protect database credentials.",
        "Restrict unnecessary network access.",
        "Use appropriate database users and permissions.",
        "Create backups.",
        "Monitor database health and performance.",
        "Avoid testing destructive operations against production data."
      ],
      code: `// Backend database configuration

import mongoose from "mongoose";

await mongoose.connect(
  process.env.MONGODB_URI
);

console.log(
  "Production database connected"
);

// The URI should come from
// protected server configuration.`,
      keyIdea:
        "Production database configuration must prioritize security, reliability and recoverability."
    },

    {
      number: 7,
      title: "HTTPS and Secure Transport",
      intro:
        "Production applications should protect browser-to-server communication with HTTPS.",
      points: [
        "HTTPS encrypts data in transit.",
        "TLS certificates establish secure connections.",
        "Sensitive credentials should never be transmitted over plain HTTP in production.",
        "Secure cookies require appropriate HTTPS configuration.",
        "HTTP traffic can commonly be redirected to HTTPS."
      ],
      code: `// Conceptual production rule

if (request.isSecure) {
  continueRequest();
} else {
  redirectToHTTPS();
}

// HTTPS protects traffic between
// the browser and the server.

Browser
   ↓
Encrypted HTTPS
   ↓
Backend`,
      keyIdea:
        "HTTPS protects data while it travels between clients and servers."
    },

    {
      number: 8,
      title: "Production Security Configuration",
      intro:
        "Deployment exposes an application to real network traffic, so security configuration must be deliberate.",
      points: [
        "Use secure HTTP headers.",
        "Configure CORS for trusted origins.",
        "Apply rate limiting where appropriate.",
        "Validate incoming data.",
        "Protect authentication credentials.",
        "Use secure cookie settings when cookies are used.",
        "Do not expose internal error details."
      ],
      code: `import helmet from "helmet";
import cors from "cors";

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Validation and authentication
// middleware should also run
// before protected operations.`,
      keyIdea:
        "Production security is a collection of defensive controls rather than a single feature."
    },

    {
      number: 9,
      title: "Structured Logging",
      intro:
        "Logs help developers understand what the application was doing when something happened.",
      points: [
        "Record important application events.",
        "Include timestamps.",
        "Include useful request information.",
        "Use appropriate log levels.",
        "Avoid logging passwords, tokens or sensitive personal information.",
        "Structured logs are easier for monitoring systems to search and analyze."
      ],
      code: `function log(level, message, meta = {}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    })
  );
}

log(
  "info",
  "Student created",
  {
    studentId: "123"
  }
);

log(
  "error",
  "Database request failed",
  {
    operation: "findStudent"
  }
);`,
      keyIdea:
        "Good logs explain what happened without exposing sensitive information."
    },

    {
      number: 10,
      title: "Metrics and Monitoring",
      intro:
        "Logs explain individual events, while metrics help identify patterns in system behavior.",
      points: [
        "Request count shows traffic volume.",
        "Response time shows latency.",
        "Error rate shows application failures.",
        "CPU and memory usage show resource pressure.",
        "Database metrics reveal database health.",
        "Monitoring helps identify problems before users report every issue."
      ],
      code: `// Conceptual application metrics

const metrics = {
  requestsTotal: 15240,
  errorsTotal: 83,
  averageResponseMs: 142,
  activeUsers: 317,
  memoryUsagePercent: 61
};

console.log(metrics);

// Useful questions:
//
// How many requests are failing?
// How long are requests taking?
// Are resources becoming exhausted?`,
      keyIdea:
        "Metrics turn application behavior into measurable signals that can be monitored over time."
    },

    {
      number: 11,
      title: "Health and Readiness Checks",
      intro:
        "A deployment platform and monitoring system need a simple way to determine whether the application is functioning.",
      points: [
        "A liveness check asks whether the process is running.",
        "A readiness check asks whether the application can serve traffic.",
        "Database connectivity may be part of readiness.",
        "Health endpoints should be lightweight.",
        "Health checks help load balancers and deployment systems make decisions."
      ],
      code: `app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api"
  });
});

app.get("/ready", async (req, res) => {
  const databaseReady =
    mongoose.connection.readyState === 1;

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
        "Health checks make system availability visible to infrastructure and monitoring tools."
    },

    {
      number: 12,
      title: "Error Tracking and Alerting",
      intro:
        "Logs alone are not enough. Important failures should be detected, grouped and brought to the attention of the team.",
      points: [
        "Error tracking can group repeated failures.",
        "Alerts should focus on actionable problems.",
        "An alert should provide enough context for investigation.",
        "Not every warning needs an immediate alert.",
        "Alert thresholds should reflect application importance."
      ],
      code: `function handleCriticalError(error) {
  log(
    "error",
    "Critical application error",
    {
      name: error.name,
      message: error.message
    }
  );

  notifyOperationsTeam({
    type: "critical-error",
    message: error.message
  });
}

// The exact monitoring provider
// can vary between projects.`,
      keyIdea:
        "Observability becomes operationally useful when important failures can trigger actionable alerts."
    },

    {
      number: 13,
      title: "Performance, Caching and Scaling",
      intro:
        "A production application may need performance improvements as traffic increases.",
      points: [
        "Measure performance before optimizing.",
        "Compress suitable responses.",
        "Cache data that can safely be reused.",
        "Use database indexes for important queries.",
        "Avoid unnecessary API calls.",
        "Scale application processes when required.",
        "Use load balancing when multiple backend instances serve traffic."
      ],
      code: `// Conceptual caching

const cache = new Map();

async function getStudent(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const student =
    await Student.findById(id);

  cache.set(id, student);

  return student;
}

// Real production caching may use
// a dedicated caching system.`,
      keyIdea:
        "Performance work should be based on measured bottlenecks and appropriate architectural improvements."
    },

    {
      number: 14,
      title: "Backups and Recovery",
      intro:
        "A backup is useful only when the team can actually restore the application data from it.",
      points: [
        "Create regular database backups.",
        "Protect backup access.",
        "Store backups separately from the primary system.",
        "Define how long backups should be retained.",
        "Test restoration periodically.",
        "Document recovery procedures."
      ],
      code: `// Conceptual recovery planning

const recoveryPlan = {
  backupFrequency: "daily",
  retention: "defined by project policy",
  restoreProcedure: "documented",
  restoreTested: true,
  owner: "operations team"
};

console.log(
  "Recovery plan:",
  recoveryPlan
);`,
      keyIdea:
        "Backup strategy is incomplete until restoration has been planned and tested."
    },

    {
      number: 15,
      title: "Incident Response",
      intro:
        "When production fails, a calm and repeatable response process is more useful than improvisation.",
      points: [
        "Detect the incident.",
        "Assess its impact.",
        "Stabilize the system.",
        "Communicate relevant information.",
        "Investigate the root cause.",
        "Recover service.",
        "Document lessons learned.",
        "Improve the system to reduce repeat incidents."
      ],
      code: `// Incident response flow

Detect
  ↓
Assess
  ↓
Stabilize
  ↓
Communicate
  ↓
Investigate
  ↓
Recover
  ↓
Document
  ↓
Improve

// The objective is reliable recovery,
// not assigning blame.`,
      keyIdea:
        "Incident response turns production failures into a controlled engineering process."
    },

    {
      number: 16,
      title: "CI/CD Deployment Workflow",
      intro:
        "Continuous delivery can connect the testing workflow from Level 28 to automated production deployment.",
      points: [
        "A developer pushes code.",
        "CI runs quality checks.",
        "Tests must pass.",
        "The frontend is built.",
        "The backend is prepared.",
        "Deployment can be triggered automatically or manually.",
        "Health checks verify the new deployment.",
        "Monitoring continues after release."
      ],
      code: `// Conceptual CI/CD flow

Git Push
   ↓
Install
   ↓
Lint
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Build
   ↓
Deploy
   ↓
Health Check
   ↓
Monitor
   ↓
Release Complete`,
      keyIdea:
        "Deployment should connect quality checks, release automation and post-deployment verification."
    },

    {
      number: 17,
      title: "Complete Deployment & Observability Checklist",
      intro:
        "Before calling a MERN application production-ready, verify the application, infrastructure and recovery process.",
      points: [
        "Frontend production build succeeds.",
        "Backend starts successfully in production.",
        "Production environment variables are configured.",
        "Production MongoDB is protected.",
        "HTTPS is enabled.",
        "CORS is configured correctly.",
        "Security middleware is active.",
        "Logs are available.",
        "Important metrics are monitored.",
        "Health and readiness endpoints exist.",
        "Critical errors can trigger alerts.",
        "Performance bottlenecks can be identified.",
        "Backups exist and restoration is understood.",
        "Incident-response procedures are documented.",
        "CI/CD quality checks are connected to deployment.",
        "Post-deployment verification is performed."
      ],
      code: `const productionChecklist = {
  frontendBuild: true,
  backendDeployment: true,
  environmentConfig: true,
  databaseSecurity: true,
  https: true,
  cors: true,
  security: true,
  logging: true,
  metrics: true,
  healthChecks: true,
  alerting: true,
  performance: true,
  backups: true,
  recoveryPlan: true,
  cicd: true
};

const productionReady =
  Object.values(productionChecklist)
    .every(Boolean);

console.log(
  productionReady
    ? "Production readiness checks passed"
    : "Production work remains"
);`,
      keyIdea:
        "A production-ready application is deployed, observable, secure, measurable and recoverable."
    }
  ],

  visualizer: {
    title: "MERN Production Deployment Pipeline",
    description:
      "Follow a MERN application from a Git push through build, deployment, database connection, HTTPS and continuous monitoring.",
    type: "flow",
    steps: [
      {
        label: "Git Push",
        detail:
          "A developer pushes a verified application change."
      },
      {
        label: "CI Checks",
        detail:
          "Automated tests, linting and quality checks run."
      },
      {
        label: "Frontend Build",
        detail:
          "The React application is converted into optimized production assets."
      },
      {
        label: "Backend Build",
        detail:
          "The Node.js and Express application is prepared for production."
      },
      {
        label: "Deployment",
        detail:
          "The application is released to the hosting environment."
      },
      {
        label: "Environment Configuration",
        detail:
          "Production configuration and secrets are supplied securely."
      },
      {
        label: "MongoDB",
        detail:
          "The backend connects to the protected production database."
      },
      {
        label: "HTTPS",
        detail:
          "Users communicate with the application through secure transport."
      },
      {
        label: "Health Checks",
        detail:
          "Liveness and readiness endpoints verify service availability."
      },
      {
        label: "Logs",
        detail:
          "Application events are recorded for diagnosis and auditing."
      },
      {
        label: "Metrics",
        detail:
          "Traffic, latency, errors and resource behavior are measured."
      },
      {
        label: "Alerts",
        detail:
          "Important failures generate actionable notifications."
      },
      {
        label: "Monitoring",
        detail:
          "The production system is continuously observed."
      },
      {
        label: "Users",
        detail:
          "Users access the deployed MERN application."
      }
    ]
  },

  trace: {
    title: "Trace a Production API Request",
    description:
      "Follow a real-world API request from DNS and HTTPS through Express, authentication, Mongoose and MongoDB, then back to the user.",
    steps: [
      {
        line: 1,
        operation: "User opens application",
        detail:
          "The browser requests the production frontend."
      },
      {
        line: 2,
        operation: "DNS lookup",
        detail:
          "The domain name is resolved to the appropriate service."
      },
      {
        line: 3,
        operation: "HTTPS connection",
        detail:
          "The browser establishes a secure connection."
      },
      {
        line: 4,
        operation: "React application",
        detail:
          "The frontend sends an API request."
      },
      {
        line: 5,
        operation: "API endpoint",
        detail:
          "The request reaches the deployed backend."
      },
      {
        line: 6,
        operation: "Security middleware",
        detail:
          "Headers, CORS, rate limits and other controls are applied."
      },
      {
        line: 7,
        operation: "Authentication",
        detail:
          "The backend verifies authentication when the endpoint is protected."
      },
      {
        line: 8,
        operation: "Authorization",
        detail:
          "The application verifies whether the user can perform the operation."
      },
      {
        line: 9,
        operation: "Controller",
        detail:
          "The controller coordinates the API request."
      },
      {
        line: 10,
        operation: "Service",
        detail:
          "Application logic is executed."
      },
      {
        line: 11,
        operation: "Mongoose",
        detail:
          "The data layer prepares the database operation."
      },
      {
        line: 12,
        operation: "MongoDB",
        detail:
          "The production database processes the query."
      },
      {
        line: 13,
        operation: "Response",
        detail:
          "The backend creates the API response."
      },
      {
        line: 14,
        operation: "Logging",
        detail:
          "Relevant request and result information is recorded."
      },
      {
        line: 15,
        operation: "Metrics",
        detail:
          "Request count, latency and errors can be measured."
      },
      {
        line: 16,
        operation: "React update",
        detail:
          "The frontend updates its server-state representation."
      },
      {
        line: 17,
        operation: "User sees result",
        detail:
          "The updated application state is rendered."
      }
    ]
  },

  revision: [
    [
      "Production",
      "An environment serving the real application to users."
    ],
    [
      "Deployment",
      "The process of releasing application software to a target environment."
    ],
    [
      "Hosting",
      "Providing infrastructure where an application can run or be served."
    ],
    [
      "HTTPS",
      "HTTP communication protected using TLS encryption."
    ],
    [
      "Environment Variable",
      "Configuration supplied outside application source code."
    ],
    [
      "Secret",
      "Sensitive configuration such as passwords, API keys or authentication secrets."
    ],
    [
      "Logging",
      "Recording application events for debugging, auditing and operations."
    ],
    [
      "Structured Log",
      "A machine-readable log containing organized fields such as timestamp and level."
    ],
    [
      "Metric",
      "A numerical measurement describing system behavior."
    ],
    [
      "Observability",
      "The ability to understand internal system behavior through signals such as logs, metrics and traces."
    ],
    [
      "Health Check",
      "An endpoint or mechanism used to determine whether a service is functioning."
    ],
    [
      "Readiness",
      "Whether a service is prepared to receive production traffic."
    ],
    [
      "Alert",
      "A notification triggered when an important monitored condition requires attention."
    ],
    [
      "Backup",
      "A recoverable copy of important data."
    ],
    [
      "Recovery",
      "The process of restoring service or data after a failure."
    ],
    [
      "CI/CD",
      "Automated practices connecting code validation, delivery and deployment."
    ],
    [
      "Incident",
      "A production event that negatively affects service or expected behavior."
    ]
  ],

  interview: [
    {
      question: "What is deployment?",
      answer:
        "Deployment is the process of releasing an application to an environment where it can run and serve users."
    },
    {
      question: "Why is production different from development?",
      answer:
        "Production serves real users and therefore requires stronger security, reliability, monitoring, configuration and recovery practices."
    },
    {
      question: "Why should frontend and backend configuration be separated from source code?",
      answer:
        "Different environments require different values, and separating configuration avoids hard-coding deployment-specific settings."
    },
    {
      question: "Why should secrets not be committed to Git?",
      answer:
        "Repository contents can be copied or exposed, so sensitive credentials should be stored in protected environment configuration."
    },
    {
      question: "Why is HTTPS important?",
      answer:
        "HTTPS protects communication between clients and servers by encrypting data in transit."
    },
    {
      question: "What is observability?",
      answer:
        "Observability is the ability to understand system behavior using signals such as logs, metrics and traces."
    },
    {
      question: "What is the difference between logs and metrics?",
      answer:
        "Logs record individual events or messages, while metrics provide numerical measurements that reveal system patterns."
    },
    {
      question: "What is a health check?",
      answer:
        "A health check provides a simple way to determine whether a service or dependency is functioning."
    },
    {
      question: "What is the difference between liveness and readiness?",
      answer:
        "Liveness generally indicates that a process is running, while readiness indicates that the service is prepared to receive traffic."
    },
    {
      question: "Why are production backups necessary?",
      answer:
        "Backups provide a recovery path when data is lost, corrupted or otherwise unavailable."
    },
    {
      question: "Why should backups be tested?",
      answer:
        "A backup that cannot be restored successfully may not provide reliable recovery."
    },
    {
      question: "What should a production log avoid?",
      answer:
        "Logs should avoid exposing passwords, authentication tokens and other sensitive information."
    },
    {
      question: "What is CI/CD?",
      answer:
        "CI/CD connects automated code validation with repeatable software delivery and deployment workflows."
    },
    {
      question: "Why should production alerts be actionable?",
      answer:
        "Too many irrelevant alerts create noise and can cause important failures to be ignored."
    },
    {
      question: "What is incident response?",
      answer:
        "Incident response is the structured process of detecting, assessing, stabilizing, recovering and learning from production failures."
    }
  ],

  practice: [
    {
      title: "Production Checklist",
      task:
        "Create a checklist for deploying a MERN application containing frontend, backend, database, HTTPS, environment variables and monitoring.",
      hint:
        "Think beyond uploading the application.",
      answer:
        "Include builds, configuration, database access, HTTPS, security, health checks, logs, metrics, alerts and backups."
    },
    {
      title: "Health Endpoint",
      task:
        "Create an Express /health endpoint that returns a successful JSON response.",
      hint:
        "Keep the endpoint lightweight.",
      answer:
        "Return a 200 response containing a simple status such as { status: 'ok' }."
    },
    {
      title: "Readiness Check",
      task:
        "Design a /ready endpoint that reports whether the backend can access MongoDB.",
      hint:
        "Check the database connection state.",
      answer:
        "Return a success response when required dependencies are ready and a service-unavailable response otherwise."
    },
    {
      title: "Structured Logging",
      task:
        "Create a logging helper that records timestamp, level, message and metadata as JSON.",
      hint:
        "Use JSON.stringify().",
      answer:
        "Create an object containing the common log fields and serialize it before writing to the logging destination."
    },
    {
      title: "Deployment Flow",
      task:
        "Draw the deployment pipeline from Git push through CI, build, deployment, health check and monitoring.",
      hint:
        "Connect Level 28 testing to Level 29 deployment.",
      answer:
        "Git push → CI checks → build → deploy → health check → monitor."
    },
    {
      title: "Incident Plan",
      task:
        "Create a short response plan for an API that suddenly begins returning many 500 errors.",
      hint:
        "Start with detection and stabilization.",
      answer:
        "Detect → assess impact → inspect logs/metrics → stabilize or roll back → recover → investigate → document."
    },
    {
      title: "Backup Strategy",
      task:
        "Design a database backup plan that includes frequency, retention and restoration testing.",
      hint:
        "A backup plan must include recovery.",
      answer:
        "Define backup frequency, protected storage, retention period, restore procedure and periodic restoration tests."
    },
    {
      title: "Production Architecture",
      task:
        "Design the production architecture for a student management MERN application.",
      hint:
        "Include browser, frontend, API, MongoDB and observability.",
      answer:
        "Browser → HTTPS → React frontend → Express/Node API → Mongoose → MongoDB, with logs, metrics, health checks and alerts around the system."
    }
  ],

  quiz: [
    {
      question: "What is the primary purpose of deployment?",
      options: [
        "Delete source code",
        "Release an application to a target environment",
        "Replace MongoDB",
        "Create React components"
      ],
      answer: 1,
      explanation:
        "Deployment releases software into an environment where it can run and serve users."
    },
    {
      question: "Which protocol should protect production web traffic?",
      options: [
        "FTP",
        "HTTP only",
        "HTTPS",
        "SMTP"
      ],
      answer: 2,
      explanation:
        "HTTPS protects HTTP communication using TLS."
    },
    {
      question: "Where should production database credentials normally be stored?",
      options: [
        "React JSX",
        "Public CSS",
        "Protected server configuration",
        "Browser localStorage as plain text"
      ],
      answer: 2,
      explanation:
        "Database credentials belong in protected server-side configuration."
    },
    {
      question: "What is the main purpose of application logs?",
      options: [
        "Style the UI",
        "Record useful application events",
        "Replace the database",
        "Compile React"
      ],
      answer: 1,
      explanation:
        "Logs provide information about application events and help diagnose problems."
    },
    {
      question: "Which signal is normally numerical?",
      options: [
        "Metric",
        "Source file",
        "HTML element",
        "Password"
      ],
      answer: 0,
      explanation:
        "Metrics are numerical measurements of system behavior."
    },
    {
      question: "What does a readiness check determine?",
      options: [
        "Whether CSS is valid",
        "Whether a service is ready to receive traffic",
        "Whether Git is installed",
        "Whether React has JSX"
      ],
      answer: 1,
      explanation:
        "Readiness indicates whether the service can safely receive production traffic."
    },
    {
      question: "Why should production secrets not be committed to Git?",
      options: [
        "Git cannot store text",
        "Repositories may expose sensitive credentials",
        "Node.js cannot read secrets",
        "React requires passwords in JSX"
      ],
      answer: 1,
      explanation:
        "Committed secrets can be exposed through repository access, history or copies."
    },
    {
      question: "What is a backup?",
      options: [
        "A CSS file",
        "A recoverable copy of important data",
        "A React component",
        "An API route"
      ],
      answer: 1,
      explanation:
        "Backups provide copies of data that can be used for recovery."
    },
    {
      question: "Why should backups be restored periodically in testing?",
      options: [
        "To increase CSS size",
        "To verify that recovery actually works",
        "To delete production data",
        "To disable monitoring"
      ],
      answer: 1,
      explanation:
        "Restoration testing confirms that backup data and recovery procedures are usable."
    },
    {
      question: "Which practice can help reduce repeated API response time?",
      options: [
        "Ignoring measurements",
        "Appropriate caching",
        "Removing all indexes",
        "Logging passwords"
      ],
      answer: 1,
      explanation:
        "Caching can reduce repeated expensive work when the data can safely be reused."
    },
    {
      question: "What should happen after deployment in a reliable workflow?",
      options: [
        "Delete monitoring",
        "Run health checks and observe the system",
        "Remove environment variables",
        "Disable logs"
      ],
      answer: 1,
      explanation:
        "Post-deployment health checks and monitoring verify that the release is functioning."
    },
    {
      question: "What is incident response?",
      options: [
        "A CSS technique",
        "A structured process for handling production failures",
        "A MongoDB query",
        "A React hook"
      ],
      answer: 1,
      explanation:
        "Incident response provides a controlled process for detecting, stabilizing, recovering and learning from failures."
    }
  ],

  glossary: [
    {
      term: "Deployment",
      definition:
        "The process of releasing software to a target environment."
    },
    {
      term: "Production",
      definition:
        "The environment where the application serves real users."
    },
    {
      term: "Hosting",
      definition:
        "Infrastructure that runs or serves an application."
    },
    {
      term: "HTTPS",
      definition:
        "Secure HTTP communication protected using TLS."
    },
    {
      term: "Environment Variable",
      definition:
        "External configuration supplied to an application at runtime or build time."
    },
    {
      term: "Secret",
      definition:
        "Sensitive information such as credentials, private keys or authentication secrets."
    },
    {
      term: "Log",
      definition:
        "A recorded application event or message used for operations and diagnosis."
    },
    {
      term: "Structured Logging",
      definition:
        "Logging organized into machine-readable fields."
    },
    {
      term: "Metric",
      definition:
        "A numerical measurement of application or infrastructure behavior."
    },
    {
      term: "Observability",
      definition:
        "The ability to understand system behavior through signals such as logs, metrics and traces."
    },
    {
      term: "Health Check",
      definition:
        "A mechanism used to determine whether a service is functioning."
    },
    {
      term: "Readiness",
      definition:
        "The condition in which a service is prepared to receive traffic."
    },
    {
      term: "Alert",
      definition:
        "A notification triggered by an important monitored condition."
    },
    {
      term: "Backup",
      definition:
        "A recoverable copy of important application data."
    },
    {
      term: "Recovery",
      definition:
        "The process of restoring service or data after a failure."
    },
    {
      term: "Incident Response",
      definition:
        "A structured process for detecting, handling and learning from production incidents."
    },
    {
      term: "CI/CD",
      definition:
        "Practices and automation connecting code validation, delivery and deployment."
    }
  ],

  completion: {
    title: "Deployment & Observability Complete!",
    message:
      "You have completed Level 29. You now understand how a MERN application moves from development into production and how hosting, HTTPS, configuration, logs, metrics, health checks, alerts, backups and recovery work together.",
    achievements: [
      "Understood the production readiness mindset.",
      "Learned the architecture of a deployed MERN application.",
      "Understood frontend production builds.",
      "Learned backend deployment fundamentals.",
      "Learned production environment configuration.",
      "Understood production MongoDB considerations.",
      "Learned the importance of HTTPS.",
      "Understood production security configuration.",
      "Learned structured application logging.",
      "Understood metrics and monitoring.",
      "Learned health and readiness checks.",
      "Understood error tracking and alerting.",
      "Learned performance, caching and scaling concepts.",
      "Learned backup and recovery principles.",
      "Understood incident-response workflows.",
      "Connected CI/CD with deployment.",
      "Built a complete deployment and observability checklist."
    ],
    nextLevel: "Level 30 — Placement Capstone Studio"
  }
};
