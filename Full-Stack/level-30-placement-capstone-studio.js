"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[30] = {
n: 30,
kicker: "PART 6 • PRODUCTION MERN • LEVEL 30",
title: "Placement Capstone Studio",
summary:
"Build, explain, test, deploy and defend a complete MERN application using the engineering skills developed throughout the course.",
duration: "100–140 min",
difficulty: "Advanced Beginner → Intermediate",
concepts: 18,

outcomes: [
"Convert a real-world problem into clear application requirements.",
"Design a complete MERN architecture before writing code.",
"Create a practical MongoDB data model and API contract.",
"Organize React, Express, Node.js and Mongoose modules cleanly.",
"Implement authentication, authorization, validation and error handling.",
"Design frontend state and API boundaries.",
"Plan unit, integration and end-to-end testing.",
"Prepare an application for deployment and observability.",
"Write professional project documentation and a strong README.",
"Present and defend the project during interviews or placement evaluations.",
"Explain technical decisions, trade-offs and future improvements.",
"Turn the completed project into a portfolio-ready engineering story."
],

sections: [
{
number: 1,
title: "Capstone Mindset & Requirements",
intro:
"A capstone project is not simply a collection of pages. It should demonstrate that you can understand a problem, design a solution, implement it systematically and explain your engineering decisions.",
points: [
"Start with a real problem rather than starting with technologies.",
"Identify users, responsibilities and important workflows.",
"Separate must-have requirements from optional enhancements.",
"Define success criteria before implementation.",
"Keep the first version small enough to finish.",
"Document assumptions and constraints."
],
code: `const project = {
problem: "Manage student placement activities",
users: ["student", "recruiter", "admin"],
coreFeatures: [
"authentication",
"student profiles",
"job postings",
"applications",
"placement dashboard"
],
successCriteria: [
"secure",
"usable",
"tested",
"deployable"
]
};

console.log(project);`,
keyIdea:
"A strong capstone begins with a clear problem, users and measurable requirements."
},

```
{
  number: 2,
  title: "Problem Statement & User Roles",
  intro:
    "For this course capstone, consider a Placement Management Platform that connects students, recruiters and administrators.",
  points: [
    "Students can create profiles and view suitable opportunities.",
    "Recruiters can publish openings and review applications.",
    "Administrators can manage users, opportunities and placement records.",
    "Each role should have only the permissions it needs.",
    "Role-based access should be enforced on the backend.",
    "The frontend should reflect permissions but must not be the only security boundary."
  ],
  comparison: {
    leftTitle: "Authentication",
    left: "Who are you?",
    rightTitle: "Authorization",
    right: "What are you allowed to do?"
  },
  code: `const roles = {
```

student: [
"viewJobs",
"apply",
"manageProfile"
],
recruiter: [
"createJob",
"viewApplications"
],
admin: [
"manageUsers",
"manageJobs",
"viewReports"
]
};

console.log(roles);`,
keyIdea:
"Authentication identifies a user; authorization controls that user's permitted actions."
},

```
{
  number: 3,
  title: "Functional & Non-Functional Requirements",
  intro:
    "Professional projects need both functional requirements and quality requirements.",
  points: [
    "Functional requirements describe what the system does.",
    "Non-functional requirements describe how well the system should operate.",
    "Security, performance, reliability and usability are important non-functional requirements.",
    "Requirements should be testable whenever possible.",
    "Avoid adding features simply because a technology makes them possible."
  ],
  code: `const requirements = {
```

functional: [
"register",
"login",
"createProfile",
"createJob",
"applyForJob",
"trackApplication"
],
nonFunctional: [
"secure authentication",
"validated input",
"consistent errors",
"responsive UI",
"acceptable response time"
]
};

console.log(requirements);`,
keyIdea:
"A project is complete when its important requirements are satisfied, not when every possible feature is added."
},

```
{
  number: 4,
  title: "Architecture & Module Boundaries",
  intro:
    "Before implementation, divide the application into understandable boundaries.",
  points: [
    "React handles presentation and user interaction.",
    "The API client handles communication with the backend.",
    "Express handles HTTP routing and middleware.",
    "Controllers translate HTTP requests into application operations.",
    "Services contain reusable business logic.",
    "Mongoose handles database models and persistence.",
    "MongoDB stores application data.",
    "Authentication and security should cross the appropriate boundaries."
  ],
  code: `Frontend
```

|
v
API Client
|
v
Express Routes
|
v
Controllers
|
v
Services
|
v
Mongoose
|
v
MongoDB

Security, validation, logging and testing
surround the application layers.`,
keyIdea:
"Good architecture makes responsibilities obvious and limits unnecessary coupling."
},

