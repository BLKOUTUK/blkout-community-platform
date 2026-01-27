/**
 * Health Dashboard Type Definitions
 */

import { type ServiceHealth } from '@/services/platformHealthCheck';
import { type DatabaseHealth } from '@/services/databaseHealthCheck';
import { type RouteCheck } from '@/services/criticalRouteChecker';
import { type PromotionChecklist } from '@/services/promotionChecklist';
import { type ContainerHealth } from '@/services/dockerHealthCheck';

export type Tab = 'overview' | 'routes' | 'database' | 'infrastructure' | 'checklist';

export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface HealthDashboardState {
  activeTab: Tab;
  isLoading: boolean;
  autoRefresh: boolean;
  lastCheck: Date | null;
  services: ServiceHealth[];
  database: DatabaseHealth | null;
  routes: RouteCheck[];
  containers: ContainerHealth[];
  checklist: PromotionChecklist | null;
}

export interface TabProps {
  services: ServiceHealth[];
  database: DatabaseHealth | null;
  routes: RouteCheck[];
  containers: ContainerHealth[];
  checklist: PromotionChecklist | null;
}

// Re-export types from services
export type { ServiceHealth, DatabaseHealth, RouteCheck, PromotionChecklist, ContainerHealth };
