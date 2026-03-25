import { NavLink } from "react-router-dom";
import { ChevronDown, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { SideBarProps } from "./logic/types";

export function Taskside({ addtask }: SideBarProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [calopen, setcalopen] = useState<boolean>(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80">
      <div className="p-1">
        <h1 className="text-5xl font-light">Tasks</h1>
      </div>

      <NavLink
        to="/tasks"
        end
        className={({ isActive }) => linkClass(isActive)}>
        Inbox
      </NavLink>

      <NavLink
        to="/tasks/today"
        className={({ isActive }) => linkClass(isActive)}>
        Today
      </NavLink>

      <NavLink
        to="/tasks/upcoming"
        className={({ isActive }) => linkClass(isActive)}>
        Upcoming
      </NavLink>

      <NavLink
        to="/tasks/completed"
        className={({ isActive }) => linkClass(isActive)}>
        Completed
      </NavLink>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addtask(title, date);
          setTitle("");
          setDate(undefined);
        }}
        className="glass-card p-4 flex flex-col gap-2">
        <h3 className="mb-2">Add task</h3>

        <div className="flex gap-2 items-stretch">
          <input
            value={title}
            type="text"
            placeholder="task name"
            className="glass-card p-3 flex-1"
            onChange={(e) => setTitle(e.target.value)}
          />

          <Popover open={calopen} onOpenChange={setcalopen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`glass-card px-3 min-w-[55px] flex items-center justify-center whitespace-nowrap gap-1 transition duration-150 hover:!bg-white ${
                  date ? "font-medium" : ""
                }`}>
                {date ? (
                  <>
                    <CalendarDays size={13} />
                    <span className="text-sm">
                      {date.getDate()}{" "}
                      {date.toLocaleString("default", { month: "short" })}
                    </span>
                  </>
                ) : (
                  <CalendarDays size={16} className="opacity-80" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  if (d) setcalopen(false);
                }}
                disabled={(date) => date < today}
                formatters={{
                  formatWeekdayName: (d) =>
                    d.toLocaleString("default", { weekday: "narrow" }),
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
        </div>

        <button
          type="submit"
          className="glass-card p-2 hover:!bg-white transition duration-150">
          Add
        </button>
      </form>

      <div className="glass-card w-full p-3 flex justify-between items-center hover:!bg-white transition duration-150">
        Projects
        <button className="hover:bg-[#dadada] rounded-full p-1">
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
