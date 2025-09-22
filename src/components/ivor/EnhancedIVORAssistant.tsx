import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { EnhancedIVORCore, AIResponseContext, TraumaInformedContext, CommunityKnowledge } from './enhanced-ivor-core';
import { TraumaInformedConversationManager } from './trauma-informed-conversation';
import { CommunityWisdomIntegration } from './community-wisdom-integration';
import { CommunityLearningMLSystem } from './community-learning-ml';
import { DataSovereigntyPrivacyManager } from './data-sovereignty-privacy';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables for Enhanced IVOR');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface EnhancedIVORMessage {
  id: string;
  type: 'user' | 'ivor';
  content: string;
  timestamp: Date;
  category?: string;
  safetyLevel?: 'stable' | 'elevated' | 'crisis';
  wisdomUsed?: string[];
  resourcesShared?: string[];
  traumaInformed?: boolean;
}

interface UserContext {
  culturalIdentity: string[];
  previousConversations: number;
  supportPreferences: string[];
  accessibilityNeeds: string[];
  currentEmotionalState: string;
}

interface LiberationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'crisis-support' | 'trauma-healing' | 'organizing' | 'community-care' | 'liberation-wisdom' | 'creative-resistance';
  prompt: string;
  traumaInformed: boolean;
  culturallySpecific?: string[];
}

const ENHANCED_LIBERATION_TOOLS: LiberationTool[] = [
  {
    id: 'crisis-support',
    name: 'Crisis Support',
    description: 'Immediate support for mental health crises with community resources',
    icon: '🆘',
    category: 'crisis-support',
    prompt: 'I need immediate support. I\'m having thoughts of self-harm or suicide.',
    traumaInformed: true
  },
  {
    id: 'trauma-healing',
    name: 'Trauma Healing Circle',
    description: 'Gentle support for processing trauma with community wisdom',
    icon: '🌸',
    category: 'trauma-healing',
    prompt: 'I\'m dealing with trauma and need gentle, community-centered healing support.',
    traumaInformed: true
  },
  {
    id: 'ancestral-connection',
    name: 'Ancestral Wisdom',
    description: 'Connect with ancestral strength and traditional healing practices',
    icon: '✊🏾',
    category: 'liberation-wisdom',
    prompt: 'I want to connect with ancestral wisdom and traditional healing practices for strength.',
    traumaInformed: true,
    culturallySpecific: ['African-Diaspora', 'Indigenous']
  },
  {
    id: 'organizing-support',
    name: 'Organizing Wisdom',
    description: 'Community organizing strategies and collective action support',
    icon: '✊',
    category: 'organizing',
    prompt: 'I want to get involved in organizing or need support with community action.',
    traumaInformed: false
  },
  {
    id: 'community-care',
    name: 'Community Care Planning',
    description: 'Build sustainable support networks and mutual aid connections',
    icon: '🤝',
    category: 'community-care',
    prompt: 'I need help building a community care network and support system.',
    traumaInformed: true
  },
  {
    id: 'liberation-education',
    name: 'Liberation Education',
    description: 'Learn about liberation principles, community history, and organizing',
    icon: '📚',
    category: 'liberation-wisdom',
    prompt: 'I want to learn more about liberation principles and community organizing history.',
    traumaInformed: false
  },
  {
    id: 'creative-resistance',
    name: 'Creative Resistance',
    description: 'Art, creativity, and cultural work as tools for liberation',
    icon: '🎨',
    category: 'creative-resistance',
    prompt: 'I want to explore creative and artistic approaches to liberation and resistance.',
    traumaInformed: false
  },
  {
    id: 'joy-resistance',
    name: 'Joy as Resistance',
    description: 'Celebrate Black queer joy and community resilience',
    icon: '✨',
    category: 'community-care',
    prompt: 'I need to reconnect with joy, celebration, and the beauty of our community.',
    traumaInformed: true,
    culturallySpecific: ['Black', 'Queer']
  }
];

