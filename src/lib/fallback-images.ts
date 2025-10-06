// BLKOUT Liberation Platform - Fallback Image Utility
// Provides random fallback images from color-themed folders

/**
 * Fallback image collections organized by theme color
 * Each array contains actual existing files in public/fallback-images/
 */
export const FALLBACK_IMAGES = {
  blue: [
    '/fallback-images/blue-images/blue-man.jpg',
    '/fallback-images/blue-images/tumblr_1ede46e1d698d7cda3e61da1685ba040_7d1960ac_2048.jpg',
    '/fallback-images/blue-images/tumblr_16174aad10948dae01218ba8e82dd990_1ec97cae_1280.jpg',
    '/fallback-images/blue-images/tumblr_3729cdb3d6dc7900759b799dd088fbc5_7fd8fb01_1280.jpg',
    '/fallback-images/blue-images/tumblr_384f4870a87f4722ccfc66e8bb2fa98d_e8839690_1280.jpg',
    '/fallback-images/blue-images/tumblr_6f66259d5fb67eabf60ecd14a13aeb13_37199e34_1280.jpg',
    '/fallback-images/blue-images/tumblr_477d8815af713c7d7c0d7cb5330ffba4_c0e7416b_1280.jpg',
    '/fallback-images/blue-images/tumblr_c4b87242dc665c89e6ed09adae41d3d7_8230c31b_1280.jpg',
    '/fallback-images/blue-images/tumblr_b114bd87c0f55507de0beea8aa46be35_bef403a5_1280.jpg',
    '/fallback-images/blue-images/tumblr_aacba5b73ac23582ccfcc9cc0441d64c_09b594a4_1280.jpg',
    '/fallback-images/blue-images/tumblr_f1f8583aa35a4339bf207d5a87f9c1a1_7f34a11e_1280.jpg',
    '/fallback-images/blue-images/tumblr_e7a08505ff561abf83b9762215747aaf_5e39e0a4_1280.jpg',
    '/fallback-images/blue-images/tumblr_daca3474a5f41fc54993b6343899cda6_4fc16b28_1280.jpg',
    '/fallback-images/blue-images/tumblr_pmqtxchf3J1wgxbx5o1_1280.jpg',
    '/fallback-images/blue-images/tumblr_n7qct86vki1t95vhoo1_1280.jpg',
  ],
  red: [
    '/fallback-images/red-images/tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg',
    '/fallback-images/red-images/tumblr_19cdf90e403a0faab7bf83cf434dabdf_49f4609e_640.jpg',
    '/fallback-images/red-images/tumblr_61baa7d20ae7bdc39fce83128a90eddf_93fb7a80_1280.jpg',
    '/fallback-images/red-images/tumblr_8702ad0f24077e755a67dfa85e3a740a_2491a610_1280.jpg',
    '/fallback-images/red-images/tumblr_9283a51e59c87de5b9d9be6940a1d052_01e405d8_1280.jpg',
    '/fallback-images/red-images/tumblr_b4286b022d4b18f043bc9459b3a2e753_3592d9b5_1280.jpg',
    '/fallback-images/red-images/tumblr_ba4450bc68a5145f8a93b0e3390448de_8c6b8aa4_1280.jpg',
    '/fallback-images/red-images/tumblr_c166cf543e34f98c2dfd131c3c1b50a1_a2ecbfa5_1280.jpg',
    '/fallback-images/red-images/tumblr_c8cb29f11a02501b814b07c0e613dd96_93525cdb_2048.jpg',
    '/fallback-images/red-images/tumblr_c9de0df4b6eba59354e474ca98449bd7_749bf953_1280.jpg',
    '/fallback-images/red-images/tumblr_dd1740f17d8e9b651cad0cf5fff14c41_f6879f23_1280.jpg',
    '/fallback-images/red-images/tumblr_e58a0ab5544b553dcb0f90ef71139747_c514565c_1280.jpg',
    '/fallback-images/red-images/tumblr_e6759202374186fbc415ad3072254688_7e6ad58c_1280.jpg',
  ],
  gold: [
    '/fallback-images/gold-images/tumblr_1a0f924dc738fc40cef878489094f2d4_8441c000_1280.jpg',
    '/fallback-images/gold-images/tumblr_0426429a4a43a64e644ffaea906af64f_965dcf96_1280.jpg',
    '/fallback-images/gold-images/tumblr_13e9c17df1839c98ff6ac1e1d597d85e_450a48de_1280.jpg',
    '/fallback-images/gold-images/tumblr_507f78ed4f468b39eb59213930c132fc_32b79a76_1280.jpg',
    '/fallback-images/gold-images/tumblr_70e91327c90933d2588f9d5013f07ce4_5b0fd38b_1280.jpg',
    '/fallback-images/gold-images/tumblr_7e6887b956c6405b86f637208aba13f1_7bed5be8_1280.jpg',
    '/fallback-images/gold-images/tumblr_be4b7f8729cf3f77cc0f239b12c3f66f_54d08de7_1280.jpg',
    '/fallback-images/gold-images/tumblr_c5bc29aefae20f1a7926f765f06b9b4e_bec564dd_1280.jpg',
    '/fallback-images/gold-images/tumblr_d29c739e14d0b2f0be8f163a1ff0c349_706ecf71_1280.jpg',
    '/fallback-images/gold-images/tumblr_d3bbf823fc5703c6dfa84f7e58c54569_a6bb830a_1280.jpg',
    '/fallback-images/gold-images/tumblr_d5c0bcfba40bcdc532148a2beb98a2de_76204f5e_1280.jpg',
    '/fallback-images/gold-images/tumblr_dbfad0b11e2301010b49f08515af7c0c_6915b78d_1280.jpg',
    '/fallback-images/gold-images/tumblr_dd531bd33e29b0469b89dabc1a9e7750_6c6e9bfa_1280.jpg',
  ],
  green: [
    '/fallback-images/green-images/tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg',
    '/fallback-images/green-images/tumblr_15efa24c41cb085ad7c50b172a339851_270d4a24_1280.jpg',
    '/fallback-images/green-images/tumblr_23d169b75b247ba45ea28f5638c1d3d1_62e0d5de_640.jpg',
    '/fallback-images/green-images/tumblr_4ccb3ff837292f82d8ab03ba554e8786_0684d01c_1280.jpg',
    '/fallback-images/green-images/tumblr_4cef6df755e59e1d12b94b3978420bbe_d8acaffb_640.jpg',
    '/fallback-images/green-images/tumblr_4e0ae3da6260b5f2a88db95e97fc3524_98337141_1280.jpg',
    '/fallback-images/green-images/tumblr_983736a1752001f619860618c9abf112_3b218ac8_1280.jpg',
    '/fallback-images/green-images/tumblr_a381369d8c77ef863ca7a3b67dfc5762_6c733810_640.jpg',
    '/fallback-images/green-images/tumblr_e6f9ad80065c9c61cca5df664180fb25_ba70d864_1280.jpg',
    '/fallback-images/green-images/tumblr_mgul4bDFVJ1rvpnt3o1_1280.jpg',
    '/fallback-images/green-images/tumblr_my89rh3U3n1qe2f6oo1_540.jpg',
    '/fallback-images/green-images/tumblr_peenj5nC041qiq1o7o1_1280.jpg',
    '/fallback-images/green-images/tumblr_pl4vk8Q6Qy1uwusnmo1_640.jpg',
  ],
} as const;

