import { useFinanceLogic } from "@/pages/finance/logic/logic";
import { useHabitLogic } from "@/pages/habits/logic/logic";
import { UseTaskLogic } from "@/pages/tasks/logic/tasklogic";
import { createContext } from "react";

export const Mycontext = createContext<any>(null);

export function MyState({ children }: any) {
  const finance = useFinanceLogic();
  const habbit = useHabitLogic();
  const task = UseTaskLogic();
  return (
    <Mycontext.Provider value={{ finance, task, habbit }}>
      {children}
    </Mycontext.Provider>
  );
}
