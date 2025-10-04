import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";

const Governance = () => {
  const proposals = [
    {
      id: 1,
      title: "Reduce Trading Fees by 20%",
      status: "voting",
      endsIn: "2 days",
      votesFor: 45000,
      votesAgainst: 12000,
      description: "Proposal to reduce trading fees from 0.1% to 0.08% to increase competitiveness",
    },
    {
      id: 2,
      title: "Add New Collateral Assets (LINK, UNI)",
      status: "voting",
      endsIn: "5 days",
      votesFor: 32000,
      votesAgainst: 8500,
      description: "Enable LINK and UNI as collateral options with 80% weight",
    },
    {
      id: 3,
      title: "Increase Insurance Fund Allocation",
      status: "passed",
      endsIn: "-",
      votesFor: 58000,
      votesAgainst: 5200,
      description: "Allocate 15% of trading fees to insurance fund (up from 10%)",
    },
    {
      id: 4,
      title: "Launch Options Trading",
      status: "failed",
      endsIn: "-",
      votesFor: 18000,
      votesAgainst: 42000,
      description: "Introduce decentralized options trading for major assets",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "voting":
        return <Badge className="bg-primary/20 text-primary flex items-center gap-1"><Clock className="h-3 w-3" />Voting</Badge>;
      case "passed":
        return <Badge className="bg-success/20 text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" />Passed</Badge>;
      case "failed":
        return <Badge className="bg-destructive/20 text-destructive flex items-center gap-1"><XCircle className="h-3 w-3" />Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Vote className="h-10 w-10 text-primary" />
            Governance Portal
          </h1>
          <p className="text-muted-foreground">
            Shape the future of FuturesX through community-driven governance
          </p>
        </div>

        {/* Voting Power */}
        <Card className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Your Voting Power</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">12,500</span>
                <span className="text-muted-foreground">PERP Tokens Staked</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Governance Forum
              </Button>
              <Button className="gap-2">
                Create New Proposal
              </Button>
            </div>
          </div>
        </Card>

        {/* Proposals */}
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="glass-panel p-6 hover:border-primary/30 transition-smooth">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{proposal.title}</h3>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>
                </div>
                
                {proposal.status === "voting" && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground">Ends in {proposal.endsIn}</span>
                    <Button size="sm" className="gap-2">
                      <Vote className="h-3 w-3" />
                      Vote
                    </Button>
                  </div>
                )}
              </div>

              {/* Vote Breakdown */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-success">For: {proposal.votesFor.toLocaleString()}</span>
                    <span className="text-destructive">Against: {proposal.votesAgainst.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="bg-success"
                      style={{
                        width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-destructive"
                      style={{
                        width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}% approval
                  </span>
                  <span>{(proposal.votesFor + proposal.votesAgainst).toLocaleString()} total votes</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Governance;
