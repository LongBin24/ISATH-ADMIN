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
  parentId?: string | null;
  defaultCategory?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  systemCategory?: boolean;
  ownedByCurrentUser?: boolean;
  recentTransactions?: CategoryTransaction[];
}
