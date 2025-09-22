// Proactive Support System for IVOR
// Monitors community wellness and provides proactive interventions

export interface WellnessMetric {
  userId: string;
  timestamp: Date;
  emotionalState: 'thriving' | 'stable' | 'struggling' | 'crisis';
  engagementLevel: 'high' | 'medium' | 'low' | 'absent';
  communityConnection: 'strong' | 'moderate' | 'weak' | 'isolated';
  supportUtilization: 'active' | 'occasional' | 'minimal' | 'none';
  riskFactors: string[];
  resilenceFactors: string[];
}

export interface ProactiveIntervention {
  id: string;
  type: 'wellness-check' | 'resource-offer' | 'community-connection' | 'crisis-prevention' | 'celebration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetUsers: string[];
  content: string;
  resources: string[];
  timing: 'immediate' | 'within-hour' | 'within-day' | 'within-week';
  culturallySpecific?: string[];
  traumaInformed: boolean;
}

export interface CommunityHealthPattern {
  pattern: string;
  indicators: string[];
  interventions: string[];
  preventionStrategies: string[];
  communityStrengths: string[];
}

class ProactiveSupportSystem {
  private wellnessThresholds = {
    crisis: {
      engagementLevel: 'absent',
      daysSinceLastContact: 14,
      riskFactors: ['isolation', 'crisis-indicators', 'substance-use', 'housing-instability'],
      communityConnection: 'isolated'
    },
    earlyWarning: {
      engagementLevel: 'low',
      daysSinceLastContact: 7,
      riskFactors: ['stress', 'conflict', 'financial-strain'],
      communityConnection: 'weak'
    },
    celebration: {
      engagementLevel: 'high',
      positiveIndicators: ['goal-achievement', 'community-contribution', 'healing-progress'],
      communityConnection: 'strong'
    }
  };

