import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Spot from "./pages/Spot";
import Options from "./pages/Options";
import Earn from "./pages/Earn";
import Portfolio from "./pages/Portfolio";
import Stats from "./pages/Stats";
import Leaderboard from "./pages/Leaderboard";
import AIHub from "./pages/AIHub";
import Governance from "./pages/Governance";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/spot" element={<Spot />} />
          <Route path="/options" element={<Options />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ai-hub" element={<AIHub />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/rewards" element={<Rewards />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
