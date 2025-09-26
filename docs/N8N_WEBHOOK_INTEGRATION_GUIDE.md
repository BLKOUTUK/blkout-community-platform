# N8N Webhook Integration Guide - BLKOUT Community Platform
## Liberation-Focused Automation for Community Empowerment

### Overview

This guide provides comprehensive instructions for integrating N8N workflows with the BLKOUT Community Platform webhook system. Our automation is designed around liberation values: community empowerment, democratic oversight, and transparent processes.

### 🚀 Quick Start

1. **Authentication Setup**
2. **Webhook Endpoint Configuration**
3. **Content Classification Integration**
4. **Community Oversight Implementation**
5. **Testing and Validation**

---

## Authentication Configuration

### N8N Webhook Secret
Set up authentication in your N8N workflow:

```javascript
// N8N HTTP Request Node Headers
{
  "Content-Type": "application/json",
  "X-N8N-Signature": "{{$env.N8N_WEBHOOK_SECRET}}",
  "X-Liberation-Source": "n8n-community-automation"
}
```

### Environment Variables Required
```bash
# Core Authentication
N8N_WEBHOOK_SECRET=your-secure-webhook-secret-here
IVOR_API_URL=https://ivor-api.blkout.org
IVOR_API_KEY=your-ivor-api-key-here

# Database Connection
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Analytics (Optional)
ANALYTICS_API_KEY=your-analytics-key-here
```

---

## Webhook Endpoints

### 1. Content Discovery Webhook
**Endpoint:** `POST /api/webhooks/n8n/content`

Processes discovered content for community review and potential auto-approval.

#### Request Payload:
```json
{
  "content_type": "event|news|story|resource",
  "source_url": "https://example.com/article",
  "extracted_data": {
    "title": "Community Organizes for Housing Justice",
    "description": "Local community members unite for housing rights",
    "content": "Full article text here...",
    "date": "2024-01-15T18:00:00Z",
    "location": "Community Center",
    "tags": ["housing-justice", "organizing"],
    "author": "Community Organizer",
    "image_url": "https://example.com/image.jpg"
  },
  "classification": {
    "category": "community-organizing",
    "confidence": 0.85,
    "tags": ["housing", "justice", "community"]
  },
  "automation_source": "n8n-news-scraper",
  "timestamp": "2024-01-15T12:00:00Z",
  "workflow_id": "news-discovery-workflow"
}
```

#### Response:
```json
{
  "success": true,
  "message": "Content auto-approved and published",
  "submissionId": "uuid-here",
  "auto_approved": true,
  "analysis": {
    "quality_score": 0.8,
    "community_alignment": 0.9,
    "suggested_tags": ["housing-justice", "community-power"],
    "category": "community-organizing",
    "liberation_compliant": true
  },
  "liberation_message": "Content meets liberation values criteria and community standards"
}
```

### 2. Research Discovery Webhook
**Endpoint:** `POST /api/webhooks/n8n/research`

Processes automated research results for community content pipeline.

#### Request Payload:
```json
{
  "search_query": "Black liberation community organizing 2024",
  "results": [
    {
      "title": "Community Mutual Aid Networks Expand",
      "url": "https://example.com/mutual-aid",
      "description": "Networks grow to meet community needs",
      "relevance_score": 0.8,
      "source": "community-news"
    }
  ],
  "timestamp": "2024-01-15T12:00:00Z",
  "source": "automated-research"
}
```

---

## N8N Workflow Templates

### Content Discovery Workflow
```json
{
  "name": "Community Content Discovery",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "value": 4}]
        }
      }
    },
    {
      "name": "RSS Feed Monitor",
      "type": "n8n-nodes-base.rss",
      "parameters": {
        "url": "https://liberation-news.com/feed.xml"
      }
    },
    {
      "name": "Content Filter",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Liberation values content filtering\nconst liberationKeywords = ['justice', 'organizing', 'community', 'liberation', 'mutual aid'];\nconst title = items[0].json.title.toLowerCase();\nconst description = items[0].json.description.toLowerCase();\n\nconst relevanceScore = liberationKeywords.reduce((score, keyword) => {\n  if (title.includes(keyword) || description.includes(keyword)) {\n    return score + 0.2;\n  }\n  return score;\n}, 0);\n\nif (relevanceScore >= 0.4) {\n  return items;\n}\nreturn [];"
      }
    },
    {
      "name": "BLKOUT Webhook",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://blkout.vercel.app/api/webhooks/n8n/content",
        "headers": {
          "Content-Type": "application/json",
          "X-N8N-Signature": "={{$env.N8N_WEBHOOK_SECRET}}",
          "X-Liberation-Source": "n8n-content-discovery"
        },
        "body": {
          "content_type": "news",
          "source_url": "={{$json.link}}",
          "extracted_data": {
            "title": "={{$json.title}}",
            "description": "={{$json.description}}",
            "content": "={{$json.content}}",
            "date": "={{$json.pubDate}}",
            "tags": "={{$json.categories}}"
          },
          "classification": {
            "category": "automated-discovery",
            "confidence": 0.7,
            "tags": ["rss-feed", "automated"]
          },
          "automation_source": "rss-monitor",
          "timestamp": "={{$now}}",
          "workflow_id": "content-discovery-001"
        }
      }
    }
  ]
}
```

