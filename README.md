# Dust To Shine Facility Management Services

Premium, cinematic redesign — dark navy/charcoal "luxury meets sparkling
clean" identity with electric-cyan and gold accents. ISO 9001:2015
certified, Udyam registered facility management and cleaning company in
Chennai.

Plain HTML5 / CSS3 / vanilla JavaScript — no build step, no framework, no
dependencies. Deployed as-is via GitHub Pages.

## Structure

- `index.html` — full one-page site: cinematic hero, services showcase,
  before/after slider, facility-management overview, why-us, process,
  industries served, AMC comparison, project gallery (filter + lightbox),
  testimonials, final CTA, quote form, footer. SEO meta tags, Open Graph,
  and LocalBusiness + Service structured data.
- `privacy.html`, `terms.html` — lightweight legal pages linked from the
  footer, using the same header/footer shell.
- `assets/css/style.css` — design tokens, layout, motion.
- `assets/js/main.js` — scroll reveals, counters, mobile nav, magnetic
  buttons, 3D card tilt, before/after slider, AMC toggle, gallery filter +
  lightbox, WhatsApp-integrated quote form with validation.
- `assets/img/` — logo.

## What changed in this rebuild

- New dark-luxury visual system (previously a light cream/gold theme).
- Added: before/after comparison slider, complete-facility-management
  explainer, industries-served grid, AMC comparison section, project
  gallery with category filters + lightbox, testimonials section,
  magnetic CTA buttons, 3D tilt/light-follow service cards, horizontal
  scrollable services showcase, sticky mobile call/WhatsApp bar,
  full-screen mobile nav, Service structured data.
- Expanded quote form: property type, property/location, preferred date,
  consent checkbox, inline validation.
- All real content preserved: 8 services, address, phone, email, GSTIN
  33BCLPD8245A1Z0, UDYAM-TN-02-0138197, hours, pricing-tier structure.

## Known placeholders (by design — see content rules)

- **Before/after slider** uses an illustrative generative graphic, not a
  real customer photo — swap in genuine project photography once
  available (see `.ba-slider__before` / `.ba-slider__after` in
  `index.html`).
- **Project gallery** tiles are clearly marked "photos coming soon" —
  replace the placeholder `<div class="gallery-item__ph">` blocks with
  real `<img>` tags per category as jobs are documented.
- **Testimonials** shows an honest empty state rather than invented
  reviews — swap in a card grid once genuine client feedback is
  collected.
- No pricing figures are published anywhere, per the brief.
- Single-page site: service-specific URLs/pages were not built out in
  this pass.

## Local preview

```
python3 -m http.server 8000
```

Live website: https://mohit-vt.github.io/dust-to-shine/
