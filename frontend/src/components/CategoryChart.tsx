import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import type { SummaryCategory } from "../types";
  
  interface Props {
    categories: SummaryCategory[];
  }
  
  export function CategoryChart({ categories }: Props) {
    if (!categories.length) {
      return (
        <div className="card mt-4">
          <div className="card-label mb-2">Spending by Category</div>
          <p className="text-sm text-slate-400">No data yet. Add a transaction.</p>
        </div>
      );
    }
  
    const data = categories
      .filter((c) => c.type !== "income")
      .map((c) => ({
        name: c.name,
        spent: Math.abs(c.spent),
        budget: c.budget,
      }));
  
    return (
      <div className="card mt-4 h-72">
        <div className="card-label mb-2">Spending by Category</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
            <XAxis dataKey="name" angle={-20} textAnchor="end" height={50} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spent" name="Spent" />
            <Bar dataKey="budget" name="Budget" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  