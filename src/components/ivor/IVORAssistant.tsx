import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ResourceCard from './ResourceCard';
import { API_ENDPOINTS } from '../../config/api';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables for IVOR');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// IVOR Core API endpoint (from centralized config)
const IVOR_API_URL = API_ENDPOINTS.ivorChat;

interface Resource {
  id: string;
  name: string;
  description: string;
  organization: string;
  url?: string;
  phone?: string;
  email?: string;
  location: string;
  score?: number;
}

interface IVORMessage {
  id: string;
  type: 'user' | 'ivor';
  content: string;
  timestamp: Date;
  category?: string;
  resources?: Resource[];
  resourceCount?: number;
  enhancedWithRAG?: boolean;
}

interface LearningTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'problem-solving' | 'emotional-support' | 'learning' | 'entertainment';
  prompt: string;
}

const LEARNING_TOOLS: LearningTool[] = [
  {
    id: 'problem-solving',
    name: 'Problem-Solving Assistant',
    description: 'Work through challenges step by step with community-centered solutions',
    icon: '🧠',
    category: 'problem-solving',
    prompt: 'I need help working through a problem. Can you guide me through a step-by-step process that centers community wisdom and liberation principles?'
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Navigate interpersonal challenges with trauma-informed approaches',
    icon: '🤝',
    category: 'problem-solving',
    prompt: 'I\'m dealing with a conflict and need guidance on how to approach it with community care and trauma-informed practices.'
  },
  {
    id: 'study-buddy',
    name: 'Study Partner',
    description: 'Get help understanding concepts and organizing learning',
    icon: '📚',
    category: 'learning',
    prompt: 'I\'d like you to be my study partner. Can you help me understand and learn about a topic?'
  },
  {
    id: 'emotional-support',
    name: 'Emotional Check-In',
    description: 'Space for emotional processing and community support',
    icon: '💜',
    category: 'emotional-support',
    prompt: 'I could use some emotional support and a caring check-in. Can you help me process what I\'m feeling?'
  },
  {
    id: 'jokes-humor',
    name: 'Jokes & Humor',
    description: 'Share community-appropriate jokes and lighthearted moments',
    icon: '😄',
    category: 'entertainment',
    prompt: 'I could use a good laugh! Can you share some community-appropriate humor or a joke?'
  },
  {
    id: 'liberation-wisdom',
    name: 'Liberation Wisdom',
    description: 'Explore liberation principles and community wisdom',
    icon: '✊🏾',
    category: 'learning',
    prompt: 'I\'d like to explore liberation principles and community wisdom. Can you share some insights?'
  },
  {
    id: 'creative-spark',
    name: 'Creative Inspiration',
    description: 'Get unstuck with creative projects and artistic expression',
    icon: '🎨',
    category: 'problem-solving',
    prompt: 'I\'m feeling creatively stuck. Can you help me find inspiration and new approaches to my creative work?'
  },
  {
    id: 'resource-finder',
    name: 'Resource Navigator',
    description: 'Find community resources and mutual aid opportunities',
    icon: '🗺️',
    category: 'learning',
    prompt: 'I need help finding resources or connecting with community support. Can you guide me?'
  }
];

