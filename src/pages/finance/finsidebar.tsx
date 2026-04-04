import { NavLink } from "react-router-dom";
import { useState } from "react";

export function FinanceSideBar() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const linkClass = (isActive: boolean) =>
    `glass-card w-full p-4 block transition duration-150 ${
      isActive ? "!bg-black/80 text-white" : "hover:!bg-white"
    }`;

  return (
    <div className="pl-5 rounded-3xl flex flex-col gap-3 w-80 sticky top-0">
      {/* Title */}
      <div className="p-1">
        <h1 className="text-5xl font-light">Finances</h1>
      </div>

      {/* Navigation */}
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

      {/* Add Transaction Card */}
      <div className="glass-card p-4 pt-1 flex flex-col gap-3">
        <h3 className="text-lg font-light -mb-1 -mt-1">Add Transaction</h3>
        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="glass-card p-3"
        />
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name"
          className="glass-card p-3 text-sm"
        />
        {/* Mode */}
        <div className="flex gap-2">
          <button className="flex-1 glass-card p-2 hover:!bg-white">
            Expense
          </button>
          <button className="flex-1 glass-card p-2 hover:!bg-white">
            Income
          </button>
          <button className="flex-1 glass-card p-2 hover:!bg-white">
            Transfer
          </button>
        </div>
        {/* Category */}
        <button className="glass-card p-3 pt-2 pb-2 flex justify-between items-center hover:!bg-white">
          <span>Category</span>
          <span>{">"}</span>
        </button>
        {/* Date */}
        <button className="glass-card p-3 pt-2 pb-2  hover:!bg-white">
          Date (Today / Custom)
        </button>
        {/* Account */}
        <button className="glass-card p-3 pt-2 pb-2  flex justify-between items-center hover:!bg-white">
          <span>Account</span>
          <span>{">"}</span>
        </button>
        {/* Notes */}
        <textarea
          placeholder="Add note..."
          className="glass-card p-5 resize-none text-center"
          rows={2}
        />
        {/* Add Button */}
        <button className="glass-card p-3 pt-2  hover:!bg-white transition -mb-14">
          Add
        </button>
      </div>
    </div>
  );
}
