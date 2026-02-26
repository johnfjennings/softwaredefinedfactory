"use client"

import { useState } from "react"
import { PostCard } from "@/components/blog/post-card"
import { BookOpen, X } from "lucide-react"
import type { UnifiedBlogPostMetadata } from "@/lib/blog"

interface BlogFilterProps {
  posts: UnifiedBlogPostMetadata[]
  categories: string[]
}

export function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    if (activeCategory) return p.category === activeCategory
    if (activeTag) return p.tags.includes(activeTag)
    return true
  })

  function handleCategoryClick(cat: string) {
    setActiveTag(null)
    setActiveCategory((prev) => (prev === cat ? null : cat))
  }

  function handleTagClick(tag: string) {
    setActiveCategory(null)
    setActiveTag((prev) => (prev === tag ? null : tag))
  }

  function clearFilter() {
    setActiveCategory(null)
    setActiveTag(null)
  }

  const activeFilter = activeCategory ?? activeTag
  const activeFilterLabel = activeCategory ? `Category: ${activeCategory}` : activeTag ? `Tag: ${activeTag}` : null

  return (
    <>
      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Active filter badge */}
      {activeFilter && (
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {activeFilterLabel}
            <button onClick={clearFilter} className="hover:opacity-70 transition-opacity" aria-label="Clear filter">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}

      {!activeFilter && <div className="mb-12" />}

      {/* Posts Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} onTagClick={handleTagClick} />
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No posts found</h2>
          <p className="text-muted-foreground mb-4">
            No posts match <strong>{activeFilterLabel}</strong>.
          </p>
          <button onClick={clearFilter} className="text-sm text-primary hover:underline">
            Clear filter
          </button>
        </div>
      )}
    </>
  )
}
