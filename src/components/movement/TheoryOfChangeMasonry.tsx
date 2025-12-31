/**
 * Theory of Change v2.0 - Masonry Grid Layout
 * Inspired by Grindr Unwrapped and MasonryScrollytelling
 * Multi-column responsive grid with hero video breaks
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, ExternalLink } from 'lucide-react';
import HorizontalCTAScroll from './HorizontalCTAScroll';

interface Card {
  id: number;
  type: 'statement' | 'interactive' | 'beauty' | 'disclaimer';
  size: 'small' | 'medium' | 'large' | 'hero';
  imageUrl?: string;
  videoUrl?: string;      // For inline video cards
  bgGradient: string;
  content: {
    title?: string;         // Primary heading (largest)
    heading2?: string;      // Secondary heading
    subtitle?: string;      // Supporting text above main
    body?: string;          // Main text
    highlight?: string;     // Emphasis text below main
  };
  interactive?: {
    type: 'poll' | 'reveal' | 'wordcloud';
    data?: any;
  };
  cta?: {
    text: string;
    link: string;
    color?: 'amber' | 'fuchsia';
  };
  // Dynamic enhancements
  animationType?: 'slide' | 'bounce' | 'reveal' | 'stagger' | 'default';
  aspectRatio?: 'tall' | 'standard' | 'squat';
  textPosition?: 'bottomLeft' | 'topRight' | 'center' | 'topLeft';
  purpleIntensity?: number; // 0-100, for overlay strength
}

// Animation variants for dynamism
const cardAnimations = {
  slide: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, y: 50, rotate: -5 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { type: "spring", stiffness: 200, damping: 15 }
  },
  reveal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" }
  },
  stagger: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, staggerChildren: 0.1 }
  },
  default: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
};

// Aspect ratio classes
const aspectClasses = {
  tall: 'aspect-[9/16]',      // Instagram Story style
  standard: 'aspect-[4/5]',    // Default
  squat: 'aspect-[16/9]'       // Landscape
};

// Masonry size classes (RESTORE row-span to prevent overlap)
const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
  hero: 'col-span-2 row-span-3 md:col-span-3 md:row-span-4 lg:col-span-4 lg:row-span-4'
};

// Mobile-optimized heights
const heightClasses = {
  small: 'h-[300px] md:h-[350px]',
  medium: 'h-[450px] md:h-[500px]',
  large: 'h-[550px] md:h-[650px]',
  hero: 'h-[70vh] md:h-[80vh]'
};

// Text positioning with balanced layouts and 35% padding
const getTextPosition = (position?: string, hasTopAndBottom?: boolean) => {
  const basePadding = 'px-[35%]'; // 35% in from edges

  if (hasTopAndBottom) {
    // Split layout: content at top, CTA at bottom
    return 'justify-between';
  }

  switch(position) {
    case 'topRight': return `items-start justify-end text-right pr-8 pt-8`;
    case 'topLeft': return `items-start justify-start text-left pl-8 pt-8`;
    case 'center': return 'items-center justify-center text-center px-8';
    case 'bottomRight': return `items-end justify-end text-right pr-8 pb-8`;
    default: return `items-end justify-start text-left pl-8 pb-8`; // bottomLeft
  }
};

// Card component for masonry grid
const MasonryCard: React.FC<{ card: Card; index: number }> = ({ card, index }) => {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // Get animation variant
  const animation = cardAnimations[card.animationType || 'default'];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl group ${sizeClasses[card.size]}`}
      {...animation}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background: Image, Video, or Gradient */}
      {card.videoUrl ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video
            src={card.videoUrl}
            className="w-full h-full object-contain"
            style={{ aspectRatio: '4/5' }}
            loop
            playsInline
            controls
            preload="metadata"
          />
        </div>
      ) : card.imageUrl ? (
        <div className="absolute inset-0">
          <img
            src={card.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Purple overlay for brand cohesion */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-fuchsia-500/15 to-transparent mix-blend-overlay pointer-events-none" />
          {/* Sexy purple glow */}
          <div className="absolute inset-0 bg-purple-500/10 blur-xl pointer-events-none" />
          {/* Text readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient}`} />
      )}

      {/* Content with dynamic positioning - split if CTA exists */}
      <div className={`relative z-10 h-full flex flex-col ${getTextPosition(card.textPosition, !!card.cta)}`}>
        {/* Top content area */}
        <div className={`${card.cta ? 'pt-8 pb-8' : 'py-8'} px-[12%]`}>
        {/* Subtitle (small, uppercase, accent color) */}
        {card.content.subtitle && (
          <motion.p className="text-amber-400 text-xs md:text-sm font-mono uppercase tracking-widest mb-2">
            {card.content.subtitle}
          </motion.p>
        )}

        {/* Title (primary heading - largest) */}
        {card.content.title && (
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
          >
            {card.content.title}
          </motion.h1>
        )}

        {/* Heading2 (secondary heading) */}
        {card.content.heading2 && (
          <motion.h2
            className="text-xl md:text-2xl font-bold text-purple-100 uppercase tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
          >
            {card.content.heading2}
          </motion.h2>
        )}

        {/* Body (main text - NOT uppercase, smaller) */}
        {card.content.body && (
          <motion.p
            className="text-lg md:text-xl lg:text-2xl font-semibold text-white leading-snug mb-4"
            style={{ fontFamily: "'Arial', sans-serif" }}
          >
            {card.content.body}
          </motion.p>
        )}

        {/* Highlight (emphasis text below) */}
        {card.content.highlight && (
          <p className="text-base md:text-lg lg:text-xl text-purple-200 font-light leading-relaxed italic">
            {card.content.highlight}
          </p>
        )}

        {/* Interactive elements */}
        {card.interactive?.type === 'poll' && (
          <div className="mt-4 space-y-2">
            {card.interactive.data.options.map((option: string) => (
              <button
                key={option}
                onClick={(e) => { e.stopPropagation(); setSelected(option); }}
                className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selected === option
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-purple-900/50 text-purple-100 hover:bg-purple-800/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {card.interactive?.type === 'reveal' && (
          <button
            onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all"
          >
            {revealed ? card.interactive.data.revealed : 'Click to reveal →'}
          </button>
        )}

        {card.interactive?.type === 'wordcloud' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {card.interactive.data.topics.map((topic: string) => (
              <button
                key={topic}
                onClick={(e) => { e.stopPropagation(); setSelected(topic); }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selected === topic
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-purple-900/50 text-purple-100 hover:bg-purple-800/50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        </div>

        {/* Bottom CTA area - separated for visual balance */}
        {card.cta && (
          <div className="pb-8 px-[12%]">
            <a
              href={card.cta.link}
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 ${
                card.cta.color === 'fuchsia'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-black'
              }`}
            >
              {card.cta.text} →
            </a>

            {/* HorizontalCTAScroll for cards 37-38 */}
            {(card.id === 37 || card.id === 38) && (
              <div className="mt-8">
                <HorizontalCTAScroll cardId={card.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Hero Video Break component
const HeroVideoBreak: React.FC<{ title: string; subtitle: string; videoUrl?: string }> = ({ title, subtitle, videoUrl }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black my-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-black opacity-50" />
      <div className="relative z-10 text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-black text-white uppercase mb-6"
          style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-amber-400 font-bold"
        >
          {subtitle}
        </motion.p>
        {/* Video player or placeholder */}
        <div className="mt-12 w-full max-w-4xl mx-auto aspect-video bg-purple-950/30 rounded-2xl border border-purple-700/50 overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-purple-400 text-sm">Video Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function TheoryOfChangeMasonry() {
  // Elegant disclaimer - non-obstructive
  const DisclaimerNote = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl"
    >
      <div className="bg-purple-950/90 backdrop-blur-sm border border-purple-700/50 rounded-full px-6 py-3 shadow-lg">
        <p className="text-xs text-purple-300 text-center">
          <span className="font-semibold">Imagery:</span> AI-generated (Wan 2.6, Gemini 3) •
          <span className="text-purple-400"> Real photos in select cards</span>
        </p>
      </div>
    </motion.div>
  );

  // ACT 1: Recognition (Cards 1-10)
  const act1Cards: Card[] = [
    {
      id: 1,
      type: 'statement',
      size: 'hero',
      imageUrl: '/images/theory-of-change/card-01-isolation.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        subtitle: 'THE RECOGNITION',
        body: 'You are often the \'only Black Queer Man in the village\'',
        highlight: 'but even in spaces full of us you can feel alone'
      },
      animationType: 'slide',
      aspectRatio: 'tall',
      textPosition: 'bottomLeft'
    },
    {
      id: 2,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-02-recognition.png',
      bgGradient: 'from-purple-950 to-violet-950',
      content: {
        subtitle: 'me too',
        title: 'same'
      },
      animationType: 'bounce',
      textPosition: 'center'
    },
    {
      id: 2.5,
      type: 'beauty',
      size: 'small',
      imageUrl: '/images/theory-backgrounds-resized/spiderman-meme.png',
      bgGradient: 'from-purple-900 to-indigo-900',
      content: {}
    },
    {
      id: 2.6,
      type: 'beauty',
      size: 'small',
      imageUrl: '/images/theory-of-change/silhouette letters white rgb.png',
      bgGradient: 'from-purple-950 to-indigo-950',
      content: {}
    },
    {
      id: 2.75,
      type: 'statement',
      size: 'large',
      bgGradient: 'from-purple-950 via-violet-950 to-indigo-950',
      content: {
        subtitle: 'BY DESIGN',
        title: 'Societies pass on knowledge between generations',
        highlight: 'They actively teach young people what it is to be a "good man", with mixed results. Schools, families, churches, mosques, police, newspapers, adverts shape and reinforce views. Many of the same institutions that a generation ago were the most active in denying us knowledge of what it is to be a queer man.',
        body: 'We are left to our own devices. Smartphones usually!'
      }
    },
    {
      id: 3,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-03-wondering.png',
      bgGradient: 'from-fuchsia-950 to-purple-950',
      content: {
        body: 'Many of us have to search for evidence that we exist',
        highlight: 'Imagine growing up without being taught to fear us'
      },
      animationType: 'default',
      aspectRatio: 'tall',
      textPosition: 'topLeft'
    },
    {
      id: 4,
      type: 'interactive',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-04-poll.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        body: 'How many Black queer men could you call on in a crisis?',
        highlight: '(Booty calls may be urgent, but they don\'t count.)'
      },
      interactive: {
        type: 'poll',
        data: { options: ['0', '1-2', '3-5', 'Squad deep'] }
      },
      animationType: 'default',
      textPosition: 'bottomRight'
    },
    {
      id: 5,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-05-one-or-fewer.png',
      bgGradient: 'from-purple-950 to-fuchsia-950',
      content: {
        subtitle: 'when we asked, you said:',
        body: '1 or fewer',
        highlight: 'And that includes the GC: banter that\'s been on mute since 2019.'
      },
      animationType: 'default',
      textPosition: 'topRight'
    },
    {
      id: 6,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-06-proximity.png',
      bgGradient: 'from-violet-950 to-purple-950',
      content: {
        title: 'That\'s not community.',
        body: 'That\'s just proximity.',
        highlight: 'Funny fake names, borrowed pics, unclear motives'
      }
    },
    {
      id: 7,
      type: 'beauty',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-07-survive-alone.png',
      bgGradient: 'from-fuchsia-600 to-purple-600',
      content: {
        title: 'We\'ve learned to survive alone together.'
      },
      cta: { text: 'In The Picture: Loneliness Report', link: 'https://blkoutuk.com/in-the-picture', color: 'amber' }
    },
    {
      id: 7.5,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/survival is a good start.png',
      bgGradient: 'from-violet-950 to-purple-950',
      content: {
        title: 'Survival is a good start.',
        body: 'If we want to thrive',
        highlight: '"alone together" is not enough.'
      }
    },
    {
      id: 8,
      type: 'interactive',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-08-old-story.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        title: 'What we\'ve been told'
      },
      interactive: {
        type: 'reveal',
        data: { revealed: 'if you can\'t love yourself, how you goanna love somebody else?' }
      }
    },
    {
      id: 8.5,
      type: 'beauty',
      size: 'large',
      imageUrl: '/images/theory-of-change/RupaulAmen.gif',
      bgGradient: 'from-fuchsia-600 to-pink-600',
      content: {}
    },
    {
      id: 8.75,
      type: 'statement',
      size: 'medium',
      bgGradient: 'from-purple-950 to-violet-950',
      content: {
        body: 'Hold on a minute, Ru'
      }
    },
    {
      id: 9,
      type: 'statement',
      size: 'hero',
      imageUrl: '/images/theory-of-change/card-09-inversion.png',
      bgGradient: 'from-purple-950 to-fuchsia-950',
      content: {
        subtitle: 'you\'ve missed a step',
        title: 'We are...',
        heading2: 'Each others\' missing link',
        body: 'Loving ourselves is learned through community. Self-love requires both personal growth and collective healing. Loving who we are requires empathy and care - not just solo endeavour',
        highlight: 'Without community, there is no love, and no liberation'
      }
    },
    {
      id: 10,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-10-backwards.png',
      bgGradient: 'from-fuchsia-950 to-violet-950',
      content: {
        body: 'Choose freedom'
      },
      cta: { text: 'Join our next gathering', link: 'https://events.blkoutuk.cloud', color: 'amber' }
    }
  ];

  // ACT 2: The Problem (Cards 11-17)
  const act2Cards: Card[] = [
    { id: 11, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-11-geography.png', bgGradient: 'from-indigo-950 to-purple-950', content: { body: 'Racism and patriarchy don\'t just harm our life chances,', highlight: 'they keep us from healing by cutting us off from each other' }, animationType: 'slide', textPosition: 'topLeft' },
    { id: 12, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-12-cascade.png', bgGradient: 'from-purple-950 to-violet-950', content: { body: 'Without each other: We can\'t know ourselves' }, animationType: 'default', textPosition: 'bottomRight' },
    { id: 12.5, type: 'beauty', size: 'small', imageUrl: '/images/theory-of-change/silhouette letters black.png', bgGradient: 'from-indigo-950 to-purple-950', content: {} },
    { id: 13, type: 'beauty', size: 'large', imageUrl: '/images/theory-of-change/card-13-app.png', bgGradient: 'from-violet-950 to-purple-950', content: {} },
    { id: 13.5, type: 'statement', size: 'small', bgGradient: 'from-violet-950 to-purple-950', content: { body: 'No face, no case, no intimacy', subtitle: 'The apps reward sharing as little of yourself as possible to get what you want, not what you need' }, textPosition: 'center', animationType: 'default' },
    { id: 14, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-14-club.png', bgGradient: 'from-purple-950 to-indigo-950', content: { body: 'You can\'t know yourself in isolation.', highlight: 'The self is relational.' }, animationType: 'stagger', aspectRatio: 'tall', textPosition: 'center' },
    { id: 15, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-15-group-chat.png', bgGradient: 'from-indigo-600 to-purple-600', content: { subtitle: 'we think we are brand new.', body: 'Black queer folk always existed. Thrived. Built community.', highlight: 'An inconvenient truth erased from our history to hold back our future.' }, animationType: 'default', textPosition: 'topLeft' },
    { id: 16, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/video1-scene2-invisible-walls.png', bgGradient: 'from-violet-950 to-purple-950', content: { body: 'We are scattered, scrolling from behind faceless profiles, lurking in the GC.', subtitle: 'We are that funny guy at work, free HR consultant, seen on the recruitment promotion still unpromoted', highlight: 'Not being able to find each other means all of us are lost' }, textPosition: 'bottomLeft' },
    { id: 17, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-17-dont-know.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { subtitle: 'Our differences are a strength, not a problem.', body: 'Together we represent riches we can learn to treasure.', highlight: 'Solidarity is a habit, it takes practice' }, cta: { text: 'BLKOUT newsroom; in our stories we are headliners', link: '/stories', color: 'amber' }, animationType: 'reveal', aspectRatio: 'tall', textPosition: 'center' }
  ];

  // ACT 3: What We're Building (Cards 19-26, 28)
  const act3Cards: Card[] = [
    { id: 19, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-25-infrastructure.png', bgGradient: 'from-purple-950 to-indigo-950', content: { body: 'So we\'re building: Space to be we', highlight: 'Space to be free' }, animationType: 'stagger', aspectRatio: 'tall', textPosition: 'center' },
    { id: 21, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-21-gatherings.png', bgGradient: 'from-fuchsia-600 to-purple-600', content: { body: 'we\'re getting social', highlight: 'Real conversations. Shared experiences.' }, cta: { text: 'See what\'s happening', link: 'https://events.blkoutuk.cloud', color: 'amber' }, animationType: 'reveal', textPosition: 'bottomLeft' },
    { id: 22, type: 'interactive', size: 'large', imageUrl: '/images/theory-of-change/card-22-wordcloud.png', bgGradient: 'from-indigo-950 to-purple-950', content: { body: 'talking de tings:' }, interactive: { type: 'wordcloud', data: { topics: ['Family', 'Sex', 'Money', 'Health', 'Faith', 'Fear', 'Joy', 'Aging', 'Love', 'Loneliness', 'Dreams', 'Rage', 'Healing'] }}, animationType: 'default', textPosition: 'topLeft' },
    { id: 23, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-23-connection.png', bgGradient: 'from-purple-950 to-violet-950', content: { body: 'Connecting, not networking', highlight: 'No transaction required.' }, cta: { text: 'Join the conversation', link: 'https://events.blkoutuk.cloud', color: 'amber' }, animationType: 'bounce', textPosition: 'topRight' },
    { id: 24, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-24-articles.png', bgGradient: 'from-violet-950 to-purple-950', content: { body: 'storytelling', highlight: '8 years building our archive. Telling our stories on our terms' }, cta: { text: 'Read the archive', link: '/stories', color: 'amber' }, animationType: 'reveal', textPosition: 'bottomRight' },
    { id: 26, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-26-map.png', bgGradient: 'from-purple-950 to-indigo-950', content: { body: 'From London to Bristol to Manchester', highlight: 'Finding each other' }, cta: { text: 'Connect locally', link: 'https://events.blkoutuk.cloud', color: 'amber' }, animationType: 'default', textPosition: 'bottomLeft' },
    { id: 27, type: 'beauty', size: 'small', imageUrl: '/images/theory-of-change/silhouette letters white rgb.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: {} },
    { id: 28, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-28-digital-human.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { subtitle: 'IVOR: Your AI companion', body: 'Each one, Teach one. Built by us to understand our experiences', highlight: 'Tech that serves, not surveils' }, cta: { text: 'Meet IVOR', link: 'https://ivor.blkoutuk.cloud', color: 'amber' }, animationType: 'reveal', textPosition: 'topRight' }
  ];

  // ACT 4: The Core (Cards 30-33)
  const act4Cards: Card[] = [
    { id: 30, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-30-isolation.png', bgGradient: 'from-indigo-950 to-purple-950', content: { body: 'Activism focused on the freedom to love', highlight: 'Today, our actions turn love into liberation.' }, animationType: 'default', textPosition: 'topLeft' },
    { id: 31, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-31-problem-is-us.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { body: 'Sexual identity is not a choice', highlight: 'But choosing love is' }, animationType: 'default', textPosition: 'bottomRight' },
    { id: 32, type: 'beauty', size: 'large', imageUrl: '/images/theory-of-change/card-32-never-us.png', bgGradient: 'from-violet-600 to-purple-600', content: { body: 'Tenderness is a political act. Black queer joy is revolutionary' }, cta: { text: 'BLKOUT is different, it\'s ours', link: '/governance', color: 'amber' }, animationType: 'reveal', textPosition: 'bottomLeft' },
    { id: 32.5, type: 'beauty', size: 'large', videoUrl: '/videos/Making Space For What.mp4', bgGradient: 'from-purple-950 to-indigo-950', content: {} },
    { id: 33, type: 'interactive', size: 'hero', imageUrl: '/images/theory-of-change/card-33-show-up.png', bgGradient: 'from-purple-950 to-violet-950', content: { body: 'How do you show up?', highlight: 'Community is not a tick box, it\'s what you do' }, interactive: { type: 'poll', data: { options: ['I bring food', 'I show up', 'I listen', 'I fight', 'I laugh', 'I remember'] }}, animationType: 'stagger', aspectRatio: 'tall', textPosition: 'center'}
  ];

  // ACT 5: The Invitation (Cards 35-38)
  const act5Cards: Card[] = [
    { id: 35, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-35-structural-damage.png', bgGradient: 'from-indigo-950 to-purple-950', content: { subtitle: 'Liberation Is', body: 'Freedom from harm', highlight: 'using our power to resist and dismantle injustice' }, animationType: 'stagger', aspectRatio: 'tall', textPosition: 'center' },
    { id: 36, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-36-relational-repair.png', bgGradient: 'from-purple-950 to-violet-950', content: { subtitle: 'Liberation Is', body: 'Freedom to imagine better', highlight: 'using our power to create the new' }, animationType: 'default', textPosition: 'topRight' },
    { id: 36.5, type: 'beauty', size: 'large', videoUrl: '/videos/baldwinscroll.mp4', bgGradient: 'from-purple-950 to-indigo-950', content: {} },
    { id: 37, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-37-liberation.png', bgGradient: 'from-violet-950 to-purple-950', content: { body: 'What does liberation look like?', highlight: 'You.' }, cta: { text: 'Get the newsletter', link: 'https://crm.blkoutuk.cloud/api/community/join', color: 'amber' }, animationType: 'reveal', aspectRatio: 'tall', textPosition: 'center' },
    { id: 38, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-38-damage-repair.png', bgGradient: 'from-purple-950 to-indigo-950', content: { subtitle: 'THE THESIS', body: 'The damage is structural. The repair is relational.', highlight: 'This is the work. This is the joy.' }, cta: { text: 'Explore the platform', link: '/platform', color: 'amber' }, animationType: 'stagger', aspectRatio: 'tall', textPosition: 'center' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 z-50" />

      {/* Ticker Header - below nav menu */}
      <div className="fixed top-1 left-0 right-0 z-10 overflow-hidden bg-black/80 backdrop-blur-sm">
        <motion.div
          className="flex whitespace-nowrap py-2"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs font-mono uppercase tracking-widest text-gray-400 mx-8">
              LIBERATION • COMMUNITY • POWER • HEALING • CONNECTION • COLLECTIVE •
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Introduction with User Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Hero Video Background */}
        <div className="absolute inset-0">
          <video
            src="/videos/Blkoutheronumber1.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          {/* Dark overlay for scroll prompt visibility */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
        >
          <p className="text-white text-sm animate-pulse drop-shadow-lg">
            Scroll to begin ↓
          </p>
        </motion.div>
      </section>

      {/* Elegant Disclaimer - Bottom overlay */}
      <DisclaimerNote />

      {/* Main Content */}
      <main className="pt-0">
        {/* ACT 1: Recognition - Masonry Grid (Cards 1-7) */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act1Cards.filter(c => c.id <= 7).map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* LORDE VIDEO: Single column width (decorative) */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-md">
            <div className="relative overflow-hidden rounded-2xl" style={{ height: '750px' }}>
              <video
                src="/videos/Lordescroll.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                controls
                preload="metadata"
              />
            </div>
          </div>
        </section>

        {/* Continue Act 1 (Cards 7.5-10) */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act1Cards.filter(c => c.id > 7).map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* WELCOME VIDEO: Full width across columns (decorative) */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            <div className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2 relative overflow-hidden rounded-2xl">
              <video
                src="/videos/Welcome BLKOUT TV.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                controls
                preload="metadata"
              />
            </div>
          </div>
        </section>

        {/* ACT 2: The Problem - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act2Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* VIDEO BREAK 2: Heroes */}
        <HeroVideoBreak
          title="Heroes"
          subtitle="The team assembles"
          videoUrl="/videos/Welcome BLKOUT TV.mp4"
        />

        {/* ACT 3: What We're Building - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act3Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* ACT 4: The Core - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act4Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* ACT 5: The Invitation - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act5Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* LANDING: 3 Primary CTAs */}
        <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-950 to-black py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>What's Next?</h2>
              <p className="text-xl md:text-2xl text-purple-300 font-light">Choose your path into the collective</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.a href="https://crm.blkoutuk.cloud/api/community/join" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-8 hover:scale-105 transition-all">
                <div className="text-black"><img src="/images/squared/BLKOUTiconBLACK.png" alt="BLKOUT" className="w-16 h-16 mb-4" /><h3 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>Stay in Touch</h3><p className="text-lg font-semibold mb-4">Newsletter</p><p className="text-sm opacity-80">Weekly updates from the collective</p></div>
              </motion.a>
              <motion.a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-2xl p-8 hover:scale-105 transition-all">
                <div className="text-white"><img src="/images/blkouthub_logo.png" alt="BLKOUTHUB" className="w-auto h-16 mb-4" /><h3 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>Get Connected</h3><p className="text-lg font-semibold mb-4">Join the BLKOUTHUB</p><p className="text-sm opacity-90">Active membership. Real gatherings.</p></div>
              </motion.a>
              <motion.a href="/platform" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 hover:scale-105 transition-all">
                <div className="text-white"><img src="/images/squared/BLKOUTiconWHITE.png" alt="BLKOUT" className="w-16 h-16 mb-4" /><h3 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>Learn</h3><p className="text-lg font-semibold mb-4">Explore Resources</p><p className="text-sm opacity-90">280+ articles, Events, IVOR AI</p></div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* POST-CREDIT: OOMF Interactive */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black py-24">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-center px-4 max-w-6xl w-full">
            <p className="text-sm text-purple-600 uppercase tracking-widest mb-8">One more thing...</p>

            {/* OOMF Crew Image */}
            <div className="mb-12">
              <img src="/images/theory-of-change/the oomf crew.jpg" alt="The OOMF Crew" className="max-w-2xl mx-auto rounded-2xl" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-4" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>We're the heroes we've been waiting for</h2>
            <p className="text-xl md:text-2xl text-amber-400 font-bold mb-12">Now put yourself in the story</p>

            <div className="w-full max-w-3xl mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-700/50" style={{ paddingBottom: '125%' }}>
                <iframe src="https://blkoutuk.github.io/OOMF_Interactive/" className="absolute inset-0 w-full h-full" title="Create Your Hero Panel" allow="camera; microphone" sandbox="allow-same-origin allow-scripts allow-forms allow-popups" />
              </div>
            </div>
            <a href="https://blkoutuk.github.io/OOMF_Interactive/" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300">Having trouble? Open in new tab →</a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-purple-900/30 py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-white font-bold mb-4 uppercase">Platform</h4>
                <ul className="space-y-2 text-purple-300 text-sm">
                  <li><a href="https://events.blkoutuk.cloud" className="hover:text-white">Events</a></li>
                  <li><a href="/stories" className="hover:text-white">Archive</a></li>
                  <li><a href="https://ivor.blkoutuk.cloud" className="hover:text-white">IVOR AI</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 uppercase">Community</h4>
                <ul className="space-y-2 text-purple-300 text-sm">
                  <li><a href="https://blkouthub.com" className="hover:text-white">BLKOUTHUB</a></li>
                  <li><a href="/governance" className="hover:text-white">Governance</a></li>
                  <li><a href="/platform" className="hover:text-white">Platform</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 uppercase">Connect</h4>
                <ul className="space-y-2 text-purple-300 text-sm">
                  <li><a href="https://instagram.com/blkoutuk" className="hover:text-white">Instagram</a></li>
                  <li><a href="https://twitter.com/blkoutuk" className="hover:text-white">Twitter/X</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 uppercase">BLKOUT UK</h4>
                <p className="text-purple-400 text-sm">Community-owned liberation platform</p>
                <p className="text-purple-600 text-xs mt-4">© 2025 BLKOUT UK Cooperative</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Share Button */}
        <button
          className="fixed top-20 right-8 z-50 w-12 h-12 bg-purple-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-800/80 transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </main>
    </div>
  );
}
