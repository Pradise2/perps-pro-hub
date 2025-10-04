import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketsSidebar from "@/components/trading/MarketsSidebar";
import TradingChart from "@/components/trading/TradingChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Options = () => {
  const [selectedMarket, setSelectedMarket] = useState({ symbol: "BTC Options", name: "Bitcoin" });

  const strikes = [
    { strike: 40000, callBid: 3250, callAsk: 3280, putBid: 120, putAsk: 135 },
    { strike: 42000, callBid: 2150, callAsk: 2180, putBid: 280, putAsk: 295 },
    { strike: 43250, callBid: 1450, callAsk: 1480, putBid: 450, putAsk: 465 },
    { strike: 45000, callBid: 750, callAsk: 780, putBid: 1200, putAsk: 1215 },
    { strike: 47000, callBid: 280, callAsk: 310, putBid: 2450, putAsk: 2465 },
  ];

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
            
            {/* Options Chain Panel */}
            <div className="min-h-[500px]">
              <Card className="glass-panel h-full flex flex-col">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="font-semibold">Options Chain</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Expiry:</span>
                    <select className="text-xs bg-background border border-border rounded px-2 py-1">
                      <option>30 Days (Mar 15, 2025)</option>
                      <option>60 Days (Apr 15, 2025)</option>
                      <option>90 Days (May 15, 2025)</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="px-2 py-2 text-left text-success">Call Bid</th>
                        <th className="px-2 py-2 text-center font-bold">Strike</th>
                        <th className="px-2 py-2 text-right text-destructive">Put Bid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strikes.map((row) => (
                        <tr key={row.strike} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-2 py-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-success hover:text-success hover:bg-success/10 w-full justify-start"
                            >
                              ${row.callBid}
                            </Button>
                          </td>
                          <td className="px-2 py-3 text-center font-bold">
                            ${row.strike.toLocaleString()}
                          </td>
                          <td className="px-2 py-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-end"
                            >
                              ${row.putBid}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-border">
                  <Button className="w-full" variant="outline">
                    Strategy Builder
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Options Positions */}
          <div className="h-80 border-t border-border p-4">
            <Card className="glass-panel h-full">
              <Tabs defaultValue="positions" className="h-full flex flex-col">
                <TabsList className="mx-4 mt-4">
                  <TabsTrigger value="positions">Options Positions</TabsTrigger>
                  <TabsTrigger value="strategies">Active Strategies</TabsTrigger>
                </TabsList>

                <TabsContent value="positions" className="flex-1 overflow-auto px-4">
                  <p className="text-muted-foreground text-sm py-8 text-center">
                    Your options positions will appear here
                  </p>
                </TabsContent>

                <TabsContent value="strategies" className="flex-1 overflow-auto px-4">
                  <p className="text-muted-foreground text-sm py-8 text-center">
                    No active strategies
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

export default Options;
