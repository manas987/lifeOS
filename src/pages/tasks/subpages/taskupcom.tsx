import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "../taskcard";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { FormatHeader, formatLocalDate } from "../logic/taskutils";
import type { TasksContextType, Tasktype } from "../logic/types";

export function Upcoming() {
  const {
    edittask,
    editingid,
    seteditingid,
    taskslist,
    toggletask,
    open,
    setOpen,
    deleteTask,
    handleDragEnd,
    sensors,
  } = useOutletContext<TasksContextType>()!;
  const today = formatLocalDate(new Date());

  const overduetasks = taskslist.filter(
    (task: Tasktype) => task.duedate && task.duedate < today && !task.completed,
  );

  const dueid = overduetasks.map((task: Tasktype) => task.id);

  const days: string[] = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(formatLocalDate(d));
  }

  const [activeTask, setActiveTask] = useState<Tasktype | null>(null);

  function DroppableDay({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div
        ref={setNodeRef}
        className={isOver ? "bg-white/5 rounded-lg transition" : ""}>
        {children}
      </div>
    );
  }

  const grouped = new Map<string, Tasktype[]>();
  for (const task of taskslist) {
    if (!task.duedate || task.completed) continue;
    if (!grouped.has(task.duedate)) {
      grouped.set(task.duedate, []);
    }
    grouped.get(task.duedate)!.push(task);
  }

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Upcoming</h2>
      <DndContext
        sensors={sensors}
        onDragStart={(e) => {
          const task = taskslist.find((t: Tasktype) => t.id === e.active.id);
          if (task) {
            setActiveTask(task);
          }
        }}
        onDragEnd={(e) => {
          handleDragEnd(e);
          setActiveTask(null);
        }}>
        <div className="flex flex-col overflow-visible">
          {overduetasks.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-red-400 mb-4 underline">
                Overdue
              </p>
              <DroppableDay id="overdue">
                <SortableContext items={dueid}>
                  <div className="flex flex-col gap-2">
                    {overduetasks.map((task: Tasktype) => (
                      <Tasklayout
                        key={task.id}
                        title={task.title}
                        duedate={task.duedate}
                        projectname={task.project}
                        showProject={true}
                        completed={task.completed}
                        onClick={() => toggletask(task.id)}
                        isOpen={open === task.id}
                        onToggle={() =>
                          setOpen(open === task.id ? null : task.id)
                        }
                        onDelete={() => deleteTask(task.id)}
                        isediting={task.id === editingid}
                        openedit={() =>
                          seteditingid(task.id === editingid ? null : task.id)
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
                  </div>
                </SortableContext>
              </DroppableDay>
            </div>
          )}
          {days.map((date) => {
            const taskfordate = grouped.get(date) || [];
            return (
              <DroppableDay key={date} id={date}>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white py-2 border-b border-gray-700 mb-3">
                    {FormatHeader(date)}
                  </p>
                  <SortableContext
                    items={taskfordate.map((t: Tasktype) => t.id)}>
                    <div className="flex flex-col gap-3 min-h-[20px]">
                      {taskfordate.map((task: Tasktype) => {
                        const isActive = activeTask?.id === task.id;
                        return (
                          <div style={{ opacity: isActive ? 0 : 1 }}>
                            <Tasklayout
                              key={task.id}
                              title={task.title}
                              duedate={task.duedate}
                              projectname={task.project}
                              showProject={true}
                              completed={task.completed}
                              onClick={() => toggletask(task.id)}
                              isOpen={open === task.id}
                              onToggle={() =>
                                setOpen(open === task.id ? null : task.id)
                              }
                              onDelete={() => deleteTask(task.id)}
                              openedit={() =>
                                seteditingid(
                                  task.id === editingid ? null : task.id,
                                )
                              }
                              isediting={task.id === editingid}
                              edit={(newtitle, newduedate) => {
                                edittask(
                                  task.id,
                                  newtitle,
                                  newduedate ? new Date(newduedate) : undefined,
                                );
                              }}
                              id={task.id}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </SortableContext>
                </div>
              </DroppableDay>
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className=" scale-105 opacity-95">
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
  );
}
