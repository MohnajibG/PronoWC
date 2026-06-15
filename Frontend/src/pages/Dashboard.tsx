import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Connecté en tant que : {user?.email}</p>

      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
