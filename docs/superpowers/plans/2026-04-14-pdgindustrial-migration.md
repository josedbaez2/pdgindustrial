# PDG Industrial Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate pdgindustrial.com from WordPress to a bilingual (ES/EN) Astro v4 static site hosted on GitHub Pages at `https://josedbaez2.github.io/pdgindustrial/`.

**Architecture:** Astro v4 with static output and built-in i18n routing — Spanish at `/` (no prefix), English at `/en/`. Content Collections hold projects as Markdown files with bilingual frontmatter. A one-time Node.js script downloads images from the live WP site. GitHub Actions deploys on push to `main`.

**Tech Stack:** Astro v4, TypeScript (strict), plain scoped CSS, `peaceiris/actions-gh-pages`

---

## File Map

```
astro.config.mjs
tsconfig.json
package.json
.gitignore
.github/
  workflows/
    deploy.yml
scripts/
  download-images.mjs
public/
  images/
    logo.jpg                              ← downloaded by script
    projects/
      base-para-tanque-de-butano.jpg      ← downloaded by script
      instalacion-mecanica-para-glp.jpg
      lavanderia-bahia-principe.jpg
      nave-metalica.jpg
      skids-con-compresor-de-descarga.jpg
      tanque-3mil-metros-cubicos.jpg
      tanque-y-estacion-de-bombeo.jpg
src/
  styles/
    global.css
  content/
    config.ts
    projects/
      base-para-tanque-de-butano.md
      instalacion-mecanica-para-glp.md
      lavanderia-bahia-principe.md
      nave-metalica.md
      skids-con-compresor-de-descarga.md
      tanque-3mil-metros-cubicos.md
      tanque-y-estacion-de-bombeo.md
  i18n/
    es.ts
    en.ts
    utils.ts
  layouts/
    Base.astro
  components/
    Nav.astro
    Footer.astro
    ServiceCard.astro
    ProjectCard.astro
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
```

---

## Task 1: Bootstrap Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "pdgindustrial",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^4.16.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.6.3"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://josedbaez2.github.io',
  base: '/pdgindustrial',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
dist/
node_modules/
.astro/
.superpowers/
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Verify Astro CLI works**

```bash
npx astro --version
```

Expected: prints `astro v4.x.x`

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore package-lock.json
git commit -m "feat: bootstrap Astro v4 project"
```

---

## Task 2: Global CSS

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* ─── Custom properties ─────────────────────────────── */
:root {
  --green:        #629254;
  --green-light:  #8fc47e;
  --green-tint:   #f0f5ee;
  --green-dark:   #1a2218;
  --green-border: #dde8d8;
  --green-mid:    #3a5432;
  --text:         #1a1a1a;
  --text-muted:   #666;
  --border:       #e5e8e2;
  --white:        #ffffff;
  --font:         system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ─── Reset ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-family: var(--font); color: var(--text); background: var(--white); }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; font: inherit; border: none; background: none; }

/* ─── Typography ─────────────────────────────────────── */
h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; line-height: 1.15; }
h2 { font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 800; line-height: 1.2; }
h3 { font-size: 1.1rem; font-weight: 700; }
p  { line-height: 1.6; }

/* ─── Layout utilities ───────────────────────────────── */
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
.section    { padding: 4rem 0; }
.label      { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
              color: var(--green); margin-bottom: 0.5rem; }

/* ─── Buttons ────────────────────────────────────────── */
.btn-primary {
  display: inline-block;
  background: var(--green);
  color: var(--white);
  padding: 0.65rem 1.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--green-mid); }

.btn-outline {
  display: inline-block;
  border: 1px solid var(--green);
  color: var(--green-light);
  padding: 0.65rem 1.4rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.2s;
}
.btn-outline:hover { background: rgba(98,146,84,0.15); }

/* ─── Cards grid ─────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
```

- [ ] **Step 2: Verify file has no syntax errors (visual check)**

Open `src/styles/global.css` and confirm it looks correct. No build step yet.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS with brand tokens"
```

---

## Task 3: Content collection schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title_es:       z.string(),
    title_en:       z.string(),
    description_es: z.string(),
    description_en: z.string(),
    client:         z.string(),
    location:       z.string(),
    date:           z.coerce.date(),
    image:          z.string(),
    category:       z.enum([
      'structures',
      'tanks',
      'fuel-stations',
      'electrical',
      'civil',
      'piping',
      'machinery',
    ]),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```

Expected: no errors (or only warnings about missing page files — that is fine at this stage).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define projects content collection schema"
```

---

## Task 4: i18n strings and utils

**Files:**
- Create: `src/i18n/es.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Create `src/i18n/es.ts`**

