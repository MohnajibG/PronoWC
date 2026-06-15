import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Target, Users, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.15),transparent_50%)]" />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <Trophy size={16} />
              World Cup Predictor
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Pronostique la
              <span className="block text-red-500">Coupe du Monde</span>
            </h1>

            <p className="mt-8 text-xl text-gray-400 leading-relaxed max-w-xl">
              Connecte-toi, crée ton profil et réalise tes pronostics sur tous
              les matchs de la Coupe du Monde. Gagne des points et grimpe dans
              le classement général.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/login"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 transition font-semibold"
              >
                Se connecter
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/signup"
                className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition"
              >
                Créer un compte
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-8 text-sm text-gray-500">
              <ShieldCheck size={16} />
              Authentification sécurisée via Firebase
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-red-500/10 blur-3xl rounded-full" />

            <div className="relative bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
                alt="Football"
                className="w-full h-125 object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#0B0F1A] via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold">Fais tes prédictions</h3>

                <p className="text-gray-300 mt-2">
                  Score exact, vainqueur et classement final.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <Target className="text-red-500 mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Pronostics</h3>
            <p className="text-gray-400">
              Prédit les résultats des matchs et accumule des points.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <Users className="text-red-500 mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Classement</h3>
            <p className="text-gray-400">
              Compare tes performances avec les autres joueurs.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <Trophy className="text-red-500 mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Gagne</h3>
            <p className="text-gray-400">
              Grimpe dans le classement mondial des pronostiqueurs.
            </p>
          </div>
        </div>
      </section>

      {/* USER FLOW */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comment ça fonctionne ?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
            <div className="text-red-500 text-4xl font-bold mb-4">1</div>
            <h3 className="font-semibold mb-2">Connexion</h3>
            <p className="text-gray-400 text-sm">Connecte-toi avec Firebase.</p>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
            <div className="text-red-500 text-4xl font-bold mb-4">2</div>
            <h3 className="font-semibold mb-2">Profil</h3>
            <p className="text-gray-400 text-sm">Complète ton profil joueur.</p>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
            <div className="text-red-500 text-4xl font-bold mb-4">3</div>
            <h3 className="font-semibold mb-2">Pronostics</h3>
            <p className="text-gray-400 text-sm">
              Pronostique les matchs à venir.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-white/10">
            <div className="text-red-500 text-4xl font-bold mb-4">4</div>
            <h3 className="font-semibold mb-2">Classement</h3>
            <p className="text-gray-400 text-sm">
              Gagne des points et monte au classement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
