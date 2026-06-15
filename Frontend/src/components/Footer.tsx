import type { FC } from "react";
import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";

const Footer: FC = () => {
  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-black/40 backdrop-blur-md text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left */}
        <div className="text-center md:text-left">
          <h2 className="text-white text-xl font-semibold">PronoWC</h2>
          <p className="text-sm text-gray-400 mt-1">
            Prédictions & statistiques en temps réel.
          </p>
        </div>

        {/* Center links */}
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">
            Accueil
          </a>
          <a href="#" className="hover:text-white transition">
            Pronostics
          </a>
          <a href="#" className="hover:text-white transition">
            Stats
          </a>
          <a href="#" className="hover:text-white transition">
            Dashboard
          </a>
        </div>

        {/* Right icons */}
        <div className="flex gap-4 text-lg">
          <a href="#" className="hover:text-white transition">
            <FiGithub />
          </a>
          <a href="#" className="hover:text-white transition">
            <FiTwitter />
          </a>
          <a
            href="mailto:contact@pronowc.com"
            className="hover:text-white transition"
          >
            <FiMail />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} PronoWC — Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
