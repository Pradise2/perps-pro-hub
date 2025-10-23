import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradingContext } from "@/contexts/TradingContext";
import { TradingService } from "@/services/TradingService";
import { OrderRequest } from "@/types/trading";

const OrderPanel = () => {
  const { state, actions } = useTradingContext();
  const [leverage, setLeverage] = useState([10]);
  const [collateral, setCollateral] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderErrors, setOrderErrors] = useState<string[]>([]);

  const selectedMarket = state.selectedMarket;
  const availableBalance = parseFloat(state.balance.available.replace(/,/g, '')) || 0;

  const calculatePositionDetails = () => {
    const collateralNum = parseFloat(collateral) || 0;
    const leverageNum = leverage[0];
    const currentPrice = parseFloat(selectedMarket?.price.replace(/,/g, '') || '0');
    
    if (!collateralNum || !currentPrice) {
      return {
        positionSize: 0,
        liquidationPrice: 0,
        tradingFee: 0
      };
    }

    const positionSize = collateralNum * leverageNum;
    const liquidationPrice = TradingService.calculateLiquidationPrice(
      currentPrice,
      leverageNum,
      "long" // For display purposes, can toggle based on selected side
    );
    const tradingFee = TradingService.calculateTradingFee(positionSize);

    return {
      positionSize,
      liquidationPrice,
      tradingFee
    };
  };

  const positionDetails = calculatePositionDetails();

  const handlePlaceOrder = async (side: "long" | "short") => {
    if (!selectedMarket) {
      setOrderErrors(["Please select a market"]);
      return;
    }

    const collateralNum = parseFloat(collateral);
    const leverageNum = leverage[0];
    const currentPrice = parseFloat(selectedMarket.price.replace(/,/g, ''));

    if (!collateralNum || collateralNum <= 0) {
      setOrderErrors(["Please enter a valid collateral amount"]);
      return;
    }

    const orderRequest: OrderRequest = {
      market: selectedMarket.symbol,
      side,
      type: orderType as "market" | "limit" | "stop" | "tp-sl",
      size: collateralNum * leverageNum,
      price: orderType === "market" ? currentPrice : parseFloat(limitPrice) || currentPrice,
      leverage: leverageNum,
      margin: collateralNum,
    };

    // Validate order
    const validation = TradingService.validateOrder(orderRequest);
    if (!validation.isValid) {
      setOrderErrors(validation.errors);
      return;
    }

    // Check if order can be executed
    const canExecute = TradingService.canExecuteOrder(
      orderRequest,
      availableBalance,
      state.positions
    );

    if (!canExecute.canExecute) {
      setOrderErrors([canExecute.reason || "Cannot execute order"]);
      return;
    }

    setIsPlacing(true);
    setOrderErrors([]);
    actions.setLoading("placing", true);

    try {
      const result = await TradingService.simulateOrderExecution(orderRequest);
      
      if (result.success && result.order) {
        actions.addOrder(result.order);
        
        // If it's a market order, create a position immediately
        if (result.order.status === "filled") {
          const position = TradingService.createPositionFromOrder(
            result.order,
            selectedMarket.price
          );
          actions.addPosition(position);
        }

        // Reset form
        setCollateral("");
        setLeverage([10]);
        setLimitPrice("");
        
        // Update balance (simplified)
        const newAvailable = (availableBalance - collateralNum).toString();
        actions.updateBalance({
          ...state.balance,
          available: newAvailable
        });
      } else {
        setOrderErrors([result.error || "Failed to place order"]);
      }
    } catch (error) {
      setOrderErrors(["Network error. Please try again."]);
    } finally {
      setIsPlacing(false);
      actions.setLoading("placing", false);
    }
  };

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Order Entry</h3>
        {selectedMarket && (
          <p className="text-xs text-muted-foreground mt-1">
            {selectedMarket.name} • ${selectedMarket.price}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Error Display */}
        {orderErrors.length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {orderErrors.map((error, index) => (
                  <p key={index} className="text-xs text-destructive">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="stop">Stop</TabsTrigger>
            <TabsTrigger value="tp-sl">TP/SL</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Leverage</Label>
                <span className="text-sm font-mono font-semibold text-primary">{leverage[0]}x</span>
              </div>
              <Slider
                value={leverage}
                onValueChange={setLeverage}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Collateral (USDC)</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {state.balance.available}
                </span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className="font-mono"
                disabled={isPlacing}
              />
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={isPlacing}
                    onClick={() => setCollateral(String((availableBalance * percent) / 100))}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="limit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Limit Price (USDC)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="font-mono"
                disabled={isPlacing}
              />
            </div>
            {/* Include leverage and collateral inputs here too */}
          </TabsContent>
        </Tabs>

        {/* Position Preview */}
        {collateral && selectedMarket && (
          <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position Size:</span>
              <span className="font-mono font-semibold">
                ${positionDetails.positionSize.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Price:</span>
              <span className="font-mono">${selectedMarket.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidation Price:</span>
              <span className="font-mono text-short">
                ${positionDetails.liquidationPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trading Fee:</span>
              <span className="font-mono">${positionDetails.tradingFee.toFixed(2)}</span>
            </div>
          </div>
        )}

        {positionDetails.positionSize > 0 && (
          <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Risk Level: <span className="text-primary font-semibold">
                {leverage[0] > 20 ? "High" : leverage[0] > 10 ? "Medium" : "Low"}
              </span> - Your position will be liquidated if price reaches ${positionDetails.liquidationPrice.toFixed(2)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            className="bg-long hover:bg-long/90 text-white font-semibold gap-2 transition-smooth hover:scale-105"
            onClick={() => handlePlaceOrder("long")}
            disabled={isPlacing || !selectedMarket || !collateral}
          >
            {isPlacing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            Long
          </Button>
          <Button 
            className="bg-short hover:bg-short/90 text-white font-semibold gap-2 transition-smooth hover:scale-105"
            onClick={() => handlePlaceOrder("short")}
            disabled={isPlacing || !selectedMarket || !collateral}
          >
            {isPlacing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            Short
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
