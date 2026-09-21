/* =========================================================
   CODEBHAVYA FULL STACK / MERN
   LEVEL 17 — ROUTING, CONTEXT & DATA

   Topics:
   - React Router
   - Routes
   - Links
   - Nested routes
   - URL parameters
   - Search parameters
   - Programmatic navigation
   - Not-found routes
   - Route protection
   - React Context
   - Provider pattern
   - useContext()
   - Prop drilling
   - UI state vs server data
   - Loading / success / empty / error states
   - Route-to-data application flow

   This file is loaded BEFORE lesson.js
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[17] = {

    id: 17,

    title: "Routing, Context & Data",

    shortTitle: "Routing, Context & Data",

    kicker: "LEVEL 17 · REACT APPLICATIONS",

    summary:
        "Build multi-page React experiences with client-side routing, URL parameters, shared application state, Context, and reliable data-loading states.",

    hero: {
        title: "Routing, Context & Data",
        subtitle:
            "Move from isolated React screens to connected applications.",
        description:
            "Learn how React applications manage URLs, navigation, shared state, and asynchronous data while keeping interfaces predictable and user-friendly."
    },

    objectives: [
        "Understand the mental model of client-side routing.",
        "Create routes and navigation with React Router.",
        "Work with nested routes and dynamic URL parameters.",
        "Read and update search parameters.",
        "Navigate programmatically.",
        "Handle unknown routes safely.",
        "Understand route protection at an application level.",
        "Understand React Context and Provider architecture.",
        "Use useContext() to consume shared state.",
        "Recognize and reduce prop drilling.",
        "Separate UI state from server data.",
        "Design loading, success, empty and error states.",
        "Connect a route to a data-loading workflow."
    ],

    outcomes: [
        "You can design a multi-route React application.",
        "You can pass information through URLs.",
        "You can share application state without unnecessary prop chains.",
        "You can model asynchronous data states correctly.",
        "You can reason about how routing, shared state and data work together."
    ],

    concepts: [

        {
            title: "1. Why Client-Side Routing Matters",
            explanation:
                "A traditional website often requests a new document whenever the URL changes. A React single-page application can change the visible screen without rebuilding the entire application. Client-side routing maps URLs to React components.",
            points: [
                "The URL represents application location.",
                "A route decides which UI should be displayed.",
                "Navigation can happen without a complete document reload.",
                "Routing makes large React applications easier to organize."
            ],
            example:
`/products
/products/101
/products/101/reviews
/profile
/settings`,
            takeaway:
                "Routing connects application URLs with application screens."
        },

        {
            title: "2. React Router Mental Model",
            explanation:
                "React Router provides the routing layer used by many React applications. The router watches the browser location and renders the route that matches the current URL.",
            points: [
                "Router = routing environment.",
                "Route = URL-to-component rule.",
                "Link = navigation without manually editing location.",
                "Hooks provide access to route information."
            ],
            example:
`URL
 ↓
Router
 ↓
Matching Route
 ↓
React Component
 ↓
Rendered Screen`,
            takeaway:
                "Think of routing as a mapping between location and UI."
        },

        {
            title: "3. BrowserRouter",
            explanation:
                "BrowserRouter provides routing support using the browser's History API. It allows a React application to respond to URL changes while remaining a single-page application.",
            points: [
                "Usually placed near the application root.",
                "Provides routing context to child components.",
                "Uses normal browser-style URLs.",
                "Components below it can use router hooks."
            ],
            example:
`<BrowserRouter>
    <App />
</BrowserRouter>`,
            takeaway:
                "The router establishes the environment in which route-aware components operate."
        },

        {
            title: "4. Routes and Route",
            explanation:
                "Routes define the collection of available route rules. Each Route connects a path with an element or component.",
            points: [
                "Routes groups route definitions.",
                "path identifies the URL pattern.",
                "element identifies what should render.",
                "More specific route structures can be created with nesting."
            ],
            example:
`<Routes>

    <Route
        path="/"
        element={<Home />}
    />

    <Route
        path="/about"
        element={<About />}
    />

</Routes>`,
            takeaway:
                "A Route is essentially a URL-to-UI rule."
        },

        {
            title: "5. Link and NavLink",
            explanation:
                "React applications should normally use Link or NavLink for internal navigation instead of manually changing window.location.",
            points: [
                "Link performs client-side navigation.",
                "NavLink can identify the active route.",
                "Navigation remains inside the SPA.",
                "Active navigation can be styled."
            ],
            example:
`<Link to="/courses">
    Courses
</Link>

<NavLink to="/profile">
    Profile
</NavLink>`,
            takeaway:
                "Use router-aware navigation components for internal application links."
        },

        {
            title: "6. Nested Routes",
            explanation:
                "Large applications often have sections containing multiple child screens. Nested routes allow a parent route to provide shared layout while child routes control the changing content.",
            points: [
                "Parent route provides shared structure.",
                "Child routes represent subsection screens.",
                "Outlet renders the matched child route.",
                "Nested routes make dashboard-style applications easier to organize."
            ],
            example:
`/dashboard
/dashboard/profile
/dashboard/settings
/dashboard/courses

Dashboard
 ├── Profile
 ├── Settings
 └── Courses`,
            takeaway:
                "Nested routes model hierarchical application structure."
        },

        {
            title: "7. URL Parameters",
            explanation:
                "Dynamic URL parameters allow the URL itself to identify a resource. For example, /students/42 can represent student 42.",
            points: [
                "Parameters are dynamic parts of a route.",
                "They are useful for resource pages.",
                "The same component can handle many IDs.",
                "The parameter is read using router hooks."
            ],
            example:
`/students/:studentId

/students/101
/students/102
/students/103`,
            takeaway:
                "Dynamic parameters allow one route definition to represent many resources."
        },

        {
            title: "8. useParams()",
            explanation:
                "useParams() reads dynamic values captured by the current route.",
            points: [
                "It returns route parameter values.",
                "Parameter names must match the route definition.",
                "Values normally arrive as strings.",
                "The value can then be used to load or select data."
            ],
            example:
`const { studentId } = useParams();

console.log(studentId);`,
            takeaway:
                "useParams connects the current URL with component logic."
        },

        {
            title: "9. Search Parameters",
            explanation:
                "Search parameters carry optional filtering, sorting, pagination or search information after the question mark in a URL.",
            points: [
                "They are useful for filters.",
                "They are useful for search boxes.",
                "They are useful for pagination.",
                "They make application state shareable through URLs."
            ],
            example:
`/courses?category=react
/courses?category=react&page=2
/products?search=laptop`,
            takeaway:
                "Search parameters are ideal for optional URL-driven state."
        },

        {
            title: "10. useSearchParams()",
            explanation:
                "useSearchParams() allows React components to read and update URL search parameters.",
            points: [
                "Read values from the current URL.",
                "Update filters through the URL.",
                "Browser navigation can preserve search state.",
                "Useful for searchable and filterable screens."
            ],
            example:
`const [params, setParams] =
    useSearchParams();

const category =
    params.get("category");

setParams({
    category: "react"
});`,
            takeaway:
                "Search parameters connect URL state with application state."
        },

        {
            title: "11. Programmatic Navigation",
            explanation:
                "Sometimes navigation must happen after an action such as submitting a form, saving data or completing authentication. useNavigate() allows code to change the current route.",
            points: [
                "Useful after successful actions.",
                "Useful for redirects.",
                "Useful for multi-step workflows.",
                "Navigation can move forward or backward."
            ],
            example:
`const navigate = useNavigate();

function handleSave() {
    // save data
    navigate("/dashboard");
}`,
            takeaway:
                "Use programmatic navigation when navigation is the result of application logic."
        },

        {
            title: "12. Not-Found Routes",
            explanation:
                "Users can manually enter invalid URLs or follow outdated links. A good application provides a controlled not-found screen instead of leaving the interface broken.",
            points: [
                "Use a wildcard route for unknown paths.",
                "Provide a clear message.",
                "Give users a route back to a useful screen.",
                "Not-found handling is part of application quality."
            ],
            example:
`<Route
    path="*"
    element={<NotFound />}
/>`,
            takeaway:
                "Every production application should have a deliberate unknown-route experience."
        },

        {
            title: "13. Route Protection",
            explanation:
                "Some screens should only be accessible when the application has the required authentication or authorization state. Route protection is an application-level pattern that checks access before rendering protected content.",
            points: [
                "Public routes can be accessed by everyone.",
                "Protected routes require authentication.",
                "Authorization may depend on roles or permissions.",
                "The server must still enforce real security."
            ],
            example:
`ProtectedRoute
      ↓
Is user authenticated?
   ↙          ↘
 Yes           No
 ↓              ↓
Page         Login`,
            takeaway:
                "Client-side route protection improves UX, but it does not replace server-side authorization."
        },

        {
            title: "14. React Context Mental Model",
            explanation:
                "Context provides a way to make shared values available to components without manually passing those values through every intermediate component.",
            points: [
                "Context is useful for application-wide or section-wide values.",
                "Provider supplies the value.",
                "Consumer reads the value.",
                "Common examples include theme, authentication and locale."
            ],
            example:
`Provider
   ↓
Page
   ↓
Toolbar
   ↓
Button

Button reads shared context
without receiving every value
through props.`,
            takeaway:
                "Context can reduce unnecessary prop passing across component boundaries."
        },

        {
            title: "15. createContext() and Provider",
            explanation:
                "createContext() creates a context object. The Provider makes a value available to components underneath it in the component tree.",
            points: [
                "Create a context.",
                "Wrap the required component tree with its Provider.",
                "Provide the shared value.",
                "Consumers can then read that value."
            ],
            example:
`const ThemeContext =
    createContext(null);

<ThemeContext.Provider
    value={theme}
>
    <App />
</ThemeContext.Provider>`,
            takeaway:
                "The Provider defines where shared context data becomes available."
        },

        {
            title: "16. useContext()",
            explanation:
                "useContext() reads the nearest matching Context value available above the component in the tree.",
            points: [
                "No manual prop chain is required.",
                "The component becomes dependent on that context.",
                "Context values should represent genuinely shared concerns.",
                "Avoid putting every piece of state into Context."
            ],
            example:
`const theme =
    useContext(ThemeContext);

return (
    <button className={theme}>
        Save
    </button>
);`,
            takeaway:
                "useContext gives a component direct access to shared context data."
        },

        {
            title: "17. Avoiding Prop Drilling",
            explanation:
                "Prop drilling happens when data is passed through components that do not actually need the data simply so a deeply nested component can receive it.",
            points: [
                "Props remain useful for explicit component relationships.",
                "Context can help with genuinely shared values.",
                "Do not replace every prop with Context.",
                "Component composition can also reduce drilling."
            ],
            example:
`App
 ↓ theme
Layout
 ↓ theme
Panel
 ↓ theme
Button

Context can make shared
theme access simpler.`,
            takeaway:
                "Use Context selectively; explicit props are often clearer for local relationships."
        },

        {
            title: "18. UI State vs Server Data",
            explanation:
                "Not all state has the same meaning. UI state belongs to the interface, while server data represents information retrieved from a backend or external API.",
            points: [
                "UI state: modal open/closed.",
                "UI state: selected tab.",
                "Server data: students returned by an API.",
                "Server data: products stored in a database.",
                "Treating these categories separately improves architecture."
            ],
            example:
`UI STATE
modalOpen
selectedTab
searchText

SERVER DATA
users
courses
orders
products`,
            takeaway:
                "Knowing where data comes from helps determine how it should be managed."
        },

        {
            title: "19. Loading, Success, Empty and Error States",
            explanation:
                "A data-driven screen has more than one possible state. Good interfaces explicitly model loading, successful data, empty results and failures.",
            points: [
                "Loading: request is still running.",
                "Success: usable data arrived.",
                "Empty: request succeeded but there is no data.",
                "Error: request failed.",
                "Each state should communicate what the user can do next."
            ],
            example:
`Request
  ↓
┌──────────────┐
│   Loading    │
└──────┬───────┘
       ↓
 ┌─────┴─────┐
 ↓           ↓
Success     Error
 ↓
Data
 ↓
Empty?`,
            takeaway:
                "Reliable applications design for every meaningful data state."
        },

        {
            title: "20. Route-to-Data Application Flow",
            explanation:
                "A real React application often combines routing, parameters, shared state and asynchronous data. The URL identifies the resource, the component reads the route information, the application requests data, and the UI represents the current request state.",
            points: [
                "Route identifies the screen.",
                "Parameter identifies the resource.",
                "Component starts the data workflow.",
                "Loading state appears immediately.",
                "Success displays the resource.",
                "Empty and error states handle other outcomes.",
                "Context can provide shared application information."
            ],
            example:
`/courses/react/101
        ↓
Route Match
        ↓
useParams()
        ↓
courseId = 101
        ↓
Request Data
        ↓
Loading
        ↓
┌───────┼────────┐
↓       ↓        ↓
Data   Empty    Error
↓
Course Screen`,
            takeaway:
                "This route-to-data flow is one of the foundations of production React applications."
        }
    ],

    visualizer: {

        title: "Premium Routing & Data Flow Visualizer",

        description:
            "Follow how a URL becomes a React screen, how route information is read, and how the application moves through its data states.",

        steps: [

            {
                title: "Browser URL",
                code: "/courses/react/101",
                explanation:
                    "The browser currently points to a course-specific URL."
            },

            {
                title: "Route Matching",
                code: '<Route path="/courses/:category/:courseId" ... />',
                explanation:
                    "React Router compares the current location with the route definitions."
            },

            {
                title: "Extract Parameters",
                code:
`const { category, courseId } = useParams();

category = "react"
courseId = "101"`,
                explanation:
                    "The dynamic parts of the URL become route parameters."
            },

            {
                title: "Start Data Request",
                code:
`loadCourse(courseId);

status = "loading";`,
                explanation:
                    "The component begins retrieving the required course data."
            },

            {
                title: "Loading State",
                code:
`if (status === "loading") {
    return <Loading />;
}`,
                explanation:
                    "The user sees immediate feedback while the request is running."
            },

            {
                title: "Request Succeeds",
                code:
`course = {
    id: 101,
    title: "React Basics"
};

status = "success";`,
                explanation:
                    "The application receives usable data."
            },

            {
                title: "Render Resource",
                code:
`<CourseDetails
    course={course}
/>`,
                explanation:
                    "The screen renders the resource identified by the URL."
            },

            {
                title: "Shared Context",
                code:
`const user =
    useContext(AuthContext);`,
                explanation:
                    "Shared application information can be consumed without passing it through every component."
            },

            {
                title: "Complete Application Flow",
                code:
`URL
 ↓
Route
 ↓
Params
 ↓
Data
 ↓
UI State
 ↓
Screen`,
                explanation:
                    "Routing, data and shared state now work together as one application flow."
            }
        ]
    },

    trace: {

        title: "Program Trace — Route to Data",

        description:
            "Trace a simplified React application as it reads a route parameter and loads course information.",

        variables: [
            "path",
            "courseId",
            "status",
            "course"
        ],

        steps: [

            {
                line: 1,
                code: 'path = "/courses/101"',
                operation: "Read current URL",
                state: {
                    path: "/courses/101",
                    courseId: null,
                    status: "idle",
                    course: null
                }
            },

            {
                line: 2,
                code: 'courseId = "101"',
                operation: "Extract route parameter",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "idle",
                    course: null
                }
            },

            {
                line: 3,
                code: 'status = "loading"',
                operation: "Start request",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "loading",
                    course: null
                }
            },

            {
                line: 4,
                code: 'course = await getCourse(courseId)',
                operation: "Request course data",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "loading",
                    course: null
                }
            },

            {
                line: 5,
                code: 'course = { id: 101, title: "React Basics" }',
                operation: "Receive data",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "loading",
                    course: {
                        id: 101,
                        title: "React Basics"
                    }
                }
            },

            {
                line: 6,
                code: 'status = "success"',
                operation: "Complete request",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "success",
                    course: {
                        id: 101,
                        title: "React Basics"
                    }
                }
            },

            {
                line: 7,
                code: '<CourseDetails course={course} />',
                operation: "Render course screen",
                state: {
                    path: "/courses/101",
                    courseId: "101",
                    status: "success",
                    course: {
                        id: 101,
                        title: "React Basics"
                    }
                }
            }
        ]
    },

    revision: [

        {
            question: "What is client-side routing?",
            answer:
                "Client-side routing changes the displayed application screen according to the URL without requiring a complete document reload."
        },

        {
            question: "What does a Route define?",
            answer:
                "A Route defines a relationship between a URL pattern and the UI that should be rendered."
        },

        {
            question: "Why use Link instead of a normal internal anchor?",
            answer:
                "Link enables router-aware client-side navigation without unnecessarily reloading the entire application."
        },

        {
            question: "What are nested routes?",
            answer:
                "Nested routes represent child screens inside a parent route and are useful for layouts such as dashboards."
        },

        {
            question: "What is a URL parameter?",
            answer:
                "A URL parameter is a dynamic section of a route, such as the 101 in /courses/101."
        },

        {
            question: "What does useParams() do?",
            answer:
                "It reads dynamic parameters from the currently matched route."
        },

        {
            question: "What are search parameters useful for?",
            answer:
                "They are useful for optional URL-driven information such as search terms, filters and pagination."
        },

        {
            question: "What does useNavigate() do?",
            answer:
                "It allows application code to navigate to another route programmatically."
        },

        {
            question: "What is React Context?",
            answer:
                "Context allows shared values to be made available to components without manually passing them through every intermediate component."
        },

        {
            question: "What is prop drilling?",
            answer:
                "Prop drilling is passing data through components that do not need the data simply so a deeper component can receive it."
        },

        {
            question: "What does useContext() do?",
            answer:
                "It reads the nearest available value from a matching React Context."
        },

        {
            question: "What is UI state?",
            answer:
                "UI state represents interface conditions such as whether a modal is open or which tab is selected."
        },

        {
            question: "What is server data?",
            answer:
                "Server data is information retrieved from a backend, database or external service."
        },

        {
            question: "Why are loading states important?",
            answer:
                "They communicate that an asynchronous operation is still running and prevent the interface from appearing broken."
        },

        {
            question: "What is an empty state?",
            answer:
                "An empty state occurs when a request succeeds but there is no data to display."
        }
    ],

    interview: [

        {
            question:
                "What problem does React Router solve?",
            answer:
                "It maps application URLs to React UI and provides navigation, route parameters, nested routes and other routing capabilities."
        },

        {
            question:
                "What is the difference between Link and useNavigate()?",
            answer:
                "Link is primarily a declarative navigation component, while useNavigate() provides a function for navigation triggered by application logic."
        },

        {
            question:
                "Why are URL parameters useful in React applications?",
            answer:
                "They allow the URL to identify a specific resource while allowing one component and route definition to handle many resource IDs."
        },

        {
            question:
                "What is the difference between route parameters and search parameters?",
            answer:
                "Route parameters are part of the route structure, such as /users/:id, while search parameters are optional key-value data after the question mark."
        },

        {
            question:
                "How do nested routes work?",
            answer:
                "A parent route provides shared structure and child routes render their matching content within that parent, commonly through Outlet."
        },

        {
            question:
                "What is route protection?",
            answer:
                "It is a UI routing pattern that checks whether the current user has the required application state before showing a protected screen."
        },

        {
            question:
                "Why is client-side route protection not enough for security?",
            answer:
                "A browser can be manipulated by the user. Real authorization must also be enforced by the backend."
        },

        {
            question:
                "What problem does Context solve?",
            answer:
                "Context reduces the need to pass widely shared values through many intermediate components."
        },

        {
            question:
                "When should Context not be used?",
            answer:
                "It should not automatically replace normal props. Local component relationships are often clearer with explicit props."
        },

        {
            question:
                "What is the difference between UI state and server data?",
            answer:
                "UI state describes interface behavior, while server data represents information obtained from a backend or external service."
        },

        {
            question:
                "Why should loading, empty and error states be designed separately?",
            answer:
                "Each state represents a different user experience and often requires different messaging and actions."
        },

        {
            question:
                "What is the role of a Provider in Context?",
            answer:
                "The Provider makes a context value available to components below it in the component tree."
        }
    ],

    practice: [

        {
            title: "Practice 01 — Course Routes",
            difficulty: "Easy",
            task:
                "Design routes for Home, Courses, About and Contact pages.",
            expected:
                "The application should have four clearly defined routes."
        },

        {
            title: "Practice 02 — Student Profile Route",
            difficulty: "Easy",
            task:
                "Create a route /students/:studentId and explain how the component would read studentId.",
            expected:
                "Use a dynamic route parameter and useParams()."
        },

        {
            title: "Practice 03 — Search Filter",
            difficulty: "Easy",
            task:
                "Design a courses page that stores the selected category in the URL.",
            expected:
                "Use a search parameter such as ?category=react."
        },

        {
            title: "Practice 04 — Programmatic Redirect",
            difficulty: "Easy",
            task:
                "After a successful login, navigate the user to /dashboard.",
            expected:
                "Use programmatic navigation after the successful action."
        },

        {
            title: "Practice 05 — Nested Dashboard",
            difficulty: "Medium",
            task:
                "Design a dashboard with Overview, Profile and Settings child routes.",
            expected:
                "Use a parent dashboard route with nested child routes."
        },

        {
            title: "Practice 06 — Not Found",
            difficulty: "Easy",
            task:
                "Create a route strategy for URLs that do not match any known screen.",
            expected:
                "Use a wildcard route and display a useful Not Found screen."
        },

        {
            title: "Practice 07 — Theme Context",
            difficulty: "Medium",
            task:
                "Create a ThemeContext that allows a deeply nested button to read the current theme.",
            expected:
                "Use createContext(), a Provider and useContext()."
        },

        {
            title: "Practice 08 — Remove Prop Drilling",
            difficulty: "Medium",
            task:
                "A user object is passed through four components only so the final ProfileButton can access it. Redesign the flow.",
            expected:
                "Consider Context if the user information is genuinely shared application state."
        },

        {
            title: "Practice 09 — Loading State",
            difficulty: "Easy",
            task:
                "Design a UI state model for a course API request.",
            expected:
                "Represent at least loading, success and error."
        },

        {
            title: "Practice 10 — Empty State",
            difficulty: "Easy",
            task:
                "A course search succeeds but returns zero results. Design the UI response.",
            expected:
                "Display a clear empty state instead of treating it as a network error."
        },

        {
            title: "Practice 11 — Route-to-Data",
            difficulty: "Medium",
            task:
                "Design the flow for /products/:productId from URL to API request to product screen.",
            expected:
                "URL → parameter → request → loading → success/error/empty → UI."
        },

        {
            title: "Practice 12 — Protected Dashboard",
            difficulty: "Medium",
            task:
                "Design a protected dashboard that checks authentication before rendering.",
            expected:
                "Authenticated users see the dashboard; unauthenticated users are redirected."
        },

        {
            title: "Practice 13 — Filter + Pagination",
            difficulty: "Medium",
            task:
                "Design a product URL containing category and page information.",
            expected:
                "Use search parameters such as ?category=books&page=2."
        },

        {
            title: "Practice 14 — Application State Audit",
            difficulty: "Hard",
            task:
                "Classify modalOpen, selectedCourse, loggedInUser and coursesFromAPI as UI state, shared application state or server data.",
            expected:
                "Explain why each value belongs to its selected category."
        },

        {
            title: "Practice 15 — Complete React Flow",
            difficulty: "Hard",
            task:
                "Design a course-details screen using a dynamic route, Context-based authentication and API data.",
            expected:
                "Combine routing, route parameters, shared state and complete data states."
        }
    ],

    quiz: [

        {
            question: "Which component defines a URL-to-UI rule?",
            options: [
                "Route",
                "Context",
                "Provider",
                "Fragment"
            ],
            answer: 0,
            explanation:
                "Route connects a path pattern with the UI that should render."
        },

        {
            question: "Which component is commonly used for internal navigation?",
            options: [
                "Link",
                "Provider",
                "Outlet",
                "Context"
            ],
            answer: 0,
            explanation:
                "Link performs router-aware client-side navigation."
        },

        {
            question: "Which hook reads dynamic route parameters?",
            options: [
                "useParams",
                "useState",
                "useMemo",
                "useRef"
            ],
            answer: 0,
            explanation:
                "useParams reads parameters captured by the current route."
        },

        {
            question: "Which URL contains a route parameter?",
            options: [
                "/courses/:id",
                "/courses?category=react",
                "/courses#top",
                "/courses"
            ],
            answer: 0,
            explanation:
                ":id represents a dynamic route parameter."
        },

        {
            question: "Which URL contains a search parameter?",
            options: [
                "/courses/react",
                "/courses/:id",
                "/courses?category=react",
                "/courses/profile/settings"
            ],
            answer: 2,
            explanation:
                "Search parameters appear after the question mark."
        },

        {
            question: "Which hook provides programmatic navigation?",
            options: [
                "useNavigate",
                "useParams",
                "useContext",
                "useReducer"
            ],
            answer: 0,
            explanation:
                "useNavigate returns a navigation function."
        },

        {
            question: "What is the purpose of a wildcard route?",
            options: [
                "Handle unknown URLs",
                "Create Context",
                "Fetch data",
                "Create forms"
            ],
            answer: 0,
            explanation:
                "A wildcard route can handle URLs that do not match known routes."
        },

        {
            question: "What does Context help reduce?",
            options: [
                "Prop drilling",
                "HTML",
                "CSS",
                "HTTP"
            ],
            answer: 0,
            explanation:
                "Context can reduce repeated prop passing through intermediate components."
        },

        {
            question: "Which function creates a React Context?",
            options: [
                "createContext",
                "createRoute",
                "createProvider",
                "createState"
            ],
            answer: 0,
            explanation:
                "React provides createContext() for creating a context."
        },

        {
            question: "Which hook reads Context?",
            options: [
                "useContext",
                "useParams",
                "useNavigate",
                "useEffect"
            ],
            answer: 0,
            explanation:
                "useContext reads the nearest matching context value."
        },

        {
            question: "Which is an example of UI state?",
            options: [
                "Modal open/closed",
                "Products from database",
                "Orders from API",
                "Users returned by server"
            ],
            answer: 0,
            explanation:
                "Modal visibility is local interface state."
        },

        {
            question: "What does an empty state mean?",
            options: [
                "The request succeeded but no data exists",
                "The browser crashed",
                "The route is always invalid",
                "The server is necessarily offline"
            ],
            answer: 0,
            explanation:
                "An empty result is different from a failed request."
        },

        {
            question: "What should real authorization be enforced by?",
            options: [
                "Only the browser",
                "Only CSS",
                "The backend/server",
                "Only Context"
            ],
            answer: 2,
            explanation:
                "The backend must enforce actual authorization because client code can be manipulated."
        },

        {
            question: "Which state normally appears while asynchronous data is being retrieved?",
            options: [
                "Loading",
                "Completed",
                "Deleted",
                "Hidden"
            ],
            answer: 0,
            explanation:
                "Loading communicates that the request is still running."
        },

        {
            question: "Which state means the request completed successfully but there is nothing to display?",
            options: [
                "Loading",
                "Empty",
                "Error",
                "Redirect"
            ],
            answer: 1,
            explanation:
                "Empty means the operation succeeded but returned no usable records."
        },

        {
            question: "What does a Context Provider do?",
            options: [
                "Makes a context value available below it",
                "Creates a URL",
                "Fetches every API",
                "Replaces React Router"
            ],
            answer: 0,
            explanation:
                "Provider supplies the context value to descendants."
        }
    ],

    glossary: [

        {
            term: "Client-Side Routing",
            definition:
                "Changing the visible application screen according to the URL without requiring a complete document reload."
        },

        {
            term: "Route",
            definition:
                "A rule connecting a URL pattern with a React UI."
        },

        {
            term: "Nested Route",
            definition:
                "A child route rendered within a parent route structure."
        },

        {
            term: "Route Parameter",
            definition:
                "A dynamic portion of a URL such as :id."
        },

        {
            term: "Search Parameter",
            definition:
                "Optional key-value information appearing after ? in a URL."
        },

        {
            term: "Programmatic Navigation",
            definition:
                "Changing routes through application logic instead of a clicked navigation link."
        },

        {
            term: "Context",
            definition:
                "A React mechanism for making shared values available to descendant components."
        },

        {
            term: "Provider",
            definition:
                "The component that supplies a Context value to descendants."
        },

        {
            term: "Prop Drilling",
            definition:
                "Passing data through intermediate components that do not directly need the data."
        },

        {
            term: "Server Data",
            definition:
                "Data retrieved from a backend, database or external API."
        },

        {
            term: "Loading State",
            definition:
                "The UI state while asynchronous data is being retrieved."
        },

        {
            term: "Empty State",
            definition:
                "The state where a request succeeds but produces no data."
        },

        {
            term: "Error State",
            definition:
                "The state representing a failed operation or unavailable data."
        }
    ],

    completion: {

        title: "Level 17 Complete",

        message:
            "You can now reason about React applications as connected systems: URLs identify screens, routes organize navigation, Context provides shared values, and data states make asynchronous interfaces reliable.",

        skills: [
            "React Router",
            "Nested routes",
            "Dynamic route parameters",
            "Search parameters",
            "Programmatic navigation",
            "Not-found handling",
            "Route protection",
            "React Context",
            "Provider pattern",
            "useContext()",
            "Prop-drilling decisions",
            "UI state vs server data",
            "Loading / success / empty / error states",
            "Route-to-data architecture"
        ],

        nextLevel:
            "Level 18 — React Performance & Testing"
    }
};

console.log(
    "CodeBhavya Full Stack — Level 17 loaded: Routing, Context & Data"
);