```ts
export default {
  nav: {
    services: 'Servicios',
    projects:  'Proyectos',
    clients:   'Clientes',
    contact:   'Contacto',
  },
  hero: {
    tagline:     'Más de 30 años de experiencia',
    heading:     'Fabricación y Construcción de Estructuras Metálicas',
    subheading:  'Diseño, fabricación e instalación de estructuras metálicas, tanques de almacenamiento, estaciones de combustible y líneas eléctricas.',
    cta_projects: 'Ver Proyectos',
    cta_contact:  'Contáctenos',
  },
  services: {
    label:   'Lo que hacemos',
    heading: 'Nuestros Servicios',
    items: [
      { id: 'structures',   name: 'Estructuras Metálicas',      description: 'Diseño, fabricación e instalación de estructuras de acero.' },
      { id: 'machinery',    name: 'Instalación de Maquinaria',   description: 'Equipos industriales y de generación eléctrica.' },
      { id: 'fuel-stations', name: 'Estaciones de Combustible',  description: 'Instalación de tanques y skids subterráneos.' },
      { id: 'tanks',        name: 'Tanques de Almacenamiento',   description: 'Diseño y fabricación para combustible, alimentos y agua.' },
      { id: 'civil',        name: 'Obras Civiles',               description: 'Construcción, supervisión y diseño de obras civiles.' },
      { id: 'electrical',   name: 'Líneas Eléctricas',           description: 'Instalación de transmisión y distribución eléctrica.' },
      { id: 'piping',       name: 'Tuberías de Acero',           description: 'Diseño e instalación para combustible y agua.' },
      { id: 'personnel',    name: 'Suministro de Personal',      description: 'Técnicos calificados para proyectos industriales.' },
    ],
  },
  projects: {
    label:      'Nuestro trabajo',
    heading:    'Proyectos',
    filter_all: 'Todos',
    view_all:   'Ver todos los proyectos →',
    back:       '← Proyectos',
    categories: {
      structures:    'Estructuras',
      tanks:         'Tanques',
      'fuel-stations': 'Combustible',
      electrical:    'Eléctrico',
      civil:         'Civil',
      piping:        'Tuberías',
      machinery:     'Maquinaria',
    },
    client_label:   'Cliente',
    location_label: 'Ubicación',
    date_label:     'Año',
  },
  clients: {
    label:   'Quiénes confían en nosotros',
    heading: 'Nuestros Clientes',
    items: [
      'Enel', 'Pepsi', 'Tropigas', 'Trafigura', 'Puma Energy',
      'Los Orígenes Power Plant', 'Tarsco', 'Bahía Príncipe',
      'Sunix', 'Propagas', 'GH Trade',
    ],
  },
  contact: {
    label:   'Estamos disponibles',
    heading: 'Contáctenos',
    phone:   '809.565.0055',
    address: 'Calle 1ra #22, Los Jardines del Sur, Santo Domingo',
    email:   'pdgindustrial@claro.net.do',
    cta:     'Enviar correo',
  },
  footer: {
    standards:         'Cumplimos con los estándares AISC, API y NSBA.',
    rights:            '© 2025 P.D.G. Industrial, S.R.L.',
    lang_switch:       'English',
    lang_switch_href:  'en/',
  },
  meta: {
    home_title:       'P.D.G. Industrial, S.R.L. — Estructuras Metálicas',
    home_description: 'Más de 30 años fabricando estructuras metálicas, tanques y estaciones de combustible en la República Dominicana.',
    services_title:   'Servicios — P.D.G. Industrial',
    projects_title:   'Proyectos — P.D.G. Industrial',
    clients_title:    'Clientes — P.D.G. Industrial',
    contact_title:    'Contacto — P.D.G. Industrial',
  },
} as const;
```

- [ ] **Step 2: Create `src/i18n/en.ts`**

```ts
export default {
  nav: {
    services: 'Services',
    projects:  'Projects',
    clients:   'Clients',
    contact:   'Contact',
  },
  hero: {
    tagline:     'Over 30 years of experience',
    heading:     'Manufacturing and Construction of Steel Structures',
    subheading:  'Design, fabrication and installation of steel structures, storage tanks, fuel stations, and electrical lines.',
    cta_projects: 'View Projects',
    cta_contact:  'Contact Us',
  },
  services: {
    label:   'What we do',
    heading: 'Our Services',
    items: [
      { id: 'structures',    name: 'Metallic Structures',      description: 'Design, fabrication and installation of steel structures.' },
      { id: 'machinery',     name: 'Machinery Installation',   description: 'Industrial and electrical generation equipment.' },
      { id: 'fuel-stations', name: 'Fuel Stations',            description: 'Tank and underground skid installation.' },
      { id: 'tanks',         name: 'Storage Tanks',            description: 'Design and fabrication for fuel, food and water.' },
      { id: 'civil',         name: 'Civil Works',              description: 'Construction, supervision and civil engineering.' },
      { id: 'electrical',    name: 'Electrical Lines',         description: 'Transmission and distribution installation.' },
      { id: 'piping',        name: 'Steel Piping',             description: 'Design and installation for fuel and water systems.' },
      { id: 'personnel',     name: 'Personnel Supply',         description: 'Qualified technicians for industrial projects.' },
    ],
  },
  projects: {
    label:      'Our work',
    heading:    'Projects',
    filter_all: 'All',
    view_all:   'View all projects →',
    back:       '← Projects',
    categories: {
      structures:    'Structures',
      tanks:         'Tanks',
      'fuel-stations': 'Fuel',
      electrical:    'Electrical',
      civil:         'Civil',
      piping:        'Piping',
      machinery:     'Machinery',
    },
    client_label:   'Client',
    location_label: 'Location',
    date_label:     'Year',
  },
  clients: {
    label:   'Who trusts us',
    heading: 'Our Clients',
    items: [
      'Enel', 'Pepsi', 'Tropigas', 'Trafigura', 'Puma Energy',
      'Los Orígenes Power Plant', 'Tarsco', 'Bahía Príncipe',
      'Sunix', 'Propagas', 'GH Trade',
    ],
  },
  contact: {
    label:   'We are available',
    heading: 'Contact Us',
    phone:   '809.565.0055',
    address: 'Calle 1ra #22, Los Jardines del Sur, Santo Domingo, Dominican Republic',
    email:   'pdgindustrial@claro.net.do',
    cta:     'Send email',
  },
  footer: {
    standards:        'We comply with AISC, API and NSBA standards.',
    rights:           '© 2025 P.D.G. Industrial, S.R.L.',
    lang_switch:      'Español',
    lang_switch_href: '',
  },
  meta: {
    home_title:       'P.D.G. Industrial, S.R.L. — Steel Structures',
    home_description: 'Over 30 years manufacturing steel structures, tanks and fuel stations in the Dominican Republic.',
    services_title:   'Services — P.D.G. Industrial',
    projects_title:   'Projects — P.D.G. Industrial',
    clients_title:    'Clients — P.D.G. Industrial',
    contact_title:    'Contact — P.D.G. Industrial',
  },
} as const;
```

- [ ] **Step 3: Create `src/i18n/utils.ts`**

```ts
import es from './es';
import en from './en';

type Lang = 'es' | 'en';
const translations = { es, en };

export function getLang(lang: Lang) {
  return translations[lang];
}

export function getNavLinks(lang: Lang, base: string) {
  if (lang === 'en') {
    return {
      home:     `${base}en/`,
      services: `${base}en/services`,
      projects: `${base}en/projects`,
      clients:  `${base}en/clients`,
      contact:  `${base}en/contact`,
    };
  }
  return {
    home:     base,
    services: `${base}servicios`,
    projects: `${base}proyectos`,
    clients:  `${base}clientes`,
    contact:  `${base}contacto`,
  };
}

export function getProjectHref(lang: Lang, base: string, slug: string) {
  if (lang === 'en') return `${base}en/projects/${slug}`;
  return `${base}proyectos/${slug}`;
}
```

