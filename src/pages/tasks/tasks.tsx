import { Outlet, useParams } from "react-router-dom";
import { Taskside } from "./sidebar";
import { useContext } from "react";
import { Mycontext } from "@/context/AppContext";

export function Tasks() {
  const { task } = useContext(Mycontext);
  const {
    edittask,
    open,
    setOpen,
    editingid,
    seteditingid,
    deleteundo,
    taskslist,
    addtask,
    toggletask,
    deleteTask,
    undodelete,
    handleDragEnd,
    HandelReorder,
    sensors,
    projlist,
    addproj,
    deleteproj,
    editproj,
  } = task;
  const { projectName } = useParams();
  return (
    <div className="flex">
      <Taskside
        addtask={addtask}
        addproj={addproj}
        deleteproj={deleteproj}
        editproj={editproj}
        projlist={projlist}
        currentlyon={projectName}
      />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        <Outlet
          context={{
            edittask,
            taskslist,
            toggletask,
            open,
            setOpen,
            editingid,
            seteditingid,
            deleteTask,
            handleDragEnd,
            HandelReorder,
            sensors,
          }}
        />
      </div>
      <div
        className={`fixed bottom-5 left-5 glass-card p-3 flex gap-3 transition-all duration-300 ease-out
  ${deleteundo ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <span>Task deleted</span>
        <button
          onClick={undodelete}
          className="text-red-500 hover:underline text-sm">
          Undo
        </button>
      </div>
    </div>
  );
}
