import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Match from "../pages/Match";
import Ranking from "../pages/Ranking";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/match/:id" element={<Match />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
