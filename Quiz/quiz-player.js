(async () => {
  const { client, $, esc, requireSession, fmtDuration, toast } = CBQuiz;
  try { await requireSession(); } catch { return; }

  const params = new URLSearchParams(location.search);
  const attemptId = params.get("attempt");
  if (!attemptId) { location.href="./"; return; }

  let state=null, payload=null, current=0, answers={}, timerId=null, channel=null;

  async function loadState() {
    const { data, error } = await client.rpc("quiz_state_for_attempt_v1", { p_attempt_id: attemptId });
    if (error) throw error;
    state = data;
    return state;
  }

  async function loadPayload() {
    const { data, error } = await client.rpc("quiz_payload_v1", { p_attempt_id: attemptId });
    if (error) throw error;
    payload = data;
    answers = Object.fromEntries((payload.saved_answers || []).map(x => [x.question_id, x.option_id]));
    if (payload.shuffle_questions) payload.questions = shuffleStable(payload.questions);
    if (payload.shuffle_options) payload.questions.forEach(q => q.options = shuffleStable(q.options));
  }

  function shuffleStable(arr) {
    // Randomizes presentation only. Correct answers never exist in the browser payload.
    return [...arr].sort(() => Math.random() - .5);
  }

  function renderWaiting() {
    $("quizRoot").innerHTML = `<section class="panel waiting-card">
      <span class="pulse"></span>
      <h1>${esc(state.title)}</h1>
      <p class="muted">${esc(state.course || "")}</p>
      <div class="code-big">${esc(state.code)}</div>
      <div class="notice warn">You are joined. Keep this page open. The quiz will open when faculty clicks Start.</div>
      <p>${state.question_count} questions · ${Math.round(state.duration_seconds/60)} minutes</p>
    </section>`;
  }

  function remainingSeconds() {
    if (!state.started_at) return state.duration_seconds;
    const deadline = new Date(state.started_at).getTime() + state.duration_seconds*1000;
    return Math.max(0, Math.ceil((deadline-Date.now())/1000));
  }

  async function openLive() {
    await loadState();
    if (state.status === "closed" || state.attempt_status === "submitted") { location.href=`result.html?attempt=${encodeURIComponent(attemptId)}`; return; }
    if (state.status !== "live") { renderWaiting(); return; }
    await loadPayload();
    renderQuiz();
    startTimer();
  }

  function renderQuiz() {
    const q = payload.questions[current];
    $("quizRoot").innerHTML = `
      <div class="quizhead">
        <div><strong>${esc(payload.title)}</strong><div class="muted">${esc(payload.course||"")}</div></div>
        <div class="timer" id="timer">${fmtDuration(remainingSeconds())}</div>
        <span class="badge live">LIVE</span>
      </div>
      <section class="question-card">
        <div class="qmeta"><span>Question ${current+1} of ${payload.questions.length}</span><span>${q.marks} mark${q.marks===1?"":"s"}</span></div>
        <h2>${esc(q.text)}</h2>
        <div class="options">
          ${q.options.map(o => `<label class="option ${answers[q.id]===o.id?"selected":""}">
            <input type="radio" name="answer" value="${esc(o.id)}" ${answers[q.id]===o.id?"checked":""}>
            <span>${esc(o.text)}</span>
          </label>`).join("")}
        </div>
        <div class="actions">
          <button class="btn ghost" id="prevBtn" ${current===0?"disabled":""}>Previous</button>
          <button class="btn primary" id="nextBtn">${current===payload.questions.length-1?"Review":"Save & Next"}</button>
          <button class="btn danger" id="submitBtn">Submit Quiz</button>
        </div>
        <div class="palette">${payload.questions.map((x,i)=>`<button class="pal ${answers[x.id]?"answered":""} ${i===current?"current":""}" data-i="${i}">${i+1}</button>`).join("")}</div>
      </section>`;

    document.querySelectorAll('input[name="answer"]').forEach(r => r.addEventListener("change", saveCurrent));
    document.querySelectorAll(".pal").forEach(b => b.addEventListener("click",()=>{current=Number(b.dataset.i);renderQuiz()}));
    $("prevBtn").onclick=()=>{if(current>0){current--;renderQuiz()}};
    $("nextBtn").onclick=async()=>{await saveCurrent(); if(current<payload.questions.length-1) current++; renderQuiz()};
    $("submitBtn").onclick=()=>submit(false);
  }

  async function saveCurrent() {
    if (!payload) return;
    const q = payload.questions[current];
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return;
    answers[q.id]=selected.value;
    const { error } = await client.rpc("quiz_save_answer_v1", {
      p_attempt_id: attemptId, p_question_id: q.id, p_option_id: selected.value
    });
    if (error) toast(error.message,"error");
  }

  function startTimer() {
    clearInterval(timerId);
    const tick=async()=>{
      const rem=remainingSeconds();
      const el=$("timer");
      if(el){el.textContent=fmtDuration(rem);el.classList.toggle("urgent",rem<=60)}
      if(rem<=0){clearInterval(timerId);await submit(true)}
    };
    tick(); timerId=setInterval(tick,1000);
  }

  async function submit(auto) {
    if (!auto && !confirm("Submit this quiz now? You cannot attempt it again.")) return;
    await saveCurrent();
    const { data, error } = await client.rpc("quiz_submit_v1", { p_attempt_id: attemptId });
    if (error) { toast(error.message,"error"); return; }
    location.href=`result.html?attempt=${encodeURIComponent(attemptId)}`;
  }

  async function subscribe() {
    await loadState();
    channel = client.channel(`quiz-session-${state.quiz_id}`)
      .on("postgres_changes", {event:"UPDATE",schema:"public",table:"quizzes",filter:`id=eq.${state.quiz_id}`}, async () => {
        try { await openLive(); } catch(e) { console.error(e); }
      }).subscribe();
  }

  try {
    await openLive();
    await subscribe();
  } catch(e) {
    $("quizRoot").innerHTML=`<section class="panel"><div class="notice bad">${esc(e.message)}</div><a class="btn primary" href="./">Back</a></section>`;
  }
})();