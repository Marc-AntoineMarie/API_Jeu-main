import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Games from "./pages/Games";
import Login from "./pages/login";
import Review from "./pages/Review";
import Genres from "./pages/Genre";
import Register from "./pages/register";
import GameList from "./pages/GameList";

export default function App() {
  return (
<Router>
  <Routes>
    {/* Routes publiques */}
    <Route path="/login" element={<Login />} />
    {/* <Route path="/register" element={<Register />} /> */}

    {/* Routes protégées */}
    {localStorage.getItem("token") ? (
      <Route
        path="/"
        element={
          <div className="flex">
            <Sidebar />
            <main className="ml-60 w-full bg-gray-50 min-h-screen">
              <Topbar />
              <Outlet />
            </main>
          </div>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="games" element={<Games />} />
        <Route path="reviews" element={<Review />} />
        <Route path="genres" element={<Genres />} />
        <Route path="gamelist" element={<GameList />} />

      </Route>
    ) : (
      <Route path="/*" element={<Navigate to="/login" />} />
    )}
  </Routes>
</Router>
  );
}
