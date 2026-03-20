import { Outlet } from "react-router-dom";
import { Taskside } from "./tasksside";
import { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function Tasks() {
  const [open, setOpen] = useState<number | null>(null);
  type Tasktype = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    // duedate: string;
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

  function deleteTask(id: number) {
    settasks((prev) => prev.filter((task) => task.id !== id));
    setOpen(null);
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
    </div>
  );
}
