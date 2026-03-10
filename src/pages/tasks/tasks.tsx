import { Outlet } from "react-router-dom";
import { Taskside } from "./tasksside";

export function Tasks() {
  return (
    <div className="flex">
      <Taskside />
      <div className="flex-1 p-4 pl-9">
        <Outlet />
      </div>
    </div>
  );
}
