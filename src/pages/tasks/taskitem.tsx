import { Circle, CheckCircle2, Ellipsis } from "lucide-react";
import { useState } from "react";

type TaskProps = {
  title: string;
  completed?: boolean;
  onClick?: () => void;
};

export function Tasklayout({ title, completed = false, onClick }: TaskProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative overflow-visible">
      <div
        className={`glass-card p-4 flex justify-between gap-3 hover:!bg-white transition duration-150 overflow-visible ${
          completed ? "line-through opacity-60" : ""
        }`}>
        <button onClick={onClick} className="flex gap-3 items-center">
          {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {title}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}>
          <Ellipsis />
        </button>
      </div>
      {open && (
        <div className="absoulte left-[80%] bottom-20 mt-2 w-36 z-50 glass-card p-2 flex flex-col gap-1">
          <button className="p-2 text-left hover:bg-white/40 rounded">
            Edit
          </button>
          <button className="p-2 text-left hover:bg-white/40 rounded text-red-400">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
