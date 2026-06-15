import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

import { motion } from "framer-motion";
import { Trophy, User, Mail, Lock, Flag, Eye, EyeOff } from "lucide-react";

import { countries } from "../data/countries";
import { favoriteTeams } from "../data/favoriteTeam";

type Country = (typeof countries)[0];
type Team = (typeof favoriteTeams)[0];

export default function Signup() {
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");

  const [country, setCountry] = useState<Country | null>(null);
  const [countryQuery, setCountryQuery] = useState("");

  const [favoriteTeam, setFavoriteTeam] = useState<Team | null>(null);
  const [teamQuery, setTeamQuery] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    pseudo?: string;
    country?: string;
    team?: string;
    email?: string;
    password?: string;
    firebase?: string;
  }>({});

  // 🌍 FILTER COUNTRIES
  const filteredCountries = countryQuery
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(countryQuery.toLowerCase()),
      )
    : [];

  // ⚽ FILTER TEAMS
  const filteredTeams = teamQuery
    ? favoriteTeams.filter((t) =>
        t.name.toLowerCase().includes(teamQuery.toLowerCase()),
      )
    : [];

  const validate = () => {
    const e: typeof errors = {};

    if (!pseudo || pseudo.length < 3) e.pseudo = "Pseudo trop court";
    if (!country) e.country = "Sélectionne ton pays";
    if (!favoriteTeam) e.team = "Sélectionne une équipe";
    if (!email.includes("@")) e.email = "Email invalide";
    if (!password || password.length < 6)
      e.password = "Mot de passe (min 6 caractères)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // 🔐 1. Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const uid = userCredential.user.uid;

      // 🔑 2. Firebase token (IMPORTANT)
      const token = await userCredential.user.getIdToken();

      // 🧠 3. MongoDB sync
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUid: uid,
          email,
          pseudo,
          country: country?.name,
          favoriteTeam: favoriteTeam?.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur backend création user");
      }

      // 🚀 4. redirect
      navigate("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = "Erreur création compte";

      if (err.code === "auth/email-already-in-use") {
        message = "Cet email est déjà utilisé";
      }

      if (err.code === "auth/invalid-email") {
        message = "Email invalide";
      }

      if (err.code === "auth/weak-password") {
        message = "Mot de passe trop faible";
      }

      setErrors({
        firebase: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#111827]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <Trophy className="mx-auto text-red-500 mb-6" size={48} />

          <h1 className="text-3xl font-bold text-center text-white">
            Créer un compte
          </h1>

          {errors.firebase && (
            <p className="text-red-500 text-center mt-3">{errors.firebase}</p>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* PSEUDO */}
            <div>
              <div className="flex items-center border border-white/10 rounded-xl px-4">
                <User size={18} className="text-gray-500" />
                <input
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Pseudo"
                  className="w-full p-4 bg-transparent outline-none text-white"
                />
              </div>
              {errors.pseudo && (
                <p className="text-red-500 text-xs mt-1">{errors.pseudo}</p>
              )}
            </div>

            {/* COUNTRY */}
            <div className="relative">
              <div className="flex items-center border border-white/10 rounded-xl px-4">
                <Flag size={18} className="text-gray-500" />
                <input
                  value={country ? country.name : countryQuery}
                  onChange={(e) => {
                    setCountry(null);
                    setCountryQuery(e.target.value);
                  }}
                  placeholder="Pays"
                  className="w-full p-4 bg-transparent outline-none text-white"
                />
              </div>

              {filteredCountries.length > 0 && !country && (
                <div className="absolute z-50 mt-2 w-full bg-black/80 border border-white/10 rounded-xl max-h-60 overflow-auto backdrop-blur-xl">
                  {filteredCountries.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => {
                        setCountry(c);
                        setCountryQuery("");
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/10"
                    >
                      <img src={c.flag} className="w-6 h-4" />
                      <span className="text-white text-sm">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* TEAM */}
            <div className="relative">
              <div className="flex items-center border border-white/10 rounded-xl px-4">
                <Trophy size={18} className="text-gray-500" />
                <input
                  value={favoriteTeam ? favoriteTeam.name : teamQuery}
                  onChange={(e) => {
                    setFavoriteTeam(null);
                    setTeamQuery(e.target.value);
                  }}
                  placeholder="Équipe favorite (Coupe du Monde)"
                  className="w-full p-4 bg-transparent outline-none text-white"
                />
              </div>

              {filteredTeams.length > 0 && !favoriteTeam && (
                <div className="absolute z-50 mt-2 w-full bg-black/80 border border-white/10 rounded-xl max-h-60 overflow-auto backdrop-blur-xl">
                  {filteredTeams.map((t) => (
                    <div
                      key={t.code}
                      onClick={() => {
                        setFavoriteTeam(t);
                        setTeamQuery("");
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/10"
                    >
                      <img src={t.flag} className="w-6 h-4" />
                      <span className="text-white text-sm">{t.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {errors.team && (
                <p className="text-red-500 text-xs mt-1">{errors.team}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4">
                <Mail size={18} className="text-gray-500" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-4 bg-transparent outline-none text-white"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Déjà inscrit ?
            <Link to="/login" className="text-red-500 ml-2">
              Connexion
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
