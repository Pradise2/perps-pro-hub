import { RealTimeDataManager } from "@/components/VirtualizedTable";

// Type definitions for WebSocket data
interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp?: number;
}

interface MarketData {
  symbol: string;
  price: string;
  change24h: number;
  volume24h: string;
  timestamp: number;
}

interface PriceData {
  symbol: string;
  price: string;
  timestamp: number;
}

interface PerformanceReport {
  renderPerformance: Record<string, {
    avgRenderTime: string;
    maxRenderTime: string;
    sampleCount: number;
  }>;
  memoryTrend: Array<{
    timestamp: number;
    memoryMB: string;
  }>;
  recommendations: string[];
}

// WebSocket connection pool for efficient resource management
class WebSocketPool {
  private connections = new Map<string, WebSocket>();
  private subscribers = new Map<string, Set<(data: WebSocketMessage) => void>>();
  private reconnectTimers = new Map<string, NodeJS.Timeout>();
  private maxConnections = 5;
  private connectionTimeout = 30000; // 30 seconds

  constructor(maxConnections = 5) {
    this.maxConnections = maxConnections;
  }

  subscribe(url: string, callback: (data: WebSocketMessage) => void): () => void {
    if (!this.subscribers.has(url)) {
      this.subscribers.set(url, new Set());
    }
    
    this.subscribers.get(url)!.add(callback);

    // Create connection if needed
    if (!this.connections.has(url)) {
      this.createConnection(url);
    }

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(url);
      if (subs) {
        subs.delete(callback);
        
        // Close connection if no more subscribers
        if (subs.size === 0) {
          this.closeConnection(url);
        }
      }
    };
  }

  private createConnection(url: string) {
    if (this.connections.size >= this.maxConnections) {
      console.warn('Max WebSocket connections reached');
      return;
    }

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log(`WebSocket connected: ${url}`);
        this.clearReconnectTimer(url);
      };

      ws.onmessage = (event) => {
        const subscribers = this.subscribers.get(url);
        if (subscribers) {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            subscribers.forEach(callback => {
              try {
                callback(data);
              } catch (error) {
                console.error('Error in WebSocket callback:', error);
              }
            });
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${url}:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed: ${url}`);
        this.connections.delete(url);
        
        // Attempt reconnection if there are still subscribers
        if (this.subscribers.get(url)?.size ?? 0 > 0) {
          this.scheduleReconnect(url);
        }
      };

      this.connections.set(url, ws);
    } catch (error) {
      console.error(`Failed to create WebSocket connection to ${url}:`, error);
    }
  }

  private closeConnection(url: string) {
    const ws = this.connections.get(url);
    if (ws) {
      ws.close();
      this.connections.delete(url);
    }
    
    this.clearReconnectTimer(url);
    this.subscribers.delete(url);
  }

  private scheduleReconnect(url: string) {
    this.clearReconnectTimer(url);
    
    const timer = setTimeout(() => {
      if ((this.subscribers.get(url)?.size ?? 0) > 0) {
        this.createConnection(url);
      }
    }, 5000); // 5 second delay

    this.reconnectTimers.set(url, timer);
  }

  private clearReconnectTimer(url: string) {
    const timer = this.reconnectTimers.get(url);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(url);
    }
  }

  // Cleanup all connections
  destroy() {
    this.connections.forEach((ws, url) => {
      ws.close();
    });
    
    this.reconnectTimers.forEach(timer => {
      clearTimeout(timer);
    });

    this.connections.clear();
    this.subscribers.clear();
    this.reconnectTimers.clear();
  }

  // Get connection status
  getStatus() {
    const status = new Map<string, string>();
    this.connections.forEach((ws, url) => {
      status.set(url, this.getReadyStateText(ws.readyState));
    });
    return status;
  }

  private getReadyStateText(readyState: number): string {
    switch (readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'open';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }
}

// Market data manager with memory optimization
export class OptimizedMarketDataManager {
  private wsPool: WebSocketPool;
  private marketDataManager: RealTimeDataManager<MarketData>;
  private priceDataManager: RealTimeDataManager<PriceData>;
  private subscriptions = new Map<string, () => void>();
  private updateThrottle = new Map<string, NodeJS.Timeout>();

  constructor() {
    this.wsPool = new WebSocketPool(3); // Limit connections
    this.marketDataManager = new RealTimeDataManager(100, (item) => item.symbol);
    this.priceDataManager = new RealTimeDataManager(1000, (item) => item.symbol);
  }

  subscribeToMarket(symbol: string, callback: (data: MarketData) => void): () => void {
    const url = `wss://api.example.com/ws/market/${symbol}`;
    
    const unsubscribeWs = this.wsPool.subscribe(url, (message) => {
      this.throttledUpdate(symbol, () => {
        const data = message.data as MarketData;
        this.marketDataManager.addItem(data);
        callback(data);
      });
    });

    const unsubscribeData = this.marketDataManager.subscribe((markets) => {
      const marketData = markets.find(m => m.symbol === symbol);
      if (marketData) {
        callback(marketData);
      }
    });

    const combinedUnsubscribe = () => {
      unsubscribeWs();
      unsubscribeData();
      this.clearThrottle(symbol);
    };

    this.subscriptions.set(symbol, combinedUnsubscribe);
    return combinedUnsubscribe;
  }

  subscribeToPrices(symbols: string[], callback: (data: PriceData) => void): () => void {
    const unsubscribers: (() => void)[] = [];
    
    symbols.forEach(symbol => {
      const url = `wss://api.example.com/ws/price/${symbol}`;
      
      const unsubscribe = this.wsPool.subscribe(url, (message) => {
        this.throttledUpdate(`price_${symbol}`, () => {
          const data = message.data as PriceData;
          this.priceDataManager.addItem(data);
          callback(data);
        });
      });
      
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
      symbols.forEach(symbol => this.clearThrottle(`price_${symbol}`));
    };
  }

  private throttledUpdate(key: string, updateFn: () => void) {
    // Clear existing throttle
    const existing = this.updateThrottle.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    // Set new throttle
    const timer = setTimeout(() => {
      updateFn();
      this.updateThrottle.delete(key);
    }, 100); // 100ms throttle

    this.updateThrottle.set(key, timer);
  }

  private clearThrottle(key: string) {
    const timer = this.updateThrottle.get(key);
    if (timer) {
      clearTimeout(timer);
      this.updateThrottle.delete(key);
    }
  }

  // Get current market data
  getMarketData(): MarketData[] {
    return this.marketDataManager.getData();
  }

  getPriceData(): PriceData[] {
    return this.priceDataManager.getData();
  }

  // Cleanup
  destroy() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.updateThrottle.forEach(timer => clearTimeout(timer));
    
    this.subscriptions.clear();
    this.updateThrottle.clear();
    this.wsPool.destroy();
  }

  // Performance monitoring
  getPerformanceStats() {
    return {
      activeConnections: this.wsPool.getStatus(),
      marketDataCount: this.marketDataManager.getData().length,
      priceDataCount: this.priceDataManager.getData().length,
      activeSubscriptions: this.subscriptions.size,
      activeThrottles: this.updateThrottle.size
    };
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  private memoryUsage = new Map<number, number>();
  private renderTimes = new Map<string, number[]>();

  // Track component render time
  trackRender(componentName: string, renderTime: number) {
    if (!this.renderTimes.has(componentName)) {
      this.renderTimes.set(componentName, []);
    }
    
    const times = this.renderTimes.get(componentName)!;
    times.push(renderTime);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }

    // Warn if render time is consistently high
    if (times.length >= 10) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      if (avg > 16) { // > 1 frame at 60fps
        console.warn(`${componentName} slow rendering: ${avg.toFixed(2)}ms avg`);
      }
    }
  }

  // Track memory usage
  trackMemory() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const performance = window.performance as Performance & { 
        memory?: { usedJSHeapSize: number } 
      };
      
      if (performance.memory) {
        const timestamp = Date.now();
        this.memoryUsage.set(timestamp, performance.memory.usedJSHeapSize);
        
        // Clean old entries (keep last hour)
        const cutoff = timestamp - 3600000;
        for (const [time] of this.memoryUsage) {
          if (time < cutoff) {
            this.memoryUsage.delete(time);
          } else {
            break;
          }
        }
      }
    }
  }

  // Get performance report
  getReport(): PerformanceReport {
    const report: PerformanceReport = {
      renderPerformance: {},
      memoryTrend: [],
      recommendations: []
    };

    // Render performance summary
    this.renderTimes.forEach((times, component) => {
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const max = Math.max(...times);
        report.renderPerformance[component] = {
          avgRenderTime: avg.toFixed(2),
          maxRenderTime: max.toFixed(2),
          sampleCount: times.length
        };

        if (avg > 16) {
          report.recommendations.push(
            `Consider optimizing ${component} - average render time ${avg.toFixed(2)}ms`
          );
        }
      }
    });

    // Memory trend
    const memoryEntries = Array.from(this.memoryUsage.entries()).slice(-20);
    report.memoryTrend = memoryEntries.map(([time, memory]) => ({
      timestamp: time,
      memoryMB: (memory / 1024 / 1024).toFixed(2)
    }));

    // Memory recommendations
    if (memoryEntries.length >= 2) {
      const first = memoryEntries[0][1];
      const last = memoryEntries[memoryEntries.length - 1][1];
      const growthMB = (last - first) / 1024 / 1024;
      
      if (growthMB > 50) {
        report.recommendations.push(
          `Memory usage increased by ${growthMB.toFixed(2)}MB - check for memory leaks`
        );
      }
    }

    return report;
  }

  // Start monitoring
  startMonitoring(interval = 10000) {
    const memoryTimer = setInterval(() => {
      this.trackMemory();
    }, interval);

    return () => {
      clearInterval(memoryTimer);
    };
  }
}

// Global instances
export const optimizedMarketDataManager = new OptimizedMarketDataManager();
export const performanceMonitor = new PerformanceMonitor();