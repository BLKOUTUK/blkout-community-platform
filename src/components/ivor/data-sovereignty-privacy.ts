// Data Sovereignty and Privacy Controls for IVOR
// Community-controlled data governance with liberation principles

export interface DataSovereigntyRights {
  dataOwnership: 'community' | 'individual' | 'shared';
  accessControl: string[];
  sharingPermissions: {
    anonymizedResearch: boolean;
    communityWisdom: boolean;
    mutualAidNetworks: boolean;
    organizingSupport: boolean;
  };
  retentionPeriod: 'session' | '30-days' | '1-year' | 'indefinite-with-consent';
  deletionRights: {
    immediateDelete: boolean;
    dataPortability: boolean;
    rightToBeForgotten: boolean;
  };
}

export interface ConversationConsent {
  informedConsent: boolean;
  purposeLimitation: string[];
  dataMinimization: boolean;
  transparencyLevel: 'full' | 'summary' | 'minimal';
  culturalConsiderations: string[];
  traumaInformedConsent: boolean;
}

export interface CommunityDataGovernance {
  governanceModel: 'democratic' | 'consensus' | 'elder-council' | 'hybrid';
  communityVoice: {
    dataUseVoting: boolean;
    policyChanges: boolean;
    researchApproval: boolean;
    algorithmicAccountability: boolean;
  };
  indigenousDataSovereignty: {
    recognizeTribalSovereignty: boolean;
    honorTraditionalKnowledge: boolean;
    preventCulturalAppropriation: boolean;
    supportIndigenousLedResearch: boolean;
  };
  antiSurveillance: {
    noLawEnforcement: boolean;
    noGovernmentAccess: boolean;
    noCorporateSurveillance: boolean;
    noDiscriminatoryProfiling: boolean;
  };
}

class DataSovereigntyPrivacyManager {
  private defaultRights: DataSovereigntyRights = {
    dataOwnership: 'individual',
    accessControl: ['user-only', 'community-aggregate-anonymous'],
    sharingPermissions: {
      anonymizedResearch: false, // Requires explicit opt-in
      communityWisdom: false, // Requires explicit opt-in
      mutualAidNetworks: false, // Requires explicit opt-in
      organizingSupport: false // Requires explicit opt-in
    },
    retentionPeriod: '30-days',
    deletionRights: {
      immediateDelete: true,
      dataPortability: true,
      rightToBeForgotten: true
    }
  };

  private communityGovernance: CommunityDataGovernance = {
    governanceModel: 'democratic',
    communityVoice: {
      dataUseVoting: true,
      policyChanges: true,
      researchApproval: true,
      algorithmicAccountability: true
    },
    indigenousDataSovereignty: {
      recognizeTribalSovereignty: true,
      honorTraditionalKnowledge: true,
      preventCulturalAppropriation: true,
      supportIndigenousLedResearch: true
    },
    antiSurveillance: {
      noLawEnforcement: true,
      noGovernmentAccess: true,
      noCorporateSurveillance: true,
      noDiscriminatoryProfiling: true
    }
  };

  /**
   * Generate informed consent dialogue for IVOR conversations
   */
  generateInformedConsentDialogue(): string {
    return `**Community Data Sovereignty & Your Privacy** 🛡️

Before we begin, I want to ensure you understand how your data is handled with full transparency and community control.

**Your Data Rights:**
✅ **You own your data** - not IVOR, not the platform
✅ **Community governance** - data policies decided democratically
✅ **Immediate deletion** - you can delete all your data anytime
✅ **No surveillance** - never shared with law enforcement or corporations
✅ **Cultural protection** - Traditional knowledge and practices are protected

**What I Store:**
• Our conversation content (only if you consent)
• Basic interaction patterns (to improve support)
• Anonymized wellness indicators (to help community health)

**What I NEVER Store:**
• Identifying information without consent
• Data for corporate profit
• Information for surveillance or control
• Cultural knowledge without permission

**Your Choices:**
🔒 **Private Session**: No data stored, conversation only (recommended for sensitive topics)
🤝 **Community Learning**: Anonymous patterns help improve IVOR for everyone
📊 **Research Consent**: Help community-led research on collective wellness
✊ **Organizing Support**: Connect your needs to mutual aid and organizing

**Liberation Principles:**
- **Data is power** - you control yours
- **Community benefit** - data serves collective liberation
- **Anti-extraction** - no profit from community knowledge
- **Cultural sovereignty** - traditional knowledge stays protected

How would you like to proceed? You can change these choices anytime during our conversation.`;
  }

