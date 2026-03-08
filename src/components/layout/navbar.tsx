import defaultAvatar from "../../assets/DefaultAvatar.jpg";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="p-3.5">
      <nav className="flex items-center justify-between px-9 py-2 text-gray-600 glass-card">
        <div className="flex gap-9 text-sm tracking-wide">
          <Link
            to="/dashboard"
            className="cursor-pointer hover:text-black hover:underline transition">
            Dashboard
          </Link>

          <Link
            to="/tasks"
            className="cursor-pointer hover:text-black hover:underline transition">
            Tasks
          </Link>

          <Link
            to="/finances"
            className="cursor-pointer hover:text-black hover:underline transition">
            Finances
          </Link>

          <Link
            to="/habits"
            className="cursor-pointer hover:text-black hover:underline transition">
            Habits
          </Link>
        </div>

        <img
          src={defaultAvatar}
          className="w-9 h-9 rounded-full object-cover border border-gray-400"
          alt="profile"
        />
      </nav>
    </div>
  );
}
