import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, BarChart3, Trophy } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { path: "/", label: "Trade", icon: TrendingUp },
    { path: "/earn", label: "Earn", icon: DollarSign },
    { path: "/stats", label: "Stats", icon: BarChart3 },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-1.5"
            >
              {link.label}
              <link.icon className="h-4 w-4 text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
