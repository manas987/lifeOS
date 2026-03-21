import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "./taskitem";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Upcoming() {
  const { taskslist, toggletask, open, setOpen, deleteTask, handleDragEnd } =
    useOutletContext<any>();

  const today = new Date().toISOString().slice(0, 10);

  const upcomingtask = taskslist.filter(
    (task: any) => task.createdAt > today && !task.completed,
  );

  const ids = taskslist.map((task: any) => task.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Upcoming</h2>
      <div className="flex flex-col gap-3 overflow-visible">
        {upcomingtask.length === 0 ? (
          <div className="text-sm opacity-60 mt-10 text-center">
            No tasks yet
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={ids}>
              {upcomingtask.map((task: any) => (
                <Tasklayout
                  key={task.id}
                  title={task.title}
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
        )}
      </div>
    </div>
  );
}
