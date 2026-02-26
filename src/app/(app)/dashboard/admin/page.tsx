import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllCoursesIncludingUnpublished } from "@/lib/courses"
import { DIFFICULTY_LEVELS } from "@/lib/constants"
import { AdminTabs } from "./components/admin-tabs"
import { UserRoleSelect } from "./components/user-role-select"
import { SubscriberExportButton } from "./components/subscriber-export-button"
import { ContentReviewTabs } from "./components/content-review-tabs"
import { Users, BookOpen, DollarSign, Mail, Wrench, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  // Auth & role check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/dashboard")

  // Fetch all data in parallel via service role
  const [
    { data: allProfiles },
    { data: allEnrollments },
    { data: allPayments },
    { data: allSubscribers },
    { data: toolUsageRaw },
    { data: pendingPosts },
    { data: pendingCompanies },
    { data: pendingPeople },
    { data: pendingProducts },
    { data: pendingConferences },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("course_enrollments")
      .select("user_id, course_slug, enrolled_at"),
    supabaseAdmin
      .from("payments")
      .select("id, user_id, amount_cents, status, course_slug, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("subscribers")
      .select("id, email, full_name, status, source, subscribed_at")
      .order("subscribed_at", { ascending: false }),
    supabaseAdmin.from("tool_usage").select("tool_name, created_at"),
    supabaseAdmin
      .from("posts")
      .select("id, title, slug, post_type, created_at, author_id")
      .eq("status", "pending_review")
      .order("created_at"),
    supabaseAdmin
      .from("company_profiles")
      .select("id, name, slug, created_at, submitted_by")
      .eq("status", "pending_review")
      .order("created_at"),
    supabaseAdmin
      .from("person_profiles")
      .select("id, full_name, slug, created_at, submitted_by")
      .eq("status", "pending_review")
      .order("created_at"),
    supabaseAdmin
      .from("product_profiles")
      .select("id, name, slug, created_at, submitted_by")
      .eq("status", "pending_review")
      .order("created_at"),
    supabaseAdmin
      .from("conference_proposals")
      .select("id, name, dates, location, created_at, submitted_by")
      .eq("status", "pending_review")
      .order("created_at"),
  ])

  const allCourses = getAllCoursesIncludingUnpublished()

  // --- Derived KPIs ---
  const totalUsers = allProfiles?.length ?? 0
  const totalEnrollments = allEnrollments?.length ?? 0
  const activeSubscribers =
    allSubscribers?.filter((s: any) => s.status === "active").length ?? 0
  const totalSubscribers = allSubscribers?.length ?? 0
  const unsubscribeRate =
    totalSubscribers > 0
      ? Math.round(((totalSubscribers - activeSubscribers) / totalSubscribers) * 100)
      : 0

  const succeededPayments = allPayments?.filter((p: any) => p.status === "succeeded") ?? []
  const totalRevenueCents = succeededPayments.reduce(
    (sum: number, p: any) => sum + p.amount_cents,
    0
  )
  const totalRevenue = (totalRevenueCents / 100).toFixed(2)

  // Signups in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const recentSignups =
    allProfiles?.filter((p: any) => p.created_at > thirtyDaysAgo).length ?? 0

  // Enrollments per course
  const enrollmentsBySlug: Record<string, number> = {}
  for (const e of allEnrollments ?? []) {
    const enrollment = e as any
    enrollmentsBySlug[enrollment.course_slug] =
      (enrollmentsBySlug[enrollment.course_slug] || 0) + 1
  }

  // Tool usage counts
  const toolCounts: Record<string, number> = {}
  for (const t of toolUsageRaw ?? []) {
    const tool = t as any
    toolCounts[tool.tool_name] = (toolCounts[tool.tool_name] || 0) + 1
  }
  const toolUsageSorted = Object.entries(toolCounts).sort(([, a], [, b]) => b - a)
  const totalToolUses = toolUsageSorted.reduce((sum, [, count]) => sum + count, 0)

  // Revenue by course
  const revenueByCourse: Record<string, number> = {}
  for (const p of succeededPayments) {
    const payment = p as any
    if (payment.course_slug) {
      revenueByCourse[payment.course_slug] =
        (revenueByCourse[payment.course_slug] || 0) + payment.amount_cents
    }
  }

  // Profile lookup for payments table and content review
  const profileMap = new Map(
    (allProfiles ?? []).map((p: any) => [p.id, p.email])
  )

  // Enrich pending content with submitter emails
  const enrichedPendingPosts = (pendingPosts ?? []).map((p: any) => ({
    ...p,
    author_email: profileMap.get(p.author_id) ?? undefined,
  }))
  const enrichedPendingCompanies = (pendingCompanies ?? []).map((c: any) => ({
    ...c,
    submitter_email: profileMap.get(c.submitted_by) ?? undefined,
  }))
  const enrichedPendingPeople = (pendingPeople ?? []).map((p: any) => ({
    ...p,
    submitter_email: profileMap.get(p.submitted_by) ?? undefined,
  }))
  const enrichedPendingProducts = (pendingProducts ?? []).map((p: any) => ({
    ...p,
    submitter_email: profileMap.get(p.submitted_by) ?? undefined,
  }))
  const enrichedPendingConferences = (pendingConferences ?? []).map((c: any) => ({
    ...c,
    submitter_email: profileMap.get(c.submitted_by) ?? undefined,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Platform overview and management
            </p>
          </div>

          <AdminTabs
            overview={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      +{recentSignups} in last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalEnrollments}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {allCourses.length} courses
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue}</div>
                    <p className="text-xs text-muted-foreground">
                      {succeededPayments.length} payments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeSubscribers}</div>
                    <p className="text-xs text-muted-foreground">
                      {unsubscribeRate}% unsubscribe rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allCourses.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {allCourses.filter((c) => c.isPublished).length} published
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tool Uses</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalToolUses}</div>
                    <p className="text-xs text-muted-foreground">
                      {toolUsageSorted.length} tools tracked
                    </p>
                  </CardContent>
                </Card>
              </div>
            }
            users={
              <Card>
                <CardHeader>
                  <CardTitle>All Users ({totalUsers})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(allProfiles ?? []).map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.email}</TableCell>
                          <TableCell>{p.full_name ?? "—"}</TableCell>
                          <TableCell>
                            <UserRoleSelect
                              userId={p.id}
                              currentRole={p.role ?? "user"}
                              currentUserId={user.id}
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            }
            courses={
              <Card>
                <CardHeader>
                  <CardTitle>All Courses ({allCourses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allCourses.map((course) => {
                        const difficultyLabel =
                          DIFFICULTY_LEVELS.find((d) => d.value === course.difficulty)
                            ?.label ?? course.difficulty

                        return (
                          <TableRow key={course.slug}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{difficultyLabel}</TableCell>
                            <TableCell>{course.totalLessons}</TableCell>
                            <TableCell>{enrollmentsBySlug[course.slug] ?? 0}</TableCell>
                            <TableCell>
                              <Badge
                                variant={course.isPublished ? "default" : "secondary"}
                              >
                                {course.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            }
            subscribers={
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{activeSubscribers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{totalSubscribers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unsubscribe Rate</p>
                      <p className="text-2xl font-bold">{unsubscribeRate}%</p>
                    </div>
                  </div>
                  <SubscriberExportButton
                    subscribers={(allSubscribers ?? []).map((s: any) => ({
                      email: s.email,
                      full_name: s.full_name,
                      status: s.status,
                      source: s.source,
                      subscribed_at: s.subscribed_at,
                    }))}
                  />
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Subscribed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(allSubscribers ?? []).map((s: any) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.email}</TableCell>
                            <TableCell>{s.full_name ?? "—"}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  s.status === "active" ? "default" : "secondary"
                                }
                              >
                                {s.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {s.source ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(s.subscribed_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            }
            payments={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalRevenue}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Successful Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {succeededPayments.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Failed/Pending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(allPayments?.length ?? 0) - succeededPayments.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {Object.keys(revenueByCourse).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(revenueByCourse)
                            .sort(([, a], [, b]) => b - a)
                            .map(([slug, cents]) => (
                              <TableRow key={slug}>
                                <TableCell className="font-medium">{slug}</TableCell>
                                <TableCell className="text-right">
                                  ${(cents / 100).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>All Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(allPayments ?? []).map((p: any) => (
                          <TableRow key={p.id}>
                            <TableCell className="text-muted-foreground">
                              {new Date(p.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {profileMap.get(p.user_id) ?? "Unknown"}
                            </TableCell>
                            <TableCell>{p.course_slug ?? "—"}</TableCell>
                            <TableCell>
                              ${(p.amount_cents / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  p.status === "succeeded"
                                    ? "default"
                                    : p.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            }
            toolUsage={
              <Card>
                <CardHeader>
                  <CardTitle>Tool Usage ({totalToolUses} total uses)</CardTitle>
                </CardHeader>
                <CardContent>
                  {toolUsageSorted.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tool</TableHead>
                          <TableHead className="text-right">Uses</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolUsageSorted.map(([name, count]) => (
                          <TableRow key={name}>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell className="text-right">{count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No tool usage data recorded yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            }
            contentReview={
              <ContentReviewTabs
                pendingPosts={enrichedPendingPosts}
                pendingCompanies={enrichedPendingCompanies}
                pendingPeople={enrichedPendingPeople}
                pendingProducts={enrichedPendingProducts}
                pendingConferences={enrichedPendingConferences}
              />
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
