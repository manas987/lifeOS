import { useState } from "react";
import { HabbitCard, HabitHeatmapCard } from "../habitscard";
import { ChevronDown, ChevronUp } from "lucide-react";

export function HabitsInbox() {
  const [openpending, setopenpending] = useState<boolean>(true);
  const [opencompleted, setopencomplted] = useState<boolean>(false);
  const dummyHabits = [
    { id: 1, title: "Drink water", completed: false },
    { id: 2, title: "Workout", completed: true },
    { id: 3, title: "Read 10 pages", completed: false },
    { id: 4, title: "Meditation", completed: true },
  ];
  const pendingHabits = dummyHabits.filter((h) => !h.completed);
  const completedHabits = dummyHabits.filter((h) => h.completed);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <HabitHeatmapCard />
          <div className="glass-card w-full p-4 text-4xl font-thin">
            "Discipline is just doing the same thing the right way whether
            anyone's watching or not."
          </div>
        </div>
        <div className="glass-card w-full p-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-3xl font-extralight">Today-pending</h2>
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
                  completed={h.completed}
                  onToggle={() => {}}
                />
              ))}
            </div>
          )}
        </div>
        <div className="glass-card w-full p-4">
          <div className="flex w-full items-center justify-between">
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
                  completed={h.completed}
                  onToggle={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
