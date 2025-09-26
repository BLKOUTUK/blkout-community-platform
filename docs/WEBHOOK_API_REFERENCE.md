# Webhook API Reference - BLKOUT Community Platform
## Complete API Documentation for Liberation-Focused Automation

### 🌟 Liberation Values at the Core
Our webhook system is built on community sovereignty, democratic oversight, and transparent automation that serves liberation, not extraction.

---

## Authentication

All webhook endpoints require proper authentication to protect community data and prevent abuse.

### Authentication Methods

#### 1. N8N Webhooks
```http
POST /api/webhooks/n8n/*
X-N8N-Signature: your-webhook-secret
X-Liberation-Source: n8n-automation-name
Content-Type: application/json
```

#### 2. BLKOUTHUB Community Webhooks
```http
POST /api/webhooks/blkouthub
Authorization: Bearer your-blkouthub-token
Content-Type: application/json
```

#### 3. Analytics & Testing
```http
GET /api/webhooks/*/analytics
X-API-Key: your-analytics-key
```

---

## N8N Integration Endpoints

### 1. Content Discovery Webhook

**Endpoint:** `POST /api/webhooks/n8n/content`
**Purpose:** Submit discovered content for community review and potential auto-approval

#### Request Headers
```http
Content-Type: application/json
X-N8N-Signature: your-webhook-secret
X-Liberation-Source: workflow-name
```

#### Request Body Schema
```json
{
  "content_type": "event|news|story|resource",
  "source_url": "string (required)",
  "extracted_data": {
    "title": "string (required)",
    "description": "string (required)",
    "content": "string (optional)",
    "date": "ISO 8601 string (optional)",
    "location": "string (optional)",
    "tags": ["string"] (optional),
    "author": "string (optional)",
    "image_url": "string (optional)"
  },
  "classification": {
    "category": "string",
    "confidence": "number (0-1)",
    "tags": ["string"]
  },
  "automation_source": "string (required)",
  "timestamp": "ISO 8601 string (required)",
  "workflow_id": "string (optional)"
}
```

#### Response Schema
```json
{
  "success": true,
  "message": "Content auto-approved and published",
  "submissionId": "uuid",
  "auto_approved": true,
  "analysis": {
    "quality_score": 0.8,
    "community_alignment": 0.9,
    "suggested_tags": ["housing-justice", "community-power"],
    "category": "community-organizing",
    "liberation_compliant": true
  },
  "liberation_message": "Content meets liberation values criteria"
}
```

#### Response Status Codes
- `201` - Content successfully processed
- `200` - Duplicate content detected (not processed)
- `400` - Invalid request payload
- `401` - Authentication failed
- `429` - Rate limit exceeded
- `500` - Internal server error

### 2. Research Discovery Webhook

**Endpoint:** `POST /api/webhooks/n8n/research`
**Purpose:** Process automated research results for community content pipeline

#### Request Body Schema
```json
{
  "search_query": "string (required)",
  "results": [
    {
      "title": "string (required)",
      "url": "string (required)",
      "description": "string (required)",
      "relevance_score": "number (0-1)",
      "source": "string"
    }
  ],
  "timestamp": "ISO 8601 string (required)",
  "source": "string (required)"
}
```

#### Response Schema
```json
{
  "success": true,
  "message": "Research processed: 5 items submitted for review",
  "processed_count": 5,
  "duplicate_count": 2,
  "total_results": 10,
  "search_query": "community organizing 2024",
  "processed_items": [
    {
      "id": "uuid",
      "title": "Community Organizes for Justice",
      "relevance": 0.8,
      "quality": 0.75
    }
  ],
  "liberation_message": "Research automation serves community knowledge"
}
```

---

## BLKOUTHUB Community Integration

### 1. Community Content Webhook

**Endpoint:** `POST /api/webhooks/blkouthub`
**Purpose:** Receive community-submitted content from BLKOUTHUB platform

#### Request Headers
```http
Authorization: Bearer your-blkouthub-token
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "content_type": "community_event|member_story|resource_share|mutual_aid|organizing_update",
  "payload": {
    "title": "string (required)",
    "description": "string (required)",
    "content": "string (optional)",
    "date": "ISO 8601 string (optional)",
    "location": "string (optional)",
    "contact_info": {
      "email": "string (optional)",
      "phone": "string (optional)",
      "social": "string (optional)"
    },
    "organizer": "string (optional)",
    "tags": ["string"] (optional),
    "image_url": "string (optional)",
    "external_links": ["string"] (optional),
    "community_guidelines_compliant": "boolean (optional)"
  },
  "authentication": "string (Bearer token)",
  "timestamp": "ISO 8601 string (required)",
  "source": "string (required)",
  "member_id": "string (optional)",
  "verification_status": "verified|pending|unverified"
}
```

