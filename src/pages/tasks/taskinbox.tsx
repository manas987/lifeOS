import { Tasklayout } from "./taskitem";
import { Tasksarray } from "./tasklist";

export function Inbox() {
  const inboxtask = Tasksarray.filter((task) => !task.completed);
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>
      <div className="flex flex-col gap-3">
        {inboxtask.map((task) => (
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
