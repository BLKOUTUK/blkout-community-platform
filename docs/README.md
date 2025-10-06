# BLKOUT Platform Documentation

## 📚 Documentation Structure

This directory contains all active documentation for the BLKOUT Liberation Platform.

---

## Active Documentation

### Core Platform
- **[PLATFORM_ARCHITECTURE.md](../PLATFORM_ARCHITECTURE.md)** - Complete production architecture map (7 modules, Phase 1-4 roadmap)
- **[README.md](../README.md)** - Project overview and quick start

### Current Deployment & Setup
- **[current/DEPLOYMENT.md](current/DEPLOYMENT.md)** - Production deployment guide
- **[current/DEPLOYMENT_CHECKLIST.md](current/DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[current/ADMIN_DEPLOYMENT_GUIDE.md](current/ADMIN_DEPLOYMENT_GUIDE.md)** - Admin-specific deployment steps
- **[current/IVOR_SETUP_GUIDE.md](current/IVOR_SETUP_GUIDE.md)** - IVOR AI assistant setup
- **[current/IVOR_DEPLOYMENT_ANALYSIS.md](current/IVOR_DEPLOYMENT_ANALYSIS.md)** - IVOR deployment analysis

### Integration Plans
- **[integration/BLKOUTHUB_INTEGRATION_PLAN.md](integration/BLKOUTHUB_INTEGRATION_PLAN.md)** - BLKOUTHUB integration roadmap (7 weeks, includes rewards system consolidation)
- **[integration/CHROME_EXTENSIONS_SUMMARY.md](integration/CHROME_EXTENSIONS_SUMMARY.md)** - Chrome extensions overview
- **[integration/EXTENSIONS_DEPLOYMENT_SUMMARY.md](integration/EXTENSIONS_DEPLOYMENT_SUMMARY.md)** - Extension deployment guide

### Workflows
- **[workflows/CONTENT_CURATION_WORKFLOW.md](workflows/CONTENT_CURATION_WORKFLOW.md)** - Content moderation workflow
- **[workflows/IMAGE_ENRICHMENT_WORKFLOW.md](workflows/IMAGE_ENRICHMENT_WORKFLOW.md)** - Image processing workflow
- **[workflows/EXTENSION_ACCESS_AND_DISTRIBUTION.md](workflows/EXTENSION_ACCESS_AND_DISTRIBUTION.md)** - Extension distribution
- **[workflows/SIMPLE_DISTRIBUTION.md](workflows/SIMPLE_DISTRIBUTION.md)** - Simplified distribution guide

### Migration
- **[migration/BLKOUTUK_MIGRATION_SPEC.md](migration/BLKOUTUK_MIGRATION_SPEC.md)** - blkoutuk.com content migration specification

### API Documentation
- **[N8N_WEBHOOK_INTEGRATION_GUIDE.md](N8N_WEBHOOK_INTEGRATION_GUIDE.md)** - n8n webhook integration
- **[WEBHOOK_API_REFERENCE.md](WEBHOOK_API_REFERENCE.md)** - Complete webhook API reference

---

## Archive

Historical documentation has been moved to `../archive/` to keep the root clean:

### Completed Phases (`archive/completed-phases/`)
- Admin restoration completion reports
- Phase 1 Beta completion summaries
- Transformation summaries

### Analysis Reports (`archive/analysis/`)
- Architecture analysis
- Liberation values validation
- Performance optimization reports
- Mobile optimization analysis

### Deployment History (`archive/deployment-history/`)
- Historical deployment status
- Release improvement summaries
- Webhook automation deployment history

### Experimental/Planning (`archive/experimental/`)
- Early planning documents
- Experimental features
- Research and strategy documents

---

## Finding What You Need

### "I want to deploy to production"
→ Start with [current/DEPLOYMENT_CHECKLIST.md](current/DEPLOYMENT_CHECKLIST.md)

### "I want to understand the platform architecture"
→ Read [PLATFORM_ARCHITECTURE.md](../PLATFORM_ARCHITECTURE.md)

### "I want to set up BLKOUTHUB integration"
→ Follow [integration/BLKOUTHUB_INTEGRATION_PLAN.md](integration/BLKOUTHUB_INTEGRATION_PLAN.md)

### "I want to deploy Chrome extensions"
→ Use [integration/EXTENSIONS_DEPLOYMENT_SUMMARY.md](integration/EXTENSIONS_DEPLOYMENT_SUMMARY.md)

### "I want to configure IVOR AI"
→ Follow [current/IVOR_SETUP_GUIDE.md](current/IVOR_SETUP_GUIDE.md)

### "I want to understand content moderation"
→ Read [workflows/CONTENT_CURATION_WORKFLOW.md](workflows/CONTENT_CURATION_WORKFLOW.md)

---

## Maintenance

**Keep Documentation Clean:**
1. ✅ New guides go in appropriate `docs/` subdirectory
2. ✅ Completed project docs move to `archive/completed-phases/`
3. ✅ Experimental features move to `archive/experimental/`
4. ✅ Old deployment reports move to `archive/deployment-history/`
5. ✅ Update this README when adding new major documentation

**Documentation Lifecycle:**
- **Active** → Lives in `docs/` with clear categorization
- **Completed** → Moves to `archive/completed-phases/`
- **Historical** → Moves to `archive/deployment-history/` or `archive/analysis/`
- **Experimental** → Moves to `archive/experimental/`

---

Last Updated: 2025-10-06
