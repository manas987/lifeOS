import { Circle } from "lucide-react";

export function Inbox() {
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Inbox</h2>

      <div className="flex flex-col gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Finish LifeOS UI
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Review React Router setup
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Plan habit tracking logic
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <Circle size={18} />
          Design finance dashboard
        </div>
      </div>
    </div>
  );
}
