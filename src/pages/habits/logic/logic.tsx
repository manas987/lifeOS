import { useEffect, useState } from "react";
import type { Habit } from "./types";
import type { DateRange } from "react-day-picker";
import { arrayMove } from "@dnd-kit/sortable";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

export function useHabitLogic() {
  const [open, setOpen] = useState<string | null>(null);
  const [editingid, seteditingid] = useState<string | null>(null);
  const [deleteundo, setdeleteundo] = useState<Habit | null>(null);
  const today = getLocalDate();

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

  function updateHabit(
    id: string,
    data: {
      title: string;
      selectedDays: number[];
      range?: { from?: Date; to?: Date };
    },
  ) {
    sethabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        return {
          ...h,
          title: data.title,
          repeatOn: data.selectedDays,
          duration: data.range
            ? {
                start: data.range.from?.toISOString() || "",
                end: data.range.to?.toISOString(),
              }
            : undefined,
        };
      }),
    );
  }

  // TOGGLE (daily)
  function togglehabit(id: string) {
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

    sethabits((prev) => [...prev, deleteundo]);
    setdeleteundo(null);
  }

  useEffect(() => {
    if (!deleteundo) return;

    const timer = setTimeout(() => {
      setdeleteundo(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleteundo]);

  const habitsWithState = habitslist.map((h) => ({
    ...h,
    completed: h.completedDates.includes(today),
  }));

  function reorderHabits(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    sethabits((prev) => {
      const oldIndex = prev.findIndex((h) => h.id === active.id);
      const newIndex = prev.findIndex((h) => h.id === over.id);

      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return {
    habitslist: habitsWithState,
    sethabits,

    addhabit,
    deletehabit,
    togglehabit,

    open,
    setOpen,

    editingid,
    seteditingid,

    deleteundo,
    undodelete,
    updateHabit,
    reorderHabits,
    sensors,
  };
}

export function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
