import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const OrderPanel = () => {
  const [leverage, setLeverage] = useState([10]);
  const [collateral, setCollateral] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState("");

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Order Entry</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <span className="text-xs text-muted-foreground">Balance: 10,000.00</span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className="font-mono"
              />
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setCollateral(String((10000 * percent) / 100))}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position Size:</span>
                <span className="font-mono font-semibold">
                  {collateral && !isNaN(Number(collateral))
                    ? `$${(Number(collateral) * leverage[0]).toLocaleString()}`
                    : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Price:</span>
                <span className="font-mono">$43,250.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liquidation Price:</span>
                <span className="font-mono text-short">$41,450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trading Fee:</span>
                <span className="font-mono">0.06%</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Risk Level: <span className="text-primary font-semibold">Medium</span> - Your position will be liquidated if price reaches $41,450
              </p>
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
              />
            </div>
            {/* Other limit order fields would go here */}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="bg-long hover:bg-long/90 text-white font-semibold gap-2 transition-smooth hover:scale-105">
            <TrendingUp className="h-4 w-4" />
            Long
          </Button>
          <Button className="bg-short hover:bg-short/90 text-white font-semibold gap-2 transition-smooth hover:scale-105">
            <TrendingDown className="h-4 w-4" />
            Short
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
