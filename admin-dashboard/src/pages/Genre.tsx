import React, { useEffect, useState } from "react";
import axios from "axios";

interface Genre {
  _id: string;
  name: string;
}

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newGenre, setNewGenre] = useState({
    name: "",
  });

  // Charger les genres existants
  useEffect(() => {
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

        console.log("Genres reçus :", res.data);
        // Certains backends renvoient { genres: [...] }, d'autres directement le tableau
        setGenres(res.data.genres || res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Erreur lors du chargement des genres.");
        } else {
          setError("Erreur inconnue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Ajouter un nouveau genre
  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token manquant.");

      const res = await axios.post(
        "http://localhost:3000/api/genre/new",
        { name: newGenre.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ajout du genre dans la liste locale
      setGenres((prev) => [...prev, res.data.genre || res.data]);
      setNewGenre({ name: "" });
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la création du genre.");
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des genres...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Genres</h2>

      {/* Bouton pour afficher / masquer le formulaire */}
      <button
        className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer le formulaire" : "➕ Ajouter un genre"}
      </button>

      {/* Formulaire d’ajout */}
      {showForm && (
        <form
          onSubmit={handleAddGenre}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nom du genre (ex : Action)"
              value={newGenre.name}
              onChange={(e) => setNewGenre({ name: e.target.value })}
              required
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Enregistrer
          </button>
        </form>
      )}

      {/* Tableau des genres */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du genre
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {genres.map((g) => (
              <tr key={g._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{g.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
