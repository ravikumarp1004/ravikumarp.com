# Ravi Kumar P — Portfolio

[![Live](https://img.shields.io/badge/live-ravikumarp.com-20b2a6?style=flat-square)](https://ravikumarp.com)
[![Contact](https://img.shields.io/badge/contact-form.ravikumarp.com-20b2a6?style=flat-square)](https://form.ravikumarp.com)
[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Stack](https://img.shields.io/badge/stack-React%2019%20%C2%B7%20TanStack%20Start%20%C2%B7%20Vite%207-20b2a6?style=flat-square)](#tech-stack)

My personal portfolio — a fast, SSR-rendered React site that doubles as a working sandbox for the things I actually do day-to-day: OpenText Exstream / CCM, multi-cloud operations, and a bit of AI automation on the side.

**Live:** [ravikumarp.com](https://ravikumarp.com) · **Contact form:** [form.ravikumarp.com](https://form.ravikumarp.com)

---

## Table of Contents

- [About the site](#about-the-site)
- [What's inside](#whats-inside)
- [Tech stack](#tech-stack)
- [Architecture notes](#architecture-notes)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
  - [Site — Cloudflare Workers](#site--cloudflare-workers)
  - [Custom domain — ravikumarp.com](#custom-domain--ravikumarpcom)
  - [Contact form proxy — form.ravikumarp.com](#contact-form-proxy--formravikumarpcom)
- [Editing content](#editing-content)
- [Performance & SEO](#performance--seo)
- [Contact](#contact)
- [License](#license)

---

## About the site

I'm **Ravi Kumar P**, a Cloud Application Engineer based in Bengaluru, working primarily on **OpenText Exstream** in both server-based and cloud-native deployments across AWS, Azure, and GCP. This site is where I keep my work in one place — experience, projects, certifications, and the easiest way to reach me.

A few things were intentional:

- **It had to feel fast.** SSR on the edge, no heavy frameworks bolted on, no animation library that takes 200 KB to fade in a heading.
- **Content lives in plain TypeScript files**, not a CMS. Editing is a one-line change in `src/data/*.ts`.
- **Two contact paths.** A traditional form (reverse-proxied through Cloudflare so the URL stays clean) and an n8n-powered RAG chatbot that can actually answer questions about my background.

## What's inside

- **SSR with TanStack Start** — file-based routing, edge rendering, sub-100 ms TTFB
- **Dark, muted-teal theme** — glassmorphism accents, restrained motion, full reduced-motion support
- **AI chatbot widget** — n8n + RAG over a Pinecone vector DB, answers visitor questions about my profile in real time
- **Reverse-proxied contact form** — `form.ravikumarp.com` served by a small Cloudflare Worker so the n8n origin is never exposed in the address bar
- **Verified credentials** — Credly-linked certification badges with PDF copies bundled under `public/documents/`
- **Downloadable CV** — kept current at `public/Ravi-Kumar-CV.pdf`
- **Fully responsive** — mobile, tablet, desktop, ultrawide
- **Accessible** — semantic HTML, keyboard-navigable, focus states on every interactive element

## Tech stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Framework        | React 19, TanStack Start, TanStack Router, TanStack Query   |
| Build tool       | Vite 7                                                      |
| Language         | TypeScript + JSX                                            |
| Styling          | Tailwind CSS v4, tw-animate-css                             |
| UI primitives    | shadcn/ui, Radix UI, Lucide Icons                           |
| Forms            | React Hook Form, Zod                                        |
| Email            | EmailJS (`@emailjs/browser`)                                |
| AI / Automation  | n8n, RAG, Pinecone, LLM orchestration, Airtable             |
| Edge / Proxy     | Cloudflare Workers (site SSR + dedicated `form-proxy`)      |
| Tooling          | ESLint, Prettier, Bun                                       |

## Architecture notes

```text
Visitor ──▶ ravikumarp.com  ──▶ Cloudflare Worker (SSR)  ──▶ React 19 app
                                                             │
                                                             ├── ChatbotWidget ──▶ n8n webhook ──▶ RAG / Pinecone / LLM
                                                             │
                                                             └── "Get in Touch"  ──▶ form.ravikumarp.com
                                                                                       │
                                                                                       ▼
                                                                          Cloudflare Worker (form-proxy)
                                                                                       │
                                                                                       ▼
                                                                          n8n form (origin hidden)
```

The site itself is a single SSR Worker. The contact form runs on a **separate** Worker (`form-proxy`) whose only job is to reverse-proxy an n8n form endpoint while keeping the public URL as `https://form.ravikumarp.com`. Keeping it in its own Worker means the portfolio repo never needs to know about the n8n origin or rotate when that origin changes.

## Project structure

```text
portfolio-site/
├── public/
│   ├── favicon.svg
│   ├── hero-bg.jpg
│   ├── profile-photo.jpg
│   ├── Ravi-Kumar-CV.pdf
│   ├── projects/                # project card images
│   └── documents/               # certification PDFs
├── scripts/                     # CV generation script
├── src/
│   ├── assets/badges/           # imported certification badge PNGs
│   ├── components/              # Button, AnimatedBorderButton, ChatbotWidget, Logo
│   │   └── ui/                  # shadcn/ui primitives
│   ├── data/                    # ★ content source of truth
│   │   ├── profile.ts           # name, title, bio, skills, CV path
│   │   ├── projects.ts          # featured projects
│   │   ├── experience.ts        # work history
│   │   ├── education.ts
│   │   ├── certifications.ts
│   │   ├── contact.ts           # email, location, availability
│   │   └── social.ts            # LinkedIn, GitHub, email
│   ├── hooks/
│   ├── layout/                  # Navbar, Footer
│   ├── sections/                # Hero, About, Projects, Experience,
│   │                            # Education, Certifications, Contact
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   └── index.tsx            # homepage
│   ├── lib/utils.ts
│   └── styles.css               # Tailwind v4 + design tokens
├── SITE_CONTENT_GUIDE.md        # "I want to change X → open this file"
├── wrangler.jsonc               # Cloudflare Workers deployment config
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Local development

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

### Setup

```bash
git clone https://github.com/ravikumarp1004/portfolio-site.git
cd portfolio-site

bun install
cp .env.example .env       # then fill in EmailJS credentials
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `bun run dev`       | Start the dev server                 |
| `bun run build`     | Production build                     |
| `bun run build:dev` | Build in development mode            |
| `bun run preview`   | Preview the production build locally |
| `bun run lint`      | Run ESLint                           |
| `bun run format`    | Format with Prettier                 |

## Environment variables

All secrets live in `.env` (never commit this file). See `.env.example` for the full list.

| Variable                    | Description                          |
| --------------------------- | ------------------------------------ |
| `VITE_EMAILJS_SERVICE_ID`   | EmailJS service ID                   |
| `VITE_EMAILJS_TEMPLATE_ID`  | EmailJS template ID                  |
| `VITE_EMAILJS_PUBLIC_KEY`   | EmailJS publishable key              |

> `VITE_*` variables are bundled into the client. Only put values that are safe to expose publicly — EmailJS publishable keys are designed for this.

## Deployment

### Site — Cloudflare Workers

```bash
bunx wrangler login
bun run build
bunx wrangler deploy
```

Push the production secrets once:

```bash
bunx wrangler secret put VITE_EMAILJS_SERVICE_ID
bunx wrangler secret put VITE_EMAILJS_TEMPLATE_ID
bunx wrangler secret put VITE_EMAILJS_PUBLIC_KEY
```

### Custom domain — ravikumarp.com

1. **Cloudflare dashboard → Workers & Pages → portfolio worker → Settings → Triggers → Custom Domains**
2. Add `ravikumarp.com` and `www.ravikumarp.com`
3. Cloudflare provisions SSL automatically

### Contact form proxy — form.ravikumarp.com

The "Get in Touch" button points to `https://form.ravikumarp.com`, which is **not** served by this repo. A dedicated Cloudflare Worker (`form-proxy`) reverse-proxies an n8n form so the browser address bar stays on `form.ravikumarp.com`.

Worker configuration:

```text
TARGET_ORIGIN = https://n8n-w19c.srv1635273.hstgr.cloud
TARGET_PATH   = /form/4125de9c-ec4b-43d0-8a0c-c8a60921b494
PUBLIC_ORIGIN = https://form.ravikumarp.com
```

Cloudflare dashboard checklist (one-time setup):

1. **Workers & Pages → form-proxy → Custom Domains** — add `form.ravikumarp.com`
2. **Rules → Redirect Rules** — make sure **no** rule matches `form.ravikumarp.com`. Redirect Rules run before Workers and will flip the URL bar back to the n8n origin.
3. **DNS → Records** — only one record for the `form` subdomain, proxied (orange cloud).

If anything ever looks off, test in an **incognito window** first — old redirects cache hard.

## Editing content

All visible site copy lives in `src/data/*.ts`. For a complete map of "I want to change X → open this file" (sections, components, images, design tokens, routing, SEO), see [`SITE_CONTENT_GUIDE.md`](./SITE_CONTENT_GUIDE.md).

Quick examples:

- Update bio, title, or skills → `src/data/profile.ts`
- Add a project → `src/data/projects.ts` (image goes in `public/projects/`)
- Add a certification → `src/data/certifications.ts` (badge PNG in `src/assets/badges/`, PDF in `public/documents/`)
- Replace the CV → drop a new file at `public/Ravi-Kumar-CV.pdf`

## Performance & SEO

- Edge-rendered SSR for sub-100 ms TTFB worldwide
- Code-splitting and lazy hydration via TanStack Router
- Optimized assets and modern image formats
- Semantic HTML with descriptive `<title>` and meta tags per route
- Accessible interactions, keyboard navigation, reduced-motion support
- RAG chatbot reduces friction for visitors who'd rather ask than read

## Contact

**Ravi Kumar P** — Cloud Application Engineer · Exstream / CCM · AWS · Azure · GCP

- Email: [ravikumar.p1004@gmail.com](mailto:ravikumar.p1004@gmail.com)
- Contact form: [form.ravikumarp.com](https://form.ravikumarp.com)
- LinkedIn: [linkedin.com/in/ravi-kumar-p1004](https://linkedin.com/in/ravi-kumar-p1004)
- GitHub: [github.com/ravikumarp1004](https://github.com/ravikumarp1004)
- Location: Bengaluru, India
- Site: [ravikumarp.com](https://ravikumarp.com)

## License

Personal portfolio © Ravi Kumar P. All rights reserved.
