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
  addhabit: (title: string, selectedDays: number[], range?: DateRange) => void;
  togglehabit: (id: string) => void;
};