```
{
  number: 5,
  title: "Database Schema & Data Model",
  intro:
    "The database should represent the important entities and relationships in the problem domain.",
  points: [
    "Possible collections include users, profiles, jobs and applications.",
    "Users contain identity and authorization information.",
    "Profiles contain additional student or recruiter information.",
    "Jobs contain company, role, eligibility and deadline information.",
    "Applications connect users with jobs.",
    "References are useful when related records have independent lifecycles.",
    "Indexes should support important query patterns."
  ],
  code: `User
```

|
+---- Profile
|
+---- Application ----> Job
|
+---- Recruiter

Application fields:

* studentId
* jobId
* status
* appliedAt

Example status:
"applied" -> "shortlisted" -> "selected"`,
keyIdea:
"Model the domain first; then choose embedding, references and indexes according to actual access patterns."
},

```
{
  number: 6,
  title: "API Design",
  intro:
    "A capstone should expose a predictable API rather than scattering database operations throughout the frontend.",
  points: [
    "Use resource-oriented endpoints.",
    "Choose HTTP methods according to the operation.",
    "Validate request data before business logic.",
    "Return consistent response structures.",
    "Use meaningful HTTP status codes.",
    "Protect private endpoints with authentication middleware.",
    "Document important request and response examples."
  ],
  code: `GET    /api/jobs
```

GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id

POST   /api/applications
GET    /api/applications/me

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me`,
keyIdea:
"A good API is predictable, validated, secure and easy for another developer to consume."
},

```
{
  number: 7,
  title: "Authentication & Authorization",
  intro:
    "Authentication becomes especially important when different users have different permissions.",
  points: [
    "Register users securely.",
    "Hash passwords before storage.",
    "Authenticate login requests.",
    "Issue and validate authentication credentials.",
    "Protect private API routes.",
    "Check roles and ownership before sensitive operations.",
    "Never trust role information supplied only by the browser."
  ],
  code: `async function createJob(req, res, next) {
```

try {
if (!req.user) {
return res.status(401).json({
message: "Authentication required"
});
}

```
if (req.user.role !== "recruiter" &&
    req.user.role !== "admin") {
  return res.status(403).json({
    message: "Insufficient permission"
  });
}

// Create the job here.

res.status(201).json({
  message: "Job created"
});
```

} catch (error) {
next(error);
}
}`,
keyIdea:
"Security decisions must be enforced by the backend, even when the frontend already hides restricted controls."
},

```
{
  number: 8,
  title: "React Application Structure",
  intro:
    "A large React application becomes easier to maintain when UI responsibilities are separated into components and feature modules.",
  points: [
    "Create reusable layout components.",
    "Organize pages around application features.",
    "Keep feature-specific components close to their feature.",
    "Separate API communication from presentation components.",
    "Use controlled forms for important user input.",
    "Represent loading, error, empty and success states explicitly."
  ],
  code: `src/
```

components/
layouts/
pages/
features/
auth/
jobs/
applications/
profile/
services/
api.js
hooks/
context/
utils/
tests/
App.jsx
main.jsx`,
keyIdea:
"Feature-oriented organization helps a project grow without turning every file into a global dependency."
},

