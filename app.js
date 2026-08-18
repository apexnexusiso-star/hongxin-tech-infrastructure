const state = {
  manifest: null,
  view: "home",
  lessonIndex: 0,
  slideIndex: 0,
  autoplay: true,
  notesOpen: false,
  audioTryIndex: 0,
  audioCandidates: [],
  audioBlocked: false,
  audioProfile: "en",
  checkResponses: {}
};

const $ = selector => document.querySelector(selector);
const stage = $("#stage");
const audio = $("#audio");
const playBtn = $("#playBtn");
const seek = $("#seek");
const audioTitle = $("#audioTitle");
const audioNow = $("#audioNow");
const audioDuration = $("#audioDuration");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

const placeholderSequence = [
  "Opening and Learning Target",
  "Key Concept Framework",
  "Clause Logic and Governance Point",
  "Evidence and Audit Trail",
  "Case Practice or Reflection",
  "Lesson Summary"
];

const CHECK_STORAGE_KEY = "iso42001-learning-check-progress-v1";

async function init() {
  if (window.COURSE_MANIFEST) {
    state.manifest = window.COURSE_MANIFEST;
  } else {
    const res = await fetch("data/course_manifest.json", { cache: "no-store" });
    state.manifest = await res.json();
  }
  state.checkResponses = loadCheckResponses();
  bindEvents();
  render();
}

function bindEvents() {
  prevBtn.addEventListener("click", goPrevious);
  nextBtn.addEventListener("click", goNext);
  $("#mapBtn").addEventListener("click", goCourseMap);
  $("#notesBtn").addEventListener("click", toggleNotes);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#audioModeBtn").addEventListener("click", () => {
    state.autoplay = !state.autoplay;
    updateAutoplayButton();
    if (state.autoplay) requestAudioPlay();
  });
  $("#voiceSelect").addEventListener("change", event => {
    state.audioProfile = event.target.value;
    loadItemAudio(currentAudioItem());
    if (state.notesOpen) renderNotes(currentAudioItem());
  });
  $("#fullscreenBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });
  playBtn.addEventListener("click", togglePlay);
  $("#rateSelect").addEventListener("change", event => {
    audio.playbackRate = Number(event.target.value);
  });
  audio.addEventListener("loadedmetadata", syncAudioTime);
  audio.addEventListener("timeupdate", syncAudioTime);
  audio.addEventListener("play", () => { playBtn.textContent = "Pause"; });
  audio.addEventListener("pause", () => { playBtn.textContent = "Play"; });
  audio.addEventListener("error", showAudioMissing);
  seek.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Number(seek.value) / 100 * audio.duration;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") goPrevious();
    if (event.key === "ArrowRight") goNext();
    if (event.key.toLowerCase() === "m") goCourseMap();
    if (event.key === " ") {
      event.preventDefault();
      togglePlay();
    }
  });
  document.addEventListener("pointerdown", resumeBlockedAudio, { capture: true });
  document.addEventListener("keydown", resumeBlockedAudio, { capture: true });
  updateAutoplayButton();
}

function render() {
  if (state.view === "courseMap") stage.innerHTML = renderCourseMap();
  else if (state.view === "lessonMap") stage.innerHTML = renderLessonMap(activeLesson());
  else if (state.view === "slide") stage.innerHTML = renderSlide(activeSlide());
  else stage.innerHTML = renderHome();

  bindStageLocalEvents();
  updateChrome(currentAudioItem());
  loadItemAudio(currentAudioItem());

  if (state.notesOpen) renderNotes(currentAudioItem());
}

function goHome() {
  state.view = "home";
  state.slideIndex = 0;
  closeDrawer();
  render();
}

function goCourseMap() {
  state.view = "courseMap";
  state.slideIndex = 0;
  closeDrawer();
  render();
}

function goLessonMap(index = state.lessonIndex) {
  const lessons = state.manifest.lessons;
  state.lessonIndex = clamp(index, 0, lessons.length - 1);
  state.slideIndex = 0;
  state.view = "lessonMap";
  closeDrawer();
  render();
}

