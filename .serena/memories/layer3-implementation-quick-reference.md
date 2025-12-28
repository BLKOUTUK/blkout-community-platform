# Layer 3 Implementation Quick Reference

## Start Here

**Primary Task**: Initialize Layer 3 in `ivor-core/src/server.ts`

```typescript
// Add import at top
import {
  initializeLayer3EcosystemForIVOR,
  Layer3ServiceFactory
} from './services/index.js';

// Add before app.listen()
let layer3Ecosystem = await initializeLayer3EcosystemForIVOR();
```

---

## Service Locations

```
ivor-core/src/services/
├── index.ts                           # Layer3ServiceFactory exports
├── CommunityBusinessLogicService.ts   # Community logic
├── CreatorBusinessLogicService.ts     # 75% sovereignty
├── ContentBusinessLogicService.ts     # Content validation
├── LiberationImpactBusinessLogicService.ts # Metrics
├── Layer3InterfaceManager.ts          # Request routing
├── IVORMicroservicesIntegration.ts    # Cross-service
└── layer3/                            # Additional services
```

---

## Key Types (from types/layer3-business-logic.ts)

```typescript
interface Layer2ToLayer3Request {
  operation: 'community_interaction' | 'creator_sovereignty' | 
             'content_validation' | 'democratic_participation' | ...;
  payload: any;
  liberationContext: {
    communityProtectionRequired: boolean;
    creatorSovereigntyEnforcement: boolean;
    culturalAuthenticityValidation: boolean;
  };
}

interface Layer2ToLayer3Response {
  success: boolean;
  data: any;
  liberationValidation: LiberationValidationResult;
  error?: string;
}
```

---

## Liberation Constants

```typescript
CREATOR_SOVEREIGNTY_MINIMUM = 0.75     // 75%
COMMUNITY_PROTECTION_THRESHOLD = 0.95  // 95%
LIBERATION_COMPLIANCE_TARGET = 0.95    // 95%
RESPONSE_TIME_TARGET_MS = 500          // 500ms
```

---

## Deployment Domains

| Service | Domain |
|---------|--------|
| IVOR | ivor.blkoutuk.cloud |
| Events | events.blkoutuk.cloud |
| News | news.blkoutuk.cloud |
| Main | blkoutuk.cloud |

---

## Test Commands

```bash
# Health check
curl https://ivor.blkoutuk.cloud/health/liberation

# Test chat with liberation
curl -X POST https://ivor.blkoutuk.cloud/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "sessionId": "test-123"}'
```

---

*Quick reference for Phase 2 implementation*
