import { useEffect, useState } from "react";
import { HabbitCard, HabitHeatmapCard } from "../habitscard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { Habit, HabitsContextType } from "../logic/types";
import { getLocalDate } from "../logic/logic";

export function HabitsInbox() {
  const [openpending, setopenpending] = useState(true);
  const [opencompleted, setopencomplted] = useState(false);
  const todayDate = new Date();
  const today = getLocalDate();
  const todayDay = todayDate.getDay();

  const { habitslist, togglehabit, CountStreak } =
    useOutletContext<HabitsContextType>();

  function isHabitActiveToday(h: Habit) {
    if (h.repeatOn && h.repeatOn.length > 0) {
      if (!h.repeatOn.includes(todayDay)) return false;
    }
    if (h.duration?.start) {
      const start = new Date(h.duration.start);
      const end = h.duration.end ? new Date(h.duration.end) : null;
      if (todayDate < start) return false;
      if (end && todayDate > end) return false;
    }
    return true;
  }

  const todaysHabits = habitslist.filter(isHabitActiveToday);

  const pendingHabits = todaysHabits.filter(
    (h) => !h.completedDates.includes(today),
  );

  const completedHabits = todaysHabits.filter((h) =>
    h.completedDates.includes(today),
  );
  const [quote, setquote] = useState<string>("");
  const [quotewrite, setquotewriter] = useState<string>("");
  useEffect(() => {
    async function getData() {
      try {
        const random = Math.floor(Math.random() * (25 - 1 + 1) + 1);
        const quote = await fetch(`https://dummyjson.com/quotes/${random}`);
        const useablequote = await quote.json();
        setquote(useablequote.quote);
        setquotewriter(useablequote.author);
      } catch {
        setquote("Failed to load");
      }
    }
    getData();
  }, []);

  return (
    <div className="relative">
      <h2 className="text-3xl font-light mb-4">Inbox</h2>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-2 min-w-0 max-w-fit">
            <HabitHeatmapCard habitlist={habitslist} />
          </div>
          <div className="flex-1 glass-card shrink-0 p-4 font-thin">
            <div className="h-full overflow-y-auto min-w-40 break-words">
              {quote} -"{quotewrite}"
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="glass-card p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extralight">Today Pending</h2>

            <div onClick={() => setopenpending((prev) => !prev)}>
              {openpending ? (
                <ChevronUp size={30} />
              ) : (
                <ChevronDown size={30} />
              )}
            </div>
          </div>

          {openpending && (
            <div className="mt-3 flex flex-col gap-2">
              {pendingHabits.map((h) => (
                <HabbitCard
                  key={h.id}
                  title={h.title}
                  completed={false}
                  onToggle={() => togglehabit(h.id)}
                  streak={CountStreak(h)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="glass-card  p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extralight">Completed</h2>

            <div onClick={() => setopencomplted((prev) => !prev)}>
              {opencompleted ? (
                <ChevronUp size={30} />
              ) : (
                <ChevronDown size={30} />
              )}
            </div>
          </div>

          {opencompleted && (
            <div className="mt-3 flex flex-col gap-2">
              {completedHabits.map((h) => (
                <HabbitCard
                  key={h.id}
                  title={h.title}
                  completed={true}
                  onToggle={() => togglehabit(h.id)}
                  streak={CountStreak(h)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
