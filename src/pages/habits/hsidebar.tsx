import { NavLink } from "react-router-dom";
import { Addhabitcard } from "./habitscard";
import type { Propssidebar } from "./logic/types";

function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function Habitside({ habitLogic }: Propssidebar) {
  const { habitslist, addhabit } = habitLogic;
  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;

  const today = getLocalDate();

  const total = habitslist.length;

  const completed = habitslist.filter((h) =>
    h.completedDates.includes(today),
  ).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0">
      <div className="p-1">
        <h1 className="text-5xl font-light">Habits</h1>
      </div>
      <NavLink
        to="/habits"
        end
        className={({ isActive }) => linkClass(isActive)}>
        Inbox
      </NavLink>

      <NavLink
        to="/habits/allhabits"
        className={({ isActive }) => linkClass(isActive)}>
        Habits List
      </NavLink>

      <div className="w-full max-w-md mx-auto flex flex-col glass-card p-4 pt-3 pb-2">
        {/* Label */}
        <div className="flex justify-between text-m ">
          <span>Today</span>
          <span>{progress}%</span>
        </div>

        {/* Bar */}
        <div className="w-full mt-2 h-2.5 rounded-full bg-black/10 overflow-hidden">
          <div
            className="h-full bg-black/60 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Addhabitcard onAdd={addhabit} />
    </div>
  );
}
