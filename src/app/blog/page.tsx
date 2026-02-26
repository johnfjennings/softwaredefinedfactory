import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogFilter } from "./components/blog-filter"
import { getAllPostsCombined } from "@/lib/blog"
import { BookOpen } from "lucide-react"

export const metadata = {
  title: "Blog",
  description: "Learn about smart manufacturing, Industry 4.0, IIoT, and digital transformation with expert guides and tutorials.",
}

export default async function BlogPage() {
  const posts = await getAllPostsCombined()
  const categories = Array.from(new Set(posts.map((p) => p.category)))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about smart manufacturing, Industry 4.0, and digital transformation
            </p>
          </div>

          {posts.length > 0 ? (
            <BlogFilter posts={posts} categories={categories} />
          ) : (
            <div className="max-w-3xl mx-auto text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re working on creating comprehensive guides about smart manufacturing. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
