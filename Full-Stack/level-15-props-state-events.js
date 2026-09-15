"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[15] = {
  number: 15,
  title: "Props, State & Events",
  kicker: "LEVEL 15 · REACT APPLICATIONS",
  subtitle:
    "Understand how React components receive data, manage changing information and respond to user interactions.",
  estimatedTime: "4–5 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "REACT · PROPS · STATE · EVENTS",
    description:
      "Learn the three foundations of interactive React applications: props for receiving data, state for managing changing data, and events for responding to user actions."
  },

  objectives: [
    "Understand the difference between props and state.",
    "Pass data from parent components to child components.",
    "Work with props containing strings, numbers, arrays, objects and functions.",
    "Understand why props are read-only.",
    "Use the children prop for component composition.",
    "Understand component state and why state changes trigger rendering.",
    "Use useState() correctly for interactive components.",
    "Update primitive, object and array state safely.",
    "Understand React event handlers.",
    "Pass functions through props.",
    "Communicate from child components back to parents.",
    "Lift shared state to the appropriate component.",
    "Distinguish state from derived data.",
    "Avoid unnecessary duplicated state.",
    "Understand controlled interactive components.",
    "Build predictable component boundaries.",
    "Apply React state and event patterns to practical interfaces."
  ],

  sections: [
    {
      number: 1,
      title: "Why Props, State and Events Matter",
      intro:
        "A React component becomes useful when it can receive information, remember changing information and respond to user actions.",
      explanation:
        "Props, state and events work together. Props allow a parent to provide data to a child. State represents information owned by a component that can change over time. Events allow the interface to respond to user interaction.",
      comparison: {
        headers: ["Concept", "Main purpose", "Typical direction"],
        rows: [
          [
            "Props",
            "Pass data into a component",
            "Parent → Child"
          ],
          [
            "State",
            "Remember changing component data",
            "Owned by a component"
          ],
          [
            "Events",
            "Respond to user interaction",
            "User → Handler → State update"
          ]
        ]
      },
      keyIdea:
        "Interactive React applications are largely about moving data through components and changing state in response to events."
    },

    {
      number: 2,
      title: "What Are Props?",
      intro:
        "Props are values supplied to a React component by its parent.",
      explanation:
        "The word props is short for properties. A parent component can provide values through JSX attributes, and the child receives those values through its props object.",
      example: {
        label: "Passing a prop",
        code:
`function Welcome() {
  return <h2>Welcome to CodeBhavya</h2>;
}

function App() {
  return <Welcome />;
}`
      },
      exampleRequest:
`function Welcome(props) {
  return <h2>Welcome, {props.name}</h2>;
}

function App() {
  return <Welcome name="Bhavya" />;
}`,
      keyIdea:
        "Props are the primary mechanism for passing information into a component."
    },

    {
      number: 3,
      title: "Reading Props",
      intro:
        "A component can read the values supplied by its parent through its props parameter.",
      example: {
        label: "Reading multiple props",
        code:
`function StudentCard(props) {
  return (
    <article>
      <h2>{props.name}</h2>
      <p>Branch: {props.branch}</p>
      <p>Year: {props.year}</p>
    </article>
  );
}

function App() {
  return (
    <StudentCard
      name="Ravi"
      branch="CSE"
      year={3}
    />
  );
}`
      },
      points: [
        "Props are available inside the component.",
        "Each JSX attribute becomes a prop.",
        "String values can be written directly.",
        "JavaScript values use curly braces."
      ]
    },

    {
      number: 4,
      title: "Props Can Contain Different Data Types",
      intro:
        "Props are not limited to strings. Components can receive almost any JavaScript value.",
      methods: [
        {
          name: "String prop",
          purpose: "Pass textual information.",
          example: "<User name=\"Ravi\" />"
        },
        {
          name: "Number prop",
          purpose: "Pass numeric information.",
          example: "<Score value={95} />"
        },
        {
          name: "Boolean prop",
          purpose: "Represent a true/false condition.",
          example: "<Button disabled={true} />"
        },
        {
          name: "Array prop",
          purpose: "Provide a collection of values.",
          example: "<Courses items={courses} />"
        },
        {
          name: "Object prop",
          purpose: "Provide structured information.",
          example: "<Student data={student} />"
        },
        {
          name: "Function prop",
          purpose: "Allow a child to request behaviour owned by its parent.",
          example: "<Button onSave={saveStudent} />"
        }
      ],
      example: {
        label: "Different prop values",
        code:
`function Profile({ name, age, skills, active }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Active: {String(active)}</p>
      <p>{skills.join(", ")}</p>
    </div>
  );
}

const skills = ["JavaScript", "React"];

function App() {
  return (
    <Profile
      name="Anu"
      age={21}
      active={true}
      skills={skills}
    />
  );
}`
      }
    },

    {
      number: 5,
      title: "Destructuring Props",
      intro:
        "JavaScript destructuring makes components easier to read when several props are used.",
      example: {
        label: "Without destructuring",
        code:
`function StudentCard(props) {
  return (
    <h2>{props.name}</h2>
  );
}`
      },
      exampleRequest:
`function StudentCard({ name, branch }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{branch}</p>
    </div>
  );
}`,
      keyIdea:
        "Destructuring is a JavaScript feature, not a special React feature."
    },

    {
      number: 6,
      title: "Default Prop Values",
      intro:
        "A component can provide fallback values when a particular prop is not supplied.",
      example: {
        label: "Default value during destructuring",
        code:
`function Button({
  label = "Submit"
}) {
  return <button>{label}</button>;
}

function App() {
  return <Button />;
}`
      },
      points: [
        "Default values prevent unnecessary undefined output.",
        "They are useful for optional component properties.",
        "The default is used when the prop is undefined."
      ]
    },

    {
      number: 7,
      title: "Props Are Read-Only",
      intro:
        "A child component should not directly modify the props it receives.",
      explanation:
        "Props represent data provided by another component. Treating them as read-only keeps the data flow predictable.",
      example: {
        label: "Do not mutate props",
        code:
`function Counter({ count }) {
  // Wrong idea:
  // count = count + 1;

  return <p>{count}</p>;
}`
      },
      warning:
        "A child should not try to change its parent's data by directly modifying a prop.",
      keyIdea:
        "If a component needs to change information over time, that information normally belongs in state somewhere appropriate in the component hierarchy."
    },

    {
      number: 8,
      title: "Parent to Child Data Flow",
      intro:
        "React normally follows a one-way data flow from parent components toward child components.",
      visualizer: {
        title: "Props Data Flow",
        description:
          "Follow a value from a parent component into a child component.",
        steps: [
          {
            title: "Step 1 — Parent owns data",
            operation: "App has student information.",
            detail:
              "The parent component has access to the data that needs to be displayed."
          },
          {
            title: "Step 2 — Parent renders child",
            operation: "<StudentCard student={student} />",
            detail:
              "The parent supplies the student object as a prop."
          },
          {
            title: "Step 3 — Child receives props",
            operation: "StudentCard({ student })",
            detail:
              "The child receives the object through its props."
          },
          {
            title: "Step 4 — Child renders",
            operation: "{student.name}",
            detail:
              "The child uses the supplied value to produce its UI."
          }
        ]
      },
      keyIdea:
        "The parent sends information downward through props."
    },

    {
      number: 9,
      title: "Component Composition",
      intro:
        "Instead of making one huge component, React encourages building smaller components and combining them.",
      example: {
        label: "Composition",
        code:
`function Page() {
  return (
    <Dashboard>
      <Header />
      <StudentList />
      <Footer />
    </Dashboard>
  );
}`
      },
      points: [
        "Small components are easier to understand.",
        "Components can be reused.",
        "Each component can focus on one responsibility.",
        "Composition creates flexible UI structures."
      ],
      keyIdea:
        "Good React architecture is usually about composing focused components rather than building one giant component."
    },

    {
      number: 10,
      title: "The children Prop",
      intro:
        "Anything placed between a component's opening and closing JSX tags is available through the children prop.",
      example: {
        label: "children",
        code:
`function Card({ children }) {
  return (
    <section className="card">
      {children}
    </section>
  );
}

function App() {
  return (
    <Card>
      <h2>Student Profile</h2>
      <p>Welcome to CodeBhavya.</p>
    </Card>
  );
}`
      },
      explanation:
        "The children prop makes wrapper components highly reusable because the wrapper does not need to know exactly what content it will contain."
    },

    {
      number: 11,
      title: "What Is State?",
      intro:
        "State represents information that belongs to a component and can change during the component's lifetime.",
      explanation:
        "Examples include a counter value, selected tab, open/closed menu, current search text, logged-in status or selected student.",
      comparison: {
        headers: ["Data", "Usually state?", "Reason"],
        rows: [
          [
            "Current counter value",
            "Yes",
            "Changes during interaction"
          ],
          [
            "Selected tab",
            "Yes",
            "Changes based on user action"
          ],
          [
            "Student name passed as prop",
            "No",
            "Owned by the parent"
          ],
          [
            "Value calculated from existing state",
            "Usually no",
            "Can be derived during rendering"
          ]
        ]
      },
      keyIdea:
        "State is for information that changes and whose change should affect the rendered interface."
    },

    {
      number: 12,
      title: "useState()",
      intro:
        "The useState Hook lets a functional component store state.",
      example: {
        label: "Basic state",
        code:
`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      <button
        onClick={() => setCount(count + 1)}
      >
        Increase
      </button>
    </div>
  );
}`
      },
      breakdown: [
        {
          label: "count",
          description:
            "The current state value."
        },
        {
          label: "setCount",
          description:
            "The function used to request a state update."
        },
        {
          label: "useState(0)",
          description:
            "Initializes the state with the value 0."
        }
      ],
      keyIdea:
        "The setter function is the proper mechanism for requesting a state update."
    },

    {
      number: 13,
      title: "State Updates Cause Re-rendering",
      intro:
        "When React processes a state update, the component can render again using the new state.",
      example: {
        label: "State-driven UI",
        code:
`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2>{count}</h2>

      <button
        onClick={() => setCount(count + 1)}
      >
        Increase
      </button>
    </>
  );
}`
      },
      explanation:
        "The important mental model is not 'React changes this HTML element directly because I called setCount'. Instead, state changes lead React to render the component again and reconcile the resulting UI.",
      keyIdea:
        "State is the source of changing information that influences rendering."
    },

    {
      number: 14,
      title: "Updating State from Previous State",
      intro:
        "When the next state depends on the previous state, use the functional updater form.",
      example: {
        label: "Functional state update",
        code:
`function Counter() {
  const [count, setCount] = useState(0);

  function increaseTwice() {
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
  }

  return (
    <button onClick={increaseTwice}>
      Count: {count}
    </button>
  );
}`
      },
      warning:
        "When the new value depends on the previous value, the updater function makes that dependency explicit and avoids relying on a stale captured value.",
      keyIdea:
        "Use setState(previous => nextValue) when the next state depends on the previous state."
    },

    {
      number: 15,
      title: "State with Strings and Booleans",
      intro:
        "State can represent simple UI values such as text, selections and visibility.",
      example: {
        label: "String state",
        code:
`const [name, setName] = useState("");

setName("Bhavya");`
      },
      exampleRequest:
`const [open, setOpen] = useState(false);

function toggleMenu() {
  setOpen(previous => !previous);
}`,
      points: [
        "Strings can store input or selection values.",
        "Booleans are useful for open/closed or active/inactive states.",
        "Use the setter rather than mutating the current state variable."
      ]
    },

    {
      number: 16,
      title: "State with Objects",
      intro:
        "When state is an object, create a new object when changing a property.",
      example: {
        label: "Updating an object",
        code:
`const [student, setStudent] = useState({
  name: "Ravi",
  branch: "CSE",
  year: 3
});

function changeYear() {
  setStudent(previous => ({
    ...previous,
    year: 4
  }));
}`
      },
      warning:
        "Do not directly mutate the existing state object such as student.year = 4.",
      keyIdea:
        "Treat state objects as immutable values: create the next object rather than modifying the existing one."
    },

    {
      number: 17,
      title: "State with Arrays",
      intro:
        "Arrays in state should also be updated by creating a new array.",
      example: {
        label: "Adding an item",
        code:
`const [skills, setSkills] = useState([
  "HTML",
  "CSS"
]);

function addSkill() {
  setSkills(previous => [
    ...previous,
    "JavaScript"
  ]);
}`
      },
      methods: [
        {
          name: "Add",
          purpose: "Create a new array containing the existing items and the new item.",
          example: "setItems(previous => [...previous, item]);"
        },
        {
          name: "Remove",
          purpose: "Create a filtered array.",
          example: "setItems(previous => previous.filter(x => x.id !== id));"
        },
        {
          name: "Update",
          purpose: "Create a new array using map().",
          example: "setItems(previous => previous.map(x => x.id === id ? updated : x));"
        }
      ]
    },

    {
      number: 18,
      title: "Why Immutability Matters",
      intro:
        "React applications become easier to reason about when state is updated without mutating existing objects and arrays.",
      comparison: {
        headers: ["Operation", "Avoid", "Prefer"],
        rows: [
          [
            "Object update",
            "student.year = 4",
            "{ ...student, year: 4 }"
          ],
          [
            "Array add",
            "items.push(item)",
            "[...items, item]"
          ],
          [
            "Array remove",
            "items.splice(...)",
            "items.filter(...)"
          ],
          [
            "Array update",
            "Direct mutation",
            "items.map(...)"
          ]
        ]
      },
      keyIdea:
        "Immutable updates create a clear next state and make React state transitions easier to reason about."
    },

    {
      number: 19,
      title: "React Events",
      intro:
        "React lets components respond to browser events using JSX event handler props.",
      methods: [
        {
          name: "onClick",
          purpose: "Respond to clicks.",
          example: "<button onClick={handleClick}>Save</button>"
        },
        {
          name: "onChange",
          purpose: "Respond to input value changes.",
          example: "<input onChange={handleChange} />"
        },
        {
          name: "onSubmit",
          purpose: "Respond to form submission.",
          example: "<form onSubmit={handleSubmit}>"
        },
        {
          name: "onKeyDown",
          purpose: "Respond when a keyboard key is pressed.",
          example: "<input onKeyDown={handleKeyDown} />"
        }
      ],
      example: {
        label: "Event handler",
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
}`
      },
      commonMistake:
        "Do not call the handler while rendering: onClick={handleClick()} would execute it immediately. Pass the function instead."
    },

    {
      number: 20,
      title: "The Event Object",
      intro:
        "React event handlers receive an event object containing information about the interaction.",
      example: {
        label: "Reading input value",
        code:
`function SearchBox() {
  function handleChange(event) {
    console.log(event.target.value);
  }

  return (
    <input onChange={handleChange} />
  );
}`
      },
      points: [
        "event.target is the element that initiated the event.",
        "event.currentTarget refers to the element whose handler is currently executing.",
        "Input events commonly use event.target.value.",
        "Form events often use event.preventDefault()."
      ]
    },

    {
      number: 21,
      title: "Passing Functions as Props",
      intro:
        "Functions can be passed from parents to children just like other JavaScript values.",
      example: {
        label: "Function prop",
        code:
`function DeleteButton({ onDelete }) {
  return (
    <button onClick={onDelete}>
      Delete
    </button>
  );
}

function App() {
  function handleDelete() {
    console.log("Deleting...");
  }

  return (
    <DeleteButton
      onDelete={handleDelete}
    />
  );
}`
      },
      keyIdea:
        "A function prop lets a child trigger behaviour that is defined by the parent."
    },

    {
      number: 22,
      title: "Child to Parent Communication",
      intro:
        "React data normally flows downward, but a child can notify a parent by calling a function supplied through props.",
      visualizer: {
        title: "Child-to-Parent Event Flow",
        description:
          "Follow an event from a child button to parent-owned state.",
        steps: [
          {
            title: "Step 1 — Parent owns state",
            operation: "const [count, setCount] = useState(0)",
            detail:
              "The parent owns the changing value."
          },
          {
            title: "Step 2 — Parent passes function",
            operation: "<Child onIncrease={increase} />",
            detail:
              "The parent gives the child a function prop."
          },
          {
            title: "Step 3 — Child handles click",
            operation: "<button onClick={onIncrease}>",
            detail:
              "The child responds to the user's click."
          },
          {
            title: "Step 4 — Parent updates state",
            operation: "setCount(previous => previous + 1)",
            detail:
              "The callback executes in the parent and updates parent-owned state."
          },
          {
            title: "Step 5 — React renders again",
            operation: "Parent and affected children render using the new state.",
            detail:
              "The updated value flows down again through props."
          }
        ]
      },
      example: {
        label: "Child calls parent function",
        code:
`function Child({ onIncrease }) {
  return (
    <button onClick={onIncrease}>
      Increase
    </button>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(previous => previous + 1);
  }

  return (
    <>
      <p>{count}</p>
      <Child onIncrease={increase} />
    </>
  );
}`
      }
    },

    {
      number: 23,
      title: "Lifting State Up",
      intro:
        "When multiple sibling components need the same changing information, move the state to their nearest suitable common parent.",
      explanation:
        "This pattern is called lifting state up. The parent owns the shared state and passes values and event handlers down to the children.",
      architecture: [
        {
          title: "Parent",
          items: [
            "Owns shared state.",
            "Updates the state.",
            "Passes current values down."
          ]
        },
        {
          title: "Child A",
          items: [
            "Receives the value.",
            "Can trigger an update through a function prop."
          ]
        },
        {
          title: "Child B",
          items: [
            "Receives the same shared value.",
            "Renders consistently with Child A."
          ]
        }
      ],
      keyIdea:
        "Shared state should have one appropriate owner rather than separate duplicated copies in sibling components."
    },

    {
      number: 24,
      title: "Controlled Components",
      intro:
        "A controlled component is an input whose displayed value is driven by React state.",
      example: {
        label: "Controlled input",
        code:
`function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={event =>
        setName(event.target.value)
      }
    />
  );
}`
      },
      points: [
        "React state stores the current value.",
        "The value prop controls what the input displays.",
        "onChange updates the state.",
        "The state then becomes the source of truth for the input."
      ],
      keyIdea:
        "Controlled inputs create an explicit connection between user input, state and rendering."
    },

    {
      number: 25,
      title: "State vs Props",
      intro:
        "Props and state can look similar because both contain data, but their responsibilities are different.",
      comparison: {
        headers: ["Feature", "Props", "State"],
        rows: [
          [
            "Source",
            "Parent component",
            "Component or state owner"
          ],
          [
            "Purpose",
            "Receive external data",
            "Store changing data"
          ],
          [
            "Child directly changes it?",
            "No",
            "Uses setter"
          ],
          [
            "Read-only?",
            "Yes",
            "Current state should be treated as read-only"
          ],
          [
            "Triggers rendering when changed?",
            "Parent updates can cause child rendering",
            "State updates cause affected component rendering"
          ]
        ]
      },
      keyIdea:
        "Props describe what a component receives; state describes changing information the component or its owner manages."
    },

    {
      number: 26,
      title: "Derived Data",
      intro:
        "Not every value displayed by a component needs to be stored separately in state.",
      example: {
        label: "Derive filtered results",
        code:
`const [students, setStudents] = useState([]);
const [query, setQuery] = useState("");

