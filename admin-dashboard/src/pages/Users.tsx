import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  nickname?: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 États pour le formulaire d’ajout
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  // 🔹 Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users || res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des utilisateurs.");
      } else {
        setError("Erreur inconnue.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Ajouter un utilisateur
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token manquant.");

      const res = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          name: newUser.name,
          nickname: newUser.nickname,
          email: newUser.email,
          password: newUser.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ajout dans la liste locale
      setUsers((prev) => [...prev, res.data.user]);
      setNewUser({ name: "", nickname: "", email: "", password: "" });
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la création de l’utilisateur.");
      } else {
        setError("Erreur inconnue.");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des utilisateurs...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Utilisateurs</h2>
        <button
          className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "+ Add User"}
        </button>
      </div>

      {/* 🔹 Formulaire d’ajout d’un utilisateur */}
      {showForm && (
        <form
          onSubmit={handleAddUser}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Nickname"
              value={newUser.nickname}
              onChange={(e) => setNewUser({ ...newUser, nickname: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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

      {/* 🔹 Tableau des utilisateurs */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date création
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-500">{user._id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
