export interface Market {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  volume24h: string;
  high24h?: string;
  low24h?: string;
  fundingRate?: number;
  openInterest?: string;
  isFavorite?: boolean;
  lastUpdate?: number;
}

export interface Position {
  id: string;
  market: string;
  side: "long" | "short";
  size: string;
  leverage: number;
  entryPrice: string;
  currentPrice: string;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: string;
  margin: string;
  timestamp: number;
  status: "open" | "closed" | "liquidated";
}

export interface Order {
  id: string;
  market: string;
  side: "long" | "short";
  type: "market" | "limit" | "stop" | "tp-sl";
  size: string;
  price?: string;
  stopPrice?: string;
  takeProfitPrice?: string;
  stopLossPrice?: string;
  leverage: number;
  margin: string;
  status: "pending" | "filled" | "cancelled" | "rejected";
  timestamp: number;
  filledSize?: string;
  avgFillPrice?: string;
}

export interface TradingState {
  markets: Market[];
  positions: Position[];
  orders: Order[];
  selectedMarket: Market | null;
  balance: {
    total: string;
    available: string;
    margin: string;
  };
  loading: {
    markets: boolean;
    positions: boolean;
    orders: boolean;
    placing: boolean;
  };
  errors: {
    markets: string | null;
    positions: string | null;
    orders: string | null;
    placing: string | null;
  };
  connected: boolean;
  lastUpdate: number;
}

export type TradingAction =
  | { type: "SET_MARKETS"; payload: Market[] }
  | { type: "UPDATE_MARKET"; payload: { symbol: string; data: Partial<Market> } }
  | { type: "SET_POSITIONS"; payload: Position[] }
  | { type: "ADD_POSITION"; payload: Position }
  | { type: "UPDATE_POSITION"; payload: { id: string; data: Partial<Position> } }
  | { type: "REMOVE_POSITION"; payload: string }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: { id: string; data: Partial<Order> } }
  | { type: "REMOVE_ORDER"; payload: string }
  | { type: "SELECT_MARKET"; payload: Market }
  | { type: "SET_BALANCE"; payload: TradingState["balance"] }
  | { type: "SET_LOADING"; payload: { key: keyof TradingState["loading"]; value: boolean } }
  | { type: "SET_ERROR"; payload: { key: keyof TradingState["errors"]; value: string | null } }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "RESET_STATE" };

export interface OrderRequest {
  market: string;
  side: "long" | "short";
  type: "market" | "limit" | "stop" | "tp-sl";
  size: number;
  price?: number;
  stopPrice?: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  leverage: number;
  margin: number;
}

export interface TradeSignal {
  id: string;
  market: string;
  direction: "long" | "short";
  confidence: "low" | "medium" | "high";
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  leverage: number;
  reasoning: string;
  timestamp: number;
}

export interface RiskMetrics {
  portfolioValue: number;
  totalMargin: number;
  availableMargin: number;
  marginRatio: number;
  liquidationRisk: "low" | "medium" | "high";
  diversificationScore: number;
}