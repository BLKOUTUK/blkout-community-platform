// BLKOUT Docker Infrastructure Health Check Service
// Monitors local Docker containers for IVOR microservices and platform infrastructure
// Phase 1: Core operational infrastructure (IVOR + Coolify)
// Future: Research agent, analytics, admin functions

import { z } from 'zod';

// Container health status schema
const ContainerHealthSchema = z.object({
  name: z.string(),
  container: z.string(),
  category: z.enum(['ivor', 'coolify', 'admin', 'analytics', 'future']),
  status: z.enum(['running', 'restarting', 'stopped', 'unhealthy', 'unknown']),
  uptime: z.string(),
  cpu: z.string(),
  memory: z.string(),
  restartCount: z.number(),
  lastCheck: z.string(),
  details: z.object({
    image: z.string(),
    ports: z.array(z.string()).optional(),
    health: z.enum(['healthy', 'unhealthy', 'none']).optional(),
    errors: z.array(z.string()).optional(),
  }),
});

export type ContainerHealth = z.infer<typeof ContainerHealthSchema>;

// Core infrastructure containers to monitor
// Phase 1: IVOR microservices (critical for voice chatbot Feb 2026)
//          + Coolify platform management
// Phase 2: To be added: research-agent, analytics services, admin tools
export const INFRASTRUCTURE_CONTAINERS = [
  // IVOR Microservices (Voice Chatbot Foundation)
  {
    name: 'IVOR Backend API',
    container: 'ivor-airweave-backend',
    category: 'ivor' as const,
    description: 'Main IVOR API and orchestration service',
    critical: true,
    ports: ['8000'],
  },
  {
    name: 'IVOR Frontend',
    container: 'ivor-airweave-frontend',
    category: 'ivor' as const,
    description: 'IVOR web interface',
    critical: false,
    ports: ['3000'],
  },
  {
    name: 'IVOR LangGraph',
    container: 'ivor-langgraph',
    category: 'ivor' as const,
    description: 'Journey orchestration and conversation flow',
    critical: true,
    ports: ['8001'],
  },
  {
    name: 'IVOR Qdrant',
    container: 'ivor-qdrant',
    category: 'ivor' as const,
    description: 'Vector database for semantic search',
    critical: true,
    ports: ['6333', '6335'],
  },
  {
    name: 'IVOR PostgreSQL',
    container: 'ivor-postgres',
    category: 'ivor' as const,
    description: 'IVOR data persistence',
    critical: true,
    ports: ['5433'],
  },
  {
    name: 'IVOR Redis',
    container: 'ivor-redis',
    category: 'ivor' as const,
    description: 'IVOR caching and session management',
    critical: true,
    ports: ['6380'],
  },

  // Coolify Platform Management
  {
    name: 'Coolify Platform',
    container: 'coolify',
    category: 'coolify' as const,
    description: 'Deployment platform management',
    critical: false,
    ports: ['3001'],
  },
  {
    name: 'Coolify Redis',
    container: 'coolify-redis',
    category: 'coolify' as const,
    description: 'Coolify job queue management',
    critical: false,
    ports: [],
  },

  // Future Phase 2: Uncomment when ready to monitor
  // {
  //   name: 'Research Agent',
  //   container: 'research-agent',
  //   category: 'admin' as const,
  //   description: 'AI-powered research and analysis',
  //   critical: false,
  //   ports: [],
  // },
  // {
  //   name: 'Analytics Engine',
  //   container: 'analytics',
  //   category: 'analytics' as const,
  //   description: 'Impact tracking and community metrics',
  //   critical: false,
  //   ports: [],
  // },
];

/**
 * Mock Docker health check (in production, this would use Docker API or socket)
 *
 * For local/server deployment, this would:
 * 1. Connect to Docker socket at /var/run/docker.sock
 * 2. Use Docker API to query container status
 * 3. Parse stats for CPU/memory usage
 * 4. Check health check status
 *
 * Since this runs in Vercel (serverless), we return mock data.
 * For production monitoring, deploy this as:
 * - API endpoint on IVOR backend (has Docker access)
 * - Separate monitoring service with Docker socket access
 * - Integration with monitoring tool (Prometheus, Datadog, etc.)
 */
