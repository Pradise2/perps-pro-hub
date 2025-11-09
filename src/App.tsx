import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TradingProvider } from "@/contexts/TradingContext";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ComponentFallback } from "@/components/LazyLoading";

// Lazily import all page components
const Index = lazy(() => import("./pages/Index"));
const Spot = lazy(() => import("./pages/Spot"));
const Options = lazy(() => import("./pages/Options"));
const Earn = lazy(() => import("./pages/Earn"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Stats = lazy(() => import("./pages/Stats"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AIHub = lazy(() => import("./pages/AIHub"));
const Governance = lazy(() => import("./pages/Governance"));
const Rewards = lazy(() => import("./pages/Rewards"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TradingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<ComponentFallback title="Loading Page..." height="h-screen" />}>
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
          </Suspense>
        </BrowserRouter>
        <PerformanceMonitor />
      </TooltipProvider>
    </TradingProvider>
  </QueryClientProvider>
);

export default App;
