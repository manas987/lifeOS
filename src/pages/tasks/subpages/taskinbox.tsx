import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "../taskcard";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Inbox() {
  const {
    edittask,
    taskslist,
    toggletask,
    editingid,
    seteditingid,
    open,
    setOpen,
    deleteTask,
    HandelReorder,
    sensors,
  } = useOutletContext<any>();

  const inboxtask = taskslist.filter(
    (task: any) => !task.completed && !task.project,
  );

  const ids = inboxtask.map((task: any) => task.id);

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>
      <div className="flex flex-col gap-3 overflow-visible">
        {inboxtask.length === 0 ? (
          <div className="text-sm opacity-60 mt-10 text-center">
            No tasks yet
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={HandelReorder}>
            <SortableContext items={ids}>
              {inboxtask.map((task: any) => (
                <Tasklayout
                  key={task.id}
                  title={task.title}
                  duedate={task.duedate}
                  completed={task.completed}
                  onClick={() => toggletask(task.id)}
                  isOpen={open === task.id}
                  onToggle={() => setOpen(open === task.id ? null : task.id)}
                  onDelete={() => deleteTask(task.id)}
                  isediting={editingid == task.id}
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
