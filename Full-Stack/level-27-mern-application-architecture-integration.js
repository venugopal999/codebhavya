"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[27] = {
  n: 27,
  kicker: "PART 6 • PRODUCTION MERN • LEVEL 27",
  title: "MERN Application Architecture & Integration",
  summary:
    "Bring React, Express, Node.js and MongoDB together into a clean full-stack architecture with API integration, authentication flow, environment configuration, error handling and production-ready data flow.",
  duration: "80–95 min",
  difficulty: "Advanced Beginner",
  concepts: 17,

  outcomes: [
    "Understand the complete MERN application architecture.",
    "Understand how React communicates with an Express API.",
    "Design a clean frontend and backend project structure.",
    "Configure environment variables for frontend and backend applications.",
    "Build REST API integration using fetch.",
    "Understand request and response flow across the MERN stack.",
    "Handle loading, success and error states in React.",
    "Connect Express services to Mongoose models.",
    "Understand authentication flow between React and Express.",
    "Protect backend routes with authentication middleware.",
    "Understand CORS and credential handling.",
    "Design consistent API response structures.",
    "Handle frontend and backend errors safely.",
    "Understand API configuration for development and production.",
    "Apply separation of concerns across the MERN stack.",
    "Understand how a complete MERN application communicates end-to-end.",
    "Prepare a MERN project architecture for testing and deployment."
  ],

  sections: [
    {
      number: 1,
      title: "What is a MERN Application?",
      intro:
        "A MERN application combines MongoDB, Express, React and Node.js into one full-stack application.",
      points: [
        "React is responsible for the user interface.",
        "Node.js provides the server-side JavaScript runtime.",
        "Express provides HTTP routing and backend API functionality.",
        "MongoDB stores application data.",
        "Mongoose provides the data modeling layer between Express and MongoDB.",
        "The frontend normally communicates with the backend through HTTP APIs.",
        "The backend communicates with MongoDB through Mongoose or the MongoDB driver."
      ],
      code: `React
  |
  | HTTP Request
  v
Express + Node.js
  |
  | Mongoose
  v
MongoDB

MongoDB
  |
  | Result
  v
Express
  |
  | JSON Response
  v
React`,
      keyIdea:
        "MERN is not one single technology. It is a stack of technologies working together through clearly defined boundaries."
    },

    {
      number: 2,
      title: "Complete MERN Request Flow",
      intro:
        "A typical MERN operation begins with a user interaction in React and travels through the backend before reaching MongoDB.",
      points: [
        "A user performs an action in the React interface.",
        "React prepares an HTTP request.",
        "The request reaches an Express route.",
        "Middleware performs cross-cutting work such as authentication.",
        "The controller coordinates the request.",
        "The service executes business logic.",
        "Mongoose communicates with MongoDB.",
        "The backend returns JSON.",
        "React updates its state and renders the result."
      ],
      code: `User
  |
  v
React Component
  |
  v
fetch("/api/students")
  |
  v
Express Router
  |
  v
Middleware
  |
  v
Controller
  |
  v
Service
  |
  v
Mongoose Model
  |
  v
MongoDB`,
      keyIdea:
        "Understanding the request lifecycle is one of the most important skills in full-stack development."
    },

    {
      number: 3,
      title: "Professional MERN Project Structure",
      intro:
        "A full-stack project becomes easier to maintain when frontend and backend responsibilities are clearly separated.",
      points: [
        "The frontend contains React components, pages, hooks and API utilities.",
        "The backend contains routes, controllers, services, models and middleware.",
        "Configuration should be separated from business logic.",
        "Shared documentation and project-level configuration belong at the root.",
        "Large applications should be organized by responsibility or feature."
      ],
      code: `mern-app/
|
+-- client/
|   +-- src/
|       +-- components/
|       +-- pages/
|       +-- hooks/
|       +-- services/
|       +-- App.jsx
|       +-- main.jsx
|
+-- server/
    +-- controllers/
    +-- routes/
    +-- services/
    +-- models/
    +-- middleware/
    +-- config/
    +-- server.js`,
      keyIdea:
        "A good project structure makes responsibilities visible instead of hiding everything inside a few large files."
    },

    {
      number: 4,
      title: "Frontend API Layer",
      intro:
        "React components should not contain repeated low-level HTTP request code. A dedicated API layer improves reuse and maintainability.",
      points: [
        "Create reusable functions for API calls.",
        "Keep endpoint URLs in one place where practical.",
        "Return parsed JSON from API functions.",
        "Throw meaningful errors when requests fail.",
        "Components should focus primarily on UI and state management."
      ],
      code: `const API_URL = "http://localhost:5000/api";

export async function getStudents() {
  const response = await fetch(
    API_URL + "/students"
  );

  if (!response.ok) {
    throw new Error("Failed to load students");
  }

  return response.json();
}`,
      keyIdea:
        "An API service layer prevents React components from becoming tightly coupled to HTTP implementation details."
    },

    {
      number: 5,
      title: "Calling an API from React",
      intro:
        "React can call backend APIs using fetch or another HTTP client and then store the result in component state.",
      points: [
        "Use useEffect for data loading tied to component lifecycle when appropriate.",
        "Use state for loading, data and error information.",
        "Do not assume every request succeeds.",
        "Render useful feedback while the request is running.",
        "Avoid updating state after an operation has become irrelevant."
      ],
      code: `import { useEffect, useState } from "react";
import { getStudents } from "./services/studentApi";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch(() => {
        setError("Unable to load students");
      })
      .finally(() => {
        setLoading(false);
      });
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
        "A production UI should explicitly represent loading, success and failure states."
    },

    {
      number: 6,
      title: "HTTP Methods & MERN APIs",
      intro:
        "REST-style APIs use HTTP methods to describe the intended operation.",
      points: [
        "GET retrieves resources.",
        "POST creates resources.",
        "PUT commonly replaces or updates a resource.",
        "PATCH partially updates a resource.",
        "DELETE removes a resource.",
        "The URL identifies the resource being operated on.",
        "The response status communicates the result."
      ],
      code: `GET    /api/students
GET    /api/students/123
POST   /api/students
PATCH  /api/students/123
DELETE /api/students/123`,
      keyIdea:
        "Consistent HTTP methods and resource-oriented URLs make APIs easier to understand and consume."
    },

    {
      number: 7,
      title: "Express Route → Controller → Service",
      intro:
        "A production Express application benefits from separating routing, HTTP handling and business logic.",
      points: [
        "Routes map URLs and HTTP methods.",
        "Controllers handle request and response objects.",
        "Services contain reusable business rules.",
        "Models handle database interaction.",
        "This separation improves testing and maintenance."
      ],
      code: `// route
router.post("/students", createStudent);

// controller
async function createStudent(req, res, next) {
  try {
    const student =
      await studentService.createStudent(req.body);

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
}

// service
async function createStudent(data) {
  return Student.create(data);
}`,
      keyIdea:
        "Do not turn Express route handlers into giant functions containing validation, business logic and database code."
    },

    {
      number: 8,
      title: "Consistent API Responses",
      intro:
        "A consistent response format makes frontend integration easier because React knows what shape to expect.",
      points: [
        "Successful responses should have predictable structures.",
        "Error responses should provide safe client-facing information.",
        "Use appropriate HTTP status codes.",
        "Avoid exposing stack traces or database internals.",
        "Document important response formats."
      ],
      code: `// Success
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Ravi"
  }
}

// Error
{
  "success": false,
  "error": {
    "message": "Student not found"
  }
}`,
      keyIdea:
        "API contracts are agreements between the frontend and backend."
    },

    {
      number: 9,
      title: "Environment Variables",
      intro:
        "Configuration such as database URLs, API endpoints and secrets should not be hard-coded into application source code.",
      points: [
        "Backend configuration can be stored in environment variables.",
        "Database connection strings should remain outside source code.",
        "Authentication secrets must be protected.",
        "Frontend environment variables are not equivalent to backend secrets.",
        "Anything bundled into browser JavaScript should be considered visible to users.",
        "Different environments can use different configuration values."
      ],
      code: `// Backend
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

// Frontend
const apiUrl =
  import.meta.env.VITE_API_URL;`,
      keyIdea:
        "Never put a private backend secret into frontend code. Browser-delivered configuration is visible to the client."
    },

    {
      number: 10,
      title: "CORS & Frontend-Backend Communication",
      intro:
        "When frontend and backend applications run on different origins, browsers enforce cross-origin security rules.",
      points: [
        "CORS controls which origins can access an API from browser JavaScript.",
        "The backend should explicitly configure allowed origins.",
        "Credentials require additional configuration on both sides.",
        "Do not use unrestricted origins for sensitive production APIs without understanding the consequences.",
        "Development and production origins may be different."
      ],
      code: `const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);`,
      keyIdea:
        "CORS is a browser security mechanism. It is not an authentication system."
    },

    {
      number: 11,
      title: "Authentication Flow Across MERN",
      intro:
        "Authentication connects the React interface, Express API and user identity system.",
      points: [
        "The user submits credentials through React.",
        "Express validates the credentials.",
        "The backend establishes authenticated state using an appropriate mechanism.",
        "Subsequent requests provide the required authentication information.",
        "Authentication middleware verifies the request.",
        "Protected controllers execute only after successful authentication."
      ],
      code: `React
  |
  | POST /api/auth/login
  v
