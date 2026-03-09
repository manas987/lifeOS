import { NavLink } from "react-router-dom";
import { Settings, Bell, User, MoonStar, Sun } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [panel, setPanel] = useState<
    null | "settings" | "notifications" | "profile"
  >(null);
  const [mode, setmode] = useState<"dark" | "light">("light");

  function renderPanel() {
    switch (panel) {
      case "settings":
        return <div className="text-xl">Settings Panel</div>;

      case "notifications":
        return <div className="text-xl">Notifications Panel</div>;

      case "profile":
        return <div className="text-xl">User Profile Panel</div>;

      default:
        return null;
    }
  }

  return (
    <div>
      <div className="flex justify-between p-5">
        <div className="border border-[#979797] rounded-full p-3">Life Os</div>
        <div className="flex gap-1">
          <div className="bg-[#f1f1f1] rounded-full flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full p-3 pr-5 pl-5 transition ${
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
                `rounded-full p-3 pr-5 pl-5 transition ${
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
                `rounded-full p-3 pr-5 pl-5 transition ${
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
                `rounded-full p-3 pr-5 pl-5 transition ${
                  isActive
                    ? "bg-[#2b2b2b] text-[#e4e4e4]"
                    : "hover:bg-[#dadada]"
                }`
              }>
              Habits
            </NavLink>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setPanel("settings")}
              className="bg-[#f1f1f1] rounded-full p-3 flex gap-1 hover:bg-[#dadada]">
              <Settings /> Settings
            </button>

            <button
              onClick={() =>
                setmode((prev) => (prev === "light" ? "dark" : "light"))
              }
              className="bg-[#f1f1f1] rounded-full p-3 hover:bg-[#dadada]">
              {mode === "light" ? <MoonStar /> : <Sun />}
            </button>

            <button
              onClick={() => setPanel("notifications")}
              className="bg-[#f1f1f1] rounded-full p-3 hover:bg-[#dadada]">
              <Bell />
            </button>

            <button
              onClick={() => setPanel("profile")}
              className="bg-[#f1f1f1] rounded-full p-3 hover:bg-[#dadada]">
              <User />
            </button>
          </div>
        </div>
      </div>
      {panel && (
        <div
          className="fixed inset-0 bg-black/30 flex justify-end"
          onClick={() => setPanel(null)}>
          <div
            className="w-[350px] h-full bg-white p-6"
            onClick={(e) => e.stopPropagation()}>
            {renderPanel()}
          </div>
        </div>
      )}
    </div>
  );
}
