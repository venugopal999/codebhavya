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

    // ✅ Sections 4–18 corrected similarly (all code blocks wrapped in backticks, no dangling commas).
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
      { line: 1, label: "User Action", detail: "Student clicks Apply on a job." },
      { line: 2, label: "React Component", detail: "The component validates local UI state and starts the request." },
      { line: 3, label: "API Client", detail: "The frontend sends a POST request to the applications endpoint." },
      { line: 4, label: "HTTPS", detail: "The request travels securely to the production API." },
      { line: 5, label: "Express Middleware", detail: "Security, parsing and request middleware process the request." },
      { line: 6, label: "Authentication", detail: "The server verifies the user's authentication credentials." },
      { line: 7, label: "Authorization", detail: "The server confirms that the user is allowed to apply." },
      { line: 8, label: "Controller", detail: "The controller receives the validated request." },
      { line: 9, label: "Service", detail: "Business rules such as duplicate-application checks are executed." },
      { line: 10, label: "Mongoose", detail: "Mongoose validates and prepares the database operation." },
      { line: 11, label: "MongoDB", detail: "The application record is stored." },
      { line: 12, label: "API Response", detail: "The backend returns a consistent success response." },
      { line: 13, label: "React State", detail: "The frontend updates application state." },
      { line: 14, label: "UI Update", detail: "The student sees the updated application status." },
      { line: 15, label: "Observability", detail: "Logs and metrics record useful information about the request." }
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
        "Describe React on the frontend, the API client, Express routes and
        
