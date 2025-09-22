// BLKOUT Liberation Platform - BLKOUTHUB Integration Service
// Layer 2: Community Business Logic Services Layer
// LIBERATION VALUES: Community governance and secure organizing
// SECURITY: Heartbeat.chat integration with member verification

interface BLKOUTHUBMember {
  id: string;
  username: string;
  email: string;
  memberSince: string;
  governanceLevel: 'observer' | 'participant' | 'organizer' | 'steward';
  profileUrl: string;
  isVerified: boolean;
  communities: string[];
  badges: string[];
}

interface GovernancePermissions {
  canVote: boolean;
  canPropose: boolean;
  canModerate: boolean;
  canViewPrivateProposals: boolean;
  canAccessFinancials: boolean;
  votingWeight: number;
}

class BLKOUTHUBIntegrationService {
  private apiBase = 'https://api.blkoutcollective.org/v1';
  private heartbeatIntegration = 'https://api.heartbeat.chat/v1';

  /**
   * Verify BLKOUTHUB membership status
   * Checks both our internal system and Heartbeat.chat
   */
  async verifyMembership(userEmail: string): Promise<BLKOUTHUBMember | null> {
    try {
      // Primary verification through Heartbeat.chat
      const heartbeatMemberData = await this.getHeartbeatMemberData(userEmail);

      if (heartbeatMemberData) {
        // Try to enhance with internal data if available
        const internalEnhancement = await this.getInternalMemberData(userEmail);

        return {
          id: heartbeatMemberData.id,
          username: heartbeatMemberData.username || heartbeatMemberData.email.split('@')[0],
          email: heartbeatMemberData.email,
          memberSince: heartbeatMemberData.joinDate || new Date().toISOString(),
          governanceLevel: this.determineGovernanceLevel(heartbeatMemberData.roles),
          profileUrl: `https://blkouthub.com/members/${heartbeatMemberData.username || heartbeatMemberData.id}`,
          isVerified: true,
          communities: heartbeatMemberData.groups || ['BLKOUTHUB'],
          badges: this.determineMemberBadges(heartbeatMemberData)
        };
      }

      return null;
    } catch (error) {
      console.error('BLKOUTHUB membership verification failed:', error);
      return null;
    }
  }

  /**
   * Get governance permissions based on BLKOUTHUB membership
   */
  getGovernancePermissions(member: BLKOUTHUBMember): GovernancePermissions {
    const basePermissions: GovernancePermissions = {
      canVote: false,
      canPropose: false,
      canModerate: false,
      canViewPrivateProposals: false,
      canAccessFinancials: false,
      votingWeight: 0
    };

    if (!member.isVerified) return basePermissions;

    switch (member.governanceLevel) {
      case 'observer':
        return {
          ...basePermissions,
          canVote: false,
          votingWeight: 0
        };

      case 'participant':
        return {
          ...basePermissions,
          canVote: true,
          votingWeight: 1
        };

      case 'organizer':
        return {
          ...basePermissions,
          canVote: true,
          canPropose: true,
          canViewPrivateProposals: true,
          votingWeight: 2
        };

      case 'steward':
        return {
          canVote: true,
          canPropose: true,
          canModerate: true,
          canViewPrivateProposals: true,
          canAccessFinancials: true,
          votingWeight: 3
        };

      default:
        return basePermissions;
    }
  }

  /**
   * Generate invitation link to BLKOUTHUB for non-members
   */
  generateInvitationLink(referrerEmail?: string): string {
    const baseUrl = 'https://blkouthub.com/invitation';
    const inviteCode = 'BE862C'; // Community access code

    if (referrerEmail) {
      return `${baseUrl}?code=${inviteCode}&ref=${encodeURIComponent(referrerEmail)}`;
    }

    return `${baseUrl}?code=${inviteCode}`;
  }

