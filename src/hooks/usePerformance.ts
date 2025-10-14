import React, { useState, useEffect, useRef } from "react";

// Memory usage monitor hook
export function useMemoryMonitor(componentName: string, interval = 10000) {
  const memoryRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const checkMemory = () => {
        const performance = window.performance as Performance & { 
          memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } 
        };
        
        if (performance.memory) {
          const currentUsage = performance.memory.usedJSHeapSize;
          const delta = currentUsage - memoryRef.current;
          
          if (Math.abs(delta) > 1024 * 1024) { // 1MB threshold
            console.log(`${componentName} memory usage: ${(currentUsage / 1024 / 1024).toFixed(2)}MB (${delta > 0 ? '+' : ''}${(delta / 1024 / 1024).toFixed(2)}MB)`);
            memoryRef.current = currentUsage;
          }
        }
      };

      const intervalId = setInterval(checkMemory, interval);
      return () => clearInterval(intervalId);
    }
  }, [componentName, interval]);
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// Debounced value hook for search/filter optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Performance monitoring utilities
export const performanceUtils = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  },
  
  measure: (name: string, start: string, end: string) => {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, start, end);
        const measure = performance.getEntriesByName(name)[0];
        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },
  
  clearMarks: (name?: string) => {
    if (typeof performance !== 'undefined') {
      performance.clearMarks(name);
    }
  }
};