#### Response Schema
```json
{
  "success": true,
  "message": "Community content auto-approved and published",
  "submissionId": "uuid",
  "auto_approved": true,
  "priority": "high",
  "classification": "community-event",
  "warnings": ["Consider adding content warning"],
  "liberation_message": "Content meets community guidelines and liberation values"
}
```

### 2. Mutual Aid Webhook

**Endpoint:** `POST /api/webhooks/blkouthub/mutual-aid`
**Purpose:** Handle urgent mutual aid requests and offers

#### Request Body Schema
```json
{
  "aid_type": "request|offer|fulfilled",
  "title": "string (required)",
  "description": "string (required)",
  "location": {
    "area": "string (required)",
    "postal_code": "string (optional)",
    "accessible": "boolean (optional)"
  },
  "contact": {
    "preferred_method": "email|phone|app",
    "details": "string (required)",
    "anonymous": "boolean"
  },
  "urgency": "low|medium|high|critical",
  "categories": ["string"] (required),
  "expires_at": "ISO 8601 string (optional)"
}
```

#### Response Schema
```json
{
  "success": true,
  "message": "request published to community mutual aid network",
  "submissionId": "uuid",
  "auto_approved": true,
  "urgency": "high",
  "liberation_message": "Mutual aid builds community solidarity"
}
```

### 3. Health Check

**Endpoint:** `GET /api/webhooks/blkouthub/health`
**Purpose:** Check BLKOUTHUB integration status

#### Response Schema
```json
{
  "success": true,
  "service": "BLKOUTHUB Webhook Integration",
  "status": "operational",
  "authentication": "configured",
  "database": "connected",
  "liberation_message": "Community webhook services operational"
}
```

---

## Social Media Automation

### 1. Content Ingestion

**Endpoint:** `POST /api/webhooks/social-media/ingest`
**Purpose:** Process social media content for community amplification

#### Request Body Schema
```json
{
  "platform": "twitter|instagram|mastodon|tiktok|facebook",
  "post_id": "string (required)",
  "content": {
    "text": "string (optional)",
    "image_urls": ["string"] (optional),
    "video_urls": ["string"] (optional),
    "hashtags": ["string"] (optional),
    "mentions": ["string"] (optional)
  },
  "metadata": {
    "author": {
      "username": "string (required)",
      "display_name": "string (optional)",
      "follower_count": "number (optional)",
      "verified": "boolean (optional)"
    },
    "engagement": {
      "likes": "number (optional)",
      "shares": "number (optional)",
      "comments": "number (optional)",
      "views": "number (optional)"
    },
    "posted_at": "ISO 8601 string (required)",
    "url": "string (required)",
    "language": "string (optional)"
  },
  "extraction_method": "api|webhook|scraping",
  "relevance_score": "number (0-1, optional)"
}
```

#### Response Schema
```json
{
  "success": true,
  "message": "Content amplify",
  "submissionId": "uuid",
  "platform": "mastodon",
  "recommended_action": "amplify",
  "analysis": {
    "community_relevance": 0.8,
    "liberation_alignment": 0.9,
    "engagement_potential": 0.7,
    "cross_platform_potential": true
  },
  "liberation_message": "Content amplifies liberation values"
}
```

### 2. Hashtag Monitoring

**Endpoint:** `POST /api/webhooks/social-media/hashtag-monitor`
**Purpose:** Configure hashtag and keyword monitoring

#### Request Body Schema
```json
{
  "hashtags": ["string"] (required),
  "keywords": ["string"] (required),
  "accounts_to_monitor": ["string"] (required),
  "platforms": ["string"] (required),
  "filters": {
    "min_engagement": "number (optional)",
    "verified_only": "boolean (optional)",
    "language": ["string"] (optional),
    "exclude_nsfw": "boolean (optional)"
  }
}
```

### 3. Statistics

**Endpoint:** `GET /api/webhooks/social-media/stats`
**Purpose:** Get social media automation statistics

