import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "../taskcard";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Completed() {
  const {
    edittask,
    editingid,
    seteditingid,
    taskslist,
    toggletask,
    open,
    setOpen,
    deleteTask,
    HandelReorder,
    sensors,
  } = useOutletContext<any>();

  const completedTasks = taskslist.filter((task: any) => task.completed);
  const ids = completedTasks.map((task: any) => task.id);

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Completed</h2>

      <div className="flex flex-col gap-3 overflow-visible">
        {completedTasks.length === 0 ? (
          <div className="text-sm opacity-60 mt-10 text-center">
            No tasks yet
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={HandelReorder}>
            <SortableContext items={ids}>
              {completedTasks.map((task: any) => (
                <Tasklayout
                  key={task.id}
                  duedate={task.duedate}
                  title={task.title}
                  completed={task.completed}
                  onClick={() => toggletask(task.id)}
                  isOpen={open === task.id}
                  onToggle={() => setOpen(open === task.id ? null : task.id)}
                  onDelete={() => deleteTask(task.id)}
                  isediting={task.id === editingid}
                  openedit={() =>
                    seteditingid(editingid === task.id ? null : task.id)
                  }
                  edit={(newtitle, newduedate) =>
                    edittask(task.id, newtitle, newduedate)
                  }
                  id={task.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
