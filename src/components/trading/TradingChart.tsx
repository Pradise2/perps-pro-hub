import { BarChart3 } from "lucide-react";

const TradingChart = ({ marketSymbol }: { marketSymbol: string }) => {
  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">{marketSymbol}</h3>
          <span className="text-xs text-muted-foreground">TradingView Chart</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs rounded hover:bg-muted/50 transition-smooth">1m</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted/50 transition-smooth">5m</button>
          <button className="px-3 py-1 text-xs rounded bg-primary/20 text-primary">15m</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted/50 transition-smooth">1h</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted/50 transition-smooth">4h</button>
          <button className="px-3 py-1 text-xs rounded hover:bg-muted/50 transition-smooth">1D</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-chart-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="text-center z-10">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-sm">
            TradingView chart will be integrated here
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Real-time price data and technical indicators
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
