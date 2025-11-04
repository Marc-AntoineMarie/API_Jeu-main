import React, { useEffect, useState } from "react";
import axios from "axios";

interface Game {
  _id: string;
  title: string;
  description?: string;
  release_year?: number;
  genre: {
    _id: string;
    name: string;
  } | string;
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    release_year: "",
    genre: "",
  });

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/game/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGames(Array.isArray(res.data.games) ? res.data.games : []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des jeux.");
      } else {
        setError("Erreur inconnue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:3000/api/genre/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle genres if needed
      setGenres(Array.isArray(res.data.genres) ? res.data.genres : []);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des genres.");
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token manquant.");

      const res = await axios.post(
        "http://localhost:3000/api/game/new",
        {
          title: newGame.title,
          description: newGame.description,
          release_year: Number(newGame.release_year),
          genre: newGame.genre,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGames((prev) => [...prev, res.data.game]);
      setNewGame({ title: "", description: "", release_year: "", genre: "" });
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de l’ajout du jeu.");
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des jeux...</p>;
  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Games</h2>
        <button
          className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Game"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddGame}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newGame.title}
              onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newGame.description}
              onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Release year"
              value={newGame.release_year}
              onChange={(e) => setNewGame({ ...newGame, release_year: e.target.value })}
              className="border p-2 rounded"
            />
            { genres.map(g => (
              <div key={g._id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={g._id}
                  name="genre"
                  value={g._id}
                  checked={newGame.genre === g._id}
                  onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                  className="border"
                />
                <label htmlFor={g._id}>{g.name}</label>
              </div>
            )) }

          </div>
          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Save
          </button>
        </form>
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left text-sm font-medium text-gray-900">ID</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Title</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Genre</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Release Year</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g._id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-700">{g._id}</td>
              <td className="p-3 text-sm font-medium text-gray-900">{g.title}</td>
              <td className="p-3 text-sm text-gray-700">
                {typeof g.genre === "object" ? g.genre.name : g.genre}
              </td>
              <td className="p-3 text-sm font-medium text-gray-900">{g.release_year || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
