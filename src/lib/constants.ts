export const SITE_CONFIG = {
  name: "Software Defined Factory",
  description: "Learn smart manufacturing, Industry 4.0, and IIoT. Transform your factory with digital technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://softwaredefinedfactory.com",
  ogImage: "/images/og-image.png",
  links: {
    twitter: "https://twitter.com/softwarefactory",
    github: "https://github.com/softwaredefinedfactory",
    linkedin: "https://linkedin.com/company/software-defined-factory",
  },
}

export const NAV_LINKS = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Courses",
    href: "/courses",
  },
  {
    title: "Tools",
    href: "/tools",
  },
  {
    title: "Conferences",
    href: "/conferences",
  },
  {
    title: "About",
    href: "/about",
  },
]

export const COURSE_CATEGORIES = [
  { value: "automation", label: "Manufacturing Automation" },
  { value: "iot", label: "Industrial IoT" },
  { value: "digital-transformation", label: "Digital Transformation" },
  { value: "smart-manufacturing", label: "Smart Manufacturing" },
  { value: "industry-4.0", label: "Industry 4.0" },
]

export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export const BLOG_CATEGORIES = [
  "Smart Manufacturing",
  "IIoT",
  "Digital Twins",
  "Predictive Maintenance",
  "Automation",
  "Industry 4.0",
  "Case Studies",
  "Getting Started",
]
