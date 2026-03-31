type HabitCardProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
};

export function HabbitCard({ title, completed, onToggle }: HabitCardProps) {
  return (
    <div
      className={`glass-card p-3 flex items-center gap-3 transition duration-150 cursor-pointer
      ${completed ? "opacity-60 line-through" : "hover:!bg-white"}`}
      onClick={onToggle}>
      {/* Circle */}
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center
        ${completed ? "bg-black border-black" : "border-black/40"}`}>
        {completed && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      {/* Title */}
      <p className="text-sm truncate">{title}</p>
    </div>
  );
}
