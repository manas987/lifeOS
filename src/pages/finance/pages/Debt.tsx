import { useContext, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Mycontext } from "@/context/AppContext";
import type { TrackItem, TrackKind } from "../logic/types";

// ======================
// TYPES
// ======================

// ======================
// HELPERS
// ======================

function formatMoney(value: number) {
  return `₹${value.toLocaleString()}`;
}

function cleanNumber(value: string) {
  return value.replace(/^0+/, "");
}

// ======================
// MAIN PAGE
// ======================

export function Debt() {
  const { finance } = useContext(Mycontext);
  const { items, setItems } = finance;

  function addItem(kind: TrackKind) {
    setItems((prev: any) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind,
        name: "",
        total: 0,
        done: 0,
      },
    ]);
  }

  function updateItem(id: string, updated: Partial<TrackItem>) {
    setItems((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? { ...item, ...updated } : item,
      ),
    );
  }

  function deleteItem(id: string) {
    setItems((prev: any) => prev.filter((item: any) => item.id !== id));
  }

  const debtItems = items.filter((item: any) => item.kind === "debt");
  const lentItems = items.filter((item: any) => item.kind === "lent");

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Debt</h2>

      <div className="flex flex-col gap-10">
        <TrackSection
          title="Debt"
          kind="debt"
          items={debtItems}
          onAdd={() => addItem("debt")}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />

        <TrackSection
          title="Lent"
          kind="lent"
          items={lentItems}
          onAdd={() => addItem("lent")}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />
      </div>
    </div>
  );
}

// ======================
// SECTION
// ======================

function TrackSection({
  title,
  kind,
  items,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string;
  kind: TrackKind;
  items: TrackItem[];
  onAdd: () => void;
  onUpdate: (id: string, updated: Partial<TrackItem>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-light">{title}</h3>
          <p className="text-sm text-black/50">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-[300px]">
            <TrackCard
              data={item}
              kind={kind}
              onUpdate={(updated) => onUpdate(item.id, updated)}
              onDelete={() => onDelete(item.id)}
            />
          </div>
        ))}

        <div className="w-[300px]">
          <AddNewCard onClick={onAdd} label={`Add ${title}`} />
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-sm text-black/50">
          No {title.toLowerCase()} yet. Add one to start tracking.
        </div>
      )}
    </section>
  );
}

// ======================
// TRACK CARD
// ======================

function TrackCard({
  data,
  kind,
  onUpdate,
  onDelete,
}: {
  data: TrackItem;
  kind: TrackKind;
  onUpdate: (val: Partial<TrackItem>) => void;
  onDelete: () => void;
}) {
  const [input, setInput] = useState("");

  const doneLabel = kind === "debt" ? "Paid" : "Received";
  const accentText = kind === "debt" ? "text-red-500" : "text-green-600";
  const accentBar = kind === "debt" ? "bg-red-500/70" : "bg-green-600/70";

  const remaining = Math.max(data.total - data.done, 0);
  const progress =
    data.total === 0 ? 0 : Math.min((data.done / data.total) * 100, 100);

  function handleTotalChange(value: string) {
    if (value === "") {
      onUpdate({ total: 0, done: 0 });
      return;
    }

    const nextTotal = parseInt(cleanNumber(value));
    if (isNaN(nextTotal) || nextTotal < 0) {
      onUpdate({ total: 0, done: 0 });
      return;
    }

    onUpdate({
      total: nextTotal,
      done: Math.min(data.done, nextTotal),
    });
  }

  function applyChange(type: "add" | "sub") {
    const val = parseInt(cleanNumber(input));
    if (isNaN(val) || val <= 0) return;

    if (type === "add") {
      onUpdate({
        done: Math.min(data.done + val, data.total),
      });
    } else {
      onUpdate({
        done: Math.max(data.done - val, 0),
      });
    }

    setInput("");
  }

  return (
    <div className="glass-card relative flex flex-col gap-4 rounded-3xl p-4 pt-3">
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded p-1 transition hover:bg-red-100">
        <Trash size={14} className="text-red-500" />
      </button>

      <input
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder={kind === "debt" ? "Debt name" : "Person name"}
        className="border-b border-black/30 bg-transparent pb-1 text-lg font-medium outline-none"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs text-black/50">
          {kind === "debt" ? "Total" : "Given"}
        </span>
        <input
          type="number"
          value={data.total === 0 ? "" : data.total}
          onChange={(e) => handleTotalChange(e.target.value)}
          placeholder="0"
          className="glass-card rounded-xl px-3 py-2 outline-none"
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-black/60">
          {doneLabel}: {formatMoney(data.done)}
        </span>
        <span className="font-medium text-black/80">
          Left: {formatMoney(remaining)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full transition-all ${accentBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="h-px bg-black/10" />

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(cleanNumber(e.target.value))}
          placeholder="amount"
          className="glass-card w-full rounded-xl px-3 py-2 outline-none"
        />

        <button
          onClick={() => applyChange("add")}
          className={`glass-card rounded-xl px-3 py-2 transition hover:bg-black/10 ${accentText}`}>
          +
        </button>

        <button
          onClick={() => applyChange("sub")}
          className="glass-card rounded-xl px-3 py-2 transition hover:bg-black/10 text-black/70">
          -
        </button>
      </div>
    </div>
  );
}

// ======================
// ADD NEW CARD
// ======================

function AddNewCard({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button onClick={onClick} className="glass-card">
      <div className="h-[305px] w-[300px] rounded-3xl flex items-center justify-center flex-col gap-2 text-center transition hover:bg-white/40">
        <Plus size={28} className="text-black/60" />
        <span className="text-base text-black/60">{label}</span>
      </div>
    </button>
  );
}
