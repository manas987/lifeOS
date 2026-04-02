import { useOutletContext } from "react-router-dom";
import { Detailedhabitcard } from "../habitscard";
import type { HabitContextindex } from "../logic/types";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function AllHabits() {
  const {
    habitslist,
    deletehabit,
    updateHabit,
    reorderHabits,
    sensors,
    CountStreak,
  } = useOutletContext<HabitContextindex>();

  const ids = habitslist.map((h) => h.id);

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Habits List</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <DndContext sensors={sensors} onDragEnd={reorderHabits}>
          <SortableContext items={ids}>
            {habitslist.map((h) => (
              <Detailedhabitcard
                key={h.id}
                id={h.id}
                title={h.title}
                selectedDays={h.repeatOn || []}
                range={
                  h.duration
                    ? {
                        from: new Date(h.duration.start),
                        to: h.duration.end
                          ? new Date(h.duration.end)
                          : undefined,
                      }
                    : undefined
                }
                onUpdate={(data) => updateHabit(h.id, data)}
                onDelete={() => deletehabit(h.id)}
                streak={CountStreak(h)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
