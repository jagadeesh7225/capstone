import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from "firebase-admin";

dotenv.config();

// ---------------- FIREBASE ADMIN --------------------
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ Missing FIREBASE_SERVICE_ACCOUNT environment variable");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ---------------- EXPRESS APP -----------------------
const app = express();

app.use(express.json());
app.use(cookieParser());

// ⭐ UPDATED CORS — supports Vercel + localhost + cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://capstone-one-theta.vercel.app"
    ],
    credentials: true
  })
);

// Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// ---------------- MONGODB CONNECTION -----------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB error:", err));

// ---------------- START SERVER -----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
