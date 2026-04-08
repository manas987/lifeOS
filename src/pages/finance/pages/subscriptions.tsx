import { useContext, useMemo } from "react";
import { Plus, Trash, Check } from "lucide-react";
import { Mycontext } from "@/context/AppContext";

// ======================
// TYPES
// ======================

type SubscriptionItem = {
  id: string;
  name: string;
  amount: number;
  nextDue: string;
  repeatEvery: "weekly" | "monthly" | "yearly";
  active: boolean;
};

type FinanceState = {
  subscriptions: SubscriptionItem[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionItem[]>>;
};

type AppContextShape = {
  finance: FinanceState;
};

// ======================
// HELPERS
// ======================

function formatMoney(value: number) {
  return `₹${value.toLocaleString()}`;
}

function cleanNumber(value: string) {
  return value.replace(/^0+/, "");
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addRepeat(
  dateStr: string,
  repeatEvery: SubscriptionItem["repeatEvery"],
) {
  const date = new Date(dateStr);

  if (repeatEvery === "weekly") {
    date.setDate(date.getDate() + 7);
  } else if (repeatEvery === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysLeft(nextDue: string) {
  if (!nextDue) return null;

  const due = new Date(nextDue + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ======================
// MAIN PAGE
// ======================

export function Subscriptions() {
  const { finance } = useContext(Mycontext) as AppContextShape;
  const { subscriptions, setSubscriptions } = finance;

  function addSubscription() {
    setSubscriptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
        nextDue: getTodayString(),
        repeatEvery: "monthly",
        active: true,
      },
    ]);
  }

  function updateSubscription(id: string, updated: Partial<SubscriptionItem>) {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updated } : sub)),
    );
  }

  function deleteSubscription(id: string) {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  }

  function markPaid(sub: SubscriptionItem) {
    updateSubscription(sub.id, {
      nextDue: addRepeat(sub.nextDue, sub.repeatEvery),
    });
  }

  const totalActive = useMemo(
    () => subscriptions.filter((s) => s.active).length,
    [subscriptions],
  );

  const monthlyTotal = useMemo(
    () =>
      subscriptions
        .filter((s) => s.active)
        .reduce((sum, s) => sum + s.amount, 0),
    [subscriptions],
  );

  return (
    <div>
      <h2 className="mb-4 text-3xl font-light">Subscriptions</h2>

      <div className="mb-4 flex items-center justify-between text-sm text-black/50 dark:text-white/50">
        <span>{totalActive} active</span>
        <span>Monthly total: {formatMoney(monthlyTotal)}</span>
      </div>

      <div className="flex flex-wrap gap-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="w-[300px]">
            <SubscriptionCard
              data={sub}
              onUpdate={(val) => updateSubscription(sub.id, val)}
              onDelete={() => deleteSubscription(sub.id)}
              onPaid={() => markPaid(sub)}
            />
          </div>
        ))}

        <div className="w-[300px]">
          <AddNewCard onClick={addSubscription} label="Add Subscription" />
        </div>
      </div>

      {subscriptions.length === 0 && (
        <div className="mt-6 text-sm text-black/50 dark:text-white/50">
          No subscriptions yet. Add one to start tracking recurring payments.
        </div>
      )}
    </div>
  );
}

// ======================
// SUBSCRIPTION CARD
// ======================

function SubscriptionCard({
  data,
  onUpdate,
  onDelete,
  onPaid,
}: {
  data: SubscriptionItem;
  onUpdate: (val: Partial<SubscriptionItem>) => void;
  onDelete: () => void;
  onPaid: () => void;
}) {
  const due = daysLeft(data.nextDue);
  const overdue = due !== null && due < 0;

  return (
    <div className="glass-card relative flex h-full flex-col gap-4 rounded-3xl p-4 pt-3">
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 transition hover:bg-red-100">
        <Trash size={14} className="text-red-500" />
      </button>

      <input
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="Subscription name"
        className="border-b border-black/30 bg-transparent pb-1 text-lg font-medium outline-none"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs text-black/50 dark:text-white/50">Amount</span>
        <input
          type="number"
          value={data.amount === 0 ? "" : data.amount}
          onChange={(e) => {
            const raw = cleanNumber(e.target.value);
            const val = raw === "" ? 0 : Number(raw);
            onUpdate({ amount: isNaN(val) ? 0 : val });
          }}
          placeholder="0"
          className="glass-card rounded-xl px-3 py-2 outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-black/50 dark:text-white/50">Next due</span>
        <input
          type="date"
          value={data.nextDue}
          onChange={(e) => onUpdate({ nextDue: e.target.value })}
          className="glass-card rounded-xl px-3 py-2 outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-black/50 dark:text-white/50">Repeats</span>
        <select
          value={data.repeatEvery}
          onChange={(e) =>
            onUpdate({
              repeatEvery: e.target.value as SubscriptionItem["repeatEvery"],
            })
          }
          className="glass-card rounded-xl px-3 py-2 outline-none">
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-black/60 dark:text-white/60">
          {data.active ? "Active" : "Paused"}
        </span>
        <span
          className={
            overdue
              ? "font-medium text-red-500"
              : due !== null && due <= 3
                ? "font-medium text-yellow-600"
                : "font-medium text-black/80 dark:text-white/80"
          }>
          {due === null
            ? "No due date"
            : overdue
              ? `${Math.abs(due)} day(s) overdue`
              : `${due} day(s) left`}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full transition-all ${
            overdue ? "bg-red-500/70" : "bg-black/70"
          }`}
          style={{
            width:
              due === null
                ? "0%"
                : overdue
                  ? "100%"
                  : `${Math.min(((30 - due) / 30) * 100, 100)}%`,
          }}
        />
      </div>

      <div className="h-px bg-black/10" />

      <div className="flex items-center gap-2">
        <button
          onClick={onPaid}
          className="glass-card flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 transition hover:bg-black/10">
          <Check size={14} />
          Paid
        </button>

        <button
          onClick={() => onUpdate({ active: !data.active })}
          className="glass-card rounded-xl px-3 py-2 transition hover:bg-black/10">
          {data.active ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="text-sm text-black/60 dark:text-white/60">{formatMoney(data.amount)}</div>
    </div>
  );
}

function AddNewCard({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button onClick={onClick} className="glass-card ">
      <div className="h-[305px] w-[300px] rounded-3xl flex items-center justify-center flex-col gap-2 text-center transition hover:bg-white/40">
        <Plus size={28} className="text-black/60 dark:text-white/60" />
        <span className="text-base text-black/60 dark:text-white/60">{label}</span>
      </div>
    </button>
  );
}