  private interventionTemplates = {
    'wellness-check': {
      gentle: `Hello beautiful soul! 💜

I noticed we haven't connected in a while, and I wanted to check in with you. No pressure to respond - just want you to know that you're thought of and valued in this community.

**Quick check-in:**
- How are you holding up today?
- Is there anything you need support with?
- Would you like to connect with any community resources?

**Gentle reminders:**
- You belong here exactly as you are
- It's okay to not be okay
- Community care includes caring for you

Take your time, and remember that support is here whenever you're ready. 🌸`,

      direct: `Hey there, community member! ✊

I wanted to reach out because the community is stronger when we all thrive. I noticed you might be going through a challenging time, and I want you to know that support is available.

**I'm here to help with:**
- Connecting you to immediate resources
- Finding community support networks
- Crisis intervention if needed
- Just listening without judgment

**Available right now:**
- Crisis Text Line: Text HOME to 741741
- Local community support groups
- Mutual aid networks
- One-on-one community connections

What would feel most helpful for you today?`
    },

    'community-connection': {
      socialConnection: `Community Connection Opportunity! 🤝

I thought you might be interested in connecting with other community members who share similar experiences or interests.

**Available connections:**
- Community healing circles (trauma survivors)
- Organizing groups (community action)
- Creative resistance networks (artists and makers)
- Mutual aid volunteers (community care)
- Study groups (liberation education)

**Why community connection matters:**
- Reduces isolation and builds support networks
- Shares resources and collective wisdom
- Creates opportunities for mutual aid
- Builds movements for liberation

Would you like me to connect you with any of these groups? I can make warm introductions based on your interests and comfort level.`,

      mentorship: `Mentorship & Wisdom Sharing Opportunity ✨

Our community thrives when we share knowledge and support each other's growth. I wanted to connect you with mentorship opportunities.

**Available mentorship:**
- Organizing and activism mentorship
- Healing and trauma recovery support
- Creative and artistic development
- Economic justice and resource building
- Spiritual and cultural practices

**You can participate as:**
- Mentee (receiving guidance and support)
- Mentor (sharing your wisdom and experience)
- Peer supporter (mutual learning and growth)

This is all about community care and collective wisdom-sharing. What interests you most?`
    },

    'resource-offer': {
      immediate: `Immediate Resource Support Available 🆘

I want to make sure you have access to resources that might help with what you're going through right now.

**Crisis Resources:**
- Crisis Text Line: Text HOME to 741741
- Trans Lifeline: 877-565-8860
- National Suicide Prevention: 988
- Local emergency services: 911

**Immediate Needs Support:**
- Food: Community fridges, local food banks
- Housing: Emergency shelter, housing assistance
- Safety: Domestic violence resources, legal aid
- Healthcare: Community health centers, sliding scale services

**Community Mutual Aid:**
- Financial assistance funds
- Transportation support
- Childcare networks
- Technology access

Please don't hesitate to reach out. The community wants to support you. 💜`,

      ongoing: `Community Resources for Ongoing Support 🌱

I wanted to share some resources that might support your ongoing wellness and growth.

**Healing & Mental Health:**
- Community counseling centers
- Trauma-informed therapy (sliding scale)
- Healing circles and support groups
- Alternative healing practices

**Community Building:**
- Local organizing groups
- Volunteer opportunities
- Skill-sharing networks
- Creative collectives

**Economic Justice:**
- Job training and placement
- Cooperative businesses
- Financial literacy resources
- Community investment opportunities

**Education & Growth:**
- Liberation education programs
- Community colleges and scholarships
- Skill development workshops
- Language and technology classes

What areas would you like to explore first?`
    },

    'celebration': {
      personal: `Celebrating You! ✨🎉

I wanted to take a moment to celebrate your growth, resilience, and contributions to our community. Your journey matters, and your presence makes a difference.

**What I've noticed:**
- Your increased engagement with community
- The strength you've shown through challenges
- The way you support other community members
- Your commitment to liberation and growth

**Community impact:**
Your healing and growth ripple out to benefit the whole community. When you thrive, we all thrive. Thank you for being part of this liberation journey.

**Keep going:**
- Continue building on your strengths
- Maintain your community connections
- Share your wisdom with others when you feel ready
- Celebrate your progress along the way

You are seen, valued, and appreciated. The ancestors are proud! ✊🏾💜`,

      community: `Community Celebration! 🎊✊

I want to celebrate the beautiful work happening in our community and your part in it.

**Community Wins to Celebrate:**
- Mutual aid networks strengthening
- New community connections forming
- Healing circles providing support
- Organizing efforts making real change
- Creative resistance projects flourishing

**Your Role:**
Whether through direct participation, quiet support, or simply being part of this community - you contribute to our collective liberation.

**Looking Forward:**
- More opportunities for community building
- Expanded resources and support
- Deeper connections and healing
- Continued work toward liberation

Thank you for being part of this movement. Joy is resistance! 🌈✨`
    }
  };

  /**
   * Monitor community wellness patterns and identify intervention needs
   */
  async monitorCommunityWellness(
    communityData: WellnessMetric[]
  ): Promise<ProactiveIntervention[]> {
    const interventions: ProactiveIntervention[] = [];

    // Analyze individual wellness patterns
    for (const userMetric of communityData) {
      const personalInterventions = await this.assessIndividualWellness(userMetric);
      interventions.push(...personalInterventions);
    }

    // Analyze community-wide patterns
    const communityPatterns = await this.identifyCommunityPatterns(communityData);
    const communityInterventions = await this.createCommunityInterventions(communityPatterns);
    interventions.push(...communityInterventions);

    // Prioritize and schedule interventions
    return this.prioritizeInterventions(interventions);
  }

