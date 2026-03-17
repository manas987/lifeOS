import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  addtask: (title: string) => void;
};

export function Taskside({ addtask }: Props) {
  const [title, setTitle] = useState("");
  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-60">
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
          addtask(title);
          setTitle("");
        }}
        className="glass-card p-4 flex flex-col gap-2">
        <h3 className="mb-2">Add task</h3>
        <input
          value={title}
          type="text"
          placeholder="task name"
          className="glass-card p-3"
          onChange={(e) => setTitle(e.target.value)}
        />
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
