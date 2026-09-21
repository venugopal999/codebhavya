
(() => {
  "use strict";

  const library = Array.isArray(window.CODEBHAVYA_PPT_LIBRARY)
    ? window.CODEBHAVYA_PPT_LIBRARY
    : [];
  const baseUrl = String(window.CODEBHAVYA_PPT_BASE || "").replace(/\/+$/, "");

  const $ = (id) => document.getElementById(id);
  const courseGrid = $("courseGrid");
  const pptSections = $("pptSections");
  const search = $("pptSearch");
  const showAllBtn = $("showAllBtn");
  const resultText = $("resultText");
  const emptyState = $("emptyState");
  const emptyReset = $("emptyReset");
  const navToggle = $("navToggle");
  const siteNav = $("siteNav");
  const toast = $("toast");

  let activeCourse = "all";
  let toastTimer = 0;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const pptUrl = (courseSlug, filename) => {
    const safeFile = String(filename)
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    return `${baseUrl}/${encodeURIComponent(courseSlug)}/${safeFile}`;
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
  }

  function renderCourseCards() {
    courseGrid.innerHTML = library.map(course => `
      <button class="course-card${activeCourse === course.slug ? " active" : ""}"
              type="button"
              data-course="${escapeHtml(course.slug)}"
              aria-pressed="${activeCourse === course.slug}">
        <span class="course-symbol">${escapeHtml(course.short)}</span>
        <h3>${escapeHtml(course.title)}</h3>
        <p>${escapeHtml(course.description)}</p>
        <span class="course-count">${course.topics.length} PPT${course.topics.length === 1 ? "" : "s"}</span>
      </button>
    `).join("");

    courseGrid.querySelectorAll(".course-card").forEach(button => {
      button.addEventListener("click", () => {
        activeCourse = button.dataset.course || "all";
        render();
        const first = pptSections.querySelector(".course-section");
        if (first) first.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });
  }

  function getFiltered() {
    const query = (search.value || "").trim().toLowerCase();
    return library.map(course => {
      if (activeCourse !== "all" && activeCourse !== course.slug) {
        return {...course, topics: []};
      }
      const topics = course.topics.filter(topic => {
        if (!query) return true;
        return [
          topic.title,
          topic.file,
          course.title,
          course.short
        ].join(" ").toLowerCase().includes(query);
      });
      return {...course, topics};
    }).filter(course => course.topics.length);
  }

  function renderSections(filtered) {
    pptSections.innerHTML = filtered.map(course => `
      <section class="course-section" id="${escapeHtml(course.slug)}">
        <div class="course-section-head">
          <div>
            <h2>${escapeHtml(course.title)}</h2>
            <p>${escapeHtml(course.description)}</p>
          </div>
          <span class="section-count">${course.topics.length} presentation${course.topics.length === 1 ? "" : "s"}</span>
        </div>
        <div class="topic-list">
          ${course.topics.map((topic, index) => `
            <article class="ppt-row">
              <div class="ppt-index">${String(index + 1).padStart(2, "0")}</div>
              <div class="ppt-info">
                <h3>${escapeHtml(topic.title)}</h3>
                <div class="ppt-meta">
                  <span class="badge premium">Premium PPT</span>
                  <span class="badge">${escapeHtml(course.short)}</span>
                </div>
                <div class="ppt-file">${escapeHtml(topic.file)}</div>
              </div>
              <a class="download-btn"
                 href="${pptUrl(course.slug, topic.file)}"
                 target="_blank"
                 rel="noopener"
                 data-ppt-title="${escapeHtml(topic.title)}">
                 ↓ Download PPT
              </a>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");

    pptSections.querySelectorAll(".download-btn").forEach(link => {
      link.addEventListener("click", () => {
        showToast(`Opening ${link.dataset.pptTitle || "presentation"}…`);
      });
    });
  }

  function render() {
    renderCourseCards();
    const filtered = getFiltered();
    renderSections(filtered);

    const total = filtered.reduce((sum, course) => sum + course.topics.length, 0);
    const query = (search.value || "").trim();

    if (activeCourse === "all" && !query) {
      resultText.textContent = `Showing all ${total} premium presentations across ${filtered.length} courses.`;
    } else {
      const courseName = activeCourse === "all"
        ? "all courses"
        : (library.find(c => c.slug === activeCourse)?.title || "selected course");
      resultText.textContent = `${total} presentation${total === 1 ? "" : "s"} found in ${courseName}${query ? ` for “${query}”` : ""}.`;
    }

    emptyState.hidden = total !== 0;
    pptSections.hidden = total === 0;
    showAllBtn.textContent = activeCourse === "all" ? "All courses" : "Show all courses";
  }

  search.addEventListener("input", render);

  showAllBtn.addEventListener("click", () => {
    activeCourse = "all";
    search.value = "";
    render();
  });

  emptyReset.addEventListener("click", () => {
    activeCourse = "all";
    search.value = "";
    render();
    search.focus();
  });

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();

  $("courseCount").textContent = String(library.length);
  $("pptCount").textContent = String(
    library.reduce((sum, course) => sum + course.topics.length, 0)
  );

  render();
})();
