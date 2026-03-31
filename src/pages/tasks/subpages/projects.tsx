import { useParams, useOutletContext } from "react-router-dom";
import { Tasklayout } from "../taskcard";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import type { TasksContextType, Tasktype } from "../logic/types";

export function ProjectPage() {
  const { projectName } = useParams();
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
  } = useOutletContext<TasksContextType>()!;

  const projectTasks = taskslist.filter(
    (t: Tasktype) => t.project === projectName && !t.completed,
  );

  const ids = projectTasks.map((t: Tasktype) => t.id);

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">{projectName}</h2>
      <div className="flex flex-col gap-3 overflow-visible">
        {projectTasks.length === 0 ? (
          <div className="text-sm opacity-60 mt-10 text-center">
            No tasks yet
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={HandelReorder}>
            <SortableContext items={ids}>
              {projectTasks.map((task: Tasktype) => (
                <Tasklayout
                  key={task.id}
                  title={task.title}
                  projectname={task.project}
                  duedate={task.duedate}
                  completed={task.completed}
                  onClick={() => toggletask(task.id)}
                  isOpen={open === task.id}
                  onToggle={() => setOpen(open === task.id ? null : task.id)}
                  onDelete={() => deleteTask(task.id)}
                  isediting={editingid === task.id}
                  openedit={() =>
                    seteditingid(editingid === task.id ? null : task.id)
                  }
                  edit={(newtitle, newduedate) =>
                    edittask(
                      task.id,
                      newtitle,
                      newduedate ? new Date(newduedate) : undefined,
                    )
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
