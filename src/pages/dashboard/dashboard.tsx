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
} from "recharts";

export function Dashboar() {
  const { task, habbit, finance } = useContext(Mycontext);
  const { transactions, accounts, categories, subscriptions } = finance;
  const { habitslist, CountStreak } = habbit;
  const { taskslist } = task;

  const [activeTab, setActiveTab] = useState<"week" | "month" | "all">("month");

  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date();
  const todayDay = todayDate.getDay();

  /* ── FILTER ── */
  const filteredTx = useMemo(() => {
    return transactions.filter((t: any) => {
      if (activeTab === "all") return true;
      const diff =
        (todayDate.getTime() - new Date(t.date).getTime()) / 86400000;
      return activeTab === "week" ? diff <= 7 : diff <= 30;
    });
  }, [transactions, activeTab]);

  /* ── FINANCE ── */
  const totalBalance = useMemo(
    () => accounts.reduce((s: number, a: any) => s + a.balance, 0),
    [accounts],
  );
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

  const expensePie = useMemo(() => {
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

  const incomePie = useMemo(() => {
    const map = new Map<string, number>();
    filteredTx
      .filter((t: any) => t.mode === "income")
      .forEach((t: any) => {
        const name =
          categories.find((c: any) => c.id === t.category)?.name || "Other";
        map.set(name, (map.get(name) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredTx, categories]);

  /* ── ALERTS ── */
  const alerts = useMemo(() => {
    const list: { text: string; type: "warn" | "danger" | "info" }[] = [];
    const overdue = taskslist.filter(
      (t: any) => !t.completed && t.duedate && t.duedate < today,
    );
    if (overdue.length > 0)
      list.push({
        text: `${overdue.length} task${overdue.length > 1 ? "s" : ""} overdue`,
        type: "danger",
      });
    if (savings < 0)
      list.push({ text: "You are overspending", type: "danger" });
    if (totalExpense > totalIncome * 0.8 && totalIncome > 0)
      list.push({ text: "Expense above 80% of income", type: "warn" });
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    const subsDueTomorrow = (subscriptions || []).filter(
      (s: any) => s.nextDue === tomorrowStr,
    );
    if (subsDueTomorrow.length > 0)
      list.push({ text: "Subscription due tomorrow", type: "warn" });
    habitslist.forEach((h: any) => {
      const streak = CountStreak(h);
      if (streak === 0 && h.completedDates?.length > 0)
        list.push({ text: `"${h.title}" streak broken`, type: "warn" });
    });
    if (list.length === 0)
      list.push({ text: "All good — no alerts", type: "info" });
    return list;
  }, [
    taskslist,
    savings,
    totalExpense,
    totalIncome,
    subscriptions,
    habitslist,
  ]);

  /* ── HABITS ── */
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

  /* ── TASKS ── */
  const completedTasks = taskslist.filter((t: any) => t.completed).length;
  const pendingTasks = taskslist.length - completedTasks;
  const overdueTasks = taskslist.filter(
    (t: any) => !t.completed && t.duedate && t.duedate < today,
  ).length;
  const todayTasks = taskslist.filter(
    (t: any) => !t.completed && t.duedate === today,
  );

  /* ── PRODUCTIVITY CHART ── */
  const productivityData = useMemo(() => {
    const days = activeTab === "week" ? 7 : activeTab === "month" ? 30 : 60;
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const habitsCompleted = habitslist.filter((h: any) =>
        h.completedDates?.includes(dateStr),
      ).length;
      const tasksCompleted = taskslist.filter(
        (t: any) => t.completed && t.duedate === dateStr,
      ).length;
      return {
        date: dateStr.slice(5),
        habits: habitsCompleted,
        tasks: tasksCompleted,
      };
    });
  }, [habitslist, taskslist, transactions, activeTab]);

  const COLORS = [
    "#111",
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  const tabs = ["week", "month", "all"] as const;

  return (
    <div className="flex flex-col gap-3 pb-8 min-w-0 p-4">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-light">Welcome back</h1>
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

      {/* ── ROW 1: STAT CARDS ── */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Total balance"
          value={`₹${totalBalance.toLocaleString()}`}
          sub="across all accounts"
          valueClass=""
        />
        <StatCard
          label="Net savings"
          value={`₹${savings.toLocaleString()}`}
          sub={`Income ₹${totalIncome.toLocaleString()} · Expense ₹${totalExpense.toLocaleString()}`}
          valueClass={savings >= 0 ? "text-green-600" : "text-red-500"}
        />
        <StatCard
          label="Today's habits"
          value={`${completedToday}/${activeHabits.length}`}
          sub={`${habitRate}% done · best streak ${bestStreak}d`}
          valueClass="text-blue-600"
        />
        <StatCard
          label="Tasks"
          value={`${pendingTasks} pending`}
          sub={`${overdueTasks} overdue · ${completedTasks} done`}
          valueClass={overdueTasks > 0 ? "text-red-500" : ""}
        />
      </div>

      {/* ── ROW 2: LINE CHART + PIE x2 + ALERTS ── */}
      <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-3 h-80">
        {/* Income vs Expense */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-2">
            Income vs expense
          </p>
          {lineData.length === 0 ? (
            <Empty text="No transactions yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v: any) => `₹${Number(v).toLocaleString()}`}
                />
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
            <Leg color="bg-green-500" label="Income" />
            <Leg color="bg-red-400" label="Expense" />
          </div>
        </div>

        {/* Expense pie */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-2">
            Expense breakdown
          </p>
          {expensePie.length === 0 ? (
            <Empty text="No expense data" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={expensePie}
                    dataKey="value"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}>
                    {expensePie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => `₹${Number(v).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1 mt-1">
                {expensePie.slice(0, 3).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-black/50">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto">₹{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Income pie */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-2">
            Income breakdown
          </p>
          {incomePie.length === 0 ? (
            <Empty text="No income data" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={incomePie}
                    dataKey="value"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}>
                    {incomePie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => `₹${Number(v).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1 mt-1">
                {incomePie.slice(0, 3).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-black/50">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto">₹{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Alerts */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-2">
            Alerts / warnings
          </p>
          <div className="flex flex-col gap-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`text-xs px-2 py-1.5 rounded-lg ${
                  a.type === "danger"
                    ? "bg-red-50 text-red-600"
                    : a.type === "warn"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-green-50 text-green-700"
                }`}>
                {a.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: DUE TODAY + ACCOUNTS + PRODUCTIVITY ── */}
      <div className="grid grid-cols-[1fr_1fr_2fr] gap-3 h-80">
        {/* Due today */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-3">
            Due today
          </p>
          {todayTasks.length === 0 ? (
            <Empty text="Nothing due today" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {todayTasks.slice(0, 7).map((t: any) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 text-sm py-1 border-b border-black/5 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/30 shrink-0" />
                  <span className="truncate">{t.title}</span>
                  {t.project && (
                    <span className="text-xs text-black/30 ml-auto shrink-0">
                      {t.project}
                    </span>
                  )}
                </div>
              ))}
              {todayTasks.length > 7 && (
                <p className="text-xs text-black/30 mt-1">
                  +{todayTasks.length - 7} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-3">
            Accounts
          </p>
          {accounts.length === 0 ? (
            <Empty text="No accounts" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {accounts.map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm py-1 border-b border-black/5 last:border-0">
                  <span className="truncate">{a.name}</span>
                  <span
                    className={`font-medium tabular-nums shrink-0 ml-2 ${a.balance < 0 ? "text-red-500" : ""}`}>
                    ₹{a.balance.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 font-medium border-t border-black/10">
                <span>Total</span>
                <span>₹{totalBalance.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Productivity chart */}
        <div className="glass-card p-4 pt-2">
          <p className="text-xs text-black/40 uppercase tracking-wide mb-2">
            Productivity overview
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="habits"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
                name="Habits done"
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#22c55e"
                dot={false}
                strokeWidth={2}
                name="Tasks done"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1">
            <Leg color="bg-blue-500" label="Habits" />
            <Leg color="bg-green-500" label="Tasks" />
            <Leg color="bg-red-400" label="Expense (÷100)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub: string;
  valueClass: string;
}) {
  return (
    <div className="glass-card p-4 pt-2 flex flex-col gap-1">
      <p className="text-xs text-black/40 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-medium ${valueClass}`}>{value}</p>
      <p className="text-xs text-black/40">{sub}</p>
    </div>
  );
}

function Leg({ color, label }: { color: string; label: string }) {
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
