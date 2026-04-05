import { useOutletContext } from "react-router-dom";
import type { Transaction } from "../logic/types";
import { useState } from "react";

type FinanceContextType = {
  transactions: Transaction[];
  updateTransaction: (id: string, tx: Transaction) => void;
};

export function Logs() {
  const { transactions, updateTransaction } =
    useOutletContext<FinanceContextType>();

  const [editing, setEditing] = useState<{
    id: string;
    field: string;
  } | null>(null);

  function isEditing(id: string, field: string) {
    return editing?.id === id && editing?.field === field;
  }

  function stopEditing() {
    setEditing(null);
  }

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Logs</h2>

      <div className="glass-card p-4 rounded-3xl w-full flex flex-col gap-3">
        <h3 className="text-xl font-medium text-black/80">
          Recent Transactions
        </h3>

        {/* Header */}
        <div className="grid grid-cols-6 text-sm text-black/50 px-2">
          <span>Title</span>
          <span>Amount</span>
          <span>Category</span>
          <span>Date</span>
          <span>Mode</span>
          <span>Account</span>
        </div>

        <div className="h-[1px] bg-black/10" />

        {/* Rows */}
        <div className="flex flex-col max-h-[300px] overflow-y-auto">
          {transactions.length === 0 && (
            <span className="text-sm text-black/50 px-2">No transactions</span>
          )}

          {transactions.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-6 px-2 py-2 hover:bg-black/5 text-sm rounded-lg">
              {/* TITLE */}
              <div onClick={() => setEditing({ id: t.id, field: "title" })}>
                {isEditing(t.id, "title") ? (
                  <input
                    autoFocus
                    value={t.title || ""}
                    onChange={(e) => {
                      const updated = {
                        ...t,
                        title: e.target.value,
                      };
                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}
                  />
                ) : (
                  t.title || "Not defined"
                )}
              </div>

              {/* AMOUNT */}
              <div
                className="font-medium"
                onClick={() => setEditing({ id: t.id, field: "amount" })}>
                {isEditing(t.id, "amount") ? (
                  <input
                    type="number"
                    autoFocus
                    value={t.amount}
                    onChange={(e) => {
                      if (e.target.value === "") return;

                      const updated = {
                        ...t,
                        amount: Number(e.target.value),
                      };

                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}
                  />
                ) : (
                  t.amount
                )}
              </div>

              {/* CATEGORY */}
              <div onClick={() => setEditing({ id: t.id, field: "category" })}>
                {isEditing(t.id, "category") ? (
                  <input
                    autoFocus
                    value={t.category || ""}
                    onChange={(e) => {
                      const updated = {
                        ...t,
                        category: e.target.value,
                      };
                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}
                  />
                ) : (
                  t.category || "Not defined"
                )}
              </div>

              {/* DATE */}
              <div onClick={() => setEditing({ id: t.id, field: "date" })}>
                {isEditing(t.id, "date") ? (
                  <input
                    type="date"
                    autoFocus
                    value={t.date}
                    onChange={(e) => {
                      const updated = {
                        ...t,
                        date: e.target.value,
                      };
                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}
                  />
                ) : (
                  t.date || "Not defined"
                )}
              </div>

              {/* MODE */}
              <div
                className={
                  t.mode === "income" ? "text-green-600" : "text-red-500"
                }
                onClick={() => setEditing({ id: t.id, field: "mode" })}>
                {isEditing(t.id, "mode") ? (
                  <select
                    autoFocus
                    value={t.mode}
                    onChange={(e) => {
                      const updated = {
                        ...t,
                        mode: e.target.value as Transaction["mode"],
                      };
                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                    <option value="transfer">transfer</option>
                  </select>
                ) : (
                  t.mode
                )}
              </div>

              {/* ACCOUNT */}
              <div onClick={() => setEditing({ id: t.id, field: "accountId" })}>
                {isEditing(t.id, "accountId") ? (
                  <input
                    autoFocus
                    value={t.accountId}
                    onChange={(e) => {
                      const updated = {
                        ...t,
                        accountId: e.target.value,
                      };
                      updateTransaction(t.id, updated);
                    }}
                    onBlur={stopEditing}
                  />
                ) : (
                  t.accountId
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
