import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  year: number;
  month: number;
}

export function SavingsOverview({ transactions, loading, year, month }: Props) {
  const savingsByCategory = new Map<string, number>();
  const monthlySavings = new Map<
    string,
    { label: string; amount: number }
  >();

  transactions.forEach((tx) => {
    const categoryName = tx.category?.name ?? "Savings";
    savingsByCategory.set(
      categoryName,
      (savingsByCategory.get(categoryName) ?? 0) + Math.abs(tx.amount)
    );

    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    if (!monthlySavings.has(key)) {
      monthlySavings.set(key, { label, amount: 0 });
    }
    monthlySavings.get(key)!.amount += Math.abs(tx.amount);
  });

  const totalSaved = Array.from(savingsByCategory.values()).reduce(
    (acc, value) => acc + value,
    0
  );
  const categoryBreakdown = Array.from(savingsByCategory.entries()).map(
    ([name, amount]) => ({
      name,
      amount,
    })
  );

  const monthlyData = Array.from(monthlySavings.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([, value]) => value);

  if (!loading && transactions.length === 0) {
    return (
      <div className="card mt-4">
        <div className="card-label mb-2">Savings</div>
        <p className="text-sm text-slate-400">
          No savings transactions yet for {String(month).padStart(2, "0")}/{year}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card mt-4">
        <div className="card-label mb-2">Total Savings</div>
        <div className="card-value">{totalSaved.toLocaleString(undefined, { style: "currency", currency: "ILS" })}</div>
        <p className="text-sm text-slate-400 mt-1">
          Based on savings transactions recorded in the system.
        </p>
      </div>

      <div className="card mt-4 h-72">
        <div className="card-label mb-2">Savings Trend</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#savingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <div className="card-label mb-2">Savings Breakdown</div>
        <table className="w-full text-sm text-center">
          <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wide">
            <tr>
              <th className="py-2">Category</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {categoryBreakdown.map((row) => (
              <tr key={row.name} className="border-b border-slate-900/20">
                <td className="py-3">{row.name}</td>
                <td className="py-3">
                  {row.amount.toLocaleString(undefined, {
                    style: "currency",
                    currency: "ILS",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

