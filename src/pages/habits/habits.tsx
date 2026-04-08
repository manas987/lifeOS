import { Habitside } from "./hsidebar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { Mycontext } from "@/context/AppContext";

export function Habits() {
  const { habbit } = useContext(Mycontext);
  const { deleteundo, undodelete } = habbit;

  return (
    <div className="flex">
      <Habitside habitLogic={habbit} />
      <div className="flex-1 p-4 pl-9 overflow-visible min-w-80">
        {/*/holy min width dont touch even god doesnt know how it works */}
        <Outlet context={habbit} />
      </div>
      <div
        className={`fixed bottom-5 left-5 glass-card p-3 flex gap-3 transition-all duration-300 ease-out rounded-xl shadow-lg
  ${deleteundo ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <span className="text-sm">Habit deleted</span>

        <button
          onClick={undodelete}
          className="text-red-500 hover:underline text-sm">
          Undo
        </button>
      </div>
    </div>
  );
}
