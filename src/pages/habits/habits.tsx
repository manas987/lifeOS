import { Habitside } from "./hsidebar";
import { Outlet } from "react-router-dom";
import { UseHabitLogic } from "./logic/logic";

export function Habits() {
  const habitLogic = UseHabitLogic();

  return (
    <div className="flex ">
      <Habitside />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        <Outlet context={habitLogic} />
      </div>
    </div>
  );
}
