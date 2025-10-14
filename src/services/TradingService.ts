import { z } from "zod";
import { OrderRequest, Position, Order, RiskMetrics } from "@/types/trading";

// Validation schemas
export const orderRequestSchema = z.object({
  market: z.string().min(1, "Market is required"),
  side: z.enum(["long", "short"], { errorMap: () => ({ message: "Side must be long or short" }) }),
  type: z.enum(["market", "limit", "stop", "tp-sl"]),
  size: z.number().positive("Size must be positive").max(1000000, "Size too large"),
  price: z.number().positive().optional(),
  stopPrice: z.number().positive().optional(),
  takeProfitPrice: z.number().positive().optional(),
  stopLossPrice: z.number().positive().optional(),
  leverage: z.number().min(1, "Minimum leverage is 1x").max(50, "Maximum leverage is 50x"),
  margin: z.number().positive("Margin must be positive"),
});

export class TradingService {
  // Calculate position size based on margin and leverage
  static calculatePositionSize(margin: number, leverage: number, entryPrice: number): number {
    return (margin * leverage) / entryPrice;
  }

  // Calculate liquidation price
  static calculateLiquidationPrice(
    entryPrice: number,
    leverage: number,
    side: "long" | "short",
    maintenanceMargin: number = 0.05 // 5% maintenance margin
  ): number {
    if (side === "long") {
      return entryPrice * (1 - (1 / leverage) + maintenanceMargin);
    } else {
      return entryPrice * (1 + (1 / leverage) - maintenanceMargin);
    }
  }

  // Calculate PnL for a position
  static calculatePnL(
    entryPrice: number,
    currentPrice: number,
    size: number,
    side: "long" | "short"
  ): { pnl: number; pnlPercent: number } {
    const priceDiff = side === "long" 
      ? currentPrice - entryPrice 
      : entryPrice - currentPrice;
    
    const pnl = (priceDiff / entryPrice) * size;
    const pnlPercent = (priceDiff / entryPrice) * 100;

    return { pnl, pnlPercent };
  }

  // Calculate trading fees
  static calculateTradingFee(size: number, feeRate: number = 0.0006): number {
    return size * feeRate;
  }

