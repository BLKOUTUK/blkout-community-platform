// BLKOUT Liberation Platform - IVOR AI Chat API Endpoint
// AI-Powered Community Assistant with GROQ Integration
// Trauma-informed, liberation-centered AI responses

import { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  category?: string;
  sessionId?: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// System prompt for IVOR - Liberation-centered AI
const IVOR_SYSTEM_PROMPT = `You are IVOR (Intelligent Virtual Organizing Resource), an AI assistant built specifically for Black queer communities. You are part of the BLKOUT Liberation Platform, a community-owned technology cooperative.

## Core Principles:
1. **Liberation-Centered**: All responses should center Black queer liberation, community care, and collective action
2. **Trauma-Informed**: Be gentle, affirming, and aware of systemic trauma
3. **Community Knowledge**: Value community wisdom alongside academic knowledge
4. **Mutual Aid**: Promote solidarity, not charity
5. **Intersectional**: Recognize overlapping systems of oppression
6. **Culturally Responsive**: Use language and examples relevant to Black queer culture

## Response Guidelines:
- Use "we" and "our community" language to build solidarity
- Acknowledge systemic oppression when relevant
- Offer practical, community-centered solutions
- Validate emotions and experiences
- Provide resources when appropriate
- Use trauma-informed language
- Celebrate community resilience and joy
- Never pathologize or individualize systemic issues

## Topics You Support:
- Problem-solving and organizing
- Emotional support and wellness
- Learning and education
- Creative expression
- Resource navigation
- Conflict resolution
- Liberation principles and history
- Community building
- Sexual health (refer to MenRUS.co.uk for Black queer men's health)

## Boundaries:
- You are NOT a replacement for professional therapy, medical care, or legal advice
- Encourage community support AND professional help when needed
- Recognize the limits of AI and center human connection
- Always remind users that community healing happens together

Remember: You are here to support liberation, not to replace community connection.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Only support POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'IVOR chat endpoint only supports POST requests'
    });
  }

  try {
    const { message, conversationHistory = [], category, sessionId }: ChatRequest = req.body;

    // Validate request
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Message is required and must be a non-empty string'
      });
    }

    // Check for GROQ API key
    const groqApiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error('GROQ API key not configured');

      // Fallback to pattern-matching if no API key
      const fallbackResponse = getFallbackResponse(message);

      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        source: 'fallback',
        message: 'Using pattern-matching (AI not configured)',
        sessionId: sessionId || `session-${Date.now()}`
      });
    }

    // Build conversation messages for GROQ
    const messages: ChatMessage[] = [
      { role: 'system', content: IVOR_SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Call GROQ API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Fast, high-quality model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: false
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      console.error('GROQ API error:', errorData);

      // Fallback to pattern-matching on API error
      const fallbackResponse = getFallbackResponse(message);

      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        source: 'fallback',
        message: 'AI temporarily unavailable, using pattern-matching',
        sessionId: sessionId || `session-${Date.now()}`
      });
    }

    const data = await groqResponse.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from GROQ API');
    }

    return res.status(200).json({
      success: true,
      response: aiResponse,
      source: 'groq-ai',
      model: 'llama-3.1-70b-versatile',
      sessionId: sessionId || `session-${Date.now()}`,
      category: category,
      liberation: '✊🏾 Powered by community-owned AI'
    });

  } catch (error) {
    console.error('IVOR chat error:', error);

    // Fallback response on any error
    const fallbackMessage = `I apologize, but I'm having trouble responding right now.

Here's what you can do:
- Try rephrasing your message
- Check back in a few moments
- Reach out to community members for support

Remember: technology supports us, but community connection is what sustains us. ✊🏾`;

    return res.status(200).json({
      success: true,
      response: fallbackMessage,
      source: 'fallback-error',
      message: 'Error occurred, using fallback response'
    });
  }
}

// Fallback pattern-matching for when AI is unavailable
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello! I'm IVOR, your community AI assistant. I'm here to support you with learning, problem-solving, and community wisdom. How can I help you today? ✊🏾`;
  }

  if (msg.includes('help') || msg.includes('support')) {
    return `I'm here to support you! I can help with:

- Problem-solving and working through challenges
- Learning and studying together
- Emotional support and check-ins
- Finding community resources
- Liberation wisdom and principles
- Creative inspiration
- And more!

What would feel most helpful for you right now?`;
  }

  if (msg.includes('health') || msg.includes('wellness')) {
    return `Your health matters deeply. For sexual health resources specifically for Black queer men, check out **MenRUS.co.uk** - a comprehensive resource from GMHC.

For general wellness:
- Physical health is connected to community health
- Mental wellness includes therapy, community support, and self-care
- Healthcare is a human right
- You deserve culturally competent care

What aspect of health and wellness can I support you with?`;
  }

  // Default fallback
  return `Thank you for reaching out. I'm experiencing some technical difficulties right now, but I want you to know:

- Your message matters
- Community support is available
- You deserve care and resources
- We're stronger together

Please try again in a moment, or reach out to community members for immediate support. ✊🏾`;
}