#### Response Schema
```json
{
  "success": true,
  "timeframe": "7 days",
  "stats": {
    "total_posts": 150,
    "amplified": 45,
    "moderated": 85,
    "flagged": 20,
    "platforms": {
      "mastodon": 60,
      "twitter": 90
    }
  },
  "liberation_message": "Social media statistics enable community oversight"
}
```

---

## Automation Analytics

### 1. Overview Dashboard

**Endpoint:** `GET /api/webhooks/automation-analytics/overview`
**Purpose:** Get comprehensive automation metrics

#### Query Parameters
- `timeframe` - `24h|7d|30d` (default: `30d`)

#### Request Headers
```http
X-API-Key: your-analytics-key
```

#### Response Schema
```json
{
  "success": true,
  "timeframe": "30d",
  "metrics": {
    "total_submissions": 1250,
    "auto_approved": 380,
    "pending_review": 650,
    "rejected": 120,
    "duplicate_filtered": 100,
    "source_breakdown": {
      "n8n-automation": 500,
      "blkouthub-community": 400,
      "social-automation": 350
    },
    "content_type_breakdown": {
      "news": 600,
      "event": 400,
      "social_media": 250
    },
    "quality_distribution": {
      "high": 400,
      "medium": 650,
      "low": 200
    },
    "liberation_compliance": {
      "fully_compliant": 800,
      "partially_compliant": 300,
      "non_compliant": 50,
      "needs_review": 100
    }
  },
  "liberation_message": "Automation analytics promote community transparency"
}
```

### 2. Time Series Data

**Endpoint:** `GET /api/webhooks/automation-analytics/timeseries`
**Purpose:** Get time series data for charts and trends

#### Response Schema
```json
{
  "success": true,
  "timeframe": "30d",
  "data": [
    {
      "date": "2024-01-01",
      "submissions": 45,
      "auto_approved": 15,
      "manual_review": 30,
      "average_quality": 0.75
    }
  ],
  "liberation_message": "Time series data enables community tracking"
}
```

### 3. Source Performance

**Endpoint:** `GET /api/webhooks/automation-analytics/sources`
**Purpose:** Analyze performance of different automation sources

#### Response Schema
```json
{
  "success": true,
  "sources": [
    {
      "source": "n8n-automation",
      "total_submissions": 500,
      "approval_rate": 76.0,
      "average_quality": 0.78,
      "duplicate_rate": 8.0,
      "liberation_compliance_rate": 85.0,
      "last_submission": "2024-01-15T18:00:00Z"
    }
  ],
  "liberation_message": "Source analysis helps community evaluate automation"
}
```

### 4. Complete Dashboard

**Endpoint:** `GET /api/webhooks/automation-analytics/dashboard`
**Purpose:** Get all dashboard data in single request

#### Response Schema
```json
{
  "success": true,
  "timeframe": "30d",
  "dashboard": {
    "overview": { /* metrics object */ },
    "timeseries": [ /* timeseries array */ ],
    "source_performance": [ /* sources array */ ],
    "last_updated": "2024-01-15T18:00:00Z"
  },
  "liberation_message": "Complete automation analytics dashboard"
}
```

### 5. Community Alerts

**Endpoint:** `POST /api/webhooks/automation-analytics/alert`
**Purpose:** Create community alert for automation issues

#### Request Body Schema
```json
{
  "alert_type": "string (required)",
  "message": "string (required)",
  "priority": "low|medium|high|critical",
  "source": "string (optional)"
}
```

---

## Webhook Testing System

### 1. Run Test Suite

**Endpoint:** `GET /api/webhooks/test-webhooks/run`
**Purpose:** Execute comprehensive webhook test suite

#### Request Headers
```http
X-API-Key: your-test-api-key
```

#### Response Schema
```json
{
  "success": true,
  "message": "Webhook test suite completed",
  "overall_stats": {
    "total_suites": 4,
    "passed_suites": 3,
    "failed_suites": 0,
    "partial_suites": 1,
    "total_tests": 12,
    "passed_tests": 10,
    "failed_tests": 2,
    "total_execution_time_ms": 2500,
    "liberation_compliant_tests": 10
  },
  "test_suites": [
    {
      "name": "N8N Webhook Integration",
      "description": "Tests for N8N automation webhook endpoints",
      "overall_status": "pass",
      "total_tests": 2,
      "passed_tests": 2,
      "failed_tests": 0,
      "execution_time_ms": 450,
      "tests": [
        {
          "endpoint": "/api/webhooks/n8n/content",
          "method": "POST",
          "status": "success",
          "response_code": 201,
          "response_time_ms": 225,
          "liberation_compliance": true
        }
      ]
    }
  ],
  "liberation_message": "Webhook testing ensures community automation quality"
}
```

