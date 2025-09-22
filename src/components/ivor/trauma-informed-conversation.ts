// Trauma-Informed Conversation Manager for IVOR
// Implements trauma-informed principles and safety mechanisms

export interface ConversationSafety {
  triggerWarnings: string[];
  contentWarnings: string[];
  safetyResources: string[];
  groundingTechniques: string[];
  communitySupport: string[];
}

export interface TraumaInformedResponse {
  content: string;
  safety: ConversationSafety;
  paceControl: {
    suggestedBreaks: string[];
    choicePoints: string[];
    exitOptions: string[];
  };
  empowerment: {
    strengthsAffirmed: string[];
    choicesOffered: string[];
    autonomyRespected: boolean;
  };
}

class TraumaInformedConversationManager {
  private readonly traumaInformedPrinciples = {
    safety: {
      physical: "Ensure physical safety in all recommendations",
      emotional: "Create emotionally safe conversation spaces",
      cultural: "Honor cultural identity and practices"
    },
    trustworthiness: {
      transparency: "Be clear about AI limitations and capabilities",
      consistency: "Maintain consistent, reliable responses",
      boundaries: "Respect and maintain clear boundaries"
    },
    peerSupport: {
      livedExperience: "Value and incorporate lived experience wisdom",
      mutualAid: "Connect to peer support networks",
      sharedJourney: "Acknowledge common struggles and resilience"
    },
    collaboration: {
      powerSharing: "Avoid taking control or making decisions for users",
      coCreation: "Involve users in determining their support needs",
      respect: "Honor user expertise about their own experience"
    },
    empowerment: {
      strengthsBased: "Focus on strengths, resilience, and capabilities",
      choice: "Always offer multiple options and respect autonomy",
      hope: "Maintain realistic hope and possibility"
    },
    culturalHumility: {
      identity: "Honor all aspects of cultural identity",
      healing: "Respect traditional and alternative healing practices",
      community: "Center community-based healing approaches"
    }
  };

