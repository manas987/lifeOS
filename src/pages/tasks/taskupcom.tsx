import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "./taskitem";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Upcoming() {
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

  const overduetasks = taskslist.filter(
    (task: any) => task.duedate < today && !task.completed,
  );

  const dueid = overduetasks.map((task: any) => task.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const days: string[] = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(formatLocalDate(d));
  }
  function formatHeader(dateStr: string) {
    const d = new Date(dateStr);

    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const weekday = d.toLocaleString("default", { weekday: "long" });

    const todayDate = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(todayDate.getDate() + 1);

    const isToday = d.toDateString() === todayDate.toDateString();

    const isTomorrow = d.toDateString() === tomorrow.toDateString();

    let label = "";
    if (isToday) label = "Today";
    else if (isTomorrow) label = "Tomorrow";

    return `${day} ${month}${label ? ` · ${label}` : ""} · ${weekday}`;
  }

  function DroppableDay({ id, children }: any) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        className={isOver ? "bg-white/5 rounded-lg transition" : ""}>
        {children}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Upcoming</h2>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col overflow-visible">
          {overduetasks.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-red-400 mb-4 underline">
                Overdue
              </p>
              <DroppableDay id="overdue">
                <SortableContext items={dueid}>
                  <div className="flex flex-col gap-2">
                    {overduetasks.map((task: any) => (
                      <Tasklayout
                        key={task.id}
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
                    ))}
                  </div>
                </SortableContext>
              </DroppableDay>
            </div>
          )}
          {days.map((date) => {
            const taskfordate = taskslist.filter(
              (task: any) => task.duedate === date && !task.completed,
            );
            return (
              <DroppableDay key={date} id={date}>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 py-2 border-b border-gray-700 mb-3">
                    {formatHeader(date)}
                  </p>
                  <SortableContext items={taskfordate.map((t: any) => t.id)}>
                    <div className="flex flex-col gap-3 min-h-[20px]">
                      {taskfordate.map((task: any) => (
                        <Tasklayout
                          key={task.id}
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
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </DroppableDay>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
