export function formatLocalDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })}`;
}

export function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export function isPast(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return d < t;
}

export function FormatHeader(dateStr: string) {
  const d = new Date(dateStr);

  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const weekday = d.toLocaleString("default", { weekday: "long" });

  const todayDate = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(todayDate.getDate() + 1);

  const isToday = d.toDateString() === todayDate.toDateString();

  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  let label = "";
  if (isToday) label = "Today";
  else if (isTomorrow) label = "Tomorrow";

  return `${day} ${month}${label ? ` · ${label}` : ""} · ${weekday}`;
}
