(async () => {
  const { client, $, esc, requireSession, fmtDuration, toast, enterFullscreen } = CBQuiz;
  try { await requireSession(); } catch { return; }

  const params = new URLSearchParams(location.search);
  const attemptId = params.get("attempt");
  if (!attemptId) { location.href="./"; return; }

  let state=null, payload=null, current=0, answers={}, timerId=null, channel=null, waitingPoll=null, inReview=false;

  async function loadState() {
    const { data, error } = await client.rpc("quiz_state_for_attempt_v1", { p_attempt_id: attemptId });
    if (error) throw error;
    state = data;
    return state;
  }

  function hashString(input) {
    let h=2166136261;
    for (let i=0;i<input.length;i++) { h ^= input.charCodeAt(i); h = Math.imul(h,16777619); }
    return h >>> 0;
  }

  function deterministicShuffle(arr, salt) {
    return [...arr].sort((a,b)=>hashString(`${salt}:${a.id}`)-hashString(`${salt}:${b.id}`));
  }

  async function loadPayload() {
    const { data, error } = await client.rpc("quiz_payload_v1", { p_attempt_id: attemptId });
    if (error) throw error;
    payload = data;
    answers = Object.fromEntries((payload.saved_answers || []).map(x => [x.question_id, x.option_id]));
    if (payload.shuffle_questions) payload.questions = deterministicShuffle(payload.questions, `${attemptId}:questions`);
    if (payload.shuffle_options) payload.questions.forEach(q => q.options = deterministicShuffle(q.options, `${attemptId}:${q.id}:options`));
  }

  async function goFullscreen() {
    const ok = await enterFullscreen();
    if (ok) updateExamGuard();
  }

  function updateExamGuard() {
    const guard=$("examGuard");
    if (!guard) return;
    if (state?.status === "live" && !document.fullscreenElement) {
      guard.innerHTML='<div class="notice warn exam-guard">Full-screen mode is recommended for the quiz. <button class="btn ghost mini" id="guardFullscreen">Enter Full Screen</button></div>';
      $("guardFullscreen")?.addEventListener("click",goFullscreen);
    } else {
      guard.innerHTML="";
    }
  }

  function renderWaiting() {
    inReview=false;
    $("quizRoot").innerHTML = `<section class="panel waiting-card">
      <span class="pulse"></span>
      <h1>${esc(state.title)}</h1>
      <p class="muted">${esc(state.course || "")}</p>
      <div class="code-big">${esc(state.code)}</div>
      <div class="notice warn">You are joined. Keep this page open. The quiz will open automatically when faculty clicks Start.</div>
      <p>${state.question_count} question${state.question_count===1?"":"s"} · ${Math.round(state.duration_seconds/60)} minutes</p>
      <div class="actions" style="justify-content:center"><button class="btn teal" id="waitingFullscreen">Enter Full Screen</button></div>
    </section>`;
    $("waitingFullscreen")?.addEventListener("click",goFullscreen);
    startWaitingPoll();
  }

  function startWaitingPoll() {
    clearInterval(waitingPoll);
    waitingPoll=setInterval(async()=>{
      try{
        const before=state?.status;
        const oldCount=state?.question_count;
        await loadState();
        if (state.status!==before || state.question_count!==oldCount) await openLive();
      }catch(e){console.warn(e)}
    },2000);
  }

  function stopWaitingPoll(){clearInterval(waitingPoll);waitingPoll=null}

  function remainingSeconds() {
    if (!state?.started_at) return state?.duration_seconds || 0;
    const deadline = new Date(state.started_at).getTime() + state.duration_seconds*1000;
    return Math.max(0, Math.ceil((deadline-Date.now())/1000));
  }

  async function openLive() {
    await loadState();
    if (state.status === "closed" || state.attempt_status === "submitted") {
      stopWaitingPoll();
      location.href=`result.html?attempt=${encodeURIComponent(attemptId)}`;
      return;
    }
    if (state.status !== "live") { renderWaiting(); return; }
    stopWaitingPoll();
    await loadPayload();
    current=Math.min(current,Math.max(0,payload.questions.length-1));
    renderQuiz();
    startTimer();
    updateExamGuard();
  }

  function optionHtml(q) {
    return q.options.map(o => `<label class="option ${answers[q.id]===o.id?"selected":""}">
      <input type="radio" name="answer" value="${esc(o.id)}" ${answers[q.id]===o.id?"checked":""}>
      <span>${esc(o.text)}</span>
    </label>`).join("");
  }

  function paletteHtml() {
    return payload.questions.map((x,i)=>`<button class="pal ${answers[x.id]?"answered":""} ${i===current&&!inReview?"current":""}" data-i="${i}">${i+1}</button>`).join("");
  }

  function bindPalette() {
    document.querySelectorAll(".pal").forEach(b => b.addEventListener("click",()=>{
      current=Number(b.dataset.i); inReview=false; renderQuiz();
    }));
  }

  function renderQuiz() {
    inReview=false;
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
        <div class="options">${optionHtml(q)}</div>
        <div class="actions">
          <button class="btn ghost" id="prevBtn" ${current===0?"disabled":""}>Previous</button>
          <button class="btn primary" id="nextBtn">${current===payload.questions.length-1?"Review Answers":"Save & Next"}</button>
          <button class="btn danger" id="submitBtn">Submit Quiz</button>
        </div>
        <div class="palette">${paletteHtml()}</div>
      </section>`;

    document.querySelectorAll('input[name="answer"]').forEach(r => r.addEventListener("change", async()=>{
      document.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));
      r.closest(".option")?.classList.add("selected");
      await saveCurrent();
    }));
    bindPalette();
    $("prevBtn").onclick=()=>{if(current>0){current--;renderQuiz()}};
    $("nextBtn").onclick=async()=>{
      await saveCurrent();
      if(current<payload.questions.length-1){current++;renderQuiz()} else {renderReview()}
    };
    $("submitBtn").onclick=()=>submit(false);
    updateExamGuard();
  }

  function renderReview() {
    inReview=true;
    const answered=payload.questions.filter(q=>answers[q.id]).length;
    const unanswered=payload.questions.length-answered;
    $("quizRoot").innerHTML=`
      <div class="quizhead">
        <div><strong>${esc(payload.title)}</strong><div class="muted">Review before submission</div></div>
        <div class="timer" id="timer">${fmtDuration(remainingSeconds())}</div><span class="badge live">LIVE</span>
      </div>
      <section class="question-card review-card">
        <div class="qmeta"><span>Review Summary</span><span>${answered}/${payload.questions.length} answered</span></div>
        <h2>Check your answers before submitting</h2>
        ${unanswered?`<div class="notice warn">${unanswered} question${unanswered===1?" is":"s are"} still unanswered.</div>`:'<div class="notice">All questions have an answer.</div>'}
        <div class="review-list">
          ${payload.questions.map((q,i)=>`<div class="review-row ${answers[q.id]?"done":"pending"}">
            <div><strong>Question ${i+1}</strong><span>${answers[q.id]?"Answered":"Unanswered"}</span></div>
            <button class="btn ghost review-go" data-i="${i}">Go to Question</button>
          </div>`).join("")}
        </div>
        <div class="actions"><button class="btn ghost" id="backQuestions">Back to Questions</button><button class="btn danger" id="reviewSubmit">Submit Quiz</button></div>
        <div class="palette">${paletteHtml()}</div>
      </section>`;
    document.querySelectorAll(".review-go").forEach(b=>b.onclick=()=>{current=Number(b.dataset.i);renderQuiz()});
    bindPalette();
    $("backQuestions").onclick=()=>renderQuiz();
    $("reviewSubmit").onclick=()=>submit(false);
    updateExamGuard();
  }

  async function saveCurrent() {
    if (!payload || inReview) return;
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
    const { error } = await client.rpc("quiz_submit_v1", { p_attempt_id: attemptId });
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

  // Exam-mode deterrents. These improve classroom discipline but are not a substitute for secure server-side scoring.
  document.addEventListener("contextmenu",e=>{
    if(state?.status==="live") { e.preventDefault(); toast("Right-click is disabled during the quiz.","error"); }
  });
  document.addEventListener("fullscreenchange",updateExamGuard);
  window.addEventListener("beforeunload",e=>{
    if(state?.status==="live" && state?.attempt_status!=="submitted") { e.preventDefault(); e.returnValue=""; }
  });

  try {
    await openLive();
    await subscribe();
  } catch(e) {
    $("quizRoot").innerHTML=`<section class="panel"><div class="notice bad">${esc(e.message)}</div><a class="btn primary" href="./">Back</a></section>`;
  }
})();
