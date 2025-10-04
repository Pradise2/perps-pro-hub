import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Activity, Bot, PlayCircle, Zap } from "lucide-react";

const AIHub = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            AI Analytics & Strategy Hub
          </h1>
          <p className="text-muted-foreground">
            Leverage AI-powered insights and build automated trading strategies
          </p>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="bg-card/50">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="builder">Strategy Builder</TabsTrigger>
            <TabsTrigger value="backtest">Backtesting</TabsTrigger>
            <TabsTrigger value="strategies">My Strategies</TabsTrigger>
          </TabsList>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Sentiment */}
              <Card className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Sentiment Analysis
                  </h3>
                  <Badge className="bg-success/20 text-success">Bullish</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Social media sentiment for BTC/USD is strongly positive with increasing mentions (+45% in 24h)
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Positive</span>
                    <span className="text-success font-semibold">68%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: '68%' }} />
                  </div>
                </div>
              </Card>

              {/* On-Chain Data */}
              <Card className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    On-Chain Data
                  </h3>
                  <Badge className="bg-primary/20 text-primary">Active</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Large wallet accumulation detected. Whale addresses added 2,450 BTC in the past 48 hours.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exchange Inflow</span>
                    <span className="text-destructive font-semibold flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -12.5%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exchange Outflow</span>
                    <span className="text-success font-semibold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +23.8%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Trade Suggestion */}
            <Card className="glass-panel p-6 border-2 border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Brain className="h-6 w-6 text-primary" />
                    AI Potential Trade Signal
                  </h3>
                  <Badge className="bg-success/20 text-success">High Confidence</Badge>
                </div>
                <Button className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Execute Trade
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <span className="text-sm text-muted-foreground">Direction</span>
                  <p className="text-lg font-bold text-success">LONG BTC/USD</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Entry Price</span>
                  <p className="text-lg font-bold">$43,250</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Take Profit</span>
                  <p className="text-lg font-bold text-success">$46,800</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Stop Loss</span>
                  <p className="text-lg font-bold text-destructive">$41,500</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Strategy Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <Card className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-6">No-Code Strategy Builder</h3>
              
              <div className="space-y-6">
                {/* Rule 1 */}
                <div className="p-4 border border-border rounded-lg bg-card/30">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="text-xs">IF</Badge>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Indicator</label>
                        <select className="w-full bg-background border border-border rounded px-3 py-2">
                          <option>RSI crosses below</option>
                          <option>MACD crosses above</option>
                          <option>Price breaks</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Value</label>
                        <input type="number" defaultValue="30" className="w-full bg-background border border-border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Timeframe</label>
                        <select className="w-full bg-background border border-border rounded px-3 py-2">
                          <option>15m</option>
                          <option>1h</option>
                          <option>4h</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-start gap-4">
                    <Badge className="text-xs bg-primary">THEN</Badge>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Action</label>
                        <select className="w-full bg-background border border-border rounded px-3 py-2">
                          <option>Open Long</option>
                          <option>Open Short</option>
                          <option>Close Position</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Size</label>
                        <input type="number" defaultValue="1000" placeholder="USDC" className="w-full bg-background border border-border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Leverage</label>
                        <input type="number" defaultValue="5" min="1" max="50" className="w-full bg-background border border-border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Stop Loss %</label>
                        <input type="number" defaultValue="2" className="w-full bg-background border border-border rounded px-3 py-2" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">+ Add Rule</Button>
                  <Button className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Backtest Strategy
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Bot className="h-4 w-4" />
                    Deploy Bot
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Backtesting Tab */}
          <TabsContent value="backtest">
            <Card className="glass-panel p-6 text-center py-20">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Backtesting Engine</h3>
              <p className="text-muted-foreground mb-4">
                Test your strategies against historical data before deploying
              </p>
              <Button>Run Your First Backtest</Button>
            </Card>
          </TabsContent>

          {/* My Strategies Tab */}
          <TabsContent value="strategies">
            <Card className="glass-panel p-6 text-center py-20">
              <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Active Strategies</h3>
              <p className="text-muted-foreground mb-4">
                Create and deploy your first automated trading bot
              </p>
              <Button>Build Strategy</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AIHub;
