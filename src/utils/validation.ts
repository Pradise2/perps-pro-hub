import { z } from "zod";

// Enhanced validation schemas with detailed error messages
export const orderValidationSchema = z.object({
  market: z.string().min(1, "Please select a market"),
  side: z.enum(["long", "short"], { 
    errorMap: () => ({ message: "Please select Long or Short" })
  }),
  type: z.enum(["market", "limit", "stop", "tp-sl"], {
    errorMap: () => ({ message: "Please select a valid order type" })
  }),
  size: z.number({
    required_error: "Size is required",
    invalid_type_error: "Size must be a number"
  })
    .positive("Size must be greater than 0")
    .min(0.01, "Minimum size is 0.01")
    .max(1000000, "Maximum size is 1,000,000"),
  
  price: z.number().positive("Price must be positive").optional(),
  stopPrice: z.number().positive("Stop price must be positive").optional(),
  takeProfitPrice: z.number().positive("Take profit price must be positive").optional(),
  stopLossPrice: z.number().positive("Stop loss price must be positive").optional(),
  
  leverage: z.number()
    .min(1, "Minimum leverage is 1x")
    .max(50, "Maximum leverage is 50x")
    .int("Leverage must be a whole number"),
    
  margin: z.number()
    .positive("Margin must be positive")
    .min(1, "Minimum margin is $1")
}).superRefine((data, ctx) => {
  // Conditional validation based on order type
  if (data.type === "limit" && !data.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price is required for limit orders",
      path: ["price"]
    });
  }

  if (data.type === "stop" && !data.stopPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Stop price is required for stop orders",
      path: ["stopPrice"]
    });
  }

  if (data.type === "tp-sl") {
    if (!data.takeProfitPrice && !data.stopLossPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of Take Profit or Stop Loss is required",
        path: ["takeProfitPrice"]
      });
    }
  }

  // Validate position size
  const positionValue = data.margin * data.leverage;
  if (positionValue > 1000000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Position size ($${positionValue.toLocaleString()}) exceeds maximum allowed ($1,000,000)`,
      path: ["margin"]
    });
  }

  // Price relationship validations for long positions
  if (data.side === "long" && data.price && data.stopLossPrice) {
    if (data.stopLossPrice >= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Stop loss must be below entry price for long positions",
        path: ["stopLossPrice"]
      });
    }
  }

  if (data.side === "long" && data.price && data.takeProfitPrice) {
    if (data.takeProfitPrice <= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Take profit must be above entry price for long positions",
        path: ["takeProfitPrice"]
      });
    }
  }

  // Price relationship validations for short positions
  if (data.side === "short" && data.price && data.stopLossPrice) {
    if (data.stopLossPrice <= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Stop loss must be above entry price for short positions",
        path: ["stopLossPrice"]
      });
    }
  }

  if (data.side === "short" && data.price && data.takeProfitPrice) {
    if (data.takeProfitPrice >= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Take profit must be below entry price for short positions",
        path: ["takeProfitPrice"]
      });
    }
  }
});

// Market data validation
export const marketSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Name is required"),
  price: z.string().regex(/^\d+([,.]?\d+)*$/, "Invalid price format"),
  change24h: z.number(),
  volume24h: z.string(),
});

// Balance validation
export const balanceSchema = z.object({
  amount: z.number()
    .nonnegative("Amount cannot be negative")
    .max(1000000, "Amount exceeds maximum limit"),
  
  percentage: z.number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100%")
});

// Validation helper functions
export class ValidationHelpers {
  static formatValidationErrors(errors: z.ZodIssue[]): Record<string, string> {
    const formatted: Record<string, string> = {};
    
    errors.forEach(error => {
      const path = error.path.join('.');
      formatted[path] = error.message;
    });
    
    return formatted;
  }

  static validateNumberInput(
    value: string, 
    options: {
      min?: number;
      max?: number;
      required?: boolean;
      label?: string;
    } = {}
  ): { isValid: boolean; error?: string; value?: number } {
    const { min = 0, max = Infinity, required = false, label = "Value" } = options;
    
    if (!value.trim()) {
      if (required) {
        return { isValid: false, error: `${label} is required` };
      }
      return { isValid: true, value: 0 };
    }

    const numValue = parseFloat(value.replace(/,/g, ''));
    
    if (isNaN(numValue)) {
      return { isValid: false, error: `${label} must be a valid number` };
    }

    if (numValue < min) {
      return { isValid: false, error: `${label} must be at least ${min}` };
    }

    if (numValue > max) {
      return { isValid: false, error: `${label} cannot exceed ${max.toLocaleString()}` };
    }

    return { isValid: true, value: numValue };
  }

  static validatePriceInput(
    value: string,
    currentPrice: number,
    side: "long" | "short",
    type: "limit" | "stop" | "takeProfit" | "stopLoss"
  ): { isValid: boolean; error?: string; warning?: string } {
    if (!value.trim()) {
      return { isValid: false, error: "Price is required" };
    }

    const price = parseFloat(value.replace(/,/g, ''));
    
    if (isNaN(price) || price <= 0) {
      return { isValid: false, error: "Price must be a positive number" };
    }

    // Price warnings based on order type and side
    const priceDiffPercent = Math.abs((price - currentPrice) / currentPrice) * 100;
    
    if (type === "limit") {
      if (side === "long" && price > currentPrice * 1.05) {
        return { 
          isValid: true, 
          warning: "Limit price is significantly above market price" 
        };
      }
      if (side === "short" && price < currentPrice * 0.95) {
        return { 
          isValid: true, 
          warning: "Limit price is significantly below market price" 
        };
      }
    }

    if (priceDiffPercent > 50) {
      return { 
        isValid: true, 
        warning: `Price is ${priceDiffPercent.toFixed(1)}% away from market price` 
      };
    }

    return { isValid: true };
  }

  static calculateRiskLevel(leverage: number, marginRatio: number): {
    level: "low" | "medium" | "high" | "extreme";
    color: string;
    description: string;
  } {
    if (leverage <= 5 && marginRatio < 0.3) {
      return {
        level: "low",
        color: "text-success",
        description: "Conservative risk level"
      };
    } else if (leverage <= 15 && marginRatio < 0.6) {
      return {
        level: "medium",
        color: "text-warning",
        description: "Moderate risk level"
      };
    } else if (leverage <= 25 && marginRatio < 0.8) {
      return {
        level: "high",
        color: "text-destructive",
        description: "High risk - monitor closely"
      };
    } else {
      return {
        level: "extreme",
        color: "text-destructive",
        description: "Extreme risk - consider reducing position"
      };
    }
  }
}