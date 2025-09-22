// Community Wisdom Integration System for IVOR
// Integrates collective knowledge, traditional practices, and community resources

export interface CommunityWisdomEntry {
  id: string;
  type: 'practice' | 'resource' | 'story' | 'principle' | 'healing-method';
  title: string;
  description: string;
  content: string;
  source: 'community-submitted' | 'traditional-knowledge' | 'ancestral-wisdom' | 'lived-experience';
  culturalContext: string[];
  applicableScenarios: string[];
  communityValidation: {
    upvotes: number;
    testimonials: string[];
    effectiveness: number; // 1-10 scale
  };
  accessibility: {
    languages: string[];
    accommodations: string[];
    barriers: string[];
  };
  permissions: {
    canShare: boolean;
    requiresAttribution: boolean;
    culturalSensitivity: 'open' | 'community-only' | 'ask-permission';
  };
}

export interface LocalResource {
  id: string;
  name: string;
  type: 'mutual-aid' | 'healing' | 'organizing' | 'cultural' | 'emergency' | 'legal' | 'housing';
  description: string;
  contact: {
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
    socialMedia?: string[];
  };
  accessibility: {
    wheelchair: boolean;
    publicTransit: boolean;
    interpreters: string[];
    slidingScale: boolean;
    freeOptions: boolean;
  };
  culturalAffinity: string[];
  communityRating: number;
  lastVerified: string;
  verified: boolean;
}

export interface OrganizingWisdom {
  strategy: string;
  context: string;
  implementation: string[];
  outcomes: string[];
  lessons: string[];
  attribution: string;
  applicability: string[];
}

class CommunityWisdomIntegration {
  private wisdomDatabase: CommunityWisdomEntry[] = [
    {
      id: 'ubuntu-philosophy',
      type: 'principle',
      title: 'Ubuntu: I Am Because We Are',
      description: 'African philosophy emphasizing interconnectedness and collective humanity',
      content: `Ubuntu teaches us that our humanity is bound up in one another. When one person in the community suffers, we all suffer. When one person heals and thrives, we all benefit.

**Core Teaching:** "I am because we are; and since we are, therefore I am."

**Practical Application:**
- Make decisions considering impact on the whole community
- Share resources and knowledge freely
- Approach conflicts with curiosity about what the community needs
- Celebrate individual achievements as community victories

**In Crisis Support:**
- Remind people they are not alone in their struggles
- Connect individual healing to community healing
- Emphasize that seeking help strengthens the whole community`,
      source: 'traditional-knowledge',
      culturalContext: ['African', 'Ubuntu'],
      applicableScenarios: ['isolation', 'individual-struggle', 'community-building', 'conflict-resolution'],
      communityValidation: {
        upvotes: 147,
        testimonials: [
          "This philosophy helped me understand that my healing matters to everyone",
          "Ubuntu reminds me that I'm not a burden - I'm part of the community fabric"
        ],
        effectiveness: 9
      },
      accessibility: {
        languages: ['English', 'Zulu', 'Xhosa'],
        accommodations: ['visual', 'audio'],
        barriers: []
      },
      permissions: {
        canShare: true,
        requiresAttribution: true,
        culturalSensitivity: 'open'
      }
    },
    {
      id: 'ancestor-meditation',
      type: 'healing-method',
      title: 'Ancestral Strength Meditation',
      description: 'Connecting with ancestral wisdom and resilience for healing and empowerment',
      content: `**Preparation:**
Find a quiet space where you feel safe. Have water nearby. Light a candle if it feels good.

**The Practice:**
1. Sit comfortably and close your eyes or soften your gaze
2. Place one hand on your heart, one on your belly
3. Breathe deeply and say: "I call on the strength of my ancestors"

**Connection:**
4. Imagine a line of light connecting you to all who came before
5. Feel their survival, their love, their sacrifices that brought you here
6. Say: "Your struggles were not in vain. I carry your wisdom."

**Receiving:**
7. Ask: "What do I need to know right now?"
8. Listen with your whole body - wisdom may come as words, images, feelings, or knowing
9. Thank your ancestors and say: "I honor you by living fully"

**Integration:**
10. Write down what you received
11. Drink water to ground yourself
12. Carry this wisdom into your day

**When to Use:**
- Feeling disconnected or alone
- Needing strength for challenges
- Before important decisions
- During times of grief or transition`,
      source: 'traditional-knowledge',
      culturalContext: ['African-Diaspora', 'Indigenous', 'Spiritual'],
      applicableScenarios: ['anxiety', 'decision-making', 'grief', 'empowerment', 'spiritual-connection'],
      communityValidation: {
        upvotes: 203,
        testimonials: [
          "This practice helped me through my hardest times",
          "I feel so connected to my power when I do this meditation"
        ],
        effectiveness: 8
      },
      accessibility: {
        languages: ['English', 'Spanish'],
        accommodations: ['seated', 'mobility-adapted'],
        barriers: ['requires-quiet-space']
      },
      permissions: {
        canShare: true,
        requiresAttribution: false,
        culturalSensitivity: 'community-only'
      }
    },
    {
      id: 'community-accountability',
      type: 'practice',
      title: 'Restorative Community Accountability',
      description: 'Community-based approach to addressing harm that centers healing and growth',
      content: `**Principles:**
- Accountability is about taking responsibility and making amends
- Focus on impact over intent
- Center those who were harmed
- Create conditions for genuine change
- Maintain community safety and healing

**Process:**
1. **Pause and Assess Safety:** Is everyone safe? What immediate support is needed?

2. **Listen to Impact:** Those harmed get to speak their truth without being questioned or defended against

3. **Acknowledge Responsibility:** Person who caused harm takes full responsibility without excuses

4. **Understand Root Causes:** What conditions led to this harm? How can we prevent it?

5. **Make Amends:** What does repair look like? What would help heal the impact?

6. **Change Behavior:** What specific changes will be made? How will accountability continue?

7. **Community Learning:** How does this teach the whole community?

**Key Questions:**
- What happened and who was impacted?
- What needs weren't met that led to this harm?
- What would accountability and repair look like?
- How can we prevent this in the future?

**Remember:**
- This takes time and shouldn't be rushed
- Professional support may be needed
- Some harm requires removal from community spaces
- Healing is possible for everyone involved`,
      source: 'community-submitted',
      culturalContext: ['Restorative-Justice', 'Community-Organizing'],
      applicableScenarios: ['conflict', 'harm', 'accountability', 'community-healing'],
      communityValidation: {
        upvotes: 89,
        testimonials: [
          "This process helped our community work through real harm with integrity"
        ],
        effectiveness: 7
      },
      accessibility: {
        languages: ['English'],
        accommodations: ['interpreter-available'],
        barriers: ['requires-facilitation']
      },
      permissions: {
        canShare: true,
        requiresAttribution: false,
        culturalSensitivity: 'open'
      }
    }
  ];

