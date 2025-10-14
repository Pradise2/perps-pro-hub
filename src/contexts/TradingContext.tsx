import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from "react";
import { TradingState, TradingAction, Market, Position, Order } from "@/types/trading";
import { webSocketService, MarketUpdateData, PositionUpdateData } from "@/services/WebSocketService";

const initialState: TradingState = {
  markets: [],
  positions: [],
  orders: [],
  selectedMarket: null,
  balance: {
    total: "0",
    available: "0",
    margin: "0",
  },
  loading: {
    markets: false,
    positions: false,
    orders: false,
    placing: false,
  },
  errors: {
    markets: null,
    positions: null,
    orders: null,
    placing: null,
  },
  connected: false,
  lastUpdate: 0,
};

function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case "SET_MARKETS":
      return {
        ...state,
        markets: action.payload,
        lastUpdate: Date.now(),
      };

    case "UPDATE_MARKET":
      return {
        ...state,
        markets: state.markets.map((market) =>
          market.symbol === action.payload.symbol
            ? { ...market, ...action.payload.data, lastUpdate: Date.now() }
            : market
        ),
        lastUpdate: Date.now(),
      };

    case "SET_POSITIONS":
      return {
        ...state,
        positions: action.payload,
        lastUpdate: Date.now(),
      };

    case "ADD_POSITION":
      return {
        ...state,
        positions: [...state.positions, action.payload],
        lastUpdate: Date.now(),
      };

    case "UPDATE_POSITION":
      return {
        ...state,
        positions: state.positions.map((position) =>
          position.id === action.payload.id
            ? { ...position, ...action.payload.data }
            : position
        ),
        lastUpdate: Date.now(),
      };

    case "REMOVE_POSITION":
      return {
        ...state,
        positions: state.positions.filter((position) => position.id !== action.payload),
        lastUpdate: Date.now(),
      };

    case "SET_ORDERS":
      return {
        ...state,
        orders: action.payload,
        lastUpdate: Date.now(),
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
        lastUpdate: Date.now(),
      };

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.data }
            : order
        ),
        lastUpdate: Date.now(),
      };

    case "REMOVE_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
        lastUpdate: Date.now(),
      };

    case "SELECT_MARKET":
      return {
        ...state,
        selectedMarket: action.payload,
      };

    case "SET_BALANCE":
      return {
        ...state,
        balance: action.payload,
        lastUpdate: Date.now(),
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_CONNECTED":
      return {
        ...state,
        connected: action.payload,
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

interface TradingContextType {
  state: TradingState;
  dispatch: Dispatch<TradingAction>;
  actions: {
    updateMarket: (symbol: string, data: Partial<Market>) => void;
    selectMarket: (market: Market) => void;
    addPosition: (position: Position) => void;
    updatePosition: (id: string, data: Partial<Position>) => void;
    removePosition: (id: string) => void;
    addOrder: (order: Order) => void;
    updateOrder: (id: string, data: Partial<Order>) => void;
    removeOrder: (id: string) => void;
    setLoading: (key: keyof TradingState["loading"], value: boolean) => void;
    setError: (key: keyof TradingState["errors"], value: string | null) => void;
    clearErrors: () => void;
  };
}

const TradingContext = createContext<TradingContextType | null>(null);

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTradingContext must be used within a TradingProvider");
  }
  return context;
};

interface TradingProviderProps {
  children: ReactNode;
}

