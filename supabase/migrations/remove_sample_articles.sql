-- Remove all sample/mock articles from voices_articles table
-- This ensures only real community content is displayed

DELETE FROM voices_articles
WHERE slug IN (
  'power-of-community-owned-technology',
  'healing-justice-black-queer-spaces',
  'housing-liberation-issue',
  'black-trans-joy-resistance',
  'reimagining-public-safety'
)
OR title LIKE '%liberation technology%'
OR title LIKE '%future of%'
OR author IN ('Alex Thompson', 'Jordan Lee', 'Sam Rivera', 'Maya Johnson', 'Devon Williams');

-- Verify the table is empty and ready for real content
SELECT COUNT(*) as remaining_articles FROM voices_articles;
