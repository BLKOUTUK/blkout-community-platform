// BLKOUT Failure Diagnosis Service
// Pattern matching and root cause analysis for common deployment failures

export interface FailureDiagnosis {
  category: 'connectivity' | 'performance' | 'configuration' | 'data' | 'unknown';
  severity: 'critical' | 'warning' | 'info';
  probableCauses: string[];
  remediationSteps: string[];
  relatedDocumentation: string[];
}

/**
 * Diagnose service connectivity failures
 */
function diagnoseConnectivityFailure(error: string): FailureDiagnosis {
  // ECONNREFUSED pattern
  if (error.includes('ECONNREFUSED') || error.includes('connection refused')) {
    return {
      category: 'connectivity',
      severity: 'critical',
      probableCauses: [
        'Service not deployed or not running',
        'Port not exposed in Docker/Coolify configuration',
        'Firewall blocking connections',
        'Service crashed or failed to start',
      ],
      remediationSteps: [
        'Check Coolify deployment status',
        'Verify service logs for startup errors',
        'Confirm port mapping in Docker configuration',
        'Test service locally: curl http://localhost:PORT',
        'Restart the service in Coolify',
      ],
      relatedDocumentation: [
        'SESSION_HANDOFF.md - Deployment status',
        'Dockerfile - Port configuration',
      ],
    };
  }

  // Timeout pattern
  if (error.includes('timeout') || error.includes('ETIMEDOUT')) {
    return {
      category: 'performance',
      severity: 'critical',
      probableCauses: [
        'Service cold start taking too long',
        'Heavy computation blocking response',
        'Database query timeout',
        'Network latency issues',
      ],
      remediationSteps: [
        'Check service resource limits (CPU/memory)',
        'Review recent code changes for performance regressions',
        'Enable query logging to find slow database queries',
        'Increase timeout thresholds temporarily',
        'Add health check endpoint for faster validation',
      ],
      relatedDocumentation: [
        'server.cjs - Server configuration',
      ],
    };
  }

  // DNS resolution failure
  if (error.includes('ENOTFOUND') || error.includes('getaddrinfo')) {
    return {
      category: 'configuration',
      severity: 'critical',
      probableCauses: [
        'Domain not configured correctly',
        'DNS records not propagated',
        'Coolify domain settings incorrect',
        'SSL certificate issue preventing resolution',
      ],
      remediationSteps: [
        'Verify domain settings in Coolify',
        'Check DNS records: dig blkoutuk.com',
        'Confirm SSL certificate is valid',
        'Wait for DNS propagation (up to 48 hours)',
        'Test with direct IP address if available',
      ],
      relatedDocumentation: [
        'DEPLOYMENT-PLAN.md - Domain configuration',
      ],
    };
  }

  return {
    category: 'unknown',
    severity: 'warning',
    probableCauses: ['Unrecognized connectivity error pattern'],
    remediationSteps: ['Review full error logs', 'Check Coolify application status'],
    relatedDocumentation: [],
  };
}

/**
 * Diagnose HTTP status code failures
 */
function diagnoseHttpStatusFailure(statusCode: number, route: string): FailureDiagnosis {
  // 404 Not Found
  if (statusCode === 404) {
    return {
      category: 'configuration',
      severity: 'critical',
      probableCauses: [
        'Route not defined in Express server',
        'React Router configuration missing',
        'Static file serving not configured',
        'Incorrect route syntax (Express 5 compatibility)',
      ],
      remediationSteps: [
        'Check server.cjs for route definitions',
        'Verify App.tsx has route configured',
        'Test route locally: npm run dev',
        'Check Express 5 route syntax (no wildcards)',
        'Review recent routing changes',
      ],
      relatedDocumentation: [
        'server.cjs - Server routing',
        'App.tsx - React Router',
        'SESSION_HANDOFF.md - Route syntax issues',
      ],
    };
  }

  // 500 Internal Server Error
  if (statusCode >= 500 && statusCode < 600) {
    return {
      category: 'configuration',
      severity: 'critical',
      probableCauses: [
        'Server-side JavaScript error',
        'Database connection failure',
        'Missing environment variables',
        'TypeScript import error',
      ],
      remediationSteps: [
        'Check Coolify application logs',
        'Verify all VITE_ environment variables are set',
        'Test database connection with liberationDB',
        'Check for TypeScript compilation errors',
        'Review recent code deployments',
      ],
      relatedDocumentation: [
        'SESSION_HANDOFF.md - Environment variable issues',
        'Dockerfile - ENV configuration',
      ],
    };
  }

  // 401/403 Authentication/Authorization
  if (statusCode === 401 || statusCode === 403) {
    return {
      category: 'configuration',
      severity: 'warning',
      probableCauses: [
        'Admin route requires authentication',
        'RLS policies blocking access',
        'Supabase anon key invalid',
        'Session expired',
      ],
      remediationSteps: [
        'Verify admin password: BLKOUT2025!',
        'Check Supabase RLS policies',
        'Confirm VITE_SUPABASE_ANON_KEY is valid',
        'Clear browser cache and retry',
      ],
      relatedDocumentation: [
        'AdminAuth.tsx - Authentication logic',
      ],
    };
  }

  return {
    category: 'unknown',
    severity: 'info',
    probableCauses: [`Unhandled HTTP status code: ${statusCode}`],
    remediationSteps: ['Review server logs for details'],
    relatedDocumentation: [],
  };
}

