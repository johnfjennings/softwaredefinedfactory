/**
 * Content validation for softwaredefinedfactory.com
 *
 * Validates the three file-based content types against the shapes the site
 * actually renders (see CONTENT.md):
 *   - Blog posts:   src/content/blog/*.mdx        (frontmatter)
 *   - Courses:      src/content/courses/*.json    (CourseMetadata shape)
 *   - Conferences:  src/content/conferences.json  (ConferenceEvent shape)
 *
 * Run with: npm run validate-content
 * Exits non-zero if any check fails — run this before every content commit.
 */

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const root = process.cwd()
const errors = []
let checked = 0

function fail(file, message) {
  errors.push(`${file}: ${message}`)
}

// ---------- Blog posts ----------

const blogDir = path.join(root, "src/content/blog")
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

for (const fileName of fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"))) {
  checked++
  const file = `src/content/blog/${fileName}`
  let data
  try {
    ;({ data } = matter(fs.readFileSync(path.join(blogDir, fileName), "utf8")))
  } catch (e) {
    fail(file, `frontmatter failed to parse: ${e.message}`)
    continue
  }

  for (const field of ["title", "date", "excerpt", "author", "category"]) {
    if (typeof data[field] !== "string" || data[field].trim() === "") {
      fail(file, `frontmatter field "${field}" is missing or empty`)
    }
  }
  if (typeof data.date === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    fail(file, `date "${data.date}" must be YYYY-MM-DD`)
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    fail(file, `frontmatter field "tags" must be a non-empty array`)
  }
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(file, `frontmatter field "draft" must be true or false, not a string`)
  }
  if (data.coverImage !== undefined) {
    if (typeof data.coverImage !== "string" || !data.coverImage.startsWith("/")) {
      fail(file, `coverImage must be a root-relative path like /images/blog/x.jpg`)
    } else if (!fs.existsSync(path.join(root, "public", data.coverImage))) {
      fail(file, `coverImage "${data.coverImage}" does not exist under public/`)
    }
  }
}

// ---------- Courses ----------

const coursesDir = path.join(root, "src/content/courses")
const DIFFICULTIES = ["beginner", "intermediate", "advanced"]
const LESSON_TYPES = ["article", "slides", "video"]

