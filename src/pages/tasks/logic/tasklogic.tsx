import { useEffect, useState } from "react";
import type { Tasktype } from "./types";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
export function formatLocalDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function UseTaskLogic() {
  const [open, setOpen] = useState<number | null>(null);
  const [editingid, seteditingid] = useState<number | null>(null);
  const [deleteundo, setdeleteundo] = useState<Tasktype | null>(null);
  const [taskslist, settasks] = useState<Tasktype[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskslist));
  }, [taskslist]);

  function addtask(title: string, duedate?: Date) {
    const newtask: Tasktype = {
      id: Date.now(),
      title,
      completed: false,
      duedate: duedate ? formatLocalDate(duedate) : undefined,
    };
    settasks((prev) => [...prev, newtask]);
  }

  function edittask(id: number, newtitle: string, newduedate?: Date) {
    settasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: newtitle,
              duedate: newduedate ? formatLocalDate(newduedate) : t.duedate,
            }
          : t,
      ),
    );
  }

  function toggletask(id: number) {
    settasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: number) {
    const tempdeletestorage = taskslist.find((item) => item.id === id);
    if (!tempdeletestorage) return;
    setdeleteundo(null);
    setTimeout(() => {
      setdeleteundo(tempdeletestorage);
    }, 10);
    settasks((prev) => prev.filter((task) => task.id !== id));
    setOpen(null);
  }

  function undodelete() {
    if (!deleteundo) return;
    settasks((prev) => [...prev, deleteundo]);
    setdeleteundo(null);
  }

  useEffect(() => {
    if (!deleteundo) return;
    const timer = setTimeout(() => {
      setdeleteundo(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [deleteundo]);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id || over.id === "overdue") return;

    const activetask = taskslist.find((t) => t.id === active.id);
    const overtask = taskslist.find((t) => t.id === over.id);
    const oldindex = taskslist.findIndex((t) => t.id === active.id);
    const newindex = taskslist.findIndex((t) => t.id === over.id);

    const todayStr = formatLocalDate(new Date());
    if (overtask?.duedate && overtask.duedate < todayStr) {
      if (!activetask?.duedate || activetask.duedate >= todayStr) return;
    }

    if (
      activetask?.duedate === overtask?.duedate ||
      (activetask?.duedate &&
        overtask?.duedate &&
        activetask?.duedate < todayStr &&
        overtask?.duedate < todayStr)
    ) {
      settasks((prev) => arrayMove(prev, oldindex, newindex));
    } else {
      let newDate: string | undefined = undefined;
      if (typeof over.id === "string") newDate = over.id;
      if (typeof over.id === "number" && overtask?.duedate)
        newDate = overtask.duedate;
      if (!newDate) return;
      settasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, duedate: newDate } : t)),
      );
    }
  }

  function HandelReorder(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    settasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
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
    edittask,
    open,
    setOpen,
    editingid,
    seteditingid,
    deleteundo,
    setdeleteundo,
    taskslist,
    settasks,
    addtask,
    toggletask,
    deleteTask,
    undodelete,
    handleDragEnd,
    HandelReorder,
    sensors,
  };
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })}`;
}

export function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export function isPast(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return d < t;
}

export function FormatHeader(dateStr: string) {
  const d = new Date(dateStr);

  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const weekday = d.toLocaleString("default", { weekday: "long" });

  const todayDate = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(todayDate.getDate() + 1);

  const isToday = d.toDateString() === todayDate.toDateString();

  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  let label = "";
  if (isToday) label = "Today";
  else if (isTomorrow) label = "Tomorrow";

  return `${day} ${month}${label ? ` · ${label}` : ""} · ${weekday}`;
}
