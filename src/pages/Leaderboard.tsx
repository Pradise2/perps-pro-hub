import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const topTraders = [
  { rank: 1, address: "0x1a2b...c3d4", pnl: 125680, volume: "5.2M", winRate: 68.5 },
  { rank: 2, address: "0x5e6f...7g8h", pnl: 98234, volume: "4.1M", winRate: 64.2 },
  { rank: 3, address: "0x9i0j...1k2l", pnl: 87456, volume: "3.8M", winRate: 61.7 },
  { rank: 4, address: "0x3m4n...5o6p", pnl: 76543, volume: "3.2M", winRate: 59.4 },
  { rank: 5, address: "0x7q8r...9s0t", pnl: 65432, volume: "2.9M", winRate: 57.8 },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Top Traders
          </h1>
          <p className="text-muted-foreground">
            Compete with the best and showcase your trading skills
          </p>
        </div>

        <Card className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Rank</th>
                <th className="text-left p-4 font-medium">Trader</th>
                <th className="text-right p-4 font-medium">Total PnL</th>
                <th className="text-right p-4 font-medium">Volume</th>
                <th className="text-right p-4 font-medium">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {topTraders.map((trader) => (
                <tr
                  key={trader.rank}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20 transition-smooth",
                    trader.rank <= 3 && "bg-primary/5"
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(trader.rank)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-semibold">{trader.address}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-bold text-long text-lg">
                      +${trader.pnl.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono">${trader.volume}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-semibold text-primary">
                      {trader.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
