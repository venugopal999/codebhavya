"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const moduleDirectory = path.join(root, "c-library");
const sourceDirectory = path.join(root, "c-source");
const buildDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "codebhavya-c-validation-"));

const programs = fs.readdirSync(moduleDirectory)
  .filter((file) => /^\d.*\.js$/.test(file))
  .sort()
  .flatMap((file) => require(path.join(moduleDirectory, file)));

const failures = [];

function fail(program, stage, result) {
  failures.push({
    slug: program.slug,
    stage,
    status: result.status,
    signal: result.signal,
    stderr: String(result.stderr || "").trim(),
    stdout: String(result.stdout || "").trim()
  });
}

try {
  for (const program of programs) {
    const sourcePath = path.join(sourceDirectory, `${program.slug}.c`);
    const executablePath = path.join(buildDirectory, program.slug);
    const runDirectory = path.join(buildDirectory, `${program.slug}-run`);

    if (!fs.existsSync(sourcePath)) {
      failures.push({ slug: program.slug, stage: "source", stderr: "Source file is missing." });
      continue;
    }

    const compilation = spawnSync(
      "gcc",
      ["-std=c11", "-Wall", "-Wextra", "-Werror", "-pedantic", sourcePath, "-lm", "-o", executablePath],
      { encoding: "utf8", timeout: 10000 }
    );
    if (compilation.status !== 0 || compilation.signal) {
      fail(program, "compile", compilation);
      continue;
    }

    fs.mkdirSync(runDirectory);
    const stdin = program.sampleInput === "No input required" ? "" : `${program.sampleInput}\n`;
    const execution = spawnSync(executablePath, [], {
      cwd: runDirectory,
      input: stdin,
      encoding: "utf8",
      timeout: 3000,
      maxBuffer: 1024 * 1024
    });
    if (execution.status !== 0 || execution.signal) fail(program, "run", execution);
  }
} finally {
  fs.rmSync(buildDirectory, { recursive: true, force: true });
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Validated ${programs.length} C programs: every source compiled and completed successfully.`);
}
