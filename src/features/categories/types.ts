export interface CategoryTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
}

export interface Category {
  id: string;
  parentId?: string | null;
  parentName?: string | null;
  userId?: string | null;
  categoryKey?: string;
  name: string;
  icon: string;
  transactionCount: number;
  totalBudget: number;
  spentAmount?: number;
  type?: "expense" | "income" | "both" | string;
  color?: string;
  defaultCategory?: boolean;
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
  systemCategory?: boolean;
  ownedByCurrentUser?: boolean;
  hiddenForCurrentUser?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  recentTransactions?: CategoryTransaction[];
}