export const TradingProvider = ({ children }: TradingProviderProps) => {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Action creators for cleaner API
  const actions = {
    updateMarket: (symbol: string, data: Partial<Market>) =>
      dispatch({ type: "UPDATE_MARKET", payload: { symbol, data } }),
    
    selectMarket: (market: Market) =>
      dispatch({ type: "SELECT_MARKET", payload: market }),
    
    addPosition: (position: Position) =>
      dispatch({ type: "ADD_POSITION", payload: position }),
    
    updatePosition: (id: string, data: Partial<Position>) =>
      dispatch({ type: "UPDATE_POSITION", payload: { id, data } }),
    
    removePosition: (id: string) =>
      dispatch({ type: "REMOVE_POSITION", payload: id }),
    
    addOrder: (order: Order) =>
      dispatch({ type: "ADD_ORDER", payload: order }),
    
    updateOrder: (id: string, data: Partial<Order>) =>
      dispatch({ type: "UPDATE_ORDER", payload: { id, data } }),
    
    removeOrder: (id: string) =>
      dispatch({ type: "REMOVE_ORDER", payload: id }),
    
    setLoading: (key: keyof TradingState["loading"], value: boolean) =>
      dispatch({ type: "SET_LOADING", payload: { key, value } }),
    
    setError: (key: keyof TradingState["errors"], value: string | null) =>
      dispatch({ type: "SET_ERROR", payload: { key, value } }),
    
    clearErrors: () => {
      Object.keys(state.errors).forEach((key) => {
        dispatch({ type: "SET_ERROR", payload: { key: key as keyof TradingState["errors"], value: null } });
      });
    },
  };

  // Initialize with mock data for development
  useEffect(() => {
    const initializeData = async () => {
      // Set loading states
      dispatch({ type: "SET_LOADING", payload: { key: "markets", value: true } });
      dispatch({ type: "SET_LOADING", payload: { key: "positions", value: true } });

      const mockMarkets: Market[] = [
        { symbol: "BTC-PERP", name: "Bitcoin", price: "43,250.50", change24h: 2.45, volume24h: "2.5B", lastUpdate: Date.now() },
        { symbol: "ETH-PERP", name: "Ethereum", price: "2,287.30", change24h: 3.12, volume24h: "1.2B", lastUpdate: Date.now() },
        { symbol: "SOL-PERP", name: "Solana", price: "98.45", change24h: -1.23, volume24h: "450M", lastUpdate: Date.now() },
        { symbol: "ARB-PERP", name: "Arbitrum", price: "1.87", change24h: 5.67, volume24h: "180M", lastUpdate: Date.now() },
        { symbol: "AVAX-PERP", name: "Avalanche", price: "35.21", change24h: 1.89, volume24h: "220M", lastUpdate: Date.now() },
        { symbol: "MATIC-PERP", name: "Polygon", price: "0.92", change24h: -2.34, volume24h: "120M", lastUpdate: Date.now() },
      ];

      const mockPositions: Position[] = [
        {
          id: "1",
          market: "BTC-PERP",
          side: "long",
          size: "50,000",
          leverage: 10,
          entryPrice: "42,850.00",
          currentPrice: "43,250.50",
          pnl: 467.44,
          pnlPercent: 9.35,
          liquidationPrice: "41,200.00",
          margin: "5,000",
          timestamp: Date.now() - 3600000,
          status: "open",
        },
        {
          id: "2",
          market: "ETH-PERP",
          side: "short",
          size: "20,000",
          leverage: 5,
          entryPrice: "2,310.50",
          currentPrice: "2,287.30",
          pnl: 201.30,
          pnlPercent: 5.03,
          liquidationPrice: "2,450.00",
          margin: "4,000",
          timestamp: Date.now() - 7200000,
          status: "open",
        },
      ];

      // Initialize WebSocket connection
      try {
        await webSocketService.connect();
        dispatch({ type: "SET_CONNECTED", payload: true });

        // Subscribe to market updates
        const marketSymbols = mockMarkets.map(m => m.symbol);
        webSocketService.subscribeToMarkets(marketSymbols);

        // Subscribe to position updates
        const positionIds = mockPositions.map(p => p.id);
        webSocketService.subscribeToPositions(positionIds);

        // Set up event listeners
        webSocketService.subscribe('market_update', (data: MarketUpdateData) => {
          dispatch({ 
            type: "UPDATE_MARKET", 
            payload: { 
              symbol: data.symbol, 
              data: { 
                price: data.price,
                change24h: data.change24h,
                volume24h: data.volume24h,
                lastUpdate: data.timestamp
              } 
            } 
          });
        });

        webSocketService.subscribe('position_update', (data: PositionUpdateData) => {
          dispatch({ 
            type: "UPDATE_POSITION", 
            payload: { 
              id: data.positionId, 
              data: { 
                currentPrice: data.currentPrice,
                pnl: data.pnl,
                pnlPercent: data.pnlPercent
              } 
            } 
          });
        });

        webSocketService.subscribe('error', (error) => {
          console.error('WebSocket error:', error);
          dispatch({ type: "SET_ERROR", payload: { key: "markets", value: error.message } });
        });

      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        dispatch({ type: "SET_ERROR", payload: { key: "markets", value: "Failed to connect to real-time data" } });
      }

      // Set initial data
      dispatch({ type: "SET_MARKETS", payload: mockMarkets });
      dispatch({ type: "SET_POSITIONS", payload: mockPositions });
      dispatch({ type: "SELECT_MARKET", payload: mockMarkets[0] });
      dispatch({ type: "SET_BALANCE", payload: { total: "29,050", available: "16,750", margin: "12,300" } });

      // Clear loading states
      dispatch({ type: "SET_LOADING", payload: { key: "markets", value: false } });
      dispatch({ type: "SET_LOADING", payload: { key: "positions", value: false } });
    };

    initializeData();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <TradingContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </TradingContext.Provider>
  );
};