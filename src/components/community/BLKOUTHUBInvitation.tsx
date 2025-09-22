// BLKOUT Liberation Platform - BLKOUTHUB Invitation Component
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Community building and secure organizing
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Vote, Crown, ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface BLKOUTHUBInvitationProps {
  isVisible: boolean;
  onClose: () => void;
  userEmail?: string;
  className?: string;
}

const BLKOUTHUBInvitation: React.FC<BLKOUTHUBInvitationProps> = ({
  isVisible,
  onClose,
  userEmail,
  className
}) => {
  const handleJoinBLKOUTHUB = () => {
    const inviteUrl = userEmail
      ? `https://blkouthub.com/invitation?code=BE862C&ref=${encodeURIComponent(userEmail)}`
      : 'https://blkouthub.com/invitation?code=BE862C';

    window.open(inviteUrl, '_blank');
    onClose();
  };

  const benefits = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure Community',
      description: 'Protected space on Heartbeat.chat with verified members'
    },
    {
      icon: <Vote className="h-5 w-5" />,
      title: 'Enhanced Governance',
      description: 'Increased voting weight and proposal creation access'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Direct Connection',
      description: 'Connect with liberation organizers and community leaders'
    },
    {
      icon: <Crown className="h-5 w-5" />,
      title: 'Leadership Pathways',
      description: 'Opportunities to become community stewards and organizers'
    }
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-liberation-black-power bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-labelledby="blkouthub-invitation-title"
      aria-describedby="blkouthub-invitation-description"
    >
      <motion.div
        className={cn(
          "bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power",
          "border border-liberation-gold-divine border-opacity-30",
          "rounded-xl p-6 md:p-8 max-w-2xl w-full mx-auto",
          "text-liberation-silver",
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="w-16 h-16 bg-liberation-gold-divine rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Shield className="h-8 w-8 text-liberation-black-power" />
          </motion.div>

          <h2
            id="blkouthub-invitation-title"
            className="text-2xl md:text-3xl font-black text-liberation-gold-divine mb-2"
          >
            Join BLKOUTHUB
          </h2>

          <p
            id="blkouthub-invitation-description"
            className="text-liberation-silver opacity-90"
          >
            Our secure community on Heartbeat.chat with enhanced governance access
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-liberation-black-power bg-opacity-50 rounded-lg p-4 border border-liberation-silver border-opacity-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-liberation-gold-divine mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-liberation-gold-divine font-semibold text-sm mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-liberation-silver text-xs opacity-90">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Governance Levels */}
        <div className="bg-liberation-black-power bg-opacity-30 rounded-lg p-4 mb-6">
          <h3 className="text-liberation-gold-divine font-semibold text-sm mb-3">
            Governance Participation Levels:
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-liberation-silver rounded-full"></div>
              <span className="text-liberation-silver"><strong>Observer:</strong> Community access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-liberation-green-africa rounded-full"></div>
              <span className="text-liberation-silver"><strong>Participant:</strong> Full voting rights</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-liberation-red-liberation rounded-full"></div>
              <span className="text-liberation-silver"><strong>Organizer:</strong> Enhanced voting + proposals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-liberation-gold-divine rounded-full"></div>
              <span className="text-liberation-silver"><strong>Steward:</strong> Full governance access</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={handleJoinBLKOUTHUB}
            className="flex-1 bg-liberation-gold-divine text-liberation-black-power px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join BLKOUTHUB
            <ExternalLink className="h-4 w-4 ml-2" />
          </motion.button>

          <button
            onClick={onClose}
            className="px-6 py-3 border border-liberation-silver border-opacity-30 text-liberation-silver rounded-lg hover:bg-liberation-silver hover:bg-opacity-10 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Note */}
        <div className="mt-4 text-center">
          <p className="text-liberation-silver text-xs opacity-75">
            BLKOUTHUB membership enhances your governance participation on this platform
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BLKOUTHUBInvitation;