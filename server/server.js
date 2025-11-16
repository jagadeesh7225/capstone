import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createRequire } from 'module'; // 👈 Import module helper
import admin from 'firebase-admin'; // 👈 Import Firebase Admin SDK
import authRoutes from "./routes/authRoutes.js";

// --- Service Account Configuration ---
// This safely loads JSON file in an ES Module context, fixing the 'assert' error.
const require = createRequire(import.meta.url);
// ⚠️ Ensure the file name matches your downloaded key!
const serviceAccount = require('./serviceAccountKey.json.json'); 

dotenv.config();

// --- FIREBASE ADMIN INITIALIZATION ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
origin: "http://localhost:5173",
credentials: true
}));

app.use("/api/auth", authRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));