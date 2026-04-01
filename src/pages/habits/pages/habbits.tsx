import { useOutletContext } from "react-router-dom";
import { Detailedhabitcard } from "../habitscard";
import type { Habit } from "../logic/types";

type HabitContext = {
  habitslist: Habit[];
  open: string | null;
  setOpen: (id: string | null) => void;
  seteditingid: (id: string | null) => void;
  deletehabit: (id: string) => void;
};

export function AllHabits() {
  const { habitslist, open, setOpen, seteditingid, deletehabit } =
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
            menue={open === h.id}
            togglemenue={() => setOpen(open === h.id ? null : h.id)}
            startEditing={() => seteditingid(h.id)}
            onDelete={() => deletehabit(h.id)}
          />
        ))}
      </div>
    </div>
  );
}
