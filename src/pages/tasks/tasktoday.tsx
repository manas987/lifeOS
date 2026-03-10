import { Circle } from "lucide-react";

export function Today() {
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Today</h2>

      <div className="flex flex-col gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Complete React routing
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Push LifeOS repo update
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Workout session
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Read 10 pages of a book
        </div>
      </div>
    </div>
  );
}
