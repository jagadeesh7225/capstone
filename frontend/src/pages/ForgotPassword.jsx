import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, Lock } from "lucide-react";
import { sendResetOtp, resetPassword } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await sendResetOtp({ email });
      if (data.success) {
        setOtpSent(true);
        setMessage("");
        alert("OTP sent to your email!");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error sending OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await resetPassword({ email, otp, newPassword });

      if (data.success) {
        alert("Password reset successful!");
        window.location.href = "/login";
      } else {
        setMessage(data.message);
      }
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF7FF] via-[#EAF8FF] to-[#FFEFFD] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 backdrop-blur-xl shadow-xl p-10 rounded-3xl w-full max-w-lg border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
          Forgot Password
        </h1>

        <p className="text-center text-gray-600 mt-1">
          We’ll send you an OTP to reset your password
        </p>

        <form
          onSubmit={otpSent ? handleResetPassword : handleSendOtp}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <div className="flex items-center bg-white/50 border border-gray-200 rounded-xl px-3 py-3 mt-1">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                className="bg-transparent outline-none w-full"
                placeholder="Enter your email"
                required
                disabled={otpSent}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {otpSent && (
            <>
              <div>
                <label className="text-gray-700 font-medium">OTP</label>
                <div className="flex items-center bg-white/50 border border-gray-200 rounded-xl px-3 py-3 mt-1">
                  <KeyRound className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="bg-transparent outline-none w-full"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium">New Password</label>
                <div className="flex items-center bg-white/50 border border-gray-200 rounded-xl px-3 py-3 mt-1">
                  <Lock className="text-gray-400 mr-2" size={18} />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="bg-transparent outline-none w-full"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <button
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition"
          >
            {otpSent ? "Reset Password" : "Send OTP"}
          </button>

          {message && (
            <p className="text-red-500 text-center mt-2">{message}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
