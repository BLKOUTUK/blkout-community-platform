import React from 'react'; // Force rebuild
import { Home, Heart, Brain, Vote, Users, Info, Play, Calendar, Instagram, Twitter, Facebook, Youtube, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, currentTab }) => {
  const footerLinks = [
    { id: 'liberation', label: 'Platform', icon: Home, type: 'button' },
    { id: 'intro', label: 'IVOR', icon: Brain, type: 'button' },
    { id: 'newsroom', label: 'Newsroom', icon: ExternalLink, type: 'link', href: 'https://news-blkout.vercel.app' },
    { id: 'stories', label: 'Archive', icon: Calendar, type: 'button' },
    { id: 'community', label: 'Community', icon: Users, type: 'button' },
    { id: 'governance', label: 'Governance', icon: Vote, type: 'button' },
    { id: 'about', label: 'About', icon: Info, type: 'button' }
  ];

  return (
    <footer className="bg-liberation-black-power border-t border-liberation-sovereignty-gold/20 mt-16">
      {/* Navigation Links */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {footerLinks.map((link) =>
            link.type === 'link' ? (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-liberation-silver hover:text-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/10"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ) : (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentTab === link.id
                    ? 'bg-liberation-sovereignty-gold text-black font-bold'
                    : 'text-liberation-silver hover:text-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/10'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </button>
            )
          )}
        </div>

        {/* Platform Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => onNavigate('liberation')}
            className="bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Platform Home
          </button>
        </div>

        {/* Liberation Values */}
        <div className="border-t border-liberation-sovereignty-gold/10 pt-8">
          <div className="text-center mb-6">
            <h3 className="text-liberation-sovereignty-gold font-bold text-lg mb-3">
              LIBERATION VALUES
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-liberation-silver">
              <div className="flex items-center gap-2">
                <span>✊🏾</span>
                <span>Fair Creator Compensation</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🗳️</span>
                <span>Democratic Governance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💜</span>
                <span>Trauma-Informed Design</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>Economic Justice</span>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://instagram.com/blkoutuk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-liberation-sovereignty-gold transition-colors duration-200"
              aria-label="BLKOUT Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/blkoutuk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-liberation-sovereignty-gold transition-colors duration-200"
              aria-label="BLKOUT Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://facebook.com/blkoutuk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-liberation-sovereignty-gold transition-colors duration-200"
              aria-label="BLKOUT Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://youtube.com/@blkoutuk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-liberation-sovereignty-gold transition-colors duration-200"
              aria-label="BLKOUT YouTube"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="mailto:info@blkout.org"
              className="text-white hover:text-liberation-sovereignty-gold transition-colors duration-200"
              aria-label="Contact BLKOUT"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright and Info */}
          <div className="text-center text-sm text-liberation-silver/60">
            <p className="mb-2">
              © 2025 BLKOUT Liberation Platform - Community-Owned Technology
            </p>
            <p>
              Built by and for Black queer communities with love, rage, and liberation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;