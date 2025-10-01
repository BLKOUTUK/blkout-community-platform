-- Fix voices_articles image paths - remove spaces from folder and file names
-- Migration: 20251001_fix_voices_image_paths

UPDATE voices_articles SET hero_image = '/fallback-images/blue-images/blue-man.jpg', thumbnail_image = '/fallback-images/blue-images/blue-man.jpg' WHERE id = '7b86349b-a463-46d6-acc2-bd9f667f0550';
UPDATE voices_articles SET hero_image = '/fallback-images/red-images/red-man.jpg', thumbnail_image = '/fallback-images/red-images/red-man.jpg' WHERE id = 'd97749c3-3de6-4c15-9d3a-891719c0bc9a';
UPDATE voices_articles SET hero_image = '/fallback-images/gold-images/gold-man.jpg', thumbnail_image = '/fallback-images/gold-images/gold-man.jpg' WHERE id = '1019313e-87f9-4edf-aec6-e11bc27335e1';
UPDATE voices_articles SET hero_image = '/fallback-images/red-images/red-man.jpg', thumbnail_image = '/fallback-images/red-images/red-man.jpg' WHERE id = '082423fe-17f6-4232-8c51-45d8df5c9d3e';
UPDATE voices_articles SET hero_image = '/fallback-images/red-images/red-man.jpg', thumbnail_image = '/fallback-images/red-images/red-man.jpg' WHERE id = '8909da29-b2e8-4059-933d-3ce0571abd43';
UPDATE voices_articles SET hero_image = '/fallback-images/green-images/green-man.jpg', thumbnail_image = '/fallback-images/green-images/green-man.jpg' WHERE id = 'eb99b7bd-cc7f-4cfe-8aec-486a1bc0533d';
UPDATE voices_articles SET hero_image = '/fallback-images/gold-images/gold-man.jpg', thumbnail_image = '/fallback-images/gold-images/gold-man.jpg' WHERE id = '609f0317-2ca1-4769-bebf-239d5e2f3e02';
UPDATE voices_articles SET hero_image = '/fallback-images/blue-images/blue-man.jpg', thumbnail_image = '/fallback-images/blue-images/blue-man.jpg' WHERE id = '1f0c90a2-75d5-4d74-936e-8fac221eb252';
