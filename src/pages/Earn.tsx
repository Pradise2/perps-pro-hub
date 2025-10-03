import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Droplet, Lock } from "lucide-react";

const Earn = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Earn Yield
          </h1>
          <p className="text-muted-foreground">
            Provide liquidity and earn trading fees, funding rates, and platform incentives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-long-bg">
                <Droplet className="h-6 w-6 text-long" />
              </div>
              <div>
                <h3 className="font-semibold">USDC Pool</h3>
                <p className="text-xs text-muted-foreground">Stablecoin Liquidity</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current APR</span>
                <span className="text-lg font-bold font-mono text-long">12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">TVL</span>
                <span className="font-mono font-semibold">$250M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Stake</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>

            <Button className="w-full">Deposit</Button>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">BTC Pool</h3>
                <p className="text-xs text-muted-foreground">Bitcoin Liquidity</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current APR</span>
                <span className="text-lg font-bold font-mono text-long">18.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">TVL</span>
                <span className="font-mono font-semibold">$120M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Stake</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>

            <Button className="w-full">Deposit</Button>
          </Card>

          <Card className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Lock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">ETH Pool</h3>
                <p className="text-xs text-muted-foreground">Ethereum Liquidity</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current APR</span>
                <span className="text-lg font-bold font-mono text-long">15.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">TVL</span>
                <span className="font-mono font-semibold">$80M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Stake</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>

            <Button className="w-full">Deposit</Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Earn;
