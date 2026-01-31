/**
 * Animated Liberation Grid Content
 * 9 gateway squares linking to BLKOUT platform sections
 * Each square reveals progressively, embodying "don't judge a book by its cover"
 */

export interface GridItem {
  id: number;
  heading: string;         // Max 20 characters
  description: string;     // Max 25 words
  link: string;
  linkLabel: string;
  isExternal: boolean;     // Whether link opens in new tab
  tabName?: string;        // For internal navigation
  imagePosition: { x: number; y: number }; // For collective image reveal (0-100%)
}

// The 9 gateway squares - linking to actual BLKOUT sections
export const gridItems: GridItem[] = [
  {
    id: 1,
    heading: "Our Stories",
    description: "270+ articles from the BLKOUT archive. A decade of Black queer voices, experiences, and wisdom preserved for our community.",
    link: "/stories",
    linkLabel: "Explore Archive",
    isExternal: false,
    tabName: "stories",
    imagePosition: { x: 0, y: 0 }
  },
  {
    id: 2,
    heading: "What's On",
    description: "Parties, workshops, culture nights. Find where the Black queer magic happens near you.",
    link: "https://events.blkoutuk.cloud",
    linkLabel: "View Events",
    isExternal: true,
    imagePosition: { x: 50, y: 0 }
  },
  {
    id: 3,
    heading: "Meet AIvor",
    description: "Your AI companion for the journey. Wellness support, resources, and community connection designed for Black queer men.",
    link: "/intro",
    linkLabel: "Say Hello",
    isExternal: false,
    tabName: "intro",
    imagePosition: { x: 100, y: 0 }
  },
  {
    id: 4,
    heading: "News & Culture",
    description: "Community-owned journalism centering Black queer perspectives. Stories that matter, told by us.",
    link: "https://news.blkoutuk.cloud",
    linkLabel: "Read News",
    isExternal: true,
    imagePosition: { x: 0, y: 50 }
  },
  {
    id: 5,
    heading: "Our Voices",
    description: "Fresh stories and perspectives from the community. Real experiences, authentic narratives, powerful truths.",
    link: "https://voices.blkoutuk.cloud",
    linkLabel: "Hear Voices",
    isExternal: true,
    imagePosition: { x: 50, y: 50 }
  },
  {
    id: 6,
    heading: "Own BLKOUT",
    description: "We're a cooperative. Learn about democratic ownership, governance, and how you can shape our future.",
    link: "/governance",
    linkLabel: "Join Ownership",
    isExternal: false,
    tabName: "governance",
    imagePosition: { x: 100, y: 50 }
  },
  {
    id: 7,
    heading: "The Shop",
    description: "Support the movement. Merch, resources, and community-made goods that fund our liberation work.",
    link: "/shop",
    linkLabel: "Shop Now",
    isExternal: false,
    tabName: "shop",
    imagePosition: { x: 0, y: 100 }
  },
  {
    id: 8,
    heading: "Discover",
    description: "Resources, guides, and pathways curated for your journey. Find what you need, when you need it.",
    link: "https://comms.blkoutuk.cloud/discover",
    linkLabel: "Start Exploring",
    isExternal: true,
    imagePosition: { x: 50, y: 100 }
  },
  {
    id: 9,
    heading: "About Us",
    description: "Ten years of community building. Our story, our values, and the people who make BLKOUT possible.",
    link: "/about",
    linkLabel: "Learn More",
    isExternal: false,
    tabName: "about",
    imagePosition: { x: 100, y: 100 }
  }
];

// Collective reveal - video representing Black queer community
export const collectiveVideoUrl = "/videos/onboarding/photo collage Video.mp4";

// Fallback image if video fails
export const collectiveFallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";