  private readonly groundingTechniques = {
    sensory: {
      name: "5-4-3-2-1 Grounding",
      description: "Connect with your senses to stay present",
      steps: [
        "Name 5 things you can see around you",
        "Name 4 things you can touch",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    breathing: {
      name: "Community Breath",
      description: "Breathe with the ancestors and community",
      steps: [
        "Place one hand on your heart, one on your belly",
        "Breathe in for 4 counts, thinking 'I belong to community'",
        "Hold for 4 counts, thinking 'I am supported'",
        "Breathe out for 6 counts, thinking 'I release what doesn't serve'"
      ]
    },
    movement: {
      name: "Gentle Liberation Movement",
      description: "Move your body with kindness and intention",
      steps: [
        "Stand or sit comfortably",
        "Gently roll your shoulders back - you carry ancestral strength",
        "Stretch your arms up - you take up space and belong here",
        "Place hands on heart - you are worthy of care and love"
      ]
    },
    affirmation: {
      name: "Community Affirmations",
      description: "Remember your connection and worth",
      steps: [
        "I am part of a community that cares about me",
        "My ancestors survived so I could be here",
        "I have the right to take up space and be myself",
        "My healing serves the collective liberation"
      ]
    }
  };

  private readonly crisisResources = {
    immediate: [
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      },
      {
        name: "Trans Lifeline",
        contact: "877-565-8860",
        description: "Peer support for trans community"
      },
      {
        name: "LGBT National Suicide Prevention Lifeline",
        contact: "1-866-488-7386",
        description: "LGBTQ-affirming crisis support"
      },
      {
        name: "National Suicide Prevention Lifeline",
        contact: "988",
        description: "24/7 crisis support and prevention"
      }
    ],
    community: [
      {
        name: "Local LGBTQ+ Community Centers",
        description: "Find community-based support and resources"
      },
      {
        name: "Black Mental Health Alliance",
        description: "Culturally affirming mental health resources"
      },
      {
        name: "Mutual Aid Networks",
        description: "Community-based material and emotional support"
      }
    ]
  };

  /**
   * Process user message with trauma-informed approach
   */
  async processTraumaInformedMessage(
    userMessage: string,
    conversationHistory: string[],
    userContext: any
  ): Promise<TraumaInformedResponse> {
    // Step 1: Assess for crisis indicators
    const crisisAssessment = await this.assessCrisisIndicators(userMessage);

    // Step 2: Identify trauma triggers in message
    const triggerAssessment = await this.identifyPotentialTriggers(userMessage);

    // Step 3: Apply trauma-informed response principles
    const responseContent = await this.generateTraumaInformedContent(
      userMessage,
      crisisAssessment,
      triggerAssessment,
      conversationHistory
    );

    // Step 4: Create safety resources and supports
    const safetyResources = await this.createSafetyResources(
      crisisAssessment,
      triggerAssessment
    );

    // Step 5: Build empowerment and choice elements
    const empowermentElements = await this.createEmpowermentElements(userMessage);

    return {
      content: responseContent,
      safety: safetyResources,
      paceControl: {
        suggestedBreaks: [
          "Take your time responding - there's no rush",
          "Feel free to pause this conversation anytime you need",
          "You're in control of how much you share"
        ],
        choicePoints: [
          "Would you like to explore this further, or shift to something else?",
          "What would feel most helpful right now?",
          "How would you like to approach this?"
        ],
        exitOptions: [
          "Remember, you can end this conversation whenever you need to",
          "Your well-being comes first - step away if you need to",
          "This will be here when you're ready to return"
        ]
      },
      empowerment: empowermentElements
    };
  }

  /**
   * Assess for crisis indicators requiring immediate response
   */
  private async assessCrisisIndicators(message: string): Promise<{
    level: 'none' | 'elevated' | 'high' | 'crisis';
    indicators: string[];
    immediateNeeds: string[];
  }> {
    const lowerMessage = message.toLowerCase();

    // Crisis level indicators
    const crisisKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end it all', 'want to die',
      'hurt myself', 'self harm', 'cutting', 'overdose',
      'no point living', 'better off dead'
    ];

    // High risk indicators
    const highRiskKeywords = [
      'plan to hurt', 'have pills', 'bridge', 'gun', 'razor',
      'tonight', 'today', 'now', 'can\'t take it'
    ];

    // Elevated risk indicators
    const elevatedRiskKeywords = [
      'hopeless', 'worthless', 'burden', 'trapped', 'empty',
      'numb', 'breaking point', 'can\'t cope', 'overwhelmed'
    ];

    const foundCrisis = crisisKeywords.filter(keyword => lowerMessage.includes(keyword));
    const foundHighRisk = highRiskKeywords.filter(keyword => lowerMessage.includes(keyword));
    const foundElevated = elevatedRiskKeywords.filter(keyword => lowerMessage.includes(keyword));

    if (foundCrisis.length > 0) {
      return {
        level: foundHighRisk.length > 0 ? 'crisis' : 'high',
        indicators: [...foundCrisis, ...foundHighRisk],
        immediateNeeds: [
          'crisis_intervention',
          'safety_planning',
          'immediate_professional_support',
          'crisis_resource_sharing'
        ]
      };
    }

    if (foundElevated.length > 0) {
      return {
        level: 'elevated',
        indicators: foundElevated,
        immediateNeeds: [
          'emotional_support',
          'grounding_techniques',
          'professional_resource_sharing',
          'community_connection'
        ]
      };
    }

    return {
      level: 'none',
      indicators: [],
      immediateNeeds: ['standard_support']
    };
  }

  /**
   * Identify potential trauma triggers in conversation
   */
  private async identifyPotentialTriggers(message: string): Promise<{
    triggers: string[];
    accommodations: string[];
  }> {
    const lowerMessage = message.toLowerCase();

    const traumaTriggers = {
      violence: ['abuse', 'violence', 'assault', 'attack', 'hurt', 'beaten'],
      medical: ['hospital', 'surgery', 'medical', 'doctor', 'treatment'],
      family: ['family trauma', 'childhood', 'parents', 'toxic family'],
      identity: ['rejection', 'coming out', 'closet', 'passing', 'deadname'],
      systemic: ['police', 'discrimination', 'racism', 'transphobia', 'homophobia']
    };

    const foundTriggers: string[] = [];
    const accommodations: string[] = [];

    Object.entries(traumaTriggers).forEach(([category, keywords]) => {
      const categoryTriggers = keywords.filter(keyword => lowerMessage.includes(keyword));
      if (categoryTriggers.length > 0) {
        foundTriggers.push(category);
        accommodations.push(`${category}_informed_response`);
      }
    });

    return { triggers: foundTriggers, accommodations };
  }

