import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  monthly: Array<{
    label: string;
    income: number;
    expenses: number;
    net: number;
    savings: number;
  }>;
  loading: boolean;
  totalTransactions: number;
}

export function MonthlySummaryPanel({ monthly, loading, totalTransactions }: Props) {
  if (!loading && monthly.length === 0) {
    return (
      <div className="card mt-4">
        <div className="card-label mb-2">Monthly Summary</div>
        <p className="text-sm text-slate-400">No transactions recorded yet.</p>
      </div>
    );
  }

  const totals = monthly.reduce(
    (acc, curr) => {
      acc.income += curr.income;
      acc.expenses += curr.expenses;
      acc.savings += curr.savings;
      acc.net += curr.net;
      return acc;
    },
    { income: 0, expenses: 0, savings: 0, net: 0 }
  );

  return (
    <>
      <div className="card mt-4">
        <div className="card-label mb-2">Activity Summary</div>
        <div className="summary-grid">
          <div>
            <div className="metric-label">Total Transactions</div>
            <div className="metric-value">{totalTransactions.toLocaleString()}</div>
          </div>
          <div>
            <div className="metric-label">Total Income</div>
            <div className="metric-value positive">
              {totals.income.toLocaleString(undefined, {
                style: "currency",
                currency: "ILS",
              })}
            </div>
          </div>
          <div>
            <div className="metric-label">Total Expenses</div>
            <div className="metric-value negative">
              {totals.expenses.toLocaleString(undefined, {
                style: "currency",
                currency: "ILS",
              })}
            </div>
          </div>
          <div>
            <div className="metric-label">Net</div>
            <div className={`metric-value ${totals.net >= 0 ? "positive" : "negative"}`}>
              {totals.net.toLocaleString(undefined, { style: "currency", currency: "ILS" })}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 h-80">
        <div className="card-label mb-2">Monthly Trends</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#fb7185" />
            <Line type="monotone" dataKey="savings" name="Savings" stroke="#38bdf8" />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="#facc15"
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <div className="card-label mb-2">Monthly Breakdown</div>
        <table className="w-full text-sm text-center">
          <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wide">
            <tr>
              <th className="py-2">Month</th>
              <th className="py-2">Income</th>
              <th className="py-2">Expenses</th>
              <th className="py-2">Savings</th>
              <th className="py-2">Net</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr key={row.label} className="border-b border-slate-900/20">
                <td className="py-3">{row.label}</td>
                <td className="py-3 positive">
                  {row.income.toLocaleString(undefined, {
                    style: "currency",
                    currency: "ILS",
                  })}
                </td>
                <td className="py-3 negative">
                  {row.expenses.toLocaleString(undefined, {
                    style: "currency",
                    currency: "ILS",
                  })}
                </td>
                <td className="py-3 text-slate-200">
                  {row.savings.toLocaleString(undefined, {
                    style: "currency",
                    currency: "ILS",
                  })}
                </td>
                <td className={`py-3 ${row.net >= 0 ? "positive" : "negative"}`}>
                  {row.net.toLocaleString(undefined, {
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