  private localResources: LocalResource[] = [
    {
      id: 'community-fridge-network',
      name: 'Community Fridge Network',
      type: 'mutual-aid',
      description: 'Network of community refrigerators providing free food 24/7',
      contact: {
        website: 'communityfridges.org',
        socialMedia: ['@communityfridges']
      },
      accessibility: {
        wheelchair: true,
        publicTransit: true,
        interpreters: [],
        slidingScale: false,
        freeOptions: true
      },
      culturalAffinity: ['All Communities'],
      communityRating: 9.2,
      lastVerified: '2025-01-15',
      verified: true
    },
    {
      id: 'black-mental-health-collective',
      name: 'Black Mental Health Collective',
      type: 'healing',
      description: 'Culturally affirming mental health support specifically for Black community members',
      contact: {
        website: 'blackmentalhealthcollective.org',
        phone: '(555) 123-4567',
        email: 'support@bmhc.org'
      },
      accessibility: {
        wheelchair: true,
        publicTransit: true,
        interpreters: ['ASL', 'Spanish'],
        slidingScale: true,
        freeOptions: true
      },
      culturalAffinity: ['Black', 'African-Diaspora'],
      communityRating: 9.7,
      lastVerified: '2025-01-10',
      verified: true
    }
  ];

  private organizingWisdom: OrganizingWisdom[] = [
    {
      strategy: 'One-to-One Relationship Building',
      context: 'Foundation of all successful organizing - building authentic relationships within community',
      implementation: [
        'Meet people where they are, not where you think they should be',
        'Listen more than you talk - understand people\'s real concerns',
        'Find shared values and common ground',
        'Follow up consistently and keep commitments',
        'Build trust through authentic care and mutual support'
      ],
      outcomes: [
        'Stronger community bonds and networks',
        'Increased participation in collective action',
        'Better understanding of community needs and priorities',
        'More effective and inclusive organizing strategies'
      ],
      lessons: [
        'Organizing is about relationships first, issues second',
        'People join movements when they feel seen and valued',
        'Small consistent actions build more trust than grand gestures',
        'Authentic care cannot be faked - people know the difference'
      ],
      attribution: 'Community organizing tradition, Saul Alinsky, Ella Baker',
      applicability: ['community-building', 'organizing', 'movement-building', 'coalition-work']
    }
  ];

