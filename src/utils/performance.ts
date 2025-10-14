import { Suspense, lazy, ComponentType } from "react";

// Generic lazy loading wrapper without JSX to avoid type issues
export function createLazyComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  return lazy(importFn);
}

// Bundle splitting utilities
export const tradingComponentsPreloader = {
  // Preload critical trading components
  preloadTradingChart: () => import("@/components/trading/TradingChart"),
  preloadOrderPanel: () => import("@/components/trading/OrderPanel"),
  preloadPositionsTable: () => import("@/components/trading/PositionsTable"),
  preloadMarketsSidebar: () => import("@/components/trading/MarketsSidebar"),
  
  // Preload all trading components
  preloadAll: () => {
    return Promise.all([
      import("@/components/trading/TradingChart"),
      import("@/components/trading/OrderPanel"),
      import("@/components/trading/PositionsTable"),
      import("@/components/trading/MarketsSidebar"),
    ]);
  }
};

// Module preloading on user interaction
export function preloadOnInteraction(
  element: HTMLElement,
  importFn: () => Promise<unknown>
) {
  let preloaded = false;
  
  const preload = () => {
    if (!preloaded) {
      preloaded = true;
      importFn().catch(console.error);
    }
  };

  // Preload on hover or focus
  element.addEventListener('mouseenter', preload, { once: true });
  element.addEventListener('focus', preload, { once: true });
  
  return () => {
    element.removeEventListener('mouseenter', preload);
    element.removeEventListener('focus', preload);
  };
}

// Performance optimization utilities
export const optimizationUtils = {
  // Check if component should render based on visibility
  shouldRender: (ref: React.RefObject<Element>) => {
    if (!ref.current) return false;
    
    const rect = ref.current.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  },

  // Throttle function calls
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    }) as T;
  },

  // Debounce function calls
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  },

  // Check if device has good performance characteristics
  isHighPerformanceDevice: () => {
    if (typeof navigator === 'undefined') return true;
    
    interface NetworkInformation {
      effectiveType?: string;
    }
    
    interface NavigatorWithMemory extends Navigator {
      connection?: NetworkInformation;
      deviceMemory?: number;
    }
    
    const nav = navigator as NavigatorWithMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Basic heuristics for performance detection
    const hasGoodConnection = !nav.connection || nav.connection.effectiveType === '4g';
    const hasMultipleCores = hardwareConcurrency >= 4;
    const hasEnoughMemory = nav.deviceMemory ? nav.deviceMemory >= 4 : true;
    
    return hasGoodConnection && hasMultipleCores && hasEnoughMemory;
  }
};