/**
 * Color theme type
 */
export type FallbackImageColor = keyof typeof FALLBACK_IMAGES;

/**
 * Get a random image from a specific color folder
 * @param color - The color theme (blue, red, gold, green)
 * @returns Random image path from that color's collection
 */
export function getRandomFallbackImage(color: FallbackImageColor = 'blue'): string {
  const images = FALLBACK_IMAGES[color];
  if (!images || images.length === 0) {
    // Fallback to blue if invalid color
    return FALLBACK_IMAGES.blue[0];
  }

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

/**
 * Get the default fallback image (first blue image)
 * @returns Default fallback image path
 */
export function getDefaultFallbackImage(): string {
  return FALLBACK_IMAGES.blue[0];
}

/**
 * Infer color from category or other context
 * Maps article categories to color themes
 */
export function getColorFromCategory(category?: string): FallbackImageColor {
  if (!category) return 'blue';

  const categoryColorMap: Record<string, FallbackImageColor> = {
    opinion: 'red',
    analysis: 'blue',
    editorial: 'gold',
    community: 'green',
    liberation: 'blue',
  };

  return categoryColorMap[category.toLowerCase()] || 'blue';
}

/**
 * Get a random fallback image based on article category
 * Uses article ID or timestamp as seed for consistent-per-article randomization
 * @param category - Article category
 * @param seed - Optional seed (article ID) for deterministic selection
 * @returns Random image path matching the category's theme color
 */
export function getCategoryFallbackImage(category?: string, seed?: string): string {
  const color = getColorFromCategory(category);
  const images = FALLBACK_IMAGES[color];

  if (!images || images.length === 0) {
    return FALLBACK_IMAGES.blue[0];
  }

  // If seed provided, use it for deterministic selection (same article = same image)
  // Otherwise use random (will change on each component render)
  let index: number;

  if (seed) {
    // Simple hash function for string seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    index = Math.abs(hash) % images.length;
  } else {
    // Pure random - will change on each render/refresh
    index = Math.floor(Math.random() * images.length);
  }

  return images[index];
}
