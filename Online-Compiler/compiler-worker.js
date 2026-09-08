/**
 * CodeBhavya compiler gateway for Cloudflare Workers.
 *
 * Required production setting:
 *   ALLOWED_ORIGINS=https://codebhavya.com,https://www.codebhavya.com
 *
 * Optional settings:
 *   JUDGE0_BASE_URL=https://ce.judge0.com
 *   JUDGE0_AUTH_TOKEN=<token used by a private/self-hosted Judge0 instance>
 *   RAPIDAPI_KEY=<Judge0 RapidAPI key>
 *   RAPIDAPI_HOST=<Judge0 RapidAPI host>
 */

const ALLOWED_LANGUAGE_IDS = new Set([91, 102, 103, 105, 109]);
const MAX_SOURCE_CHARACTERS = 65_000;
const MAX_INPUT_CHARACTERS = 16_000;
const MAX_REQUEST_BYTES = 90_000;

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    }
  });
}

function configuredOrigins(env) {
  return new Set(
    (env.ALLOWED_ORIGINS || "https://codebhavya.com,https://www.codebhavya.com")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
  );
}

function requestOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return configuredOrigins(env).has(origin) ? origin : null;
}

function judgeHeaders(env) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (env.JUDGE0_AUTH_TOKEN) {
    headers["X-Auth-Token"] = env.JUDGE0_AUTH_TOKEN;
  }
  if (env.RAPIDAPI_KEY) {
    headers["X-RapidAPI-Key"] = env.RAPIDAPI_KEY;
  }
  if (env.RAPIDAPI_HOST) {
    headers["X-RapidAPI-Host"] = env.RAPIDAPI_HOST;
  }

  return headers;
}

function safeText(value) {
  return typeof value === "string" ? value : "";
}

function safeResult(result) {
  return {
    stdout: safeText(result.stdout),
    stderr: safeText(result.stderr),
    compile_output: safeText(result.compile_output),
    message: safeText(result.message),
    time: result.time ?? null,
    memory: result.memory ?? null,
    exit_code: result.exit_code ?? null,
    exit_signal: result.exit_signal ?? null,
    status: {
      id: Number(result.status?.id || 0),
      description: safeText(result.status?.description) || "Unknown result"
    }
  };
}

export default {
  async fetch(request, env) {
    const origin = requestOrigin(request, env);

    if (!origin) {
      return new Response("Origin is not allowed.", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    if (request.method === "OPTIONS") {
      return json({ ok: true }, 200, origin);
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/execute") {
      return json({ error: "Use POST /execute." }, 404, origin);
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return json({ error: "Request is too large." }, 413, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return json({ error: "Request body must be valid JSON." }, 400, origin);
    }

    const languageId = Number(body.language_id);
    const sourceCode = safeText(body.source_code);
    const stdin = safeText(body.stdin);

    if (!ALLOWED_LANGUAGE_IDS.has(languageId)) {
      return json({ error: "That programming language is not enabled." }, 400, origin);
    }
    if (!sourceCode.trim()) {
      return json({ error: "Source code is required." }, 400, origin);
    }
    if (sourceCode.length > MAX_SOURCE_CHARACTERS) {
      return json({ error: "Source code is too large." }, 413, origin);
    }
    if (stdin.length > MAX_INPUT_CHARACTERS) {
      return json({ error: "Standard input is too large." }, 413, origin);
    }

    const baseUrl = (env.JUDGE0_BASE_URL || "https://ce.judge0.com").replace(/\/$/, "");
    const executionRequest = {
      language_id: languageId,
      source_code: sourceCode,
      stdin,
      cpu_time_limit: 3,
      wall_time_limit: 6,
      memory_limit: 128000,
      stack_limit: 64000,
      max_processes_and_or_threads: 30,
      enable_network: false
    };

    let upstream;
    try {
      upstream = await fetch(
        `${baseUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers: judgeHeaders(env),
          body: JSON.stringify(executionRequest),
          signal: AbortSignal.timeout(18_000)
        }
      );
    } catch (error) {
      return json(
        { error: "The execution service is temporarily unavailable. Please try again." },
        503,
        origin
      );
    }

    let result;
    try {
      result = await upstream.json();
    } catch (error) {
      return json({ error: "The execution service returned an invalid response." }, 502, origin);
    }

    if (!upstream.ok) {
      return json(
        { error: safeText(result.message) || "The execution service rejected the program." },
        upstream.status >= 500 ? 502 : upstream.status,
        origin
      );
    }

    if (!result.status) {
      return json(
        { error: "The execution service did not finish synchronously. Please try again." },
        504,
        origin
      );
    }

    return json(safeResult(result), 200, origin);
  }
};
