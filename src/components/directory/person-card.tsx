import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building2 } from "lucide-react"

interface PersonCardProps {
  slug: string
  full_name: string
  title?: string | null
  company?: string | null
  avatar_url?: string | null
  expertise?: string[] | null
}

export function PersonCard({ slug, full_name, title, company, avatar_url, expertise }: PersonCardProps) {
  return (
    <Link href={`/academic-providers/${slug}`} className="block group">
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {avatar_url ? (
              <img src={avatar_url} alt={full_name} className="w-12 h-12 rounded-full object-cover border flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full border bg-muted flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors leading-tight">{full_name}</h3>
              {title && <p className="text-sm text-muted-foreground mt-0.5">{title}</p>}
              {company && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3" /> {company}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {expertise && expertise.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {expertise.slice(0, 4).map((e) => (
                <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
              ))}
              {expertise.length > 4 && (
                <Badge variant="secondary" className="text-xs">+{expertise.length - 4}</Badge>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
