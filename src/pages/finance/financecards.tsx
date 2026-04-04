import { useState } from "react";

type SummaryData = {
  totalBalance: string;
  thisMonthIncome: string;
  thisMonthExpense: string;
  savingsPercent: string;
};
export function DashboardSummaryCard({ data }: { data: SummaryData }) {
  return (
    <div className="glass-card p-4 pt-1 pb-1 rounded-3xl w-full flex flex-col gap-2">
      <h3 className="text-xl font-medium text-black/80">Overview</h3>
      <div className="flex flex-col">
        <span className="text-sm text-black/60">Total Balance</span>
        <span className="text-3xl font-semibold">{data.totalBalance}</span>
      </div>
      <div className="h-[1px] bg-black/10" />
      <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
        <div className="flex flex-col">
          <span className="text-black/60">Income</span>
          <span className="font-medium text-green-600">
            {data.thisMonthIncome}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-black/60">Expense</span>
          <span className="font-medium text-red-500">
            {data.thisMonthExpense}
          </span>
        </div>
        <div className="flex flex-col col-span-2">
          <span className="text-black/60">Savings</span>
          <span className="font-medium">{data.savingsPercent}</span>
        </div>
      </div>
    </div>
  );
}
type CategoryItem = {
  name: string;
  value: number;
};