const filteredStudents = students.filter(
  student =>
    student.name
      .toLowerCase()
      .includes(query.toLowerCase())
);`
      },
      explanation:
        "filteredStudents can be calculated from students and query. Storing a second state variable for filteredStudents can create synchronization problems.",
      warning:
        "Avoid duplicated state when a value can be reliably calculated from existing props or state during rendering."
    },

    {
      number: 27,
      title: "Avoiding Redundant State",
      intro:
        "Duplicating the same information in multiple state variables makes applications harder to maintain.",
      example: {
        label: "Redundant state",
        code:
`const [firstName, setFirstName] = useState("Ravi");
const [lastName, setLastName] = useState("Kumar");

// Usually unnecessary:
const [fullName, setFullName] =
  useState("Ravi Kumar");`
      },
      exampleRequest:
`const fullName =
  \`\${firstName} \${lastName}\`;`,
      points: [
        "Store the minimum necessary changing information.",
        "Calculate derived values when practical.",
        "Avoid multiple state variables that can disagree.",
        "Simpler state models are easier to debug."
      ]
    },

    {
      number: 28,
      title: "Event → State → Render",
      intro:
        "A useful mental model for interactive React applications is an event causing a state update, followed by rendering based on the new state.",
      trace: {
        title: "React Interaction Tracer",
        lines: [
          {
            line: 1,
            code: "const [count, setCount] = useState(0);"
          },
          {
            line: 2,
            code: "function increase() {"
          },
          {
            line: 3,
            code: "  setCount(previous => previous + 1);"
          },
          {
            line: 4,
            code: "}"
          },
          {
            line: 5,
            code: "<button onClick={increase}>Increase</button>"
          },
          {
            line: 6,
            code: "<p>{count}</p>"
          }
        ],
        steps: [
          {
            line: 5,
            title: "User clicks",
            detail:
              "The browser reports the click and React invokes the registered handler."
          },
          {
            line: 2,
            title: "Handler runs",
            detail:
              "increase() executes in response to the event."
          },
          {
            line: 3,
            title: "State update requested",
            detail:
              "setCount() receives a function that calculates the next state."
          },
          {
            line: 1,
            title: "React processes update",
            detail:
              "The state moves from 0 to 1."
          },
          {
            line: 6,
            title: "Component renders",
            detail:
              "The JSX now uses the updated count value."
          }
        ]
      },
      keyIdea:
        "Think in terms of Event → State Update → Render."
    },

    {
      number: 29,
      title: "Building Interactive Component Architecture",
      intro:
        "A good React application gives each component a clear responsibility and places state at the right level.",
      architecture: [
        {
          title: "App",
          items: [
            "Owns application-level data needed by multiple sections.",
            "Coordinates major child components."
          ]
        },
        {
          title: "SearchPanel",
          items: [
            "Displays search controls.",
            "Reports user changes through callbacks."
          ]
        },
        {
          title: "StudentList",
          items: [
            "Receives filtered student data.",
            "Renders the collection."
          ]
        },
        {
          title: "StudentCard",
          items: [
            "Receives one student through props.",
            "Displays student information."
          ]
        }
      ],
      example: {
        label: "Conceptual architecture",
        code:
`function App() {
  const [query, setQuery] = useState("");

  const filteredStudents =
    students.filter(student =>
      student.name
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  return (
    <>
      <SearchPanel
        query={query}
        onQueryChange={setQuery}
      />

      <StudentList
        students={filteredStudents}
      />
    </>
  );
}`
      }
    },

    {
      number: 30,
      title: "Complete Interactive React Pattern",
      intro:
        "Props, state and events become powerful when combined into a complete interactive component.",
      example: {
        label: "Student selector",
        code:
`import { useState } from "react";

function StudentCard({
  student,
  selected,
  onSelect
}) {
  return (
    <article>
      <h3>{student.name}</h3>

      <p>{student.branch}</p>

      <button onClick={() => onSelect(student.id)}>
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
}

function App() {
  const [selectedId, setSelectedId] =
    useState(null);

  const students = [
    { id: 1, name: "Ravi", branch: "CSE" },
    { id: 2, name: "Anu", branch: "AI-ML" }
  ];

  return (
    <section>
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          selected={student.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}
    </section>
  );
}`
      },
      breakdown: [
        {
          label: "Data",
          description:
            "The parent has the student collection."
        },
        {
          label: "State",
          description:
            "The parent owns selectedId."
        },
        {
          label: "Props",
          description:
            "Each StudentCard receives student, selected and onSelect."
        },
        {
          label: "Event",
          description:
            "The child calls onSelect when the button is clicked."
        },
        {
          label: "Update",
          description:
            "The parent's state changes."
        },
        {
          label: "Render",
          description:
            "The children receive the updated selected value."
        }
      ],
      keyIdea:
        "This pattern combines one-way data flow, props, state and events into a predictable interactive UI."
    }
  ],

  visualizer: {
    title: "Props, State & Event Visualizer",
    description:
      "Trace a user interaction from a child component to parent-owned state and back down through props.",
    steps: [
      {
        title: "Step 1 — State owner",
        operation:
          "The parent stores selectedId using useState().",
        detail:
          "The parent becomes the source of truth for the selected student."
      },
      {
        title: "Step 2 — Pass props",
        operation:
          "<StudentCard selected={...} onSelect={...} />",
        detail:
          "The current value and update function flow down to the child."
      },
      {
        title: "Step 3 — User event",
        operation:
          "The user clicks Select.",
        detail:
          "The child handles the click event."
      },
      {
        title: "Step 4 — Callback",
        operation:
          "onSelect(student.id)",
        detail:
          "The child calls the function supplied by the parent."
      },
      {
        title: "Step 5 — State update",
        operation:
          "setSelectedId(student.id)",
        detail:
          "The parent requests a new state value."
      },
      {
        title: "Step 6 — Re-render",
        operation:
          "React renders with the updated state.",
        detail:
          "The new selected value flows down through props."
      },
      {
        title: "Step 7 — Updated UI",
        operation:
          "The selected card displays 'Selected'.",
        detail:
          "The interface reflects the new state."
      }
    ]
  },

  trace: {
    title: "Props, State and Events Tracer",
    lines: [
      {
        line: 1,
        code: "const [selectedId, setSelectedId] = useState(null);"
      },
      {
        line: 2,
        code: "function StudentCard({ student, onSelect }) {"
      },
      {
        line: 3,
        code: "  return <button onClick={() => onSelect(student.id)}>"
      },
      {
        line: 4,
        code: "    Select"
      },
      {
        line: 5,
        code: "  </button>;"
      },
      {
        line: 6,
        code: "}"
      },
      {
        line: 7,
        code: "<StudentCard onSelect={setSelectedId} student={student} />"
      }
    ],
    steps: [
      {
        line: 1,
        title: "Initial state",
        detail:
          "selectedId starts as null."
      },
      {
        line: 7,
        title: "Pass callback",
        detail:
          "The parent passes setSelectedId to StudentCard as onSelect."
      },
      {
        line: 3,
        title: "User clicks",
        detail:
          "The button's click handler calls onSelect(student.id)."
      },
      {
        line: 1,
        title: "Update state",
        detail:
          "The parent's state setter receives the selected student's id."
      },
      {
        line: 7,
        title: "Render again",
        detail:
          "The parent renders the child with updated props."
      }
    ]
  },

  revision: [
    [
      "Props",
      "Values passed from a parent component to a child component."
    ],
    [
      "State",
      "Changing information managed by a component or an appropriate state owner."
    ],
    [
      "Event",
      "A user or browser interaction that can trigger application behaviour."
    ],
    [
      "useState",
      "A React Hook used to add state to a functional component."
    ],
    [
      "State setter",
      "The function returned by useState that requests a state update."
    ],
    [
      "children",
      "The content placed between a component's opening and closing JSX tags."
    ],
    [
      "One-way data flow",
      "The common React pattern of passing data from parent to child."
    ],
    [
      "Function prop",
      "A function passed through props so a child can trigger parent-owned behaviour."
    ],
    [
      "Lifting state up",
      "Moving shared state to the nearest suitable common parent."
    ],
    [
      "Controlled component",
      "An input whose current value is controlled by React state."
    ],
    [
      "Derived data",
      "A value calculated from existing props or state instead of stored separately."
    ],
    [
      "Immutable update",
      "Creating a new state value instead of directly mutating the existing one."
    ]
  ],

  interview: [
    {
      question: "What are props in React?",
      answer:
        "Props are values passed from a parent component to a child component."
    },
    {
      question: "Are props mutable?",
      answer:
        "A child should treat its props as read-only and should not directly modify them."
    },
    {
      question: "What is state?",
      answer:
        "State is changing information managed by a component or an appropriate state owner that affects rendering."
    },
    {
      question: "What is useState()?",
      answer:
        "useState is a React Hook that lets a functional component store state."
    },
    {
      question: "What does useState() return?",
      answer:
        "It returns the current state value and a setter function."
    },
    {
      question: "Why does React need a state setter?",
      answer:
        "The setter tells React that the component's state should be updated and the UI may need to render again."
    },
    {
      question: "What is one-way data flow?",
      answer:
        "It is the pattern where data normally flows from parent components down to children through props."
    },
    {
      question: "How can a child communicate with a parent?",
      answer:
        "The parent can pass a function as a prop, and the child can call that function."
    },
    {
      question: "What is lifting state up?",
      answer:
        "Moving shared state to the nearest suitable common parent of the components that need it."
    },
    {
      question: "What is the children prop?",
      answer:
        "It represents content passed between a component's opening and closing JSX tags."
    },
    {
      question: "Can props contain functions?",
      answer:
        "Yes. Functions are ordinary JavaScript values and can be passed through props."
    },
    {
      question: "Can props contain objects?",
      answer:
        "Yes. Objects can be passed through JSX expressions."
    },
    {
      question: "What is a controlled input?",
      answer:
        "An input whose displayed value is driven by React state."
    },
    {
      question: "Why should state objects not be mutated directly?",
      answer:
        "Immutable updates create a clear next state and avoid problems caused by modifying existing state references."
    },
    {
      question: "How do you add an item to an array in state?",
      answer:
        "Create a new array, commonly using the spread operator."
    },
    {
      question: "How do you remove an item from an array in state?",
      answer:
        "Create a filtered array using filter()."
    },
    {
      question: "How do you update an item in an array in state?",
      answer:
        "Create a new array using map() or another immutable transformation."
    },
    {
      question: "When should you use the functional state updater?",
      answer:
        "When the next state depends on the previous state."
    },
    {
      question: "What is derived data?",
      answer:
        "Data that can be calculated from existing props or state."
    },
    {
      question: "Why avoid redundant state?",
      answer:
        "Multiple copies of related data can become inconsistent and create synchronization bugs."
    },
    {
      question: "What does onClick={handleClick} mean?",
      answer:
        "It registers handleClick as the click handler."
    },
    {
      question: "What is wrong with onClick={handleClick()}?",
      answer:
        "It calls the function during rendering instead of passing the function for the future click event."
    },
    {
      question: "What is event.target?",
      answer:
        "It usually refers to the element that initiated the event."
    },
    {
      question: "What is event.currentTarget?",
      answer:
        "It refers to the element whose event handler is currently handling the event."
    },
    {
      question: "What is the difference between props and state?",
      answer:
        "Props are received from outside the component, while state is changing information managed by an appropriate state owner."
    },
    {
      question: "Why is state called a source of truth?",
      answer:
        "Because the UI can be derived from the current state instead of maintaining separate conflicting copies."
    },
    {
      question: "What is component composition?",
      answer:
        "Combining smaller focused components to create larger interfaces."
    },
    {
      question: "Why should state be placed carefully?",
      answer:
        "The state owner should be able to provide the data and update behaviour to all components that need it without unnecessary duplication."
    }
  ],

  practice: [
    {
      task:
        "Create a UserCard component that accepts name, role and location through props.",
      hints: [
        "Destructure the props.",
        "Render all three values.",
        "Pass the values from a parent component."
      ]
    },
    {
      task:
        "Create a reusable Button component that receives label and onClick as props.",
      hints: [
        "Use a function prop.",
        "Connect it to the button's onClick."
      ]
    },
    {
      task:
        "Build a Counter component using useState().",
      hints: [
        "Start at 0.",
        "Add Increase and Decrease buttons.",
        "Use functional updates."
      ]
    },
    {
      task:
        "Create a toggle component that displays 'ON' and 'OFF'.",
      hints: [
        "Use boolean state.",
        "Toggle using previous => !previous."
      ]
    },
    {
      task:
        "Create a component that maintains a student object containing name, branch and year.",
      hints: [
        "Use object state.",
        "Use the spread operator when changing one property."
      ]
    },
    {
      task:
        "Build a Skills component that can add and remove skills from an array in state.",
      hints: [
        "Use [...previous, newSkill] to add.",
        "Use filter() to remove."
      ]
    },
    {
      task:
        "Build a controlled search input using React state.",
      hints: [
        "Connect value to state.",
        "Update state in onChange."
      ]
    },
    {
      task:
        "Create Parent and Child components where the child button updates a counter owned by the parent.",
      hints: [
        "Parent owns useState().",
        "Pass a function to Child.",
        "Child calls the function."
      ]
    },
    {
      task:
        "Build two sibling components that display the same selected student using lifted state.",
      hints: [
        "Move state into the common parent.",
        "Pass the selected student to both children."
      ]
    },
    {
      task:
        "Build a student list with Select buttons where only the selected student displays 'Selected'.",
      hints: [
        "Store selectedId.",
        "Pass selected and onSelect as props.",
        "Compare student.id with selectedId."
      ]
    },
    {
      task:
        "Create a reusable Card component using the children prop.",
      hints: [
        "Destructure children.",
        "Render children inside a styled container."
      ]
    },
    {
      task:
        "Create a student search interface where the filtered list is derived from students and query rather than stored as separate state.",
      hints: [
        "Store students and query.",
        "Use filter() during rendering."
      ]
    }
  ],

  quiz: [
    {
      question: "What is the primary purpose of props?",
      options: [
        "Store browser cookies",
        "Pass data into components",
        "Create CSS",
        "Replace JavaScript"
      ],
      answer: 1
    },
    {
      question: "Who normally provides props to a child?",
      options: [
        "The browser",
        "The parent component",
        "The CSS engine",
        "The database"
      ],
      answer: 1
    },
    {
      question: "Should a child directly modify its props?",
      options: [
        "Yes",
        "Only strings",
        "No",
        "Only arrays"
      ],
      answer: 2
    },
    {
      question: "Which Hook is used for component state?",
      options: [
        "useData",
        "useState",
        "useValue",
        "useComponent"
      ],
      answer: 1
    },
    {
      question: "What does useState() return?",
      options: [
        "Only the state value",
        "A value and a setter function",
        "Only a setter",
        "An HTML element"
      ],
      answer: 1
    },
    {
      question: "Which approach is preferred for updating an object in state?",
      options: [
        "Direct mutation",
        "Create a new object",
        "Delete the state",
        "Modify the DOM"
      ],
      answer: 1
    },
    {
      question: "Which method is commonly used to remove items immutably from an array?",
      options: [
        "filter()",
        "push()",
        "splice()",
        "sort()"
      ],
      answer: 0
    },
    {
      question: "What does onClick={handleClick} do?",
      options: [
        "Calls handleClick during every render",
        "Registers handleClick as the click handler",
        "Creates a Promise",
        "Changes CSS"
      ],
      answer: 1
    },
    {
      question: "How can a child notify its parent?",
      options: [
        "Modify the parent's props",
        "Use a function passed through props",
        "Directly modify the parent's DOM",
        "Use CSS"
      ],
      answer: 1
    },
    {
      question: "What is lifting state up?",
      options: [
        "Moving CSS upward",
        "Moving shared state to a suitable common parent",
        "Deleting state",
        "Moving state into HTML"
      ],
      answer: 1
    },
    {
      question: "What is a controlled input?",
      options: [
        "An input controlled by CSS",
        "An input whose value is driven by React state",
        "An input without events",
        "An input controlled by the database"
      ],
      answer: 1
    },
    {
      question: "What does children represent?",
      options: [
        "Only strings",
        "Content passed between component tags",
        "Only event handlers",
        "Component state"
      ],
      answer: 1
    },
    {
      question: "When should you use a functional state updater?",
      options: [
        "When next state depends on previous state",
        "Only for strings",
        "Only for props",
        "Never"
      ],
      answer: 0
    },
    {
      question: "Which is usually better for derived filtered data?",
      options: [
        "Duplicate it in state",
        "Calculate it from existing state",
        "Store it in cookies",
        "Modify the DOM manually"
      ],
      answer: 1
    },
    {
      question: "What is one-way data flow?",
      options: [
        "Data normally moving from child to parent automatically",
        "Data normally moving from parent to child through props",
        "Data moving only through CSS",
        "Data moving only through the database"
      ],
      answer: 1
    },
    {
      question: "Which is an immutable array update?",
      options: [
        "items.push(item)",
        "items.splice(0, 1)",
        "[...items, item]",
        "items[0] = item"
      ],
      answer: 2
    }
  ],

  glossary: [
    {
      term: "Props",
      definition:
        "Values passed from a parent component to a child component."
    },
    {
      term: "State",
      definition:
        "Changing information managed by a component or appropriate state owner."
    },
    {
      term: "useState",
      definition:
        "React Hook for adding state to a functional component."
    },
    {
      term: "State setter",
      definition:
        "The function returned by useState that requests a state update."
    },
    {
      term: "children",
      definition:
        "Content placed between a component's opening and closing JSX tags."
    },
    {
      term: "Function prop",
      definition:
        "A function passed through props so a child can trigger behaviour defined by the parent."
    },
    {
      term: "Lifting state up",
      definition:
        "Moving shared state to a suitable common parent."
    },
    {
      term: "Controlled component",
      definition:
        "A component whose important input value is controlled by React state."
    },
    {
      term: "Derived data",
      definition:
        "A value calculated from existing props or state."
    },
    {
      term: "Immutable update",
      definition:
        "Creating a new state value instead of directly modifying an existing state object or array."
    },
    {
      term: "Event handler",
      definition:
        "A function that responds to a user or browser event."
    },
    {
      term: "Component composition",
      definition:
        "Building larger interfaces by combining smaller components."
    }
  ],

  completion: {
    title: "Interactive Student Dashboard Challenge",
    message:
      "Build a React Student Dashboard containing a student list, search box, selected-student panel and reusable StudentCard components. Use props for data flow, state for changing information and event handlers for user interaction.",
    challenge:
      "The parent should own the selected student and search state. The child cards must communicate selection through function props. Search results should be derived from existing state rather than stored as redundant state. Add, remove or update a student using immutable state updates."
  },

  takeaway:
    "Props move information into components, state stores changing information, and events connect user actions to state updates. Once you understand the Event → State Update → Render cycle and one-way data flow, React component architecture becomes much more predictable."
};
