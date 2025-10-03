import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

const Stats = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Platform Statistics
          </h1>
          <p className="text-muted-foreground">
            Real-time analytics and market insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold font-mono">$1.2B</p>
              </div>
            </div>
            <p className="text-xs text-long">+15.3% from yesterday</p>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-long-bg">
                <TrendingUp className="h-6 w-6 text-long" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">TVL</p>
                <p className="text-2xl font-bold font-mono">$450M</p>
              </div>
            </div>
            <p className="text-xs text-long">+8.7% from last week</p>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Traders</p>
                <p className="text-2xl font-bold font-mono">12,845</p>
              </div>
            </div>
            <p className="text-xs text-long">+22.1% from last month</p>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-muted">
                <BarChart3 className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open Interest</p>
                <p className="text-2xl font-bold font-mono">$320M</p>
              </div>
            </div>
            <p className="text-xs text-short">-3.2% from yesterday</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Volume by Market</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Interactive chart coming soon</p>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Funding Rate History</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Interactive chart coming soon</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Stats;
