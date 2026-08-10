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
  type?: "expense" | "income";
  color?: string;
  recentTransactions?: CategoryTransaction[];
}
