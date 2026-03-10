import { Circle } from "lucide-react";

export function Upcoming() {
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Upcoming</h2>

      <div className="flex flex-col gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Design habit tracking system
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Implement finance charts
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Add dark mode
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Optimize project structure
        </div>
      </div>
    </div>
  );
}
