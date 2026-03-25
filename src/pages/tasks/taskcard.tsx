import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Circle, CheckCircle2, Ellipsis, CalendarDays } from "lucide-react";
import type { TaskProps } from "./logic/types";
import { formatDate, formatLocalDate } from "./logic/tasklogic";
import { isPast, isToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Tasklayout({
  title,
  duedate,
  completed = false,
  onClick,
  isOpen,
  onToggle,
  onDelete,
  isediting,
  openedit,
  id,
  edit,
}: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [editinput, seteditinput] = useState<string>(title);
  const [editduedate, seteditduedate] = useState<Date | undefined>(
    duedate ? new Date(duedate) : undefined,
  );

  useEffect(() => {
    if (isediting) {
      seteditinput(title);
      seteditduedate(duedate ? new Date(duedate) : undefined);
    }
  }, [isediting, title, duedate]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isediting ? {} : listeners)}
      className="relative w-full group">
      {isediting ? (
        <div className="glass-card flex flex-col gap-4 p-4 rounded-xl">
          {/* Input */}
          <input
            type="text"
            value={editinput}
            onChange={(e) => seteditinput(e.target.value)}
            placeholder="Task name"
            className="bg-transparent outline-none text-lg font-medium placeholder:text-muted-foreground"
          />

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            {/* Left: Date */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                  <CalendarDays size={16} />
                  <span className="text-sm">
                    {editduedate
                      ? formatDate(formatLocalDate(editduedate))
                      : "Today"}
                  </span>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40">
                <Calendar
                  mode="single"
                  selected={editduedate}
                  onSelect={(date) => seteditduedate(date ?? undefined)}
                  disabled={(date) => date < new Date()}
                  classNames={{
                    month: "space-y-3",
                    caption_label: "text-xl text-gray-800",
                    button_previous:
                      "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                    button_next:
                      "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                    weekdays: "flex mb-2 gap-1",
                    weekday:
                      "w-9 font-normal text-xs text-center text-gray-400",
                    weeks: "space-y-1",
                    week: "flex gap-1",
                    day: "w-9 h-9 text-center p-0",
                    day_button:
                      "w-9 h-9 rounded-xl hover:bg-black/10 transition duration-100",
                    selected:
                      " [&>button]:hover:bg-black/10 [&>button]:font-semibold",
                    disabled:
                      "[&>button]:text-gray-300 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed",
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  seteditinput(title);
                  openedit?.();
                  e.stopPropagation();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
                Cancel
              </button>

              <button
                type="button"
                onClick={(e) => {
                  edit?.(
                    editinput,
                    editduedate ? formatLocalDate(editduedate) : undefined,
                  );
                  openedit?.();
                  e.stopPropagation();
                }}
                className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`glass-card w-full p-4 flex items-center justify-between hover:!bg-white/80 transition duration-150 ${
            completed ? "line-through opacity-60" : ""
          } ${isDragging ? "scale-105 shadow-xl opacity-90 z-50" : ""}`}>
          <button
            onClick={onClick}
            className="flex items-center gap-3 w-full text-left active:cursor-grabbing">
            {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            <div className="flex flex-col leading-tight">
              <span className="truncate">{title}</span>

              {duedate && (
                <span
                  className={`text-xs flex items-center gap-1 mt-1 ${
                    isToday(duedate)
                      ? "text-green-500"
                      : isPast(duedate)
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}>
                  <CalendarDays size={12} className="relative top-[1px]" />
                  {formatDate(duedate)}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className={`shrink-0 ml-2 transition-opacity duration-150 ${
              isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
            <Ellipsis />
          </button>
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute right-0 top-full mt-2 w-36 z-50 glass-card p-2 flex flex-col gap-1 shadow-lg rounded-xl">
            <button
              className="p-2 text-left hover:bg-white/40 rounded"
              onClick={() => {
                openedit?.();
                onToggle?.();
              }}>
              Edit
            </button>
            <button
              className="p-2 text-left hover:bg-white/40 rounded text-red-400"
              onClick={() => onDelete?.()}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
