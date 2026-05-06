/**
 * Act 5 Horizontal Scroll CTA Component
 * Multiple engagement pathways for Cards 37-39
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Layout, Heart, Instagram, Send, FileText, Video, Mic, Calendar, ExternalLink } from 'lucide-react';

interface CTAOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
  expandable?: boolean;
  subOptions?: {
    icon: React.ReactNode;
    label: string;
    link: string;
    isExternal?: boolean;
  }[];
}

const HorizontalCTAScroll: React.FC<{ cardId: number }> = ({ cardId }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const ctaOptions: CTAOption[] = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Newsletter',
      description: 'Weekly updates from the community',
      link: 'https://crm.blkoutuk.cloud/join',
      isExternal: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'BLKOUTHUB',
      description: 'Connect with the collective',
      link: 'https://blkouthub.com',
      isExternal: true
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: 'Platform',
      description: 'Explore everything we built',
      link: '/platform',
      isExternal: false
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Your Voice Matters',
      description: 'Multiple ways to participate',
      link: '#',
      expandable: true,
      subOptions: [
        {
          icon: <Instagram className="w-5 h-5" />,
          label: 'Follow @blkoutuk',
          link: 'https://instagram.com/blkoutuk',
          isExternal: true
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: 'HUB Membership',
          link: 'https://blkouthub.com',
          isExternal: true
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: 'Board Membership',
          link: '/governance',
          isExternal: false
        },
        {
          icon: <FileText className="w-5 h-5" />,
          label: 'Write with us',
          link: 'mailto:hello@blkoutuk.com?subject=I want to contribute writing',
          isExternal: true
        },
        {
          icon: <Video className="w-5 h-5" />,
          label: 'Film with us',
          link: 'mailto:hello@blkoutuk.com?subject=I want to contribute video',
          isExternal: true
        },
        {
          icon: <Mic className="w-5 h-5" />,
          label: 'Record with us',
          link: 'mailto:hello@blkoutuk.com?subject=I want to contribute audio',
          isExternal: true
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          label: 'Organize with us',
          link: 'mailto:hello@blkoutuk.com?subject=I want to help organize',
          isExternal: true
        },
        {
          icon: <Send className="w-5 h-5" />,
          label: 'Email us',
          link: 'mailto:hello@blkoutuk.com',
          isExternal: true
        }
      ]
    }
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 -mx-6 px-6">
      <div className="flex gap-4 min-w-max">
        {ctaOptions.map((option, idx) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex-shrink-0"
          >
            {option.expandable ? (
              <div className="relative">
                <button
                  onClick={() => setExpanded(expanded === option.title ? null : option.title)}
                  className="bg-liberation-pride-purple-deep/30 border-2 border-liberation-gold-divine/60 p-6 w-64 hover:border-liberation-gold-divine transition-all cursor-pointer"
                >
                  <div className="text-liberation-gold-divine mb-3">{option.icon}</div>
                  <h3 className="text-xl font-signature font-black text-white mb-2 uppercase tracking-tight">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-300">{option.description}</p>
                  <p className="text-xs text-liberation-gold-divine mt-2 font-bold uppercase tracking-wider">Click to expand →</p>
                </button>

                {expanded === option.title && option.subOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-liberation-black-power/95 backdrop-blur-sm border border-liberation-gold-divine/40 p-4 w-80 z-50"
                  >
                    <div className="space-y-2">
                      {option.subOptions.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.link}
                          target={sub.isExternal ? '_blank' : undefined}
                          rel={sub.isExternal ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-3 px-4 py-3 bg-liberation-pride-purple-deep/30 border border-liberation-gold-divine/20 hover:border-liberation-gold-divine/60 transition-all text-gray-300 hover:text-white"
                        >
                          <span className="text-liberation-gold-divine">{sub.icon}</span>
                          <span className="text-sm font-bold">{sub.label}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <a
                href={option.link}
                target={option.isExternal ? '_blank' : undefined}
                rel={option.isExternal ? 'noopener noreferrer' : undefined}
                className="block bg-liberation-pride-purple-deep/30 border-2 border-liberation-gold-divine/60 p-6 w-64 hover:border-liberation-gold-divine hover:scale-105 transition-all"
              >
                <div className="text-liberation-gold-divine mb-3">{option.icon}</div>
                <h3 className="text-xl font-signature font-black text-white mb-2 uppercase tracking-tight">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-300 mb-3">{option.description}</p>
                <div className="flex items-center gap-2 text-liberation-gold-divine text-sm font-bold uppercase tracking-wider">
                  <span>Explore</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCTAScroll;
