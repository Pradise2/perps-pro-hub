import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Gift, CheckCircle, Lock } from "lucide-react";

const Rewards = () => {
  const quests = [
    { id: 1, title: "Trade $10,000 Volume", reward: 50, progress: 75, completed: false },
    { id: 2, title: "Open 5 Positions", reward: 25, progress: 100, completed: true },
    { id: 3, title: "Provide Liquidity", reward: 100, progress: 0, completed: false },
  ];

  const rewards = [
    { id: 1, name: "Gold Trader Badge", cost: 500, type: "badge", locked: false },
    { id: 2, name: "100 PERP Tokens", cost: 1000, type: "token", locked: false },
    { id: 3, name: "Exclusive NFT", cost: 2500, type: "nft", locked: true },
    { id: 4, name: "VIP Support Access", cost: 5000, type: "perk", locked: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            My Rewards & Loyalty
          </h1>
          <p className="text-muted-foreground">
            Earn XP, climb ranks, and unlock exclusive benefits
          </p>
        </div>

        {/* User Rank & Status */}
        <Card className="glass-panel p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Current Rank</span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
                    Gold Trader
                  </h3>
                  <p className="text-sm text-muted-foreground">Level 3</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Experience Points</span>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">2,450</span>
                  <span className="text-muted-foreground">/ 5,000 XP</span>
                </div>
                <Progress value={49} className="h-2" />
                <p className="text-xs text-muted-foreground">2,550 XP to Platinum rank</p>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Active Perks</span>
              <div className="space-y-2">
                <Badge className="bg-success/20 text-success flex items-center gap-1 w-fit">
                  <Zap className="h-3 w-3" />
                  -15% Trading Fees
                </Badge>
                <Badge className="bg-primary/20 text-primary flex items-center gap-1 w-fit">
                  <Star className="h-3 w-3" />
                  +10% LP APR Boost
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Quests */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Daily Quests
            </h2>
            <div className="space-y-3">
              {quests.map((quest) => (
                <Card key={quest.id} className="glass-panel p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{quest.title}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="h-3 w-3 text-primary" />
                        <span className="text-primary font-semibold">+{quest.reward} XP</span>
                      </div>
                    </div>
                    {quest.completed ? (
                      <Badge className="bg-success/20 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{quest.progress}%</span>
                    )}
                  </div>
                  <Progress value={quest.progress} className="h-2" />
                </Card>
              ))}
            </div>
          </div>

          {/* Rewards Store */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary" />
              Rewards Store
            </h2>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className={`glass-panel p-4 ${reward.locked ? "opacity-60" : "hover:border-primary/30 transition-smooth"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        {reward.locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Star className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{reward.name}</h4>
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="text-primary font-semibold">{reward.cost} XP</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" disabled={reward.locked}>
                      {reward.locked ? "Locked" : "Redeem"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
