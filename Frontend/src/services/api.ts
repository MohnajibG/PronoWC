/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "https://api.openligadb.de";

// ----------------------
// MATCHS WC2026
// ----------------------
export async function getMatches(matchday: number = 1) {
  const res = await fetch(`${BASE_URL}/getmatchdata/wm26/2026/${matchday}`);

  if (!res.ok) {
    throw new Error("Erreur API matchs");
  }

  return res.json();
}

// ----------------------
// MATCH UNIQUE (par ID)
// ----------------------
export async function getMatchById(id: string, matchday: number = 1) {
  const matches = await getMatches(matchday);

  return matches.find((m: any) => m.MatchID.toString() === id);
}

// ----------------------
// CLASSEMENT (si dispo OpenLigaDB)
// ----------------------
export async function getRanking() {
  const res = await fetch(`${BASE_URL}/getbltable/wm26/2026`);

  if (!res.ok) {
    throw new Error("Erreur API ranking");
  }

  return res.json();
}

// ----------------------
// GROUPES / PHASES
// ----------------------
export async function getGroups() {
  const res = await fetch(`${BASE_URL}/getavailablegroups/wm26/2026`);

  if (!res.ok) {
    throw new Error("Erreur API groups");
  }

  return res.json();
}
