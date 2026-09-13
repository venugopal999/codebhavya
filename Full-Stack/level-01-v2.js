/* =========================================================
   CodeBhavya Full Stack MERN
   Level 01 — How the Web Works
   Version 2 — Beginner First / Detailed Foundation
   ========================================================= */

window.FULLSTACK_LEVEL_01_V2 = {
  id: "01",
  title: "How the Web Works",
  subtitle: "Build the mental model you need before learning MERN.",
  levelLabel: "LEVEL 01",
  difficulty: "Beginner",
  estimatedTime: "4–6 hours",
  prerequisite: "No programming knowledge required",

  hero: {
    badge: "WEB FOUNDATIONS",
    title: "How the Web Works",
    description:
      "Before learning HTML, CSS, JavaScript, React, Node.js, Express and MongoDB, you must understand what actually happens when you open a website.",
    note:
      "If you understand this level properly, many later MERN concepts will become much easier."
  },

  objectives: [
    "Understand the difference between the Internet and the Web.",
    "Understand clients, servers and browsers.",
    "Understand IP addresses, domains and DNS.",
    "Understand URLs, ports and protocols.",
    "Understand how data travels through networks.",
    "Understand HTTP and HTTPS.",
    "Understand HTTP requests and responses.",
    "Understand HTTP methods, status codes, headers and bodies.",
    "Understand the basic roles of HTML, CSS and JavaScript.",
    "Understand frontend, backend, API and database architecture.",
    "Understand cookies, sessions, caching and CORS at a conceptual level.",
    "Learn how to inspect real requests using browser DevTools."
  ],

  concepts: [

    {
      number: 1,
      title: "Internet vs Web",
      intro:
        "The Internet and the Web are related, but they are not the same thing.",

      points: [
        "<strong>Internet</strong> is the global network infrastructure that connects computers and devices.",
        "<strong>Web</strong> is one of the services that runs on top of the Internet.",
        "The Web mainly uses browsers, websites, URLs, HTTP and HTTPS.",
        "Email, online gaming, video calls and file transfer can also use the Internet without being the Web."
      ],

      keyIdea:
        "Think of the Internet as the road network and the Web as one transportation service that uses those roads.",

      comparison: {
        headers: ["Internet", "Web"],
        rows: [
          ["Global network infrastructure", "A service running on the Internet"],
          ["Includes many services", "Mainly websites and web applications"],
          ["Uses many protocols", "Primarily HTTP/HTTPS for web communication"],
          ["Example: network connectivity", "Example: opening codebhavya.com"]
        ]
      },

      example: {
        title: "CodeBhavya Example",
        text:
          "When a student opens CodeBhavya in Chrome, the student's device uses the Internet to communicate with the CodeBhavya web server. The website itself is part of the Web."
      },

      commonMistake:
        "Saying 'Internet and Web are exactly the same thing.' They are not."
    },

    {
      number: 2,
      title: "What Is a Client?",
      intro:
        "A client is a device or software that requests a service from another system.",

      points: [
        "Your laptop can act as a client.",
        "Your smartphone can act as a client.",
        "A browser such as Chrome, Edge or Firefox acts as web-client software.",
        "A client normally initiates communication by sending a request."
      ],

      keyIdea:
        "Client = the system asking for something.",

      example: {
        title: "Simple Example",
        text:
          "When you type codebhavya.com in Chrome, Chrome becomes the web client that requests resources from the server."
      },

      flow: [
        "Student",
        "Browser",
        "Request",
        "Web Server"
      ]
    },

    {
      number: 3,
      title: "What Is a Server?",
      intro:
        "A server is a computer or software system that provides resources or services to clients.",

      points: [
        "A server can receive requests from many clients.",
        "A web server can return HTML, CSS, JavaScript, images or API data.",
        "An application server can execute application logic.",
        "A database server can store and retrieve application data.",
        "One real application may use several different servers."
      ],

      keyIdea:
        "Server = the system that provides a service or resource.",

      example: {
        title: "Student Portal",
        text:
          "A student requests semester marks. The backend receives the request, checks the student's data, retrieves the required records and sends the result back."
      },

      comparison: {
        headers: ["Client", "Server"],
        rows: [
          ["Usually requests", "Usually responds/provides"],
          ["Runs browser/application", "Runs server software"],
          ["Consumes services", "Provides services"],
          ["Example: Chrome", "Example: Node.js application"]
        ]
      }
    },

    {
      number: 4,
      title: "What Happens When You Open a Website?",
      intro:
        "Opening a website involves several steps. It is not simply 'browser gets a page'.",

      points: [
        "You enter a URL.",
        "The browser understands the URL.",
        "The domain name is resolved to an IP address.",
        "A network connection is established.",
        "For HTTPS, a secure TLS connection is established.",
        "The browser sends an HTTP request.",
        "The server processes the request.",
        "The server sends an HTTP response.",
        "The browser processes the returned resources.",
        "The browser constructs and displays the page."
      ],

      flow: [
        "User enters URL",
        "Browser",
        "DNS",
        "Network",
        "HTTPS",
        "Server",
        "HTTP Response",
        "Browser Rendering",
        "Web Page"
      ],

      keyIdea:
        "A website load is a chain of communication and processing steps."
    },

    {
      number: 5,
      title: "IP Addresses",
      intro:
        "Computers communicate across networks using addresses. An IP address identifies a network interface/addressable host in an IP network.",

      points: [
        "IPv4 addresses commonly look like 192.168.1.10.",
        "IPv6 addresses use a much larger address space and look different.",
        "Humans generally prefer domain names instead of remembering IP addresses.",
        "DNS helps connect human-friendly domain names with IP addresses."
      ],

      example: {
        title: "Easy Analogy",
        text:
          "A person's name is easier to remember than their house's geographic coordinates. Similarly, a domain name is easier for humans to remember than an IP address."
      },

      warning:
        "An IP address is not necessarily a permanent identity for a website. Infrastructure can change, and one IP can serve multiple domains."
    },

    {
      number: 6,
      title: "Domain Names",
      intro:
        "A domain name is a human-readable name used to locate Internet services.",

      points: [
        "Examples include codebhavya.com and example.com.",
        "The domain is easier to remember than a numeric IP address.",
        "A domain can have different subdomains.",
        "DNS is responsible for resolving domain names to network information."
      ],

      example: {
        title: "Subdomain Example",
        text:
          "In learn.example.com, 'learn' is a subdomain under example.com."
      },

      keyIdea:
        "Domain = human-friendly name used to reach an Internet service."
    },

    {
      number: 7,
      title: "DNS — Domain Name System",
      intro:
        "DNS translates domain names into information that networking systems can use to reach the required service.",

      points: [
        "Humans type domain names.",
        "Computers need network addresses and routing information.",
        "DNS provides the lookup mechanism between the two.",
        "DNS is distributed rather than being one giant database on one computer.",
        "DNS results can be cached to avoid repeating lookups unnecessarily."
      ],

      example: {
        title: "CodeBhavya",
        text:
          "When a student enters codebhavya.com, the browser needs to determine where the requested service is hosted. DNS participates in resolving the domain."
      },

      flow: [
        "codebhavya.com",
        "DNS lookup",
        "IP/network destination",
        "Connection"
      ],

      commonMistake:
        "DNS does not download the webpage. DNS helps determine where to reach the requested service."
    },

    {
      number: 8,
      title: "URL — Uniform Resource Locator",
      intro:
        "A URL tells the browser where a resource is located and how it should be accessed.",

      example: {
        title: "Example URL",
        text:
          "https://codebhavya.com/Full-Stack/lesson.html?level=1"
      },

      breakdown: [
        {
          label: "https",
          description: "Scheme/protocol used to access the resource."
        },
        {
          label: "codebhavya.com",
          description: "Host/domain name."
        },
        {
          label: "/Full-Stack/lesson.html",
          description: "Path identifying the requested resource."
        },
        {
          label: "?level=1",
          description: "Query parameter carrying additional request information."
        }
      ],

      keyIdea:
        "A URL is more than just a website name. It can identify a specific resource and include additional request information."
    },

    {
      number: 9,
      title: "Ports",
      intro:
        "A port helps identify which network service on a host should receive traffic.",

      points: [
        "An IP address identifies the network destination.",
        "A port helps identify the service/application endpoint.",
        "HTTP commonly uses port 80.",
        "HTTPS commonly uses port 443.",
        "Development servers often use ports such as 3000, 5000, 5173 or others."
      ],

      example: {
        title: "Local Development",
        text:
          "When you run a development server at http://localhost:3000, 'localhost' refers to your own machine and 3000 identifies the port used by that application."
      },

      warning:
        "Port numbers are not the same thing as IP addresses. The IP identifies the host/network destination; the port identifies the service endpoint on that host."
    },

    {
      number: 10,
      title: "Protocols",
      intro:
        "A protocol is a defined set of rules for communication.",

      points: [
        "HTTP defines rules for web requests and responses.",
        "HTTPS is HTTP protected by TLS.",
        "TCP provides reliable transport for many Internet applications.",
        "IP provides addressing and packet delivery across interconnected networks.",
        "Different layers solve different parts of the communication problem."
      ],

      keyIdea:
        "Protocols are communication rules. Without agreed rules, different computers would not know how to communicate reliably."
    },

    {
      number: 11,
      title: "Packets — How Data Travels",
      intro:
        "Network communication does not normally send a large piece of application data as one indivisible block across the entire network.",

      points: [
        "Data is handled through network packets.",
        "Packets contain information needed for delivery.",
        "Different packets may travel through different network paths.",
        "Networking equipment forwards packets toward their destinations.",
        "The receiving system processes the packets as part of the communication."
      ],

      example: {
        title: "Simple Analogy",
        text:
          "Imagine sending a large collection of documents using many numbered envelopes. The receiving side can use the information on those envelopes to process the collection."
      },

      warning:
        "Do not think of the Internet as one direct cable between your laptop and a server."
    },

    {
      number: 12,
      title: "TCP/IP — Beginner Mental Model",
      intro:
        "You do not need to memorize every networking detail before learning MERN, but you should understand the basic layered idea.",

      points: [
        "<strong>IP</strong> deals with addressing and moving packets between networks.",
        "<strong>TCP</strong> provides reliable, ordered transport for applications that use it.",
        "<strong>HTTP</strong> defines web request/response communication.",
        "<strong>TLS</strong> provides security for HTTPS connections."
      ],

      comparison: {
        headers: ["Layer/Technology", "Main Job"],
        rows: [
          ["IP", "Addressing and packet delivery"],
          ["TCP", "Reliable ordered transport"],
          ["TLS", "Encryption and connection security"],
          ["HTTP", "Web request/response semantics"]
        ]
      },

      keyIdea:
        "You don't need to become a network engineer to learn MERN, but knowing what each layer is responsible for prevents confusion later."
    },

    {
      number: 13,
      title: "HTTP",
      intro:
        "HTTP is the application-level protocol used for communication between web clients and servers.",

      points: [
        "A client sends an HTTP request.",
        "A server processes the request.",
        "The server sends an HTTP response.",
        "Requests and responses contain structured information such as methods, status codes, headers and optional bodies.",
        "Modern web applications use HTTP extensively for APIs."
      ],

      flow: [
        "Client",
        "HTTP Request",
        "Server",
        "Application Logic",
        "HTTP Response",
        "Client"
      ],

      keyIdea:
        "HTTP is one of the most important communication foundations you will use throughout the MERN course."
    },

    {
      number: 14,
      title: "HTTP Request",
      intro:
        "An HTTP request tells the server what the client wants to do or retrieve.",

      request: {
        method: "GET",
        path: "/students/101",
        headers: [
          "Host: api.example.com",
          "Accept: application/json"
        ],
        body: "Usually empty for this example"
      },

      points: [
        "<strong>Method</strong> describes the intended operation.",
        "<strong>Path/URL</strong> identifies the resource or endpoint.",
        "<strong>Headers</strong> provide metadata and additional instructions.",
        "<strong>Body</strong> can carry data when required."
      ],

      keyIdea:
        "Think of an HTTP request as a structured message from the client to the server."
    },

    {
      number: 15,
      title: "HTTP Response",
      intro:
        "The server sends an HTTP response back to the client.",

      response: {
        status: "200 OK",
        headers: [
          "Content-Type: application/json"
        ],
        body: {
          studentId: 101,
          name: "Rahul",
          cgpa: 8.42
        }
      },

      points: [
        "<strong>Status code</strong> tells the client the general result.",
        "<strong>Headers</strong> provide metadata.",
        "<strong>Body</strong> contains returned data when appropriate."
      ],

      keyIdea:
        "Request = what the client asks. Response = what the server returns."
    },

    {
      number: 16,
      title: "HTTP Methods",
      intro:
        "HTTP methods communicate the intended operation.",

      methods: [
        {
          name: "GET",
          purpose: "Retrieve data.",
          example: "GET /students"
        },
        {
          name: "POST",
          purpose: "Submit data or create a resource.",
          example: "POST /students"
        },
        {
          name: "PUT",
          purpose: "Replace/update a resource representation.",
          example: "PUT /students/101"
        },
        {
          name: "PATCH",
          purpose: "Partially modify a resource.",
          example: "PATCH /students/101"
        },
        {
          name: "DELETE",
          purpose: "Request deletion of a resource.",
          example: "DELETE /students/101"
        }
      ],

      warning:
        "The method alone does not guarantee what the server actually does. The server application defines how an endpoint behaves."
    },

    {
      number: 17,
      title: "HTTP Status Codes",
      intro:
        "Status codes communicate the general result of an HTTP request.",

      groups: [
        {
          code: "1xx",
          title: "Informational",
          description: "The request is being processed or additional information is involved."
        },
        {
          code: "2xx",
          title: "Success",
          description: "The request was successfully handled."
        },
        {
          code: "3xx",
          title: "Redirection",
          description: "The client needs to follow another path or use cached information."
        },
        {
          code: "4xx",
          title: "Client-side request problem",
          description: "Something about the request or client context is not acceptable."
        },
        {
          code: "5xx",
          title: "Server-side problem",
          description: "The server failed to successfully handle a validly received request."
        }
      ],

      breakdown: [
        "200 — OK",
        "201 — Created",
        "204 — No Content",
        "301/302 — Redirect",
        "400 — Bad Request",
        "401 — Unauthorized",
        "403 — Forbidden",
        "404 — Not Found",
        "409 — Conflict",
        "422 — Unprocessable Content",
        "500 — Internal Server Error",
        "502 — Bad Gateway",
        "503 — Service Unavailable"
      ],

      commonMistake:
        "401 and 403 are not interchangeable. In general, 401 relates to missing/invalid authentication credentials, while 403 indicates the server understood the request but refuses to authorize it."
    },

    {
      number: 18,
      title: "HTTP Headers",
      intro:
        "Headers carry metadata and additional instructions about a request or response.",

      points: [
        "Headers can describe the content type.",
        "Headers can indicate what formats the client accepts.",
        "Headers can carry authentication-related information.",
        "Headers can control caching behavior.",
        "Headers can provide browser/security-related information."
      ],

      example: {
        title: "Common Headers",
        text:
          "Content-Type, Accept, Authorization, Cache-Control, Cookie and Set-Cookie are examples you will encounter during web development."
      },

      keyIdea:
        "Headers are metadata around the main HTTP message."
    },

    {
      number: 19,
      title: "Request and Response Body",
      intro:
        "The body contains the main data being sent when a request or response needs one.",

      points: [
        "A GET request often does not need a request body.",
        "A POST request commonly sends data in the body.",
        "An API response can contain JSON data.",
        "Forms can submit structured data.",
        "Images, files and other content can also be transferred."
      ],

      example: {
        title: "JSON Request",
        code: "{\n  \"name\": \"Anita\",\n  \"branch\": \"CSE-AI&ML\"\n}",
        output:
          "The server can read this JSON and use it to create or process a student record."
      },

      warning:
        "JSON is a data format. HTTP is the communication protocol. They are related in web APIs but they are not the same thing."
    },

    {
      number: 20,
      title: "Content Types",
      intro:
        "The Content-Type header tells the receiver what kind of data is being sent.",

      points: [
        "application/json — JSON data.",
        "text/html — HTML document.",
        "text/css — CSS stylesheet.",
        "application/javascript — JavaScript resource.",
        "multipart/form-data — commonly used for forms involving file uploads.",
        "image/* — image resources."
      ],

      keyIdea:
        "Content-Type helps the receiver understand how the body should be interpreted."
    },

    {
      number: 21,
      title: "HTTPS and TLS",
      intro:
        "HTTPS is HTTP communication protected using TLS.",

      points: [
        "HTTPS helps protect data while it travels between client and server.",
        "TLS provides encryption and helps authenticate the server.",
        "Browsers use HTTPS extensively for modern websites.",
        "Sensitive information should not be sent over insecure connections."
      ],

      comparison: {
        headers: ["HTTP", "HTTPS"],
        rows: [
          ["Web communication", "Web communication with TLS protection"],
          ["No TLS encryption", "TLS provides encryption"],
          ["Typically port 80", "Typically port 443"]
        ]
      },

      warning:
        "HTTPS protects data in transit. It does not automatically make the entire application secure."
    },

    {
      number: 22,
      title: "HTML, CSS and JavaScript",
      intro:
        "A web page normally combines several technologies with different responsibilities.",

      groups: [
        {
          title: "HTML",
          description:
            "Defines the structure and meaning of the page.",
          examples: [
            "Headings",
            "Paragraphs",
            "Buttons",
            "Forms",
            "Images",
            "Links"
          ]
        },
        {
          title: "CSS",
          description:
            "Controls presentation and layout.",
          examples: [
            "Colors",
            "Spacing",
            "Typography",
            "Responsive layouts",
            "Animations"
          ]
        },
        {
          title: "JavaScript",
          description:
            "Adds behavior, logic and dynamic interaction.",
          examples: [
            "Button actions",
            "API calls",
            "Form validation",
            "Dynamic content",
            "Application logic"
          ]
        }
      ],

      keyIdea:
        "HTML = structure, CSS = presentation, JavaScript = behavior."
    },

    {
      number: 23,
      title: "How a Browser Builds a Page",
      intro:
        "A browser does much more than display a file.",

      points: [
        "The browser downloads resources such as HTML, CSS, JavaScript and images.",
        "It parses HTML and constructs a DOM representation.",
        "It processes CSS and determines how elements should be presented.",
        "It executes JavaScript.",
        "JavaScript can modify the DOM and communicate with servers.",
        "The browser performs layout and rendering so the user can see and interact with the page."
      ],

      flow: [
        "HTML",
        "DOM",
        "CSS",
        "Style/Layout",
        "JavaScript",
        "Rendering",
        "Interactive Page"
      ],

      keyIdea:
        "The browser is an execution environment, not just a document viewer."
    },

    {
      number: 24,
      title: "Frontend, Backend and Database",
      intro:
        "A modern application usually separates responsibilities into multiple parts.",

      frontend: [
        "Runs primarily in the user's browser.",
        "Displays the user interface.",
        "Collects user input.",
        "Sends requests to backend services.",
        "Displays data returned by the backend."
      ],

      backend: [
        "Runs on a server.",
        "Receives requests.",
        "Applies business rules.",
        "Performs authentication and authorization.",
        "Validates data.",
        "Communicates with databases and other services."
      ],

      backendExample: {
        title: "Student Marks Application",
        steps: [
          "Student opens the marks page.",
          "Frontend requests marks for a student.",
          "Backend verifies the request.",
          "Backend queries the database.",
          "Database returns the records.",
          "Backend sends JSON to the frontend.",
          "Frontend displays the marks."
        ]
      },

      keyIdea:
        "Frontend handles user interaction; backend handles application/server logic; database stores persistent application data."
    },

    {
      number: 25,
      title: "What Is an API?",
      intro:
        "An API provides a defined way for software systems to communicate.",

      points: [
        "A frontend can communicate with a backend through an API.",
        "An API endpoint represents a particular operation/resource.",
        "HTTP methods commonly describe the intended operation.",
        "The response often contains JSON in modern web applications.",
        "APIs allow different parts of a system to communicate without exposing internal implementation details."
      ],

      example: {
        title: "Student API",
        text:
          "GET /api/students/101 could represent an endpoint that returns information about student 101."
      },

      flow: [
        "React Frontend",
        "HTTP Request",
        "Express API",
        "Node.js Logic",
        "MongoDB",
        "JSON Response",
        "React UI"
      ],

      warning:
        "An API is not necessarily the same thing as a database. The API is an interface; the database is one possible system behind that interface."
    },

    {
      number: 26,
      title: "Cookies and Sessions — Beginner View",
      intro:
        "HTTP is stateless by itself: each request is a separate HTTP message. Applications often need a way to remember users between requests.",

      points: [
        "A cookie is small data associated with a website and stored by the browser.",
        "Servers can use cookies to maintain information across requests.",
        "A session is a server-side mechanism for maintaining user state.",
        "Authentication systems often combine browser cookies with server-side session information.",
        "Modern applications may also use token-based approaches."
      ],

      example: {
        title: "Student Login",
        steps: [
          "Student enters username and password.",
          "Server verifies credentials.",
          "Server establishes an authenticated state.",
          "Browser stores appropriate session-related information.",
          "Later requests can be associated with the logged-in user."
        ]
      },

      warning:
        "Cookies, sessions and authentication tokens are related concepts, but they are not identical."
    },

    {
      number: 27,
      title: "Caching and CDN — Basic Idea",
      intro:
        "Applications can become faster by avoiding unnecessary repeated work and by serving content from locations closer to users.",

      points: [
        "A cache stores previously obtained information for possible reuse.",
        "Browser caches can reduce repeated downloads.",
        "Server-side caches can reduce repeated computation or database work.",
        "A CDN can distribute static resources through geographically distributed edge locations.",
        "Caching must be designed carefully because stale data can be incorrect."
      ],

      keyIdea:
        "Caching is mainly about reusing data or results instead of repeatedly obtaining or computing them."
    },

    {
      number: 28,
      title: "CORS — Why Browsers Sometimes Block Requests",
      intro:
        "Browsers enforce security rules when JavaScript on one origin tries to communicate with another origin.",

      points: [
        "An origin is based on scheme, host and port.",
        "Two URLs can have different origins even if they look similar.",
        "CORS stands for Cross-Origin Resource Sharing.",
        "Servers can send specific headers to tell browsers which cross-origin requests are allowed.",
        "CORS is primarily a browser security mechanism."
      ],

      example: {
        title: "Development Example",
        text:
          "Your React development server might run on one origin while your Express API runs on another. The browser may require the API server to explicitly allow the frontend origin."
      },

      warning:
        "CORS is not the same thing as authentication or authorization. It controls browser cross-origin access behavior."
    },

    {
      number: 29,
      title: "Browser DevTools — Network Tab",
      intro:
        "One of the most important skills for a web developer is learning to inspect what the browser actually sends and receives.",

      points: [
        "Open browser Developer Tools.",
        "Go to the Network tab.",
        "Reload the page.",
        "Observe requests for HTML, CSS, JavaScript, images and APIs.",
        "Select a request.",
        "Inspect its URL, method, status, headers, payload and response.",
        "Use this information when debugging frontend/backend communication."
      ],

      breakdown: [
        "Request URL",
        "Request Method",
        "Status Code",
        "Request Headers",
        "Request Payload",
        "Response Headers",
        "Response Body",
        "Timing"
      ],

      tryIt: {
        title: "Try It Yourself",
        steps: [
          "Open any modern website.",
          "Press F12.",
          "Open Network.",
          "Reload the page.",
          "Click one request.",
          "Find the Request URL.",
          "Find the Status Code.",
          "Find the Response Headers.",
          "Look at the Response/Preview section."
        ]
      },

      keyIdea:
        "Do not guess what your application is doing. Learn to inspect the actual request and response."
    },

    {
      number: 30,
      title: "The Complete Web Request",
      intro:
        "Now combine everything into one mental model.",

      request: {
        title: "Student Requests Placement Data",
        steps: [
          "Student opens the CodeBhavya placement dashboard.",
          "Browser prepares a request.",
          "DNS helps resolve the required domain.",
          "The network connection reaches the server.",
          "HTTPS protects the communication.",
          "Browser sends an HTTP request.",
          "Backend receives the request.",
          "Express routes the request to appropriate application logic.",
          "Node.js executes the backend code.",
          "Backend communicates with MongoDB.",
          "MongoDB returns the requested data.",
          "Backend creates an HTTP response.",
          "JSON data is returned to the browser.",
          "Frontend receives the response.",
          "React updates the interface.",
          "Student sees the placement information."
        ]
      },

      flow: [
        "Student",
        "Browser",
        "DNS",
        "HTTPS",
        "Express API",
        "Node.js",
        "MongoDB",
        "Node.js",
        "HTTP Response",
        "React",
        "Browser UI"
      ],

      keyIdea:
        "This flow is the foundation of the MERN architecture you will build throughout this course."
    },

    {
      number: 31,
      title: "Putting Everything Together",
      intro:
        "Now connect all the concepts into one mental model.",

      points: [
        "<strong>React</strong> will eventually control the frontend interface.",
        "<strong>Node.js</strong> will provide the JavaScript runtime on the server.",
        "<strong>Express</strong> will help build HTTP APIs.",
        "<strong>MongoDB</strong> will store application data.",
        "<strong>HTTP/HTTPS</strong> will provide the communication mechanism between browser and backend.",
        "<strong>DNS</strong> will help resolve domain names.",
        "<strong>HTML/CSS/JavaScript</strong> will form the foundation of browser-based interfaces.",
        "<strong>APIs</strong> will connect frontend and backend responsibilities."
      ],

      architecture: [
        {
          title: "Frontend",
          items: [
            "HTML",
            "CSS",
            "JavaScript",
            "React"
          ]
        },
        {
          title: "Backend",
          items: [
            "Node.js",
            "Express",
            "APIs",
            "Business Logic",
            "Authentication"
          ]
        },
        {
          title: "Database",
          items: [
            "MongoDB",
            "Collections",
            "Documents",
            "Queries"
          ]
        }
      ],

      flow: [
        "User",
        "Browser",
        "React",
        "HTTP/HTTPS",
        "Express",
        "Node.js",
        "MongoDB",
        "Response",
        "React UI"
      ],

      keyIdea:
        "MERN is not four isolated technologies. It is a collection of technologies that work together to build a complete web application."
    },

    {
      number: 32,
      title: "Common Misconceptions",
      intro:
        "These mistakes are common among beginners. Understanding them now will save significant confusion later.",

      mistakes: [
        {
          wrong: "The browser is the Internet.",
          correct:
            "The browser is software that uses Internet networking services to access web resources."
        },
        {
          wrong: "DNS sends the webpage.",
          correct:
            "DNS helps resolve domain names; the actual web resources are transferred through application/network communication."
        },
        {
          wrong: "HTTP and JSON are the same.",
          correct:
            "HTTP is a communication protocol. JSON is a data format."
        },
        {
          wrong: "The database communicates directly with the browser in a normal secure architecture.",
          correct:
            "The backend normally sits between the frontend and database."
        },
        {
          wrong: "Frontend means only HTML.",
          correct:
            "Frontend development can include HTML, CSS, JavaScript, frameworks such as React and many browser APIs."
        },
        {
          wrong: "Backend means database.",
          correct:
            "Backend includes server-side application logic; a database is a separate data-storage component."
        },
        {
          wrong: "HTTPS means the application is completely secure.",
          correct:
            "HTTPS protects communication in transit, but application security also requires authentication, authorization, validation, secure coding and more."
        },
        {
          wrong: "Every 4xx error means the server is broken.",
          correct:
            "4xx responses generally indicate a problem with the request/client context."
        },
        {
          wrong: "A 200 response always means the application produced the correct business result.",
          correct:
            "200 indicates successful HTTP handling, but application-level correctness still depends on the server's logic."
        }
      ]
    },

    {
      number: 33,
      title: "A Real MERN Application Example",
      intro:
        "Imagine that we are building a CodeBhavya Student Management System.",

      points: [
        "React displays the student dashboard.",
        "The browser sends API requests.",
        "Express defines API routes.",
        "Node.js executes the server-side JavaScript.",
        "Backend validation checks incoming data.",
        "MongoDB stores student records.",
        "The API returns JSON.",
        "React displays the result.",
        "Authentication protects private student information.",
        "HTTPS protects data while it travels between client and server."
      ],

      example: {
        title: "View Student Marks",
        steps: [
          "Student clicks 'View Marks'.",
          "React sends GET /api/students/101/marks.",
          "Express receives the request.",
          "Backend verifies access.",
          "Node.js executes the required logic.",
          "MongoDB is queried.",
          "Marks are returned.",
          "Backend sends JSON.",
          "React receives the response.",
          "The marks table appears on screen."
        ]
      }
    },

    {
      number: 34,
      title: "What You Should NOT Learn Yet",
      intro:
        "A strong beginner course also tells you what can wait.",

      points: [
        "You do not need to memorize TCP packet internals now.",
        "You do not need to become a DNS administrator.",
        "You do not need to understand every TLS handshake detail now.",
        "You do not need to learn MongoDB queries in this level.",
        "You do not need to learn React before understanding this foundation.",
        "You do not need to memorize every HTTP header.",
        "You should first build the correct mental model."
      ],

      keyIdea:
        "Learn concepts in layers. Understand the purpose first; implementation details will come when they become useful."
    },

    {
      number: 35,
      title: "Your Mental Model Checklist",
      intro:
        "Before moving to Level 02, you should be able to explain these without memorizing a definition.",

      points: [
        "What is the Internet?",
        "What is the Web?",
        "What is a client?",
        "What is a server?",
        "What is an IP address?",
        "What is a domain?",
        "What does DNS do?",
        "What is a URL?",
        "What is a port?",
        "What is HTTP?",
        "What is HTTPS?",
        "What is an HTTP request?",
        "What is an HTTP response?",
        "What are HTTP methods?",
        "What are status codes?",
        "What are headers?",
        "What is a request/response body?",
        "What are HTML, CSS and JavaScript responsible for?",
        "What is frontend?",
        "What is backend?",
        "What is an API?",
        "Why do we use databases?",
        "Why does CORS exist?",
        "What can you inspect using Network DevTools?",
        "How does a browser communicate with a MERN backend?"
      ],

      warning:
        "If you can explain the complete request-response flow in your own words, you are ready to continue. If not, revise Concepts 13–31 before moving forward."
    }
  ],

  visualizer: {
    title: "Complete Web Request Visualizer",
    description:
      "Follow a request from the student to the browser, through the network and MERN backend, into MongoDB and back.",

    steps: [
      {
        title: "1. User Action",
        operation: "Student clicks 'View Marks'.",
        detail:
          "The user's interaction causes the frontend application to start an operation."
      },
      {
        title: "2. React",
        operation: "React prepares the API request.",
        detail:
          "The frontend knows which backend endpoint it needs to call."
      },
      {
        title: "3. HTTP Request",
        operation: "GET /api/students/101/marks",
        detail:
          "The browser sends a structured HTTP request."
      },
      {
        title: "4. DNS / Network",
        operation: "Domain → network destination",
        detail:
          "The browser and networking stack determine where the request needs to go."
      },
      {
        title: "5. HTTPS",
        operation: "Secure communication",
        detail:
          "TLS protects the communication between client and server."
      },
      {
        title: "6. Express",
        operation: "Route matches the request.",
        detail:
          "Express determines which backend handler should process the endpoint."
      },
      {
        title: "7. Node.js",
        operation: "Backend logic executes.",
        detail:
          "Node.js runs the server-side JavaScript."
      },
      {
        title: "8. MongoDB",
        operation: "Student marks are retrieved.",
        detail:
          "The backend communicates with the database."
      },
      {
        title: "9. HTTP Response",
        operation: "200 OK + JSON",
        detail:
          "The backend sends the result back to the browser."
      },
      {
        title: "10. React UI",
        operation: "Marks table updates.",
        detail:
          "React uses the returned data to update the interface."
      }
    ]
  },

  trace: {
    title: "Program Tracing — Web Request",
    lines: [
      {
        line: 1,
        code: "User clicks: View Marks",
        explanation: "The user starts the operation."
      },
      {
        line: 2,
        code: "React → GET /api/students/101/marks",
        explanation: "The frontend requests the required data."
      },
      {
        line: 3,
        code: "Browser → HTTPS → Server",
        explanation: "The request travels securely to the backend."
      },
      {
        line: 4,
        code: "Express matches GET /api/students/:id/marks",
        explanation: "Express selects the appropriate route."
      },
      {
        line: 5,
        code: "Node.js executes backend logic",
        explanation: "The server-side JavaScript runs."
      },
      {
        line: 6,
        code: "MongoDB → find student marks",
        explanation: "The database is queried."
      },
      {
        line: 7,
        code: "MongoDB → records",
        explanation: "The requested records are returned."
      },
      {
        line: 8,
        code: "Server → 200 OK + JSON",
        explanation: "The backend sends the HTTP response."
      },
      {
        line: 9,
        code: "React receives JSON",
        explanation: "The frontend receives the data."
      },
      {
        line: 10,
        code: "React → Update Marks Table",
        explanation: "The user sees the final result."
      }
    ]
  },

  practice: [
    {
      title: "Practice 01 — Explain the Web",
      difficulty: "Beginner",
      task:
        "Explain in your own words the difference between the Internet and the Web.",
      hints: [
        "Think about infrastructure versus service.",
        "Give one example of a Web service."
      ]
    },
    {
      title: "Practice 02 — URL Detective",
      difficulty: "Beginner",
      task:
        "Take a URL and identify its scheme, host, path and query parameters.",
      hints: [
        "Look for https://.",
        "Look for the domain.",
        "Look after the domain for the path.",
        "Look after ? for query parameters."
      ]
    },
    {
      title: "Practice 03 — Request or Response?",
      difficulty: "Beginner",
      task:
        "Classify each item as belonging primarily to an HTTP request or response: method, status code, response body, request body, Content-Type.",
      hints: [
        "A method tells the server what the client wants.",
        "A status code is returned by the server."
      ]
    },
    {
      title: "Practice 04 — Build the Flow",
      difficulty: "Beginner",
      task:
        "Arrange these in the correct order: MongoDB, Browser, Express, User, React, HTTP Request, HTTP Response, Node.js.",
      hints: [
        "Start with the user.",
        "The browser/frontend initiates communication.",
        "The database is not normally contacted directly by the browser."
      ]
    },
    {
      title: "Practice 05 — DevTools Investigation",
      difficulty: "Beginner",
      task:
        "Open a website, inspect its Network tab and find one document request and one API request.",
      hints: [
        "Reload the page after opening Network.",
        "Inspect URL, method and status."
      ]
    },
    {
      title: "Practice 06 — MERN Architecture",
      difficulty: "Placement",
      task:
        "Design a simple architecture for a Student Marks Management System using React, Node.js, Express and MongoDB.",
      hints: [
        "React handles the interface.",
        "Express handles API routes.",
        "Node.js runs the backend.",
        "MongoDB stores persistent data."
      ]
    }
  ],

  interview: [
    {
      question: "What is the difference between the Internet and the Web?",
      answer:
        "The Internet is the global network infrastructure, while the Web is a service that uses that infrastructure to provide web resources and applications."
    },
    {
      question: "What is DNS?",
      answer:
        "DNS is the distributed naming system used to resolve domain names into information needed to reach Internet services."
    },
    {
      question: "What happens when you enter a URL in a browser?",
      answer:
        "The browser parses the URL, resolves the destination through DNS as needed, establishes the appropriate network/security connection, sends an HTTP request, receives a response and processes the returned resources."
    },
    {
      question: "What is the difference between HTTP and HTTPS?",
      answer:
        "HTTPS is HTTP protected by TLS, providing encryption and server authentication for the connection."
    },
    {
      question: "What is an HTTP request?",
      answer:
        "It is a structured message sent by a client to a server containing information such as method, target URL/path, headers and optionally a body."
    },
    {
      question: "What is an HTTP response?",
      answer:
        "It is the structured message returned by a server, containing a status code, headers and optionally a body."
    },
    {
      question: "What is the difference between GET and POST?",
      answer:
        "GET is generally used to retrieve a resource, while POST is generally used to submit data or request creation/processing on the server."
    },
    {
      question: "What does a 404 status code mean?",
      answer:
        "It indicates that the server could not find a current representation of the requested resource."
    },
    {
      question: "What is an API?",
      answer:
        "An API is a defined interface through which software components communicate. In web applications, HTTP APIs commonly expose backend operations to frontend clients."
    },
    {
      question: "Why should the browser normally not connect directly to MongoDB?",
      answer:
        "A backend should normally mediate access to the database so that authentication, authorization, validation, business rules and database credentials remain under server-side control."
    },
    {
      question: "What is CORS?",
      answer:
        "CORS is a browser security mechanism that allows servers to specify which cross-origin requests browsers may permit."
    },
    {
      question: "What is the role of Node.js in MERN?",
      answer:
        "Node.js provides the JavaScript runtime in which the backend application can execute JavaScript outside the browser."
    },
    {
      question: "What is the role of Express?",
      answer:
        "Express is a Node.js web framework commonly used to define routes, middleware and HTTP API behavior."
    },
    {
      question: "What is the role of MongoDB?",
      answer:
        "MongoDB is the database layer used to persist and retrieve application data."
    },
    {
      question: "What is the role of React?",
      answer:
        "React is used to build the frontend user interface from reusable components and manage dynamic UI updates."
    }
  ],

  quiz: [
    {
      question: "Which statement best describes the Internet?",
      options: [
        "A browser",
        "The global network infrastructure",
        "A JavaScript framework",
        "A database"
      ],
      answer: 1,
      explanation:
        "The Internet is the global interconnected network infrastructure."
    },
    {
      question: "What is the primary purpose of DNS?",
      options: [
        "Store webpages",
        "Encrypt passwords",
        "Resolve domain names",
        "Create HTML"
      ],
      answer: 2,
      explanation:
        "DNS resolves domain names into information used to reach Internet services."
    },
    {
      question: "Which protocol is used for web request/response communication?",
      options: [
        "HTTP",
        "JPEG",
        "CSS",
        "MongoDB"
      ],
      answer: 0,
      explanation:
        "HTTP defines web request/response communication."
    },
    {
      question: "Which status code belongs to the success category?",
      options: [
        "404",
        "500",
        "200",
        "403"
      ],
      answer: 2,
      explanation:
        "2xx status codes represent successful HTTP handling."
    },
    {
      question: "Which HTTP method is generally used to retrieve data?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "PATCH"
      ],
      answer: 0,
      explanation:
        "GET is generally used to retrieve a resource."
    },
    {
      question: "Which component normally stores persistent application data in a MERN application?",
      options: [
        "React",
        "CSS",
        "MongoDB",
        "Browser DevTools"
      ],
      answer: 2,
      explanation:
        "MongoDB is the database component in MERN."
    },
    {
      question: "What does Node.js provide?",
      options: [
        "A database",
        "A JavaScript runtime",
        "A CSS engine",
        "A domain name"
      ],
      answer: 1,
      explanation:
        "Node.js provides a JavaScript runtime outside the browser."
    },
    {
      question: "What is JSON?",
      options: [
        "A network protocol",
        "A database server",
        "A data format",
        "A browser"
      ],
      answer: 2,
      explanation:
        "JSON is a data format commonly used in web APIs."
    },
    {
      question: "What does HTTPS add to HTTP?",
      options: [
        "Database storage",
        "TLS protection",
        "React components",
        "DNS records"
      ],
      answer: 1,
      explanation:
        "HTTPS uses TLS to protect HTTP communication."
    },
    {
      question: "Where can you inspect API requests in a browser?",
      options: [
        "Network tab in DevTools",
        "Desktop wallpaper",
        "File Explorer only",
        "HTML comments"
      ],
      answer: 0,
      explanation:
        "The Network panel in browser DevTools lets you inspect requests and responses."
    }
  ],

  glossary: [
    {
      term: "API",
      definition:
        "A defined interface through which software components communicate."
    },
    {
      term: "Browser",
      definition:
        "Software used to access and interact with web resources."
    },
    {
      term: "Cache",
      definition:
        "Stored information that may be reused to reduce repeated work or downloads."
    },
    {
      term: "Client",
      definition:
        "A system or application that requests a service."
    },
    {
      term: "CORS",
      definition:
        "A browser security mechanism for controlling permitted cross-origin requests."
    },
    {
      term: "DNS",
      definition:
        "The distributed naming system used to resolve domain names."
    },
    {
      term: "Domain",
      definition:
        "A human-readable name used to locate an Internet service."
    },
    {
      term: "Endpoint",
      definition:
        "A specific API location through which a particular operation can be accessed."
    },
    {
      term: "HTTP",
      definition:
        "The application-level protocol used for web request/response communication."
    },
    {
      term: "HTTPS",
      definition:
        "HTTP protected using TLS."
    },
    {
      term: "IP Address",
      definition:
        "A network address used by IP networking."
    },
    {
      term: "JSON",
      definition:
        "A lightweight structured data format commonly used by web APIs."
    },
    {
      term: "Port",
      definition:
        "A number identifying a service endpoint on a network host."
    },
    {
      term: "Protocol",
      definition:
        "A set of rules used for communication."
    },
    {
      term: "Request",
      definition:
        "A structured HTTP message sent from a client to a server."
    },
    {
      term: "Response",
      definition:
        "A structured HTTP message returned by a server."
    },
    {
      term: "Server",
      definition:
        "A system that provides resources or services to clients."
    },
    {
      term: "TLS",
      definition:
        "A security protocol used to protect network communication."
    },
    {
      term: "URL",
      definition:
        "A locator identifying a resource and how it can be accessed."
    }
  ],

  revision: [
    "Internet = global network infrastructure.",
    "Web = a service running over the Internet.",
    "Client requests; server provides a service.",
    "Browser is a web client and execution environment.",
    "DNS helps resolve domain names.",
    "IP addresses identify network destinations.",
    "Ports identify service endpoints on a host.",
    "HTTP defines web request/response communication.",
    "HTTPS protects HTTP using TLS.",
    "HTTP request = method + target + headers + optional body.",
    "HTTP response = status + headers + optional body.",
    "GET generally retrieves data.",
    "POST generally submits data or creates/processes something.",
    "2xx = success, 4xx = client/request problem, 5xx = server problem.",
    "HTML = structure.",
    "CSS = presentation.",
    "JavaScript = behavior and application logic in the browser.",
    "Frontend handles user interaction.",
    "Backend handles server-side application logic.",
    "Database stores persistent application data.",
    "API connects software components.",
    "React will be the frontend layer of our MERN applications.",
    "Node.js will run JavaScript on the server.",
    "Express will help build HTTP APIs.",
    "MongoDB will store application data.",
    "The browser and backend communicate primarily through HTTP/HTTPS."
  ],

  completion: {
    title: "Level 01 Complete",
    message:
      "You now have the mental model required to understand the rest of the MERN stack.",
    nextStep:
      "Next, we will start with HTML and learn how browsers understand the structure of a web page.",
    challenge:
      "Before continuing, explain the complete journey of a request from a student's browser to MongoDB and back without looking at your notes."
  }
};


/* =========================================================
   Register Level 01 with the existing lesson system
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS["01"] =
  window.FULLSTACK_LEVEL_01_V2;
