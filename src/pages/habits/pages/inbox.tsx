import { useOutletContext } from "react-router-dom";
import { HabbitCard } from "../habitscard";
import type { HabitsContextType, Habit } from "../logic/types";

export function HabitsInbox() {
  const { habitslist, togglehabit } = useOutletContext<HabitsContextType>()!;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>
      <div
        className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      gap-3
    ">
        {[...habitslist]
          .sort((a: Habit, b: Habit) => {
            const aCompleted = a.completedDates.includes(today) ? 1 : 0;
            const bCompleted = b.completedDates.includes(today) ? 1 : 0;
            return aCompleted - bCompleted;
          })
          .map((h: Habit) => (
            <HabbitCard
              key={h.id}
              title={h.title}
              completed={h.completedDates.includes(today)}
              onToggle={() => togglehabit(h.id)}
            />
          ))}
      </div>
    </div>
  );
}
