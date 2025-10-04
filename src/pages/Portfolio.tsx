import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, TrendingDown, DollarSign, Shield } from "lucide-react";

const Portfolio = () => {
  const assets = [
    { symbol: "USDC", balance: "10,000", value: "$10,000", yield: "4.5%", weight: "100%", isCollateral: true },
    { symbol: "stETH", balance: "5.2", value: "$9,750", yield: "3.8%", weight: "90%", isCollateral: true },
    { symbol: "WBTC", balance: "0.15", value: "$6,450", yield: "0%", weight: "85%", isCollateral: false },
    { symbol: "ARB", balance: "2,500", value: "$2,850", yield: "0%", weight: "75%", isCollateral: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Portfolio & Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your assets, collateral, and capital efficiency
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <div className="text-3xl font-bold">$29,050</div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Used as Margin</span>
            </div>
            <div className="text-3xl font-bold">$12,300</div>
            <div className="text-xs text-muted-foreground mt-1">42% utilized</div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Available Margin</span>
            </div>
            <div className="text-3xl font-bold text-success">$16,750</div>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Unrealized PnL</span>
            </div>
            <div className="text-3xl font-bold text-success">+$1,250</div>
            <div className="text-xs text-success mt-1">+4.5%</div>
          </Card>
        </div>

        {/* Asset Balances & Collateral Status */}
        <Card className="glass-panel mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Asset Balances & Collateral Status</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Asset</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Balance</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Value</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Yield (APR)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Collateral Weight</th>
                  <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">As Collateral?</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={asset.symbol} className="border-b border-border/50 hover:bg-muted/20 transition-smooth">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{asset.symbol.slice(0, 1)}</span>
                        </div>
                        <span className="font-semibold">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">{asset.balance}</td>
                    <td className="px-6 py-4 font-semibold">{asset.value}</td>
                    <td className="px-6 py-4">
                      {asset.yield !== "0%" ? (
                        <span className="text-success font-semibold flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {asset.yield}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-semibold">
                        {asset.weight}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Switch checked={asset.isCollateral} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Deposit
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            Withdraw
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Manage Collateral
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            Fiat On/Off-Ramp
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
