import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/directory/product-card"
import { Package } from "lucide-react"

export const metadata = {
  title: "IIoT & Automation Products Directory | Software Defined Factory",
  description: "Discover IIoT, automation, and Industry 4.0 products and platforms.",
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("product_profiles")
    .select("id, slug, name, tagline, logo_url, vendor_name, category, pricing_model, tags")
    .eq("status", "published")
    .order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Products Directory</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              IIoT platforms, automation tools, SCADA systems, and Industry 4.0 products.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No products yet.</p>
              <p className="text-sm mt-1">Be the first to submit a product profile.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
