// Enhanced IVOR AI Core - Liberation-Focused AI Assistant
// Trauma-informed, culturally authentic, and community-centered AI responses

export interface TraumaInformedContext {
  isInCrisis: boolean;
  triggerWarnings: string[];
  supportLevel: 'light' | 'moderate' | 'intensive';
  culturalContext: string[];
  previousTrauma: boolean;
  safetyNeeds: string[];
}

export interface LiberationWisdom {
  principle: string;
  ancestralWisdom: string;
  practicalApplication: string;
  communityExample: string;
  actionSteps: string[];
}

export interface CommunityKnowledge {
  localResources: string[];
  mutualAidNetworks: string[];
  culturalPractices: string[];
  healingTraditions: string[];
  organizingHistory: string[];
}

export interface AIResponseContext {
  conversationHistory: string[];
  userEmotionalState: string;
  communityContext: CommunityKnowledge;
  traumaContext: TraumaInformedContext;
  liberationGoals: string[];
  culturalIdentity: string[];
}

class EnhancedIVORCore {
  private liberationPrinciples: LiberationWisdom[] = [
    {
      principle: "Nobody's Free Until Everybody's Free",
      ancestralWisdom: "Our liberation is interconnected - individual healing serves collective freedom",
      practicalApplication: "When supporting someone, consider how this connects to broader community liberation",
      communityExample: "Community kitchens that feed families also build organizing relationships",
      actionSteps: [
        "Listen to understand systemic connections",
        "Offer support that builds community capacity",
        "Connect individual needs to collective action"
      ]
    },
    {
      principle: "Community Care Is Collective Responsibility",
      ancestralWisdom: "Ubuntu: 'I am because we are' - African philosophy of interconnectedness",
      practicalApplication: "Center community solutions over individual fixes",
      communityExample: "Mutual aid networks sharing resources and emotional support",
      actionSteps: [
        "Ask 'How can the community support this?'",
        "Share the load rather than individualizing problems",
        "Build systems that prevent issues from recurring"
      ]
    },
    {
      principle: "Center Those Most Impacted",
      ancestralWisdom: "Those closest to the problem are closest to the solution",
      practicalApplication: "Prioritize voices and leadership of those most affected by systems of oppression",
      communityExample: "Housing justice led by unhoused community members",
      actionSteps: [
        "Listen to and amplify affected voices",
        "Follow the leadership of impacted communities",
        "Redistribute resources and decision-making power"
      ]
    },
    {
      principle: "Healing Happens in Community",
      ancestralWisdom: "Traditional African healing practices centered community ritual and collective support",
      practicalApplication: "Create spaces for shared healing and collective processing",
      communityExample: "Healing circles for trauma survivors in community spaces",
      actionSteps: [
        "Connect individuals to healing communities",
        "Facilitate group healing practices",
        "Normalize community support for mental health"
      ]
    },
    {
      principle: "Rest Is Resistance",
      ancestralWisdom: "Ancestors fought for our right to exist fully, not just survive",
      practicalApplication: "Protect community members' right to rest and joy",
      communityExample: "Community spaces for rest, play, and celebration",
      actionSteps: [
        "Validate the need for rest and boundaries",
        "Challenge productivity culture messaging",
        "Create sustainable rhythms of work and rest"
      ]
    }
  ];

  private traumaInformedPrinciples = {
    safety: "Physical and emotional safety is the foundation of all interactions",
    trustworthiness: "Transparency and consistency build trust over time",
    peerSupport: "Lived experience and mutual self-help are valued",
    collaboration: "Power is shared and decision-making is collaborative",
    empowerment: "Individual and community strengths are recognized and built upon",
    culturalHumility: "Cultural identity and healing practices are honored"
  };

  private culturalAuthenticity = {
    blackQueerJoy: "Center joy, creativity, and celebration as acts of resistance",
    ancestralWisdom: "Honor traditional knowledge and intergenerational wisdom",
    culturalPractices: "Validate diverse ways of knowing and healing",
    language: "Use affirming, accessible language that reflects community voice",
    intersectionality: "Recognize multiple, intersecting identities and experiences"
  };

  /**
   * Enhanced AI response generation with liberation principles
   */
  async generateLiberationResponse(
    userMessage: string,
    context: AIResponseContext
  ): Promise<string> {
    // Step 1: Assess emotional and safety needs
    const safetyAssessment = await this.assessSafetyNeeds(userMessage, context);

    // Step 2: Identify liberation principles most relevant to situation
    const relevantPrinciples = await this.identifyRelevantPrinciples(userMessage, context);

    // Step 3: Check for trauma-informed considerations
    const traumaConsiderations = await this.assessTraumaContext(userMessage, context);

    // Step 4: Generate culturally authentic response
    const baseResponse = await this.generateCulturallyAuthenticResponse(
      userMessage,
      context,
      safetyAssessment,
      relevantPrinciples,
      traumaConsiderations
    );

    // Step 5: Add community wisdom and resources
    const enhancedResponse = await this.integrateCommunitWisdom(baseResponse, context);

    // Step 6: Include proactive support offers
    const finalResponse = await this.addProactiveSupport(enhancedResponse, context);

    return finalResponse;
  }

