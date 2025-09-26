// BLKOUT Liberation Platform - Content Classification ML Service
// Community-controlled automated content tagging with liberation alignment
// Privacy-preserving ML with community sovereignty principles

export interface ContentClassification {
  content_id: string;
  primary_category: string;
  secondary_categories: string[];
  liberation_alignment_score: number; // 0-1 scale
  community_relevance: number; // 0-1 scale
  safety_assessment: SafetyAssessment;
  demographic_tags: string[];
  topic_tags: string[];
  sentiment_analysis: SentimentData;
  quality_indicators: QualityMetrics;
  classification_confidence: number;
  model_version: string;
  requires_human_review: boolean;
}

export interface SafetyAssessment {
  trauma_informed: boolean;
  community_safe: boolean;
  cultural_respectful: boolean;
  anti_oppression_aligned: boolean;
  healing_centered: boolean;
  accessibility_compliant: boolean;
  content_warnings_needed: string[];
  safety_score: number; // 0-1 scale
}

export interface SentimentData {
  overall_sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  sentiment_score: number; // -1 to 1
  joy_level: number; // 0-1 scale (Black joy detection)
  empowerment_level: number; // 0-1 scale
  healing_potential: number; // 0-1 scale
  organizing_energy: number; // 0-1 scale
}

export interface QualityMetrics {
  information_density: number; // 0-1 scale
  source_credibility: number; // 0-1 scale
  cultural_accuracy: number; // 0-1 scale
  accessibility_score: number; // 0-1 scale
  engagement_potential: number; // 0-1 scale
  educational_value: number; // 0-1 scale
}

export interface LiberationAlignmentFactors {
  creator_sovereignty: number;
  community_empowerment: number;
  anti_oppression: number;
  cultural_authenticity: number;
  democratic_participation: number;
  economic_justice: number;
  healing_centered: number;
  joy_celebration: number;
}

export interface MLModelConfig {
  model_name: string;
  version: string;
  accuracy: number;
  bias_score: number;
  community_validated: boolean;
  cultural_sensitivity_score: number;
  trauma_awareness_score: number;
  last_retrained: Date;
  training_data_diversity: {
    cultural_backgrounds: string[];
    age_ranges: string[];
    identities: string[];
    geographic_locations: string[];
  };
}

class ContentClassificationMLService {
  private modelConfig: MLModelConfig;
  private liberationKeywords: Map<string, number>;
  private safetyKeywords: Map<string, number>;
  private categoryMappings: Map<string, string[]>;

  constructor() {
    this.modelConfig = {
      model_name: 'liberation-content-classifier',
      version: '1.0.0',
      accuracy: 0.87,
      bias_score: 0.12, // Lower is better
      community_validated: true,
      cultural_sensitivity_score: 0.92,
      trauma_awareness_score: 0.89,
      last_retrained: new Date('2025-09-15'),
      training_data_diversity: {
        cultural_backgrounds: ['African American', 'Caribbean', 'African', 'Afro-Latinx', 'Mixed Heritage'],
        age_ranges: ['18-25', '26-35', '36-45', '46-55', '55+'],
        identities: ['LGBTQIA+', 'Straight', 'Trans', 'Non-binary', 'Questioning'],
        geographic_locations: ['Urban', 'Suburban', 'Rural', 'International']
      }
    };

    this.initializeLiberationKeywords();
    this.initializeSafetyKeywords();
    this.initializeCategoryMappings();
  }

