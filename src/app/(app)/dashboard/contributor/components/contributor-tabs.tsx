"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Building2, User, Package, Calendar } from "lucide-react"

type ContentStatus = "draft" | "pending_review" | "published" | "rejected"

interface PostItem {
  id: string
  title: string
  slug: string
  status: string
  post_type: string
  created_at: string
}

interface CompanyItem {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

interface PersonItem {
  id: string
  full_name: string
  slug: string
  status: string
  created_at: string
}

interface ProductItem {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

interface ConferenceItem {
  id: string
  name: string
  dates: string
  status: string
  created_at: string
}

interface ContributorTabsProps {
  posts: PostItem[]
  companies: CompanyItem[]
  people: PersonItem[]
  products: ProductItem[]
  conferences: ConferenceItem[]
}

const STATUS_VARIANTS: Record<ContentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  pending_review: "default",
  published: "outline",
  rejected: "destructive",
}

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Draft",
  pending_review: "In Review",
  published: "Published",
  rejected: "Rejected",
}

function StatusBadge({ status }: { status: string }) {
  const s = status as ContentStatus
  return (
    <Badge variant={STATUS_VARIANTS[s] ?? "secondary"}>
      {STATUS_LABELS[s] ?? status}
    </Badge>
  )
}

function countByStatus(items: { status: string }[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

export function ContributorTabs({
  posts,
  companies,
  people,
  products,
  conferences,
}: ContributorTabsProps) {
  const allItems = [...posts, ...companies, ...people, ...products, ...conferences]
  const counts = countByStatus(allItems)

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="posts">
          Blog Posts {posts.length > 0 && <span className="ml-1 text-xs">({posts.length})</span>}
        </TabsTrigger>
        <TabsTrigger value="companies">
          Companies {companies.length > 0 && <span className="ml-1 text-xs">({companies.length})</span>}
        </TabsTrigger>
        <TabsTrigger value="people">
          Academic Providers {people.length > 0 && <span className="ml-1 text-xs">({people.length})</span>}
        </TabsTrigger>
        <TabsTrigger value="products">
          Products {products.length > 0 && <span className="ml-1 text-xs">({products.length})</span>}
        </TabsTrigger>
        <TabsTrigger value="conferences">
          Conferences{" "}
          {conferences.length > 0 && <span className="ml-1 text-xs">({conferences.length})</span>}
        </TabsTrigger>
      </TabsList>

      {/* OVERVIEW */}
      <TabsContent value="overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["draft", "pending_review", "published", "rejected"] as ContentStatus[]).map((s) => (
            <Card key={s}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {STATUS_LABELS[s]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts[s] || 0}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SubmitCard
            icon={<FileText className="h-5 w-5" />}
            title="Blog Post"
            description="Write an article about smart manufacturing, IIoT, or Industry 4.0"
            href="/dashboard/contributor/new-post"
          />
          <SubmitCard
            icon={<Building2 className="h-5 w-5" />}
            title="Company Profile"
            description="Feature a manufacturing or IIoT company in our directory"
            href="/dashboard/contributor/new-company"
          />
          <SubmitCard
            icon={<User className="h-5 w-5" />}
            title="Academic Provider Profile"
            description="Highlight an academic, researcher, or educator in smart manufacturing"
            href="/dashboard/contributor/new-person"
          />
          <SubmitCard
            icon={<Package className="h-5 w-5" />}
            title="Product Profile"
            description="Showcase an IIoT or automation product"
            href="/dashboard/contributor/new-product"
          />
          <SubmitCard
            icon={<Calendar className="h-5 w-5" />}
            title="Conference / Event"
            description="Suggest a manufacturing conference or industry event"
            href="/dashboard/contributor/new-conference"
          />
        </div>
      </TabsContent>

      {/* BLOG POSTS */}
      <TabsContent value="posts">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Blog Posts</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/contributor/new-post">
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Link>
          </Button>
        </div>
        <ContentTable
          items={posts.map((p) => ({ id: p.id, name: p.title, slug: p.slug, status: p.status, meta: p.post_type, created_at: p.created_at }))}
          editBase="/dashboard/contributor/edit-post"
          emptyText="No blog posts yet"
        />
      </TabsContent>

      {/* COMPANIES */}
      <TabsContent value="companies">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Company Profiles</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/contributor/new-company">
              <Plus className="h-4 w-4 mr-1" /> Add Company
            </Link>
          </Button>
        </div>
        <ContentTable
          items={companies.map((c) => ({ id: c.id, name: c.name, slug: c.slug, status: c.status, created_at: c.created_at }))}
          editBase="/dashboard/contributor/edit-company"
          emptyText="No company profiles yet"
        />
      </TabsContent>

      {/* ACADEMIC PROVIDERS */}
      <TabsContent value="people">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Academic Provider Profiles</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/contributor/new-person">
              <Plus className="h-4 w-4 mr-1" /> Add Academic Provider
            </Link>
          </Button>
        </div>
        <ContentTable
          items={people.map((p) => ({ id: p.id, name: p.full_name, slug: p.slug, status: p.status, created_at: p.created_at }))}
          editBase="/dashboard/contributor/edit-person"
          emptyText="No academic provider profiles yet"
        />
      </TabsContent>

      {/* PRODUCTS */}
      <TabsContent value="products">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Product Profiles</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/contributor/new-product">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Link>
          </Button>
        </div>
        <ContentTable
          items={products.map((p) => ({ id: p.id, name: p.name, slug: p.slug, status: p.status, created_at: p.created_at }))}
          editBase="/dashboard/contributor/edit-product"
          emptyText="No product profiles yet"
        />
      </TabsContent>

      {/* CONFERENCES */}
      <TabsContent value="conferences">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Conference Proposals</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/contributor/new-conference">
              <Plus className="h-4 w-4 mr-1" /> Propose Event
            </Link>
          </Button>
        </div>
        <ContentTable
          items={conferences.map((c) => ({ id: c.id, name: c.name, slug: "", status: c.status, meta: c.dates, created_at: c.created_at }))}
          editBase="/dashboard/contributor/edit-conference"
          emptyText="No conference proposals yet"
          hideSlug
        />
      </TabsContent>
    </Tabs>
  )
}

interface SubmitCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function SubmitCard({ icon, title, description, href }: SubmitCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={href}>
            <Plus className="h-4 w-4 mr-1" /> Submit
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

interface ContentTableItem {
  id: string
  name: string
  slug: string
  status: string
  meta?: string
  created_at: string
}

function ContentTable({
  items,
  editBase,
  emptyText,
  hideSlug = false,
}: {
  items: ContentTableItem[]
  editBase: string
  emptyText: string
  hideSlug?: boolean
}) {
  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center text-muted-foreground">{emptyText}</div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {!hideSlug && <TableHead className="hidden md:table-cell">Slug</TableHead>}
            {items[0]?.meta !== undefined && (
              <TableHead className="hidden md:table-cell">Type / Date</TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              {!hideSlug && (
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {item.slug}
                </TableCell>
              )}
              {item.meta !== undefined && (
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {item.meta}
                </TableCell>
              )}
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {item.status === "draft" || item.status === "rejected" ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`${editBase}/${item.id}`}>Edit</Link>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