/**
 * Diagnose database-related failures
 */
function diagnoseDatabaseFailure(error: string, context: { expectedCount?: number; actualCount?: number }): FailureDiagnosis {
  // Article count mismatch
  if (context.expectedCount && context.actualCount !== context.expectedCount) {
    return {
      category: 'data',
      severity: 'critical',
      probableCauses: [
        'Database migration not applied',
        'Wrong database connected (dev vs prod)',
        'Data not imported correctly',
        'RLS policies filtering results incorrectly',
      ],
      remediationSteps: [
        'Verify Supabase URL in environment variables',
        'Check legacy_articles table in Supabase dashboard',
        'Review migration history',
        'Test query with service role key (bypasses RLS)',
        `Expected count: ${context.expectedCount}, Actual: ${context.actualCount}`,
      ],
      relatedDocumentation: [
        'SESSION_HANDOFF.md - Database status',
        'api/stories.ts - Database queries',
      ],
    };
  }

  // RLS permission denied
  if (error.includes('RLS') || error.includes('permission denied')) {
    return {
      category: 'configuration',
      severity: 'critical',
      probableCauses: [
        'Row Level Security policies too restrictive',
        'Anon key cannot access table',
        'Service role key required but anon key used',
        'RLS policy configuration error',
      ],
      remediationSteps: [
        'Review RLS policies in Supabase dashboard',
        'Test query with service role key',
        'Check if table requires authentication',
        'Verify policy matches use case',
      ],
      relatedDocumentation: [
        'Supabase dashboard - RLS policies',
      ],
    };
  }

  return {
    category: 'data',
    severity: 'warning',
    probableCauses: ['Unrecognized database error'],
    remediationSteps: ['Check Supabase logs', 'Verify connection credentials'],
    relatedDocumentation: [],
  };
}

/**
 * Main diagnosis function - routes to specific diagnostic functions
 */
export function diagnoseFailure(
  failureType: 'connectivity' | 'http_status' | 'database' | 'performance',
  context: {
    error?: string;
    httpStatus?: number;
    route?: string;
    expectedCount?: number;
    actualCount?: number;
    responseTime?: number;
  }
): FailureDiagnosis {
  switch (failureType) {
    case 'connectivity':
      return diagnoseConnectivityFailure(context.error || '');

    case 'http_status':
      return diagnoseHttpStatusFailure(context.httpStatus || 0, context.route || '');

    case 'database':
      return diagnoseDatabaseFailure(context.error || '', {
        expectedCount: context.expectedCount,
        actualCount: context.actualCount,
      });

    case 'performance':
      return {
        category: 'performance',
        severity: context.responseTime && context.responseTime > 5000 ? 'critical' : 'warning',
        probableCauses: [
          'Slow database queries',
          'Large payload size',
          'Cold start penalty',
          'Network latency',
        ],
        remediationSteps: [
          `Response time: ${context.responseTime}ms (SLA: 3000ms)`,
          'Enable query performance logging',
          'Review recent code changes',
          'Check database indexes',
          'Consider caching strategy',
        ],
        relatedDocumentation: [],
      };

    default:
      return {
        category: 'unknown',
        severity: 'info',
        probableCauses: ['Unknown failure type'],
        remediationSteps: ['Review logs for more context'],
        relatedDocumentation: [],
      };
  }
}

/**
 * Format diagnosis as human-readable text
 */
export function formatDiagnosis(diagnosis: FailureDiagnosis): string {
  const lines: string[] = [];

  lines.push(`## Failure Diagnosis`);
  lines.push(`**Category**: ${diagnosis.category.toUpperCase()}`);
  lines.push(`**Severity**: ${diagnosis.severity.toUpperCase()}`);
  lines.push('');

  lines.push('### Probable Causes:');
  diagnosis.probableCauses.forEach((cause, i) => {
    lines.push(`${i + 1}. ${cause}`);
  });
  lines.push('');

  lines.push('### Remediation Steps:');
  diagnosis.remediationSteps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push('');

  if (diagnosis.relatedDocumentation.length > 0) {
    lines.push('### Related Documentation:');
    diagnosis.relatedDocumentation.forEach(doc => {
      lines.push(`- ${doc}`);
    });
  }

  return lines.join('\n');
}
