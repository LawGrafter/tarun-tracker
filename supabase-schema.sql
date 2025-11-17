-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  total_topics INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  source TEXT,
  date_studied DATE,
  comment TEXT,
  youtube_links TEXT[], -- Array of YouTube links
  attachments JSONB DEFAULT '[]'::jsonb, -- Store file URLs/metadata as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_logs table
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_topic_id ON ai_logs(topic_id);

-- Enable Row Level Security (optional, for multi-user support)
-- ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
