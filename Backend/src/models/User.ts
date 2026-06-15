import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    // 🔐 Auth Firebase
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // 👤 Profil
    pseudo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    // ⚽ Équipes favorites
    favoriteTeams: {
      type: [String],
      default: [],
    },

    // 📊 Statistiques
    points: {
      type: Number,
      default: 0,
      index: true,
    },

    rank: {
      type: String,
      default: "Non classé",
    },

    predictionsCount: {
      type: Number,
      default: 0,
    },

    correctPredictions: {
      type: Number,
      default: 0,
    },

    exactScores: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 🛡️ Permissions
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🚀 Index
userSchema.index({ firebaseUid: 1 });
userSchema.index({ pseudo: 1 });
userSchema.index({ points: -1 });
userSchema.index({ isActive: 1, points: -1 });

export default model("User", userSchema);
