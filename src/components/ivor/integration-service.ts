// Integration Service for Enhanced IVOR Components
// Coordinates all enhanced AI systems with centralized orchestration

import { EnhancedIVORCore, AIResponseContext } from './enhanced-ivor-core';
import { TraumaInformedConversationManager } from './trauma-informed-conversation';
import { CommunityWisdomIntegration } from './community-wisdom-integration';
import { ProactiveSupportSystem } from './proactive-support-system';
import { CommunityLearningMLSystem } from './community-learning-ml';
import { DataSovereigntyPrivacyManager } from './data-sovereignty-privacy';

export interface EnhancedResponse {
  content: string;
  safetyLevel: 'stable' | 'elevated' | 'crisis';
  traumaInformed: boolean;
  culturallyAuthentic: boolean;
  wisdomUsed: string[];
  resourcesShared: string[];
  proactiveSupport?: {
    type: string;
    priority: string;
    intervention: string;
  };
  privacyCompliant: boolean;
  learningContribution: {
    patternsExtracted: number;
    communityBenefit: string;
  };
}

export interface ConversationContext {
  messages: string[];
  userProfile: {
    culturalBackground: string[];
    supportPreferences: string[];
    privacySettings: any;
    traumaHistory?: string;
  };
  sessionMetadata: {
    duration: number;
    messageCount: number;
    safetyLevel: string;
    emergencyProtocols: boolean;
  };
}

class IVORIntegrationService {
  private ivorCore: EnhancedIVORCore;
  private traumaManager: TraumaInformedConversationManager;
  private wisdomIntegration: CommunityWisdomIntegration;
  private proactiveSupport: ProactiveSupportSystem;
  private mlSystem: CommunityLearningMLSystem;
  private privacyManager: DataSovereigntyPrivacyManager;

  constructor() {
    this.ivorCore = new EnhancedIVORCore();
    this.traumaManager = new TraumaInformedConversationManager();
    this.wisdomIntegration = new CommunityWisdomIntegration();
    this.proactiveSupport = new ProactiveSupportSystem();
    this.mlSystem = new CommunityLearningMLSystem();
    this.privacyManager = new DataSovereigntyPrivacyManager();
  }

  /**
   * Main orchestration method for generating enhanced IVOR responses
   */
  async generateEnhancedResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<EnhancedResponse> {

    // Step 1: Privacy and consent validation
    const privacyValidation = await this.validatePrivacyConsent(userMessage, context);
    if (!privacyValidation.allowed) {
      return this.generatePrivacyProtectedResponse(privacyValidation.reason);
    }

    // Step 2: Crisis detection and safety assessment
    const traumaResponse = await this.traumaManager.processTraumaInformedMessage(
      userMessage,
      context.messages,
      this.buildAIContext(context)
    );

    // Step 3: Immediate crisis intervention if needed
    if (traumaResponse.safety.triggerWarnings.includes('crisis')) {
      return await this.handleCrisisIntervention(traumaResponse, context);
    }

    // Step 4: Liberation-focused core response generation
    const liberationResponse = await this.ivorCore.generateLiberationResponse(
      userMessage,
      this.buildAIContext(context)
    );

    // Step 5: Community wisdom integration
    const wisdomResults = await this.wisdomIntegration.searchCommunityWisdom(
      userMessage,
      {
        scenario: userMessage,
        culturalBackground: context.userProfile.culturalBackground,
        needsType: this.categorizeNeed(userMessage)
      }
    );

    // Step 6: Cultural authenticity validation
    const culturalValidation = await this.ivorCore.validateCulturalAuthenticity(
      liberationResponse
    );

    // Step 7: Proactive support assessment
    const proactiveInterventions = await this.proactiveSupport.assessWellnessAndGenerateSupport(
      {
        currentMessage: userMessage,
        conversationHistory: context.messages,
        emotionalState: this.detectEmotionalState(userMessage, context),
        culturalContext: context.userProfile.culturalBackground,
        communityConnections: [], // Would be populated from user data
        previousSupport: [], // Would be populated from support history
        timestamp: new Date()
      }
    );

    // Step 8: Integrate all components into unified response
    const integratedContent = await this.integrateAllComponents(
      liberationResponse,
      wisdomResults,
      traumaResponse,
      proactiveInterventions,
      culturalValidation
    );

    // Step 9: Machine learning and continuous improvement
    const learningResult = await this.processLearningOpportunity(
      userMessage,
      integratedContent,
      context,
      {
        traumaInformed: traumaResponse.paceControl.choicePoints.length > 0,
        culturallyAuthentic: culturalValidation.isAuthentic,
        userSatisfaction: 0.8, // Would be collected via feedback
        communityRelevance: wisdomResults.wisdom.length > 0 ? 0.9 : 0.7
      }
    );

    // Step 10: Final validation and safety check
    const finalValidation = await this.performFinalValidation(integratedContent, context);

    return {
      content: finalValidation.content,
      safetyLevel: this.determineSafetyLevel(traumaResponse, proactiveInterventions),
      traumaInformed: traumaResponse.paceControl.choicePoints.length > 0,
      culturallyAuthentic: culturalValidation.isAuthentic,
      wisdomUsed: wisdomResults.wisdom.map(w => w.title),
      resourcesShared: wisdomResults.resources.map(r => r.name),
      proactiveSupport: proactiveInterventions.interventions.length > 0 ? {
        type: proactiveInterventions.interventions[0].type,
        priority: proactiveInterventions.interventions[0].priority,
        intervention: proactiveInterventions.interventions[0].content
      } : undefined,
      privacyCompliant: privacyValidation.allowed,
      learningContribution: {
        patternsExtracted: learningResult.newPatterns,
        communityBenefit: learningResult.improvements.join(', ')
      }
    };
  }

