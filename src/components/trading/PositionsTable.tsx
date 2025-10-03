import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Edit, Share2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
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
}

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
  },
];

const PositionsTable = () => {
  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <Tabs defaultValue="positions" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-border">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger value="positions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Positions
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Open Orders
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
                {mockPositions.map((position) => (
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
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No open orders</p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No trade history</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsTable;
