import React, { useEffect, useState } from "react";
import axios from "axios";

interface Game {
  _id: string;
  title: string;
}

interface GameList {
  _id: string;
  user: string;
  game: Game;
  status: string;
}

export default function GameListPage() {
  const [gameList, setGameList] = useState<GameList[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newGameList, setNewGameList] = useState({
    user: "",
    game: "",
    status: "Pending",
  });

  // 🔹 Récupérer la liste des GameList
  const fetchGameList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/gamelist/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGameList(Array.isArray(res.data.gamelist) ? res.data.gamelist : []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des listes de jeux.");
      } else {
        setError("Erreur inconnue.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer tous les jeux disponibles
  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/game/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(Array.isArray(res.data.games) ? res.data.games : []);
    } catch (err) {
      console.error("Erreur lors du chargement des jeux :", err);
    }
  };

  // 🔹 Ajouter une GameList
  const handleAddGameList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token manquant.");

      const res = await axios.post(
        "http://localhost:3000/api/gamelist/new",
        newGameList,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGameList((prev) => [...prev, res.data.gamelist || res.data]);
      setNewGameList({ user: "", game: "", status: "Pending" });
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la création de la GameList.");
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  useEffect(() => {
    fetchGameList();
    fetchGames();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Game Lists</h2>

      {/* Bouton pour afficher / masquer le formulaire */}
      <button
        className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer le formulaire" : "➕ Ajouter une GameList"}
      </button>

      {/* Formulaire d’ajout */}
      {showForm && (
        <form
          onSubmit={handleAddGameList}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="User ID"
              value={newGameList.user}
              onChange={(e) => setNewGameList({ ...newGameList, user: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <select
              value={newGameList.game}
              onChange={(e) => setNewGameList({ ...newGameList, game: e.target.value })}
              required
              className="border p-2 rounded"
            >
              <option value="">Sélectionnez un jeu</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title}
                </option>
              ))}
            </select>
            <select
              value={newGameList.status}
              onChange={(e) => setNewGameList({ ...newGameList, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Enregistrer
          </button>
        </form>
      )}

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gameList.map((g) => (
              <tr key={g._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-700">{g._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.user}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {g.game?.title || "Inconnu"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