export default function IVORAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<IVORMessage[]>([
    {
      id: '1',
      type: 'ivor',
      content: 'Hello! I\'m IVOR, your community AI assistant. I\'m here to support you with learning tools, problem-solving, and community wisdom. How can I help you today?',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLearningTools, setShowLearningTools] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const categories = Array.from(new Set(LEARNING_TOOLS.map(tool => tool.category)));

  const filteredTools = selectedCategory
    ? LEARNING_TOOLS.filter(tool => tool.category === selectedCategory)
    : LEARNING_TOOLS;

  const handleSendMessage = async (content: string = currentMessage) => {
    if (!content.trim()) return;

    const userMessage: IVORMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setShowLearningTools(false);

    try {
      // Store conversation in Supabase if available
      if (supabase) {
        await supabase.from('ivor_conversations').insert([
          {
            user_message: content,
            timestamp: new Date().toISOString(),
            session_id: 'webapp-session-' + Date.now()
          }
        ]);
      }

      // Call real IVOR Core API with RAG enhancement
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const apiResponse = await fetch(IVOR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: `webapp-${Date.now()}`,
          conversationHistory: conversationHistory,
          userContext: {
            source: 'web-widget',
            platform: 'community-platform'
          },
          liberationContext: {
            liberationValues: {
              communityProtectionRequired: true,
              creatorSovereigntyEnforcement: true,
              culturalAuthenticityValidation: true,
              antiOppressionActive: true
            }
          }
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      const ivorMessage: IVORMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ivor',
        content: data.response || data.message || 'I apologize, but I received an unexpected response. Please try again.',
        timestamp: new Date(),
        resources: data.resources || [],
        resourceCount: data.resourceCount || 0,
        enhancedWithRAG: data.enhancedWithRAG || false
      };

      setMessages(prev => [...prev, ivorMessage]);

      // Store IVOR response
      if (supabase) {
        await supabase.from('ivor_conversations').insert([
          {
            ivor_response: ivorMessage.content,
            timestamp: new Date().toISOString(),
            session_id: 'webapp-session-' + Date.now()
          }
        ]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: IVORMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ivor',
        content: 'I apologize, but I\'m having trouble connecting to my backend right now. Please try again in a moment, or reach out to the community for support.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearningToolSelect = (tool: LearningTool) => {
    handleSendMessage(tool.prompt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] md:h-[80vh] flex flex-col max-h-screen">
        {/* Header */}
        <div className="bg-liberation-gold text-liberation-black p-3 md:p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-liberation-black rounded-full flex items-center justify-center">
              <span className="text-liberation-gold font-bold text-sm md:text-base">I</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">IVOR - Community AI Assistant</h2>
              <p className="text-xs md:text-sm opacity-80 hidden sm:block">Your learning companion and community support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-liberation-black hover:text-liberation-black/70 text-xl md:text-2xl font-bold touch-friendly p-1"
            aria-label="Close IVOR Assistant"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Learning Tools Sidebar */}
          {showLearningTools && (
            <div className="w-full md:w-1/3 bg-liberation-cream border-r border-liberation-gold/20 p-3 md:p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h3 className="font-bold text-liberation-black text-sm md:text-base">Learning Tools</h3>
                <button
                  onClick={() => setShowLearningTools(false)}
                  className="md:hidden text-liberation-black/60 hover:text-liberation-black touch-friendly"
                  aria-label="Close learning tools"
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

              {/* Learning tools */}
              <div className="space-y-2 md:space-y-3">
                {filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleLearningToolSelect(tool)}
                    className="w-full text-left p-2 md:p-3 bg-white rounded-lg border border-liberation-gold/20 hover:border-liberation-gold hover:bg-liberation-gold/5 transition-all touch-friendly"
                  >
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <span className="text-lg md:text-2xl">{tool.icon}</span>
                      <div>
                        <h4 className="font-semibold text-liberation-black text-xs md:text-sm">{tool.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 hidden sm:block">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className={`${showLearningTools ? 'hidden md:flex md:w-2/3' : 'flex w-full'} flex-col min-h-0`}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 space-y-3 md:space-y-4 min-h-0">
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
                    <p className="whitespace-pre-line text-sm md:text-base">{message.content}</p>

                    {/* Display resources if available */}
                    {message.type === 'ivor' && message.resources && message.resources.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-liberation-black">
                            📚 Community Resources ({message.resourceCount})
                          </p>
                          {message.enhancedWithRAG && (
                            <span className="text-xs bg-liberation-gold/30 px-2 py-0.5 rounded">
                              AI-Enhanced
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {message.resources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                          ))}
                        </div>
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
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-liberation-gold/20 p-3 md:p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask IVOR anything..."
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
                  onClick={() => setShowLearningTools(!showLearningTools)}
                  className="text-xs md:text-sm text-liberation-black/60 hover:text-liberation-black touch-friendly"
                >
                  {showLearningTools ? 'Hide Tools' : 'Show Tools'}
                </button>
                <p className="text-xs text-liberation-black/60 hidden sm:block">
                  IVOR supports community learning and mutual aid
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}