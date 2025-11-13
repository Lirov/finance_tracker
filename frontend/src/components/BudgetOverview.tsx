import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SummaryCategory } from "../types";

interface Props {
  categories: SummaryCategory[];
  year: number;
  month: number;
  loading: boolean;
}

export function BudgetOverview({ categories, year, month, loading }: Props) {
  const expenseCategories = categories.map((category) => {
    const spent = Math.abs(category.spent);
    const budget = Math.abs(category.budget);
    return {
      ...category,
      spent,
      budget,
      remaining: budget - spent,
    };
  });

  if (!loading && expenseCategories.length === 0) {
    return (
      <div className="card mt-4">
        <div className="card-label mb-2">Budgets</div>
        <p className="text-sm text-slate-400">
          No budget data for {String(month).padStart(2, "0")}/{year}. Try adding a
          budget or transactions for this month.
        </p>
      </div>
    );
  }

  const overBudget = expenseCategories.filter(
    (item) => item.budget > 0 && item.spent > item.budget
  );

  return (
    <>
      <div className="card mt-4 h-80">
        <div className="card-label mb-2">Budgets vs. Actual Spending</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expenseCategories} margin={{ top: 16, right: 16, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
            <XAxis dataKey="name" interval={0} height={60} angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" name="Budget" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="spent" name="Spent" fill="#fb7185" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <div className="card-label mb-2">Budget Details</div>
        {overBudget.length > 0 && (
          <p className="text-sm text-rose-400 mb-2">
            Heads up! {overBudget.length} {overBudget.length === 1 ? "category is" : "categories are"}{" "}
            exceeding the set budget.
          </p>
        )}
        <table className="w-full text-sm text-center">
          <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wide">
            <tr>
              <th className="py-2">Category</th>
              <th className="py-2">Budget</th>
              <th className="py-2">Spent</th>
              <th className="py-2">Remaining</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenseCategories.map((item) => {
              const status =
                item.budget === 0
                  ? "No budget"
                  : item.spent > item.budget
                  ? "Over budget"
                  : "On track";
              return (
                <tr key={item.category_id} className="border-b border-slate-900/20">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.budget.toLocaleString(undefined, { style: "currency", currency: "ILS" })}</td>
                  <td className="py-3">{item.spent.toLocaleString(undefined, { style: "currency", currency: "ILS" })}</td>
                  <td className={`py-3 ${item.remaining < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {item.remaining.toLocaleString(undefined, {
                      style: "currency",
                      currency: "ILS",
                    })}
                  </td>
                  <td className={`py-3 ${status === "Over budget" ? "text-rose-400" : "text-slate-200"}`}>
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

