"use strict";

(function () {
  const programs = Array.isArray(window.CODEBHAVYA_PROGRAMS)
    ? window.CODEBHAVYA_PROGRAMS
    : [];

  const grid = document.querySelector("#programGrid");
  const count = document.querySelector("#resultCount");
  const empty = document.querySelector("#emptyState");
  const search = document.querySelector("#programSearch");
  const topic = document.querySelector("#topicFilter");
  const difficulty = document.querySelector("#difficultyFilter");
  const courseButtons = [...document.querySelectorAll(".course-tab")];
  const filterPanel = document.querySelector(".filter-panel");
  const filterInner = document.querySelector(".filter-panel-inner");
  const mobileFilterSlot = document.querySelector(".mobile-filter-slot");
  const mobileQuery = window.matchMedia("(max-width: 820px)");
  let activeCourse = "all";

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

  if (!grid) return;

  function fillTopics() {
    const topics = [...new Set(programs.map((program) => program.topic))].sort();
    topics.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      topic.append(option);
    });
  }

  function placeFilters() {
    if (!filterInner || !filterPanel || !mobileFilterSlot) return;
    if (mobileQuery.matches) {
      mobileFilterSlot.append(filterInner);
    } else {
      filterPanel.append(filterInner);
    }
  }

  function matches(program) {
    const query = search.value.trim().toLowerCase();
    const searchable = [
      program.title,
      program.summary,
      program.topic,
      program.courseLabel,
      ...program.concepts
    ].join(" ").toLowerCase();

    return (activeCourse === "all" || program.course === activeCourse)
      && (topic.value === "all" || program.topic === topic.value)
      && (difficulty.value === "all" || program.difficulty === difficulty.value)
      && (!query || searchable.includes(query));
  }

  function programCard(program) {
    const article = document.createElement("article");
    article.className = "program-card";

    const top = document.createElement("div");
    top.className = "card-topline";

    const course = document.createElement("span");
    course.className = "course-badge";
    course.textContent = program.courseLabel;

    const level = document.createElement("span");
    level.className = `difficulty difficulty-${program.difficulty.toLowerCase()}`;
    level.textContent = program.difficulty;
    top.append(course, level);

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = program.href;
    link.textContent = program.title;
    title.append(link);

    const description = document.createElement("p");
    description.className = "card-summary";
    description.textContent = program.summary;

    const concepts = document.createElement("ul");
    concepts.className = "concept-list";
    program.concepts.forEach((concept) => {
      const item = document.createElement("li");
      item.textContent = concept;
      concepts.append(item);
    });

    const feature = document.createElement("p");
    feature.className = "card-feature";
    feature.textContent = program.features.join(" • ");

    const open = document.createElement("a");
    open.className = "study-button";
    open.href = program.href;
    open.innerHTML = "Study &amp; Debug <span aria-hidden=\"true\">→</span>";

    article.append(top, title, description, concepts, feature, open);
    return article;
  }

  function render() {
    const visiblePrograms = programs.filter(matches);
    grid.replaceChildren(...visiblePrograms.map(programCard));
    count.textContent = `${visiblePrograms.length} ${visiblePrograms.length === 1 ? "program" : "programs"}`;
    empty.hidden = visiblePrograms.length !== 0;
  }

  function chooseCourse(course) {
    activeCourse = course;
    courseButtons.forEach((button) => {
      const selected = button.dataset.course === course;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    render();
  }

  function clearFilters() {
    search.value = "";
    topic.value = "all";
    difficulty.value = "all";
    chooseCourse("all");
    search.focus({ preventScroll: true });
  }

  function render() {
    const results = programs.filter(matches);
    grid.replaceChildren(...results.map(programCard));
    count.textContent = `${results.length} ${results.length === 1 ? "program" : "programs"}`;
    empty.hidden = results.length !== 0;
    grid.hidden = results.length === 0;
  }

  function clearFilters() {
    activeCourse = "all";
    search.value = "";
    topic.value = "all";
    difficulty.value = "all";
    courseButtons.forEach((button) => {
      const selected = button.dataset.course === "all";
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    render();
  }

  courseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCourse = button.dataset.course;
      courseButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    });
  });

  search.addEventListener("input", render);
  topic.addEventListener("change", render);
  difficulty.addEventListener("change", render);
  document.querySelector("#clearFilters").addEventListener("click", clearFilters);
  document.querySelector("#emptyReset").addEventListener("click", clearFilters);

  courseButtons.forEach((button) => {
    button.addEventListener("click", () => chooseCourse(button.dataset.course));
  });
  search.addEventListener("input", render);
  topic.addEventListener("change", render);
  difficulty.addEventListener("change", render);
  mobileQuery.addEventListener?.("change", placeFilters);

  fillTopics();
  placeFilters();
  render();
})();
