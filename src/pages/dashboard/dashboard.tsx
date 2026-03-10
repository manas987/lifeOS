import { useState } from "react";

export function Dashboard() {
  const [user, setuser] = useState(null);
  return (
    <div className="pl-5 p-1 rounded-3xl flex flex-col gap-3 w-60">
      <h1 className="text-5xl font-light">Welcome back {user}</h1>
    </div>
  );
}