```
{
  number: 9,
  title: "State & API Management",
  intro:
    "React state should have clear ownership. Not every value needs to be global.",
  points: [
    "Local UI state belongs close to the component that uses it.",
    "Shared application state can use Context or another state solution.",
    "Server data should be treated differently from temporary UI state.",
    "Keep API calls behind a consistent client layer.",
    "Handle loading, success, empty and error states.",
    "Avoid duplicating the same server data unnecessarily."
  ],
  code: `async function loadJobs() {
```

setLoading(true);
setError("");

try {
const response = await api.get("/jobs");
setJobs(response.data);
} catch (error) {
setError("Unable to load jobs");
} finally {
setLoading(false);
}
}`,
keyIdea:
"Clear state ownership reduces bugs and makes frontend behavior easier to reason about."
},

```
{
  number: 10,
  title: "Backend Implementation Strategy",
  intro:
    "Build backend features in vertical slices so each important workflow can be completed and tested end-to-end.",
  points: [
    "Start with one complete feature.",
    "Create the model.",
    "Create validation rules.",
    "Create service logic.",
    "Create the controller.",
    "Connect the route.",
    "Add authentication and authorization.",
    "Test the endpoint.",
    "Connect the React interface."
  ],
  code: `Feature:
```

"Create Job"

Model
-> Validation
-> Service
-> Controller
-> Route
-> Auth Middleware
-> API Test
-> React Form`,
keyIdea:
"A vertical feature slice gives you working software earlier than building every layer separately."
},

```
{
  number: 11,
  title: "Validation, Errors & Security",
  intro:
    "A portfolio project should demonstrate defensive programming rather than assuming every request is correct.",
  points: [
    "Validate required fields.",
    "Validate data types and ranges.",
    "Reject unexpected input where appropriate.",
    "Sanitize data according to the application's needs.",
    "Use centralized error handling.",
    "Avoid exposing stack traces or sensitive details.",
    "Use secure configuration and environment variables.",
    "Apply appropriate rate limiting and security headers."
  ],
  code: `function validateJob(input) {
```

if (!input.title || input.title.trim() === "") {
throw new Error("Job title is required");
}

if (!input.company || input.company.trim() === "") {
throw new Error("Company is required");
}

if (!Number.isInteger(input.openings) ||
input.openings < 1) {
throw new Error("Openings must be a positive integer");
}

return true;
}`,
keyIdea:
"Treat every external input as untrusted until it passes the required validation and authorization checks."
},

```
{
  number: 12,
  title: "Testing Strategy",
  intro:
    "Testing demonstrates that the application works intentionally rather than accidentally.",
  points: [
    "Unit-test pure business logic.",
    "Test API endpoints through integration tests.",
    "Test important React components and user interactions.",
    "Test authentication and authorization behavior.",
    "Test validation and error cases.",
    "Use end-to-end tests for critical user workflows.",
    "Run tests automatically before deployment."
  ],
  code: `describe("job validation", () => {
```

it("rejects a missing title", () => {
expect(() => {
validateJob({
company: "Example",
openings: 2
});
}).toThrow();
});

it("accepts valid data", () => {
expect(
validateJob({
title: "Software Engineer",
company: "Example",
openings: 2
})
).toBe(true);
});
});`,
keyIdea:
"Test both successful paths and failure paths because production systems encounter both."
},

```
{
  number: 13,
  title: "Deployment & Observability",
  intro:
    "A project becomes much more credible when you can explain how it moves from source code to a running production system.",
  points: [
    "Build the React application for production.",
    "Configure production environment variables.",
    "Deploy the backend and frontend.",
    "Connect the production database securely.",
    "Use HTTPS.",
    "Monitor application health.",
    "Collect useful logs and metrics.",
    "Prepare backups and recovery procedures."
  ],
  code: `Developer
```

|
v
Git Repository
|
v
CI Checks
|
+---- Tests
+---- Build
|
v
Production
|
+---- Frontend
+---- API
+---- MongoDB
+---- Logs
+---- Metrics
+---- Alerts`,
keyIdea:
"Deployment is part of software engineering, not an afterthought added after coding."
},

