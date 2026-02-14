-- Slug-based enrollment and progress tables for file-based course system.
-- The existing UUID-based enrollments/lesson_progress tables remain untouched.

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_slug)
);

CREATE TABLE course_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_slug, lesson_slug)
);

-- Enable RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see and modify their own data
CREATE POLICY "Users can view own course enrollments"
  ON course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course enrollments"
  ON course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own course lesson progress"
  ON course_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course lesson progress"
  ON course_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course lesson progress"
  ON course_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_slug ON course_enrollments(course_slug);
CREATE INDEX idx_course_lesson_progress_user ON course_lesson_progress(user_id);
CREATE INDEX idx_course_lesson_progress_composite
  ON course_lesson_progress(user_id, course_slug);
