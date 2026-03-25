import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "../taskcard";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";

export function Today() {
  const {
    taskslist,
    toggletask,
    open,
    setOpen,
    deleteTask,
    handleDragEnd,
    formatLocalDate,
    sensors,
  } = useOutletContext<any>();

  const today = formatLocalDate(new Date());
  const [activeTask, setActiveTask] = useState<any>(null);

  const todayTasks = taskslist.filter(
    (task: any) => task.duedate === today && !task.completed,
  );
  const dueTasks = taskslist.filter(
    (task: any) => task.duedate < today && !task.completed,
  );

  const ids = todayTasks.map((task: any) => task.id);
  const overdueid = dueTasks.map((task: any) => task.id);

  const todayDate = new Date();
  const todayHeader = `${todayDate.getDate()} ${todayDate.toLocaleString("default", { month: "short" })} · Today · ${todayDate.toLocaleString("default", { weekday: "long" })}`;

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Today</h2>
      <div className="flex flex-col gap-2 overflow-visible">
        <DndContext
          sensors={sensors}
          onDragStart={(e) => {
            const task = taskslist.find((t: any) => t.id === e.active.id);
            setActiveTask(task);
          }}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setActiveTask(null);
          }}>
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
              <SortableContext items={overdueid}>
                <div className="flex flex-col gap-3">
                  {dueTasks.map((task: any) => (
                    <div
                      key={task.id}
                      style={{ opacity: activeTask?.id === task.id ? 0 : 1 }}>
                      <Tasklayout
                        title={task.title}
                        duedate={task.duedate}
                        completed={task.completed}
                        onClick={() => toggletask(task.id)}
                        isOpen={open === task.id}
                        onToggle={() =>
                          setOpen(open === task.id ? null : task.id)
                        }
                        onDelete={() => deleteTask(task.id)}
                        id={task.id}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          )}

          {(todayTasks.length > 0 || dueTasks.length > 0) && (
            <div>
              <p className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-700 mb-4">
                {todayHeader}
              </p>
              <SortableContext items={ids}>
                <div className="flex flex-col gap-3">
                  {todayTasks.map((task: any) => (
                    <div
                      key={task.id}
                      style={{ opacity: activeTask?.id === task.id ? 0 : 1 }}>
                      <Tasklayout
                        title={task.title}
                        duedate={task.duedate}
                        completed={task.completed}
                        onClick={() => toggletask(task.id)}
                        isOpen={open === task.id}
                        onToggle={() =>
                          setOpen(open === task.id ? null : task.id)
                        }
                        onDelete={() => deleteTask(task.id)}
                        id={task.id}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          )}

          <DragOverlay>
            {activeTask ? (
              <div className="scale-105 opacity-95">
                <Tasklayout
                  id={activeTask.id}
                  title={activeTask.title}
                  duedate={activeTask.duedate}
                  completed={activeTask.completed}
                  onClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
