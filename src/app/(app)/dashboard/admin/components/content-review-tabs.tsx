"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PendingPost {
  id: string
  title: string
  slug: string
  post_type: string
  created_at: string
  author_email?: string
}

interface PendingCompany {
  id: string
  name: string
  slug: string
  created_at: string
  submitter_email?: string
}

interface PendingPerson {
  id: string
  full_name: string
  slug: string
  created_at: string
  submitter_email?: string
}

interface PendingProduct {
  id: string
  name: string
  slug: string
  created_at: string
  submitter_email?: string
}

interface PendingConference {
  id: string
  name: string
  dates: string
  location: string
  created_at: string
  submitter_email?: string
}

interface ContentReviewTabsProps {
  pendingPosts: PendingPost[]
  pendingCompanies: PendingCompany[]
  pendingPeople: PendingPerson[]
  pendingProducts: PendingProduct[]
  pendingConferences: PendingConference[]
}

type ContentType = "posts" | "company-profiles" | "person-profiles" | "product-profiles" | "conference-proposals"

interface ReviewTarget {
  id: string
  name: string
  type: ContentType
}

export function ContentReviewTabs({
  pendingPosts,
  pendingCompanies,
  pendingPeople,
  pendingProducts,
  pendingConferences,
}: ContentReviewTabsProps) {
  const router = useRouter()
  const [target, setTarget] = useState<ReviewTarget | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const totalPending =
    pendingPosts.length +
    pendingCompanies.length +
    pendingPeople.length +
    pendingProducts.length +
    pendingConferences.length

  async function handleReview(status: "published" | "rejected") {
    if (!target) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/content/${target.type}/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, review_notes: notes }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to update"); return }
      setTarget(null)
      setNotes("")
      router.refresh()
    } catch { setError("An unexpected error occurred") }
    finally { setSubmitting(false) }
  }

  function openReview(id: string, name: string, type: ContentType) {
    setTarget({ id, name, type })
    setNotes("")
    setError("")
  }

  return (
    <>
      {totalPending === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No content pending review. All clear!
        </div>
      ) : (
        <Tabs defaultValue="posts">
          <TabsList className="mb-4">
            <TabsTrigger value="posts">
              Posts {pendingPosts.length > 0 && <Badge variant="secondary" className="ml-1">{pendingPosts.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="companies">
              Companies {pendingCompanies.length > 0 && <Badge variant="secondary" className="ml-1">{pendingCompanies.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="people">
              People {pendingPeople.length > 0 && <Badge variant="secondary" className="ml-1">{pendingPeople.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="products">
              Products {pendingProducts.length > 0 && <Badge variant="secondary" className="ml-1">{pendingProducts.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="conferences">
              Conferences {pendingConferences.length > 0 && <Badge variant="secondary" className="ml-1">{pendingConferences.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <PendingTable
              items={pendingPosts.map((p) => ({ id: p.id, name: p.title, meta: p.post_type, submitter: p.author_email, created_at: p.created_at }))}
              onReview={(id, name) => openReview(id, name, "posts")}
              emptyText="No pending blog posts"
            />
          </TabsContent>
          <TabsContent value="companies">
            <PendingTable
              items={pendingCompanies.map((c) => ({ id: c.id, name: c.name, meta: c.slug, submitter: c.submitter_email, created_at: c.created_at }))}
              onReview={(id, name) => openReview(id, name, "company-profiles")}
              emptyText="No pending company profiles"
            />
          </TabsContent>
          <TabsContent value="people">
            <PendingTable
              items={pendingPeople.map((p) => ({ id: p.id, name: p.full_name, meta: p.slug, submitter: p.submitter_email, created_at: p.created_at }))}
              onReview={(id, name) => openReview(id, name, "person-profiles")}
              emptyText="No pending person profiles"
            />
          </TabsContent>
          <TabsContent value="products">
            <PendingTable
              items={pendingProducts.map((p) => ({ id: p.id, name: p.name, meta: p.slug, submitter: p.submitter_email, created_at: p.created_at }))}
              onReview={(id, name) => openReview(id, name, "product-profiles")}
              emptyText="No pending product profiles"
            />
          </TabsContent>
          <TabsContent value="conferences">
            <PendingTable
              items={pendingConferences.map((c) => ({ id: c.id, name: c.name, meta: `${c.dates} · ${c.location}`, submitter: c.submitter_email, created_at: c.created_at }))}
              onReview={(id, name) => openReview(id, name, "conference-proposals")}
              emptyText="No pending conference proposals"
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Review Dialog */}
      <Dialog open={!!target} onOpenChange={(open) => { if (!open) { setTarget(null); setNotes("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review: {target?.name}</DialogTitle>
            <DialogDescription>
              Approve to publish immediately, or reject with optional feedback for the contributor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="review-notes">Review Notes (optional)</Label>
            <Textarea
              id="review-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Feedback for the contributor (shown on rejection)"
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setTarget(null); setNotes("") }} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReview("rejected")} disabled={submitting}>
              {submitting ? "..." : "Reject"}
            </Button>
            <Button onClick={() => handleReview("published")} disabled={submitting}>
              {submitting ? "..." : "Approve & Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PendingTable({
  items,
  onReview,
  emptyText,
}: {
  items: { id: string; name: string; meta?: string; submitter?: string; created_at: string }[]
  onReview: (id: string, name: string) => void
  emptyText: string
}) {
  if (items.length === 0) {
    return <div className="text-center py-10 text-muted-foreground border rounded-lg">{emptyText}</div>
  }
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name / Title</TableHead>
            <TableHead className="hidden md:table-cell">Type / Slug</TableHead>
            <TableHead className="hidden md:table-cell">Submitted by</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{item.meta}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{item.submitter || "—"}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onReview(item.id, item.name)}>
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
