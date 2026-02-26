import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

interface ProductCardProps {
  slug: string
  name: string
  tagline?: string | null
  logo_url?: string | null
  vendor_name: string
  category?: string | null
  pricing_model?: string | null
  tags?: string[] | null
}

export function ProductCard({ slug, name, tagline, logo_url, vendor_name, category, pricing_model, tags }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="block group">
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {logo_url ? (
              <img src={logo_url} alt={`${name} logo`} className="w-12 h-12 rounded-md object-contain border bg-white p-1 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors leading-tight">{name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">by {vendor_name}</p>
              {tagline && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tagline}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
            {pricing_model && <Badge variant="secondary" className="text-xs">{pricing_model}</Badge>}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
