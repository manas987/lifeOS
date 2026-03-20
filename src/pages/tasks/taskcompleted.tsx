import { useOutletContext } from "react-router-dom";
import { Tasklayout } from "./taskitem";

export function Completed() {
  const { taskslist, toggletask, open, setOpen, deleteTask }= useOutletContext<any>();
  const completedTasks = taskslist.filter((task: any) => task.completed);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Completed</h2>

      <div className="flex flex-col gap-3 overflow-visible">
        {completedTasks.map((task: any) => (
          <Tasklayout
            key={task.id}
            title={task.title}
            completed={task.completed}
            onClick={() => toggletask(task.id)}
            isOpen={open === task.id}
            onToggle={() => setOpen(open === task.id ? null : task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