for (const fileName of fs.readdirSync(coursesDir).filter((f) => f.endsWith(".json"))) {
  checked++
  const file = `src/content/courses/${fileName}`
  let course
  try {
    course = JSON.parse(fs.readFileSync(path.join(coursesDir, fileName), "utf8"))
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`)
    continue
  }

  const expectedSlug = fileName.replace(/\.json$/, "")
  if (course.slug !== expectedSlug) {
    fail(file, `slug "${course.slug}" must match filename "${expectedSlug}"`)
  }
  for (const field of ["title", "slug", "description", "instructor", "category", "thumbnail"]) {
    if (typeof course[field] !== "string" || course[field].trim() === "") {
      fail(file, `field "${field}" is missing or empty`)
    }
  }
  if (!DIFFICULTIES.includes(course.difficulty)) {
    fail(file, `difficulty "${course.difficulty}" must be one of: ${DIFFICULTIES.join(", ")}`)
  }
  if (!Number.isInteger(course.priceCents) || course.priceCents < 0) {
    fail(file, `priceCents must be a non-negative integer (cents)`)
  }
  if (typeof course.isPublished !== "boolean") {
    fail(file, `isPublished must be true or false`)
  }
  if (!Array.isArray(course.tags) || course.tags.length === 0) {
    fail(file, `tags must be a non-empty array`)
  }
  if (!Array.isArray(course.modules) || course.modules.length === 0) {
    fail(file, `modules must be a non-empty array`)
    continue
  }

  const lessonSlugs = new Set()
  course.modules.forEach((mod, mi) => {
    if (typeof mod.title !== "string" || !mod.title.trim()) {
      fail(file, `modules[${mi}].title is missing`)
    }
    if (typeof mod.description !== "string") {
      fail(file, `modules[${mi}].description is missing`)
    }
    if (!Array.isArray(mod.lessons) || mod.lessons.length === 0) {
      fail(file, `modules[${mi}].lessons must be a non-empty array`)
      return
    }
    mod.lessons.forEach((lesson, li) => {
      const where = `modules[${mi}].lessons[${li}]`
      if (typeof lesson.slug !== "string" || !/^[a-z0-9-]+$/.test(lesson.slug)) {
        fail(file, `${where}.slug must be lowercase kebab-case`)
      } else if (lessonSlugs.has(lesson.slug)) {
        fail(file, `${where}.slug "${lesson.slug}" is duplicated within the course`)
      } else {
        lessonSlugs.add(lesson.slug)
      }
      if (typeof lesson.title !== "string" || !lesson.title.trim()) {
        fail(file, `${where}.title is missing`)
      }
      if (!LESSON_TYPES.includes(lesson.type)) {
        fail(file, `${where}.type "${lesson.type}" must be one of: ${LESSON_TYPES.join(", ")}`)
      }
      if (!Number.isInteger(lesson.durationMinutes) || lesson.durationMinutes <= 0) {
        fail(file, `${where}.durationMinutes must be a positive integer`)
      }
      if (typeof lesson.isPreview !== "boolean") {
        fail(file, `${where}.isPreview must be true or false`)
      }
      // Lesson content is served from public/courses/<courseSlug>/<lessonSlug>.html
      if (course.isPublished) {
        const contentPath = path.join(root, "public/courses", expectedSlug, `${lesson.slug}.html`)
        if (!fs.existsSync(contentPath)) {
          fail(file, `${where}: published course is missing content file public/courses/${expectedSlug}/${lesson.slug}.html`)
        }
      }
    })
  })
}

// ---------- Conferences ----------

const conferencesFile = "src/content/conferences.json"
const REGIONS = ["North America", "Europe", "Asia"]
let events
try {
  events = JSON.parse(fs.readFileSync(path.join(root, conferencesFile), "utf8"))
  if (!Array.isArray(events)) throw new Error("top-level value must be an array")
} catch (e) {
  fail(conferencesFile, `invalid JSON: ${e.message}`)
  events = []
}

const seenNames = new Set()
events.forEach((event, i) => {
  checked++
  const where = `${conferencesFile} [${i}] ${event?.name ?? "(unnamed)"}`
  for (const field of ["name", "dates", "location", "description", "url"]) {
    if (typeof event[field] !== "string" || event[field].trim() === "") {
      fail(where, `field "${field}" is missing or empty`)
    }
  }
  if (typeof event.name === "string") {
    if (seenNames.has(event.name)) fail(where, `duplicate event name`)
    seenNames.add(event.name)
  }
  if (!REGIONS.includes(event.region)) {
    fail(where, `region "${event.region}" must be one of: ${REGIONS.join(", ")}`)
  }
  if (typeof event.dates === "string" && !MONTHS.some((m) => event.dates.includes(m)) && !event.dates.includes("TBD")) {
    fail(where, `dates "${event.dates}" must contain a full month name (used for grouping) or "TBD"`)
  }
  if (typeof event.url === "string" && !/^https?:\/\//.test(event.url)) {
    fail(where, `url must start with http(s)://`)
  }
  if (!Array.isArray(event.tags) || event.tags.length === 0) {
    fail(where, `tags must be a non-empty array`)
  }
  if (event.isPast !== undefined && typeof event.isPast !== "boolean") {
    fail(where, `isPast must be true or false`)
  }
})

// ---------- Report ----------

if (errors.length > 0) {
  console.error(`\nContent validation FAILED (${errors.length} error${errors.length === 1 ? "" : "s"}):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  console.error("")
  process.exit(1)
}

console.log(`Content validation passed (${checked} items checked).`)
