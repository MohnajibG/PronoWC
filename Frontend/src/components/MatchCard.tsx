import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface MatchCardProps {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status?: "scheduled" | "finished";
}

export default function MatchCard({
  _id,
  homeTeam,
  awayTeam,
  matchDate,
  homeScore,
  awayScore,
  status = "scheduled",
}: MatchCardProps) {
  const isFinished =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
      <div className="h-2 bg-[#F59E0B]" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs uppercase tracking-widest text-slate-500"
            style={{ fontFamily: "Archivo Black" }}
          >
            Coupe du Monde 2026
          </span>

          {status === "finished" ? (
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Terminé
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
              À venir
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 items-center mb-6">
          <div className="text-center">
            <h3 className="text-lg" style={{ fontFamily: "Archivo Black" }}>
              {homeTeam}
            </h3>
          </div>

          <div className="text-center">
            {isFinished ? (
              <div className="text-3xl" style={{ fontFamily: "Archivo Black" }}>
                {homeScore} - {awayScore}
              </div>
            ) : (
              <div
                className="text-2xl text-slate-400"
                style={{ fontFamily: "Archivo Black" }}
              >
                VS
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-lg" style={{ fontFamily: "Archivo Black" }}>
              {awayTeam}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 mb-5">
          <CalendarDays size={18} />
          <span>{dayjs(matchDate).format("DD/MM/YYYY • HH:mm")}</span>
        </div>

        <Link
          to={`/match/${_id}`}
          className="block w-full text-center bg-[#F59E0B] hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Pronostiquer
        </Link>
      </div>
    </div>
  );
}
