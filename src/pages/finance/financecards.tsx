import { useState } from "react";
import { InboxIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

type SummaryData = {
  totalBalance: string;
  thisMonthIncome: string;
  thisMonthExpense: string;
  savingsPercent: string;
};
export function DashboardSummaryCard({ data }: { data: SummaryData }) {
  return (
    <div className="glass-card p-4 pt-1 pb-1 rounded-3xl w-full flex flex-col gap-2">
      <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Overview</h3>
      <div className="flex flex-col">
        <span className="text-sm text-black/60 dark:text-white/60">Total Balance</span>
        <span className="text-3xl font-semibold">
          {data.totalBalance || "₹0"}
        </span>
      </div>
      <div className="h-[1px] bg-black/50" />
      <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
        <div className="flex flex-col">
          <span className="text-black/60 dark:text-white/60">Income</span>
          <span className="font-medium text-green-600">
            {data.thisMonthIncome || "₹0"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-black/60 dark:text-white/60">Expense</span>
          <span className="font-medium text-red-500">
            {data.thisMonthExpense || "₹0"}
          </span>
        </div>
        <div className="flex flex-col col-span-2">
          <span className="text-black/60 dark:text-white/60">Savings</span>
          <span className="font-medium">{data.savingsPercent || "₹0"}</span>
        </div>
      </div>
    </div>
  );
}
type CategoryItem = {
  name: string;
  value: number;
  type: "income" | "expense";
};
export function CategoriesCard({ data }: { data: CategoryItem[] }) {
  const expense = data.filter((d) => d.type === "expense");
  const income = data.filter((d) => d.type === "income");
  const isEmpty = data.length === 0;

  return (
    <div className="glass-card p-3 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Categories</h3>
        <span className="text-sm text-black/50 dark:text-white/50">This month</span>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-[200px] text-sm text-black/50 dark:text-white/50">
          No category data yet
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* EXPENSE */}
          <div className="flex flex-col h-[200px] overflow-y-auto pr-1 gap-3">
            <span className="text-sm text-red-500 font-medium">Expense</span>

            {expense.length === 0 ? (
              <span className="text-xs text-black/40 dark:text-white/40">No expense data</span>
            ) : (
              expense.map((item, key) => (
                <div>
                  <div
                    key={key}
                    className="grid grid-cols-[80px_1fr_42px] items-center gap-2 ">
                    <span className="text-lg leading-none truncate">
                      {item.name}
                    </span>

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
                  <div className="h-[1px] bg-black/10" />
                </div>
              ))
            )}
          </div>

          {/* INCOME */}
          <div className="flex flex-col h-[200px] overflow-y-auto pr-1 gap-3">
            <span className="text-sm text-green-600 font-medium">Income</span>

            {income.length === 0 ? (
              <span className="text-xs text-black/40 dark:text-white/40">No income data</span>
            ) : (
              income.map((item, key) => (
                <div>
                  <div
                    key={key}
                    className="grid grid-cols-[80px_1fr_42px] items-center gap-2">
                    <span className="text-lg leading-none truncate">
                      {item.name}
                    </span>

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

                  <div className="h-[1px] bg-black/10" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
        <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Subscriptions</h3>
        <span className="text-sm text-black/50 dark:text-white/50">{data.length} active</span>
      </div>
      <div className="flex flex-col h-[250px] overflow-y-scroll pr-1">
        {data.length === 0 ? (
          <span className="text-sm text-black/50 dark:text-white/50">No active subscriptions</span>
        ) : (
          data.map((sub) => (
            <div>
              <div
                key={sub.name}
                className="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-black/5 transition ">
                <span className="text-lg">{sub.name}</span>

                <span className="font-semibold tabular-nums">{sub.amount}</span>
              </div>
              <div className="h-[1px] bg-black/10" />
            </div>
          ))
        )}
      </div>

      <div className="h-[1px] bg-black/50" />

      <div className="flex justify-between items-center text-sm -mb-32">
        <span className="text-black/60 dark:text-white/60">Total</span>
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
    <div className="glass-card p-4 pt-1 rounded-3xl w-full h-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Accounts</h3>
      <div className="flex flex-col h-[310px] -mb-[225px] overflow-y-auto pr-1 gap-1">
        {data.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-black/50 dark:text-white/50">
            No accounts yet
          </div>
        ) : (
          data.map((acc, i) => (
            <div>
              <div
                key={i}
                className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-black/5 transition ">
                <span className="text-lg">{acc.name}</span>
                <span className="font-semibold tabular-nums">{acc.amount}</span>
              </div>
              <div className="h-[1px] bg-black/10" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function QuickInsightCard({ insight }: { insight: string }) {
  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Quick Insight</h3>

      <p className="text-base text-black/70 dark:text-white/70 break-words">
        {insight || "No insights available yet."}
      </p>
    </div>
  );
}

export type TransactionItem = {
  title?: string;
  amount: string;
  category?: string;
  date: string;
  mode: "income" | "expense";
  account: string;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
};
export function RecentTransactionsCard({
  data,
  categories,
}: {
  data: TransactionItem[];
  categories: Category[];
}) {
  return (
    <div className="glass-card p-4 pt-1 rounded-3xl w-full flex flex-col gap-3">
      <h3 className="text-xl font-medium text-black/80 dark:text-white/80">Recent Transactions</h3>

      {/* HEADER */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] text-sm text-black/50 dark:text-white/50 px-2">
        <span>Title</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Date</span>
        <span>Mode</span>
        <span>Account</span>
      </div>

      <div className="h-[1px] bg-black/60" />

      {/* BODY */}
      <div className="flex flex-col h-[370px] overflow-y-auto pr-1">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-black/30 dark:text-white/30">
            <InboxIcon />
            <span className="text-sm">No transactions yet</span>
            <span className="text-xs text-black/30 dark:text-white/30">
              Add your first income or expense
            </span>
          </div>
        ) : (
          data.map((t, i) => (
            <div>
              <div
                key={i}
                className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] items-center px-2 py-2 rounded-lg hover:bg-black/5 text-sm">
                {/* TITLE */}
                <span className="truncate">{t.title || "empty"}</span>

                {/* AMOUNT */}
                <span className="tabular-nums font-medium">
                  {t.amount || "0"}
                </span>

                {/* CATEGORY */}
                <span className="truncate">
                  {categories.find((c) => c.id === t.category)?.name || "empty"}
                </span>

                {/* DATE */}
                <span>{format(parseISO(t.date), "dd MMM") || "empty"}</span>

                {/* MODE */}
                <span
                  className={
                    t.mode === "income" ? "text-green-600" : "text-red-500"
                  }>
                  {t.mode}
                </span>

                {/* ACCOUNT */}
                <span className="truncate">{t.account || "empty"}</span>
              </div>
              <div className="h-[1px] bg-black/10" />
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
