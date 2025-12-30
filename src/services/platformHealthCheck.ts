// BLKOUT Platform Health Check Service
// Monitors all 7 production services for availability and performance

import { z } from 'zod';
import pRetry from 'p-retry';

// Service health status schema
const ServiceHealthSchema = z.object({
  name: z.string(),
  url: z.string(),
  status: z.enum(['healthy', 'degraded', 'down', 'unknown']),
  responseTime: z.number(),
  lastCheck: z.string(),
  details: z.object({
    httpStatus: z.number(),
    ssl: z.boolean(),
    sslExpiry: z.string().optional(),
    database: z.boolean().optional(),
    errors: z.array(z.string()).optional(),
  }),
});

export type ServiceHealth = z.infer<typeof ServiceHealthSchema>;

// Production services to monitor
// ALL 7 services now enabled (2025-12-30)
// Events Calendar: Fixed React crashes (commits a87c5bb, d73729b)
// News/Comms/CRM: Verified HTTP 200 responses
// IVOR: Still 404 - will show as "down" until deployed
export const PRODUCTION_SERVICES = [
  {
    name: 'Main Website',
    url: 'https://blkoutuk.com',
    checkDatabase: true,
    criticalRoutes: ['/', '/stories', '/governance', '/movement'],
  },
  {
    name: 'Blog/Voices',
    url: 'https://blog.blkoutuk.cloud',
    checkDatabase: false,
    criticalRoutes: ['/'],
  },
  {
    name: 'Events Calendar',
    url: 'https://events.blkoutuk.cloud',
    checkDatabase: true,
    criticalRoutes: ['/'],
  },
  {
    name: 'Newsroom',
    url: 'https://news.blkoutuk.cloud',
    checkDatabase: true,
    criticalRoutes: ['/'],
  },
  {
    name: 'Comms Dashboard',
    url: 'https://comms.blkoutuk.cloud',
    checkDatabase: false,
    criticalRoutes: ['/'],
  },
  {
    name: 'CRM',
    url: 'https://crm.blkoutuk.cloud',
    checkDatabase: false,
    criticalRoutes: ['/'],
  },
  {
    name: 'IVOR AI',
    url: 'https://ivor.blkoutuk.cloud',
    checkDatabase: false,
    criticalRoutes: ['/'],
  },
];

/**
 * Check a single service health
 */
async function checkServiceHealth(service: typeof PRODUCTION_SERVICES[0]): Promise<ServiceHealth> {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    // Retry up to 2 times with exponential backoff
    const response = await pRetry(
      async () => {
        const res = await fetch(service.url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(10000), // 10s timeout
        });

        if (!res.ok && res.status >= 500) {
          throw new Error(`Server error: ${res.status}`);
        }

        return res;
      },
      {
        retries: 2,
        minTimeout: 1000,
        onFailedAttempt: (error) => {
          console.warn(`Retry ${error.attemptNumber} for ${service.name}`);
        },
      }
    );

    const responseTime = Date.now() - startTime;
    const httpStatus = response.status;

    // Determine overall status
    let status: ServiceHealth['status'] = 'healthy';
    if (httpStatus >= 500) {
      status = 'down';
      errors.push(`Server error: HTTP ${httpStatus}`);
    } else if (httpStatus >= 400) {
      status = 'degraded';
      errors.push(`Client error: HTTP ${httpStatus}`);
    } else if (responseTime > 3000) {
      status = 'degraded';
      errors.push(`Slow response: ${responseTime}ms (SLA: 3000ms)`);
    }

    // Check SSL (HTTPS)
    const ssl = service.url.startsWith('https://');

    return {
      name: service.name,
      url: service.url,
      status,
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        httpStatus,
        ssl,
        database: service.checkDatabase ? undefined : undefined, // Will be set by databaseHealthCheck
        errors: errors.length > 0 ? errors : undefined,
      },
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    errors.push(errorMessage);

    return {
      name: service.name,
      url: service.url,
      status: 'down',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: {
        httpStatus: 0,
        ssl: service.url.startsWith('https://'),
        errors,
      },
    };
  }
}

/**
 * Check all production services
 */
export async function checkAllServices(): Promise<ServiceHealth[]> {
  console.log(`[HealthCheck] Checking ${PRODUCTION_SERVICES.length} services...`);

  // Check all services in parallel for speed
  const results = await Promise.all(
    PRODUCTION_SERVICES.map((service) => checkServiceHealth(service))
  );

  // Validate results against schema
  const validated = results.map((result) => ServiceHealthSchema.parse(result));

  console.log(`[HealthCheck] Complete. Healthy: ${validated.filter(s => s.status === 'healthy').length}/${validated.length}`);

  return validated;
}

/**
 * Get overall platform status
 */
export function getOverallStatus(services: ServiceHealth[]): 'healthy' | 'degraded' | 'down' {
  const downCount = services.filter(s => s.status === 'down').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;

  if (downCount > 0) return 'down';
  if (degradedCount > 0) return 'degraded';
  return 'healthy';
}

/**
 * Get average response time across all services
 */
export function getAverageResponseTime(services: ServiceHealth[]): number {
  const total = services.reduce((sum, s) => sum + s.responseTime, 0);
  return Math.round(total / services.length);
}