  // Validate order request
  static validateOrder(orderRequest: OrderRequest): { 
    isValid: boolean; 
    errors: string[]; 
    data?: OrderRequest 
  } {
    try {
      const validatedData = orderRequestSchema.parse(orderRequest);
      
      // Additional business logic validation
      const errors: string[] = [];

      // Validate price for limit orders
      if (validatedData.type === "limit" && !validatedData.price) {
        errors.push("Price is required for limit orders");
      }

      // Validate stop price for stop orders
      if (validatedData.type === "stop" && !validatedData.stopPrice) {
        errors.push("Stop price is required for stop orders");
      }

      // Validate TP/SL prices
      if (validatedData.type === "tp-sl") {
        if (!validatedData.takeProfitPrice && !validatedData.stopLossPrice) {
          errors.push("At least one of take profit or stop loss price is required");
        }
      }

      // Validate position size doesn't exceed maximum
      const positionValue = validatedData.margin * validatedData.leverage;
      if (positionValue > 1000000) {
        errors.push("Position size exceeds maximum allowed value");
      }

      return {
        isValid: errors.length === 0,
        errors,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return {
        isValid: false,
        errors: ["Invalid order data"]
      };
    }
  }

  // Calculate margin requirements
  static calculateMarginRequirement(
    size: number,
    leverage: number,
    price: number
  ): { initial: number; maintenance: number } {
    const positionValue = size * price;
    const initial = positionValue / leverage;
    const maintenance = positionValue * 0.05; // 5% maintenance margin
    
    return { initial, maintenance };
  }

  // Calculate portfolio risk metrics
  static calculateRiskMetrics(
    positions: Position[],
    totalBalance: number
  ): RiskMetrics {
    const totalMarginUsed = positions.reduce((sum, pos) => {
      return sum + parseFloat(pos.margin.replace(/,/g, ''));
    }, 0);

    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const portfolioValue = totalBalance + totalPnL;
    const availableMargin = totalBalance - totalMarginUsed;
    const marginRatio = totalMarginUsed / totalBalance;

    // Determine liquidation risk
    let liquidationRisk: "low" | "medium" | "high" = "low";
    if (marginRatio > 0.8) liquidationRisk = "high";
    else if (marginRatio > 0.6) liquidationRisk = "medium";

    // Calculate diversification score (simple implementation)
    const uniqueMarkets = new Set(positions.map(pos => pos.market)).size;
    const diversificationScore = Math.min(uniqueMarkets * 20, 100); // 20 points per unique market, max 100

    return {
      portfolioValue,
      totalMargin: totalMarginUsed,
      availableMargin,
      marginRatio,
      liquidationRisk,
      diversificationScore
    };
  }

  // Check if order can be executed
  static canExecuteOrder(
    orderRequest: OrderRequest,
    availableBalance: number,
    existingPositions: Position[]
  ): { canExecute: boolean; reason?: string } {
    const validation = this.validateOrder(orderRequest);
    if (!validation.isValid) {
      return { canExecute: false, reason: validation.errors.join(", ") };
    }

    // Check if user has sufficient margin
    if (orderRequest.margin > availableBalance) {
      return { canExecute: false, reason: "Insufficient margin available" };
    }

    // Check for conflicting positions (simplified)
    const existingPosition = existingPositions.find(pos => pos.market === orderRequest.market);
    if (existingPosition && existingPosition.side !== orderRequest.side) {
      // In a real system, this might create a reducing order instead
      return { canExecute: false, reason: "Conflicting position exists. Close existing position first." };
    }

    return { canExecute: true };
  }

  // Simulate order execution (in real app, this would call API)
  static async simulateOrderExecution(orderRequest: OrderRequest): Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const validation = this.validateOrder(orderRequest);
        if (!validation.isValid) {
          resolve({
            success: false,
            error: validation.errors.join(", ")
          });
          return;
        }

        // Simulate order creation
        const order: Order = {
          id: Math.random().toString(36).substr(2, 9),
          market: orderRequest.market,
          side: orderRequest.side,
          type: orderRequest.type,
          size: orderRequest.size.toString(),
          price: orderRequest.price?.toString(),
          stopPrice: orderRequest.stopPrice?.toString(),
          takeProfitPrice: orderRequest.takeProfitPrice?.toString(),
          stopLossPrice: orderRequest.stopLossPrice?.toString(),
          leverage: orderRequest.leverage,
          margin: orderRequest.margin.toString(),
          status: orderRequest.type === "market" ? "filled" : "pending",
          timestamp: Date.now(),
          filledSize: orderRequest.type === "market" ? orderRequest.size.toString() : undefined,
          avgFillPrice: orderRequest.type === "market" ? orderRequest.price?.toString() : undefined,
        };

        resolve({
          success: true,
          order
        });
      }, Math.random() * 1000 + 500); // 500-1500ms delay
    });
  }

  // Create position from filled order
  static createPositionFromOrder(order: Order, currentPrice: string): Position {
    const entryPrice = parseFloat(order.avgFillPrice || order.price || currentPrice);
    const size = parseFloat(order.filledSize || order.size);
    const margin = parseFloat(order.margin);
    
    const liquidationPrice = this.calculateLiquidationPrice(
      entryPrice,
      order.leverage,
      order.side
    );

    const { pnl, pnlPercent } = this.calculatePnL(
      entryPrice,
      parseFloat(currentPrice),
      size,
      order.side
    );

    return {
      id: `pos_${order.id}`,
      market: order.market,
      side: order.side,
      size: size.toLocaleString(),
      leverage: order.leverage,
      entryPrice: entryPrice.toFixed(2),
      currentPrice,
      pnl,
      pnlPercent,
      liquidationPrice: liquidationPrice.toFixed(2),
      margin: margin.toLocaleString(),
      timestamp: order.timestamp,
      status: "open"
    };
  }
}