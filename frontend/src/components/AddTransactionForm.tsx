import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { Category, Transaction } from "../types";

interface Props {
  categories: Category[];
  onCreate: (data: {
    date: string;
    amount: number;
    category_id: number;
    description?: string;
  }) => Promise<void>;
  onUpdate: (id: number, data: {
    date: string;
    amount: number;
    category_id: number;
    description?: string;
  }) => Promise<void>;
  editing: Transaction | null;
  onCancelEdit: () => void;
}

export function AddTransactionForm({
  categories,
  onCreate,
  onUpdate,
  editing,
  onCancelEdit,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === Number(categoryId)) || null,
    [categories, categoryId]
  );

  useEffect(() => {
    if (editing) {
      setDate(editing.date.slice(0, 10));
      const isExpense = editing.category?.type === "expense";
      const normalizedAmount = isExpense
        ? Math.abs(editing.amount)
        : editing.amount;
      setAmount(normalizedAmount.toString());
      setCategoryId(editing.category_id.toString());
      setDescription(editing.description || "");
    } else {
      setDate(today);
      setAmount("");
      setCategoryId("");
      setDescription("");
    }
  }, [editing, today]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount || !categoryId) return;

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return;
    }

    const normalizedDate = new Date(date).toISOString().slice(0, 10);
    const normalizedAmount =
      selectedCategory?.type === "expense"
        ? -Math.abs(parsedAmount)
        : Math.abs(parsedAmount);

    const payload = {
      date: normalizedDate,
      amount: normalizedAmount,
      category_id: Number(categoryId),
      description: description || undefined,
    };

    setLoading(true);
    try {
      if (editing) {
        await onUpdate(editing.id, payload);
      } else {
        await onCreate(payload);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card mb-4 grid gap-3 md:grid-cols-[1fr,1fr,1fr,2fr,auto,auto]"
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input"
        lang="en-GB"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount (use - for expense)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="input"
      >
        <option value="">Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.type})
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input md:col-span-1"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary md:w-auto"
      >
        {loading ? "Saving..." : editing ? "Update" : "Add"}
      </button>
      {editing && (
        <button
          type="button"
          className="btn-secondary md:w-auto"
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
