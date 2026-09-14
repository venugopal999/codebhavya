
"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[7] = {
    n: 7,
    kicker: "WEB FOUNDATIONS",
    title: "Git, npm & Project Workflow",
    summary:
        "Learn the professional workflow used to track code, manage JavaScript packages, collaborate with teams and create reproducible projects with Git, GitHub and npm.",
    duration: "Estimated learning time: 4–5 hours",
    difficulty: "Beginner → Intermediate",
    concepts: 24,

    outcomes: [
        "Explain why version control is important.",
        "Understand repositories, commits, branches and working trees.",
        "Use common Git commands safely.",
        "Understand the difference between working files, staging and commits.",
        "Create and inspect Git history.",
        "Create branches and merge changes.",
        "Understand remote repositories and GitHub.",
        "Clone, pull and push repositories.",
        "Use .gitignore correctly.",
        "Understand merge conflicts and conflict resolution.",
        "Understand what npm is and why JavaScript projects use it.",
        "Understand package.json and package-lock.json.",
        "Distinguish dependencies from devDependencies.",
        "Understand semantic versioning.",
        "Use npm install and npm ci correctly.",
        "Create useful npm scripts.",
        "Understand node_modules and why it is normally not committed.",
        "Understand reproducible project setup.",
        "Understand environment configuration at a basic level.",
        "Use a clean project workflow from initialization to delivery.",
        "Avoid common Git and npm mistakes.",
        "Prepare a project structure suitable for later React and Node.js work.",
        "Understand a basic team Git workflow.",
        "Apply Git and npm together in a realistic JavaScript project."
    ],

    sections: [

        {
            title: "1. Why Version Control Matters",
            explanation:
                "Software changes continuously. Developers need a reliable way to record changes, understand history, recover earlier versions and collaborate without accidentally overwriting each other's work. Version control systems solve these problems.",
            points: [
                "Track changes over time.",
                "Understand who changed what and when.",
                "Return to an earlier working version.",
                "Experiment without destroying the main code.",
                "Collaborate with other developers.",
                "Create a reliable project history."
            ],
            note:
                "Git is not a backup system alone. It is a version-control system that records meaningful changes to a project."
        },

        {
            title: "2. What Is Git?",
            explanation:
                "Git is a distributed version-control system. A Git repository contains project files together with metadata describing the project's history.",
            points: [
                "Git runs locally on your computer.",
                "A repository contains project history.",
                "Commits record snapshots of tracked changes.",
                "Branches allow parallel lines of development.",
                "Remote repositories allow collaboration and sharing."
            ],
            code: `git --version

git init`,
            note:
                "Git and GitHub are not the same thing. Git is the version-control technology. GitHub is a platform that can host Git repositories and collaboration tools."
        },

        {
            title: "3. Working Tree, Staging Area and Repository",
            explanation:
                "Git can be understood through three important areas: the working tree, the staging area and the repository history.",
            points: [
                "Working tree contains the files you are currently editing.",
                "Staging area contains changes selected for the next commit.",
                "Repository contains committed history.",
                "git add moves selected changes toward the next commit.",
                "git commit records the staged snapshot."
            ],
            code: `Working Tree
     ↓
   git add
     ↓
Staging Area
     ↓
 git commit
     ↓
Repository History`,
            note:
                "The staging area gives you control over exactly which changes belong in the next commit."
        },

        {
            title: "4. git init and git status",
            explanation:
                "git init creates a new Git repository in the current directory. git status then shows the current state of the working tree and staging area.",
            code: `mkdir student-dashboard
cd student-dashboard

git init

git status`,
            points: [
                "Initialize Git once for a new repository.",
                "Use git status frequently.",
                "Status tells you which files are untracked.",
                "Status also identifies modified and staged files."
            ],
            note:
                "git status is one of the safest and most useful Git commands. When unsure about the state of a repository, check status first."
        },

        {
            title: "5. git add and the Staging Area",
            explanation:
                "git add stages changes for the next commit. Staging does not permanently save the changes to history; it prepares them for a commit.",
            code: `git add index.html

git add css/
git add js/

git status`,
            points: [
                "You can stage individual files.",
                "You can stage directories.",
                "Staging allows a commit to contain a deliberate set of changes.",
                "Review staged changes before committing when necessary."
            ]
        },

        {
            title: "6. git commit",
            explanation:
                "A commit records a snapshot of staged changes in Git history. Good commit messages describe the meaningful change.",
            code: `git commit -m "Add responsive course cards"`,
            points: [
                "Commit only meaningful changes.",
                "Use clear commit messages.",
                "Keep commits reasonably focused.",
                "A commit provides a point in project history."
            ],
            note:
                "Avoid messages such as 'changes', 'update', or 'done'. A useful message tells another developer what changed."
        },

        {
            title: "7. Reading Git History",
            explanation:
                "Git history allows developers to understand how the project evolved.",
            code: `git log

git log --oneline`,
            points: [
                "See previous commits.",
                "Identify commit authors.",
                "Read commit messages.",
                "Find commit IDs.",
                "Investigate when a change was introduced."
            ],
            note:
                "A clean history can make debugging and collaboration much easier."
        },

        {
            title: "8. Branches",
            explanation:
                "A branch provides an independent line of development. Developers commonly create branches for features, fixes or experiments.",
            code: `git branch

git switch -c feature/course-search

git branch`,
            points: [
                "The main branch represents an important integration line.",
                "Feature branches isolate work.",
                "Branches make experimentation safer.",
                "Branches can later be merged."
            ],
            note:
                "Modern Git commonly uses git switch for branch operations. Older workflows often use git checkout."
        },

        {
            title: "9. Merging Branches",
            explanation:
                "Merging combines changes from one branch into another.",
            code: `git switch main

git merge feature/course-search`,
            points: [
                "Move to the branch that should receive the changes.",
                "Merge the source branch.",
                "Git may perform the merge automatically.",
                "Conflicts can occur when changes overlap."
            ]
        },

        {
            title: "10. Merge Conflicts",
            explanation:
                "A merge conflict occurs when Git cannot automatically determine which competing changes should remain.",
            code: `<<<<<<< HEAD
<h1>CodeBhavya Courses</h1>
=======
<h1>CodeBhavya Learning Hub</h1>
>>>>>>> feature/header`,
            points: [
                "Conflicts are normal in collaborative development.",
                "Git marks conflicting regions.",
                "A developer must choose the intended final content.",
                "Remove conflict markers.",
                "Test the project after resolving the conflict.",
                "Stage the resolved file and complete the merge."
            ],
            note:
                "Never blindly choose one side without understanding the intended behaviour."
        },

        {
            title: "11. GitHub and Remote Repositories",
            explanation:
                "A remote repository provides a shared location for Git history and collaboration. GitHub is one popular platform for hosting Git repositories.",
            code: `git remote -v

git remote add origin <repository-url>`,
            points: [
                "Local Git repositories can connect to remote repositories.",
                "origin is a common name for the main remote.",
                "Remote repositories enable collaboration and sharing.",
                "Pull requests can be used to review changes before integration."
            ],
            note:
                "The exact hosting platform is less important than understanding the Git concepts behind the workflow."
        },

        {
            title: "12. clone, pull and push",
            explanation:
                "These commands connect local development with remote repository history.",
            code: `git clone <repository-url>

git pull

git push`,
            points: [
                "clone creates a local copy of a remote repository.",
                "pull retrieves and integrates remote changes.",
                "push sends local commits to a remote repository.",
                "A developer should understand the current branch before pushing."
            ],
            note:
                "A safe habit is to inspect status and understand the current branch before performing destructive or collaborative operations."
        },

        {
            title: "13. .gitignore",
            explanation:
                "The .gitignore file tells Git which files or directories should normally not be tracked.",
            code: `node_modules/
.env
.env.local

dist/
coverage/

.DS_Store`,
            points: [
                "node_modules is normally generated from package metadata.",
                "Environment files may contain sensitive configuration.",
                "Build output may be generated automatically.",
                "Operating-system files usually do not belong in the repository."
            ],
            note:
                "A .gitignore file should be created early in a project rather than after unwanted files have already been committed."
        },

        {
            title: "14. Git Revert vs Destructive History Changes",
            explanation:
                "Git provides multiple ways to undo work. Reverting a commit creates a new commit that reverses an earlier change, while some other commands rewrite history.",
            code: `git revert <commit-id>`,
            points: [
                "git revert is often safer for shared history.",
                "History rewriting requires greater care.",
                "Never rewrite shared history casually.",
                "Understand whether other developers already depend on the commits."
            ],
            note:
                "The important professional habit is to understand whether your undo operation creates a new history entry or rewrites existing history."
        },

        {
            title: "15. What Is npm?",
            explanation:
                "npm is the package manager commonly used with Node.js and JavaScript projects. It helps developers install packages, manage versions and run project scripts.",
            code: `npm --version

npm init`,
            points: [
                "Install project dependencies.",
                "Manage package versions.",
                "Define reusable project scripts.",
                "Share package metadata.",
                "Create reproducible project setups."
            ],
            note:
                "npm is a tool and ecosystem, while Node.js is a JavaScript runtime."
        },

        {
            title: "16. package.json",
            explanation:
                "package.json describes important metadata and configuration for a JavaScript project.",
            code: `{
    "name": "student-dashboard",
    "version": "1.0.0",
    "scripts": {
        "dev": "node server.js",
        "test": "node test.js"
    },
    "dependencies": {},
    "devDependencies": {}
}`,
            points: [
                "Project name and version can be defined.",
                "Scripts provide repeatable commands.",
                "Dependencies describe runtime packages.",
                "devDependencies describe development-only packages.",
                "Other project metadata can also be included."
            ]
        },

        {
            title: "17. Dependencies vs devDependencies",
            explanation:
                "Dependencies are packages required by the application at runtime. Development dependencies support activities such as testing, linting, formatting or building.",
            code: `npm install express

npm install --save-dev eslint`,
            points: [
                "express is commonly used as a runtime dependency.",
                "eslint is commonly used as a development dependency.",
                "The distinction helps communicate project requirements.",
                "Exact deployment behaviour depends on the package manager configuration and environment."
            ],
            note:
                "Do not classify a package only by habit. Ask whether the deployed application needs it to run."
        },

        {
            title: "18. node_modules",
            explanation:
                "node_modules contains installed packages and their dependency trees.",
            code: `npm install

node_modules/
package.json
package-lock.json`,
            points: [
                "It can become very large.",
                "It is generated from package metadata and lock information.",
                "It is normally excluded from Git.",
                "Another developer can recreate it with npm install or npm ci."
            ],
            note:
                "Do not commit node_modules merely because it exists on your computer."
        },

        {
            title: "19. package-lock.json",
            explanation:
                "package-lock.json records the resolved dependency tree so installations can reproduce a specific dependency state more consistently.",
            points: [
                "It records resolved package versions.",
                "It can record transitive dependencies.",
                "It helps make installations reproducible.",
                "It should normally be committed for applications."
            ],
            note:
                "package.json expresses dependency requirements; the lock file records a concrete resolution."
        },

        {
            title: "20. npm install",
            explanation:
                "npm install installs project dependencies and can also update package metadata when packages are added or dependency requirements change.",
            code: `npm install

npm install express

npm install --save-dev eslint`,
            points: [
                "Install project dependencies.",
                "Add a package to dependencies.",
                "Add development tooling to devDependencies.",
                "Resolve a dependency tree."
            ]
        },

        {
            title: "21. npm ci",
            explanation:
                "npm ci is designed for clean, reproducible installations based on the existing lock file. It is especially useful in automated environments.",
            code: `npm ci`,
            points: [
                "It expects a compatible lock file.",
                "It performs a clean installation.",
                "It is useful in CI environments.",
                "It avoids interactively changing dependency requirements."
            ],
            note:
                "A simple distinction: npm install is commonly used while developing or changing dependencies; npm ci is commonly used when reproducing an already-defined dependency state."
        },

        {
            title: "22. npm Scripts",
            explanation:
                "npm scripts create named commands that standardize common project operations.",
            code: `{
    "scripts": {
        "dev": "node server.js",
        "test": "node test.js",
        "lint": "eslint ."
    }
}`,
            code2: `npm run dev
npm test
npm run lint`,
            points: [
                "Scripts make commands easy to remember.",
                "Teams can use the same commands.",
                "CI systems can run the same scripts.",
                "Scripts reduce machine-specific instructions."
            ]
        },

        {
            title: "23. Semantic Versioning",
            explanation:
                "Semantic Versioning commonly represents versions as MAJOR.MINOR.PATCH.",
            code: `1.4.2
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR`,
            points: [
                "PATCH generally represents backward-compatible bug fixes.",
                "MINOR generally represents backward-compatible features.",
                "MAJOR generally represents breaking changes.",
                "Package ranges can control which updates are accepted."
            ],
            note:
                "The exact compatibility guarantee depends on whether a package follows Semantic Versioning correctly."
        },

        {
            title: "24. Reproducible Project Setup",
            explanation:
                "A professional project should allow another developer or a CI system to recreate the expected environment without relying on your personal computer.",
            points: [
                "Commit package.json.",
                "Commit the appropriate lock file.",
                "Do not commit node_modules.",
                "Document required runtime versions when appropriate.",
                "Use npm scripts for common commands.",
                "Keep configuration predictable."
            ],
            code: `git clone <repository>

cd project

npm ci

npm test

npm run dev`,
            note:
                "A project is easier to maintain when setup instructions are short, repeatable and tested."
        },

        {
            title: "25. Environment Configuration",
            explanation:
                "Applications often need configuration that changes between development, testing and production. Environment variables are a common mechanism for supplying such configuration.",
            code: `PORT=3000
API_BASE_URL=https://api.example.com`,
            points: [
                "Environment variables can hold configuration.",
                "Different environments may use different values.",
                "Secrets should not be committed to public repositories.",
                "Use .gitignore for local environment files when appropriate.",
                "Production secrets should be managed by the deployment environment."
            ],
            note:
                "Never publish real passwords, private keys, API secrets or tokens in source control."
        },

        {
            title: "26. Professional Git Workflow",
            explanation:
                "A simple team workflow can combine branches, focused commits, review and controlled integration.",
            code: `main
 │
 ├── feature/search
 │       │
 │       ├── commit
 │       ├── commit
 │       │
 │       └── pull request
 │
 └── merge → main`,
            points: [
                "Create a focused feature branch.",
                "Make small meaningful commits.",
                "Push the branch.",
                "Open a pull request.",
                "Review and test changes.",
                "Merge after approval."
            ],
            note:
                "Teams may use different branching strategies. The underlying ideas of isolated work, review and tested integration remain important."
        },

        {
            title: "27. Common Git Mistakes",
            explanation:
                "Most Git problems become easier when developers understand what they are about to change.",
            points: [
                "Committing node_modules.",
                "Committing secrets.",
                "Using meaningless commit messages.",
                "Working directly on the main branch without understanding the team workflow.",
                "Ignoring merge conflicts.",
                "Pushing without checking the current branch.",
                "Rewriting shared history carelessly.",
                "Deleting changes without confirming what will be lost."
            ],
            note:
                "When unsure, stop and inspect git status, git diff and git log before performing a risky command."
        },

        {
            title: "28. Git + npm Together",
            explanation:
                "Git and npm solve different but complementary problems. npm describes and installs project packages; Git records the project's source and configuration history.",
            code: `student-dashboard/
│
├── src/
├── tests/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md`,
            points: [
                "Git tracks source and configuration.",
                "npm manages JavaScript dependencies.",
                "package.json describes the project.",
                "package-lock.json records resolved dependencies.",
                "node_modules is generated locally."
            ],
            note:
                "This combination becomes the foundation for React, Node.js, Express and MERN projects."
        }
    ],

    visualizer: {
        title: "Git Workflow Visualizer",
        subtitle:
            "Follow a change from editing a file to sharing it through a remote repository.",
        type: "workflow",
        steps: [
            {
                title: "1. Edit",
                description:
                    "A developer modifies a course page in the working tree.",
                code: `lesson.html
   ↓
modified`,
                state: "Working Tree"
            },
            {
                title: "2. Inspect",
                description:
                    "The developer checks what changed.",
                code: `git status
git diff`,
                state: "Review Changes"
            },
            {
                title: "3. Stage",
                description:
                    "The intended file is selected for the next commit.",
                code: `git add lesson.html`,
                state: "Staging Area"
            },
            {
                title: "4. Commit",
                description:
                    "The staged change becomes part of local Git history.",
                code: `git commit -m
"Improve lesson navigation"`,
                state: "Repository"
            },
            {
                title: "5. Push",
                description:
                    "The local commit is sent to the remote repository.",
                code: `git push`,
                state: "Remote Repository"
            },
            {
                title: "6. Review",
                description:
                    "Team members can inspect the change through the team's review workflow.",
                code: `feature branch
      ↓
pull request
      ↓
review`,
                state: "Collaboration"
            },
            {
                title: "7. Integrate",
                description:
                    "After review and testing, the feature can be merged into the main development line.",
                code: `feature
   ↓
 merge
   ↓
main`,
                state: "Integrated"
            }
        ]
    },

    trace: {
        title: "npm Dependency Lifecycle",
        steps: [
            {
                label: "1",
                title: "Declare dependency",
                code: `npm install express`,
                description:
                    "The developer asks npm to add Express to the project."
            },
            {
                label: "2",
                title: "Update package.json",
                code: `"dependencies": {
    "express": "..."
}`,
                description:
                    "The project's dependency requirements are recorded."
            },
            {
                label: "3",
                title: "Resolve packages",
                code: `express
  ↓
dependencies
  ↓
transitive dependencies`,
                description:
                    "npm resolves the package and its dependency tree."
            },
            {
                label: "4",
                title: "Update lock file",
                code: `package-lock.json`,
                description:
                    "Resolved package information is recorded for reproducibility."
            },
            {
                label: "5",
                title: "Install node_modules",
                code: `node_modules/
    express/
    ...`,
                description:
                    "The required packages are installed locally."
            },
            {
                label: "6",
                title: "Run project",
                code: `npm run dev`,
                description:
                    "The project can now use its installed dependency."
            },
            {
                label: "7",
                title: "Reproduce elsewhere",
                code: `git clone ...
npm ci`,
                description:
                    "Another machine can recreate the dependency installation from project metadata and the lock file."
            }
        ]
    },

    revision: [
        [
            "Git",
            "A distributed version-control system used to track source-code history and collaborate on projects."
        ],
        [
            "Repository",
            "A Git-managed project containing files and version-control history."
        ],
        [
            "Working Tree",
            "The files currently present in the local project directory and being edited."
        ],
        [
            "Staging Area",
            "The set of changes selected for inclusion in the next commit."
        ],
        [
            "Commit",
            "A recorded snapshot of staged changes in Git history."
        ],
        [
            "Branch",
            "An independent line of development within a Git repository."
        ],
        [
            "Merge",
            "An operation that combines changes from one branch into another."
        ],
        [
            "Merge Conflict",
            "A situation where Git cannot automatically determine which competing changes should remain."
        ],
        [
            "Remote Repository",
            "A repository hosted separately from the local copy and used for sharing or collaboration."
        ],
        [
            "git clone",
            "Creates a local copy of a remote Git repository."
        ],
        [
            "git pull",
            "Retrieves remote changes and integrates them into the current local branch."
        ],
        [
            "git push",
            "Sends local commits to a remote repository."
        ],
        [
            ".gitignore",
            "A file containing patterns for files and directories Git should normally ignore."
        ],
        [
            "npm",
            "A package manager and ecosystem commonly used for JavaScript and Node.js projects."
        ],
        [
            "package.json",
            "A project manifest containing metadata, dependencies, scripts and other configuration."
        ],
        [
            "Dependency",
            "A package required by an application or project."
        ],
        [
            "devDependency",
            "A package primarily needed for development, testing, linting, formatting or build tooling."
        ],
        [
            "node_modules",
            "The directory containing locally installed npm packages and their dependencies."
        ],
        [
            "package-lock.json",
            "A lock file recording resolved dependency information for more reproducible installations."
        ],
        [
            "npm install",
            "An npm command used to install project dependencies and add or update packages."
        ],
        [
            "npm ci",
            "A clean npm installation command designed for reproducible dependency installation using a lock file."
        ],
        [
            "Semantic Versioning",
            "A versioning convention commonly expressed as MAJOR.MINOR.PATCH."
        ],
        [
            "npm Script",
            "A named command defined in package.json for repeatable project operations."
        ],
        [
            "Reproducible Setup",
            "A project setup that can be recreated consistently on another machine or automated environment."
        ]
    ],

    interview: [
        {
            q: "What is Git?",
            a: "Git is a distributed version-control system used to track changes, maintain project history, create branches and collaborate on software projects."
        },
        {
            q: "What is the difference between Git and GitHub?",
            a: "Git is the version-control system itself. GitHub is a platform that can host Git repositories and provide collaboration, review and project-management features."
        },
        {
            q: "What is the staging area?",
            a: "The staging area contains changes selected for the next commit. It allows developers to control exactly which changes are recorded together."
        },
        {
            q: "What does git status do?",
            a: "It reports the current state of the working tree and staging area, including untracked, modified and staged files."
        },
        {
            q: "Why are meaningful commit messages important?",
            a: "They make project history understandable and help developers determine what each change was intended to accomplish."
        },
        {
            q: "Why are branches useful?",
            a: "Branches isolate feature, bug-fix or experimental work so developers can make changes without directly disturbing another development line."
        },
        {
            q: "What is a merge conflict?",
            a: "It occurs when Git cannot automatically reconcile competing changes, requiring a developer to decide what the final content should be."
        },
        {
            q: "What is .gitignore used for?",
            a: "It specifies files and directories that Git should normally not track, such as node_modules, local environment files and generated build output."
        },
        {
            q: "Why should node_modules normally not be committed?",
            a: "It can be very large and is generated from project dependency metadata. Other developers can recreate it using npm."
        },
        {
            q: "What is npm?",
            a: "npm is a package manager and ecosystem commonly used to install and manage JavaScript packages and run project scripts."
        },
        {
            q: "What is package.json?",
            a: "package.json is a project manifest containing information such as project metadata, dependencies, devDependencies and npm scripts."
        },
        {
            q: "What is the difference between dependencies and devDependencies?",
            a: "Dependencies are generally required by the application at runtime, while devDependencies generally support development activities such as testing, linting and building."
        },
        {
            q: "Why is package-lock.json important?",
            a: "It records resolved dependency information and helps different environments reproduce a more consistent dependency tree."
        },
        {
            q: "What is the difference between npm install and npm ci?",
            a: "npm install is commonly used during development to install or change dependencies. npm ci is designed for clean, reproducible installation from an existing lock file and is commonly used in CI environments."
        },
        {
            q: "What is Semantic Versioning?",
            a: "Semantic Versioning commonly uses MAJOR.MINOR.PATCH, where major changes can indicate breaking changes, minor changes generally add backward-compatible functionality and patch changes generally fix bugs."
        },
        {
            q: "Why should secrets not be committed to Git?",
            a: "Committed secrets can become part of repository history and may be exposed to unauthorized users. Secrets should instead be managed through appropriate environment or secret-management systems."
        },
        {
            q: "What is a reproducible project?",
            a: "A reproducible project is one whose dependencies, scripts and configuration can be recreated reliably on another machine or automated environment."
        },
        {
            q: "What is a typical feature-branch workflow?",
            a: "Create a feature branch, make focused commits, push the branch, open a review request, run tests, receive review and merge the approved changes."
        }
    ],

    practice: [
        {
            title: "Practice 01 — Initialize a Repository",
            task:
                "Create a new student-dashboard project, initialize Git and use git status to inspect the repository before making any commits.",
            difficulty: "Easy",
            hints: [
                "Create and enter a project directory.",
                "Run git init.",
                "Run git status immediately afterward.",
                "Observe the difference before and after creating a file."
            ],
            skills: ["Git", "Repository", "git status"]
        },

        {
            title: "Practice 02 — Stage and Commit",
            task:
                "Create index.html and style.css. Stage only index.html, inspect the status and create a meaningful commit.",
            difficulty: "Easy",
            hints: [
                "Create both files first.",
                "Use git status to see both files.",
                "Use git add index.html.",
                "Commit with a message describing the actual change."
            ],
            skills: ["Staging", "Commit", "Git history"]
        },

        {
            title: "Practice 03 — Read Git History",
            task:
                "Create at least three meaningful commits and use git log and git log --oneline to inspect the resulting history.",
            difficulty: "Easy",
            hints: [
                "Keep each commit focused on one logical change.",
                "Use different useful commit messages.",
                "Run git log after the third commit.",
                "Compare the detailed and compact history formats."
            ],
            skills: ["git log", "Commits", "History"]
        },

        {
            title: "Practice 04 — Feature Branch",
            task:
                "Create a feature branch for a course-search feature, make a change and merge the branch into main.",
            difficulty: "Medium",
            hints: [
                "Create the branch with git switch -c.",
                "Make a small meaningful change.",
                "Commit the change on the feature branch.",
                "Switch to main and merge the feature branch."
            ],
            skills: ["Branches", "Switch", "Merge"]
        },

        {
            title: "Practice 05 — Resolve a Merge Conflict",
            task:
                "Create a deliberate conflict by changing the same line differently on two branches. Merge the branches and resolve the conflict correctly.",
            difficulty: "Hard",
            hints: [
                "Create a file containing a heading.",
                "Change that heading differently on two branches.",
                "Merge one branch into the other.",
                "Remove all conflict markers and keep the intended final content."
            ],
            skills: ["Merge conflicts", "Branches", "Conflict resolution"]
        },

        {
            title: "Practice 06 — Build a .gitignore",
            task:
                "Create a JavaScript project and write a .gitignore file that excludes node_modules, local environment files, build output and operating-system metadata.",
            difficulty: "Easy",
            hints: [
                "Add node_modules/.",
                "Add .env and other local environment files when appropriate.",
                "Add generated build directories such as dist/ if they are not meant to be tracked.",
                "Use git status to verify ignored files are not shown as untracked."
            ],
            skills: [".gitignore", "Project hygiene", "Git"]
        },

        {
            title: "Practice 07 — Initialize npm",
            task:
                "Create a new JavaScript project with package.json and add at least one runtime dependency and one development dependency.",
            difficulty: "Medium",
            hints: [
                "Run npm init or npm init -y.",
                "Use npm install for a runtime package.",
                "Use npm install --save-dev for a development tool.",
                "Open package.json and compare dependencies with devDependencies."
            ],
            skills: ["npm", "package.json", "Dependencies"]
        },

        {
            title: "Practice 08 — npm Scripts",
            task:
                "Create dev, test and lint scripts in package.json and make sure each script can be executed through npm.",
            difficulty: "Medium",
            hints: [
                "Add commands under the scripts property.",
                "Run npm run dev for the custom dev script.",
                "Use npm test for the test script.",
                "Use npm run lint for the lint script."
            ],
            skills: ["npm scripts", "Automation", "package.json"]
        },

        {
            title: "Practice 09 — Install vs CI",
            task:
                "Create package-lock.json, remove node_modules and compare a normal npm install workflow with a clean npm ci workflow.",
            difficulty: "Medium",
            hints: [
                "Install at least one package first.",
                "Confirm package-lock.json exists.",
                "Remove node_modules.",
                "Run npm ci and observe that the dependencies are recreated."
            ],
            skills: ["npm install", "npm ci", "Lock files"]
        },

        {
            title: "Practice 10 — Reproducible Project",
            task:
                "Create a project that another developer can clone and start using only the repository files and documented npm commands.",
            difficulty: "Hard",
            hints: [
                "Commit package.json and package-lock.json.",
                "Do not commit node_modules.",
                "Add a README with setup instructions.",
                "Test the instructions from a clean copy of the project."
            ],
            skills: ["Reproducibility", "Git", "npm"]
        },

        {
            title: "Practice 11 — Professional Git Workflow",
            task:
                "Simulate a team workflow: create a feature branch, make two focused commits, push the branch to a remote repository and prepare it for review.",
            difficulty: "Hard",
            hints: [
                "Start from an up-to-date main branch.",
                "Create a clearly named feature branch.",
                "Keep the two commits logically separate.",
                "Push the feature branch rather than directly changing the main branch."
            ],
            skills: ["Team workflow", "Branches", "Remote repositories"]
        },

        {
            title: "Practice 12 — CodeBhavya Project Workflow Challenge",
            task:
                "Create a small CodeBhavya course project using Git and npm. The project must contain source files, package.json, package-lock.json, .gitignore, npm scripts and a clean commit history. Simulate a feature branch and merge it into main.",
            difficulty: "Hard",
            hints: [
                "Start with npm initialization and a sensible project structure.",
                "Create a .gitignore before installing many dependencies.",
                "Use focused commits rather than one giant commit.",
                "Create a feature branch, implement one feature, commit it and merge it into main after testing."
            ],
            skills: ["Git", "npm", "Project workflow", "Professional practice"]
        }
    ],

    quiz: [
        {
            q: "What is Git primarily used for?",
            options: [
                "Database management",
                "Version control",
                "CSS styling",
                "Image editing"
            ],
            answer: 1,
            explanation:
                "Git is a distributed version-control system."
        },

        {
            q: "What does git add do?",
            options: [
                "Deletes a file",
                "Stages changes",
                "Creates a remote repository",
                "Installs npm packages"
            ],
            answer: 1,
            explanation:
                "git add places selected changes into the staging area."
        },

        {
            q: "What does git commit do?",
            options: [
                "Records staged changes in Git history",
                "Downloads a package",
                "Deletes all branches",
                "Opens DevTools"
            ],
            answer: 0,
            explanation:
                "A commit records the staged snapshot in Git history."
        },

        {
            q: "Why are branches useful?",
            options: [
                "They make CSS faster",
                "They isolate lines of development",
                "They replace npm",
                "They remove all project history"
            ],
            answer: 1,
            explanation:
                "Branches allow developers to isolate feature, fix or experimental work."
        },

        {
            q: "What is a merge conflict?",
            options: [
                "A package installation",
                "A situation Git cannot automatically reconcile",
                "A CSS selector",
                "A successful HTTP request"
            ],
            answer: 1,
            explanation:
                "A merge conflict occurs when Git cannot automatically determine which competing changes should remain."
        },

        {
            q: "What is .gitignore used for?",
            options: [
                "Define HTML structure",
                "Tell Git which files should normally be ignored",
                "Install dependencies",
                "Create JavaScript functions"
            ],
            answer: 1,
            explanation:
                ".gitignore contains patterns for files and directories that Git should normally not track."
        },

        {
            q: "What is npm?",
            options: [
                "A CSS framework",
                "A JavaScript package manager and ecosystem",
                "A database",
                "A browser"
            ],
            answer: 1,
            explanation:
                "npm is commonly used to install and manage JavaScript packages and project scripts."
        },

        {
            q: "Where are npm dependencies commonly declared?",
            options: [
                "package.json",
                "index.html only",
                ".gitignore",
                "README only"
            ],
            answer: 0,
            explanation:
                "package.json contains project dependency declarations."
        },

        {
            q: "Why is node_modules normally not committed?",
            options: [
                "It contains HTML",
                "It is generated and can be recreated from dependency metadata",
                "Git cannot read folders",
                "npm requires it to be ignored"
            ],
            answer: 1,
            explanation:
                "node_modules can be large and is normally recreated from package metadata."
        },

        {
            q: "What is package-lock.json used for?",
            options: [
                "CSS styling",
                "Recording resolved dependency information",
                "Storing passwords",
                "Creating Git branches"
            ],
            answer: 1,
            explanation:
                "The lock file records resolved dependency information for more reproducible installations."
        },

        {
            q: "Which command is designed for a clean installation using the lock file?",
            options: [
                "npm ci",
                "npm start-now",
                "git ci",
                "npm clean-all"
            ],
            answer: 0,
            explanation:
                "npm ci is designed for clean, reproducible installation from an existing lock file."
        },

        {
            q: "What does npm install express generally do?",
            options: [
                "Deletes Express",
                "Adds Express as a project dependency",
                "Creates a Git branch",
                "Opens the browser"
            ],
            answer: 1,
            explanation:
                "npm install express installs Express and records it as a dependency."
        },

        {
            q: "What is the common structure of Semantic Versioning?",
            options: [
                "YEAR.MONTH.DAY",
                "MAJOR.MINOR.PATCH",
                "HTML.CSS.JS",
                "A.B.C.D.E"
            ],
            answer: 1,
            explanation:
                "Semantic Versioning commonly uses MAJOR.MINOR.PATCH."
        },

        {
            q: "Why should secrets not be committed?",
            options: [
                "They make CSS invalid",
                "They can become exposed through repository history",
                "Git cannot store strings",
                "npm removes them"
            ],
            answer: 1,
            explanation:
                "Secrets committed to a repository can be exposed to unauthorized users."
        },

        {
            q: "What is a reproducible project setup?",
            options: [
                "A setup that depends on one developer's computer",
                "A setup that can reliably be recreated elsewhere",
                "A project without package.json",
                "A project containing node_modules in Git"
            ],
            answer: 1,
            explanation:
                "A reproducible setup can be recreated consistently on another machine or automated environment."
        }
    ],

    glossary: [
        {
            term: "Git",
            definition:
                "A distributed version-control system for tracking changes and collaborating on software."
        },
        {
            term: "Repository",
            definition:
                "A Git-managed project containing source files and version history."
        },
        {
            term: "Working Tree",
            definition:
                "The current project files being edited locally."
        },
        {
            term: "Staging Area",
            definition:
                "The set of selected changes prepared for the next commit."
        },
        {
            term: "Commit",
            definition:
                "A recorded snapshot of staged changes."
        },
        {
            term: "Branch",
            definition:
                "An independent development line within a Git repository."
        },
        {
            term: "Merge",
            definition:
                "The process of combining changes from one branch into another."
        },
        {
            term: "Merge Conflict",
            definition:
                "A situation where Git cannot automatically reconcile competing changes."
        },
        {
            term: "Remote",
            definition:
                "A separately hosted Git repository used for sharing and collaboration."
        },
        {
            term: ".gitignore",
            definition:
                "A file containing patterns for content Git should normally ignore."
        },
        {
            term: "npm",
            definition:
                "A package manager and ecosystem commonly used for JavaScript projects."
        },
        {
            term: "package.json",
            definition:
                "The main npm project manifest containing metadata, dependencies and scripts."
        },
        {
            term: "Dependency",
            definition:
                "A package required by an application."
        },
        {
            term: "devDependency",
            definition:
                "A package primarily required during development rather than application runtime."
        },
        {
            term: "node_modules",
            definition:
                "The directory containing installed npm packages."
        },
        {
            term: "package-lock.json",
            definition:
                "A lock file recording resolved dependency information."
        },
        {
            term: "npm install",
            definition:
                "A command used to install dependencies and add or update packages."
        },
        {
            term: "npm ci",
            definition:
                "A clean installation command designed for reproducible dependency installation."
        },
        {
            term: "npm Script",
            definition:
                "A named command stored in package.json."
        },
        {
            term: "Semantic Versioning",
            definition:
                "A versioning convention commonly represented as MAJOR.MINOR.PATCH."
        },
        {
            term: "Reproducibility",
            definition:
                "The ability to recreate a project environment consistently."
        },
        {
            term: "Environment Variable",
            definition:
                "Configuration supplied to a process through the environment."
        }
    ],

    completion: {
        title: "Level 07 Completion Challenge",
        description:
            "Create a professional JavaScript project for a CodeBhavya course feature. Use Git to maintain a clean history and npm to manage the project. Simulate a realistic feature-development workflow from initialization through branch creation, testing and integration.",
        requirements: [
            "Create a new Git repository.",
            "Create a sensible project structure.",
            "Create a .gitignore before committing generated or local-only files.",
            "Create package.json.",
            "Install at least one runtime dependency.",
            "Install at least one development dependency.",
            "Commit package-lock.json.",
            "Do not commit node_modules.",
            "Create useful npm scripts.",
            "Make at least three focused commits.",
            "Create a feature branch.",
            "Implement a meaningful feature on the branch.",
            "Create at least one additional commit on the feature branch.",
            "Merge the feature into main.",
            "Resolve a merge conflict if one occurs.",
            "Test the project after merging.",
            "Write a README containing setup instructions.",
            "Verify the project can be recreated with npm ci.",
            "Ensure no real secrets are committed.",
            "Explain the difference between Git, GitHub and npm."
        ],
        success:
            "You have completed Level 07 when another developer can clone the project, install its dependencies, run its npm scripts and understand the Git history without depending on your personal computer."
    }
};

