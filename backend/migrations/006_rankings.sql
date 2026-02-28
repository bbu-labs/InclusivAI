-- Company rankings table: aggregated abuse scores

CREATE TABLE company_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  avg_abuse_score NUMERIC(3,1) DEFAULT 0,
  total_analyses INTEGER DEFAULT 0,
  top_issues JSONB DEFAULT '[]'::JSONB,
  last_analysis_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rankings_avg_score ON company_rankings(avg_abuse_score DESC);

CREATE TRIGGER rankings_updated_at
  BEFORE UPDATE ON company_rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
