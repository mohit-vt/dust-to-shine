(() => {
  "use strict";

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader && preloader.classList.add("is-hidden"), 350);
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
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 500);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("mainNav");

  function closeNav() {
    hamburger.classList.remove("is-active");
    mainNav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
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
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statEls = document.querySelectorAll(".stat__num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Process timeline draw ---------- */
  const processLine = document.querySelector(".process__line line");
  const process = document.querySelector(".process");
  if (processLine && process) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processLine.classList.add("is-drawn");
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    lineObserver.observe(process);
  }

  /* ---------- Hero spotlight follows cursor ---------- */
  const hero = document.querySelector(".hero");
  const spotlight = document.getElementById("spotlight");
  if (hero && spotlight && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.setProperty("--x", `${e.clientX - rect.left}px`);
      spotlight.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  }

  /* ---------- Gentle parallax on the cinematic section ---------- */
  const cinematicBg = document.querySelector(".cinematic__bg");
  const cinematicSection = document.querySelector(".cinematic");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (cinematicBg && cinematicSection && !prefersReducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const rect = cinematicSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < viewportH) {
        const progress = (rect.top) / (viewportH + rect.height);
        cinematicBg.style.transform = `translateY(${progress * -60}px)`;
      }
      ticking = false;
    };
    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* ---------- Pricing toggle ---------- */
  const toggleBtns = document.querySelectorAll(".toggle__btn");
  const swappableEls = document.querySelectorAll("[data-onetime][data-amc]");

  function setPricingMode(mode) {
    toggleBtns.forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    swappableEls.forEach((el) => {
      el.textContent = el.dataset[mode];
    });
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => setPricingMode(btn.dataset.mode));
  });

  /* ---------- Service card -> pre-select contact form service ---------- */
  document.querySelectorAll(".service-card__link[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.getElementById("fService");
      if (select) {
        const value = link.dataset.service;
        const match = Array.from(select.options).find((o) => o.textContent.trim() === value);
        if (match) select.value = match.value;
      }
    });
  });

  /* ---------- Lead form -> WhatsApp deep link ---------- */
  const leadForm = document.getElementById("leadForm");
  const formNote = document.getElementById("formNote");

  leadForm && leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    const data = new FormData(leadForm);
    const name = (data.get("name") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const time = (data.get("time") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const lines = [
      "Hi DTS, I'd like to request a quote.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Service: ${service}`,
      time ? `Preferred contact time: ${time}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/919003177051?text=${text}`;

    if (formNote) {
      formNote.textContent = "Opening WhatsApp with your details filled in…";
      formNote.classList.add("is-success");
    }

    window.open(url, "_blank", "noopener");
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
