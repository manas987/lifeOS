import { Habitside } from "./hsidebar";
import { Outlet } from "react-router-dom";
import { useHabitLogic } from "./logic/logic";

export function Habits() {
  const habitLogic = useHabitLogic();

  return (
    <div className="flex">
      <Habitside habitLogic={habitLogic} />

      <div className="flex-1 p-4 pl-9 overflow-visible">
        <Outlet context={habitLogic} />
      </div>
    </div>
  );
}
