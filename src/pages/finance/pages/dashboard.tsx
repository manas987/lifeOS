import {
  AccountsCard,
  CategoriesCard,
  DashboardSummaryCard,
  QuickInsightCard,
  RecentTransactionsCard,
  SubscriptionsCard,
  type TransactionItem,
} from "../financecards";

import { useOutletContext } from "react-router-dom";
import type {
  Account,
  Category,
  Subscription,
  Transaction,
} from "../logic/types";

type FinanceContextType = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  subscriptions: Subscription[];
};

export function Dashboard() {
  const { transactions, accounts, categories, subscriptions } =
    useOutletContext<FinanceContextType>();

  // ======================
  // TOTALS
  // ======================

  const totalExpense = transactions
    .filter((t) => t.mode === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.mode === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const SummaryData = {
    totalBalance: `₹${accounts
      .reduce((sum, a) => sum + a.balance, 0)
      .toLocaleString()}`,

    thisMonthIncome: `₹${totalIncome.toLocaleString()}`,

    thisMonthExpense: `₹${totalExpense.toLocaleString()}`,

    savingsPercent:
      totalIncome === 0
        ? "0%"
        : `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}%`,
  };

  // ======================
  // CATEGORY DATA (% based)
  // ======================

  const categoriesData = categories.map((c) => {
    const total = transactions
      .filter((t) => t.category === c.id && t.mode === c.type)
      .reduce((sum, t) => sum + t.amount, 0);

    const base = c.type === "expense" ? totalExpense : totalIncome;

    return {
      name: c.name,
      value: base ? (total / base) * 100 : 0,
      type: c.type,
    };
  });

  // ======================
  // ACCOUNT MAP
  // ======================

  const accountMap: Record<string, string> = Object.fromEntries(
    accounts.map((a) => [a.id, a.name]),
  );

  // ======================
  // TRANSACTIONS (UI FORMAT)
  // ======================
  const transactionItems: TransactionItem[] = transactions.map((t) => ({
    title: t.title,
    amount: `₹${t.amount}`, // better UI
    category: t.category,
    date: t.date,
    mode: t.mode === "transfer" ? "expense" : t.mode, // optional
    account:
      t.mode === "transfer"
        ? `${accountMap[t.accountId] || "Unknown"} → ${
            accountMap[t.toAccountId || ""] || "Unknown"
          }`
        : accountMap[t.accountId] || "Unknown",
  }));

  // ======================
  // DIRECT DATA
  // ======================
  const accountsData = accounts.map((a) => ({
    name: a.name,
    amount: `₹${a.balance.toLocaleString()}`,
  }));
  const subscriptionsData = subscriptions.map((s) => ({
    name: s.name,
    amount: `₹${s.amount}`,
  }));

  // ======================
  // STATIC INSIGHT
  // ======================

  const insight =
    "idkkidkkidkkidkkidkkidkkidkkidkkidkki aasdlkfj idkkidkkidkkidkkidkkidkkidkkidkkidkk";

  // ======================
  // UI
  // ======================

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-3">
        {/* Row 1 */}
        <DashboardSummaryCard data={SummaryData} />
        <CategoriesCard data={categoriesData} />
        <SubscriptionsCard data={subscriptionsData} />

        {/* Row 2 LEFT */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex-1 min-h-0">
            <AccountsCard data={accountsData} />
          </div>

          <div className="shrink-0">
            <QuickInsightCard insight={insight} />
          </div>
        </div>

        {/* Row 2 RIGHT */}
        <div className="col-span-2 h-full">
          <RecentTransactionsCard data={transactionItems} />
        </div>
      </div>
    </div>
  );
}
