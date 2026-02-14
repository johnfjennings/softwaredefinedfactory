import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllCourses, getCourseLessons } from "@/lib/courses"
import { DIFFICULTY_LEVELS } from "@/lib/constants"
import { Users, BookOpen, GraduationCap, FileText } from "lucide-react"
import Link from "next/link"

export default async function CreatorDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Check instructor role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const allCourses = getAllCourses()

  // Fetch enrollment counts
  const { data: allEnrollments } = await (supabase as any)
    .from("course_enrollments")
    .select("course_slug")

  const enrollmentsBySlug: Record<string, number> = {}
  for (const enrollment of allEnrollments || []) {
    enrollmentsBySlug[enrollment.course_slug] =
      (enrollmentsBySlug[enrollment.course_slug] || 0) + 1
  }

  const totalEnrollments = allEnrollments?.length || 0

  const coursesWithStats = allCourses.map((course) => ({
    ...course,
    enrollmentCount: enrollmentsBySlug[course.slug] || 0,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Creator Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Manage your courses and track student engagement
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allCourses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEnrollments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allCourses.reduce((sum, c) => sum + c.totalLessons, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>All published courses and their enrollment stats</CardDescription>
            </CardHeader>
            <CardContent>
              {coursesWithStats.length > 0 ? (
                <div className="space-y-4">
                  {coursesWithStats.map((course) => {
                    const difficultyLabel =
                      DIFFICULTY_LEVELS.find((d) => d.value === course.difficulty)?.label ||
                      course.difficulty

                    return (
                      <div key={course.slug} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/courses/${course.slug}`}
                              className="text-lg font-semibold hover:text-primary transition-colors"
                            >
                              {course.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{difficultyLabel}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {course.totalLessons} lessons
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1 text-lg font-semibold">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {course.enrollmentCount}
                            </div>
                            <span className="text-xs text-muted-foreground">enrollments</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Create your first course by adding a JSON metadata file to{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      src/content/courses/
                    </code>{" "}
                    and rendering your Quarto content to{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">public/courses/</code>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creating a Course Guide */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Create a Course</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">1. Create course metadata</strong> — Add a
                  JSON file to <code className="bg-muted px-1 py-0.5 rounded">src/content/courses/your-course-slug.json</code> defining the
                  title, modules, and lessons.
                </li>
                <li>
                  <strong className="text-foreground">2. Author content in Quarto</strong> — Write
                  your lessons as .qmd files using Quarto markdown.
                </li>
                <li>
                  <strong className="text-foreground">3. Render to HTML/RevealJS</strong> — Run{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">quarto render</code> with{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">embed-resources: true</code> to
                  create self-contained files.
                </li>
                <li>
                  <strong className="text-foreground">4. Commit rendered files</strong> — Place the
                  HTML output in{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    public/courses/your-course-slug/
                  </code>{" "}
                  and commit to the repo.
                </li>
                <li>
                  <strong className="text-foreground">5. Deploy</strong> — Push to GitHub and Vercel
                  will auto-deploy your new course.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
