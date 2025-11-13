import { api } from "./client";
import {
  type Category,
  type Transaction,
  type MonthSummary,
  type Budget,
} from "../types";

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await api.get<Transaction[]>("/transactions");
  return res.data;
}

export async function createTransaction(payload: {
  date: string;
  amount: number;
  category_id: number;
  description?: string;
}): Promise<Transaction> {
  const res = await api.post<Transaction>("/transactions", payload);
  return res.data;
}

export async function updateTransaction(
  id: number,
  payload: {
    date?: string;
    amount?: number;
    category_id?: number;
    description?: string;
  }
): Promise<Transaction> {
  const res = await api.put<Transaction>(`/transactions/${id}`, payload);
  return res.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}


export async function fetchMonthSummary(
  year: number,
  month: number
): Promise<MonthSummary> {
  const res = await api.get<MonthSummary>("/summaries/month", {
    params: { year, month },
  });
  return res.data;
}

export async function fetchBudgets(): Promise<Budget[]> {
  const res = await api.get<Budget[]>("/budgets");
  return res.data;
}
