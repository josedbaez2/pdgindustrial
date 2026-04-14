# PDG Industrial — WordPress to SSG Migration Design

## Overview

Migrate `pdgindustrial.com` (WordPress) to a static Astro v4 site hosted on GitHub Pages at `https://josedbaez2.github.io/pdgindustrial/`. The new site preserves the brand identity (logo, `#629254` green) while adopting a modern minimal design direction. Content is bilingual: Spanish (default) and English (`/en/`).

---

## Stack

| Concern | Choice |
|---------|--------|
| SSG | Astro v4 |
| Output | Static (`output: 'static'`) |
| Hosting | GitHub Pages (`josedbaez2/pdgindustrial`, `gh-pages` branch) |
| Base path | `/pdgindustrial/` |
| i18n | Astro built-in i18n routing |
| Styles | Plain CSS (scoped Astro component styles) |
| Deployment | GitHub Actions on push to `main` |

---

## Design

- **Direction:** Modern minimal — white/light backgrounds, generous whitespace, clean grid
- **Primary accent:** `#629254` (brand green)
- **Supporting palette:** `#8fc47e` (light green), `#f0f5ee` (green tint), `#1a2218` (deep forest, hero/footer), `#1a1a1a` (text), `#fff` (base)
- **Logo:** Original `logo.jpg` preserved as-is — embedded as `<img>` in Nav and Footer
- **Typography:** System sans-serif stack; bold/heavy weights for headings
- **Language toggle:** Footer, links to `/` (ES) and `/en/` (EN)

---

## Site Structure

```
/                      → Home (ES)
/servicios             → Services (ES)
/proyectos             → Projects index (ES)
/proyectos/[slug]      → Project detail (ES)
/clientes              → Clients (ES)
/contacto              → Contact (ES)

/en/                   → Home (EN)
/en/services           → Services (EN)
/en/projects           → Projects index (EN)
/en/projects/[slug]    → Project detail (EN)
/en/clients            → Clients (EN)
/en/contact            → Contact (EN)
```

---

## Project Structure

```
src/
  content/
    projects/                  # one .md per project
  pages/
    index.astro
    servicios.astro
    proyectos/
      index.astro
      [slug].astro
    clientes.astro
    contacto.astro
    en/
      index.astro
      services.astro
      projects/
        index.astro
        [slug].astro
      clients.astro
      contact.astro
  components/
    Nav.astro
    Footer.astro
    ServiceCard.astro
    ProjectCard.astro
    ClientGrid.astro
    ContactInfo.astro
  layouts/
    Base.astro             # <head>, Nav, Footer
  i18n/
    es.ts                  # Spanish string map
    en.ts                  # English string map
public/
  images/
    logo.jpg               # scraped from WP
    projects/              # scraped project images
```

---

## Content Model

### Projects (`src/content/projects/*.md`)

```yaml
---
title_es: "Tanque de 3 mil metros cúbicos"
title_en: "3,000 Cubic Meter Tank"
description_es: "Descripción del proyecto..."
description_en: "Project description..."
date: 2023-01-01
image: /images/projects/tanque-3000.jpg   # relative to public/ — components prepend import.meta.env.BASE_URL
category: tanks   # structures | tanks | fuel-stations | electrical | civil | piping | machinery
---
```

### Static content (i18n string maps)

All UI strings (nav labels, section headings, CTAs, contact info) live in `src/i18n/es.ts` and `src/i18n/en.ts`. Pages import the appropriate map via a `getLang(locale)` helper.

### Services

Defined as a static array in `src/i18n/es.ts` / `en.ts` (no collection needed — services rarely change):

1. Estructuras Metálicas / Metallic Structures
2. Instalación de Maquinaria / Machinery Installation
3. Estaciones de Combustible / Fuel Stations
4. Tanques de Almacenamiento / Storage Tanks
5. Obras Civiles / Civil Works
6. Líneas Eléctricas / Electrical Lines
7. Tuberías de Acero / Steel Piping
8. Suministro de Personal / Personnel Supply

### Clients

Static array in `src/i18n/` — includes Enel, Pepsi, Tropigas, Trafigura, Puma Energy, and 10+ others.

---

## Pages

### Home (`/`)
- Hero: dark forest green gradient, brand tagline, "Ver Proyectos" + "Contáctenos" CTAs, AISC/API/NSBA badges
- Services grid: 4-column, green top-border cards
- Client logo strip: green tint background
- Recent projects teaser: 3 latest projects

### Servicios (`/servicios`)
- Full 8-service grid with descriptions

### Proyectos (`/proyectos`)
- Category filter buttons (vanilla JS `data-category` toggling — no extra framework)
- Each card: project image, title, category tag

### Proyectos/[slug] (`/proyectos/[slug]`)
- Full-width image, title, description, category, date

### Clientes (`/clientes`)
- Client logo/name grid

### Contacto (`/contacto`)
- Phone, address, email (static)
- `mailto:` contact form fallback (no server needed)

---

## Migration Script

A one-time Node.js script (`scripts/scrape.mjs`) that:
1. Fetches the WP site's project pages
2. Downloads all project images to `public/images/projects/`
3. Generates `.md` files in `src/content/projects/` with scraped content as frontmatter
4. Downloads `logo.jpg` to `public/images/`

---

## Deployment

**GitHub Actions** (`.github/workflows/deploy.yml`):
1. Trigger: push to `main`
2. `npm ci`
3. `astro build`
4. Deploy `dist/` to `gh-pages` branch using `peaceiris/actions-gh-pages`

**Astro config:**
```js
export default defineConfig({
  site: 'https://josedbaez2.github.io',
  base: '/pdgindustrial/',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  }
})
```

---

## Out of Scope

- CMS or admin interface
- Server-side functionality (contact form posts to `mailto:`)
- Custom domain (deferred — can add `CNAME` later)
- Blog or news section
