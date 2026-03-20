import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "./taskitem";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Inbox() {
  const { taskslist, toggletask, open, setOpen, deleteTask, handleDragEnd } =
    useOutletContext<any>();

  const inboxtask = taskslist.filter((task: any) => !task.completed);
  const ids = inboxtask.map((task: any) => task.id);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // try 5–8
      },
    }),
  );
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>
      <div className="flex flex-col gap-3 overflow-visible">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={ids}>
            {inboxtask.map((task: any) => (
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
      </div>
    </div>
  );
}
