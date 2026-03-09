-- Activity tracking for bot detection and usage analytics
-- Feature-flagged via NEXT_PUBLIC_ACTIVITY_TRACKING_ENABLED env var

-- Main activity log table
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL = anonymous
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- page_view, auth_login, auth_signup, tool_use, blog_view, course_enroll, lesson_complete
  page_path TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_flagged to profiles for bot flagging
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS flag_reason TEXT;

-- Indexes for admin queries
CREATE INDEX idx_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_activity_log_session_id ON user_activity_log(session_id);
CREATE INDEX idx_activity_log_event_type ON user_activity_log(event_type);
CREATE INDEX idx_activity_log_created_at ON user_activity_log(created_at DESC);
CREATE INDEX idx_activity_log_ip ON user_activity_log(ip_address);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own activity
CREATE POLICY "Users can view own activity" ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone (including anon) can insert — the API route validates this server-side
-- The service role client is used in the API route, bypassing RLS for writes
-- No public insert policy needed since writes go through the service role
