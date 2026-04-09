import { useEffect, useState } from "react";
import type { Tasktype } from "./types";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { formatLocalDate } from "./taskutils";

export function UseTaskLogic() {
  const [open, setOpen] = useState<number | null>(null);
  const [editingid, seteditingid] = useState<number | null>(null);
  const [deleteundo, setdeleteundo] = useState<Tasktype | null>(null);
  const [projlist, setprojlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [taskslist, settasks] = useState<Tasktype[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskslist));
  }, [taskslist]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projlist));
  }, [projlist]);

  function addproj(newproj: string) {
    const trimmed = newproj.trim();
    if (!trimmed) return;
    if (projlist.includes(newproj)) return;
    if (projlist.includes(trimmed)) return;
    setprojlist((prev) => [...prev, trimmed]);
  }
  function deleteproj(delproj: string) {
    setprojlist((prev) => prev.filter((proj) => proj !== delproj));
    settasks((prev) => prev.filter((task) => task.project !== delproj));
  }
  function editproj(newprojname: string, oldprojname: string) {
    const trimmed = newprojname.trim();
    if (!trimmed) return;
    if (projlist.includes(newprojname)) return;
    if (projlist.includes(trimmed)) return;
    setprojlist((prev) =>
      prev.map((proj) => (proj === oldprojname ? trimmed : proj)),
    );
  }

  function addtask(title: string, duedate?: Date, projname?: string) {
    const newtask: Tasktype = {
      id: Date.now(),
      title,
      completed: false,
      duedate: duedate ? formatLocalDate(duedate) : undefined,
      project: projname ? projname : undefined,
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
              duedate: newduedate ? formatLocalDate(newduedate) : undefined,
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
    setdeleteundo(tempdeletestorage);
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
    }, 5000);
    return () => clearTimeout(timer);
  }, [deleteundo]);

  function handleDragEnd(event: DragEndEvent) {
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
    projlist,
    addproj,
    deleteproj,
    editproj,
  };
}
