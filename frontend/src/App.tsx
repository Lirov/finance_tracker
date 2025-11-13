import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/Layout";
import { SummaryCards } from "./components/SummaryCards";
import { CategoryChart } from "./components/CategoryChart";
import { AddTransactionForm } from "./components/AddTransactionForm";
import { TransactionsTable } from "./components/TransactionsTable";
import { BudgetOverview } from "./components/BudgetOverview";
import { SavingsOverview } from "./components/SavingsOverview";
import { MonthlySummaryPanel } from "./components/MonthlySummaryPanel";
import {
  fetchCategories,
  fetchMonthSummary,
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./api/finance";
import type {
  Category,
  MonthSummary,
  Transaction,
  SummaryCategory,
} from "./types";

function getCurrentYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function App() {
  const [{ year, month }, setYearMonth] = useState(getCurrentYearMonth());
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<MonthSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "budget" | "savings" | "summary"
  >("general");

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [cats, sum, txs] = await Promise.all([
        fetchCategories(),
        fetchMonthSummary(year, month),
        fetchTransactions(),
      ]);
      setCategories(cats);
      setSummary(sum);
      setTransactions(txs);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load data from API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  async function handleCreateTransaction(data: {
    date: string;
    amount: number;
    category_id: number;
    description?: string;
  }) {
    const tx = await createTransaction(data);
    setTransactions((prev) => [tx, ...prev]);
    const newSummary = await fetchMonthSummary(year, month);
    setSummary(newSummary);
  }

  async function handleUpdateTransaction(
    id: number,
    data: {
      date: string;
      amount: number;
      category_id: number;
      description?: string;
    }
  ) {
    const tx = await updateTransaction(id, data);
    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? tx : t))
    );
    const newSummary = await fetchMonthSummary(year, month);
    setSummary(newSummary);
    setEditing(null);
  }

  async function handleDeleteTransaction(tx: Transaction) {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(tx.id);
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    const newSummary = await fetchMonthSummary(year, month);
    setSummary(newSummary);
  }

  const handleMonthChange = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth === 0) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth === 13) {
      newMonth = 1;
      newYear += 1;
    }
    setYearMonth({ year: newYear, month: newMonth });
  };

  const monthlyAggregates = useMemo(() => {
    const map = new Map<
      string,
      { label: string; income: number; expenses: number; net: number; savings: number }
    >();

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      if (!map.has(key)) {
        map.set(key, { label, income: 0, expenses: 0, net: 0, savings: 0 });
      }
      const entry = map.get(key)!;
      if (tx.category.type === "income") {
        entry.income += tx.amount;
      } else if (tx.category.type === "expense") {
        entry.expenses += Math.abs(tx.amount);
        entry.net -= Math.abs(tx.amount);
      } else if (tx.category.type === "saving") {
        entry.savings += Math.abs(tx.amount);
      }
      entry.net += tx.amount;
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([, value]) => value);
  }, [transactions]);

  const expenseCategories: SummaryCategory[] = useMemo(
    () => summary?.categories.filter((c) => c.type !== "income") ?? [],
    [summary]
  );

  const savingTransactions = useMemo(
    () => transactions.filter((tx) => tx.category.type === "saving"),
    [transactions]
  );

  const tabContent = () => {
    if (!summary && activeTab !== "summary") {
      return null;
    }

    switch (activeTab) {
      case "general":
        return (
          <>
            {summary && (
              <>
                <SummaryCards
                  income={summary.income}
                  expenses={summary.expenses}
                  net={summary.net}
                />
                <AddTransactionForm
                  categories={categories}
                  onCreate={handleCreateTransaction}
                  onUpdate={handleUpdateTransaction}
                  editing={editing}
                  onCancelEdit={() => setEditing(null)}
                />
                <CategoryChart categories={summary.categories} />
              </>
            )}
            <TransactionsTable
              transactions={transactions.slice(0, 50)}
              onEdit={setEditing}
              onDelete={handleDeleteTransaction}
            />
          </>
        );
      case "budget":
        return (
          <BudgetOverview
            categories={expenseCategories}
            month={month}
            year={year}
            loading={loading}
          />
        );
      case "savings":
        return (
          <SavingsOverview
            transactions={savingTransactions}
            loading={loading}
            month={month}
            year={year}
          />
        );
      case "summary":
        return (
          <MonthlySummaryPanel
            monthly={monthlyAggregates}
            loading={loading}
            totalTransactions={transactions.length}
          />
        );
      default:
        return null;
    }
  };

  const monthLabel = `${month.toString().padStart(2, "0")} / ${year}`;
  const tabs = [
    { id: "general", label: "General" },
    { id: "budget", label: "Budget" },
    { id: "savings", label: "Savings" },
    { id: "summary", label: "Summary" },
  ] as const;

  return (
    <Layout>
      <div className="card mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="card-label mb-1">Selected Month</div>
          <div className="text-xl font-medium">{monthLabel}</div>
        </div>
        <div className="tab-group">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => handleMonthChange(-1)}>
            ← Prev
          </button>
          <button className="btn-secondary" onClick={() => handleMonthChange(1)}>
            Next →
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-400 mb-4">Loading…</p>}
      {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}

      {tabContent()}
    </Layout>
  );
}

export default App;