async function checkContainerHealth(
  container: typeof INFRASTRUCTURE_CONTAINERS[0]
): Promise<ContainerHealth> {
  const startTime = Date.now();

  try {
    // MOCK DATA - In production, replace with actual Docker API calls
    // Example real implementation:
    // const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    // const containerInfo = await docker.getContainer(container.container).inspect();
    // const stats = await docker.getContainer(container.container).stats({ stream: false });

    // For now, return mock healthy status
    // This allows the dashboard UI to work while we deploy actual Docker monitoring
    const mockHealth: ContainerHealth = {
      name: container.name,
      container: container.container,
      category: container.category,
      status: 'running', // Real: containerInfo.State.Status
      uptime: '12h 34m', // Real: calculate from containerInfo.State.StartedAt
      cpu: '0.5%', // Real: calculate from stats.cpu_stats
      memory: '150MB', // Real: stats.memory_stats.usage
      restartCount: 0, // Real: containerInfo.RestartCount
      lastCheck: new Date().toISOString(),
      details: {
        image: 'placeholder-image:latest', // Real: containerInfo.Config.Image
        ports: container.ports,
        health: 'healthy', // Real: containerInfo.State.Health?.Status
        errors: undefined,
      },
    };

    return mockHealth;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      name: container.name,
      container: container.container,
      category: container.category,
      status: 'unknown',
      uptime: 'N/A',
      cpu: 'N/A',
      memory: 'N/A',
      restartCount: 0,
      lastCheck: new Date().toISOString(),
      details: {
        image: 'unknown',
        health: 'none',
        errors: [errorMessage],
      },
    };
  }
}

/**
 * Check all infrastructure containers
 */
export async function checkAllContainers(): Promise<ContainerHealth[]> {
  console.log(`[DockerHealthCheck] Checking ${INFRASTRUCTURE_CONTAINERS.length} containers...`);

  // Check all containers in parallel
  const results = await Promise.all(
    INFRASTRUCTURE_CONTAINERS.map((container) => checkContainerHealth(container))
  );

  // Validate results
  const validated = results.map((result) => ContainerHealthSchema.parse(result));

  const runningCount = validated.filter(c => c.status === 'running').length;
  console.log(`[DockerHealthCheck] Complete. Running: ${runningCount}/${validated.length}`);

  return validated;
}

/**
 * Get category summary (IVOR, Coolify, etc.)
 */
export function getCategorySummary(containers: ContainerHealth[]) {
  const categories = {
    ivor: containers.filter(c => c.category === 'ivor'),
    coolify: containers.filter(c => c.category === 'coolify'),
    admin: containers.filter(c => c.category === 'admin'),
    analytics: containers.filter(c => c.category === 'analytics'),
  };

  return {
    ivor: {
      total: categories.ivor.length,
      running: categories.ivor.filter(c => c.status === 'running').length,
      critical: categories.ivor.filter(c => INFRASTRUCTURE_CONTAINERS.find(ic => ic.container === c.container)?.critical).length,
    },
    coolify: {
      total: categories.coolify.length,
      running: categories.coolify.filter(c => c.status === 'running').length,
    },
    admin: {
      total: categories.admin.length,
      running: categories.admin.filter(c => c.status === 'running').length,
    },
    analytics: {
      total: categories.analytics.length,
      running: categories.analytics.filter(c => c.status === 'running').length,
    },
  };
}

/**
 * Check for critical failures (restart loops, unhealthy containers)
 */
export function getCriticalIssues(containers: ContainerHealth[]): string[] {
  const issues: string[] = [];

  containers.forEach(container => {
    // Check for restart loops (>5 restarts)
    if (container.restartCount > 5) {
      issues.push(`${container.name}: Restart loop detected (${container.restartCount} restarts)`);
    }

    // Check for unhealthy status
    if (container.details.health === 'unhealthy') {
      issues.push(`${container.name}: Health check failing`);
    }

    // Check for stopped critical services
    const containerConfig = INFRASTRUCTURE_CONTAINERS.find(c => c.container === container.container);
    if (containerConfig?.critical && container.status !== 'running') {
      issues.push(`${container.name}: CRITICAL service is ${container.status}`);
    }

    // Check for restarting status (indicates problems)
    if (container.status === 'restarting') {
      issues.push(`${container.name}: Currently restarting (possible crash loop)`);
    }
  });

  return issues;
}

/**
 * Calculate total resource usage across all containers
 */
export function getTotalResourceUsage(containers: ContainerHealth[]) {
  // This would parse actual values from Docker stats in production
  // For now, returns structure for UI
  return {
    totalMemory: 'N/A', // Real: sum all memory usage
    totalCpu: 'N/A', // Real: sum all CPU percentages
    containerCount: containers.length,
    runningCount: containers.filter(c => c.status === 'running').length,
  };
}
