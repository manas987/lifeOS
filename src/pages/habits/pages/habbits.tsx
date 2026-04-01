import { Detailedhabitcard } from "../habitscard";

export function AllHabits() {
  const dummyHabits = [
    {
      id: 1,
      title: "Workout",
      selectedDays: [1, 2, 3, 4, 5],
      range: { from: new Date(), to: new Date() },
    },
    {
      id: 2,
      title: "Read",
      selectedDays: [0, 6],
      range: { from: new Date(), to: new Date() },
    },
    {
      id: 3,
      title: "Meditation",
      selectedDays: [1, 3, 5],
      range: {},
    },
    {
      id: 4,
      title: "Drink Water",
      selectedDays: [0, 1, 2, 3, 4, 5, 6],
      range: { from: new Date(), to: new Date() },
    },
  ];
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Habits-list</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {dummyHabits.map((h) => (
          <Detailedhabitcard
            key={h.id}
            title={h.title}
            range={h.range}
            selectedDays={h.selectedDays}
          />
        ))}
      </div>
    </div>
  );
}
