import { NavLink } from "react-router-dom";

export function FinanceSideBar() {
  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;
  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0">
      <div className="p-1">
        <h1 className="text-5xl font-light">Finances</h1>
      </div>
      <NavLink
        to="/finances"
        end
        className={({ isActive }) => linkClass(isActive)}>
        Dashboard
      </NavLink>
      <NavLink
        to="/finances/logs"
        className={({ isActive }) => linkClass(isActive)}>
        Logs
      </NavLink>
      <NavLink
        to="/finances/debt"
        className={({ isActive }) => linkClass(isActive)}>
        Debt
      </NavLink>
      <NavLink
        to="/finances/subscriptions"
        className={({ isActive }) => linkClass(isActive)}>
        Subscriptions
      </NavLink>
    </div>
  );
}
