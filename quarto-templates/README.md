# Porting a Quarto Course to CourseFoundry Format

This guide explains how to take an existing Quarto course (with `.qmd` files)
and produce self-contained HTML lessons that work with the Software Defined Factory
lesson player and progress tracking system.

## How It Works

```
┌─────────────────────┐      quarto render      ┌──────────────────────┐
│  Your .qmd files    │ ────────────────────────>│  Self-contained HTML │
│  (author locally)   │                          │  (one file per lesson)│
└─────────────────────┘                          └──────────┬───────────┘
                                                            │
                                                     copy to repo
                                                            │
                                                            v
                                            ┌───────────────────────────┐
                                            │  public/courses/{slug}/   │
                                            │  01-lesson-name.html      │
                                            │  02-lesson-name.html      │
                                            └───────────────────────────┘
                                                            │
                                                   + course JSON metadata
                                                            │
                                                            v
                                            ┌───────────────────────────┐
                                            │  src/content/courses/     │
                                            │  your-course.json         │
                                            └───────────────────────────┘
                                                            │
                                                    git push → Vercel
                                                            │
                                                            v
                                                    Live on the site
```

## Prerequisites

- [Quarto](https://quarto.org/) installed (v1.4+)
- Your course content as `.qmd` files

## Step-by-Step Guide

### 1. Set Up Your Authoring Project

Create a folder for your course content anywhere on your machine:

```bash
mkdir ~/courses/my-new-course
cd ~/courses/my-new-course
```

Copy the template files from this directory:

```bash
# For courses with both articles and slides (most common):
cp /path/to/quarto-templates/_quarto-sdf-course.yml ./_quarto.yml
cp /path/to/quarto-templates/sdf-lesson.css ./
cp /path/to/quarto-templates/sdf-slides.css ./
```

Or if your course is all articles or all slides:

```bash
# Articles only:
cp /path/to/quarto-templates/_quarto-sdf-article.yml ./_quarto.yml
cp /path/to/quarto-templates/sdf-lesson.css ./

# Slides only:
cp /path/to/quarto-templates/_quarto-sdf-slides.yml ./_quarto.yml
cp /path/to/quarto-templates/sdf-slides.css ./
```

### 2. Create Your Lesson Files

Each lesson is one `.qmd` file. Name files with the slug you want to use:

**Article lesson** (`01-what-oee-measures.qmd`):

```markdown
---
title: "What OEE Really Measures"
---

OEE (Overall Equipment Effectiveness) is the gold standard metric
for measuring manufacturing productivity.

## The Three OEE Factors

OEE combines three key metrics:

- **Availability** — Is the machine running when scheduled?
- **Performance** — Is it running at full speed?
- **Quality** — Are the parts good?

::: {.callout-tip}
## Quick Rule of Thumb
World-class OEE is 85%. Most plants operate between 40-60%.
:::
```

**Slide lesson** (`02-six-big-losses.qmd`):

```markdown
---
title: "The Six Big Losses"
format:
  revealjs:
    embed-resources: true
    theme: [default, sdf-slides.css]
    chalkboard: true
    menu: true
---

## The Six Big Losses

TPM identifies six categories of productivity loss

## Equipment Failures

- Breakdowns and unplanned stops
- **Impact:** Complete loss of availability
- **Example:** Motor burnout, PLC fault

## Setup and Adjustments

- Changeovers, warm-up, adjustments
- **Impact:** Planned but reducible downtime
- Typically 10-30% of total losses
```

### 3. Porting an Existing Quarto Course

If you already have a Quarto course (like the sample `GADV 06014`), here's how
to convert it:

#### a) Identify your lessons

Map your existing content to the module/lesson structure. Each week in a typical
Quarto course may produce multiple lessons:

| Quarto Source         | SDF Lesson Type | Suggested Slug             |
|-----------------------|-----------------|----------------------------|
| `week01/page.qmd`    | `article`       | `01-introduction`          |
| `week01/slides.qmd`  | `slides`        | `02-intro-slides`          |
| `week01/lab.qmd`     | `article`       | `03-intro-lab`             |
| `week02/page.qmd`    | `article`       | `04-game-design-process`   |
| `week02/slides.qmd`  | `slides`        | `05-design-slides`         |

#### b) Add SDF frontmatter to each `.qmd` file

For article-type lessons, add this frontmatter:

```yaml
---
title: "Your Lesson Title"
format:
  html:
    embed-resources: true
    standalone: true
    minimal: true
    toc: false
    css: sdf-lesson.css
    theme: none
---
```

For slide-type lessons:

```yaml
---
title: "Your Lesson Title"
format:
  revealjs:
    embed-resources: true
    theme: [default, sdf-slides.css]
    chalkboard: true
    menu: true
---
```

#### c) Remove site navigation elements

If your `.qmd` files reference site-level navigation (like `{{< include >}}`
for shared headers/footers, or sidebar links), remove those — the SDF lesson
player provides its own sidebar and navigation.

#### d) Fix image paths

Images should be referenced relative to the `.qmd` file:

```markdown
![Diagram](images/my-diagram.png)
```

With `embed-resources: true`, Quarto will inline the images as base64 data URIs
in the output HTML. No separate image files needed.

#### e) Remove iframes to other content

If your `page.qmd` files embed slides via `<iframe src="slides.html">`, remove
those. In SDF, slides and articles are separate lessons with their own player.

### 4. Render the Lessons

```bash
cd ~/courses/my-new-course
quarto render
```

Output appears in the `_output/` directory (one `.html` file per `.qmd`).

Verify a rendered file by opening it directly in a browser — it should display
as clean content with no Quarto navigation chrome.

### 5. Copy Output to the Project

```bash
# Create the course directory
mkdir -p /path/to/softwaredefinedfactory/public/courses/my-new-course

# Copy all rendered HTML files
cp _output/*.html /path/to/softwaredefinedfactory/public/courses/my-new-course/
```

### 6. Create the Course Metadata JSON

Create `src/content/courses/my-new-course.json`:

```json
{
  "title": "My New Course",
  "slug": "my-new-course",
  "description": "A brief description of what students will learn.",
  "instructor": "John Jennings",
  "difficulty": "beginner",
  "category": "smart-manufacturing",
  "thumbnail": "/images/courses/my-new-course.jpg",
  "priceCents": 0,
  "isPublished": false,
  "tags": ["Tag1", "Tag2"],
  "modules": [
    {
      "title": "Module 1: Getting Started",
      "description": "Introduction to the topic.",
      "lessons": [
        {
          "slug": "01-introduction",
          "title": "Introduction",
          "type": "article",
          "durationMinutes": 15,
          "isPreview": true
        },
        {
          "slug": "02-intro-slides",
          "title": "Key Concepts",
          "type": "slides",
          "durationMinutes": 20,
          "isPreview": false
        }
      ]
    }
  ]
}
```

**Important fields:**

| Field | Description |
|-------|-------------|
| `slug` | Must match the directory name in `public/courses/` |
| `lessons[].slug` | Must match the HTML filename (without `.html`) |
| `lessons[].type` | `"article"` for HTML pages, `"slides"` for RevealJS |
| `isPublished` | Set to `false` while building, `true` when ready |
| `isPreview` | Set to `true` for free preview lessons (no enrollment needed) |
| `priceCents` | `0` for free courses, e.g. `4900` for $49.00 |

### 7. Add a Course Thumbnail

Place a thumbnail image at:

```
public/images/courses/my-new-course.jpg
```

Recommended size: 800x450px (16:9 aspect ratio).

### 8. Deploy

```bash
cd /path/to/softwaredefinedfactory
git add public/courses/my-new-course/
git add src/content/courses/my-new-course.json
git add public/images/courses/my-new-course.jpg
git commit -m "Add My New Course with N lessons"
git push
```

Vercel auto-deploys. Set `isPublished` to `true` when ready to go live.

## Quarto Features That Work in the Lesson Player

| Feature | Article | Slides | Notes |
|---------|---------|--------|-------|
| Headings | Yes | Yes | |
| Lists | Yes | Yes | |
| Bold/italic | Yes | Yes | |
| Images | Yes | Yes | Inlined as base64 |
| Tables | Yes | Yes | |
| Code blocks | Yes | Yes | Syntax highlighting included |
| Callouts (note, tip, important, warning) | Yes | Yes | Styled by SDF CSS |
| Mermaid diagrams | Yes | Yes | |
| Tabsets | Yes | No | |
| Math (LaTeX) | Yes | Yes | MathJax inlined |
| Links | Yes | Yes | Open in iframe context |
| Chalkboard | No | Yes | Draw on slides |
| Speaker notes | No | Yes | Press `S` in slides |
| Slide fragments | No | Yes | Incremental reveal |

## File Size Guidelines

With `embed-resources: true`, files are larger because assets are inlined:

| Content Type | Typical Size | Notes |
|-------------|-------------|-------|
| Article (text only) | 50-150 KB | Very fast to load |
| Article (with images) | 500 KB - 2 MB | Depends on image count/size |
| Slides (text only) | 1-2 MB | RevealJS + plugins inlined |
| Slides (with images) | 2-5 MB | Compress images before rendering |

**Tip:** Optimize images before using them in `.qmd` files. Use JPEG for photos
and PNG for diagrams. Keep images under 200 KB each where possible.

## Troubleshooting

**Quarto chrome (navbar/sidebar) still showing in the output:**
- Ensure `minimal: true` is set in your frontmatter or `_quarto.yml`
- Check that `theme: none` is set (not a Bootstrap theme)
- The `sdf-lesson.css` includes fallback `display: none` rules for Quarto UI

**Slides look different from the preview:**
- The lesson player iframe is ~70vh tall. Design slides for 1280x720.
- Use the fullscreen button in the lesson player for presentations.

**Images not appearing:**
- Verify `embed-resources: true` is set — without it, images reference
  external paths that won't exist in the deployed location.
- Check that image paths in `.qmd` are correct relative to the file.

**File too large (>5 MB):**
- Compress images before adding to `.qmd` files
- Consider hosting large assets (videos) on YouTube and embedding via URL
- For very image-heavy slides, split into two slide decks

## Template Files Reference

| File | Purpose |
|------|---------|
| `_quarto-sdf-article.yml` | Config for article-only courses |
| `_quarto-sdf-slides.yml` | Config for slides-only courses |
| `_quarto-sdf-course.yml` | Config for mixed article + slides courses |
| `sdf-lesson.css` | Article lesson stylesheet (matches SDF brand) |
| `sdf-slides.css` | RevealJS slide theme (matches SDF brand) |
