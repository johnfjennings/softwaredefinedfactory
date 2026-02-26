"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const CATEGORIES = [
  "Smart Manufacturing",
  "IIoT",
  "Industry 4.0",
  "Digital Twins",
  "Predictive Maintenance",
  "OEE & Performance",
  "Cybersecurity",
  "Edge Computing",
  "Robotics & Automation",
  "Sustainability",
  "Standards & Compliance",
  "Company Feature",
  "Industry Leader",
  "Product Spotlight",
]

const POST_TYPES = [
  { value: "article", label: "Article" },
  { value: "featured_company", label: "Featured Company" },
  { value: "featured_person", label: "Featured Person / Leader" },
  { value: "featured_product", label: "Featured Product" },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function PostForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    tags: "",
    post_type: "article",
    cover_image_url: "",
    featured_entity_slug: "",
    seo_title: "",
    seo_description: "",
  })

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugManual ? f.slug : slugify(value),
    }))
  }

  async function handleSubmit(status: "draft" | "pending_review") {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/contributor/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to save post")
        return
      }
      router.push("/dashboard/contributor?tab=posts")
      router.refresh()
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const showFeaturedSlug = form.post_type !== "article"

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. How Digital Twins Are Transforming Manufacturing"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true)
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
            }}
            placeholder="auto-generated-from-title"
          />
          <p className="text-xs text-muted-foreground">URL: /blog/{form.slug || "your-slug"}</p>
        </div>

        {/* Post Type */}
        <div className="space-y-2">
          <Label htmlFor="post_type">Post Type</Label>
          <select
            id="post_type"
            value={form.post_type}
            onChange={(e) => setForm((f) => ({ ...f, post_type: e.target.value }))}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          >
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Entity Slug (shown for non-article types) */}
        {showFeaturedSlug && (
          <div className="space-y-2">
            <Label htmlFor="featured_entity_slug">Featured Profile Slug</Label>
            <Input
              id="featured_entity_slug"
              value={form.featured_entity_slug}
              onChange={(e) => setForm((f) => ({ ...f, featured_entity_slug: e.target.value }))}
              placeholder="e.g. acme-corp (matches the slug in the directory)"
            />
            <p className="text-xs text-muted-foreground">
              Links this post to a profile in the directory
            </p>
          </div>
        )}

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="IIoT, sensors, automation (comma-separated)"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="A short summary shown on the blog index (1-2 sentences)"
            rows={3}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content * (Markdown)</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Write your article in Markdown format..."
            rows={16}
            className="font-mono text-sm"
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">Cover Image URL</Label>
          <Input
            id="cover_image_url"
            value={form.cover_image_url}
            onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        {/* SEO */}
        <div className="space-y-4 pt-2 border-t">
          <p className="text-sm font-medium text-muted-foreground">SEO (optional)</p>
          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              value={form.seo_title}
              onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
              placeholder="Defaults to post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">Meta Description</Label>
            <Textarea
              id="seo_description"
              value={form.seo_description}
              onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
              placeholder="Defaults to excerpt"
              rows={2}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={saving || !form.title || !form.slug || !form.content}
          >
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={() => handleSubmit("pending_review")}
            disabled={saving || !form.title || !form.slug || !form.excerpt || !form.content}
          >
            {saving ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
