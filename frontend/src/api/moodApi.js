import axios from "axios";

const MOOD_API = axios.create({
  baseURL: "http://localhost:5000/api/mood",
  withCredentials: true,
});

// --- MOOD ROUTES ---
export const saveMoodEntry = (data) => MOOD_API.post("/save", data);
export const getMoodHistory = (days = 7) => MOOD_API.get(`/history?days=${days}`);
export const getMoodStats = () => MOOD_API.get("/stats");

export default MOOD_API;