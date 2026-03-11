export type Tasktype = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export const Tasksarray: Tasktype[] = [
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
];
