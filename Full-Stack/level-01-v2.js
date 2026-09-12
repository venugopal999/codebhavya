"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[1] = {
    n: 1,

    kicker: "WEB FOUNDATIONS",

    title: "Internet & How the Web Works",

    summary:
        "Start Full Stack MERN from the beginning. Understand what happens behind the scenes when you open a website, how browsers communicate with servers, how DNS finds a server, how HTTP transfers resources, and how HTML, CSS and JavaScript finally become the web page you see.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Beginner",

    concepts: 24,

    outcomes: [
        "Explain the difference between the Internet and the World Wide Web.",
        "Explain what a client, browser, server and web server do.",
        "Explain IP addresses, domain names and DNS in simple terms.",
        "Break a URL into its important components.",
        "Explain the basic purpose of ports and protocols.",
        "Describe the client-server request and response model.",
        "Explain HTTP requests, responses, methods, headers and status codes.",
        "Explain why HTTPS is used.",
        "Explain how HTML, CSS and JavaScript work together.",
        "Describe the basic browser page-loading and rendering process.",
        "Differentiate frontend, backend, database and API.",
        "Trace what happens when a user enters a URL.",
        "Identify common web-development components in a real application.",
        "Build a correct mental model before starting HTML, CSS and JavaScript."
    ],

    sections: [

        {
            title: "What are we actually learning?",
            intro:
                "Before writing a single line of HTML, CSS or JavaScript, you need to understand the environment in which web applications work.",

            explanation: [
                "When you open a website, it may look like a single page on your screen. Internally, however, many systems cooperate to produce that page.",
                "Your device runs a browser. The browser communicates with remote systems through the Internet. A domain name is resolved to an IP address. The browser sends requests to a server. The server sends responses containing resources such as HTML, CSS, JavaScript, images and other data.",
                "Understanding this complete chain will make later MERN topics much easier. When you eventually learn Express, REST APIs, React and MongoDB, you will already understand where each technology fits."
            ],

            keyIdea:
                "MERN development becomes much easier when you understand the complete journey of data before learning individual technologies."
        },

        {
            title: "Internet vs World Wide Web",
            intro:
                "These two terms are often used as if they mean the same thing, but they are not the same.",

            explanation: [
                "The Internet is the global network infrastructure that allows computers and devices to communicate with each other.",
                "The World Wide Web is one service that operates on top of that infrastructure. Websites and web applications use technologies such as URLs, HTTP, HTML, CSS and JavaScript to operate on the Web.",
                "Other services can also use the Internet. Email, online gaming, file transfer and many other systems are not simply the World Wide Web."
            ],

            comparison: [
                {
                    term: "Internet",
                    meaning: "The global network of interconnected systems."
                },
                {
                    term: "Web",
                    meaning: "A system of linked resources and applications accessed through web technologies."
                }
            ],

            example:
                "Think of the Internet as the road network and the Web as one major transportation service using those roads."
        },

        {
            title: "Client and Server",
            intro:
                "The client-server model is one of the most important ideas in web development.",

            explanation: [
                "A client is the system that requests a resource or service. In normal web browsing, the browser is the client.",
                "A server is a system that receives requests, processes them and sends responses.",
                "The client and server can be physically far apart. They communicate through networks using defined protocols."
            ],

            flow: [
                "User",
                "Browser",
                "Internet",
                "Server",
                "Response",
                "Browser"
            ],

            example:
                "When you open codebhavya.com, your browser acts as the client and the web infrastructure serving CodeBhavya provides the requested resources."
        },

        {
            title: "What is a Browser?",
            intro:
                "A browser is much more than an application that displays websites.",

            explanation: [
                "A browser understands web technologies and provides the environment in which web pages execute.",
                "It sends network requests, receives resources, parses HTML, builds the DOM, applies CSS, executes JavaScript and displays the resulting interface.",
                "Browsers also provide developer tools that allow developers to inspect HTML, CSS, JavaScript, network requests, storage and runtime problems."
            ],

            examples: [
                "Google Chrome",
                "Mozilla Firefox",
                "Microsoft Edge",
                "Safari"
            ],

            keyIdea:
                "The browser is both a network client and an execution environment for web applications."
        },

        {
            title: "What is a Server?",
            intro:
                "A server is a system that provides resources or services to clients.",

            explanation: [
                "A web server may receive an HTTP request and return an HTML page, an image, a JavaScript file or other resource.",
                "In modern applications, the server may also execute application logic, authenticate users, validate data, communicate with databases and return JSON responses.",
                "A production application may use several different servers or services rather than one physical machine."
            ],

            serverResponsibilities: [
                "Receive requests",
                "Process application logic",
                "Read or modify data",
                "Communicate with databases",
                "Authenticate users",
                "Return responses",
                "Serve static resources"
            ]
        },

        {
            title: "IP Addresses",
            intro:
                "Computers communicate using network addresses. One important type is the IP address.",

            explanation: [
                "An IP address identifies a network interface in an IP network.",
                "Humans generally prefer names such as codebhavya.com rather than remembering numerical network addresses.",
                "DNS provides the naming system that helps map domain names to IP addresses."
            ],

            examples: [
                "IPv4 example: 192.0.2.10",
                "IPv6 example: 2001:db8::10"
            ],

            warning:
                "An IP address identifies a network endpoint, but it should not be treated as a permanent identity for a website. Hosting architectures, load balancers and DNS configurations can change."
        },

        {
            title: "Domain Names",
            intro:
                "A domain name provides a human-friendly name for Internet resources.",

            explanation: [
                "Instead of asking users to remember an IP address, websites can use domain names.",
                "A domain can have different components, such as a subdomain and registered domain name.",
                "The browser uses DNS to discover the network information needed to communicate with the appropriate server."
            ],

            example:
                "https://www.codebhavya.com/JavaScript/",

            breakdown: [
                {
                    part: "https",
                    meaning: "Protocol scheme"
                },
                {
                    part: "www",
                    meaning: "Subdomain"
                },
                {
                    part: "codebhavya.com",
                    meaning: "Domain name"
                },
                {
                    part: "/JavaScript/",
                    meaning: "Path"
                }
            ]
        },

        {
            title: "DNS — The Internet's Naming System",
            intro:
                "DNS helps translate human-friendly domain names into network information.",

            explanation: [
                "Suppose you enter codebhavya.com into your browser. Your browser cannot send an HTTP request to a name alone; it needs network information such as an IP address.",
                "DNS allows the domain name to be resolved through the DNS system.",
                "The complete DNS process can involve browser caches, operating-system caches, recursive resolvers and authoritative DNS infrastructure."
            ],

            flow: [
                "Browser asks for domain information",
                "Local cache may be checked",
                "DNS resolver is consulted",
                "DNS hierarchy is followed when necessary",
                "IP information is returned",
                "Browser can continue toward the destination"
            ],

            commonMistake:
                "DNS is not the web page itself. DNS helps locate the network destination associated with a domain."
        },

        {
            title: "URLs — Understanding Web Addresses",
            intro:
                "A URL identifies a resource and provides information about how it should be accessed.",

            example:
                "https://www.example.com:443/products/phones?id=25#reviews",

            breakdown: [
                {
                    part: "https",
                    meaning: "Scheme / protocol"
                },
                {
                    part: "www.example.com",
                    meaning: "Host"
                },
                {
                    part: ":443",
                    meaning: "Port"
                },
                {
                    part: "/products/phones",
                    meaning: "Path"
                },
                {
                    part: "?id=25",
                    meaning: "Query string"
                },
                {
                    part: "#reviews",
                    meaning: "Fragment identifier"
                }
            ],

            practice:
                "Take three URLs from websites you use and identify their scheme, host, path, query parameters and fragment if present."
        },

        {
            title: "Ports",
            intro:
                "A computer can provide many network services. Ports help identify the destination service associated with network traffic.",

            explanation: [
                "An IP address helps identify a network endpoint, while a port identifies a service endpoint on that host.",
                "Common web-related ports include 80 for HTTP and 443 for HTTPS.",
                "Developers also frequently run local applications on ports such as 3000, 5000, 5173 or 8000."
            ],

            examples: [
                "http://localhost:3000",
                "http://localhost:5000",
                "https://example.com:443"
            ],

            keyIdea:
                "localhost identifies your own machine; the port identifies the service endpoint your application is listening on."
        },

        {
            title: "Packets and Data on the Network",
            intro:
                "Data sent over networks is transported through networking mechanisms that break communication into manageable units.",

            explanation: [
                "At a beginner level, think of network communication as data being carried across a network through packets.",
                "Packets contain information needed for delivery and are processed by networking equipment and protocols.",
                "You do not need to become a network engineer to learn MERN, but understanding that your HTTP communication travels through networking layers helps explain latency, failures and debugging."
            ],

            warning:
                "Do not imagine the Internet as one direct cable between your browser and a server. Real communication can pass through multiple network devices and intermediary systems."
        },

        {
            title: "Protocols — Rules for Communication",
            intro:
                "Computers need agreed rules to communicate reliably.",

            explanation: [
                "A protocol defines how systems communicate and interpret information.",
                "In web development, HTTP is one of the most important application-layer protocols.",
                "Other protocols and technologies operate at different layers of the networking stack."
            ],

            examples: [
                "IP — network addressing and routing",
                "TCP — reliable transport",
                "UDP — connectionless transport",
                "HTTP — web application communication",
                "TLS — cryptographic protection used with HTTPS"
            ]
        },

        {
            title: "HTTP — How the Browser Talks to a Server",
            intro:
                "HTTP is the foundation of communication between web clients and servers.",

            explanation: [
                "HTTP uses a request-response model. The client sends a request and the server sends a response.",
                "HTTP is used not only for HTML pages but also for images, scripts, APIs and other resources.",
                "Modern applications use HTTP extensively for communication between browsers, backend servers and APIs."
            ],

            request: [
                "Method",
                "URL / target",
                "Headers",
                "Optional body"
            ],

            response: [
                "Status code",
                "Headers",
                "Optional body"
            ],

            exampleRequest:
`GET /JavaScript/ HTTP/1.1
Host: codebhavya.com
Accept: text/html`,

            exampleResponse:
`HTTP/1.1 200 OK
Content-Type: text/html

<!doctype html>
...`
        },

        {
            title: "HTTP Methods",
            intro:
                "HTTP methods communicate the intended operation for a request.",

            methods: [
                {
                    name: "GET",
                    meaning: "Retrieve a representation of a resource."
                },
                {
                    name: "POST",
                    meaning: "Submit data or request creation/processing."
                },
                {
                    name: "PUT",
                    meaning: "Replace a resource representation."
                },
                {
                    name: "PATCH",
                    meaning: "Partially modify a resource."
                },
                {
                    name: "DELETE",
                    meaning: "Request removal of a resource."
                }
            ],

            realWorld:
                "Later, when you build Express APIs, these methods will become routes such as GET /students, POST /students and DELETE /students/:id."
        },

        {
            title: "HTTP Status Codes",
            intro:
                "The server uses status codes to communicate the outcome of a request.",

            groups: [
                {
                    range: "1xx",
                    meaning: "Informational"
                },
                {
                    range: "2xx",
                    meaning: "Successful"
                },
                {
                    range: "3xx",
                    meaning: "Redirection"
                },
                {
                    range: "4xx",
                    meaning: "Client-side error"
                },
                {
                    range: "5xx",
                    meaning: "Server-side error"
                }
            ],

            examples: [
                "200 — OK",
                "201 — Created",
                "301 — Moved Permanently",
                "400 — Bad Request",
                "401 — Unauthorized",
                "403 — Forbidden",
                "404 — Not Found",
                "500 — Internal Server Error"
            ],

            practice:
                "When an API returns 404, ask: did the client request the wrong resource, or does the server simply not have that resource?"
        },

        {
            title: "HTTP Headers",
            intro:
                "Headers carry metadata and instructions associated with requests and responses.",

            examples: [
                "Content-Type",
                "Accept",
                "Authorization",
                "Cookie",
                "Cache-Control",
                "User-Agent",
                "Location"
            ],

            explanation: [
                "Headers become extremely important later in MERN development.",
                "Authentication information, content types, caching instructions and many other behaviours are communicated through headers."
            ]
        },

        {
            title: "HTTPS — Secure HTTP",
            intro:
                "HTTPS is HTTP protected using TLS.",

            explanation: [
                "HTTPS provides cryptographic protection for communication between a client and server.",
                "This helps protect data from being read or modified by unauthorized parties while it travels across the network.",
                "HTTPS is essential for modern production websites and applications."
            ],

            keyIdea:
                "HTTP explains web communication. HTTPS adds TLS-based protection to that communication."
        },

        {
            title: "HTML, CSS and JavaScript",
            intro:
                "These three technologies have different primary responsibilities in a web page.",

            comparison: [
                {
                    term: "HTML",
                    meaning: "Structure and meaning of the document."
                },
                {
                    term: "CSS",
                    meaning: "Presentation, styling and layout."
                },
                {
                    term: "JavaScript",
                    meaning: "Behaviour and application logic."
                }
            ],

            example:
`HTML
  ↓
Structure

CSS
  ↓
Appearance

JavaScript
  ↓
Behaviour`
        },

        {
            title: "What Happens When a Browser Loads a Page?",
            intro:
                "A web page is assembled from multiple resources.",

            explanation: [
                "The browser requests the initial document.",
                "The returned HTML is parsed into a DOM tree.",
                "The browser discovers additional resources such as stylesheets, scripts and images and may request them.",
                "CSS is processed to determine presentation and layout.",
                "JavaScript may execute and change the document or request additional data.",
                "The browser then presents the resulting page to the user."
            ],

            flow: [
                "Navigate to URL",
                "Resolve network destination",
                "Connect to server",
                "Send HTTP request",
                "Receive HTML",
                "Parse HTML",
                "Build DOM",
                "Load CSS and other resources",
                "Execute JavaScript",
                "Calculate layout and paint",
                "Display interactive page"
            ]
        },

        {
            title: "Frontend and Backend",
            intro:
                "MERN development becomes much easier once you know where frontend and backend responsibilities live.",

            frontend: [
                "User interface",
                "Browser interaction",
                "HTML",
                "CSS",
                "JavaScript",
                "React"
            ],

            backend: [
                "Business logic",
                "Authentication",
                "Validation",
                "APIs",
                "Server-side processing",
                "Database communication",
                "Node.js",
                "Express"
            ],

            keyIdea:
                "Frontend and backend are connected through communication mechanisms such as HTTP APIs."
        },

        {
            title: "Where Does MongoDB Fit?",
            intro:
                "A full-stack application often needs persistent data.",

            explanation: [
                "A browser should not normally be responsible for directly storing and managing the application's central database.",
                "The backend communicates with the database and applies rules before returning data to the client.",
                "In MERN, MongoDB is the database layer, while Node.js and Express commonly provide the backend layer."
            ],

            flow: [
                "React UI",
                "HTTP request",
                "Express route",
                "Backend logic",
                "MongoDB",
                "Backend response",
                "React UI update"
            ]
        },

        {
            title: "What is an API?",
            intro:
                "An API provides a defined way for software systems to communicate.",

            explanation: [
                "In MERN applications, a backend API commonly exposes HTTP endpoints that a React frontend can call.",
                "The frontend does not need to know how the database works internally. It communicates with the backend through the API contract.",
                "Later you will build these APIs yourself with Node.js and Express."
            ],

            example:
`GET /api/students

Response:
{
    "id": 101,
    "name": "Anita",
    "branch": "CSE"
}`
        },

        {
            title: "Static vs Dynamic Websites",
            intro:
                "Not every website works in exactly the same way.",

            comparison: [
                {
                    term: "Static",
                    meaning: "Resources can be served largely as prepared files."
                },
                {
                    term: "Dynamic",
                    meaning: "Content or responses may be generated based on data, users, requests or application logic."
                }
            ],

            example:
                "A simple documentation page may be largely static, while a placement management system may dynamically load student, company and application information."
        },

        {
            title: "Cookies, Sessions and State — First Introduction",
            intro:
                "HTTP itself is stateless, but web applications often need to remember users and application state.",

            explanation: [
                "A browser can store cookies associated with websites.",
                "Cookies can participate in authentication and session mechanisms.",
                "Later in the MERN course we will study authentication, JWTs, cookies and sessions properly. For now, remember that HTTP requests do not automatically carry all application state from one request to the next."
            ],

            warning:
                "Do not memorize cookies as simply 'login storage'. Cookies have many uses, and secure authentication requires careful design."
        },

        {
            title: "Caching — Why Websites Can Load Faster",
            intro:
                "Browsers and intermediary systems can cache resources.",

            explanation: [
                "Caching can reduce repeated downloads and improve performance.",
                "HTTP provides mechanisms that allow clients and servers to communicate caching behaviour through headers.",
                "Caching becomes particularly important when building production web applications."
            ],

            keyIdea:
                "Caching can improve performance, but stale data and cache invalidation are important engineering problems."
        },

        {
            title: "CDNs — Delivering Content Efficiently",
            intro:
                "Large applications often use Content Delivery Networks.",

            explanation: [
                "A CDN distributes or caches content across geographically distributed infrastructure.",
                "A user may receive static resources from a nearby edge location rather than always retrieving them from one origin server.",
                "You do not need to master CDN architecture yet, but you should know why production systems use it."
            ]
        },

        {
            title: "Putting Everything Together",
            intro:
                "Now connect all the concepts into one mental model.",

            architecture: [
                "User",
                "Browser",
                "DNS",
                "Internet",
                "HTTPS",
                "Web server / application server",
                "API",
                "Backend logic",
                "MongoDB",
                "Response",
                "Browser UI"
            ],

            explanation: [
                "This is the foundation for the entire MERN course.",
                "React will eventually control the frontend interface.",
                "Node.js will provide the JavaScript runtime on the server.",
                "Express will help build HTTP APIs.",
                "MongoDB will store application data.",
                "The browser and backend will communicate primarily through HTTP."
            ]
        }
    ],

    trace: {
        code: [
            "User enters: https://codebhavya.com/",
            "Browser parses the URL",
            "Browser determines the host",
            "DNS resolution is performed when needed",
            "Network connection is established",
            "Browser sends an HTTP request",
            "Server receives the request",
            "Server prepares a response",
            "Browser receives the response",
            "Browser parses HTML",
            "Browser requests additional resources",
            "CSS is processed",
            "JavaScript is executed",
            "Browser renders the page",
            "User interacts with the page"
        ],

        steps: [
            {
                line: 0,
                state: "Input",
                explain: "The user enters a web address into the browser."
            },
            {
                line: 1,
                state: "URL parsing",
                explain: "The browser separates the scheme, host, path and other URL components."
            },
            {
                line: 2,
                state: "Destination",
                explain: "The browser identifies the host it needs to contact."
            },
            {
                line: 3,
                state: "DNS",
                explain: "The browser or its networking stack resolves the domain to appropriate network information when needed."
            },
            {
                line: 4,
                state: "Connection",
                explain: "The browser establishes the necessary network and security connections."
            },
            {
                line: 5,
                state: "HTTP request",
                explain: "The browser sends a request describing the resource it wants."
            },
            {
                line: 6,
                state: "Server",
                explain: "The server receives and processes the request."
            },
            {
                line: 7,
                state: "Response",
                explain: "The server sends an HTTP response containing a status and potentially a body."
            },
            {
                line: 8,
                state: "Received",
                explain: "The browser receives the server response."
            },
            {
                line: 9,
                state: "HTML parsing",
                explain: "The browser parses the HTML and constructs the DOM."
            },
            {
                line: 10,
                state: "Resources",
                explain: "The browser discovers resources such as CSS, JavaScript and images."
            },
            {
                line: 11,
                state: "CSS",
                explain: "CSS is processed to determine presentation and layout."
            },
            {
                line: 12,
                state: "JavaScript",
                explain: "JavaScript executes and can change the page or request additional data."
            },
            {
                line: 13,
                state: "Rendering",
                explain: "The browser creates the visual result that the user can interact with."
            },
            {
                line: 14,
                state: "Interaction",
                explain: "The page is now available for the user to interact with."
            }
        ]
    },

    revision: [
        ["Internet", "Global network infrastructure."],
        ["Web", "A system of web resources and applications using Internet communication."],
        ["Client", "The system making a request."],
        ["Server", "The system providing a service or response."],
        ["DNS", "Resolves domain names to network information."],
        ["IP", "Network addressing mechanism."],
        ["URL", "Address identifying a web resource."],
        ["HTTP", "Application-layer protocol used for web communication."],
        ["HTTPS", "HTTP protected using TLS."],
        ["Frontend", "User-facing application layer."],
        ["Backend", "Server-side application layer."],
        ["API", "Defined interface for software communication."],
        ["Database", "Persistent data storage system."],
        ["React", "Frontend library used later in the MERN stack."],
        ["Node.js", "JavaScript runtime used later for backend development."],
        ["Express", "Backend framework used later to build HTTP APIs."],
        ["MongoDB", "Database technology used in MERN."]
    ],

    interview: [
        {
            q: "What is the difference between the Internet and the Web?",
            a: "The Internet is the underlying global network infrastructure. The Web is a system of resources and applications that uses web technologies and protocols over that infrastructure."
        },
        {
            q: "What is the client-server model?",
            a: "The client initiates a request for a resource or service, and the server processes that request and returns a response."
        },
        {
            q: "Why do we need DNS?",
            a: "DNS provides the naming system that allows human-friendly domain names to be resolved to network information needed to reach the appropriate destination."
        },
        {
            q: "What is HTTP?",
            a: "HTTP is an application-layer protocol used for communication between clients and servers on the Web."
        },
        {
            q: "What is the difference between HTTP and HTTPS?",
            a: "HTTPS is HTTP used with TLS-based cryptographic protection."
        },
        {
            q: "What happens after the browser receives HTML?",
            a: "The browser parses the HTML into a DOM structure, discovers other resources, processes CSS, executes JavaScript and renders the page."
        },
        {
            q: "What is the role of an API in MERN?",
            a: "The API provides a communication interface between the frontend and backend, commonly using HTTP requests and responses."
        },
        {
            q: "Why does a MERN application need a backend?",
            a: "The backend can enforce business rules, validate input, authenticate users, communicate with databases and provide controlled APIs to clients."
        }
    ],

    practice: [
        {
            title: "Trace a Website",
            prompt: "Choose any website and write the complete journey from entering its URL until the page appears."
        },
        {
            title: "URL Breakdown",
            prompt: "Take five real URLs and identify scheme, host, port if present, path, query string and fragment."
        },
        {
            title: "Client or Server?",
            prompt: "Classify ten real-world web actions as primarily client-side, server-side or involving both."
        },
        {
            title: "HTTP Detective",
            prompt: "Open browser DevTools, visit a website and inspect one document request. Identify its method, status code, headers and response type."
        },
        {
            title: "Design a Web System",
            prompt: "Design a simple student portal and identify its browser, frontend, backend, API and database responsibilities."
        },
        {
            title: "Explain Without Memorizing",
            prompt: "Explain what happens when someone enters https://example.com into a browser using your own words."
        }
    ],

    quiz: [
        {
            q: "Which system normally initiates an HTTP request when a user loads a web page?",
            options: [
                "The browser/client",
                "The database",
                "The CSS engine",
                "The HTML file"
            ],
            answer: 0,
            explanation: "The browser normally acts as the client and initiates the request."
        },
        {
            q: "What is the main purpose of DNS?",
            options: [
                "Style a webpage",
                "Resolve domain names to network information",
                "Store JavaScript variables",
                "Create HTML elements"
            ],
            answer: 1,
            explanation: "DNS provides the naming system used to resolve domain names."
        },
        {
            q: "Which HTTP status-code class represents successful responses?",
            options: [
                "1xx",
                "2xx",
                "4xx",
                "5xx"
            ],
            answer: 1,
            explanation: "2xx status codes indicate successful requests."
        },
        {
            q: "Which technology primarily defines the structure and meaning of web documents?",
            options: [
                "CSS",
                "JavaScript",
                "HTML",
                "MongoDB"
            ],
            answer: 2,
            explanation: "HTML defines the structure and meaning of web content."
        },
        {
            q: "Which component will later provide the database layer in MERN?",
            options: [
                "React",
                "MongoDB",
                "Express",
                "CSS"
            ],
            answer: 1,
            explanation: "MongoDB is the database technology in the MERN acronym."
        },
        {
            q: "Which component is primarily responsible for server-side JavaScript execution in MERN?",
            options: [
                "Node.js",
                "HTML",
                "CSS",
                "React"
            ],
            answer: 0,
            explanation: "Node.js provides the JavaScript runtime used on the server side."
        }
    ],

    commonMistakes: [
        "Thinking Internet and Web are exactly the same thing.",
        "Thinking DNS stores the actual website.",
        "Thinking an IP address is the same thing as a domain name.",
        "Thinking HTTP is only used for HTML pages.",
        "Thinking frontend and backend are two completely independent applications.",
        "Thinking the browser receives only one file when loading a website.",
        "Thinking JavaScript is only used for frontend development.",
        "Thinking MongoDB communicates directly with the browser in a normal MERN architecture.",
        "Memorizing status codes without understanding what the request was trying to do."
    ],

    glossary: [
        ["API", "Application Programming Interface"],
        ["Browser", "Software used to access and interact with web resources."],
        ["Client", "System that requests a service or resource."],
        ["DNS", "Domain Name System."],
        ["Domain", "Human-readable name used to identify an Internet destination."],
        ["HTTP", "Hypertext Transfer Protocol."],
        ["HTTPS", "HTTP protected using TLS."],
        ["IP", "Internet Protocol."],
        ["MERN", "MongoDB, Express, React and Node.js."],
        ["Port", "Logical endpoint used by network services."],
        ["Server", "System that provides a service or resource."],
        ["URL", "Uniform Resource Locator."]
    ],

    takeaway:
        "A MERN application is not just React + Node + Express + MongoDB. It is a complete system in which a browser communicates through networks and HTTP with backend services, which communicate with databases and return data to the user interface."
};
