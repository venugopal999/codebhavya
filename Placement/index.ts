import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decode(value: string | null | undefined) {
  if (!value) return "";
  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return value;
  }
}

function normalized(value: string) {
  return value.replace(/\r\n/g, "\n").trimEnd();
}

function serviceKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return keys.default || Object.values(keys)[0];
  } catch {
    return null;
  }
}

async function runJudge0(sourceCode: string, stdin: string, problem: Record<string, unknown>) {
  const baseUrl = (Deno.env.get("JUDGE0_URL") || "https://ce.judge0.com").replace(/\/$/, "");
  const languageId = Number(Deno.env.get("JUDGE0_C_LANGUAGE_ID") || "50");
  const token = Deno.env.get("JUDGE0_AUTH_TOKEN");
  const tokenHeader = Deno.env.get("JUDGE0_AUTH_HEADER") || "X-Auth-Token";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers[tokenHeader] = token;

  const response = await fetch(`${baseUrl}/submissions?base64_encoded=true&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_code: encode(sourceCode),
      stdin: encode(stdin),
      language_id: languageId,
      cpu_time_limit: Number(problem.time_limit_seconds || 2),
      memory_limit: Number(problem.memory_limit_kb || 128000),
      max_file_size: 2048,
      enable_network: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge service returned HTTP ${response.status}`);
  }

  const result = await response.json();
  return {
    statusId: Number(result.status?.id || 0),
    status: String(result.status?.description || "Unknown"),
    stdout: decode(result.stdout),
    stderr: decode(result.stderr),
    compileOutput: decode(result.compile_output),
    time: Number(result.time || 0),
    memory: Number(result.memory || 0),
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secret = serviceKey();
    if (!supabaseUrl || !secret) return json({ error: "Supabase server credentials are unavailable" }, 500);

    const admin = createClient(supabaseUrl, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const payload = await request.json();
    const problemSlug = String(payload.problem_slug || "").trim();
    const language = String(payload.language || "c").toLowerCase();
    const sourceCode = String(payload.source_code || "");
    const mode = payload.mode === "submit" ? "submit" : "run";

    if (!problemSlug || language !== "c") return json({ error: "Invalid problem or language" }, 400);
    if (sourceCode.length < 20 || sourceCode.length > 30000) return json({ error: "Source code must contain 20 to 30,000 characters" }, 400);

    let userId: string | null = null;
    const authorization = request.headers.get("Authorization") || "";
    const jwt = authorization.replace(/^Bearer\s+/i, "");
    if (jwt) {
      const authResult = await admin.auth.getUser(jwt);
      userId = authResult.data.user?.id || null;
    }
    if (!userId) return json({ error: "Sign in before running code" }, 401);

    const problemResult = await admin.from("coding_problems")
      .select("id,slug,title,points,time_limit_seconds,memory_limit_kb,is_published")
      .eq("slug", problemSlug).eq("is_published", true).single();
    if (problemResult.error || !problemResult.data) return json({ error: "Problem is unavailable" }, 404);
    const problem = problemResult.data;

    let testsQuery = admin.from("coding_test_cases")
      .select("id,position,stdin,expected_output,is_sample")
      .eq("problem_id", problem.id).order("position").limit(20);
    if (mode === "run") testsQuery = testsQuery.eq("is_sample", true);
    const testsResult = await testsQuery;
    if (testsResult.error || !testsResult.data?.length) return json({ error: "No test cases are configured" }, 500);

    const executions = await Promise.all(testsResult.data.map(async (test) => {
      const execution = await runJudge0(sourceCode, test.stdin, problem);
      const passed = execution.statusId === 3 && normalized(execution.stdout) === normalized(test.expected_output);
      return { test, execution, passed };
    }));

    const passedTests = executions.filter((item) => item.passed).length;
    const allPassed = passedTests === executions.length;
    const maxTime = Math.max(...executions.map((item) => item.execution.time || 0));
    const maxMemory = Math.max(...executions.map((item) => item.execution.memory || 0));
    const firstFailure = executions.find((item) => !item.passed);
    const firstDiagnostic = executions.find((item) => item.execution.compileOutput || item.execution.stderr);
    const pointsAwarded = mode === "submit" && allPassed ? Number(problem.points) : 0;

    let submissionId: string | null = null;
    if (mode === "submit" && userId) {
      const inserted = await admin.from("coding_submissions").insert({
        user_id: userId,
        problem_id: problem.id,
        language,
        source_code: sourceCode,
        status: allPassed ? "Accepted" : (firstFailure?.execution.statusId === 3 ? "Wrong Answer" : firstFailure?.execution.status || "Wrong Answer"),
        passed_tests: passedTests,
        total_tests: executions.length,
        execution_time: maxTime,
        memory_kb: Math.round(maxMemory),
        points_awarded: pointsAwarded,
      }).select("id").single();
      if (inserted.error) return json({ error: "The result ran but could not be saved" }, 500);
      submissionId = inserted.data.id;
    }

    return json({
      submission_id: submissionId,
      status: allPassed ? "Accepted" : (firstFailure?.execution.statusId === 3 ? "Wrong Answer" : firstFailure?.execution.status || "Wrong Answer"),
      passed_tests: passedTests,
      total_tests: executions.length,
      execution_time: maxTime,
      memory_kb: Math.round(maxMemory),
      points_awarded: pointsAwarded,
      compile_output: firstDiagnostic?.execution.compileOutput || "",
      stderr: firstDiagnostic?.execution.stderr || "",
      tests: executions.map((item) => mode === "run" ? {
        passed: item.passed,
        status: item.passed ? "Accepted" : (item.execution.statusId === 3 ? "Wrong Answer" : item.execution.status),
        input: item.test.stdin,
        expected_output: item.test.expected_output,
        actual_output: item.execution.stdout,
      } : {
        passed: item.passed,
        status: item.passed ? "Accepted" : (item.execution.statusId === 3 ? "Wrong Answer" : item.execution.status),
      }),
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Judge execution failed" }, 500);
  }
});
