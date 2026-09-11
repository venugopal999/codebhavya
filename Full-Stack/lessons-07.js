"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

const Q = (q, options, answer, explanation) => ({q, options, answer, explanation});

Object.assign(window.FULLSTACK_LESSONS, {
7:{
title:"Git, npm & Project Workflow",
kicker:"WEB FOUNDATIONS · PROFESSIONAL TOOLING",
duration:"90–120 minutes",
summary:"Move from writing files to managing real JavaScript projects. Learn how Git records change, how GitHub supports collaboration, how npm defines reproducible dependencies and how a clean workflow turns a folder of code into a maintainable project.",
outcomes:[
"Explain the difference between a working tree, staging area, local repository and remote repository.",
"Create meaningful commits, branches and pull requests without treating Git as a file backup.",
"Use npm, package.json, scripts and lockfiles to make JavaScript projects reproducible.",
"Design a practical project workflow that protects source code, dependencies, secrets and team changes."
],
concepts:[
{
title:"Git records project history as a directed graph",
text:"Git is a distributed version-control system. A repository stores snapshots and the relationships between commits, while your working tree contains the files you are currently editing. A commit is not simply a copy of one file: it records a project snapshot plus metadata and a parent relationship. Branches are movable names pointing to commits.",
points:[
"The working tree contains your current edits.",
"The staging area selects the exact changes that the next commit will contain.",
"The local repository contains commits and history; a remote such as GitHub is another repository location.",
"Git is different from GitHub: Git is the version-control system, while GitHub is a hosted collaboration platform."
],
code:`git status
git add index.html app.js
git commit -m "Build course navigation"
git log --oneline --decorate --graph --all`
},
{
title:"The staging area gives commits a deliberate boundary",
text:"Git does not force you to commit every modified file together. git add moves selected content into the staging area, where you can inspect exactly what is about to become the next commit. This makes small, focused commits easier to review, revert and understand.",
points:[
"git diff shows unstaged changes.",
"git diff --staged shows what is currently staged.",
"git restore <file> can discard working-tree changes, so use it carefully.",
"Good commit messages describe the change, not the debugging emotion behind it."
],
code:`git diff
git add src/
git diff --staged
git commit -m "Add student search component"`
},
{
title:"Branches isolate a line of work",
text:"A branch is a movable reference to a commit. Creating a branch does not duplicate the entire project folder; it gives you an independent name for new commits. A common workflow keeps the main branch releasable while features are developed separately and merged after review.",
points:[
"Create a branch for a coherent feature or fix.",
"Switching branches changes the working-tree files to match that branch.",
"Merge combines histories; conflicts occur when Git cannot safely reconcile competing edits.",
"Delete a branch after its work has been merged when it is no longer useful."
],
code:`git switch main
git pull
git switch -c feature/student-search

# edit files, test, then:
git add .
git commit -m "Add student search"
git switch main
git merge feature/student-search`
},
{
title:"GitHub adds collaboration around Git repositories",
text:"A remote repository lets a team exchange commits. The usual feature workflow is to clone the repository, create a branch, commit locally, push the branch and open a pull request. A pull request is a review and integration conversation; it is not itself a Git commit.",
points:[
"git clone creates a local copy with its remote configuration.",
"git fetch downloads remote history without changing your current branch.",
"git pull generally fetches and then integrates remote changes into the current branch.",
"Pull requests should explain what changed, why it changed and how it was verified."
],
code:`git clone https://github.com/example/student-app.git
cd student-app
git switch -c feature/profile
git add .
git commit -m "Add student profile"
git push -u origin feature/profile`
},
{
title:"npm is the package manager and project interface for JavaScript",
text:"npm can install packages, run project scripts and manage dependency metadata. A package.json file describes a project: its name, version, scripts, dependencies and other metadata. Installing a package with npm install records a dependency in package.json and updates the lockfile so installations can resolve the dependency tree consistently.",
points:[
"dependencies are packages required by the application at runtime.",
"devDependencies are packages needed mainly for development, testing or building.",
"npm scripts provide repeatable commands such as npm run dev and npm test.",
"node_modules contains installed packages and normally should not be committed."
],
code:`npm init -y
npm install express
npm install --save-dev eslint
npm run test

# Inspect the dependency tree:
npm ls --depth=0`
},
{
title:"package.json and the lockfile solve different problems",
text:"package.json expresses the project's declared dependency requirements and scripts. package-lock.json records the resolved dependency tree, including concrete versions and integrity information. Together they let a project describe both its intended dependencies and the installation that was resolved.",
points:[
"Commit package.json and package-lock.json for an npm project.",
"Do not manually edit a lockfile just to silence a version mismatch.",
"npm ci is designed for clean, reproducible installation from the lockfile, especially in CI.",
"Update dependencies intentionally and review release notes for important packages."
],
code:`{
  "scripts": {
    "dev": "node src/server.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0"
  }
}

# Clean installation in CI:
npm ci`
},
{
title:"A project needs a predictable structure and safe boundaries",
text:"A maintainable project separates source code, tests, configuration and generated files. The exact folders depend on the application, but the important rule is that the repository should contain what another developer needs to understand and build the project—not machine-specific caches or private credentials.",
points:[
"Use .gitignore for node_modules, build output, local environment files and editor/OS noise.",
"Never commit API keys, passwords, private tokens or production credentials.",
"Use environment variables or a secret-management system for deployment secrets.",
"README documentation should explain setup, scripts, architecture decisions and verification steps."
],
code:`# .gitignore
node_modules/
dist/
coverage/
.env
.DS_Store

# A simple project shape
student-app/
├─ src/
├─ test/
├─ public/
├─ package.json
├─ package-lock.json
├─ .gitignore
└─ README.md`
},
{
title:"A professional workflow is a repeatable feedback loop",
text:"A reliable project workflow is more than a list of Git commands. Start from a clean branch, make one understandable change, run the relevant checks, inspect the diff, commit, push and review. After integration, verify the resulting application again. The same loop scales from a solo project to a team repository.",
points:[
"Pull or fetch current work before starting when the shared branch changes frequently.",
"Keep commits small enough that another person can review them.",
"Run formatting, linting, tests and a production build when those checks exist.",
"Treat a failing check as feedback to investigate, not something to bypass blindly."
],
code:`git status
git switch main
git pull
git switch -c feature/marks-search

npm ci
npm test
npm run lint
npm run build

git diff
git add .
git commit -m "Add marks search"
git push -u origin feature/marks-search`
}
],
flowTitle:"From an idea to an integrated project change",
flow:[
{name:"Plan",detail:"Choose a small change and identify the files, behaviour and checks involved."},
{name:"Branch",detail:"Create an isolated line of work so the shared branch remains stable."},
{name:"Build",detail:"Edit source files and install only the packages the project actually needs."},
{name:"Verify",detail:"Run tests, linting or a build and inspect the final diff."},
{name:"Share",detail:"Commit, push and open a reviewable change for the team."},
{name:"Integrate",detail:"Resolve review feedback, merge safely and verify the integrated result."}
],
trace:{
code:[
"git switch main",
"git pull",
"git switch -c feature/search",
"edit src/search.js",
"npm test",
"git diff",
"git add src/search.js",
"git commit -m \"Add search\"",
"git push -u origin feature/search"
],
steps:[
{line:0,state:"Start from shared branch",explain:"The developer first switches to main so the feature branch begins from the intended baseline."},
{line:1,state:"Synchronize history",explain:"git pull brings the current remote changes into the local main branch before new work starts."},
{line:2,state:"Create feature branch",explain:"The new branch isolates the search change from the shared main branch."},
{line:3,state:"Change source",explain:"The developer edits only the files needed for the feature."},
{line:4,state:"Run checks",explain:"Tests provide feedback before the change is committed or shared."},
{line:5,state:"Inspect diff",explain:"The developer reviews exactly what changed before staging it."},
{line:6,state:"Stage selected file",explain:"Only the intended search file is selected for the next commit."},
{line:7,state:"Create commit",explain:"The commit records a focused project snapshot with a meaningful message."},
{line:8,state:"Publish branch",explain:"The branch is pushed to the remote so collaborators can review and integrate it."}
]
},
revision:[
["Git","Distributed version-control system for tracking project history."],
["Working tree","Current files and edits in your local project."],
["Staging area","Selected content prepared for the next commit."],
["Commit","Recorded project snapshot with history metadata."],
["Branch","Movable reference used to develop an independent line of history."],
["Remote","Another repository location used to exchange history."],
["npm","JavaScript package manager and project command interface."],
["package.json","Project metadata, scripts and declared dependency requirements."],
["Lockfile","Resolved dependency tree used for reproducible installation."],
[".gitignore","Rules for files and directories Git should not track."]
],
interview:[
{q:"What is the difference between Git and GitHub?",a:"Git is the distributed version-control system that manages repository history. GitHub is a hosted service that stores Git repositories and adds collaboration features such as pull requests, issues and reviews."},
{q:"Why is the staging area useful?",a:"It lets you choose exactly which changes belong in the next commit. That produces focused commits instead of forcing unrelated edits into one historical change."},
{q:"What is the difference between git fetch and git pull?",a:"fetch downloads remote references and objects without integrating them into your current branch. pull normally performs a fetch and then integrates the fetched changes into the current branch."},
{q:"Why should node_modules normally not be committed?",a:"It can contain a very large number of generated dependency files and is reproducible from the package manifest and lockfile. Committing it makes repositories larger and platform-dependent."},
{q:"Why commit package-lock.json?",a:"It records the resolved dependency tree and integrity information, reducing unexpected differences between installations. It is especially useful when teams and CI need consistent dependency resolution."},
{q:"Why should .env files containing secrets stay out of Git?",a:"A Git repository is a history of data, so a secret committed even briefly can remain in history or reach a remote. Secrets should be injected through environment configuration or a secret-management system and rotated if exposed."}
],
practice:[
{title:"First Git Repository",prompt:"Create a small JavaScript project, initialize Git, add a README and package.json, make two focused commits and inspect the history."},
{title:"Feature Branch Workflow",prompt:"Create a feature branch for a student-search page, make a deliberate change, run a check, inspect the diff, commit and push the branch."},
{title:"npm Project Setup",prompt:"Create package.json scripts for dev, test and build. Add one runtime dependency and one development dependency, then explain why each belongs in its section."},
{title:"Repository Audit",prompt:"Take an existing JavaScript project and identify files that should be ignored, secrets that must be removed, missing documentation and commands that should be recorded in README.md."}
],
quiz:[
Q("Which area contains changes selected for the next commit?",["Working tree","Staging area","Remote server","node_modules"],1,"The staging area is the boundary for the next commit."),
Q("What does a branch mainly provide?",["A database server","An independent line of Git history","A replacement for npm","A CSS scope"],1,"A branch is a movable reference used to develop a line of history."),
Q("Which command creates a new branch and switches to it?",["git log","git switch -c feature/name","git diff","git status"],1,"git switch -c creates the branch and switches to it."),
Q("What is package-lock.json primarily for?",["Writing CSS","Recording resolved dependency information","Storing passwords","Replacing package.json"],1,"The lockfile records the resolved dependency tree and integrity data."),
Q("Which directory is normally excluded from a Node.js Git repository?",["src","test","node_modules","public"],2,"Dependencies can be recreated from the package manifest and lockfile."),
Q("What is the safest place for a production API secret?",["Committed source code","A public README","A secret/environment configuration system","A CSS file"],2,"Secrets should not be stored in source control; use secure configuration or secret management.")
],
takeaway:"Professional JavaScript development is a loop: isolate a change, build it, verify it, record it clearly and share it safely."
}
});
