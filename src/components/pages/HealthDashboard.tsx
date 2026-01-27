/**
 * BLKOUT Unified Command Center - Platform Health Dashboard
 *
 * MODULARIZED: This file now re-exports from the modular health module.
 *
 * The health dashboard has been split into:
 * - health/tabs/OverviewTab.tsx - Service health overview
 * - health/tabs/RoutesTab.tsx - Critical route validation
 * - health/tabs/DatabaseTab.tsx - Database health & integrity
 * - health/tabs/InfrastructureTab.tsx - Docker infrastructure
 * - health/tabs/ChecklistTab.tsx - Pre-promotion checklist
 * - health/utils/statusHelpers.tsx - Status color/icon utilities
 * - health/utils/reportGenerator.ts - Troubleshooting report generator
 * - health/types.ts - Type definitions
 *
 * For direct component access, import from './health'
 */

export { HealthDashboard as default } from './health';
export * from './health';
