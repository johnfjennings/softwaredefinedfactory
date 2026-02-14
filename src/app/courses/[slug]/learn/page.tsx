import { redirect } from "next/navigation"
import { getCourseLessons } from "@/lib/courses"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LearnPage({ params }: PageProps) {
  const { slug } = await params
  const lessons = getCourseLessons(slug)

  if (lessons.length === 0) {
    redirect(`/courses/${slug}`)
  }

  redirect(`/courses/${slug}/learn/${lessons[0].slug}`)
}
