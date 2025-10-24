import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Star, TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradingContext } from "@/contexts/TradingContext";
import { Market } from "@/types/trading";
import { MarketDataLoadingState, InlineLoading } from "@/components/LoadingStates";

interface MarketsSidebarProps {
  onSelectMarket?: (market: Market) => void;
}

const MarketsSidebar = ({ onSelectMarket }: MarketsSidebarProps) => {
  const { state, actions } = useTradingContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMarkets = state.markets.filter(
    (market) =>
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMarket = (market: Market) => {
    actions.selectMarket(market);
    onSelectMarket?.(market);
  };

  const getLastUpdateTime = (timestamp?: number) => {
    if (!timestamp) return "No data";
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };


  return (
    <div className="w-full h-full flex flex-col glass-panel md:max-w-xs md:min-w-[260px]">
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h3 className="font-semibold text-base md:text-lg">Markets</h3>
          <div className="flex items-center gap-2">
            {state.connected ? (
              <div className="flex items-center gap-1 text-xs text-success">
                <Wifi className="h-4 w-4 md:h-3 md:w-3" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <WifiOff className="h-4 w-4 md:h-3 md:w-3" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border text-sm md:text-base py-2 md:py-2.5 rounded-lg"
            autoComplete="off"
            inputMode="search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.loading.markets ? (
          <MarketDataLoadingState />
        ) : (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Markets ({filteredMarkets.length})</span>
              {state.connected && (
                <span className="text-xs text-muted-foreground">
                  Updated {getLastUpdateTime(state.lastUpdate)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 md:gap-0">
              {filteredMarkets.map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => handleSelectMarket(market)}
                  className={cn(
                    "w-full px-3 py-4 md:px-4 md:py-3 flex items-center justify-between hover:bg-muted/50 transition-smooth border-l-2 rounded-lg md:rounded-none active:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary",
                    state.selectedMarket?.symbol === market.symbol
                      ? "border-l-primary bg-muted/30"
                      : "border-l-transparent"
                  )}
                  style={{ minHeight: 56, touchAction: 'manipulation' }}
                  tabIndex={0}
                  aria-label={`Select market ${market.symbol}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base md:text-sm">{market.symbol}</span>
                      {market.change24h > 0 ? (
                        <TrendingUp className="h-4 w-4 md:h-3 md:w-3 text-long" />
                      ) : (
                        <TrendingDown className="h-4 w-4 md:h-3 md:w-3 text-short" />
                      )}
                      {market.lastUpdate && Date.now() - market.lastUpdate < 5000 && (
                        <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs md:text-xs text-muted-foreground">{market.name}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-base md:text-sm font-semibold">${market.price}</span>
                    <span
                      className={cn(
                        "text-xs font-mono font-semibold",
                        market.change24h > 0 ? "text-long" : "text-short"
                      )}
                    >
                      {market.change24h > 0 ? "+" : ""}
                      {market.change24h.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {filteredMarkets.length === 0 && !state.loading.markets && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No markets found</p>
                <p className="text-xs mt-1">Try adjusting your search</p>
              </div>
            )}
          </>
        )}
        {state.errors.markets && (
          <div className="p-4 text-center">
            <p className="text-destructive text-sm">{state.errors.markets}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketsSidebar;
