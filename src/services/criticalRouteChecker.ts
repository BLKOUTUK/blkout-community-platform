// BLKOUT Critical Route Checker Service
// Validates that critical routes are functional and return expected content

export interface RouteCheck {
  route: string;
  url: string;
  status: 'pass' | 'fail' | 'warning';
  httpStatus: number;
  responseTime: number;
  validations: {
    name: string;
    passed: boolean;
    expected: string;
    actual: string;
  }[];
  errors: string[];
  lastCheck: string;
}

/**
 * Critical routes to validate
 */
export const CRITICAL_ROUTES = [
  {
    route: '/movement',
    baseUrl: 'https://blkoutuk.com',
    description: 'Theory of Change page',
    validations: [
      {
        name: 'Masonry grid present',
        check: (html: string) => html.includes('masonry') || html.includes('grid'),
        expected: 'Masonry grid layout',
      },
      {
        name: 'Theory content loaded',
        check: (html: string) =>
          html.includes('Theory of Change') ||
          html.includes('liberation') ||
          html.includes('movement'),
        expected: 'Theory of Change content',
      },
    ],
  },
  {
    route: '/stories',
    baseUrl: 'https://blkoutuk.com',
    description: 'Stories archive (281 articles)',
    validations: [
      {
        name: 'Articles present',
        check: (html: string) => html.includes('article') || html.includes('story'),
        expected: 'Article elements',
      },
      {
        name: 'Joseph Beam content',
        check: (html: string) => html.includes('Joseph Beam') || html.includes('Beam'),
        expected: 'Joseph Beam articles',
      },
    ],
  },
  {
    route: '/governance',
    baseUrl: 'https://blkoutuk.com',
    description: 'Governance dashboard',
    validations: [
      {
        name: 'Governance content',
        check: (html: string) =>
          html.includes('governance') ||
          html.includes('democratic') ||
          html.includes('cooperative'),
        expected: 'Governance content',
      },
      {
        name: 'Interactive elements',
        check: (html: string) =>
          html.includes('poll') ||
          html.includes('vote') ||
          html.includes('button'),
        expected: 'Interactive governance elements',
      },
    ],
  },
  {
    route: '/events',
    baseUrl: 'https://blkoutuk.com',
    description: 'Events calendar',
    validations: [
      {
        name: 'Calendar present',
        check: (html: string) =>
          html.includes('calendar') ||
          html.includes('event') ||
          html.includes('date'),
        expected: 'Calendar elements',
      },
    ],
  },
  {
    route: '/admin',
    baseUrl: 'https://blkoutuk.com',
    description: 'Admin dashboard (protected)',
    validations: [
      {
        name: 'Admin interface',
        check: (html: string) =>
          html.includes('admin') ||
          html.includes('dashboard') ||
          html.includes('moderate'),
        expected: 'Admin interface',
      },
    ],
  },
];

/**
 * Check a single route
 */
async function checkRoute(routeConfig: typeof CRITICAL_ROUTES[0]): Promise<RouteCheck> {
  const startTime = Date.now();
  const errors: string[] = [];
  const validations: RouteCheck['validations'] = [];

  const url = `${routeConfig.baseUrl}${routeConfig.route}`;

  try {
    // Fetch the route
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10s timeout
      headers: {
        'User-Agent': 'BLKOUT-HealthCheck/1.0',
      },
    });

    const responseTime = Date.now() - startTime;
    const httpStatus = response.status;

    // Check HTTP status
    if (httpStatus >= 500) {
      errors.push(`Server error: HTTP ${httpStatus}`);
    } else if (httpStatus === 404) {
      errors.push('Route not found (404)');
    } else if (httpStatus >= 400) {
      errors.push(`Client error: HTTP ${httpStatus}`);
    }

    // Get response HTML
    const html = await response.text();

    // Run validations
    for (const validation of routeConfig.validations) {
      const passed = validation.check(html);
      validations.push({
        name: validation.name,
        passed,
        expected: validation.expected,
        actual: passed ? 'Present' : 'Missing',
      });

      if (!passed) {
        errors.push(`Validation failed: ${validation.name}`);
      }
    }

    // Determine overall status
    let status: RouteCheck['status'] = 'pass';
    if (httpStatus >= 500 || httpStatus === 404) {
      status = 'fail';
    } else if (errors.length > 0) {
      status = 'warning';
    }

    return {
      route: routeConfig.route,
      url,
      status,
      httpStatus,
      responseTime,
      validations,
      errors,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    errors.push(errorMessage);

    return {
      route: routeConfig.route,
      url,
      status: 'fail',
      httpStatus: 0,
      responseTime,
      validations,
      errors,
      lastCheck: new Date().toISOString(),
    };
  }
}

/**
 * Check all critical routes
 */
export async function checkAllRoutes(): Promise<RouteCheck[]> {
  console.log(`[RouteCheck] Checking ${CRITICAL_ROUTES.length} critical routes...`);

  // Check all routes in parallel
  const results = await Promise.all(
    CRITICAL_ROUTES.map((routeConfig) => checkRoute(routeConfig))
  );

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  console.log(`[RouteCheck] Complete. Passed: ${passed}, Warnings: ${warnings}, Failed: ${failed}`);

  return results;
}

/**
 * Get overall route check status
 */
export function getOverallRouteStatus(routes: RouteCheck[]): 'pass' | 'warning' | 'fail' {
  const hasFailures = routes.some(r => r.status === 'fail');
  const hasWarnings = routes.some(r => r.status === 'warning');

  if (hasFailures) return 'fail';
  if (hasWarnings) return 'warning';
  return 'pass';
}