  /**
   * Handle crisis situations with immediate intervention
   */
  private async handleCrisisIntervention(
    traumaResponse: any,
    context: ConversationContext
  ): Promise<EnhancedResponse> {

    // Generate immediate crisis response
    const crisisContent = await this.generateCrisisResponse(traumaResponse);

    // Activate emergency protocols if needed
    if (traumaResponse.safety.triggerWarnings.includes('immediate-danger')) {
      await this.activateEmergencyProtocols(context);
    }

    // Proactive crisis support
    const emergencySupport = await this.proactiveSupport.generateEmergencySupport(
      traumaResponse.safety.safetyResources,
      context.userProfile.culturalBackground
    );

    return {
      content: crisisContent + '\n\n' + emergencySupport,
      safetyLevel: 'crisis',
      traumaInformed: true,
      culturallyAuthentic: true,
      wisdomUsed: ['crisis-intervention'],
      resourcesShared: traumaResponse.safety.safetyResources,
      privacyCompliant: true,
      learningContribution: {
        patternsExtracted: 0, // No learning during crisis to protect privacy
        communityBenefit: 'Crisis intervention provided'
      }
    };
  }

  /**
   * Integrate all AI components into a unified response
   */
  private async integrateAllComponents(
    liberationResponse: string,
    wisdomResults: any,
    traumaResponse: any,
    proactiveInterventions: any,
    culturalValidation: any
  ): Promise<string> {

    let integratedResponse = liberationResponse;

    // Add community wisdom if available
    if (wisdomResults.wisdom.length > 0) {
      const primaryWisdom = wisdomResults.wisdom[0];
      integratedResponse += `\n\n**Community Wisdom: ${primaryWisdom.title}**\n${primaryWisdom.description}`;
    }

    // Add trauma-informed elements
    if (traumaResponse.paceControl.choicePoints.length > 0) {
      integratedResponse += `\n\n**Your Choices:**\n${traumaResponse.paceControl.choicePoints.slice(0, 2).map((choice: string) => `• ${choice}`).join('\n')}`;
    }

    // Add proactive support if applicable
    if (proactiveInterventions.interventions.length > 0) {
      const primaryIntervention = proactiveInterventions.interventions[0];
      if (primaryIntervention.priority === 'high' || primaryIntervention.priority === 'urgent') {
        integratedResponse += `\n\n**Community Support Available:**\n${primaryIntervention.content}`;
      }
    }

    // Add cultural authenticity improvements
    if (!culturalValidation.isAuthentic && culturalValidation.suggestions.length > 0) {
      integratedResponse = await this.applyCulturalImprovements(integratedResponse, culturalValidation.suggestions);
    }

    // Add community resources
    if (wisdomResults.resources.length > 0) {
      integratedResponse += `\n\n**Local Resources:**\n${wisdomResults.resources.slice(0, 3).map((r: any) => `• ${r.name}: ${r.description}`).join('\n')}`;
    }

    // Always include liberation affirmation
    integratedResponse += `\n\n**Remember:** You are part of a powerful, resilient community. Your liberation is bound up with all of our liberation. 💜✊🏾`;

    return integratedResponse;
  }

