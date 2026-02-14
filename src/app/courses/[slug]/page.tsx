import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EnrollButton } from "@/components/course/enroll-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getAllCourseSlugs,
  getCourseBySlug,
  getCourseLessons,
} from "@/lib/courses"
import { createClient } from "@/lib/supabase/server"
import { COURSE_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  FileText,
  Presentation,
  Video,
  Lock,
  Eye,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return { title: "Course Not Found" }
  }

  return {
    title: `${course.title} | Software Defined Factory`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      type: "website",
    },
  }
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const typeIcons = {
  article: FileText,
  slides: Presentation,
  video: Video,
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = getCourseLessons(slug)
  const firstLesson = lessons[0]

  const categoryLabel =
    COURSE_CATEGORIES.find((c) => c.value === course.category)?.label || course.category
  const difficultyLabel =
    DIFFICULTY_LEVELS.find((d) => d.value === course.difficulty)?.label || course.difficulty

  // Check enrollment status
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isEnrolled = false
  if (user) {
    const { data } = await (supabase as any)
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .maybeSingle()
    isEnrolled = !!data
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Back link */}
          <Link
            href="/courses"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Course header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className={difficultyColors[course.difficulty] || ""}
                  >
                    {difficultyLabel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{categoryLabel}</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  {course.title}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.ceil(course.totalDurationMinutes / 60)}h{" "}
                    {course.totalDurationMinutes % 60}m
                  </span>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Syllabus */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>

                <div className="space-y-6">
                  {course.modules.map((mod, modIndex) => (
                    <div key={modIndex}>
                      <h3 className="text-lg font-semibold mb-1">{mod.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{mod.description}</p>

                      <div className="space-y-1">
                        {mod.lessons.map((lesson) => {
                          const TypeIcon = typeIcons[lesson.type]
                          const isAccessible = lesson.isPreview || isEnrolled

                          return (
                            <div
                              key={lesson.slug}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                            >
                              <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                {isAccessible ? (
                                  <Link
                                    href={`/courses/${slug}/learn/${lesson.slug}`}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                  >
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="text-sm font-medium">{lesson.title}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                                <span>{lesson.durationMinutes} min</span>
                                {lesson.isPreview ? (
                                  <Badge variant="outline" className="text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Preview
                                  </Badge>
                                ) : !isEnrolled ? (
                                  <Lock className="h-3 w-3" />
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar enrollment card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-1">
                      {course.priceCents === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        <span>${(course.priceCents / 100).toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <EnrollButton
                    courseSlug={slug}
                    isEnrolled={isEnrolled}
                    isAuthenticated={!!user}
                    firstLessonSlug={firstLesson?.slug || ""}
                  />

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{course.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {Math.ceil(course.totalDurationMinutes / 60)}h{" "}
                        {course.totalDurationMinutes % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-medium">{difficultyLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                  </div>

                  {course.tags.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex flex-wrap gap-1">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