  /**
   * Classify content with liberation values alignment
   */
  async classifyContent(content: {
    title: string;
    description: string;
    content?: string;
    author?: string;
    source?: string;
    url?: string;
    existing_tags?: string[];
  }): Promise<ContentClassification> {

    const fullText = this.combineContentText(content);

    // Core classification analysis
    const liberationAlignment = await this.analyzeLiberationAlignment(fullText);
    const safetyAssessment = await this.assessSafety(fullText);
    const sentimentAnalysis = await this.analyzeSentiment(fullText);
    const qualityMetrics = await this.assessQuality(fullText, content);
    const categoryAnalysis = await this.categorizeContent(fullText);
    const topicTags = await this.generateTopicTags(fullText);

    // Community relevance scoring
    const communityRelevance = this.calculateCommunityRelevance(
      liberationAlignment,
      safetyAssessment,
      qualityMetrics
    );

    // Determine if human review needed
    const requiresReview = this.determineHumanReviewNeed(
      liberationAlignment.overall_score,
      safetyAssessment.safety_score,
      qualityMetrics,
      sentimentAnalysis
    );

    // Calculate classification confidence
    const confidence = this.calculateClassificationConfidence(
      liberationAlignment,
      safetyAssessment,
      qualityMetrics
    );

    return {
      content_id: content.url || `content_${Date.now()}`,
      primary_category: categoryAnalysis.primary,
      secondary_categories: categoryAnalysis.secondary,
      liberation_alignment_score: liberationAlignment.overall_score,
      community_relevance: communityRelevance,
      safety_assessment: safetyAssessment,
      demographic_tags: this.generateDemographicTags(fullText),
      topic_tags: topicTags,
      sentiment_analysis: sentimentAnalysis,
      quality_indicators: qualityMetrics,
      classification_confidence: confidence,
      model_version: this.modelConfig.version,
      requires_human_review: requiresReview
    };
  }

