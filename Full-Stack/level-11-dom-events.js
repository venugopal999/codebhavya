"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 11 — DOM & EVENTS
  Rendering, event propagation and interface state
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[11] = {
  number: 11,
  title: "DOM & Events",
  kicker: "JavaScript Engineering · Level 11",
  subtitle:
    "Connect JavaScript with the browser, manipulate the DOM and build responsive interfaces with events.",
  estimatedTime: "3–4 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 11 · BROWSER INTERACTION",
    description:
      "The DOM is the bridge between JavaScript and the webpage. " +
      "In this level, you will learn how browsers represent HTML as a tree, " +
      "how JavaScript finds and changes elements, and how events travel through " +
      "nested elements to create interactive interfaces."
  },

  objectives: [
    "Understand the DOM and DOM tree.",
    "Understand elements, nodes and relationships.",
    "Select DOM elements safely.",
    "Use querySelector() and querySelectorAll().",
    "Read and update text content.",
    "Work with attributes and data attributes.",
    "Add and remove CSS classes.",
    "Create, insert and remove DOM elements.",
    "Register event listeners with addEventListener().",
    "Understand the event object.",
    "Distinguish target from currentTarget.",
    "Prevent default browser behaviour.",
    "Understand event bubbling and capturing.",
    "Control propagation when necessary.",
    "Use event delegation for dynamic collections.",
    "Handle keyboard and form events.",
    "Build interactive UI state with DOM events.",
    "Avoid common DOM performance and event-handling mistakes."
  ],

  sections: [

    {
      number: 1,
      title: "What Is the DOM?",
      intro:
        "The DOM is the browser's programming representation of an HTML document.",

      explanation:
        "When the browser loads HTML, it creates a structured document tree. " +
        "JavaScript can access that tree through browser APIs and can read, modify, " +
        "create or remove nodes.",

      code:
`<main>
  <h1>CodeBhavya</h1>
  <p>Learn Full Stack Development</p>
</main>`,

      architecture: [
        {
          title: "Document",
          items: [
            "The complete webpage document.",
            "Available through the document object."
          ]
        },
        {
          title: "Element",
          items: [
            "Represents an HTML element such as main, h1 or p.",
            "Elements can contain other elements."
          ]
        },
        {
          title: "Text",
          items: [
            "Text inside elements is represented in the DOM.",
            "JavaScript can read and update text."
          ]
        },
        {
          title: "Relationship",
          items: [
            "Elements can have parent, child and sibling relationships.",
            "These relationships form the DOM tree."
          ]
        }
      ],

      keyIdea:
        "The DOM turns a static HTML document into a structure that JavaScript can program."
    },

    {
      number: 2,
      title: "The DOM Tree",
      intro:
        "HTML becomes a hierarchical tree of nodes.",

      code:
`<body>
  <main>
    <h1>Welcome</h1>
    <p>Hello JavaScript</p>
  </main>
</body>`,

      flow: [
        "document",
        "body",
        "main",
        "h1 → Welcome",
        "p → Hello JavaScript"
      ],

      breakdown: [
        {
          label: "Parent",
          description:
            "An element that contains another element."
        },
        {
          label: "Child",
          description:
            "An element directly contained inside another element."
        },
        {
          label: "Sibling",
          description:
            "Elements that share the same parent."
        },
        {
          label: "Descendant",
          description:
            "Any element nested somewhere inside another element."
        }
      ],

      keyIdea:
        "Thinking in parent-child relationships makes DOM traversal much easier."
    },

    {
      number: 3,
      title: "Selecting Elements",
      intro:
        "Before JavaScript can modify a webpage, it normally needs a reference to the relevant DOM element.",

      code:
`const title =
  document.querySelector("h1");

const button =
  document.querySelector("#saveButton");

console.log(title);
console.log(button);`,

      methods: [
        {
          name: "querySelector()",
          purpose:
            "Returns the first element matching a CSS selector.",
          example:
            'document.querySelector(".card")'
        },
        {
          name: "querySelectorAll()",
          purpose:
            "Returns all elements matching a CSS selector.",
          example:
            'document.querySelectorAll(".card")'
        },
        {
          name: "getElementById()",
          purpose:
            "Finds an element using its id.",
          example:
            'document.getElementById("saveButton")'
        }
      ],

      comparison: {
        headers: [
          "Method",
          "Returns",
          "Typical use"
        ],
        rows: [
          [
            "querySelector()",
            "First matching element",
            "Select one element"
          ],
          [
            "querySelectorAll()",
            "All matching elements",
            "Select a collection"
          ],
          [
            "getElementById()",
            "Element with matching id",
            "Select by unique id"
          ]
        ]
      },

      keyIdea:
        "querySelector() uses CSS selector syntax, making it flexible and familiar."
    },

    {
      number: 4,
      title: "querySelector() and querySelectorAll()",
      intro:
        "CSS selectors can be reused when selecting DOM elements.",

      code:
`const card =
  document.querySelector(".card");

const buttons =
  document.querySelectorAll(".button");

console.log(card);
console.log(buttons.length);`,

      points: [
        "Use #id for an id.",
        "Use .class for a class.",
        "Use tag names such as button or p.",
        "Use attribute selectors when needed.",
        "querySelector() returns the first match.",
        "querySelectorAll() returns all matching elements."
      ],

      code:
`const input =
  document.querySelector('input[name="email"]');

const cards =
  document.querySelectorAll(".course-card");`,

      keyIdea:
        "Good selectors make DOM code readable and maintainable."
    },

    {
      number: 5,
      title: "Reading and Changing Text",
      intro:
        "JavaScript can update the visible text of an element.",

      code:
`const heading =
  document.querySelector("h1");

console.log(heading.textContent);

heading.textContent =
  "Learn JavaScript";`,

      comparison: {
        headers: [
          "Property",
          "Purpose",
          "Important point"
        ],
        rows: [
          [
            "textContent",
            "Reads or writes text",
            "Treats content as text"
          ],
          [
            "innerHTML",
            "Reads or writes HTML",
            "Parses inserted HTML"
          ],
          [
            "innerText",
            "Works with rendered text",
            "Affected by visual rendering"
          ]
        ]
      },

      warning:
        "Do not use innerHTML with untrusted user input because inserting untrusted HTML can create security problems.",

      keyIdea:
        "Use textContent when you simply need to display text."
    },

    {
      number: 6,
      title: "Attributes and Data Attributes",
      intro:
        "DOM elements contain attributes that provide additional information.",

      code:
`const image =
  document.querySelector("img");

console.log(image.getAttribute("src"));

image.setAttribute(
  "alt",
  "CodeBhavya logo"
);`,

      methods: [
        {
          name: "getAttribute()",
          purpose:
            "Reads the value of an attribute.",
          example:
            'button.getAttribute("data-id")'
        },
        {
          name: "setAttribute()",
          purpose:
            "Creates or updates an attribute.",
          example:
            'button.setAttribute("disabled", "")'
        },
        {
          name: "removeAttribute()",
          purpose:
            "Removes an attribute.",
          example:
            'input.removeAttribute("disabled")'
        }
      ],

      code:
`<button
  class="course"
  data-level="11">
  Open Level
</button>`,

      keyIdea:
        "data-* attributes are useful for attaching small pieces of application metadata to DOM elements."
    },

    {
      number: 7,
      title: "Classes and Styles",
      intro:
        "JavaScript can change the appearance of elements by modifying classes.",

      code:
`const card =
  document.querySelector(".card");

card.classList.add("active");

card.classList.remove("hidden");

card.classList.toggle("selected");`,

      methods: [
        {
          name: "classList.add()",
          purpose:
            "Adds one or more CSS classes.",
          example:
            'card.classList.add("active")'
        },
        {
          name: "classList.remove()",
          purpose:
            "Removes CSS classes.",
          example:
            'card.classList.remove("hidden")'
        },
        {
          name: "classList.toggle()",
          purpose:
            "Adds a class if missing or removes it if present.",
          example:
            'menu.classList.toggle("open")'
        },
        {
          name: "classList.contains()",
          purpose:
            "Checks whether an element contains a class.",
          example:
            'menu.classList.contains("open")'
        }
      ],

      keyIdea:
        "Changing classes is usually cleaner than repeatedly setting individual inline styles."
    },

    {
      number: 8,
      title: "Creating DOM Elements",
      intro:
        "JavaScript can create new elements and add them to the document.",

      code:
`const item =
  document.createElement("li");

item.textContent =
  "JavaScript";

const list =
  document.querySelector("ul");

list.append(item);`,

      flow: [
        "Create an element",
        "Configure its content",
        "Configure classes or attributes",
        "Insert it into the DOM",
        "Browser renders the updated interface"
      ],

      methods: [
        {
          name: "createElement()",
          purpose:
            "Creates a new DOM element.",
          example:
            'document.createElement("li")'
        },
        {
          name: "append()",
          purpose:
            "Adds nodes or text at the end of an element.",
          example:
            "list.append(item)"
        },
        {
          name: "prepend()",
          purpose:
            "Adds nodes or text at the beginning.",
          example:
            "list.prepend(item)"
        },
        {
          name: "remove()",
          purpose:
            "Removes an element from the DOM.",
          example:
            "item.remove()"
        }
      ],

      keyIdea:
        "Dynamic interfaces are often built by creating, configuring and inserting DOM elements."
    },

    {
      number: 9,
      title: "Event Listeners",
      intro:
        "Events allow JavaScript to react when something happens in the browser.",

      code:
`const button =
  document.querySelector("#save");

button.addEventListener(
  "click",
  () => {
    console.log("Saved");
  }
);`,

      explanation:
        "addEventListener() registers a function that runs when the specified event occurs. " +
        "It is the recommended general mechanism for registering DOM event handlers and supports multiple listeners and capture options. ",

      methods: [
        {
          name: "addEventListener()",
          purpose:
            "Registers a function for an event.",
          example:
            'button.addEventListener("click", save)'
        },
        {
          name: "removeEventListener()",
          purpose:
            "Removes a previously registered listener.",
          example:
            'button.removeEventListener("click", save)'
        }
      ],

      keyIdea:
        "An event listener connects a browser event to JavaScript behaviour."
    },

    {
      number: 10,
      title: "The Event Object",
      intro:
        "When an event occurs, the browser provides information about that event.",

      code:
`button.addEventListener(
  "click",
  event => {
    console.log(event.type);
    console.log(event.target);
  }
);`,

      comparison: {
        headers: [
          "Property",
          "Meaning"
        ],
        rows: [
          [
            "event.type",
            "Type of event such as click or keydown"
          ],
          [
            "event.target",
            "Element where the event originated"
          ],
          [
            "event.currentTarget",
            "Element whose listener is currently running"
          ],
          [
            "event.defaultPrevented",
            "Whether default behaviour has been prevented"
          ]
        ]
      },

      keyIdea:
        "The event object gives the handler context about what happened."
    },

    {
      number: 11,
      title: "target vs currentTarget",
      intro:
        "These two properties are easy to confuse but become important with nested elements and event delegation.",

      code:
`const card =
  document.querySelector(".card");

card.addEventListener(
  "click",
  event => {
    console.log(event.target);
    console.log(event.currentTarget);
  }
);`,

      explanation:
        "target is the element where the event originated. currentTarget is the element whose listener is currently executing.",

      comparison: {
        headers: [
          "Property",
          "Question answered",
          "Can change during bubbling?"
        ],
        rows: [
          [
            "target",
            "Where did the event start?",
            "No"
          ],
          [
            "currentTarget",
            "Which listener is running?",
            "Yes, as propagation reaches other listeners"
          ]
        ]
      },

      keyIdea:
        "When debugging delegated events, always ask whether you need target or currentTarget."
    },

    {
      number: 12,
      title: "Preventing Default Behaviour",
      intro:
        "Some browser events have built-in behaviour that JavaScript can prevent.",

      code:
`const form =
  document.querySelector("form");

form.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    console.log("Custom submit handling");
  }
);`,

      comparison: {
        headers: [
          "Method",
          "Purpose"
        ],
        rows: [
          [
            "preventDefault()",
            "Stops the browser's default action"
          ],
          [
            "stopPropagation()",
            "Stops the event from continuing through the propagation path"
          ]
        ]
      },

      warning:
        "preventDefault() does not stop event propagation. These are two different concepts.",

      keyIdea:
        "Use preventDefault() when your application intentionally replaces a browser default action."
    },

    {
      number: 13,
      title: "Event Bubbling",
      intro:
        "Most DOM events propagate from the target upward through ancestor elements.",

      code:
`const card =
  document.querySelector(".card");

const button =
  document.querySelector(".card button");

card.addEventListener(
  "click",
  () => console.log("card")
);

button.addEventListener(
  "click",
  () => console.log("button")
);`,

      output:
`button
card`,

      flow: [
        "User clicks the button",
        "Button listener runs",
        "Event continues upward",
        "Card listener runs",
        "Further ancestors can receive the event"
      ],

      keyIdea:
        "Bubbling allows parent elements to observe events originating from their descendants."
    },

    {
      number: 14,
      title: "Event Capturing",
      intro:
        "Capturing is the phase where the event travels from ancestors toward the target.",

      code:
`document.addEventListener(
  "click",
  () => console.log("document"),
  { capture: true }
);

button.addEventListener(
  "click",
  () => console.log("button")
);`,

      flow: [
        "Event starts at the browser",
        "Capture phase travels down ancestors",
        "Target is reached",
        "Target listener runs",
        "Bubbling can then travel upward"
      ],

      comparison: {
        headers: [
          "Phase",
          "Direction",
          "Default?"
        ],
        rows: [
          [
            "Capture",
            "Ancestor → target",
            "No"
          ],
          [
            "Target",
            "At event target",
            "Yes when target reached"
          ],
          [
            "Bubble",
            "Target → ancestor",
            "Yes"
          ]
        ]
      },

      keyIdea:
        "Capture and bubble describe the direction in which event listeners are processed."
    },

    {
      number: 15,
      title: "stopPropagation()",
      intro:
        "Sometimes an event should not continue through the propagation path.",

      code:
`button.addEventListener(
  "click",
  event => {
    event.stopPropagation();

    console.log("button only");
  }
);`,

      explanation:
        "stopPropagation() prevents the event from continuing to other elements in the capture or bubble path. " +
        "It does not prevent other listeners attached to the same element from running.",

      warning:
        "Do not use stopPropagation() everywhere. It can make event behaviour harder to understand and can interfere with parent components.",

      keyIdea:
        "Stop propagation only when there is a clear reason to prevent ancestor listeners from receiving the event."
    },

    {
      number: 16,
      title: "Event Delegation",
      intro:
        "Event delegation uses bubbling to handle events from many child elements with one parent listener.",

      code:
`const list =
  document.querySelector("#courses");

list.addEventListener(
  "click",
  event => {
    const item =
      event.target.closest("[data-course]");

    if (!item) return;

    console.log(
      item.dataset.course
    );
  }
);`,

      architecture: [
        {
          title: "Parent listener",
          items: [
            "One listener is attached to the container.",
            "It observes bubbled events from descendants."
          ]
        },
        {
          title: "Event target",
          items: [
            "The clicked child becomes event.target.",
            "closest() can locate the intended ancestor."
          ]
        },
        {
          title: "Dynamic content",
          items: [
            "New children can often work without adding new listeners.",
            "This is useful for lists that change over time."
          ]
        },
        {
          title: "Result",
          items: [
            "Fewer listeners can simplify large interactive collections."
          ]
        }
      ],

      keyIdea:
        "Event delegation is especially useful when a container manages many similar or dynamic children."
    },

    {
      number: 17,
      title: "Keyboard Events",
      intro:
        "Keyboard events allow interfaces to respond to user keyboard actions.",

      code:
`document.addEventListener(
  "keydown",
  event => {
    console.log(event.key);

    if (event.key === "Enter") {
      console.log("Enter pressed");
    }
  }
);`,

      methods: [
        {
          name: "keydown",
          purpose:
            "Fires when a key is pressed down.",
          example:
            'input.addEventListener("keydown", handler)'
        },
        {
          name: "keyup",
          purpose:
            "Fires when a key is released.",
          example:
            'input.addEventListener("keyup", handler)'
        }
      ],

      points: [
        "event.key gives the key value.",
        "Keyboard events can support shortcuts.",
        "Keyboard interaction is important for accessibility.",
        "Do not make mouse-only interfaces when keyboard interaction is expected."
      ],

      keyIdea:
        "Good interactive interfaces should consider both pointer and keyboard users."
    },

    {
      number: 18,
      title: "Forms and Validation",
      intro:
        "Forms are one of the most important sources of DOM events in real applications.",

      code:
`const form =
  document.querySelector("#loginForm");

form.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const email =
      document.querySelector("#email").value;

    if (!email) {
      console.log("Email is required");
      return;
    }

    console.log("Form is valid");
  }
);`,

      flow: [
        "User submits the form",
        "submit event fires",
        "Prevent default navigation when required",
        "Read form values",
        "Validate input",
        "Show errors or continue",
        "Send data to an API when appropriate"
      ],

      keyIdea:
        "Form handling is a complete pipeline: capture → validate → provide feedback → submit."
    },

    {
      number: 19,
      title: "Building Interactive UI State",
      intro:
        "Many interfaces are simply different visual states controlled by JavaScript.",

      code:
`const button =
  document.querySelector("#menuButton");

const menu =
  document.querySelector("#menu");

button.addEventListener(
  "click",
  () => {
    menu.classList.toggle("open");
  }
);`,

      architecture: [
        {
          title: "State",
          items: [
            "Menu is either open or closed."
          ]
        },
        {
          title: "Event",
          items: [
            "User clicks the menu button."
          ]
        },
        {
          title: "Logic",
          items: [
            "JavaScript toggles the relevant class."
          ]
        },
        {
          title: "Rendering",
          items: [
            "CSS displays the corresponding visual state."
          ]
        }
      ],

      keyIdea:
        "Interactive UI can often be understood as state + event + transition + rendering."
    },

    {
      number: 20,
      title: "DOM Performance and Clean Event Handling",
      intro:
        "DOM code should be predictable, efficient and easy to maintain.",

      points: [
        "Cache frequently used DOM references when appropriate.",
        "Avoid unnecessary repeated DOM queries inside tight loops.",
        "Prefer class changes over large amounts of inline styling.",
        "Use event delegation for suitable large or dynamic collections.",
        "Remove listeners when components or long-lived objects no longer need them.",
        "Keep event handlers focused on one responsibility.",
        "Avoid unnecessary DOM updates.",
        "Separate data processing from rendering logic."
      ],

      comparison: {
        headers: [
          "Less maintainable",
          "Better approach"
        ],
        rows: [
          [
            "Large anonymous event handlers",
            "Small named or focused handlers"
          ],
          [
            "Repeated DOM queries",
            "Reuse references when appropriate"
          ],
          [
            "Many identical child listeners",
            "Consider delegation"
          ],
          [
            "Direct style manipulation everywhere",
            "Use semantic CSS classes"
          ]
        ]
      },

      keyIdea:
        "Good DOM code is not just code that works; it should remain understandable as the interface grows."
    }

  ],

  visualizer: {
    title: "DOM Event Flow Visualizer",
    description:
      "Follow a click on a nested button and observe how the event moves through capture, target and bubble phases.",

    steps: [
      {
        title: "DOM hierarchy",
        operation: "document → main → card → button",
        detail:
          "The button is nested inside the card, which is inside main."
      },
      {
        title: "Capture begins",
        operation: "document → main → card",
        detail:
          "When capture listeners are registered, the event travels downward toward the target."
      },
      {
        title: "Target reached",
        operation: "button",
        detail:
          "The button is the element where the click originated."
      },
      {
        title: "Bubble begins",
        operation: "button → card → main",
        detail:
          "The event can travel upward through ancestor elements."
      },
      {
        title: "Parent handlers run",
        operation: "card → main",
        detail:
          "Ancestor listeners can respond to the bubbled event."
      },
      {
        title: "Propagation can be controlled",
        operation: "stopPropagation()",
        detail:
          "A handler can prevent the event from continuing through the propagation path."
      }
    ]
  },

  trace: {
    title: "DOM Event Propagation Tracer",

    lines: [
      {
        line: 1,
        code: 'const card = document.querySelector(".card");'
      },
      {
        line: 2,
        code: 'const button = document.querySelector(".card button");'
      },
      {
        line: 3,
        code: 'card.addEventListener("click", cardHandler);'
      },
      {
        line: 4,
        code: 'button.addEventListener("click", buttonHandler);'
      },
      {
        line: 5,
        code: 'function cardHandler(event) {'
      },
      {
        line: 6,
        code: '  console.log("card", event.target);'
      },
      {
        line: 7,
        code: '}'
      },
      {
        line: 8,
        code: 'function buttonHandler(event) {'
      },
      {
        line: 9,
        code: '  console.log("button", event.target);'
      },
      {
        line: 10,
        code: '}'
      }
    ],

    steps: [
      {
        line: 1,
        title: "Select card",
        detail:
          "JavaScript stores a reference to the card element."
      },
      {
        line: 2,
        title: "Select button",
        detail:
          "JavaScript stores a reference to the nested button."
      },
      {
        line: 3,
        title: "Register card listener",
        detail:
          "The card listens for click events."
      },
      {
        line: 4,
        title: "Register button listener",
        detail:
          "The button also listens for click events."
      },
      {
        line: 9,
        title: "Button listener",
        detail:
          "The user clicks the button, so the button listener runs at the target."
      },
      {
        line: 6,
        title: "Card listener",
        detail:
          "The click bubbles to the card, so its listener runs."
      },
      {
        line: 6,
        title: "Inspect target",
        detail:
          "event.target remains the button because that is where the click originated."
      }
    ]
  },

  revision: [
    [
      "DOM",
      "The browser's object representation of an HTML document."
    ],
    [
      "Node",
      "A unit in the DOM tree, such as an element or text node."
    ],
    [
      "querySelector()",
      "Returns the first element matching a CSS selector."
    ],
    [
      "querySelectorAll()",
      "Returns all elements matching a CSS selector."
    ],
    [
      "textContent",
      "Reads or writes text content."
    ],
    [
      "classList",
      "Provides methods for adding, removing and toggling CSS classes."
    ],
    [
      "addEventListener()",
      "Registers an event listener."
    ],
    [
      "Event object",
      "Contains information about an event."
    ],
    [
      "target",
      "The element where an event originated."
    ],
    [
      "currentTarget",
      "The element whose listener is currently running."
    ],
    [
      "preventDefault()",
      "Prevents the browser's default action."
    ],
    [
      "Bubbling",
      "Event propagation from the target toward ancestors."
    ],
    [
      "Capturing",
      "Event propagation from ancestors toward the target."
    ],
    [
      "stopPropagation()",
      "Prevents further propagation through the event path."
    ],
    [
      "Event delegation",
      "Using an ancestor listener to handle events from descendants."
    ]
  ],

  interview: [
    {
      question: "What is the DOM?",
      answer:
        "The DOM is the browser's object-based representation of an HTML document that JavaScript can read and modify."
    },
    {
      question: "What is the difference between HTML and the DOM?",
      answer:
        "HTML is the document markup, while the DOM is the browser-created object structure representing that document."
    },
    {
      question: "What does querySelector() return?",
      answer:
        "It returns the first element matching the supplied CSS selector, or null if there is no match."
    },
    {
      question: "What does querySelectorAll() return?",
      answer:
        "It returns a collection of all elements matching the selector."
    },
    {
      question: "What is the difference between textContent and innerHTML?",
      answer:
        "textContent works with text, while innerHTML parses and inserts HTML markup."
    },
    {
      question: "Why should untrusted data not be inserted using innerHTML?",
      answer:
        "Untrusted HTML can create security vulnerabilities such as cross-site scripting."
    },
    {
      question: "What is addEventListener()?",
      answer:
        "It registers a function that runs when a specified event occurs on an EventTarget."
    },
    {
      question: "What is an event object?",
      answer:
        "It is an object supplied to the event handler containing information about the event."
    },
    {
      question: "What is event.target?",
      answer:
        "It identifies the element where the event originally occurred."
    },
    {
      question: "What is event.currentTarget?",
      answer:
        "It identifies the element whose event listener is currently executing."
    },
    {
      question: "What is event bubbling?",
      answer:
        "It is the propagation phase in which an event travels from the target toward ancestor elements."
    },
    {
      question: "What is event capturing?",
      answer:
        "It is the propagation phase in which the event travels from ancestors toward the target."
    },
    {
      question: "Does bubbling happen by default?",
      answer:
        "For events that bubble, listeners registered normally with addEventListener() participate in the bubbling phase by default."
    },
    {
      question: "What does preventDefault() do?",
      answer:
        "It prevents the browser's default action associated with an event."
    },
    {
      question: "What does stopPropagation() do?",
      answer:
        "It prevents the event from continuing through the capture or bubble propagation path."
    },
    {
      question: "What is event delegation?",
      answer:
        "It is a technique where an ancestor handles events from its descendants, usually using event bubbling."
    },
    {
      question: "Why is event delegation useful?",
      answer:
        "It can reduce the number of listeners and works well for dynamic collections of elements."
    },
    {
      question: "How do you create a DOM element?",
      answer:
        "Use document.createElement() and then configure and insert the resulting element."
    },
    {
      question: "How can JavaScript toggle a CSS class?",
      answer:
        "Use element.classList.toggle('className')."
    },
    {
      question: "Why are keyboard events important?",
      answer:
        "They allow interfaces to support keyboard users and accessibility requirements rather than depending only on mouse interaction."
    }
  ],

  practice: [
    {
      title: "Change a Heading",
      difficulty: "Basic",
      task:
        "Select an h1 element and change its text to 'Welcome to CodeBhavya' when the page loads.",
      hints: [
        "Use document.querySelector().",
        "Store the element in a variable.",
        "Assign the new value to textContent."
      ]
    },
    {
      title: "Button Counter",
      difficulty: "Basic",
      task:
        "Create a button and a counter. Each click should increase the displayed counter by one.",
      hints: [
        "Store the current count in a variable.",
        "Use addEventListener('click', ...).",
        "Update the DOM after changing the count."
      ]
    },
    {
      title: "Toggle Menu",
      difficulty: "Basic",
      task:
        "Create a menu button that toggles an 'open' CSS class on a navigation panel.",
      hints: [
        "Select both the button and menu.",
        "Listen for click.",
        "Use classList.toggle()."
      ]
    },
    {
      title: "Dynamic Course",
      difficulty: "Basic",
      task:
        "Create a new li element using JavaScript, set its text to 'JavaScript', and append it to an existing ul.",
      hints: [
        "Use document.createElement('li').",
        "Set textContent.",
        "Use append() to insert the element."
      ]
    },
    {
      title: "Form Validation",
      difficulty: "Intermediate",
      task:
        "Handle a form submission and prevent the default action when the email field is empty.",
      hints: [
        "Listen for the submit event.",
        "Use event.preventDefault().",
        "Read the input value.",
        "Only prevent normal submission when your validation requires it."
      ]
    },
    {
      title: "Keyboard Shortcut",
      difficulty: "Intermediate",
      task:
        "Listen for keydown and print 'Search opened' when the user presses the '/' key.",
      hints: [
        "Listen on document.",
        "Inspect event.key.",
        "Compare it with '/'."
      ]
    },
    {
      title: "Event Bubbling Demo",
      difficulty: "Intermediate",
      task:
        "Create a button inside a div. Add click listeners to both and observe the order in which the handlers run.",
      hints: [
        "Add one listener to the button.",
        "Add another listener to the parent div.",
        "Click the button and observe bubbling."
      ]
    },
    {
      title: "Stop Propagation",
      difficulty: "Intermediate",
      task:
        "Modify the previous example so the button handler prevents the parent click handler from running.",
      hints: [
        "Receive the event object.",
        "Call event.stopPropagation().",
        "Do not use preventDefault() for this task."
      ]
    },
    {
      title: "Event Delegation",
      difficulty: "Advanced",
      task:
        "Create a list of courses using data-course attributes. Attach one click listener to the list and print the selected course.",
      hints: [
        "Use one listener on the parent list.",
        "Read event.target.",
        "closest('[data-course]') can help when the clicked element is nested.",
        "Use dataset.course to read the value."
      ]
    },
    {
      title: "Interactive Course List",
      difficulty: "Advanced",
      task:
        "Build a small course list where clicking a course selects it, adds an active class, and displays its name in a status area. Use event delegation rather than one listener per course.",
      hints: [
        "Attach one click listener to the list.",
        "Find the clicked course using closest().",
        "Remove active from the previous selection.",
        "Add active to the new selection.",
        "Update the status element using textContent."
      ]
    }
  ],

  quiz: [
    {
      question: "What does DOM stand for?",
      options: [
        "Document Object Model",
        "Data Object Manager",
        "Document Oriented Model",
        "Dynamic Object Method"
      ],
      answer: 0
    },
    {
      question: "Which method returns the first matching element?",
      options: [
        "querySelector()",
        "querySelectorAll()",
        "getElements()",
        "findAll()"
      ],
      answer: 0
    },
    {
      question: "Which property is suitable for safely setting plain text?",
      options: [
        "innerHTML",
        "textContent",
        "htmlText",
        "outerHTML"
      ],
      answer: 1
    },
    {
      question: "Which method registers an event listener?",
      options: [
        "listen()",
        "onEvent()",
        "addEventListener()",
        "registerEvent()"
      ],
      answer: 2
    },
    {
      question: "Where did the event originally occur?",
      options: [
        "currentTarget",
        "target",
        "sourceTarget",
        "origin"
      ],
      answer: 1
    },
    {
      question: "Which method prevents default browser behaviour?",
      options: [
        "stopPropagation()",
        "preventDefault()",
        "cancelEvent()",
        "stopDefault()"
      ],
      answer: 1
    },
    {
      question: "Which direction describes bubbling?",
      options: [
        "Ancestor to target",
        "Target to ancestor",
        "Document to browser",
        "Browser to document"
      ],
      answer: 1
    },
    {
      question: "Which option enables capture for addEventListener()?",
      options: [
        "{ bubble: true }",
        "{ capture: true }",
        "{ target: true }",
        "{ phase: 'capture' }"
      ],
      answer: 1
    },
    {
      question: "What does stopPropagation() control?",
      options: [
        "CSS rendering",
        "Default browser actions",
        "Event propagation",
        "DOM creation"
      ],
      answer: 2
    },
    {
      question: "What is event delegation?",
      options: [
        "Removing all listeners",
        "Using a parent listener for descendant events",
        "Disabling bubbling",
        "Creating custom events only"
      ],
      answer: 1
    },
    {
      question: "Which property toggles a CSS class?",
      options: [
        "classList.toggle()",
        "class.toggle()",
        "style.toggle()",
        "css.toggle()"
      ],
      answer: 0
    },
    {
      question: "Which method creates a new DOM element?",
      options: [
        "newElement()",
        "createNode()",
        "document.createElement()",
        "document.newElement()"
      ],
      answer: 2
    }
  ],

  glossary: [
    {
      term: "DOM",
      definition:
        "The browser's object representation of an HTML document."
    },
    {
      term: "Node",
      definition:
        "A unit in the DOM tree."
    },
    {
      term: "Element",
      definition:
        "A DOM node representing an HTML element."
    },
    {
      term: "Event",
      definition:
        "A browser notification that something has happened."
    },
    {
      term: "Event listener",
      definition:
        "A function registered to respond to a particular event."
    },
    {
      term: "target",
      definition:
        "The element where the event originated."
    },
    {
      term: "currentTarget",
      definition:
        "The element whose listener is currently executing."
    },
    {
      term: "Bubbling",
      definition:
        "Propagation from an event target toward ancestor elements."
    },
    {
      term: "Capturing",
      definition:
        "Propagation from ancestor elements toward the event target."
    },
    {
      term: "Event delegation",
      definition:
        "Handling descendant events using a listener attached to an ancestor."
    },
    {
      term: "preventDefault()",
      definition:
        "Prevents an event's default browser action."
    },
    {
      term: "stopPropagation()",
      definition:
        "Stops an event from continuing through the propagation path."
    },
    {
      term: "classList",
      definition:
        "An API for managing CSS classes on an element."
    },
    {
      term: "dataset",
      definition:
        "An API for accessing data-* attributes."
    }
  ],

  completion: {
    title: "Level 11 Complete — Control the Browser",
    message:
      "You can now connect JavaScript to the DOM, respond to user events, " +
      "control event propagation and build interactive browser interfaces.",

    challenge:
      "Build a CodeBhavya Course Explorer. Display at least six courses as " +
      "interactive cards using data attributes. Use event delegation to handle " +
      "course selection, highlight the selected card, show its description in a " +
      "details panel, support keyboard interaction, and include a small form " +
      "that validates user input before displaying a success message."
  },

  takeaway:
    "Level 11 is the bridge between JavaScript language fundamentals and real browser applications. " +
    "Once you understand the DOM and event system, you can build interactive interfaces instead of " +
    "just running JavaScript in the console."
};

console.log(
  "CodeBhavya Full Stack Level 11 loaded: DOM & Events"
);
