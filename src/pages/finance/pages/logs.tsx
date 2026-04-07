import { useOutletContext } from "react-router-dom";
import type { Account, Category, Transaction } from "../logic/types";
import { Trash, ChevronDown } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

type FinanceContextType = {
  transactions: Transaction[];
  updateTransaction: (id: string, tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  accounts: Account[];
  categories: Category[];
};

type GlassDropdownProps = {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  placeholder?: string;
};

function GlassDropdown({
  value,
  options,
  onChange,
  placeholder = "empty",
}: GlassDropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({
    top: 0,
    left: 0,
    width: 0,
  });

  const selected = options.find((o) => o.value === value);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value, options.length]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/30 bg-white/35 px-2 py-1.5 text-left text-sm text-black/80 backdrop-blur-md transition hover:bg-white/45">
        <span className={!selected ? "italic text-black/35" : ""}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={14} className="shrink-0 text-black/50" />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                ...menuStyle,
                zIndex: 99999,
              }}
              className="overflow-hidden rounded-xl border border-white/30 bg-white/55 shadow-[0_12px_35px_rgba(0,0,0,0.14)] backdrop-blur-xl">
              <div className="max-h-52 overflow-y-auto">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-sm italic text-black/35">
                    empty
                  </div>
                ) : (
                  options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-white/45 ${
                        opt.value === value
                          ? "bg-white/35 text-black/90"
                          : "text-black/80"
                      }`}>
                      {opt.label}
                    </button>
                  ))
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function Logs() {
  const {
    accounts,
    categories,
    transactions,
    updateTransaction,
    deleteTransaction,
  } = useOutletContext<FinanceContextType>();

  const [editing, setEditing] = useState<{
    id: string;
    field: string;
  } | null>(null);

  function stopEditing() {
    setEditing(null);
  }

  const inputClass =
    "w-full rounded-xl border border-white/30 bg-white/30 px-2 py-1.5 text-sm text-black/80 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/45";

  return (
    <div>
      <h2 className="mb-4 text-3xl font-light">Logs</h2>

      <div className="glass-card flex w-full flex-col gap-3 overflow-visible rounded-3xl p-4">
        <h3 className="text-xl font-medium text-black/80">
          Recent Transactions
        </h3>

        <div className="grid grid-cols-[1.5fr_0.8fr_1fr_1fr_0.8fr_1fr_40px] px-2 text-sm text-black/50">
          <span>Title</span>
          <span>Amount</span>
          <span>Category</span>
          <span>Date</span>
          <span>Mode</span>
          <span>Account</span>
          <span />
        </div>

        <div className="h-px bg-black/10" />

        <div className="flex max-h-[300px] flex-col overflow-y-auto overflow-x-visible pr-1">
          {transactions.length === 0 && (
            <span className="px-2 text-sm text-black/50">No transactions</span>
          )}

          {transactions.map((t) => {
            const filteredCategories =
              t.mode === "transfer"
                ? []
                : categories.filter((c) => c.type === t.mode);

            const rowEditing = (field: string) =>
              editing?.id === t.id && editing?.field === field;

            return (
              <div
                key={t.id}
                className="relative grid grid-cols-[1.5fr_0.8fr_1fr_1fr_0.8fr_1fr_40px] items-center rounded-lg px-2 py-2 text-sm transition hover:bg-white/30">
                <div onClick={() => setEditing({ id: t.id, field: "title" })}>
                  {rowEditing("title") ? (
                    <input
                      autoFocus
                      value={t.title || ""}
                      onChange={(e) =>
                        updateTransaction(t.id, {
                          ...t,
                          title: e.target.value,
                        })
                      }
                      onBlur={stopEditing}
                      className={inputClass}
                    />
                  ) : (
                    t.title || (
                      <span className="italic text-black/30">empty</span>
                    )
                  )}
                </div>

                <div
                  className="font-medium tabular-nums"
                  onClick={() => setEditing({ id: t.id, field: "amount" })}>
                  {rowEditing("amount") ? (
                    <input
                      type="number"
                      autoFocus
                      value={t.amount}
                      onChange={(e) =>
                        updateTransaction(t.id, {
                          ...t,
                          amount: Number(e.target.value),
                        })
                      }
                      onBlur={stopEditing}
                      className={inputClass}
                    />
                  ) : (
                    t.amount
                  )}
                </div>

                <div
                  onClick={() => setEditing({ id: t.id, field: "category" })}>
                  {rowEditing("category") ? (
                    filteredCategories.length > 0 ? (
                      <GlassDropdown
                        value={t.category || ""}
                        options={filteredCategories.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                        onChange={(v) =>
                          updateTransaction(t.id, {
                            ...t,
                            category: v || undefined,
                          })
                        }
                      />
                    ) : (
                      <span className="italic text-black/30">empty</span>
                    )
                  ) : (
                    categories.find((c) => c.id === t.category)?.name || (
                      <span className="italic text-black/30">empty</span>
                    )
                  )}
                </div>

                <div onClick={() => setEditing({ id: t.id, field: "date" })}>
                  {rowEditing("date") ? (
                    <input
                      type="date"
                      autoFocus
                      value={t.date}
                      onChange={(e) =>
                        updateTransaction(t.id, {
                          ...t,
                          date: e.target.value,
                        })
                      }
                      onBlur={stopEditing}
                      className={inputClass}
                    />
                  ) : (
                    t.date || (
                      <span className="italic text-black/30">empty</span>
                    )
                  )}
                </div>

                <div onClick={() => setEditing({ id: t.id, field: "mode" })}>
                  {rowEditing("mode") ? (
                    <GlassDropdown
                      value={t.mode}
                      options={[
                        { label: "income", value: "income" },
                        { label: "expense", value: "expense" },
                        { label: "transfer", value: "transfer" },
                      ]}
                      onChange={(v) =>
                        updateTransaction(t.id, {
                          ...t,
                          mode: v as Transaction["mode"],
                          category: v === "transfer" ? undefined : t.category,
                        })
                      }
                    />
                  ) : (
                    <span
                      className={
                        t.mode === "income" ? "text-green-600" : "text-red-500"
                      }>
                      {t.mode}
                    </span>
                  )}
                </div>

                <div
                  onClick={() => setEditing({ id: t.id, field: "accountId" })}>
                  {rowEditing("accountId") ? (
                    <GlassDropdown
                      value={t.accountId}
                      options={accounts.map((a) => ({
                        label: a.name,
                        value: a.id,
                      }))}
                      onChange={(v) =>
                        updateTransaction(t.id, {
                          ...t,
                          accountId: v,
                        })
                      }
                    />
                  ) : (
                    accounts.find((a) => a.id === t.accountId)?.name || (
                      <span className="italic text-black/30">empty</span>
                    )
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTransaction(t.id);
                    }}
                    className="rounded p-1 transition hover:bg-red-100">
                    <Trash size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
