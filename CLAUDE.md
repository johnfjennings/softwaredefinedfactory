# Software Defined Factory — Claude Code Instructions

## Project Overview
**softwaredefinedfactory.com** — Smart manufacturing, Industry 4.0, IIoT education platform.
- Side project: zero budget, 3-5 year build-to-flip, target $5-10k MRR
- Owner: John Jennings (IT lecturer, manufacturing domain expertise)
- GitHub: github.com/johnfjennings/softwaredefinedfactory
- Live: www.softwaredefinedfactory.com (Vercel, auto-deploys from main)

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) + TypeScript + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Database | Supabase (PostgreSQL) with RLS |
| Auth | Supabase Auth (email/password + OAuth) |
| Blog | MDX via next-mdx-remote + gray-matter + remark-gfm |
| Email | Resend (transactional + newsletter) |
| Payments | Stripe (installed, not yet integrated) |
| PDF | jsPDF |
| Icons | lucide-react |
| Analytics | @vercel/analytics |
| Hosting | Vercel |

## Project Structure
```
softwaredefinedfactory/         ← repo root / cwd
  src/
    app/
      (auth)/                   ← login, signup, reset-password
      (app)/dashboard/          ← protected user dashboard
        admin/                  ← admin panel (user management, subscriber export)
        creator/                ← creator/contributor dashboard
      (marketing)/              ← public marketing pages (if grouped)
      blog/                     ← blog index + [slug] dynamic pages
      courses/                  ← course catalog + [slug] detail + learn player
      tools/                    ← tools index, roi-calculator, oee-calculator
      about/, conferences/, glossary/, privacy/, terms/, unsubscribe/
      api/                      ← newsletter/subscribe, auth/callback
      layout.tsx, page.tsx, sitemap.ts, robots.ts
    components/
      ui/                       ← shadcn: button, card, input, label, textarea,
                                   dialog, dropdown-menu, sheet, progress,
                                   badge, tabs, separator, table
      layout/                   ← header.tsx, footer.tsx
      marketing/                ← email-capture-modal.tsx, newsletter-form.tsx
      blog/                     ← post-card.tsx, glossary-tooltip.tsx
      auth/                     ← logout-button.tsx
      course/                   ← course-card.tsx, lesson-player.tsx,
                                   lesson-layout.tsx, course-sidebar.tsx,
                                   progress-provider.tsx, mark-complete-button.tsx,
                                   enroll-button.tsx
      theme-provider.tsx
    lib/
      supabase/                 ← client.ts (browser), server.ts (RSC/API)
      blog.ts                   ← MDX utilities (getAllPosts, getPostBySlug)
      utils.ts, constants.ts
    types/
      database.ts               ← Supabase types (auto-generated, do not edit manually)
    content/
      blog/                     ← 16 MDX posts
  supabase/
    migrations/                 ← SQL migration files
  public/                       ← Static assets, hero images
  middleware.ts                 ← Auth route protection
```

## Database Schema (Supabase)
Tables (all RLS enabled):
`profiles`, `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `posts`, `subscribers`, `payments`, `tool_usage`

Auto-profile-creation trigger fires on new user signup.

User roles stored in `profiles.role`: `user` | `contributor` | `instructor` | `admin`

## Key Patterns & Conventions

### Supabase
- Browser client: `import { createClient } from '@/lib/supabase/client'`
- Server/RSC client: `import { createClient } from '@/lib/supabase/server'`
- Types come from `@/types/database` — never use `as any` casts

### Styling
- Tailwind v4 (CSS-first config, no tailwind.config.js)
- shadcn/ui components live in `src/components/ui/`
- Dark mode supported via `theme-provider.tsx`
- Design aesthetic: clean, minimal, Vercel/Linear-inspired

### Blog (MDX)
- Posts live in `src/content/blog/*.mdx`
- Frontmatter fields: `title`, `description`, `date`, `author`, `tags`, `coverImage`
- Blog utilities in `src/lib/blog.ts`
- Rendered with `@tailwindcss/typography` prose styles + remark-gfm for tables

### Auth & Middleware
- Protected routes: `/dashboard/**` — handled in `middleware.ts`
- Auth routes: `/login`, `/signup`, `/reset-password`, `/auth/callback`

### Course Platform
- `progress-provider.tsx` — React context for real-time lesson progress state
- Lesson player at `/courses/[slug]/learn/[lessonSlug]`
- Video hosting: YouTube Unlisted embeds

## Current State (Feb 2026)

### Done
- Full auth flow (signup, login, reset, OAuth callback)
- Protected dashboard with admin panel and creator dashboard
- Blog system with 16 MDX posts (incl. IIoT Trends 2026 series)
- Course platform: catalog, detail pages, lesson player, progress tracking
- ROI Calculator + OEE Calculator tools
- Newsletter subscribe/unsubscribe with Resend
- Glossary (50+ terms) with tooltip component
- Conferences & Events 2026 calendar
- Privacy Policy + Terms of Service
- Vercel Analytics, dynamic sitemap.xml, robots.txt
- Google Search Console verified + sitemap submitted
- Hero images for all blog posts (via Pollinations API)
- Supabase auto-generated types

### In Progress / Next
- Contributor user type (create/edit/delete blogs, conferences, company profiles)
- Real course content (replace placeholders)
- Stripe payment integration
- OEE Calculator / KPI Dashboard polish
- Additional content types: featured company/person/product profiles

### Known Issues
- Next.js middleware deprecation warning (proxy convention not yet adopted)

## Workflow
- **Deploy:** push to `main` → Vercel auto-deploys
- **Testing:** verify via Vercel preview/production URLs (not local dev typically)
- **Commits:** descriptive messages, no conventional commit prefixes
- **Style:** high-level instructions → Claude implements; prefer recommended/default options
- **No local test runner** — lint with `npm run lint` if needed

## Environment Variables
Managed in Vercel dashboard and `.env.local` (not committed). Keys expected:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
