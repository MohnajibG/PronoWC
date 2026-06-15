/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const API_URL = "https://www.openligadb.de/Matches/wm26/2026/1";

export function useLiveMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  return { matches, loading };
}
