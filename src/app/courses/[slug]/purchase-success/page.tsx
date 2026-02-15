import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourseBySlug, getCourseLessons } from "@/lib/courses"
import { CheckCircle2, Play, ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PurchaseSuccessPage({ params }: PageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = getCourseLessons(slug)
  const firstLesson = lessons[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-24">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-2">Purchase Successful!</h1>
                  <p className="text-muted-foreground">
                    You now have full access to <strong>{course.title}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted text-sm">
                  <p className="text-muted-foreground">
                    A confirmation email has been sent to your account email address.
                    You can access this course anytime from your dashboard.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" asChild>
                    <Link href={`/courses/${slug}/learn/${firstLesson?.slug || ""}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Learning
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>

                <Link
                  href="/courses"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse more courses
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
