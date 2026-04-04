import { Outlet } from "react-router-dom";
import { FinanceSideBar } from "./finsidebar";

export function Finances() {
  return (
    <div className="flex">
      <FinanceSideBar />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        {/*/holy min width dont touch even god doesnt know how it works */}
        <Outlet />
      </div>
    </div>
  );
}
