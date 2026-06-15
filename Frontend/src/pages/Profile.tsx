import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

import { Trophy, Target, Medal, User } from "lucide-react";

type UserProfile = {
  pseudo: string;
  country: string;
  favoriteTeam: string;
  points: number;
  rank: string;
  predictionsCount: number;
};

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5000/api/users/${firebaseUser.uid}`,
        );

        if (!res.ok) {
          throw new Error("Impossible de récupérer le profil");
        }

        const data: UserProfile = await res.json();
        setUser(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Erreur serveur");

        // fallback minimal pour éviter page vide
        setUser({
          pseudo: firebaseUser.email?.split("@")[0] || "User",
          country: "Non défini",
          favoriteTeam: "Non défini",
          points: 0,
          rank: "Non classé",
          predictionsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center text-white">
        Chargement du profil...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
          {/* ERROR */}
          {error && (
            <div className="mb-6 text-red-500 text-center">{error}</div>
          )}

          {/* HEADER */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-red-600/20 flex items-center justify-center">
              <User size={60} className="text-red-500" />
            </div>

            <h1 className="text-4xl font-bold mt-5">{user.pseudo}</h1>

            <p className="text-gray-400 mt-2">{user.country}</p>

            <p className="text-red-500 mt-1">{user.favoriteTeam}</p>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-black/20 rounded-2xl p-6">
              <Trophy className="text-yellow-500 mb-4" size={30} />
              <h3 className="text-3xl font-bold">{user.points}</h3>
              <p className="text-gray-400">Points</p>
            </div>

            <div className="bg-black/20 rounded-2xl p-6">
              <Target className="text-red-500 mb-4" size={30} />
              <h3 className="text-3xl font-bold">{user.predictionsCount}</h3>
              <p className="text-gray-400">Pronostics</p>
            </div>

            <div className="bg-black/20 rounded-2xl p-6">
              <Medal className="text-blue-500 mb-4" size={30} />
              <h3 className="text-3xl font-bold">{user.rank}</h3>
              <p className="text-gray-400">Classement</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition">
              Faire un pronostic
            </button>

            <button className="border border-white/10 hover:bg-white/5 py-4 rounded-xl transition">
              Voir le classement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
