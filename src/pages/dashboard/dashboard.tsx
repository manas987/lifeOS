import { Mycontext } from "@/context/AppContext";
import { useContext, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export function Dashboar() {
  const { task, habbit, finance } = useContext(Mycontext);
  const { transactions, accounts, categories, subscriptions } = finance;
  const { habitslist, CountStreak } = habbit;
  const { taskslist } = task;

  const [activeTab, setActiveTab] = useState<"week" | "month" | "all">("month");

  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date();

  /* ── FINANCE ── */
  const totalBalance = useMemo(
    () => accounts.reduce((s: number, a: any) => s + a.balance, 0),
    [accounts],
  );

  const filteredTx = useMemo(() => {
    return transactions.filter((t: any) => {
      if (activeTab === "all") return true;
      const d = new Date(t.date);
      const diff = (todayDate.getTime() - d.getTime()) / 86400000;
      return activeTab === "week" ? diff <= 7 : diff <= 30;
    });
  }, [transactions, activeTab]);

  const totalIncome = useMemo(
    () =>
      filteredTx
        .filter((t: any) => t.mode === "income")
        .reduce((s: number, t: any) => s + t.amount, 0),
    [filteredTx],
  );
  const totalExpense = useMemo(
    () =>
      filteredTx
        .filter((t: any) => t.mode === "expense")
        .reduce((s: number, t: any) => s + t.amount, 0),
    [filteredTx],
  );
  const savings = totalIncome - totalExpense;

  const lineData = useMemo(() => {
    const map = new Map<
      string,
      { date: string; income: number; expense: number }
    >();
    filteredTx.forEach((t: any) => {
      if (!map.has(t.date))
        map.set(t.date, { date: t.date, income: 0, expense: 0 });
      const item = map.get(t.date)!;
      if (t.mode === "income") item.income += t.amount;
      if (t.mode === "expense") item.expense += t.amount;
    });
    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [filteredTx]);

  const categoryPie = useMemo(() => {
    const map = new Map<string, number>();
    filteredTx
      .filter((t: any) => t.mode === "expense")
      .forEach((t: any) => {
        const name =
          categories.find((c: any) => c.id === t.category)?.name || "Other";
        map.set(name, (map.get(name) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredTx, categories]);

  const recentTx = useMemo(
    () =>
      [...transactions]
        .sort((a: any, b: any) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [transactions],
  );

  const totalSubs = useMemo(
    () =>
      (subscriptions || []).reduce(
        (s: number, sub: any) => s + (sub.amount || 0),
        0,
      ),
    [subscriptions],
  );

  /* ── HABITS ── */
  const todayDay = todayDate.getDay();
  const activeHabits = habitslist.filter((h: any) => {
    if (h.repeatOn?.length > 0 && !h.repeatOn.includes(todayDay)) return false;
    return true;
  });
  const completedToday = activeHabits.filter((h: any) =>
    h.completedDates?.includes(today),
  ).length;
  const habitRate =
    activeHabits.length > 0
      ? Math.round((completedToday / activeHabits.length) * 100)
      : 0;
  const bestStreak = habitslist.reduce(
    (best: number, h: any) => Math.max(best, CountStreak(h)),
    0,
  );

  const habitBar = habitslist.slice(0, 6).map((h: any) => ({
    name: h.title.length > 8 ? h.title.slice(0, 8) + "…" : h.title,
    streak: CountStreak(h),
    done: h.completedDates?.includes(today) ? 1 : 0,
  }));

  /* ── TASKS ── */
  const completedTasks = taskslist.filter((t: any) => t.completed).length;
  const pendingTasks = taskslist.length - completedTasks;
  const overdueTasks = taskslist.filter(
    (t: any) => !t.completed && t.duedate && t.duedate < today,
  ).length;
  const todayTasks = taskslist.filter(
    (t: any) => !t.completed && t.duedate === today,
  );

  const taskPie = [
    { name: "Done", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  const COLORS = [
    "#111",
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
  ];

  const tabs = ["week", "month", "all"] as const;

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light">Dashboard</h1>
        <div className="flex gap-1 glass-card p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-xl text-sm transition capitalize ${
                activeTab === t ? "!bg-black/80 text-white" : "hover:!bg-white"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── ROW 1: STAT PILLS ── */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Total balance"
          value={`₹${totalBalance.toLocaleString()}`}
          sub="across all accounts"
          color="text-black"
        />
        <StatCard
          label="Net savings"
          value={`₹${savings.toLocaleString()}`}
          sub={`Income ₹${totalIncome.toLocaleString()} · Expense ₹${totalExpense.toLocaleString()}`}
          color={savings >= 0 ? "text-green-600" : "text-red-500"}
        />
        <StatCard
          label="Today's habits"
          value={`${completedToday}/${activeHabits.length}`}
          sub={`${habitRate}% done · best streak ${bestStreak}d`}
          color="text-blue-600"
        />
        <StatCard
          label="Tasks"
          value={`${pendingTasks} pending`}
          sub={`${overdueTasks} overdue · ${completedTasks} done`}
          color={overdueTasks > 0 ? "text-red-500" : "text-black"}
        />
      </div>

      {/* ── ROW 2: LINE CHART + TASK/HABIT RING ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-2">Income vs expense</p>
          {lineData.length === 0 ? (
            <Empty text="No transactions yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-1">
            <Legend color="bg-green-500" label="Income" />
            <Legend color="bg-red-400" label="Expense" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="glass-card p-4 pt-2 flex-1">
            <p className="text-sm text-black/50 mb-1">Tasks overview</p>
            {taskslist.length === 0 ? (
              <Empty text="No tasks yet" />
            ) : (
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={taskPie}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}>
                    <Cell fill="#111" />
                    <Cell fill="#d1fae5" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex gap-3 mt-1">
              <Legend color="bg-black/80" label={`${completedTasks} done`} />
              <Legend color="bg-green-100" label={`${pendingTasks} pending`} />
            </div>
          </div>

          <div className="glass-card p-4 pt-2">
            <p className="text-sm text-black/50 mb-2">Subscriptions</p>
            <p className="text-2xl font-medium">
              ₹{totalSubs.toLocaleString()}
            </p>
            <p className="text-xs text-black/40">
              {(subscriptions || []).length} active / month
            </p>
          </div>
        </div>
      </div>

      {/* ── ROW 3: CATEGORIES + HABITS BAR ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-2">Expense by category</p>
          {categoryPie.length === 0 ? (
            <Empty text="No expense data" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryPie}
                  dataKey="value"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${Math.round(percent * 100)}%`
                  }
                  labelLine={false}>
                  {categoryPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-2">Habit streaks</p>
          {habitBar.length === 0 ? (
            <Empty text="No habits yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={habitBar} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="streak" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── ROW 4: TODAY'S TASKS + RECENT TX + ACCOUNTS ── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Today's tasks */}
        <div className="glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-3">Due today</p>
          {todayTasks.length === 0 ? (
            <Empty text="Nothing due today" />
          ) : (
            <div className="flex flex-col gap-2">
              {todayTasks.slice(0, 6).map((t: any) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 text-sm py-1 border-b border-black/5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-black/30 shrink-0" />
                  <span className="truncate">{t.title}</span>
                  {t.project && (
                    <span className="text-xs text-black/30 ml-auto shrink-0">
                      {t.project}
                    </span>
                  )}
                </div>
              ))}
              {todayTasks.length > 6 && (
                <p className="text-xs text-black/30">
                  +{todayTasks.length - 6} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-3">Recent transactions</p>
          {recentTx.length === 0 ? (
            <Empty text="No transactions" />
          ) : (
            <div className="flex flex-col gap-2">
              {recentTx.map((t: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1 border-b border-black/5 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[100px]">
                      {t.title || "—"}
                    </span>
                    <span className="text-xs text-black/30">{t.date}</span>
                  </div>
                  <span
                    className={`font-medium tabular-nums ${t.mode === "income" ? "text-green-600" : "text-red-500"}`}>
                    {t.mode === "income" ? "+" : "-"}₹
                    {t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="glass-card p-4 pt-2">
          <p className="text-sm text-black/50 mb-3">Accounts</p>
          {accounts.length === 0 ? (
            <Empty text="No accounts" />
          ) : (
            <div className="flex flex-col gap-2">
              {accounts.map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm py-1 border-b border-black/5 last:border-0">
                  <span>{a.name}</span>
                  <span
                    className={`font-medium tabular-nums ${a.balance < 0 ? "text-red-500" : ""}`}>
                    ₹{a.balance.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-1 font-medium border-t border-black/10 mt-1">
                <span>Total</span>
                <span>₹{totalBalance.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="glass-card p-4 pt-2 flex flex-col gap-1">
      <p className="text-xs text-black/40 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-medium ${color}`}>{value}</p>
      <p className="text-xs text-black/40">{sub}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-black/50">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-20 text-sm text-black/30">
      {text}
    </div>
  );
}
