import { useEffect, useState, type FC } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBarChart2,
  FiAward,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Header: FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // 🔐 listen auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // 🚪 logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-white font-bold text-xl tracking-wide">
          Prono<span className="text-blue-400">WC</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300 text-sm">
          <a href="#" className="hover:text-white flex items-center gap-1">
            <FiHome /> Accueil
          </a>
          <a href="#" className="hover:text-white flex items-center gap-1">
            <FiAward /> Pronostics
          </a>
          <a href="#" className="hover:text-white flex items-center gap-1">
            <FiBarChart2 /> Stats
          </a>
          <a href="#" className="hover:text-white flex items-center gap-1">
            <FiUser /> Profil
          </a>
        </nav>

        {/* CTA DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
            >
              Se connecter
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition"
              >
                Profil
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition flex items-center gap-2"
              >
                <FiLogOut /> Déconnexion
              </button>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 bg-black/60 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col gap-4 text-gray-300 text-sm">
            <a href="#" className="hover:text-white">
              Accueil
            </a>
            <a href="#" className="hover:text-white">
              Pronostics
            </a>
            <a href="#" className="hover:text-white">
              Stats
            </a>
            <a href="#" className="hover:text-white">
              Profil
            </a>
          </nav>

          <div className="mt-4">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                Se connecter
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white text-sm"
                >
                  Profil
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-xl bg-red-600 text-white text-sm"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
