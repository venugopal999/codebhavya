"use strict";

function clean(text) {
  return String(text).replace(/^\n/, "").replace(/\s+$/, "");
}

function joinConcepts(concepts) {
  if (concepts.length === 1) return concepts[0];
  if (concepts.length === 2) return `${concepts[0]} and ${concepts[1]}`;
  return `${concepts.slice(0, -1).join(", ")}, and ${concepts.at(-1)}`;
}

function inferTime(options) {
  if (options.time) return options.time;
  const slug = options.slug || "";
  const topic = options.topic || "";
  const source = options.source || "";
  const ai = options.course === "ai-ml";

  if (/matrix-multiplication/.test(slug)) return "O(n³)";
  if (/a-star/.test(slug)) return "O((V + E) log V)";
  if (/(?:-bfs|-dfs)$/.test(slug)) return "O(V + E)";
  if (/recursive-fibonacci/.test(slug)) return "O(2ⁿ)";
  if (/prime-check/.test(slug)) return "O(√n)";
  if (/knn-classification/.test(slug)) return "O(n · d + n log n)";
  if (/kmeans-iteration/.test(slug)) return "O(n · k · d)";
  if (/silhouette/.test(slug)) return "O(n²)";
  if (/one-hot-encoding/.test(slug)) return "O(n · k)";
  if (/dense-layer/.test(slug)) return "O(i · o)";
  if (/convolution-1d/.test(slug)) return "O(n · k)";
  if (/random-forest-vote/.test(slug)) return "O(t)";
  if (/nearest-centroid/.test(slug)) return "O(k · d)";
  if (/weighted-rating|cosine-similarity|linear-decision|rbf-kernel|polynomial-kernel|project-vector|artificial-neuron/.test(slug)) return "O(d)";
  if (/precision-at-k/.test(slug)) return "O(k)";
  if (/greedy-decoding/.test(slug)) return "O(v)";
  if (/keyword-retrieval/.test(slug)) return "O(c · w)";
  if (/batch-prediction/.test(slug)) return "O(n · d)";
  if (/sort|heapq/.test(slug)) return "O(n log n)";
  if (/nested-loops|triangle-pattern|number-triangle|character-frequency/.test(slug)) return "O(n²)";

  const constantAi = /rule-classifier|bayes-theorem|z-score|sigmoid|binary-cross-entropy|odds|decision-stump|hinge-loss|adaboost-weight|precision-recall|f1-score|specificity|iqr-bounds|grayscale|iou|q-learning-update|value-update|model-metadata|monitoring-alert|api-response|placement-metric-answer/;
  if (ai && constantAi.test(slug)) return "O(1)";

  const constantPython = /hello-world|print-multiple-values|formatted-output|read-name|read-two-integers|sum-user-input|custom-separator|custom-end|variable-assignment|multiple-assignment|swap-values|type-conversion|complex-number|boolean-values|none-value|constant-convention|arithmetic-operators|floor-division|power-operator|comparison-operators|logical-operators|bitwise-operators|operator-precedence|absolute-round|divmod|positive-negative-zero|even-or-odd|largest-three|leap-year|grade-calculator|vowel-check|triangle-validity|match-case|nested-if|short-circuit|list-create-access|list-append-extend|tuple-pack-unpack|tuple-single-item|dictionary-create-access|dictionary-update|function-no-arguments|function-arguments|default-argument|keyword-arguments|lambda-square|function-annotations|class-object|constructor|instance-method|class-variable|inheritance|method-overriding|super|encapsulation-property|class-method|static-method|try-except|multiple-exceptions|try-else-finally|raise-exception|custom-exception|math-module|seeded-random|decimal-module|fraction-module|date-format|date-difference|iterator-next|decorator|closure|walrus-operator|dataclass|namedtuple|chainmap/;
  if (!ai && constantPython.test(slug)) return "O(1)";

  if (ai) return "O(n)";
  if (/Loops|Patterns|Strings|Lists|Exceptions & Files|Regular Expressions|JSON, CSV|Functional/.test(topic) || /\b(for|while)\b/.test(source)) return "O(n)";
  if (/Tuples, Sets & Dictionaries/.test(topic) && !/dictionary-(?:create-access|update)/.test(slug)) return "O(n)";
  return "O(1)";
}

