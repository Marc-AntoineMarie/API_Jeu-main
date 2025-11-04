import React, { useEffect, useState } from "react";

export default function Topbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // redirige vers la page de login
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-[#0D0A4B]">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        {token ? (
          <span className="text-sm text-gray-700 max-w-xs truncate">
            Token: {token}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Aucun token</span>
        )}

        <button
          onClick={handleLogout}
          className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
