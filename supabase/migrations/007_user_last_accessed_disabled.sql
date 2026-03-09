-- Add last_accessed_at and is_disabled to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_accessed_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_disabled boolean NOT NULL DEFAULT false;

-- Index for querying disabled users efficiently
CREATE INDEX IF NOT EXISTS profiles_is_disabled_idx ON profiles (is_disabled);
