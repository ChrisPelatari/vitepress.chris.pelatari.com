https://chris.pelatari.com

## step 1: create a new post

```bash
$ yarn post "Why do programmers prefer dark mode? Because light attracts bugs!"
```

The post is created in `blog/posts/YYYY-MM-DD-<slug>.md` and opened in your
editor. Tweak the title/categories/excerpt as needed.

## step 2: edit the front matter and body

```yaml
---
layout: post
title: Why do programmers prefer dark mode? Because light attracts bugs!
date: 2024-09-28
categories: [dad_jokes]
author: chrispelatari
excerpt: A short, hand-written teaser used in feeds and previews.
---
```

```markdown
Credit where it's due, I found this via [this blog post](https://dev.to/lico/handling-404-error-in-spa-deployed-on-github-pages)
...
```

Drafts can live in `blog/drafts/` — `srcExclude` in
[blog/.vitepress/config.mts](blog/.vitepress/config.mts) keeps them out of
the build.

## step 3: ship-check before pushing

```bash
$ yarn ship-check
```

This runs `archive → build → preview` in one shot:

- **`yarn archive`** regenerates `blog/index.md` (Latest Post link + "How
  it's going" feature), `blog/archive.md` (full post list), and
  `blog/posts.json`. CI does **not** run this step — whatever lives in
  those files at push time is what deploys.
- **`yarn build`** produces `blog/.vitepress/dist`, using the PAT in
  `blog/.env.local` so the `/about` contributions widget renders against
  live data (falls back to `blog/contributions.json` if absent).
- **`yarn preview`** serves the built `dist/` on
  http://localhost:8484 — that's what GitHub Pages will see, give or
  take fresh breakout SVGs (CI regenerates them via
  [`cyprieng/github-breakout`](.github/workflows/vite.yml); local
  preview shows the committed snapshots in
  [blog/public/images/](blog/public/images/)).

Use `yarn dev` (port 4242, hot reload) while writing; use `yarn
ship-check` right before committing.

## step 4: commit and push

`git diff` after `yarn ship-check` will show four mutated files at minimum
(`index.md`, `archive.md`, `posts.json`, plus the new post). Review,
commit, push — GHA handles the rest.

## maintenance

- **`yarn pretty`** — format everything with prettier.
- **`yarn version`** — bumps `package.json` to today's date (CI runs this
  too; safe to run locally).
- **Dead-link detection** is currently disabled via `ignoreDeadLinks: true`
  in [blog/.vitepress/config.mts](blog/.vitepress/config.mts). Flip to
  `false` (or an allowlist array) if you want the build to fail on broken
  internal links.
