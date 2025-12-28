# Phase 2: Liberation Layer 3 Specification

## Document Reference
- **ID**: SPEC-BLKOUT-P2L3-001
- **Version**: 1.0.0
- **Status**: Approved for Implementation
- **Created**: 2025-12-16
- **Full Spec**: `/home/robbe/blkout-platform/docs/SPEC_PHASE_2_LIBERATION_LAYER_3.md`

---

## Executive Summary

Phase 2 focuses on **integrating and activating** existing Liberation Layer 3 services. The core finding is that **450KB+ of Layer 3 code is already built** in `ivor-core/src/services/` but not activated in production.

---

## Key Finding: Code Already Exists

| Service | Size | Purpose |
|---------|------|---------|
| CommunityBusinessLogicService | 27KB | Community interactions, journey, democracy |
| CreatorBusinessLogicService | 22KB | 75% sovereignty enforcement |
| ContentBusinessLogicService | 33KB | Content validation, cultural authenticity |
| LiberationImpactBusinessLogicService | 31KB | Liberation metrics & tracking |
| Layer3InterfaceManager | 22KB | Cross-layer coordination |
| IVORMicroservicesIntegration | 28KB | Cross-service coordination |
| UKKnowledgeBase | 77KB | UK-specific liberation knowledge |

**Primary Gap**: `Layer3ServiceFactory` not initialized in `server.ts`

---

## Implementation Sprints

### Sprint 1: Core Integration (Week 1)
1. **Task 1.1**: Initialize Layer3ServiceFactory in `server.ts`
2. **Task 1.2**: Wire `/api/chat` to Layer3InterfaceManager
3. **Task 1.3**: Add `/health/liberation` endpoint

### Sprint 2: Cross-Service (Week 2-3)
1. **Task 2.1**: Create EventsLiberationService
2. **Task 2.2**: Create NewsroomLiberationService

### Sprint 3: Deployment (Week 3-4)
1. **Task 3.1**: Deploy IVOR to Coolify with Layer 3
2. **Task 3.2**: Deploy Events with Liberation Service
3. **Task 3.3**: Deploy Newsroom with Liberation Service

### Sprint 4: Monitoring (Week 4+)
1. **Task 4.1**: Liberation Metrics Dashboard
2. **Task 4.2**: Rollback Procedures

---

## Critical Code Changes

### server.ts Initialization
```typescript
import { initializeLayer3EcosystemForIVOR } from './services/index.js';

let layer3Ecosystem = await initializeLayer3EcosystemForIVOR();
```

### Chat API Integration
```typescript
app.post('/api/chat', async (req, res) => {
  // Route through Layer3InterfaceManager
  const validationResult = await layer3Ecosystem.interfaceManager
    .processLayer2Request({
      operation: 'community_interaction',
      payload: { message, userContext },
      liberationContext: {
        communityProtectionRequired: true,
        creatorSovereigntyEnforcement: true
      }
    });
  // ... rest of handler
});
```

---

## Liberation Targets

| Metric | Target |
|--------|--------|
| Creator Sovereignty | 75% mathematically enforced |
| Community Protection | >95% effectiveness |
| Response Time | <500ms with validation |
| Liberation Compliance | >95% |

---

## Files to Modify

| File | Action |
|------|--------|
| `ivor-core/src/server.ts` | Add Layer 3 init |
| `events-calendar/src/services/EventsLiberationService.ts` | Create new |
| `news-blkout/src/services/NewsroomLiberationService.ts` | Create new |

---

## Deployment Targets

| Service | Domain |
|---------|--------|
| IVOR Core | ivor.blkoutuk.cloud |
| Events | events.blkoutuk.cloud |
| Newsroom | news.blkoutuk.cloud |

---

## Success Criteria

- [ ] Layer3ServiceFactory initializes at startup
- [ ] `/health/liberation` returns status
- [ ] `/api/chat` routes through Layer 3
- [ ] Creator sovereignty 75% enforced
- [ ] Community protection >95%
- [ ] All services deployed to Coolify

---

*Memory created: 2025-12-16*