### Community Event Monitoring
```json
{
  "name": "Community Event Discovery",
  "nodes": [
    {
      "name": "Google Calendar Webhook",
      "type": "n8n-nodes-base.googleCalendarTrigger",
      "parameters": {
        "calendarId": "community-events@blkout.org",
        "event": "created"
      }
    },
    {
      "name": "Event Validation",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Validate event meets community standards\nconst event = items[0].json;\nconst requiredFields = ['summary', 'description', 'start'];\n\nconst isValid = requiredFields.every(field => event[field]);\nconst isCommunityFocused = event.description.toLowerCase().includes('community') || \n                          event.summary.toLowerCase().includes('organizing');\n\nif (isValid && isCommunityFocused) {\n  return [{\n    json: {\n      ...event,\n      validation_passed: true,\n      community_focused: isCommunityFocused\n    }\n  }];\n}\nreturn [];"
      }
    },
    {
      "name": "Submit to Community Platform",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://blkout.vercel.app/api/webhooks/n8n/content",
        "headers": {
          "Content-Type": "application/json",
          "X-N8N-Signature": "={{$env.N8N_WEBHOOK_SECRET}}"
        },
        "body": {
          "content_type": "event",
          "source_url": "={{$json.htmlLink}}",
          "extracted_data": {
            "title": "={{$json.summary}}",
            "description": "={{$json.description}}",
            "date": "={{$json.start.dateTime}}",
            "location": "={{$json.location}}",
            "tags": ["community-event", "calendar"]
          },
          "automation_source": "google-calendar",
          "timestamp": "={{$now}}"
        }
      }
    }
  ]
}
```

---

## IVOR AI Integration

The platform automatically integrates with IVOR AI for content analysis:

### Analysis Features:
- **Content Relevance Scoring** (0-1)
- **Community Alignment Assessment** (liberation values)
- **Safety Assessment** (trauma-informed, anti-oppression)
- **Duplicate Detection**
- **Category Recommendations**
- **Quality Scoring**

### Auto-Approval Criteria:
```typescript
const autoApprove = analysis.community_alignment > 0.8 &&
                   analysis.content_relevance > 0.7 &&
                   analysis.safety_assessment.trauma_informed &&
                   analysis.safety_assessment.anti_oppression &&
                   !analysis.duplicate_check.is_duplicate;
```

---

## Community Oversight & Transparency

### Democratic Decision Making
- All automated decisions are logged and transparent
- Community can override any automated classification
- Regular reporting on automation performance
- Democratic review of automation rules

### Analytics Dashboard
Access automation metrics at:
- `GET /api/webhooks/automation-analytics/overview`
- `GET /api/webhooks/automation-analytics/dashboard`

### Community Alerts
The system automatically alerts the community for:
- High error rates in automation
- Content that needs manual review
- System performance issues
- Policy violations detected

---

## Testing Your Integration

### 1. Use Test Webhook Endpoint
```bash
curl -X POST https://blkout.vercel.app/api/webhooks/test-webhooks/run \
  -H "X-API-Key: your-test-key" \
  -H "Content-Type: application/json"
```

### 2. Manual Payload Testing
```javascript
// Test payload for N8N content webhook
const testPayload = {
  "content_type": "news",
  "source_url": "https://test.example.com",
  "extracted_data": {
    "title": "Test Community Content",
    "description": "This is a test of the automation system",
    "tags": ["test", "automation"]
  },
  "automation_source": "n8n-test",
  "timestamp": new Date().toISOString()
};
```

### 3. N8N Workflow Testing
1. Create a test workflow in N8N
2. Use manual trigger for testing
3. Monitor webhook response in N8N execution log
4. Verify content appears in moderation queue
5. Check analytics dashboard for test metrics

---

## Error Handling & Troubleshooting

### Common Issues:

1. **Authentication Failures**
   - Verify N8N_WEBHOOK_SECRET is set correctly
   - Check X-N8N-Signature header is included

2. **Content Rejection**
   - Review IVOR AI analysis in response
   - Check liberation values compliance
   - Verify content meets community guidelines

3. **Duplicate Detection**
   - System automatically filters duplicates
   - Check similar content in response
   - URL-based and content-based matching

4. **Rate Limiting**
   - Respect 30 requests/minute limit
   - Implement exponential backoff
   - Monitor rate limit headers

### Debugging Steps:
1. Test webhook health endpoints
2. Review automation analytics
3. Check moderation queue logs
4. Verify environment variables
5. Test with sample payloads

---

## Best Practices

### Liberation Values Implementation:
- **Transparency**: All decisions logged and reviewable
- **Community Control**: Democratic oversight of automation
- **Accessibility**: Clear error messages and documentation
- **Equity**: Fair processing for all content sources
- **Privacy**: Minimal data collection and retention

### Technical Best Practices:
- Implement retry logic with exponential backoff
- Monitor webhook response times
- Use meaningful workflow and source names
- Include comprehensive error handling
- Test thoroughly before production deployment

### Content Guidelines:
- Prioritize liberation-focused content
- Ensure trauma-informed content handling
- Support multilingual content processing
- Respect community cultural authenticity
- Maintain anti-oppression standards

---

## Support & Community

### Getting Help:
- Community tech collective support
- GitHub issues for bugs
- Community forum for questions
- Documentation updates welcome

### Contributing:
- Community-driven development
- Democratic decision making
- Liberation values compliance
- Open source collaboration

**Liberation Message**: "Technology should serve community empowerment, not corporate extraction. Our automation system is designed by and for the community, with full transparency and democratic control."

---

*Last updated: January 2024*
*Version: 1.0.0*
*Community Platform: https://blkout.vercel.app*