import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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
      index: true,
    },

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

    favoriteTeam: {
      type: String,
      default: "",
    },

    // 🧠 STATS
    points: {
      type: Number,
      default: 0,
    },

    rank: {
      type: String, // ✅ FIX IMPORTANT
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

// 🚀 INDEX OPTIMISÉS
userSchema.index({ firebaseUid: 1 });
userSchema.index({ pseudo: 1 });
userSchema.index({ points: -1 }); // leaderboard

export default model("User", userSchema);
