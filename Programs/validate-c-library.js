"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const buildDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "codebhavya-program-validation-"));

function loadModules(directory, course) {
  return fs.readdirSync(directory)
    .filter((file) => /^\d.*\.js$/.test(file))
    .sort()
    .flatMap((file) => require(path.join(directory, file)))
    .map((program) => ({ course, ...program }));
}

const programs = [
  ...loadModules(path.join(root, "c-library"), "c"),
  ...loadModules(path.join(root, "dsa-library"), "dsa"),
  ...loadModules(path.join(root, "ads-library"), "ads"),
  ...loadModules(path.join(root, "python-library"), "python"),
  ...loadModules(path.join(root, "ai-ml-library"), "ai-ml")
];

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

function normalizeOutput(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

try {
  for (const program of programs) {
    const sourceDirectory = path.join(root, {
      c: "c-source",
      dsa: "dsa-source",
      ads: "ads-source",
      python: "python-source",
      "ai-ml": "ai-ml-source"
    }[program.course]);
    const isPython = program.course === "python" || program.course === "ai-ml";
    const extension = isPython ? "py" : "c";
    const sourcePath = path.join(sourceDirectory, `${program.slug}.${extension}`);
    const executablePath = path.join(buildDirectory, program.slug);
    const runDirectory = path.join(buildDirectory, `${program.slug}-run`);

    if (!fs.existsSync(sourcePath)) {
      failures.push({ slug: program.slug, stage: "source", stderr: "Source file is missing." });
      continue;
    }

    const compilation = isPython
      ? spawnSync("python3", ["-m", "py_compile", sourcePath], { encoding: "utf8", timeout: 10000 })
      : spawnSync(
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
    const execution = spawnSync(isPython ? "python3" : executablePath, isPython ? [sourcePath] : [], {
      cwd: runDirectory,
      input: stdin,
      encoding: "utf8",
      timeout: 3000,
      maxBuffer: 1024 * 1024
    });
    if (execution.status !== 0 || execution.signal) {
      fail(program, "run", execution);
      continue;
    }

    const actualOutput = normalizeOutput(execution.stdout);
    const missingExpectedLines = program.sampleOutput
      .split("\n")
      .map(normalizeOutput)
      .filter((line) => line && !actualOutput.includes(line));
    if (missingExpectedLines.length) {
      failures.push({
        slug: program.slug,
        stage: "sample-output",
        stderr: `Expected output not found: ${missingExpectedLines.join(" | ")}`,
        stdout: String(execution.stdout || "").trim()
      });
    }
  }
} finally {
  fs.rmSync(buildDirectory, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`Validation failed for ${failures.length} program(s).`);
  for (const failure of failures) {
    console.error(`\nFAIL ${failure.slug} [${failure.stage}]`);
    if (failure.stderr) console.error(failure.stderr);
    if (failure.stdout) console.error(`Actual output: ${failure.stdout}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Validated ${programs.length} programs: every C source compiled and every Python source passed syntax checks; all samples completed successfully.`);
}
