import { Outlet } from "react-router-dom";
import { Taskside } from "./tasksside";
import { useState } from "react";

export function Tasks() {
  type Tasktype = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
  };

  const [taskslist, settasks] = useState<Tasktype[]>([
    {
      id: 1,
      title: "Finish LifeOS UI",
      completed: false,
      createdAt: "2026-03-11",
    },
    {
      id: 2,
      title: "Review React Router setup",
      completed: false,
      createdAt: "2026-03-11",
    },
    {
      id: 3,
      title: "Plan habit tracking logic",
      completed: true,
      createdAt: "2026-03-10",
    },
    {
      id: 4,
      title: "Design finance dashboard",
      completed: false,
      createdAt: "2026-03-12",
    },
  ]);

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

  return (
    <div className="flex">
      <Taskside addtask={addtask} />
      <div className="flex-1 p-4 pl-9">
        <Outlet context={{ taskslist, toggletask }} />
      </div>
    </div>
  );
}
