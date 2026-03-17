import { Outlet } from "react-router-dom";
import { Taskside } from "./tasksside";
import { useEffect, useState } from "react";

export function Tasks() {
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

  return (
    <div className="flex">
      <Taskside addtask={addtask} />
      <div className="flex-1 p-4 pl-9">
        <Outlet context={{ taskslist, toggletask }} />
      </div>
    </div>
  );
}
