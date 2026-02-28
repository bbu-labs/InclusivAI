-- Row Level Security policies

-- Profiles: users can read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_update ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Documents: users can CRUD their own documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_select ON documents
  FOR SELECT USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY documents_insert ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY documents_update ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY documents_delete ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Analyses: users can read their own, service_role can insert
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY analyses_select ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY analyses_insert ON analyses
  FOR INSERT WITH CHECK (TRUE);
  -- INSERT is done via service_role (bypasses RLS), but policy needed for completeness

-- Questions: users can CRUD their own
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY questions_select ON questions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY questions_insert ON questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Company rankings: public read access
ALTER TABLE company_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY rankings_select ON company_rankings
  FOR SELECT USING (TRUE);

CREATE POLICY rankings_insert ON company_rankings
  FOR INSERT WITH CHECK (TRUE);
  -- INSERT/UPDATE done via service_role

CREATE POLICY rankings_update ON company_rankings
  FOR UPDATE USING (TRUE);
