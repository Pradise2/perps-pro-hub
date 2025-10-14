import { useMemo, useState, useRef, useEffect, ReactNode, UIEvent } from "react";

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    width?: number;
    render: (item: T, index: number) => ReactNode;
    className?: string;
  }>;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
}

export function VirtualizedTable<T>({
  data,
  columns,
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  className = "",
  onRowClick,
  loading = false,
  loadingComponent,
  emptyComponent
}: VirtualizedTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight, startIndex } = useMemo(() => {
    const totalHeight = data.length * itemHeight;
    const containerViewportHeight = containerHeight;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      data.length - 1,
      Math.floor((scrollTop + containerViewportHeight) / itemHeight) + overscan
    );

    const visibleItems = data.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      totalHeight,
      startIndex
    };
  }, [data, itemHeight, scrollTop, containerHeight, overscan]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Reset scroll when data changes significantly
  useEffect(() => {
    if (scrollElementRef.current && data.length === 0) {
      scrollElementRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [data.length]);

  if (loading) {
    return (
      <div className={`relative ${className}`} style={{ height: containerHeight }}>
        {loadingComponent || (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`relative ${className}`} style={{ height: containerHeight }}>
        {emptyComponent || (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height: containerHeight }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`p-3 text-xs font-medium text-muted-foreground ${column.className || ""}`}
              style={{ width: column.width || 'auto', minWidth: column.width || 100 }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height: containerHeight - 40 }} // Subtract header height
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${startIndex * itemHeight}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => {
              const actualIndex = startIndex + index;
              return (
                <div
                  key={actualIndex}
                  className={`flex border-b border-border/50 hover:bg-muted/20 transition-smooth ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  style={{ height: itemHeight }}
                  onClick={() => onRowClick?.(item, actualIndex)}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`p-3 flex items-center ${column.className || ""}`}
                      style={{ width: column.width || 'auto', minWidth: column.width || 100 }}
                    >
                      {column.render(item, actualIndex)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing large datasets with search and filtering
export function useVirtualizedData<T>(
  data: T[],
  searchQuery: string,
  filterFn?: (item: T, query: string) => boolean,
  sortFn?: (a: T, b: T) => number
) {
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery && filterFn) {
      result = result.filter(item => filterFn(item, searchQuery));
    }

    // Apply sorting
    if (sortFn) {
      result.sort(sortFn);
    }

    return result;
  }, [data, searchQuery, filterFn, sortFn]);

  return processedData;
}

// Memory-efficient data provider for real-time updates
export class RealTimeDataManager<T> {
  private data: T[] = [];
  private subscribers: Set<(data: T[]) => void> = new Set();
  private maxSize: number;
  private keyExtractor: (item: T) => string;

  constructor(maxSize: number = 1000, keyExtractor: (item: T) => string) {
    this.maxSize = maxSize;
    this.keyExtractor = keyExtractor;
  }

  subscribe(callback: (data: T[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current data
    callback([...this.data]);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  addItem(item: T): void {
    const key = this.keyExtractor(item);
    const existingIndex = this.data.findIndex(existing => 
      this.keyExtractor(existing) === key
    );

    if (existingIndex >= 0) {
      // Update existing item
      this.data[existingIndex] = item;
    } else {
      // Add new item
      this.data.unshift(item);
      
      // Maintain max size
      if (this.data.length > this.maxSize) {
        this.data = this.data.slice(0, this.maxSize);
      }
    }

    this.notifySubscribers();
  }

  removeItem(key: string): void {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => this.keyExtractor(item) !== key);
    
    if (this.data.length !== initialLength) {
      this.notifySubscribers();
    }
  }

  updateItem(key: string, updater: (item: T) => T): void {
    const index = this.data.findIndex(item => this.keyExtractor(item) === key);
    
    if (index >= 0) {
      this.data[index] = updater(this.data[index]);
      this.notifySubscribers();
    }
  }

  clear(): void {
    if (this.data.length > 0) {
      this.data = [];
      this.notifySubscribers();
    }
  }

  getData(): T[] {
    return [...this.data];
  }

  private notifySubscribers(): void {
    const dataCopy = [...this.data];
    this.subscribers.forEach(callback => {
      try {
        callback(dataCopy);
      } catch (error) {
        console.error('Error in RealTimeDataManager subscriber:', error);
      }
    });
  }
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (renderTime > 16) { // > 1 frame at 60fps
      console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (label: string) => {
      const time = performance.now() - renderStartTime.current;
      console.log(`${componentName} - ${label}: ${time.toFixed(2)}ms`);
    }
  };
}