  /**
   * Search community wisdom based on user situation and needs
   */
  async searchCommunityWisdom(
    query: string,
    userContext: {
      scenario: string;
      culturalBackground?: string[];
      needsType: 'immediate-support' | 'ongoing-practice' | 'community-resource' | 'organizing-strategy';
    }
  ): Promise<{
    wisdom: CommunityWisdomEntry[];
    resources: LocalResource[];
    practices: string[];
  }> {
    const relevantWisdom = this.wisdomDatabase.filter(entry => {
      // Match by applicable scenarios
      const scenarioMatch = entry.applicableScenarios.some(scenario =>
        query.toLowerCase().includes(scenario) || userContext.scenario.includes(scenario)
      );

      // Match by cultural context if specified
      const culturalMatch = !userContext.culturalBackground ||
        entry.culturalContext.some(context =>
          userContext.culturalBackground!.includes(context)
        );

      // Match by content keywords
      const contentMatch = entry.content.toLowerCase().includes(query.toLowerCase()) ||
        entry.description.toLowerCase().includes(query.toLowerCase());

      return scenarioMatch || culturalMatch || contentMatch;
    });

    const relevantResources = this.localResources.filter(resource => {
      // Match by type and cultural affinity
      const typeMatch = query.toLowerCase().includes(resource.type);
      const culturalMatch = !userContext.culturalBackground ||
        resource.culturalAffinity.some(affinity =>
          userContext.culturalBackground!.includes(affinity) || affinity === 'All Communities'
        );

      return typeMatch || culturalMatch;
    });

    // Generate applicable practices based on wisdom entries
    const practices = relevantWisdom
      .filter(entry => entry.type === 'practice' || entry.type === 'healing-method')
      .map(entry => entry.title);

    return {
      wisdom: relevantWisdom.slice(0, 3), // Limit to top 3 most relevant
      resources: relevantResources.slice(0, 5), // Limit to top 5 resources
      practices
    };
  }

  /**
   * Get culturally specific wisdom for user's identity/background
   */
  async getCulturalWisdom(culturalIdentities: string[]): Promise<CommunityWisdomEntry[]> {
    return this.wisdomDatabase.filter(entry =>
      entry.culturalContext.some(context =>
        culturalIdentities.some(identity =>
          context.toLowerCase().includes(identity.toLowerCase())
        )
      )
    );
  }

  /**
   * Get organizing wisdom and strategies
   */
  async getOrganizingWisdom(context: string): Promise<OrganizingWisdom[]> {
    return this.organizingWisdom.filter(wisdom =>
      wisdom.applicability.includes(context) ||
      wisdom.strategy.toLowerCase().includes(context.toLowerCase())
    );
  }

  /**
   * Find local resources by type and accessibility needs
   */
  async findLocalResources(
    type: string,
    accessibilityNeeds: string[] = [],
    location?: string
  ): Promise<LocalResource[]> {
    return this.localResources.filter(resource => {
      const typeMatch = resource.type === type || type === 'all';

      const accessibilityMatch = accessibilityNeeds.length === 0 ||
        accessibilityNeeds.every(need => {
          switch (need) {
            case 'wheelchair': return resource.accessibility.wheelchair;
            case 'publicTransit': return resource.accessibility.publicTransit;
            case 'free': return resource.accessibility.freeOptions;
            case 'slidingScale': return resource.accessibility.slidingScale;
            default: return true;
          }
        });

      return typeMatch && accessibilityMatch && resource.verified;
    });
  }

  /**
   * Generate community wisdom response for specific situations
   */
  async generateWisdomResponse(
    situation: string,
    userContext: any
  ): Promise<string> {
    const searchResults = await this.searchCommunityWisdom(situation, {
      scenario: situation,
      culturalBackground: userContext.culturalIdentity,
      needsType: 'immediate-support'
    });

    if (searchResults.wisdom.length === 0) {
      return this.generateGenericWisdomResponse(situation);
    }

    const primaryWisdom = searchResults.wisdom[0];
    const resources = searchResults.resources.slice(0, 2);

    return `**Community Wisdom: ${primaryWisdom.title}**

${primaryWisdom.description}

**From Our Community:**
${primaryWisdom.content.substring(0, 500)}...

${resources.length > 0 ? `

**Local Resources:**
${resources.map(resource => `• **${resource.name}**: ${resource.description}`).join('\n')}` : ''}

**This wisdom comes from:** ${this.formatWisdomSource(primaryWisdom.source)}
**Community validation:** ${primaryWisdom.communityValidation.upvotes} community members found this helpful

Would you like me to share more specific practices or connect you with additional resources?`;
  }

