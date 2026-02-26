import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostCard } from "@/components/blog/post-card"
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about smart manufacturing, Industry 4.0, and digital transformation
            </p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 rounded-full bg-muted text-sm font-medium hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            // Empty State
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
