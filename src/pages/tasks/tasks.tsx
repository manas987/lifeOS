import { Outlet } from "react-router-dom";
import { Taskside } from "./tasksside";
import { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function Tasks() {
  const [toastKey, setToastKey] = useState<number>(0);
  const [open, setOpen] = useState<number | null>(null);
  type Tasktype = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    duedate?: string;
  };

  const [taskslist, settasks] = useState<Tasktype[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskslist));
  }, [taskslist]);

  function addtask(title: string) {
    const newtask: Tasktype = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    settasks((prev) => [...prev, newtask]);
  }

  function toggletask(id: number) {
    settasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  const [deleteundo, setdeleteundo] = useState<Tasktype | null>(null);

  function deleteTask(id: number) {
    const tempdeletestorage = taskslist.find((item) => item.id === id);
    if (!tempdeletestorage) return;
    setdeleteundo(null);
    setTimeout(() => {
      setdeleteundo(tempdeletestorage);
    }, 10);
    settasks((prev) => prev.filter((task) => task.id !== id));
    setOpen(null);
    setToastKey((prev) => prev + 1);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    settasks((prev) => {
      const oldIndex = prev.findIndex((task) => task.id === active.id);
      const newIndex = prev.findIndex((task) => task.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
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

  return (
    <div className="flex">
      <Taskside addtask={addtask} />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        <Outlet
          context={{
            taskslist,
            toggletask,
            open,
            setOpen,
            deleteTask,
            handleDragEnd,
          }}
        />
      </div>
      <div
        className={`fixed bottom-5 left-5 glass-card p-3 flex gap-3 transition-all duration-300 ease-out
  ${deleteundo ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <span>Task deleted</span>
        <button onClick={undodelete}>Undo</button>
      </div>
    </div>
  );
}
