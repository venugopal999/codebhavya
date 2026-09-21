"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[28] = {
  n: 28,
  kicker: "PART 6 • PRODUCTION MERN • LEVEL 28",
  title: "Testing, Quality & CI",
  summary:
    "Learn how to test MERN applications at different levels, protect critical behavior with automated checks, and build a reliable continuous integration workflow.",
  duration: "75–95 min",
  difficulty: "Advanced Beginner",
  concepts: 17,

  outcomes: [
    "Understand why testing is essential in professional MERN applications.",
    "Distinguish unit, integration, component and end-to-end testing.",
    "Understand assertions, test cases, suites and test isolation.",
    "Test pure JavaScript functions.",
    "Test Express APIs and backend services.",
    "Understand mocking and dependency isolation.",
    "Test MongoDB-backed application behavior.",
    "Test React components and user interactions.",
    "Test forms, validation and asynchronous UI.",
    "Test authentication and authorization behavior.",
    "Understand end-to-end testing.",
    "Create a continuous integration workflow.",
    "Use quality checks before merging code.",
    "Understand test coverage and its limitations.",
    "Build a practical testing strategy for a MERN project."
  ],

  sections: [
    {
      number: 1,
      title: "Why Testing Matters",
      intro:
        "Testing gives developers a repeatable way to verify that application behavior matches expectations.",
      points: [
        "Manual testing is useful but difficult to repeat consistently.",
        "Automated tests can run after every change.",
        "Tests help detect regressions.",
        "Tests document expected behavior.",
        "Testing becomes especially important as an application grows.",
        "A good test suite gives developers confidence when refactoring."
      ],
      code: `function calculateTotal(price, quantity) {
  return price * quantity;
}

// Expected behavior

calculateTotal(100, 2);
// 200

calculateTotal(50, 4);
// 200

// A test can verify these expectations
// automatically after future code changes.`,
      keyIdea:
        "Tests are executable checks that protect important application behavior."
    },

    {
      number: 2,
      title: "Types of Testing",
      intro:
        "Different tests examine different boundaries of an application.",
      points: [
        "Unit tests focus on small isolated pieces of logic.",
        "Integration tests verify multiple components working together.",
        "Component tests verify UI behavior.",
        "End-to-end tests simulate realistic user workflows.",
        "No single testing type is sufficient for every application."
      ],
      comparison: {
        title: "Testing Levels",
        headers: ["Type", "Main Target", "Example"],
        rows: [
          ["Unit", "Small isolated function", "calculateTotal()"],
          ["Integration", "Multiple backend layers", "Route + controller + service"],
          ["Component", "React UI", "Login form"],
          ["End-to-End", "Complete workflow", "Login → dashboard → logout"]
        ]
      },
      code: `// Unit
test("calculateTotal returns correct value");

// Integration
test("POST /api/students creates a student");

// Component
test("login form displays validation message");

// End-to-End
test("user can login and open dashboard");`,
      keyIdea:
        "Testing levels answer different questions, from 'Does this function work?' to 'Does the complete user journey work?'"
    },

    {
      number: 3,
      title: "The Testing Pyramid",
      intro:
        "A practical test strategy normally contains many fast tests and fewer expensive full-system tests.",
      points: [
        "Unit tests are generally fast and numerous.",
        "Integration tests verify important boundaries.",
        "End-to-end tests are slower and more expensive.",
        "A balanced test suite provides both speed and confidence.",
        "The exact ratio depends on the application."
      ],
      code: `// Conceptual testing pyramid

          E2E
       /       \\
   Integration
   /           \\
      Unit Tests

// Many small tests
// Some integration tests
// Fewer broad E2E tests`,
      keyIdea:
        "Use the cheapest reliable test that can verify a particular behavior."
    },

    {
      number: 4,
      title: "Assertions, Test Cases and Suites",
      intro:
        "A test normally performs an action and checks an expected result using an assertion.",
      points: [
        "A test case checks one behavior or scenario.",
        "An assertion compares actual behavior with expected behavior.",
        "A test suite groups related tests.",
        "Setup prepares shared test conditions.",
        "Cleanup removes temporary resources.",
        "Tests should be readable enough to explain the intended behavior."
      ],
      code: `describe("calculateTotal", () => {
  test("multiplies price by quantity", () => {
    const result = calculateTotal(100, 3);

    expect(result).toBe(300);
  });

  test("returns zero for zero quantity", () => {
    const result = calculateTotal(100, 0);

    expect(result).toBe(0);
  });
});`,
      keyIdea:
        "A good test clearly communicates the scenario, action and expected result."
    },

    {
      number: 5,
      title: "Testing Pure JavaScript Functions",
      intro:
        "Pure functions are excellent candidates for unit testing because they are predictable and isolated.",
      points: [
        "The same input should produce the same output.",
        "Pure functions have fewer external dependencies.",
        "Edge cases should be tested.",
        "Invalid input behavior should be deliberate.",
        "Small unit tests make failures easy to diagnose."
      ],
      code: `export function calculateDiscount(price, rate) {
  return price - price * rate;
}

// Tests

test("calculates 10 percent discount", () => {
  expect(
    calculateDiscount(1000, 0.10)
  ).toBe(900);
});

test("calculates 20 percent discount", () => {
  expect(
    calculateDiscount(500, 0.20)
  ).toBe(400);
});

test("zero discount keeps price unchanged", () => {
  expect(
    calculateDiscount(800, 0)
  ).toBe(800);
});`,
      keyIdea:
        "Pure functions provide some of the simplest and most valuable targets for unit testing."
    },

    {
      number: 6,
      title: "Testing Express APIs",
      intro:
        "Backend tests should verify HTTP behavior, validation, status codes and response data.",
      points: [
        "Test the HTTP method and endpoint.",
        "Provide realistic request data.",
        "Check the response status.",
        "Check important response fields.",
        "Test invalid requests as well as successful requests.",
        "Test authentication behavior for protected routes."
      ],
      code: `test("POST /api/students creates a student", async () => {
  const response = await request(app)
    .post("/api/students")
    .send({
      name: "Anita",
      department: "CSE"
    });

  expect(response.statusCode).toBe(201);

  expect(response.body.name)
    .toBe("Anita");
});

// Another important test

test("rejects invalid student data", async () => {
  const response = await request(app)
    .post("/api/students")
    .send({});

  expect(response.statusCode)
    .toBe(400);
});`,
      keyIdea:
        "API tests should verify both successful behavior and important failure conditions."
    },

    {
      number: 7,
      title: "Testing Controllers and Services",
      intro:
        "Separating controllers and services makes backend testing more focused.",
      points: [
        "Controller tests can focus on HTTP behavior.",
        "Service tests can focus on application logic.",
        "Database calls can be mocked when testing isolated service behavior.",
        "Integration tests can later verify the real database boundary.",
        "Tests should avoid depending on unrelated implementation details."
      ],
      code: `// Service

export async function findStudent(id) {
  const student = await Student.findById(id);

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
}

// A focused test can replace Student.findById
// with a controlled test double.

// The purpose is to verify service behavior,
// not MongoDB itself.`,
      keyIdea:
        "Separate tests by responsibility so failures identify the layer where behavior is broken."
    },

    {
      number: 8,
      title: "Mocking Dependencies",
      intro:
        "Mocking replaces a real dependency with controlled behavior during a test.",
      points: [
        "Mocks can make tests faster.",
        "Mocks can isolate one unit from external systems.",
        "Mocking is useful for network requests, databases and external services.",
        "Over-mocking can produce tests that do not reflect real behavior.",
        "Important integrations should still receive integration testing."
      ],
      code: `const emailService = {
  send: async () => true
};

test("registration sends welcome email", async () => {
  const sendMock = jest
    .spyOn(emailService, "send")
    .mockResolvedValue(true);

  await registerUser({
    name: "Anita",
    email: "anita@example.com"
  });

  expect(sendMock)
    .toHaveBeenCalled();

  sendMock.mockRestore();
});`,
      keyIdea:
        "Mock external dependencies when isolation is useful, but keep enough integration testing to prove real components work together."
    },

    {
      number: 9,
      title: "Database Testing with MongoDB",
      intro:
        "Applications that use MongoDB need tests for data behavior as well as pure application logic.",
      points: [
        "Database tests should avoid damaging real production data.",
        "Use an isolated test database or controlled test environment.",
        "Create known test data before the test.",
        "Clean up data after tests.",
        "Test important constraints and database interactions."
      ],
      code: `beforeEach(async () => {
  await Student.deleteMany({});
});

test("creates a student in MongoDB", async () => {
  const student = await Student.create({
    name: "Anita",
    department: "CSE"
  });

  expect(student.name)
    .toBe("Anita");

  const stored =
    await Student.findById(student._id);

  expect(stored)
    .not
    .toBeNull();
});

afterAll(async () => {
  await mongoose.connection.close();
});`,
      keyIdea:
        "Database tests should use isolated data and never depend on uncontrolled production state."
    },

    {
      number: 10,
      title: "Integration Testing a MERN Backend",
      intro:
        "Integration tests verify that multiple backend layers cooperate correctly.",
      points: [
        "A route can call a controller.",
        "The controller can call a service.",
        "The service can use Mongoose.",
        "Mongoose can communicate with MongoDB.",
        "The test verifies the complete backend path."
      ],
      code: `test(
  "POST /api/students stores student",
  async () => {
    const response = await request(app)
      .post("/api/students")
      .send({
        name: "Ravi",
        department: "AI-ML"
      });

    expect(response.statusCode)
      .toBe(201);

    const student =
      await Student.findOne({
        name: "Ravi"
      });

    expect(student)
      .not
      .toBeNull();
  }
);`,
      keyIdea:
        "Integration tests prove that important application boundaries work together, not just independently."
    },

    {
      number: 11,
      title: "Testing React Components",
      intro:
        "React component tests should focus on what users can observe and interact with.",
      points: [
        "Render the component.",
        "Find visible elements.",
        "Simulate user interactions.",
        "Verify the resulting UI.",
        "Avoid testing React's internal implementation unnecessarily."
      ],
      code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

// Test idea

render(<Counter />);

expect(
  screen.getByText("0")
).toBeInTheDocument();

await user.click(
  screen.getByRole("button", {
    name: "Increase"
  })
);

expect(
  screen.getByText("1")
).toBeInTheDocument();`,
      keyIdea:
        "Component tests should verify observable UI behavior rather than implementation details."
    },

    {
      number: 12,
      title: "Testing Forms and Async UI",
      intro:
        "Forms combine user interaction, validation and asynchronous operations, making them important test targets.",
      points: [
        "Test required-field validation.",
        "Test invalid input.",
        "Test successful submission.",
        "Test loading feedback.",
        "Test API failure feedback.",
        "Test that successful submission produces the expected UI result."
      ],
      code: `test("shows validation message", async () => {
  render(<StudentForm />);

  await user.click(
    screen.getByRole("button", {
      name: "Save"
    })
  );

  expect(
    screen.getByText("Name is required")
  ).toBeInTheDocument();
});

test("shows success after save", async () => {
  render(<StudentForm />);

  await user.type(
    screen.getByLabelText("Name"),
    "Anita"
  );

  await user.click(
    screen.getByRole("button", {
      name: "Save"
    })
  );

  expect(
    await screen.findByText("Student saved")
  ).toBeInTheDocument();
});`,
      keyIdea:
        "Async UI tests should wait for observable results rather than relying on arbitrary delays."
    },

    {
      number: 13,
      title: "Testing Authentication and Authorization",
      intro:
        "Authentication and authorization are critical application boundaries that require explicit tests.",
      points: [
        "Test valid login.",
        "Test invalid credentials.",
        "Test protected routes without authentication.",
        "Test protected routes with valid authentication.",
        "Test role restrictions.",
        "Test expired or invalid authentication where applicable."
      ],
      code: `test("protected route rejects anonymous user", async () => {
  const response = await request(app)
    .get("/api/profile");

  expect(response.statusCode)
    .toBe(401);
});

test("admin route rejects normal user", async () => {
  const token =
    createTestToken({
      id: "user-1",
      role: "student"
    });

  const response = await request(app)
    .get("/api/admin/users")
    .set("Authorization", "Bearer " + token);

  expect(response.statusCode)
    .toBe(403);
});`,
      keyIdea:
        "Security-related behavior should be tested as deliberately as normal application features."
    },

    {
      number: 14,
      title: "Testing Validation and Error Handling",
      intro:
        "A robust application must behave predictably when users or external systems provide invalid input.",
      points: [
        "Test missing required fields.",
        "Test invalid data types.",
        "Test malformed identifiers.",
        "Test not-found cases.",
        "Test duplicate records where applicable.",
        "Test unexpected service failures.",
        "Verify that safe error responses reach the client."
      ],
      code: `test("invalid email returns 400", async () => {
  const response = await request(app)
    .post("/api/users")
    .send({
      name: "Anita",
      email: "not-an-email"
    });

  expect(response.statusCode)
    .toBe(400);

  expect(response.body.success)
    .toBe(false);
});

test("missing user returns 404", async () => {
  const response = await request(app)
    .get("/api/users/unknown-id");

  expect(response.statusCode)
    .toBe(404);
});`,
      keyIdea:
        "Failure behavior is part of the API contract and deserves automated verification."
    },

    {
      number: 15,
      title: "End-to-End Testing",
      intro:
        "End-to-end testing checks a complete workflow from the user's perspective.",
      points: [
        "The browser opens the application.",
        "The user performs real interactions.",
        "The frontend communicates with the backend.",
        "The backend communicates with the database or controlled test environment.",
        "The test verifies the final visible result."
      ],
      code: `// Conceptual E2E workflow

open("/login");

fill("#email", "anita@example.com");

fill("#password", "correct-password");

click("button[type=submit]");

expect(
  visibleText("Dashboard")
).toBe(true);

click("text=Students");

expect(
  visibleText("Student List")
).toBe(true);`,
      keyIdea:
        "End-to-end tests verify that the major parts of an application work together from the user's point of view."
    },

    {
      number: 16,
      title: "Continuous Integration",
      intro:
        "Continuous integration automatically runs quality checks when code changes are pushed or proposed for merging.",
      points: [
        "A developer pushes code to the repository.",
        "The CI system installs dependencies.",
        "Linting and formatting checks can run.",
        "Unit and integration tests can run.",
        "The frontend can be built.",
        "The backend can be validated.",
        "A pull request can be blocked when required checks fail."
      ],
      code: `# Conceptual CI workflow

on:
  push:
    branches:
      - main

jobs:
  test:
    steps:
      - checkout
      - install dependencies
      - run lint
      - run unit tests
      - run integration tests
      - build frontend

# The exact syntax depends on
# the CI platform being used.`,
      keyIdea:
        "CI turns quality checks into an automated part of the development workflow."
    },

    {
      number: 17,
      title: "Complete MERN Testing and Quality Strategy",
      intro:
        "A professional MERN project combines automated testing, code quality checks and CI into a repeatable workflow.",
      points: [
        "Unit tests protect pure application logic.",
        "Integration tests protect important system boundaries.",
        "Component tests protect important UI behavior.",
        "End-to-end tests protect critical user journeys.",
        "Validation and error paths are tested.",
        "Authentication and authorization are tested.",
        "Linting and formatting maintain code quality.",
        "CI runs important checks automatically.",
        "Tests should be deterministic and isolated.",
        "Critical behavior should be prioritized over arbitrary coverage numbers."
      ],
      code: `// Example quality pipeline

const qualityPipeline = [
  "format check",
  "lint",
  "unit tests",
  "component tests",
  "integration tests",
  "API tests",
  "build",
  "critical E2E tests"
];

for (const step of qualityPipeline) {
  console.log("Running:", step);
}

console.log(
  "Quality gate complete"
);`,
      keyIdea:
        "Quality is not one test. It is a repeatable engineering process that protects the application throughout development."
    }
  ],

  visualizer: {
    title: "MERN Testing Pipeline",
    description:
      "Explore how a code change moves through different testing and quality layers before it can be merged.",
    type: "flow",
    steps: [
      {
        label: "Developer Push",
        detail:
          "A developer pushes a change or opens a pull request."
      },
      {
        label: "Install Dependencies",
        detail:
          "The CI environment prepares a clean project environment."
      },
      {
        label: "Format Check",
        detail:
          "Formatting rules verify consistent source-code style."
      },
      {
        label: "Lint",
        detail:
          "Static analysis identifies common code-quality problems."
      },
      {
        label: "Unit Tests",
        detail:
          "Small isolated functions are tested."
      },
      {
        label: "Component Tests",
        detail:
          "Important React UI behavior is verified."
      },
      {
        label: "Integration Tests",
        detail:
          "Multiple backend layers are tested together."
      },
      {
        label: "API Tests",
        detail:
          "HTTP endpoints, validation and responses are checked."
      },
      {
        label: "Build",
        detail:
          "The application is compiled or bundled for deployment."
      },
      {
        label: "E2E Tests",
        detail:
          "Critical user journeys are tested through the application."
      },
      {
        label: "Quality Gate",
        detail:
          "The change is accepted only when required checks pass."
      },
      {
        label: "Merge",
        detail:
          "The verified code can move forward in the delivery process."
      }
    ]
  },

  trace: {
    title: "Trace a Full-Stack Test",
    description:
      "Follow an integration test that creates a student through the API and verifies the stored result.",
    steps: [
      {
        line: 1,
        operation: "Test starts",
        detail:
          "The test runner loads the application and test configuration."
      },
      {
        line: 2,
        operation: "Test data prepared",
        detail:
          "The isolated test environment is prepared."
      },
      {
        line: 3,
        operation: "POST /api/students",
        detail:
          "The test sends a request to the Express application."
      },
      {
        line: 4,
        operation: "Express route",
        detail:
          "The request is matched to the student creation route."
      },
      {
        line: 5,
        operation: "Validation middleware",
        detail:
          "The request data is checked."
      },
      {
        line: 6,
        operation: "Controller",
        detail:
          "The controller coordinates the HTTP operation."
      },
      {
        line: 7,
        operation: "Service",
        detail:
          "The service performs the application operation."
      },
      {
        line: 8,
        operation: "Mongoose",
        detail:
          "The student model prepares the database operation."
      },
      {
        line: 9,
        operation: "MongoDB",
        detail:
          "The test record is stored in the isolated database."
      },
      {
        line: 10,
        operation: "HTTP response",
        detail:
          "The API returns a success response."
      },
      {
        line: 11,
        operation: "Assertion",
        detail:
          "The test checks the status code and response data."
      },
      {
        line: 12,
        operation: "Database assertion",
        detail:
          "The test verifies that the expected record exists."
      },
      {
        line: 13,
        operation: "Cleanup",
        detail:
          "Temporary test data and connections are cleaned up."
      },
      {
        line: 14,
        operation: "Test result",
        detail:
          "The runner reports the test as passed or failed."
      }
    ]
  },

  revision: [
    [
      "Unit Test",
      "A test focused on a small isolated piece of application behavior."
    ],
    [
      "Integration Test",
      "A test that verifies multiple application components or layers working together."
    ],
    [
      "Component Test",
      "A test that verifies the behavior of a UI component."
    ],
    [
      "End-to-End Test",
      "A test that verifies a complete user workflow."
    ],
    [
      "Assertion",
      "A check comparing actual behavior with an expected result."
    ],
    [
      "Test Case",
      "A specific scenario that a test verifies."
    ],
    [
      "Test Suite",
      "A group of related tests."
    ],
    [
      "Mock",
      "A controlled replacement for a dependency used during testing."
    ],
    [
      "Regression",
      "A previously working behavior that becomes broken after a change."
    ],
    [
      "Test Isolation",
      "Keeping tests independent so one test does not unexpectedly affect another."
    ],
    [
      "Coverage",
      "A measurement describing which parts of code or behavior tests exercise."
    ],
    [
      "CI",
      "Continuous Integration: automatically validating changes in a shared development workflow."
    ],
    [
      "Quality Gate",
      "A required set of checks that must pass before code can move forward."
    ],
    [
      "E2E",
      "End-to-end testing of complete application workflows."
    ],
    [
      "Regression Test",
      "A test that protects behavior that previously worked."
    ]
  ],

  interview: [
    {
      question: "Why is automated testing important?",
      answer:
        "Automated tests provide repeatable checks, detect regressions and give developers confidence when changing code."
    },
    {
      question: "What is a unit test?",
      answer:
        "A unit test checks a small isolated piece of behavior, usually a function or module."
    },
    {
      question: "What is an integration test?",
      answer:
        "An integration test verifies that multiple components or layers work correctly together."
    },
    {
      question: "What is an end-to-end test?",
      answer:
        "It verifies a complete application workflow from the user's perspective."
    },
    {
      question: "What is an assertion?",
      answer:
        "An assertion checks whether actual behavior matches an expected result."
    },
    {
      question: "Why are pure functions easy to test?",
      answer:
        "They generally produce predictable output from input without depending on external state."
    },
    {
      question: "What is mocking?",
      answer:
        "Mocking replaces a real dependency with controlled behavior during a test."
    },
    {
      question: "Why should important database behavior still receive integration testing?",
      answer:
        "Mocks can verify application logic, but only integration testing with a real or realistic database boundary can verify the actual interaction."
    },
    {
      question: "What should an Express API test verify?",
      answer:
        "It can verify the request, status code, response data, validation behavior and important failure cases."
    },
    {
      question: "How should React component tests be designed?",
      answer:
        "They should primarily verify observable UI behavior and user interactions rather than implementation details."
    },
    {
      question: "Why test authentication and authorization separately?",
      answer:
        "Authentication establishes identity while authorization controls permissions, so both behaviors need independent verification."
    },
    {
      question: "What is continuous integration?",
      answer:
        "Continuous integration automatically runs checks on code changes so problems are detected early."
    },
    {
      question: "What is a quality gate?",
      answer:
        "It is a set of required checks that must pass before a change is allowed to move forward."
    },
    {
      question: "Does high code coverage automatically mean high quality?",
      answer:
        "No. Coverage measures exercised code, but tests can still miss important behaviors, edge cases or incorrect expectations."
    }
  ],

  practice: [
    {
      title: "Test a Pure Function",
      task:
        "Write unit tests for a function that calculates the final price after tax.",
      hint:
        "Test normal values, zero tax and multiple price values.",
      answer:
        "Create independent test cases with expected numerical results and use assertions to verify them."
    },
    {
      title: "Test an Express Route",
      task:
        "Create tests for GET /api/students that verify a successful response and an appropriate failure response.",
      hint:
        "Check both the HTTP status and important response fields.",
      answer:
        "The test should send a request, inspect the status code and verify the response structure."
    },
    {
      title: "Test Validation",
      task:
        "Write a test that sends an empty student object to POST /api/students and verifies the validation response.",
      hint:
        "Think about the expected 4xx status and safe error message.",
      answer:
        "Send invalid data and assert that the API rejects it with the expected client-error status."
    },
    {
      title: "React Component Test",
      task:
        "Test a Counter component so that clicking Increase changes the displayed value from 0 to 1.",
      hint:
        "Test what the user sees and interacts with.",
      answer:
        "Render the component, locate the Increase button, click it and assert that 1 appears."
    },
    {
      title: "Authentication Tests",
      task:
        "Write tests for a protected profile endpoint with no token and with a valid token.",
      hint:
        "Compare unauthorized and successful responses.",
      answer:
        "The anonymous request should be rejected while the authenticated request should reach the protected behavior."
    },
    {
      title: "Database Integration Test",
      task:
        "Create a test that inserts a student into an isolated MongoDB test database and then reads it back.",
      hint:
        "Prepare test data, perform the operation and clean up afterward.",
      answer:
        "Create the document, query it by its identifier, verify its fields and clean the test database."
    },
    {
      title: "Build a CI Pipeline",
      task:
        "Design a CI workflow that runs install, lint, unit tests, integration tests and frontend build.",
      hint:
        "Place fast quality checks before more expensive checks where practical.",
      answer:
        "A basic pipeline can install dependencies, run formatting/lint checks, execute tests and finally build the frontend."
    },
    {
      title: "Choose the Test Level",
      task:
        "For each scenario choose an appropriate test type: discount calculation, login API, dashboard rendering, complete purchase workflow.",
      hint:
        "Think about the boundary being verified.",
      answer:
        "Discount calculation → unit; login API → integration/API; dashboard rendering → component; complete purchase workflow → E2E."
    }
  ],

  quiz: [
    {
      question: "Which test usually focuses on a small isolated function?",
      options: [
        "End-to-end test",
        "Unit test",
        "Deployment test",
        "Manual release test"
      ],
      answer: 1,
      explanation:
        "Unit tests focus on small isolated pieces of behavior."
    },
    {
      question: "Which test verifies multiple application layers working together?",
      options: [
        "Unit test",
        "Integration test",
        "Syntax test",
        "CSS test"
      ],
      answer: 1,
      explanation:
        "Integration tests verify interactions between multiple components or layers."
    },
    {
      question: "What is the purpose of an assertion?",
      options: [
        "Install MongoDB",
        "Compare actual and expected behavior",
        "Deploy the frontend",
        "Create CSS"
      ],
      answer: 1,
      explanation:
        "Assertions verify that observed behavior matches expectations."
    },
    {
      question: "Which test is most appropriate for a complete login-to-dashboard workflow?",
      options: [
        "Unit test",
        "E2E test",
        "Formatting test",
        "Database index test"
      ],
      answer: 1,
      explanation:
        "A complete user workflow is a natural end-to-end testing target."
    },
    {
      question: "What does mocking do?",
      options: [
        "Deletes production data",
        "Replaces a dependency with controlled behavior",
        "Compiles React",
        "Creates MongoDB indexes"
      ],
      answer: 1,
      explanation:
        "Mocks provide controlled replacements for dependencies during tests."
    },
    {
      question: "Why should database tests use isolated environments?",
      options: [
        "To protect production data",
        "To increase CSS performance",
        "To remove HTTP",
        "To disable authentication"
      ],
      answer: 0,
      explanation:
        "Tests should never accidentally modify uncontrolled production data."
    },
    {
      question: "What should a React component test primarily verify?",
      options: [
        "React's internal implementation",
        "Observable UI behavior",
        "MongoDB indexes",
        "Server operating system"
      ],
      answer: 1,
      explanation:
        "Component tests should focus on what users can observe and interact with."
    },
    {
      question: "Which behavior should authentication tests include?",
      options: [
        "Only successful login",
        "Only CSS rendering",
        "Valid and invalid authentication cases",
        "Only database backups"
      ],
      answer: 2,
      explanation:
        "Security behavior requires testing both accepted and rejected authentication scenarios."
    },
    {
      question: "What does CI commonly do?",
      options: [
        "Automatically validate code changes",
        "Replace MongoDB",
        "Write all application code",
        "Remove all tests"
      ],
      answer: 0,
      explanation:
        "Continuous integration automatically runs quality checks on code changes."
    },
    {
      question: "What is a quality gate?",
      options: [
        "A database table",
        "A required set of checks",
        "A React component",
        "An HTTP method"
      ],
      answer: 1,
      explanation:
        "A quality gate defines checks that must pass before code moves forward."
    },
    {
      question: "Does 100 percent code coverage guarantee a bug-free application?",
      options: [
        "Yes",
        "No",
        "Only for React",
        "Only for MongoDB"
      ],
      answer: 1,
      explanation:
        "Coverage does not guarantee that tests contain correct expectations or cover every important behavior."
    },
    {
      question: "Which is generally the broadest test?",
      options: [
        "Unit test",
        "Function test",
        "End-to-end test",
        "Assertion"
      ],
      answer: 2,
      explanation:
        "E2E tests can exercise the complete application workflow."
    }
  ],

  glossary: [
    {
      term: "Unit Test",
      definition:
        "A test that checks a small isolated piece of application behavior."
    },
    {
      term: "Integration Test",
      definition:
        "A test that verifies multiple application components or layers working together."
    },
    {
      term: "Component Test",
      definition:
        "A test that verifies the observable behavior of a UI component."
    },
    {
      term: "End-to-End Test",
      definition:
        "A test that verifies a complete workflow from the user's perspective."
    },
    {
      term: "Assertion",
      definition:
        "A check that compares actual behavior with an expected result."
    },
    {
      term: "Mock",
      definition:
        "A controlled replacement for a dependency during testing."
    },
    {
      term: "Test Suite",
      definition:
        "A group of related test cases."
    },
    {
      term: "Regression",
      definition:
        "A previously working behavior that becomes broken after a change."
    },
    {
      term: "Test Isolation",
      definition:
        "The practice of keeping tests independent from one another."
    },
    {
      term: "Test Coverage",
      definition:
        "A measurement of which parts of code or behavior are exercised by tests."
    },
    {
      term: "Continuous Integration",
      definition:
        "An automated workflow that validates changes as they are introduced into a shared codebase."
    },
    {
      term: "Quality Gate",
      definition:
        "A required collection of checks that must pass before code moves forward."
    },
    {
      term: "Test Double",
      definition:
        "A controlled replacement used in place of a real dependency during testing."
    },
    {
      term: "Regression Test",
      definition:
        "A test that protects behavior that previously worked correctly."
    }
  ],

  completion: {
    title: "Testing & Quality Complete!",
    message:
      "You have completed Level 28. You now understand how to test MERN applications at unit, integration, component and end-to-end levels, and how continuous integration can automate quality checks before code moves forward.",
    achievements: [
      "Understood the purpose and value of automated testing.",
      "Learned unit, integration, component and end-to-end testing.",
      "Understood the testing pyramid.",
      "Learned assertions, test cases and test suites.",
      "Tested pure JavaScript logic conceptually.",
      "Learned Express API testing.",
      "Understood controller and service testing.",
      "Learned when and why to mock dependencies.",
      "Understood MongoDB integration testing.",
      "Learned React component and async UI testing.",
      "Learned authentication and authorization testing.",
      "Learned validation and error-path testing.",
      "Understood end-to-end workflows.",
      "Learned continuous integration and quality gates.",
      "Built a complete MERN testing strategy."
    ],
    nextLevel: "Level 29 — Deployment & Observability"
  }
};
