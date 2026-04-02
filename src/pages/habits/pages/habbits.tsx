import { useOutletContext } from "react-router-dom";
import { Detailedhabitcard } from "../habitscard";
import type { Habit } from "../logic/types";

type HabitContext = {
  habitslist: Habit[];
  deletehabit: (id: string) => void;

  updateHabit: (
    id: string,
    data: {
      title: string;
      selectedDays: number[];
      range?: { from?: Date; to?: Date };
    },
  ) => void;
};

export function AllHabits() {
  const { habitslist, deletehabit, updateHabit } =
    useOutletContext<HabitContext>();

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Habits List</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {habitslist.map((h) => (
          <Detailedhabitcard
            key={h.id}
            title={h.title}
            selectedDays={h.repeatOn || []}
            range={
              h.duration
                ? {
                    from: new Date(h.duration.start),
                    to: h.duration.end ? new Date(h.duration.end) : undefined,
                  }
                : undefined
            }
            onUpdate={(data) => updateHabit(h.id, data)} // ✅ CRITICAL
            onDelete={() => deletehabit(h.id)}
          />
        ))}
      </div>
    </div>
  );
}
