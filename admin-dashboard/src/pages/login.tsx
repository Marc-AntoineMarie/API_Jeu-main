import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      const { token, message } = res.data;

      // ✅ Sauvegarde du token
      localStorage.setItem("token", token);

      // ✅ Message de succès
      setMessage(message || "Connexion réussie ✅");
      console.log("Connexion réussie :", res.data);

      
        navigate("/dashboard");
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Erreur de connexion ❌");
      } else {
        setMessage("Une erreur inattendue est survenue ❌");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 text-white"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition-colors"
        >
          Se connecter
        </button>
        {/* <button  className="w-full bg-red-600 hover:bg-blue-700 p-2 rounded font-semibold transition-colors mt-4" onClick={() => navigate("/register")}>Creer un compte</button> */}

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

