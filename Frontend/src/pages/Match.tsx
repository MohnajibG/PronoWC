import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getMatchById } from "../services/api";

type Event = {
  EventType: string;
  MatchMinute: number;
  PlayerName?: string;
  EventTeam: string;
};

type MatchType = {
  MatchID: number;
  MatchDateTime: string;
  Location?: {
    LocationCity?: string;
    LocationStadium?: string;
  };
  Team1: { TeamName: string };
  Team2: { TeamName: string };
  MatchResults?: {
    PointsTeam1: number;
    PointsTeam2: number;
  }[];
  MatchIsFinished: boolean;
  Goals?: Event[];
  Cards?: Event[];
};

export default function Match() {
  const { id } = useParams();

  const [match, setMatch] = useState<MatchType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMatchById(id!, 1);
        setMatch(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement du match...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Match introuvable</p>
      </div>
    );
  }

  const score = match.MatchResults?.[0];

  return (
    <div className="min-h-screen bg-(--color-light) p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl">Coupe du Monde 2026</h1>

          <p className="text-gray-500 text-sm mt-1">
            {new Date(match.MatchDateTime).toLocaleString("fr-FR")}
          </p>

          {match.Location && (
            <p className="text-gray-400 text-sm mt-1">
              {match.Location.LocationStadium} - {match.Location.LocationCity}
            </p>
          )}
        </div>

        {/* SCORE BOARD */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-center w-1/3">
            <p className="text-xl font-bold">{match.Team1.TeamName}</p>
          </div>

          <div className="text-center">
            <p className="text-5xl font-black text-(--color-primary)">
              {score ? score.PointsTeam1 : "-"} :{" "}
              {score ? score.PointsTeam2 : "-"}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {match.MatchIsFinished ? "Terminé" : "En cours / À venir"}
            </p>
          </div>

          <div className="text-center w-1/3">
            <p className="text-xl font-bold">{match.Team2.TeamName}</p>
          </div>
        </div>

        {/* INFOS */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Match ID</p>
            <p className="font-bold">{match.MatchID}</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Statut</p>
            <p className="font-bold">
              {match.MatchIsFinished ? "Terminé" : "Live / À venir"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-bold">
              {new Date(match.MatchDateTime).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        {/* EVENTS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* GOALS */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-bold mb-3">⚽ Buts</h2>

            {match.Goals && match.Goals.length > 0 ? (
              match.Goals.map((g, i) => (
                <div key={i} className="text-sm py-1">
                  ⏱ {g.MatchMinute}' - {g.PlayerName} ({g.EventTeam})
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun but</p>
            )}
          </div>

          {/* CARDS */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-bold mb-3">🟨 Cartons</h2>

            {match.Cards && match.Cards.length > 0 ? (
              match.Cards.map((c, i) => (
                <div key={i} className="text-sm py-1">
                  ⏱ {c.MatchMinute}' - {c.PlayerName} ({c.EventTeam})
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun carton</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
