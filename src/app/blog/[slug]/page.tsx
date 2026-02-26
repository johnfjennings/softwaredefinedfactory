import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeGlossary from "@/lib/rehype-glossary"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostCard } from "@/components/blog/post-card"
import { GlossaryTooltip } from "@/components/blog/glossary-tooltip"
import { FeaturedProfileHeader } from "@/components/blog/featured-profile-header"
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const revalidate = 3600 // ISR: revalidate DB posts every hour

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const mdxSlugs = getAllPostSlugs().map((slug) => ({ slug }))

  try {
    const supabase = await createClient()
    const { data: dbPosts } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published")
    const dbSlugs = (dbPosts || []).map((p) => ({ slug: p.slug as string }))
    return [...mdxSlugs, ...dbSlugs]
  } catch {
    return mdxSlugs
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  const mdxPost = getPostBySlug(slug)
  if (mdxPost) {
    return {
      title: mdxPost.title,
      description: mdxPost.excerpt,
      openGraph: {
        title: mdxPost.title,
        description: mdxPost.excerpt,
        type: "article",
        publishedTime: mdxPost.date,
        authors: [mdxPost.author],
        tags: mdxPost.tags,
      },
    }
  }

  try {
    const supabase = await createClient()
    const { data: dbPost } = await supabase
      .from("posts")
      .select("title, excerpt, seo_title, seo_description, published_at, tags")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (!dbPost) return { title: "Post Not Found" }
    return {
      title: (dbPost.seo_title as string) || (dbPost.title as string),
      description: (dbPost.seo_description as string) || (dbPost.excerpt as string) || undefined,
    }
  } catch {
    return { title: "Post Not Found" }
  }
}

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeGlossary],
  },
}

const MDX_COMPONENTS = {
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
}

function PostHeader({ title, excerpt, author, date, category, tags, readingTime }: {
  title: string; excerpt: string; author: string; date: string;
  category: string; tags: string[]; readingTime: number
}) {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
          {category}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {readingTime} min read
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground mb-6">{excerpt}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">By {author}</span>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              <Tag className="h-3 w-3" />{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="border-t border-b py-8 mb-16">
      <h3 className="text-sm font-semibold mb-4">Share this article</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(`https://softwaredefinedfactory.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer">Twitter</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://softwaredefinedfactory.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </Button>
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  // Try MDX first
  const mdxPost = getPostBySlug(slug)

  if (mdxPost) {
    const relatedPosts = getRelatedPosts(slug)
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <article className="container mx-auto max-w-4xl px-4 py-12">
            <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />Back to blog
            </Link>
            <PostHeader {...mdxPost} readingTime={mdxPost.readingTime} />
            {mdxPost.coverImage && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-12">
                <Image src={mdxPost.coverImage} alt={mdxPost.title} fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
              <MDXRemote source={mdxPost.content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
            </div>
            <ShareButtons title={mdxPost.title} slug={slug} />
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </div>
            )}
          </article>
        </main>
        <Footer />
      </div>
    )
  }

  // Fall back to DB post
  const supabase = await createClient()
  const { data: dbPost } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_image_url, published_at, category, tags, post_type, featured_entity_slug, author_id")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!dbPost) notFound()

  const readingTime = dbPost.content ? Math.ceil((dbPost.content as string).split(/\s+/).length / 200) : 1
  const postType = (dbPost.post_type as string) || "article"
  const featuredEntitySlug = (dbPost.featured_entity_slug as string) || null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-12">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to blog
          </Link>

          {postType !== "article" && featuredEntitySlug && (
            <FeaturedProfileHeader postType={postType} featuredEntitySlug={featuredEntitySlug} />
          )}

          <PostHeader
            title={dbPost.title as string}
            excerpt={(dbPost.excerpt as string) || ""}
            author="Contributor"
            date={(dbPost.published_at as string) || new Date().toISOString()}
            category={(dbPost.category as string) || "Uncategorized"}
            tags={(dbPost.tags as string[]) || []}
            readingTime={readingTime}
          />

          {dbPost.cover_image_url && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-12">
              <Image src={dbPost.cover_image_url as string} alt={dbPost.title as string} fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <MDXRemote source={(dbPost.content as string) || ""} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
          </div>

          <ShareButtons title={dbPost.title as string} slug={slug} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
