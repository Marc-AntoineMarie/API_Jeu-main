import { Home, Users, Gamepad2, Star, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/Dashboard", icon: <Home size={18} /> },
    { name: "Users", path: "/users", icon: <Users size={18} /> },
    { name: "Games", path: "/games", icon: <Gamepad2 size={18} /> },
    { name: "Reviews", path: "/reviews", icon: <Star size={18} /> },
    { name: "Genres", path: "/genres", icon: <Tag size={18} /> },
    { name: "Gamelist", path: "/gamelist", icon: <Gamepad2 size={18} /> },
  ];

  return (
    <aside className="bg-[#0D0A4B] text-white w-60 h-screen p-4 fixed left-0 top-0 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center">MyGameList</h1>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-[#3A6D8C] ${
                isActive ? "bg-[#3A6D8C]" : ""
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