function goSlide(lessonIndex = state.lessonIndex, slideIndex = 0) {
  const lessons = state.manifest.lessons;
  state.lessonIndex = clamp(lessonIndex, 0, lessons.length - 1);
  const slides = getLessonSlides(activeLesson());
  state.slideIndex = clamp(slideIndex, 0, slides.length - 1);
  state.view = "slide";
  render();
}

function goPrevious() {
  if (state.view === "home") return;
  if (state.view === "courseMap") {
    goHome();
    return;
  }
  if (state.view === "lessonMap") {
    goCourseMap();
    return;
  }
  if (state.slideIndex > 0) goSlide(state.lessonIndex, state.slideIndex - 1);
  else goLessonMap(state.lessonIndex);
}

function goNext() {
  if (state.view === "home") {
    goCourseMap();
    return;
  }
  if (state.view === "courseMap") {
    goLessonMap(0);
    return;
  }
  if (state.view === "lessonMap") {
    goSlide(state.lessonIndex, 0);
    return;
  }
  const slides = getLessonSlides(activeLesson());
  if (state.slideIndex < slides.length - 1) {
    goSlide(state.lessonIndex, state.slideIndex + 1);
    return;
  }
  if (state.lessonIndex < state.manifest.lessons.length - 1) goLessonMap(state.lessonIndex + 1);
}

function bindStageLocalEvents() {
  stage.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "course-map") goCourseMap();
      if (button.dataset.action === "lesson-map") goLessonMap(state.lessonIndex);
      if (button.dataset.action === "start-lesson") goSlide(state.lessonIndex, 0);
      if (button.dataset.action === "next-slide") goNext();
    });
  });
  stage.querySelectorAll("[data-lesson-index]").forEach(button => {
    button.addEventListener("click", () => goLessonMap(Number(button.dataset.lessonIndex)));
  });
  stage.querySelectorAll("[data-slide-index]").forEach(button => {
    button.addEventListener("click", () => goSlide(state.lessonIndex, Number(button.dataset.slideIndex)));
  });
  stage.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      const answer = $("#quizAnswer");
      if (answer) answer.classList.add("show");
      stage.querySelectorAll("[data-answer]").forEach(btn => { btn.disabled = true; });
    });
  });
  stage.querySelectorAll("[data-check-option]").forEach(button => {
    button.addEventListener("click", () => recordCheckAnswer(activeSlide(), button.dataset.checkOption));
  });
}

function renderHome() {
  const home = state.manifest.home;
  return `
    <section class="slide">
      <div class="slide-inner cover-grid">
        <div>
          ${renderMeta(home)}
          <h1>${escapeHtml(home.title)}</h1>
          ${renderSubtitle(home.subtitle)}
          <button class="primary" type="button" data-action="course-map">Enter Course Map</button>
        </div>
        <div class="cover-symbol" aria-hidden="true"></div>
      </div>
    </section>`;
}

function renderCourseMap() {
  const map = state.manifest.courseMap;
  const cards = state.manifest.lessons.map((lesson, index) => {
    const stats = lessonCheckStats(lesson);
    const contentPages = getLessonSlides(lesson).filter(slide => !isLearningCheck(slide)).length;
    return `
      <button class="map-card lesson-card" type="button" data-lesson-index="${index}">
        <span class="lesson-top">
          <span class="lesson-no">Lesson ${escapeHtml(lesson.number)}</span>
          <span class="lesson-status">${stats.completed}/${stats.total} checks</span>
        </span>
        <span class="t">${escapeHtml(lesson.title)}</span>
        <span class="s">${escapeHtml(lesson.subtitle || "")}</span>
        <span class="lesson-meta">
          <span>${contentPages} slides + ${stats.total} checks</span>
          <span>${escapeHtml(lesson.duration || "20 min")}</span>
        </span>
        <span class="lesson-progress" aria-hidden="true"><span style="width:${stats.percent}%"></span></span>
      </button>`;
  }).join("");

  return `
    <section class="slide slide-scroll">
      <div class="slide-inner">
        ${renderMeta(map)}
        <h1>${escapeHtml(map.title)}</h1>
        ${renderSubtitle(map.subtitle)}
        <div class="lesson-grid">${cards}</div>
      </div>
    </section>`;
}