function inferSpace(options, time) {
  if (options.space) return options.space;
  const slug = options.slug || "";
  const topic = options.topic || "";
  const source = options.source || "";
  const ai = options.course === "ai-ml";
  if (/recursive-(?:factorial|fibonacci)/.test(slug)) return "O(n)";
  if (time.includes("V + E") || /a-star/.test(slug)) return "O(V)";
  if (/matrix-(?:addition|multiplication|transpose)|max-pooling|low-rank-reconstruction/.test(slug)) return "O(n²)";
  if (/generator-function|generator-expression/.test(slug)) return "O(1) lazy; O(n) when materialized";
  if (/one-hot-encoding/.test(slug)) return "O(n · k)";
  if (/kmeans-iteration/.test(slug)) return "O(n + k)";
  if (/dense-layer/.test(slug)) return "O(o)";
  if (/knn-classification/.test(slug)) return "O(n)";

  const constantAi = /rule-classifier|absolute-loss|model-inference|vector-magnitude|determinant-2x2|mean$|variance$|standard-deviation|bayes-theorem|z-score|prediction$|mse$|fit-line|gradient-step|r2-score|sigmoid|binary-prediction|binary-cross-entropy|odds|gaussian-likelihood|posterior-score|categorical-nb|gini-impurity|entropy|decision-stump|information-gain|linear-decision|margin$|hinge-loss|polynomial-kernel|rbf-kernel|hard-voting|soft-voting|weighted-voting|adaboost-weight|accuracy$|precision-recall|f1-score|specificity|grid-search|manhattan-distance|nearest-centroid|update-centroid|silhouette|covariance|project-vector|zscore-anomaly|iqr-bounds|reconstruction-error|cosine-similarity|user-mean|weighted-rating|precision-at-k|artificial-neuron|grayscale|iou|term-frequency|text-cosine|positional-encoding|scaled-dot-attention|tool-routing|uniform-cost|greedy-best-first|reward-total|discounted-return|q-learning-update|epsilon-greedy|value-update|model-metadata|data-drift|demographic-parity|monitoring-alert|explain-linear-model|prediction-pipeline|api-response|placement-metric-answer/;
  if (ai && constantAi.test(slug)) return "O(1)";
  if (ai) return "O(n)";

  const constantPython = /hello-world|print-multiple-values|formatted-output|read-name|read-two-integers|sum-user-input|custom-separator|custom-end|escape-sequences|comments-docstring|variable-assignment|multiple-assignment|swap-values|type-conversion|complex-number|boolean-values|none-value|constant-convention|arithmetic-operators|floor-division|power-operator|comparison-operators|logical-operators|bitwise-operators|operator-precedence|absolute-round|divmod|positive-negative-zero|even-or-odd|largest-three|leap-year|grade-calculator|vowel-check|triangle-validity|match-case|nested-if|short-circuit|list-create-access|list-append-extend|tuple-pack-unpack|tuple-single-item|dictionary-create-access|dictionary-update|function-no-arguments|function-arguments|default-argument|keyword-arguments|lambda-square|function-annotations|class-object|constructor|instance-method|class-variable|inheritance|method-overriding|super|encapsulation-property|class-method|static-method|try-except|multiple-exceptions|try-else-finally|raise-exception|custom-exception|math-module|seeded-random|decimal-module|fraction-module|date-format|date-difference|iterator-next|decorator|closure|walrus-operator|dataclass|namedtuple|chainmap/;
  if (constantPython.test(slug)) return "O(1)";
  if (/Strings|Lists|Tuples, Sets & Dictionaries|Exceptions & Files|Regular Expressions|JSON, CSV/.test(topic)) return "O(n)";
  if (/\[(?:[^\]]*\bfor\b)|\{(?:[^}]*\bfor\b)|list\(|dict\(|set\(|sorted\(|split\(|read_text|readlines|json\.|csv\.|Counter\(|deque\(/s.test(source)) return "O(n)";
  return "O(1)";
}

function buildSteps(options, concepts) {
  const title = options.title.replace(/\s+(?:in|with) Python$/, "");
  const source = options.source || "";
  const primary = concepts[0];
  const secondary = concepts[1];
  const first = /\binput\s*\(/.test(source)
    ? `Read the sample input and convert it into the values required for ${title.toLowerCase()}.`
    : /^\s*(?:from|import)\s/m.test(source)
      ? `Import the required standard-library tools and prepare the sample data for ${title.toLowerCase()}.`
      : `Initialize the sample values used to ${title.toLowerCase()}.`;
  let second;
  if (/\bclass\s+/.test(source)) second = `Define the class behavior for ${primary}${secondary ? ` and apply ${secondary}` : ""}.`;
  else if (/\b(?:for|while)\b/.test(source)) second = `Process the data step by step using ${joinConcepts(concepts.slice(0, 2))}.`;
  else if (/\b(?:try|except|raise)\b/.test(source)) second = `Execute the operation safely with ${joinConcepts(concepts.slice(0, 2))}.`;
  else if (/\b(?:open|Path|StringIO)\b/.test(source)) second = `Perform the file operation using ${joinConcepts(concepts.slice(0, 2))}.`;
  else second = `Apply ${joinConcepts(concepts.slice(0, 2))} to compute the required result.`;
  return [first, second, `Display the result for ${title.toLowerCase()} and compare it with the documented sample output.`];
}

function buildExplanation(options, concepts) {
  const title = options.title.replace(/\s+(?:in|with) Python$/, "");
  const action = /\b(?:for|while)\b/.test(options.source)
    ? "processes the sample values in a controlled iteration"
    : /\bclass\s+/.test(options.source)
      ? "organizes the required state and behavior in a class"
      : /\b(?:try|except|raise)\b/.test(options.source)
        ? "protects the operation with explicit exception handling"
        : "computes the result directly from the prepared sample data";
  return `This example of ${title.toLowerCase()} ${action}. It demonstrates ${joinConcepts(concepts)} and prints a deterministic result that can be checked against the sample output.`;
}

function buildErrors(options, concepts) {
  const title = options.title.replace(/\s+(?:in|with) Python$/, "");
  const source = options.source || "";
  const errors = [`For ${title.toLowerCase()}, keep the data shape and value types consistent with ${concepts[0]}.`];
  if (/\b(?:for|while|if|elif|else|def|class|try|except|with)\b/.test(source)) errors.push("Keep every dependent statement inside the correct indented Python block.");
  else errors.push(`Apply ${concepts[0]} in the same order shown by the algorithm; changing the order can change the result.`);
  if (/\/|sqrt|log|exp|probability|mean|variance|score/i.test(source)) errors.push("Check denominators, numeric ranges and rounding before comparing the calculated value.");
  else if (/\b(?:open|Path|StringIO)\b/.test(source)) errors.push("Use the intended file mode and encoding, and let the context manager close the resource.");
  else if (/\binput\s*\(/.test(source)) errors.push("Enter values in the documented order and convert text input to the required numeric type.");
  else errors.push(`Verify the final ${joinConcepts(concepts.slice(0, 2))} result against the sample before trying new data.`);
  return errors;
}

function makePython(options) {
  const concepts = options.concepts?.length ? options.concepts : [options.topic];
  const time = inferTime(options);
  const space = inferSpace(options, time);
  return {
    course: "python",
    courseLabel: "Python",
    language: "python",
    languageLabel: "Python",
    extension: "py",
    learnHref: "../Python/index.html",
    difficulty: "Beginner",
    time,
    space,
    sampleInput: "No input required",
    summary: `Learn ${options.title.toLowerCase()} with a short, executable Python example.`,
    explanation: options.explanation || buildExplanation(options, concepts),
    errors: options.errors || buildErrors(options, concepts),
    steps: options.steps || buildSteps(options, concepts),
    ...options,
    concepts,
    source: clean(options.source)
  };
}

module.exports = { clean, makePython };
