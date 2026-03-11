import { Circle, CheckCircle2 } from "lucide-react";

type TaskProps = {
  title: string;
  completed?: boolean;
  onClick?: () => void;
};

export function Tasklayout({ title, completed = false, onClick }: TaskProps) {
  return (
    <button
      onClick={onClick}
      className={`glass-card p-4 flex items-center gap-3 hover:!bg-white transition duration-150 ${
        completed ? "line-through opacity-60" : ""
      }`}>
      {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      {title}
    </button>
  );
}
