# IVOR AI Assistant - Setup Guide

## Overview

IVOR (Intelligent Virtual Organizing Resource) is now powered by real AI through GROQ's API, providing liberation-centered, trauma-informed responses for the BLKOUT community.

## Architecture

```
User Message → IVORAssistant Component → /api/ivor/chat → GROQ API → AI Response
                                      ↓
                                  Fallback Pattern-Matching (if API unavailable)
```

## Setup Steps

### 1. Get Your GROQ API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `gsk_...`)

### 2. Add API Key to Environment Variables

**Local Development (.env):**
```bash
VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**Production (Vercel):**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add both variables:
   - `VITE_GROQ_API_KEY` = your key
   - `GROQ_API_KEY` = your key

### 3. Restart Development Server

```bash
npm run dev
```

## Features

### AI-Powered Responses
- Uses GROQ's Llama 3.1 70B model
- Fast, high-quality responses
- Liberation-centered system prompt
- Trauma-informed language

### Conversation Context
- Maintains last 10 messages for context
- Session-based tracking
- Supabase conversation storage

### Fallback System
- Pattern-matching fallback if API unavailable
- Graceful error handling
- Always provides a response

## System Prompt

IVOR is configured with a liberation-centered system prompt that:
- Centers Black queer liberation
- Uses trauma-informed language
- Promotes mutual aid and community care
- Recognizes systemic oppression
- Validates emotions and experiences
- Provides practical, community-centered solutions

## API Endpoint

**POST /api/ivor/chat**

Request:
```json
{
  "message": "How can I get involved in community organizing?",
  "conversationHistory": [],
  "sessionId": "optional-session-id"
}
```

Response:
```json
{
  "success": true,
  "response": "AI-generated response...",
  "source": "groq-ai",
  "model": "llama-3.1-70b-versatile",
  "sessionId": "session-123",
  "liberation": "✊🏾 Powered by community-owned AI"
}
```

## Testing

1. **Without API Key**: Will use fallback pattern-matching
2. **With API Key**: Will use GROQ AI for responses

### Test Commands

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test IVOR chat (replace with your actual endpoint)
curl -X POST http://localhost:3000/api/ivor/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello IVOR!"}'
```

## Cost Management

GROQ offers:
- **Free tier**: Generous limits for development
- **Pay-as-you-go**: Only pay for what you use
- **Fast inference**: Lower costs due to speed

Monitor usage at: https://console.groq.com/usage

## Troubleshooting

### "Using pattern-matching (AI not configured)"
- API key not set in environment variables
- Check .env file has correct key
- Restart development server

### "AI temporarily unavailable"
- GROQ API might be down
- Check API key is valid
- Fallback responses will still work

### No response at all
- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab for failed requests

## Security

- API key stored in environment variables (never in code)
- Server-side API calls only (key not exposed to client)
- Rate limiting on API endpoint
- CORS headers configured for security

## Future Enhancements

- [ ] Conversation memory across sessions
- [ ] User preference learning
- [ ] Multi-language support
- [ ] Voice interface
- [ ] Integration with community knowledge base
- [ ] A/B testing different AI models

## Support

For issues or questions:
1. Check this guide first
2. Review console errors
3. Check GROQ status page
4. Contact platform maintainers

---

**Remember**: IVOR is here to support liberation, not replace community connection. Technology serves the movement. ✊🏾
