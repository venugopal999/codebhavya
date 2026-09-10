(function () {
  "use strict";

  const STORAGE_KEY = "codebhavya.dbms.course.progress.v1";
  const explanations = [
    "Equal determinant values must always produce equal dependent values in every legal relation state.",
    "AB → A is trivial because the right side is already a subset of the left side.",
    "Augmentation adds the same attributes to both sides, so A → B permits AC → BC.",
    "A set is a super key when its closure contains every attribute of the relation.",
    "A candidate key is a super key with no removable attribute.",
    "A minimal cover first decomposes every right side so that it contains one attribute.",
    "An FD represents a semantic rule that must hold in every legal state, not an accidental pattern in current rows."
  ];

  const presets = {
    chain: {
      attributes: "A, B, C, D, E",
      dependencies: "A -> B\nB -> C\nAC -> D\nD -> E",
      start: "A"
    },
    composite: {
      attributes: "A, B, C, D",
      dependencies: "A -> B\nC -> D",
      start: "A, C"
    },
    "two-keys": {
      attributes: "A, B, C",
      dependencies: "A -> B\nB -> A\nB -> C",
      start: "A"
    },
    normalization: {
      attributes: "student_id, course_id, student_name, course_title, grade",
      dependencies: "student_id -> student_name\ncourse_id -> course_title\nstudent_id,course_id -> grade",
      start: "student_id, course_id"
    }
  };

  function unique(items) {
    return Array.from(new Set(items));
  }

  function isCompactAttributeText(value, schema) {
    if (!/^[A-Za-z]+$/.test(value)) return false;
    if (schema && schema.length && schema.every(function (item) { return item.length === 1; })) return true;
    return value.length > 1 && value.toUpperCase() === value;
  }

  function parseAttributeSet(value, schema) {
    const text = String(value || "").trim();
    if (!text) return [];
    const rough = text.indexOf(",") !== -1 || /\s/.test(text)
      ? text.split(/[\s,]+/)
      : [text];
    const result = [];
    rough.filter(Boolean).forEach(function (token) {
      if (isCompactAttributeText(token, schema)) result.push.apply(result, token.split(""));
      else result.push(token);
    });
    return unique(result);
  }

  function parseSchema(value) {
    const attributes = parseAttributeSet(value, []);
    if (!attributes.length) throw new Error("Enter at least one relation attribute.");
    if (attributes.length > 10) throw new Error("This learning calculator supports at most 10 attributes.");
    return attributes;
  }

  function parseDependencies(value, schema) {
    const statements = String(value || "").split(/[;\n]+/).map(function (item) { return item.trim(); }).filter(Boolean);
    if (!statements.length) throw new Error("Enter at least one functional dependency.");
    return statements.map(function (statement, index) {
      const parts = statement.replace(/→/g, "->").split("->");
      if (parts.length !== 2) throw new Error("Dependency " + (index + 1) + " must use ->, for example A -> B.");
      const lhs = parseAttributeSet(parts[0], schema);
      const rhs = parseAttributeSet(parts[1], schema);
      if (!lhs.length || !rhs.length) throw new Error("Dependency " + (index + 1) + " needs attributes on both sides.");
      const unknown = lhs.concat(rhs).filter(function (attribute) { return schema.indexOf(attribute) === -1; });
      if (unknown.length) throw new Error("Unknown attribute " + unknown[0] + " in dependency " + (index + 1) + ".");
      return { lhs: lhs, rhs: rhs, label: formatSet(lhs) + " → " + formatSet(rhs) };
    });
  }

  function subsetOf(left, rightSet) {
    return left.every(function (attribute) { return rightSet.has(attribute); });
  }

  function closureOf(start, dependencies) {
    const result = new Set(start);
    const steps = [];
    let changed = true;
    while (changed) {
      changed = false;
      dependencies.forEach(function (dependency) {
        if (!subsetOf(dependency.lhs, result)) return;
        const added = dependency.rhs.filter(function (attribute) { return !result.has(attribute); });
        if (!added.length) return;
        added.forEach(function (attribute) { result.add(attribute); });
        steps.push({ dependency: dependency.label, added: added.slice(), after: Array.from(result) });
        changed = true;
      });
    }
    return { attributes: Array.from(result), steps: steps };
  }

  function formatSet(attributes) {
    return "{" + attributes.join(", ") + "}";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function readInputs() {
    const schema = parseSchema(document.getElementById("relationAttributes").value);
    const dependencies = parseDependencies(document.getElementById("dependencyInput").value, schema);
    return { schema: schema, dependencies: dependencies };
  }

  function renderError(result, message) {
    result.className = "fd-calculator-result is-error";
    result.innerHTML = "<span>CHECK THE INPUT</span><h3>Unable to calculate</h3><p>" + escapeHtml(message) + "</p>";
  }

  function renderClosure(result, schema, start, outcome) {
    const isSuperKey = schema.every(function (attribute) { return outcome.attributes.indexOf(attribute) !== -1; });
    const steps = outcome.steps.length
      ? "<ol class=\"closure-trace\">" + outcome.steps.map(function (step) {
          return "<li><code>" + escapeHtml(step.dependency) + "</code> adds <strong>" + escapeHtml(formatSet(step.added)) + "</strong><small>Closure becomes " + escapeHtml(formatSet(step.after)) + "</small></li>";
        }).join("") + "</ol>"
      : "<p class=\"no-inference\">No dependency adds a new attribute to the starting set.</p>";
    result.className = "fd-calculator-result " + (isSuperKey ? "is-success" : "");
    result.innerHTML = "<span>CLOSURE RESULT</span><h3>" + escapeHtml(formatSet(start)) + "⁺ = " + escapeHtml(formatSet(outcome.attributes)) + "</h3><p class=\"key-verdict\">" + (isSuperKey ? "This set determines the entire relation, so it is a super key. Test minimality before calling it a candidate key." : "This set does not determine the entire relation, so it is not a super key.") + "</p>" + steps;
  }

  function combinations(items, size) {
    const output = [];
    function visit(start, chosen) {
      if (chosen.length === size) { output.push(chosen.slice()); return; }
      for (let index = start; index <= items.length - (size - chosen.length); index += 1) {
        chosen.push(items[index]);
        visit(index + 1, chosen);
        chosen.pop();
      }
    }
    visit(0, []);
    return output;
  }

  function containsKey(candidate, keys) {
    return keys.some(function (key) {
      return key.every(function (attribute) { return candidate.indexOf(attribute) !== -1; });
    });
  }

  function findCandidateKeys(schema, dependencies) {
    const rhs = new Set();
    dependencies.forEach(function (dependency) { dependency.rhs.forEach(function (attribute) { rhs.add(attribute); }); });
    const mandatory = schema.filter(function (attribute) { return !rhs.has(attribute); });
    const optional = schema.filter(function (attribute) { return mandatory.indexOf(attribute) === -1; });
    const keys = [];
    for (let size = 0; size <= optional.length; size += 1) {
      combinations(optional, size).forEach(function (addition) {
        const candidate = mandatory.concat(addition);
        if (containsKey(candidate, keys)) return;
        const outcome = closureOf(candidate, dependencies);
        if (schema.every(function (attribute) { return outcome.attributes.indexOf(attribute) !== -1; })) keys.push(candidate);
      });
    }
    return { mandatory: mandatory, keys: keys };
  }

  function renderKeys(result, schema, data) {
    const keyMarkup = data.keys.length
      ? data.keys.map(function (key) { return "<strong class=\"candidate-key-pill\">" + escapeHtml(formatSet(key)) + "</strong>"; }).join("")
      : "<strong>No key found. Recheck the dependency set.</strong>";
    result.className = "fd-calculator-result " + (data.keys.length ? "is-success" : "is-error");
    result.innerHTML = "<span>CANDIDATE-KEY SEARCH</span><h3>" + data.keys.length + " minimal key" + (data.keys.length === 1 ? "" : "s") + " found</h3><p>Attributes absent from every RHS are mandatory: <code>" + escapeHtml(formatSet(data.mandatory)) + "</code>.</p><div class=\"candidate-key-list\">" + keyMarkup + "</div><p class=\"search-note\">Subsets were tested from smallest to largest. Supersets of a discovered key were skipped because they cannot be minimal.</p>";
  }

  function initCalculator() {
    const form = document.getElementById("fdCalculatorForm");
    const keyButton = document.getElementById("findKeysButton");
    const result = document.getElementById("fdCalculatorResult");
    if (!form || !keyButton || !result) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      try {
        const inputs = readInputs();
        const start = parseAttributeSet(document.getElementById("closureStart").value, inputs.schema);
        if (!start.length) throw new Error("Enter at least one starting attribute.");
        const unknown = start.filter(function (attribute) { return inputs.schema.indexOf(attribute) === -1; });
        if (unknown.length) throw new Error("Starting attribute " + unknown[0] + " is not in the relation.");
        renderClosure(result, inputs.schema, start, closureOf(start, inputs.dependencies));
      } catch (error) { renderError(result, error.message); }
    });
    keyButton.addEventListener("click", function () {
      try {
        const inputs = readInputs();
        renderKeys(result, inputs.schema, findCandidateKeys(inputs.schema, inputs.dependencies));
      } catch (error) { renderError(result, error.message); }
    });
    document.querySelectorAll("[data-fd-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        const preset = presets[button.dataset.fdPreset];
        if (!preset) return;
        document.getElementById("relationAttributes").value = preset.attributes;
        document.getElementById("dependencyInput").value = preset.dependencies;
        document.getElementById("closureStart").value = preset.start;
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
    });
  }

  function initChecks() {
    const checks = Array.from(document.querySelectorAll(".concept-check"));
    const score = document.getElementById("conceptScore");
    const answered = new Map();
    function update() {
      let correct = 0;
      answered.forEach(function (value) { if (value) correct += 1; });
      if (score) score.textContent = "Answered correctly: " + correct + " of " + checks.length;
    }
    checks.forEach(function (check, index) {
      const answer = check.dataset.answer;
      const feedback = check.querySelector(".check-feedback");
      const buttons = Array.from(check.querySelectorAll("[data-option]"));
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          const correct = button.dataset.option === answer;
          answered.set(index, correct);
          buttons.forEach(function (item) {
            item.classList.remove("is-correct", "is-wrong");
            if (item.dataset.option === answer) item.classList.add("is-correct");
          });
          if (!correct) button.classList.add("is-wrong");
          feedback.innerHTML = correct ? "<strong>Correct.</strong> " + explanations[index] : "Not quite. Review the highlighted answer. " + explanations[index];
          update();
        });
      });
    });
  }

  function readProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value.map(Number) : [];
    } catch (error) { return []; }
  }

  function initCompletion() {
    const button = document.getElementById("completeLessonButton");
    const status = document.getElementById("lessonSidebarStatus");
    if (!button) return;
    let completed = readProgress();
    function render() {
      const done = completed.indexOf(6) !== -1;
      button.classList.toggle("is-complete", done);
      button.setAttribute("aria-pressed", String(done));
      button.textContent = done ? "✓ Level 6 completed" : "Mark Level 6 complete";
      if (status) {
        status.textContent = done ? "Level 6 completed" : "Not completed";
        status.parentElement.classList.toggle("is-complete", done);
      }
    }
    button.addEventListener("click", function () {
      const index = completed.indexOf(6);
      if (index === -1) completed.push(6); else completed.splice(index, 1);
      completed.sort(function (a, b) { return a - b; });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch (error) {}
      render();
    });
    render();
  }

  function initReading() {
    const bar = document.getElementById("lessonReadingBar");
    const links = Array.from(document.querySelectorAll(".lesson-section-link"));
    const sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      if (bar) bar.style.width = percent + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) { link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id); });
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  function init() {
    initCalculator();
    initChecks();
    initCompletion();
    initReading();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
