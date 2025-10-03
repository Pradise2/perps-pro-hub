import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Trade" },
    { path: "/earn", label: "Earn" },
    { path: "/stats", label: "Stats" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <TrendingUp className="h-7 w-7 text-primary transition-smooth group-hover:scale-110" />
              <div className="absolute inset-0 blur-md opacity-50 bg-primary rounded-full" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FuturesX
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className="transition-smooth"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 text-sm font-mono">
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground text-xs">24h Volume</span>
              <span className="text-foreground font-semibold">$1.2B</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground text-xs">TVL</span>
              <span className="text-foreground font-semibold">$450M</span>
            </div>
          </div>
          
          <Button className="gap-2 transition-smooth hover:scale-105">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