- [ ] **Step 4: Run type check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: add bilingual i18n string maps and utilities"
```

---

## Task 5: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title:       string;
  description?: string;
  lang:        'es' | 'en';
}

const { title, description = '', lang } = Astro.props;
const base = import.meta.env.BASE_URL;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" href={`${base}favicon.ico`} />
  </head>
  <body>
    <Nav lang={lang} />
    <main>
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add Base layout"
```

---

## Task 6: Nav component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import { getLang, getNavLinks } from '../i18n/utils';

interface Props { lang: 'es' | 'en'; }
const { lang } = Astro.props;
const t = getLang(lang);
const base = import.meta.env.BASE_URL;
const links = getNavLinks(lang, base);
---
<header class="nav">
  <div class="nav__inner container">
    <a href={links.home} class="nav__logo">
      <img
        src={`${base}images/logo.jpg`}
        alt="P.D.G. Industrial, S.R.L."
        height="40"
        width="auto"
      />
    </a>
    <nav aria-label="Main navigation">
      <ul class="nav__links">
        <li><a href={links.services}>{t.nav.services}</a></li>
        <li><a href={links.projects}>{t.nav.projects}</a></li>
        <li><a href={links.clients}>{t.nav.clients}</a></li>
        <li><a href={links.contact} class="nav__cta">{t.nav.contact}</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .nav {
    background: #fff;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .nav__logo img { display: block; }
  .nav__links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .nav__links a {
    font-size: 0.85rem;
    color: var(--text-muted);
    transition: color 0.15s;
  }
  .nav__links a:hover { color: var(--green); }
  .nav__cta {
    background: var(--green);
    color: #fff !important;
    padding: 0.5rem 1.1rem;
    border-radius: 2px;
    font-weight: 600;
  }
  .nav__cta:hover { background: var(--green-mid) !important; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component"
```

---

## Task 7: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import { getLang } from '../i18n/utils';

interface Props { lang: 'es' | 'en'; }
const { lang } = Astro.props;
const t = getLang(lang);
const base = import.meta.env.BASE_URL;
---
<footer class="footer">
  <div class="footer__inner container">
    <img
      src={`${base}images/logo.jpg`}
      alt="P.D.G. Industrial, S.R.L."
      height="28"
      class="footer__logo"
    />
    <div class="footer__info">
      <p>{t.contact.phone} · <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a></p>
      <p>{t.contact.address}</p>
      <p class="footer__standards">{t.footer.standards}</p>
    </div>
    <div class="footer__bottom">
      <span>{t.footer.rights}</span>
      <a href={`${base}${t.footer.lang_switch_href}`} class="footer__lang">{t.footer.lang_switch}</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--green-dark);
    color: #a8c89e;
    padding: 3rem 0 1.5rem;
    margin-top: 4rem;
  }
  .footer__inner {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .footer__logo { filter: brightness(0) invert(1); opacity: 0.75; }
  .footer__info { font-size: 0.85rem; line-height: 1.8; }
  .footer__info a { color: var(--green-light); }
  .footer__info a:hover { text-decoration: underline; }
  .footer__standards { opacity: 0.6; margin-top: 0.25rem; }
  .footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(98,146,84,0.2);
    padding-top: 1rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }
  .footer__lang {
    color: var(--green-light);
    opacity: 1;
    font-weight: 600;
    border: 1px solid rgba(98,146,84,0.4);
    padding: 0.2rem 0.7rem;
    border-radius: 2px;
  }
  .footer__lang:hover { opacity: 0.8; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component with language toggle"
```

---

## Task 8: ServiceCard and ProjectCard components

**Files:**
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create `src/components/ServiceCard.astro`**

```astro
---
interface Props {
  name:        string;
  description: string;
  index:       number;
}
const { name, description, index } = Astro.props;
---
<div class="service-card">
  <div class="service-card__num">{String(index + 1).padStart(2, '0')}</div>
  <h3 class="service-card__name">{name}</h3>
  <p class="service-card__desc">{description}</p>
</div>

<style>
  .service-card {
    border: 1px solid var(--border);
    border-top: 3px solid var(--green);
    padding: 1.25rem;
    background: #fafbf9;
  }
  .service-card__num {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--green);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  .service-card__name {
    font-size: 0.95rem;
    color: var(--text);
    margin-bottom: 0.4rem;
  }
  .service-card__desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.5;
  }
</style>
```

- [ ] **Step 2: Create `src/components/ProjectCard.astro`**

```astro
---
import { getProjectHref } from '../i18n/utils';

interface Props {
  slug:     string;
  title:    string;
  image:    string;
  category: string;
  categoryLabel: string;
  lang:     'es' | 'en';
}
const { slug, title, image, category, categoryLabel, lang } = Astro.props;
const base = import.meta.env.BASE_URL;
const href = getProjectHref(lang, base, slug);
---
<a href={href} class="project-card" data-category={category}>
  <div class="project-card__img">
    <img src={`${base}${image.replace(/^\//, '')}`} alt={title} loading="lazy" />
  </div>
  <div class="project-card__body">
    <span class="project-card__tag">{categoryLabel}</span>
    <h3 class="project-card__title">{title}</h3>
  </div>
</a>

<style>
  .project-card {
    display: block;
    border: 1px solid var(--border);
    overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .project-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .project-card__img { aspect-ratio: 4/3; overflow: hidden; background: var(--green-tint); }
  .project-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .project-card:hover .project-card__img img { transform: scale(1.03); }
  .project-card__body { padding: 1rem; }
  .project-card__tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green);
    background: var(--green-tint);
    padding: 0.15rem 0.5rem;
    border-radius: 2px;
    margin-bottom: 0.4rem;
  }
  .project-card__title { font-size: 0.9rem; color: var(--text); line-height: 1.3; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ServiceCard.astro src/components/ProjectCard.astro
git commit -m "feat: add ServiceCard and ProjectCard components"
```

---

## Task 9: Download images

**Files:**
- Create: `scripts/download-images.mjs`

- [ ] **Step 1: Create `scripts/download-images.mjs`**

```js
// scripts/download-images.mjs
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'images');

const LOGO = 'https://pdgindustrial.com/wp-content/uploads/2020/01/logo.jpg';

const PROJECTS = [
  {
    slug: 'base-para-tanque-de-butano',
    url:  'https://pdgindustrial.com/wp-content/uploads/2016/09/4.jpg',
  },
  {
    slug: 'instalacion-mecanica-para-glp',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/10/IMG_20170601_165933-min_1050x786.jpg',
  },
  {
    slug: 'lavanderia-bahia-principe',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/09/20190316_141832-min.jpg',
  },
  {
    slug: 'nave-metalica',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/IMG-20120102-00181.jpg',
  },
  {
    slug: 'skids-con-compresor-de-descarga',
    url:  'https://pdgindustrial.com/wp-content/uploads/2019/09/20190925_152243-min.jpg',
  },
  {
    slug: 'tanque-3mil-metros-cubicos',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/1546040_10202695589328358_1919066873_n.jpg',
  },
  {
    slug: 'tanque-y-estacion-de-bombeo',
    url:  'https://pdgindustrial.com/wp-content/uploads/2014/10/IMAG0006.jpg',
  },
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  const buf = await res.arrayBuffer();
  await writeFile(dest, Buffer.from(buf));
  console.log('  ✓', dest.split('public/images/')[1] ?? dest);
}

async function main() {
  await mkdir(join(PUBLIC, 'projects'), { recursive: true });

  console.log('Downloading logo...');
  await download(LOGO, join(PUBLIC, 'logo.jpg'));

  console.log('Downloading project images...');
  for (const { slug, url } of PROJECTS) {
    await download(url, join(PUBLIC, 'projects', `${slug}.jpg`));
  }

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run the script**

```bash
node scripts/download-images.mjs
```

Expected output:
```
Downloading logo...
  ✓ logo.jpg
Downloading project images...
  ✓ projects/base-para-tanque-de-butano.jpg
  ✓ projects/instalacion-mecanica-para-glp.jpg
  ✓ projects/lavanderia-bahia-principe.jpg
  ✓ projects/nave-metalica.jpg
  ✓ projects/skids-con-compresor-de-descarga.jpg
  ✓ projects/tanque-3mil-metros-cubicos.jpg
  ✓ projects/tanque-y-estacion-de-bombeo.jpg
Done.
```

- [ ] **Step 3: Verify files exist**

```bash
ls public/images/projects/
```

Expected: 7 `.jpg` files listed.

- [ ] **Step 4: Commit**

```bash
git add scripts/download-images.mjs public/images/
git commit -m "feat: add image download script and downloaded assets"
```

---

## Task 10: Create project Markdown files

**Files:**
- Create: `src/content/projects/base-para-tanque-de-butano.md`
- Create: `src/content/projects/instalacion-mecanica-para-glp.md`
- Create: `src/content/projects/lavanderia-bahia-principe.md`
- Create: `src/content/projects/nave-metalica.md`
- Create: `src/content/projects/skids-con-compresor-de-descarga.md`
- Create: `src/content/projects/tanque-3mil-metros-cubicos.md`
- Create: `src/content/projects/tanque-y-estacion-de-bombeo.md`

- [ ] **Step 1: Create `src/content/projects/base-para-tanque-de-butano.md`**

```markdown
---
title_es: "Base para Tanque de Butano"
title_en: "Butane Tank Base"
description_es: "Construcción de base de tanque para almacenamiento de gas butano."
description_en: "Construction of a reinforced concrete base for butane gas storage tank."
client: "Tarsco"
location: "San Pedro de Macorís"
date: 2016-09-01
image: /images/projects/base-para-tanque-de-butano.jpg
category: tanks
---
```

- [ ] **Step 2: Create `src/content/projects/instalacion-mecanica-para-glp.md`**

```markdown
---
title_es: "Instalación mecánica para estación de GLP"
title_en: "Mechanical Installation for LPG Station"
description_es: "Instalación mecánica en general para el suministro de GLP desde tanque soterrado hacia dispensadores de despacho."
description_en: "General mechanical installation for the supply of LPG from an underground storage tank to dispensing units."
client: "Tropigas"
location: "Distrito Nacional"
date: 2017-06-01
image: /images/projects/instalacion-mecanica-para-glp.jpg
category: fuel-stations
---
```

- [ ] **Step 3: Create `src/content/projects/lavanderia-bahia-principe.md`**

```markdown
---
title_es: "Lavandería Bahía Príncipe"
title_en: "Bahía Príncipe Laundry"
description_es: "Instalación de tuberías para suministro de gas natural para lavandería del hotel Bahía Príncipe."
description_en: "Installation of natural gas piping infrastructure for the laundry facility of Bahía Príncipe hotel."
client: "Tropigas"
location: "Bávaro"
date: 2019-03-01
image: /images/projects/lavanderia-bahia-principe.jpg
category: piping
---
```

- [ ] **Step 4: Create `src/content/projects/nave-metalica.md`**

```markdown
---
title_es: "Nave Metálica"
title_en: "Metal Structure"
description_es: "Ensamble de nave metálica para planta de generación eléctrica."
description_en: "Assembly and installation of a metal structure building for a power generation plant."
client: "Los Orígenes Power Plant"
location: "San Pedro de Macorís"
date: 2012-01-01
image: /images/projects/nave-metalica.jpg
category: structures
---
```

- [ ] **Step 5: Create `src/content/projects/skids-con-compresor-de-descarga.md`**

```markdown
---
title_es: "Skids con compresor de descarga"
title_en: "Discharge Compressor Skids"
description_es: "Diseño y fabricación de skids industriales equipados con compresores de descarga para distribución de gas."
description_en: "Design and fabrication of industrial skids equipped with discharge compressors for gas distribution."
client: "Tropigas / Propagas / GH Trade"
location: "Santo Domingo"
date: 2019-09-01
image: /images/projects/skids-con-compresor-de-descarga.jpg
category: machinery
---
```

- [ ] **Step 6: Create `src/content/projects/tanque-3mil-metros-cubicos.md`**

```markdown
---
title_es: "Tanque de 3 mil metros cúbicos"
title_en: "3,000 Cubic Meter Tank"
description_es: "Diseño y construcción de tanque de 3,000 metros cúbicos (800,000 galones) para almacenamiento de HFO (Heavy Fuel Oil)."
description_en: "Design and construction of a 3,000 cubic meter (800,000 gallon) tank for HFO (Heavy Fuel Oil) storage."
client: "Los Orígenes Power Plant"
location: "San Pedro de Macorís"
date: 2014-10-01
image: /images/projects/tanque-3mil-metros-cubicos.jpg
category: tanks
---
```

- [ ] **Step 7: Create `src/content/projects/tanque-y-estacion-de-bombeo.md`**

```markdown
---
title_es: "Tanque y Estación de Bombeo"
title_en: "Tank and Pumping Station"
description_es: "Dos tanques de almacenamiento de 100,000 y 30,000 galones para diesel regular y premium, con sistema de tuberías de carga y descarga conectado a una estación de llenado de camiones."
description_en: "Two storage tanks of 100,000 and 30,000 gallons for regular and premium diesel, with loading and unloading piping connected to a truck filling station."
client: "Sunix"
location: "Santo Domingo Norte"
date: 2014-10-01
image: /images/projects/tanque-y-estacion-de-bombeo.jpg
category: tanks
---
```

- [ ] **Step 8: Run type check to validate all frontmatter against the schema**

```bash
npm run check
```

Expected: no errors (7 project files validated against the schema in `src/content/config.ts`).

- [ ] **Step 9: Commit**

```bash
git add src/content/projects/
git commit -m "feat: add 7 project Markdown files with bilingual frontmatter"
```

---

## Task 11: ES Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ServiceCard from '../components/ServiceCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getLang, getNavLinks } from '../i18n/utils';
import { getCollection } from 'astro:content';

const t = getLang('es');
const base = import.meta.env.BASE_URL;
const links = getNavLinks('es', base);

const allProjects = await getCollection('projects');
const recent = allProjects
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---
<Base title={t.meta.home_title} description={t.meta.home_description} lang="es">

  <!-- Hero -->
  <section class="hero">
    <div class="hero__inner container">
      <div class="hero__content">
        <p class="label">{t.hero.tagline}</p>
        <h1>{t.hero.heading}</h1>
        <p class="hero__sub">{t.hero.subheading}</p>
        <div class="hero__ctas">
          <a href={links.projects} class="btn-primary">{t.hero.cta_projects}</a>
          <a href={links.contact} class="btn-outline">{t.hero.cta_contact}</a>
        </div>
      </div>
      <div class="hero__badges">
        <span class="badge">AISC</span>
        <span class="badge">API</span>
        <span class="badge">NSBA</span>
      </div>
    </div>
  </section>

  <!-- Services strip -->
  <section class="section services-strip">
    <div class="container">
      <p class="label">{t.services.label}</p>
      <h2>{t.services.heading}</h2>
      <div class="cards-grid" style="margin-top:1.5rem">
        {t.services.items.map((s, i) => (
          <ServiceCard name={s.name} description={s.description} index={i} />
        ))}
      </div>
    </div>
  </section>

  <!-- Recent projects -->
  <section class="section recent-projects" style="background:var(--green-tint)">
    <div class="container">
      <p class="label">{t.projects.label}</p>
      <h2>{t.projects.heading}</h2>
      <div class="cards-grid" style="margin-top:1.5rem">
        {recent.map(p => (
          <ProjectCard
            slug={p.slug}
            title={p.data.title_es}
            image={p.data.image}
            category={p.data.category}
            categoryLabel={t.projects.categories[p.data.category]}
            lang="es"
          />
        ))}
      </div>
      <div style="margin-top:1.5rem">
        <a href={links.projects} class="btn-primary">{t.projects.view_all}</a>
      </div>
    </div>
  </section>

  <!-- Clients strip -->
  <section class="section clients-strip">
    <div class="container">
      <p class="label">{t.clients.label}</p>
      <div class="clients-grid">
        {t.clients.items.map(c => <span class="client-chip">{c}</span>)}
      </div>
    </div>
  </section>

</Base>

<style>
  /* Hero */
  .hero {
    background: linear-gradient(135deg, var(--green-dark) 0%, #2a3828 65%, #3a4f35 100%);
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border: 1px solid rgba(98,146,84,0.15);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    top: -10px; right: -10px;
    width: 200px; height: 200px;
    border: 1px solid rgba(98,146,84,0.1);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero__inner {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: relative;
    z-index: 1;
  }
  .hero__content { max-width: 600px; }
  .hero__content .label { color: var(--green-light); }
  .hero__content h1 { color: #fff; margin: 0.5rem 0 1rem; }
  .hero__sub { color: #a8b8a4; font-size: 0.95rem; margin-bottom: 1.75rem; }
  .hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .hero__badges { display: flex; gap: 0.5rem; }
  .badge {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(98,146,84,0.3);
    color: var(--green-light);
    padding: 0.25rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    border-radius: 2px;
  }

  /* Services */
  .services-strip h2 { margin-top: 0.25rem; }

  /* Recent projects */
  .recent-projects h2 { margin-top: 0.25rem; }

  /* Clients */
  .clients-strip .label { margin-bottom: 1rem; }
  .clients-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .client-chip {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--green-mid);
    background: var(--white);
    border: 1px solid var(--green-border);
    padding: 0.3rem 0.9rem;
    border-radius: 2px;
  }
</style>
```

- [ ] **Step 2: Run build to verify the page compiles**

```bash
npm run build
```

Expected: build succeeds, `dist/pdgindustrial/index.html` created.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add ES home page"
```

---

## Task 12: ES Servicios page

**Files:**
- Create: `src/pages/servicios.astro`

- [ ] **Step 1: Create `src/pages/servicios.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ServiceCard from '../components/ServiceCard.astro';
import { getLang } from '../i18n/utils';

const t = getLang('es');
---
<Base title={t.meta.services_title} lang="es">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.services.label}</p>
      <h1>{t.services.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="cards-grid">
        {t.services.items.map((s, i) => (
          <ServiceCard name={s.name} description={s.description} index={i} />
        ))}
      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
</style>
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/servicios.astro
git commit -m "feat: add ES servicios page"
```

---

## Task 13: ES Proyectos index page

**Files:**
- Create: `src/pages/proyectos/index.astro`

- [ ] **Step 1: Create `src/pages/proyectos/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getLang } from '../../i18n/utils';
import { getCollection } from 'astro:content';

const t = getLang('es');
const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const categories = Object.entries(t.projects.categories);
---
<Base title={t.meta.projects_title} lang="es">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.projects.label}</p>
      <h1>{t.projects.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="filter-bar">
        <button class="filter-btn active" data-filter="all">{t.projects.filter_all}</button>
        {categories.map(([id, label]) => (
          <button class="filter-btn" data-filter={id}>{label}</button>
        ))}
      </div>
      <div class="projects-grid cards-grid" id="projects-grid">
        {sorted.map(p => (
          <div class="project-item" data-category={p.data.category}>
            <ProjectCard
              slug={p.slug}
              title={p.data.title_es}
              image={p.data.image}
              category={p.data.category}
              categoryLabel={t.projects.categories[p.data.category]}
              lang="es"
            />
          </div>
        ))}
      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
  .filter-btn {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 0.35rem 0.9rem;
    border-radius: 2px;
    background: var(--white);
    transition: all 0.15s;
  }
  .filter-btn:hover,
  .filter-btn.active {
    background: var(--green);
    color: var(--white);
    border-color: var(--green);
  }
  .project-item { display: contents; }
  .project-item[hidden] { display: none; }
</style>

<script>
  const btns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const items = document.querySelectorAll<HTMLElement>('.project-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter!;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.toggleAttribute('hidden', !show);
      });
    });
  });
</script>
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/proyectos/index.astro
git commit -m "feat: add ES proyectos index with category filter"
```

---

## Task 14: ES Proyectos detail page

**Files:**
- Create: `src/pages/proyectos/[slug].astro`

- [ ] **Step 1: Create `src/pages/proyectos/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getLang, getNavLinks } from '../../i18n/utils';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(p => ({ params: { slug: p.slug }, props: { project: p } }));
}

interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const { data } = project;

const t = getLang('es');
const base = import.meta.env.BASE_URL;
const links = getNavLinks('es', base);
const year = data.date.getFullYear();
---
<Base title={`${data.title_es} — P.D.G. Industrial`} lang="es">

  <div class="project-hero">
    <img
      src={`${base}${data.image.replace(/^\//, '')}`}
      alt={data.title_es}
      class="project-hero__img"
    />
  </div>

  <div class="container">
    <div class="project-body">
      <a href={links.projects} class="back-link">{t.projects.back}</a>

      <span class="project-cat">
        {t.projects.categories[data.category]}
      </span>
      <h1>{data.title_es}</h1>
      <p class="project-desc">{data.description_es}</p>

      <dl class="project-meta">
        <div>
          <dt>{t.projects.client_label}</dt>
          <dd>{data.client}</dd>
        </div>
        <div>
          <dt>{t.projects.location_label}</dt>
          <dd>{data.location}</dd>
        </div>
        <div>
          <dt>{t.projects.date_label}</dt>
          <dd>{year}</dd>
        </div>
      </dl>
    </div>
  </div>

</Base>

<style>
  .project-hero { background: var(--green-dark); max-height: 480px; overflow: hidden; }
  .project-hero__img { width: 100%; max-height: 480px; object-fit: cover; opacity: 0.9; }

  .project-body { max-width: 720px; padding: 3rem 0; }

  .back-link {
    display: inline-block;
    font-size: 0.8rem;
    color: var(--green);
    margin-bottom: 1.5rem;
  }
  .back-link:hover { text-decoration: underline; }

  .project-cat {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green);
    background: var(--green-tint);
    padding: 0.2rem 0.6rem;
    border-radius: 2px;
    margin-bottom: 0.75rem;
  }

  h1 { margin-bottom: 1rem; }

  .project-desc {
    font-size: 1rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 60ch;
  }

  .project-meta {
    display: flex;
    gap: 2.5rem;
    flex-wrap: wrap;
    border-top: 1px solid var(--border);
    padding-top: 1.25rem;
  }
  .project-meta dt {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 0.2rem;
  }
  .project-meta dd { font-weight: 600; font-size: 0.9rem; }
</style>
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: 7 project detail pages generated under `dist/pdgindustrial/proyectos/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/proyectos/[slug].astro
git commit -m "feat: add ES project detail page"
```

---

## Task 15: ES Clientes page

**Files:**
- Create: `src/pages/clientes.astro`

- [ ] **Step 1: Create `src/pages/clientes.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { getLang } from '../i18n/utils';

const t = getLang('es');
---
<Base title={t.meta.clients_title} lang="es">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.clients.label}</p>
      <h1>{t.clients.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <ul class="clients-list">
        {t.clients.items.map(c => (
          <li class="client-item">
            <span class="client-dot"></span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .clients-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }
  .client-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--white);
    border: 1px solid var(--border);
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 0.9rem;
  }
  .client-dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    flex-shrink: 0;
  }
</style>
```

- [ ] **Step 2: Run build and commit**

```bash
npm run build
git add src/pages/clientes.astro
git commit -m "feat: add ES clientes page"
```

---

## Task 16: ES Contacto page

**Files:**
- Create: `src/pages/contacto.astro`

- [ ] **Step 1: Create `src/pages/contacto.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { getLang } from '../i18n/utils';

const t = getLang('es');
---
<Base title={t.meta.contact_title} lang="es">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.contact.label}</p>
      <h1>{t.contact.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="contact-layout">

        <div class="contact-info">
          <dl class="contact-dl">
            <div>
              <dt>Teléfono</dt>
              <dd><a href={`tel:+1${t.contact.phone.replace(/\D/g,'')}`}>{t.contact.phone}</a></dd>
            </div>
            <div>
              <dt>Correo electrónico</dt>
              <dd><a href={`mailto:${t.contact.email}`}>{t.contact.email}</a></dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>{t.contact.address}</dd>
            </div>
          </dl>
        </div>

        <div class="contact-form-box">
          <p class="form-note">
            Para contactarnos, envíe un correo directamente a{' '}
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </p>
          <a href={`mailto:${t.contact.email}`} class="btn-primary">{t.contact.cta}</a>
        </div>

      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    max-width: 800px;
  }
  .contact-dl { display: flex; flex-direction: column; gap: 1.5rem; }
  .contact-dl dt {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 0.2rem;
  }
  .contact-dl dd { font-size: 0.95rem; }
  .contact-dl a { color: var(--green); }
  .contact-dl a:hover { text-decoration: underline; }
  .contact-form-box {
    background: var(--green-tint);
    border: 1px solid var(--green-border);
    padding: 2rem;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: flex-start;
  }
  .form-note { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
  .form-note a { color: var(--green); }
  @media (max-width: 640px) {
    .contact-layout { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Run build and commit**

```bash
npm run build
git add src/pages/contacto.astro
git commit -m "feat: add ES contacto page"
```

---

## Task 17: EN pages

**Files:**
- Create: `src/pages/en/index.astro`
- Create: `src/pages/en/services.astro`
- Create: `src/pages/en/projects/index.astro`
- Create: `src/pages/en/projects/[slug].astro`
- Create: `src/pages/en/clients.astro`
- Create: `src/pages/en/contact.astro`

> All EN pages mirror their ES counterparts, passing `lang="en"` and using English strings. Only the differences from the ES versions are shown in the notes — replicate the same full structure.

- [ ] **Step 1: Create `src/pages/en/index.astro`**

Copy `src/pages/index.astro` exactly, then make these changes:
1. Change `getLang('es')` → `getLang('en')`
2. Change `getNavLinks('es', base)` → `getNavLinks('en', base)`
3. Change `lang="es"` → `lang="en"` on `<Base>` and all `<ProjectCard>` instances
4. Change `p.data.title_es` → `p.data.title_en`

Full file:

```astro
---
import Base from '../../layouts/Base.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getLang, getNavLinks } from '../../i18n/utils';
import { getCollection } from 'astro:content';

const t = getLang('en');
const base = import.meta.env.BASE_URL;
const links = getNavLinks('en', base);

const allProjects = await getCollection('projects');
const recent = allProjects
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---
<Base title={t.meta.home_title} description={t.meta.home_description} lang="en">

  <section class="hero">
    <div class="hero__inner container">
      <div class="hero__content">
        <p class="label">{t.hero.tagline}</p>
        <h1>{t.hero.heading}</h1>
        <p class="hero__sub">{t.hero.subheading}</p>
        <div class="hero__ctas">
          <a href={links.projects} class="btn-primary">{t.hero.cta_projects}</a>
          <a href={links.contact} class="btn-outline">{t.hero.cta_contact}</a>
        </div>
      </div>
      <div class="hero__badges">
        <span class="badge">AISC</span>
        <span class="badge">API</span>
        <span class="badge">NSBA</span>
      </div>
    </div>
  </section>

  <section class="section services-strip">
    <div class="container">
      <p class="label">{t.services.label}</p>
      <h2>{t.services.heading}</h2>
      <div class="cards-grid" style="margin-top:1.5rem">
        {t.services.items.map((s, i) => (
          <ServiceCard name={s.name} description={s.description} index={i} />
        ))}
      </div>
    </div>
  </section>

  <section class="section recent-projects" style="background:var(--green-tint)">
    <div class="container">
      <p class="label">{t.projects.label}</p>
      <h2>{t.projects.heading}</h2>
      <div class="cards-grid" style="margin-top:1.5rem">
        {recent.map(p => (
          <ProjectCard
            slug={p.slug}
            title={p.data.title_en}
            image={p.data.image}
            category={p.data.category}
            categoryLabel={t.projects.categories[p.data.category]}
            lang="en"
          />
        ))}
      </div>
      <div style="margin-top:1.5rem">
        <a href={links.projects} class="btn-primary">{t.projects.view_all}</a>
      </div>
    </div>
  </section>

  <section class="section clients-strip">
    <div class="container">
      <p class="label">{t.clients.label}</p>
      <div class="clients-grid">
        {t.clients.items.map(c => <span class="client-chip">{c}</span>)}
      </div>
    </div>
  </section>

</Base>

<style>
  .hero {
    background: linear-gradient(135deg, var(--green-dark) 0%, #2a3828 65%, #3a4f35 100%);
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border: 1px solid rgba(98,146,84,0.15);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    top: -10px; right: -10px;
    width: 200px; height: 200px;
    border: 1px solid rgba(98,146,84,0.1);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero__inner { display: flex; flex-direction: column; gap: 2rem; position: relative; z-index: 1; }
  .hero__content { max-width: 600px; }
  .hero__content .label { color: var(--green-light); }
  .hero__content h1 { color: #fff; margin: 0.5rem 0 1rem; }
  .hero__sub { color: #a8b8a4; font-size: 0.95rem; margin-bottom: 1.75rem; }
  .hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .hero__badges { display: flex; gap: 0.5rem; }
  .badge {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(98,146,84,0.3);
    color: var(--green-light);
    padding: 0.25rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    border-radius: 2px;
  }
  .services-strip h2 { margin-top: 0.25rem; }
  .recent-projects h2 { margin-top: 0.25rem; }
  .clients-strip .label { margin-bottom: 1rem; }
  .clients-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .client-chip {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--green-mid);
    background: var(--white);
    border: 1px solid var(--green-border);
    padding: 0.3rem 0.9rem;
    border-radius: 2px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/en/services.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { getLang } from '../../i18n/utils';

const t = getLang('en');
---
<Base title={t.meta.services_title} lang="en">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.services.label}</p>
      <h1>{t.services.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="cards-grid">
        {t.services.items.map((s, i) => (
          <ServiceCard name={s.name} description={s.description} index={i} />
        ))}
      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
</style>
```

- [ ] **Step 3: Create `src/pages/en/projects/index.astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import ProjectCard from '../../../components/ProjectCard.astro';
import { getLang } from '../../../i18n/utils';
import { getCollection } from 'astro:content';

const t = getLang('en');
const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const categories = Object.entries(t.projects.categories);
---
<Base title={t.meta.projects_title} lang="en">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.projects.label}</p>
      <h1>{t.projects.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="filter-bar">
        <button class="filter-btn active" data-filter="all">{t.projects.filter_all}</button>
        {categories.map(([id, label]) => (
          <button class="filter-btn" data-filter={id}>{label}</button>
        ))}
      </div>
      <div class="projects-grid cards-grid" id="projects-grid">
        {sorted.map(p => (
          <div class="project-item" data-category={p.data.category}>
            <ProjectCard
              slug={p.slug}
              title={p.data.title_en}
              image={p.data.image}
              category={p.data.category}
              categoryLabel={t.projects.categories[p.data.category]}
              lang="en"
            />
          </div>
        ))}
      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
  .filter-btn {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 0.35rem 0.9rem;
    border-radius: 2px;
    background: var(--white);
    transition: all 0.15s;
  }
  .filter-btn:hover,
  .filter-btn.active { background: var(--green); color: var(--white); border-color: var(--green); }
  .project-item { display: contents; }
  .project-item[hidden] { display: none; }
</style>

<script>
  const btns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const items = document.querySelectorAll<HTMLElement>('.project-item');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter!;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        item.toggleAttribute('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });
</script>
```

- [ ] **Step 4: Create `src/pages/en/projects/[slug].astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import { getLang, getNavLinks } from '../../../i18n/utils';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(p => ({ params: { slug: p.slug }, props: { project: p } }));
}

interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const { data } = project;

const t = getLang('en');
const base = import.meta.env.BASE_URL;
const links = getNavLinks('en', base);
const year = data.date.getFullYear();
---
<Base title={`${data.title_en} — P.D.G. Industrial`} lang="en">

  <div class="project-hero">
    <img
      src={`${base}${data.image.replace(/^\//, '')}`}
      alt={data.title_en}
      class="project-hero__img"
    />
  </div>

  <div class="container">
    <div class="project-body">
      <a href={links.projects} class="back-link">{t.projects.back}</a>
      <span class="project-cat">{t.projects.categories[data.category]}</span>
      <h1>{data.title_en}</h1>
      <p class="project-desc">{data.description_en}</p>
      <dl class="project-meta">
        <div>
          <dt>{t.projects.client_label}</dt>
          <dd>{data.client}</dd>
        </div>
        <div>
          <dt>{t.projects.location_label}</dt>
          <dd>{data.location}</dd>
        </div>
        <div>
          <dt>{t.projects.date_label}</dt>
          <dd>{year}</dd>
        </div>
      </dl>
    </div>
  </div>

</Base>

<style>
  .project-hero { background: var(--green-dark); max-height: 480px; overflow: hidden; }
  .project-hero__img { width: 100%; max-height: 480px; object-fit: cover; opacity: 0.9; }
  .project-body { max-width: 720px; padding: 3rem 0; }
  .back-link { display: inline-block; font-size: 0.8rem; color: var(--green); margin-bottom: 1.5rem; }
  .back-link:hover { text-decoration: underline; }
  .project-cat {
    display: inline-block;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--green); background: var(--green-tint);
    padding: 0.2rem 0.6rem; border-radius: 2px; margin-bottom: 0.75rem;
  }
  h1 { margin-bottom: 1rem; }
  .project-desc { font-size: 1rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 60ch; }
  .project-meta {
    display: flex; gap: 2.5rem; flex-wrap: wrap;
    border-top: 1px solid var(--border); padding-top: 1.25rem;
  }
  .project-meta dt { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); margin-bottom: 0.2rem; }
  .project-meta dd { font-weight: 600; font-size: 0.9rem; }
</style>
```

- [ ] **Step 5: Create `src/pages/en/clients.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getLang } from '../../i18n/utils';

const t = getLang('en');
---
<Base title={t.meta.clients_title} lang="en">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.clients.label}</p>
      <h1>{t.clients.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <ul class="clients-list">
        {t.clients.items.map(c => (
          <li class="client-item">
            <span class="client-dot"></span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .clients-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; }
  .client-item {
    display: flex; align-items: center; gap: 0.75rem;
    background: var(--white); border: 1px solid var(--border);
    padding: 1rem 1.25rem; font-weight: 600; font-size: 0.9rem;
  }
  .client-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; flex-shrink: 0; }
</style>
```

- [ ] **Step 6: Create `src/pages/en/contact.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getLang } from '../../i18n/utils';

const t = getLang('en');
---
<Base title={t.meta.contact_title} lang="en">

  <div class="page-header">
    <div class="container">
      <p class="label">{t.contact.label}</p>
      <h1>{t.contact.heading}</h1>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="contact-layout">
        <div class="contact-info">
          <dl class="contact-dl">
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:+1${t.contact.phone.replace(/\D/g,'')}`}>{t.contact.phone}</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${t.contact.email}`}>{t.contact.email}</a></dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{t.contact.address}</dd>
            </div>
          </dl>
        </div>
        <div class="contact-form-box">
          <p class="form-note">
            To get in touch, email us directly at{' '}
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </p>
          <a href={`mailto:${t.contact.email}`} class="btn-primary">{t.contact.cta}</a>
        </div>
      </div>
    </div>
  </section>

</Base>

<style>
  .page-header {
    background: var(--green-tint);
    border-bottom: 1px solid var(--green-border);
    padding: 2.5rem 0;
  }
  .page-header h1 { margin-top: 0.25rem; }
  .contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 800px; }
  .contact-dl { display: flex; flex-direction: column; gap: 1.5rem; }
  .contact-dl dt { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); margin-bottom: 0.2rem; }
  .contact-dl dd { font-size: 0.95rem; }
  .contact-dl a { color: var(--green); }
  .contact-dl a:hover { text-decoration: underline; }
  .contact-form-box {
    background: var(--green-tint); border: 1px solid var(--green-border);
    padding: 2rem; border-radius: 2px;
    display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start;
  }
  .form-note { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
  .form-note a { color: var(--green); }
  @media (max-width: 640px) { .contact-layout { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 7: Run full build to verify all pages**

```bash
npm run build
```

Expected: build succeeds with no errors. Verify `dist/pdgindustrial/en/` directory exists with `index.html`, `services/`, `projects/`, `clients/`, `contact/`.

- [ ] **Step 8: Run type check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/pages/en/
git commit -m "feat: add all EN pages"
```

---

## Task 18: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deploy workflow"
```

---

## Task 19: Final verification and push

- [ ] **Step 1: Run final build**

```bash
npm run build
```

Expected: no errors. `dist/` contains `pdgindustrial/` with all pages.

- [ ] **Step 2: Run type check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Preview locally**

```bash
npm run preview
```

Open `http://localhost:4321/pdgindustrial/` in a browser. Verify:
- Logo loads in nav and footer
- Hero renders with green gradient and CTAs
- Services grid shows all 8 cards
- Proyectos grid shows 7 projects with images
- Filter buttons hide/show projects by category
- A project detail page loads with image, description, and meta
- Footer language toggle navigates to `/pdgindustrial/en/`
- EN pages load correctly with English strings

- [ ] **Step 4: Add GitHub remote and push**

```bash
git remote add origin https://github.com/josedbaez2/pdgindustrial.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Enable GitHub Pages**

In the `josedbaez2/pdgindustrial` repository on GitHub:
1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Save

- [ ] **Step 6: Verify deployment**

After the Actions workflow completes (watch at `https://github.com/josedbaez2/pdgindustrial/actions`), open:

```
https://josedbaez2.github.io/pdgindustrial/
```

Expected: the site loads with logo, hero, services grid, projects, and client strip.