  /**
   * Generate trauma-informed response content
   */
  private async generateTraumaInformedContent(
    userMessage: string,
    crisisAssessment: any,
    triggerAssessment: any,
    conversationHistory: string[]
  ): Promise<string> {
    // Crisis response
    if (crisisAssessment.level === 'crisis' || crisisAssessment.level === 'high') {
      return this.generateCrisisResponse(crisisAssessment);
    }

    // Elevated risk response
    if (crisisAssessment.level === 'elevated') {
      return this.generateElevatedRiskResponse(crisisAssessment, triggerAssessment);
    }

    // Standard trauma-informed response
    return this.generateStandardTraumaInformedResponse(userMessage, triggerAssessment);
  }

  /**
   * Generate crisis response with immediate resources
   */
  private generateCrisisResponse(crisisAssessment: any): string {
    return `I hear you, and I want you to know that your life has deep value and meaning. You matter to this community.

**🚨 Immediate Support Available:**

**Crisis Text Line:** Text HOME to 741741
**Trans Lifeline:** 877-565-8860 (by and for trans community)
**Suicide Prevention Lifeline:** 988
**LGBT National Lifeline:** 1-866-488-7386

**Right Now Safety:**
• Are you in immediate danger? If yes, please call 911 or go to emergency room
• Is there someone you trust who can be with you today?
• Can we make a plan for staying safe for the next 24 hours?

**Community Truth:**
Your ancestors survived incredible hardships so you could be here. Your community needs you. You belong here, and you deserve support and care.

**Immediate Steps:**
1. Please reach out to one of the crisis resources above
2. Tell someone you trust how you're feeling
3. Stay with people if possible - don't be alone right now
4. Remove access to means of harm if you can

You don't have to carry this alone. The community is here with you. 💜`;
  }

  /**
   * Generate elevated risk response with support and grounding
   */
  private generateElevatedRiskResponse(crisisAssessment: any, triggerAssessment: any): string {
    const groundingTechnique = this.groundingTechniques.sensory;

    return `Thank you for trusting me with how you're feeling. What you're experiencing is real and valid, and you deserve care and support.

**Grounding Invitation:**
If it feels safe for you, try this gentle grounding technique:

**${groundingTechnique.name}:**
${groundingTechnique.steps.map(step => `• ${step}`).join('\n')}

**Trauma-Informed Reminders:**
• You're not alone in this - many in our community have felt this way
• These feelings are temporary, even when they feel overwhelming
• You have survived difficult times before - you have strength
• It's okay to need support - seeking help is brave

**Community Support Available:**
• Crisis Text Line: Text HOME to 741741
• Local community mental health resources
• Peer support networks in our community

**Right Now:**
• Take things one moment at a time
• Be gentle with yourself
• Reach out to someone you trust
• Remember that you belong here

What would feel most supportive for you right now?`;
  }

  /**
   * Generate standard trauma-informed response
   */
  private generateStandardTraumaInformedResponse(
    userMessage: string,
    triggerAssessment: any
  ): string {
    return `Thank you for sharing with me. I'm honored that you trust me with your experience.

**Trauma-Informed Approach:**
• You are the expert on your own experience
• You get to choose how much or little to share
• Your feelings and reactions are valid
• You have strengths and resilience, even if it doesn't feel that way

**Community Wisdom:**
You're not alone in what you're going through. Many in our community have faced similar challenges, and there's collective wisdom and support available.

**Your Choices:**
• We can talk more about this if you want
• We can shift to something else that feels safer
• We can take a break anytime you need
• We can explore community resources and support

**Gentle Reminder:**
Healing isn't linear, and you don't have to be "strong" all the time. The community is here to support you exactly as you are.

What would feel most helpful for you right now?`;
  }

