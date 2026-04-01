export type Habit = {
  id: string;
  title: string;
  repeatOn?: number[];
  duration?: {
    start: string;
    end?: string;
  };
  linkedTaskIds?: string[];
  completedDates: string[];
};
import type { DateRange } from "react-day-picker";

export type HabitsContextType = {
  habitslist: Habit[];
  sethabits: (habits: Habit[] | ((prev: Habit[]) => Habit[])) => void;

  addhabit: (title: string, selectedDays: number[], range?: DateRange) => void;

  edithabit: (id: string, newtitle: string) => void;
  deletehabit: (id: string) => void;
  togglehabit: (id: string) => void;

  open: string | null;
  setOpen: (id: string | null) => void;

  editingid: string | null;
  seteditingid: (id: string | null) => void;

  deleteundo: Habit | null;
  undodelete: () => void;
};
