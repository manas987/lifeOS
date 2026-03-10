import { CheckCircle2 } from "lucide-react";

export function Completed() {
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Completed</h2>

      <div className="flex flex-col gap-3">
        <div className="glass-card p-4 flex items-center gap-3 line-through opacity-60">
          <CheckCircle2 size={18} />
          Setup React project
        </div>

        <div className="glass-card p-4 flex items-center gap-3 line-through opacity-60">
          <CheckCircle2 size={18} />
          Configure Tailwind
        </div>

        <div className="glass-card p-4 flex items-center gap-3 line-through opacity-60">
          <CheckCircle2 size={18} />
          Build sidebar navigation
        </div>

        <div className="glass-card p-4 flex items-center gap-3 line-through opacity-60">
          <CheckCircle2 size={18} />
          Setup nested routing
        </div>
      </div>
    </div>
  );
}