  /**
   * Add new community wisdom entry (from community submissions)
   */
  async submitCommunityWisdom(
    wisdom: Omit<CommunityWisdomEntry, 'id' | 'communityValidation'>,
    submitter: string
  ): Promise<{ success: boolean; id?: string; message: string }> {
    // In a real implementation, this would validate and queue for community review
    const newId = `community-${Date.now()}`;

    const newWisdom: CommunityWisdomEntry = {
      ...wisdom,
      id: newId,
      communityValidation: {
        upvotes: 0,
        testimonials: [],
        effectiveness: 0
      }
    };

    // Add to pending queue for community validation
    // this.pendingWisdom.push(newWisdom);

    return {
      success: true,
      id: newId,
      message: 'Thank you for sharing your wisdom! It will be reviewed by the community and added to our collective knowledge base.'
    };
  }

  /**
   * Format wisdom source for display
   */
  private formatWisdomSource(source: string): string {
    const sourceMap = {
      'community-submitted': 'Community members like you',
      'traditional-knowledge': 'Traditional and ancestral knowledge',
      'ancestral-wisdom': 'Wisdom passed down through generations',
      'lived-experience': 'Lived experience of community members'
    };

    return sourceMap[source] || 'Community knowledge';
  }

  /**
   * Generate generic wisdom response when no specific entries match
   */
  private generateGenericWisdomResponse(situation: string): string {
    return `Thank you for sharing what you're going through. While I don't have specific community wisdom that directly matches your situation, our community believes in these core principles:

**Universal Community Wisdom:**
• You are not alone - the community is here with you
• Your experience and feelings are valid
• Seeking support is a sign of strength, not weakness
• Healing happens in relationship with others
• You have wisdom and strength within you

**From Our Organizing Tradition:**
"The most potent weapon in the hands of the oppressor is the mind of the oppressed." - Steve Biko

Your liberation is bound up with ours. When you heal and thrive, the whole community benefits.

**Next Steps:**
• Connect with community members who share similar experiences
• Explore local mutual aid and support networks
• Consider how your individual healing serves collective liberation

Would you like help finding specific resources or connecting with community support?`;
  }

  /**
   * Get daily community wisdom/affirmation
   */
  getDailyWisdom(): CommunityWisdomEntry {
    const dailyWisdomPool = this.wisdomDatabase.filter(entry =>
      entry.type === 'principle' && entry.communityValidation.effectiveness >= 8
    );

    const today = new Date().getDate();
    const index = today % dailyWisdomPool.length;

    return dailyWisdomPool[index] || this.wisdomDatabase[0];
  }

  /**
   * Validate wisdom entry for cultural sensitivity and appropriateness
   */
  async validateWisdomEntry(entry: CommunityWisdomEntry): Promise<{
    isAppropriate: boolean;
    concerns: string[];
    suggestions: string[];
  }> {
    const concerns: string[] = [];
    const suggestions: string[] = [];

    // Check for cultural appropriation
    if (entry.culturalContext.includes('Indigenous') && entry.source !== 'traditional-knowledge') {
      concerns.push('Potential cultural appropriation of Indigenous practices');
      suggestions.push('Verify this comes from Indigenous community members or established traditions');
    }

    // Check for harmful content
    const harmfulIndicators = ['blame', 'shame', 'toxic positivity', 'spiritual bypassing'];
    const contentLower = entry.content.toLowerCase();

    harmfulIndicators.forEach(indicator => {
      if (contentLower.includes(indicator)) {
        concerns.push(`May contain ${indicator}`);
        suggestions.push(`Review content for ${indicator} and trauma-informed approach`);
      }
    });

    // Check accessibility
    if (entry.accessibility.barriers.length > 0) {
      suggestions.push('Consider providing alternative versions to address accessibility barriers');
    }

    return {
      isAppropriate: concerns.length === 0,
      concerns,
      suggestions
    };
  }
}

export { CommunityWisdomIntegration };