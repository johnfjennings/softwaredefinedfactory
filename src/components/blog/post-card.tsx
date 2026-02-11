import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Tag } from "lucide-react"
import type { BlogPostMetadata } from "@/lib/blog"

interface PostCardProps {
  post: BlogPostMetadata
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {post.category}
          </span>
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
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
