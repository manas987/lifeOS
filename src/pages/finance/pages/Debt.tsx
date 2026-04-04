import { AddNewCard, DebtCard } from "../financecards";

export function Debt() {
  return (
    <div>
      <h2 className="text-3xl font-light mb-4">Debt</h2>
      <div className="grid grid-cols-[300px_200px] gap-4">
        <DebtCard />
        <AddNewCard onClick={() => console.log("Add new")} />
      </div>
    </div>
  );
}
