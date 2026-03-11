import { Tasklayout } from "./taskitem";
import { Tasksarray } from "./tasklist";

export function Upcoming() {
  const today = new Date().toISOString().slice(0, 10);
  const upcomingtask = Tasksarray.filter((task) => task.createdAt > today);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Upcoming</h2>
      <div className="flex flex-col gap-3">
        {upcomingtask.map((task) => (
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
