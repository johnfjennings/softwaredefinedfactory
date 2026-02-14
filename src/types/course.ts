export interface CourseLesson {
  slug: string
  title: string
  type: "article" | "slides" | "video"
  durationMinutes: number
  isPreview: boolean
}

export interface CourseModule {
  title: string
  description: string
  lessons: CourseLesson[]
}

export interface CourseMetadata {
  title: string
  slug: string
  description: string
  instructor: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  thumbnail: string
  priceCents: number
  isPublished: boolean
  tags: string[]
  modules: CourseModule[]
}

export interface Course extends CourseMetadata {
  totalLessons: number
  totalDurationMinutes: number
}

export interface LessonNavItem {
  slug: string
  title: string
  type: CourseLesson["type"]
  durationMinutes: number
  moduleTitle: string
  moduleIndex: number
  lessonIndex: number
  isPreview: boolean
}
