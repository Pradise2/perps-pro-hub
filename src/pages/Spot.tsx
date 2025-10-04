import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketsSidebar from "@/components/trading/MarketsSidebar";
import TradingChart from "@/components/trading/TradingChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Spot = () => {
  const [selectedMarket, setSelectedMarket] = useState({ symbol: "BTC/USD", name: "Bitcoin" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-border overflow-hidden">
          <MarketsSidebar onSelectMarket={(market) => setSelectedMarket(market)} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
            <div className="lg:col-span-2 min-h-[500px]">
              <TradingChart marketSymbol={selectedMarket.symbol} />
            </div>
            
            {/* Simplified Spot Trading Panel */}
            <div className="min-h-[500px]">
              <Card className="glass-panel h-full flex flex-col">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="font-semibold">Spot Trading</h3>
                  <p className="text-xs text-muted-foreground">Direct asset trading</p>
                </div>

                <Tabs defaultValue="buy" className="flex-1 flex flex-col">
                  <TabsList className="mx-4 mt-4">
                    <TabsTrigger value="buy" className="flex-1">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="flex-1">Sell</TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="flex-1 px-4 pb-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You Pay</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold">
                          USDC
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Available: 10,000 USDC</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You Receive</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pr-16"
                          disabled
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold">
                          BTC
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 rounded bg-muted/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">$43,250.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee (0.1%)</span>
                        <span className="font-semibold">$4.32</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full bg-success hover:bg-success/90">
                      Buy BTC
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="flex-1 px-4 pb-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You Pay</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold">
                          BTC
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Available: 0.5 BTC</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You Receive</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pr-16"
                          disabled
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold">
                          USDC
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 rounded bg-muted/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">$43,250.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee (0.1%)</span>
                        <span className="font-semibold">$4.32</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full bg-destructive hover:bg-destructive/90">
                      Sell BTC
                    </Button>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>

          {/* Asset Holdings */}
          <div className="h-80 border-t border-border p-4">
            <Card className="glass-panel h-full">
              <Tabs defaultValue="holdings" className="h-full flex flex-col">
                <TabsList className="mx-4 mt-4">
                  <TabsTrigger value="holdings">Asset Holdings</TabsTrigger>
                  <TabsTrigger value="orders">Open Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="holdings" className="flex-1 overflow-auto px-4">
                  <p className="text-muted-foreground text-sm py-8 text-center">
                    Your spot asset balances will appear here
                  </p>
                </TabsContent>

                <TabsContent value="orders" className="flex-1 overflow-auto px-4">
                  <p className="text-muted-foreground text-sm py-8 text-center">
                    No open orders
                  </p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Spot;