function renderLessonMap(lesson) {
  const slides = getLessonSlides(lesson);
  let checkCount = 0;
  const cards = slides.map((slide, index) => {
    const isCheck = isLearningCheck(slide);
    if (isCheck) checkCount += 1;
    const label = isCheck ? `Check ${String(checkCount).padStart(2, "0")}` : `Slide ${String(index + 1).padStart(2, "0")}`;
    const done = isCheck && isCheckComplete(slide.id);
    return `
      <button class="map-card slide-card ${isCheck ? "learning-check-card" : ""} ${done ? "done" : ""}" type="button" data-slide-index="${index}">
        <span class="m">${label}${done ? " / Done" : ""}</span>
        <span class="t">${escapeHtml(slide.title)}</span>
        <span class="s">${escapeHtml(slide.subtitle || "")}</span>
      </button>`;
  }).join("");
  const stats = lessonCheckStats(lesson);

  return `
    <section class="slide slide-scroll">
      <div class="slide-inner">
        <div class="lesson-map-head">
          <div>
            <div class="eyebrow">Lesson ${escapeHtml(lesson.number)} / Internal Map</div>
            <h1>${escapeHtml(lesson.title)}</h1>
            ${renderSubtitle(lesson.objective || lesson.subtitle)}
            <div class="lesson-map-progress">
              <span>Learning checks</span>
              <strong>${stats.completed}/${stats.total}</strong>
              <span class="lesson-progress" aria-hidden="true"><span style="width:${stats.percent}%"></span></span>
            </div>
          </div>
          <div class="lesson-actions">
            <button class="secondary" type="button" data-action="course-map">Course Map</button>
            <button class="primary compact" type="button" data-action="start-lesson">Start Lesson</button>
          </div>
        </div>
        <div class="slide-map-grid">${cards}</div>
      </div>
    </section>`;
}

