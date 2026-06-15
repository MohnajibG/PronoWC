import { Request, Response } from "express";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, pseudo, avatar, country, favoriteTeams } =
      req.body;

    // 🔴 Validation
    if (!firebaseUid || !email || !pseudo) {
      return res.status(400).json({
        message: "firebaseUid, email et pseudo sont requis",
      });
    }

    // 🔍 Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ firebaseUid });

    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // 🧠 Création utilisateur
    const user = await User.create({
      firebaseUid,
      email,
      pseudo,
      avatar: avatar || "",
      country: country || "",
      favoriteTeams: Array.isArray(favoriteTeams) ? favoriteTeams : [],

      // Stats
      points: 0,
      rank: "Non classé",
      predictionsCount: 0,
      correctPredictions: 0,
      exactScores: 0,
      accuracy: 0,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("createUser error:", error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};
