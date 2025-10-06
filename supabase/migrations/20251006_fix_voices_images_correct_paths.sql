-- Fix voices_articles to use ACTUAL existing fallback images
-- Migration: 20251006_fix_voices_images_correct_paths
-- Replaces incorrect paths with real files from each color folder

-- Blue articles (blue-man.jpg exists)
UPDATE voices_articles
SET
  hero_image = '/fallback-images/blue-images/blue-man.jpg',
  thumbnail_image = '/fallback-images/blue-images/blue-man.jpg'
WHERE id = '7b86349b-a463-46d6-acc2-bd9f667f0550';

-- Red articles (pick first existing red image)
UPDATE voices_articles
SET
  hero_image = '/fallback-images/red-images/tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg',
  thumbnail_image = '/fallback-images/red-images/tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg'
WHERE id IN (
  'd97749c3-3de6-4c15-9d3a-891719c0bc9a',
  '082423fe-17f6-4232-8c51-45d8df5c9d3e',
  '8909da29-b2e8-4059-933d-3ce0571abd43'
);

-- Gold articles (pick first existing gold image)
UPDATE voices_articles
SET
  hero_image = '/fallback-images/gold-images/tumblr_1a0f924dc738fc40cef878489094f2d4_8441c000_1280.jpg',
  thumbnail_image = '/fallback-images/gold-images/tumblr_1a0f924dc738fc40cef878489094f2d4_8441c000_1280.jpg'
WHERE id IN (
  '1019313e-87f9-4edf-aec6-e11bc27335e1',
  '609f0317-2ca1-4769-bebf-239d5e2f3e02'
);

-- Green articles (pick first existing green image)
UPDATE voices_articles
SET
  hero_image = '/fallback-images/green-images/tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg',
  thumbnail_image = '/fallback-images/green-images/tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg'
WHERE id = 'eb99b7bd-cc7f-4cfe-8aec-486a1bc0533d';

-- Blue article
UPDATE voices_articles
SET
  hero_image = '/fallback-images/blue-images/blue-man.jpg',
  thumbnail_image = '/fallback-images/blue-images/blue-man.jpg'
WHERE id = '1f0c90a2-75d5-4d74-936e-8fac221eb252';
