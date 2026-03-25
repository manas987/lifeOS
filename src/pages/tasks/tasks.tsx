import { Outlet } from "react-router-dom";
import { Taskside } from "./sidebar";
import { UseTaskLogic } from "./logic/tasklogic";

export function Tasks() {
  const {
    open,
    setOpen,
    deleteundo,
    taskslist,
    formatLocalDate,
    addtask,
    toggletask,
    deleteTask,
    undodelete,
    handleDragEnd,
    HandelReorder,
    sensors,
  } = UseTaskLogic();

  return (
    <div className="flex">
      <Taskside addtask={addtask} />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        <Outlet
          context={{
            taskslist,
            toggletask,
            open,
            setOpen,
            deleteTask,
            handleDragEnd,
            HandelReorder,
            formatLocalDate,
            sensors,
          }}
        />
      </div>
      <div
        className={`fixed bottom-5 left-5 glass-card p-3 flex gap-3 transition-all duration-300 ease-out
  ${deleteundo ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <span>Task deleted</span>
        <button onClick={undodelete}>Undo</button>
      </div>
    </div>
  );
}
