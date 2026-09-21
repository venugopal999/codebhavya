"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[26] = {
  n: 26,
  kicker: "PART 5 • MONGODB • LEVEL 26",
  title: "Mongoose, Relationships & Transactions",
  summary:
    "Connect MongoDB to Node and Express professionally using Mongoose schemas, models, validation, relationships, populate, middleware, indexes, sessions and transactions.",
  duration: "75–90 min",
  difficulty: "Intermediate",
  concepts: 17,

  outcomes: [
    "Understand why Mongoose is commonly used with Node.js and MongoDB.",
    "Create Mongoose connections, schemas and models.",
    "Use schema types, defaults, timestamps and validation rules.",
    "Perform CRUD operations with Mongoose.",
    "Build efficient queries using select, sort, limit and lean.",
    "Model references and relationships using ObjectId and populate().",
    "Understand one-to-one, one-to-many and many-to-many relationships.",
    "Choose between embedded and referenced documents.",
    "Use Mongoose middleware and hooks.",
    "Understand MongoDB sessions and transactions.",
    "Handle validation and duplicate-key errors safely.",
    "Design a clean MongoDB/Mongoose data layer for a MERN application."
  ],

  sections: [
    {
      number: 1,
      title: "What is Mongoose?",
      intro:
        "Mongoose is an ODM (Object Data Modeling) library that makes working with MongoDB easier from Node.js applications.",
      points: [
        "Mongoose provides schemas for defining the expected structure of documents.",
        "Models provide a convenient API for creating, reading, updating and deleting documents.",
        "Mongoose provides validation before data is stored.",
        "It supports relationships through references and populate().",
        "It provides middleware such as pre and post hooks.",
        "It works on top of the official MongoDB Node.js driver."
      ],
      comparison: {
        title: "MongoDB Driver vs Mongoose",
        headers: ["MongoDB Driver", "Mongoose"],
        rows: [
          ["Lower-level database API", "Higher-level ODM"],
          ["No enforced schema by default", "Schemas can define structure"],
          ["Manual validation is common", "Built-in schema validation"],
          ["Direct MongoDB operations", "Models and document methods"],
          ["More control", "More application-level convenience"]
        ]
      },
      code: `const mongoose = require("mongoose");

console.log("Mongoose version:", mongoose.version);`,
      keyIdea:
        "Mongoose does not replace MongoDB. It provides a structured application layer for working with MongoDB."
    },

    {
      number: 2,
      title: "MongoDB Driver vs Mongoose",
      intro:
        "The official MongoDB driver communicates directly with MongoDB, while Mongoose adds schemas, models, validation and additional application-level features.",
      points: [
        "The MongoDB driver is useful when you want direct database control.",
        "Mongoose is useful when application data has predictable structures.",
        "Mongoose models are built from schemas.",
        "Mongoose validation can catch invalid data before save operations.",
        "Both approaches ultimately communicate with MongoDB."
      ],
      code: `// MongoDB Driver style
const result = await db.collection("students").findOne({
  email: "student@example.com"
});

// Mongoose style
const student = await Student.findOne({
  email: "student@example.com"
});`,
      keyIdea:
        "Choose the abstraction level that fits the application. Mongoose is especially useful for structured MERN applications."
    },

    {
      number: 3,
      title: "Connecting Mongoose",
      intro:
        "A Node.js application must establish a connection to MongoDB before performing database operations.",
      points: [
        "mongoose.connect() returns a promise.",
        "The connection string should normally come from an environment variable.",
        "Never hard-code production database credentials.",
        "A centralized database connection module keeps the project organized.",
        "Applications should handle connection failures gracefully."
      ],
      code: `const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;`,
      keyIdea:
        "Keep database configuration separate from application logic and protect connection credentials."
    },

    {
      number: 4,
      title: "Mongoose Schemas",
      intro:
        "A schema describes the structure, types, validation rules and behavior of documents handled by a Mongoose model.",
      points: [
        "Schemas define fields and their types.",
        "Schemas can define required fields.",
        "Schemas can define default values.",
        "Schemas can define validation rules.",
        "Schemas can define indexes.",
        "Schemas can enable timestamps.",
        "Schemas can define middleware and custom methods."
      ],
      code: `const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  age: {
    type: Number
  }
});

module.exports = studentSchema;`,
      keyIdea:
        "A schema describes how your application expects a MongoDB document to look."
    },

    {
      number: 5,
      title: "Mongoose Models",
      intro:
        "A model is created from a schema and provides the interface used by application code to interact with a MongoDB collection.",
      points: [
        "mongoose.model() creates a model.",
        "A model is normally associated with a collection.",
        "Models provide CRUD methods.",
        "Models can be imported into controllers and services.",
        "A model represents a particular type of application data."
      ],
      code: `const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Student = mongoose.model(
  "Student",
  studentSchema
);

module.exports = Student;`,
      keyIdea:
        "Schema defines structure; model provides the application interface for working with that structure."
    },

    {
      number: 6,
      title: "Schema Types, Defaults & Timestamps",
      intro:
        "Mongoose supports common MongoDB-related data types and can automatically maintain creation and update timestamps.",
      points: [
        "Common types include String, Number, Boolean, Date, Array and ObjectId.",
        "Default values can automatically populate missing fields.",
        "timestamps: true adds createdAt and updatedAt.",
        "Enums can restrict a field to known values.",
        "Schema types can contain additional configuration."
      ],
      code: `const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);`,
      keyIdea:
        "Use schema configuration to keep predictable data rules close to the data model."
    },

    {
      number: 7,
      title: "Mongoose Validation",
      intro:
        "Validation prevents invalid application data from being stored through Mongoose operations that trigger validation.",
      points: [
        "required ensures important fields are present.",
        "min and max can constrain numeric values.",
        "minLength and maxLength can constrain strings.",
        "enum restricts values to a defined list.",
        "match can validate strings using regular expressions.",
        "Custom validators can implement application-specific rules."
      ],
      code: `const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },

  age: {
    type: Number,
    min: 18,
    max: 100
  },

  role: {
    type: String,
    enum: ["student", "teacher"]
  }
});`,
      keyIdea:
        "Validation belongs at multiple layers, but Mongoose validation provides an important protection at the data-model layer."
    },

    {
      number: 8,
      title: "Create & Read with Mongoose",
      intro:
        "Mongoose models provide several methods for inserting and retrieving documents.",
      points: [
        "Model.create() can create a document.",
        "new Model() creates an in-memory document.",
        "save() persists a document.",
        "find() returns matching documents.",
        "findOne() returns one matching document.",
        "findById() searches by document ID."
      ],
      code: `const student = await Student.create({
  name: "Anita",
  email: "anita@example.com"
});

const students = await Student.find();

const oneStudent = await Student.findOne({
  email: "anita@example.com"
});

const byId = await Student.findById(student._id);`,
      keyIdea:
        "Mongoose CRUD methods return promises when used with async/await."
    },

    {
      number: 9,
      title: "Update & Delete with Mongoose",
      intro:
        "Mongoose provides several methods for updating and removing documents.",
      points: [
        "findByIdAndUpdate() updates a document by ID.",
        "findOneAndUpdate() updates a matching document.",
        "updateOne() updates the first matching document.",
        "updateMany() updates all matching documents.",
        "findByIdAndDelete() removes a document by ID.",
        "findOneAndDelete() removes one matching document."
      ],
      code: `const updated = await Student.findByIdAndUpdate(
  studentId,
  {
    age: 22
  },
  {
    new: true,
    runValidators: true
  }
);

await Student.findByIdAndDelete(studentId);`,
      keyIdea:
        "Use options such as new and runValidators deliberately when updating documents."
    },

    {
      number: 10,
      title: "Query Chaining, select, sort, limit & lean",
      intro:
        "Mongoose queries can be composed to retrieve only the data needed by the application.",
      points: [
        "select() chooses fields to return.",
        "sort() controls result ordering.",
        "limit() restricts the number of results.",
        "skip() can be used for pagination.",
        "lean() returns plain JavaScript objects instead of full Mongoose documents.",
        "Query chaining can make data retrieval precise and efficient."
      ],
      code: `const students = await Student.find({
  active: true
})
  .select("name email age")
  .sort({ name: 1 })
  .skip(20)
  .limit(10)
  .lean();`,
      keyIdea:
        "Retrieve only what the API needs. lean() is useful for read-heavy endpoints that do not require Mongoose document methods."
    },

    {
      number: 11,
      title: "References & populate()",
      intro:
        "MongoDB relationships can be represented using ObjectId references. Mongoose populate() can then replace referenced IDs with related documents.",
      points: [
        "A reference normally stores an ObjectId.",
        "ref identifies the related Mongoose model.",
        "populate() performs an additional query to retrieve related data.",
        "populate() can select only required fields.",
        "References are useful when related data changes independently."
      ],
      code: `const postSchema = new mongoose.Schema({
  title: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const posts = await Post.find()
  .populate("author", "name email")
  .lean();`,
      keyIdea:
        "References keep related documents separate while populate() provides a convenient way to retrieve related information."
    },

    {
      number: 12,
      title: "One-to-One, One-to-Many & Many-to-Many",
      intro:
        "Mongoose relationships are designed using references or embedded documents according to the application's data-access patterns.",
      points: [
        "One-to-one connects one document with one related document.",
        "One-to-many connects one document with many related documents.",
        "Many-to-many connects multiple documents on both sides.",
        "ObjectId references are commonly used for relationships.",
        "Large or independently changing related data is often kept in separate collections."
      ],
      comparison: {
        title: "Relationship Patterns",
        headers: ["Relationship", "Example", "Typical Design"],
        rows: [
          ["One-to-one", "User → Profile", "Reference or embed"],
          ["One-to-many", "User → Orders", "Order references User"],
          ["Many-to-many", "Students ↔ Courses", "References or linking collection"]
        ]
      },
      code: `const courseSchema = new mongoose.Schema({
  title: String
});

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
});`,
      keyIdea:
        "Model relationships around how the application reads and updates the data, not simply around how entities look on paper."
    },

    {
      number: 13,
      title: "Embedded vs Referenced Models",
      intro:
        "MongoDB supports both embedded documents and references. The correct choice depends on document size, update patterns and access requirements.",
      points: [
        "Embedding keeps related information inside the parent document.",
        "Embedding can make one-document reads very efficient.",
        "References avoid duplicating large or frequently changing data.",
        "References are useful when related entities have independent lifecycles.",
        "Very large arrays inside documents can become difficult to manage."
      ],
      comparison: {
        title: "Embedding vs Referencing",
        headers: ["Embedding", "Referencing"],
        rows: [
          ["Data stored together", "Data stored separately"],
          ["Fast single-document reads", "Flexible independent entities"],
          ["Can duplicate data", "Avoids unnecessary duplication"],
          ["Good for bounded related data", "Good for shared or growing data"],
          ["Atomic single-document updates", "May require multiple operations"]
        ]
      },
      code: `// Embedded
const userSchema = new mongoose.Schema({
  name: String,

  address: {
    city: String,
    state: String
  }
});

// Referenced
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});`,
      keyIdea:
        "Embedding and referencing are data-modeling decisions. Neither is universally better."
    },

    {
      number: 14,
      title: "Mongoose Middleware & Hooks",
      intro:
        "Middleware allows code to run before or after selected Mongoose operations.",
      points: [
        "pre hooks run before an operation.",
        "post hooks run after an operation.",
        "Hooks can be useful for reusable model-level behavior.",
        "A common example is preparing data before saving.",
        "Hooks should remain focused and predictable.",
        "Important business workflows should not become hidden inside excessive middleware."
      ],
      code: `const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

userSchema.pre("save", function(next) {
  this.email = this.email.toLowerCase();
  next();
});

userSchema.post("save", function(doc) {
  console.log("User saved:", doc._id);
});`,
      keyIdea:
        "Middleware is powerful, but excessive hidden behavior can make systems harder to understand and debug."
    },

    {
      number: 15,
      title: "Transactions & Sessions",
      intro:
        "MongoDB transactions allow multiple database operations to succeed or fail together. Mongoose exposes MongoDB sessions for transaction handling.",
      points: [
        "A session represents a sequence of database operations.",
        "Transactions are useful when several related writes must remain consistent.",
        "commitTransaction() confirms the transaction.",
        "abortTransaction() rolls back the transaction.",
        "endSession() releases the session.",
        "Transactions should be used when the business operation genuinely requires atomic multi-document changes."
      ],
      code: `const session = await mongoose.startSession();

try {
  session.startTransaction();

  await Account.updateOne(
    { _id: fromId },
    { $inc: { balance: -100 } },
    { session }
  );

  await Account.updateOne(
    { _id: toId },
    { $inc: { balance: 100 } },
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}`,
      keyIdea:
        "A transaction is useful when several related writes must behave like one atomic business operation."
    },

    {
      number: 16,
      title: "Indexes, Errors & Production Practices",
      intro:
        "A production Mongoose data layer needs thoughtful indexes, error handling and predictable database behavior.",
      points: [
        "Indexes should support real query patterns.",
        "Unique indexes can enforce uniqueness at the database level.",
        "Validation errors should be converted into clear API responses.",
        "Duplicate-key errors should be handled explicitly.",
        "Do not expose raw database errors to clients.",
        "Avoid creating unnecessary indexes.",
        "Monitor slow queries and review frequently used endpoints."
      ],
      code: `const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

try {
  await User.create({
    email: "existing@example.com"
  });
} catch (error) {
  if (error.code === 11000) {
    console.log("Duplicate email");
  } else if (error.name === "ValidationError") {
    console.log("Validation failed");
  } else {
    throw error;
  }
}`,
      keyIdea:
        "Schema validation improves application behavior, while database indexes and constraints provide important data-level protection."
    },

    {
      number: 17,
      title: "Designing a Practical MERN Data Layer",
      intro:
        "A professional MERN application should separate HTTP handling, business logic and database access.",
      points: [
        "Routes define API endpoints.",
        "Controllers handle HTTP requests and responses.",
        "Services contain business logic.",
        "Models define database structures and database operations.",
        "Validation should happen before data reaches critical business logic.",
        "Errors should flow through centralized error handling.",
        "Transactions should be used for operations requiring atomic multi-document changes.",
        "The database layer should not be tightly coupled to frontend components."
      ],
      code: `// Route
router.post("/orders", createOrder);

// Controller
async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(
      req.body
    );

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

// Service
async function createOrder(data) {
  return Order.create(data);
}`,
      keyIdea:
        "A clean MERN architecture separates route handling, business logic and database access."
    }
  ],

  visualizer: {
    title: "Mongoose MERN Data Layer",
    description:
      "Visualize how a frontend request travels through Express and Mongoose before reaching MongoDB.",
    steps: [
      {
        label: "React",
        detail: "The frontend sends an HTTP request to the backend.",
        state: "request"
      },
      {
        label: "Express Route",
        detail: "The route matches the HTTP method and URL.",
        state: "route"
      },
      {
        label: "Controller",
        detail: "The controller reads request data and coordinates the operation.",
        state: "controller"
      },
      {
        label: "Service",
        detail: "Business rules are executed in the service layer.",
        state: "service"
      },
      {
        label: "Mongoose Model",
        detail: "The model prepares the database operation.",
        state: "model"
      },
      {
        label: "Schema Validation",
        detail: "Mongoose checks configured schema rules.",
        state: "validation"
      },
      {
        label: "MongoDB",
        detail: "The operation is executed against the database.",
        state: "database"
      },
      {
        label: "Result",
        detail: "MongoDB returns the result to Mongoose.",
        state: "result"
      },
      {
        label: "API Response",
        detail: "Express sends a structured response back to React.",
        state: "response"
      }
    ]
  },

  trace: {
    title: "Trace a Mongoose Create Request",
    description:
      "Follow a POST request from React through the Express and Mongoose layers into MongoDB.",
    code: `POST /api/students

{
  "name": "Ravi",
  "email": "ravi@example.com"
}`,
    steps: [
      {
        line: 1,
        operation: "HTTP POST",
        explanation:
          "React sends student information to the backend API."
      },
      {
        line: 2,
        operation: "Express Route",
        explanation:
          "The route identifies the create-student endpoint."
      },
      {
        line: 3,
        operation: "Controller",
        explanation:
          "The controller extracts the request body."
      },
      {
        line: 4,
        operation: "Service",
        explanation:
          "The service applies application-level business rules."
      },
      {
        line: 5,
        operation: "Mongoose Model",
        explanation:
          "Student.create() creates a Mongoose document operation."
      },
      {
        line: 6,
        operation: "Schema Validation",
        explanation:
          "Required fields and configured validators are checked."
      },
      {
        line: 7,
        operation: "MongoDB Save",
        explanation:
          "Mongoose sends the insert operation to MongoDB."
      },
      {
        line: 8,
        operation: "Document Created",
        explanation:
          "MongoDB stores the document and returns its generated ID."
      },
      {
        line: 9,
        operation: "API Response",
        explanation:
          "Express returns the created student to the frontend."
      }
    ]
  },

  revision: [
    [
      "Mongoose",
      "ODM library that provides schemas, models, validation and other features for MongoDB applications."
    ],
    [
      "Schema",
      "Definition of document structure, types, validation and model behavior."
    ],
    [
      "Model",
      "Mongoose interface used to interact with a MongoDB collection."
    ],
    [
      "ObjectId",
      "MongoDB identifier commonly used for document IDs and references."
    ],
    [
      "populate()",
      "Mongoose feature that retrieves referenced documents."
    ],
    [
      "Embedding",
      "Storing related data inside the same MongoDB document."
    ],
    [
      "Referencing",
      "Storing a reference to a document in another collection."
    ],
    [
      "Middleware",
      "Code executed before or after selected Mongoose operations."
    ],
    [
      "Session",
      "Context used by MongoDB operations and transactions."
    ],
    [
      "Transaction",
      "Group of database operations that can commit or roll back together."
    ],
    [
      "lean()",
      "Returns plain JavaScript objects instead of full Mongoose documents."
    ],
    [
      "Index",
      "Database structure that can improve query performance."
    ]
  ],

  interview: [
    {
      question: "What is Mongoose?",
      answer:
        "Mongoose is an ODM library for Node.js and MongoDB that provides schemas, models, validation, middleware and convenient query APIs."
    },
    {
      question: "What is the difference between a schema and a model?",
      answer:
        "A schema defines document structure and rules. A model is created from that schema and provides methods for interacting with a MongoDB collection."
    },
    {
      question: "Why use Mongoose instead of directly using the MongoDB driver?",
      answer:
        "Mongoose provides useful abstractions such as schemas, validation, middleware, models and populate. The MongoDB driver provides more direct access to MongoDB."
    },
    {
      question: "What is populate()?",
      answer:
        "populate() allows Mongoose to retrieve documents referenced by ObjectId fields and include the related documents in the query result."
    },
    {
      question: "What is the difference between embedding and referencing?",
      answer:
        "Embedding stores related information inside the same document, while referencing stores related information separately and connects documents using identifiers."
    },
    {
      question: "What does timestamps: true do?",
      answer:
        "It automatically maintains createdAt and updatedAt fields for documents."
    },
    {
      question: "What is lean() in Mongoose?",
      answer:
        "lean() causes query results to be returned as plain JavaScript objects rather than full Mongoose documents, reducing Mongoose document overhead."
    },
    {
      question: "What is Mongoose middleware?",
      answer:
        "Middleware, also called hooks, allows code to execute before or after selected Mongoose operations."
    },
    {
      question: "When should transactions be used?",
      answer:
        "Transactions are useful when multiple related database operations must either all succeed or all fail as one atomic business operation."
    },
    {
      question: "What is a MongoDB session?",
      answer:
        "A session provides context for database operations and is used by MongoDB transactions."
    },
    {
      question: "How should duplicate-key errors be handled?",
      answer:
        "The application should detect the database duplicate-key error and return a clear client-safe response rather than exposing the raw database error."
    },
    {
      question: "Why should database logic be separated from controllers?",
      answer:
        "Separating services and models from controllers improves maintainability, testing, reuse and separation of responsibilities."
    }
  ],

  practice: [
    {
      title: "Create a User Schema",
      task:
        "Create a User schema with name, email, age and role. Make name and email required and give role a default value of student.",
      hint:
        "Use String and Number types and configure required/default properties.",
      answer:
        `const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  age: Number,

  role: {
    type: String,
    default: "student"
  }
});`
    },
    {
      title: "Add Timestamps",
      task:
        "Modify a schema so createdAt and updatedAt are automatically maintained.",
      hint: "Use the schema options object.",
      answer:
        `const schema = new mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);`
    },
    {
      title: "Create a Model",
      task:
        "Create a Student model from a studentSchema.",
      hint: "Use mongoose.model().",
      answer:
        `const Student = mongoose.model(
  "Student",
  studentSchema
);`
    },
    {
      title: "Find Active Users",
      task:
        "Find active users, return only name and email, sort by name and limit the result to 10 documents.",
      hint:
        "Chain find(), select(), sort() and limit().",
      answer:
        `const users = await User.find({
  active: true
})
  .select("name email")
  .sort({ name: 1 })
  .limit(10);`
    },
    {
      title: "Create a Reference",
      task:
        "Create an Order schema containing a user field that references the User model.",
      hint:
        "Use mongoose.Schema.Types.ObjectId and ref.",
      answer:
        `const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});`
    },
    {
      title: "Populate a Reference",
      task:
        "Retrieve orders and populate the user's name and email.",
      hint: "Use populate() after find().",
      answer:
        `const orders = await Order.find()
  .populate("user", "name email")
  .lean();`
    },
    {
      title: "Handle Duplicate Email",
      task:
        "Detect a MongoDB duplicate-key error while creating a user.",
      hint: "MongoDB duplicate-key errors commonly use error code 11000.",
      answer:
        `try {
  await User.create(data);
} catch (error) {
  if (error.code === 11000) {
    console.log("Email already exists");
  } else {
    throw error;
  }
}`
    },
    {
      title: "Transaction Practice",
      task:
        "Create a transaction that decreases one account balance and increases another account balance.",
      hint:
        "Start a session, start a transaction, pass the session to both operations, then commit or abort.",
      answer:
        `const session = await mongoose.startSession();

try {
  session.startTransaction();

  await Account.updateOne(
    { _id: fromId },
    { $inc: { balance: -100 } },
    { session }
  );

  await Account.updateOne(
    { _id: toId },
    { $inc: { balance: 100 } },
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}`
    }
  ],

  quiz: [
    {
      question: "What does Mongoose provide for MongoDB applications?",
      options: [
        "Only a frontend UI",
        "Schemas, models and validation",
        "Only CSS utilities",
        "Only HTTP routing"
      ],
      answer: 1,
      explanation:
        "Mongoose provides an ODM layer containing schemas, models, validation, middleware and query functionality."
    },
    {
      question: "What is created from a Mongoose schema?",
      options: [
        "A CSS class",
        "A browser component",
        "A model",
        "An HTTP header"
      ],
      answer: 2,
      explanation:
        "mongoose.model() creates a model based on a schema."
    },
    {
      question: "Which option automatically adds createdAt and updatedAt?",
      options: [
        "dates: true",
        "timestamps: true",
        "autoDate: true",
        "trackTime: true"
      ],
      answer: 1,
      explanation:
        "timestamps: true enables automatic createdAt and updatedAt fields."
    },
    {
      question: "Which method is commonly used to retrieve referenced documents?",
      options: [
        "joinData()",
        "reference()",
        "populate()",
        "attach()"
      ],
      answer: 2,
      explanation:
        "Mongoose populate() retrieves documents referenced by ObjectId fields."
    },
    {
      question: "Which type is commonly used for MongoDB document references?",
      options: [
        "ObjectId",
        "HTML",
        "BufferOnly",
        "CSSId"
      ],
      answer: 0,
      explanation:
        "mongoose.Schema.Types.ObjectId is commonly used for document references."
    },
    {
      question: "What does lean() return?",
      options: [
        "HTML elements",
        "Plain JavaScript objects",
        "Only strings",
        "MongoDB indexes"
      ],
      answer: 1,
      explanation:
        "lean() returns plain JavaScript objects rather than full Mongoose documents."
    },
    {
      question: "What is the purpose of a transaction?",
      options: [
        "To style a webpage",
        "To combine operations into an atomic unit",
        "To create CSS animations",
        "To compile React"
      ],
      answer: 1,
      explanation:
        "Transactions allow related database operations to commit or roll back together."
    },
    {
      question: "What is a Mongoose pre hook?",
      options: [
        "Code that executes before a selected operation",
        "A frontend event",
        "A MongoDB collection",
        "A CSS selector"
      ],
      answer: 0,
      explanation:
        "pre middleware executes before the selected Mongoose operation."
    },
    {
      question: "What does error code 11000 commonly indicate?",
      options: [
        "Network timeout",
        "Duplicate-key violation",
        "Invalid HTML",
        "Missing CSS"
      ],
      answer: 1,
      explanation:
        "MongoDB commonly reports duplicate-key violations using error code 11000."
    },
    {
      question: "Which design stores related data inside the same document?",
      options: [
        "Referencing",
        "Embedding",
        "Routing",
        "Indexing"
      ],
      answer: 1,
      explanation:
        "Embedding stores related information inside the parent MongoDB document."
    },
    {
      question: "Which layer should normally contain reusable business logic?",
      options: [
        "Service layer",
        "CSS file",
        "HTML title",
        "Browser cache"
      ],
      answer: 0,
      explanation:
        "A service layer is commonly used to separate reusable business logic from HTTP controllers."
    },
    {
      question: "What should production API responses do with raw database errors?",
      options: [
        "Expose every database detail",
        "Return raw stack traces",
        "Return safe, meaningful client-facing errors",
        "Send database credentials"
      ],
      answer: 2,
      explanation:
        "Production APIs should log useful technical details internally while returning safe client-facing error messages."
    }
  ],

  glossary: [
    {
      term: "ODM",
      definition:
        "Object Data Modeling library that provides a structured interface between application objects and MongoDB documents."
    },
    {
      term: "Mongoose",
      definition:
        "Popular Node.js ODM library for MongoDB."
    },
    {
      term: "Schema",
      definition:
        "Definition of fields, types, validation and behavior for a document model."
    },
    {
      term: "Model",
      definition:
        "Mongoose object used to interact with a MongoDB collection."
    },
    {
      term: "ObjectId",
      definition:
        "MongoDB identifier type commonly used for document IDs and references."
    },
    {
      term: "populate",
      definition:
        "Mongoose operation for retrieving referenced documents."
    },
    {
      term: "Embedding",
      definition:
        "Storing related documents or data directly inside another document."
    },
    {
      term: "Reference",
      definition:
        "A stored identifier that points to a document in another collection."
    },
    {
      term: "Middleware",
      definition:
        "Code that executes before or after selected Mongoose operations."
    },
    {
      term: "Session",
      definition:
        "MongoDB execution context used by operations and transactions."
    },
    {
      term: "Transaction",
      definition:
        "Atomic group of database operations that can commit or roll back together."
    },
    {
      term: "Index",
      definition:
        "Database structure designed to make supported queries faster."
    },
    {
      term: "Validation",
      definition:
        "Rules that determine whether application data satisfies expected requirements."
    },
    {
      term: "lean",
      definition:
        "Mongoose query option that returns plain JavaScript objects."
    }
  ],

  completion: {
    title: "MongoDB & Mongoose Complete!",
    message:
      "You have completed the MongoDB section of the CodeBhavya Full Stack / MERN course. You now understand MongoDB fundamentals, advanced CRUD, aggregation, indexing, Mongoose schemas and models, validation, relationships, populate, middleware and transactions.",
    achievements: [
      "MongoDB fundamentals completed",
      "Advanced CRUD and aggregation completed",
      "Query optimization and indexing completed",
      "Mongoose schemas and models completed",
      "Mongoose validation completed",
      "Mongoose CRUD completed",
      "References and populate completed",
      "One-to-one, one-to-many and many-to-many relationships completed",
      "Embedding vs referencing completed",
      "Mongoose middleware completed",
      "Sessions and transactions completed",
      "MERN data-layer architecture completed"
    ],
    nextLevel:
      "Level 27 — MERN Application Architecture & Integration"
  }
};
