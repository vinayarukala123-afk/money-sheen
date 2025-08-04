import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
}

export const SummaryCards = ({ totalIncome, totalExpenses, currentBalance }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income */}
      <Card className="glass-card p-6 transition-smooth hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-success/20 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-success text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>This month</span>
        </div>
      </Card>

      {/* Total Expenses */}
      <Card className="glass-card p-6 transition-smooth hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="bg-destructive/20 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-destructive text-sm">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>This month</span>
        </div>
      </Card>

      {/* Current Balance */}
      <Card className="glass-card p-6 transition-smooth hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
            <p className={`text-2xl font-bold ${
              currentBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {formatCurrency(currentBalance)}
            </p>
          </div>
          <div className="bg-primary/20 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-muted-foreground text-sm">
          <span>{currentBalance >= 0 ? 'Available' : 'Deficit'} balance</span>
        </div>
      </Card>
    </div>
  );
};