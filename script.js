// Small JS to toggle a scrolled state (adds subtle shadow) — header remains fixed and
// unaffected otherwise
(function () {
  const h = document.querySelector(".qz_r7h");
  const TH = 10; // px scrolled before effect
  function onScroll() {
    if (window.scrollY > TH) {
      h.classList.add("--scrolled");
    } else {
      h.classList.remove("--scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  // ensure proper spacing on load
  document.documentElement.style.setProperty("--height", h.offsetHeight + "px");
})();
// for body
// ---------- Utilities ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------- Countdown (example next cohort date) ----------
(function initCountdown() {
  // set next cohort date (adjust as needed)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 14); // 14 days from now
  // UI
  const timerEl = $("#rdTimer");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    let diff = Math.max(0, nextDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    timerEl.textContent = `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(
      seconds
    )}s`;
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------- Modal / Registration handling ----------
(function modalRegistration() {
  const openEls = Array.from(
    document.querySelectorAll(
      '[data-action="open-register"], .kc_reg, #rdRegister'
    )
  );
  const modal = $("#mdRegister");
  const closeBtn = modal ? modal.querySelector(".md_close") : null;
  const closeActions = modal ? $$(".md_cancel") : [];

  function openModal(course) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    // preselect course if provided
    const courseSelect = modal.querySelector("#mdCourse");
    if (course && courseSelect) courseSelect.value = course;
    // focus first input
    const first = modal.querySelector('input[name="name"]');
    if (first) first.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
  }

  openEls.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const course = e.currentTarget.getAttribute("data-course") || null;
      openModal(course);
    })
  );

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  closeActions.forEach((b) => b.addEventListener("click", closeModal));

  // close modal on backdrop click
  modal &&
    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) closeModal();
    });

  // simple form submit flow (no backend)
  const form = $("#frmRegister");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      // basic validation
      const data = new FormData(form);
      if (
        !data.get("name") ||
        !data.get("email") ||
        !data.get("phone") ||
        !data.get("course")
      ) {
        alert("Please fill required fields.");
        return;
      }
      // pretend to send
      closeModal();
      alert(
        "Registration received. We will contact you to complete the ₦1,000 deposit."
      );
      form.reset();
    });
  }
})();

// ---------- Testimonials carousel ----------
(function testimonials() {
  const slides = $$(".fb_slide");
  if (!slides.length) return;
  let idx = 0;
  const show = (i) => {
    slides.forEach((s) => (s.hidden = true));
    slides[i].hidden = false;
  };
  show(idx);
  // auto rotate
  const rotate = () => {
    idx = (idx + 1) % slides.length;
    show(idx);
  };
  const timer = setInterval(rotate, 6000);

  // controls
  $(".fb_prev") &&
    $(".fb_prev").addEventListener("click", () => {
      idx = (idx - 1 + slides.length) % slides.length;
      show(idx);
      clearInterval(timer);
    });
  $(".fb_next") &&
    $(".fb_next").addEventListener("click", () => {
      idx = (idx + 1) % slides.length;
      show(idx);
      clearInterval(timer);
    });
})();

// ---------- FAQ accordion ----------
(function faqAccordion() {
  $$(".qa_q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // close all
      $$(".qa_q").forEach((b) => {
        b.setAttribute("aria-expanded", "false");
      });
      $$(".qa_a").forEach((a) => (a.hidden = true));
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        const a = btn.nextElementSibling;
        if (a) a.hidden = false;
      }
    });
  });
})();

// ---------- small scroll helper ----------
(function misc() {
  // scroll to courses if asked
  document.querySelectorAll('[data-action="scroll-courses"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("courses").scrollIntoView({ behavior: "smooth" });
    });
  });
})();
