"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[16] = {
  number: 16,
  title: "Hooks, Forms & Effects",
  kicker: "LEVEL 16 · REACT APPLICATIONS",
  subtitle:
    "Master React Hooks, controlled forms, effects, dependency arrays, cleanup and reliable component synchronization.",
  estimatedTime: "5–6 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "HOOKS · FORMS · EFFECTS",
    description:
      "Learn how React components manage state, handle forms, synchronize with external systems and clean up asynchronous or browser resources."
  },

  objectives: [
    "Understand the purpose and rules of React Hooks.",
    "Use useState() effectively in interactive components.",
    "Update primitive, object and array state safely.",
    "Understand controlled forms and form state.",
    "Handle text inputs, checkboxes, selects and textareas.",
    "Validate form data before submission.",
    "Manage form submission and loading states.",
    "Understand what useEffect() is designed to do.",
    "Distinguish events from Effects.",
    "Understand dependency arrays.",
    "Understand Effect setup and cleanup.",
    "Clean up timers, subscriptions and browser event listeners.",
    "Fetch data using an Effect when appropriate.",
    "Avoid stale asynchronous results.",
    "Understand why Effects can accidentally create loops.",
    "Recognize when an Effect is unnecessary.",
    "Understand useRef() at a practical level.",
    "Use refs for DOM access and values that should not trigger rendering.",
    "Build a complete React form with validation and API-style submission."
  ],

  sections: [
    {
      number: 1,
      title: "What Are React Hooks?",
      intro:
        "Hooks are React functions that let functional components use React features such as state, effects and refs.",
      explanation:
        "Modern React applications commonly use function components together with Hooks. Hooks allow a component to remember state, synchronize with external systems and interact with browser or other non-React APIs.",
      methods: [
        {
          name: "useState",
          purpose: "Store state that affects rendering.",
          example: "const [count, setCount] = useState(0);"
        },
        {
          name: "useEffect",
          purpose: "Synchronize a component with an external system.",
          example: "useEffect(() => { connect(); }, [roomId]);"
        },
        {
          name: "useRef",
          purpose: "Hold a mutable value or DOM reference without causing a re-render.",
          example: "const inputRef = useRef(null);"
        }
      ],
      keyIdea:
        "Hooks connect functional components to React's state and synchronization capabilities."
    },

    {
      number: 2,
      title: "Rules of Hooks",
      intro:
        "Hooks follow specific rules so React can consistently associate Hook calls with their component state.",
      explanation:
        "Hooks should be called at the top level of React function components or custom Hooks. They should not be called conditionally, inside loops or inside ordinary nested functions.",
      example: {
        label: "Correct Hook placement",
        code:
`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`
      },
      comparison: {
        headers: ["Pattern", "Valid?", "Reason"],
        rows: [
          [
            "Hook at component top level",
            "Yes",
            "Stable Hook call order"
          ],
          [
            "Hook inside if",
            "No",
            "Hook order can change"
          ],
          [
            "Hook inside loop",
            "No",
            "Number/order of calls can change"
          ],
          [
            "Hook inside custom Hook",
            "Yes",
            "Custom Hooks can use other Hooks"
          ]
        ]
      },
      warning:
        "Do not call Hooks conditionally or inside loops. Keep Hook calls at the top level of the component or custom Hook."
    },

    {
      number: 3,
      title: "useState Revisited",
      intro:
        "useState creates state that survives between renders and changes the UI when updated.",
      example: {
        label: "Basic state",
        code:
`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(previous => previous + 1);
  }

  return (
    <button onClick={increase}>
      Count: {count}
    </button>
  );
}`
      },
      breakdown: [
        {
          label: "State value",
          description:
            "count contains the current value for this render."
        },
        {
          label: "Setter",
          description:
            "setCount requests the next state value."
        },
        {
          label: "Re-render",
          description:
            "React renders again using the updated state."
        }
      ],
      keyIdea:
        "Calling a state setter schedules the next state; it does not rewrite the value inside the already-running render."
    },

    {
      number: 4,
      title: "State Updates and Previous Values",
      intro:
        "When a new state value depends on the previous value, use the functional updater form.",
      example: {
        label: "Previous-state update",
        code:
`const [count, setCount] = useState(0);

function increase() {
  setCount(previous => previous + 1);
}`
      },
      explanation:
        "The updater function receives the state value from the appropriate update sequence. This is especially useful when multiple updates depend on the previous state.",
      exampleRequest:
`function addTwo() {
  setCount(previous => previous + 1);
  setCount(previous => previous + 1);
}`,
      keyIdea:
        "If next state depends on previous state, prefer the updater function."
    },

    {
      number: 5,
      title: "State Objects and Arrays",
      intro:
        "Forms and application data often require state objects or arrays.",
      example: {
        label: "Object state",
        code:
`const [form, setForm] = useState({
  name: "",
  email: ""
});

function updateName(value) {
  setForm(previous => ({
    ...previous,
    name: value
  }));
}`
      },
      exampleRequest:
`const [skills, setSkills] = useState([]);

function addSkill(skill) {
  setSkills(previous => [
    ...previous,
    skill
  ]);
}`,
      points: [
        "Create new objects instead of mutating existing state.",
        "Create new arrays when adding, removing or updating items.",
        "Keep state updates predictable.",
        "Use functional updates when the next state depends on the previous state."
      ]
    },

    {
      number: 6,
      title: "Controlled Forms",
      intro:
        "A controlled form stores its important input values in React state.",
      explanation:
        "The input receives its current value from state, and its onChange handler updates that state. This creates a clear data flow between the user, React state and the rendered form.",
      example: {
        label: "Controlled input",
        code:
`function LoginForm() {
  const [email, setEmail] = useState("");

  return (
    <input
      value={email}
      onChange={event =>
        setEmail(event.target.value)
      }
    />
  );
}`
      },
      keyIdea:
        "In a controlled input, React state is the source of truth for the input value."
    },

    {
      number: 7,
      title: "Managing Multiple Form Fields",
      intro:
        "A form can keep related fields inside one state object.",
      example: {
        label: "Multiple fields",
        code:
`function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <select
        name="branch"
        value={form.branch}
        onChange={handleChange}
      >
        <option value="">Select branch</option>
        <option value="CSE">CSE</option>
        <option value="AI-ML">AI-ML</option>
      </select>
    </form>
  );
}`
      },
      breakdown: [
        {
          label: "name",
          description:
            "Identifies which property should be updated."
        },
        {
          label: "value",
          description:
            "Contains the current input value."
        },
        {
          label: "computed property",
          description:
            "The [name] syntax updates the matching field dynamically."
        }
      ]
    },

    {
      number: 8,
      title: "Checkboxes, Selects and Textareas",
      intro:
        "Different form controls expose their current values in slightly different ways.",
      comparison: {
        headers: ["Control", "State value", "Typical event value"],
        rows: [
          [
            "input text",
            "string",
            "event.target.value"
          ],
          [
            "textarea",
            "string",
            "event.target.value"
          ],
          [
            "select",
            "string",
            "event.target.value"
          ],
          [
            "checkbox",
            "boolean",
            "event.target.checked"
          ]
        ]
      },
      example: {
        label: "Checkbox",
        code:
`const [agreed, setAgreed] = useState(false);

<input
  type="checkbox"
  checked={agreed}
  onChange={event =>
    setAgreed(event.target.checked)
  }
/>`
      },
      keyIdea:
        "Text-like controls usually use value; checkboxes commonly use checked."
    },

    {
      number: 9,
      title: "Form Validation",
      intro:
        "Client-side validation provides immediate feedback before an application sends data.",
      example: {
        label: "Simple validation",
        code:
`function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  }

  if (!form.email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  return errors;
}`
      },
      points: [
        "Validate required fields.",
        "Give users clear messages.",
        "Keep validation rules understandable.",
        "Do not treat client-side validation as a security boundary.",
        "The server must validate submitted data independently."
      ],
      warning:
        "Client-side validation improves user experience but cannot replace server-side validation."
    },

    {
      number: 10,
      title: "Form Submission",
      intro:
        "React forms commonly handle submission through the form's onSubmit event.",
      example: {
        label: "Preventing browser submission",
        code:
`function handleSubmit(event) {
  event.preventDefault();

  console.log("Submit form");
}

return (
  <form onSubmit={handleSubmit}>
    <button type="submit">
      Save
    </button>
  </form>
);`
      },
      points: [
        "Use onSubmit on the form.",
        "Use event.preventDefault() when handling submission in the application.",
        "Validate before sending data.",
        "Show loading state while asynchronous submission is running."
      ]
    },

    {
      number: 11,
      title: "Form Submission State",
      intro:
        "A professional form usually needs more than the input values themselves.",
      architecture: [
        {
          title: "Form data",
          items: [
            "Stores the user's current input."
          ]
        },
        {
          title: "Errors",
          items: [
            "Stores validation or server messages."
          ]
        },
        {
          title: "Submitting",
          items: [
            "Prevents duplicate submissions.",
            "Communicates progress to the user."
          ]
        },
        {
          title: "Success",
          items: [
            "Confirms that the operation completed."
          ]
        }
      ],
      example: {
        label: "Submission state",
        code:
`const [submitting, setSubmitting] =
  useState(false);

async function handleSubmit(event) {
  event.preventDefault();

  setSubmitting(true);

  try {
    await saveStudent(form);
  } finally {
    setSubmitting(false);
  }
}`
      }
    },

    {
      number: 12,
      title: "What Is an Effect?",
      intro:
        "An Effect is used when a component needs to synchronize with something outside React's rendering process.",
      explanation:
        "Examples include connecting to a chat service, subscribing to browser events, controlling a third-party widget, starting a timer or synchronizing with an external system.",
      example: {
        label: "Basic Effect",
        code:
`import { useEffect } from "react";

function Page() {
  useEffect(() => {
    console.log("Effect ran");
  });

  return <h1>Dashboard</h1>;
}`
      },
      keyIdea:
        "Effects are for synchronization with external systems, not for ordinary calculations that can be done during rendering."
    },

    {
      number: 13,
      title: "Events vs Effects",
      intro:
        "One of the most important React distinctions is knowing whether code belongs in an event handler or an Effect.",
      comparison: {
        headers: ["Situation", "Prefer", "Reason"],
        rows: [
          [
            "User clicks Save",
            "Event handler",
            "The action is directly caused by the interaction"
          ],
          [
            "Connect when roomId changes",
            "Effect",
            "Synchronization depends on external state"
          ],
          [
            "Calculate filtered list",
            "Render calculation",
            "No external system is involved"
          ],
          [
            "Start browser subscription",
            "Effect",
            "Subscription is external to React"
          ],
          [
            "Submit form after button click",
            "Event handler",
            "Submission is caused by user interaction"
          ]
        ]
      },
      keyIdea:
        "Effects are not a replacement for event handlers or ordinary data calculations."
    },

    {
      number: 14,
      title: "Basic useEffect Syntax",
      intro:
        "useEffect accepts a setup function and optionally a dependency array.",
      example: {
        label: "Effect with dependency",
        code:
`useEffect(() => {
  console.log("Room changed");
}, [roomId]);`
      },
      breakdown: [
        {
          label: "Setup",
          description:
            "The function contains the synchronization logic."
        },
        {
          label: "Dependencies",
          description:
            "The array tells React which reactive values this Effect depends on."
        },
        {
          label: "Re-synchronization",
          description:
            "When dependencies change, React cleans up the previous Effect and runs the new setup."
        }
      ]
    },

    {
      number: 15,
      title: "Dependency Arrays",
      intro:
        "Dependencies determine when an Effect needs to synchronize again.",
      comparison: {
        headers: ["Code", "Meaning"],
        rows: [
          [
            "useEffect(setup)",
            "Runs after every commit"
          ],
          [
            "useEffect(setup, [])",
            "No reactive dependencies; does not re-run because of prop/state changes"
          ],
          [
            "useEffect(setup, [roomId])",
            "Runs again when roomId changes"
          ]
        ]
      },
      example: {
        label: "Dependency example",
        code:
`useEffect(() => {
  connectToRoom(roomId);

  return () => {
    disconnectFromRoom(roomId);
  };
}, [roomId]);`
      },
      warning:
        "Do not remove a reactive dependency simply to force an Effect to run less often. First understand what the Effect actually synchronizes."
    },

    {
      number: 16,
      title: "Effect Setup and Cleanup",
      intro:
        "Some Effects need to undo what they started.",
      explanation:
        "If an Effect subscribes, connects, starts a timer or registers a browser event listener, cleanup should normally unsubscribe, disconnect, clear or remove the corresponding resource.",
      example: {
        label: "Timer cleanup",
        code:
`useEffect(() => {
  const timerId = setInterval(() => {
    console.log("Tick");
  }, 1000);

  return () => {
    clearInterval(timerId);
  };
}, []);`
      },
      comparison: {
        headers: ["Setup", "Cleanup"],
        rows: [
          [
            "setInterval()",
            "clearInterval()"
          ],
          [
            "addEventListener()",
            "removeEventListener()"
          ],
          [
            "connect()",
            "disconnect()"
          ],
          [
            "subscribe()",
            "unsubscribe()"
          ]
        ]
      },
      keyIdea:
        "Cleanup should mirror the resource or subscription created by setup."
    },

    {
      number: 17,
      title: "Effect Lifecycle",
      intro:
        "Think about each Effect as an independent synchronization process.",
      visualizer: {
        title: "Effect Lifecycle Visualizer",
        description:
          "Follow an Effect from setup through dependency changes and final cleanup.",
        steps: [
          {
            title: "Step 1 — Component commits",
            operation: "React finishes a render commit.",
            detail:
              "The component is now synchronized with the latest rendered UI."
          },
          {
            title: "Step 2 — Effect setup",
            operation: "The Effect starts its external synchronization.",
            detail:
              "For example, a connection or browser event listener is registered."
          },
          {
            title: "Step 3 — Dependency changes",
            operation: "A dependency receives a new value.",
            detail:
              "React needs to synchronize the external system with the new value."
          },
          {
            title: "Step 4 — Cleanup old setup",
            operation: "The previous cleanup runs.",
            detail:
              "The old connection or subscription is removed."
          },
          {
            title: "Step 5 — New setup",
            operation: "The Effect runs with the new dependency value.",
            detail:
              "The external system is synchronized again."
          },
          {
            title: "Step 6 — Unmount",
            operation: "The component is removed.",
            detail:
              "React runs the final cleanup for the Effect."
          }
        ]
      },
      keyIdea:
        "Think in setup → cleanup → setup cycles rather than assuming an Effect is simply a 'componentDidMount replacement'."
    },

    {
      number: 18,
      title: "Browser Event Subscriptions",
      intro:
        "Effects are useful when a component needs to subscribe to a browser event outside the JSX event system.",
      example: {
        label: "Window resize listener",
        code:
`useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth);
  }

  window.addEventListener(
    "resize",
    handleResize
  );

  return () => {
    window.removeEventListener(
      "resize",
      handleResize
    );
  };
}, []);`
      },
      warning:
        "If the listener is registered but never removed, repeated mounts can leave unwanted subscriptions behind."
    },

    {
      number: 19,
      title: "Timers in Effects",
      intro:
        "Timers are external browser resources and often require cleanup.",
      example: {
        label: "Interval",
        code:
`useEffect(() => {
  const id = setInterval(() => {
    setSeconds(previous => previous + 1);
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);`
      },
      points: [
        "Use the functional state updater when the interval increments previous state.",
        "Clear the interval during cleanup.",
        "Do not recreate the interval unnecessarily on every state update."
      ],
      keyIdea:
        "A functional state updater can let an Effect avoid depending on the changing counter value."
    },

    {
      number: 20,
      title: "Fetching Data with Effects",
      intro:
        "A component can use an Effect to fetch data when it needs to synchronize with an external API.",
      example: {
        label: "Basic data fetching",
        code:
`useEffect(() => {
  let ignore = false;

  async function loadStudents() {
    const response =
      await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    if (!ignore) {
      setStudents(data);
    }
  }

  loadStudents();

  return () => {
    ignore = true;
  };
}, []);`
      },
      explanation:
        "The cleanup flag prevents a result from an obsolete request from updating the component after the Effect has been replaced or cleaned up.",
      warning:
        "In larger applications, framework or dedicated data-fetching solutions may provide better caching, server rendering and request coordination than manually fetching in Effects."
    },

    {
      number: 21,
      title: "Effect Dependencies with API Requests",
      intro:
        "When an API request depends on a prop or state value, that reactive value normally belongs in the dependency list.",
      example: {
        label: "Fetch when selected user changes",
        code:
`function Profile({ userId }) {
  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setProfile(null);

      const response =
        await fetch("/api/users/" + userId);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const data = await response.json();

      if (!ignore) {
        setProfile(data);
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return <div>{profile?.name}</div>;
}`
      },
      keyIdea:
        "The Effect depends on userId because the external request must stay synchronized with the current userId."
    },

    {
      number: 22,
      title: "Race Conditions in Effects",
      intro:
        "Multiple requests can finish in a different order from the order in which they started.",
      explanation:
        "Suppose a user selects Student A and then immediately selects Student B. If B's request finishes first but A's request finishes later, an old A response could incorrectly overwrite the current B state.",
      architecture: [
        {
          title: "Request A",
          items: [
            "Starts first.",
            "Takes longer."
          ]
        },
        {
          title: "Request B",
          items: [
            "Starts later.",
            "Finishes first."
          ]
        },
        {
          title: "Potential bug",
          items: [
            "Late A response overwrites current B data."
          ]
        },
        {
          title: "Protection",
          items: [
            "Ignore obsolete results or cancel requests when appropriate."
          ]
        }
      ],
      keyIdea:
        "Async correctness includes making sure old results cannot incorrectly replace newer application state."
    },

    {
      number: 23,
      title: "Avoiding Effect Infinite Loops",
      intro:
        "An Effect can accidentally create a loop when it updates state that causes one of its dependencies to change again.",
      example: {
        label: "Problem pattern",
        code:
`useEffect(() => {
  setValue(value + 1);
}, [value]);`
      },
      explanation:
        "The Effect runs because value changes, then updates value again, causing another render and another Effect execution.",
      comparison: {
        headers: ["Question", "Check"],
        rows: [
          [
            "Does the Effect update state?",
            "Identify the state being changed."
          ],
          [
            "Does that state affect a dependency?",
            "If yes, inspect for a cycle."
          ],
          [
            "Is an external system involved?",
            "If not, the Effect may be unnecessary."
          ]
        ]
      },
      keyIdea:
        "Before adding an Effect, ask whether synchronization with an external system is actually required."
    },

    {
      number: 24,
      title: "When You Don't Need an Effect",
      intro:
        "Many beginners use Effects for calculations that should simply happen during rendering or in event handlers.",
      comparison: {
        headers: ["Task", "Better location"],
        rows: [
          [
            "Calculate filtered array",
            "Render calculation"
          ],
          [
            "Calculate full name",
            "Render calculation"
          ],
          [
            "Handle button click",
            "Event handler"
          ],
          [
            "Submit a form",
            "Form event handler"
          ],
          [
            "Connect to external service",
            "Effect"
          ],
          [
            "Subscribe to browser event",
            "Effect"
          ],
          [
            "Start timer that must live with component",
            "Effect"
          ]
        ]
      },
      warning:
        "If you are not synchronizing with an external system, first ask whether you can solve the problem without an Effect."
    },

    {
      number: 25,
      title: "useRef()",
      intro:
        "useRef lets a component hold a mutable value that does not trigger a re-render when changed.",
      example: {
        label: "DOM reference",
        code:
`import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>
        Focus
      </button>
    </>
  );
}`
      },
      points: [
        "The ref object remains stable across renders.",
        "A DOM ref can provide access to an element after it is mounted.",
        "Changing ref.current does not cause a re-render.",
        "Refs are useful when information is not part of rendered UI state."
      ],
      keyIdea:
        "Use state for information that affects rendering; use refs for values that need to persist without triggering rendering."
    },

    {
      number: 26,
      title: "State vs Ref",
      intro:
        "State and refs both persist values, but they have different rendering behaviour.",
      comparison: {
        headers: ["Feature", "State", "Ref"],
        rows: [
          [
            "Persists between renders",
            "Yes",
            "Yes"
          ],
          [
            "Changing it triggers render",
            "Yes",
            "No"
          ],
          [
            "Primary purpose",
            "UI state",
            "Persistent non-rendering value or DOM reference"
          ],
          [
            "Typical example",
            "Selected tab",
            "Timer ID"
          ]
        ]
      },
      example: {
        label: "Timer ID in a ref",
        code:
`const timerRef = useRef(null);

function startTimer() {
  timerRef.current =
    setTimeout(() => {
      console.log("Done");
    }, 1000);
}`
      }
    },

    {
      number: 27,
      title: "Cleanup and Strict Mode",
      intro:
        "Development behaviour can expose missing cleanup logic.",
      explanation:
        "With Strict Mode enabled, React may run an additional development-only setup and cleanup cycle for an Effect before the real setup. This helps reveal effects whose cleanup does not correctly mirror their setup.",
      example: {
        label: "Symmetrical setup and cleanup",
        code:
`useEffect(() => {
  const connection =
    createConnection(roomId);

  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);`
      },
      keyIdea:
        "Write Effects so that setup → cleanup → setup behaves correctly."
    },

    {
      number: 28,
      title: "Form + Effect Architecture",
      intro:
        "A real React form can combine controlled state, validation, submission and external synchronization.",
      architecture: [
        {
          title: "Input state",
          items: [
            "Controlled values live in state."
          ]
        },
        {
          title: "Validation",
          items: [
            "Derived validation errors are calculated when appropriate."
          ]
        },
        {
          title: "Submit event",
          items: [
            "The form handler validates and starts submission."
          ]
        },
        {
          title: "External operation",
          items: [
            "API submission is performed asynchronously."
          ]
        },
        {
          title: "Effect",
          items: [
            "Used only when the component needs synchronization independent of a direct user event."
          ]
        }
      ]
    },

    {
      number: 29,
      title: "Complete Student Form",
      intro:
        "This example combines controlled inputs, validation, loading state and asynchronous submission.",
      example: {
        label: "Student registration form",
        code:
`import { useState } from "react";

function StudentForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: ""
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.includes("@")) {
      nextErrors.email = "Valid email required";
    }

    if (!form.branch) {
      nextErrors.branch = "Select a branch";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    setMessage("");

    try {
      await saveStudent(form);
      setMessage("Student saved successfully");
    } catch (error) {
      setMessage("Could not save student");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <select
        name="branch"
        value={form.branch}
        onChange={handleChange}
      >
        <option value="">
          Select branch
        </option>
        <option value="CSE">CSE</option>
        <option value="AI-ML">AI-ML</option>
      </select>

      <button
        type="submit"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Student"}
      </button>

      <p>{message}</p>
    </form>
  );
}`
      },
      breakdown: [
        {
          label: "Controlled fields",
          description:
            "The form object stores current input values."
        },
        {
          label: "Validation",
          description:
            "The validate function checks the current data."
        },
        {
          label: "Submission",
          description:
            "The submit handler performs the asynchronous operation."
        },
        {
          label: "Loading",
          description:
            "saving prevents confusing duplicate submissions."
        },
        {
          label: "Result",
          description:
            "Success or failure is communicated to the user."
        }
      ]
    },

    {
      number: 30,
      title: "Professional Hooks and Effects Mental Model",
      intro:
        "The goal is not to use more Hooks. The goal is to use each Hook for the problem it actually solves.",
      comparison: {
        headers: ["Requirement", "Tool"],
        rows: [
          [
            "Store UI-changing information",
            "useState"
          ],
          [
            "Respond to direct user action",
            "Event handler"
          ],
          [
            "Synchronize with external system",
            "useEffect"
          ],
          [
            "Clean up external resource",
            "Effect cleanup"
          ],
          [
            "Hold DOM node",
            "useRef"
          ],
          [
            "Hold value without rendering",
            "useRef"
          ],
          [
            "Calculate derived value",
            "Normal JavaScript during render"
          ]
        ]
      },
      keyIdea:
        "Good React code does not put everything into state or Effects. Each concern should have the simplest appropriate home."
    }
  ],

  visualizer: {
    title: "Hooks, Form & Effect Visualizer",
    description:
      "Follow a controlled form from user input through state, validation, submission and Effect synchronization.",
    steps: [
      {
        title: "Step 1 — Initial render",
        operation:
          "React initializes form state and renders the empty form.",
        detail:
          "The controlled inputs receive their values from React state."
      },
      {
        title: "Step 2 — User types",
        operation:
          "onChange receives the browser event.",
        detail:
          "The handler reads event.target.value."
      },
      {
        title: "Step 3 — State update",
        operation:
          "setForm() creates the next form object.",
        detail:
          "The updated state becomes available on the next render."
      },
      {
        title: "Step 4 — Re-render",
        operation:
          "Inputs receive the updated values.",
        detail:
          "React renders the form using the latest state."
      },
      {
        title: "Step 5 — Submit",
        operation:
          "onSubmit validates the form.",
        detail:
          "Invalid data is shown immediately without starting the API operation."
      },
      {
        title: "Step 6 — Async submission",
        operation:
          "The application sets saving=true and sends the request.",
        detail:
          "The UI communicates that work is in progress."
      },
      {
        title: "Step 7 — Result",
        operation:
          "Success or error state is updated.",
        detail:
          "The user receives feedback from the completed operation."
      },
      {
        title: "Step 8 — Effect synchronization",
        operation:
          "If an external dependency changes, its Effect cleans up and synchronizes again.",
        detail:
          "Effects should mirror setup with appropriate cleanup."
      }
    ]
  },

  trace: {
    title: "useEffect Dependency & Cleanup Tracer",
    lines: [
      {
        line: 1,
        code: "const [roomId, setRoomId] = useState('general');"
      },
      {
        line: 2,
        code: "useEffect(() => {"
      },
      {
        line: 3,
        code: "  const connection = createConnection(roomId);"
      },
      {
        line: 4,
        code: "  connection.connect();"
      },
      {
        line: 5,
        code: "  return () => connection.disconnect();"
      },
      {
        line: 6,
        code: "}, [roomId]);"
      },
      {
        line: 7,
        code: "setRoomId('placement');"
      }
    ],
    steps: [
      {
        line: 1,
        title: "Initial state",
        detail:
          "roomId starts as general."
      },
      {
        line: 2,
        title: "Effect setup",
        detail:
          "React runs the Effect after the component commit."
      },
      {
        line: 3,
        title: "Create connection",
        detail:
          "The connection is configured for the general room."
      },
      {
        line: 4,
        title: "Connect",
        detail:
          "The external system is connected."
      },
      {
        line: 7,
        title: "User changes room",
        detail:
          "The state changes roomId to placement."
      },
      {
        line: 5,
        title: "Cleanup old connection",
        detail:
          "React disconnects the previous general-room connection."
      },
      {
        line: 2,
        title: "Run new setup",
        detail:
          "The Effect synchronizes with the placement room."
      }
    ]
  },

  revision: [
    [
      "Hook",
      "A React function that provides capabilities such as state, effects or refs to functional components."
    ],
    [
      "useState",
      "Hook used to store state that affects rendering."
    ],
    [
      "useEffect",
      "Hook used to synchronize a component with an external system."
    ],
    [
      "useRef",
      "Hook used to hold a persistent mutable value or DOM reference without triggering rendering."
    ],
    [
      "Controlled input",
      "An input whose value is controlled by React state."
    ],
    [
      "Dependency array",
      "The list of reactive values that an Effect uses to determine when synchronization should be repeated."
    ],
    [
      "Effect setup",
      "The synchronization logic executed by an Effect."
    ],
    [
      "Effect cleanup",
      "The function returned from an Effect to stop or undo its external synchronization."
    ],
    [
      "Race condition",
      "A timing problem where asynchronous results complete in an unexpected order."
    ],
    [
      "Derived data",
      "A value calculated from existing state or props rather than stored separately."
    ],
    [
      "Functional updater",
      "A state setter form that receives the previous state and returns the next state."
    ],
    [
      "Form validation",
      "Checking submitted data against expected rules before processing it."
    ]
  ],

  interview: [
    {
      question: "What are React Hooks?",
      answer:
        "Hooks are React functions that let functional components use features such as state, effects and refs."
    },
    {
      question: "What are the Rules of Hooks?",
      answer:
        "Hooks should be called at the top level of React components or custom Hooks, not inside loops, conditions or nested ordinary functions."
    },
    {
      question: "What is useState?",
      answer:
        "useState is a Hook that adds state to a functional component."
    },
    {
      question: "What is useEffect?",
      answer:
        "useEffect lets a component synchronize with an external system."
    },
    {
      question: "When should you use useEffect?",
      answer:
        "When a component needs synchronization with something outside React, such as a subscription, timer, browser API or external connection."
    },
    {
      question: "When should you not use useEffect?",
      answer:
        "Do not use it merely for ordinary calculations, derived data or logic that belongs directly in an event handler."
    },
    {
      question: "What is a controlled component?",
      answer:
        "A form control whose current value is driven by React state."
    },
    {
      question: "How do you handle a controlled text input?",
      answer:
        "Store its value in state, pass that state as value and update it in onChange."
    },
    {
      question: "How do you handle a checkbox?",
      answer:
        "Usually store a boolean and use event.target.checked in the change handler."
    },
    {
      question: "Why use event.preventDefault() in form submission?",
      answer:
        "It prevents the browser's default navigation/submission behaviour when the application is handling the submission itself."
    },
    {
      question: "What is a dependency array?",
      answer:
        "It lists the reactive values used by an Effect that determine when the Effect needs to synchronize again."
    },
    {
      question: "What happens when an Effect dependency changes?",
      answer:
        "React runs the previous cleanup, then runs the Effect setup with the new values."
    },
    {
      question: "What is Effect cleanup?",
      answer:
        "The function returned from an Effect that stops or reverses the external synchronization started by the Effect."
    },
    {
      question: "Why should event listeners be removed?",
      answer:
        "To prevent stale subscriptions, duplicated handlers and unnecessary work after the component no longer needs the listener."
    },
    {
      question: "Why should intervals be cleared?",
      answer:
        "Otherwise the timer can continue running after the component no longer needs it."
    },
    {
      question: "Can useEffect be async directly?",
      answer:
        "The Effect callback itself should not be made an async function that returns a Promise as cleanup. Define an inner async function and call it, while returning a cleanup function when needed."
    },
    {
      question: "What is a race condition in data fetching?",
      answer:
        "It occurs when multiple requests overlap and an older response finishes later and incorrectly overwrites newer data."
    },
    {
      question: "How can obsolete fetch results be ignored?",
      answer:
        "Use cleanup logic such as an ignore flag, or use request cancellation such as AbortController when appropriate."
    },
    {
      question: "What is useRef?",
      answer:
        "A Hook that stores a persistent mutable value without causing a re-render when the value changes."
    },
    {
      question: "Does changing ref.current trigger rendering?",
      answer:
        "No."
    },
    {
      question: "When is useRef useful?",
      answer:
        "For DOM references, timer IDs and other values that must persist without affecting rendered output."
    },
    {
      question: "What is the difference between state and ref?",
      answer:
        "State updates cause rendering; changing a ref does not."
    },
    {
      question: "Why can an Effect cause an infinite loop?",
      answer:
        "If the Effect updates state and that update changes one of the Effect's dependencies, the Effect can repeatedly trigger itself."
    },
    {
      question: "Why is cleanup important?",
      answer:
        "It prevents resources and subscriptions created by an Effect from continuing after they are no longer needed."
    },
    {
      question: "Why does React development Strict Mode sometimes run setup and cleanup more than once?",
      answer:
        "The extra development-only cycle helps reveal Effects whose cleanup does not correctly mirror their setup."
    },
    {
      question: "What is a controlled form?",
      answer:
        "A form where important input values are stored in React state and the inputs receive those values from state."
    },
    {
      question: "Should client-side validation replace server-side validation?",
      answer:
        "No. Client-side validation improves user experience, but the server must validate its own incoming data."
    },
    {
      question: "Why should derived data usually not be stored separately?",
      answer:
        "Duplicating derived data can create synchronization problems and unnecessary state."
    }
  ],

  practice: [
    {
      task:
        "Build a Counter component using useState with Increase, Decrease and Reset buttons.",
      hints: [
        "Create count state.",
        "Use functional updates.",
        "Reset should set the value to zero."
      ]
    },
    {
      task:
        "Create a controlled Student Registration form with name, email and branch fields.",
      hints: [
        "Use one form object.",
        "Use name and value from event.target.",
        "Update the matching property with computed property syntax."
      ]
    },
    {
      task:
        "Add validation to the registration form.",
      hints: [
        "Require name.",
        "Check email format.",
        "Require a branch."
      ]
    },
    {
      task:
        "Add submitting and success/error states to the form.",
      hints: [
        "Use a submitting boolean.",
        "Use try/catch/finally.",
        "Disable the submit button while saving."
      ]
    },
    {
      task:
        "Create a component that updates the document title when a count changes.",
      hints: [
        "Use useEffect.",
        "Make count a dependency.",
        "Assign document.title inside the Effect."
      ]
    },
    {
      task:
        "Create a timer using setInterval inside useEffect.",
      hints: [
        "Create the interval inside the Effect.",
        "Use a functional state updater.",
        "Clear the interval in cleanup."
      ]
    },
    {
      task:
        "Create a window resize listener that displays the current browser width.",
      hints: [
        "Use addEventListener.",
        "Update state in the handler.",
        "Remove the listener in cleanup."
      ]
    },
    {
      task:
        "Create a search component that fetches results when the search term changes.",
      hints: [
        "Put the search term in the dependency array.",
        "Use an inner async function.",
        "Protect against obsolete results."
      ]
    },
    {
      task:
        "Create a component that can focus an input using useRef.",
      hints: [
        "Create inputRef.",
        "Attach it to the input.",
        "Call inputRef.current.focus()."
      ]
    },
    {
      task:
        "Create a component that stores a timer ID in a ref.",
      hints: [
        "Store the returned timer ID in ref.current.",
        "Clear the timer when necessary."
      ]
    },
    {
      task:
        "Identify three pieces of code in an existing React component that do not need useEffect and move them to the correct location.",
      hints: [
        "Look for ordinary calculations.",
        "Look for direct user interactions.",
        "Look for state derived from other state."
      ]
    },
    {
      task:
        "Build a complete Student Dashboard with a controlled search form, loading state, API-style data loading, error handling and cleanup.",
      hints: [
        "Keep search text in state.",
        "Use an Effect for external data synchronization.",
        "Prevent obsolete results from replacing current results."
      ]
    }
  ],

  quiz: [
    {
      question: "Which Hook stores state that affects rendering?",
      options: [
        "useEffect",
        "useState",
        "useRef",
        "useDOM"
      ],
      answer: 1
    },
    {
      question: "Which Hook is primarily used for synchronization with external systems?",
      options: [
        "useState",
        "useEffect",
        "useArray",
        "useRender"
      ],
      answer: 1
    },
    {
      question: "Where should Hooks normally be called?",
      options: [
        "Inside loops",
        "Inside conditions",
        "At the top level of components or custom Hooks",
        "Inside CSS"
      ],
      answer: 2
    },
    {
      question: "What is the source of truth for a controlled input?",
      options: [
        "CSS",
        "React state",
        "The browser cache",
        "The URL"
      ],
      answer: 1
    },
    {
      question: "Which property is normally used for a checkbox value?",
      options: [
        "event.target.text",
        "event.target.checked",
        "event.target.selected",
        "event.target.boolean"
      ],
      answer: 1
    },
    {
      question: "What does event.preventDefault() do?",
      options: [
        "Stops React",
        "Prevents the default browser action",
        "Deletes state",
        "Creates an Effect"
      ],
      answer: 1
    },
    {
      question: "What happens when an Effect dependency changes?",
      options: [
        "Nothing",
        "The previous cleanup runs and the Effect synchronizes again",
        "The component is deleted",
        "The browser restarts"
      ],
      answer: 1
    },
    {
      question: "What is cleanup commonly used for?",
      options: [
        "Creating JSX",
        "Removing subscriptions and clearing resources",
        "Changing props",
        "Creating CSS"
      ],
      answer: 1
    },
    {
      question: "Which is an appropriate Effect use case?",
      options: [
        "Calculating 2 + 2",
        "Filtering an array during render",
        "Subscribing to a browser event",
        "Building a string"
      ],
      answer: 2
    },
    {
      question: "Which is normally better handled by an event handler?",
      options: [
        "Connecting to a chat service",
        "Handling a button click",
        "Subscribing to resize",
        "Starting a component timer"
      ],
      answer: 1
    },
    {
      question: "What does useRef return?",
      options: [
        "A ref object",
        "Only a string",
        "Only a Promise",
        "A CSS class"
      ],
      answer: 0
    },
    {
      question: "Does changing ref.current trigger a re-render?",
      options: [
        "Yes",
        "No",
        "Only on mobile",
        "Only in Strict Mode"
      ],
      answer: 1
    },
    {
      question: "What can cause an Effect loop?",
      options: [
        "An Effect updating state that changes its dependencies",
        "Using JSX",
        "Using props",
        "Using a button"
      ],
      answer: 0
    },
    {
      question: "Why should an interval be cleared?",
      options: [
        "To change JSX",
        "To stop unnecessary timer work",
        "To change props",
        "To disable React"
      ],
      answer: 1
    },
    {
      question: "What should happen to an old API result if the user has already selected different data?",
      options: [
        "Always overwrite the UI",
        "Ignore or cancel the obsolete operation when appropriate",
        "Reload the browser",
        "Delete all state"
      ],
      answer: 1
    },
    {
      question: "Should client-side validation replace server validation?",
      options: [
        "Yes",
        "No",
        "Only for forms",
        "Only for React"
      ],
      answer: 1
    }
  ],

  glossary: [
    {
      term: "Hook",
      definition:
        "A React function that lets components use capabilities such as state, effects or refs."
    },
    {
      term: "useState",
      definition:
        "A Hook used to store state that influences rendering."
    },
    {
      term: "useEffect",
      definition:
        "A Hook used to synchronize a component with an external system."
    },
    {
      term: "useRef",
      definition:
        "A Hook used to hold a persistent mutable value or DOM reference without causing a re-render."
    },
    {
      term: "Controlled input",
      definition:
        "An input whose current value is driven by React state."
    },
    {
      term: "Dependency array",
      definition:
        "The list of reactive values that an Effect depends on."
    },
    {
      term: "Effect cleanup",
      definition:
        "The function returned by an Effect to stop or undo the external synchronization it started."
    },
    {
      term: "External system",
      definition:
        "Something outside React's rendering model, such as a browser API, network connection, timer or third-party library."
    },
    {
      term: "Race condition",
      definition:
        "A timing problem where operations complete in an order different from the order expected by the application."
    },
    {
      term: "Form validation",
      definition:
        "Checking user input against application rules before processing or submitting it."
    },
    {
      term: "Ref",
      definition:
        "A persistent object whose current value can change without triggering a component re-render."
    },
    {
      term: "Functional updater",
      definition:
        "A state update function that receives the previous state and returns the next state."
    }
  ],

  completion: {
    title: "CodeBhavya Student Registration Studio",
    message:
      "Build a production-style Student Registration interface using controlled inputs, validation, loading and submission states. Add a Student Dashboard that loads data from an API-style source and handles loading, success, failure and obsolete requests correctly.",
    challenge:
      "Use useState for UI state, useEffect only where synchronization with an external system is required, useRef for at least one non-rendering value or DOM interaction, and implement complete cleanup for every subscription or timer you create."
  },

  takeaway:
    "The goal of Hooks is not to add more complexity. useState manages changing UI data, event handlers respond to direct interactions, useEffect synchronizes with external systems, and useRef stores persistent values that do not need to trigger rendering. Strong React developers know not only how to use these Hooks, but also when not to use them."
};
