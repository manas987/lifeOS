import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, Circle, CircleCheckBig, Trash } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  AddHabitProps,
  DetailedHabitProps,
  Habit,
  HabitCardProps,
} from "./logic/types";
import { getLocalDate } from "./logic/logic";

export function HabbitCard({
  title,
  completed,
  onToggle,
  streak,
}: HabitCardProps) {
  return (
    <div className="glass-card px-3 py-2 rounded-xl flex items-center justify-between transition-all duration-200 hover:shadow-md">
      {/* Left section */}
      <div
        onClick={onToggle}
        className={`flex items-center gap-3 cursor-pointer flex-1 p-2 rounded-lg transition-all duration-150
        ${
          completed
            ? "opacity-50 line-through"
            : "hover:bg-white/40 dark:hover:bg-white/10"
        }`}>
        <div
          className={`transition-all ${
            completed ? "text-green-500 scale-110" : "text-gray-500"
          }`}>
          {completed ? <CircleCheckBig size={20} /> : <Circle size={20} />}
        </div>

        <p className="text-sm truncate">{title}</p>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-orange-100/70 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
        Streak: {streak} days
      </div>
    </div>
  );
}

export function Addhabitcard({ onAdd }: AddHabitProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const [title, settitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();

  function toggleDay(index: number) {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index],
    );
  }

  function format(date?: Date) {
    if (!date) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="glass-card w-full max-w-md mx-auto flex flex-col p-5 pt-1 pb-1 gap-4 rounded-2xl">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => settitle(e.target.value)}
        placeholder="Title"
        className="bg-transparent border-b outline-none text-2xl pb-1"
      />

      {/* Repeat */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Repeat on</span>

        <div className="flex gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={`w-10 h-8 rounded-full border flex items-center justify-center text-sm transition
              ${
                selectedDays.includes(index)
                  ? "border-green-500 border-2"
                  : "hover:bg-white/30"
              }`}>
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Duration</span>

        <Popover>
          <PopoverTrigger asChild>
            <button className="glass-card flex items-center justify-between px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition">
              <span>
                {range?.from
                  ? `${format(range.from)} - ${format(range.to)}`
                  : "Select duration"}
              </span>

              <CalendarDays size={16} />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                return d < today;
              }}
              classNames={{
                month: "space-y-3",
                caption_label: "text-xl text-gray-800",
                button_previous:
                  "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                button_next:
                  "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                weekdays: "flex mb-2 gap-1",
                weekday: "w-9 font-normal text-xs text-center text-gray-400",
                weeks: "space-y-1",
                week: "flex ",
                day: "w-10 h-9 text-center p-0",
                day_button:
                  "w-9 h-9 rounded-xl hover:bg-black/10 transition duration-100 flex items-center justify-center",
                today: "[&>button]:border [&>button]:border-black/40",
                range_middle: "bg-black/10",
                range_start:
                  "bg-black/10 rounded-l-xl [&>button]:bg-black [&>button]:text-white",
                range_end:
                  "bg-black/10 rounded-r-xl [&>button]:bg-black [&>button]:text-white",
                disabled:
                  "[&>button]:text-gray-300 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <button
        onClick={() => {
          if (!title.trim()) return;

          onAdd(title, selectedDays, range);

          settitle("");
          setSelectedDays([]);
          setRange(undefined);
        }}
        className="
         glass-card 
         w-full 
         py-2.5 
         rounded-xl 
         text-sm 
         font-medium 
         tracking-wide
         transition-all duration-200
         hover:!bg-white 
         active:scale-[0.98]
         active:shadow-inner">
        Add
      </button>
    </div>
  );
}

export function Detailedhabitcard({
  id,
  title,
  range,
  selectedDays,
  onUpdate,
  onDelete,
  streak,
}: DetailedHabitProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const [localTitle, setLocalTitle] = useState(title);
  const [localDays, setLocalDays] = useState(selectedDays);
  const [localRange, setLocalRange] = useState<DateRange | undefined>(range);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  useEffect(() => {
    if (
      localTitle === title &&
      JSON.stringify(localDays) === JSON.stringify(selectedDays) &&
      JSON.stringify(localRange) === JSON.stringify(range)
    )
      return;

    const timeout = setTimeout(() => {
      onUpdate({
        title: localTitle,
        selectedDays: localDays,
        range: localRange,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [localTitle, localDays, localRange, onUpdate, title, selectedDays, range]);

  function format(date?: Date) {
    if (!date) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card relative w-full max-w-md mx-auto flex flex-col p-5 pt-1 pb-1 gap-4 rounded-2xl">
      {/* Title */}
      <div className="flex justify-between items-center">
        <input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className="bg-transparent border-b outline-none text-2xl pb-1 w-full"
        />

        <div className="flex items-center gap-2">
          <div className="text-xs px-2 py-1 rounded-md bg-orange-100/70 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 whitespace-nowrap">
            🔥 {streak}
          </div>
          <button
            onClick={onDelete}
            className="hover:bg-red-100 text-red-500 rounded-lg p-2">
            <Trash size={20} />
          </button>
        </div>
      </div>

      {/* Repeat */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Repeat on</span>

        <div className="flex gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() =>
                setLocalDays((prev) =>
                  prev.includes(index)
                    ? prev.filter((d) => d !== index)
                    : [...prev, index],
                )
              }
              className={`w-10 h-8 rounded-full border flex items-center justify-center text-sm transition
      ${
        localDays.includes(index)
          ? "border-green-500 border-2"
          : "hover:bg-white/30"
      }`}>
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Duration</span>

        <Popover>
          <PopoverTrigger asChild>
            <button className="glass-card flex items-center justify-between px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition">
              <span>
                {localRange?.from
                  ? `${format(localRange.from)} - ${format(localRange.to)}`
                  : "Select duration"}
              </span>

              <CalendarDays size={16} />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40">
            <Calendar
              mode="range"
              selected={localRange}
              onSelect={setLocalRange}
              numberOfMonths={1}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                return d < today;
              }}
              classNames={{
                month: "space-y-3",
                caption_label: "text-xl text-gray-800",
                button_previous:
                  "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                button_next:
                  "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center",
                weekdays: "flex mb-2 gap-1",
                weekday: "w-9 font-normal text-xs text-center text-gray-400",
                weeks: "space-y-1",
                week: "flex ",
                day: "w-10 h-9 text-center",
                day_button:
                  "w-9 h-9 rounded-xl hover:bg-black/10 transition duration-100 flex items-center justify-center",
                today: "[&>button]:border [&>button]:border-black/40",
                range_middle: "bg-black/10",
                range_start:
                  "bg-black/10 rounded-l-xl [&>button]:bg-black [&>button]:text-white",
                range_end:
                  "bg-black/10 rounded-r-xl [&>button]:bg-black [&>button]:text-white",
                disabled:
                  "[&>button]:text-gray-300 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function HabitHeatmapCard({ habitlist }: { habitlist: Habit[] }) {
  const completeddates = habitlist.flatMap((temp) => temp.completedDates);

  const data: Map<string, number> = new Map();

  for (const date of completeddates) {
    data.set(date, (data.get(date) ?? 0) + 1);
  }

  const weeks: string[][] = [];
  const today = new Date(getLocalDate());
  const start = new Date(today);
  start.setDate(today.getDate() - 52 * 7);
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  const cur = new Date(start);
  for (let w = 0; w < 53; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(getLocalDate(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  function getColor(value: number) {
    if (value === 0) return "bg-black/10";
    if (value === 2) return "bg-green-300";
    if (value === 4) return "bg-green-400";
    return "bg-green-500";
  }
  const todayStr = getLocalDate(today);
  console.log(data);
  return (
    <div className="flex gap-[3px] glass-card p-4">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((dateStr) => {
            const value = data.get(dateStr) || 0;
            return (
              <div key={dateStr} className="relative group">
                <div
                  className={`w-[14px] h-[14px] rounded-sm ${dateStr > todayStr ? "bg-transparent" : getColor(value)}`}
                />
                <div className="absolute bottom-full z-50 mb-2 hidden group-hover:block text-xs px-2 py-1 rounded bg-black text-white whitespace-nowrap ">
                  {value} habbits on {dateStr}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
