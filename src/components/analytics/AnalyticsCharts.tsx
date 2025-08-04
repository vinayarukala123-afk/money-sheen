import { Card } from "@/components/ui/card";

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

  const timeSeriesData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month + ' 01');
    const dateB = new Date(b.month + ' 01');
    return dateA.getTime() - dateB.getTime();
  });

  const maxValue = Math.max(...timeSeriesData.flatMap(d => [d.income, d.expense]), 1);

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

  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ['#8b5cf6', '#06d6a0', '#f72585', '#4cc9f0', '#7209b7', '#f77f00'];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  // Create pie chart gradient
  const createPieGradient = () => {
    if (pieData.length === 0) return 'conic-gradient(#gray 0deg 360deg)';
    
    let angle = 0;
    const segments = pieData.map((item, index) => {
      const percentage = (item.value / totalExpenses) * 100;
      const startAngle = angle;
      const endAngle = angle + (percentage * 3.6);
      angle = endAngle;
      
      const color = COLORS[index % COLORS.length];
      return `${color} ${startAngle}deg ${endAngle}deg`;
    });
    
    return `conic-gradient(${segments.join(', ')})`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expense Bar Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Income vs Expenses</h3>
          <p className="text-muted-foreground text-sm">Monthly comparison</p>
        </div>
        <div className="h-80 flex items-end justify-around space-x-2 px-4">
          {timeSeriesData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-end space-x-1 h-60">
                {/* Income Bar */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-success to-success-glow rounded-t transition-smooth"
                    style={{
                      height: `${(data.income / maxValue) * 200}px`,
                      minHeight: data.income > 0 ? '4px' : '0px'
                    }}
                  />
                  <span className="text-xs text-success mt-1 font-medium">
                    ${data.income.toLocaleString()}
                  </span>
                </div>
                {/* Expense Bar */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-destructive to-destructive-glow rounded-t transition-smooth"
                    style={{
                      height: `${(data.expense / maxValue) * 200}px`,
                      minHeight: data.expense > 0 ? '4px' : '0px'
                    }}
                  />
                  <span className="text-xs text-destructive mt-1 font-medium">
                    ${data.expense.toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {data.month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-success to-success-glow rounded"></div>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-destructive to-destructive-glow rounded"></div>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Expense Categories</h3>
          <p className="text-muted-foreground text-sm">Spending breakdown by category</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Simple donut chart using conic-gradient */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: createPieGradient()
              }}
            />
            <div className="absolute inset-6 bg-card rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">{formatCurrency(totalExpenses)}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((item, index) => {
            const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Spending Trend Line Chart */}
      <Card className="glass-card p-6 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Spending Trend</h3>
          <p className="text-muted-foreground text-sm">Track your expense patterns over time</p>
        </div>
        <div className="h-80 flex items-end justify-around space-x-4 px-4">
          {timeSeriesData.map((data, index) => {
            const prevData = timeSeriesData[index - 1];
            const isIncreasing = prevData ? data.expense > prevData.expense : false;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="flex flex-col items-center h-60 justify-end">
                  {/* Line point */}
                  <div className="relative">
                    <div
                      className="w-3 h-3 bg-primary rounded-full shadow-lg"
                      style={{
                        marginBottom: `${(data.expense / maxValue) * 200}px`
                      }}
                    />
                    {/* Trend indicator */}
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs ${
                      isIncreasing ? 'text-destructive' : 'text-success'
                    }`}>
                      {isIncreasing ? '↗' : '↘'}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground font-medium block">
                      ${data.expense.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {data.month}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Expense Trend</span>
          </div>
        </div>
      </Card>
    </div>
  );
};