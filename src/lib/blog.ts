import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { createClient } from "@/lib/supabase/server"

const postsDirectory = path.join(process.cwd(), "src/content/blog")

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  coverImage?: string
  readingTime: number
  draft?: boolean
}

export interface BlogPostMetadata {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  coverImage?: string
  readingTime: number
}

// Extends BlogPostMetadata with source-tracking for DB-sourced posts
export interface UnifiedBlogPostMetadata extends BlogPostMetadata {
  source?: "mdx" | "db"
  postType?: string
  dbId?: string
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Get all blog post slugs
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""))
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      author: data.author || "Software Defined Factory",
      category: data.category || "Uncategorized",
      tags: data.tags || [],
      coverImage: data.coverImage,
      content,
      readingTime: calculateReadingTime(content),
      draft: data.draft === true,
    }
  } catch {
    return null
  }
}

// Get all posts metadata (sorted by date, excludes drafts)
export function getAllPosts(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null && !post.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  return posts.map(({ content, draft, ...metadata }) => metadata)
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPostMetadata[] {
  return getAllPosts().filter((post) => post.category === category)
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPostMetadata[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

// Get related posts (same category or tags)
export function getRelatedPosts(slug: string, limit = 3): BlogPostMetadata[] {
  const currentPost = getPostBySlug(slug)
  if (!currentPost) return []

  const allPosts = getAllPosts().filter((post) => post.slug !== slug)

  // Score posts by relevance
  const scoredPosts = allPosts.map((post) => {
    let score = 0

    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3
    }

    // Shared tags increase score
    const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag))
    score += sharedTags.length

    return { post, score }
  })

  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)
}

// Get all unique categories
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set(posts.map((post) => post.category))
  return Array.from(categories)
}

// Get all unique tags
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set(posts.flatMap((post) => post.tags))
  return Array.from(tags)
}

// Get all posts from both MDX files and the Supabase posts table, sorted by date
export async function getAllPostsCombined(): Promise<UnifiedBlogPostMetadata[]> {
  const mdxPosts: UnifiedBlogPostMetadata[] = getAllPosts().map((p) => ({
    ...p,
    source: "mdx" as const,
    postType: "article",
  }))

  try {
    const supabase = await createClient()
    const { data: dbPosts } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, content, cover_image_url, published_at, category, tags, post_type")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    const mappedDbPosts: UnifiedBlogPostMetadata[] = (dbPosts || []).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: (p.published_at as string) || new Date().toISOString(),
      excerpt: (p.excerpt as string) || "",
      author: "Contributor",
      category: (p.category as string) || "Uncategorized",
      tags: (p.tags as string[]) || [],
      coverImage: (p.cover_image_url as string) || undefined,
      readingTime: p.content ? Math.ceil((p.content as string).split(/\s+/).length / 200) : 1,
      source: "db" as const,
      postType: (p.post_type as string) || "article",
      dbId: p.id as string,
    }))

    return [...mdxPosts, ...mappedDbPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch {
    return mdxPosts
  }
}