```
{
  number: 14,
  title: "Performance & Production Hardening",
  intro:
    "Before presenting a project, identify unnecessary work, expensive queries and avoidable failure points.",
  points: [
    "Optimize database queries and indexes.",
    "Avoid unnecessary API requests.",
    "Paginate large datasets.",
    "Optimize React rendering where measurement justifies it.",
    "Compress and cache appropriate assets.",
    "Use production builds.",
    "Protect expensive endpoints.",
    "Measure before making performance claims."
  ],
  code: `GET /api/jobs?page=2&limit=20
```

Database:
filter
-> index
-> sort
-> limit

Frontend:
request
-> loading
-> data
-> render

Goal:
Do useful work once and avoid unnecessary repeated work.`,
keyIdea:
"Production hardening combines performance, security, reliability and controlled failure behavior."
},

```
{
  number: 15,
  title: "Documentation & README",
  intro:
    "A strong README allows another developer or interviewer to understand the project without asking you basic questions.",
  points: [
    "Explain the problem.",
    "Describe major features.",
    "Show the technology stack.",
    "Include architecture information.",
    "Document installation steps.",
    "Document environment variables without exposing secrets.",
    "Explain important API endpoints.",
    "Describe testing.",
    "Explain deployment.",
    "Include screenshots or a short demonstration when appropriate.",
    "Mention limitations and future improvements."
  ],
  code: `# Placement Management Platform
```

## Problem

Manage student placement workflows.

## Stack

React
Node.js
Express
MongoDB
Mongoose

## Features

* Authentication
* Profiles
* Job postings
* Applications
* Dashboards

## Testing

Unit + integration + end-to-end

## Deployment

Frontend + API + MongoDB`,
keyIdea:
"Documentation turns a code repository into a project that other people can understand and evaluate."
},

```
{
  number: 16,
  title: "Portfolio Presentation & Demo",
  intro:
    "The project should tell a clear engineering story when presented in a placement interview.",
  points: [
    "Start with the problem, not the technology list.",
    "Explain who uses the system.",
    "Show the architecture.",
    "Demonstrate one important workflow from beginning to end.",
    "Explain one meaningful technical challenge.",
    "Describe how you tested the system.",
    "Explain security decisions.",
    "Explain deployment and monitoring.",
    "Be honest about limitations.",
    "Show what you would improve with more time."
  ],
  code: `Presentation Flow:
```

1. Problem
2. Users
3. Requirements
4. Architecture
5. Database
6. API
7. Frontend
8. Security
9. Testing
10. Deployment
11. Demo
12. Challenges
13. Future Improvements`,
    keyIdea:
    "A good project presentation demonstrates understanding, not memorization."
    },

    {
    number: 17,
    title: "Project Defence & Viva",
    intro:
    "Project defence questions test whether you understand the decisions behind your implementation.",
    points: [
    "Be able to explain every major technology used.",
    "Know why MongoDB was selected for the project.",
    "Explain why the API is separated from React.",
    "Explain authentication and authorization separately.",
    "Explain your most important database indexes.",
    "Explain how errors are handled.",
    "Explain how you tested the application.",
    "Explain how the application is deployed.",
    "Explain one trade-off you made.",
    "Explain what you would redesign at larger scale."
    ],
    code: `Interviewer:
    "Why did you separate controllers and services?"

Strong answer structure:

1. State the responsibility of each layer.
2. Explain how separation improves maintenance.
3. Give an example from the project.
4. Mention the trade-off.
5. Explain how tests benefit from the separation.`,
   keyIdea:
   "In a defence, explain reasoning and trade-offs instead of only describing code."
   },

   {
   number: 18,
   title: "Final Placement Checklist",
   intro:
   "Use this checklist before publishing the capstone or presenting it during a placement interview.",
   points: [
   "Problem statement is clear.",
   "Requirements are documented.",
   "Architecture is understandable.",
   "Database schema is documented.",
   "API endpoints are documented.",
   "Authentication works securely.",
   "Authorization is enforced on the backend.",
   "Input validation is implemented.",
   "Errors are handled consistently.",
   "Important workflows are tested.",
   "Environment variables are protected.",
   "Production deployment works.",
   "Health checks and logs are available.",
   "README is complete.",
   "Screenshots or demo material are ready.",
   "Git history is understandable.",
   "Project limitations are documented.",
   "Interview questions have been practiced."
   ],
   code: `const finalChecklist = [
   "problem",
   "requirements",
   "architecture",
   "database",
   "api",
   "authentication",
   "authorization",
   "validation",
   "testing",
   "deployment",
   "observability",
   "documentation",
   "demo",
   "defence"
   ];

const ready = finalChecklist.every(Boolean);

console.log(
ready
? "Capstone ready for presentation"
: "Complete the missing areas"
);`,
keyIdea:
"A placement-ready project is more than working code: it includes architecture, quality, documentation and the ability to defend your decisions."
}
],

