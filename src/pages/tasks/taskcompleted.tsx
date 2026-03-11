import { Tasksarray } from "./tasklist";
import { Tasklayout } from "./taskitem";

export function Completed() {
  const completedTasks = Tasksarray.filter((task) => task.completed);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Completed</h2>

      <div className="flex flex-col gap-3">
        {completedTasks.map((task) => (
          <Tasklayout
            key={task.id}
            title={task.title}
            completed={task.completed}
          />
        ))}
      </div>
    </div>
  );
}
