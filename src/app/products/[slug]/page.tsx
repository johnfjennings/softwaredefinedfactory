import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Globe, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("product_profiles")
    .select("name, vendor_name, seo_title, seo_description, tagline")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!data) return { title: "Product Not Found" }
  return {
    title: data.seo_title || `${data.name} by ${data.vendor_name} | Software Defined Factory`,
    description: data.seo_description || data.tagline || undefined,
  }
}

export default async function ProductProfilePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("product_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!product) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {product.cover_image_url && (
          <div className="w-full h-48 md:h-64 bg-muted overflow-hidden">
            <img src={product.cover_image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-start gap-5 mb-8">
            {product.logo_url ? (
              <img src={product.logo_url} alt={`${product.name} logo`} className="w-20 h-20 rounded-xl border bg-white p-2 object-contain flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-xl border bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground mt-1">by {product.vendor_name}</p>
              {product.tagline && <p className="text-lg mt-2">{product.tagline}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {product.category && <Badge variant="outline">{product.category}</Badge>}
                {product.pricing_model && <Badge variant="secondary">{product.pricing_model}</Badge>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            {product.product_url && (
              <Button asChild>
                <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />View Product
                </a>
              </Button>
            )}
            {product.vendor_url && (
              <Button asChild variant="outline">
                <a href={product.vendor_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />Vendor Site
                </a>
              </Button>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t: string) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
