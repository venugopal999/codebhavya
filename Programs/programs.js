"use strict";

(function () {
  const programs = Array.isArray(window.CODEBHAVYA_PROGRAMS)
    ? window.CODEBHAVYA_PROGRAMS
    : [];

  const directory = document.querySelector("#programDirectory");
  if (!directory) return;

  const featuredSection = document.querySelector("#featuredPrograms");
  const featuredGrid = document.querySelector("#featuredGrid");
  const count = document.querySelector("#resultCount");
  const empty = document.querySelector("#emptyState");
  const search = document.querySelector("#programSearch");
  const topic = document.querySelector("#topicFilter");
  const difficulty = document.querySelector("#difficultyFilter");
  const courseButtons = [...document.querySelectorAll(".course-tab")];
  const pagination = document.querySelector("#pagination");
  const pageNumbers = document.querySelector("#pageNumbers");
  const previousPage = document.querySelector("#previousPage");
  const nextPage = document.querySelector("#nextPage");

  // Keep the complete compact accordion catalog on one page so topic groups
  // are never split by pagination.
  const pageSize = Math.max(programs.length, 1);
  let activeCourse = "all";
  let currentPage = 1;
  let openTopic = null;

  function closeNavigationMenus(except) {
    document.querySelectorAll(".nav-dropdown[open], .mobile-nav[open]").forEach((menu) => {
      if (menu !== except) menu.removeAttribute("open");
    });
  }

  document.querySelectorAll(".nav-dropdown, .mobile-nav").forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeNavigationMenus(menu);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown, .mobile-nav")) closeNavigationMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigationMenus();
  });

  function fillTopics() {
    const topics = [...new Set(programs.map((program) => program.topic))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    topics.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      topic.append(option);
    });
  }

  function hasActiveFilters() {
    return activeCourse !== "all"
      || topic.value !== "all"
      || difficulty.value !== "all"
      || search.value.trim() !== "";
  }

  function matches(program) {
    const query = search.value.trim().toLowerCase();
    const searchable = [
      program.title,
      program.summary,
      program.topic,
      program.courseLabel,
      ...(program.concepts || [])
    ].join(" ").toLowerCase();

    return (activeCourse === "all" || program.course === activeCourse)
      && (topic.value === "all" || program.topic === topic.value)
      && (difficulty.value === "all" || program.difficulty === difficulty.value)
      && (!query || searchable.includes(query));
  }

  function createDifficultyBadge(program) {
    const level = document.createElement("span");
    level.className = `difficulty difficulty-${program.difficulty.toLowerCase()}`;
    level.textContent = program.difficulty;
    return level;
  }

  function createFeaturedCard(program) {
    const article = document.createElement("article");
    article.className = "featured-card";

    const top = document.createElement("div");
    top.className = "card-topline";

    const course = document.createElement("span");
    course.className = "course-badge";
    course.textContent = program.courseLabel;
    top.append(course, createDifficultyBadge(program));

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = program.href;
    link.textContent = program.title;
    title.append(link);

    const description = document.createElement("p");
    description.textContent = program.summary;

    const open = document.createElement("a");
    open.className = "featured-link";
    open.href = program.href;
    open.innerHTML = "Study &amp; Debug <span aria-hidden=\"true\">→</span>";

    article.append(top, title, description, open);
    return article;
  }

  function createProgramRow(program, number) {
    const row = document.createElement("article");
    row.className = "program-row";

    const index = document.createElement("span");
    index.className = "program-number";
    index.textContent = String(number).padStart(2, "0");

    const content = document.createElement("div");
    content.className = "program-row-content";

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = program.href;
    link.textContent = program.title;
    title.append(link);

    const meta = document.createElement("p");
    meta.textContent = `${program.courseLabel} • ${(program.concepts || []).join(" • ")}`;
    content.append(title, meta);

    const action = document.createElement("a");
    action.className = "row-action";
    action.href = program.href;
    action.innerHTML = "Study <span aria-hidden=\"true\">→</span>";
    action.setAttribute("aria-label", `Study ${program.title}`);

    row.append(index, content, createDifficultyBadge(program), action);
    return row;
  }

  function createTopicGroup(name, topicPrograms, startIndex, expanded) {
    const details = document.createElement("details");
    details.className = "topic-group";
    details.open = expanded;
    details.dataset.topic = name;

    const summary = document.createElement("summary");
    const heading = document.createElement("span");
    heading.className = "topic-name";
    heading.textContent = name;

    const total = document.createElement("span");
    total.className = "topic-count";
    total.textContent = `${topicPrograms.length} ${topicPrograms.length === 1 ? "program" : "programs"}`;

    const arrow = document.createElement("span");
    arrow.className = "topic-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌄";
    summary.append(heading, total, arrow);

    const rows = document.createElement("div");
    rows.className = "program-rows";
    topicPrograms.forEach((program, index) => {
      rows.append(createProgramRow(program, startIndex + index + 1));
    });

    details.append(summary, rows);
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      openTopic = name;
      directory.querySelectorAll(".topic-group[open]").forEach((group) => {
        if (group !== details) group.removeAttribute("open");
      });
    });
    return details;
  }

  function renderFeatured() {
    const featured = programs.filter((program) => program.featured).slice(0, 6);
    featuredGrid.replaceChildren(...featured.map(createFeaturedCard));
    featuredSection.hidden = featured.length === 0 || hasActiveFilters();
  }

  function renderPagination(totalPages) {
    pagination.hidden = totalPages <= 1;
    pageNumbers.replaceChildren();
    previousPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;

    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(page);
      button.className = page === currentPage ? "is-current" : "";
      button.setAttribute("aria-label", `Page ${page}`);
      if (page === currentPage) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => changePage(page));
      pageNumbers.append(button);
    }
  }

  function renderDirectory(results) {
    const firstIndex = (currentPage - 1) * pageSize;
    const pagePrograms = results.slice(firstIndex, firstIndex + pageSize);
    const groups = new Map();

    pagePrograms.forEach((program) => {
      if (!groups.has(program.topic)) groups.set(program.topic, []);
      groups.get(program.topic).push(program);
    });

    const groupNames = [...groups.keys()];
    if (!groupNames.includes(openTopic)) {
      openTopic = hasActiveFilters() ? (groupNames[0] || null) : null;
    }

    let offset = firstIndex;
    const elements = groupNames.map((name) => {
      const groupPrograms = groups.get(name);
      const element = createTopicGroup(name, groupPrograms, offset, name === openTopic);
      offset += groupPrograms.length;
      return element;
    });
    directory.replaceChildren(...elements);
  }

  function render() {
    const results = programs.filter(matches);
    const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    renderFeatured();
    renderDirectory(results);
    renderPagination(totalPages);

    count.textContent = `${results.length} ${results.length === 1 ? "program" : "programs"}`;
    empty.hidden = results.length !== 0;
    directory.hidden = results.length === 0;
  }

  function updateFilters() {
    currentPage = 1;
    openTopic = null;
    render();
  }

  function chooseCourse(course) {
    activeCourse = course;
    courseButtons.forEach((button) => {
      const selected = button.dataset.course === course;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateFilters();
  }

  function clearFilters() {
    search.value = "";
    topic.value = "all";
    difficulty.value = "all";
    chooseCourse("all");
    search.focus({ preventScroll: true });
  }

  function changePage(page) {
    currentPage = page;
    openTopic = null;
    render();
    document.querySelector("#resultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  courseButtons.forEach((button) => {
    button.addEventListener("click", () => chooseCourse(button.dataset.course));
  });
  search.addEventListener("input", updateFilters);
  topic.addEventListener("change", updateFilters);
  difficulty.addEventListener("change", updateFilters);
  document.querySelector("#clearFilters").addEventListener("click", clearFilters);
  document.querySelector("#emptyReset").addEventListener("click", clearFilters);
  previousPage.addEventListener("click", () => changePage(currentPage - 1));
  nextPage.addEventListener("click", () => changePage(currentPage + 1));

  fillTopics();
  render();
})();
