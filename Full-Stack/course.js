"use strict";

const KEY = "codebhavya.fullstack.progress.v1";

const levels = window.FULLSTACK_LEVELS;
const stages = window.FULLSTACK_STAGES;


/* =========================================================
   PROGRESS
   ========================================================= */

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

let done = read();


/* =========================================================
   LEVEL CARD
   ========================================================= */

function card(l) {

  return `
    <article
      class="level-card ${l.available ? "" : "locked"}"
      data-search="${(l.title + " " + l.summary).toLowerCase()}"
    >

      <div class="level-card-top">
        <span class="level-number">
          LEVEL ${String(l.n).padStart(2, "0")}
        </span>

        ${
          l.available
            ? `<span class="level-status available">AVAILABLE</span>`
            : `<span class="level-status planned">PLANNED</span>`
        }
      </div>

      <h3>${l.title}</h3>

      <p>${l.summary}</p>

      ${
        l.available
          ? `
            <div class="level-actions">
              <a
                class="lesson-link"
                href="lesson.html?level=${l.n}"
              >
                Open lesson →
              </a>

              <button
                type="button"
                class="mark-complete"
                data-complete="${l.n}"
              >
                ${
                  done.includes(l.n)
                    ? "✓ Completed"
                    : "Mark complete"
                }
              </button>
            </div>
          `
          : `
            <div class="level-actions">
              <span class="planned-label">
                Coming soon
              </span>
            </div>
          `
      }

    </article>
  `;
}


/* =========================================================
   ROADMAP RENDER
   ========================================================= */

function render() {

  const roadmap = document.getElementById("roadmapContent");

  roadmap.innerHTML = stages.map((s, i) => {

    const stageLevels = levels.filter(
      l => l.stage === i
    );

    return `
      <section class="stage">

        <header class="stage-header">

          <div>
            <span class="stage-range">
              ${s.range}
            </span>

            <h3>
              ${s.title}
            </h3>
          </div>

          <p>
            ${s.description}
          </p>

        </header>


        <div class="level-grid">

          ${stageLevels.map(card).join("")}

        </div>

      </section>
    `;

  }).join("");

  progress();
}


/* =========================================================
   PROGRESS UPDATE
   ========================================================= */

function progress() {

  done = done.filter(
    n => levels.some(
      l => l.available && l.n === n
    )
  );

  const totalLevels = 30;

  const percentage = Math.round(
    (done.length / totalLevels) * 100
  );


  document.getElementById("completedCount").textContent =
    done.length;


  document.getElementById("progressBar").style.width =
    percentage + "%";


  document.getElementById("progressText").textContent =
    `${percentage}% of complete 30-level course`;


  const next = levels.find(
    l => l.available && !done.includes(l.n)
  );


  const resumeLink =
    document.getElementById("resumeLink");


  resumeLink.href =
    next
      ? `lesson.html?level=${next.n}`
      : "lesson.html?level=1";


  resumeLink.textContent =
    next
      ? `Continue Level ${next.n} →`
      : "Review foundations →";


  document
    .querySelectorAll("[data-complete]")
    .forEach(button => {

      const level = Number(
        button.dataset.complete
      );

      const completed = done.includes(level);

      button.textContent =
        completed
          ? "✓ Completed"
          : "Mark complete";

      button.classList.toggle(
        "is-completed",
        completed
      );

    });
}


/* =========================================================
   CLICK HANDLER
   ========================================================= */

document.addEventListener("click", event => {

  const button =
    event.target.closest("button");

  if (!button) return;


  /* Mark Complete */

  if (button.dataset.complete) {

    const level =
      Number(button.dataset.complete);


    if (done.includes(level)) {

      done = done.filter(
        n => n !== level
      );

    } else {

      done = [
        ...done,
        level
      ];

    }


    localStorage.setItem(
      KEY,
      JSON.stringify(done)
    );


    progress();

    return;
  }


  /* Mobile navigation */

  if (button.id === "navToggle") {

    const nav =
      document.getElementById("siteNav");

    nav.classList.toggle("open");

    button.setAttribute(
      "aria-expanded",
      nav.classList.contains("open")
    );
  }

});


/* =========================================================
   COURSE SEARCH
   ========================================================= */

document
  .getElementById("courseSearch")
  .addEventListener("input", event => {

    const query =
      event.target.value
        .trim()
        .toLowerCase();


    let totalMatches = 0;


    document
      .querySelectorAll(".stage")
      .forEach(stage => {

        let stageMatches = 0;


        stage
          .querySelectorAll(".level-card")
          .forEach(cardElement => {

            const matches =
              cardElement.dataset.search
                .includes(query);


            cardElement.hidden =
              !matches;


            if (matches) {

              stageMatches++;
              totalMatches++;

            }

          });


        /*
         * Hide an entire stage when
         * none of its levels match.
         */

        stage.hidden =
          stageMatches === 0;

      });


    document.getElementById(
      "emptySearch"
    ).hidden = totalMatches > 0;

  });


/* =========================================================
   RESET PROGRESS
   ========================================================= */

document
  .getElementById("resetProgress")
  .addEventListener("click", () => {

    if (
      confirm(
        "Reset Full-Stack course progress?"
      )
    ) {

      done = [];

      localStorage.removeItem(KEY);

      progress();

    }

  });


/* =========================================================
   INITIALIZE
   ========================================================= */

render();

document.getElementById("year").textContent =
  new Date().getFullYear();