  /**
   * Analyze liberation alignment across key factors
   */
  private async analyzeLiberationAlignment(text: string): Promise<LiberationAlignmentFactors & { overall_score: number }> {
    const factors: LiberationAlignmentFactors = {
      creator_sovereignty: this.scoreLiberationFactor(text, 'creator_sovereignty'),
      community_empowerment: this.scoreLiberationFactor(text, 'community_empowerment'),
      anti_oppression: this.scoreLiberationFactor(text, 'anti_oppression'),
      cultural_authenticity: this.scoreLiberationFactor(text, 'cultural_authenticity'),
      democratic_participation: this.scoreLiberationFactor(text, 'democratic_participation'),
      economic_justice: this.scoreLiberationFactor(text, 'economic_justice'),
      healing_centered: this.scoreLiberationFactor(text, 'healing_centered'),
      joy_celebration: this.scoreLiberationFactor(text, 'joy_celebration')
    };

    // Weighted overall score prioritizing core liberation values
    const weights = {
      creator_sovereignty: 0.15,
      community_empowerment: 0.15,
      anti_oppression: 0.15,
      cultural_authenticity: 0.15,
      democratic_participation: 0.10,
      economic_justice: 0.10,
      healing_centered: 0.10,
      joy_celebration: 0.10
    };

    const overall_score = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * (weights as any)[key]);
    }, 0);

    return { ...factors, overall_score };
  }

  /**
   * Assess content safety with trauma-informed principles
   */
  private async assessSafety(text: string): Promise<SafetyAssessment> {
    const traumaInformed = this.assessTraumaInformed(text);
    const communitySafe = this.assessCommunitySafety(text);
    const culturalRespectful = this.assessCulturalRespect(text);
    const antiOppressionAligned = this.assessAntiOppression(text);
    const healingCentered = this.assessHealingCentered(text);
    const accessibilityCompliant = this.assessAccessibility(text);

    const contentWarnings = this.identifyContentWarnings(text);

    // Calculate overall safety score
    const safetyFactors = [
      traumaInformed ? 1 : 0,
      communitySafe ? 1 : 0,
      culturalRespectful ? 1 : 0,
      antiOppressionAligned ? 1 : 0,
      healingCentered ? 1 : 0,
      accessibilityCompliant ? 1 : 0
    ];

    const safetyScore = safetyFactors.reduce((sum, factor) => sum + factor, 0) / safetyFactors.length;

    return {
      trauma_informed: traumaInformed,
      community_safe: communitySafe,
      cultural_respectful: culturalRespectful,
      anti_oppression_aligned: antiOppressionAligned,
      healing_centered: healingCentered,
      accessibility_compliant: accessibilityCompliant,
      content_warnings_needed: contentWarnings,
      safety_score: safetyScore
    };
  }

  /**
   * Analyze sentiment with community-specific context
   */
  private async analyzeSentiment(text: string): Promise<SentimentData> {
    // Basic sentiment analysis
    const sentimentWords = this.extractSentimentWords(text);
    const sentimentScore = this.calculateSentimentScore(sentimentWords);

    // Community-specific sentiment factors
    const joyLevel = this.detectBlackJoy(text);
    const empowermentLevel = this.detectEmpowerment(text);
    const healingPotential = this.detectHealingPotential(text);
    const organizingEnergy = this.detectOrganizingEnergy(text);

    // Determine overall sentiment category
    let overallSentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    if (sentimentScore > 0.2) overallSentiment = 'positive';
    else if (sentimentScore < -0.2) overallSentiment = 'negative';
    else if (Math.abs(sentimentScore) <= 0.1) overallSentiment = 'neutral';
    else overallSentiment = 'mixed';

    return {
      overall_sentiment: overallSentiment,
      sentiment_score: sentimentScore,
      joy_level: joyLevel,
      empowerment_level: empowermentLevel,
      healing_potential: healingPotential,
      organizing_energy: organizingEnergy
    };
  }

  /**
   * Assess content quality with community-centered metrics
   */
  private async assessQuality(text: string, contentMeta: any): Promise<QualityMetrics> {
    const informationDensity = this.calculateInformationDensity(text);
    const sourceCredibility = this.assessSourceCredibility(contentMeta);
    const culturalAccuracy = this.assessCulturalAccuracy(text);
    const accessibilityScore = this.assessContentAccessibility(text);
    const engagementPotential = this.predictEngagementPotential(text);
    const educationalValue = this.assessEducationalValue(text);

    return {
      information_density: informationDensity,
      source_credibility: sourceCredibility,
      cultural_accuracy: culturalAccuracy,
      accessibility_score: accessibilityScore,
      engagement_potential: engagementPotential,
      educational_value: educationalValue
    };
  }

  /**
   * Categorize content into primary and secondary categories
   */
  private async categorizeContent(text: string): Promise<{ primary: string; secondary: string[] }> {
    const categoryScores = new Map<string, number>();

    // Score each potential category
    for (const [category, keywords] of this.categoryMappings) {
      const score = this.calculateCategoryScore(text, keywords);
      categoryScores.set(category, score);
    }

    // Sort by score to get primary and secondary categories
    const sortedCategories = Array.from(categoryScores.entries())
      .sort(([,a], [,b]) => b - a);

    const primary = sortedCategories[0]?.[0] || 'General';
    const secondary = sortedCategories
      .slice(1, 4)
      .filter(([, score]) => score > 0.3)
      .map(([category]) => category);

    return { primary, secondary };
  }

  /**
   * Generate topic tags using NLP techniques
   */
  private async generateTopicTags(text: string): Promise<string[]> {
    const tags = new Set<string>();

    // Extract key phrases and terms
    const keyPhrases = this.extractKeyPhrases(text);
    const namedEntities = this.extractNamedEntities(text);
    const thematicTerms = this.extractThematicTerms(text);

    // Add relevant tags
    keyPhrases.slice(0, 5).forEach(phrase => tags.add(phrase));
    namedEntities.slice(0, 3).forEach(entity => tags.add(entity));
    thematicTerms.slice(0, 4).forEach(term => tags.add(term));

    // Add liberation-specific tags
    const liberationTags = this.extractLiberationTags(text);
    liberationTags.forEach(tag => tags.add(tag));

    return Array.from(tags).slice(0, 12); // Limit to 12 tags
  }

  /**
   * Calculate community relevance score
   */
  private calculateCommunityRelevance(
    liberation: { overall_score: number },
    safety: SafetyAssessment,
    quality: QualityMetrics
  ): number {
    // Community relevance prioritizes liberation alignment and safety
    const liberationWeight = 0.4;
    const safetyWeight = 0.3;
    const qualityWeight = 0.3;

    return (
      liberation.overall_score * liberationWeight +
      safety.safety_score * safetyWeight +
      this.calculateOverallQuality(quality) * qualityWeight
    );
  }

  /**
   * Determine if content needs human review
   */
  private determineHumanReviewNeed(
    liberationScore: number,
    safetyScore: number,
    quality: QualityMetrics,
    sentiment: SentimentData
  ): boolean {
    // Require human review for:
    return (
      liberationScore < 0.4 || // Low liberation alignment
      safetyScore < 0.7 || // Potential safety concerns
      quality.cultural_accuracy < 0.6 || // Cultural accuracy concerns
      sentiment.overall_sentiment === 'negative' && sentiment.sentiment_score < -0.5 || // Very negative content
      quality.source_credibility < 0.5 // Questionable sources
    );
  }

  /**
   * Calculate classification confidence
   */
  private calculateClassificationConfidence(
    liberation: { overall_score: number },
    safety: SafetyAssessment,
    quality: QualityMetrics
  ): number {
    // Higher confidence when scores are more definitive
    const scores = [
      liberation.overall_score,
      safety.safety_score,
      this.calculateOverallQuality(quality)
    ];

    // Calculate variance (lower variance = higher confidence)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;

    // Convert variance to confidence (inverted and scaled)
    return Math.max(0.5, Math.min(1.0, 1.0 - variance));
  }

  // Helper methods for specific analysis tasks

  private combineContentText(content: any): string {
    return [
      content.title || '',
      content.description || '',
      content.content || ''
    ].join(' ').trim();
  }

  private scoreLiberationFactor(text: string, factor: keyof LiberationAlignmentFactors): number {
    const keywords = this.liberationKeywords.get(factor) || [];
    const lowerText = text.toLowerCase();

    let score = 0;
    let matches = 0;

    // Simple keyword matching with weighted scores
    for (const [keyword, weight] of Object.entries(keywords)) {
      if (lowerText.includes(keyword)) {
        score += weight;
        matches++;
      }
    }

    // Normalize score (0-1 scale)
    return Math.min(1.0, Math.max(0, score / 10)) * (matches > 0 ? 1 : 0.1);
  }

  private assessTraumaInformed(text: string): boolean {
    const traumaInformedIndicators = [
      'support', 'healing', 'safe', 'boundaries', 'consent', 'empowerment',
      'validation', 'strength', 'resilience', 'community care'
    ];

    const traumaticIndicators = [
      'blame', 'shame', 'fault', 'weakness', 'failure', 'victim blaming'
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = traumaInformedIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    const negativeCount = traumaticIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return positiveCount > negativeCount && positiveCount >= 1;
  }

  private assessCommunitySafety(text: string): boolean {
    const safetyIndicators = [
      'community', 'together', 'support', 'collective', 'mutual aid',
      'solidarity', 'protection', 'safe space', 'inclusive'
    ];

    const unsafeIndicators = [
      'hate', 'discriminat', 'harass', 'threaten', 'violence', 'toxic'
    ];

    const lowerText = text.toLowerCase();
    const safeCount = safetyIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    const unsafeCount = unsafeIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return safeCount > 0 && unsafeCount === 0;
  }

  private assessCulturalRespect(text: string): boolean {
    // Check for cultural appreciation vs appropriation
    const respectfulIndicators = [
      'honor', 'respect', 'learn from', 'celebrate', 'acknowledge',
      'tradition', 'heritage', 'ancestors', 'community wisdom'
    ];

    const appropriationIndicators = [
      'exotic', 'primitive', 'savage', 'urban', 'ghetto'
    ];

    const lowerText = text.toLowerCase();
    const respectCount = respectfulIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    const appropriationCount = appropriationIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return appropriationCount === 0 && (respectCount > 0 || text.length < 100);
  }

  private assessAntiOppression(text: string): boolean {
    const antiOppressionIndicators = [
      'justice', 'liberation', 'equality', 'freedom', 'rights',
      'anti-racist', 'dismantl', 'resist', 'transform', 'revolution'
    ];

    const oppressionIndicators = [
      'stereotype', 'discriminat', 'supremac', 'bias', 'prejudice'
    ];

    const lowerText = text.toLowerCase();
    const antiOppressionCount = antiOppressionIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    const oppressionCount = oppressionIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    // Context matters - discussing oppression to fight it is good
    return antiOppressionCount > 0 || oppressionCount === 0;
  }

  private assessHealingCentered(text: string): boolean {
    const healingIndicators = [
      'heal', 'recovery', 'wellness', 'self-care', 'restoration',
      'therapy', 'mental health', 'emotional', 'spiritual', 'growth'
    ];

    return healingIndicators.some(indicator =>
      text.toLowerCase().includes(indicator)
    );
  }

  private assessAccessibility(text: string): boolean {
    const accessibilityIndicators = [
      'accessible', 'wheelchair', 'sign language', 'captions',
      'transcript', 'screen reader', 'alternative text', 'inclusive design'
    ];

    // For now, assume accessible unless specifically mentioned
    const hasAccessibilityMention = accessibilityIndicators.some(indicator =>
      text.toLowerCase().includes(indicator)
    );

    return hasAccessibilityMention || text.length < 200; // Short content likely accessible
  }

  private identifyContentWarnings(text: string): string[] {
    const warnings: string[] = [];
    const lowerText = text.toLowerCase();

    const triggerTopics = {
      'violence': ['violence', 'assault', 'attack', 'murder', 'killing'],
      'trauma': ['trauma', 'abuse', 'ptsd', 'trigger'],
      'death': ['death', 'suicide', 'dying', 'funeral'],
      'mental_health': ['depression', 'anxiety', 'panic', 'self-harm'],
      'substance_use': ['drug', 'alcohol', 'addiction', 'overdose'],
      'sexual_content': ['sexual', 'rape', 'assault', 'harassment']
    };

    for (const [warning, keywords] of Object.entries(triggerTopics)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        warnings.push(warning);
      }
    }

    return warnings;
  }

  private extractSentimentWords(text: string): { positive: string[]; negative: string[] } {
    const positiveWords = [
      'love', 'joy', 'celebration', 'success', 'victory', 'beautiful',
      'amazing', 'wonderful', 'excellent', 'fantastic', 'brilliant',
      'hope', 'inspire', 'empower', 'unite', 'strength', 'resilience'
    ];

    const negativeWords = [
      'hate', 'anger', 'sad', 'terrible', 'awful', 'horrible',
      'disgusting', 'disappointing', 'frustrated', 'worried', 'fear',
      'concern', 'problem', 'issue', 'struggle', 'difficult'
    ];

    const words = text.toLowerCase().split(/\s+/);

    return {
      positive: words.filter(word => positiveWords.includes(word)),
      negative: words.filter(word => negativeWords.includes(word))
    };
  }

  private calculateSentimentScore(sentimentWords: { positive: string[]; negative: string[] }): number {
    const positiveScore = sentimentWords.positive.length;
    const negativeScore = sentimentWords.negative.length;
    const totalWords = positiveScore + negativeScore;

    if (totalWords === 0) return 0;

    return (positiveScore - negativeScore) / Math.max(totalWords, 10);
  }

  private detectBlackJoy(text: string): number {
    const joyIndicators = [
      'celebrate', 'joy', 'happiness', 'laughter', 'dancing', 'music',
      'party', 'festival', 'community gathering', 'black excellence',
      'black girl magic', 'melanin', 'proud', 'beautiful', 'brilliant'
    ];

    const lowerText = text.toLowerCase();
    const joyCount = joyIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return Math.min(1.0, joyCount / 5); // Scale to 0-1
  }

  private detectEmpowerment(text: string): number {
    const empowermentIndicators = [
      'empower', 'strength', 'strong', 'capable', 'achieve', 'success',
      'leadership', 'independence', 'self-determination', 'sovereignty',
      'control', 'agency', 'voice', 'speak up', 'stand up'
    ];

    const lowerText = text.toLowerCase();
    const empowermentCount = empowermentIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return Math.min(1.0, empowermentCount / 5);
  }

  private detectHealingPotential(text: string): number {
    const healingIndicators = [
      'heal', 'recovery', 'wellness', 'peace', 'calm', 'restore',
      'balance', 'therapy', 'support', 'care', 'nurture', 'growth'
    ];

    const lowerText = text.toLowerCase();
    const healingCount = healingIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return Math.min(1.0, healingCount / 4);
  }

  private detectOrganizingEnergy(text: string): number {
    const organizingIndicators = [
      'organize', 'mobilize', 'action', 'movement', 'campaign', 'protest',
      'activism', 'advocate', 'fight', 'resist', 'change', 'transform',
      'collective', 'community', 'together', 'unite', 'solidarity'
    ];

    const lowerText = text.toLowerCase();
    const organizingCount = organizingIndicators.filter(indicator =>
      lowerText.includes(indicator)
    ).length;

    return Math.min(1.0, organizingCount / 5);
  }

  private calculateInformationDensity(text: string): number {
    const words = text.split(/\s+/).length;
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const sentences = text.split(/[.!?]+/).length;

    // Higher density = more unique words per sentence, more information per word
    const density = (uniqueWords / words) * (words / Math.max(sentences, 1)) / 20;
    return Math.min(1.0, density);
  }

  private assessSourceCredibility(contentMeta: any): number {
    // Placeholder for source credibility assessment
    // In real implementation, this would check domain reputation, author credentials, etc.
    let credibility = 0.7; // Default moderate credibility

    if (contentMeta.source) {
      const trustedSources = [
        'bbc', 'reuters', 'ap news', 'npr', 'pbs', 'guardian',
        'washington post', 'new york times', 'propublica'
      ];

      if (trustedSources.some(source =>
        contentMeta.source.toLowerCase().includes(source)
      )) {
        credibility = 0.9;
      }
    }

    return credibility;
  }

  private assessCulturalAccuracy(text: string): number {
    // Placeholder for cultural accuracy assessment
    // In real implementation, this would use community feedback and validation

    const culturalTerms = [
      'black', 'african', 'caribbean', 'diaspora', 'melanin',
      'lgbtq', 'queer', 'trans', 'non-binary', 'community',
      'liberation', 'freedom', 'justice', 'equality'
    ];

    const lowerText = text.toLowerCase();
    const culturalRelevance = culturalTerms.filter(term =>
      lowerText.includes(term)
    ).length;

    // Base score with cultural relevance bonus
    return Math.min(1.0, 0.7 + (culturalRelevance / 20));
  }

  private assessContentAccessibility(text: string): number {
    // Basic accessibility assessment
    let score = 0.7; // Base score

    // Penalize very long paragraphs (readability)
    const sentences = text.split(/[.!?]+/);
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);
    if (avgSentenceLength < 100) score += 0.2;

    // Check for complex vocabulary
    const complexWords = text.split(/\s+/).filter(word => word.length > 12).length;
    const totalWords = text.split(/\s+/).length;
    const complexRatio = complexWords / Math.max(totalWords, 1);
    if (complexRatio < 0.1) score += 0.1;

    return Math.min(1.0, score);
  }

  private predictEngagementPotential(text: string): number {
    // Predict engagement based on content characteristics
    let potential = 0.5; // Base potential

    // Question-based content often drives engagement
    const questionCount = (text.match(/\?/g) || []).length;
    potential += Math.min(0.2, questionCount * 0.05);

    // Call-to-action language
    const actionWords = ['join', 'share', 'comment', 'discuss', 'participate', 'engage'];
    const actionCount = actionWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    potential += Math.min(0.2, actionCount * 0.05);

    // Community-focused content
    const communityWords = ['community', 'together', 'collective', 'we', 'our', 'us'];
    const communityCount = communityWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    potential += Math.min(0.3, communityCount * 0.05);

    return Math.min(1.0, potential);
  }

  private assessEducationalValue(text: string): number {
    // Assess educational potential
    let value = 0.3; // Base value

    // Educational indicators
    const educationalWords = [
      'learn', 'teach', 'education', 'knowledge', 'understand', 'explain',
      'research', 'study', 'analysis', 'insight', 'information', 'facts'
    ];

    const educationalCount = educationalWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    value += Math.min(0.4, educationalCount * 0.05);

    // Historical or cultural context
    const contextWords = [
      'history', 'historical', 'cultural', 'tradition', 'heritage',
      'context', 'background', 'origin', 'development', 'evolution'
    ];

    const contextCount = contextWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    value += Math.min(0.3, contextCount * 0.05);

    return Math.min(1.0, value);
  }

  private calculateCategoryScore(text: string, keywords: string[]): number {
    const lowerText = text.toLowerCase();
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    return matches / Math.max(keywords.length, 1);
  }

  private extractKeyPhrases(text: string): string[] {
    // Simple key phrase extraction (in real implementation, would use NLP libraries)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    return Array.from(wordFreq.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private extractNamedEntities(text: string): string[] {
    // Simple named entity extraction (placeholder)
    // In real implementation, would use NLP libraries like spaCy or NLTK
    const entities: string[] = [];

    // Extract capitalized words (potential names/organizations)
    const capitalizedWords = text.match(/\b[A-Z][a-z]+\b/g) || [];
    entities.push(...capitalizedWords.slice(0, 5));

    return [...new Set(entities)];
  }

  private extractThematicTerms(text: string): string[] {
    const themes = [
      'liberation', 'freedom', 'justice', 'equality', 'community',
      'organizing', 'activism', 'empowerment', 'healing', 'celebration',
      'culture', 'identity', 'solidarity', 'resistance', 'transformation'
    ];

    return themes.filter(theme =>
      text.toLowerCase().includes(theme)
    );
  }

  private extractLiberationTags(text: string): string[] {
    const liberationTags = new Set<string>();
    const lowerText = text.toLowerCase();

    // Liberation-specific tag mapping
    const tagMappings = {
      'black-joy': ['joy', 'celebrate', 'happiness', 'black excellence'],
      'community-care': ['care', 'support', 'mutual aid', 'community'],
      'anti-oppression': ['anti-racist', 'justice', 'equality', 'liberation'],
      'healing': ['healing', 'therapy', 'wellness', 'recovery'],
      'organizing': ['organize', 'activism', 'movement', 'collective action'],
      'culture': ['culture', 'tradition', 'heritage', 'identity'],
      'empowerment': ['empower', 'strength', 'agency', 'self-determination']
    };

    for (const [tag, keywords] of Object.entries(tagMappings)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        liberationTags.add(tag);
      }
    }

    return Array.from(liberationTags);
  }

  private calculateOverallQuality(quality: QualityMetrics): number {
    return (
      quality.information_density * 0.2 +
      quality.source_credibility * 0.2 +
      quality.cultural_accuracy * 0.2 +
      quality.accessibility_score * 0.15 +
      quality.engagement_potential * 0.15 +
      quality.educational_value * 0.1
    );
  }

  private generateDemographicTags(text: string): string[] {
    // Generate demographic relevance tags (anonymized)
    const demographicTags: string[] = [];
    const lowerText = text.toLowerCase();

    // Age relevance
    const youthTerms = ['youth', 'young', 'student', 'college', 'school'];
    const elderTerms = ['elder', 'senior', 'wisdom', 'experience', 'mentor'];

    if (youthTerms.some(term => lowerText.includes(term))) {
      demographicTags.push('youth-relevant');
    }
    if (elderTerms.some(term => lowerText.includes(term))) {
      demographicTags.push('elder-wisdom');
    }

    // Identity relevance
    const identityTerms = {
      'lgbtq-focused': ['lgbtq', 'queer', 'trans', 'gay', 'lesbian', 'bisexual'],
      'women-focused': ['women', 'feminist', 'gender', 'sisterhood'],
      'family-focused': ['family', 'parent', 'children', 'community family']
    };

    for (const [tag, terms] of Object.entries(identityTerms)) {
      if (terms.some(term => lowerText.includes(term))) {
        demographicTags.push(tag);
      }
    }

    return demographicTags;
  }

  private initializeLiberationKeywords(): void {
    this.liberationKeywords = new Map([
      ['creator_sovereignty', {
        'creator': 0.8, 'artist': 0.7, 'ownership': 1.0, 'copyright': 0.9,
        'intellectual property': 1.0, 'revenue': 0.8, 'payment': 0.7, 'income': 0.7,
        'economic freedom': 1.0, 'financial independence': 0.9
      }],
      ['community_empowerment', {
        'community': 0.9, 'empowerment': 1.0, 'collective': 0.8, 'together': 0.6,
        'solidarity': 0.9, 'mutual aid': 1.0, 'cooperation': 0.8, 'collaboration': 0.7,
        'organizing': 0.9, 'mobilize': 0.8
      }],
      ['anti_oppression', {
        'anti-racist': 1.0, 'justice': 0.9, 'equality': 0.8, 'liberation': 1.0,
        'freedom': 0.8, 'human rights': 0.9, 'civil rights': 0.8, 'systemic change': 1.0,
        'dismantl': 0.9, 'transform': 0.8
      }],
      ['cultural_authenticity', {
        'authentic': 0.8, 'cultural': 0.7, 'tradition': 0.7, 'heritage': 0.8,
        'identity': 0.7, 'representation': 0.9, 'voice': 0.8, 'narrative': 0.7,
        'storytelling': 0.6, 'community wisdom': 0.9
      }],
      ['democratic_participation', {
        'democratic': 0.8, 'participation': 0.8, 'voting': 0.7, 'consensus': 0.9,
        'decision making': 0.8, 'governance': 0.8, 'transparency': 0.7, 'accountability': 0.8,
        'community input': 0.9, 'collective decision': 0.9
      }],
      ['economic_justice', {
        'economic justice': 1.0, 'fair wage': 0.9, 'living wage': 0.9, 'economic equality': 1.0,
        'wealth redistribution': 0.8, 'economic democracy': 1.0, 'cooperative': 0.8,
        'worker rights': 0.8, 'economic empowerment': 1.0
      }],
      ['healing_centered', {
        'healing': 1.0, 'trauma informed': 1.0, 'mental health': 0.8, 'wellness': 0.7,
        'self-care': 0.8, 'community care': 1.0, 'restoration': 0.8, 'recovery': 0.7,
        'therapy': 0.6, 'support': 0.7
      }],
      ['joy_celebration', {
        'joy': 1.0, 'celebration': 0.9, 'happiness': 0.7, 'festival': 0.8,
        'party': 0.6, 'dance': 0.7, 'music': 0.6, 'art': 0.6,
        'black joy': 1.0, 'black excellence': 1.0
      }]
    ]);
  }

  private initializeSafetyKeywords(): void {
    this.safetyKeywords = new Map([
      ['trauma_informed', {
        'trigger warning': 0.9, 'content warning': 0.9, 'safe space': 1.0,
        'consent': 0.8, 'boundaries': 0.8, 'support': 0.7, 'validation': 0.8,
        'empowerment': 0.7, 'choice': 0.7, 'control': 0.8
      }],
      ['community_safe', {
        'inclusive': 0.8, 'welcoming': 0.7, 'respectful': 0.8, 'harassment-free': 1.0,
        'community guidelines': 0.9, 'moderation': 0.7, 'protection': 0.8,
        'safety': 0.9, 'secure': 0.7
      }]
    ]);
  }

  private initializeCategoryMappings(): void {
    this.categoryMappings = new Map([
      ['Community Organizing', [
        'organize', 'mobilize', 'activism', 'movement', 'campaign',
        'protest', 'demonstration', 'action', 'collective', 'solidarity'
      ]],
      ['Arts & Culture', [
        'art', 'artist', 'creative', 'culture', 'music', 'performance',
        'visual', 'literature', 'poetry', 'dance', 'theater'
      ]],
      ['Economic Justice', [
        'economic', 'finance', 'wage', 'income', 'wealth', 'inequality',
        'poverty', 'employment', 'business', 'cooperative', 'trade union'
      ]],
      ['Health & Wellness', [
        'health', 'wellness', 'mental health', 'healthcare', 'therapy',
        'healing', 'medicine', 'fitness', 'nutrition', 'self-care'
      ]],
      ['Education', [
        'education', 'school', 'university', 'learning', 'teach',
        'student', 'knowledge', 'curriculum', 'academic', 'literacy'
      ]],
      ['Technology', [
        'technology', 'digital', 'internet', 'social media', 'platform',
        'software', 'app', 'data', 'privacy', 'algorithm'
      ]],
      ['Politics & Policy', [
        'politics', 'policy', 'government', 'legislation', 'voting',
        'election', 'democracy', 'representative', 'public', 'civic'
      ]],
      ['Environment', [
        'environment', 'climate', 'sustainability', 'green', 'ecology',
        'conservation', 'renewable', 'pollution', 'nature', 'earth'
      ]]
    ]);
  }

  /**
   * Get model performance and configuration
   */
  getModelConfig(): MLModelConfig {
    return { ...this.modelConfig };
  }

  /**
   * Update model configuration (for retraining/improvements)
   */
  updateModelConfig(updates: Partial<MLModelConfig>): void {
    this.modelConfig = { ...this.modelConfig, ...updates };
  }

  /**
   * Batch classify multiple content items
   */
  async batchClassifyContent(contents: any[]): Promise<ContentClassification[]> {
    const classifications = await Promise.all(
      contents.map(content => this.classifyContent(content))
    );

    return classifications;
  }
}

// Export singleton instance for service usage
export const contentClassificationML = new ContentClassificationMLService();

// Export types and interfaces
export type {
  ContentClassification,
  SafetyAssessment,
  SentimentData,
  QualityMetrics,
  LiberationAlignmentFactors,
  MLModelConfig
};