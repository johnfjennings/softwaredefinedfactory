"use client"

import { useState } from "react"
import { CourseCard } from "@/components/course/course-card"
import { COURSE_CATEGORIES } from "@/lib/constants"
import { GraduationCap } from "lucide-react"
import type { Course } from "@/types/course"

interface CoursesFilterProps {
  courses: Course[]
}

export function CoursesFilter({ courses }: CoursesFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? courses.filter((c) => c.category === activeCategory)
    : courses

  // Only show categories that have at least one course
  const availableCategories = COURSE_CATEGORIES.filter((cat) =>
    courses.some((c) => c.category === cat.value)
  )

  return (
    <>
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            All
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No courses found in this category.</p>
        </div>
      )}
    </>
  )
}
