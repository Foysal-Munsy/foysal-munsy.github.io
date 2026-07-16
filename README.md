# Foysal Munsy — Portfolio

A personal portfolio built with [Astro](https://astro.build): a single-page
resume-style homepage plus dedicated pages for projects, research, and a blog.
Content is authored in Markdown/MDX; the site is fully static and deploys to
GitHub Pages.

## Design

- Minimal black & white theme, no accent color, easy on the eyes.
- Geist for body/headings, Geist Mono for meta labels.
- Lucide icons (via `astro-icon`) in the floating dock and competitive-programming rows.
- Subtle staggered fade-in on load; respects `prefers-reduced-motion`.
- Dark/light theme with `localStorage` persistence and no flash on load.
- A floating "dock" nav at the bottom links Home, Projects, Research, Blog, and socials.

## Stack

- **Astro** — static site generator
- **MDX / Markdown** — content
- **Tailwind CSS** — styling helpers + theme tokens

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Other scripts:

```bash
pnpm build      # production build to dist/
pnpm preview    # preview the production build locally
```

## Editing your info

All the resume-style content on the homepage (name, tagline, about, work,
education, skills, competitive programming, social links) lives in one file:

```
src/data/resume.ts
```

Edit that file to update your details — no markup changes needed.

Company and school logos live in `public/logos/` and are referenced from
`src/data/resume.ts` (the `logo` field on each work/education entry). To swap a
logo, drop a new image in that folder and update the path; set `logo` to `null`
to fall back to a monogram.

## Adding content

There are three content collections, each with its own folder under
`src/content/` and its own list page. Schemas are defined in
`src/content.config.ts`.

### Projects (`src/content/projects/`)

The filename becomes the URL slug.

- **Full case study:** write a `.mdx` file with a body. It gets its own detail
  page at `/projects/<slug>` and a "Read case study" link.
- **External-only project:** write a `.md` file with just frontmatter (no body)
  and a `repo` URL. It shows on the list page and links out to the repo.
- Set `featured: true` to also surface it on the homepage highlights.

```md
---
title: "My Project"
summary: "One-line description."
role: "Your role"
timeframe: "2025"
tech: ["TypeScript", "Postgres"]
repo: "https://github.com/you/project"   # optional
liveUrl: "https://example.com"            # optional
order: 2                                   # lower shows first
featured: false                            # show on homepage highlights
draft: false
---
```

### Research (`src/content/research/`)

Same idea: a citation-only entry (frontmatter with `doi`/`link`, no body) stays
on the list page; an entry with a body gets a `/research/<slug>` write-up page.

```md
---
title: "Paper title"
summary: "One-line description."
venue: "Journal or Thesis"
year: "2025"
tags: ["YOLOv9", "Computer Vision"]
doi: "https://doi.org/..."     # optional
link: "https://..."            # optional report link
order: 1
featured: true
draft: false
---
```

### Blog (`src/content/blog/`)

```md
---
title: "Post title"
summary: "One-line description."
publishDate: 2026-01-01
tags: ["meta"]
draft: false
---

Write your post here...
```

## Project structure

```
src/
├── components/     Hero, Dock, Section, PageHeader, ListRow, TextListItem, TechBadge
├── content/
│   ├── projects/       project case studies + external-only entries
│   ├── research/       publications
│   └── blog/           posts
├── data/resume.ts      single source of truth for homepage info
├── layouts/        BaseLayout (shell + dock), CaseStudyLayout (project article)
├── pages/
│   ├── index.astro                 homepage portfolio
│   ├── projects/index.astro        projects list
│   ├── projects/[...slug].astro    project case-study route
│   ├── research/index.astro        research list
│   ├── research/[...slug].astro    research write-up route
│   ├── blog/index.astro            blog list
│   └── blog/[...slug].astro        blog post route
├── styles/global.css       Tailwind + theme CSS variables
└── content.config.ts       content collection schemas (Zod)
```

## Deploying to GitHub Pages

This repo is set up as a GitHub **user site**, served from the root at
`https://foysal-munsy.github.io/`. `astro.config.mjs` already has
`site: "https://foysal-munsy.github.io"` and `base: "/"`, and
`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

First-time setup:

1. Create a GitHub repo named exactly `foysal-munsy.github.io` (empty, no
   README).
2. Point this local repo at it and push:
   ```bash
   git remote add origin https://github.com/Foysal-Munsy/foysal-munsy.github.io.git
   git push -u origin main
   ```
3. In the repo settings, set **Pages → Build and deployment → Source** to
   **GitHub Actions**.
4. The workflow runs automatically; the site goes live at
   `https://foysal-munsy.github.io/` within a couple of minutes.

Renaming to a project repo later? Change `base` to `"/<repo>"` in
`astro.config.mjs` and update `site` accordingly.
