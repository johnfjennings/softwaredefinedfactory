import fs from "fs"
import path from "path"
import matter from "gray-matter"

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
    }
  } catch (error) {
    return null
  }
}

// Get all posts metadata (sorted by date)
export function getAllPosts(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  return posts.map(({ content, ...metadata }) => metadata)
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
