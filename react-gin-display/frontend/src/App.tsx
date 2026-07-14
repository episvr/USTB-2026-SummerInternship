import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
