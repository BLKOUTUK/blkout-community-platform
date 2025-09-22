// BLKOUT Liberation Platform - BLKOUTHUB Benefits Display Component
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Community recognition and governance transparency
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Crown, Users, Eye, ExternalLink,
  Vote, MessageSquare, TrendingUp, Heart,
  Star, Award, Sparkles, Lock
} from 'lucide-react';
import { cn } from '@/lib/liberation-utils';
import type { BLKOUTHUBMember, GovernancePermissions } from '@/services/blkouthub-integration';
import BLKOUTHUBMemberBadge from './BLKOUTHUBMemberBadge';

interface BLKOUTHUBBenefitsDisplayProps {
  member: BLKOUTHUBMember;
  permissions: GovernancePermissions;
  displayMode?: 'full' | 'compact' | 'card';
  showJoinButton?: boolean;
  onJoinBLKOUTHUB?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

const BLKOUTHUBBenefitsDisplay: React.FC<BLKOUTHUBBenefitsDisplayProps> = ({
  member,
  permissions,
  displayMode = 'full',
  showJoinButton = false,
  onJoinBLKOUTHUB,
  onViewProfile,
  className
}) => {
  const getBenefitsByLevel = () => {
    const baseBenefits = [
      {
        icon: <Shield className="h-5 w-5" />,
        title: 'Secure Community Access',
        description: 'Protected space on Heartbeat.chat with verified members',
        available: true,
        level: 'observer'
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Direct Community Connection',
        description: 'Connect with liberation organizers and community leaders',
        available: true,
        level: 'observer'
      }
    ];

    const enhancedBenefits = [
      {
        icon: <Vote className="h-5 w-5" />,
        title: 'Enhanced Voting Rights',
        description: `${permissions.votingWeight}x voting weight on platform decisions`,
        available: permissions.canVote,
        level: 'participant'
      },
      {
        icon: <MessageSquare className="h-5 w-5" />,
        title: 'Proposal Creation',
        description: 'Create and submit proposals for community consideration',
        available: permissions.canPropose,
        level: 'organizer'
      },
      {
        icon: <Crown className="h-5 w-5" />,
        title: 'Moderation Tools',
        description: 'Community stewardship and moderation capabilities',
        available: permissions.canModerate,
        level: 'steward'
      },
      {
        icon: <TrendingUp className="h-5 w-5" />,
        title: 'Financial Transparency',
        description: 'Access to community financial reports and budget planning',
        available: permissions.canAccessFinancials,
        level: 'steward'
      }
    ];

    return [...baseBenefits, ...enhancedBenefits];
  };

  const getProgressToNextLevel = () => {
    const levels = ['observer', 'participant', 'organizer', 'steward'];
    const currentIndex = levels.indexOf(member.governanceLevel);
    const nextLevel = levels[currentIndex + 1];

    if (!nextLevel) return null;

    const requirements = {
      participant: 'Active community participation for 30+ days',
      organizer: 'Leadership in community initiatives and voting history',
      steward: 'Community nomination and consensus approval'
    };

    return {
      nextLevel,
      requirement: requirements[nextLevel as keyof typeof requirements]
    };
  };

  const renderCompactView = () => (
    <div className={cn(
      'bg-gradient-to-r from-liberation-gold-divine to-liberation-red-liberation',
      'text-liberation-black-power rounded-lg p-4 flex items-center justify-between',
      className
    )}>
      <div className="flex items-center space-x-3">
        <Crown className="h-6 w-6" />
        <div>
          <div className="font-bold">BLKOUTHUB Member</div>
          <div className="text-sm opacity-80">{member.governanceLevel} • {permissions.votingWeight}x Vote Weight</div>
        </div>
      </div>
      {onViewProfile && (
        <button
          onClick={onViewProfile}
          className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm">View Benefits</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const renderCardView = () => (
    <motion.div
      className={cn(
        'bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power',
        'border border-liberation-gold-divine border-opacity-30 rounded-xl p-6',
        'text-liberation-silver max-w-md',
        className
      )}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-4">
        <BLKOUTHUBMemberBadge
          member={member}
          permissions={permissions}
          showFullDetails={false}
          className="justify-center"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-liberation-gold-divine font-bold text-center">
          Your BLKOUTHUB Benefits
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {getBenefitsByLevel().filter(b => b.available).slice(0, 4).map((benefit, index) => (
            <div key={index} className="text-center p-2 bg-liberation-black-power bg-opacity-30 rounded">
              <div className="text-liberation-gold-divine mb-1 flex justify-center">
                {benefit.icon}
              </div>
              <div className="text-xs font-medium">{benefit.title}</div>
            </div>
          ))}
        </div>

        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="w-full bg-liberation-gold-divine text-liberation-black-power py-2 rounded font-semibold hover:bg-opacity-90 transition-colors"
          >
            View All Benefits
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderFullView = () => (
    <div className={cn(
      'bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power',
      'border border-liberation-gold-divine border-opacity-30 rounded-xl p-6 md:p-8',
      'text-liberation-silver',
      className
    )}>
      {/* Header with Member Status */}
      <div className="text-center mb-6">
        <motion.div
          className="w-20 h-20 bg-liberation-gold-divine rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Crown className="h-10 w-10 text-liberation-black-power" />
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-black text-liberation-gold-divine mb-2">
          BLKOUTHUB Member Benefits
        </h2>

        <BLKOUTHUBMemberBadge
          member={member}
          permissions={permissions}
          showFullDetails={true}
        />
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {getBenefitsByLevel().map((benefit, index) => (
          <motion.div
            key={benefit.title}
            className={cn(
              'p-4 rounded-lg border',
              benefit.available
                ? 'bg-liberation-green-africa bg-opacity-20 border-liberation-green-africa text-liberation-green-africa'
                : 'bg-liberation-black-power bg-opacity-30 border-liberation-silver border-opacity-20 text-liberation-silver opacity-60'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                'mt-1',
                benefit.available ? 'text-liberation-green-africa' : 'text-liberation-silver opacity-60'
              )}>
                {benefit.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm">
                    {benefit.title}
                  </h3>
                  {benefit.available && (
                    <div className="flex items-center">
                      <Sparkles className="h-3 w-3 text-liberation-gold-divine" />
                      <span className="text-xs text-liberation-gold-divine font-medium">Active</span>
                    </div>
                  )}
                </div>
                <p className="text-xs opacity-90">
                  {benefit.description}
                </p>
                {!benefit.available && (
                  <p className="text-xs mt-1 opacity-60">
                    Available at {benefit.level} level
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress to Next Level */}
      {getProgressToNextLevel() && (
        <div className="bg-liberation-black-power bg-opacity-30 rounded-lg p-4 mb-6">
          <h3 className="text-liberation-gold-divine font-semibold text-sm mb-2">
            🎯 Next Level: {getProgressToNextLevel()?.nextLevel}
          </h3>
          <p className="text-liberation-silver text-xs opacity-90">
            {getProgressToNextLevel()?.requirement}
          </p>
        </div>
      )}

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-liberation-black-power bg-opacity-30 rounded p-3">
          <Heart className="h-5 w-5 text-liberation-red-liberation mx-auto mb-1" />
          <div className="text-liberation-gold-divine font-semibold text-sm">Member Since</div>
          <div className="text-xs text-liberation-silver">
            {new Date(member.memberSince).toLocaleDateString()}
          </div>
        </div>
        <div className="bg-liberation-black-power bg-opacity-30 rounded p-3">
          <Star className="h-5 w-5 text-liberation-gold-divine mx-auto mb-1" />
          <div className="text-liberation-gold-divine font-semibold text-sm">Communities</div>
          <div className="text-xs text-liberation-silver">
            {member.communities.length}
          </div>
        </div>
        <div className="bg-liberation-black-power bg-opacity-30 rounded p-3">
          <Award className="h-5 w-5 text-liberation-purple-spirit mx-auto mb-1" />
          <div className="text-liberation-gold-divine font-semibold text-sm">Badges</div>
          <div className="text-xs text-liberation-silver">
            {member.badges.length}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="flex-1 bg-liberation-gold-divine text-liberation-black-power px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            Visit BLKOUTHUB
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        )}

        <button
          onClick={() => window.open('https://help.heartbeat.chat/hc/en-us/articles/33257679789841-Managing-Community-Access-and-Visibility', '_blank')}
          className="px-6 py-3 border border-liberation-silver border-opacity-30 text-liberation-silver rounded-lg hover:bg-liberation-silver hover:bg-opacity-10 transition-colors text-sm"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  // Non-member invitation view
  if (!member && showJoinButton) {
    return (
      <div className={cn(
        'bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power',
        'border border-liberation-gold-divine border-opacity-30 rounded-xl p-6',
        'text-liberation-silver text-center',
        className
      )}>
        <Lock className="h-12 w-12 text-liberation-gold-divine mx-auto mb-4" />
        <h3 className="text-xl font-bold text-liberation-gold-divine mb-2">
          Join BLKOUTHUB Community
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Unlock enhanced governance participation and community benefits
        </p>
        {onJoinBLKOUTHUB && (
          <button
            onClick={onJoinBLKOUTHUB}
            className="bg-liberation-gold-divine text-liberation-black-power px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
          >
            Join BLKOUTHUB
          </button>
        )}
      </div>
    );
  }

  switch (displayMode) {
    case 'compact':
      return renderCompactView();
    case 'card':
      return renderCardView();
    case 'full':
    default:
      return renderFullView();
  }
};

export default BLKOUTHUBBenefitsDisplay;