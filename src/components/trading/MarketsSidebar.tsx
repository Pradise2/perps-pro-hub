import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Star, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Market {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  volume24h: string;
  isFavorite?: boolean;
}

const markets: Market[] = [
  { symbol: "BTC-PERP", name: "Bitcoin", price: "43,250.50", change24h: 2.45, volume24h: "2.5B" },
  { symbol: "ETH-PERP", name: "Ethereum", price: "2,287.30", change24h: 3.12, volume24h: "1.2B" },
  { symbol: "SOL-PERP", name: "Solana", price: "98.45", change24h: -1.23, volume24h: "450M" },
  { symbol: "ARB-PERP", name: "Arbitrum", price: "1.87", change24h: 5.67, volume24h: "180M" },
  { symbol: "AVAX-PERP", name: "Avalanche", price: "35.21", change24h: 1.89, volume24h: "220M" },
  { symbol: "MATIC-PERP", name: "Polygon", price: "0.92", change24h: -2.34, volume24h: "120M" },
];

const MarketsSidebar = ({ onSelectMarket }: { onSelectMarket: (market: Market) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);

  const filteredMarkets = markets.filter(
    (market) =>
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
    onSelectMarket(market);
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Markets
        </div>
        
        {filteredMarkets.map((market) => (
          <button
            key={market.symbol}
            onClick={() => handleSelectMarket(market)}
            className={cn(
              "w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-smooth border-l-2",
              selectedMarket.symbol === market.symbol
                ? "border-l-primary bg-muted/30"
                : "border-l-transparent"
            )}
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{market.symbol}</span>
                {market.change24h > 0 ? (
                  <TrendingUp className="h-3 w-3 text-long" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-short" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{market.name}</span>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm font-semibold">${market.price}</span>
              <span
                className={cn(
                  "text-xs font-mono font-semibold",
                  market.change24h > 0 ? "text-long" : "text-short"
                )}
              >
                {market.change24h > 0 ? "+" : ""}
                {market.change24h}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarketsSidebar;
