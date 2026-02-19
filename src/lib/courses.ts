import fs from "fs"
import path from "path"
import type { CourseMetadata, Course, CourseLesson, LessonNavItem } from "@/types/course"

const coursesDirectory = path.join(process.cwd(), "src/content/courses")

function computeCourseFields(metadata: CourseMetadata): Course {
  let totalLessons = 0
  let totalDurationMinutes = 0

  for (const mod of metadata.modules) {
    totalLessons += mod.lessons.length
    for (const lesson of mod.lessons) {
      totalDurationMinutes += lesson.durationMinutes
    }
  }

  return { ...metadata, totalLessons, totalDurationMinutes }
}

export function getAllCourseSlugs(): string[] {
  if (!fs.existsSync(coursesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(coursesDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.replace(/\.json$/, ""))
}

export function getCourseBySlug(slug: string): Course | null {
  try {
    const fullPath = path.join(coursesDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const metadata: CourseMetadata = JSON.parse(fileContents)
    return computeCourseFields(metadata)
  } catch {
    return null
  }
}

export function getAllCourses(): Course[] {
  const slugs = getAllCourseSlugs()
  return slugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is Course => course !== null && course.isPublished)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getAllCoursesIncludingUnpublished(): Course[] {
  const slugs = getAllCourseSlugs()
  return slugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is Course => course !== null)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getCoursesByCategory(category: string): Course[] {
  return getAllCourses().filter((course) => course.category === category)
}

export function getCoursesByDifficulty(difficulty: string): Course[] {
  return getAllCourses().filter((course) => course.difficulty === difficulty)
}

export function getCourseLessons(slug: string): LessonNavItem[] {
  const course = getCourseBySlug(slug)
  if (!course) return []

  const items: LessonNavItem[] = []

  course.modules.forEach((mod, moduleIndex) => {
    mod.lessons.forEach((lesson, lessonIndex) => {
      items.push({
        slug: lesson.slug,
        title: lesson.title,
        type: lesson.type,
        durationMinutes: lesson.durationMinutes,
        moduleTitle: mod.title,
        moduleIndex,
        lessonIndex,
        isPreview: lesson.isPreview,
      })
    })
  })

  return items
}

export function getLesson(courseSlug: string, lessonSlug: string): CourseLesson | null {
  const course = getCourseBySlug(courseSlug)
  if (!course) return null

  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.slug === lessonSlug)
    if (lesson) return lesson
  }

  return null
}

export function getLessonContentPath(courseSlug: string, lessonSlug: string): string {
  return `/courses/${courseSlug}/${lessonSlug}.html`
}

export function getAdjacentLessons(
  courseSlug: string,
  lessonSlug: string
): { prev: LessonNavItem | null; next: LessonNavItem | null } {
  const lessons = getCourseLessons(courseSlug)
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)

  if (currentIndex === -1) return { prev: null, next: null }

  return {
    prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  }
}