Express
  |
  | verify credentials
  v
Authentication
  |
  | authenticated state
  v
React
  |
  | protected API request
  v
Auth Middleware
  |
  v
Protected Controller`,
      keyIdea:
        "Authentication is a complete request flow, not just a login form."
    },

    {
      number: 12,
      title: "Protecting Backend Routes",
      intro:
        "Authorization checks should happen on the backend because frontend route protection alone cannot secure an API.",
      points: [
        "React can hide protected UI, but that is not sufficient security.",
        "The backend must verify authentication.",
        "Authorization determines whether the authenticated user can perform the requested operation.",
        "Middleware can centralize authentication checks.",
        "Sensitive database operations should never rely solely on frontend checks."
      ],
      code: `router.get(
  "/profile",
  requireAuth,
  getProfile
);

router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  deleteUser
);`,
      keyIdea:
        "The server is the final authority for protecting API resources."
    },

    {
      number: 13,
      title: "Connecting Mongoose to Express",
      intro:
        "Express services can use Mongoose models to persist and retrieve application data from MongoDB.",
      points: [
        "The application connects to MongoDB during startup.",
        "Models represent application collections.",
        "Services use models for database operations.",
        "Controllers should not contain excessive database implementation details.",
        "Database errors should flow into centralized error handling."
      ],
      code: `async function getStudent(id) {
  const student = await Student.findById(id).lean();

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  return student;
}`,
      keyIdea:
        "The database layer should be reusable and separated from HTTP-specific code."
    },

    {
      number: 14,
      title: "Loading, Error & Empty States",
      intro:
        "A professional frontend should distinguish between loading, successful, empty and failed states.",
      points: [
        "Loading means the request is still in progress.",
        "Success means data was retrieved successfully.",
        "Empty means the request succeeded but there is no data.",
        "Error means the operation failed.",
        "These states should provide clear feedback to users."
      ],
      code: `if (loading) {
  return <p>Loading students...</p>;
}

