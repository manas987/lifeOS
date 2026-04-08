import "./index.css";
import { Navbar } from "./navbar";
import { Route, Routes } from "react-router-dom";
import { Tasks } from "./pages/tasks/tasks";
import { Finances } from "./pages/finance/finance";
import { Habits } from "./pages/habits/habits";
import { Dashboar } from "./pages/dashboard/dashboard";
import { Inbox } from "./pages/tasks/subpages/taskinbox";
import { Today } from "./pages/tasks/subpages/tasktoday";
import { Upcoming } from "./pages/tasks/subpages/taskupcom";
import { Completed } from "./pages/tasks/subpages/taskcompleted";
import { ProjectPage } from "./pages/tasks/subpages/projects";
import { AllHabits } from "./pages/habits/pages/habbits";
import { HabitsInbox } from "./pages/habits/pages/inbox";
import { Dashboard } from "./pages/finance/pages/dashboard";
import { Debt } from "./pages/finance/pages/Debt";
import { Logs } from "./pages/finance/pages/logs";
import { Subscriptions } from "./pages/finance/pages/subscriptions";

function App() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-[#e4f4ff] to-[#f4cd8d]">
    <div
      className="min-h-screen bg-gradient-to-br 
  from-[#e4f4ff] to-[#d6c562] 
  dark:from-[#000000]  dark:to-[#06387e] dark:text-white">
      <Navbar />
      <Routes>
        <Route index element={<Dashboar />} />

        <Route path="/tasks" element={<Tasks />}>
          <Route index element={<Inbox />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="today" element={<Today />} />
          <Route path="upcoming" element={<Upcoming />} />
          <Route path="completed" element={<Completed />} />
          <Route path="project/:projectName" element={<ProjectPage />} />
        </Route>

        <Route path="/habits" element={<Habits />}>
          <Route index element={<HabitsInbox />} />
          <Route path="allhabits" element={<AllHabits />} />
        </Route>

        <Route path="/finances" element={<Finances />}>
          <Route index element={<Dashboard />} />
          <Route path="debt" element={<Debt />} />
          <Route path="logs" element={<Logs />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
