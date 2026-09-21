"use strict";

/* =========================================================
   CODEBHAVYA FULL STACK / MERN
   LEVEL 22 — EXPRESS AUTHENTICATION, SECURITY & PRODUCTION APIs
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[22] = {
  n: 22,

  kicker: "PART 4 • NODE & EXPRESS • LEVEL 22",

  title: "Express Authentication, Security & Production APIs",

  summary:
    "Learn how real Express APIs protect users and application resources. Understand password hashing, authentication, authorization, JWT concepts, cookies, CORS, security headers, rate limiting, environment variables, secure API design, and production-ready security practices.",

  duration: "4–5 Hours",

  difficulty: "Intermediate",

  concepts: 16,

  outcomes: [
    "Understand authentication and authorization in a real API.",
    "Understand why passwords must never be stored as plain text.",
    "Understand password hashing and verification.",
    "Understand sessions and token-based authentication.",
    "Understand JWT structure and lifecycle.",
    "Build authentication middleware concepts.",
    "Protect private Express routes.",
    "Implement role-based authorization concepts.",
    "Understand cookies and secure cookie settings.",
    "Understand CORS and cross-origin requests.",
    "Understand security headers.",
    "Understand rate limiting and brute-force protection.",
    "Use environment variables for secrets and configuration.",
    "Design safer production API responses.",
    "Understand common Express security risks.",
    "Create a production security checklist."
  ],

  sections: [

    /* =====================================================
       SECTION 1
       ===================================================== */

    {
      number: 1,

      title: "Authentication vs Authorization",

      intro:
        "Authentication and authorization are two different security responsibilities. Authentication verifies identity, while authorization determines what an authenticated user can access or modify.",

      points: [
        "Authentication asks: Who are you?",
        "Authorization asks: What are you allowed to do?",
        "Authentication normally happens before authorization.",
        "A user can be authenticated but still lack permission.",
        "Protected APIs commonly use both."
      ],

      comparison: {
        title: "Two Security Questions",
        leftTitle: "Authentication",
        left: [
          "Verify identity",
          "Login credentials",
          "Session or token",
          "Identify user"
        ],
        rightTitle: "Authorization",
        right: [
          "Check permission",
          "Role or permission",
          "Access rules",
          "Allow or deny operation"
        ]
      },

      code: `app.get(
  "/admin/dashboard",
  authenticate,
  requireAdmin,
  (req, res) => {
    res.json({
      message: "Admin dashboard"
    });
  }
);`,

      keyIdea:
        "Authentication establishes identity; authorization determines what that identity is allowed to access."
    },

    /* =====================================================
       SECTION 2
       ===================================================== */

    {
      number: 2,

      title: "Why Passwords Must Be Hashed",

      intro:
        "Passwords are sensitive credentials. A secure application should never store users' original passwords directly in a database.",

      points: [
        "Plain-text passwords expose users if the database is compromised.",
        "Passwords should be transformed using a password hashing algorithm.",
        "A hash is designed to be difficult to reverse.",
        "Password verification compares a supplied password against the stored hash.",
        "Modern password hashing should use an established password-hashing algorithm."
      ],

      comparison: {
        title: "Password Storage",
        leftTitle: "Unsafe",
        left: [
          "password: myPassword123",
          "Original password stored",
          "High exposure risk"
        ],
        rightTitle: "Safer",
        right: [
          "passwordHash: hashed value",
          "Original password not stored",
          "Verify against hash"
        ]
      },

      code: `const password = req.body.password;

const passwordHash = await hashPassword(password);

const user = {
  email: req.body.email,
  passwordHash: passwordHash
};`,

      keyIdea:
        "Store password hashes rather than original passwords, and use a trusted password-hashing implementation."
    },

    /* =====================================================
       SECTION 3
       ===================================================== */

    {
      number: 3,

      title: "Password Hashing and Verification",

      intro:
        "During registration, an application hashes the password before storing it. During login, the supplied password is checked against the stored hash.",

      points: [
        "Registration creates a password hash.",
        "The hash is stored in the database.",
        "Login receives the user's password.",
        "The password is compared with the stored hash.",
        "A successful comparison allows authentication to continue.",
        "The application should not store the original password."
      ],

      code: `const registerUser = async (password) => {
  const passwordHash = await hashPassword(password);

  return {
    passwordHash: passwordHash
  };
};

const loginUser = async (password, storedHash) => {
  const valid = await verifyPassword(
    password,
    storedHash
  );

  return valid;
};`,

      keyIdea:
        "Hashing happens before storage; verification happens during login."
    },

    /* =====================================================
       SECTION 4
       ===================================================== */

    {
      number: 4,

      title: "Session-Based Authentication",

      intro:
        "In session-based authentication, the server keeps authentication state on the server side and gives the client a session identifier.",

      points: [
        "The user logs in with credentials.",
        "The server verifies the credentials.",
        "The server creates a session.",
        "The client receives a session identifier, commonly through a cookie.",
        "Future requests use the session identifier.",
        "The server looks up the session and identifies the user."
      ],

      code: `app.post("/login", async (req, res) => {
  const user = await findUser(req.body.email);

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const valid = await verifyPassword(
    req.body.password,
    user.passwordHash
  );

  if (!valid) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const sessionId = await createSession(user.id);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
  });

  res.json({
    message: "Login successful"
  });
});`,

      keyIdea:
        "Session authentication keeps session state on the server and identifies the client using a session identifier."
    },

    /* =====================================================
       SECTION 5
       ===================================================== */

    {
      number: 5,

      title: "Token-Based Authentication",

      intro:
        "In token-based authentication, the server issues a token after successful login. The client sends the token with later requests.",

      points: [
        "The client submits login credentials.",
        "The server verifies the credentials.",
        "The server creates an authentication token.",
        "The client sends the token on protected requests.",
        "Middleware verifies the token.",
        "The authenticated user becomes available to the request."
      ],

      code: `app.post("/login", async (req, res) => {
  const user = await authenticateUser(
    req.body.email,
    req.body.password
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const token = createAccessToken({
    userId: user.id
  });

  res.json({
    accessToken: token
  });
});`,

      comparison: {
        title: "Authentication Models",
        leftTitle: "Session",
        left: [
          "Server stores session",
          "Client sends session ID",
          "Commonly uses cookies"
        ],
        rightTitle: "Token",
        right: [
          "Client sends token",
          "Server verifies token",
          "Common in APIs"
        ]
      },

      keyIdea:
        "Both sessions and tokens can support authenticated APIs; the correct choice depends on application architecture and security requirements."
    },

    /* =====================================================
       SECTION 6
       ===================================================== */

    {
      number: 6,

      title: "JWT Fundamentals",

      intro:
        "JSON Web Token, commonly called JWT, is a compact token format frequently used for authentication and authorization in APIs.",

      points: [
        "A JWT contains encoded claims.",
        "A JWT commonly has header, payload, and signature parts.",
        "The signature helps detect unauthorized modification.",
        "The payload should not contain sensitive secrets.",
        "Token expiration should be considered.",
        "The server must verify tokens before trusting their claims."
      ],

      code: `const tokenPayload = {
  sub: user.id,
  role: user.role
};

const token = createSignedJwt(
  tokenPayload,
  process.env.JWT_SECRET
);`,

      comparison: {
        title: "JWT Components",
        leftTitle: "Header",
        left: [
          "Token metadata",
          "Algorithm information"
        ],
        rightTitle: "Payload + Signature",
        right: [
          "Claims",
          "User identifier",
          "Signature for integrity"
        ]
      },

      keyIdea:
        "JWTs are signed tokens containing claims. Encoding is not encryption, so sensitive information should not be placed in the payload."
    },

    /* =====================================================
       SECTION 7
       ===================================================== */

    {
      number: 7,

      title: "JWT Authentication Middleware",

      intro:
        "Protected routes can use middleware to extract and verify an access token before the controller executes.",

      points: [
        "Read the Authorization header.",
        "Check the expected Bearer token format.",
        "Verify the token signature.",
        "Check expiration and relevant claims.",
        "Attach authenticated user information to req.",
        "Call next() when verification succeeds."
      ],

      code: `const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  const token = header.replace(
    "Bearer ",
    ""
  );

  try {
    const payload = verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};

app.get("/profile", authenticate, (req, res) => {
  res.json({
    user: req.user
  });
});`,

      keyIdea:
        "Authentication middleware creates a security boundary before protected application logic executes."
    },

    /* =====================================================
       SECTION 8
       ===================================================== */

    {
      number: 8,

      title: "Role-Based Authorization",

      intro:
        "After authentication, an application can check a user's role or permissions before allowing a sensitive operation.",

      points: [
        "The authentication layer identifies the user.",
        "The authorization layer checks permissions.",
        "Roles can represent broad access groups.",
        "Fine-grained permissions can provide more precise control.",
        "Authorization should be enforced on the server."
      ],

      code: `const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        error: "Access forbidden"
      });
    }

    next();
  };
};

app.delete(
  "/users/:id",
  authenticate,
  requireRole("admin"),
  deleteUser
);`,

      keyIdea:
        "Never rely only on frontend controls for authorization. The server must enforce access rules."
    },

    /* =====================================================
       SECTION 9
       ===================================================== */

    {
      number: 9,

      title: "Cookies and Secure Cookie Settings",

      intro:
        "Cookies can store session identifiers or other client-side state. Security-related cookie options reduce common attack risks.",

      points: [
        "HttpOnly prevents normal JavaScript access to the cookie.",
        "Secure instructs browsers to send the cookie over HTTPS.",
        "SameSite controls cross-site cookie behavior.",
        "Cookie expiration should be appropriate for the use case.",
        "Sensitive authentication cookies should be configured carefully."
      ],

      code: `res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60
});`,

      comparison: {
        title: "Important Cookie Flags",
        leftTitle: "HttpOnly",
        left: [
          "Blocks normal JavaScript access",
          "Useful for session cookies"
        ],
        rightTitle: "Secure + SameSite",
        right: [
          "Secure requires HTTPS",
          "SameSite controls cross-site sending"
        ]
      },

      keyIdea:
        "Cookie security settings should match the application's authentication model and deployment environment."
    },

    /* =====================================================
       SECTION 10
       ===================================================== */

    {
      number: 10,

      title: "CORS",

      intro:
        "Cross-Origin Resource Sharing, or CORS, controls whether browsers are allowed to make requests from one origin to another origin.",

      points: [
        "An origin includes scheme, host, and port.",
        "Browsers enforce same-origin security rules.",
        "CORS allows a server to declare permitted cross-origin requests.",
        "Do not allow every origin automatically in a sensitive production API.",
        "Credentials require additional CORS configuration."
      ],

      code: `const cors = require("cors");

app.use(cors({
  origin: "https://codebhavya.com",
  credentials: true
}));`,

      comparison: {
        title: "Development vs Production",
        leftTitle: "Development",
        left: [
          "Frontend may use localhost",
          "Backend may use another port",
          "CORS often required"
        ],
        rightTitle: "Production",
        right: [
          "Explicit trusted origins",
          "HTTPS",
          "Careful credential settings"
        ]
      },

      keyIdea:
        "CORS is primarily a browser security mechanism. Configure allowed origins deliberately rather than treating CORS as authentication."
    },

    /* =====================================================
       SECTION 11
       ===================================================== */

    {
      number: 11,

      title: "Security Headers",

      intro:
        "HTTP security headers allow a server to communicate security-related policies to browsers. Express applications can use established middleware for commonly needed headers.",

      points: [
        "Security headers can reduce certain browser-based attack risks.",
        "Helmet is a commonly used Express middleware package.",
        "Headers should be configured according to the application.",
        "Security headers complement, rather than replace, input validation and authentication."
      ],

      code: `const helmet = require("helmet");

app.use(helmet());`,

      keyIdea:
        "Security headers provide another layer of defense and should be combined with secure application design."
    },

    /* =====================================================
       SECTION 12
       ===================================================== */

    {
      number: 12,

      title: "Rate Limiting and Brute-Force Protection",

      intro:
        "Public APIs can receive large numbers of requests. Rate limiting restricts repeated requests and can reduce abuse such as automated login attempts.",

      points: [
        "Rate limiting can restrict requests per IP or other identifier.",
        "Authentication endpoints often need stronger protections.",
        "Rate limits should be chosen based on legitimate traffic.",
        "Distributed deployments may require a shared store.",
        "Rate limiting is one layer of abuse prevention."
      ],

      code: `const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    error: "Too many login attempts"
  }
});

app.use("/login", loginLimiter);`,

      comparison: {
        title: "Rate Limiting",
        leftTitle: "Without Limits",
        left: [
          "Repeated requests",
          "Credential guessing",
          "Resource abuse"
        ],
        rightTitle: "With Limits",
        right: [
          "Requests restricted",
          "Abuse becomes harder",
          "Server resources protected"
        ]
      },

      keyIdea:
        "Rate limiting reduces repeated automated requests but should be combined with other authentication and abuse-prevention controls."
    },

    /* =====================================================
       SECTION 13
       ===================================================== */

    {
      number: 13,

      title: "Environment Variables and Secrets",

      intro:
        "Secrets and environment-specific configuration should not be hard-coded directly into application source code.",

      points: [
        "Database credentials should not be committed to Git.",
        "JWT signing secrets should be stored securely.",
        "API keys should not be exposed in source control.",
        "Environment variables can hold configuration.",
        "Production secret management systems can provide stronger controls."
      ],

      code: `const PORT = process.env.PORT || 3000;

const DATABASE_URL = process.env.DATABASE_URL;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

app.listen(PORT);`,

      comparison: {
        title: "Configuration",
        leftTitle: "Bad Practice",
        left: [
          'JWT_SECRET = "my-secret"',
          "Credentials in source",
          "Secrets committed to Git"
        ],
        rightTitle: "Better Practice",
        right: [
          "process.env.JWT_SECRET",
          "Secret outside source",
          "Environment-specific values"
        ]
      },

      keyIdea:
        "Treat secrets as configuration, not source code."
    },

    /* =====================================================
       SECTION 14
       ===================================================== */

    {
      number: 14,

      title: "Common Express Security Risks",

      intro:
        "Security is not one feature. A production API must defend multiple boundaries including input, authentication, authorization, dependencies, configuration, and error handling.",

      points: [
        "Never trust client input.",
        "Validate and sanitize data according to the application's needs.",
        "Protect authentication endpoints.",
        "Use HTTPS in production.",
        "Keep dependencies updated.",
        "Avoid exposing sensitive error information.",
        "Do not commit secrets.",
        "Enforce authorization on the server.",
        "Use secure cookie configuration when cookies are used."
      ],

      comparison: {
        title: "Security Boundary",
        leftTitle: "Client Input",
        left: [
          "Validate",
          "Normalize where appropriate",
          "Reject invalid data"
        ],
        rightTitle: "Server",
        right: [
          "Authenticate",
          "Authorize",
          "Protect secrets",
          "Handle errors safely"
        ]
      },

      code: `app.post(
  "/users",
  validateUser,
  async (req, res, next) => {
    try {
      const user = await createUser(req.body);

      res.status(201).json({
        id: user.id,
        message: "User created"
      });
    } catch (error) {
      next(error);
    }
  }
);`,

      keyIdea:
        "Security should be designed as multiple defensive layers rather than a single middleware function."
    },

    /* =====================================================
       SECTION 15
       ===================================================== */

    {
      number: 15,

      title: "Secure API Error Responses",

      intro:
        "Error responses should help clients understand expected failures without revealing internal implementation details.",

      points: [
        "Do not expose stack traces to normal production clients.",
        "Avoid returning database credentials or internal configuration.",
        "Use consistent error formats.",
        "Log detailed errors on the server.",
        "Return appropriate status codes."
      ],

      code: `app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});`,

      comparison: {
        title: "Error Handling",
        leftTitle: "Internal Log",
        left: [
          "Detailed error",
          "Stack information",
          "Debugging context"
        ],
        rightTitle: "Client Response",
        right: [
          "Safe message",
          "Correct status",
          "No sensitive internals"
        ]
      },

      keyIdea:
        "Developers need detailed server-side logs, while clients generally need safe and predictable error responses."
    },

    /* =====================================================
       SECTION 16
       ===================================================== */

    {
      number: 16,

      title: "Production API Security Checklist",

      intro:
        "Before deploying an Express API, review authentication, authorization, transport security, configuration, dependencies, error handling, and abuse protection.",

      points: [
        "Use HTTPS.",
        "Hash passwords with an established password-hashing algorithm.",
        "Protect private routes.",
        "Enforce authorization on the server.",
        "Validate incoming data.",
        "Use secure cookie settings when cookies are used.",
        "Configure CORS deliberately.",
        "Use appropriate security headers.",
        "Apply rate limits where appropriate.",
        "Keep secrets outside source code.",
        "Keep dependencies updated.",
        "Avoid exposing sensitive error information.",
        "Monitor important application events."
      ],

      code: `Production Security Checklist

[ ] HTTPS enabled
[ ] Passwords hashed
[ ] Authentication implemented
[ ] Authorization enforced
[ ] Input validation enabled
[ ] Secure cookies configured
[ ] CORS configured
[ ] Security headers enabled
[ ] Rate limiting configured
[ ] Secrets stored securely
[ ] Dependencies reviewed
[ ] Safe error responses
[ ] Logging and monitoring enabled`,

      keyIdea:
        "Production security is a combination of secure defaults, careful configuration, defensive programming, and continuous maintenance."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
     ========================================================= */

  visualizer: {

    title: "Secure Express Authentication Pipeline",

    description:
      "Follow a login request from the client through validation, password verification, token creation, authentication middleware, authorization, and a protected API response.",

    steps: [
      {
        title: "1. Login Request",
        operation: "POST /login",
        detail:
          "The client sends login credentials to the authentication endpoint."
      },
      {
        title: "2. Input Validation",
        operation: "validateLogin(req, res, next)",
        detail:
          "The server checks that required login fields have valid formats."
      },
      {
        title: "3. Find User",
        operation: "findUser(email)",
        detail:
          "The application retrieves the account associated with the supplied identifier."
      },
      {
        title: "4. Verify Password",
        operation: "verifyPassword(password, hash)",
        detail:
          "The supplied password is checked against the stored password hash."
      },
      {
        title: "5. Create Token",
        operation: "createAccessToken(user)",
        detail:
          "After successful authentication, the server creates an access token."
      },
      {
        title: "6. Protected Request",
        operation: "GET /profile",
        detail:
          "The client sends the access token with a later protected request."
      },
      {
        title: "7. Authentication Middleware",
        operation: "verifyAccessToken(token)",
        detail:
          "The middleware verifies the token and attaches trusted user information to req."
      },
      {
        title: "8. Authorization",
        operation: "requireRole('user')",
        detail:
          "The server checks whether the authenticated user has the required permission."
      },
      {
        title: "9. Controller",
        operation: "getProfile(req, res)",
        detail:
          "The protected controller executes only after the security checks pass."
      },
      {
        title: "10. Response",
        operation: "HTTP 200",
        detail:
          "The server returns the requested protected resource."
      }
    ]
  },

  /* =========================================================
     REQUEST TRACE
     ========================================================= */

  trace: {

    title: "Trace a Protected API Request",

    lines: [
      {
        line: 1,
        code: "app.get('/profile', authenticate, getProfile);"
      },
      {
        line: 2,
        code: "const authenticate = (req, res, next) => {"
      },
      {
        line: 3,
        code: "  const header = req.headers.authorization;"
      },
      {
        line: 4,
        code: "  if (!header) {"
      },
      {
        line: 5,
        code: "    return res.status(401).json({ error: 'Authentication required' });"
      },
      {
        line: 6,
        code: "  }"
      },
      {
        line: 7,
        code: "  const token = header.replace('Bearer ', '');"
      },
      {
        line: 8,
        code: "  const payload = verifyAccessToken(token);"
      },
      {
        line: 9,
        code: "  req.user = payload;"
      },
      {
        line: 10,
        code: "  next();"
      },
      {
        line: 11,
        code: "};"
      },
      {
        line: 12,
        code: "const getProfile = (req, res) => {"
      },
      {
        line: 13,
        code: "  res.json({ user: req.user });"
      },
      {
        line: 14,
        code: "};"
      }
    ],

    steps: [
      {
        line: 1,
        state: "Protected route selected",
        explain:
          "The request must pass authenticate before getProfile can execute."
      },
      {
        line: 2,
        state: "Authentication starts",
        explain:
          "The authentication middleware begins processing the request."
      },
      {
        line: 3,
        state: "Read Authorization",
        explain:
          "The middleware checks the Authorization request header."
      },
      {
        line: 4,
        state: "Credential check",
        explain:
          "The server checks whether authentication information exists."
      },
      {
        line: 5,
        state: "401 if missing",
        explain:
          "Without credentials, the protected request is rejected."
      },
      {
        line: 6,
        state: "Continue",
        explain:
          "A request with authentication information continues."
      },
      {
        line: 7,
        state: "Extract token",
        explain:
          "The Bearer prefix is removed so the token can be verified."
      },
      {
        line: 8,
        state: "Verify token",
        explain:
          "The server verifies the token before trusting its claims."
      },
      {
        line: 9,
        state: "Attach user",
        explain:
          "Verified user information is attached to req.user."
      },
      {
        line: 10,
        state: "next()",
        explain:
          "Control moves to the protected controller."
      },
      {
        line: 11,
        state: "Authentication complete",
        explain:
          "The authentication middleware has finished."
      },
      {
        line: 12,
        state: "Controller starts",
        explain:
          "The protected controller can now use the authenticated user."
      },
      {
        line: 13,
        state: "Protected response",
        explain:
          "The API sends the authenticated user's profile information."
      },
      {
        line: 14,
        state: "Request complete",
        explain:
          "The protected API request has completed successfully."
      }
    ]
  },

  /* =========================================================
     REVISION
     ========================================================= */

  revision: [
    [
      "Authentication",
      "Verifying the identity of a requester."
    ],
    [
      "Authorization",
      "Checking what an authenticated user is allowed to do."
    ],
    [
      "Password Hash",
      "A derived representation of a password used for secure verification."
    ],
    [
      "Session",
      "Server-side authentication state associated with a session identifier."
    ],
    [
      "Token Authentication",
      "An authentication approach where the client sends an access token with requests."
    ],
    [
      "JWT",
      "A signed token format commonly used to carry authentication claims."
    ],
    [
      "JWT Payload",
      "The claims section of a JWT; it is encoded, not automatically encrypted."
    ],
    [
      "Bearer Token",
      "A token presented in the Authorization header using the Bearer scheme."
    ],
    [
      "HttpOnly",
      "A cookie attribute that prevents normal client-side JavaScript access."
    ],
    [
      "Secure Cookie",
      "A cookie configured to be sent over secure HTTPS connections."
    ],
    [
      "SameSite",
      "A cookie attribute controlling cross-site cookie sending behavior."
    ],
    [
      "CORS",
      "A browser mechanism controlling permitted cross-origin requests."
    ],
    [
      "Rate Limiting",
      "Restricting repeated requests within a defined period."
    ],
    [
      "Environment Variable",
      "Configuration supplied outside application source code."
    ],
    [
      "Security Headers",
      "HTTP response headers that communicate browser security policies."
    ],
    [
      "HTTPS",
      "HTTP protected by TLS encryption."
    ]
  ],

  /* =========================================================
     INTERVIEW
     ========================================================= */

  interview: [

    {
      question: "What is the difference between authentication and authorization?",
      answer:
        "Authentication verifies identity, while authorization determines what an authenticated user is permitted to access or modify."
    },

    {
      question: "Why should passwords never be stored in plain text?",
      answer:
        "Plain-text passwords expose the original credentials if the database or backup is compromised. Applications should store password hashes instead."
    },

    {
      question: "What is password hashing?",
      answer:
        "Password hashing transforms a password into a derived value using a password-hashing algorithm so the original password does not need to be stored."
    },

    {
      question: "What is a JWT?",
      answer:
        "JWT is a compact signed token format that can carry claims such as a user identifier and role."
    },

    {
      question: "Is JWT payload data encrypted?",
      answer:
        "Not by default. JWT payloads are commonly encoded so they can be represented as token data, but encoding does not provide secrecy."
    },

    {
      question: "What is the purpose of authentication middleware?",
      answer:
        "It verifies authentication information before allowing a request to reach protected application logic."
    },

    {
      question: "What does a 401 response normally indicate?",
      answer:
        "It commonly indicates that authentication is required or that the supplied authentication credentials are invalid."
    },

    {
      question: "What does a 403 response normally indicate?",
      answer:
        "It commonly indicates that the server understood the request but the authenticated requester is not permitted to perform the operation."
    },

    {
      question: "What is CORS?",
      answer:
        "CORS is a browser security mechanism that allows servers to specify which cross-origin browser requests are permitted."
    },

    {
      question: "Why are HttpOnly cookies useful?",
      answer:
        "HttpOnly prevents normal client-side JavaScript from reading the cookie, which can reduce exposure of cookie-based session identifiers to certain script-based attacks."
    },

    {
      question: "Why use rate limiting?",
      answer:
        "Rate limiting restricts repeated requests and can reduce automated abuse such as excessive login attempts."
    },

    {
      question: "Why should secrets be stored in environment variables or a secret manager?",
      answer:
        "This keeps sensitive configuration out of application source code and allows different environments to use different secret values."
    },

    {
      question: "Should authorization be implemented only in the frontend?",
      answer:
        "No. Frontend controls improve user experience but cannot enforce security. The server must enforce authorization."
    },

    {
      question: "Why should production error responses avoid stack traces?",
      answer:
        "Detailed internal errors can reveal implementation information that should remain available only to trusted server-side logs."
    }
  ],

  /* =========================================================
     PRACTICE
     ========================================================= */

  practice: [

    {
      title: "Authentication Middleware",

      task:
        "Create middleware that checks for an Authorization header and returns 401 when it is missing.",

      hint:
        "Read req.headers.authorization and use return before res.status().json().",

      answer:
        'const authenticate = (req, res, next) => {\n  const header = req.headers.authorization;\n\n  if (!header) {\n    return res.status(401).json({\n      error: "Authentication required"\n    });\n  }\n\n  next();\n};'
    },

    {
      title: "Admin Authorization",

      task:
        "Create middleware that allows only users whose role is admin.",

      hint:
        "Check req.user.role.",

      answer:
        'const requireAdmin = (req, res, next) => {\n  if (!req.user || req.user.role !== "admin") {\n    return res.status(403).json({\n      error: "Access forbidden"\n    });\n  }\n\n  next();\n};'
    },

    {
      title: "Secure Cookie",

      task:
        "Create a session cookie using HttpOnly, Secure, and SameSite settings.",

      hint:
        "Use res.cookie().",

      answer:
        'res.cookie("sessionId", sessionId, {\n  httpOnly: true,\n  secure: true,\n  sameSite: "lax"\n});'
    },

    {
      title: "Environment Configuration",

      task:
        "Read PORT and JWT_SECRET from environment variables.",

      hint:
        "Use process.env.",

      answer:
        'const PORT = process.env.PORT || 3000;\nconst JWT_SECRET = process.env.JWT_SECRET;\n\nif (!JWT_SECRET) {\n  throw new Error("JWT_SECRET is not configured");\n}'
    },

    {
      title: "CORS Configuration",

      task:
        "Configure CORS so that only a trusted frontend origin is allowed.",

      hint:
        "Use the cors package and specify origin.",

      answer:
        'const cors = require("cors");\n\napp.use(cors({\n  origin: "https://codebhavya.com",\n  credentials: true\n}));'
    },

    {
      title: "Protected Route",

      task:
        "Create a GET /profile route protected by authentication middleware.",

      hint:
        "Place authenticate before the route handler.",

      answer:
        'app.get("/profile", authenticate, (req, res) => {\n  res.json({\n    user: req.user\n  });\n});'
    }
  ],

  /* =========================================================
     QUIZ
     ========================================================= */

  quiz: [

    {
      question: "What does authentication verify?",
      options: [
        "Database structure",
        "User identity",
        "CSS rules",
        "API performance"
      ],
      answer: 1,
      explanation:
        "Authentication verifies the identity of the requester."
    },

    {
      question: "What does authorization determine?",
      options: [
        "What the user is allowed to do",
        "The user's password",
        "The server port",
        "The database engine"
      ],
      answer: 0,
      explanation:
        "Authorization determines what an authenticated user is permitted to access or modify."
    },

    {
      question: "How should passwords normally be stored?",
      options: [
        "Plain text",
        "In the URL",
        "As password hashes",
        "Inside HTML"
      ],
      answer: 2,
      explanation:
        "Applications should store password hashes rather than original passwords."
    },

    {
      question: "What is JWT commonly used for?",
      options: [
        "Styling",
        "Authentication and authorization claims",
        "Database indexing",
        "Image compression"
      ],
      answer: 1,
      explanation:
        "JWTs are commonly used to carry signed authentication-related claims."
    },

    {
      question: "Is a JWT payload automatically encrypted?",
      options: [
        "Yes",
        "No",
        "Only in development",
        "Only in Chrome"
      ],
      answer: 1,
      explanation:
        "JWT encoding does not automatically provide encryption or secrecy."
    },

    {
      question: "Which cookie attribute prevents normal JavaScript access?",
      options: [
        "Secure",
        "HttpOnly",
        "SameSite",
        "ExpiresOnly"
      ],
      answer: 1,
      explanation:
        "HttpOnly prevents normal client-side JavaScript from accessing the cookie."
    },

    {
      question: "What is CORS primarily related to?",
      options: [
        "Browser cross-origin requests",
        "Password hashing",
        "Database backups",
        "CPU scheduling"
      ],
      answer: 0,
      explanation:
        "CORS controls permitted cross-origin browser requests."
    },

    {
      question: "Which status commonly means authentication is required or invalid?",
      options: [
        "201",
        "204",
        "401",
        "503"
      ],
      answer: 2,
      explanation:
        "401 is commonly used when authentication is required or invalid."
    },

    {
      question: "Which status commonly represents forbidden access?",
      options: [
        "200",
        "301",
        "403",
        "404"
      ],
      answer: 2,
      explanation:
        "403 commonly indicates that the requester is not permitted to perform the operation."
    },

    {
      question: "Why is rate limiting useful?",
      options: [
        "To style APIs",
        "To restrict repeated requests",
        "To create database tables",
        "To compile JavaScript"
      ],
      answer: 1,
      explanation:
        "Rate limiting restricts repeated requests and can reduce automated abuse."
    },

    {
      question: "Where should secrets such as JWT signing keys be stored?",
      options: [
        "Public HTML",
        "GitHub README",
        "Secure configuration or secret storage",
        "Browser URL"
      ],
      answer: 2,
      explanation:
        "Secrets should be kept outside source code using secure configuration or secret-management systems."
    },

    {
      question: "Where must authorization be enforced?",
      options: [
        "Only in CSS",
        "Only in the browser",
        "On the server",
        "Only in documentation"
      ],
      answer: 2,
      explanation:
        "The server must enforce authorization because frontend checks can be bypassed."
    },

    {
      question: "Which middleware is commonly used for security headers in Express?",
      options: [
        "helmet",
        "securityHeadersOnly",
        "secureExpressCSS",
        "headerParser"
      ],
      answer: 0,
      explanation:
        "Helmet is a commonly used Express middleware package for security-related HTTP headers."
    }
  ],

  /* =========================================================
     GLOSSARY
     ========================================================= */

  glossary: [

    {
      term: "Authentication",
      definition:
        "Verification of a user's identity."
    },

    {
      term: "Authorization",
      definition:
        "Checking whether an authenticated user has permission to perform an operation."
    },

    {
      term: "Password Hash",
      definition:
        "A derived representation of a password used for secure verification."
    },

    {
      term: "Session",
      definition:
        "Server-side authentication state associated with a session identifier."
    },

    {
      term: "Access Token",
      definition:
        "A credential presented by a client to access protected API resources."
    },

    {
      term: "JWT",
      definition:
        "A compact signed token format commonly used for carrying authentication claims."
    },

    {
      term: "Claim",
      definition:
        "A piece of information represented inside a token payload."
    },

    {
      term: "Bearer Token",
      definition:
        "An access token sent using the Bearer authentication scheme."
    },

    {
      term: "HttpOnly",
      definition:
        "A cookie attribute that prevents normal client-side JavaScript access."
    },

    {
      term: "Secure Cookie",
      definition:
        "A cookie configured to be transmitted only over secure HTTPS connections."
    },

    {
      term: "SameSite",
      definition:
        "A cookie attribute controlling cross-site cookie behavior."
    },

    {
      term: "CORS",
      definition:
        "A browser mechanism for controlling permitted cross-origin requests."
    },

    {
      term: "Rate Limiting",
      definition:
        "Restricting the number of requests allowed within a defined time period."
    },

    {
      term: "Security Header",
      definition:
        "An HTTP response header that communicates security-related browser policies."
    },

    {
      term: "Environment Variable",
      definition:
        "Configuration supplied outside application source code."
    },

    {
      term: "HTTPS",
      definition:
        "HTTP communication protected by TLS."
    }
  ],

  /* =========================================================
     COMPLETION
     ========================================================= */

  completion: {

    title: "Level 22 Complete — Express Authentication, Security & Production APIs",

    message:
      "You now understand the major security boundaries of an Express API: authentication, authorization, password hashing, sessions, tokens, JWT concepts, secure cookies, CORS, security headers, rate limiting, environment configuration, safe errors, and production security practices.",

    achievements: [
      "Authentication fundamentals",
      "Authorization fundamentals",
      "Password hashing",
      "Password verification",
      "Session authentication",
      "Token authentication",
      "JWT fundamentals",
      "Authentication middleware",
      "Role-based authorization",
      "Secure cookies",
      "CORS",
      "Security headers",
      "Rate limiting",
      "Environment variables",
      "API security risks",
      "Production security checklist"
    ],

    nextLevel:
      "Level 23 — Express Production APIs, Testing & Deployment"
  }
};
