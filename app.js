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
  audioProfile: "en"
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

async function init() {
  if (window.COURSE_MANIFEST) {
    state.manifest = window.COURSE_MANIFEST;
  } else {
    const res = await fetch("data/course_manifest.json", { cache: "no-store" });
    state.manifest = await res.json();
  }
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
  const cards = state.manifest.lessons.map((lesson, index) => `
    <button class="map-card lesson-card" type="button" data-lesson-index="${index}">
      <span class="lesson-top">
        <span class="lesson-no">Lesson ${escapeHtml(lesson.number)}</span>
        <span class="lesson-status">${escapeHtml(lesson.status || "Draft")}</span>
      </span>
      <span class="t">${escapeHtml(lesson.title)}</span>
      <span class="s">${escapeHtml(lesson.subtitle || "")}</span>
      <span class="lesson-meta">
        <span>${getLessonSlides(lesson).length} slide slots</span>
        <span>${escapeHtml(lesson.duration || "20 min")}</span>
      </span>
    </button>`).join("");

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
  const cards = slides.map((slide, index) => `
    <button class="map-card slide-card" type="button" data-slide-index="${index}">
      <span class="m">Slide ${String(index + 1).padStart(2, "0")}</span>
      <span class="t">${escapeHtml(slide.title)}</span>
      <span class="s">${escapeHtml(slide.subtitle || "")}</span>
    </button>`).join("");

  return `
    <section class="slide slide-scroll">
      <div class="slide-inner">
        <div class="lesson-map-head">
          <div>
            <div class="eyebrow">Lesson ${escapeHtml(lesson.number)} / Internal Map</div>
            <h1>${escapeHtml(lesson.title)}</h1>
            ${renderSubtitle(lesson.objective || lesson.subtitle)}
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
  return `Lesson ${lesson.number} / Slide ${state.slideIndex + 1} / ${getLessonSlides(lesson).length}`;
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

init().catch(error => {
  const directFileHint = location.protocol === "file:"
    ? "This course must be opened through START_LOCAL_PREVIEW.bat, not by double-clicking index.html directly."
    : error.message;
  stage.innerHTML = `<section class="slide"><div class="slide-inner"><h1>Loading failed</h1><p class="subtitle">${escapeHtml(directFileHint)}</p></div></section>`;
});
