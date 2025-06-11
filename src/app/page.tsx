"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: {
    id: string;
    name: string;
  };
};

type Budget = {
  id: string;
  amount: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [budgets, setBudgets] = useState<Budget[]>([]);

  type FormState = {
    amount: string;
    description: string;
    date: string;
    categoryId: string;
  };

  const [form, setForm] = useState<FormState>({
    amount: "",
    description: "",
    date: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };
  const fetchBudgets = async () => {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data as Budget[]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.date || !form.categoryId)
      return alert("All fields are required");

    setLoading(true);

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        categoryId: form.categoryId,
      }),
    });

    setForm({ amount: "", description: "", date: "", categoryId: "" });
    await fetchTransactions();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    await fetchTransactions();
    setLoading(false);
  };

  const getMonthlyTotals = () => {
    const monthMap: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthMap[month] = (monthMap[month] || 0) + tx.amount;
    });
    return Object.entries(monthMap).map(([month, total]) => ({ month, total }));
  };

  const getCategoryTotals = () => {
    const categoryMap: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      const name = tx.category?.name || "Uncategorized";
      categoryMap[name] = (categoryMap[name] || 0) + tx.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const COLORS = [
    "#4ade80",
    "#60a5fa",
    "#facc15",
    "#f87171",
    "#c084fc",
    "#34d399",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Tracker</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded-lg shadow bg-white"
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">All Transactions</h2>
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-gray-500">
                  ₹{tx.amount} on {new Date(tx.date).toLocaleDateString()}
                  {tx.category?.name && ` | ${tx.category.name}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-red-600 hover:underline text-sm"
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Monthly Expense Chart</h2>
        <div className="bg-white rounded shadow p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getMonthlyTotals()}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Category-wise Spending</h2>
        <div className="bg-white rounded shadow p-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryTotals()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {getCategoryTotals().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-10">Set Category Budgets</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const categoryId = e.currentTarget.category.value;
          const amount = e.currentTarget.amount.value;

          await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, amount }),
          });

          e.currentTarget.reset();
          await fetchBudgets();
        }}
        className="space-y-4 mt-4 border p-4 rounded bg-white shadow"
      >
        <select name="category" required className="w-full p-2 border rounded">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Budget Amount"
          required
          className="w-full p-2 border rounded"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Save Budget
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Budget vs Spending</h3>
      <ul className="mt-2 space-y-2">
        {budgets.map((budget) => {
          const totalSpent = transactions
            .filter((tx) => tx.categoryId === budget.categoryId)
            .reduce((sum, tx) => sum + tx.amount, 0);

          const isOver = totalSpent > budget.amount;

          return (
            <li key={budget.id} className="p-3 border rounded bg-white shadow">
              <p>
                <strong>{budget.category.name}</strong>: ₹{totalSpent} spent / ₹
                {budget.amount} budget
                {isOver && (
                  <span className="text-red-600 ml-2">Over budget ⚠️</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
