import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [totalGenres, setTotalGenres] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Aucun token trouvé. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const [usersRes, gamesRes, reviewsRes, genresRes] = await Promise.all([
          axios.get("http://localhost:3000/api/users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/game/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/review/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/genre/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalUsers(usersRes.data.users?.length || 0);
        setTotalGames(gamesRes.data.games?.length || 0);
        setTotalReviews(reviewsRes.data.review?.length || 0);
        setTotalGenres(genresRes.data.genres?.length || 0);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Erreur lors du chargement du tableau de bord.");
        } else {
          setError("Erreur inconnue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

return (
  <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <Card title="Total Users" value={totalUsers.toString()} />
    <Card title="Games" value={totalGames.toString()} />
    <Card title="Reviews" value={totalReviews.toString()} />
    <Card title="Genres" value={totalGenres.toString()} />
  </div>
);
}
