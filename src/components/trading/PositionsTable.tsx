import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Edit, Share2, TrendingUp, TrendingDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradingContext } from "@/contexts/TradingContext";
import { VirtualizedTable, useVirtualizedData } from "@/components/VirtualizedTable";
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/usePerformance";
import { Position } from "@/types/trading";

const PositionsTable = () => {
  const { state, actions } = useTradingContext();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleClosePosition = useCallback((positionId: string) => {
    actions.removePosition(positionId);
  }, [actions]);

  // Filter function for positions search
  const positionFilterFn = useCallback((position: Position, query: string) => {
    return position.market.toLowerCase().includes(query.toLowerCase());
  }, []);

  // Sort function for positions (by PnL descending)
  const positionSortFn = useCallback((a: Position, b: Position) => {
    return b.pnl - a.pnl;
  }, []);

  // Process positions data for virtualization
  const filteredPositions = useVirtualizedData(
    state.positions,
    debouncedSearch,
    positionFilterFn,
    positionSortFn
  );

  // Columns definition for positions table
  const positionsColumns = useMemo(() => [
    {
      key: 'market',
      header: 'Market',
      width: 120,
      render: (position: Position, index: number) => (
        <span className="font-semibold">{position.market}</span>
      )
    },
    {
      key: 'side',
      header: 'Side',
      width: 100,
      render: (position: Position, index: number) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold",
            position.side === "long"
              ? "bg-long-bg text-long"
              : "bg-short-bg text-short"
          )}
        >
          {position.side === "long" ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {position.side.toUpperCase()}
        </span>
      )
    },
    {
      key: 'size',
      header: 'Size',
      width: 100,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <span className="font-mono">${position.size}</span>
      )
    },
    {
      key: 'leverage',
      header: 'Leverage',
      width: 80,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <span className="font-mono">{position.leverage}x</span>
      )
    },
    {
      key: 'entryPrice',
      header: 'Entry Price',
      width: 100,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <span className="font-mono">${position.entryPrice}</span>
      )
    },
    {
      key: 'currentPrice',
      header: 'Current Price',
      width: 110,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <span className="font-mono">${position.currentPrice}</span>
      )
    },
    {
      key: 'pnl',
      header: 'PnL',
      width: 120,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <div className="flex flex-col items-end">
          <span
            className={cn(
              "font-mono font-semibold",
              position.pnl >= 0 ? "text-long" : "text-short"
            )}
          >
            {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
          </span>
          <span
            className={cn(
              "text-xs font-mono",
              position.pnl >= 0 ? "text-long" : "text-short"
            )}
          >
            ({position.pnl >= 0 ? "+" : ""}
            {position.pnlPercent.toFixed(2)}%)
          </span>
        </div>
      )
    },
    {
      key: 'liquidationPrice',
      header: 'Liq. Price',
      width: 100,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <span className="font-mono text-short">${position.liquidationPrice}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 120,
      className: 'text-right',
      render: (position: Position, index: number) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-short/20 hover:text-short"
            onClick={() => handleClosePosition(position.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ], [handleClosePosition]);

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <Tabs defaultValue="positions" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-border">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger value="positions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Positions ({state.positions.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Open Orders ({state.orders.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Trade History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions" className="flex-1 m-0 flex flex-col">
          {/* Search bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Virtualized table */}
          <div className="flex-1 overflow-hidden">
            <VirtualizedTable
              data={filteredPositions}
              columns={positionsColumns}
              itemHeight={60}
              containerHeight={400}
              className="h-full"
              emptyComponent={
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p>No open positions</p>
                  <p className="text-xs mt-1">Start trading to see your positions here</p>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No open orders ({state.orders.length})</p>
            <p className="text-xs mt-1">Your pending orders will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 m-0 p-8">
          <div className="text-center text-muted-foreground">
            <p>No trade history</p>
            <p className="text-xs mt-1">Your completed trades will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsTable;
