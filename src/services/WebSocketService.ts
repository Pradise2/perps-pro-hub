import { Market, Position, Order } from "@/types/trading";

export interface WebSocketMessage {
  type: 'market_update' | 'position_update' | 'order_update' | 'error' | 'connection' | 'ping';
  data?: MarketUpdateData | PositionUpdateData | OrderUpdateData | { message?: string; status?: string };
  timestamp: number;
}

export interface MarketUpdateData {
  symbol: string;
  price: string;
  change24h: number;
  volume24h: string;
  high24h?: string;
  low24h?: string;
  timestamp: number;
}

export interface PositionUpdateData {
  positionId: string;
  currentPrice: string;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

export interface OrderUpdateData {
  orderId: string;
  status: 'filled' | 'cancelled' | 'rejected' | 'expired';
  filledSize?: string;
  avgFillPrice?: string;
  reason?: string;
  timestamp: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private pingInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map();
  
  // Market data simulation - In production, this would connect to a real WebSocket feed
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();
  private baseUrls = {
    development: 'wss://demo-feed.tradingplatform.com/ws',
    production: 'wss://api.tradingplatform.com/ws'
  };

  constructor(private environment: 'development' | 'production' = 'development') {}

  // Public API
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        // For development, we'll simulate WebSocket behavior
        if (this.environment === 'development') {
          this.simulateWebSocketConnection();
          resolve();
        } else {
          this.connectToRealWebSocket()
            .then(resolve)
            .catch(reject);
        }
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.cleanup();
    this.stopSimulation();
  }

  subscribe(eventType: string, callback: (data: unknown) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  subscribeToMarkets(symbols: string[]): void {
    if (this.environment === 'development') {
      this.startMarketSimulation(symbols);
    } else {
      this.send({
        type: 'subscribe',
        data: { markets: symbols }
      });
    }
  }

  subscribeToPositions(positionIds: string[]): void {
    if (this.environment === 'development') {
      this.startPositionSimulation(positionIds);
    } else {
      this.send({
        type: 'subscribe',
        data: { positions: positionIds }
      });
    }
  }

  // Private methods
  private connectToRealWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.baseUrls[this.environment];
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startPing();
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopPing();
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        reject(error);
      };

      // Connection timeout
      setTimeout(() => {
        if (this.isConnecting) {
          this.isConnecting = false;
          this.ws?.close();
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
    });
  }

  private simulateWebSocketConnection(): void {
    console.log('Simulating WebSocket connection for development');
    this.isConnecting = false;
    
    // Simulate connection success after a delay
    setTimeout(() => {
      this.emit('connection', { status: 'connected' });
    }, 500);
  }

  private send(message: WebSocketMessage | object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'market_update':
        this.emit('market_update', message.data);
        break;
      case 'position_update':
        this.emit('position_update', message.data);
        break;
      case 'order_update':
        this.emit('order_update', message.data);
        break;
      case 'error':
        this.emit('error', message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private emit(
    eventType: string,
    data:
      | MarketUpdateData
      | PositionUpdateData
      | OrderUpdateData
      | { message?: string; status?: string }
      | undefined
  ): void {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket callback for ${eventType}:`, error);
        }
      });
    }
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.emit('error', { message: 'Max reconnection attempts reached' });
        }
      });
    }, delay);
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private cleanup(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }

  // Development simulation methods
  private startMarketSimulation(symbols: string[]): void {
    symbols.forEach(symbol => {
      if (this.simulationIntervals.has(symbol)) return;

      const interval = setInterval(() => {
        const basePrice = this.getBasePrice(symbol);
        const volatility = 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = basePrice * (1 + change);
        
        const marketUpdate: MarketUpdateData = {
          symbol,
          price: newPrice.toFixed(2),
          change24h: (Math.random() - 0.5) * 10, // Random 24h change
          volume24h: `${(Math.random() * 1000 + 100).toFixed(0)}M`,
          timestamp: Date.now()
        };

        this.emit('market_update', marketUpdate);
      }, 1000 + Math.random() * 2000); // Every 1-3 seconds

      this.simulationIntervals.set(symbol, interval);
    });
  }

  private startPositionSimulation(positionIds: string[]): void {
    positionIds.forEach(positionId => {
      const interval = setInterval(() => {
        const priceChange = (Math.random() - 0.5) * 0.01; // Small price movements
        const pnlChange = priceChange * 1000; // Simulate PnL change
        
        const positionUpdate: PositionUpdateData = {
          positionId,
          currentPrice: (43250 + priceChange * 43250).toFixed(2),
          pnl: 467.44 + pnlChange,
          pnlPercent: ((467.44 + pnlChange) / 5000) * 100,
          timestamp: Date.now()
        };

        this.emit('position_update', positionUpdate);
      }, 2000 + Math.random() * 3000); // Every 2-5 seconds

      this.simulationIntervals.set(`pos_${positionId}`, interval);
    });
  }

  private stopSimulation(): void {
    this.simulationIntervals.forEach(interval => clearInterval(interval));
    this.simulationIntervals.clear();
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'BTC-PERP': 43250,
      'ETH-PERP': 2287,
      'SOL-PERP': 98.45,
      'ARB-PERP': 1.87,
      'AVAX-PERP': 35.21,
      'MATIC-PERP': 0.92
    };
    
    return basePrices[symbol] || 100;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService(
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
);