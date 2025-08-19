-- Migration: Add post_type column to articles table
-- Run this in your Supabase SQL editor

-- Add post_type column to articles table
ALTER TABLE articles 
ADD COLUMN post_type TEXT DEFAULT 'artikel' NOT NULL;

-- Create an index for better query performance
CREATE INDEX idx_articles_post_type ON articles(post_type);

-- Update existing articles to have the default post_type
UPDATE articles 
SET post_type = 'artikel' 
WHERE post_type IS NULL;

-- Add check constraint to ensure valid post_types
ALTER TABLE articles 
ADD CONSTRAINT check_post_type 
CHECK (post_type IN (
  'artikel',
  'affärsrätt', 
  'strategi',
  'rant',
  'guide',
  'åsikt',
  'analys',
  'nyheter',
  'recension'
));