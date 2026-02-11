# Software Defined Factory - Setup Guide

## ✅ What's Built

Your complete authentication system and foundation is ready:

- ✅ Login page ([/login](http://localhost:3002/login))
- ✅ Signup page with email verification ([/signup](http://localhost:3002/signup))
- ✅ Password reset flow ([/reset-password](http://localhost:3002/reset-password))
- ✅ User dashboard ([/dashboard](http://localhost:3002/dashboard))
- ✅ Protected routes with middleware
- ✅ Logout functionality
- ✅ Placeholder pages (blog, courses, tools, about)

## 🚀 Next Steps: Run Database Migration

You've already connected Supabase, but you need to create the database tables.

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/hhulhreacwgnvqzgslzk
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run** (or press Ctrl+Enter)

The migration will create:
- `profiles` table (user profiles)
- `courses` table
- `modules` and `lessons` tables
- `enrollments` and `lesson_progress` tables
- `posts` table (blog)
- `subscribers` table (newsletter)
- `payments` table (Stripe integration)
- `tool_usage` table (analytics)
- Row Level Security policies
- Automatic profile creation trigger

### Option 2: Supabase CLI (Alternative)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref hhulhreacwgnvqzgslzk

# Run migrations
supabase db push
```

## 🧪 Test the Authentication

1. **Sign up for an account**:
   - Go to http://localhost:3002/signup
   - Create an account with your email
   - Check your email for the confirmation link
   - Click the link to verify your account

2. **Log in**:
   - Go to http://localhost:3002/login
   - Enter your credentials
   - You should be redirected to /dashboard

3. **Test protected routes**:
   - Try accessing /dashboard without logging in (should redirect to /login)
   - Log out and verify you can't access /dashboard

## 📧 Email Configuration (Important!)

Supabase will send confirmation emails. For development:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Review the default templates (they work out of the box)
3. For production, configure a custom SMTP provider:
   - Settings → Authentication → SMTP Settings
   - Use SendGrid, AWS SES, or another provider

## 🎨 Current Features

### Authentication
- Email/password signup and login
- Email verification
- Password reset
- Protected routes
- User dashboard
- Profile management

### Pages
- Landing page with hero section
- Blog (placeholder)
- Courses (placeholder)
- Tools (placeholder)
- About page
- Dashboard (authenticated users only)

### Design
- Modern tech aesthetic
- Dark mode by default
- Fully responsive
- Professional UI components

## 📝 Next Features to Build

Based on your plan, here's what's next:

### Phase 1 Remaining:
- [ ] Blog system with MDX
- [ ] First blog posts (Smart Manufacturing 101)
- [ ] Newsletter signup integration (ConvertKit)

### Phase 2 (Weeks 5-8):
- [ ] ROI Calculator tool
- [ ] Course platform with video player
- [ ] Stripe payment integration
- [ ] First course creation

### Phase 3 (Months 3-6):
- [ ] Content expansion (20+ blog posts, 3-5 courses)
- [ ] Community features (Discord integration)
- [ ] SaaS MVP features

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🌐 Deployment to Vercel

When ready to deploy:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up HTTPS
- Provide a production URL
- Auto-deploy on git push

## 🔐 Environment Variables for Production

Make sure to set these in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_SITE_URL=https://softwaredefinedfactory.com
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🐛 Troubleshooting

### "Invalid login credentials" error
- Make sure you've confirmed your email
- Check that the email/password are correct

### Can't access /dashboard
- Verify you're logged in
- Check browser console for errors
- Clear cookies and try logging in again

### Email confirmation not arriving
- Check spam folder
- Verify email in Supabase Dashboard → Authentication → Users
- Manually verify user in Supabase if needed

## 💡 Tips

1. **Test with real email**: Use a real email address you can access
2. **Check Supabase logs**: Authentication → Logs shows all auth events
3. **Use browser DevTools**: Network tab helps debug API calls
4. **Start small**: Build one feature at a time

---

**You're ready to go!** 🎉

Run the database migration and start testing the authentication system.
