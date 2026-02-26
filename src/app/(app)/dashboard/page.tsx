import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, Wrench, TrendingUp, Settings, Play, PenSquare } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import { getCourseBySlug, getCourseLessons } from "@/lib/courses"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userName = profile?.full_name || user.email?.split("@")[0] || "there"

  // Fetch enrollments
  const { data: enrollments } = await (supabase as any)
    .from("course_enrollments")
    .select("course_slug, enrolled_at")
    .eq("user_id", user.id)

  const enrollmentCount = enrollments?.length || 0

  // Fetch progress for all enrolled courses
  const { data: allProgress } = await (supabase as any)
    .from("course_lesson_progress")
    .select("course_slug, lesson_slug")
    .eq("user_id", user.id)
    .eq("completed", true)

  // Build enrolled courses with progress
  const enrolledCourses = (enrollments || []).map((enrollment: any) => {
    const course = getCourseBySlug(enrollment.course_slug)
    const courseLessons = getCourseLessons(enrollment.course_slug)
    const completedCount = (allProgress || []).filter(
      (p: any) => p.course_slug === enrollment.course_slug
    ).length
    const totalCount = courseLessons.length
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return {
      slug: enrollment.course_slug,
      title: course?.title || enrollment.course_slug,
      enrolledAt: enrollment.enrolled_at,
      completedCount,
      totalCount,
      progressPercent,
    }
  })

  // Overall progress
  const totalLessonsAll = enrolledCourses.reduce((sum: number, c: any) => sum + c.totalCount, 0)
  const completedLessonsAll = enrolledCourses.reduce(
    (sum: number, c: any) => sum + c.completedCount,
    0
  )
  const overallProgress =
    totalLessonsAll > 0 ? Math.round((completedLessonsAll / totalLessonsAll) * 100) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s what&apos;s happening with your learning journey
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrollmentCount}</div>
                <p className="text-xs text-muted-foreground">
                  {enrollmentCount === 0 ? "Start learning today" : "Keep it up!"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedLessonsAll}</div>
                <p className="text-xs text-muted-foreground">
                  of {totalLessonsAll} total lessons
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <Progress value={overallProgress} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Contributor / Instructor / Admin quick links */}
          {(profile?.role === "contributor" ||
            profile?.role === "instructor" ||
            profile?.role === "admin") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {(profile?.role === "contributor" ||
                profile?.role === "instructor" ||
                profile?.role === "admin") && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenSquare className="h-5 w-5" />
                      Content Contributions
                    </CardTitle>
                    <CardDescription>
                      Submit articles, company profiles, events and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/contributor">Contributor Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              {(profile?.role === "instructor" || profile?.role === "admin") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Manage courses and track enrollments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/creator">Creator Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Quick Actions + Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Begin your smart manufacturing journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/courses">Browse All Courses</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog">Read Latest Articles</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/tools">Try Free Tools</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account created:</span>
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                  <LogoutButton />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you&apos;re currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course: any) => (
                    <div
                      key={course.slug}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {course.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={course.progressPercent} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {course.completedCount}/{course.totalCount} lessons
                          </span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/courses/${course.slug}/learn`}>
                          <Play className="mr-1 h-3 w-3" />
                          Continue
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Start learning about smart manufacturing, IIoT, and Industry 4.0 by enrolling
                    in your first course.
                  </p>
                  <Button asChild>
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