visualizer: {
title: "MERN Capstone Architecture",
description:
"Follow a complete feature from the original problem through the frontend, backend, database and production systems.",
nodes: [
"Problem & Requirements",
"UX & React",
"API Client",
"Express Routes",
"Middleware",
"Authentication",
"Controllers",
"Services",
"Mongoose",
"MongoDB",
"Response",
"React State",
"UI Update"
],
flow: [
"Problem & Requirements",
"UX & React",
"API Client",
"Express Routes",
"Middleware",
"Authentication",
"Controllers",
"Services",
"Mongoose",
"MongoDB",
"Response",
"React State",
"UI Update"
]
},

trace: {
title: "Trace a Capstone Feature End-to-End",
description:
"Trace a student applying for a placement opportunity from the browser to MongoDB and back.",
steps: [
{
line: 1,
label: "User Action",
detail: "Student clicks Apply on a job."
},
{
line: 2,
label: "React Component",
detail: "The component validates local UI state and starts the request."
},
{
line: 3,
label: "API Client",
detail: "The frontend sends a POST request to the applications endpoint."
},
{
line: 4,
label: "HTTPS",
detail: "The request travels securely to the production API."
},
{
line: 5,
label: "Express Middleware",
detail: "Security, parsing and request middleware process the request."
},
{
line: 6,
label: "Authentication",
detail: "The server verifies the user's authentication credentials."
},
{
line: 7,
label: "Authorization",
detail: "The server confirms that the user is allowed to apply."
},
{
line: 8,
label: "Controller",
detail: "The controller receives the validated request."
},
{
line: 9,
label: "Service",
detail: "Business rules such as duplicate-application checks are executed."
},
{
line: 10,
label: "Mongoose",
detail: "Mongoose validates and prepares the database operation."
},
{
line: 11,
label: "MongoDB",
detail: "The application record is stored."
},
{
line: 12,
label: "API Response",
detail: "The backend returns a consistent success response."
},
{
line: 13,
label: "React State",
detail: "The frontend updates application state."
},
{
line: 14,
label: "UI Update",
detail: "The student sees the updated application status."
},
{
line: 15,
label: "Observability",
detail: "Logs and metrics record useful information about the request."
}
]
},

revision: [
["Capstone", "A substantial project that demonstrates integrated skills."],
["Requirement", "A capability or quality the system must satisfy."],
["Architecture", "The high-level structure and relationships between system components."],
["Module Boundary", "A defined responsibility boundary between parts of an application."],
["Authentication", "The process of verifying a user's identity."],
["Authorization", "The process of determining what an authenticated user may do."],
["API Contract", "An agreed structure for requests, responses and endpoint behavior."],
["Controller", "A layer that handles HTTP-level request and response concerns."],
["Service", "A layer containing reusable application or business logic."],
["Data Model", "The structure used to represent application data and relationships."],
["Validation", "Checking whether input satisfies required rules."],
["Integration Test", "A test that verifies multiple components working together."],
["End-to-End Test", "A test that verifies a complete user workflow."],
["Deployment", "The process of making an application available in an environment."],
["Observability", "Understanding system behavior through logs, metrics and related signals."],
["README", "Project documentation that explains how to understand and use the repository."],
["Trade-off", "A design decision where improving one property may affect another."],
["Project Defence", "The process of explaining and justifying implementation decisions."]
],

