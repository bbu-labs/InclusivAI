-- RPC function to increment analyses_this_month for a user
-- Also handles monthly reset if the reset date has passed

CREATE OR REPLACE FUNCTION increment_analyses_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET
    analyses_this_month = CASE
      WHEN month_reset_at <= NOW() THEN 1
      ELSE analyses_this_month + 1
    END,
    month_reset_at = CASE
      WHEN month_reset_at <= NOW() THEN date_trunc('month', NOW()) + INTERVAL '1 month'
      ELSE month_reset_at
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