  /**
   * Assess individual user wellness and create targeted interventions
   */
  private async assessIndividualWellness(
    userMetric: WellnessMetric
  ): Promise<ProactiveIntervention[]> {
    const interventions: ProactiveIntervention[] = [];

    // Crisis assessment
    if (userMetric.emotionalState === 'crisis' ||
        userMetric.riskFactors.includes('crisis-indicators')) {
      interventions.push({
        id: `crisis-${userMetric.userId}-${Date.now()}`,
        type: 'crisis-prevention',
        priority: 'urgent',
        targetUsers: [userMetric.userId],
        content: this.interventionTemplates['wellness-check'].direct,
        resources: [
          'Crisis Text Line: Text HOME to 741741',
          'Trans Lifeline: 877-565-8860',
          'National Suicide Prevention: 988',
          'Local crisis intervention services'
        ],
        timing: 'immediate',
        traumaInformed: true
      });
    }

    // Early warning signs
    else if (userMetric.emotionalState === 'struggling' ||
             userMetric.communityConnection === 'weak') {
      interventions.push({
        id: `wellness-check-${userMetric.userId}-${Date.now()}`,
        type: 'wellness-check',
        priority: 'high',
        targetUsers: [userMetric.userId],
        content: this.interventionTemplates['wellness-check'].gentle,
        resources: [
          'Community support groups',
          'Mutual aid networks',
          'Local counseling resources',
          'Peer support connections'
        ],
        timing: 'within-day',
        traumaInformed: true
      });
    }

    // Connection opportunities
    if (userMetric.communityConnection === 'isolated' ||
        userMetric.engagementLevel === 'low') {
      interventions.push({
        id: `connection-${userMetric.userId}-${Date.now()}`,
        type: 'community-connection',
        priority: 'medium',
        targetUsers: [userMetric.userId],
        content: this.interventionTemplates['community-connection'].socialConnection,
        resources: [
          'Community healing circles',
          'Organizing groups',
          'Creative collectives',
          'Study groups'
        ],
        timing: 'within-week',
        traumaInformed: true
      });
    }

    // Celebration and recognition
    if (userMetric.emotionalState === 'thriving' &&
        userMetric.communityConnection === 'strong') {
      interventions.push({
        id: `celebration-${userMetric.userId}-${Date.now()}`,
        type: 'celebration',
        priority: 'low',
        targetUsers: [userMetric.userId],
        content: this.interventionTemplates['celebration'].personal,
        resources: [
          'Leadership opportunities',
          'Mentorship programs',
          'Community recognition',
          'Advanced organizing training'
        ],
        timing: 'within-week',
        traumaInformed: false
      });
    }

    return interventions;
  }

  /**
   * Identify community-wide wellness patterns
   */
  private async identifyCommunityPatterns(
    communityData: WellnessMetric[]
  ): Promise<CommunityHealthPattern[]> {
    const patterns: CommunityHealthPattern[] = [];

    // Analyze collective trends
    const strugglingCount = communityData.filter(m => m.emotionalState === 'struggling').length;
    const isolatedCount = communityData.filter(m => m.communityConnection === 'isolated').length;
    const thrivingCount = communityData.filter(m => m.emotionalState === 'thriving').length;

    const totalUsers = communityData.length;

    // High stress pattern
    if (strugglingCount / totalUsers > 0.3) {
      patterns.push({
        pattern: 'community-wide-stress',
        indicators: [
          '30%+ of community showing signs of struggle',
          'Increased isolation rates',
          'Decreased engagement in community activities'
        ],
        interventions: [
          'Community healing circles',
          'Collective care initiatives',
          'Resource redistribution efforts',
          'Community forums for addressing systemic issues'
        ],
        preventionStrategies: [
          'Regular community check-ins',
          'Proactive resource sharing',
          'Early warning systems',
          'Community resilience building'
        ],
        communityStrengths: [
          'Strong mutual aid networks',
          'Experienced community organizers',
          'Diverse healing traditions',
          'History of collective resilience'
        ]
      });
    }

    // Isolation pattern
    if (isolatedCount / totalUsers > 0.25) {
      patterns.push({
        pattern: 'community-disconnection',
        indicators: [
          '25%+ of community experiencing isolation',
          'Decreased participation in community events',
          'Weak support network utilization'
        ],
        interventions: [
          'One-on-one outreach programs',
          'Low-barrier connection opportunities',
          'Peer support matching',
          'Community buddy systems'
        ],
        preventionStrategies: [
          'Regular relationship building activities',
          'Multiple ways to engage with community',
          'Accessible community spaces',
          'Transportation and childcare support'
        ],
        communityStrengths: [
          'Strong values of inclusion',
          'Diverse community members',
          'Multiple cultural practices',
          'Creative approaches to connection'
        ]
      });
    }

    // Community growth pattern
    if (thrivingCount / totalUsers > 0.4) {
      patterns.push({
        pattern: 'community-flourishing',
        indicators: [
          '40%+ of community members thriving',
          'High engagement levels',
          'Strong community connections',
          'Active mutual support'
        ],
        interventions: [
          'Leadership development opportunities',
          'Community expansion initiatives',
          'Knowledge sharing programs',
          'Celebration and recognition events'
        ],
        preventionStrategies: [
          'Sustainable growth practices',
          'Conflict resolution systems',
          'Resource management planning',
          'Inclusive decision-making processes'
        ],
        communityStrengths: [
          'Effective mutual aid systems',
          'Strong leadership development',
          'Diverse skills and resources',
          'Successful organizing strategies'
        ]
      });
    }

    return patterns;
  }