  /**
   * Process machine learning opportunities with privacy protection
   */
  private async processLearningOpportunity(
    userMessage: string,
    response: string,
    context: ConversationContext,
    qualityMetrics: {
      traumaInformed: boolean;
      culturallyAuthentic: boolean;
      userSatisfaction: number;
      communityRelevance: number;
    }
  ): Promise<{ newPatterns: number; improvements: string[] }> {

    // Check user privacy settings for ML consent
    if (!context.userProfile.privacySettings?.allowMachineLearning) {
      return { newPatterns: 0, improvements: ['Privacy settings prevent learning'] };
    }

    return await this.mlSystem.learnFromConversation(
      {
        messages: [userMessage, response],
        context: context.messages.slice(-3),
        outcome: qualityMetrics.userSatisfaction > 0.7 ? 'helpful' : 'neutral',
        userSatisfaction: qualityMetrics.userSatisfaction,
        culturalRelevance: qualityMetrics.communityRelevance
      },
      {
        allowLearning: true,
        anonymize: true,
        culturalSharingPermission: context.userProfile.privacySettings?.allowCulturalSharing || false
      }
    );
  }

  /**
   * Validate privacy consent and data sovereignty requirements
   */
  private async validatePrivacyConsent(
    userMessage: string,
    context: ConversationContext
  ): Promise<{ allowed: boolean; reason?: string }> {

    // Check if user has provided informed consent
    if (!context.userProfile.privacySettings?.informedConsent) {
      return {
        allowed: false,
        reason: 'Informed consent required for enhanced features'
      };
    }

    // Validate against community data sovereignty principles
    const sovereigntyValidation = this.privacyManager.validateDataUse(
      'conversation-processing',
      'conversation',
      {
        informedConsent: true,
        purposeLimitation: ['community-support', 'liberation-education'],
        dataMinimization: true,
        transparencyLevel: 'full',
        culturalConsiderations: context.userProfile.culturalBackground,
        traumaInformedConsent: true
      }
    );

    return {
      allowed: sovereigntyValidation.approved,
      reason: sovereigntyValidation.reasons.join(', ')
    };
  }

  /**
   * Generate privacy-protected response when consent is not available
   */
  private generatePrivacyProtectedResponse(reason: string): EnhancedResponse {
    return {
      content: `I respect your privacy and data sovereignty. ${reason}.

I can still provide basic support and resources while you decide about enhanced features. Would you like to:

• Learn about our privacy protections and community data governance
• Continue with basic support (no data stored)
• Set up your privacy preferences for enhanced features

Your autonomy and consent are always honored here. 💜`,
      safetyLevel: 'stable',
      traumaInformed: true,
      culturallyAuthentic: true,
      wisdomUsed: ['privacy-protection'],
      resourcesShared: ['data-sovereignty-info'],
      privacyCompliant: true,
      learningContribution: {
        patternsExtracted: 0,
        communityBenefit: 'Privacy protection maintained'
      }
    };
  }

