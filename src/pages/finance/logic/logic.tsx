import { useEffect, useState } from "react";
import type { Account, Category, Subscription, TrackItem, Transaction } from "./types";

export function useFinanceLogic() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subscriptions");
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : [];
  });

  const [items, setItems] = useState<TrackItem[]>(() => {
    const saved = localStorage.getItem("debt-items");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("debt-items", JSON.stringify(items));
  }, [items]);

  function addTransaction(
    amount: number,
    mode: "income" | "expense" | "transfer",
    accountId: string,
    date: string,
    toAccountId?: string,
    title?: string,
    category?: string,
    note?: string,
  ) {
    if (!amount || amount <= 0) return;
    if (mode == "transfer") {
      if (accountId === toAccountId) return;
      const temp: Transaction = {
        id: String(Date.now()),
        amount,
        mode: "transfer",
        accountId,
        toAccountId,
        date,
        title,
        category,
        note,
      };
      setTransactions((prev) => [temp, ...prev]);
      setAccounts((prev) =>
        prev.map((acc) => {
          let bal = acc.balance;
          if (acc.id === accountId) bal -= amount;
          if (acc.id === toAccountId) bal += amount;
          return { ...acc, balance: bal };
        }),
      );
    } else {
      if (mode === "income") {
        const temp: Transaction = {
          id: String(Date.now()),
          amount,
          mode: "income",
          accountId,
          toAccountId,
          date,
          title,
          category,
          note,
        };
        setTransactions((prev) => [temp, ...prev]);
        setAccounts((prev) =>
          prev.map((acc) => {
            let bal = acc.balance;
            if (acc.id === accountId) bal += amount;
            return { ...acc, balance: bal };
          }),
        );
      } else {
        const temp: Transaction = {
          id: String(Date.now()),
          amount,
          mode: "expense",
          accountId,
          toAccountId,
          date,
          title,
          category,
          note,
        };
        setTransactions((prev) => [temp, ...prev]);
        setAccounts((prev) =>
          prev.map((acc) => {
            let bal = acc.balance;
            if (acc.id === accountId) bal -= amount;
            return { ...acc, balance: bal };
          }),
        );
      }
    }
  }

  function addCategory(name: string, type: "income" | "expense"): string {
    const id = String(Date.now());

    const newCategory: Category = {
      id,
      name,
      type,
    };

    setCategories((prev) => [...prev, newCategory]);

    return id;
  }

  function addAccount(name: string): string {
    const id = String(Date.now());

    const newAccount: Account = {
      id,
      name,
      balance: 0,
    };

    setAccounts((prev) => [...prev, newAccount]);

    return id;
  }

  function updateTransaction(id: string, newTransaction: Transaction) {
    setTransactions((prev) =>
      prev.map((temp) => (id === temp.id ? newTransaction : temp)),
    );

    const oldtran = transactions.find((t) => t.id === id);

    setAccounts((prev) =>
      prev.map((acc) => {
        let balance = acc.balance;
        if (oldtran?.mode === "income" && acc.id === oldtran.accountId) {
          balance -= oldtran.amount;
        }

        if (oldtran?.mode === "expense" && acc.id === oldtran.accountId) {
          balance += oldtran.amount;
        }

        if (oldtran?.mode === "transfer") {
          if (acc.id === oldtran.accountId) balance += oldtran.amount;
          if (acc.id === oldtran.toAccountId) balance -= oldtran.amount;
        }

        if (
          newTransaction.mode === "income" &&
          acc.id === newTransaction.accountId
        ) {
          balance += newTransaction.amount;
        }

        if (
          newTransaction.mode === "expense" &&
          acc.id === newTransaction.accountId
        ) {
          balance -= newTransaction.amount;
        }

        if (newTransaction.mode === "transfer") {
          if (acc.id === newTransaction.accountId)
            balance -= newTransaction.amount;

          if (acc.id === newTransaction.toAccountId)
            balance += newTransaction.amount;
        }
        return { ...acc, balance };
      }),
    );
  }

  function deleteTransaction(id: string) {
    const t = transactions.find((tx) => tx.id === id);
    if (!t) return;
    setAccounts((prev) =>
      prev.map((acc) => {
        let balance = acc.balance;

        if (t.mode === "income" && acc.id === t.accountId) {
          balance -= t.amount;
        }

        if (t.mode === "expense" && acc.id === t.accountId) {
          balance += t.amount;
        }

        if (t.mode === "transfer") {
          if (acc.id === t.accountId) balance += t.amount;
          if (acc.id === t.toAccountId) balance -= t.amount;
        }

        return { ...acc, balance };
      }),
    );
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }
  function updateAccount(id: string, name: string) {
    if (!name.trim()) return;

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, name } : acc)),
    );
  }
  function deleteAccount(id: string) {
    const used = transactions.some(
      (t) => t.accountId === id || t.toAccountId === id,
    );

    if (used) return; // block

    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  }

  function addSubscription(
    name: string,
    amount: number,
    nextDue: string,
    repeatEvery: string,
  ) {
    const id = String(Date.now());

    const sub: Subscription = {
      id,
      name,
      amount,
      nextDue,
      repeatEvery,
    };

    setSubscriptions((prev) => [...prev, sub]);
  }

  function updateSubscription(id: string, updated: Subscription) {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  function deleteSubscription(id: string) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }
  function updateCategory(id: string, name: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
  }
  function deleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return {
    transactions,
    accounts,
    subscriptions,
    categories,
    items,

    addTransaction,
    addSubscription,
    addCategory,
    addAccount,

    updateTransaction,
    updateAccount,
    updateCategory,

    deleteTransaction,
    deleteAccount,
    deleteCategory,

    updateSubscription,
    deleteSubscription,

    setSubscriptions,
    setItems,
  };
}

export function getLocalDate(d?: Date) {
  const date = d ?? new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
