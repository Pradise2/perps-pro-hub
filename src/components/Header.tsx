import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, Wallet, ChevronDown, User, Trophy, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const tradeLinks = [
    { path: "/", label: "Futures" },
    { path: "/spot", label: "Spot" },
    { path: "/options", label: "Options" },
  ];
  
  const navLinks = [
    { path: "/earn", label: "Earn" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/ai-hub", label: "AI Hub" },
    { path: "/stats", label: "Stats" },
    { path: "/governance", label: "Governance" },
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isActive("/") || isActive("/spot") || isActive("/options") ? "default" : "ghost"}
                  size="sm"
                  className="transition-smooth gap-1"
                >
                  Trade <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border z-50">
                {tradeLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
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

          <ThemeToggle />
          
          <Button className="gap-2 transition-smooth hover:scale-105">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">0x7a3...</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border z-50">
              <DropdownMenuItem asChild>
                <Link to="/rewards" className="cursor-pointer flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  My Rewards & Loyalty
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/portfolio" className="cursor-pointer flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet Info
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
