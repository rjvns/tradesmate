import { useEffect, useCallback } from 'react';

/**
 * Performance monitoring hook for Core Web Vitals
 * 
 * Features:
 * - Monitors LCP, FID, CLS, TTFB
 * - Reports performance metrics
 * - Provides optimization insights
 */

export const usePerformance = () => {
  const reportMetric = useCallback((metric) => {
    // In production, send to analytics service
    console.log('Performance Metric:', metric);
  }, []);

  useEffect(() => {
    // Core Web Vitals monitoring
    const observePerformance = async () => {
      if ('web-vitals' in window) {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        getCLS(reportMetric);
        getFID(reportMetric);
        getFCP(reportMetric);
        getLCP(reportMetric);
        getTTFB(reportMetric);
      }
    };

    observePerformance();
  }, [reportMetric]);

  const markInteraction = useCallback((name) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`interaction-${name}-start`);
      
      return () => {
        performance.mark(`interaction-${name}-end`);
        performance.measure(
          `interaction-${name}`,
          `interaction-${name}-start`,
          `interaction-${name}-end`
        );
      };
    }
    return () => {};
  }, []);

  return { markInteraction };
};

/**
 * Optimistic UI hook for better perceived performance
 */
export const useOptimisticUpdate = (asyncAction) => {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  const execute = useCallback(async (optimisticData, actualAction) => {
    // Immediately update with optimistic data
    setState(prev => ({ ...prev, data: optimisticData, loading: true }));

    try {
      const result = await actualAction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, []);

  return [state, execute];
};
