/* eslint-disable @typescript-eslint/no-explicit-any */
export function getMatchStatus(match: any) {
  const now = new Date();
  const start = new Date(match.matchDateTime);

  if (match.matchIsFinished) return "FINISHED";
  if (start > now) return "UPCOMING";
  return "LIVE";
}
