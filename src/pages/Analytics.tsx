import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, TrendingUp, PieChart } from "lucide-react";

// Mock data - in real app this would come from your transaction store
const mockTransactions = [
  { id: '1', date: '2024-08-01', type: 'income' as const, category: 'salary', amount: 5000, description: 'Monthly salary' },
  { id: '2', date: '2024-08-02', type: 'expense' as const, category: 'food', amount: 45.50, description: 'Grocery shopping' },
  { id: '3', date: '2024-08-03', type: 'expense' as const, category: 'transportation', amount: 25.00, description: 'Gas station' },
  { id: '4', date: '2024-08-04', type: 'income' as const, category: 'freelance', amount: 800, description: 'Website development' },
  { id: '5', date: '2024-07-15', type: 'expense' as const, category: 'food', amount: 120, description: 'Restaurant' },
  { id: '6', date: '2024-07-20', type: 'expense' as const, category: 'entertainment', amount: 50, description: 'Movie tickets' },
  { id: '7', date: '2024-07-25', type: 'income' as const, category: 'salary', amount: 5000, description: 'Monthly salary' },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [transactions, setTransactions] = useState(mockTransactions);

  useEffect(() => {
    // In real app, load transactions from storage/API based on timeRange
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const parsedTransactions = JSON.parse(stored);
        setTransactions([...mockTransactions, ...parsedTransactions]);
      } catch (error) {
        console.error('Error parsing stored transactions:', error);
      }
    }
  }, [timeRange]);

  // Filter transactions based on time range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return transactionDate >= cutoffDate;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Visual insights into your financial data
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="glass w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="glass-card border border-card-border">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Period Income</p>
                <p className="text-2xl font-bold text-success">
                  ${totalIncome.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Period Expenses</p>
                <p className="text-2xl font-bold text-destructive">
                  ${totalExpenses.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive rotate-180" />
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Flow</p>
                <p className={`text-2xl font-bold ${
                  (totalIncome - totalExpenses) >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  ${(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <AnalyticsCharts transactions={filteredTransactions} />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;