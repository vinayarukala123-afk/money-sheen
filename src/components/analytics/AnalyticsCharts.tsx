import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
}

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export const AnalyticsCharts = ({ transactions }: AnalyticsChartsProps) => {
  // Prepare data for Income vs Expense over time
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const timeSeriesData = Object.values(monthlyData);

  // Prepare data for category breakdown
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1);
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#8b5cf6', '#06d6a0', '#f72585', '#4cc9f0', '#7209b7', '#f77f00'];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expense Bar Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Income vs Expenses</h3>
          <p className="text-muted-foreground text-sm">Monthly comparison</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="income" fill="#06d6a0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f72585" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Expense Categories</h3>
          <p className="text-muted-foreground text-sm">Spending breakdown by category</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Spending Trend Line Chart */}
      <Card className="glass-card p-6 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Spending Trend</h3>
          <p className="text-muted-foreground text-sm">Track your expense patterns over time</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#f72585" 
                strokeWidth={3}
                dot={{ fill: '#f72585', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#f72585', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#06d6a0" 
                strokeWidth={3}
                dot={{ fill: '#06d6a0', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#06d6a0', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};