interview: [
{
question: "Explain the architecture of your MERN capstone.",
answer:
"Describe React on the frontend, the API client, Express routes and middleware, controllers and services, Mongoose and MongoDB, followed by authentication, testing, deployment and observability."
},
{
question: "Why did you choose MERN for the project?",
answer:
"Explain the suitability of JavaScript across the application, React's component model, Express's API capabilities and MongoDB's document-oriented model. Relate the answer to the project's actual requirements."
},
{
question: "Why should React not connect directly to MongoDB?",
answer:
"The backend should enforce authentication, authorization, validation and business rules and should control access to the database."
},
{
question: "What is the difference between authentication and authorization?",
answer:
"Authentication verifies identity. Authorization determines which actions an authenticated user is permitted to perform."
},
{
question: "Why do you need backend authorization if the frontend hides buttons?",
answer:
"Frontend controls are for user experience, not security. A malicious client can send requests directly to the API, so the backend must enforce permissions."
},
{
question: "Why separate controllers and services?",
answer:
"Controllers can focus on HTTP concerns while services contain reusable application logic. This improves organization, testing and maintainability."
},
{
question: "How did you design your MongoDB collections?",
answer:
"Start with domain entities and important access patterns, then decide where embedding, references and indexes make sense."
},
{
question: "When would you embed data in MongoDB?",
answer:
"Embedding is useful when related data is frequently accessed together, has a suitable size and does not require an independent lifecycle."
},
{
question: "When would you use references?",
answer:
"References are useful when related documents are large, independently managed, shared across records or need separate lifecycles."
},
{
question: "How did you handle validation?",
answer:
"Validate incoming data at the API boundary and apply model-level constraints where appropriate, while keeping business rules in the application layer."
},
{
question: "How did you handle errors?",
answer:
"Use predictable application errors, centralized Express error handling and safe production responses while logging useful diagnostic information."
},
{
question: "How would you test the project?",
answer:
"Use unit tests for isolated logic, integration tests for API and database workflows, component tests for important UI behavior and end-to-end tests for critical user journeys."
},
{
question: "How do you protect secrets?",
answer:
"Keep secrets in environment configuration or a secret-management system and never commit credentials to the repository."
},
{
question: "How would you improve the project for 100 times more users?",
answer:
"Measure bottlenecks first, then consider database indexing, pagination, caching, horizontal scaling, connection management, asynchronous processing and stronger observability where justified."
},
{
question: "What was the hardest technical problem in your project?",
answer:
"Explain one real problem, the evidence you collected, the options you considered, the solution you implemented and what you learned."
},
{
question: "What trade-off did you make?",
answer:
"Choose a real decision such as implementation simplicity versus abstraction, embedding versus references, or feature scope versus delivery time."
},
{
question: "How is your project deployed?",
answer:
"Explain the frontend build, backend deployment, environment configuration, database connection, HTTPS, health checks, logs and monitoring."
},
{
question: "What would you improve if you had another month?",
answer:
"Identify concrete improvements such as stronger testing, accessibility, performance, analytics, security hardening, better UX or additional domain features."
}
],

