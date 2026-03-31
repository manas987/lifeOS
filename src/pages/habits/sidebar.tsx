import { NavLink } from "react-router-dom";
import { useState } from "react";

type Props = {
  addhabit: (title: string) => void;
};

export function Habitside({ addhabit }: Props) {
  const [title, setTitle] = useState("");

  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0">
      {/* Title */}
      <div className="p-1">
        <h1 className="text-5xl font-light">Habits</h1>
      </div>

      {/* Inbox */}
      <NavLink
        to="/habits"
        end
        className={({ isActive }) => linkClass(isActive)}>
        Inbox
      </NavLink>

      {/* All Habits */}
      <NavLink
        to="/habits/allhabits"
        className={({ isActive }) => linkClass(isActive)}>
        Habits
      </NavLink>

      {/* Add Habit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;

          addhabit(title);
          setTitle("");
        }}
        className="glass-card p-4 flex flex-col gap-2">
        <h3 className="mb-2">Add habit</h3>

        <input
          value={title}
          type="text"
          placeholder="habit name"
          className="glass-card p-3 flex-1"
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          className="glass-card p-2 hover:!bg-white transition duration-150">
          Add
        </button>
      </form>
    </div>
  );
}
