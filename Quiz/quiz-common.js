(() => {
  "use strict";

  const cfg = window.CODEBHAVYA_QUIZ_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey ||
      cfg.supabaseUrl.includes("PASTE_") || cfg.supabaseAnonKey.includes("PASTE_")) {
    console.warn("CodeBhavya Quiz: configure Quiz/config.js first.");
  }

  const { createClient } = window.supabase;
  const client = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  async function session() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function requireSession() {
    const s = await session();
    if (!s) {
      const next = encodeURIComponent(location.pathname + location.search);
      location.href = `/login.html?next=${next}`;
      throw new Error("Authentication required");
    }
    return s;
  }

  async function isAdmin() {
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
    t._timer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  window.CBQuiz = { client, $, esc, session, requireSession, isAdmin, requireAdmin, fmtDuration, localDate, toast, cfg };
})();
