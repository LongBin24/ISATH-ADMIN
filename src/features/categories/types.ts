export interface CategoryTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  transactionCount: number;
  totalBudget: number;
  spentAmount?: number;
  color?: string;
  type?: "expense" | "income" | string;
  recentTransactions?: CategoryTransaction[];
}
