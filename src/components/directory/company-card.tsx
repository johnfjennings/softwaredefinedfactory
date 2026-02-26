import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, MapPin } from "lucide-react"

interface CompanyCardProps {
  slug: string
  name: string
  tagline?: string | null
  logo_url?: string | null
  headquarters?: string | null
  company_size?: string | null
  industry_focus?: string[] | null
}

export function CompanyCard({ slug, name, tagline, logo_url, headquarters, company_size, industry_focus }: CompanyCardProps) {
  return (
    <Link href={`/companies/${slug}`} className="block group">
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {logo_url ? (
              <img src={logo_url} alt={`${name} logo`} className="w-12 h-12 rounded-md object-contain border bg-white p-1 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors leading-tight">{name}</h3>
              {tagline && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{tagline}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {headquarters && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {headquarters}
              </span>
            )}
            {company_size && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> {company_size} employees
              </span>
            )}
          </div>
          {industry_focus && industry_focus.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {industry_focus.slice(0, 3).map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
              ))}
              {industry_focus.length > 3 && (
                <Badge variant="secondary" className="text-xs">+{industry_focus.length - 3}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