practice: [
{
title: "Write the Problem Statement",
task:
"Write a one-page problem statement for a Placement Management Platform.",
hint:
"Include the current problem, users, major pain points and expected outcome.",
answer:
"A good answer clearly identifies students, recruiters and administrators and explains the placement workflow the system will simplify."
},
{
title: "Design the Architecture",
task:
"Draw the frontend, API, backend, database and observability boundaries.",
hint:
"Start with React and finish with MongoDB.",
answer:
"React → API client → Express → middleware → controller → service → Mongoose → MongoDB, with security, testing, logs and metrics around the system."
},
{
title: "Design the Database",
task:
"Design collections for users, jobs and applications.",
hint:
"Think about relationships and query patterns.",
answer:
"Users identify students/recruiters/admins, jobs belong to recruiters, and applications connect students to jobs with status and timestamps."
},
{
title: "Design the API",
task:
"Create endpoints for job listing, job creation and applying for a job.",
hint:
"Use HTTP methods according to the operation.",
answer:
"GET /api/jobs, POST /api/jobs and POST /api/applications are appropriate starting points."
},
{
title: "Add Authorization",
task:
"Define which roles can create jobs and which can apply.",
hint:
"Do not enforce this only in React.",
answer:
"Recruiters/admins can create jobs; students can apply. The backend must enforce these permissions."
},
{
title: "Create Test Cases",
task:
"Write positive and negative test cases for applying to a job.",
hint:
"Include authentication and duplicate applications.",
answer:
"Test valid application, unauthenticated request, unauthorized role, invalid job ID, missing fields and duplicate application."
},
{
title: "Prepare Deployment",
task:
"Create a production deployment checklist.",
hint:
"Include secrets, database, HTTPS, health checks and logs.",
answer:
"Build, environment variables, production database, secure transport, health endpoint, logging, monitoring, backup and rollback planning."
},
{
title: "Write the README",
task:
"Create the major headings for the capstone README.",
hint:
"Think like a new developer opening your repository.",
answer:
"Problem, features, stack, architecture, setup, environment variables, API, testing, deployment, screenshots, limitations and future work."
},
{
title: "Prepare a Demo",
task:
"Create a five-minute project demonstration.",
hint:
"Show one complete user workflow.",
answer:
"Introduce the problem, show login, demonstrate one major workflow, explain the architecture and finish with testing/deployment."
},
{
title: "Prepare Defence Answers",
task:
"Write answers to five technical questions about your own implementation.",
hint:
"Explain why, not only what.",
answer:
"Each answer should connect a technical decision to a requirement, implementation detail, trade-off or measurable result."
}
],

quiz: [
{
question: "What should normally come before implementation of a capstone?",
options: [
"Deploying MongoDB",
"Defining the problem and requirements",
"Installing a UI library",
"Writing CSS"
],
answer: 1,
explanation:
"Clear requirements provide direction for architecture and implementation."
},
{
question: "Which layer should normally contain HTTP-specific request and response handling?",
options: [
"Database",
"Controller",
"MongoDB",
"React CSS"
],
answer: 1,
explanation:
"Controllers are commonly responsible for HTTP-level concerns."
},
{
question: "Where should backend authorization be enforced?",
options: [
"Only in CSS",
"Only in React",
"On the server",
"Only in README"
],
answer: 2,
explanation:
"The server is the security boundary for protected API operations."
},
{
question: "Which technology stores the documents in this MERN architecture?",
options: [
"React",
"Express",
"MongoDB",
"CSS"
],
answer: 2,
explanation:
"MongoDB is the database in the MERN stack."
},
{
question: "What is the primary purpose of an API contract?",
options: [
"Define UI colors",
"Define predictable request and response behavior",
"Store passwords",
"Replace testing"
],
answer: 1,
explanation:
"An API contract makes communication between clients and servers predictable."
},
{
question: "Why should secrets not be committed to Git?",
options: [
"They make React slower",
"They can expose sensitive credentials",
"They break CSS",
"They prevent MongoDB indexing"
],
answer: 1,
explanation:
"Repository history can expose credentials to unauthorized users."
},
{
question: "Which test is most suitable for a complete user workflow?",
options: [
"Unit test",
"End-to-end test",
"Lint rule",
"CSS test"
],
answer: 1,
explanation:
"End-to-end tests exercise a complete workflow through the application."
},
{
question: "What is a useful purpose of database indexes?",
options: [
"Improve relevant query performance",
"Replace authentication",
"Create React components",
"Encrypt passwords"
],
answer: 0,
explanation:
"Indexes can improve query performance when they match important access patterns."
},
{
question: "Which is a non-functional requirement?",
options: [
"User can apply for a job",
"User can create a profile",
"Application provides secure authentication",
"Recruiter can create a job"
],
answer: 2,
explanation:
"Security is a quality attribute rather than a direct business action."
},
{
question: "What does observability help you understand?",
options: [
"Only CSS layout",
"System behavior using signals such as logs and metrics",
"Only database names",
"Only Git branches"
],
answer: 1,
explanation:
"Observability helps engineers understand what a running system is doing."
},
{
question: "Why is a README important for a placement project?",
options: [
"It replaces source code",
"It explains the project to other developers and evaluators",
"It stores passwords",
"It automatically fixes bugs"
],
answer: 1,
explanation:
"Good documentation makes the project easier to understand and evaluate."
},
{
question: "What should you discuss when explaining a technical trade-off?",
options: [
"Only the final code",
"The alternatives, reasoning and consequences",
"Only the project title",
"Only the programming language"
],
answer: 1,
explanation:
"A trade-off explanation demonstrates engineering reasoning."
},
{
question: "Why should the frontend not be considered the security boundary?",
options: [
"Users can bypass browser UI and call APIs directly",
"React cannot display buttons",
"CSS is insecure",
"MongoDB cannot store roles"
],
answer: 0,
explanation:
"Clients can be manipulated, so protected operations must be secured on the server."
},
{
question: "What should you do before making performance claims?",
options: [
"Guess",
"Measure relevant behavior",
"Remove all tests",
"Disable logging"
],
answer: 1,
explanation:
"Measurement helps identify actual bottlenecks and prevents unsupported claims."
},
{
question: "What makes a capstone placement-ready?",
options: [
"Only a large number of files",
"Working code plus architecture, quality, documentation and defendable decisions",
"Only attractive colors",
"Only a deployed URL"
],
answer: 1,
explanation:
"A placement project demonstrates engineering ability across implementation, quality and communication."
}
],

