import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { Account, Category, Transaction } from "./logic/types";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { CalendarDays, Plus, Check, Trash, Pencil } from "lucide-react";

type Sidebarprops = {
  addTransaction: (
    amount: number,
    mode: "income" | "expense" | "transfer",
    accountId: string,
    date: string,
    toAccountId?: string,
    title?: string,
    category?: string,
    note?: string,
  ) => void;
  categories: Category[];
  accounts: Account[];
  addAccount: (name: string) => string;
  addcategory: (name: string, mode: "income" | "expense") => string;
  transactions: Transaction[];
  updateAccount: (id: string, name: string) => void;
  deleteAccount: (id: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
};

export function FinanceSideBar({
  addTransaction,
  categories,
  addcategory,
  accounts,
  addAccount,
  transactions,
  updateAccount,
  deleteAccount,
  updateCategory,
  deleteCategory,
}: Sidebarprops) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [mode, setMode] = useState<"expense" | "income" | "transfer">(
    "expense",
  );

  const [categoryId, setCategoryId] = useState("");
  const [account, setAccount] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [showCategory, setShowCategory] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showToAccount, setShowToAccount] = useState(false);

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const filteredCategories = categories.filter((c) => c.type === mode);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedAccount = accounts.find((a) => a.id === account);
  const selectedToAccount = accounts.find((a) => a.id === toAccountId);

  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive
        ? "!bg-black/80 text-white"
        : "hover:!bg-white dark:hover:!bg-white/10"
    }`;

  function handleModeChange(nextMode: "expense" | "income" | "transfer") {
    setMode(nextMode);
    setCategoryId("");
    setToAccountId("");
    setShowCategory(false);
    setShowAccount(false);
    setShowToAccount(false);
    setAddingCategory(false);
    setNewCategoryName("");
  }

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    const id = addcategory(name, mode === "income" ? "income" : "expense");
    setCategoryId(id);
    setNewCategoryName("");
    setAddingCategory(false);
    setShowCategory(false);
  }

  function handleAddAccount() {
    const name = newAccountName.trim();
    if (!name) return;

    const id = addAccount(name);
    setAccount(id);
    setNewAccountName("");
    setAddingAccount(false);
    setShowAccount(false);
  }

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0 overflow-visible">
      <div className="p-1">
        <h1 className="text-5xl font-light">Finances</h1>
      </div>

      <NavLink
        to="/finances"
        end
        className={({ isActive }) => linkClass(isActive)}>
        Dashboard
      </NavLink>

      <NavLink
        to="/finances/logs"
        className={({ isActive }) => linkClass(isActive)}>
        Logs
      </NavLink>

      <NavLink
        to="/finances/debt"
        className={({ isActive }) => linkClass(isActive)}>
        Debt
      </NavLink>

      <NavLink
        to="/finances/subscriptions"
        className={({ isActive }) => linkClass(isActive)}>
        Subscriptions
      </NavLink>

      <div className="glass-card p-4 pt-1 flex flex-col gap-3 overflow-visible">
        <h3 className="text-lg font-light -mb-1 -mt-1">Add Transaction</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="glass-card p-3"
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name"
          className="glass-card p-3 text-sm"
        />

        <div className="flex gap-2">
          {(["expense", "income", "transfer"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex-1 glass-card p-2 ${
                mode === m
                  ? "!bg-black/80 text-white"
                  : "hover:!bg-white dark:hover:!bg-white/10"
              }`}>
              {m}
            </button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="glass-card flex items-center justify-between px-4 py-2 rounded-xl text-sm hover:!bg-white dark:hover:!bg-white/10 transition">
              <span>{date ? format(date, "dd MMM yyyy") : "Select date"}</span>
              <CalendarDays size={16} />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40 dark:bg-black ">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              classNames={{
                month: "space-y-3",
                caption_label: "text-xl text-gray-800 dark:text-white",
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

        {mode !== "transfer" && (
          <div className="relative overflow-visible">
            <button
              onClick={() => setShowCategory((p) => !p)}
              className="glass-card p-3 pt-2 pb-2 hover:!bg-white dark:hover:!bg-white/10 w-full">
              <div className="flex justify-between items-center">
                <span>{selectedCategory?.name || "Category"}</span>
                <span>{">"}</span>
              </div>
            </button>

            {showCategory && (
              <div className="absolute left-0 top-full mt-2 z-50 w-full rounded-2xl border border-white/40 bg-white/90 dark:bg-black/80 backdrop-blur-lg shadow-xl overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {filteredCategories.map((c) => (
                    <div
                      key={c.id}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-black/5 ${
                        c.id === categoryId ? "bg-black/10" : ""
                      }`}
                      onClick={() => {
                        setCategoryId(c.id);
                        setShowCategory(false);
                        setAddingCategory(false);
                        setNewCategoryName("");
                      }}>
                      <span>{c.name}</span>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const name = prompt("Edit category", c.name);
                            if (!name) return;
                            updateCategory(c.id, name);
                          }}>
                          <Pencil size={14} />
                        </button>

                        <button
                          disabled={c.id === categoryId}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(c.id);

                            if (categoryId === c.id) setCategoryId("");
                          }}>
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-black/10" />

                {!addingCategory ? (
                  <button
                    onClick={() => setAddingCategory(true)}
                    className="w-full px-3 py-2 text-left hover:bg-black/5 flex items-center gap-2">
                    <Plus size={14} />
                    Add category
                  </button>
                ) : (
                  <div className="p-3 flex gap-2">
                    <input
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category"
                      className="glass-card flex-1 p-2 text-sm"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="glass-card px-3 py-2 text-sm">
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative overflow-visible">
          <button
            onClick={() => setShowAccount((p) => !p)}
            className="glass-card p-3 pt-2 pb-2 hover:!bg-white dark:hover:!bg-white/10 w-full">
            <div className="flex justify-between items-center">
              <span>{selectedAccount?.name || "Account"}</span>
              <span>{">"}</span>
            </div>
          </button>

          {showAccount && (
            <div className="absolute left-0 top-full mt-2 z-50 w-full rounded-2xl border border-white/40 bg-white/90 dark:bg-black/80 backdrop-blur-lg shadow-xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-black/5 ${
                      acc.id === account ? "bg-black/10" : ""
                    }`}
                    onClick={() => {
                      setAccount(acc.id);
                      setShowAccount(false);
                      setAddingAccount(false);
                      setNewAccountName("");
                    }}>
                    <span>{acc.name}</span>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const name = prompt("Edit account", acc.name);
                          if (!name) return;
                          updateAccount(acc.id, name);
                        }}>
                        <Pencil size={14} />
                      </button>

                      <button
                        disabled={transactions.some((t) => {
                          if (t.mode === "transfer") {
                            return (
                              t.accountId === acc.id || t.toAccountId === acc.id
                            );
                          }
                          return t.accountId === acc.id;
                        })}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAccount(acc.id);

                          if (account === acc.id) setAccount("");

                          if (toAccountId === acc.id) setToAccountId("");
                        }}>
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-black/10" />

              {!addingAccount ? (
                <button
                  onClick={() => setAddingAccount(true)}
                  className="w-full px-3 py-2 text-left hover:bg-black/5 flex items-center gap-2">
                  <Plus size={14} />
                  Add account
                </button>
              ) : (
                <div className="p-3 flex gap-2">
                  <input
                    autoFocus
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="New account"
                    className="glass-card flex-1 p-2 text-sm"
                  />
                  <button
                    onClick={handleAddAccount}
                    className="glass-card px-3 py-2 text-sm">
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {mode === "transfer" && (
          <div className="relative overflow-visible">
            <button
              onClick={() => setShowToAccount((p) => !p)}
              className="glass-card p-3 pt-2 pb-2 hover:!bg-white dark:hover:!bg-white/10 w-full">
              <div className="flex justify-between items-center">
                <span>{selectedToAccount?.name || "To Account"}</span>
                <span>{">"}</span>
              </div>
            </button>

            {showToAccount && (
              <div className="absolute left-0 top-full mt-2 z-50 w-full rounded-2xl border border-white/40 bg-white/90 backdrop-blur-lg shadow-xl overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {accounts
                    .filter((a) => a.id !== account)
                    .map((acc) => (
                      <div
                        key={acc.id}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-black/5 ${
                          acc.id === toAccountId ? "bg-black/10" : ""
                        }`}
                        onClick={() => {
                          setToAccountId(acc.id);
                          setShowToAccount(false);
                        }}>
                        <span>{acc.name}</span>

                        <div className="flex items-center gap-2">
                          {acc.id === toAccountId && <Check size={14} />}ƒ
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const name = prompt("Edit account", acc.name);
                              if (!name) return;
                              updateAccount(acc.id, name);
                            }}>
                            <Pencil size={14} />
                          </button>
                          <button
                            disabled={transactions.some(
                              (t) =>
                                t.accountId === acc.id ||
                                t.toAccountId === acc.id,
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAccount(acc.id);
                            }}>
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add note..."
          className="glass-card p-5 resize-none text-left"
          rows={2}
        />

        <button
          className="glass-card p-3 pt-2 hover:!bg-white dark:hover:!bg-white/10 transition -mb-14"
          onClick={() => {
            if (!amount || Number(amount) <= 0 || !account || !date) return;
            if (
              mode === "transfer" &&
              (!toAccountId || account === toAccountId)
            )
              return;

            addTransaction(
              Number(amount),
              mode,
              account,
              date.toISOString().slice(0, 10),
              mode === "transfer" ? toAccountId : undefined,
              title,
              mode === "transfer" ? undefined : categoryId,
              note,
            );

            setAmount("");
            setTitle("");
            setCategoryId("");
            setAccount("");
            setNote("");
            setToAccountId("");
          }}>
          Add
        </button>
      </div>
    </div>
  );
}
