// BLKOUT Liberation Platform - BLKOUTHUB Member Badge Component
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Community recognition and governance transparency
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance

import React from 'react';
import { Shield, Crown, Users, Eye, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';
import type { BLKOUTHUBMember, GovernancePermissions } from '@/services/blkouthub-integration';

interface BLKOUTHUBMemberBadgeProps {
  member: BLKOUTHUBMember;
  permissions: GovernancePermissions;
  showFullDetails?: boolean;
  onViewProfile?: () => void;
  className?: string;
}

const BLKOUTHUBMemberBadge: React.FC<BLKOUTHUBMemberBadgeProps> = ({
  member,
  permissions,
  showFullDetails = false,
  onViewProfile,
  className
}) => {
  const getGovernanceLevelIcon = () => {
    switch (member.governanceLevel) {
      case 'steward':
        return <Crown className="h-4 w-4 text-liberation-gold-divine" />;
      case 'organizer':
        return <Shield className="h-4 w-4 text-liberation-red-liberation" />;
      case 'participant':
        return <Users className="h-4 w-4 text-liberation-green-africa" />;
      case 'observer':
        return <Eye className="h-4 w-4 text-liberation-silver" />;
      default:
        return null;
    }
  };

  const getGovernanceLevelColor = () => {
    switch (member.governanceLevel) {
      case 'steward':
        return 'from-liberation-gold-divine to-liberation-red-liberation';
      case 'organizer':
        return 'from-liberation-red-liberation to-liberation-purple-spirit';
      case 'participant':
        return 'from-liberation-green-africa to-liberation-gold-divine';
      case 'observer':
        return 'from-liberation-silver to-liberation-purple-spirit';
      default:
        return 'from-liberation-black-power to-liberation-silver';
    }
  };

  const getGovernanceLevelTitle = () => {
    switch (member.governanceLevel) {
      case 'steward':
        return 'Community Steward';
      case 'organizer':
        return 'Liberation Organizer';
      case 'participant':
        return 'Active Participant';
      case 'observer':
        return 'Community Observer';
      default:
        return 'Community Member';
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-r border rounded-lg p-3",
        getGovernanceLevelColor(),
        "border-liberation-silver border-opacity-20",
        className
      )}
      role="group"
      aria-label={`BLKOUTHUB member: ${member.username}`}
    >
      {/* Compact Badge */}
      {!showFullDetails && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {getGovernanceLevelIcon()}
            <span className="text-liberation-black-power font-semibold text-sm">
              BLKOUTHUB
            </span>
          </div>
          <div className="text-liberation-black-power text-xs opacity-80">
            {getGovernanceLevelTitle()}
          </div>
          {onViewProfile && (
            <button
              onClick={onViewProfile}
              className="text-liberation-black-power hover:text-liberation-black-power opacity-60 hover:opacity-100 transition-opacity"
              aria-label="View BLKOUTHUB profile"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Detailed Badge */}
      {showFullDetails && (
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getGovernanceLevelIcon()}
              <div>
                <div className="text-liberation-black-power font-bold text-sm">
                  BLKOUTHUB Member
                </div>
                <div className="text-liberation-black-power text-xs opacity-80">
                  {getGovernanceLevelTitle()}
                </div>
              </div>
            </div>
            {onViewProfile && (
              <button
                onClick={onViewProfile}
                className="flex items-center space-x-1 text-liberation-black-power hover:text-liberation-black-power opacity-70 hover:opacity-100 transition-opacity text-xs"
              >
                <span>View Profile</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Member Info */}
          <div className="bg-liberation-black-power bg-opacity-20 rounded p-2 text-xs">
            <div className="grid grid-cols-2 gap-2 text-liberation-black-power">
              <div>
                <span className="opacity-70">Member Since:</span>
                <div className="font-semibold">
                  {new Date(member.memberSince).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="opacity-70">Voting Weight:</span>
                <div className="font-semibold">
                  {permissions.votingWeight}x
                </div>
              </div>
            </div>
          </div>

          {/* Governance Permissions */}
          <div className="space-y-2">
            <div className="text-liberation-black-power font-semibold text-xs mb-1">
              Governance Access:
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                { key: 'canVote', label: 'Voting Rights', icon: '🗳️' },
                { key: 'canPropose', label: 'Create Proposals', icon: '📝' },
                { key: 'canModerate', label: 'Moderation', icon: '🛡️' },
                { key: 'canAccessFinancials', label: 'Financial Access', icon: '💰' }
              ].map(({ key, label, icon }) => (
                <div
                  key={key}
                  className={cn(
                    "flex items-center space-x-1 p-1 rounded text-xs",
                    permissions[key as keyof GovernancePermissions]
                      ? "text-liberation-black-power opacity-100"
                      : "text-liberation-black-power opacity-40"
                  )}
                >
                  <span>{icon}</span>
                  <span className={cn(
                    permissions[key as keyof GovernancePermissions] ? "font-medium" : "line-through"
                  )}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Member Badges */}
          {member.badges.length > 0 && (
            <div className="space-y-1">
              <div className="text-liberation-black-power font-semibold text-xs">
                Community Badges:
              </div>
              <div className="flex flex-wrap gap-1">
                {member.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-liberation-black-power bg-opacity-30 text-liberation-black-power px-2 py-1 rounded text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BLKOUTHUBMemberBadge;