  /**
   * Create community-wide interventions based on identified patterns
   */
  private async createCommunityInterventions(
    patterns: CommunityHealthPattern[]
  ): Promise<ProactiveIntervention[]> {
    const interventions: ProactiveIntervention[] = [];

    for (const pattern of patterns) {
      switch (pattern.pattern) {
        case 'community-wide-stress':
          interventions.push({
            id: `community-healing-${Date.now()}`,
            type: 'resource-offer',
            priority: 'high',
            targetUsers: ['all'],
            content: `Community Healing Initiative 🌸

I've noticed many of us are going through challenging times right now. This is a reminder that collective care is how we get through difficult periods together.

**Community Healing Resources:**
- Weekly community healing circles (trauma-informed)
- Mutual aid resource redistribution
- Community support network activation
- Collective care planning sessions

**Systemic Support:**
- Advocating for community needs with local officials
- Resource sharing and redistribution
- Collaborative problem-solving for common challenges
- Community resilience building

**Remember:**
- Individual struggles often reflect systemic issues
- Community healing strengthens everyone
- Your well-being matters to the collective
- We rise together or not at all

What would feel most supportive for our community right now?`,
            resources: pattern.interventions,
            timing: 'immediate',
            traumaInformed: true
          });
          break;

        case 'community-disconnection':
          interventions.push({
            id: `connection-building-${Date.now()}`,
            type: 'community-connection',
            priority: 'medium',
            targetUsers: ['all'],
            content: this.interventionTemplates['community-connection'].socialConnection,
            resources: pattern.interventions,
            timing: 'within-day',
            traumaInformed: true
          });
          break;

        case 'community-flourishing':
          interventions.push({
            id: `community-celebration-${Date.now()}`,
            type: 'celebration',
            priority: 'low',
            targetUsers: ['all'],
            content: this.interventionTemplates['celebration'].community,
            resources: pattern.interventions,
            timing: 'within-week',
            traumaInformed: false
          });
          break;
      }
    }

    return interventions;
  }

  /**
   * Prioritize and schedule interventions based on urgency and resources
   */
  private prioritizeInterventions(
    interventions: ProactiveIntervention[]
  ): ProactiveIntervention[] {
    // Sort by priority: urgent > high > medium > low
    const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };

