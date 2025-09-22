// BLKOUT Liberation Platform - Performance Monitoring
// Core Web Vitals tracking and accessibility performance monitoring

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface AccessibilityMetric {
  screenReaderLatency: number;
  focusManagement: number;
  keyboardNavigation: number;
  contrastRatio: number;
}

class LiberationPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    this.setupCoreWebVitalsMonitoring();
    this.setupAccessibilityMonitoring();
    this.setupUserExperienceMonitoring();
  }

  // Core Web Vitals monitoring for community accessibility
  private setupCoreWebVitalsMonitoring() {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry: any) => {
      const lcp = entry.startTime;
      this.recordMetric('LCP', lcp, this.getLCPRating(lcp));
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry: any) => {
      const fid = entry.processingStart - entry.startTime;
      this.recordMetric('FID', fid, this.getFIDRating(fid));
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        const cls = entry.value;
        this.recordMetric('CLS', cls, this.getCLSRating(cls));
      }
    });

    // Time to First Byte (TTFB)
    this.observeTTFB();

    // Total Blocking Time (TBT)
    this.observeTBT();
  }

  // Accessibility-specific performance monitoring
  private setupAccessibilityMonitoring() {
    // Screen reader interaction performance
    this.monitorScreenReaderLatency();

    // Keyboard navigation timing
    this.monitorKeyboardNavigation();

    // Focus management performance
    this.monitorFocusManagement();

    // Color contrast and visual accessibility
    this.monitorVisualAccessibility();
  }

  // User experience monitoring for trauma-informed design
  private setupUserExperienceMonitoring() {
    // Page transition smoothness
    this.monitorPageTransitions();

    // Interactive element responsiveness
    this.monitorInteractiveElements();

    // Loading state effectiveness
    this.monitorLoadingStates();

    // Community-specific engagement metrics
    this.monitorCommunityEngagement();
  }

  private observeMetric(entryType: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });

      observer.observe({ type: entryType, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observation not supported: ${entryType}`, error);
    }
  }

  private observeTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.recordMetric('TTFB', ttfb, this.getTTFBRating(ttfb));
      }
    } catch (error) {
      console.warn('TTFB measurement failed:', error);
    }
  }

  private observeTBT() {
    try {
      this.observeMetric('measure', (entry: any) => {
        if (entry.name === 'total-blocking-time') {
          this.recordMetric('TBT', entry.duration, this.getTBTRating(entry.duration));
        }
      });
    } catch (error) {
      console.warn('TBT measurement failed:', error);
    }
  }

  // Screen reader interaction performance
  private monitorScreenReaderLatency() {
    let ariaLiveStart = 0;

    // Monitor ARIA live region updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target as Element;
          if (target && target.getAttribute && target.getAttribute('aria-live')) {
            const latency = performance.now() - ariaLiveStart;
            this.recordAccessibilityMetric('screen-reader-latency', latency);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Track when ARIA updates are triggered
    document.addEventListener('aria-update', () => {
      ariaLiveStart = performance.now();
    });
  }

  // Keyboard navigation performance
  private monitorKeyboardNavigation() {
    let keydownStart = 0;

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
        keydownStart = performance.now();
      }
    });

    document.addEventListener('focusin', () => {
      if (keydownStart > 0) {
        const latency = performance.now() - keydownStart;
        this.recordAccessibilityMetric('keyboard-navigation', latency);
        keydownStart = 0;
      }
    });
  }

  // Focus management performance
  private monitorFocusManagement() {
    let focusRequested = 0;

    // Monitor programmatic focus changes
    const originalFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function(...args) {
      focusRequested = performance.now();
      return originalFocus.apply(this, args);
    };

    document.addEventListener('focusin', () => {
      if (focusRequested > 0) {
        const latency = performance.now() - focusRequested;
        this.recordAccessibilityMetric('focus-management', latency);
        focusRequested = 0;
      }
    });
  }

  // Visual accessibility monitoring
  private monitorVisualAccessibility() {
    // Check color contrast ratios
    this.checkColorContrast();

    // Monitor text scaling
    this.monitorTextScaling();

    // Check animation compliance
    this.monitorAnimationCompliance();
  }

  private checkColorContrast() {
    // Sample color contrast ratios on key elements
    const checkElements = document.querySelectorAll('[data-contrast-check]');

    checkElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;

      // Calculate contrast ratio (simplified implementation)
      const contrastRatio = this.calculateContrastRatio(bgColor, textColor);
      this.recordAccessibilityMetric('contrast-ratio', contrastRatio);
    });
  }

  private monitorTextScaling() {
    const originalFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const observer = new ResizeObserver(() => {
      const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const scaleFactor = currentFontSize / originalFontSize;

      if (scaleFactor !== 1) {
        this.recordAccessibilityMetric('text-scaling', scaleFactor);
      }
    });

    observer.observe(document.documentElement);
  }

  private monitorAnimationCompliance() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    prefersReducedMotion.addEventListener('change', (e) => {
      this.recordAccessibilityMetric('reduced-motion-compliance', e.matches ? 1 : 0);
    });
  }

  // Page transition monitoring
  private monitorPageTransitions() {
    let transitionStart = 0;

    // Monitor tab changes
    document.addEventListener('tab-change-start', () => {
      transitionStart = performance.now();
    });

    document.addEventListener('tab-change-complete', () => {
      if (transitionStart > 0) {
        const duration = performance.now() - transitionStart;
        this.recordMetric('Page-Transition', duration, this.getTransitionRating(duration));
      }
    });
  }

  // Interactive elements responsiveness
  private monitorInteractiveElements() {
    ['click', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const start = performance.now();

        requestAnimationFrame(() => {
          const latency = performance.now() - start;
          this.recordMetric('Interactive-Latency', latency, this.getInteractiveRating(latency));
        });
      });
    });
  }

  // Loading state effectiveness
  private monitorLoadingStates() {
    const loadingElements = document.querySelectorAll('[aria-busy="true"]');

    loadingElements.forEach((element) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-busy') {
            const target = mutation.target as Element;
            if (target.getAttribute('aria-busy') === 'false') {
              // Loading completed
              this.recordMetric('Loading-Completion', performance.now(), 'good');
            }
          }
        });
      });

      observer.observe(element, { attributes: true });
    });
  }

  // Community engagement metrics
  private monitorCommunityEngagement() {
    // Track liberation action interactions
    document.addEventListener('liberation-action', (event: any) => {
      this.recordMetric('Community-Engagement', 1, 'good');
    });

    // Track story sharing
    document.addEventListener('story-shared', (event: any) => {
      this.recordMetric('Story-Sharing', 1, 'good');
    });

    // Track IVOR interactions
    document.addEventListener('ivor-interaction', (event: any) => {
      this.recordMetric('IVOR-Engagement', 1, 'good');
    });
  }

  // Rating functions for Core Web Vitals
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  private getTBTRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 200) return 'good';
    if (value <= 600) return 'needs-improvement';
    return 'poor';
  }

  private getTransitionRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 200) return 'good';
    if (value <= 500) return 'needs-improvement';
    return 'poor';
  }

  private getInteractiveRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 16) return 'good';
    if (value <= 50) return 'needs-improvement';
    return 'poor';
  }

  // Utility functions
  private calculateContrastRatio(bg: string, text: string): number {
    // Simplified contrast ratio calculation
    // In production, use a proper color contrast library
    return 4.5; // Placeholder
  }

  private recordMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Send to analytics if configured
    this.sendToAnalytics(metric);

    // Log concerning metrics
    if (rating === 'poor') {
      console.warn(`Poor performance metric: ${name} = ${value}`, metric);
    }
  }

  private recordAccessibilityMetric(name: string, value: number) {
    this.recordMetric(`A11Y-${name}`, value, value < 100 ? 'good' : 'needs-improvement');
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to liberation platform analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'liberation_performance', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    }

    // Send to performance monitoring service
    if (window.liberationAnalytics) {
      window.liberationAnalytics.track('performance_metric', metric);
    }
  }

  // Public methods
  public getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  public getMetricsByRating(rating: 'good' | 'needs-improvement' | 'poor'): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.rating === rating);
  }

  public generateReport(): string {
    const report = {
      summary: {
        total: this.metrics.length,
        good: this.getMetricsByRating('good').length,
        needsImprovement: this.getMetricsByRating('needs-improvement').length,
        poor: this.getMetricsByRating('poor').length
      },
      coreWebVitals: this.metrics.filter(m => ['LCP', 'FID', 'CLS', 'TTFB', 'TBT'].includes(m.name)),
      accessibility: this.metrics.filter(m => m.name.startsWith('A11Y-')),
      userExperience: this.metrics.filter(m => ['Page-Transition', 'Interactive-Latency'].includes(m.name)),
      community: this.metrics.filter(m => ['Community-Engagement', 'Story-Sharing', 'IVOR-Engagement'].includes(m.name))
    };

    return JSON.stringify(report, null, 2);
  }

  public startMonitoring() {
    this.isMonitoring = true;
    console.log('🏴‍☠️ Liberation Platform Performance Monitoring Started');
  }

  public stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('🏴‍☠️ Liberation Platform Performance Monitoring Stopped');
  }

  public clearMetrics() {
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new LiberationPerformanceMonitor();

// Auto-start monitoring
performanceMonitor.startMonitoring();

// Export for global access
declare global {
  interface Window {
    liberationPerformanceMonitor: LiberationPerformanceMonitor;
    liberationAnalytics?: any;
  }
}

window.liberationPerformanceMonitor = performanceMonitor;