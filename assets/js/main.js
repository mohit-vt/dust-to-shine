(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Intro brand film ---------- */
  const brandFilm = document.getElementById("brandFilm");
  window.setTimeout(() => {
    if (brandFilm) brandFilm.classList.add("finished");
    document.getElementById("top").className = "intro-complete";
  }, reducedMotion ? 100 : 2800);

  /* ---------- Scroll progress + header state ---------- */
  const header = document.getElementById("siteHeader");
  const progressFill = document.getElementById("progressFill");
  function onScroll() {
    const scrolled = window.scrollY > 40;
    header && header.classList.toggle("is-scrolled", scrolled);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + "%";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Section reveal ---------- */
  const sections = document.querySelectorAll("main > section, main > footer");
  sections.forEach((s) => s.classList.add("ad-section"));
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-frame"); }),
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  sections.forEach((s) => observer.observe(s));

  /* ---------- Mobile nav ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  const iconOpen = document.getElementById("menuIconOpen");
  const iconClose = document.getElementById("menuIconClose");
  function setMenu(open) {
    mainNav.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    iconOpen.style.display = open ? "none" : "block";
    iconClose.style.display = open ? "block" : "none";
  }
  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => setMenu(!mainNav.classList.contains("nav-open")));
    mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---------- Service card -> preselect quote form service ---------- */
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.getElementById("fService");
      if (!select) return;
      const value = link.dataset.service;
      const match = Array.from(select.options).find((o) => o.textContent.trim() === value);
      if (match) select.value = match.value;
    });
  });

  /* ---------- Quote form -> WhatsApp ---------- */
  const leadForm = document.getElementById("leadForm");
  function setInvalid(id, invalid) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("is-invalid", invalid);
  }

  leadForm && leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("fName");
    const phoneEl = document.getElementById("fPhone");
    const propertyEl = document.getElementById("fProperty");
    const serviceEl = document.getElementById("fService");
    const locationEl = document.getElementById("fLocation");
    const consentEl = document.getElementById("fConsent");

    let valid = true;
    const nameOk = nameEl.value.trim().length > 1;
    nameEl.closest("label") && nameEl.closest("label").classList.toggle("is-invalid", !nameOk);
    if (!nameOk) valid = false;

    const phoneOk = phoneEl.value.trim().length >= 7;
    phoneEl.closest("label") && phoneEl.closest("label").classList.toggle("is-invalid", !phoneOk);
    if (!phoneOk) valid = false;

    const propertyOk = propertyEl.value !== "";
    setInvalid("rowProperty", !propertyOk); if (!propertyOk) valid = false;

    const serviceOk = serviceEl.value !== "";
    setInvalid("rowService", !serviceOk); if (!serviceOk) valid = false;

    const locationOk = locationEl.value.trim().length > 1;
    locationEl.closest("label") && locationEl.closest("label").classList.toggle("is-invalid", !locationOk);
    if (!locationOk) valid = false;

    const consentOk = consentEl.checked;
    setInvalid("rowConsent", !consentOk); if (!consentOk) valid = false;

    if (!valid) return;

    const data = new FormData(leadForm);
    const lines = [
      "Hello Dust To Shine, I would like a free quote.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email") || "-"}`,
      `Property: ${data.get("property")}`,
      `Service: ${data.get("service")}`,
      `Location: ${data.get("location")}`,
      `Preferred date: ${data.get("date") || "Flexible"}`,
      `Message: ${data.get("message") || "-"}`,
    ];
    const url = `https://wa.me/919003177051?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  ["fName", "fPhone", "fProperty", "fService", "fLocation", "fConsent"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      const row = el.closest("label") || el.closest(".consent");
      if (row) row.classList.remove("is-invalid");
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
