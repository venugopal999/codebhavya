(async()=>{
  const {client,$,requireSession,esc,fmtDuration,toast}=CBQuiz;
  try{await requireSession()}catch{return}
  const attempt=new URLSearchParams(location.search).get("attempt");
  let channel=null,poll=null,lastQuizId=null,currentData=null,feedbackSaved=false;
  const ratings={ui:0,questions:0,overall:0};

  function summaryHtml(data){
    return `<div class="result-summary-grid">
      <div class="summary-box"><strong>${data.total_questions ?? 0}</strong><span>Total Questions</span></div>
      <div class="summary-box"><strong>${data.answered_count ?? 0}</strong><span>Answered</span></div>
      <div class="summary-box"><strong>${data.unanswered_count ?? 0}</strong><span>Unanswered</span></div>
      <div class="summary-box"><strong>${fmtDuration(data.duration_seconds)}</strong><span>Time Used</span></div>
    </div>`;
  }

  function scoreDetailsHtml(data){
    if(!data.can_show_score) return "";
    return `<div class="result-score">${data.score}/${data.max_score}</div>
      <p><strong>${data.correct_count ?? 0}</strong> correct · <strong>${data.wrong_count ?? 0}</strong> wrong · <strong>${data.unanswered_count ?? 0}</strong> unanswered</p>`;
  }

  function ratingControl(key,label){
    return `<div class="rating-row">
      <strong>${esc(label)}</strong>
      <div class="star-rating" data-rating="${key}">
        ${[1,2,3,4,5].map(n=>`<button type="button" data-value="${n}" title="${n} out of 5">★</button>`).join("")}
      </div>
    </div>`;
  }

  function feedbackHtml(data){
    if(data.feedback_submitted || feedbackSaved){
      return `<div class="feedback-card"><div class="feedback-thanks"><strong>Thank you for your feedback.</strong><br>Your feedback helps improve CodeBhavya classroom quizzes.</div></div>`;
    }
    return `<section class="feedback-card" id="feedbackCard">
      <h2>Quick Quiz Feedback</h2>
      <p class="muted" style="text-align:center">This feedback does not affect your score.</p>
      ${ratingControl("ui","Quiz UI / Ease of Use")}
      ${ratingControl("questions","Question Quality")}
      ${ratingControl("overall","Overall Quiz Experience")}
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
        <button class="btn teal" id="sendFeedbackBtn">Submit Feedback</button>
      </div>
    </section>`;
  }

  function bindFeedback(){
    document.querySelectorAll(".star-rating").forEach(group=>{
      const key=group.dataset.rating;
      group.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
          ratings[key]=Number(btn.dataset.value);
          group.querySelectorAll("button").forEach(b=>b.classList.toggle("active",Number(b.dataset.value)<=ratings[key]));
        };
      });
    });

    $("sendFeedbackBtn")?.addEventListener("click",async()=>{
      if(!ratings.ui || !ratings.questions || !ratings.overall){
        toast("Please rate UI, questions and overall experience.","error"); return;
      }
      const btn=$("sendFeedbackBtn"); btn.disabled=true;
      const {error}=await client.rpc("quiz_submit_feedback_v4",{
        p_attempt_id:attempt,
        p_ui_rating:ratings.ui,
        p_question_rating:ratings.questions,
        p_overall_rating:ratings.overall,
        p_difficulty:$("feedbackDifficulty").value || null,
        p_comment:$("feedbackComment").value.trim() || null
      });
      if(error){btn.disabled=false;toast(error.message,"error");return}
      feedbackSaved=true;
      $("feedbackCard").outerHTML=`<div class="feedback-card"><div class="feedback-thanks"><strong>Thank you for your feedback.</strong><br>Your feedback helps improve CodeBhavya classroom quizzes.</div></div>`;
    });
  }

  function renderResult(data){
    const scoreBlock=data.can_show_score
      ? `<span class="badge ${data.quiz_status==="closed"?"closed":"live"}">${esc(data.quiz_status)}</span>
         <h1>${esc(data.title)}</h1>
         <p class="muted">Quiz completed successfully</p>
         ${scoreDetailsHtml(data)}`
      : `<h1>Quiz submitted</h1><p>Your responses have been saved successfully.</p>`;

    let releaseBlock="";
    if(!data.can_show_score){
      if(data.release_mode==="faculty_only"){
        releaseBlock=`<div class="notice">Your faculty has chosen not to release scores on the student page.</div>`;
      }else{
        releaseBlock=`<div class="notice warn"><span class="pulse"></span> Waiting for faculty to close the quiz and release the score…</div>`;
      }
    }

    $("resultBox").innerHTML=`
      ${scoreBlock}
      ${summaryHtml(data)}
      ${releaseBlock}
      <p class="muted">Submitted: ${data.submitted_at ? esc(new Date(data.submitted_at).toLocaleString()) : "—"}</p>
      <div class="actions" style="justify-content:center">
        ${!data.can_show_score && data.release_mode!=="faculty_only" ? '<button class="btn ghost" id="checkResult">Check Result Now</button>' : ""}
        <a class="btn primary" href="./">Quiz Home</a>
      </div>
      ${feedbackHtml(data)}
    `;
    $("checkResult")?.addEventListener("click",loadResult);
    bindFeedback();
  }

  async function loadResult(){
    const {data,error}=await client.rpc("quiz_my_result_v4",{p_attempt_id:attempt});
    if(error){$("resultBox").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
    currentData=data; lastQuizId=data.quiz_id;
    renderResult(data);

    if(data.can_show_score || data.release_mode==="faculty_only"){
      clearInterval(poll); poll=null;
    }else if(!poll){
      poll=setInterval(loadResult,2500);
    }
  }

  await loadResult();
  if(lastQuizId){
    channel=client.channel(`quiz-result-${lastQuizId}`)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"quizzes",filter:`id=eq.${lastQuizId}`},loadResult)
      .subscribe();
  }
})();