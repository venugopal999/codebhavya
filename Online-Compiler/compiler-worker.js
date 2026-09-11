/**
 * CodeBhavya interactive compiler token gateway for Cloudflare Workers.
 *
 * Required Worker secrets:
 *   JDOODLE_CLIENT_ID
 *   JDOODLE_CLIENT_SECRET
 *
 * Required production variable:
 *   ALLOWED_ORIGINS=https://codebhavya.com,https://www.codebhavya.com
 *
 * The JDoodle secret stays in this Worker. The browser receives only a
 * short-lived token and then connects directly to JDoodle's WebSocket API.
 */

const AUTH_URL = "https://api.jdoodle.com/v1/auth-token";

function configuredOrigins(env) {
  return new Set(
    (env.ALLOWED_ORIGINS || "https://codebhavya.com,https://www.codebhavya.com")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
  );
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return configuredOrigins(env).has(origin) ? origin : null;
}

function responseHeaders(origin) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders(origin)
  });
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);

    if (!origin) {
      return new Response("Origin is not allowed.", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin)
      });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/token") {
      return json({ error: "Use POST /token." }, 404, origin);
    }

    if (!env.JDOODLE_CLIENT_ID || !env.JDOODLE_CLIENT_SECRET) {
      return json(
        { error: "The interactive compiler credentials are not configured." },
        503,
        origin
      );
    }

    let upstream;
    try {
      upstream = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clientId: env.JDOODLE_CLIENT_ID,
          clientSecret: env.JDOODLE_CLIENT_SECRET
        }),
        signal: AbortSignal.timeout(10_000)
      });
    } catch (error) {
      return json(
        { error: "The interactive execution service is temporarily unavailable." },
        503,
        origin
      );
    }

    let result = null;
    try {
      result = await upstream.json();
    } catch (error) {
      return json({ error: "The execution service returned an invalid response." }, 502, origin);
    }

    if (!upstream.ok || !result?.token) {
      const message =
        typeof result?.message === "string"
          ? result.message
          : "The execution service could not create a terminal session.";
      return json({ error: message }, upstream.status === 429 ? 429 : 502, origin);
    }

    return json(
      {
        token: result.token,
        expiresIn: 180
      },
      200,
      origin
    );
  }
};
