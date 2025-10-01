import React from 'react';
import { ArrowRight, Calendar, Users, Newspaper, Sparkles, Building2, Home } from 'lucide-react';

interface ArticleCallToActionProps {
  articleSlug: string;
}

const ArticleCallToAction: React.FC<ArticleCallToActionProps> = ({ articleSlug }) => {
  // Map specific articles to their platform destinations
  const articleDestinations: Record<string, {
    title: string;
    linkText: string;
    linkUrl: string;
    icon: any;
    bgColor: string;
    borderColor: string;
    textColor: string;
    hoverColor: string;
    logo?: string;
  }> = {
    // Article 1: BLKOUT Platform
    'default-1': {
      title: "Come Through! BLKOUTUK's Digital Home Is Open",
      linkText: "BLKOUT Platform",
      linkUrl: "https://blkout.vercel.app",
      icon: Home,
      bgColor: "bg-liberation-gold-divine/10",
      borderColor: "border-liberation-gold-divine/30",
      textColor: "text-liberation-gold-divine",
      hoverColor: "hover:bg-liberation-gold-divine/20"
    },
    // Article 2: EVENTS
    'default-2': {
      title: "EVENTS: Where Loneliness Goes to Die",
      linkText: "events-blkout.vercel.app",
      linkUrl: "https://events-blkout.vercel.app",
      icon: Calendar,
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300",
      hoverColor: "hover:bg-purple-500/20"
    },
    // Article 3: GOVERNANCE
    'default-3': {
      title: "GOVERNANCE: Real Power, Real People, Real Change",
      linkText: "Governance",
      linkUrl: "https://blkout.vercel.app/governance",
      icon: Users,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      hoverColor: "hover:bg-blue-500/20"
    },
    // Article 4: NEWS
    'default-4': {
      title: "NEWS: Our Stories, Our Power, Our Time",
      linkText: "news-blkout.vercel.app",
      linkUrl: "https://news-blkout.vercel.app",
      icon: Newspaper,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-300",
      hoverColor: "hover:bg-red-500/20"
    },
    // Article 5: IVOR
    'default-5': {
      title: "IVOR: Your Growing Digital Companion",
      linkText: "Meet IVOR",
      linkUrl: "https://blkout.vercel.app/intro",
      icon: Sparkles,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-300",
      hoverColor: "hover:bg-green-500/20"
    },
    // Article 6: BLKOUTHUB
    'default-6': {
      title: "BLKOUTHUB: Where UK Black Queer Men Finally Breathe",
      linkText: "blkouthub.com",
      linkUrl: "https://blkouthub.com",
      icon: Building2,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-300",
      hoverColor: "hover:bg-yellow-500/20",
      logo: "/blkout-logo.png"
    },
    // Article 7: PLATFORM
    'default-7': {
      title: "PLATFORM for community liberation",
      linkText: "blkout.vercel.app",
      linkUrl: "https://blkout.vercel.app",
      icon: Home,
      bgColor: "bg-liberation-gold-divine/10",
      borderColor: "border-liberation-gold-divine/30",
      textColor: "text-liberation-gold-divine",
      hoverColor: "hover:bg-liberation-gold-divine/20"
    }
  };

  const dest = articleDestinations[articleSlug];

  // If no mapping found, don't show CTA
  if (!dest) {
    return null;
  }

  const Icon = dest.icon;

  return (
    <div className="mt-16 pt-12 border-t border-liberation-silver/20">
      <a
        href={dest.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block p-8 rounded-xl border ${dest.bgColor} ${dest.borderColor} ${dest.hoverColor} transition-all`}
      >
        <div className="flex items-start gap-6">
          {dest.logo ? (
            <img src={dest.logo} alt="BLKOUTHUB" className="h-16 w-16 rounded-lg" />
          ) : (
            <div className={`p-4 rounded-lg ${dest.bgColor} border ${dest.borderColor}`}>
              <Icon className={`h-8 w-8 ${dest.textColor}`} />
            </div>
          )}

          <div className="flex-1">
            <h3 className={`text-2xl font-black ${dest.textColor} mb-3`}>
              {dest.title}
            </h3>

            <div className={`inline-flex items-center gap-2 font-bold ${dest.textColor} text-lg`}>
              {dest.linkText}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ArticleCallToAction;
