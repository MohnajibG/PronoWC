/* eslint-disable @typescript-eslint/no-explicit-any */
export function groupByStage(matches: any[]) {
  return matches.reduce((acc: Record<string, any[]>, m) => {
    const key = m.group?.groupName ?? "Other";
    acc[key] = acc[key] || [];
    acc[key].push(m);
    return acc;
  }, {});
}
