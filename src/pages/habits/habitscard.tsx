import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, EllipsisVertical } from "lucide-react";
import type { DateRange } from "react-day-picker";

type HabitCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function HabbitCard({ title, completed, onToggle }: HabitCardProps) {
  return (
    <div
      className={`glass-card p-3 flex items-center gap-3 transition duration-150 cursor-pointer
      ${completed ? "opacity-60 line-through" : "hover:!bg-white"}`}
      onClick={onToggle}>
      {/* Circle */}
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center
        ${completed ? "bg-black border-black" : "border-black/40"}`}>
        {completed && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      {/* Title */}
      <p className="text-sm truncate">{title}</p>
    </div>
  );
}

export function Addhabitcard() {
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
                day: "w-9 h-9 text-center p-0",
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
type DetailedHabitProps = {
  title: string;
  range?: { from?: Date; to?: Date };
  selectedDays: number[];
};

export function Detailedhabitcard({
  title,
  range,
  selectedDays,
}: DetailedHabitProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

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
      <div className="flex justify-between items-center">
        <p className="bg-transparent border-b outline-none text-2xl pb-1">
          {title}
        </p>
        <EllipsisVertical />
      </div>

      {/* Repeat */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Repeat on</span>

        <div className="flex gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={`w-10 h-8 rounded-full border flex items-center justify-center text-sm transition
              ${
                selectedDays.includes(index)
                  ? "border-green-500 border-2"
                  : "hover:bg-white/30"
              }`}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <span className="text-lg">Duration</span>

        <button className="glass-card flex items-center justify-between px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition">
          <span>
            {range?.from
              ? `${format(range.from)} - ${format(range.to)}`
              : "No duration"}
          </span>

          <CalendarDays size={16} />
        </button>
      </div>
    </div>
  );
}

type DayData = {
  date: string;
  value: number;
};

export function HabitHeatmapCard() {
  const [data, setData] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState<DayData | null>(null);
  const [selected, setSelected] = useState<DayData | null>(null);

  // 🔥 dummy full year data
  useEffect(() => {
    const map: Record<string, number> = {};
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const key = d.toISOString().split("T")[0];
      map[key] = Math.floor(Math.random() * 6);
    }

    setData(map);
  }, []);

  function getColor(value: number) {
    if (value === 0) return "bg-black/10";
    if (value < 2) return "bg-green-300";
    if (value < 4) return "bg-green-500";
    return "bg-green-700";
  }

  // 🔥 build weeks
  function buildWeeks() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 364);

    const weeks: any[] = [];
    let currentWeek: any[] = [];

    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const key = d.toISOString().split("T")[0];

      currentWeek.push({
        date: key,
        value: data[key] || 0,
        day: d.getDay(),
        month: d.getMonth(),
      });

      if (d.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length) weeks.push(currentWeek);

    return weeks;
  }

  const weeks = buildWeeks();

  // 🔥 month labels
  const monthLabels = weeks.map((week) => {
    const d = new Date(week[0].date);
    return d.toLocaleString("default", { month: "short" });
  });

  const uniqueMonths = monthLabels.map((m, i) =>
    i === 0 || m !== monthLabels[i - 1] ? m : "",
  );

  return (
    <div className="glass-card max-w-5xl p-4 pb- flex flex-col  overflow-x-auto relative">
      {/* Header */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Consistency</span>
        <span className="text-xs opacity-70">Last 1 year</span>
      </div>

      {/* Month row */}
      <div className="flex gap-[4px] ml-8 text-xs text-muted-foreground">
        {uniqueMonths.map((m, i) => (
          <div key={i} className="w-[22px] text-center">
            {m}
          </div>
        ))}
      </div>

      <div className="flex relative">
        {/* Weekday labels */}
        <div className="flex flex-col justify-between mr-2 mt-4 text-xs text-muted-foreground h-[90px]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Heatmap */}
        <div className="flex gap-[4px]">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[4px]">
              {week.map((day: any) => (
                <div
                  key={day.date}
                  onMouseEnter={() =>
                    setHovered({ date: day.date, value: day.value })
                  }
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    setSelected({ date: day.date, value: day.value })
                  }
                  className={`
                    w-[15px] h-[15px] rounded-[4px] cursor-pointer
                    ${getColor(day.value)}
                    transition-all duration-200
                    hover:scale-110
                  `}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 🔥 Tooltip */}
        {hovered && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-xs px-2 py-1 rounded bg-black text-white whitespace-nowrap pointer-events-none">
            {hovered.value} habits on {hovered.date}
          </div>
        )}
      </div>

      {/* 🔥 Selected Preview */}
      {selected && (
        <div className="text-xs text-muted-foreground mt-2">
          <span className="font-medium text-black">
            {selected.value} habits
          </span>{" "}
          completed on {selected.date}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-black/10 rounded-[2px]" />
          <div className="w-3 h-3 bg-green-300 rounded-[2px]" />
          <div className="w-3 h-3 bg-green-500 rounded-[2px]" />
          <div className="w-3 h-3 bg-green-700 rounded-[2px]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