export default function EnhancedIVORAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<EnhancedIVORMessage[]>([
    {
      id: '1',
      type: 'ivor',
      content: `Hello, beloved community member! I'm IVOR, your enhanced AI companion for liberation and healing.

I'm here to support you with:
✊🏾 **Liberation wisdom** and ancestral knowledge
🌸 **Trauma-informed care** and healing practices
🤝 **Community organizing** and collective action
💜 **Crisis support** and immediate resources
🎨 **Creative resistance** and Black queer joy

I center your autonomy, honor your cultural identity, and approach every conversation with trauma-informed principles. You're in control of our conversation - share what feels safe and take breaks whenever you need.

How can I support you today?`,
      timestamp: new Date(),
      category: 'greeting',
      safetyLevel: 'stable',
      traumaInformed: true
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLiberationTools, setShowLiberationTools] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<UserContext>({
    culturalIdentity: [],
    previousConversations: 0,
    supportPreferences: [],
    accessibilityNeeds: [],
    currentEmotionalState: 'neutral'
  });

  // Enhanced AI components
  const [ivorCore] = useState(new EnhancedIVORCore());
  const [traumaManager] = useState(new TraumaInformedConversationManager());
  const [wisdomIntegration] = useState(new CommunityWisdomIntegration());
  const [mlSystem] = useState(new CommunityLearningMLSystem());
  const [privacyManager] = useState(new DataSovereigntyPrivacyManager());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const categories = Array.from(new Set(ENHANCED_LIBERATION_TOOLS.map(tool => tool.category)));

  const filteredTools = selectedCategory
    ? ENHANCED_LIBERATION_TOOLS.filter(tool => tool.category === selectedCategory)
    : ENHANCED_LIBERATION_TOOLS;

  const handleSendMessage = async (content: string = currentMessage) => {
    if (!content.trim()) return;

    const userMessage: EnhancedIVORMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setShowLiberationTools(false);

    try {
      // Store conversation in Supabase if available
      if (supabase) {
        await supabase.from('ivor_conversations').insert([
          {
            user_message: content,
            timestamp: new Date().toISOString(),
            session_id: 'enhanced-webapp-session-' + Date.now(),
            enhanced_features: true
          }
        ]);
      }

      // Generate enhanced AI response
      const response = await generateEnhancedResponse(content);

      const ivorMessage: EnhancedIVORMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ivor',
        content: response.content,
        timestamp: new Date(),
        safetyLevel: response.safetyLevel,
        wisdomUsed: response.wisdomUsed,
        resourcesShared: response.resourcesShared,
        traumaInformed: response.traumaInformed
      };

      setMessages(prev => [...prev, ivorMessage]);

      // Store enhanced IVOR response
      if (supabase) {
        await supabase.from('ivor_conversations').insert([
          {
            ivor_response: response.content,
            timestamp: new Date().toISOString(),
            session_id: 'enhanced-webapp-session-' + Date.now(),
            enhanced_features: true,
            safety_level: response.safetyLevel,
            wisdom_used: response.wisdomUsed,
            trauma_informed: response.traumaInformed
          }
        ]);
      }

    } catch (error) {
      console.error('Error generating enhanced response:', error);
      const errorMessage: EnhancedIVORMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ivor',
        content: 'I apologize, but I\'m having trouble responding right now. Your well-being is important - please reach out to the crisis resources if you need immediate support, or try again in a moment. The community is here for you. 💜',
        timestamp: new Date(),
        safetyLevel: 'stable',
        traumaInformed: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnhancedResponse = async (userMessage: string): Promise<{
    content: string;
    safetyLevel: 'stable' | 'elevated' | 'crisis';
    wisdomUsed: string[];
    resourcesShared: string[];
    traumaInformed: boolean;
  }> => {
    // Build AI response context
    const communityContext: CommunityKnowledge = {
      localResources: ['Community Fridge Network', 'Black Mental Health Collective', 'Mutual Aid Hub'],
      mutualAidNetworks: ['Local Mutual Aid', 'Community Kitchen Collective'],
      culturalPractices: ['Ubuntu Philosophy', 'Ancestral Meditation', 'Community Healing Circles'],
      healingTraditions: ['Traditional Healing', 'Restorative Justice', 'Community Accountability'],
      organizingHistory: ['Civil Rights Movement', 'Black Liberation', 'Queer Liberation']
    };

    const traumaContext: TraumaInformedContext = {
      isInCrisis: false,
      triggerWarnings: [],
      supportLevel: 'moderate',
      culturalContext: userContext.culturalIdentity,
      previousTrauma: false,
      safetyNeeds: []
    };

    const aiContext: AIResponseContext = {
      conversationHistory: messages.map(m => m.content).slice(-5), // Last 5 messages
      userEmotionalState: userContext.currentEmotionalState,
      communityContext,
      traumaContext,
      liberationGoals: ['community-healing', 'collective-liberation', 'individual-empowerment'],
      culturalIdentity: userContext.culturalIdentity
    };

    // Process with trauma-informed manager first
    const traumaResponse = await traumaManager.processTraumaInformedMessage(
      userMessage,
      messages.map(m => m.content),
      aiContext
    );

    // If crisis level, prioritize crisis response
    if (traumaResponse.safety.triggerWarnings.includes('crisis')) {
      return {
        content: traumaResponse.content,
        safetyLevel: 'crisis',
        wisdomUsed: ['crisis-intervention'],
        resourcesShared: traumaResponse.safety.safetyResources,
        traumaInformed: true
      };
    }

    // Generate liberation-focused response
    const liberationResponse = await ivorCore.generateLiberationResponse(userMessage, aiContext);

    // Integrate community wisdom
    const wisdomResults = await wisdomIntegration.searchCommunityWisdom(userMessage, {
      scenario: userMessage,
      culturalBackground: userContext.culturalIdentity,
      needsType: 'immediate-support'
    });

    // Combine responses with wisdom integration
    const enhancedContent = await integrateWisdomIntoResponse(
      liberationResponse,
      wisdomResults,
      traumaResponse
    );

    // Validate cultural authenticity
    const validation = await ivorCore.validateCulturalAuthenticity(enhancedContent);

    // Process conversation for machine learning (with privacy controls)
    const mlResult = await mlSystem.learnFromConversation(
      {
        messages: [userMessage, enhancedContent],
        context: messages.map(m => m.content).slice(-3),
        outcome: 'helpful', // This would be determined by user feedback
        userSatisfaction: 0.8, // Default - would be collected from user
        culturalRelevance: 0.9
      },
      {
        allowLearning: true, // Would be based on user privacy settings
        anonymize: true,
        culturalSharingPermission: true
      }
    );

    return {
      content: validation.isAuthentic ? enhancedContent : await applyValidationSuggestions(enhancedContent, validation),
      safetyLevel: traumaResponse.safety.triggerWarnings.length > 0 ? 'elevated' : 'stable',
      wisdomUsed: wisdomResults.wisdom.map(w => w.title),
      resourcesShared: wisdomResults.resources.map(r => r.name),
      traumaInformed: true
    };
  };

  const integrateWisdomIntoResponse = async (
    baseResponse: string,
    wisdomResults: any,
    traumaResponse: any
  ): Promise<string> => {
    if (wisdomResults.wisdom.length === 0) {
      return baseResponse + `

**Community Resources Available:**
• Crisis Text Line: Text HOME to 741741
• Local community support networks
• Mutual aid resources in your area

**Trauma-Informed Reminder:**
${traumaResponse.paceControl.choicePoints[0]}`;
    }

    const primaryWisdom = wisdomResults.wisdom[0];

    return baseResponse + `

**Community Wisdom: ${primaryWisdom.title}**
${primaryWisdom.description}

**From Our Ancestors:**
"${primaryWisdom.content.substring(0, 200)}..."

**Local Resources:**
${wisdomResults.resources.slice(0, 2).map((r: any) => `• ${r.name}: ${r.description}`).join('\n')}

**Your Choices:**
${traumaResponse.paceControl.choicePoints.slice(0, 2).join('\n• ')}

Remember: You are in control of this conversation and your healing journey. 💜`;
  };

  const applyValidationSuggestions = async (
    content: string,
    validation: any
  ): Promise<string> => {
    // Apply cultural authenticity suggestions
    let improvedContent = content;

    validation.suggestions.forEach((suggestion: string) => {
      if (suggestion.includes('inclusive language')) {
        improvedContent = improvedContent.replace(/\bguys\b/g, 'folks')
                                      .replace(/\bladies and gentlemen\b/g, 'everyone');
      }

      if (suggestion.includes('community strength')) {
        improvedContent += '\n\n**Community Strength:** You are part of a resilient, powerful community with deep wisdom and endless creativity. Your presence here matters.';
      }
    });

    return improvedContent;
  };

  const handleLiberationToolSelect = (tool: LiberationTool) => {
    // Update user context based on tool selection
    if (tool.culturallySpecific) {
      setUserContext(prev => ({
        ...prev,
        culturalIdentity: [...new Set([...prev.culturalIdentity, ...tool.culturallySpecific!])]
      }));
    }

    handleSendMessage(tool.prompt);
  };

  const getSafetyIndicator = (safetyLevel?: string) => {
    switch (safetyLevel) {
      case 'crisis': return '🚨';
      case 'elevated': return '⚠️';
      default: return '💜';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[95vh] md:h-[85vh] flex flex-col max-h-screen">
        {/* Enhanced Header */}
        <div className="bg-liberation-gold text-liberation-black p-3 md:p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-liberation-black rounded-full flex items-center justify-center">
              <span className="text-liberation-gold font-bold text-lg md:text-xl">✊</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">IVOR Enhanced - Liberation AI</h2>
              <p className="text-xs md:text-sm opacity-80 hidden sm:block">Trauma-informed, culturally authentic community support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-liberation-black hover:text-liberation-black/70 text-xl md:text-2xl font-bold touch-friendly p-1"
            aria-label="Close Enhanced IVOR"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Liberation Tools Sidebar */}
          {showLiberationTools && (
            <div className="w-full md:w-1/3 bg-liberation-cream border-r border-liberation-gold/20 p-3 md:p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h3 className="font-bold text-liberation-black text-sm md:text-base">Liberation Tools</h3>
                <button
                  onClick={() => setShowLiberationTools(false)}
                  className="md:hidden text-liberation-black/60 hover:text-liberation-black touch-friendly"
                >
                  ×
                </button>
              </div>

              {/* Category filters */}
              <div className="mb-3 md:mb-4">
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-2 md:px-3 py-1 rounded-full text-xs touch-friendly ${
                      selectedCategory === null
                        ? 'bg-liberation-gold text-liberation-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 md:px-3 py-1 rounded-full text-xs capitalize touch-friendly ${
                        selectedCategory === category
                          ? 'bg-liberation-gold text-liberation-black'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liberation tools */}
              <div className="space-y-2 md:space-y-3">
                {filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleLiberationToolSelect(tool)}
                    className={`w-full text-left p-2 md:p-3 bg-white rounded-lg border transition-all touch-friendly ${
                      tool.category === 'crisis-support'
                        ? 'border-red-300 hover:border-red-500 hover:bg-red-50'
                        : 'border-liberation-gold/20 hover:border-liberation-gold hover:bg-liberation-gold/5'
                    }`}
                  >
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <span className="text-lg md:text-2xl">{tool.icon}</span>
                      <div>
                        <h4 className="font-semibold text-liberation-black text-xs md:text-sm flex items-center gap-1">
                          {tool.name}
                          {tool.traumaInformed && <span className="text-green-600">🌸</span>}
                          {tool.category === 'crisis-support' && <span className="text-red-600">🆘</span>}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 hidden sm:block">{tool.description}</p>
                        {tool.culturallySpecific && (
                          <p className="text-xs text-purple-600 mt-1">
                            {tool.culturallySpecific.join(', ')} focused
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Chat Area */}
          <div className={`${showLiberationTools ? 'hidden md:flex md:w-2/3' : 'w-full'} flex-col`}>
            {/* Messages with safety indicators */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-liberation-gold text-liberation-black'
                        : 'bg-liberation-cream text-liberation-black border border-liberation-gold/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="whitespace-pre-line text-sm md:text-base flex-1">{message.content}</p>
                      {message.type === 'ivor' && message.safetyLevel && (
                        <span className="ml-2 text-lg">{getSafetyIndicator(message.safetyLevel)}</span>
                      )}
                    </div>

                    {/* Enhanced message metadata */}
                    {message.type === 'ivor' && (message.wisdomUsed || message.resourcesShared) && (
                      <div className="mt-2 text-xs opacity-75">
                        {message.wisdomUsed && message.wisdomUsed.length > 0 && (
                          <div>Wisdom: {message.wisdomUsed.join(', ')}</div>
                        )}
                        {message.resourcesShared && message.resourcesShared.length > 0 && (
                          <div>Resources: {message.resourcesShared.length} shared</div>
                        )}
                        {message.traumaInformed && (
                          <div className="text-green-600">🌸 Trauma-informed response</div>
                        )}
                      </div>
                    )}

                    <p className="text-xs opacity-60 mt-1 md:mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-liberation-cream text-liberation-black border border-liberation-gold/20 p-2 md:p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-liberation-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-liberation-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-liberation-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-xs ml-2">Processing with liberation wisdom...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-liberation-gold/20 p-3 md:p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Share what's on your heart - I'm here to listen with love..."
                  className="flex-1 p-2 md:p-3 border border-liberation-gold/20 rounded-lg focus:outline-none focus:border-liberation-gold text-sm md:text-base"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !currentMessage.trim()}
                  className="px-4 md:px-6 py-2 md:py-3 bg-liberation-gold text-liberation-black rounded-lg hover:bg-liberation-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-friendly text-sm md:text-base"
                >
                  Send
                </button>
              </div>

              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => setShowLiberationTools(!showLiberationTools)}
                  className="text-xs md:text-sm text-liberation-black/60 hover:text-liberation-black touch-friendly"
                >
                  {showLiberationTools ? 'Hide Tools' : 'Show Liberation Tools'}
                </button>
                <div className="text-xs text-liberation-black/60 hidden sm:block">
                  🌸 Trauma-informed • ✊🏾 Liberation-centered • 💜 Community care
                </div>
              </div>

              {/* Crisis resources always visible */}
              <div className="mt-2 text-xs text-gray-600">
                <strong>Crisis support:</strong> Text HOME to 741741 • Call 988 • Trans Lifeline: 877-565-8860
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}