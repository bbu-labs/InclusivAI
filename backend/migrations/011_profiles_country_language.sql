-- Add country and language columns to profiles table
-- These were referenced in the API schema but never added to the database

ALTER TABLE profiles
  ADD COLUMN country TEXT CHECK (country IN ('BR', 'US', 'FR')),
  ADD COLUMN language TEXT CHECK (language IN ('pt-BR', 'en-US', 'fr-FR'));
