# Content Authoring Guide

This is the contract for adding or updating content on softwaredefinedfactory.com — written for both humans and automated Claude routines. All content is **file-based in this repo**; publishing = commit + push to `main` (Vercel auto-deploys).

**Before every content commit, run:**

```bash
npm run validate-content
```

If it fails, fix the errors before pushing — a malformed file can break the production build.

## General rules

- **Voice:** practical, evidence-based, written for manufacturing/IT professionals. No hype, no filler. British/Irish spelling is fine ("analysing", "digitisation") — the site mixes both, so match the surrounding content.
- **Scope:** smart manufacturing, Industry 4.0, IIoT, OT/IT convergence, automation, industrial data.
- **Publish flow:** prose content (blog posts, course lessons) goes through a **pull request** for human review. Structured data (conference entries) may be pushed **directly to main** after validation passes.
- Never edit `src/types/database.ts` (auto-generated) or anything under `.next/`.

---

## 1. Blog posts

**Location:** `src/content/blog/<slug>.mdx` — the filename (minus `.mdx`) is the URL slug: `/blog/<slug>`. Use lowercase kebab-case.

**Frontmatter (all required unless noted):**

```yaml
---
title: "Post Title Here"
date: "2026-08-04"            # YYYY-MM-DD, publication date
excerpt: "1-2 sentence summary shown on cards and in SEO description."
author: "Software Defined Factory"
category: "IIoT Trends"       # existing categories preferred; check other posts
tags: ["IIoT", "Edge AI", "Smart Manufacturing"]   # non-empty array
coverImage: "/images/blog/<slug>.jpg"              # optional; file must exist in public/
draft: false                  # optional; true hides the post from the site
---
```

**Body:** MDX with GitHub-flavored markdown (tables supported via remark-gfm). Conventions from existing posts:

- Start with an H1 matching (or close to) the title.
- 800–1,500 words, H2 sections, bullet lists, bold key terms.
- Include a concrete manufacturing use case or worked example where possible.
- Link to related site pages (other posts, `/glossary`, `/tools/oee-calculator`, `/courses`) where natural.

**Hero images:** generated via the Pollinations API. Add an MDX comment right after the frontmatter recording the prompt:

```mdx
{/* hero-image-prompt: photorealistic industrial scene description, editorial technology photography, dark moody atmosphere */}
```

Fetch the image from `https://image.pollinations.ai/prompt/<url-encoded prompt>?width=1200&height=630&nologo=true` and save it to `public/images/blog/<slug>.jpg`. If image generation fails, omit `coverImage` rather than referencing a missing file.

**Note:** contributor-authored posts also exist in the Supabase `posts` table and are merged at render time by `getAllPostsCombined()`. Automated routines should use MDX files only — never write to the database.

---

## 2. Conferences & events

**Location:** `src/content/conferences.json` — a JSON array rendered at `/conferences`. (Types and helpers live in `src/app/conferences/data.ts`; don't edit that file to add events.)

**Entry shape:**

```json
{
  "name": "Hannover Messe 2027",
  "dates": "April 19-23, 2027",
  "location": "Hanover, Germany",
  "region": "Europe",
  "description": "One or two sentences on why this event matters for smart manufacturing audiences.",
  "url": "https://www.hannovermesse.de/en/",
  "tags": ["Automation", "Industry 4.0"],
  "isPast": false
}
```

**Rules:**

- `region` must be exactly one of: `"North America"`, `"Europe"`, `"Asia"`.
- `dates` must contain a **full month name** (e.g. "April") — the page groups events by month via string matching. If dates aren't announced, use e.g. `"October 2026 (Dates TBD)"`.
- `url` must be the event's official site (https).
- `isPast` — set `true` once the event's end date has passed; omit or `false` otherwise.
- Keep the array **ordered chronologically**.
- No duplicate `name` values. Before adding an event, check it isn't already listed under a slightly different name.

**Maintenance routine duties:** flag ended events `isPast: true`; add newly announced smart-manufacturing/IIoT/automation events (verify the official URL actually announces the dates before adding); update `"(Dates TBD)"` entries once dates are confirmed.

---

## 3. Courses

A course is **two parts** — metadata JSON plus static HTML lesson content:

1. **Metadata:** `src/content/courses/<course-slug>.json`
2. **Lesson content:** `public/courses/<course-slug>/<lesson-slug>.html` — one file per lesson, served in the lesson player at `/courses/<course-slug>/learn/<lesson-slug>`.

**Metadata shape** (see `src/types/course.ts` — `CourseMetadata`):

```json
{
  "title": "Course Title",
  "slug": "course-slug",
  "description": "2-3 sentence course description for the catalog card and detail page.",
  "instructor": "John Jennings",
  "difficulty": "beginner",
  "category": "smart-manufacturing",
  "thumbnail": "/images/courses/course-slug.jpg",
  "priceCents": 0,
  "stripePriceId": "price_xxx",
  "isPublished": false,
  "tags": ["Smart Manufacturing", "Beginner"],
  "modules": [
    {
      "title": "Module Title",
      "description": "One sentence on what this module covers.",
      "lessons": [
        {
          "slug": "01-lesson-slug",
          "title": "Lesson Title",
          "type": "article",
          "durationMinutes": 15,
          "isPreview": true
        }
      ]
    }
  ]
}
```

**Rules:**

- `slug` must match the filename; lesson slugs are lowercase kebab-case, unique within the course, and conventionally numbered (`01-`, `02-`, …) in play order.
- `difficulty`: `beginner` | `intermediate` | `advanced`. Lesson `type`: `article` | `slides` | `video`.
- `stripePriceId` is optional and **must be created by a human** in the Stripe dashboard — routines never invent one. Free courses use `priceCents: 0`.
- **Create new courses with `isPublished: false`.** A course only goes live after a human reviews the PR, adds the Stripe price if paid, and flips `isPublished` to `true`. The validator requires every lesson of a *published* course to have its HTML content file in place.
- Make the first 1–2 lessons `isPreview: true` so logged-out visitors can sample the course.
- Lesson HTML files are full standalone documents (Quarto-rendered output is the norm); videos are YouTube Unlisted embeds. Automated routines should default to `article` lessons — `video` lessons require a human to record and upload the video.

**On-demand scaffolding:** to queue a new course for the scaffolder routine, add a brief file to `course-briefs/<course-slug>.md` (template in `course-briefs/README.md`) and run the "SDF Course Scaffolder" routine. It scaffolds every brief without a matching course JSON and opens one PR per course.

---

## Routine cheat-sheet

| Task | Files touched | Publish path |
|---|---|---|
| New blog post | `src/content/blog/<slug>.mdx` + `public/images/blog/<slug>.jpg` | Pull request |
| Update conferences | `src/content/conferences.json` | Direct to `main` |
| New course | `src/content/courses/<slug>.json` + `public/courses/<slug>/*.html` | Pull request, `isPublished: false` |

Always: `npm run validate-content` → commit with a descriptive message (no conventional-commit prefixes) → push.
