(() => {
  "use strict";

  const cfg = window.CODEBHAVYA_QUIZ_CONFIG || {};
  const sharedClient = window.CodeBhavyaSupabase && window.CodeBhavyaSupabase.client
    ? window.CodeBhavyaSupabase.client
    : null;

  let client = sharedClient;
  if (!client && window.supabase && typeof window.supabase.createClient === "function") {
    if (cfg.supabaseUrl && cfg.supabaseAnonKey && !cfg.supabaseUrl.includes("PASTE_") && !cfg.supabaseAnonKey.includes("PASTE_")) {
      client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
  }

  if (!client) {
    console.error("CodeBhavya Quiz: Supabase client unavailable. Load Placement/supabase-config.js and Placement/supabase-client.js first.");
  }

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  async function session() {
    if (!client) throw new Error("Supabase connection is unavailable.");
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  function safeReturnPath() {
    const raw = location.pathname + location.search;
    return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/Quiz/";
  }

  async function requireSession() {
    const s = await session();
    if (!s) {
      location.href = `/Quiz/signin.html?return=${encodeURIComponent(safeReturnPath())}`;
      throw new Error("Authentication required");
    }
    return s;
  }

  async function isAdmin() {
    if (!client) return false;
    const { data, error } = await client.rpc("quiz_is_admin_v1");
    if (error) return false;
    return data === true;
  }

  async function requireAdmin() {
    await requireSession();
    if (!(await isAdmin())) {
      document.body.innerHTML = `
        <main class="shell narrow">
          <section class="panel center">
            <h1>Faculty access required</h1>
            <p>This account is not registered as a Quiz Arena faculty administrator.</p>
            <a class="btn primary" href="/Quiz/">Back to Quiz Arena</a>
          </section>
        </main>`;
      throw new Error("Faculty access required");
    }
  }

  function fmtDuration(seconds) {
    seconds = Math.max(0, Number(seconds) || 0);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function localDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  }

  function toast(message, kind="ok") {
    let t = $("cbToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "cbToast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.dataset.kind = kind;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function addDashboardSignOut() {
    const path = location.pathname.replace(/index\.html$/i, "");
    if (path !== "/Quiz/" && path !== "/Quiz/Admin/") return;
    const header = document.querySelector(".topbar");
    if (!header || !client || header.querySelector(".quiz-signout")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-signout";
    button.textContent = "Sign out";
    button.setAttribute("aria-label", "Sign out and switch student");
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Signing out…";
      document.body.classList.add("quiz-signing-out");
      try {
        await Promise.race([
          client.auth.signOut(),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
      } catch (_error) {
        // The browser's saved sign-in is cleared below even when offline.
      } finally {
        try {
          sessionStorage.removeItem("codebhavya-placement-tab-auth-v1");
          sessionStorage.removeItem("codebhavya:placement:last-activity");
          sessionStorage.removeItem("cb_quiz_join");
        } catch (_error) { /* Continue to the sign-in page. */ }
        try {
          const prefixes = ["codebhavya-placement-", "codebhavya-interview-", "codebhavya-mcq-revision-", "codebhavya-mock-", "codebhavya-full-", "codebhavya-solve-timer-"];
          for (let index = localStorage.length - 1; index >= 0; index--) {
            const key = localStorage.key(index);
            if (key && (prefixes.some(prefix => key.startsWith(prefix)) || /^codebhavya-[a-z0-9_-]+-draft:/.test(key))) {
              localStorage.removeItem(key);
            }
          }
        } catch (_error) { /* The private page is already covered. */ }
        location.replace("/Quiz/signin.html");
      }
    });
    header.classList.add("has-quiz-signout");
    header.appendChild(button);
  }

  addDashboardSignOut();

  async function enterFullscreen() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      return Boolean(document.fullscreenElement);
    } catch (e) {
      toast("Your browser blocked full screen. Use the browser full-screen control if needed.", "error");
      return false;
    }
  }

  window.CBQuiz = {
    client, $, esc, session, requireSession, isAdmin, requireAdmin,
    fmtDuration, localDate, toast, enterFullscreen, cfg
  };
})();
