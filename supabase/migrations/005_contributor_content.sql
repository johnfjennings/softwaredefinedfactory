-- Migration 005: Contributor role content tables and workflow
-- Adds: company_profiles, person_profiles, product_profiles, conference_proposals
-- Alters: posts (status workflow, post_type, featured_entity_slug)

-- ============================================================
-- 1. ALTER posts table — add status workflow columns
-- ============================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'article',
  ADD COLUMN IF NOT EXISTS featured_entity_slug TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Migrate existing is_published → status
UPDATE posts SET status = 'published' WHERE is_published = TRUE AND status = 'draft';

-- Keep is_published in sync with status via trigger
CREATE OR REPLACE FUNCTION sync_posts_is_published()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_published = (NEW.status = 'published');
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_posts_is_published_trigger ON posts;
CREATE TRIGGER sync_posts_is_published_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION sync_posts_is_published();

-- Update posts RLS policies
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published' OR author_id = auth.uid());

DROP POLICY IF EXISTS "Contributors can update own draft posts" ON posts;
CREATE POLICY "Contributors can update own draft posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id AND status IN ('draft', 'rejected'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);

-- ============================================================
-- 2. company_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  company_size TEXT, -- '1-50' | '51-200' | '201-1000' | '1000+'
  industry_focus TEXT[] DEFAULT '{}',
  products_services TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | pending_review | published | rejected
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published company profiles" ON company_profiles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Contributors can view own company submissions" ON company_profiles
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Contributors can insert company profiles" ON company_profiles
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Contributors can update own draft company profiles" ON company_profiles
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'draft');

CREATE INDEX IF NOT EXISTS idx_company_profiles_status ON company_profiles(status);
CREATE INDEX IF NOT EXISTS idx_company_profiles_slug ON company_profiles(slug);

-- ============================================================
-- 3. person_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS person_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  expertise TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE person_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published person profiles" ON person_profiles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Contributors can view own person submissions" ON person_profiles
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Contributors can insert person profiles" ON person_profiles
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Contributors can update own draft person profiles" ON person_profiles
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'draft');

CREATE INDEX IF NOT EXISTS idx_person_profiles_status ON person_profiles(status);
CREATE INDEX IF NOT EXISTS idx_person_profiles_slug ON person_profiles(slug);

-- ============================================================
-- 4. product_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS product_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  vendor_name TEXT NOT NULL,
  vendor_url TEXT,
  product_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  pricing_model TEXT, -- 'subscription' | 'perpetual' | 'free' | 'freemium' | 'contact'
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published product profiles" ON product_profiles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Contributors can view own product submissions" ON product_profiles
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Contributors can insert product profiles" ON product_profiles
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Contributors can update own draft product profiles" ON product_profiles
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'draft');

CREATE INDEX IF NOT EXISTS idx_product_profiles_status ON product_profiles(status);
CREATE INDEX IF NOT EXISTS idx_product_profiles_slug ON product_profiles(slug);

-- ============================================================
-- 5. conference_proposals
-- ============================================================

CREATE TABLE IF NOT EXISTS conference_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dates TEXT NOT NULL,
  start_date DATE,
  location TEXT NOT NULL,
  region TEXT, -- 'North America' | 'Europe' | 'Asia' | 'Other'
  description TEXT,
  url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conference_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributors can view own conference proposals" ON conference_proposals
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Contributors can insert conference proposals" ON conference_proposals
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Contributors can update own draft conference proposals" ON conference_proposals
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'draft');

CREATE INDEX IF NOT EXISTS idx_conference_proposals_status ON conference_proposals(status);
CREATE INDEX IF NOT EXISTS idx_conference_proposals_start_date ON conference_proposals(start_date);
