-- Fix missing RLS policies on subscribers table.
-- The table had RLS enabled with only an INSERT policy, so SELECT and UPDATE
-- operations (needed for unsubscribe and duplicate-check) were blocked.

-- Allow API routes to read subscribers (for duplicate checking and unsubscribe lookup)
CREATE POLICY "Service can read subscribers"
  ON subscribers FOR SELECT
  USING (true);

-- Allow API routes to update subscribers (for unsubscribe and resubscribe)
CREATE POLICY "Service can update subscribers"
  ON subscribers FOR UPDATE
  USING (true);
