/* =========================================================
   CODEBHAVYA · FULL STACK · MERN
   LEVEL 11 — DOM & BROWSER INTERACTION
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[11] = {

  id: 11,

  title: "DOM & Browser Interaction",

  kicker: "LEVEL 11 · JAVASCRIPT ENGINEERING",

  summary:
    "Learn how JavaScript connects with HTML, responds to user actions, changes page content, handles forms and stores data in the browser.",

  hero: {
    title: "DOM & Browser Interaction",
    subtitle:
      "Turn static HTML pages into interactive web applications using JavaScript and the browser."
  },

  objectives: [
    "Understand the DOM and document tree.",
    "Select HTML elements using JavaScript.",
    "Read and modify text and HTML content.",
    "Change styles and CSS classes dynamically.",
    "Read and modify HTML attributes.",
    "Create and remove DOM elements.",
    "Traverse parent, child and sibling relationships.",
    "Attach event listeners.",
    "Understand event objects.",
    "Handle mouse, keyboard and input events.",
    "Handle forms using JavaScript.",
    "Prevent default browser behavior.",
    "Understand event bubbling and capturing.",
    "Use event delegation.",
    "Store browser data using localStorage.",
    "Understand sessionStorage.",
    "Build interactive browser applications.",
    "Understand safe and maintainable DOM manipulation."
  ],

  outcomes: [
    "Build interactive webpages without relying on frameworks.",
    "Connect user actions to JavaScript logic.",
    "Create and modify DOM elements dynamically.",
    "Handle forms and browser events correctly.",
    "Store small amounts of client-side data.",
    "Understand the foundation React builds upon."
  ],

  concepts: [

    /* =====================================================
       CONCEPT 01
       ===================================================== */

    {
      id: 1,

      title: "What Is the DOM?",

      explanation: `
        DOM stands for Document Object Model.

        When the browser loads an HTML document, it creates
        an in-memory representation of that document.

        HTML:

        <body>
          <h1>Hello</h1>
          <p>Welcome</p>
        </body>

        The browser represents these elements as objects
        arranged in a tree-like structure.

        JavaScript can access this structure through:

        document

        The DOM allows JavaScript to:

        • read page content
        • change page content
        • create elements
        • remove elements
        • change attributes
        • respond to user actions

        The DOM is therefore the bridge between JavaScript
        and the webpage.
      `,

      example: `console.log(document);

console.log(document.body);

console.log(document.title);`,

      visualizer: {
        type: "dom-tree",
        title: "DOM Tree Visualizer",
        steps: [
          {
            active: "document",
            message: "The browser creates the document object."
          },
          {
            active: "html",
            message: "The HTML element becomes the root of the page tree."
          },
          {
            active: "body",
            message: "The body contains visible page elements."
          },
          {
            active: "h1",
            message: "The heading becomes a child node."
          },
          {
            active: "p",
            message: "The paragraph becomes another child node."
          }
        ]
      },

      keyPoints: [
        "DOM means Document Object Model.",
        "The browser creates the DOM from HTML.",
        "JavaScript accesses the DOM through document.",
        "DOM manipulation makes webpages interactive."
      ]
    },

    /* =====================================================
       CONCEPT 02
       ===================================================== */

    {
      id: 2,

      title: "Selecting Elements",

      explanation: `
        Before changing an element, JavaScript needs to find it.

        Common selection methods include:

        getElementById()
        querySelector()
        querySelectorAll()

        Example:

        document.getElementById("title")

        selects an element by its id.

        querySelector() accepts CSS selectors.

        document.querySelector(".card")

        selects the first matching element.

        querySelectorAll() returns all matching elements.
      `,

      example: `const title = document.getElementById("title");

const firstCard = document.querySelector(".card");

const cards = document.querySelectorAll(".card");

console.log(title);
console.log(firstCard);
console.log(cards);`,

      keyPoints: [
        "getElementById() selects by id.",
        "querySelector() returns the first matching element.",
        "querySelectorAll() returns all matching elements.",
        "CSS selector knowledge is useful for DOM selection."
      ]
    },

    /* =====================================================
       CONCEPT 03
       ===================================================== */

    {
      id: 3,

      title: "Reading & Changing Text",

      explanation: `
        JavaScript can read and change the visible text
        of an element.

        textContent is the preferred general-purpose property
        for working with plain text.

        Example:

        const heading = document.querySelector("h1");

        console.log(heading.textContent);

        heading.textContent = "Welcome to CodeBhavya";

        The browser immediately updates the displayed text.

        textContent treats the assigned value as text,
        not HTML.
      `,

      example: `const heading = document.querySelector("h1");

console.log(heading.textContent);

heading.textContent = "Welcome to CodeBhavya";`,

      keyPoints: [
        "textContent reads text content.",
        "Assigning textContent changes the displayed text.",
        "textContent does not interpret HTML tags."
      ]
    },

    /* =====================================================
       CONCEPT 04
       ===================================================== */

    {
      id: 4,

      title: "innerHTML & HTML Content",

      explanation: `
        innerHTML reads or replaces the HTML inside an element.

        Example:

        const box = document.querySelector(".box");

        box.innerHTML = "<strong>Hello</strong>";

        The browser interprets the string as HTML.

        This is powerful but must be used carefully.

        Never insert untrusted user input directly into
        innerHTML.

        For plain user-generated text, textContent is generally
        safer.

        Understanding this distinction is important for
        security-conscious frontend development.
      `,

      example: `const box = document.querySelector(".box");

box.innerHTML = "<strong>CodeBhavya</strong>";

console.log(box.innerHTML);`,

      keyPoints: [
        "innerHTML works with HTML markup.",
        "textContent works with text.",
        "Do not insert untrusted input directly into innerHTML.",
        "Prefer textContent for plain user-generated text."
      ]
    },

    /* =====================================================
       CONCEPT 05
       ===================================================== */

    {
      id: 5,

      title: "Changing Styles & Classes",

      explanation: `
        JavaScript can dynamically change an element's appearance.

        Direct style manipulation:

        element.style.color = "red";

        A more maintainable approach is often to modify
        CSS classes.

        classList provides:

        add()
        remove()
        toggle()
        contains()

        Example:

        button.classList.toggle("active");

        This allows CSS to control presentation while JavaScript
        controls application state.
      `,

      example: `const button = document.querySelector("button");

button.classList.add("active");

button.classList.toggle("selected");

console.log(
  button.classList.contains("selected")
);`,

      keyPoints: [
        "style changes inline styles.",
        "classList provides better control over CSS classes.",
        "toggle() is useful for interactive states.",
        "Keep presentation primarily in CSS when possible."
      ]
    },

    /* =====================================================
       CONCEPT 06
       ===================================================== */

    {
      id: 6,

      title: "Working with Attributes",

      explanation: `
        HTML elements contain attributes.

        Examples:

        id
        class
        href
        src
        disabled
        data-* attributes

        JavaScript can read and change attributes using:

        getAttribute()
        setAttribute()
        removeAttribute()
        hasAttribute()

        Example:

        const link = document.querySelector("a");

        link.setAttribute(
          "href",
          "https://codebhavya.com"
        );

        Attributes are useful when JavaScript needs to
        configure or inspect HTML elements dynamically.
      `,

      example: `const link = document.querySelector("a");

console.log(link.getAttribute("href"));

link.setAttribute(
  "target",
  "_blank"
);

console.log(
  link.hasAttribute("target")
);`,

      keyPoints: [
        "Attributes describe HTML elements.",
        "getAttribute reads an attribute.",
        "setAttribute changes or creates an attribute.",
        "removeAttribute removes an attribute."
      ]
    },

    /* =====================================================
       CONCEPT 07
       ===================================================== */

    {
      id: 7,

      title: "Creating DOM Elements",

      explanation: `
        JavaScript can create new HTML elements dynamically.

        Example:

        const item = document.createElement("li");

        item.textContent = "JavaScript";

        document.querySelector("ul").append(item);

        The element did not have to exist in the original HTML.

        This technique is useful for:

        • todo lists
        • product cards
        • notifications
        • search results
        • dashboards
        • dynamic tables
      `,

      example: `const item = document.createElement("li");

item.textContent = "JavaScript";

document.querySelector("ul").append(item);`,

      visualizer: {
        type: "dom-create",
        title: "Dynamic Element Creation",
        steps: [
          {
            operation: "createElement",
            message: "Create a new li element."
          },
          {
            operation: "textContent",
            message: "Add JavaScript as its text."
          },
          {
            operation: "append",
            message: "Insert the new element into the list."
          }
        ]
      },

      keyPoints: [
        "createElement creates a DOM node.",
        "Properties can be configured before insertion.",
        "append() inserts the node into the document."
      ]
    },

    /* =====================================================
       CONCEPT 08
       ===================================================== */

    {
      id: 8,

      title: "Removing & Replacing Elements",

      explanation: `
        JavaScript can also remove existing DOM elements.

        Example:

        const item = document.querySelector(".item");

        item.remove();

        An element can also be replaced.

        parent.replaceChildren(newElement);

        Modern DOM APIs make these operations easier
        than older techniques such as manually editing
        parent nodes.
      `,

      example: `const item = document.querySelector(".item");

if (item) {
  item.remove();
}`,

      keyPoints: [
        "remove() deletes an element from the DOM.",
        "Always check whether an optional element exists.",
        "DOM APIs can replace or update existing content."
      ]
    },

    /* =====================================================
       CONCEPT 09
       ===================================================== */

    {
      id: 9,

      title: "DOM Traversal",

      explanation: `
        DOM elements have relationships with other elements.

        Important relationships include:

        parentElement
        children
        firstElementChild
        lastElementChild
        nextElementSibling
        previousElementSibling

        Example:

        const list = document.querySelector("ul");

        console.log(list.children);

        DOM traversal is useful when the element we need
        is related to an element we already selected.
      `,

      example: `const list = document.querySelector("ul");

console.log(list.parentElement);
console.log(list.children);
console.log(list.firstElementChild);
console.log(list.lastElementChild);`,

      keyPoints: [
        "DOM nodes form parent-child relationships.",
        "Traversal lets us move through those relationships.",
        "children returns element children.",
        "Element traversal avoids unnecessary global searches."
      ]
    },

    /* =====================================================
       CONCEPT 10
       ===================================================== */

    {
      id: 10,

      title: "Event Listeners",

      explanation: `
        Websites become interactive when they respond to events.

        Examples:

        click
        input
        change
        submit
        keydown
        mouseover

        JavaScript can listen for events using:

        addEventListener()

        Example:

        button.addEventListener("click", () => {
          console.log("Button clicked");
        });

        The callback runs when the event occurs.

        This is the foundation of interactive browser applications.
      `,

      example: `const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("Button clicked!");
});`,

      visualizer: {
        type: "event",
        title: "Event Listener Flow",
        steps: [
          {
            operation: "Register",
            message: "JavaScript registers a click listener."
          },
          {
            operation: "Wait",
            message: "The browser waits for a click."
          },
          {
            operation: "Event",
            message: "The user clicks the button."
          },
          {
            operation: "Callback",
            message: "The registered callback executes."
          }
        ]
      },

      keyPoints: [
        "Events represent actions or browser occurrences.",
        "addEventListener registers a handler.",
        "The callback executes when the event occurs.",
        "One element can have multiple event listeners."
      ]
    },

    /* =====================================================
       CONCEPT 11
       ===================================================== */

    {
      id: 11,

      title: "The Event Object",

      explanation: `
        Event handlers receive an event object.

        It contains information about the event.

        Example:

        button.addEventListener("click", event => {
          console.log(event.type);
          console.log(event.target);
        });

        Important properties include:

        type
        target
        currentTarget

        Keyboard events can also provide:

        key
        code

        Understanding the event object is essential
        for building interactive interfaces.
      `,

      example: `const button = document.querySelector("button");

button.addEventListener("click", event => {
  console.log("Type:", event.type);
  console.log("Target:", event.target);
});`,

      keyPoints: [
        "The event object describes the event.",
        "target identifies the originating element.",
        "type identifies the event type.",
        "Keyboard events expose information about pressed keys."
      ]
    },

    /* =====================================================
       CONCEPT 12
       ===================================================== */

    {
      id: 12,

      title: "Keyboard & Input Events",

      explanation: `
        Forms and search interfaces frequently need to respond
        while the user is typing.

        The input event fires when an input's value changes.

        Example:

        search.addEventListener("input", event => {
          console.log(event.target.value);
        });

        Keyboard events such as keydown can detect keyboard activity.

        Example:

        document.addEventListener("keydown", event => {
          console.log(event.key);
        });

        Use input when you care about changed input values.
        Use keyboard events when you need specific key behavior.
      `,

      example: `const search = document.querySelector("#search");

search.addEventListener("input", event => {
  console.log("Search:", event.target.value);
});

document.addEventListener("keydown", event => {
  console.log("Key:", event.key);
});`,

      keyPoints: [
        "input is useful for live field changes.",
        "keydown detects keyboard activity.",
        "event.target.value reads an input value.",
        "Choose events according to the required behavior."
      ]
    },

    /* =====================================================
       CONCEPT 13
       ===================================================== */

    {
      id: 13,

      title: "Form Handling",

      explanation: `
        Forms are central to web applications.

        Examples:

        login
        registration
        search
        contact
        placement applications

        A form can be handled using the submit event.

        Example:

        form.addEventListener("submit", event => {
          event.preventDefault();

          console.log("Form submitted");
        });

        preventDefault() stops the browser's default action.

        This allows JavaScript to validate and process the data
        before deciding what should happen next.
      `,

      example: `const form = document.querySelector("form");

form.addEventListener("submit", event => {
  event.preventDefault();

  const name =
    document.querySelector("#name").value;

  console.log("Student:", name);
});`,

      tracer: {
        title: "Form Submission Trace",
        steps: [
          {
            operation: "User action",
            message: "The user submits the form."
          },
          {
            operation: "Event",
            message: "The submit event is generated."
          },
          {
            operation: "preventDefault",
            message: "The default browser navigation is prevented."
          },
          {
            operation: "Read data",
            message: "JavaScript reads the form values."
          },
          {
            operation: "Process",
            message: "Application logic processes the submitted data."
          }
        ]
      },

      keyPoints: [
        "submit is the main event for form submission.",
        "preventDefault() stops the default browser action.",
        "JavaScript can validate and process form data.",
        "Forms are a major source of user input."
      ]
    },

    /* =====================================================
       CONCEPT 14
       ===================================================== */

    {
      id: 14,

      title: "Form Validation",

      explanation: `
        Client-side validation improves user experience.

        Example checks:

        • required name
        • valid email format
        • minimum password length
        • valid phone number
        • acceptable marks

        Example:

        if (name.trim() === "") {
          message.textContent = "Name is required";
          return;
        }

        Client-side validation is useful,
        but it should not be treated as the only security layer.

        Server-side validation is still required when data
        reaches a backend.
      `,

      example: `const name = document.querySelector("#name").value.trim();

if (name === "") {
  console.log("Name is required");
} else {
  console.log("Valid name:", name);
}`,

      keyPoints: [
        "Validation improves user experience.",
        "trim() removes surrounding whitespace.",
        "Client validation can be bypassed.",
        "Important validation must also happen on the server."
      ]
    },

    /* =====================================================
       CONCEPT 15
       ===================================================== */

    {
      id: 15,

      title: "Event Bubbling",

      explanation: `
        Events can travel through the DOM.

        Suppose we have:

        div
          button

        When the button is clicked, the event can move upward
        through its ancestors.

        This upward movement is called bubbling.

        It is important because parent elements can react
        to events originating from their children.

        Event propagation can be controlled when necessary
        using methods such as stopPropagation().

        The exact propagation model becomes especially important
        when building event delegation systems.
      `,

      example: `const parent = document.querySelector(".parent");
const button = document.querySelector(".child");

parent.addEventListener("click", () => {
  console.log("Parent handler");
});

button.addEventListener("click", () => {
  console.log("Button handler");
});`,

      visualizer: {
        type: "event-bubble",
        title: "Event Bubbling Concept",
        steps: [
          {
            active: "button",
            message: "The user clicks the button."
          },
          {
            active: "button-handler",
            message: "The button's handler runs."
          },
          {
            active: "parent",
            message: "The event can continue toward the parent."
          },
          {
            active: "parent-handler",
            message: "The parent handler can respond."
          }
        ]
      },

      keyPoints: [
        "Events can propagate through the DOM.",
        "Bubbling moves from the target toward ancestors.",
        "stopPropagation() can stop further propagation.",
        "Understanding bubbling is important for event delegation."
      ]
    },

    /* =====================================================
       CONCEPT 16
       ===================================================== */

    {
      id: 16,

      title: "Event Delegation",

      explanation: `
        Event delegation uses one listener on a parent
        instead of attaching separate listeners to many children.

        Example:

        const list = document.querySelector("ul");

        list.addEventListener("click", event => {

          if (event.target.matches("li")) {
            console.log(event.target.textContent);
          }

        });

        This is especially useful for dynamic lists.

        If new li elements are added later,
        the parent listener can still handle their events.

        Event delegation uses event bubbling.
      `,

      example: `const list = document.querySelector("ul");

list.addEventListener("click", event => {

  if (event.target.matches("li")) {
    console.log(
      "Clicked:",
      event.target.textContent
    );
  }

});`,

      keyPoints: [
        "Event delegation uses a parent listener.",
        "It relies on event bubbling.",
        "It works well for dynamic lists.",
        "It can reduce the number of event listeners."
      ]
    },

    /* =====================================================
       CONCEPT 17
       ===================================================== */

    {
      id: 17,

      title: "localStorage",

      explanation: `
        localStorage allows a webpage to store small amounts
        of data in the browser.

        Example:

        localStorage.setItem(
          "theme",
          "dark"
        );

        Read it:

        localStorage.getItem("theme");

        Remove it:

        localStorage.removeItem("theme");

        Clear all data for the site's storage area:

        localStorage.clear();

        localStorage stores strings.

        Therefore objects and arrays are commonly converted
        using JSON.stringify() and JSON.parse().
      `,

      example: `const student = {
  name: "Ravi",
  cgpa: 8.7
};

localStorage.setItem(
  "student",
  JSON.stringify(student)
);

const saved =
  JSON.parse(
    localStorage.getItem("student")
  );

console.log(saved);`,

      visualizer: {
        type: "storage",
        title: "localStorage Flow",
        steps: [
          {
            operation: "Object",
            data: {
              name: "Ravi",
              cgpa: 8.7
            },
            message: "JavaScript starts with an object."
          },
          {
            operation: "stringify",
            message: "JSON.stringify converts the object into a string."
          },
          {
            operation: "setItem",
            message: "The string is stored in localStorage."
          },
          {
            operation: "getItem",
            message: "The stored string is retrieved."
          },
          {
            operation: "parse",
            message: "JSON.parse converts it back into an object."
          }
        ]
      },

      keyPoints: [
        "localStorage stores data in the browser.",
        "Stored values are strings.",
        "JSON.stringify converts objects to strings.",
        "JSON.parse converts JSON strings back to JavaScript values."
      ]
    },

    /* =====================================================
       CONCEPT 18
       ===================================================== */

    {
      id: 18,

      title: "sessionStorage",

      explanation: `
        sessionStorage provides browser storage similar
        to localStorage.

        The important difference is the intended lifetime.

        localStorage is designed for data that can persist
        across browser sessions.

        sessionStorage is associated with the current
        browser tab/session and is cleared when that tab
        is closed.

        Example:

        sessionStorage.setItem(
          "step",
          "2"
        );

        sessionStorage.getItem("step");

        Both APIs store strings.
      `,

      example: `sessionStorage.setItem(
  "currentStep",
  "2"
);

console.log(
  sessionStorage.getItem("currentStep")
);`,

      keyPoints: [
        "sessionStorage is scoped to a browser tab/session.",
        "localStorage is intended for longer-lived client-side storage.",
        "Both APIs store string values.",
        "Do not store sensitive secrets in browser storage."
      ]
    },

    /* =====================================================
       CONCEPT 19
       ===================================================== */

    {
      id: 19,

      title: "DOMContentLoaded & Script Timing",

      explanation: `
        JavaScript must interact with elements after those elements
        are available.

        If a script executes before the required HTML exists,
        a DOM selection may return null.

        One solution is:

        document.addEventListener(
          "DOMContentLoaded",
          () => {
            // DOM is ready
          }
        );

        Another common solution is placing scripts appropriately
        or using defer when loading external scripts.

        Modern projects should deliberately manage script timing
        rather than relying on accidental behavior.
      `,

      example: `document.addEventListener(
  "DOMContentLoaded",
  () => {

    const heading =
      document.querySelector("h1");

    console.log(heading);

  }
);`,

      keyPoints: [
        "DOM timing matters.",
        "DOMContentLoaded fires after the initial HTML is parsed.",
        "defer is another useful script-loading strategy.",
        "Avoid accessing elements before they exist."
      ]
    },

    /* =====================================================
       CONCEPT 20
       ===================================================== */

    {
      id: 20,

      title: "Building a Complete Interactive Feature",

      explanation: `
        A practical browser feature usually combines several
        DOM concepts.

        Example: a simple task manager.

        The user:

        1. Enters a task.
        2. Submits the form.
        3. JavaScript prevents the default submission.
        4. Reads the input.
        5. Creates a new list item.
        6. Adds the task to the DOM.
        7. Clears the input.
        8. Allows the task to be removed.
        9. Optionally stores tasks in localStorage.

        This combines:

        DOM selection
        Events
        Forms
        Validation
        Element creation
        Element removal
        Event delegation
        Browser storage

        This is the point where individual DOM APIs become
        an actual application feature.
      `,

      example: `const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#taskList");

form.addEventListener("submit", event => {

  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  const item = document.createElement("li");

  item.textContent = text;

  list.append(item);

  input.value = "";
});

list.addEventListener("click", event => {

  if (event.target.matches("li")) {
    event.target.remove();
  }

});`,

      tracer: {
        title: "Interactive Task Manager Trace",
        steps: [
          {
            stage: "Input",
            message: "The user enters a task."
          },
          {
            stage: "Submit",
            message: "The form submit event fires."
          },
          {
            stage: "Prevent",
            message: "preventDefault() stops normal page navigation."
          },
          {
            stage: "Validate",
            message: "The input is trimmed and checked."
          },
          {
            stage: "Create",
            message: "A new li element is created."
          },
          {
            stage: "Insert",
            message: "The task is appended to the list."
          },
          {
            stage: "Interact",
            message: "A delegated click listener can remove the task."
          }
        ]
      },

      keyPoints: [
        "Real applications combine multiple DOM APIs.",
        "Events connect user actions to application logic.",
        "Event delegation works well for dynamic lists.",
        "Browser storage can preserve application state."
      ]
    }

  ],

  /* =======================================================
     PREMIUM VISUALIZER
     ======================================================= */

  visualizer: {

    title: "Premium DOM & Browser Visualizer",

    description:
      "Follow how JavaScript selects elements, modifies the DOM and responds to browser events.",

    type: "dom",

    examples: [

      {
        title: "DOM Selection",

        code: `const heading =
  document.querySelector("h1");`,

        steps: [
          {
            operation: "document",
            message: "JavaScript starts from the document object."
          },
          {
            operation: "querySelector",
            message: "The browser searches for the first h1 element."
          },
          {
            operation: "reference",
            message: "The selected element reference is stored in heading."
          }
        ]
      },

      {
        title: "Change Text",

        code: `const heading =
  document.querySelector("h1");

heading.textContent =
  "CodeBhavya";`,

        steps: [
          {
            operation: "select",
            message: "The heading is selected."
          },
          {
            operation: "read",
            message: "JavaScript accesses the heading object."
          },
          {
            operation: "update",
            message: "textContent is changed."
          },
          {
            operation: "render",
            message: "The browser displays the updated text."
          }
        ]
      },

      {
        title: "Create Element",

        code: `const item =
  document.createElement("li");

item.textContent = "JavaScript";

list.append(item);`,

        steps: [
          {
            operation: "create",
            message: "Create a new li node."
          },
          {
            operation: "configure",
            message: "Set its text."
          },
          {
            operation: "append",
            message: "Insert it into the list."
          },
          {
            operation: "display",
            message: "The browser renders the new item."
          }
        ]
      },

      {
        title: "Click Event",

        code: `button.addEventListener(
  "click",
  () => {
    console.log("Clicked");
  }
);`,

        steps: [
          {
            operation: "register",
            message: "Register the click listener."
          },
          {
            operation: "wait",
            message: "Browser waits for a click."
          },
          {
            operation: "click",
            message: "User clicks the button."
          },
          {
            operation: "callback",
            message: "The callback executes."
          }
        ]
      }

    ]
  },

  /* =======================================================
     PROGRAM TRACE
     ======================================================= */

  trace: {

    title: "Program Trace · Interactive Task List",

    code: `const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#taskList");

form.addEventListener("submit", event => {

  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  const item = document.createElement("li");

  item.textContent = text;

  list.append(item);

  input.value = "";

});`,

    steps: [

      {
        line: 1,
        operation: "Select form.",
        variables: {
          form: "form element"
        },
        message: "JavaScript stores a reference to the form."
      },

      {
        line: 2,
        operation: "Select input.",
        variables: {
          input: "input element"
        },
        message: "The task input is selected."
      },

      {
        line: 3,
        operation: "Select list.",
        variables: {
          list: "ul element"
        },
        message: "The task list is selected."
      },

      {
        line: 5,
        operation: "Register submit listener.",
        message: "JavaScript waits for form submission."
      },

      {
        line: 7,
        operation: "Prevent default.",
        message: "The browser's default form action is stopped."
      },

      {
        line: 9,
        operation: "Read input.",
        variables: {
          text: "Study JavaScript"
        },
        message: "The user's task is read and trimmed."
      },

      {
        line: 11,
        operation: "Validate.",
        variables: {
          text: "Study JavaScript"
        },
        message: "The input is not empty, so execution continues."
      },

      {
        line: 15,
        operation: "Create li.",
        message: "A new list item is created."
      },

      {
        line: 17,
        operation: "Set text.",
        variables: {
          item: "Study JavaScript"
        },
        message: "The new item receives the task text."
      },

      {
        line: 19,
        operation: "Append item.",
        message: "The item is inserted into the task list."
      },

      {
        line: 21,
        operation: "Clear input.",
        variables: {
          input: ""
        },
        message: "The input field is cleared for the next task."
      }

    ]
  },

  /* =======================================================
     REVISION
     ======================================================= */

  revision: [

    {
      question: "What does DOM stand for?",
      answer: "Document Object Model."
    },

    {
      question: "What object provides access to the webpage DOM?",
      answer: "The document object."
    },

    {
      question: "What does querySelector() return?",
      answer: "The first element matching the supplied CSS selector."
    },

    {
      question: "What does querySelectorAll() return?",
      answer: "A collection of all elements matching the selector."
    },

    {
      question: "What is textContent used for?",
      answer: "Reading or changing the text content of an element."
    },

    {
      question: "What is innerHTML used for?",
      answer: "Reading or changing the HTML markup inside an element."
    },

    {
      question: "What does classList.toggle() do?",
      answer: "It adds a class if absent or removes it if present."
    },

    {
      question: "How do you create a DOM element?",
      answer: "Using document.createElement()."
    },

    {
      question: "How do you remove a DOM element?",
      answer: "Using element.remove()."
    },

    {
      question: "How do you register an event listener?",
      answer: "Using element.addEventListener()."
    },

    {
      question: "What is the event object?",
      answer: "An object containing information about an event."
    },

    {
      question: "What does preventDefault() do?",
      answer: "It prevents the browser's default action for an event."
    },

    {
      question: "What is event bubbling?",
      answer: "The propagation of an event from the target toward its ancestor elements."
    },

    {
      question: "What is event delegation?",
      answer: "Handling child events using a listener attached to a parent."
    },

    {
      question: "How are objects stored in localStorage?",
      answer: "They are commonly converted to JSON strings using JSON.stringify()."
    },

    {
      question: "What does JSON.parse() do?",
      answer: "It converts a JSON string into a JavaScript value."
    },

    {
      question: "What is the main difference between localStorage and sessionStorage?",
      answer:
        "localStorage is intended for persistent browser storage, while sessionStorage is associated with the current tab/session."
    },

    {
      question: "Why is client-side validation not enough?",
      answer:
        "Users can bypass browser-side checks, so important validation must also be performed on the server."
    }

  ],

  /* =======================================================
     INTERVIEW
     ======================================================= */

  interview: [

    {
      question: "What is the DOM?",
      answer:
        "The DOM is the browser's object-based representation of an HTML document that JavaScript can read and manipulate."
    },

    {
      question: "What is the difference between getElementById() and querySelector()?",
      answer:
        "getElementById() specifically selects by id, while querySelector() accepts a CSS selector and returns the first match."
    },

    {
      question: "What is the difference between textContent and innerHTML?",
      answer:
        "textContent works with text, while innerHTML interprets and manipulates HTML markup."
    },

    {
      question: "Why should innerHTML be used carefully?",
      answer:
        "Inserting untrusted content through innerHTML can create security vulnerabilities such as cross-site scripting."
    },

    {
      question: "What is the difference between style and classList?",
      answer:
        "style changes inline CSS properties, while classList manages CSS classes and usually provides cleaner separation between behavior and presentation."
    },

    {
      question: "What is addEventListener()?",
      answer:
        "It registers a function to run when a specified event occurs on an element."
    },

    {
      question: "What is event bubbling?",
      answer:
        "It is the upward propagation of an event from its target through ancestor elements."
    },

    {
      question: "What is event delegation and why is it useful?",
      answer:
        "Event delegation attaches a listener to a parent and handles child events through bubbling. It is especially useful for dynamic lists."
    },

    {
      question: "What does event.target represent?",
      answer:
        "It normally represents the element on which the event originated."
    },

    {
      question: "What does event.currentTarget represent?",
      answer:
        "It represents the element whose event listener is currently executing."
    },

    {
      question: "Why is preventDefault() commonly used with forms?",
      answer:
        "It prevents the browser's default submission/navigation behavior so JavaScript can validate and process the data."
    },

    {
      question: "What is the difference between localStorage and sessionStorage?",
      answer:
        "localStorage is intended for persistent client-side data, while sessionStorage is associated with the current tab/session."
    },

    {
      question: "Can localStorage directly store JavaScript objects?",
      answer:
        "No. It stores strings, so objects are normally serialized using JSON.stringify() and restored using JSON.parse()."
    },

    {
      question: "What is DOMContentLoaded?",
      answer:
        "It fires when the initial HTML document has been completely parsed and the DOM is ready for manipulation."
    },

    {
      question: "Is client-side validation a security mechanism?",
      answer:
        "No. It improves user experience but must be backed by server-side validation for security and data integrity."
    }

  ],

  /* =======================================================
     PRACTICE
     ======================================================= */

  practice: [

    {
      id: 1,
      title: "Change Heading",
      difficulty: "Easy",
      problem:
        "Select an h1 element and change its text to 'Welcome to CodeBhavya'.",
      hint:
        "Use querySelector() and textContent.",
      expected:
        "The heading text changes."
    },

    {
      id: 2,
      title: "Button Counter",
      difficulty: "Easy",
      problem:
        "Create a button that increases a displayed counter whenever the button is clicked.",
      hint:
        "Use addEventListener() and textContent.",
      expected:
        "The counter increases on every click."
    },

    {
      id: 3,
      title: "Dark Mode Class",
      difficulty: "Easy",
      problem:
        "Create a button that toggles a 'dark' CSS class on the body.",
      hint:
        "Use classList.toggle().",
      expected:
        "Clicking the button switches the class."
    },

    {
      id: 4,
      title: "Dynamic List",
      difficulty: "Easy",
      problem:
        "Read text from an input and create a new li element containing that text.",
      hint:
        "Use createElement() and append().",
      expected:
        "A new list item appears."
    },

    {
      id: 5,
      title: "Delete Task",
      difficulty: "Medium",
      problem:
        "Create a task list where clicking a task removes it.",
      hint:
        "Use an event listener and remove().",
      expected:
        "The clicked task disappears."
    },

    {
      id: 6,
      title: "Form Validation",
      difficulty: "Medium",
      problem:
        "Create a registration form that prevents submission when the name or email field is empty.",
      hint:
        "Use submit, preventDefault() and trim().",
      expected:
        "Empty fields prevent successful processing."
    },

    {
      id: 7,
      title: "Live Character Counter",
      difficulty: "Medium",
      problem:
        "Display the number of characters typed into a textarea.",
      hint:
        "Use the input event and value.length.",
      expected:
        "The displayed count updates while typing."
    },

    {
      id: 8,
      title: "Dynamic Attribute",
      difficulty: "Medium",
      problem:
        "Create a button that disables and enables another button.",
      hint:
        "Use the disabled attribute/property.",
      expected:
        "The target button switches between enabled and disabled."
    },

    {
      id: 9,
      title: "Event Delegation List",
      difficulty: "Medium",
      problem:
        "Create a parent list listener that identifies which li element was clicked.",
      hint:
        "Use event.target and matches().",
      expected:
        "The clicked item's text is displayed."
    },

    {
      id: 10,
      title: "Save Theme",
      difficulty: "Medium",
      problem:
        "Save the selected theme in localStorage and restore it when the page loads.",
      hint:
        "Use setItem(), getItem() and classList.",
      expected:
        "The selected theme survives a page reload."
    },

    {
      id: 11,
      title: "Student Form",
      difficulty: "Hard",
      problem:
        "Build a student form that accepts name, branch and CGPA and dynamically displays submitted records in a table.",
      hint:
        "Combine form handling, validation, createElement() and DOM insertion.",
      expected:
        "Valid student records appear in the table."
    },

    {
      id: 12,
      title: "Persistent Task Manager",
      difficulty: "Hard",
      problem:
        "Build a task manager that adds tasks, removes tasks and stores the task list in localStorage.",
      hint:
        "Store an array using JSON.stringify() and restore it using JSON.parse().",
      expected:
        "Tasks remain after refreshing the page."
    },

    {
      id: 13,
      title: "Search Filter UI",
      difficulty: "Hard",
      problem:
        "Create a list of students and filter visible students as the user types a search term.",
      hint:
        "Use the input event and textContent/value comparisons.",
      expected:
        "Only matching students remain visible."
    },

    {
      id: 14,
      title: "Placement Registration Form",
      difficulty: "Hard",
      problem:
        "Build a placement registration form with name, branch, CGPA and skills. Validate required fields and display the submitted candidate in a dashboard.",
      hint:
        "Combine form events, validation, DOM creation and object data.",
      expected:
        "Valid candidate data appears in the dashboard."
    },

    {
      id: 15,
      title: "Mini Browser Application",
      difficulty: "Hard",
      problem:
        "Build a complete browser-based application that combines DOM manipulation, events, validation, dynamic elements and localStorage.",
      hint:
        "Choose a practical application such as a task manager, expense tracker or student dashboard.",
      expected:
        "A functional interactive browser application."
    }

  ],

  /* =======================================================
     QUIZ
     ======================================================= */

  quiz: [

    {
      question: "What does DOM stand for?",
      options: [
        "Data Object Model",
        "Document Object Model",
        "Document Oriented Method",
        "Dynamic Object Management"
      ],
      answer: 1,
      explanation:
        "DOM stands for Document Object Model."
    },

    {
      question: "Which method selects the first matching CSS selector?",
      options: [
        "querySelector()",
        "queryAll()",
        "select()",
        "findElement()"
      ],
      answer: 0,
      explanation:
        "querySelector() returns the first matching element."
    },

    {
      question: "Which property changes plain text content?",
      options: [
        "htmlText",
        "textContent",
        "textHTML",
        "contentHTML"
      ],
      answer: 1,
      explanation:
        "textContent reads or changes text content."
    },

    {
      question: "Which property interprets HTML markup?",
      options: [
        "textContent",
        "innerHTML",
        "innerTextOnly",
        "htmlContent"
      ],
      answer: 1,
      explanation:
        "innerHTML works with HTML markup."
    },

    {
      question: "Which method creates a DOM element?",
      options: [
        "document.make()",
        "document.newElement()",
        "document.createElement()",
        "document.addElement()"
      ],
      answer: 2,
      explanation:
        "createElement() creates a new DOM element."
    },

    {
      question: "Which method removes an element?",
      options: [
        "delete()",
        "remove()",
        "destroy()",
        "erase()"
      ],
      answer: 1,
      explanation:
        "element.remove() removes the element from the DOM."
    },

    {
      question: "Which method registers an event listener?",
      options: [
        "listen()",
        "onEvent()",
        "addEventListener()",
        "registerEvent()"
      ],
      answer: 2,
      explanation:
        "addEventListener() registers event handlers."
    },

    {
      question: "Which event is commonly used for form submission?",
      options: [
        "click",
        "submit",
        "input",
        "load"
      ],
      answer: 1,
      explanation:
        "The submit event is designed for form submission."
    },

    {
      question: "What does preventDefault() do?",
      options: [
        "Deletes the event",
        "Stops the browser's default action",
        "Stops JavaScript",
        "Removes the element"
      ],
      answer: 1,
      explanation:
        "preventDefault() prevents the default browser behavior for an event."
    },

    {
      question: "What is event bubbling?",
      options: [
        "Creating duplicate events",
        "Event propagation toward ancestor elements",
        "Stopping all events",
        "Creating browser popups"
      ],
      answer: 1,
      explanation:
        "Bubbling moves an event from its target toward ancestors."
    },

    {
      question: "What is event delegation?",
      options: [
        "Deleting events",
        "Using a parent listener to handle child events",
        "Creating events manually",
        "Disabling events"
      ],
      answer: 1,
      explanation:
        "Event delegation uses a parent listener and event bubbling."
    },

    {
      question: "What does localStorage store?",
      options: [
        "Only numbers",
        "Only objects",
        "String values",
        "Only arrays"
      ],
      answer: 2,
      explanation:
        "Web Storage APIs store string values."
    },

    {
      question: "Which method converts an object into a JSON string?",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "JSON.convert()",
        "JSON.object()"
      ],
      answer: 1,
      explanation:
        "JSON.stringify() serializes a JavaScript value into JSON text."
    },

    {
      question: "Which method converts JSON text into a JavaScript value?",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "JSON.read()",
        "JSON.object()"
      ],
      answer: 0,
      explanation:
        "JSON.parse() parses JSON text."
    },

    {
      question: "Which event is useful for detecting live input changes?",
      options: [
        "submit",
        "input",
        "load",
        "close"
      ],
      answer: 1,
      explanation:
        "The input event fires when an input value changes."
    },

    {
      question: "What does DOMContentLoaded indicate?",
      options: [
        "CSS has finished loading",
        "The initial HTML has been parsed",
        "The server has stopped",
        "The browser has closed"
      ],
      answer: 1,
      explanation:
        "DOMContentLoaded fires after the initial HTML document has been parsed."
    }

  ],

  /* =======================================================
     GLOSSARY
     ======================================================= */

  glossary: [

    {
      term: "DOM",
      definition:
        "The browser's object representation of an HTML document."
    },

    {
      term: "Node",
      definition:
        "An individual object in the DOM tree."
    },

    {
      term: "Element",
      definition:
        "A DOM node representing an HTML element."
    },

    {
      term: "Selector",
      definition:
        "A pattern used to identify HTML elements."
    },

    {
      term: "Event",
      definition:
        "An occurrence such as a click, input change or form submission."
    },

    {
      term: "Event Listener",
      definition:
        "A function registered to respond when an event occurs."
    },

    {
      term: "Event Object",
      definition:
        "An object containing information about an event."
    },

    {
      term: "Event Bubbling",
      definition:
        "Propagation of an event from its target toward ancestor elements."
    },

    {
      term: "Event Delegation",
      definition:
        "Handling child events using a listener attached to a parent."
    },

    {
      term: "Attribute",
      definition:
        "Additional information associated with an HTML element."
    },

    {
      term: "textContent",
      definition:
        "A property used to read or change the text content of an element."
    },

    {
      term: "innerHTML",
      definition:
        "A property used to read or modify HTML markup inside an element."
    },

    {
      term: "localStorage",
      definition:
        "Browser storage intended for persistent client-side data."
    },

    {
      term: "sessionStorage",
      definition:
        "Browser storage associated with the current tab/session."
    },

    {
      term: "Serialization",
      definition:
        "Converting data into a format that can be stored or transmitted."
    },

    {
      term: "JSON.stringify()",
      definition:
        "Converts a JavaScript value into JSON text."
    },

    {
      term: "JSON.parse()",
      definition:
        "Converts JSON text into a JavaScript value."
    },

    {
      term: "DOMContentLoaded",
      definition:
        "An event fired after the initial HTML document has been parsed."
    }

  ],

  /* =======================================================
     COMPLETION
     ======================================================= */

  completion: {

    title: "Level 11 Complete",

    message:
      "You can now connect JavaScript with the browser, manipulate the DOM, respond to user events, handle forms, create dynamic interfaces and use browser storage.",

    takeaway: [
      "The DOM connects JavaScript with HTML.",
      "querySelector() and related APIs select elements.",
      "textContent and innerHTML modify page content.",
      "classList helps manage dynamic UI states.",
      "createElement() enables dynamic interfaces.",
      "addEventListener() connects user actions to JavaScript.",
      "Forms require proper validation and event handling.",
      "preventDefault() controls default browser behavior.",
      "Event delegation is useful for dynamic collections.",
      "localStorage and sessionStorage provide client-side storage.",
      "The DOM is the foundation behind interactive web interfaces."
    ],

    nextLevel:
      "Level 12 — Modern JavaScript: Scope, Closures & Modules"
  }

};
