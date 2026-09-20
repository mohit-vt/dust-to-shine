(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader && preloader.classList.add("is-hidden"), 300);
  });

  /* ---------- Scroll progress + sticky header ---------- */
  const progressBar = document.getElementById("progressBar");
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (header) header.classList.toggle("is-scrolled", scrollTop > 30);
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Mobile full-screen nav ---------- */
  const hamburger = document.getElementById("hamburger");
  const navOverlay = document.getElementById("navOverlay");

  function closeNav() {
    hamburger.classList.remove("is-active");
    navOverlay.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (hamburger && navOverlay) {
    hamburger.addEventListener("click", () => {
      const isOpen = navOverlay.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navOverlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statEls = document.querySelectorAll(".stat__num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); statObserver.unobserve(entry.target); }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Process timeline draw ---------- */
  const processLine = document.querySelector(".process__line line");
  const processEl = document.querySelector(".process");
  if (processLine && processEl) {
    const lineObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { processLine.classList.add("is-drawn"); lineObserver.unobserve(e.target); } }),
      { threshold: 0.4 }
    );
    lineObserver.observe(processEl);
  }

  /* ---------- Hero spotlight follows cursor ---------- */
  const hero = document.querySelector(".hero");
  const spotlight = document.getElementById("spotlight");
  if (hero && spotlight && pointerFine && !prefersReducedMotion) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.setProperty("--x", `${e.clientX - rect.left}px`);
      spotlight.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  }

  /* ---------- Transformation visual: scroll + pointer driven reveal ---------- */
  const transformVisual = document.querySelector(".transform-visual");
  if (transformVisual) {
    const setReveal = (pct) => transformVisual.style.setProperty("--reveal", `${100 - pct}%`);
    if (pointerFine && !prefersReducedMotion) {
      transformVisual.addEventListener("mousemove", (e) => {
        const rect = transformVisual.getBoundingClientRect();
        const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        setReveal(pct);
      });
      transformVisual.addEventListener("mouseleave", () => setReveal(58));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => setReveal(entry.isIntersecting ? 78 : 30));
      }, { threshold: 0.4 });
      io.observe(transformVisual);
    }
  }

  /* ---------- Dust motes generation ---------- */
  document.querySelectorAll(".motes").forEach((field) => {
    const count = prefersReducedMotion ? 0 : 16;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.bottom = Math.random() * 40 + "%";
      s.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      s.style.animationDuration = (5 + Math.random() * 6) + "s";
      s.style.animationDelay = (Math.random() * 6) + "s";
      field.appendChild(s);
    }
  });

  /* ---------- Gentle parallax on the cinematic section ---------- */
  const cinematicBg = document.querySelector(".cinematic__bg");
  const cinematicSection = document.querySelector(".cinematic");
  if (cinematicBg && cinematicSection && !prefersReducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const rect = cinematicSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = rect.top / (vh + rect.height);
        cinematicBg.style.transform = `translateY(${progress * -60}px)`;
      }
      ticking = false;
    };
    document.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Magnetic buttons (desktop only) ---------- */
  if (pointerFine && !prefersReducedMotion) {
    document.querySelectorAll(".btn--primary, .btn--gold, .btn--whatsapp").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Service card 3D tilt + light follow (desktop only) ---------- */
  if (pointerFine && !prefersReducedMotion) {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -8;
        const ry = (px - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Before / after slider ---------- */
  document.querySelectorAll(".ba-slider").forEach((slider) => {
    const range = slider.querySelector("input[type='range']");
    const after = slider.querySelector(".ba-slider__after");
    const handle = slider.querySelector(".ba-slider__handle");
    if (!range) return;
    const update = () => {
      const val = range.value;
      slider.style.setProperty("--pos", `${val}%`);
      if (after) after.style.clipPath = `inset(0 0 0 ${val}%)`;
      if (handle) handle.style.left = `${val}%`;
    };
    range.addEventListener("input", update);
    update();
  });

  /* ---------- Before / after category tabs ---------- */
  const baTabs = document.querySelectorAll(".ba-tab");
  const baSlider = document.querySelector("[data-ba-slider]");
  baTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      baTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      if (baSlider) baSlider.setAttribute("data-active-category", tab.dataset.category || "");
    });
  });

  /* ---------- AMC / pricing toggle ---------- */
  const toggleBtns = document.querySelectorAll(".toggle__btn");
  const swappableEls = document.querySelectorAll("[data-onetime][data-amc]");
  function setPricingMode(mode) {
    toggleBtns.forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    swappableEls.forEach((el) => { el.textContent = el.dataset[mode]; });
  }
  toggleBtns.forEach((btn) => btn.addEventListener("click", () => setPricingMode(btn.dataset.mode)));

  /* ---------- Gallery filter ---------- */
  const galleryFilters = document.querySelectorAll(".gallery-filter");
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      galleryFilters.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.filter;
      galleryItems.forEach((item) => {
        item.classList.toggle("is-hidden", cat !== "all" && item.dataset.category !== cat);
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox) return;
      if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || "Project photo";
      if (lightboxDesc) lightboxDesc.textContent = item.dataset.desc || "Photos from this project will be added here soon.";
      lightbox.classList.add("is-open");
    });
  });
  document.querySelectorAll("[data-close-lightbox]").forEach((el) => {
    el.addEventListener("click", () => lightbox && lightbox.classList.remove("is-open"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox) lightbox.classList.remove("is-open");
  });

  /* ---------- Service card -> pre-select contact form service ---------- */
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.getElementById("fService");
      if (select) {
        const value = link.dataset.service;
        const match = Array.from(select.options).find((o) => o.textContent.trim() === value);
        if (match) select.value = match.value;
      }
    });
  });

  /* ---------- Lead form validation + WhatsApp deep link ---------- */
  const leadForm = document.getElementById("leadForm");
  const formNote = document.getElementById("formNote");

  function showFieldError(row, show) {
    if (!row) return;
    row.classList.toggle("is-invalid", show);
  }

  leadForm && leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameRow = document.getElementById("rowName");
    const phoneRow = document.getElementById("rowPhone");
    const serviceRow = document.getElementById("rowService");
    const consentRow = document.getElementById("rowConsent");

    const nameEl = document.getElementById("fName");
    const phoneEl = document.getElementById("fPhone");
    const serviceEl = document.getElementById("fService");
    const consentEl = document.getElementById("fConsent");

    let valid = true;
    const nameOk = nameEl.value.trim().length > 1;
    showFieldError(nameRow, !nameOk); if (!nameOk) valid = false;

    const phoneOk = /^[0-9+\s]{7,15}$/.test(phoneEl.value.trim());
    showFieldError(phoneRow, !phoneOk); if (!phoneOk) valid = false;

    const serviceOk = serviceEl.value !== "";
    showFieldError(serviceRow, !serviceOk); if (!serviceOk) valid = false;

    const consentOk = consentEl.checked;
    showFieldError(consentRow, !consentOk); if (!consentOk) valid = false;

    if (!valid) {
      if (formNote) {
        formNote.textContent = "Please fill in the highlighted fields before sending.";
        formNote.classList.remove("is-success");
        formNote.classList.add("is-error");
      }
      return;
    }

    const data = new FormData(leadForm);
    const name = (data.get("name") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const propertyType = (data.get("propertyType") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const location = (data.get("location") || "").toString().trim();
    const date = (data.get("date") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const lines = [
      "Hi DTS, I'd like to request a quote.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      propertyType ? `Property type: ${propertyType}` : null,
      `Service: ${service}`,
      location ? `Property / location: ${location}` : null,
      date ? `Preferred date: ${date}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/919003177051?text=${text}`;

    if (formNote) {
      formNote.textContent = "Opening WhatsApp with your details filled in…";
      formNote.classList.remove("is-error");
      formNote.classList.add("is-success");
    }
    window.open(url, "_blank", "noopener");
  });

  [["fName", "rowName"], ["fPhone", "rowPhone"], ["fService", "rowService"], ["fConsent", "rowConsent"]].forEach(([id, rowId]) => {
    const el = document.getElementById(id);
    const row = document.getElementById(rowId);
    if (el && row) el.addEventListener("input", () => showFieldError(row, false));
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
