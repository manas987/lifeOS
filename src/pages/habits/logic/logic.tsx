import { useEffect, useState } from "react";
import type { Habit } from "./types";
import type { DateRange } from "react-day-picker";

function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useHabitLogic() {
  const [open, setOpen] = useState<string | null>(null);
  const [editingid, seteditingid] = useState<string | null>(null);
  const [deleteundo, setdeleteundo] = useState<Habit | null>(null);

  const [habitslist, sethabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habitslist));
  }, [habitslist]);

  // ADD
  function addhabit(title: string, selectedDays: number[], range?: DateRange) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newhabit: Habit = {
      id: crypto.randomUUID(),
      title: trimmed,
      completedDates: [],
      repeatOn: selectedDays,
      duration: range
        ? {
            start: range.from?.toISOString() || "",
            end: range.to?.toISOString(),
          }
        : undefined,
    };

    sethabits((prev) => [newhabit, ...prev]);
  }

  // EDIT
  function edithabit(id: string, newtitle: string) {
    const trimmed = newtitle.trim();
    if (!trimmed) return;

    sethabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, title: trimmed } : h)),
    );
  }

  // TOGGLE (daily)
  function togglehabit(id: string) {
    const today = getLocalDate();

    sethabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const alreadyDone = h.completedDates.includes(today);

        return {
          ...h,
          completedDates: alreadyDone
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      }),
    );
  }

  // DELETE
  function deletehabit(id: string) {
    const temp = habitslist.find((h) => h.id === id);
    if (!temp) return;

    setdeleteundo(null);

    setTimeout(() => {
      setdeleteundo(temp);
    }, 10);

    sethabits((prev) => prev.filter((h) => h.id !== id));
    setOpen(null);
  }

  function undodelete() {
    if (!deleteundo) return;
    sethabits((prev) => [deleteundo, ...prev]);
    setdeleteundo(null);
  }

  useEffect(() => {
    if (!deleteundo) return;
    const timer = setTimeout(() => {
      setdeleteundo(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleteundo]);

  // ✅ derive completed
  const today = getLocalDate();

  const habitsWithState = habitslist.map((h) => ({
    ...h,
    completed: h.completedDates.includes(today),
  }));

  return {
    habitslist: habitsWithState,
    sethabits,

    addhabit,
    edithabit,
    deletehabit,
    togglehabit,

    open,
    setOpen,

    editingid,
    seteditingid,

    deleteundo,
    undodelete,
  };
}