  /**
   * Create comprehensive safety resources
   */
  private async createSafetyResources(
    crisisAssessment: any,
    triggerAssessment: any
  ): Promise<ConversationSafety> {
    return {
      triggerWarnings: triggerAssessment.triggers,
      contentWarnings: this.generateContentWarnings(triggerAssessment.triggers),
      safetyResources: this.selectRelevantSafetyResources(crisisAssessment.level),
      groundingTechniques: Object.values(this.groundingTechniques).map(technique =>
        `${technique.name}: ${technique.description}`
      ),
      communitySupport: [
        "Local LGBTQ+ community centers",
        "Black mental health organizations",
        "Mutual aid networks",
        "Peer support groups",
        "Community healing circles"
      ]
    };
  }

  /**
   * Generate content warnings based on identified triggers
   */
  private generateContentWarnings(triggers: string[]): string[] {
    const warningMap: { [key: string]: string } = {
      violence: "Content mentions violence - please proceed with care",
      medical: "Medical content discussed - take breaks as needed",
      family: "Family trauma content - honor your boundaries",
      identity: "Identity-related challenges discussed",
      systemic: "Systemic oppression mentioned - practice self-care"
    };

    return triggers.map(trigger => warningMap[trigger] || "Potentially sensitive content");
  }

  /**
   * Select relevant safety resources based on risk level
   */
  private selectRelevantSafetyResources(riskLevel: string): string[] {
    const baseResources = [
      "Take breaks whenever you need them",
      "You control the pace of this conversation",
      "Community support is available 24/7"
    ];

    if (riskLevel === 'crisis' || riskLevel === 'high') {
      return [
        ...this.crisisResources.immediate.map(resource =>
          `${resource.name}: ${resource.contact} - ${resource.description}`
        ),
        ...baseResources
      ];
    }

    return [
      "Crisis Text Line: Text HOME to 741741",
      "National Suicide Prevention Lifeline: 988",
      ...baseResources
    ];
  }

  /**
   * Create empowerment elements focusing on choice and strength
   */
  private async createEmpowermentElements(userMessage: string): Promise<{
    strengthsAffirmed: string[];
    choicesOffered: string[];
    autonomyRespected: boolean;
  }> {
    return {
      strengthsAffirmed: [
        "You showed courage by reaching out and sharing",
        "You have survived challenges before - that shows resilience",
        "You are part of a community that values and supports you",
        "Your experience and wisdom matter to the collective"
      ],
      choicesOffered: [
        "Explore this topic further together",
        "Shift to talking about something else",
        "Take a break and return later",
        "Connect with community resources",
        "Focus on immediate self-care",
        "End this conversation for now"
      ],
      autonomyRespected: true
    };
  }

  /**
   * Generate safety plan template for users in crisis
   */
  generateSafetyPlan(): string {
    return `
**Community Safety Plan Template:**

**1. Warning Signs to Watch For:**
• Changes in mood, sleep, or eating
• Increased isolation or withdrawal
• Feeling overwhelmed or hopeless
• (Add your personal warning signs)

**2. Internal Coping Strategies:**
• Grounding techniques that work for you
• Community affirmations
• Movement or breathing practices
• (Add what works for you)

**3. Community Support People:**
• Trusted friend: ________________
• Family member: ________________
• Community member: ________________
• Crisis line: 741741 (text HOME)

**4. Professional Contacts:**
• Therapist/counselor: ________________
• Doctor: ________________
• Crisis center: ________________

**5. Safe Environment:**
• Remove or limit access to harmful items
• Stay around supportive people
• Create physical comfort (soft textures, warm drinks)

**6. Reasons for Living:**
• Community connections that matter to you
• Future goals and dreams
• Ways you contribute to collective liberation
• (Add your personal reasons)

Remember: This plan is yours to modify and use as needed. 💜`;
  }
}

export { TraumaInformedConversationManager };