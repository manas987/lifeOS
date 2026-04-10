import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  CalendarDays,
  ChevronRight,
  Plus,
  Ellipsis,
} from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { SideBarProps } from "./logic/types";

export function Taskside({
  addtask,
  addproj,
  deleteproj,
  editproj,
  projlist,
  currentlyon,
}: SideBarProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [calopen, setcalopen] = useState<boolean>(false);
  const [projlistshow, toggleprojlistshow] = useState<boolean>(true);
  const [addingproj, setaddingproj] = useState<boolean>(false);
  const [projname, setprojname] = useState<string>("");
  const [openproj, setopenproj] = useState<string | null>(null);
  const [editingproj, seteditingproj] = useState<string | null>(null);
  const [editprojval, seteditprojval] = useState<string>("");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive
        ? "!bg-black/80 text-white"
        : "hover:!bg-white dark:hover:!bg-white/10 "
    }`;

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0">
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
          console.log(date);
          e.preventDefault();
          if (!title.trim()) return;
          if (currentlyon) {
            addtask(title, date, currentlyon);
          } else addtask(title, date);
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
                className={`glass-card px-3 min-w-[55px] flex items-center justify-center whitespace-nowrap gap-1 transition duration-150 hover:!bg-white dark:hover:!bg-white/10 ${
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

            <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-lg border border-white/40  dark:bg-black dark:border-white/30">
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
                  caption_label: "text-xl text-gray-800 dark:text-white",
                  button_previous:
                    "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-center dark:text-white",
                  button_next:
                    "h-8 w-10 hover:bg-black/10 rounded-lg transition duration-100 flex items-center justify-cente dark:text-white",
                  weekdays: "flex mb-2 gap-1 dark:text-white",
                  weekday:
                    "w-9 font-normal text-xs text-center text-gray-400 dark:text-white ",
                  weeks: "space-y-1",
                  week: "flex gap-1",
                  day: "w-9 h-9 text-center p-0 dark:text-white",
                  day_button:
                    "w-9 h-9 rounded-xl hover:bg-black/10 transition duration-100 ",
                  selected:
                    " [&>button]:hover:bg-black/10 [&>button]:font-semibold",
                  disabled:
                    "[&>button]:text-gray-300 dark:[&>button]:text-white/80 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed ",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          type="submit"
          className="glass-card p-2 hover:!bg-white dark:hover:!bg-white/10 transition duration-150">
          Add
        </button>
      </form>

      <div className="glass-card w-full p-3 pl-4 flex justify-between items-center hover:!bg-white dark:hover:!bg-white/10  transition duration-150">
        Projects
        <div className=" ml-auto flex items-center gap-2">
          <button
            className="hover:bg-[#dadada] dark:hover:!bg-white/10  rounded-full p-1"
            onClick={() => setaddingproj((prev) => !prev)}>
            <Plus size={18} />
          </button>
          <button
            className="hover:bg-[#dadada] dark:hover:!bg-white/10  rounded-full p-1"
            onClick={() => toggleprojlistshow((prev) => !prev)}>
            {projlistshow ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
      </div>
      {addingproj && (
        <div className="glass-card w-full p-3 pl-4 flex flex-col gap-3 hover:!bg-white dark:hover:!bg-white/10  transition duration-150">
          <input
            type="text"
            placeholder="Project name"
            value={projname}
            className="glass-card p-3 flex-1"
            onChange={(e) => setprojname(e.target.value)}
          />
          <button
            type="submit"
            className="glass-card p-2 hover:!bg-white dark:hover:!bg-white/10  transition duration-150"
            onClick={() => {
              addproj(projname);
              setprojname("");
              setaddingproj(false);
            }}>
            Add
          </button>
        </div>
      )}
      {projlistshow && (
        <div className="flex flex-col gap-3">
          {projlist.map((proj) => (
            <div key={proj} className="relative group">
              {editingproj === proj ? (
                <div className="glass-card p-3 flex flex-col gap-2">
                  <input
                    value={editprojval}
                    onChange={(e) => seteditprojval(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editprojval.trim()) {
                        editproj(editprojval, proj);
                        seteditingproj(null);
                      }
                    }}
                    className="glass-card p-2 flex-1"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => seteditingproj(null)}
                      className="glass-card p-1.5 text-sm flex-1 hover:!bg-white dark:hover:!bg-white/10 transition">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editprojval.trim()) {
                          editproj(editprojval, proj);
                          seteditingproj(null);
                        }
                      }}
                      className="glass-card p-1.5 text-sm flex-1 hover:!bg-white dark:hover:!bg-white/10 transition">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={`/tasks/project/${proj}`}
                  className={({ isActive }) => linkClass(isActive)}>
                  <span className="flex items-center justify-between">
                    {proj}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setopenproj(openproj === proj ? null : proj);
                      }}
                      className={`transition-opacity duration-150 hover:bg-black/10 rounded-full p-0.5 ${
                        openproj === proj
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}>
                      <Ellipsis size={16} />
                    </button>
                  </span>
                </NavLink>
              )}

              {openproj === proj && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setopenproj(null)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 z-50 glass-card p-2 flex flex-col gap-1 shadow-lg rounded-xl">
                    <button
                      className="p-2 text-left hover:bg-white/40 rounded text-sm"
                      onClick={() => {
                        seteditingproj(proj);
                        seteditprojval(proj);
                        setopenproj(null);
                      }}>
                      Edit
                    </button>
                    <button
                      className="p-2 text-left hover:bg-white/40 rounded text-sm text-red-400"
                      onClick={() => {
                        deleteproj(proj);
                        setopenproj(null);
                      }}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
