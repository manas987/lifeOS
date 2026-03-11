import { Tasklayout } from "./taskitem";
import { Tasksarray } from "./tasklist";

export function Today() {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = Tasksarray.filter((task) => task.createdAt === today);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Today</h2>

      <div className="flex flex-col gap-3">
        {todayTasks.map((task) => (
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
