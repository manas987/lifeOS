import {
  AccountsCard,
  CategoriesCard,
  DashboardSummaryCard,
  QuickInsightCard,
  RecentTransactionsCard,
  SubscriptionsCard,
  type TransactionItem,
} from "../financecards";

export function Dashboard() {
  const SummaryData = {
    totalBalance: "$70k",
    thisMonthIncome: "idk",
    thisMonthExpense: "idk",
    savingsPercent: "idk",
  };
  const categories = [
    { name: "Food", value: 40 },
    { name: "Travel", value: 20 },
    { name: "Shopping", value: 10 },
    { name: "Shopping", value: 10 },

    { name: "Shopping", value: 10 },
    { name: "Food", value: 40 },
    { name: "Travel", value: 20 },
    { name: "Shopping", value: 10 },
    { name: "Shopping", value: 10 },

    { name: "Shopping", value: 10 },
  ];
  const subscriptions = [
    { name: "Spotify", amount: "₹149" },
    { name: "Netflix", amount: "₹199" },

    { name: "Netflix", amount: "₹199" },

    { name: "Netflix", amount: "₹199" },

    { name: "Netflix", amount: "₹199" },
  ];
  const accounts = [
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
    { name: "ads", amount: "nigga" },
  ];
  const insight =
    "idkkidkkidkkidkkidkkidkkidkkidkkidkki aasdlkfj nigga nigga idkkidkkidkkidkkidkkidkkidkkidkkidkk";

  const transactions: TransactionItem[] = [
    {
      title: "Swiggy",
      amount: "₹250",
      mode: "expense",
      account: "Cash",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      title: "Swiggy",
      amount: "₹250",
      mode: "expense",
      account: "Cash",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
    {
      amount: "₹18,000",
      mode: "income",
      account: "Bank",
      category: "Salary",
    },
  ];
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 grid-rows-[auto_] gap-3">
        {/* Row 1 */}
        <DashboardSummaryCard data={SummaryData} />
        <CategoriesCard data={categories} />
        <SubscriptionsCard data={subscriptions} />

        {/* Row 2 LEFT */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex-1 min-h-0">
            <AccountsCard data={accounts} />
          </div>

          <div className="shrink-0">
            <QuickInsightCard insight={insight} />
          </div>
        </div>

        {/* Row 2 RIGHT */}
        <div className="col-span-2 h-full">
          <RecentTransactionsCard data={transactions} />
        </div>
      </div>
    </div>
  );
}
