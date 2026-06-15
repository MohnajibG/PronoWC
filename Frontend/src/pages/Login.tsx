/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

import { Trophy, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      // 🔐 Firebase login
      await signInWithEmailAndPassword(auth, email, password);

      // 🚀 redirect after login
      navigate("/profile");
    } catch (err: any) {
      // eslint-disable-next-line no-useless-assignment
      let message = "Erreur de connexion";

      switch (err.code) {
        case "auth/user-not-found":
          message = "Aucun compte trouvé avec cet email";
          break;

        case "auth/wrong-password":
          message = "Mot de passe incorrect";
          break;

        case "auth/invalid-email":
          message = "Email invalide";
          break;

        case "auth/too-many-requests":
          message = "Trop de tentatives. Réessaie plus tard";
          break;

        default:
          message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <Trophy className="mx-auto text-red-500 mb-6" size={48} />

          <h1 className="text-3xl font-bold text-center text-white">
            Connexion
          </h1>

          <p className="text-gray-400 text-center mt-2">
            Accède à tes pronostics
          </p>

          {/* ERROR */}
          {error && (
            <div className="mt-4 text-center text-red-500 text-sm">{error}</div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-transparent outline-none text-white"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4">
              <Lock size={18} className="text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-transparent outline-none text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Pas encore de compte ?
            <Link to="/signup" className="text-red-500 ml-2">
              S'inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