  /**
   * Check membership benefits display
   */
  getMembershipBenefits(member: BLKOUTHUBMember): string[] {
    const benefits = [
      '🔐 Secure community access on Heartbeat.chat',
      '👥 Direct connection with liberation organizers',
      '📊 Enhanced democratic governance participation'
    ];

    switch (member.governanceLevel) {
      case 'participant':
        benefits.push('🗳️ Full voting rights on platform decisions');
        break;

      case 'organizer':
        benefits.push(
          '🗳️ Full voting rights with enhanced weight',
          '📝 Proposal creation and leadership access'
        );
        break;

      case 'steward':
        benefits.push(
          '🗳️ Full voting rights with maximum weight',
          '📝 Proposal creation and leadership access',
          '🛡️ Moderation and community stewardship tools',
          '💰 Financial transparency and budget access'
        );
        break;
    }

    return benefits;
  }

  /**
   * Cross-platform content sync to BLKOUTHUB
   */
  async syncContentToBLKOUTHUB(content: {
    type: 'story' | 'event' | 'news' | 'proposal';
    title: string;
    author: string;
    content: string;
    tags: string[];
  }): Promise<boolean> {
    try {
      const webhook = await fetch(`${this.apiBase}/webhooks/blkouthub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...content,
          platform: 'liberation-platform',
          timestamp: new Date().toISOString()
        })
      });

      if (webhook.ok) {
        console.log('✅ Content synced to BLKOUTHUB community');
        return true;
      }

      return false;
    } catch (error) {
      console.error('BLKOUTHUB content sync failed:', error);
      return false;
    }
  }

  /**
   * Get community activity feed from BLKOUTHUB
   */
  async getCommunityActivity(limit = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBase}/blkouthub/activity?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.activities || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch BLKOUTHUB activity:', error);
      return [];
    }
  }

  /**
   * Get comprehensive member data from Heartbeat.chat
   */
  private async getHeartbeatMemberData(email: string): Promise<any | null> {
    try {
      // Find user by email
      const findUserResponse = await fetch(`${this.heartbeatIntegration}/find/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getHeartbeatToken()}`
        },
        body: JSON.stringify({
          email,
          communityId: process.env.BLKOUTHUB_COMMUNITY_ID
        })
      });

      if (!findUserResponse.ok) return null;

      const userData = await findUserResponse.json();
      if (!userData.user) return null;

      const user = userData.user;

      // Get user's roles and groups
      const [rolesResponse, groupsResponse] = await Promise.all([
        fetch(`${this.heartbeatIntegration}/roles`, {
          headers: { 'Authorization': `Bearer ${this.getHeartbeatToken()}` }
        }),
        fetch(`${this.heartbeatIntegration}/groups`, {
          headers: { 'Authorization': `Bearer ${this.getHeartbeatToken()}` }
        })
      ]);

      let userRoles = [];
      let userGroups = [];

      if (rolesResponse.ok) {
        const roles = await rolesResponse.json();
        userRoles = roles.filter((role: any) => role.userId === user.id);
      }

      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        for (const group of groups) {
          const membershipCheck = await fetch(
            `${this.heartbeatIntegration}/groups/${group.id}/memberships`,
            {
              headers: { 'Authorization': `Bearer ${this.getHeartbeatToken()}` }
            }
          );
          if (membershipCheck.ok) {
            const memberships = await membershipCheck.json();
            const isMember = memberships.some((membership: any) =>
              membership.userId === user.id
            );
            if (isMember) {
              userGroups.push(group.name);
            }
          }
        }
      }

      return {
        ...user,
        roles: userRoles,
        groups: userGroups
      };
    } catch (error) {
      console.error('Failed to get Heartbeat member data:', error);
      return null;
    }
  }

  /**
   * Get internal member data for enhancement
   */
  private async getInternalMemberData(email: string): Promise<any | null> {
    try {
      const response = await fetch(`${this.apiBase}/blkouthub/verify-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ email })
      });

      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Determine governance level based on Heartbeat roles
   */
  private determineGovernanceLevel(roles: any[]): 'observer' | 'participant' | 'organizer' | 'steward' {
    if (!roles || roles.length === 0) return 'observer';

    const roleNames = roles.map(role => role.name?.toLowerCase() || '');

    // Check for highest level roles first
    if (roleNames.some(name =>
      name.includes('steward') ||
      name.includes('admin') ||
      name.includes('leader')
    )) {
      return 'steward';
    }

    if (roleNames.some(name =>
      name.includes('organizer') ||
      name.includes('moderator') ||
      name.includes('coordinator')
    )) {
      return 'organizer';
    }

    if (roleNames.some(name =>
      name.includes('participant') ||
      name.includes('member') ||
      name.includes('active')
    )) {
      return 'participant';
    }

    return 'observer';
  }

  /**
   * Determine member badges based on Heartbeat data
   */
  private determineMemberBadges(memberData: any): string[] {
    const badges = [];

    if (memberData.groups?.length > 1) {
      badges.push('Multi-Community Member');
    }

    if (memberData.roles?.some((role: any) =>
      role.name?.toLowerCase().includes('founding') ||
      role.name?.toLowerCase().includes('charter')
    )) {
      badges.push('Founding Member');
    }

    if (memberData.roles?.some((role: any) =>
      role.name?.toLowerCase().includes('mentor') ||
      role.name?.toLowerCase().includes('guide')
    )) {
      badges.push('Community Mentor');
    }

    // Default community badge
    if (badges.length === 0) {
      badges.push('Community Member');
    }

    return badges;
  }

  private async verifyHeartbeatMembership(email: string): Promise<boolean> {
    try {
      // Accurate Heartbeat.chat API integration
      // Step 1: Find user by email
      const findUserResponse = await fetch(`${this.heartbeatIntegration}/find/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getHeartbeatToken()}`
        },
        body: JSON.stringify({
          email,
          communityId: process.env.BLKOUTHUB_COMMUNITY_ID
        })
      });

      if (!findUserResponse.ok) {
        return false;
      }

      const userData = await findUserResponse.json();

      if (!userData.user) {
        return false;
      }

      // Step 2: Verify user is in BLKOUTHUB community groups
      const groupsResponse = await fetch(`${this.heartbeatIntegration}/groups`, {
        headers: {
          'Authorization': `Bearer ${this.getHeartbeatToken()}`
        }
      });

      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        const blkouthubGroups = groups.filter((group: any) =>
          group.name.toLowerCase().includes('blkout') ||
          group.name.toLowerCase().includes('liberation')
        );

        // Check if user is member of any BLKOUTHUB groups
        for (const group of blkouthubGroups) {
          const membershipCheck = await fetch(
            `${this.heartbeatIntegration}/groups/${group.id}/memberships`,
            {
              headers: {
                'Authorization': `Bearer ${this.getHeartbeatToken()}`
              }
            }
          );

          if (membershipCheck.ok) {
            const memberships = await membershipCheck.json();
            const isMember = memberships.some((membership: any) =>
              membership.userId === userData.user.id
            );

            if (isMember) {
              return true;
            }
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Heartbeat membership verification failed:', error);
      return false;
    }
  }

  private getAuthToken(): string {
    // In production, this would be securely managed
    return process.env.BLKOUT_API_TOKEN || 'dev-token';
  }

  private getHeartbeatToken(): string {
    // In production, this would be securely managed
    return process.env.HEARTBEAT_API_TOKEN || 'dev-heartbeat-token';
  }
}

// Singleton instance
export const blkouthubService = new BLKOUTHUBIntegrationService();

// Hooks for React components
export const useBLKOUTHUBMembership = (userEmail: string | null) => {
  const [member, setMember] = React.useState<BLKOUTHUBMember | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<GovernancePermissions | null>(null);

  React.useEffect(() => {
    if (!userEmail) return;

    const verifyMembership = async () => {
      setLoading(true);
      try {
        const memberData = await blkouthubService.verifyMembership(userEmail);
        setMember(memberData);

        if (memberData) {
          const perms = blkouthubService.getGovernancePermissions(memberData);
          setPermissions(perms);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyMembership();
  }, [userEmail]);

  return { member, permissions, loading };
};

import React from 'react';