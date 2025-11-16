import axios from "axios";

const API = axios.create({
  baseURL: "https://capstone-3-r308.onrender.com",
  withCredentials: true,
});

// --- AUTH ROUTES ---
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const logoutUser = (data) => API.post("/logout", data);
export const checkAuth = () => API.get("/is-auth");

// Firebase Login
export const verifyFirebaseToken = (token) => API.post("/firebase-login", { token });

// --- EMAIL VERIFICATION ---
export const sendVerifyOtp = () => API.post("/send-verify-otp");
export const verifyEmail = (data) => API.post("/verify-account", data);

// --- PASSWORD RESET ---
export const sendResetOtp = (data) => API.post("/send-reset-otp", data);
export const verifyResetOtp = (data) => API.post("/verify-reset-otp", data);
export const resetPassword = (data) => API.post("/reset-password", data);

export default API;
