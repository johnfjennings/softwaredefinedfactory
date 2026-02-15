-- Add course_slug column to payments table for slug-based course tracking
ALTER TABLE payments ADD COLUMN IF NOT EXISTS course_slug TEXT;

-- Index for looking up payments by course slug
CREATE INDEX IF NOT EXISTS idx_payments_course_slug ON payments(course_slug);

-- Index for looking up payments by user + course slug
CREATE INDEX IF NOT EXISTS idx_payments_user_course_slug ON payments(user_id, course_slug);

-- Allow authenticated users to read their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);
