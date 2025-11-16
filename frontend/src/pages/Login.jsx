import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-react";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase";

import {
  loginUser,
  registerUser,
  verifyFirebaseToken
} from "../api";

import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (!isLogin && e.target.name === "password") {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;

      if (!strongPasswordRegex.test(e.target.value)) {
        setPasswordError(
          "Password must include uppercase, lowercase, number & special character."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  // -----------------------------------
  // GOOGLE LOGIN (FIXED & FINAL)
  // -----------------------------------
  const handleGoogleLogin = async () => {
    if (!isLogin) {
      alert("Switch to Login to use Google Sign-In.");
      return;
    }

    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Verify token in backend
      const res = await verifyFirebaseToken(token);

      if (res.data.success) {
        const userData = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          authType: "google",            // 🔥 MUST HAVE
          providerId: "google.com",      // 🔥 For future checking
        };

        login(userData);

        navigate("/dashboard", { replace: true });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // EMAIL/PASSWORD LOGIN
  // -----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        if (res.data.success) {
          login({
            name: res.data.user?.name || "User",
            email: formData.email,
            authType: "credentials",   // 🔥 Helps differentiate
          });

          navigate("/dashboard", { replace: true });
        } else {
          alert(res.data.message);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }

        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;

        if (!strongPasswordRegex.test(formData.password)) {
          alert("Weak password.");
          setLoading(false);
          return;
        }

        const res = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (res.data.success) {
          alert("Registered! Please verify your email.");
          navigate("/verify");
        } else {
          alert(res.data.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // UI BELOW (UNCHANGED)
  // -----------------------------------

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e0f7fa] to-[#fce7f3] p-4">

      {/* FLOATING EMOJIS */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="animate-float-slow absolute top-10 left-10 text-4xl">🌸</div>
        <div className="animate-float absolute top-40 right-20 text-4xl">🌿</div>
        <div className="animate-float-slow absolute bottom-20 left-1/4 text-4xl">🌟</div>
        <div className="animate-float absolute bottom-32 right-1/4 text-4xl">💮</div>
      </div>

      {/* AUTH CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="backdrop-blur-2xl bg-white/30 border border-white/40 shadow-xl rounded-3xl p-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <Brain size={42} className="text-indigo-500 mb-2" />

          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-transparent bg-clip-text">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-gray-600 mt-1">
            {isLogin ? "Login to continue" : "Register to get started"}
          </p>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        {isLogin && (
          <>
            <button
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3 flex items-center justify-center gap-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/70 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            <div className="my-3 text-center text-gray-600">
              <span className="bg-white/40 px-2 rounded-full backdrop-blur-sm">
                OR
              </span>
            </div>
          </>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-gray-700 mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-gray-700 mb-1 block">Email</label>
            <div className="flex items-center bg-white/50 border border-gray-300 rounded-xl px-3 py-3">
              <Mail size={20} className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 mb-1 block">Password</label>
            <div className="flex items-center bg-white/50 border border-gray-300 rounded-xl px-3 py-3">
              <Lock size={20} className="text-gray-500 mr-2" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />

              {showPassword ? (
                <EyeOff
                  size={20}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={20}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {isLogin && (
              <div className="text-right mt-1">
                <span
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-indigo-600 cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            )}

            {!isLogin && passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold bg-gradient-to-r from-indigo-500 to-teal-400 rounded-xl shadow-md hover:opacity-90 transition"
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center mt-6 text-indigo-600 cursor-pointer hover:underline"
        >
          {isLogin ? "New user? Register here" : "Already have an account? Login"}
        </p>
      </motion.div>
    </div>
  );
}
