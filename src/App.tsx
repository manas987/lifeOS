import "./index.css";
import { Navbar } from "./components/layout/navbar";
import { Route, Routes } from "react-router-dom";
import { Tasks } from "./pages/tasks";
import { Finances } from "./pages/finance";
import { Habbits } from "./pages/habbits";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#e4f4ff] to-[#f8c778]">
      <Navbar />
      <Routes>
        <Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/habits" element={<Habbits />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
