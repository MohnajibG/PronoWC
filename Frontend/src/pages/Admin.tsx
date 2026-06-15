import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Vérification admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  // Charger matchs
  useEffect(() => {
    const fetchMatches = async () => {
      const snapshot = await getDocs(collection(db, "matches"));

      const data: Match[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Match, "id">),
      }));

      setMatches(data);
    };

    fetchMatches();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return <p>Chargement...</p>;

  if (!isAdmin) {
    return (
      <div>
        <h1>Accès refusé</h1>
        <p>Tu n’as pas les droits admin.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>

      <p>Connecté : {user?.email}</p>

      <button onClick={handleLogout}>Déconnexion</button>

      <hr />

      <h2>Matchs</h2>

      {matches.length === 0 && <p>Aucun match</p>}

      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.homeTeam} vs {match.awayTeam} - {match.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