  // Helper methods
  private buildAIContext(context: ConversationContext): AIResponseContext {
    return {
      conversationHistory: context.messages.slice(-5),
      userEmotionalState: this.detectEmotionalState(context.messages[context.messages.length - 1], context),
      communityContext: {
        localResources: ['Community Fridge', 'Mutual Aid Hub', 'Black Mental Health Collective'],
        mutualAidNetworks: ['Local Mutual Aid', 'Community Kitchen'],
        culturalPractices: ['Ubuntu Philosophy', 'Ancestral Wisdom'],
        healingTraditions: ['Traditional Healing', 'Restorative Justice'],
        organizingHistory: ['Civil Rights', 'Black Liberation', 'Queer Liberation']
      },
      traumaContext: {
        isInCrisis: false,
        triggerWarnings: [],
        supportLevel: 'moderate',
        culturalContext: context.userProfile.culturalBackground,
        previousTrauma: false,
        safetyNeeds: []
      },
      liberationGoals: ['community-healing', 'collective-liberation', 'individual-empowerment'],
      culturalIdentity: context.userProfile.culturalBackground
    };
  }

  private categorizeNeed(message: string): string {
    if (message.includes('crisis') || message.includes('help')) return 'immediate-support';
    if (message.includes('healing') || message.includes('trauma')) return 'healing-support';
    if (message.includes('organize') || message.includes('action')) return 'organizing-support';
    if (message.includes('community') || message.includes('connect')) return 'community-connection';
    return 'general-support';
  }

  private detectEmotionalState(message: string, context: ConversationContext): string {
    // Simple emotion detection - would be enhanced with ML
    const distressWords = ['sad', 'angry', 'frustrated', 'hopeless', 'overwhelmed'];
    const joyWords = ['happy', 'excited', 'grateful', 'proud', 'celebrated'];

    if (distressWords.some(word => message.toLowerCase().includes(word))) return 'distress';
    if (joyWords.some(word => message.toLowerCase().includes(word))) return 'joy';
    return 'neutral';
  }

  private determineSafetyLevel(traumaResponse: any, proactiveInterventions: any): 'stable' | 'elevated' | 'crisis' {
    if (traumaResponse.safety.triggerWarnings.includes('crisis')) return 'crisis';
    if (traumaResponse.safety.triggerWarnings.length > 0) return 'elevated';
    if (proactiveInterventions.interventions.some((i: any) => i.priority === 'urgent')) return 'elevated';
    return 'stable';
  }

  private async generateCrisisResponse(traumaResponse: any): Promise<string> {
    return `**Immediate Support Available** 🆘

I hear you and I want you to know that you matter deeply to this community. Right now, let's focus on your immediate safety:

**Crisis Resources:**
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988
• Trans Lifeline: 877-565-8860
• LGBT National Hotline: 1-888-843-4564

**Right Now:**
• You are not alone - the community is here
• This feeling is temporary, even though it doesn't feel that way
• Your life has value and meaning
• Help is available and people want to support you

${traumaResponse.safety.safetyResources.map((resource: string) => `• ${resource}`).join('\n')}

Would you like me to help you connect with immediate support or someone to talk to?`;
  }

  private async activateEmergencyProtocols(context: ConversationContext): Promise<void> {
    // In a real implementation, this would:
    // - Log the crisis incident (with privacy protection)
    // - Potentially alert community support networks (with consent)
    // - Track for follow-up support (with user permission)
    console.log('Emergency protocols activated for crisis intervention');
  }

  private async applyCulturalImprovements(content: string, suggestions: string[]): Promise<string> {
    let improvedContent = content;

    suggestions.forEach(suggestion => {
      if (suggestion.includes('inclusive language')) {
        improvedContent = improvedContent.replace(/\bguys\b/g, 'folks')
                                        .replace(/\bfamily\b/g, 'chosen family and blood family');
      }
      if (suggestion.includes('community strength')) {
        improvedContent += '\n\n**Community Strength:** You are part of a resilient, powerful community with deep wisdom and endless creativity.';
      }
    });

    return improvedContent;
  }

  private async performFinalValidation(content: string, context: ConversationContext): Promise<{ content: string }> {
    // Final safety and appropriateness check
    // In a real implementation, this would run additional validation
    return { content };
  }
}

export { IVORIntegrationService };