if (error) {
  return <p>Unable to load students.</p>;
}

if (students.length === 0) {
  return <p>No students found.</p>;
}

return <StudentList students={students} />;`,
      keyIdea:
        "Good full-stack applications handle failure and empty results as normal states rather than unexpected exceptions."
    },

    {
      number: 15,
      title: "Development vs Production Configuration",
      intro:
        "A MERN application usually has different configuration requirements during local development and production.",
      points: [
        "Development commonly uses localhost services.",
        "Production uses deployed frontend and backend URLs.",
        "Production databases should use protected credentials.",
        "CORS origins must match the deployed frontend.",
        "Debug logging should be controlled in production.",
        "Environment-specific settings should not require source-code changes."
      ],
      code: `// Development
VITE_API_URL=http://localhost:5000/api

// Production
VITE_API_URL=https://api.example.com/api`,
      keyIdea:
        "Configuration should change between environments without changing the application architecture."
    },

    {
      number: 16,
      title: "MERN Error Handling Strategy",
      intro:
        "Errors can occur in the browser, network, Express layer, business logic or database. A complete application needs a consistent strategy for each layer.",
      points: [
        "Frontend should catch failed requests.",
        "API utilities should detect non-success HTTP responses.",
        "Express should use centralized error middleware.",
        "Services should throw meaningful application errors.",
        "Database errors should be translated into safe API responses.",
        "Unexpected technical details should remain in server logs."
      ],
      code: `app.use((error, req, res, next) => {
  console.error(error);

  const status = error.statusCode || 500;

  res.status(status).json({
    success: false,
    error: {
      message:
        status === 500
          ? "Internal server error"
          : error.message
    }
  });
});`,
      keyIdea:
        "Error handling should create a predictable boundary between internal technical details and public API responses."
    },

    {
      number: 17,
      title: "Complete MERN Architecture Checklist",
      intro:
        "Before moving to full-stack testing and production, verify that the major layers of the MERN application are separated and connected correctly.",
      points: [
        "React components handle presentation and user interaction.",
        "Frontend services handle API communication.",
        "Express routes define API endpoints.",
        "Middleware handles cross-cutting concerns.",
        "Controllers handle HTTP requests and responses.",
        "Services contain business logic.",
        "Mongoose models manage database operations.",
        "MongoDB stores persistent data.",
        "Environment variables hold environment-specific configuration.",
        "Authentication and authorization are enforced by the backend.",
        "Errors are handled consistently.",
        "API responses follow a documented contract.",
        "Development and production configuration are separated."
      ],
      code: `React UI
   |
   v
Frontend API Layer
   |
   v
HTTP / REST API
   |
   v
Express Routes
   |
   v
Middleware
   |
   v
Controllers
   |
   v
Services
   |
   v
Mongoose Models
   |
   v
MongoDB

Errors flow through
a controlled error boundary.`,
      keyIdea:
        "A production MERN application is a system of cooperating layers. Clear boundaries make the system easier to test, secure, deploy and maintain."
    }
  ],

  visualizer: {
    title: "Complete MERN Application Architecture",
    description:
      "Step through the complete lifecycle of a MERN request from a React user action to MongoDB and back.",
    steps: [
      {
        label: "User Action",
        detail:
          "The user clicks a button, submits a form or opens a page.",
        state: "request"
      },
      {
        label: "React Component",
        detail:
          "The component prepares the required data and triggers an API operation.",
        state: "frontend"
      },
      {
        label: "API Service",
        detail:
          "A reusable frontend service sends the HTTP request.",
        state: "api"
      },
      {
        label: "Express Route",
        detail:
          "The backend router matches the HTTP method and endpoint.",
        state: "route"
      },
      {
        label: "Middleware",
        detail:
          "Authentication, validation and other cross-cutting checks run.",
        state: "middleware"
      },
      {
        label: "Controller",
        detail:
          "The controller coordinates the HTTP operation.",
        state: "controller"
      },
      {
        label: "Service",
        detail:
          "Business rules are executed by the service layer.",
        state: "service"
      },
      {
        label: "Mongoose",
        detail:
          "The Mongoose model validates and executes the database operation.",
        state: "model"
      },
      {
        label: "MongoDB",
        detail:
          "MongoDB stores or retrieves the requested data.",
        state: "database"
      },
      {
        label: "API Response",
        detail:
          "The backend returns a structured JSON response.",
        state: "response"
      },
      {
        label: "React State",
        detail:
          "React updates state using the API result.",
        state: "state"
      },
      {
        label: "UI Update",
        detail:
          "The user sees the updated application interface.",
        state: "complete"
      }
    ]
  },

  trace: {
    title: "Trace a MERN Create Request",
    description:
      "Follow a student creation request from a React form through Express, Mongoose and MongoDB.",
    code: `POST /api/students

{
  "name": "Ravi",
  "email": "ravi@example.com"
}`,
    steps: [
      {
        line: 1,
        operation: "User submits form",
        explanation:
          "The React form collects the student's information."
      },
      {
        line: 2,
        operation: "React API service",
        explanation:
          "The frontend calls the student creation API."
      },
      {
        line: 3,
        operation: "HTTP POST",
        explanation:
          "The request is sent to POST /api/students."
      },
      {
        line: 4,
        operation: "Express route",
        explanation:
          "Express matches the student creation endpoint."
      },
      {
        line: 5,
        operation: "Middleware",
        explanation:
          "Authentication and request validation can run before the controller."
      },
      {
        line: 6,
        operation: "Controller",
        explanation:
          "The controller passes request data to the service layer."
      },
      {
        line: 7,
        operation: "Service",
        explanation:
          "Business rules are applied before persistence."
      },
      {
        line: 8,
        operation: "Mongoose validation",
        explanation:
          "The Student schema checks configured validation rules."
      },
      {
        line: 9,
        operation: "MongoDB",
        explanation:
          "Mongoose sends the insert operation to MongoDB."
      },
      {
        line: 10,
        operation: "Database result",
        explanation:
          "MongoDB returns the created document information."
      },
      {
        line: 11,
        operation: "JSON response",
        explanation:
          "Express returns a structured success response."
      },
      {
        line: 12,
        operation: "React state update",
        explanation:
          "React stores the returned student and updates the UI."
      }
    ]
  },

  revision: [
    [
      "MERN",
      "MongoDB, Express, React and Node.js used together as a full-stack application."
    ],
    [
      "API",
      "Interface through which software components communicate."
    ],
    [
      "REST",
      "Architectural style commonly used for HTTP resource-based APIs."
    ],
    [
      "Controller",
      "Backend layer responsible for coordinating HTTP requests and responses."
    ],
    [
      "Service",
      "Layer that commonly contains reusable business logic."
    ],
    [
      "Middleware",
      "Functions that execute during the request-response lifecycle."
    ],
    [
      "Mongoose",
      "ODM used by Node.js applications to work with MongoDB."
    ],
    [
      "CORS",
      "Browser security mechanism controlling cross-origin requests."
    ],
    [
      "Environment Variable",
      "External configuration value supplied to an application environment."
    ],
    [
      "API Contract",
      "Expected request and response structure shared between client and server."
    ],
    [
      "Authentication",
      "Process of establishing the identity associated with a request."
    ],
    [
      "Authorization",
      "Process of determining whether an authenticated user can perform an operation."
    ],
    [
      "Loading State",
      "UI state representing an operation that is still in progress."
    ],
    [
      "Error Boundary",
      "Controlled boundary where failures are converted into safe application behavior or responses."
    ]
  ],

  interview: [
    {
      question: "What are the four technologies in MERN?",
      answer:
        "MERN stands for MongoDB, Express, React and Node.js."
    },
    {
      question: "How does React communicate with Express?",
      answer:
        "React commonly communicates with Express through HTTP requests to REST-style or other API endpoints."
    },
    {
      question: "Why should API calls be separated from React components?",
      answer:
        "A separate API layer improves reuse, keeps components focused on UI behavior and centralizes HTTP-related logic."
    },
    {
      question: "What is the purpose of a controller?",
      answer:
        "A controller coordinates an HTTP request and response and commonly delegates business work to a service layer."
    },
    {
      question: "What is the purpose of a service layer?",
      answer:
        "The service layer commonly contains reusable business logic and coordinates operations involving models or other services."
    },
    {
      question: "Why should authentication be checked on the backend?",
      answer:
        "Frontend checks can improve user experience but cannot protect the API because browser code is controlled by the client. The backend must enforce authentication and authorization."
    },
    {
      question: "What is CORS?",
      answer:
        "CORS is a browser security mechanism that controls whether browser JavaScript from one origin can access resources on another origin."
    },
    {
      question: "Are frontend environment variables secret?",
      answer:
        "No. Values included in browser-delivered code should be considered visible to users. Private secrets must remain on the backend."
    },
    {
      question: "What is an API contract?",
      answer:
        "It is the expected structure and behavior of API requests and responses shared between the frontend and backend."
    },
    {
      question: "Why are loading and error states important?",
      answer:
        "Network operations are asynchronous and can fail or return no data. Explicit states let the interface communicate what is happening."
    },
    {
      question: "Why separate development and production configuration?",
      answer:
        "Different environments normally use different URLs, databases, credentials and security settings. External configuration allows the same application code to operate in different environments."
    },
    {
      question: "Where should MongoDB database logic normally live?",
      answer:
        "Database access is commonly handled by Mongoose models and service-layer code rather than being scattered throughout React components and route handlers."
    }
  ],

  practice: [
    {
      title: "Create an API Service",
      task:
        "Create a React API function that retrieves all students from GET /api/students and throws an error for a failed response.",
      hint:
        "Use fetch(), check response.ok and return response.json().",
      answer:
        `const API_URL = "http://localhost:5000/api";

export async function getStudents() {
  const response = await fetch(
    API_URL + "/students"
  );

  if (!response.ok) {
    throw new Error("Failed to load students");
  }

  return response.json();
}`
    },
    {
      title: "POST from React",
      task:
        "Create an API function that sends a new student to POST /api/students.",
      hint:
        "Use method POST, JSON.stringify() and Content-Type.",
      answer:
        `export async function createStudent(student) {
  const response = await fetch(
    API_URL + "/students",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create student");
  }

  return response.json();
}`
    },
    {
      title: "Express Route",
      task:
        "Create an Express POST route for /students that calls createStudent.",
      hint:
        "Use router.post().",
      answer:
        `router.post(
  "/students",
  createStudent
);`
    },
    {
      title: "Service Function",
      task:
        "Create a service function that uses the Student Mongoose model to create a student.",
      hint:
        "The service should receive data and call Student.create().",
      answer:
        `async function createStudent(data) {
  return Student.create(data);
}`
    },
    {
      title: "Loading State",
      task:
        "Write a React conditional that displays Loading... while loading is true.",
      hint:
        "Use a simple conditional return.",
      answer:
        `if (loading) {
  return <p>Loading...</p>;
}`
    },
    {
      title: "Error Response",
      task:
        "Create an Express error response containing success false and an error message.",
      hint:
        "Use res.status() and res.json().",
      answer:
        `res.status(400).json({
  success: false,
  error: {
    message: "Invalid request"
  }
});`
    },
    {
      title: "Protect a Route",
      task:
        "Protect GET /profile using requireAuth middleware.",
      hint:
        "Place middleware between the route path and controller.",
      answer:
        `router.get(
  "/profile",
  requireAuth,
  getProfile
);`
    },
    {
      title: "MERN Flow",
      task:
        "Write the correct order of the major layers for a database-backed React request.",
      hint:
        "Start at React and finish at MongoDB.",
      answer:
        `React
→ API Service
→ Express Route
→ Middleware
→ Controller
→ Service
→ Mongoose
→ MongoDB`
    }
  ],

  quiz: [
    {
      question: "What does MERN stand for?",
      options: [
        "MongoDB, Express, React, Node.js",
        "MySQL, Express, Redux, Next.js",
        "MongoDB, Electron, React, Nginx",
        "MariaDB, Express, React, Node.js"
      ],
      answer: 0,
      explanation:
        "MERN stands for MongoDB, Express, React and Node.js."
    },
    {
      question: "Which technology is primarily responsible for the user interface?",
      options: [
        "MongoDB",
        "Express",
        "React",
        "Mongoose"
      ],
      answer: 2,
      explanation:
        "React is the frontend UI library in the MERN stack."
    },
    {
      question: "Which HTTP method is commonly used to create a resource?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "OPTIONS"
      ],
      answer: 1,
      explanation:
        "POST is commonly used to create resources."
    },
    {
      question: "Where should reusable business logic commonly be placed?",
      options: [
        "Service layer",
        "CSS file",
        "HTML document",
        "Browser address bar"
      ],
      answer: 0,
      explanation:
        "The service layer commonly contains reusable business logic."
    },
    {
      question: "What is CORS primarily related to?",
      options: [
        "Database indexing",
        "Browser cross-origin requests",
        "Password hashing",
        "React rendering"
      ],
      answer: 1,
      explanation:
        "CORS controls browser cross-origin resource access."
    },
    {
      question: "Can frontend environment variables contain private backend secrets?",
      options: [
        "Yes, always",
        "Yes, if the variable is long",
        "No, browser-delivered values should be considered visible",
        "Only during production"
      ],
      answer: 2,
      explanation:
        "Frontend values can be exposed in browser-delivered code, so private secrets belong on the backend."
    },
    {
      question: "What should the backend use to protect sensitive API operations?",
      options: [
        "Only CSS",
        "Only frontend route hiding",
        "Authentication and authorization checks",
        "Only browser local state"
      ],
      answer: 2,
      explanation:
        "The backend must enforce authentication and authorization."
    },
    {
      question: "What does response.ok indicate in fetch?",
      options: [
        "Whether the HTTP response status is in the successful range",
        "Whether MongoDB is running",
        "Whether React rendered",
        "Whether CSS loaded"
      ],
      answer: 0,
      explanation:
        "response.ok is true when the HTTP status is in the successful range."
    },
    {
      question: "Which layer commonly interacts with Mongoose models?",
      options: [
        "Service layer",
        "CSS layer",
        "Browser DOM",
        "HTML parser"
      ],
      answer: 0,
      explanation:
        "Services commonly coordinate business logic and database model operations."
    },
    {
      question: "What should a frontend display when an API request is still running?",
      options: [
        "A loading state",
        "A database password",
        "A stack trace",
        "Nothing in every case"
      ],
      answer: 0,
      explanation:
        "A loading state gives the user feedback while the asynchronous operation is in progress."
    },
    {
      question: "Which component should be the final authority for API authorization?",
      options: [
        "React component",
        "Browser CSS",
        "Backend server",
        "Browser title"
      ],
      answer: 2,
      explanation:
        "The backend must enforce authorization because frontend code cannot be trusted as the security boundary."
    },
    {
      question: "Why use a consistent API response structure?",
      options: [
        "To make frontend integration predictable",
        "To make MongoDB faster automatically",
        "To replace authentication",
        "To remove HTTP methods"
      ],
      answer: 0,
      explanation:
        "Predictable API contracts make frontend and backend integration easier."
    }
  ],

  glossary: [
    {
      term: "MERN",
      definition:
        "Full-stack technology combination of MongoDB, Express, React and Node.js."
    },
    {
      term: "REST API",
      definition:
        "HTTP-based API design commonly organized around resources and standard HTTP methods."
    },
    {
      term: "API Service",
      definition:
        "Frontend module responsible for reusable communication with backend APIs."
    },
    {
      term: "Controller",
      definition:
        "Backend component that coordinates HTTP request and response handling."
    },
    {
      term: "Service Layer",
      definition:
        "Application layer containing reusable business logic."
    },
    {
      term: "Middleware",
      definition:
        "Function that executes during the Express request-response lifecycle."
    },
    {
      term: "CORS",
      definition:
        "Browser mechanism controlling cross-origin HTTP access."
    },
    {
      term: "Authentication",
      definition:
        "Process of establishing the identity associated with a request."
    },
    {
      term: "Authorization",
      definition:
        "Process of determining whether an authenticated identity may perform an operation."
    },
    {
      term: "API Contract",
      definition:
        "Agreed structure and behavior of frontend-backend requests and responses."
    },
    {
      term: "Environment Variable",
      definition:
        "Configuration value supplied externally to an application environment."
    },
    {
      term: "Loading State",
      definition:
        "Frontend state indicating that an asynchronous operation is still running."
    },
    {
      term: "Error State",
      definition:
        "Frontend state representing a failed operation."
    },
    {
      term: "Mongoose Model",
      definition:
        "Application interface for working with a MongoDB collection through Mongoose."
    }
  ],

  completion: {
    title: "MERN Architecture Complete!",
    message:
      "You have connected the major pieces of the MERN stack conceptually and architecturally. You now understand how React, Express, Node.js, Mongoose and MongoDB communicate, how API contracts work, how authentication fits into the request flow, and how a production-oriented full-stack application should separate responsibilities.",
    achievements: [
      "MERN architecture completed",
      "Complete request-response lifecycle completed",
      "Professional project structure completed",
      "React API integration completed",
      "REST API methods completed",
      "Express route-controller-service architecture completed",
      "Consistent API responses completed",
      "Environment configuration completed",
      "CORS concepts completed",
      "MERN authentication flow completed",
      "Backend route protection completed",
      "Mongoose and Express integration completed",
      "Loading and error states completed",
      "Development vs production configuration completed",
      "Full-stack error handling completed"
    ],
    nextLevel:
      "Level 28 — Full-Stack Testing & Production"
  }
};
