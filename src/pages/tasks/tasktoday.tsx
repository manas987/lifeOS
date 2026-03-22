import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "./taskitem";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Today() {
  const {
    taskslist,
    toggletask,
    open,
    setOpen,
    deleteTask,
    handleDragEnd,
    formatLocalDate,
  } = useOutletContext<any>();

  const today = formatLocalDate(new Date());

  const todayTasks = taskslist.filter(
    (task: any) => task.duedate === today && !task.completed,
  );
  const dueTasks = taskslist.filter(
    (task: any) => task.duedate < today && !task.completed,
  );

  const ids = todayTasks.map((task: any) => task.id);
  const overdueid = dueTasks.map((task: any) => task.id);

  const todayDate = new Date();
  const dayNum = todayDate.getDate();
  const month = todayDate.toLocaleString("default", { month: "short" });
  const weekday = todayDate.toLocaleString("default", { weekday: "long" });
  const todayHeader = `${dayNum} ${month} · Today · ${weekday}`;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Today</h2>
      <div className="flex flex-col gap-2 overflow-visible">
        {todayTasks.length === 0 && dueTasks.length === 0 && (
          <div className="text-sm opacity-60 mt-10 text-center">
            No tasks yet
          </div>
        )}

        {dueTasks.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-red-400 py-2 underline">
              Overdue
            </p>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={overdueid}>
                {dueTasks.map((task: any) => (
                  <Tasklayout
                    key={task.id}
                    title={task.title}
                    duedate={task.duedate}
                    completed={task.completed}
                    onClick={() => toggletask(task.id)}
                    isOpen={open === task.id}
                    onToggle={() => setOpen(open === task.id ? null : task.id)}
                    onDelete={() => deleteTask(task.id)}
                    id={task.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

        {(todayTasks.length > 0 || dueTasks.length > 0) && (
          <div>
            <p className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-700 mb-4">
              {todayHeader}
            </p>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={ids}>
                {todayTasks.map((task: any) => (
                  <Tasklayout
                    key={task.id}
                    title={task.title}
                    duedate={task.duedate}
                    completed={task.completed}
                    onClick={() => toggletask(task.id)}
                    isOpen={open === task.id}
                    onToggle={() => setOpen(open === task.id ? null : task.id)}
                    onDelete={() => deleteTask(task.id)}
                    id={task.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