  /**
   * Assess safety and crisis indicators
   */
  private async assessSafetyNeeds(
    userMessage: string,
    context: AIResponseContext
  ): Promise<{ safetyLevel: string; interventions: string[] }> {
    const message = userMessage.toLowerCase();

    // Crisis indicators
    const crisisKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end it all', 'hurt myself',
      'self harm', 'cutting', 'overdose', 'dangerous situation',
      'domestic violence', 'abusive relationship', 'scared for my life'
    ];

    const hasCrisisIndicators = crisisKeywords.some(keyword => message.includes(keyword));

    if (hasCrisisIndicators) {
      return {
        safetyLevel: 'crisis',
        interventions: [
          'immediate_safety_planning',
          'crisis_resource_connection',
          'warm_professional_referral',
          'community_crisis_support'
        ]
      };
    }

    // Moderate risk indicators
    const riskKeywords = [
      'overwhelmed', 'hopeless', 'cant cope', 'breaking down',
      'trauma', 'triggered', 'panic attack', 'dissociating'
    ];

    const hasRiskIndicators = riskKeywords.some(keyword => message.includes(keyword));

    if (hasRiskIndicators) {
      return {
        safetyLevel: 'elevated',
        interventions: [
          'trauma_informed_support',
          'grounding_techniques',
          'community_connection',
          'professional_resource_sharing'
        ]
      };
    }

