import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Circle, CheckCircle2, Ellipsis } from "lucide-react";

type TaskProps = {
  title: string;
  completed?: boolean;
  onClick?: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  id: number;
};
export function Tasklayout({
  title,
  completed = false,
  onClick,
  isOpen,
  onToggle,
  onDelete,
  id,
}: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative w-full group">
      <div
        className={`glass-card w-full p-4 flex items-center justify-between hover:!bg-white/80 transition duration-150 ${
          completed ? "line-through opacity-60" : ""
        } ${isDragging ? "scale-105 shadow-xl opacity-90 z-50" : ""}`}>
        <button
          onClick={onClick}
          className="flex items-center gap-3 w-full text-left cursor-grab active:cursor-grabbing"
          {...listeners}>
          {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          <span className="truncate">{title}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`shrink-0 ml-2 transition-opacity duration-150 ${
            isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
          <Ellipsis />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute right-0 top-full mt-2 w-36 z-50 glass-card p-2 flex flex-col gap-1 shadow-lg rounded-xl">
            <button className="p-2 text-left hover:bg-white/40 rounded">
              Edit
            </button>
            <button
              className="p-2 text-left hover:bg-white/40 rounded text-red-400"
              onClick={onDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
