(async () => {
  const { client, $, esc, requireSession, fmtDuration, toast, enterFullscreen } = CBQuiz;
  try { await requireSession(); } catch { return; }

  const params = new URLSearchParams(location.search);
  const attemptId = params.get("attempt");
  if (!attemptId) { location.href="./"; return; }

  let state=null, payload=null, current=0, answers={}, timerId=null, channel=null, waitingPoll=null;
  let inReview=false, examActive=false, submitting=false, fullscreenExitBusy=false, resumeMode="quiz", feedbackStage=false, feedbackSaved=false;
  let timingQuestionId=null, timingStartedAt=0;

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

  async function requestExamFullscreen() {
    const ok = await enterFullscreen();
    if (ok) {
      updateWaitingFullscreenState();
      return true;
    }
    return false;
  }

  function updateWaitingFullscreenState() {
    const btn=$("waitingFullscreen");
    const status=$("fullscreenReadyStatus");
    if (!btn || !status) return;
    if (document.fullscreenElement) {
      btn.textContent="Full Screen Ready ✓";
      btn.disabled=true;
      btn.classList.remove("teal");
      btn.classList.add("ghost");
      status.innerHTML='<span class="fullscreen-ready">✓ Ready for quiz</span>';
    } else {
      btn.textContent="Enter Full Screen & Get Ready";
      btn.disabled=false;
      btn.classList.add("teal");
      btn.classList.remove("ghost");
      status.innerHTML='<span class="fullscreen-not-ready">Full screen is required before questions can open.</span>';
    }
  }

  function renderWaiting() {
    examActive=false;
    inReview=false;
    $("examGuard").innerHTML="";
    $("quizRoot").innerHTML = `<section class="panel waiting-card">
      <span class="pulse"></span>
      <h1>${esc(state.title)}</h1>
      <p class="muted">${esc(state.course || "")}</p>
      <div class="code-big">${esc(state.code)}</div>
      <div class="notice warn">You are joined. Before the quiz starts, enter full-screen mode and remain there until submission.</div>
      <p>${state.question_count} question${state.question_count===1?"":"s"} · ${Math.round(state.duration_seconds/60)} minutes</p>
      <div id="fullscreenReadyStatus" class="fullscreen-ready-line"></div>
      <div class="actions" style="justify-content:center">
        <button class="btn teal" id="waitingFullscreen">Enter Full Screen & Get Ready</button>
      </div>
      <p class="muted small-note">When faculty starts the quiz, questions open only while this page is in browser full-screen mode.</p>
    </section>`;
    $("waitingFullscreen")?.addEventListener("click", requestExamFullscreen);
    updateWaitingFullscreenState();
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
    },1500);
  }

  function stopWaitingPoll(){clearInterval(waitingPoll);waitingPoll=null}

  function remainingSeconds() {
    if (!state?.started_at) return state?.duration_seconds || 0;
    const deadline = new Date(state.started_at).getTime() + state.duration_seconds*1000;
    return Math.max(0, Math.ceil((deadline-Date.now())/1000));
  }

  function renderFullscreenGate() {
    examActive=false;
    inReview=false;
    $("examGuard").innerHTML="";
    $("quizRoot").innerHTML = `
      <div class="quizhead">
        <div><strong>${esc(state.title)}</strong><div class="muted">${esc(state.course||"")}</div></div>
        <div class="timer" id="timer">${fmtDuration(remainingSeconds())}</div>
        <span class="badge live">LIVE</span>
      </div>
      <section class="panel fullscreen-gate center">
        <div class="fs-lock-icon">⛶</div>
        <h1>Quiz has started</h1>
        <p class="lead-text">Full-screen mode is required before the questions are shown.</p>
        <div class="notice warn"><strong>Your quiz timer is already running.</strong><br>Enter full screen now to begin answering.</div>
        <button class="btn teal fullscreen-main-btn" id="startFullscreenBtn">Enter Full Screen & Start Answering</button>
        <p class="muted small-note">During the live quiz, leaving full screen triggers a warning. On the third full-screen exit, your quiz is automatically submitted.</p>
      </section>`;
    $("startFullscreenBtn").onclick=async()=>{
      const ok=await requestExamFullscreen();
      if(!ok) return;
      try{
        if(!payload) await loadPayload();
        examActive=true;
        renderQuiz();
        startTimer();
      }catch(e){toast(e.message,"error")}
    };
    startTimer();
  }

  async function openLive() {
    await loadState();
    if (state.status === "closed" || state.attempt_status === "submitted") {
      stopWaitingPoll();
      submitting=true;
      location.href=`result.html?attempt=${encodeURIComponent(attemptId)}`;
      return;
    }
    if (state.status !== "live") { renderWaiting(); return; }

    stopWaitingPoll();

    // Questions are never shown until browser Fullscreen API is active.
    if (!document.fullscreenElement) {
      renderFullscreenGate();
      return;
    }

    if(!payload) await loadPayload();
    current=Math.min(current,Math.max(0,payload.questions.length-1));
    examActive=true;
    renderQuiz();
    startTimer();
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

  async function flushQuestionTime(){
    if(!timingQuestionId || !timingStartedAt) return;
    const seconds=Math.max(0,Math.min(600,Math.round((Date.now()-timingStartedAt)/1000)));
    const qid=timingQuestionId;
    timingQuestionId=null; timingStartedAt=0;
    if(seconds<1)return;
    try{ await client.rpc("quiz_record_question_time_v7",{p_attempt_id:attemptId,p_question_id:qid,p_seconds:seconds}); }catch(e){console.warn(e)}
  }

  function startQuestionTime(questionId){
    if(timingQuestionId===questionId && timingStartedAt)return;
    if(timingQuestionId && timingQuestionId!==questionId) flushQuestionTime();
    timingQuestionId=questionId; timingStartedAt=Date.now();
  }

  function renderQuiz() {
    if(!document.fullscreenElement){
      renderFullscreenGate();
      return;
    }

    examActive=true;
    inReview=false;
    const q = payload.questions[current];
    $("examGuard").innerHTML="";
    $("quizRoot").innerHTML = `
      <div class="quizhead">
        <div><strong>${esc(payload.title)}</strong><div class="muted">${esc(payload.course||"")}</div></div>
        <div class="timer" id="timer">${fmtDuration(remainingSeconds())}</div>
        <span class="badge live">LIVE</span>
      </div>
      <section class="question-card">
        <div class="qmeta"><span>Question ${current+1} of ${payload.questions.length}</span><span>+${q.marks}${Number(q.negative_marks||0)>0?` / -${q.negative_marks}`:""} mark${q.marks===1?"":"s"}</span></div>
        <h2>${esc(q.text)}</h2>
        <div class="options">${optionHtml(q)}</div>
        <div class="actions">
          <button class="btn ghost" id="prevBtn" ${current===0?"disabled":""}>Previous</button>
          <button class="btn primary" id="nextBtn">${current===payload.questions.length-1?"Review Answers":"Save & Next"}</button>
          <button class="btn danger" id="submitBtn">Submit Quiz</button>
        </div>
        <div class="palette">${paletteHtml()}</div>
      </section>`;

    startQuestionTime(q.id);

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
  }

  function renderReview() {
    flushQuestionTime();
    if(!document.fullscreenElement){
      renderFullscreenGate();
      return;
    }

    examActive=true;
    inReview=true;
    const answered=payload.questions.filter(q=>answers[q.id]).length;
    const unanswered=payload.questions.length-answered;
    $("examGuard").innerHTML="";
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
  }

  async function saveCurrent() {
    if (!payload || inReview || submitting) return;
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
      if(rem<=0 && !submitting){clearInterval(timerId);await submit(true)}
    };
    tick(); timerId=setInterval(tick,1000);
  }

  function openSubmitDialog() {
    if(submitting) return;
    const answered = payload ? payload.questions.filter(q=>answers[q.id]).length : 0;
    const total = payload ? payload.questions.length : 0;
    const unanswered = Math.max(0,total-answered);

    let modal = document.getElementById("submitConfirmModal");
    if(!modal){
      modal=document.createElement("div");
      modal.id="submitConfirmModal";
      modal.className="cb-modal-backdrop";
      document.body.appendChild(modal);
    }

    modal.innerHTML=`
      <div class="cb-modal" role="dialog" aria-modal="true" aria-labelledby="submitDialogTitle">
        <div class="cb-modal-icon">✓</div>
        <h2 id="submitDialogTitle">Submit Quiz?</h2>
        <p>Your answers will be submitted and you cannot continue this attempt.</p>
        <div class="submit-summary-mini">
          <div><strong>${answered}</strong><span>Answered</span></div>
          <div><strong>${unanswered}</strong><span>Unanswered</span></div>
          <div><strong>${total}</strong><span>Total</span></div>
        </div>
        ${unanswered ? `<div class="notice warn">You still have ${unanswered} unanswered question${unanswered===1?"":"s"}.</div>` : ""}
        <div class="actions" style="justify-content:center">
          <button class="btn ghost" id="cancelSubmitBtn">Continue Quiz</button>
          <button class="btn danger" id="confirmSubmitBtn">Yes, Submit Quiz</button>
        </div>
      </div>`;
    modal.classList.add("show");

    document.getElementById("cancelSubmitBtn").onclick=()=>modal.classList.remove("show");
    document.getElementById("confirmSubmitBtn").onclick=async()=>{
      modal.classList.remove("show");
      await submit(true, true);
    };
  }

  function ratingButtons(key,label) {
    return `<div class="rating-row">
      <strong>${esc(label)}</strong>
      <div class="star-rating" data-rating="${key}">
        ${[1,2,3,4,5].map(n=>`<button type="button" data-value="${n}" title="${n} out of 5">★</button>`).join("")}
      </div>
    </div>`;
  }

  async function renderPostSubmitFeedback(autoReason="normal") {
    clearInterval(timerId);
    stopWaitingPoll();
    examActive=false;
    submitting=false;
    feedbackStage=true;
    inReview=false;

    // Feedback is intentionally kept inside browser full screen.
    if (!document.fullscreenElement) {
      $("examGuard").innerHTML="";
      $("quizRoot").innerHTML=`
        <section class="panel fullscreen-gate center">
          <div class="fs-lock-icon">★</div>
          <h1>${autoReason==="malpractice" ? "Quiz submitted automatically" : "Quiz submitted successfully"}</h1>
          <p class="lead-text">Your quiz answers are already safe in CodeBhavya.</p>
          <div class="notice warn">Please return to full screen to complete the submission summary and classroom feedback.</div>
          <button class="btn teal fullscreen-main-btn" id="feedbackFullscreenBtn">Return to Full Screen</button>
        </section>`;
      $("feedbackFullscreenBtn").onclick=async()=>{
        const ok=await requestExamFullscreen();
        if(ok) renderPostSubmitFeedback(autoReason);
      };
      return;
    }

    const total=payload?.questions?.length || state?.question_count || 0;
    const answered=payload ? payload.questions.filter(q=>answers[q.id]).length : Object.keys(answers).length;
    const unanswered=Math.max(0,total-answered);
    let used=0;
    if(state?.started_at){
      used=Math.max(0,Math.min(state.duration_seconds,Math.floor((Date.now()-new Date(state.started_at).getTime())/1000)));
    }

    $("examGuard").innerHTML="";
    $("quizRoot").innerHTML=`
      <section class="panel post-submit-card">
        <div class="submission-success-icon">✓</div>
        <h1>${autoReason==="malpractice" ? "Quiz Submitted Automatically" : "Quiz Submitted Successfully"}</h1>
        <p class="muted center">${autoReason==="malpractice"
          ? "The maximum full-screen warnings were reached. Your saved answers have been submitted."
          : "Your answers have been saved. Complete the short feedback below before leaving full screen."}</p>

        <div class="result-summary-grid">
          <div class="summary-box"><strong>${total}</strong><span>Total Questions</span></div>
          <div class="summary-box"><strong>${answered}</strong><span>Answered</span></div>
          <div class="summary-box"><strong>${unanswered}</strong><span>Unanswered</span></div>
          <div class="summary-box"><strong>${fmtDuration(used)}</strong><span>Time Used</span></div>
        </div>

        <section class="feedback-card mandatory-feedback" id="feedbackCard">
          <div class="feedback-required-badge">Required before leaving quiz</div>
          <h2>Quick Quiz Feedback</h2>
          <p class="muted center">This feedback does not affect your score.</p>

          ${ratingButtons("ui","Quiz UI / Ease of Use")}
          ${ratingButtons("questions","Question Quality")}
          ${ratingButtons("overall","Overall Quiz Experience")}

          <label>Difficulty</label>
          <select id="feedbackDifficulty">
            <option value="">Select difficulty</option>
            <option value="very_easy">Very Easy</option>
            <option value="easy">Easy</option>
            <option value="balanced">Balanced</option>
            <option value="hard">Hard</option>
            <option value="very_hard">Very Hard</option>
          </select>

          <label>Any issue or suggestion? <span class="muted">(optional)</span></label>
          <textarea id="feedbackComment" maxlength="1000" placeholder="Example: UI was clear, one question wording was confusing, more time needed..."></textarea>

          <div class="actions" style="justify-content:center">
            <button class="btn teal" id="sendFeedbackBtn">Submit Feedback & Continue</button>
          </div>
        </section>
      </section>`;

    const ratings={ui:0,questions:0,overall:0};
    document.querySelectorAll(".star-rating").forEach(group=>{
      const key=group.dataset.rating;
      group.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
          ratings[key]=Number(btn.dataset.value);
          group.querySelectorAll("button").forEach(b=>{
            b.classList.toggle("active",Number(b.dataset.value)<=ratings[key]);
          });
        };
      });
    });

    $("sendFeedbackBtn").onclick=async()=>{
      if(!ratings.ui || !ratings.questions || !ratings.overall){
        toast("Please rate UI, question quality and overall experience.","error");
        return;
      }
      if(!$("feedbackDifficulty").value){
        toast("Please select the quiz difficulty.","error");
        return;
      }

      const btn=$("sendFeedbackBtn");
      btn.disabled=true;
      btn.textContent="Saving Feedback...";

      const {error}=await client.rpc("quiz_submit_feedback_v4",{
        p_attempt_id:attemptId,
        p_ui_rating:ratings.ui,
        p_question_rating:ratings.questions,
        p_overall_rating:ratings.overall,
        p_difficulty:$("feedbackDifficulty").value,
        p_comment:$("feedbackComment").value.trim() || null
      });

      if(error){
        btn.disabled=false;
        btn.textContent="Submit Feedback & Continue";
        toast(error.message,"error");
        return;
      }

      feedbackSaved=true;
      feedbackStage=false;

      $("feedbackCard").innerHTML=`
        <div class="feedback-thanks">
          <strong>Thank you for your feedback.</strong><br>
          UI: ${ratings.ui}/5 · Questions: ${ratings.questions}/5 · Overall: ${ratings.overall}/5<br>
          <span class="muted">Difficulty: ${esc($("feedbackDifficulty")?.value?.replaceAll("_"," ") || "")}</span>
        </div>
        <div class="actions" style="justify-content:center;margin-top:15px">
          <button class="btn primary" id="continueResultBtn">View Result / Summary</button>
        </div>`;

      $("continueResultBtn").onclick=async()=>{
        try{
          if(document.fullscreenElement && document.exitFullscreen){
            await document.exitFullscreen();
          }
        }catch(e){}
        location.href=`result.html?attempt=${encodeURIComponent(attemptId)}`;
      };
    };
  }

  async function submit(auto, userConfirmed=false) {
    if(submitting) return;
    // Native confirm dialogs are intentionally avoided because they can disturb
    // browser fullscreen and look like a malpractice exit.
    if (!auto && !userConfirmed) { openSubmitDialog(); return; }

    submitting=true;
    try{
      await flushQuestionTime();
      await saveCurrent();
      const { error } = await client.rpc("quiz_submit_v1", { p_attempt_id: attemptId });
      if (error) { submitting=false; toast(error.message,"error"); return; }

      // Stay on the same fullscreen page for the mandatory post-quiz feedback.
      await renderPostSubmitFeedback("normal");
    }catch(e){
      submitting=false;
      toast(e.message,"error");
    }
  }

  function renderFullscreenWarning(count, maxWarnings=3) {
    examActive=false;
    resumeMode=inReview?"review":"quiz";
    const remaining=Math.max(0,maxWarnings-count);
    $("examGuard").innerHTML="";
    $("quizRoot").innerHTML=`
      <div class="quizhead">
        <div><strong>${esc(payload?.title || state?.title || "Quiz")}</strong><div class="muted">Full-screen violation</div></div>
        <div class="timer urgent" id="timer">${fmtDuration(remainingSeconds())}</div>
        <span class="badge live">LIVE</span>
      </div>
      <section class="panel fullscreen-warning center">
        <div class="warning-number">${count}</div>
        <h1>Warning ${count} of ${maxWarnings}</h1>
        <p class="lead-text">You exited full-screen mode while the quiz is in progress.</p>
        <div class="notice bad">
          Return to full screen to continue. <strong>The quiz timer is still running.</strong>
        </div>
        <p>${remaining>0
          ? `You have <strong>${remaining}</strong> warning${remaining===1?"":"s"} remaining. On warning ${maxWarnings}, the quiz will be submitted automatically.`
          : "Maximum warnings reached."}</p>
        <button class="btn teal fullscreen-main-btn" id="returnFullscreenBtn">Return to Full Screen</button>
      </section>`;
    $("returnFullscreenBtn").onclick=async()=>{
      const ok=await requestExamFullscreen();
      if(!ok) return;
      examActive=true;
      if(resumeMode==="review") renderReview(); else renderQuiz();
      startTimer();
    };
    startTimer();
  }

  async function handleFullscreenExit() {
    if(fullscreenExitBusy || submitting || !state || state.status!=="live" || !examActive) return;
    if(document.fullscreenElement) return;

    fullscreenExitBusy=true;
    try{
      const {data,error}=await client.rpc("quiz_record_fullscreen_exit_v3",{p_attempt_id:attemptId});
      if(error){
        toast(error.message,"error");
        renderFullscreenGate();
        return;
      }

      const count=Number(data?.count||1);
      const maxWarnings=Number(data?.max_warnings||3);

      if(data?.auto_submitted){
        submitting=false;
        clearInterval(timerId);
        examActive=false;
        feedbackStage=true;
        await renderPostSubmitFeedback("malpractice");
        return;
      }

      renderFullscreenWarning(count,maxWarnings);
    }catch(e){
      toast(e.message,"error");
      renderFullscreenGate();
    }finally{
      fullscreenExitBusy=false;
    }
  }

  async function subscribe() {
    await loadState();
    channel = client.channel(`quiz-session-${state.quiz_id}`)
      .on("postgres_changes", {event:"UPDATE",schema:"public",table:"quizzes",filter:`id=eq.${state.quiz_id}`}, async () => {
        try { await openLive(); } catch(e) { console.error(e); }
      }).subscribe();
  }

  // Classroom-exam deterrents. Server-side scoring remains the real security boundary.
  document.addEventListener("contextmenu",e=>{
    if(state?.status==="live") { e.preventDefault(); toast("Right-click is disabled during the quiz.","error"); }
  });

  document.addEventListener("fullscreenchange",()=>{
    if(state?.status==="waiting"){
      updateWaitingFullscreenState();
      return;
    }

    if(feedbackStage && !feedbackSaved && !document.fullscreenElement){
      // Quiz is already submitted, so this is NOT a malpractice warning.
      // Feedback is simply hidden until the student returns to fullscreen.
      renderPostSubmitFeedback("normal");
      return;
    }

    if(state?.status==="live" && !document.fullscreenElement && !feedbackStage){
      handleFullscreenExit();
    }
  });

  window.addEventListener("beforeunload",e=>{
    const activeQuiz = state?.status==="live" && state?.attempt_status!=="submitted" && !submitting && !feedbackStage;
    const pendingFeedback = feedbackStage && !feedbackSaved;
    if(activeQuiz || pendingFeedback){
      e.preventDefault();
      e.returnValue="";
    }
  });

  try {
    await openLive();
    await subscribe();
  } catch(e) {
    $("quizRoot").innerHTML=`<section class="panel"><div class="notice bad">${esc(e.message)}</div><a class="btn primary" href="./">Back</a></section>`;
  }
})();
