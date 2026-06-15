/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

import { Trophy, Target, Medal, User, CheckCircle, Star } from "lucide-react";

type UserProfile = {
  pseudo: string;
  email: string;
  avatar: string;
  country: string;
  favoriteTeams: string[];

  points: number;
  rank: string;

  predictionsCount: number;
  correctPredictions: number;
  exactScores: number;
  accuracy: number;
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

        const data = await res.json();

        setUser(data);
      } catch (err: any) {
        setError(err.message || "Erreur serveur");

        setUser({
          pseudo: firebaseUser.email?.split("@")[0] || "Utilisateur",
          email: firebaseUser.email || "",
          avatar: "",
          country: "Non défini",
          favoriteTeams: [],
          points: 0,
          rank: "Non classé",
          predictionsCount: 0,
          correctPredictions: 0,
          exactScores: 0,
          accuracy: 0,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center text-white text-xl">
        Chargement du profil...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
          {/* HEADER */}
          <div className="relative p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10" />

            <div className="relative flex flex-col items-center">
              {/* AVATAR */}
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.pseudo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-500/20 flex items-center justify-center">
                    <User size={70} className="text-red-500" />
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold mt-6">{user.pseudo}</h1>

              <p className="text-gray-400 mt-2">{user.email}</p>

              <p className="text-white/70 mt-1">{user.country}</p>

              {/* FAVORITE TEAMS */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {user.favoriteTeams?.length > 0 ? (
                  user.favoriteTeams.map((team) => (
                    <span
                      key={team}
                      className="px-4 py-2 rounded-full bg-red-500/15 border border-red-500/20 text-red-400 text-sm"
                    >
                      {team}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Aucune équipe favorite</span>
                )}
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mx-6 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-center">
              {error}
            </div>
          )}

          {/* STATS PRINCIPALES */}
          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <Trophy className="text-yellow-500 mb-4" size={32} />
              <h3 className="text-4xl font-bold">{user.points}</h3>
              <p className="text-gray-400 mt-2">Points</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <Target className="text-red-500 mb-4" size={32} />
              <h3 className="text-4xl font-bold">{user.predictionsCount}</h3>
              <p className="text-gray-400 mt-2">Pronostics</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <Medal className="text-blue-500 mb-4" size={32} />
              <h3 className="text-2xl font-bold">{user.rank}</h3>
              <p className="text-gray-400 mt-2">Classement</p>
            </div>
          </div>

          {/* STATS AVANCÉES */}
          <div className="grid md:grid-cols-3 gap-6 px-6 pb-6">
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <CheckCircle className="text-green-500 mb-4" size={32} />
              <h3 className="text-4xl font-bold">{user.correctPredictions}</h3>
              <p className="text-gray-400 mt-2">Pronostics corrects</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <Star className="text-yellow-400 mb-4" size={32} />
              <h3 className="text-4xl font-bold">{user.exactScores}</h3>
              <p className="text-gray-400 mt-2">Scores exacts</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <Target className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-4xl font-bold">
                {user.accuracy?.toFixed(1)}%
              </h3>
              <p className="text-gray-400 mt-2">Taux de réussite</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid md:grid-cols-2 gap-4 p-6 pt-0">
            <button
              onClick={() => navigate("/predictions")}
              className="bg-red-600 hover:bg-red-700 transition py-4 rounded-xl font-semibold"
            >
              Faire un pronostic
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="border border-white/10 hover:bg-white/5 transition py-4 rounded-xl font-semibold"
            >
              Voir le classement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
