import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { Wallet, TrendingUp, Shield, BarChart3 } from "lucide-react";

const Landing = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const features = [
    {
      icon: Wallet,
      title: "Track Expenses",
      description: "Categorize and monitor your spending habits"
    },
    {
      icon: TrendingUp,
      title: "Income Management",
      description: "Keep track of all your income sources"
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Beautiful charts and insights for your finances"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and secure"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card m-4 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              FinanceTracker
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="glass transition-smooth hover:bg-accent"
              onClick={() => handleAuth('signin')}
            >
              Sign In
            </Button>
            <Button 
              className="btn-gradient text-white font-medium"
              onClick={() => handleAuth('signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Take Control of Your Finances
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track expenses, monitor income, and gain valuable insights into your spending habits 
            with our beautiful and intuitive personal finance tracker.
          </p>

          <div className="flex justify-center space-x-4 mb-16">
            <Button 
              size="lg" 
              className="btn-gradient text-white font-medium px-8"
              onClick={() => handleAuth('signup')}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="glass transition-smooth hover:bg-accent"
              onClick={() => handleAuth('signin')}
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 transition-smooth hover:scale-105">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
      />
    </div>
  );
};

export default Landing;