function renderSlide(slide) {
  const meta = renderMeta(slide);
  const title = `<h1>${escapeHtml(slide.title)}</h1>`;
  const subtitle = renderSubtitle(slide.subtitle);

  if (slide.visual) {
    return renderVisualSlide(slide, meta, title, subtitle);
  }

  if (slide.layout === "process") {
    const steps = (slide.steps || []).map((step, i) => `
      <article class="process-step">
        <div class="num">${i + 1}</div>
        <h3>${escapeHtml(step.name)}</h3>
        <p>${escapeHtml(step.desc)}</p>
      </article>`).join("");
    return `<section class="slide"><div class="slide-inner">${meta}${title}${subtitle}<div class="process-grid">${steps}</div></div></section>`;
  }

  if (slide.layout === "evidence") {
    const items = (slide.evidence || []).map(item => `
      <article class="evidence-item">
        <strong>${escapeHtml(item.label)}</strong>
        <p>${escapeHtml(item.text)}</p>
      </article>`).join("");
    return `<section class="slide"><div class="slide-inner">${meta}${title}${subtitle}<div class="evidence-grid">${items}</div></div></section>`;
  }

  if (slide.layout === "split") {
    const panels = (slide.panels || []).map(panel => `
      <article class="split-panel">
        <span class="m">${escapeHtml(panel.kicker || "")}</span>
        <h3>${escapeHtml(panel.title)}</h3>
        <p>${escapeHtml(panel.text || "")}</p>
        ${(panel.bullets || []).length ? `<ul>${panel.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      </article>`).join("");
    return `<section class="slide"><div class="slide-inner">${meta}${title}${subtitle}<div class="split-grid">${panels}</div></div></section>`;
  }

  if (slide.layout === "check") {
    return renderLearningCheck(slide, meta, title, subtitle);
  }

  if (slide.layout === "quiz") {
    return `
      <section class="slide">
        <div class="slide-inner">
          ${meta}${title}${subtitle}
          <div class="quiz-card">
            <div class="question">${escapeHtml(slide.question)}</div>
            <div class="quiz-actions">
              <button type="button" data-answer="think">Think First</button>
              <button type="button" data-answer="coach">Show Coaching</button>
            </div>
            <div class="answer" id="quizAnswer">${escapeHtml(slide.answer)}</div>
          </div>
        </div>
      </section>`;
  }

  const bullets = (slide.bullets || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
  const chips = (slide.tags || []).map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join("");
  return `
    <section class="slide">
      <div class="slide-inner">
        ${meta}${title}${subtitle}
        <div class="content-card">
          <ul>${bullets}</ul>
          ${chips ? `<div class="chips">${chips}</div>` : ""}
        </div>
      </div>
    </section>`;
}

function renderVisualSlide(slide, meta, title, subtitle) {
  const visual = slide.visual || {};
  const theme = visual.theme ? ` visual-${cssToken(visual.theme)}` : "";
  const hero = renderVisualHero(visual.hero);
  const coach = renderVisualCoach(visual.coach);
  const blocks = (visual.blocks || []).map(renderVisualBlock).join("");

  return `
    <section class="slide slide-scroll visual-slide${theme}">
      <div class="slide-inner visual-inner">
        ${meta}
        <div class="visual-heading">
          <div>${title}${subtitle}</div>
          ${visual.badge ? `<div class="visual-badge">${escapeHtml(visual.badge)}</div>` : ""}
        </div>
        ${hero}
        ${coach}
        <div class="visual-board">${blocks}</div>
      </div>
    </section>`;
}

function renderVisualHero(hero) {
  if (!hero) return "";
  const chips = (hero.chips || []).map(chip => `<span>${escapeHtml(chip)}</span>`).join("");
  return `
    <section class="visual-hero">
      <div>
        <span class="visual-hero-label">${escapeHtml(hero.label || "")}</span>
        <strong>${escapeHtml(hero.value || "")}</strong>
        ${hero.note ? `<p>${escapeHtml(hero.note)}</p>` : ""}
      </div>
      ${chips ? `<div class="visual-hero-chips">${chips}</div>` : ""}
    </section>`;
}

function renderVisualCoach(coach) {
  if (!coach) return "";
  const items = [
    ["Think", coach.think],
    ["Why it matters", coach.why],
    ["Listen for", coach.listen]
  ].filter(([, value]) => value);
  if (!items.length) return "";
  return `
    <section class="visual-coach">
      ${items.map(([label, value]) => `
        <div>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>`).join("")}
    </section>`;
}

function renderVisualBlock(block) {
  const type = block.type || "cards";
  if (type === "signal-strip") return renderSignalStrip(block);
  if (type === "split-screen") return renderSplitScreen(block);
  if (type === "pathway") return renderPathway(block);
  if (type === "matrix") return renderMatrix(block);
  if (type === "evidence-chain") return renderEvidenceChain(block);
  if (type === "role-map") return renderRoleMap(block);
  if (type === "finding") return renderFinding(block);
  if (type === "mistake-board") return renderMistakeBoard(block);
  return renderCardBoard(block);
}

function renderBlockHead(block) {
  if (!block.title && !block.label) return "";
  return `
    <div class="visual-block-head">
      ${block.label ? `<span>${escapeHtml(block.label)}</span>` : ""}
      ${block.title ? `<strong>${escapeHtml(block.title)}</strong>` : ""}
    </div>`;
}

function renderSignalStrip(block) {
  const items = (block.items || []).map(item => `
    <div class="signal-item">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
    </div>`).join("");
  return `<section class="signal-strip">${items}</section>`;
}

function renderSplitScreen(block) {
  const panels = (block.panels || []).map(panel => `
    <article class="visual-panel ${panel.tone ? `tone-${cssToken(panel.tone)}` : ""}">
      <span>${escapeHtml(panel.label || "")}</span>
      <h3>${escapeHtml(panel.title || "")}</h3>
      ${panel.text ? `<p>${escapeHtml(panel.text)}</p>` : ""}
      ${renderVisualList(panel.items)}
    </article>`).join("");
  return `<section class="visual-split-screen">${panels}</section>`;
}

function renderPathway(block) {
  const steps = (block.steps || []).map((step, index) => `
    <article class="path-step">
      <div class="path-index">${String(index + 1).padStart(2, "0")}</div>
      <h3>${escapeHtml(step.title || "")}</h3>
      <p>${escapeHtml(step.text || "")}</p>
      ${step.output ? `<span class="path-output">${escapeHtml(step.output)}</span>` : ""}
    </article>`).join("");
  return `
    <section class="visual-pathway">
      ${renderBlockHead(block)}
      <div class="pathway-rail">${steps}</div>
    </section>`;
}

function renderMatrix(block) {
  const columns = block.columns || [];
  const rows = block.rows || [];
  const gridCols = Math.max(columns.length, 1);
  const header = [`<div class="matrix-corner">${escapeHtml(block.corner || "")}</div>`]
    .concat(columns.map(column => `<div class="matrix-head">${escapeHtml(column)}</div>`))
    .join("");
  const body = rows.map(row => {
    const cells = (row.cells || []).map(cell => `<div class="matrix-cell">${escapeHtml(cell)}</div>`).join("");
    return `<div class="matrix-row-label">${escapeHtml(row.label || "")}</div>${cells}`;
  }).join("");
  return `
    <section class="visual-matrix" style="--matrix-cols:${gridCols}">
      ${renderBlockHead(block)}
      <div class="matrix-grid">${header}${body}</div>
    </section>`;
}

function renderEvidenceChain(block) {
  const nodes = (block.nodes || []).map(node => `
    <article class="chain-node">
      <span>${escapeHtml(node.label || "")}</span>
      <strong>${escapeHtml(node.title || "")}</strong>
      ${node.text ? `<p>${escapeHtml(node.text)}</p>` : ""}
    </article>`).join("");
  return `
    <section class="evidence-chain">
      ${renderBlockHead(block)}
      <div class="chain-track">${nodes}</div>
    </section>`;
}

function renderRoleMap(block) {
  const roles = (block.roles || []).map(role => `
    <div class="role-row">
      <span>${escapeHtml(role.role)}</span>
      <strong>${escapeHtml(role.responsibility)}</strong>
    </div>`).join("");
  const evidence = (block.evidence || []).map(item => `
    <div class="evidence-row">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.text)}</strong>
    </div>`).join("");
  return `
    <section class="role-map">
      ${renderBlockHead(block)}
      <div class="role-map-grid">
        <div>${roles}</div>
        <div>${evidence}</div>
      </div>
    </section>`;
}

function renderFinding(block) {
  const facets = (block.facets || []).map(facet => `
    <div>
      <span>${escapeHtml(facet.label)}</span>
      <strong>${escapeHtml(facet.text)}</strong>
    </div>`).join("");
  return `
    <section class="finding-board">
      ${renderBlockHead(block)}
      <blockquote>${escapeHtml(block.text || "")}</blockquote>
      <div class="finding-facets">${facets}</div>
    </section>`;
}

function renderMistakeBoard(block) {
  const items = (block.items || []).map(item => `
    <article class="mistake-item">
      <span>${escapeHtml(item.label || "")}</span>
      <h3>${escapeHtml(item.mistake || "")}</h3>
      <p>${escapeHtml(item.correction || "")}</p>
    </article>`).join("");
  return `
    <section class="mistake-board">
      ${renderBlockHead(block)}
      <div class="mistake-grid">${items}</div>
    </section>`;
}

function renderCardBoard(block) {
  const items = (block.items || []).map(item => `
    <article class="visual-card">
      <span>${escapeHtml(item.label || "")}</span>
      <h3>${escapeHtml(item.title || "")}</h3>
      <p>${escapeHtml(item.text || "")}</p>
    </article>`).join("");
  return `
    <section class="visual-card-board">
      ${renderBlockHead(block)}
      <div class="visual-card-grid">${items}</div>
    </section>`;
}

function renderVisualList(items) {
  return (items || []).length
    ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
}

function renderLearningCheck(slide, meta, title, subtitle) {
  const response = state.checkResponses[slide.id] || null;
  const selectedId = response ? response.choice : null;
  const selected = (slide.options || []).find(option => option.id === selectedId) || null;
  const options = (slide.options || []).map(option => {
    const selectedClass = selectedId === option.id ? "selected" : "";
    const correctnessClass = selectedId && option.correct ? "strongest" : "";
    return `
      <button class="check-option ${selectedClass} ${correctnessClass}" type="button" data-check-option="${escapeHtml(option.id)}" aria-pressed="${selectedId === option.id}">
        <span>${escapeHtml(option.label)}</span>
        <strong>${escapeHtml(option.text)}</strong>
      </button>`;
  }).join("");
  const feedback = selected ? `
    <div class="check-feedback show" id="checkFeedback">
      <span>${selected.correct ? "Strongest route" : "Useful thought, strengthen the route"}</span>
      <p>${escapeHtml(selected.feedback)}</p>
      <p>${escapeHtml(slide.coaching || "")}</p>
      <button class="primary compact" type="button" data-action="next-slide">Continue</button>
    </div>` : `
    <div class="check-feedback" id="checkFeedback"></div>`;

  return `
    <section class="slide slide-scroll check-slide">
      <div class="slide-inner">
        ${meta}${title}${subtitle}
        <div class="check-card">
          <div class="check-kicker">${escapeHtml(slide.sourceAfter || "Learning pause")}</div>
          <div class="question">${escapeHtml(slide.question || "")}</div>
          <div class="check-options">${options}</div>
          ${feedback}
        </div>
      </div>
    </section>`;
}

function renderMeta(item) {
  return `<div class="eyebrow">${escapeHtml(item.module)} / ${escapeHtml(item.chapter)}</div>`;
}

function renderSubtitle(text) {
  return text ? `<p class="subtitle">${escapeHtml(text)}</p>` : "";
}

function activeLesson() {
  return state.manifest.lessons[state.lessonIndex];
}

function activeSlide() {
  return getLessonSlides(activeLesson())[state.slideIndex];
}

function currentAudioItem() {
  if (state.view === "courseMap") return state.manifest.courseMap;
  if (state.view === "lessonMap") {
    const lesson = activeLesson();
    return {
      id: `${lesson.id}-map`,
      module: `Lesson ${lesson.number}`,
      chapter: "Internal Map",
      title: lesson.title,
      audio: lesson.audio || null,
      script: lesson.script || lesson.audio || null
    };
  }
  if (state.view === "slide") return activeSlide();
  return state.manifest.home;
}

function getLessonSlides(lesson) {
  if (Array.isArray(lesson.slides) && lesson.slides.length) return lesson.slides;
  const count = lesson.slideCount || placeholderSequence.length;
  return Array.from({ length: count }, (_, index) => {
    const sequenceTitle = placeholderSequence[index % placeholderSequence.length];
    const slideNo = String(index + 1).padStart(2, "0");
    return {
      id: `${lesson.id}-slide-${slideNo}`,
      module: `Lesson ${lesson.number}`,
      chapter: `Slide ${slideNo}`,
      title: `${lesson.title}: ${sequenceTitle}`,
      subtitle: "Draft slide slot for the finalized lesson script, PPT page, and narration segment.",
      layout: "content",
      audio: null,
      tags: ["Draft", "PPT Slot", "Audio Pending"],
      bullets: [
        "This page will be replaced with the finalized slide content after the lesson script is confirmed.",
        "A matched narration file can be attached to this slide by using the same slide id in the audio folder.",
        "The learner can enter the lesson from this page or continue through the previous and next controls."
      ]
    };
  });
}

function isLearningCheck(slide) {
  return slide && (slide.kind === "check" || slide.layout === "check");
}

function lessonCheckStats(lesson) {
  const checks = getLessonSlides(lesson).filter(isLearningCheck);
  const completed = checks.filter(slide => isCheckComplete(slide.id)).length;
  return {
    total: checks.length,
    completed,
    percent: checks.length ? Math.round(completed / checks.length * 100) : 0
  };
}

function isCheckComplete(id) {
  return Boolean(state.checkResponses[id]);
}

function loadCheckResponses() {
  try {
    return JSON.parse(localStorage.getItem(CHECK_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCheckResponses() {
  try {
    localStorage.setItem(CHECK_STORAGE_KEY, JSON.stringify(state.checkResponses));
  } catch {
    // Local progress is optional. The training flow still works if storage is blocked.
  }
}

function recordCheckAnswer(slide, optionId) {
  if (!isLearningCheck(slide)) return;
  const selected = (slide.options || []).find(option => option.id === optionId);
  if (!selected) return;
  state.checkResponses[slide.id] = {
    choice: selected.id,
    correct: Boolean(selected.correct),
    updatedAt: new Date().toISOString()
  };
  saveCheckResponses();
  renderCheckSelection(slide, selected);
}

function renderCheckSelection(slide, selected) {
  stage.querySelectorAll("[data-check-option]").forEach(button => {
    const option = (slide.options || []).find(item => item.id === button.dataset.checkOption);
    button.classList.toggle("selected", option && option.id === selected.id);
    button.classList.toggle("strongest", Boolean(option && option.correct));
    button.setAttribute("aria-pressed", option && option.id === selected.id ? "true" : "false");
  });
  const feedback = $("#checkFeedback");
  if (!feedback) return;
  feedback.classList.add("show");
  feedback.innerHTML = `
    <span>${selected.correct ? "Strongest route" : "Useful thought, strengthen the route"}</span>
    <p>${escapeHtml(selected.feedback)}</p>
    <p>${escapeHtml(slide.coaching || "")}</p>
    <button class="primary compact" type="button" data-action="next-slide">Continue</button>`;
  const continueButton = feedback.querySelector("[data-action='next-slide']");
  if (continueButton) continueButton.addEventListener("click", goNext);
  feedback.scrollIntoView({ block: "center", behavior: "smooth" });
}

function updateChrome(item) {
  $("#counterText").textContent = counterText();
  $("#progress").style.width = `${progressValue()}%`;
  prevBtn.disabled = state.view === "home";
  nextBtn.disabled = false;
  document.title = `${item.title} / ${state.manifest.title}`;
}

function counterText() {
  if (state.view === "home") return "Cover";
  if (state.view === "courseMap") return `${state.manifest.lessons.length} Lessons`;
  const lesson = activeLesson();
  if (state.view === "lessonMap") return `Lesson ${lesson.number} / Map`;
  const slide = activeSlide();
  const label = isLearningCheck(slide) ? "Check" : "Slide";
  return `Lesson ${lesson.number} / ${label} ${state.slideIndex + 1} / ${getLessonSlides(lesson).length}`;
}

function progressValue() {
  if (state.view === "home") return 0;
  const lessons = state.manifest.lessons;
  if (state.view === "courseMap") return 4;
  const lessonUnit = 96 / Math.max(lessons.length, 1);
  if (state.view === "lessonMap") return 4 + state.lessonIndex * lessonUnit;
  const slides = getLessonSlides(activeLesson());
  return 4 + state.lessonIndex * lessonUnit + (state.slideIndex + 1) / Math.max(slides.length, 1) * lessonUnit;
}

function loadItemAudio(item) {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  playBtn.textContent = "Play";
  playBtn.disabled = false;
  seek.value = 0;
  audioNow.textContent = "00:00";
  audioDuration.textContent = "00:00";
  state.audioBlocked = false;

  if (!item || !item.audio) {
    state.audioCandidates = [];
    playBtn.disabled = true;
    audioTitle.textContent = "Audio pending for this page.";
    return;
  }

  const profile = currentAudioProfile();
  const base = profile.audioBase || state.manifest.audioBase || "audio/";
  const extensions = state.manifest.audioExtensions || [state.manifest.audioFallbackExt || ".mp3"];
  const audioName = item.audio;
  state.audioCandidates = extensions.map(ext => `${base}${audioName}${ext}`);
  state.audioTryIndex = 0;
  const src = state.audioCandidates[state.audioTryIndex];
  setAudioSource(src);
  audio.playbackRate = Number($("#rateSelect").value);
  audioTitle.textContent = `Audio: ${src}`;

  if (state.autoplay) requestAudioPlay();
}

function showAudioMissing() {
  if (state.audioTryIndex < state.audioCandidates.length - 1) {
    state.audioTryIndex += 1;
    const nextSrc = state.audioCandidates[state.audioTryIndex];
    setAudioSource(nextSrc);
    audioTitle.textContent = `Audio: ${nextSrc}`;
    if (state.autoplay) requestAudioPlay();
    return;
  }
  playBtn.disabled = true;
  audioTitle.textContent = "Audio pending for this page.";
}

function togglePlay() {
  if (!audio.src || playBtn.disabled) return;
  if (audio.paused) requestAudioPlay();
  else {
    state.audioBlocked = false;
    audio.pause();
  }
}

function setAudioSource(src) {
  audio.src = src;
  audio.load();
  audio.addEventListener("canplay", () => {
    if (state.autoplay) requestAudioPlay();
  }, { once: true });
}

function updateAutoplayButton() {
  $("#audioModeBtn").textContent = `Auto: ${state.autoplay ? "On" : "Off"}`;
}

function requestAudioPlay() {
  if (!audio.src || playBtn.disabled || !state.autoplay) return;
  audio.play().then(() => {
    state.audioBlocked = false;
    audioTitle.textContent = `Audio: ${state.audioCandidates[state.audioTryIndex] || audio.src}`;
  }).catch(() => {
    state.audioBlocked = true;
    audioTitle.textContent = "Click anywhere once to enable autoplay.";
  });
}

function resumeBlockedAudio() {
  if (!state.audioBlocked || !state.autoplay || !audio.paused) return;
  requestAudioPlay();
}

function syncAudioTime() {
  if (!Number.isFinite(audio.duration)) return;
  audioNow.textContent = formatTime(audio.currentTime);
  audioDuration.textContent = formatTime(audio.duration);
  seek.value = audio.duration ? String(audio.currentTime / audio.duration * 100) : "0";
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

async function toggleNotes() {
  state.notesOpen = !state.notesOpen;
  if (!state.notesOpen) {
    closeDrawer();
    return;
  }
  renderNotes(currentAudioItem());
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
}

async function renderNotes(item) {
  $("#drawerTitle").textContent = `Script: ${item.id}`;
  if (!item.audio && !item.script) {
    $("#drawerBody").textContent = "Script will be added after this lesson page is finalized.";
    return;
  }
  try {
    const profile = currentAudioProfile();
    const textBase = profile.textBase || "wise_text/";
    const scriptName = item.script || item.audio;
    if (window.COURSE_SCRIPTS && window.COURSE_SCRIPTS[scriptName]) {
      $("#drawerBody").textContent = window.COURSE_SCRIPTS[scriptName];
      return;
    }
    const res = await fetch(`${textBase}${scriptName}.txt`, { cache: "no-store" });
    if (!res.ok) throw new Error("missing");
    $("#drawerBody").textContent = await res.text();
  } catch {
    $("#drawerBody").textContent = "No script file is available for this page yet.";
  }
}

function currentAudioProfile() {
  const profiles = state.manifest.audioProfiles || {};
  return profiles[state.audioProfile] || profiles.en || {};
}

function closeDrawer() {
  state.notesOpen = false;
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cssToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

init().catch(error => {
  const directFileHint = location.protocol === "file:"
    ? "This course must be opened through START_LOCAL_PREVIEW.bat, not by double-clicking index.html directly."
    : error.message;
  stage.innerHTML = `<section class="slide"><div class="slide-inner"><h1>Loading failed</h1><p class="subtitle">${escapeHtml(directFileHint)}</p></div></section>`;
});
