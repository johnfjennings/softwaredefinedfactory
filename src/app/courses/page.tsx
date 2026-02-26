import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CoursesFilter } from "./components/courses-filter"
import { getAllCourses } from "@/lib/courses"
import { GraduationCap } from "lucide-react"

export const metadata = {
  title: "Courses | Software Defined Factory",
  description:
    "Master smart manufacturing with comprehensive courses on IIoT, automation, Industry 4.0, and digital transformation.",
}

export default function CoursesPage() {
  const courses = getAllCourses()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master smart manufacturing with comprehensive, hands-on courses covering IIoT,
              automation, Industry 4.0, and digital transformation.
            </p>
          </div>

          {courses.length > 0 ? (
            <CoursesFilter courses={courses} />
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Courses are being developed. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