    return interventions.sort((a, b) => {
      // First sort by priority
      const priorityCompare = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityCompare !== 0) return priorityCompare;

      // Then by timing (sooner interventions first)
      const timingOrder = { 'immediate': 0, 'within-hour': 1, 'within-day': 2, 'within-week': 3 };
      return timingOrder[a.timing] - timingOrder[b.timing];
    });
  }

  /**
   * Generate wellness check-in prompts
   */
  generateWellnessCheckIn(userHistory: any[]): string {
    const recentEngagement = userHistory.length > 0;
    const lastInteraction = recentEngagement ? userHistory[userHistory.length - 1] : null;

    if (!recentEngagement) {
      return `Hello, beautiful community member! 💜

I wanted to check in because we haven't connected in a while. No pressure to respond - just want you to know you're thought of and valued.

**Gentle check-in questions:**
- How are you holding up these days?
- What's bringing you joy lately?
- Is there anything you need support with?
- How connected do you feel to community?

**Reminder:**
- You belong here exactly as you are
- Community care includes caring for you
- It's okay to need support
- Your well-being matters to all of us

Take your time, and know that love and support are here when you're ready. 🌸`;
    }

    return `Hey there! ✨

It's been good connecting with you recently. I wanted to check in and see how things are going in your world.

**Quick wellness check:**
- What's been supporting your well-being lately?
- How are you feeling about your community connections?
- Is there anything you'd like more support with?
- Any celebrations or wins you'd like to share?

**Community care reminder:**
Your thriving contributes to all of our liberation. Taking care of yourself is taking care of the community.

What's alive for you today?`;
  }

  /**
   * Create personalized resource recommendations
   */
  generateResourceRecommendations(
    userContext: {
      interests: string[];
      previousResourcesUsed: string[];
      currentChallenges: string[];
      culturalBackground: string[];
    }
  ): string {
    const baseRecommendations = `**Community Resources Tailored for You** 🗺️

Based on our conversations and your interests, here are some resources that might support you:`;

    const resourceCategories = {
      'organizing': [
        'Local community organizing groups',
        'Leadership development programs',
        'Advocacy training workshops',
        'Coalition building opportunities'
      ],
      'healing': [
        'Trauma-informed therapy (sliding scale)',
        'Community healing circles',
        'Traditional healing practices',
        'Support groups for specific experiences'
      ],
      'creative': [
        'Community art collectives',
        'Creative resistance projects',
        'Storytelling and poetry groups',
        'Media and digital storytelling training'
      ],
      'economic': [
        'Job training and placement services',
        'Financial literacy workshops',
        'Cooperative business development',
        'Community investment opportunities'
      ]
    };

    // Select relevant categories based on user interests
    let recommendations = baseRecommendations;

    userContext.interests.forEach(interest => {
      if (resourceCategories[interest]) {
        recommendations += `\n\n**${interest.charAt(0).toUpperCase() + interest.slice(1)} Resources:**\n`;
        recommendations += resourceCategories[interest].map(resource => `• ${resource}`).join('\n');
      }
    });

    recommendations += `\n\n**Cultural Connection:**`;
    if (userContext.culturalBackground.includes('Black')) {
      recommendations += `\n• Black mental health organizations\n• Afrocentric healing practices\n• Black liberation history resources`;
    }
    if (userContext.culturalBackground.includes('Queer')) {
      recommendations += `\n• LGBTQ+ community centers\n• Queer liberation organizing\n• Trans-specific resources and support`;
    }

    recommendations += `\n\n**Next Steps:**\nWould you like me to connect you with any of these resources? I can provide specific contact information or help you get started.`;

    return recommendations;
  }

  /**
   * Schedule follow-up check-ins based on user needs
   */
  scheduleFollowUp(
    userContext: any,
    interventionType: string
  ): { timing: string; content: string } {
    switch (interventionType) {
      case 'crisis-prevention':
        return {
          timing: 'within-hour',
          content: 'Following up on crisis support - checking in on your safety and immediate needs'
        };

      case 'wellness-check':
        return {
          timing: 'within-week',
          content: 'Checking in to see how you\'re doing and if you need any additional support'
        };

      case 'community-connection':
        return {
          timing: 'within-week',
          content: 'Following up on community connections - how did the introductions go?'
        };

      default:
        return {
          timing: 'within-week',
          content: 'General wellness check-in and community connection'
        };
    }
  }
}

export { ProactiveSupportSystem };