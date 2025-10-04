import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketsSidebar from "@/components/trading/MarketsSidebar";
import TradingChart from "@/components/trading/TradingChart";
import OrderPanel from "@/components/trading/OrderPanel";
import PositionsTable from "@/components/trading/PositionsTable";

const Index = () => {
  const [selectedMarket, setSelectedMarket] = useState({ symbol: "BTC-PERP", name: "Bitcoin" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-border overflow-hidden">
          <MarketsSidebar onSelectMarket={(market) => setSelectedMarket(market)} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
            <div className="lg:col-span-2 min-h-[500px]">
              <TradingChart marketSymbol={selectedMarket.symbol} />
            </div>
            
            <div className="min-h-[500px]">
              <OrderPanel />
            </div>
          </div>

          <div className="h-80 border-t border-border">
            <PositionsTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
