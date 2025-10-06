import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, Trophy, FileText, Users } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { path: "/", label: "Trade", icon: TrendingUp },
    { path: "/earn", label: "Earn", icon: DollarSign },
    { path: "/stats", label: "Stats", icon: BarChart3 },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FuturesX
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized perpetual futures trading platform
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase text-foreground">Products</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2 group"
                  >
                    <link.icon className="h-5 w-5 text-primary group-hover:text-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase text-foreground">Platform</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Volume:</span>
                <span className="text-foreground font-semibold">$1.2B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVL:</span>
                <span className="text-foreground font-semibold">$450M</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 FuturesX. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-smooth">Terms</a>
            <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
            <a href="#" className="hover:text-primary transition-smooth">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
