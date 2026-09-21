"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[27] = {
  n: 27,
  kicker: "PART 6 • PRODUCTION MERN • LEVEL 27",
  title: "MERN Integration",
  summary:
    "Connect React, Express, Node.js and MongoDB through clean API clients, environment configuration and well-defined state boundaries.",
  duration: "70–90 min",
  difficulty: "Advanced Beginner",
  concepts: 17,

  outcomes: [
    "Understand the complete data flow inside a MERN application.",
    "Design a clean frontend API client instead of scattering fetch calls.",
    "Connect React components to Express APIs.",
    "Understand the boundary between UI state, server state and persistent database state.",
    "Configure frontend and backend environments safely.",
    "Handle loading, success, empty and error states.",
    "Understand CORS and frontend-backend communication.",
    "Design a clean request flow from React to MongoDB and back.",
    "Understand authentication data flow across a MERN application.",
    "Structure a MERN application for maintainability and production growth."
  ],

  sections: [
    {
      number: 1,
      title: "What Does MERN Integration Mean?",
      intro:
        "A MERN application is not four independent technologies. React, Express, Node.js and MongoDB work together as one data flow.",
      points: [
        "React is responsible mainly for the user interface.",
        "Express defines HTTP API routes.",
        "Node.js runs the backend JavaScript application.",
        "MongoDB stores persistent application data.",
        "Mongoose commonly provides the data-modeling layer between Express and MongoDB.",
        "The frontend normally communicates with the backend through HTTP APIs."
      ],
      comparison: {
        title: "The Four Main Layers",
        headers: ["Layer", "Technology", "Main Responsibility"],
        rows: [
          ["UI", "React", "Render screens and collect user actions"],
          ["API", "Express", "Define routes and HTTP behavior"],
          ["Runtime", "Node.js", "Execute backend JavaScript"],
          ["Database", "MongoDB", "Persist application data"]
        ]
      },
      code: `// A simplified MERN architecture

React UI
   ↓
API Client
   ↓
Express Route
   ↓
Controller
   ↓
Service
   ↓
Mongoose
   ↓
MongoDB

// The response travels back through the same layers.

MongoDB
   ↓
Mongoose
   ↓
Service
   ↓
Controller
   ↓
Express
   ↓
API Client
   ↓
React UI`,
      keyIdea:
        "MERN integration is the controlled movement of data between the frontend, API layer and database."
    },

    {
      number: 2,
      title: "The Complete MERN Request Flow",
      intro:
        "When a user clicks Save in a React application, the request can travel through many layers before the screen changes.",
      points: [
        "The user performs an action in React.",
        "The component calls an API client.",
        "The API client sends an HTTP request.",
        "Express receives the request.",
        "Middleware performs cross-cutting checks.",
        "The controller coordinates the request.",
        "A service performs application logic.",
        "Mongoose communicates with MongoDB.",
        "The backend sends a response.",
        "React updates the appropriate state and renders again."
      ],
      code: `// Example request flow

User clicks "Create Student"
        ↓
React form
        ↓
studentApi.create(student)
        ↓
POST /api/students
        ↓
Express route
        ↓
Controller
        ↓
Student service
        ↓
Mongoose model
        ↓
MongoDB
        ↓
JSON response
        ↓
React state update
        ↓
Updated UI`,
      keyIdea:
        "A clean request flow makes debugging easier because every layer has a clear responsibility."
    },

    {
      number: 3,
      title: "Designing the MERN Project Structure",
      intro:
        "A professional MERN application separates frontend and backend responsibilities instead of placing everything into a few large files.",
      points: [
        "The client contains React code.",
        "The server contains Node.js and Express code.",
        "Routes define API endpoints.",
        "Controllers coordinate HTTP requests and responses.",
        "Services contain reusable business logic.",
        "Models define database structures.",
        "Configuration handles environment-specific values."
      ],
      code: `mern-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── state/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── package.json`,
      keyIdea:
        "Good folder boundaries reduce accidental coupling between UI, API and database code."
    },

    {
      number: 4,
      title: "Why We Need an API Client",
      intro:
        "Calling fetch directly from many React components creates duplication. An API client centralizes HTTP communication.",
      points: [
        "It keeps API URLs in one place.",
        "It can standardize headers.",
        "It can standardize JSON handling.",
        "Authentication behavior can be centralized.",
        "Error handling can become consistent.",
        "Components become focused on UI behavior."
      ],
      code: `// client/src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const response = await fetch(
    API_BASE_URL + path,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Components can now use apiRequest()
// instead of repeating fetch configuration.`,
      keyIdea:
        "The API client is the frontend boundary for communication with the backend."
    },

    {
      number: 5,
      title: "Building Resource-Specific API Functions",
      intro:
        "After creating a common API client, resource-specific functions can describe application operations clearly.",
      points: [
        "Keep HTTP details inside the service layer.",
        "Use meaningful function names.",
        "Return parsed data instead of raw HTTP objects when appropriate.",
        "Keep React components unaware of endpoint construction.",
        "Group functions by resource such as students, products or orders."
      ],
      code: `// client/src/services/studentApi.js

import { apiRequest } from "./api.js";

export function getStudents() {
  return apiRequest("/students");
}

export function getStudent(id) {
  return apiRequest("/students/" + id);
}

export function createStudent(student) {
  return apiRequest("/students", {
    method: "POST",
    body: JSON.stringify(student)
  });
}

export function updateStudent(id, student) {
  return apiRequest("/students/" + id, {
    method: "PUT",
    body: JSON.stringify(student)
  });
}

export function deleteStudent(id) {
  return apiRequest("/students/" + id, {
    method: "DELETE"
  });
}`,
      keyIdea:
        "Resource-specific API functions give the frontend a clean vocabulary for backend operations."
    },

    {
      number: 6,
      title: "Connecting React to an Express API",
      intro:
        "React can call the API client from an event handler, effect or custom hook depending on the application behavior.",
      points: [
        "User actions often trigger POST, PUT or DELETE requests.",
        "Initial page loading often triggers GET requests.",
        "Async operations should expose loading and error states.",
        "The component should update only the state it owns.",
        "Avoid putting backend implementation details inside JSX."
      ],
      code: `import { useEffect, useState } from "react";
import { getStudents } from "./services/studentApi.js";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {students.map(student => (
        <li key={student._id}>
          {student.name}
        </li>
      ))}
    </ul>
  );
}`,
      keyIdea:
        "React should consume API functions rather than constructing backend requests throughout the UI."
    },

    {
      number: 7,
      title: "HTTP Methods and Resource Design",
      intro:
        "A MERN API becomes easier to understand when URLs represent resources and HTTP methods represent operations.",
      points: [
        "GET retrieves data.",
        "POST creates a resource.",
        "PUT or PATCH changes an existing resource.",
        "DELETE removes a resource.",
        "Resource names are normally nouns rather than action words."
      ],
      comparison: {
        title: "Common REST Operations",
        headers: ["Operation", "Method", "Example"],
        rows: [
          ["List students", "GET", "/api/students"],
          ["Get one student", "GET", "/api/students/123"],
          ["Create student", "POST", "/api/students"],
          ["Update student", "PUT", "/api/students/123"],
          ["Delete student", "DELETE", "/api/students/123"]
        ]
      },
      code: `// Express routes

router.get("/students", listStudents);

router.get("/students/:id", getStudent);

router.post("/students", createStudent);

router.put("/students/:id", updateStudent);

router.delete("/students/:id", deleteStudent);`,
      keyIdea:
        "Consistent REST resource design makes frontend integration predictable."
    },

    {
      number: 8,
      title: "Environment Configuration",
      intro:
        "The frontend should not hard-code values that change between development, testing and production environments.",
      points: [
        "Development may use a local API server.",
        "Production uses a deployed API URL.",
        "Environment variables allow configuration without changing application logic.",
        "Frontend-exposed variables must not contain secrets.",
        "Backend environment variables can contain protected server configuration."
      ],
      code: `// Frontend development environment

VITE_API_BASE_URL=http://localhost:5000/api

// Frontend production environment

VITE_API_BASE_URL=https://api.example.com/api

// React code

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// Important:
// A frontend environment variable is visible
// to the browser after the application is built.
// Never place passwords or private secrets there.`,
      keyIdea:
        "Environment configuration changes deployment behavior without changing application code."
    },

    {
      number: 9,
      title: "Backend Environment Variables",
      intro:
        "The Node.js backend commonly stores database credentials, authentication secrets and other server-only configuration in environment variables.",
      points: [
        "Use process.env to read server configuration.",
        "Do not commit secret values to Git.",
        "Provide safe defaults only for non-sensitive development settings.",
        "Validate required environment variables during startup.",
        "Keep production secrets in the hosting platform's secret configuration."
      ],
      code: `// server/config/env.js

const required = [
  "MONGODB_URI",
  "JWT_SECRET"
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(
      "Missing environment variable: " + name
    );
  }
}

export const config = {
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000
};`,
      keyIdea:
        "Configuration should fail early when required production settings are missing."
    },

    {
      number: 10,
      title: "CORS and Frontend-Backend Communication",
      intro:
        "When React and Express run on different origins, browsers apply cross-origin security rules. Express must explicitly allow the intended frontend origin.",
      points: [
        "An origin is based on scheme, host and port.",
        "localhost:5173 and localhost:5000 are different origins.",
        "CORS controls which browser origins may access an API.",
        "Production should allow only trusted frontend origins.",
        "CORS is not an authentication system."
      ],
      code: `import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.example.com"
    ],
    credentials: true
  })
);

// CORS decides whether the browser
// permits frontend JavaScript to access
// the backend response.`,
      keyIdea:
        "CORS is a browser communication policy, not a replacement for authentication or authorization."
    },

    {
      number: 11,
      title: "State Boundaries in a MERN Application",
      intro:
        "One of the most important integration decisions is deciding where a piece of data should live.",
      points: [
        "Local UI state belongs close to the component that owns it.",
        "Shared client state belongs in a shared state solution when multiple parts of the UI need it.",
        "Server state represents data retrieved from the backend.",
        "Persistent state belongs in the database.",
        "Do not duplicate the same source of truth unnecessarily."
      ],
      comparison: {
        title: "State Ownership",
        headers: ["State", "Example", "Typical Owner"],
        rows: [
          ["UI state", "Modal open/closed", "React component"],
          ["Form state", "Input values", "Form component"],
          ["Shared client state", "Theme preference", "Context/store"],
          ["Server state", "Student list", "API/cache/state layer"],
          ["Persistent state", "Student record", "MongoDB"]
        ]
      },
      code: `// UI state

const [isModalOpen, setIsModalOpen] = useState(false);

// Form state

const [name, setName] = useState("");

// Server data

const [students, setStudents] = useState([]);

// Persistent database state

// MongoDB stores the actual student records.`,
      keyIdea:
        "State boundaries prevent unnecessary coupling and help each layer own the data it is responsible for."
    },

    {
      number: 12,
      title: "Loading, Success, Empty and Error States",
      intro:
        "A professional frontend must represent more than just success. API integration creates multiple possible UI states.",
      points: [
        "Loading means the request is still running.",
        "Success means useful data has arrived.",
        "Empty means the request succeeded but there is no data.",
        "Error means the operation failed.",
        "A retry action can help recover from temporary failures."
      ],
      code: `function StudentState({
  loading,
  error,
  students
}) {
  if (loading) {
    return <p>Loading students...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Unable to load students.</p>
        <button>Retry</button>
      </div>
    );
  }

  if (students.length === 0) {
    return <p>No students found.</p>;
  }

  return (
    <p>
      Loaded {students.length} students.
    </p>
  );
}`,
      keyIdea:
        "Reliable interfaces explicitly model loading, success, empty and failure states."
    },

    {
      number: 13,
      title: "Express Route to Controller to Service",
      intro:
        "The backend should also have clear boundaries. Routes, controllers and services should not all perform the same work.",
      points: [
        "Routes define the endpoint.",
        "Controllers handle HTTP-specific concerns.",
        "Services contain application logic.",
        "Models handle database interaction.",
        "This separation improves testing and reuse."
      ],
      code: `// routes/studentRoutes.js

router.post(
  "/students",
  studentController.createStudent
);

// controllers/studentController.js

export async function createStudent(req, res, next) {
  try {
    const student =
      await studentService.createStudent(req.body);

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

// services/studentService.js

export async function createStudent(data) {
  return Student.create(data);
}`,
      keyIdea:
        "Each backend layer should have a clear responsibility rather than becoming a giant all-purpose file."
    },

    {
      number: 14,
      title: "Authentication Data Flow",
      intro:
        "Authentication becomes a cross-layer concern because the browser, API and database all participate in the process.",
      points: [
        "The user submits login credentials.",
        "The backend verifies the account.",
        "The backend creates an authenticated session or token.",
        "The client sends authentication information on protected requests.",
        "Middleware verifies authentication.",
        "Authorization determines what the user is allowed to access."
      ],
      code: `// Simplified authentication flow

POST /api/auth/login
        ↓
Express
        ↓
Validate credentials
        ↓
Find user in MongoDB
        ↓
Verify password
        ↓
Create session/token
        ↓
Send authentication result
        ↓
React stores appropriate client state
        ↓
Protected API request
        ↓
Authentication middleware
        ↓
Authorized controller`,
      keyIdea:
        "Authentication crosses boundaries, so every layer must have a defined responsibility."
    },

    {
      number: 15,
      title: "Consistent API Responses",
      intro:
        "A predictable response format makes frontend integration easier and reduces special-case handling.",
      points: [
        "Successful responses should have a predictable structure.",
        "Error responses should contain useful but safe information.",
        "HTTP status codes should communicate the broad result.",
        "Do not expose internal stack traces to clients.",
        "The frontend should be able to handle API responses consistently."
      ],
      code: `// Example success response

{
  "success": true,
  "data": {
    "id": "123",
    "name": "Anita"
  }
}

// Example list response

{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Anita"
    }
  ]
}

// Example error response

{
  "success": false,
  "message": "Student not found"
}`,
      keyIdea:
        "Consistent API contracts reduce frontend complexity."
    },

    {
      number: 16,
      title: "Development and Production Boundaries",
      intro:
        "A MERN application behaves differently in development and production, but the core application logic should remain stable.",
      points: [
        "Development commonly uses localhost services.",
        "Production uses deployed frontend and backend services.",
        "Production databases must use secure credentials and access controls.",
        "Debug output should be controlled in production.",
        "Production configuration belongs outside source code.",
        "Build processes create optimized frontend assets."
      ],
      code: `// Development

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

Database:
MongoDB development database

// Production

Frontend:
https://www.example.com

Backend:
https://api.example.com

Database:
Production MongoDB deployment

// Application code should not need
// to be rewritten between environments.`,
      keyIdea:
        "Separate configuration from application logic so the same architecture can move between environments."
    },

    {
      number: 17,
      title: "Complete MERN Integration Checklist",
      intro:
        "Before moving toward deployment, verify that all major integration boundaries are clear and predictable.",
      points: [
        "React communicates through a centralized API client.",
        "API URLs come from environment configuration.",
        "Frontend secrets are never exposed.",
        "Express routes follow consistent resource conventions.",
        "Controllers and services have separate responsibilities.",
        "Mongoose handles database access.",
        "State ownership is clearly defined.",
        "Loading, empty and error states are implemented.",
        "CORS allows only intended frontend origins.",
        "Authentication and authorization boundaries are clear.",
        "API responses follow a predictable contract.",
        "Development and production configuration are separated."
      ],
      code: `// MERN integration checklist

const integrationReady = {
  apiClient: true,
  environmentConfig: true,
  corsConfigured: true,
  stateBoundaries: true,
  loadingStates: true,
  errorStates: true,
  authFlowDefined: true,
  apiContractDefined: true,
  backendLayersSeparated: true,
  databaseConnected: true
};

const ready =
  Object.values(integrationReady)
    .every(Boolean);

console.log(
  ready
    ? "MERN integration ready"
    : "Integration work remaining"
);`,
      keyIdea:
        "Integration is successful when every layer communicates through explicit, predictable boundaries."
    }
  ],

  visualizer: {
    title: "MERN Integration Architecture",
    description:
      "Explore how data travels between React, the API client, Express, Node.js, Mongoose and MongoDB.",
    type: "flow",
    steps: [
      {
        label: "User Action",
        detail: "The user clicks a button or submits a form."
      },
      {
        label: "React",
        detail: "The component decides which application operation is required."
      },
      {
        label: "API Client",
        detail: "The frontend creates the HTTP request."
      },
      {
        label: "Express",
        detail: "The backend receives the request through a route."
      },
      {
        label: "Controller",
        detail: "HTTP-specific work is coordinated."
      },
      {
        label: "Service",
        detail: "Application logic is executed."
      },
      {
        label: "Mongoose",
        detail: "The application communicates with the MongoDB data layer."
      },
      {
        label: "MongoDB",
        detail: "Persistent data is created, read or changed."
      },
      {
        label: "Response",
        detail: "The result travels back through the API."
      },
      {
        label: "React State",
        detail: "The frontend updates the correct state boundary."
      },
      {
        label: "Updated UI",
        detail: "React renders the new application state."
      }
    ]
  },

  trace: {
    title: "Trace a MERN Create Request",
    description:
      "Follow a student creation request from a React form to MongoDB and back.",
    steps: [
      {
        line: 1,
        operation: "User submits the React form",
        detail: "The component collects the student data."
      },
      {
        line: 2,
        operation: "studentApi.createStudent()",
        detail: "The resource API function prepares a POST request."
      },
      {
        line: 3,
        operation: "POST /api/students",
        detail: "The browser sends the request to the Express backend."
      },
      {
        line: 4,
        operation: "Express route",
        detail: "The request is matched to the student creation route."
      },
      {
        line: 5,
        operation: "Middleware",
        detail: "Authentication, validation and other middleware can run."
      },
      {
        line: 6,
        operation: "Controller",
        detail: "The controller receives the validated request."
      },
      {
        line: 7,
        operation: "Student service",
        detail: "Business logic is executed."
      },
      {
        line: 8,
        operation: "Mongoose model",
        detail: "The student document is prepared for persistence."
      },
      {
        line: 9,
        operation: "MongoDB",
        detail: "The document is stored in the database."
      },
      {
        line: 10,
        operation: "JSON response",
        detail: "The backend sends the created student back to the client."
      },
      {
        line: 11,
        operation: "React state update",
        detail: "The frontend updates the appropriate server-data state."
      },
      {
        line: 12,
        operation: "UI re-render",
        detail: "The newly created student becomes visible."
      }
    ]
  },

  revision: [
    ["MERN", "MongoDB, Express, React and Node.js working together."],
    ["API Client", "A frontend layer that centralizes HTTP communication."],
    ["REST", "An architectural approach for designing resource-oriented HTTP APIs."],
    ["Environment Variable", "Configuration supplied outside normal application source code."],
    ["CORS", "Browser security mechanism controlling cross-origin requests."],
    ["UI State", "Short-lived state controlling interface behavior."],
    ["Server State", "Data obtained from a backend service."],
    ["Persistent State", "Data stored permanently in a database."],
    ["Controller", "Backend layer responsible for HTTP request and response coordination."],
    ["Service", "Backend layer containing application or business logic."],
    ["Mongoose", "ODM library commonly used to work with MongoDB from Node.js."],
    ["API Contract", "Expected structure and behavior of communication between client and server."],
    ["Authentication", "Process of verifying a user's identity."],
    ["Authorization", "Process of determining what an authenticated user may access."],
    ["State Boundary", "A deliberate decision about which layer owns a piece of state."]
  ],

  interview: [
    {
      question: "What is the role of React in a MERN application?",
      answer:
        "React primarily manages the user interface, user interactions and client-side rendering."
    },
    {
      question: "Why should a frontend use an API client?",
      answer:
        "It centralizes HTTP communication, reduces duplication and makes API behavior easier to maintain."
    },
    {
      question: "What is the difference between UI state and server state?",
      answer:
        "UI state controls interface behavior such as modal visibility, while server state represents data obtained from a backend."
    },
    {
      question: "Why should secrets not be placed in frontend environment variables?",
      answer:
        "Frontend variables become part of browser-accessible application assets, so users can inspect them."
    },
    {
      question: "What is CORS?",
      answer:
        "CORS is a browser security mechanism that controls whether a web page can access resources from another origin."
    },
    {
      question: "What is the difference between authentication and authorization?",
      answer:
        "Authentication verifies identity; authorization determines what that identity is allowed to do."
    },
    {
      question: "Why separate Express routes, controllers and services?",
      answer:
        "Separation gives each layer a focused responsibility and improves testing, reuse and maintainability."
    },
    {
      question: "What is an API contract?",
      answer:
        "It is the agreed structure and behavior of requests and responses between a client and server."
    },
    {
      question: "Why should loading and error states be handled in React?",
      answer:
        "Network operations are asynchronous and can succeed, fail or take time, so the interface must represent those states."
    },
    {
      question: "Where should persistent application data live?",
      answer:
        "Persistent business data normally belongs in the database, such as MongoDB."
    },
    {
      question: "Why should API URLs not be hard-coded?",
      answer:
        "Different environments often use different API addresses, so configuration should be changeable without modifying application logic."
    },
    {
      question: "What does Mongoose do in a MERN backend?",
      answer:
        "Mongoose provides an object-document modeling layer for working with MongoDB from Node.js."
    },
    {
      question: "Why is state ownership important?",
      answer:
        "Clear state ownership prevents unnecessary duplication and coupling between components and application layers."
    }
  ],

  practice: [
    {
      title: "Create an API Client",
      task:
        "Build a reusable apiRequest() function that accepts a path and request options and returns parsed JSON.",
      hint:
        "Use fetch(), response.ok and response.json().",
      answer:
        "Centralize base URL handling, headers, JSON parsing and basic error handling in one function."
    },
    {
      title: "Build a Student API",
      task:
        "Create getStudents(), getStudent(), createStudent(), updateStudent() and deleteStudent() functions.",
      hint:
        "Keep these functions inside a studentApi service file.",
      answer:
        "Each function should call the shared API client and hide endpoint details from React components."
    },
    {
      title: "Environment Configuration",
      task:
        "Configure a React application so its API base URL comes from an environment variable.",
      hint:
        "With Vite, frontend variables exposed to the application use the VITE_ prefix.",
      answer:
        "Read the value through import.meta.env and use it when constructing API requests."
    },
    {
      title: "State Classification",
      task:
        "Classify modal visibility, logged-in user, student list and MongoDB student records as different state types.",
      hint:
        "Ask which layer is the natural source of truth.",
      answer:
        "Modal visibility is UI state; logged-in user can be shared client/auth state; student list is server state; MongoDB records are persistent state."
    },
    {
      title: "React API Integration",
      task:
        "Create a StudentList component that loads students and displays loading, error, empty and success states.",
      hint:
        "Use useEffect and useState.",
      answer:
        "The component should track loading and error separately and render the appropriate state before displaying the list."
    },
    {
      title: "REST API Design",
      task:
        "Design endpoints for products including list, single product, create, update and delete operations.",
      hint:
        "Use the product resource as the URL.",
      answer:
        "GET /products, GET /products/:id, POST /products, PUT /products/:id and DELETE /products/:id."
    },
    {
      title: "Backend Layering",
      task:
        "Create a route, controller and service for creating a student.",
      hint:
        "The route should not contain database logic.",
      answer:
        "The route points to the controller, the controller calls the service, and the service performs the application/database operation."
    },
    {
      title: "MERN Flow Diagram",
      task:
        "Draw the complete flow for creating an order from a React form to MongoDB and back.",
      hint:
        "Include React, API client, Express, controller, service, Mongoose and MongoDB.",
      answer:
        "React → API client → Express route → middleware → controller → service → Mongoose → MongoDB → response → React state → UI."
    }
  ],

  quiz: [
    {
      question: "Which layer primarily renders the user interface in MERN?",
      options: ["MongoDB", "React", "Express", "Node.js"],
      answer: 1,
      explanation:
        "React is the frontend UI library in the MERN stack."
    },
    {
      question: "What is the main purpose of a frontend API client?",
      options: [
        "Store MongoDB documents",
        "Render HTML",
        "Centralize HTTP communication",
        "Compile Node.js"
      ],
      answer: 2,
      explanation:
        "An API client centralizes requests, headers, URLs and common response handling."
    },
    {
      question: "Which HTTP method is commonly used to create a resource?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      answer: 1,
      explanation:
        "POST is commonly used to create a new resource."
    },
    {
      question: "Which state best represents whether a modal is open?",
      options: [
        "Persistent database state",
        "UI state",
        "MongoDB state",
        "Server configuration"
      ],
      answer: 1,
      explanation:
        "Modal visibility is local interface behavior and is normally UI state."
    },
    {
      question: "Which frontend environment variable should never contain a private password?",
      options: [
        "Any variable exposed to browser code",
        "A MongoDB collection",
        "A React state variable",
        "An Express route"
      ],
      answer: 0,
      explanation:
        "Browser-accessible configuration can be inspected by users and should not contain secrets."
    },
    {
      question: "What does CORS control?",
      options: [
        "MongoDB indexes",
        "Browser cross-origin access",
        "Password hashing",
        "React rendering"
      ],
      answer: 1,
      explanation:
        "CORS controls whether browser code is permitted to access resources from another origin."
    },
    {
      question: "Which layer should normally contain application/business logic?",
      options: [
        "Service layer",
        "HTML document",
        "MongoDB collection name",
        "CSS file"
      ],
      answer: 0,
      explanation:
        "A service layer is commonly used to organize application/business logic."
    },
    {
      question: "Which technology is commonly used as the ODM layer with MongoDB in MERN?",
      options: ["React", "Mongoose", "CSS", "Vite"],
      answer: 1,
      explanation:
        "Mongoose is an object-document modeling library commonly used with MongoDB."
    },
    {
      question: "What should a frontend display while an API request is running?",
      options: [
        "Only an empty screen",
        "A loading state",
        "A database connection string",
        "A stack trace"
      ],
      answer: 1,
      explanation:
        "A loading state communicates that asynchronous work is still in progress."
    },
    {
      question: "What is the difference between authentication and authorization?",
      options: [
        "They are exactly the same",
        "Authentication verifies identity; authorization checks permissions",
        "Authorization verifies identity; authentication stores data",
        "Both only apply to MongoDB"
      ],
      answer: 1,
      explanation:
        "Authentication establishes who the user is; authorization determines what the user may do."
    },
    {
      question: "Which component should normally know the MongoDB connection string?",
      options: [
        "React button",
        "Browser UI",
        "Backend configuration",
        "CSS stylesheet"
      ],
      answer: 2,
      explanation:
        "Database connection credentials belong on the server side."
    },
    {
      question: "Why are clear state boundaries useful?",
      options: [
        "They increase duplication",
        "They make every component global",
        "They clarify ownership and reduce unnecessary coupling",
        "They remove the need for APIs"
      ],
      answer: 2,
      explanation:
        "Clear ownership makes data flow easier to understand and maintain."
    }
  ],

  glossary: [
    {
      term: "API Client",
      definition:
        "A frontend abstraction that manages communication with backend APIs."
    },
    {
      term: "REST",
      definition:
        "A style of designing web APIs around resources and standard HTTP operations."
    },
    {
      term: "CORS",
      definition:
        "A browser security mechanism governing cross-origin resource access."
    },
    {
      term: "Environment Variable",
      definition:
        "Configuration supplied to an application from its execution environment."
    },
    {
      term: "State Boundary",
      definition:
        "A deliberate boundary defining which layer owns and manages particular state."
    },
    {
      term: "Server State",
      definition:
        "Application data obtained from a remote backend."
    },
    {
      term: "Persistent State",
      definition:
        "Data stored in a durable data store such as MongoDB."
    },
    {
      term: "Controller",
      definition:
        "A backend layer responsible for coordinating HTTP requests and responses."
    },
    {
      term: "Service",
      definition:
        "A backend layer that contains application-specific logic."
    },
    {
      term: "API Contract",
      definition:
        "The agreed request, response and behavior rules between API consumers and providers."
    },
    {
      term: "Authentication",
      definition:
        "The process of verifying a user's identity."
    },
    {
      term: "Authorization",
      definition:
        "The process of deciding which resources or actions an authenticated identity can access."
    },
    {
      term: "Mongoose",
      definition:
        "An ODM library for working with MongoDB from Node.js."
    },
    {
      term: "Integration",
      definition:
        "Connecting separate application layers so they operate together as one system."
    }
  ],

  completion: {
    title: "MERN Integration Complete!",
    message:
      "You have completed Level 27. You now understand how React, API clients, Express, Node.js, Mongoose and MongoDB work together, how environments are configured, and how state boundaries keep a MERN application organized.",
    achievements: [
      "Understood the complete MERN request and response flow.",
      "Built the mental model for frontend API clients.",
      "Learned resource-oriented REST API integration.",
      "Understood frontend and backend environment configuration.",
      "Learned how CORS affects frontend-backend communication.",
      "Learned to separate UI state, server state and persistent state.",
      "Implemented loading, success, empty and error-state thinking.",
      "Understood route, controller and service boundaries.",
      "Learned the cross-layer authentication flow.",
      "Understood consistent API contracts.",
      "Learned the development-to-production configuration boundary."
    ],
    nextLevel: "Level 28 — Testing, Quality & CI"
  }
};
