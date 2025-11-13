export type CategoryType = "income" | "expense" | "saving";

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
}

export interface Transaction {
  id: number;
  date: string; // ISO string
  amount: number;
  category_id: number;
  description?: string | null;
  category: Category;
}

export interface Budget {
  id: number;
  year: number;
  month: number;
  category_id: number;
  amount: number;
}

export interface SummaryCategory {
  category_id: number;
  name: string;
  type: CategoryType;
  spent: number;
  budget: number;
  remaining: number;
}

export interface MonthSummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  net: number;
  categories: SummaryCategory[];
}
