"use strict";

/* =========================================================
CODEBHAVYA FULL STACK / MERN
LEVEL 24 — MONGODB FUNDAMENTALS & NoSQL DATA MODELING
========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[24] = {
  n: 24,

  kicker: "PART 5 • MONGODB • LEVEL 24",

  title: "MongoDB Fundamentals & NoSQL Data Modeling",

  summary:
    "Learn MongoDB from the ground up: databases, collections, documents, BSON, ObjectId, CRUD fundamentals, schema flexibility, embedding, referencing, data modeling, indexes, query concepts and how MongoDB fits into a MERN application.",

  duration: "4–5 Hours",

  difficulty: "Beginner → Intermediate",

  concepts: 16,

  outcomes: [
    "Understand why MongoDB is used in MERN applications.",
    "Understand databases, collections and documents.",
    "Understand BSON and MongoDB document structure.",
    "Understand ObjectId and document identifiers.",
    "Perform basic MongoDB CRUD operations.",
    "Understand MongoDB query operators.",
    "Understand schema flexibility.",
    "Distinguish embedded and referenced documents.",
    "Choose appropriate MongoDB data models.",
    "Understand one-to-one, one-to-many and many-to-many relationships.",
    "Understand arrays and nested documents.",
    "Understand MongoDB indexes.",
    "Understand common data-modeling mistakes.",
    "Understand how Node.js connects to MongoDB.",
    "Design a practical MERN database.",
    "Prepare for Mongoose in the next level."
  ],

  sections: [

    /* =====================================================
       SECTION 1
    ===================================================== */

    {
      number: 1,

      title: "What is MongoDB?",

      intro:
        "MongoDB is a document-oriented NoSQL database. Instead of organizing application data primarily into rows and tables, MongoDB stores data as documents grouped inside collections.",

      points: [
        "MongoDB is a NoSQL database.",
        "Data is stored as documents.",
        "Documents are grouped into collections.",
        "Collections are stored inside databases.",
        "MongoDB documents resemble JSON objects.",
        "MongoDB actually stores documents using BSON.",
        "MongoDB is commonly used with Node.js in MERN applications."
      ],

      comparison: {
        title: "SQL vs MongoDB",
        headers: ["Relational Database", "MongoDB"],
        rows: [
          ["Database", "Database"],
          ["Table", "Collection"],
          ["Row", "Document"],
          ["Column", "Field"],
          ["JOIN", "References / aggregation / application logic"],
          ["Fixed schema", "Flexible document structure"]
        ]
      },

      code:
`use codebhavya

db.students.insertOne({
  name: "Bhavya",
  branch: "CSE",
  year: 4
})`,

      keyIdea:
        "MongoDB stores related application information as documents inside collections."
    },

    /* =====================================================
       SECTION 2
    ===================================================== */

    {
      number: 2,

      title: "Database, Collection and Document",

      intro:
        "The three fundamental MongoDB concepts are database, collection and document.",

      points: [
        "A database contains collections.",
        "A collection contains documents.",
        "A document contains fields.",
        "A field stores a value.",
        "A collection can contain many documents.",
        "Documents in one collection can have different fields."
      ],

      code:
`use college

db.students.insertMany([
  {
    name: "Ravi",
    branch: "CSE"
  },
  {
    name: "Anitha",
    branch: "ECE"
  },
  {
    name: "Kiran",
    branch: "CSE"
  }
])`,

      keyIdea:
        "Think of MongoDB as Database → Collection → Document → Field."
    },

    /* =====================================================
       SECTION 3
    ===================================================== */

    {
      number: 3,

      title: "Documents and BSON",

      intro:
        "MongoDB documents look similar to JSON, but MongoDB internally uses BSON, which supports additional data types.",

      points: [
        "BSON means Binary JSON.",
        "MongoDB uses BSON for storing and transmitting documents.",
        "BSON supports strings and numbers.",
        "BSON supports dates.",
        "BSON supports arrays.",
        "BSON supports embedded documents.",
        "BSON supports ObjectId.",
        "BSON provides types that ordinary JSON does not directly represent."
      ],

      code:
`{
  name: "Bhavya",
  age: 21,
  active: true,
  skills: ["C", "Python", "MongoDB"],
  createdAt: new Date()
}`,

      keyIdea:
        "MongoDB's document model looks like JSON, while BSON provides the database representation and additional types."
    },

    /* =====================================================
       SECTION 4
    ===================================================== */

    {
      number: 4,

      title: "The _id Field and ObjectId",

      intro:
        "MongoDB documents normally have a unique _id field. When MongoDB creates the identifier automatically, it commonly uses an ObjectId.",

      points: [
        "Every document should have a unique identifier.",
        "MongoDB commonly generates _id automatically.",
        "ObjectId is a BSON type.",
        "ObjectId values are designed to be unique.",
        "Applications can also use their own identifier strategy when appropriate.",
        "The _id field is important for finding and updating documents."
      ],

      code:
`db.students.insertOne({
  name: "Bhavya",
  branch: "CSE"
})

db.students.findOne({
  _id: ObjectId("64f000000000000000000001")
})`,

      keyIdea:
        "The _id field identifies a MongoDB document."
    },

    /* =====================================================
       SECTION 5
    ===================================================== */

    {
      number: 5,

      title: "Creating Documents",

      intro:
        "MongoDB provides insertOne and insertMany for creating documents.",

      points: [
        "insertOne creates one document.",
        "insertMany creates multiple documents.",
        "MongoDB can automatically generate _id.",
        "Documents can contain nested objects.",
        "Documents can contain arrays.",
        "Fields do not all have to be identical across documents."
      ],

      code:
`db.products.insertOne({
  name: "Laptop",
  price: 65000,
  category: "electronics",
  tags: ["computer", "work"]
})

db.products.insertMany([
  {
    name: "Mouse",
    price: 800
  },
  {
    name: "Keyboard",
    price: 1500
  }
])`,

      keyIdea:
        "MongoDB documents can naturally represent objects that already exist in application code."
    },

    /* =====================================================
       SECTION 6
    ===================================================== */

    {
      number: 6,

      title: "Reading Documents",

      intro:
        "MongoDB provides find and findOne for retrieving documents.",

      points: [
        "find returns matching documents.",
        "findOne returns one matching document.",
        "An empty filter can retrieve documents from a collection.",
        "Filters can match exact field values.",
        "Query operators can perform more advanced filtering."
      ],

      code:
`db.students.find()

db.students.find({
  branch: "CSE"
})

db.students.findOne({
  name: "Bhavya"
})`,

      keyIdea:
        "A MongoDB query describes the documents you want to retrieve."
    },

    /* =====================================================
       SECTION 7
    ===================================================== */

    {
      number: 7,

      title: "Query Operators",

      intro:
        "MongoDB provides operators for comparisons, logical conditions, arrays and other query requirements.",

      points: [
        "$gt means greater than.",
        "$gte means greater than or equal to.",
        "$lt means less than.",
        "$lte means less than or equal to.",
        "$in matches values from a list.",
        "$ne means not equal.",
        "$and and $or combine conditions.",
        "$exists checks whether a field exists."
      ],

      code:
`db.products.find({
  price: {
    $gt: 1000
  }
})

db.students.find({
  branch: {
    $in: ["CSE", "AI&ML"]
  }
})

db.students.find({
  $or: [
    { branch: "CSE" },
    { branch: "ECE" }
  ]
})`,

      keyIdea:
        "MongoDB query operators allow applications to express conditions beyond simple equality."
    },

    /* =====================================================
       SECTION 8
    ===================================================== */

    {
      number: 8,

      title: "Updating Documents",

      intro:
        "MongoDB provides updateOne, updateMany and replaceOne for changing stored data.",

      points: [
        "updateOne changes the first matching document.",
        "updateMany changes all matching documents.",
        "replaceOne replaces an entire document.",
        "$set changes selected fields.",
        "$inc increases a numeric value.",
        "$push adds a value to an array.",
        "$pull removes matching values from an array."
      ],

      code:
`db.students.updateOne(
  { name: "Bhavya" },
  {
    $set: {
      year: 4
    }
  }
)

db.products.updateMany(
  { category: "electronics" },
  {
    $inc: {
      price: 500
    }
  }
)`,

      keyIdea:
        "Update operators allow MongoDB to modify specific parts of a document without replacing everything."
    },

    /* =====================================================
       SECTION 9
    ===================================================== */

    {
      number: 9,

      title: "Deleting Documents",

      intro:
        "MongoDB provides deleteOne and deleteMany for removing documents.",

      points: [
        "deleteOne removes one matching document.",
        "deleteMany removes all matching documents.",
        "Deletion should be performed carefully.",
        "Application APIs often validate authorization before deletion.",
        "Soft deletion can be used when records must be retained."
      ],

      code:
`db.students.deleteOne({
  name: "Temporary Student"
})

db.students.deleteMany({
  active: false
})`,

      keyIdea:
        "Deletion permanently removes documents unless the application uses another retention strategy."
    },

    /* =====================================================
       SECTION 10
    ===================================================== */

    {
      number: 10,

      title: "Schema Flexibility",

      intro:
        "MongoDB allows documents in the same collection to have different fields. This flexibility can be useful, but it does not mean that applications should have no structure.",

      points: [
        "Documents do not need identical fields by default.",
        "Different versions of an application may require different fields.",
        "Flexible schemas can help applications evolve.",
        "Uncontrolled variation makes data harder to maintain.",
        "Application-level validation is still important.",
        "Mongoose can provide schema definitions and validation."
      ],

      code:
`db.users.insertMany([
  {
    name: "Ravi",
    email: "ravi@example.com"
  },
  {
    name: "Anitha",
    email: "anitha@example.com",
    phone: "9876543210"
  }
])`,

      keyIdea:
        "Schema flexibility is a feature, not an excuse to ignore data consistency."
    },

    /* =====================================================
       SECTION 11
    ===================================================== */

    {
      number: 11,

      title: "Embedded Documents",

      intro:
        "Related data can sometimes be stored directly inside the parent document. This is called embedding.",

      points: [
        "Embedding keeps related data together.",
        "It can make reads simple.",
        "It is useful when child data belongs strongly to one parent.",
        "Embedded arrays are useful for small or bounded collections.",
        "Very large embedded arrays can become problematic.",
        "Frequently updated independent data may be better referenced."
      ],

      code:
`{
  name: "Bhavya",
  email: "bhavya@example.com",

  address: {
    city: "Hyderabad",
    state: "Telangana",
    pincode: 500001
  }
}`,

      keyIdea:
        "Embed data when it naturally belongs to the parent and is commonly read together."
    },

    /* =====================================================
       SECTION 12
    ===================================================== */

    {
      number: 12,

      title: "Referenced Documents",

      intro:
        "Instead of embedding everything, a document can store an identifier pointing to another document.",

      points: [
        "References separate related data.",
        "They are useful for large or independently managed data.",
        "References are useful when many documents share the same related entity.",
        "The application can retrieve referenced data separately.",
        "Mongoose provides tools for working with references."
      ],

      code:
`{
  title: "MongoDB Fundamentals",
  instructorId: ObjectId("64f000000000000000000002")
}

{
  _id: ObjectId("64f000000000000000000002"),
  name: "CodeBhavya Instructor"
}`,

      keyIdea:
        "Reference data when the related entity has its own lifecycle or is shared across many documents."
    },

    /* =====================================================
       SECTION 13
    ===================================================== */

    {
      number: 13,

      title: "Relationships in MongoDB",

      intro:
        "MongoDB can represent one-to-one, one-to-many and many-to-many relationships using embedding, references or combinations of both.",

      points: [
        "One-to-one means one document relates to one other document.",
        "One-to-many means one entity relates to many entities.",
        "Many-to-many means both sides can relate to many entities.",
        "The correct model depends on how data is accessed.",
        "There is no single modeling strategy for every application."
      ],

      comparison: {
        title: "Relationship Modeling",
        headers: ["Relationship", "Possible Model"],
        rows: [
          ["One-to-one", "Embed or reference"],
          ["One-to-many", "Embed bounded data or reference"],
          ["Many-to-many", "References and linking structures"],
          ["Shared entity", "Reference"]
        ]
      },

      code:
`{
  course: "MongoDB",
  students: [
    ObjectId("64f000000000000000000010"),
    ObjectId("64f000000000000000000011")
  ]
}`,

      keyIdea:
        "MongoDB data modeling should begin with application access patterns rather than blindly copying relational-table designs."
    },

    /* =====================================================
       SECTION 14
    ===================================================== */

    {
      number: 14,

      title: "Indexes and Query Performance",

      intro:
        "Indexes help MongoDB find matching documents efficiently for supported query patterns.",

      points: [
        "Indexes improve performance for suitable queries.",
        "Indexes consume storage.",
        "Indexes can increase the cost of writes.",
        "Frequently queried fields may benefit from indexes.",
        "Indexes should be created based on actual access patterns.",
        "An index is not automatically useful for every field."
      ],

      code:
`db.users.createIndex({
  email: 1
})

db.users.getIndexes()

db.users.find({
  email: "user@example.com"
})`,

      keyIdea:
        "Indexes are performance tools and should be designed around real query patterns."
    },

    /* =====================================================
       SECTION 15
    ===================================================== */

    {
      number: 15,

      title: "MongoDB with Node.js",

      intro:
        "A MERN application normally connects its Node.js backend to MongoDB. The backend then exposes application-specific APIs to the React frontend.",

      points: [
        "React normally communicates with the Node/Express backend.",
        "The backend communicates with MongoDB.",
        "Database credentials belong on the server.",
        "The browser should not receive database credentials.",
        "The backend converts HTTP requests into database operations.",
        "MongoDB operations can be asynchronous."
      ],

      code:
`const { MongoClient } = require("mongodb");

const client = new MongoClient(
  process.env.MONGODB_URI
);

async function connectDatabase() {
  await client.connect();

  const database = client.db("codebhavya");

  console.log(
    "MongoDB connected to:",
    database.databaseName
  );

  return database;
}

connectDatabase().catch(console.error);`,

      keyIdea:
        "In MERN, the normal flow is React → Express/Node → MongoDB."
    },

    /* =====================================================
       SECTION 16
    ===================================================== */

    {
      number: 16,

      title: "Designing a Practical MERN Database",

      intro:
        "Good MongoDB design starts with understanding the application's entities, relationships and most common queries.",

      points: [
        "List the application's main entities.",
        "Identify fields for each entity.",
        "Identify relationships.",
        "Identify common read operations.",
        "Identify common write operations.",
        "Choose embedding or references.",
        "Add indexes for important query patterns.",
        "Consider document growth.",
        "Consider authorization boundaries.",
        "Keep sensitive information protected."
      ],

      code:
`Database: placement

Collection: students

{
  _id: ObjectId("64f000000000000000000020"),
  name: "Bhavya",
  email: "bhavya@example.com",
  branch: "CSE-AI&ML",
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB"
  ],
  placement: {
    status: "training",
    company: null
  }
}`,

      keyIdea:
        "Model the database around how the application actually uses its data."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
  ========================================================= */

  visualizer: {
    title: "MongoDB Document Architecture",

    description:
      "Visualize how a MERN application's data moves from the React interface through Express and Node.js into MongoDB collections and documents.",

    steps: [
      {
        label: "React",
        detail:
          "The frontend collects user actions and sends an HTTP request."
      },
      {
        label: "Express API",
        detail:
          "Express receives the request and selects the appropriate route."
      },
      {
        label: "Controller",
        detail:
          "The controller coordinates the API operation."
      },
      {
        label: "Service",
        detail:
          "Business logic determines what database operation is required."
      },
      {
        label: "MongoDB Driver",
        detail:
          "Node.js communicates with MongoDB using a database driver."
      },
      {
        label: "Database",
        detail:
          "MongoDB selects the requested database."
      },
      {
        label: "Collection",
        detail:
          "MongoDB searches or modifies the appropriate collection."
      },
      {
        label: "Document",
        detail:
          "The required document is read, inserted, updated or deleted."
      },
      {
        label: "Response",
        detail:
          "The backend converts the database result into an HTTP response."
      },
      {
        label: "React UI",
        detail:
          "The frontend updates the interface using the API response."
      }
    ]
  },

  /* =========================================================
     TRACE
  ========================================================= */

  trace: {
    title: "Trace a MongoDB Read Operation",

    description:
      "Follow a GET request from React to MongoDB and back to the user interface.",

    steps: [
      {
        line: 1,
        code: 'fetch("/api/students");',
        explanation:
          "React sends a GET request to the backend."
      },
      {
        line: 2,
        code: 'router.get("/api/students", controller);',
        explanation:
          "Express matches the request with the students route."
      },
      {
        line: 3,
        code: "const students = await studentService.getAll();",
        explanation:
          "The controller asks the service layer for student data."
      },
      {
        line: 4,
        code: 'db.collection("students").find({}).toArray();',
        explanation:
          "The backend requests documents from the students collection."
      },
      {
        line: 5,
        code: "MongoDB searches the students collection.",
        explanation:
          "MongoDB evaluates the query and retrieves matching documents."
      },
      {
        line: 6,
        code: "return students;",
        explanation:
          "The database result is returned to the service layer."
      },
      {
        line: 7,
        code: "res.json({ success: true, data: students });",
        explanation:
          "Express sends the database result to the frontend."
      },
      {
        line: 8,
        code: "setStudents(response.data);",
        explanation:
          "React stores the received data and updates the UI."
      }
    ]
  },

  /* =========================================================
     REVISION
  ========================================================= */

  revision: [
    [
      "MongoDB",
      "A document-oriented NoSQL database."
    ],
    [
      "Database",
      "Container that holds MongoDB collections."
    ],
    [
      "Collection",
      "Group of MongoDB documents."
    ],
    [
      "Document",
      "MongoDB record represented as a BSON document."
    ],
    [
      "Field",
      "Named value inside a document."
    ],
    [
      "BSON",
      "Binary JSON format used by MongoDB."
    ],
    [
      "ObjectId",
      "Common BSON identifier type used for MongoDB document IDs."
    ],
    [
      "CRUD",
      "Create, Read, Update and Delete operations."
    ],
    [
      "Query",
      "Expression used to find matching documents."
    ],
    [
      "Embedding",
      "Storing related information directly inside a document."
    ],
    [
      "Reference",
      "Storing an identifier that points to another document."
    ],
    [
      "Schema Flexibility",
      "Ability for documents in a collection to have different fields."
    ],
    [
      "Index",
      "Data structure that can improve supported query performance."
    ],
    [
      "One-to-Many",
      "Relationship where one entity is associated with multiple entities."
    ],
    [
      "Many-to-Many",
      "Relationship where entities on both sides can have multiple associations."
    ],
    [
      "MongoDB Driver",
      "Library that allows application code to communicate with MongoDB."
    ]
  ],

  /* =========================================================
     INTERVIEW
  ========================================================= */

  interview: [
    {
      question: "What is MongoDB?",

      answer:
        "MongoDB is a document-oriented NoSQL database that stores data as BSON documents organized into collections."
    },

    {
      question: "What is the difference between a collection and a document?",

      answer:
        "A collection is a group of documents, while a document is an individual record containing fields."
    },

    {
      question: "What is BSON?",

      answer:
        "BSON stands for Binary JSON. It is the format MongoDB uses for storing and exchanging documents and supports additional data types such as ObjectId and Date."
    },

    {
      question: "What is ObjectId?",

      answer:
        "ObjectId is a BSON type commonly used as the value of MongoDB's _id field."
    },

    {
      question: "What is schema flexibility?",

      answer:
        "MongoDB allows documents in the same collection to have different fields without requiring a traditional fixed relational schema."
    },

    {
      question: "What is embedding?",

      answer:
        "Embedding stores related data directly inside a parent document."
    },

    {
      question: "When should you use references?",

      answer:
        "References are useful when related data is large, independently managed, shared by many documents or has its own lifecycle."
    },

    {
      question: "What is the difference between find() and findOne()?",

      answer:
        "find() is used to retrieve matching documents, while findOne() retrieves a single matching document."
    },

    {
      question: "What does $set do?",

      answer:
        "$set changes or creates specified fields without replacing the entire document."
    },

    {
      question: "What is an index?",

      answer:
        "An index is a data structure that can improve the efficiency of supported queries, although indexes also consume storage and can increase write overhead."
    },

    {
      question: "How does MongoDB fit into MERN?",

      answer:
        "React handles the frontend, Node.js and Express handle the backend API, and MongoDB stores application data."
    },

    {
      question: "How should MongoDB data modeling begin?",

      answer:
        "Start with application entities and access patterns: what data is commonly read together, how it changes, how it grows and which queries are important."
    }
  ],

  /* =========================================================
     PRACTICE
  ========================================================= */

  practice: [
    {
      title: "Create a Student",

      task:
        "Insert a student document containing name, branch and year.",

      hint:
        "Use insertOne().",

      answer:
`db.students.insertOne({
  name: "Bhavya",
  branch: "CSE-AI&ML",
  year: 4
})`
    },

    {
      title: "Find CSE Students",

      task:
        "Find all students whose branch is CSE.",

      hint:
        "Use find() with a branch filter.",

      answer:
`db.students.find({
  branch: "CSE"
})`
    },

    {
      title: "Find Expensive Products",

      task:
        "Find products whose price is greater than 50000.",

      hint:
        "Use the $gt operator.",

      answer:
`db.products.find({
  price: {
    $gt: 50000
  }
})`
    },

    {
      title: "Update a Student",

      task:
        "Change Bhavya's year to 4.",

      hint:
        "Use updateOne() and $set.",

      answer:
`db.students.updateOne(
  { name: "Bhavya" },
  {
    $set: {
      year: 4
    }
  }
)`
    },

    {
      title: "Add a Skill",

      task:
        "Add MongoDB to a student's skills array.",

      hint:
        "Use $push.",

      answer:
`db.students.updateOne(
  { name: "Bhavya" },
  {
    $push: {
      skills: "MongoDB"
    }
  }
)`
    },

    {
      title: "Create an Index",

      task:
        "Create an index on the email field of the users collection.",

      hint:
        "Use createIndex().",

      answer:
`db.users.createIndex({
  email: 1
})`
    },

    {
      title: "Choose a Data Model",

      task:
        "A user has one address that is always displayed with the user profile. Decide whether embedding or referencing is a natural starting point.",

      hint:
        "Think about whether the address has an independent lifecycle.",

      answer:
"Embedding is a natural starting point because the address belongs closely to the user and is commonly read together with the user profile."
    }
  ],

  /* =========================================================
     QUIZ
  ========================================================= */

  quiz: [
    {
      question:
        "Which type of database is MongoDB?",

      options: [
        "Relational database",
        "Document-oriented NoSQL database",
        "Spreadsheet",
        "Operating system"
      ],

      answer: 1,

      explanation:
        "MongoDB is a document-oriented NoSQL database."
    },

    {
      question:
        "What is the MongoDB equivalent of a relational table?",

      options: [
        "Document",
        "Collection",
        "Field",
        "ObjectId"
      ],

      answer: 1,

      explanation:
        "A MongoDB collection is conceptually similar to a relational table."
    },

    {
      question:
        "What is a MongoDB document?",

      options: [
        "A database server",
        "An individual record",
        "An index only",
        "An HTTP request"
      ],

      answer: 1,

      explanation:
        "A document is an individual MongoDB record containing fields."
    },

    {
      question:
        "Which BSON type is commonly used for generated document IDs?",

      options: [
        "ObjectId",
        "Boolean",
        "Array",
        "String only"
      ],

      answer: 0,

      explanation:
        "MongoDB commonly generates an ObjectId for the _id field."
    },

    {
      question:
        "Which operator means greater than?",

      options: [
        "$lt",
        "$gt",
        "$eq",
        "$ne"
      ],

      answer: 1,

      explanation:
        "$gt means greater than."
    },

    {
      question:
        "Which operator changes selected fields?",

      options: [
        "$set",
        "$delete",
        "$change",
        "$field"
      ],

      answer: 0,

      explanation:
        "$set changes or creates specified fields."
    },

    {
      question:
        "What is embedding?",

      options: [
        "Deleting a document",
        "Storing related data inside a parent document",
        "Creating an HTTP server",
        "Creating an index"
      ],

      answer: 1,

      explanation:
        "Embedding stores related data directly inside the parent document."
    },

    {
      question:
        "What is a reference?",

      options: [
        "A pointer-like identifier to another document",
        "A CSS selector",
        "A password",
        "A database name only"
      ],

      answer: 0,

      explanation:
        "References commonly store an identifier associated with another document."
    },

    {
      question:
        "What is the main purpose of an index?",

      options: [
        "Improve supported query performance",
        "Encrypt every field",
        "Delete documents",
        "Create React components"
      ],

      answer: 0,

      explanation:
        "Indexes can improve the performance of supported query patterns."
    },

    {
      question:
        "What is the usual MERN data flow?",

      options: [
        "MongoDB → React → HTML",
        "React → Express/Node → MongoDB",
        "MongoDB → CSS → React",
        "Express → CSS → MongoDB"
      ],

      answer: 1,

      explanation:
        "A common MERN architecture has React communicate with a Node/Express backend, which communicates with MongoDB."
    }
  ],

  /* =========================================================
     GLOSSARY
  ========================================================= */

  glossary: [
    {
      term: "MongoDB",
      definition:
        "A document-oriented NoSQL database."
    },

    {
      term: "NoSQL",
      definition:
        "A broad category of databases that do not primarily rely on traditional relational table structures."
    },

    {
      term: "Database",
      definition:
        "Container holding MongoDB collections."
    },

    {
      term: "Collection",
      definition:
        "Group of MongoDB documents."
    },

    {
      term: "Document",
      definition:
        "Individual BSON record stored in a collection."
    },

    {
      term: "Field",
      definition:
        "Named piece of data inside a document."
    },

    {
      term: "BSON",
      definition:
        "Binary JSON format used by MongoDB."
    },

    {
      term: "ObjectId",
      definition:
        "BSON identifier type commonly used for MongoDB document IDs."
    },

    {
      term: "CRUD",
      definition:
        "Create, Read, Update and Delete operations."
    },

    {
      term: "Query",
      definition:
        "Expression used to select matching MongoDB documents."
    },

    {
      term: "Embedding",
      definition:
        "Storing related data directly inside another document."
    },

    {
      term: "Reference",
      definition:
        "Identifier used to associate one document with another."
    },

    {
      term: "Schema Flexibility",
      definition:
        "Ability for documents in a collection to have different fields."
    },

    {
      term: "Index",
      definition:
        "Data structure that can improve supported query performance."
    },

    {
      term: "Access Pattern",
      definition:
        "The way an application commonly reads, writes or searches its data."
    },

    {
      term: "MongoDB Driver",
      definition:
        "Library used by application code to communicate with MongoDB."
    },

    {
      term: "MERN",
      definition:
        "MongoDB, Express, React and Node.js."
    }
  ],

  /* =========================================================
     COMPLETION
  ========================================================= */

  completion: {
    title: "MongoDB Fundamentals Complete!",

    message:
      "You have completed the foundations of MongoDB. You now understand databases, collections, documents, BSON, ObjectId, CRUD operations, queries, schema flexibility, embedding, references, relationships, indexes and MERN database architecture.",

    achievements: [
      "MongoDB Fundamentals",
      "Databases and Collections",
      "BSON Documents",
      "ObjectId",
      "CRUD Operations",
      "MongoDB Queries",
      "Query Operators",
      "Schema Flexibility",
      "Embedded Documents",
      "Referenced Documents",
      "Relationship Modeling",
      "Indexes",
      "MongoDB with Node.js",
      "MERN Data Modeling"
    ],

    nextLevel:
      "Level 25 — MongoDB CRUD, Aggregation & Indexing"
  }
};
