import { NavLink } from "react-router-dom";
import { MoonStar, Sun } from "lucide-react";
import { useContext } from "react";
import { Mycontext } from "./context/AppContext";

export function Navbar() {
  const { mode, setmode } = useContext(Mycontext);

  return (
    <div>
      <div className="flex justify-between p-5">
        <div className="border border-[#979797] rounded-full p-3">Life Os</div>

        <div className="flex gap-1">
          {/* Navigation */}
          <div className="bg-[#f1f1f1] rounded-full flex dark:bg-black">
            <NavLink
              to=""
              className={({ isActive }) =>
                `rounded-full p-3 pr-5 pl-5 transition-colors duration-150 ${
                  isActive
                    ? "bg-[#2b2b2b] text-[#e4e4e4]"
                    : "hover:bg-[#dadada]"
                }`
              }>
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `rounded-full p-3 pr-5 pl-5 transition-colors duration-150 ${
                  isActive
                    ? "bg-[#2b2b2b] text-[#e4e4e4]"
                    : "hover:bg-[#dadada]"
                }`
              }>
              Tasks
            </NavLink>

            <NavLink
              to="/finances"
              className={({ isActive }) =>
                `rounded-full p-3 pr-5 pl-5 transition-colors duration-150 ${
                  isActive
                    ? "bg-[#2b2b2b] text-[#e4e4e4]"
                    : "hover:bg-[#dadada]"
                }`
              }>
              Finances
            </NavLink>

            <NavLink
              to="/habits"
              className={({ isActive }) =>
                `rounded-full p-3 pr-5 pl-5 transition-colors duration-150 ${
                  isActive
                    ? "bg-[#2b2b2b] text-[#e4e4e4]"
                    : "hover:bg-[#dadada]"
                }`
              }>
              Habits
            </NavLink>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => setmode((prev: any) => !prev)}
              className="bg-[#f1f1f1] rounded-full p-3 hover:bg-[#dadada] transition-colors duration-150 dark:bg-black">
              {mode ? <MoonStar /> : <Sun />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
