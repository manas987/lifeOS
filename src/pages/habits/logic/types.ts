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
export type HabitCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export type AddHabitProps = {
  onAdd: (title: string, selectedDays: number[], range?: DateRange) => void;
};

export type DetailedHabitProps = {
  id: string;
  title: string;
  range?: { from?: Date; to?: Date };
  selectedDays: number[];

  onUpdate: (data: {
    title: string;
    selectedDays: number[];
    range?: { from?: Date; to?: Date };
  }) => void;

  onDelete: () => void;
};

export type DayData = {
  date: string;
  value: number;
};
export type Propssidebar = {
  habitLogic: HabitsContextType;
};

export type HabitContextindex = {
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
  reorderHabits: () => void;
  sensors: ReturnType<typeof import("@dnd-kit/core").useSensors>;
};
