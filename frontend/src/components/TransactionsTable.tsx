import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  });
}

export function TransactionsTable({ transactions, onEdit, onDelete }: Props) {
  if (!transactions.length) {
    return (
      <div className="card mt-4">
        <div className="card-label mb-2">Recent Transactions</div>
        <p className="text-sm text-slate-400">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="card mt-4 overflow-x-auto text-center">
      <div className="card-label mb-4 text-center">Recent Transactions</div>
      <table className="w-full max-w-3xl mx-auto text-sm text-center table-fixed">
        <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wide">
          <tr>
            <th className="py-2 text-center">Date</th>
            <th className="py-2 text-center">Category</th>
            <th className="py-2 text-center">Amount</th>
            <th className="py-2 text-center">Description</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => (
            <tr
              key={t.id}
              className={`border-slate-900/20 hover:bg-slate-900/30 transition-colors ${
                idx !== transactions.length - 1 ? "border-b" : ""
              }`}
            >
              <td className="py-3 text-center">
                {new Date(t.date).toLocaleDateString("en-GB")}
              </td>
              <td className="py-3 text-center">{t.category?.name}</td>
              <td
                className={`py-3 text-center ${
                  t.amount < 0 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {formatCurrency(t.amount)}
              </td>
              <td className="py-3 text-center">{t.description}</td>
              <td className="py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="btn-secondary"
                    style={{ paddingInline: "0.6rem" }}
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ paddingInline: "0.6rem" }}
                    onClick={() => onDelete(t)}
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