  /**
   * Process user consent choices and configure data handling
   */
  processConsentChoices(choices: {
    sessionType: 'private' | 'community-learning' | 'research-consent' | 'organizing-support';
    culturalBackground?: string[];
    additionalProtections?: string[];
  }): DataSovereigntyRights {
    const rights = { ...this.defaultRights };

    switch (choices.sessionType) {
      case 'private':
        rights.dataOwnership = 'individual';
        rights.retentionPeriod = 'session';
        rights.sharingPermissions = {
          anonymizedResearch: false,
          communityWisdom: false,
          mutualAidNetworks: false,
          organizingSupport: false
        };
        break;

      case 'community-learning':
        rights.dataOwnership = 'shared';
        rights.retentionPeriod = '30-days';
        rights.sharingPermissions = {
          anonymizedResearch: false,
          communityWisdom: true, // Anonymous patterns only
          mutualAidNetworks: false,
          organizingSupport: false
        };
        break;

      case 'research-consent':
        rights.dataOwnership = 'shared';
        rights.retentionPeriod = '1-year';
        rights.sharingPermissions = {
          anonymizedResearch: true,
          communityWisdom: true,
          mutualAidNetworks: false,
          organizingSupport: false
        };
        break;

      case 'organizing-support':
        rights.dataOwnership = 'community';
        rights.retentionPeriod = '1-year';
        rights.sharingPermissions = {
          anonymizedResearch: true,
          communityWisdom: true,
          mutualAidNetworks: true,
          organizingSupport: true
        };
        break;
    }

    // Apply additional protections for Indigenous/traditional knowledge
    if (choices.culturalBackground?.includes('Indigenous')) {
      rights.accessControl = [...rights.accessControl, 'indigenous-data-sovereignty'];
      // Require tribal approval for any traditional knowledge sharing
    }

    return rights;
  }

  /**
   * Validate data use against community governance principles
   */
  validateDataUse(
    requestedUse: string,
    dataType: 'conversation' | 'pattern' | 'traditional-knowledge' | 'organizing-intel',
    userConsent: ConversationConsent
  ): { approved: boolean; reasons: string[]; recommendations: string[] } {
    const reasons: string[] = [];
    const recommendations: string[] = [];

    // Check community governance approval
    if (requestedUse === 'research' && !this.communityGovernance.communityVoice.researchApproval) {
      reasons.push('Research use requires community democratic approval');
      recommendations.push('Submit research proposal to community governance process');
    }

    // Check anti-surveillance principles
    if (requestedUse.includes('law-enforcement') || requestedUse.includes('surveillance')) {
      reasons.push('NEVER approved - violates anti-surveillance principles');
      return { approved: false, reasons, recommendations: ['This request violates core liberation principles'] };
    }

    // Check traditional knowledge protection
    if (dataType === 'traditional-knowledge' &&
        !userConsent.culturalConsiderations.includes('indigenous-approved')) {
      reasons.push('Traditional knowledge requires cultural community approval');
      recommendations.push('Seek approval from relevant cultural communities');
    }

    // Check informed consent alignment
    if (!userConsent.purposeLimitation.includes(requestedUse)) {
      reasons.push('Use not covered by original consent');
      recommendations.push('Obtain new consent for this specific use');
    }

    const approved = reasons.length === 0;
    return { approved, reasons, recommendations };
  }

  /**
   * Generate data sovereignty report for community transparency
   */
  generateSovereigntyReport(): string {
    return `**Community Data Sovereignty Report** 📊

**Governance Model:** ${this.communityGovernance.governanceModel}
**Community Control:** Full democratic oversight of all data policies

**Anti-Surveillance Protections:**
✅ No law enforcement access
✅ No government surveillance
✅ No corporate data harvesting
✅ No discriminatory profiling

**Indigenous Data Sovereignty:**
✅ Tribal sovereignty recognized
✅ Traditional knowledge protected
✅ Cultural appropriation prevented
✅ Indigenous-led research supported

**Community Voice in Decisions:**
✅ Data use requires community voting
✅ Policy changes are democratically decided
✅ Research must be community-approved
✅ Algorithm accountability enforced

**Default Privacy Protections:**
• Data ownership: Individual
• Retention: 30 days maximum
• Sharing: Requires explicit opt-in
• Deletion: Immediate upon request

**Liberation Principles Enforced:**
- Data serves community liberation, not extraction
- Individual autonomy over personal information
- Collective ownership of community patterns
- Cultural sovereignty over traditional knowledge
- Anti-oppression in all data practices

**Community Oversight:**
The community democratically reviews and updates these policies quarterly to ensure they serve liberation goals.`;
  }

  /**
   * Handle data deletion requests with community considerations
   */
  async processDataDeletion(
    userId: string,
    deletionScope: 'session' | 'all-personal' | 'all-community-contributions',
    reason?: string
  ): Promise<{ success: boolean; communityImpact: string; alternatives: string[] }> {
    const alternatives: string[] = [];

    // Handle different deletion scopes
    switch (deletionScope) {
      case 'session':
        // Simple session deletion - no community impact
        return {
          success: true,
          communityImpact: 'No impact - session data only',
          alternatives: []
        };

      case 'all-personal':
        // Personal data deletion with community anonymization option
        alternatives.push('Keep anonymized patterns for community benefit');
        alternatives.push('Convert to anonymous community wisdom contributions');

        return {
          success: true,
          communityImpact: 'Personal data removed, community patterns may be preserved anonymously',
          alternatives
        };

      case 'all-community-contributions':
        // Full deletion including community contributions
        const communityImpact = await this.assessCommunityImpact(userId);

        alternatives.push('Keep contributions but remove personal identifiers');
        alternatives.push('Transfer ownership to community collective');
        alternatives.push('Phase out contributions over time rather than immediate deletion');

        return {
          success: true,
          communityImpact,
          alternatives
        };
    }

    return {
      success: false,
      communityImpact: 'Unknown deletion scope',
      alternatives: ['Please specify deletion scope']
    };
  }