### 2. Single Endpoint Test

**Endpoint:** `POST /api/webhooks/test-webhooks/single`
**Purpose:** Test individual webhook endpoint

#### Request Body Schema
```json
{
  "endpoint": "string (required)",
  "method": "GET|POST|PUT|DELETE",
  "payload": "object (optional)",
  "headers": "object (optional)"
}
```

### 3. Sample Payloads

**Endpoint:** `GET /api/webhooks/test-webhooks/payloads`
**Purpose:** Get sample payloads for manual testing

#### Response Schema
```json
{
  "success": true,
  "message": "Sample webhook payloads for testing",
  "payloads": {
    "n8n_content": { /* sample payload */ },
    "blkouthub_event": { /* sample payload */ },
    "social_media_post": { /* sample payload */ }
  },
  "liberation_message": "Sample payloads help community test webhooks"
}
```

---

## Rate Limiting

All webhook endpoints implement rate limiting to protect community resources:

### Limits by Endpoint Type
- **N8N Webhooks:** 30 requests/minute per IP
- **BLKOUTHUB:** 20 requests/minute per IP
- **Social Media:** 50 requests/minute per IP
- **Analytics:** 100 requests/minute per API key

### Rate Limit Headers
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1642694400
```

### Rate Limit Response
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "liberation_message": "Rate limiting ensures fair access for all community members"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error information",
  "liberation_message": "Community-focused error context"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (invalid payload)
- `401` - Unauthorized (invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Endpoint not found
- `405` - Method not allowed
- `409` - Conflict (duplicate content)
- `429` - Rate limit exceeded
- `500` - Internal server error

### Liberation Values in Error Messages
All error responses include a `liberation_message` field that explains the error in the context of community values and empowerment.

---

## Community Governance Integration

### Democratic Oversight Features
- All automation decisions are logged transparently
- Community can override automated classifications
- Regular reporting on automation performance
- Democratic review of automation rules and thresholds

### Transparency Requirements
- Public automation metrics dashboard
- Community alerts for system issues
- Open access to automation logs (privacy-preserving)
- Democratic control over automation parameters

### Community Control Mechanisms
- Voting on automation rule changes
- Community moderator override capabilities
- Transparent appeals process for automated decisions
- Regular community review of automation effectiveness

---

## Security & Privacy

### Data Protection
- Minimal data collection and retention
- Privacy-preserving analytics
- Secure authentication for all endpoints
- Community data sovereignty principles

### Security Measures
- Rate limiting and abuse prevention
- Input validation and sanitization
- Secure webhook signature verification
- Comprehensive audit logging

### Community Safety
- Anti-oppression content filtering
- Trauma-informed content warnings
- Cultural authenticity validation
- Community guidelines enforcement

---

## Getting Started

### 1. Authentication Setup
1. Contact community tech collective for webhook secrets
2. Configure environment variables
3. Test authentication with health endpoints

### 2. Webhook Integration
1. Choose appropriate endpoints for your use case
2. Implement proper error handling and retries
3. Test with sample payloads
4. Monitor automation analytics

### 3. Community Participation
1. Join community oversight discussions
2. Provide feedback on automation performance
3. Participate in democratic governance of automation
4. Contribute to community knowledge base

---

## Support & Community

### Technical Support
- **Community Forum:** https://community.blkout.org/tech
- **Documentation:** https://docs.blkout.org/webhooks
- **Email:** tech@blkout.org
- **GitHub Issues:** For bug reports and feature requests

### Community Governance
- **Automation Governance:** Community meetings every month
- **Democratic Review:** Quarterly automation effectiveness review
- **Policy Changes:** Community voting on automation rules
- **Transparency Reports:** Monthly automation performance reports

**Liberation Message:** "This webhook system is built by and for the community, with full transparency and democratic control. Technology serves liberation, not extraction."

---

*Last Updated: January 2024*
*API Version: 1.0.0*
*Community Platform: https://blkout.vercel.app*
*Governance: Community-controlled and democratically managed*