import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Edit, Share2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradingContext } from "@/contexts/TradingContext";

const PositionsTable = () => {
  const { state, actions } = useTradingContext();

  const handleClosePosition = (positionId: string) => {
    // In a real app, this would call an API to close the position
    actions.removePosition(positionId);
  };

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <Tabs defaultValue="positions" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-border">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger value="positions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Positions ({state.positions.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Open Orders ({state.orders.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Trade History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions" className="flex-1 m-0 overflow-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm">
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left p-3 font-medium">Market</th>
                  <th className="text-left p-3 font-medium">Side</th>
                  <th className="text-right p-3 font-medium">Size</th>
                  <th className="text-right p-3 font-medium">Leverage</th>
                  <th className="text-right p-3 font-medium">Entry Price</th>
                  <th className="text-right p-3 font-medium">Current Price</th>
                  <th className="text-right p-3 font-medium">PnL</th>
                  <th className="text-right p-3 font-medium">Liq. Price</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.positions.map((position) => (
                  <tr
                    key={position.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-smooth"
                  >
                    <td className="p-3 font-semibold">{position.market}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold",
                          position.side === "long"
                            ? "bg-long-bg text-long"
                            : "bg-short-bg text-short"
                        )}
                      >
                        {position.side === "long" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {position.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">${position.size}</td>
                    <td className="p-3 text-right font-mono">{position.leverage}x</td>
                    <td className="p-3 text-right font-mono">${position.entryPrice}</td>
                    <td className="p-3 text-right font-mono">${position.currentPrice}</td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={cn(
                            "font-mono font-semibold",
                            position.pnl >= 0 ? "text-long" : "text-short"
                          )}
                        >
                          {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-mono",
                            position.pnl >= 0 ? "text-long" : "text-short"
                          )}
                        >
                          ({position.pnl >= 0 ? "+" : ""}
                          {position.pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-short">
                      ${position.liquidationPrice}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-short/20 hover:text-short"
                          onClick={() => handleClosePosition(position.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {state.positions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <p>No open positions</p>
                <p className="text-xs mt-1">Start trading to see your positions here</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No open orders ({state.orders.length})</p>
            {state.orders.length === 0 && (
              <p className="text-xs mt-1">Your pending orders will appear here</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No trade history</p>
            <p className="text-xs mt-1">Your completed trades will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsTable;
