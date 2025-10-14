import { useEffect, useRef, useState } from "react";
import { BarChart3, Maximize2, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/LoadingStates";

// TradingView widget configuration
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingChartProps {
  marketSymbol: string;
}

const TradingChart = ({ marketSymbol }: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState("15");

  // Load TradingView script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load TradingView script');
      setIsLoading(false);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize widget when script is loaded
  useEffect(() => {
    if (scriptLoaded && containerRef.current && window.TradingView) {
      initializeWidget();
    }
  }, [scriptLoaded, marketSymbol, timeframe]);

  const initializeWidget = () => {
    if (!containerRef.current) return;

    // Clear existing widget
    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    setIsLoading(true);

    // Map our symbols to TradingView symbols
    const symbolMap: Record<string, string> = {
      'BTC-PERP': 'BINANCE:BTCUSDT',
      'ETH-PERP': 'BINANCE:ETHUSDT',
      'SOL-PERP': 'BINANCE:SOLUSDT',
      'ARB-PERP': 'BINANCE:ARBUSDT',
      'AVAX-PERP': 'BINANCE:AVAXUSDT',
      'MATIC-PERP': 'BINANCE:MATICUSDT',
    };

    const tvSymbol = symbolMap[marketSymbol] || 'BINANCE:BTCUSDT';

    try {
      widgetRef.current = new window.TradingView.widget({
        width: '100%',
        height: '100%',
        symbol: tvSymbol,
        interval: timeframe,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: 'rgba(0, 0, 0, 0)',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: containerRef.current.id,
        studies: [
          'Volume@tv-basicstudies',
          'MACD@tv-basicstudies',
        ],
        loading_screen: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          foregroundColor: 'rgba(255, 255, 255, 0.8)'
        },
        disabled_features: [
          'use_localstorage_for_settings',
          'volume_force_overlay',
          'create_volume_indicator_by_default'
        ],
        enabled_features: [
          'study_templates',
          'side_toolbar_in_fullscreen_mode'
        ],
        overrides: {
          'paneProperties.background': '#000000',
          'paneProperties.backgroundType': 'solid',
          'mainSeriesProperties.candleStyle.upColor': '#22c55e',
          'mainSeriesProperties.candleStyle.downColor': '#ef4444',
          'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
          'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
        },
        onChartReady: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Failed to initialize TradingView widget:', error);
      setIsLoading(false);
    }
  };

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1D', value: '1D' },
  ];

  if (!scriptLoaded) {
    return (
      <div className="w-full h-full glass-panel flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">{marketSymbol}</h3>
            <span className="text-xs text-muted-foreground">Loading Chart...</span>
          </div>
        </div>
        <div className="flex-1">
          <LoadingState 
            message="Loading TradingView Chart" 
            description="Connecting to market data feed..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">{marketSymbol}</h3>
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : "Live Chart"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
            {timeframes.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeframe(value)}
                className={`px-3 py-1 text-xs rounded transition-smooth ${
                  timeframe === value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-sm">Loading chart data...</span>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef}
          id={`tradingview_${marketSymbol.replace('-', '_')}`}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default TradingChart;
