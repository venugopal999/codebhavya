"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 14 — REACT MENTAL MODEL

  React, components, JSX, declarative rendering,
  component composition, props and the React rendering model.
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[14] = {

  number: 14,

  title: "React Mental Model",

  kicker: "React Applications · Level 14",

  subtitle:
    "Understand components, JSX and declarative rendering so you can think in React before building larger applications.",

  estimatedTime: "4–5 hours",

  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 14 · REACT FOUNDATIONS",
    description:
      "React changes how you think about building user interfaces. Instead of " +
      "manually finding DOM elements and updating them after every interaction, " +
      "you describe the interface for a given state and let React coordinate the " +
      "rendering process. This level builds that mental model from the ground up: " +
      "components, JSX, expressions, props, composition, rendering and the difference " +
      "between imperative DOM manipulation and declarative UI."
  },

  objectives: [

    "Understand why UI libraries such as React exist.",

    "Understand the difference between imperative and declarative UI programming.",

    "Understand React's component model.",

    "Create functional components.",

    "Understand JSX.",

    "Use JavaScript expressions inside JSX.",

    "Understand JSX attributes and className.",

    "Render lists using map().",

    "Understand why list keys are important.",

    "Compose components.",

    "Pass information using props.",

    "Understand one-way data flow.",

    "Understand children props.",

    "Understand conditional rendering.",

    "Understand event handlers in React.",

    "Understand the basic React rendering model.",

    "Understand re-rendering at a practical level.",

    "Understand why React applications should avoid direct DOM manipulation.",

    "Understand component boundaries.",

    "Understand pure rendering.",

    "Build a small component hierarchy.",

    "Prepare for state, hooks and interactive React applications."

  ],


  sections: [

    {
      number: 1,

      title: "Why React?",

      intro:
        "Modern interfaces contain many pieces of changing UI.",

      explanation:
        "A web application may contain navigation, forms, lists, notifications, " +
        "modals, dashboards and interactive controls. As the number of independent " +
        "UI states grows, manually coordinating DOM changes can become difficult. " +
        "React provides a component-based approach for describing and updating interfaces.",

      comparison: {
        headers: [
          "Traditional DOM approach",
          "React approach"
        ],

        rows: [
          [
            "Find elements and modify them",
            "Describe the UI for current data"
          ],
          [
            "Manually coordinate updates",
            "React coordinates rendering"
          ],
          [
            "UI logic can become scattered",
            "Related UI logic can live in components"
          ],
          [
            "DOM is manipulated directly",
            "Application normally describes UI through React"
          ]
        ]
      },

      keyIdea:
        "React is primarily a way of organizing UI around components and declarative rendering."
    },


    {
      number: 2,

      title: "Imperative vs Declarative UI",

      intro:
        "This distinction is one of the most important ideas in React.",

      code:
`// Imperative style

const button =
  document.querySelector("#save");

button.textContent = "Saved";
button.classList.add("success");`,

      code:
`// Declarative idea

function SaveStatus({ saved }) {

  return saved
    ? <span>Saved</span>
    : <span>Not saved</span>;

}`,

      comparison: {
        headers: [
          "Imperative",
          "Declarative"
        ],

        rows: [
          [
            "Describe the steps to change the UI",
            "Describe what the UI should look like"
          ],
          [
            "Application directly coordinates mutations",
            "Application expresses UI from current data"
          ],
          [
            "More manual DOM coordination",
            "React manages the rendering process"
          ]
        ]
      },

      keyIdea:
        "Declarative UI focuses on the desired result rather than manually describing every DOM mutation."
    },


    {
      number: 3,

      title: "The Component Model",

      intro:
        "React applications are built from components.",

      explanation:
        "A component is a reusable piece of UI logic. Components can be small, such as " +
        "a button or badge, or larger, such as a course dashboard or page.",

      code:
`function CourseCard() {

  return (
    <article>
      <h2>JavaScript</h2>
      <p>Learn modern JavaScript.</p>
    </article>
  );

}`,

      architecture: [
        {
          title: "Page",
          items: [
            "Represents a larger screen or application area."
          ]
        },
        {
          title: "Section",
          items: [
            "Groups related content and behaviour."
          ]
        },
        {
          title: "Component",
          items: [
            "Encapsulates reusable UI structure."
          ]
        },
        {
          title: "Element",
          items: [
            "Represents individual pieces of rendered interface."
          ]
        }
      ],

      keyIdea:
        "Componentization allows complex interfaces to be constructed from smaller understandable pieces."
    },


    {
      number: 4,

      title: "Functional Components",

      intro:
        "Modern React applications commonly define components as JavaScript functions.",

      code:
`function Welcome() {

  return (
    <h1>
      Welcome to CodeBhavya
    </h1>
  );

}`,

      points: [
        "Component names conventionally begin with an uppercase letter.",
        "A component returns React elements.",
        "A component can receive props.",
        "A component can contain other components.",
        "A component should normally remain focused on a clear responsibility."
      ],

      warning:
        "A lowercase JSX tag such as <welcome> is interpreted differently from a component such as <Welcome>. Component naming matters.",

      keyIdea:
        "A functional component is a JavaScript function that describes a piece of UI."
    },


    {
      number: 5,

      title: "JSX",

      intro:
        "JSX lets JavaScript code describe UI using an HTML-like syntax.",

      code:
`function Course() {

  const title =
    "React";

  return (
    <article className="course">
      <h2>{title}</h2>
      <p>Build user interfaces.</p>
    </article>
  );

}`,

      explanation:
        "JSX is syntax that is transformed into JavaScript expressions understood by React. " +
        "It looks similar to HTML, but it follows JavaScript and React rules.",

      comparison: {
        headers: [
          "HTML",
          "JSX"
        ],

        rows: [
          [
            "class",
            "className"
          ],
          [
            "HTML attributes use their normal markup syntax",
            "JSX attributes follow JavaScript/React conventions"
          ],
          [
            "HTML text and markup",
            "JavaScript expressions can be embedded with {}"
          ]
        ]
      },

      keyIdea:
        "JSX is a convenient syntax for describing React UI; it is not ordinary HTML embedded directly in JavaScript."
    },


    {
      number: 6,

      title: "JavaScript Expressions in JSX",

      intro:
        "Curly braces allow JavaScript expressions to be inserted into JSX.",

      code:
`function Student() {

  const name = "Bhavya";
  const score = 92;

  return (
    <section>
      <h2>{name}</h2>
      <p>Score: {score}</p>
      <p>
        Result: {score >= 40
          ? "Pass"
          : "Fail"}
      </p>
    </section>
  );

}`,

      points: [
        "Variables can be displayed.",
        "Expressions can be calculated.",
        "Conditional expressions can be used.",
        "Function calls can be used when appropriate.",
        "Statements such as if blocks cannot simply be placed directly inside JSX braces."
      ],

      keyIdea:
        "JSX expressions connect application data to the rendered interface."
    },


    {
      number: 7,

      title: "JSX Attributes and className",

      intro:
        "JSX uses attributes to configure rendered elements and components.",

      code:
`function Profile() {

  const image =
    "/images/student.png";

  return (
    <img
      src={image}
      alt="Student profile"
      className="profile-image"
    />
  );

}`,

      comparison: {
        headers: [
          "HTML",
          "JSX"
        ],

        rows: [
          [
            "class",
            "className"
          ],
          [
            "onclick",
            "onClick"
          ],
          [
            "tabindex",
            "tabIndex"
          ],
          [
            "style='...'",
            "style={{ ... }}"
          ]
        ]
      },

      keyIdea:
        "JSX attributes are part of JavaScript syntax and follow React's property naming conventions."
    },


    {
      number: 8,

      title: "Rendering Lists",

      intro:
        "JavaScript's map() method is commonly used to turn data into repeated JSX.",

      code:
`const courses = [
  "C",
  "Python",
  "JavaScript",
  "React"
];

function CourseList() {

  return (
    <ul>
      {courses.map(course => (
        <li key={course}>
          {course}
        </li>
      ))}
    </ul>
  );

}`,

      flow: [
        "Start with application data",
        "Call map()",
        "Create JSX for each item",
        "Provide a stable key",
        "React receives the resulting element collection",
        "The list is rendered"
      ],

      keyIdea:
        "List rendering is data transformation: application data becomes a collection of UI elements."
    },


    {
      number: 9,

      title: "Why Keys Matter",

      intro:
        "React needs a stable identity for elements in repeated lists.",

      code:
`const courses = [
  { id: 101, name: "C" },
  { id: 102, name: "Python" },
  { id: 103, name: "React" }
];

function CourseList() {

  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>
          {course.name}
        </li>
      ))}
    </ul>
  );

}`,

      warning:
        "Avoid using an array index as a key when list items can be inserted, removed or reordered. A stable item identifier is usually a better choice.",

      comparison: {
        headers: [
          "Better key",
          "Risky key"
        ],

        rows: [
          [
            "Stable database or domain id",
            "Array index for changing lists"
          ],
          [
            "Identifies the same item over time",
            "Can change when list order changes"
          ],
          [
            "Helps React preserve item identity",
            "Can lead to confusing UI state behaviour"
          ]
        ]
      },

      keyIdea:
        "A key should identify the item, not simply describe its current position."
    },


    {
      number: 10,

      title: "Component Composition",

      intro:
        "Components become powerful when smaller components are combined into larger interfaces.",

      code:
`function Header() {

  return <header>CodeBhavya</header>;

}

function CourseList() {

  return <main>Courses</main>;

}

function App() {

  return (
    <>
      <Header />
      <CourseList />
    </>
  );

}`,

      architecture: [
        {
          title: "App",
          items: [
            "Top-level application composition."
          ]
        },
        {
          title: "Header",
          items: [
            "Owns navigation/header UI."
          ]
        },
        {
          title: "CourseList",
          items: [
            "Owns course-list presentation."
          ]
        },
        {
          title: "CourseCard",
          items: [
            "Can represent one reusable course item."
          ]
        }
      ],

      keyIdea:
        "Composition means building larger interfaces by combining smaller components."
    },


    {
      number: 11,

      title: "Props",

      intro:
        "Props allow a parent component to pass information to a child component.",

      code:
`function CourseCard({ title, level }) {

  return (
    <article>
      <h2>{title}</h2>
      <p>Level {level}</p>
    </article>
  );

}

function App() {

  return (
    <CourseCard
      title="React"
      level={14}
    />
  );

}`,

      comparison: {
        headers: [
          "Parent",
          "Child"
        ],

        rows: [
          [
            "Owns the data it passes",
            "Receives the data through props"
          ],
          [
            "Chooses prop values",
            "Uses prop values for rendering"
          ],
          [
            "Can render many children with different props",
            "Can remain reusable"
          ]
        ]
      },

      keyIdea:
        "Props are inputs supplied by a component's parent."
    },


    {
      number: 12,

      title: "Props Are Read-Only",

      intro:
        "A child component should treat its props as inputs rather than directly changing them.",

      code:
`function Student({ name }) {

  // Do not do:
  // name = "Another Name";

  return (
    <h2>{name}</h2>
  );

}`,

      explanation:
        "The parent owns the value it passes. If the child needs something to change, " +
        "the application normally introduces state or communicates the desired action back to the parent through a callback prop.",

      warning:
        "Do not mutate props. Treat them as read-only inputs.",

      keyIdea:
        "React encourages one-way data flow: parents provide data to children."
    },


    {
      number: 13,

      title: "The children Prop",

      intro:
        "A component can accept nested JSX through the special children prop.",

      code:
`function Card({ children }) {

  return (
    <article className="card">
      {children}
    </article>
  );

}

function App() {

  return (
    <Card>
      <h2>JavaScript</h2>
      <p>Learn the language.</p>
    </Card>
  );

}`,

      explanation:
        "children makes wrapper components highly reusable because the component does not need to know exactly which JSX will be placed inside it.",

      keyIdea:
        "children enables flexible composition without forcing a component to know the exact contents it wraps."
    },


    {
      number: 14,

      title: "Conditional Rendering",

      intro:
        "React can render different UI based on application data.",

      code:
`function Result({ passed }) {

  if (passed) {

    return <p>Congratulations!</p>;

  }

  return <p>Keep practicing.</p>;

}`,

      code:
`function Status({ loading }) {

  return (
    <section>
      {loading
        ? <p>Loading...</p>
        : <p>Ready</p>}
    </section>
  );

}`,

      methods: [
        {
          name: "if / return",
          purpose:
            "Useful when rendering branches with larger logic.",
          example:
            "if (loading) return <Loading />;"
        },
        {
          name: "Ternary",
          purpose:
            "Useful for two straightforward alternatives.",
          example:
            'loading ? <Loading /> : <Content />'
        },
        {
          name: "Logical &&",
          purpose:
            "Useful when something should render only when a condition is true.",
          example:
            'error && <ErrorMessage />'
        }
      ],

      keyIdea:
        "Conditional rendering means the component's output depends on its current inputs or state."
    },


    {
      number: 15,

      title: "React Event Handlers",

      intro:
        "React provides event props such as onClick and onChange.",

      code:
`function SaveButton() {

  function handleClick() {
    console.log("Saved");
  }

  return (
    <button onClick={handleClick}>
      Save
    </button>
  );

}`,

      comparison: {
        headers: [
          "Traditional DOM",
          "React"
        ],

        rows: [
          [
            'button.addEventListener("click", handler)',
            "<button onClick={handler}>"
          ],
          [
            "DOM listener registration",
            "Event handler passed as a prop"
          ],
          [
            "Direct DOM event API",
            "React component event model"
          ]
        ]
      },

      warning:
        "Pass the function to onClick. Do not accidentally call it during rendering with onClick={handleClick()}.",

      keyIdea:
        "React event handlers connect user interactions to component behaviour."
    },


    {
      number: 16,

      title: "The React Rendering Model",

      intro:
        "A React component describes what UI should exist for its current inputs.",

      code:
`function Greeting({ name }) {

  return (
    <h1>
      Hello {name}
    </h1>
  );

}`,

      flow: [
        "Component receives inputs",
        "Component function executes",
        "JSX description is produced",
        "React compares the new result with the previous rendered result",
        "React applies the necessary DOM updates",
        "Browser displays the updated interface"
      ],

      explanation:
        "The important mental model is not that React blindly rebuilds the browser DOM every time. " +
        "React calculates what the rendered result should be and commits appropriate changes to the DOM.",

      keyIdea:
        "Think of rendering as React determining the UI representation for the component's current inputs."
    },


    {
      number: 17,

      title: "Re-rendering",

      intro:
        "A component can render again when its relevant inputs change.",

      code:
`function Course({ title }) {

  console.log(
    "Course rendered"
  );

  return <h2>{title}</h2>;

}`,

      flow: [
        "React renders the component",
        "Component produces UI",
        "An input or state value changes",
        "React schedules another render",
        "Component function runs again",
        "React determines the resulting UI changes",
        "DOM is updated as necessary"
      ],

      warning:
        "A re-render does not automatically mean that every DOM node is recreated from scratch. React determines the appropriate updates.",

      keyIdea:
        "A component function can run again as React calculates the UI for new data."
    },


    {
      number: 18,

      title: "Avoid Direct DOM Manipulation",

      intro:
        "React applications generally should not manually control the same DOM nodes that React owns.",

      comparison: {
        headers: [
          "React-friendly",
          "Problematic"
        ],

        rows: [
          [
            "Change data/state and render from it",
            "Manually change React-managed DOM nodes"
          ],
          [
            "Use JSX to describe UI",
            "Mix React rendering with document.querySelector() updates"
          ],
          [
            "Let React coordinate updates",
            "Create competing sources of truth"
          ]
        ]
      },

      warning:
        "Direct DOM APIs still have legitimate uses in React, especially through refs and integration with external libraries. The problem is uncontrolled manual manipulation of DOM that React also manages.",

      keyIdea:
        "In React, application data should normally drive the UI instead of manually mutating React-managed DOM."
    },


    {
      number: 19,

      title: "Pure Rendering",

      intro:
        "Component rendering should ideally behave like a predictable calculation.",

      code:
`function Price({ amount }) {

  const formatted =
    "₹" + amount.toFixed(2);

  return (
    <strong>{formatted}</strong>
  );

}`,

      comparison: {
        headers: [
          "Good rendering",
          "Problematic rendering"
        ],

        rows: [
          [
            "Calculate output from inputs",
            "Modify external state during render"
          ],
          [
            "Predictable",
            "Unexpected side effects"
          ],
          [
            "Easy to reason about",
            "Harder to debug"
          ]
        ]
      },

      warning:
        "Avoid side effects such as network requests, subscriptions or manual DOM mutations directly during ordinary rendering. Later levels will introduce hooks for synchronization and side effects.",

      keyIdea:
        "A component should ideally calculate its UI from inputs rather than performing unrelated side effects during rendering."
    },


    {
      number: 20,

      title: "Component Boundaries",

      intro:
        "Choosing component boundaries is a design skill rather than a strict mathematical rule.",

      architecture: [
        {
          title: "CourseDashboard",
          items: [
            "Coordinates the dashboard."
          ]
        },
        {
          title: "CourseFilter",
          items: [
            "Owns the filter UI."
          ]
        },
        {
          title: "CourseList",
          items: [
            "Displays the collection."
          ]
        },
        {
          title: "CourseCard",
          items: [
            "Displays one course."
          ]
        },
        {
          title: "CourseBadge",
          items: [
            "Displays reusable course metadata."
          ]
        }
      ],

      points: [
        "Extract components when a piece of UI has a meaningful responsibility.",
        "Reuse components when the same UI pattern appears multiple times.",
        "Avoid creating dozens of tiny components without a useful boundary.",
        "Keep components understandable.",
        "Let data flow through explicit props."
      ],

      keyIdea:
        "Good component boundaries make an interface easier to understand, reuse and change."
    },


    {
      number: 21,

      title: "One-Way Data Flow",

      intro:
        "React applications normally move data from parent components toward children.",

      code:
`function App() {

  const course =
    "React";

  return (
    <CourseCard
      title={course}
    />
  );

}

function CourseCard({ title }) {

  return (
    <h2>{title}</h2>
  );

}`,

      flow: [
        "App owns course data",
        "App passes title as a prop",
        "CourseCard receives title",
        "CourseCard renders title",
        "Child does not directly modify parent's data"
      ],

      keyIdea:
        "One-way data flow makes the origin of information easier to trace."
    },


    {
      number: 22,

      title: "Putting the Mental Model Together",

      intro:
        "A React application can be understood as a tree of components driven by data.",

      code:
`function App() {

  const courses = [
    { id: 1, name: "C" },
    { id: 2, name: "Python" },
    { id: 3, name: "React" }
  ];

  return (
    <CourseList
      courses={courses}
    />
  );

}

function CourseList({ courses }) {

  return (
    <section>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
        />
      ))}
    </section>
  );

}

function CourseCard({ course }) {

  return (
    <article>
      <h2>{course.name}</h2>
    </article>
  );

}`,

      architecture: [
        {
          title: "Data",
          items: [
            "App owns the course collection."
          ]
        },
        {
          title: "Parent",
          items: [
            "App passes courses to CourseList."
          ]
        },
        {
          title: "List",
          items: [
            "CourseList maps data into CourseCard components."
          ]
        },
        {
          title: "Child",
          items: [
            "CourseCard receives one course and renders it."
          ]
        }
      ],

      flow: [
        "Application data",
        "App component",
        "CourseList props",
        "map()",
        "CourseCard props",
        "JSX output",
        "React rendering",
        "Browser UI"
      ],

      keyIdea:
        "Think of React as a component tree whose rendered UI is derived from current data."
    }

  ],


  visualizer: {

    title: "React Rendering & Component Tree Visualizer",

    description:
      "Follow data from a parent component through props into child components and observe how React derives the rendered interface.",

    steps: [

      {
        title: "Application data",
        operation: 'courses = ["C", "Python", "React"]',
        detail:
          "The application starts with data that describes the courses."
      },

      {
        title: "Parent component",
        operation: "App",
        detail:
          "App owns the course collection and passes it to CourseList."
      },

      {
        title: "Props flow",
        operation: "App → CourseList",
        detail:
          "CourseList receives the courses as a prop."
      },

      {
        title: "List transformation",
        operation: "courses.map(...)",
        detail:
          "The list component transforms each course into a CourseCard element."
      },

      {
        title: "Child props",
        operation: "CourseList → CourseCard",
        detail:
          "Each CourseCard receives one course through props."
      },

      {
        title: "JSX result",
        operation: "<article>...</article>",
        detail:
          "Each component describes the UI that should represent its current data."
      },

      {
        title: "React rendering",
        operation: "Render → compare → commit",
        detail:
          "React determines the appropriate DOM updates for the new rendered result."
      },

      {
        title: "Browser UI",
        operation: "Course cards appear",
        detail:
          "The browser displays the resulting interface."
      }

    ]

  },


  trace: {

    title: "React Component & Props Tracer",

    lines: [

      {
        line: 1,
        code: 'function App() {'
      },

      {
        line: 2,
        code: '  const course = "React";'
      },

      {
        line: 3,
        code: '  return <CourseCard title={course} />;'
      },

      {
        line: 4,
        code: '}'
      },

      {
        line: 5,
        code: 'function CourseCard({ title }) {'
      },

      {
        line: 6,
        code: '  return <h2>{title}</h2>;'
      },

      {
        line: 7,
        code: '}'
      }

    ],

    steps: [

      {
        line: 1,
        title: "App begins",
        detail:
          "React starts evaluating the App component."
      },

      {
        line: 2,
        title: "Create application value",
        detail:
          'The course variable receives the value "React".'
      },

      {
        line: 3,
        title: "Create child element",
        detail:
          "App describes a CourseCard and passes the course value as the title prop."
      },

      {
        line: 5,
        title: "CourseCard receives props",
        detail:
          "The child component receives the title value through its props parameter."
      },

      {
        line: 6,
        title: "Render child UI",
        detail:
          "The child uses title inside JSX to describe an h2 element."
      },

      {
        line: 6,
        title: "Rendered result",
        detail:
          'The resulting UI contains the text "React".'
      }

    ]

  },


  revision: [

    [
      "React",
      "A JavaScript library for building user interfaces using components and declarative rendering."
    ],

    [
      "Component",
      "A reusable piece of UI logic and structure."
    ],

    [
      "Functional component",
      "A JavaScript function that describes React UI."
    ],

    [
      "JSX",
      "Syntax that allows JavaScript code to describe React UI using an HTML-like form."
    ],

    [
      "Declarative UI",
      "Describing what the interface should look like for current data."
    ],

    [
      "Imperative UI",
      "Explicitly describing the steps needed to modify the interface."
    ],

    [
      "Props",
      "Inputs passed from a parent component to a child component."
    ],

    [
      "children",
      "The special prop containing JSX nested inside a component."
    ],

    [
      "Component composition",
      "Building larger interfaces by combining smaller components."
    ],

    [
      "One-way data flow",
      "The normal React pattern of passing data from parent to child."
    ],

    [
      "Key",
      "A stable identifier used for elements in a rendered list."
    ],

    [
      "Conditional rendering",
      "Rendering different UI depending on application data."
    ],

    [
      "Re-render",
      "Running component rendering logic again to calculate the UI for changed inputs."
    ],

    [
      "Pure rendering",
      "Rendering that primarily calculates UI from inputs without unrelated side effects."
    ],

    [
      "Component boundary",
      "A design boundary separating one meaningful UI responsibility from another."
    ]

  ],


  interview: [

    {
      question: "What is React?",
      answer:
        "React is a JavaScript library for building user interfaces using components and declarative rendering."
    },

    {
      question: "Why is React useful?",
      answer:
        "It provides a component model and rendering approach that helps developers build and maintain complex interactive interfaces."
    },

    {
      question: "What is a component?",
      answer:
        "A component is a reusable piece of UI logic and structure."
    },

    {
      question: "What is a functional component?",
      answer:
        "It is a JavaScript function that returns a React element description."
    },

    {
      question: "What is JSX?",
      answer:
        "JSX is syntax that allows developers to describe React UI using an HTML-like form inside JavaScript."
    },

    {
      question: "Is JSX HTML?",
      answer:
        "No. JSX looks similar to HTML but is JavaScript syntax transformed into React-compatible JavaScript."
    },

    {
      question: "What is declarative programming in React?",
      answer:
        "It means describing the UI that should exist for the current data instead of manually specifying every DOM mutation."
    },

    {
      question: "What is the difference between imperative and declarative UI?",
      answer:
        "Imperative UI describes the steps required to change the interface, while declarative UI describes the desired interface for the current data."
    },

    {
      question: "What are props?",
      answer:
        "Props are inputs passed from a parent component to a child component."
    },

    {
      question: "Can a child directly modify its props?",
      answer:
        "No. Props should be treated as read-only inputs."
    },

    {
      question: "What is one-way data flow?",
      answer:
        "It is the pattern where data normally flows from parent components to child components through props."
    },

    {
      question: "What is children?",
      answer:
        "children is a special prop containing the JSX nested inside a component."
    },

    {
      question: "Why are keys needed when rendering lists?",
      answer:
        "Keys provide stable identity for repeated elements so React can correctly reason about changes to the list."
    },

    {
      question: "Why can array indexes be poor keys?",
      answer:
        "When list items are inserted, removed or reordered, indexes can change and no longer represent stable item identity."
    },

    {
      question: "How do you render a list in React?",
      answer:
        "A common approach is to use JavaScript's map() method to transform data into JSX elements and provide each element with a stable key."
    },

    {
      question: "What is conditional rendering?",
      answer:
        "It is displaying different React UI depending on current data or state."
    },

    {
      question: "How are events handled in React?",
      answer:
        "Event handlers are passed to JSX event props such as onClick and onChange."
    },

    {
      question: "Why should onClick={handleClick()} usually be avoided?",
      answer:
        "It calls the function during rendering instead of passing the function for React to call when the event occurs."
    },

    {
      question: "What does re-rendering mean?",
      answer:
        "It means React runs the relevant rendering logic again to calculate the UI for changed inputs."
    },

    {
      question: "Does every React re-render recreate the entire browser DOM?",
      answer:
        "No. React determines the resulting UI changes and commits appropriate updates to the DOM."
    },

    {
      question: "Why avoid manual DOM manipulation in React?",
      answer:
        "Mixing uncontrolled DOM mutations with React's rendering can create competing sources of truth and unpredictable behaviour."
    },

    {
      question: "Are direct DOM APIs completely forbidden in React?",
      answer:
        "No. There are legitimate cases, especially through refs and integrations with external systems. The issue is manually controlling DOM that React also owns."
    },

    {
      question: "What is component composition?",
      answer:
        "It is building larger interfaces by combining smaller components."
    },

    {
      question: "What makes a good component boundary?",
      answer:
        "A good boundary usually represents a meaningful responsibility and makes the interface easier to reuse, understand or change."
    },

    {
      question: "What is pure rendering?",
      answer:
        "It means rendering primarily calculates UI from current inputs without performing unrelated side effects."
    }

  ],


  practice: [

    {
      title: "First React Component",

      difficulty: "Basic",

      task:
        "Create a Welcome component that renders 'Welcome to CodeBhavya' inside an h1.",

      hints: [
        "Create a function named Welcome.",
        "Return JSX.",
        "Use an h1 element.",
        "Component names should begin with an uppercase letter."
      ]
    },


    {
      title: "JSX Expression",

      difficulty: "Basic",

      task:
        "Create a Student component that displays a student's name and score using JavaScript variables inside JSX.",

      hints: [
        "Create name and score variables.",
        "Use curly braces inside JSX.",
        "Render both values."
      ]
    },


    {
      title: "Course List",

      difficulty: "Basic",

      task:
        "Create an array of five course names and render them as li elements using map().",

      hints: [
        "Create a courses array.",
        "Call courses.map().",
        "Return an li for each course.",
        "Give every li a key."
      ]
    },


    {
      title: "Stable List Keys",

      difficulty: "Intermediate",

      task:
        "Create a list of course objects containing id and name. Render the name and use the id as the key.",

      hints: [
        "Each object should have a stable id.",
        "Use map().",
        "Use key={course.id}.",
        "Do not use the array index as the key."
      ]
    },


    {
      title: "Reusable CourseCard",

      difficulty: "Intermediate",

      task:
        "Create a reusable CourseCard component that receives title, level and description through props.",

      hints: [
        "Destructure props in the component parameter.",
        "Render all three values.",
        "Use the component multiple times with different data."
      ]
    },


    {
      title: "Card Composition",

      difficulty: "Intermediate",

      task:
        "Create a Card component using children. Place a CourseCard inside it.",

      hints: [
        "Accept children as a prop.",
        "Render children inside the Card.",
        "Use <Card>...</Card> syntax."
      ]
    },


    {
      title: "Conditional Course Status",

      difficulty: "Intermediate",

      task:
        "Create a CourseStatus component that displays 'Completed' when completed is true and 'In Progress' otherwise.",

      hints: [
        "Receive completed through props.",
        "Use an if statement or ternary.",
        "Return different JSX for each condition."
      ]
    },


    {
      title: "React Event Handler",

      difficulty: "Intermediate",

      task:
        "Create a button that runs handleClick when the user clicks it.",

      hints: [
        "Create a handleClick function.",
        "Use onClick.",
        "Pass the function reference rather than calling it during rendering."
      ]
    },


    {
      title: "Course Dashboard",

      difficulty: "Advanced",

      task:
        "Build a CourseDashboard component that contains course data, passes it to CourseList, and renders each course through CourseCard.",

      hints: [
        "Keep course data in the parent.",
        "Pass courses through props.",
        "Use map() inside CourseList.",
        "Pass one course to each CourseCard.",
        "Use a stable id as the key."
      ]
    },


    {
      title: "Declarative vs Imperative Refactor",

      difficulty: "Advanced",

      task:
        "Take a small interface that manually changes DOM text and classes using querySelector() and rewrite it as a React component whose output depends on a value such as saved.",

      hints: [
        "Identify the data that determines the UI.",
        "Represent the UI using JSX.",
        "Use conditional rendering.",
        "Avoid document.querySelector() for the React-managed interface.",
        "Think about what the UI should look like rather than the DOM steps."
      ]
    },


    {
      title: "CodeBhavya Learning Dashboard",

      difficulty: "Advanced",

      task:
        "Build a small CodeBhavya dashboard using components for Header, CourseList, CourseCard, CourseBadge and EmptyState. Display at least six courses, use props and stable keys, conditionally show completed courses and compose everything from an App component.",

      hints: [
        "Start with the component tree.",
        "Keep course data in App.",
        "Pass data through props.",
        "Use map() for the course collection.",
        "Use stable course ids as keys.",
        "Use conditional rendering for completion status.",
        "Keep each component focused on one responsibility."
      ]
    }

  ],


  quiz: [

    {
      question: "What is React primarily used for?",
      options: [
        "Database administration",
        "Building user interfaces",
        "Writing operating systems",
        "Managing DNS"
      ],
      answer: 1
    },

    {
      question: "What is a React component?",
      options: [
        "A CSS selector",
        "A reusable piece of UI logic and structure",
        "A database table",
        "An HTTP request"
      ],
      answer: 1
    },

    {
      question: "What syntax is commonly used to describe React UI?",
      options: [
        "SQL",
        "JSX",
        "XML only",
        "Markdown only"
      ],
      answer: 1
    },

    {
      question: "Which is the JSX equivalent commonly used for HTML class?",
      options: [
        "className",
        "cssClass",
        "classValue",
        "classnameValue"
      ],
      answer: 0
    },

    {
      question: "How can JavaScript values be inserted into JSX?",
      options: [
        "Using []",
        "Using {}",
        "Using ()",
        "Using <>"
      ],
      answer: 1
    },

    {
      question: "Which JavaScript method is commonly used to render lists?",
      options: [
        "filter()",
        "map()",
        "reduce() only",
        "sort()"
      ],
      answer: 1
    },

    {
      question: "Why are keys used in React lists?",
      options: [
        "To style elements",
        "To provide stable item identity",
        "To make API requests",
        "To create CSS classes"
      ],
      answer: 1
    },

    {
      question: "What are props?",
      options: [
        "CSS properties",
        "Inputs passed to components",
        "Browser events only",
        "Database records"
      ],
      answer: 1
    },

    {
      question: "Should a child mutate its props?",
      options: [
        "Yes",
        "No",
        "Only strings",
        "Only arrays"
      ],
      answer: 1
    },

    {
      question: "What does children represent?",
      options: [
        "Browser child windows",
        "Nested JSX passed into a component",
        "Only text nodes",
        "CSS descendants"
      ],
      answer: 1
    },

    {
      question: "Which prop is commonly used for a click handler?",
      options: [
        "onclick",
        "click",
        "onClick",
        "handleClick"
      ],
      answer: 2
    },

    {
      question: "What is declarative UI?",
      options: [
        "Manually changing every DOM node",
        "Describing what the UI should look like",
        "Writing only CSS",
        "Avoiding JavaScript"
      ],
      answer: 1
    },

    {
      question: "What normally causes React rendering logic to run again?",
      options: [
        "A relevant input or state change",
        "Every CSS change",
        "Every HTTP request automatically",
        "The browser address bar"
      ],
      answer: 0
    },

    {
      question: "Should React-managed DOM normally be changed directly with querySelector()?",
      options: [
        "Yes, everywhere",
        "No, because it can conflict with React's rendering model",
        "Only for every click",
        "Always inside render"
      ],
      answer: 1
    },

    {
      question: "What is component composition?",
      options: [
        "Deleting components",
        "Combining smaller components into larger interfaces",
        "Writing CSS only",
        "Replacing props with HTML"
      ],
      answer: 1
    }

  ],


  glossary: [

    {
      term: "React",
      definition:
        "A JavaScript library for building user interfaces."
    },

    {
      term: "Component",
      definition:
        "A reusable piece of UI logic and structure."
    },

    {
      term: "JSX",
      definition:
        "JavaScript syntax used to describe React UI in an HTML-like form."
    },

    {
      term: "Declarative UI",
      definition:
        "Describing what the interface should look like for current data."
    },

    {
      term: "Imperative UI",
      definition:
        "Describing the specific steps needed to change the interface."
    },

    {
      term: "Props",
      definition:
        "Inputs passed from a parent component to a child component."
    },

    {
      term: "children",
      definition:
        "The special prop containing nested JSX."
    },

    {
      term: "Key",
      definition:
        "A stable identifier used for elements in a rendered list."
    },

    {
      term: "Component composition",
      definition:
        "Combining smaller components to build larger interfaces."
    },

    {
      term: "Conditional rendering",
      definition:
        "Rendering different UI based on current application data."
    },

    {
      term: "Re-render",
      definition:
        "Running component rendering logic again to calculate UI for new inputs."
    },

    {
      term: "One-way data flow",
      definition:
        "The normal pattern of passing data from parent components to children."
    },

    {
      term: "Pure rendering",
      definition:
        "Rendering that primarily calculates UI from current inputs without unrelated side effects."
    },

    {
      term: "Component boundary",
      definition:
        "A boundary representing a meaningful UI responsibility."
    }

  ],


  completion: {

    title: "Level 14 Complete — Think in React",

    message:
      "You now understand the core React mental model: components describe UI, " +
      "props carry data from parents to children, JSX expresses the interface, " +
      "lists use stable keys, and React coordinates rendering from application data.",

    challenge:
      "Build a CodeBhavya React Course Explorer using a component hierarchy. " +
      "Create App, Header, CourseList, CourseCard, CourseBadge and EmptyState " +
      "components. Store course data in App, pass it through props, render the " +
      "collection using map(), use stable ids as keys, conditionally display " +
      "completed courses, support an empty state and compose the complete page " +
      "without manually manipulating the React-managed DOM."
  },


  takeaway:
    "React becomes much easier once you stop thinking primarily in terms of DOM " +
    "operations. Think instead about components, data, props and the UI that should " +
    "exist for that data. The next levels will add state, hooks, forms, effects and " +
    "application-wide data while keeping this mental model at the centre."
};


console.log(
  "CodeBhavya Full Stack Level 14 loaded: React Mental Model"
);
