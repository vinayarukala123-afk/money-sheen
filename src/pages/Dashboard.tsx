import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { AddTransactionModal } from "@/components/dashboard/AddTransactionModal";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load initial demo data
  useEffect(() => {
    const demoTransactions: Transaction[] = [
      {
        id: '1',
        date: '2024-08-01',
        type: 'income',
        category: 'Salary',
        amount: 5000,
        description: 'Monthly salary'
      },
      {
        id: '2',
        date: '2024-08-02',
        type: 'expense',
        category: 'Food',
        amount: 45.50,
        description: 'Grocery shopping'
      },
      {
        id: '3',
        date: '2024-08-03',
        type: 'expense',
        category: 'Transportation',
        amount: 25.00,
        description: 'Gas station'
      },
      {
        id: '4',
        date: '2024-08-04',
        type: 'income',
        category: 'Freelance',
        amount: 800,
        description: 'Website development'
      }
    ];
    setTransactions(demoTransactions);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculate summary data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your financial activity
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          currentBalance={currentBalance}
        />

        {/* Transactions Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <p className="text-muted-foreground text-sm">
                Manage your income and expenses
              </p>
            </div>
            <Button 
              className="btn-gradient text-white"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          <TransactionsTable
            transactions={transactions}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
        </div>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={addTransaction}
        />

        {/* Floating Action Button */}
        <FloatingActionButton onClick={() => setShowAddModal(true)} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;