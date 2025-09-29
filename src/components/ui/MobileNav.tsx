import React, { useState } from 'react';
import { Menu, X, Heart, Info, Play, Vote, Calendar, Brain, Shield, PenTool } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onIVOROpen: () => void;
  isAdminAuthenticated: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  onIVOROpen,
  isAdminAuthenticated
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'liberation', label: 'Home', icon: Heart },
    { id: 'platform', label: 'Discover', icon: Play },
    { id: 'governance', label: 'Governance', icon: Vote },
    { id: 'stories', label: 'Archive', icon: Calendar },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'news', label: 'News', icon: Play },
    { id: 'voices', label: 'Voices', icon: PenTool },
    { id: 'intro', label: 'IVOR', icon: Brain },
    { id: 'about', label: 'About', icon: Info },
    { id: 'admin', label: 'Admin', icon: Shield }
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="touch-friendly p-2 text-liberation-silver hover:text-liberation-gold-divine transition-colors"
          aria-label="Open navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-liberation-black-power bg-opacity-90 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-[80vw] bg-liberation-black-power border-l border-liberation-silver border-opacity-20 overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-liberation-silver border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="/Branding and logos/BLKOUT25INV.png"
                    alt="BLKOUT"
                    className="h-6 w-auto"
                  />
                  <span className="text-xl font-bold text-liberation-gold-divine">BLKOUT</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="touch-friendly p-2 text-liberation-silver hover:text-liberation-gold-divine transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-200 touch-friendly',
                    activeTab === id
                      ? 'bg-liberation-gold-divine text-liberation-black-power font-semibold'
                      : 'text-liberation-silver hover:bg-liberation-silver hover:bg-opacity-10 hover:text-liberation-gold-divine'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}

              {/* IVOR Assistant Button */}
              <div className="pt-4 border-t border-liberation-silver border-opacity-20">
                <button
                  onClick={() => {
                    onIVOROpen();
                    setIsOpen(false);
                  }}
                  className="w-full bg-liberation-green-africa text-white p-4 rounded-lg hover:bg-opacity-80 transition-colors touch-friendly font-medium"
                >
                  Ask IVOR
                </button>

                {/* Admin Status */}
                {isAdminAuthenticated && (
                  <div className="mt-2 text-liberation-gold-divine text-sm text-center">
                    Admin Authenticated
                  </div>
                )}
              </div>
            </nav>

            {/* Community Values Footer */}
            <div className="p-4 mt-8 border-t border-liberation-silver border-opacity-20">
              <div className="text-center">
                <h3 className="text-liberation-gold-divine font-semibold mb-2">Liberation Values</h3>
                <div className="space-y-1 text-sm text-liberation-silver">
                  <div>✊🏾 Fair Creator Compensation</div>
                  <div>🗳️ Democratic Governance</div>
                  <div>💜 Trauma-Informed Design</div>
                  <div>💰 Economic Justice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;