    return {
      safetyLevel: 'stable',
      interventions: ['standard_support', 'liberation_focused_guidance']
    };
  }

  /**
   * Identify most relevant liberation principles
   */
  private async identifyRelevantPrinciples(
    userMessage: string,
    context: AIResponseContext
  ): Promise<LiberationWisdom[]> {
    const message = userMessage.toLowerCase();
    const relevantPrinciples: LiberationWisdom[] = [];

    // Map message themes to liberation principles
    if (message.includes('alone') || message.includes('isolated') || message.includes('individual')) {
      relevantPrinciples.push(this.liberationPrinciples[0]); // Nobody's free until everybody's free
      relevantPrinciples.push(this.liberationPrinciples[1]); // Community care
    }

    if (message.includes('trauma') || message.includes('healing') || message.includes('hurt')) {
      relevantPrinciples.push(this.liberationPrinciples[3]); // Healing happens in community
    }

    if (message.includes('tired') || message.includes('exhausted') || message.includes('burnout')) {
      relevantPrinciples.push(this.liberationPrinciples[4]); // Rest is resistance
    }

    if (message.includes('organize') || message.includes('action') || message.includes('change')) {
      relevantPrinciples.push(this.liberationPrinciples[2]); // Center those most impacted
    }

    // Default to community care if no specific matches
    if (relevantPrinciples.length === 0) {
      relevantPrinciples.push(this.liberationPrinciples[1]);
    }

    return relevantPrinciples;
  }

  /**
   * Assess trauma context and needed accommodations
   */
  private async assessTraumaContext(
    userMessage: string,
    context: AIResponseContext
  ): Promise<{ accommodations: string[]; approach: string }> {
    const traumaIndicators = [
      'trauma', 'triggered', 'flashback', 'ptsd', 'dissociate',
      'panic', 'anxiety', 'safe', 'boundary', 'consent'
    ];

    const hasTraumaContent = traumaIndicators.some(indicator =>
      userMessage.toLowerCase().includes(indicator)
    );

    if (hasTraumaContent || context.traumaContext.previousTrauma) {
      return {
        accommodations: [
          'slower_paced_response',
          'explicit_choice_offering',
          'trauma_informed_language',
          'safety_reminders',
          'grounding_resource_sharing'
        ],
        approach: 'trauma_informed'
      };
    }

    return {
      accommodations: ['standard_empathy', 'community_focus'],
      approach: 'standard_liberation'
    };
  }

  /**
   * Generate culturally authentic response
   */
  private async generateCulturallyAuthenticResponse(
    userMessage: string,
    context: AIResponseContext,
    safetyAssessment: any,
    relevantPrinciples: LiberationWisdom[],
    traumaConsiderations: any
  ): Promise<string> {
    const primaryPrinciple = relevantPrinciples[0];

    // Crisis response
    if (safetyAssessment.safetyLevel === 'crisis') {
      return `I hear you, and I want you to know that your life has value and meaning to this community.

**Immediate Support:**
- Crisis Text Line: Text HOME to 741741
- Trans Lifeline: 877-565-8860
- LGBT National Suicide Prevention Lifeline: 1-866-488-7386
- Local community crisis support: [community resources would be listed here]

You don't have to face this alone. Our community cares about you, and there are people who want to support you through this.

**Right Now:**
- Are you in immediate physical danger? If yes, please call 911 or go to your nearest emergency room.
- Is there a trusted friend or community member you can be with tonight?
- Can you make a safety plan for the next 24 hours?

Your ancestors survived so you could be here. Your community needs you. Let's find you the support you deserve. 💜`;
    }

    // Trauma-informed response
    if (traumaConsiderations.approach === 'trauma_informed') {
      return `Thank you for trusting me with what you're going through. What you're experiencing is valid, and you deserve care and support.

**Gentle Reminder:** You get to choose how much or how little you share. There's no pressure to explain or justify your feelings.

**${primaryPrinciple.principle}**
${primaryPrinciple.ancestralWisdom}

**Community Wisdom:** ${primaryPrinciple.practicalApplication}

**Grounding Invitation:** If it feels safe and good for you, try the 5-4-3-2-1 technique:
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

${primaryPrinciple.actionSteps.map(step => `• ${step}`).join('\n')}

You're not alone in this. The community is here with you. What would feel most supportive right now?`;
    }

    // Standard liberation-focused response
    return `I hear you, and I'm honored that you're sharing this with me. Your experience matters to our community.

**Liberation Wisdom: ${primaryPrinciple.principle}**
${primaryPrinciple.ancestralWisdom}

**How This Connects to Your Situation:**
${primaryPrinciple.practicalApplication}

**Community Example:** ${primaryPrinciple.communityExample}

**Steps Forward:**
${primaryPrinciple.actionSteps.map(step => `• ${step}`).join('\n')}

Remember: You don't have to figure this out alone. Community care is collective responsibility, and that includes caring for you. What would feel most helpful for you right now?`;
  }

  /**
   * Integrate community wisdom and local resources
   */
  private async integrateCommunitWisdom(
    baseResponse: string,
    context: AIResponseContext
  ): Promise<string> {
    const communityResources = context.communityContext.localResources.slice(0, 3);
    const mutualAidNetworks = context.communityContext.mutualAidNetworks.slice(0, 2);

    const communitySection = `

**Community Resources & Mutual Aid:**
${communityResources.map(resource => `• ${resource}`).join('\n')}

**Local Mutual Aid Networks:**
${mutualAidNetworks.map(network => `• ${network}`).join('\n')}

**Cultural Healing Practices:**
${context.communityContext.healingTraditions.slice(0, 2).map(practice => `• ${practice}`).join('\n')}`;

    return baseResponse + communitySection;
  }

  /**
   * Add proactive support offers
   */
  private async addProactiveSupport(
    enhancedResponse: string,
    context: AIResponseContext
  ): Promise<string> {
    const proactiveOffers = `

**Proactive Support Offers:**
• I can help connect you with community members who have similar experiences
• Would you like me to help you find local organizing opportunities?
• I can share trauma-informed resources specifically for Black/queer folks
• Want me to check in with you in a few days to see how you're doing?
• I can help you create a community care plan with specific support people

**Remember:** Your healing matters to the movement. Taking care of yourself is taking care of the community.

Is there anything specific I can help you with right now?`;

    return enhancedResponse + proactiveOffers;
  }

  /**
   * Cultural authenticity check for AI responses
   */
  async validateCulturalAuthenticity(response: string): Promise<{
    isAuthentic: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for cultural appropriation indicators
    const problematicPhrases = [
      'spirit animal', 'tribe' // when not referring to actual Indigenous communities
    ];

    // Check for inclusive language
    const inclusiveTerms = ['community', 'folks', 'people', 'y\'all'];
    const exclusiveTerms = ['guys', 'ladies and gentlemen'];

    // Check for Black queer joy elements
    const joyIndicators = ['celebrate', 'joy', 'beautiful', 'powerful', 'resilient'];

    // Validate cultural authenticity
    if (!inclusiveTerms.some(term => response.toLowerCase().includes(term))) {
      issues.push('Missing inclusive language');
      suggestions.push('Use terms like "folks", "community", or "y\'all"');
    }

    if (exclusiveTerms.some(term => response.toLowerCase().includes(term))) {
      issues.push('Contains exclusive language');
      suggestions.push('Replace with more inclusive alternatives');
    }

    if (!joyIndicators.some(indicator => response.toLowerCase().includes(indicator))) {
      suggestions.push('Consider adding affirmation of community strength and resilience');
    }

    return {
      isAuthentic: issues.length === 0,
      issues,
      suggestions
    };
  }
}

export { EnhancedIVORCore };