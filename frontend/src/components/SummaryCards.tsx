interface SummaryCardsProps {
    income: number;
    expenses: number;
    net: number;
  }
  
  function formatCurrency(value: number): string {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: "ILS", // change if you want
      maximumFractionDigits: 2,
    });
  }
  
  export function SummaryCards({ income, expenses, net }: SummaryCardsProps) {
    const netColor =
      net > 0 ? "text-emerald-400" : net < 0 ? "text-rose-400" : "text-slate-200";
  
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="card">
          <div className="card-label">Income</div>
          <div className="card-value text-emerald-400">
            {formatCurrency(income)}
          </div>
        </div>
  
        <div className="card">
          <div className="card-label">Expenses</div>
          <div className="card-value text-rose-400">
            {formatCurrency(expenses)}
          </div>
        </div>
  
        <div className="card">
          <div className="card-label">Net</div>
          <div className={`card-value ${netColor}`}>{formatCurrency(net)}</div>
        </div>
      </div>
    );
  }
  