import "./index.css";
import { Navbar } from "./components/layout/navbar";
import { Route, Routes } from "react-router-dom";
import { Tasks } from "./pages/tasks/tasks";
import { Finances } from "./pages/finance/finance";
import { Habbits } from "./pages/habbits/habbits";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Inbox } from "./pages/tasks/taskinbox";
import { Today } from "./pages/tasks/tasktoday";
import { Upcoming } from "./pages/tasks/taskupcom";
import { Completed } from "./pages/tasks/taskcompleted";

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#e4f4ff] to-[#f8c778]">
      {/* // <div
    //   className="h-screen bg-cover bg-center"
    //   style={{ backgroundImage: `url(${bg})` }}> */}
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<Tasks />}>
          <Route index element={<Inbox />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="today" element={<Today />} />
          <Route path="upcoming" element={<Upcoming />} />
          <Route path="completed" element={<Completed />} />
        </Route>

        <Route path="/finances" element={<Finances />} />
        <Route path="/habits" element={<Habbits />} />
      </Routes>
    </div>
  );
}
export default App;