glossary: [
{
term: "Capstone",
definition:
"A substantial project that integrates skills learned throughout a course."
},
{
term: "Requirement",
definition:
"A capability or quality the system is expected to satisfy."
},
{
term: "Architecture",
definition:
"The structure and relationships between major application components."
},
{
term: "Module Boundary",
definition:
"A defined responsibility boundary between software components."
},
{
term: "API Contract",
definition:
"A documented agreement describing how clients and servers communicate."
},
{
term: "Authentication",
definition:
"Verification of a user's identity."
},
{
term: "Authorization",
definition:
"Determination of which actions a user is permitted to perform."
},
{
term: "Controller",
definition:
"A layer that handles HTTP requests and responses."
},
{
term: "Service",
definition:
"A layer that contains reusable business or application logic."
},
{
term: "Data Model",
definition:
"The structure used to represent application data."
},
{
term: "Validation",
definition:
"Checking whether incoming data satisfies defined rules."
},
{
term: "Unit Test",
definition:
"A test focused on a small isolated unit of behavior."
},
{
term: "Integration Test",
definition:
"A test that verifies multiple components working together."
},
{
term: "End-to-End Test",
definition:
"A test that verifies a complete application workflow."
},
{
term: "Deployment",
definition:
"Making an application available in a target environment."
},
{
term: "Observability",
definition:
"Understanding system behavior through logs, metrics and related signals."
},
{
term: "Trade-off",
definition:
"A decision where improving one property can involve a cost elsewhere."
},
{
term: "Project Defence",
definition:
"Explaining and justifying the technical decisions behind a project."
}
],

completion: {
title: "Placement Capstone Complete!",
message:
"Congratulations! You have reached the final level of the CodeBhavya Full Stack / MERN course. You have moved from web fundamentals through JavaScript, React, Node.js, Express, MongoDB and production engineering to a complete capstone workflow. You can now design, implement, test, deploy, document and defend a MERN application.",
achievements: [
"Problem analysis and requirements",
"MERN architecture design",
"React application structure",
"API and backend architecture",
"MongoDB data modeling",
"Mongoose data layer",
"Authentication and authorization",
"Validation and secure error handling",
"Frontend state and API management",
"Testing strategy",
"Production deployment",
"Logging and observability",
"Performance and production hardening",
"Professional README documentation",
"Portfolio presentation",
"Project defence and interview preparation",
"End-to-end MERN engineering",
"Completion of the full 30-level CodeBhavya MERN course"
],
nextLevel:
"Course Complete — Continue Building Your MERN Portfolio"
}
};
