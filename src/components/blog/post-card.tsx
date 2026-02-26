import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Tag } from "lucide-react"
import type { UnifiedBlogPostMetadata } from "@/lib/blog"

const POST_TYPE_LABELS: Record<string, string> = {
  featured_company: "Company Feature",
  featured_person: "Industry Leader",
  featured_product: "Product Spotlight",
}

interface PostCardProps {
  post: UnifiedBlogPostMetadata
  onTagClick?: (tag: string) => void
}

export function PostCard({ post, onTagClick }: PostCardProps) {
  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {post.category}
          </span>
          {post.postType && POST_TYPE_LABELS[post.postType] && (
            <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 text-xs font-medium">
              {POST_TYPE_LABELS[post.postType]}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </button>
              ) : (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
