/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useLiveMatches } from "../hooks/useLiveMatches";
import { groupByStage } from "../hooks/groupByStage";
import { getMatchStatus } from "../hooks/getMatchStatus";

export default function LiveScorePro() {
  const { matches, loading } = useLiveMatches();

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">
        Chargement des matchs...
      </div>
    );
  }

  const grouped = groupByStage(matches);

  return (
    <div className="space-y-10">
      {Object.entries(grouped as Record<string, any[]>).map(
        ([groupName, list]) => (
          <div key={groupName}>
            <h2 className="text-sm uppercase text-gray-400 mb-4">
              {groupName}
            </h2>

            <div className="space-y-3">
              {list.map((m: any) => {
                const status = getMatchStatus(m);

                const result = m.matchResults?.find(
                  (r: any) => r.resultTypeID === 2,
                );

                const score = result
                  ? `${result.pointsTeam1} - ${result.pointsTeam2}`
                  : "VS";

                return (
                  <motion.div
                    key={m.matchID}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                    relative p-4 rounded-2xl
                    bg-[#111827]
                    border border-white/10
                    flex items-center justify-between
                  "
                  >
                    {/* STATUS BADGE */}
                    <div className="absolute top-3 right-3">
                      {status === "LIVE" && (
                        <span className="text-xs px-2 py-1 rounded bg-red-600 animate-pulse">
                          LIVE
                        </span>
                      )}

                      {status === "UPCOMING" && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-600">
                          SOON
                        </span>
                      )}

                      {status === "FINISHED" && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-600">
                          FT
                        </span>
                      )}
                    </div>

                    {/* TEAM 1 */}
                    <div className="flex items-center gap-3 w-1/3">
                      <img src={m.team1.teamIconUrl} className="w-7 h-7" />
                      <span>{m.team1.teamName}</span>
                    </div>

                    {/* SCORE */}
                    <div className="text-lg font-bold">{score}</div>

                    {/* TEAM 2 */}
                    <div className="flex items-center gap-3 w-1/3 justify-end">
                      <span>{m.team2.teamName}</span>
                      <img src={m.team2.teamIconUrl} className="w-7 h-7" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
