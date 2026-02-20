import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeGlossary from "@/lib/rehype-glossary"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostCard } from "@/components/blog/post-card"
import { GlossaryTooltip } from "@/components/blog/glossary-tooltip"
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog"
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-12">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">By {post.author}</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeGlossary],
                },
              }}
              components={{
                span: ({ children, ...props }: React.ComponentProps<"span"> & { "data-glossary"?: string; "data-glossary-definition"?: string }) => {
                  const term = props["data-glossary"]
                  const definition = props["data-glossary-definition"]
                  if (term && definition) {
                    return (
                      <GlossaryTooltip term={term} definition={definition}>
                        {children}
                      </GlossaryTooltip>
                    )
                  }
                  return <span {...props}>{children}</span>
                },
              }}
            />
          </div>

          {/* Share Buttons */}
          <div className="border-t border-b py-8 mb-16">
            <h3 className="text-sm font-semibold mb-4">Share this article</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://softwaredefinedfactory.com/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://softwaredefinedfactory.com/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
