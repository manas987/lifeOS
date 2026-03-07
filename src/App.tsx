import "./index.css";
import { Navbar } from "./components/layout/navbar";
import { Route, Routes } from "react-router-dom";
import { Tasks } from "./pages/tasks";
import { Finances } from "./pages/finance";
import { Habbits } from "./pages/habbits";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <div className="bg-[url('/src/assets/background.jpg')] bg-cover bg-center min-h-screen">
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
