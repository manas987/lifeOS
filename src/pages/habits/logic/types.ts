export type Habit = {
  id: string;
  title: string;
  repeatOn?: number[];
  duration?: {
    start: string;
    end?: string;
  };
  completedDates: string[];
};
import type { DragEndEvent } from "@dnd-kit/core";
import type { DateRange } from "react-day-picker";

export type HabitsContextType = {
  habitslist: Habit[];
  addhabit: (title: string, selectedDays: number[], range?: DateRange) => void;
  togglehabit: (id: string) => void;
  CountStreak: (h: Habit) => number;
};
export type HabitCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  streak: number;
};

export type AddHabitProps = {
  onAdd: (title: string, selectedDays: number[], range?: DateRange) => void;
};

export type DetailedHabitProps = {
  id: string;
  title: string;
  range?: DateRange;
  selectedDays: number[];

  onUpdate: (data: {
    title: string;
    selectedDays: number[];
    range?: DateRange;
  }) => void;

  onDelete: () => void;
  streak: number;
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
      range?: DateRange;
    },
  ) => void;
  reorderHabits: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof import("@dnd-kit/core").useSensors>;
  CountStreak: (h: Habit) => number;
};
