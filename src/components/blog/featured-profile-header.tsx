import Link from "next/link"
import { Building2, User, Package, ArrowRight } from "lucide-react"

const TYPE_CONFIG = {
  featured_company: {
    label: "Company Feature",
    description: "This article features a manufacturing or IIoT company.",
    icon: Building2,
    basePath: "/companies",
    linkLabel: "View company profile",
    color: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
  },
  featured_person: {
    label: "Industry Leader",
    description: "This article profiles an industry leader or thought leader.",
    icon: User,
    basePath: "/people",
    linkLabel: "View full profile",
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  },
  featured_product: {
    label: "Product Spotlight",
    description: "This article spotlights an IIoT or automation product.",
    icon: Package,
    basePath: "/products",
    linkLabel: "View product profile",
    color: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
  },
}

interface FeaturedProfileHeaderProps {
  postType: string
  featuredEntitySlug: string
}

export function FeaturedProfileHeader({ postType, featuredEntitySlug }: FeaturedProfileHeaderProps) {
  const config = TYPE_CONFIG[postType as keyof typeof TYPE_CONFIG]
  if (!config) return null

  const { label, description, icon: Icon, basePath, linkLabel, color } = config

  return (
    <div className={`flex items-center gap-4 rounded-lg border px-4 py-3 mb-8 ${color}`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        <p className="text-sm mt-0.5">{description}</p>
      </div>
      <Link
        href={`${basePath}/${featuredEntitySlug}`}
        className="flex items-center gap-1 text-sm font-medium hover:underline flex-shrink-0"
      >
        {linkLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