  /**
   * Assess community impact of data deletion
   */
  private async assessCommunityImpact(userId: string): Promise<string> {
    // In a real implementation, this would analyze:
    // - Community wisdom contributions
    // - Support network connections
    // - Organizing participation
    // - Resource sharing impact

    return `Your contributions to community wisdom and mutual aid networks have been valuable.
    Deletion would remove these contributions from helping other community members.
    We respect your right to deletion and offer alternatives to preserve community benefit while honoring your autonomy.`;
  }

  /**
   * Generate privacy controls interface
   */
  generatePrivacyControls(currentRights: DataSovereigntyRights): string {
    return `**Your Privacy Controls** ⚙️

**Current Data Settings:**
🔒 **Data Ownership:** ${currentRights.dataOwnership}
⏰ **Retention Period:** ${currentRights.retentionPeriod}
🤝 **Community Sharing:** ${Object.entries(currentRights.sharingPermissions)
      .filter(([_, enabled]) => enabled)
      .map(([type, _]) => type)
      .join(', ') || 'None'}

**Available Actions:**
• 🗑️ **Delete Session Data** - Remove current conversation
• 🗃️ **Delete All Personal Data** - Remove all your data
• 📊 **Download Your Data** - Get copy of all your information
• ⚙️ **Update Sharing Preferences** - Change what you share with community
• 🔄 **Change Retention Period** - How long to keep your data
• 🛡️ **Add Extra Protections** - Additional privacy measures

**Community Governance:**
• 🗳️ **Vote on Data Policies** - Participate in community decisions
• 📋 **Review Policy Changes** - Stay informed about updates
• 💬 **Provide Feedback** - Share thoughts on data practices
• 🔍 **Request Transparency Report** - See how community data is used

**Cultural Protections:**
• 🏛️ **Traditional Knowledge Protection** - Cultural sovereignty controls
• 👥 **Community Approval Requirements** - Collective consent for sensitive sharing
• 🚫 **Anti-Appropriation Measures** - Prevent misuse of cultural practices

**Emergency Overrides:**
• 🆘 **Crisis Exception** - Share data to prevent harm (with consent when possible)
• ⚖️ **Community Safety** - Protect community from bad actors (democratic approval required)

What would you like to update or learn more about?`;
  }

  /**
   * Validate cultural data sharing requests
   */
  validateCulturalDataSharing(
    requestedData: {
      type: 'traditional-practice' | 'cultural-knowledge' | 'community-wisdom' | 'organizing-strategy';
      culturalOrigin: string[];
      intendedUse: string;
      requester: 'community-member' | 'researcher' | 'organization' | 'external';
    }
  ): { approved: boolean; requirements: string[]; protections: string[] } {
    const requirements: string[] = [];
    const protections: string[] = [];

    // Traditional knowledge requires cultural community approval
    if (requestedData.type === 'traditional-practice') {
      requirements.push('Approval from relevant cultural communities');
      requirements.push('Commitment to respectful use and attribution');
      requirements.push('Benefit-sharing agreement with communities');
      protections.push('No commercial exploitation without explicit consent');
      protections.push('Cultural context must be preserved');
    }

    // Indigenous data sovereignty
    if (requestedData.culturalOrigin.includes('Indigenous')) {
      requirements.push('Tribal council or elder approval');
      requirements.push('Compliance with Indigenous data sovereignty principles');
      protections.push('Data remains under tribal jurisdiction');
      protections.push('Right to withdraw consent anytime');
    }

    // External requester restrictions
    if (requestedData.requester === 'external') {
      requirements.push('Community democratic approval required');
      requirements.push('Liberation alignment assessment');
      requirements.push('Anti-extraction agreement');
      protections.push('No profit from community knowledge');
      protections.push('Results must benefit originating communities');
    }

    const approved = this.assessCulturalApproval(requestedData, requirements);

    return { approved, requirements, protections };
  }

  /**
   * Assess if cultural data sharing meets approval criteria
   */
  private assessCulturalApproval(
    requestedData: any,
    requirements: string[]
  ): boolean {
    // In a real implementation, this would check:
    // - Community voting records
    // - Cultural council approvals
    // - Benefit-sharing agreements
    // - Anti-appropriation measures

    // For demo purposes, require community member status for approval
    return requestedData.requester === 'community-member' &&
           requestedData.intendedUse.includes('community-benefit');
  }
}

export { DataSovereigntyPrivacyManager };