import { useOutletContext } from "react-router-dom";
import type { Account, Category, Transaction } from "../logic/types";
import { Trash, ChevronDown, CalendarDays } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";

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

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [open]);

  return (
    <div className="max-w-min">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/30 bg-white/35 px-2 py-1.5 text-left text-sm text-black/80 dark:text-white/80 backdrop-blur-md transition hover:bg-white/45">
        <span
          className={
            !selected ? "italic text-black/35 dark:text-white/35" : ""
          }>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          className="shrink-0 text-black/50 dark:text-white/50"
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              ...menuStyle,
              zIndex: 99999,
            }}
            className="overflow-hidden rounded-xl border border-white/30 bg-white/55 backdrop-blur-xl">
            <div className="max-h-52 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 w-3 text-sm italic text-black/35 dark:text-white/35">
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
                        ? "bg-white/35 text-black/90 dark:text-white/90"
                        : "text-black/80 dark:text-white/80"
                    }`}>
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
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

  const inputClass =
    "max-w-[180px] rounded-xl border border-white/30 bg-white/30 px-2 py-1.5 text-sm text-black/80 dark:text-white/80 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/45";

  return (
    <div>
      <h2 className="mb-4 text-3xl font-light">Logs</h2>

      <div className="glass-card flex w-full flex-col gap-3 overflow-visible rounded-3xl p-4">
        <h3 className="text-xl font-medium text-black/80 dark:text-white/80">
          Recent Transactions
        </h3>

        <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr_10px] px-2 text-sm text-black/50 dark:text-white/50">
          <span>Title</span>
          <span>Amount</span>
          <span>Category</span>
          <span>Date</span>
          <span>Mode</span>
          <span>Account</span>
          <span />
        </div>

        <div className="h-px bg-black/90" />

        <div className="flex max-h-full flex-col overflow-y-auto overflow-x-visible pr-1">
          {transactions.length === 0 && (
            <span className="px-2 text-sm text-black/50 dark:text-white/50">
              No transactions
            </span>
          )}

          {transactions.map((t) => {
            const filteredCategories =
              t.mode === "transfer"
                ? []
                : categories.filter((c) => c.type === t.mode);

            const rowEditing = (field: string) =>
              editing?.id === t.id && editing?.field === field;

            return (
              <div>
                <div
                  key={t.id}
                  className="relative grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr_5px] items-center rounded-lg px-2 py-2 text-sm transition hover:bg-white/30 ">
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
                        onBlur={() => setEditing(null)}
                        className={inputClass}
                      />
                    ) : (
                      t.title || (
                        <span className="italic text-black/30 dark:text-white/30">
                          empty
                        </span>
                      )
                    )}
                  </div>

                  <div
                    className="font-medium tabular-nums "
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
                        onBlur={() => setEditing(null)}
                        className={`w-32 ${inputClass}`}
                      />
                    ) : (
                      <div>₹{t.amount}</div>
                    )}
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!rowEditing("category")) {
                        setEditing({ id: t.id, field: "category" });
                      }
                    }}
                    className="min-w-0  ">
                    {rowEditing("category") ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        {filteredCategories.length > 0 ? (
                          <GlassDropdown
                            value={t.category || ""}
                            options={filteredCategories.map((c) => ({
                              label: c.name,
                              value: c.id,
                            }))}
                            onChange={(v) => {
                              updateTransaction(t.id, {
                                ...t,
                                category: v || undefined,
                              });
                              setEditing(null);
                            }}
                          />
                        ) : (
                          <span className="italic text-black/30 dark:text-white/30">
                            empty
                          </span>
                        )}
                      </div>
                    ) : (
                      categories.find((c) => c.id === t.category)?.name || (
                        <span className="italic text-black/30 dark:text-white/30">
                          empty
                        </span>
                      )
                    )}
                  </div>

                  <div onClick={() => setEditing({ id: t.id, field: "date" })}>
                    {rowEditing("date") ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="glass-card flex w-[130px] items-center justify-between rounded-xl px-3 py-1.5 text-sm transition hover:!bg-white dark:hover:!bg-white/10">
                            <span>
                              {t.date
                                ? format(parseISO(t.date), "dd MMM yyyy")
                                : "Select date"}
                            </span>
                            <CalendarDays size={14} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="z-[100] w-auto border border-white/40 bg-white/90 p-0 backdrop-blur-lg dark:bg-black">
                          <Calendar
                            mode="single"
                            selected={t.date ? parseISO(t.date) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              updateTransaction(t.id, {
                                ...t,
                                date: format(date, "yyyy-MM-dd"),
                              });

                              setEditing(null);
                            }}
                            classNames={{
                              month: "space-y-3",
                              caption_label:
                                "text-xl text-gray-800 dark:text-white",
                              button_previous:
                                "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center dark:text-white",
                              button_next:
                                "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-cente dark:text-white",
                              weekdays: "flex mb-2 gap-1 dark:text-white",
                              weekday:
                                "w-9 font-normal text-xs text-center text-gray-400 dark:text-white ",
                              weeks: "space-y-1",
                              week: "flex gap-1",
                              day: "w-9 h-9 text-center p-0 dark:text-white",
                              day_button:
                                "w-9 h-9 rounded-xl hover:bg-black/10 transition duration-100 ",
                              selected:
                                " [&>button]:hover:bg-black/10 [&>button]:font-semibold",
                              disabled:
                                "[&>button]:text-gray-300 dark:[&>button]:text-white/80 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed ",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : t.date ? (
                      format(parseISO(t.date), "dd MMM")
                    ) : (
                      <span className="italic text-black/30 dark:text-white/30">
                        empty
                      </span>
                    )}
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!rowEditing("mode")) {
                        setEditing({ id: t.id, field: "mode" });
                      }
                    }}>
                    {rowEditing("mode") ? (
                      <GlassDropdown
                        value={t.mode}
                        options={[
                          { label: "income", value: "income" },
                          { label: "expense", value: "expense" },
                          { label: "transfer", value: "transfer" },
                        ]}
                        onChange={(v) => {
                          updateTransaction(t.id, {
                            ...t,
                            mode: v as Transaction["mode"],
                            category: v === "transfer" ? undefined : t.category,
                          });
                          setEditing(null);
                        }}
                      />
                    ) : (
                      <span
                        className={
                          t.mode === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        }>
                        {t.mode}
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() =>
                      setEditing({ id: t.id, field: "accountId" })
                    }>
                    {rowEditing("accountId") ? (
                      <GlassDropdown
                        value={t.accountId}
                        options={accounts.map((a) => ({
                          label: a.name,
                          value: a.id,
                        }))}
                        onChange={(v) => {
                          updateTransaction(t.id, {
                            ...t,
                            accountId: v,
                          });
                          setEditing(null);
                        }}
                      />
                    ) : (
                      accounts.find((a) => a.id === t.accountId)?.name || (
                        <span className="italic text-black/30 dark:text-white/30">
                          empty
                        </span>
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

                <div className="h-px bg-black/10" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