export function CategoriesCard({ data }: { data: CategoryItem[] }) {
  return (
    <div className="glass-card p-3 pt-1 rounded-3xl w-full flex flex-col gap-3 ">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-black/80">Categories</h3>
        <span className="text-sm text-black/50">This month</span>
      </div>

      <div className="flex flex-col h-[200px] overflow-y-auto pr-1 gap-3 -mb-52">
        {data.map((item, key) => (
          <div
            key={key}
            className="grid grid-cols-[80px_1fr_42px] items-center gap-2">
            <span className="text-lg leading-none">{item.name}</span>

            <div className="h-5 rounded-md bg-black/10 overflow-hidden">
              <div
                className="h-full bg-black/85 rounded-md"
                style={{ width: `${item.value}%` }}
              />
            </div>

            <span className="text-lg text-right tabular-nums">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
type SubscriptionItem = {
  name: string;
  amount: string;
};

export function SubscriptionsCard({ data }: { data: SubscriptionItem[] }) {
  return (
    <div className="glass-card p-3 pt-1 rounded-3xl w-full flex flex-col gap-3 ">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-black/80">Subscriptions</h3>
        <span className="text-sm text-black/50">{data.length} active</span>
      </div>
      <div className="flex flex-col h-[250px] overflow-y-scroll pr-1">
        {data.length === 0 ? (
          <span className="text-sm text-black/50">No active subscriptions</span>
        ) : (
          data.map((sub) => (
            <div
              key={sub.name}
              className="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-black/5 transition">
              <span className="text-lg">{sub.name}</span>

              <span className="font-semibold tabular-nums">{sub.amount}</span>
            </div>
          ))
        )}
      </div>

      <div className="h-[1px] bg-black/10" />

      <div className="flex justify-between items-center text-sm -mb-32">
        <span className="text-black/60">Total</span>
        <span className="font-medium">
          ₹
          {data
            .reduce((sum, item) => {
              const val = parseInt(item.amount.replace("₹", ""));
              return sum + (isNaN(val) ? 0 : val);
            }, 0)
            .toLocaleString()}
        </span>
      </div>
    </div>
  );
}

type AccountItem = {
  name: string;
  amount: string;
};

export function AccountsCard({ data }: { data: AccountItem[] }) {
  return (
    <div className="glass-card p-3 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80">Accounts</h3>
      <div className="flex flex-col h-[390px] -mb-44 overflow-y-auto pr-1 gap-2">
        {data.map((acc, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-black/5 transition">
            <span className="text-lg">{acc.name}</span>

            <span className="font-semibold tabular-nums">{acc.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickInsightCard({ insight }: { insight: string }) {
  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80">Quick Insight</h3>

      <p className="text-base text-black/70 break-words">
        {insight || "No insights available yet."}
      </p>
    </div>
  );
}

export type TransactionItem = {
  title?: string;
  amount: string;
  category?: string;
  date?: string;
  mode: "income" | "expense";
  account: string;
};

export function RecentTransactionsCard({ data }: { data: TransactionItem[] }) {
  const [rows, setRows] = useState(data);

  const [editing, setEditing] = useState<{
    row: number;
    field: keyof TransactionItem;
  } | null>(null);

  const handleChange = <K extends keyof TransactionItem>(
    rowIndex: number,
    field: K,
    value: TransactionItem[K],
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80">Recent Transactions</h3>
      <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] text-sm text-black/50 px-2">
        <span>Title</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Date</span>
        <span>Mode</span>
        <span>Account</span>
      </div>

      <div className="h-[1px] bg-black/10" />
      <div className="flex flex-col h-[390px] overflow-y-auto pr-1">
        {rows.length === 0 ? (
          <span className="text-sm text-black/50 px-2">No transactions</span>
        ) : (
          rows.map((t, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] items-center px-2 py-2 rounded-lg hover:bg-black/5 text-sm">
              {(
                [
                  "title",
                  "amount",
                  "category",
                  "date",
                  "mode",
                  "account",
                ] as (keyof TransactionItem)[]
              ).map((field) => {
                const isEditing =
                  editing?.row === i && editing?.field === field;

                const value =
                  t[field] ??
                  (field === "amount" || field === "mode" || field === "account"
                    ? ""
                    : "Not defined");

                return (
                  <div
                    key={field}
                    className={`truncate ${
                      field === "amount" ? " tabular-nums font-medium" : ""
                    } ${
                      field === "mode"
                        ? t.mode === "income"
                          ? "text-green-600"
                          : "text-red-500"
                        : ""
                    }`}
                    onClick={() => setEditing({ row: i, field })}>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={value}
                        onChange={(e) => handleChange(i, field, e.target.value)}
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditing(null);
                          }
                        }}
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    ) : (
                      value || "Not defined"
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function DetailRecentTransactionsCard({
  data,
}: {
  data: TransactionItem[];
}) {
  const [rows, setRows] = useState(data);

  const [editing, setEditing] = useState<{
    row: number;
    field: keyof TransactionItem;
  } | null>(null);

  const handleChange = <K extends keyof TransactionItem>(
    rowIndex: number,
    field: K,
    value: TransactionItem[K],
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80">Recent Transactions</h3>
      <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] text-sm text-black/50 px-2">
        <span>Title</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Date</span>
        <span>Mode</span>
        <span>Account</span>
      </div>

      <div className="h-[1px] bg-black/10" />
      <div className="flex flex-col  pr-1">
        {rows.length === 0 ? (
          <span className="text-sm text-black/50 px-2">No transactions</span>
        ) : (
          rows.map((t, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] items-center px-2 py-2 rounded-lg hover:bg-black/5 text-sm">
              {(
                [
                  "title",
                  "amount",
                  "category",
                  "date",
                  "mode",
                  "account",
                ] as (keyof TransactionItem)[]
              ).map((field) => {
                const isEditing =
                  editing?.row === i && editing?.field === field;

                const value =
                  t[field] ??
                  (field === "amount" || field === "mode" || field === "account"
                    ? ""
                    : "Not defined");

                return (
                  <div
                    key={field}
                    className={`truncate ${
                      field === "amount" ? " tabular-nums font-medium" : ""
                    } ${
                      field === "mode"
                        ? t.mode === "income"
                          ? "text-green-600"
                          : "text-red-500"
                        : ""
                    }`}
                    onClick={() => setEditing({ row: i, field })}>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={value}
                        onChange={(e) => handleChange(i, field, e.target.value)}
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditing(null);
                          }
                        }}
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    ) : (
                      value || "Not defined"
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export function DebtCard() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [count, setCount] = useState(0);

  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-4">
      {/* Name */}
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="text-xl font-medium border-b border-black/40 bg-transparent outline-none w-full"
        />
        <span className="text-lg">:</span>
      </div>

      {/* Amount */}
      <div className="glass-card px-3 py-2 rounded-xl">
        ₹{amount.toLocaleString()}
      </div>

      {/* Counter */}
      <div className="flex items-center gap-2">
        <input
          value={count}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setCount(isNaN(val) ? 0 : val);
          }}
          placeholder="enter amount"
          className="glass-card px-3 py-2 rounded-xl w-full outline-none"
        />

        <div className="flex gap-1">
          <button
            onClick={() => setAmount((a) => a + count)}
            className="glass-card px-3 py-2 rounded-l-xl hover:bg-black/10">
            +
          </button>

          <button
            onClick={() => setAmount((a) => a - count)}
            className="glass-card px-3 py-2 rounded-r-xl hover:bg-black/10">
            -
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddNewCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-4 rounded-3xl w-full flex items-center justify-center cursor-pointer hover:bg-black/5 transition">
      <span className="text-4xl font-light">+</span>
    </div>
  );
}
