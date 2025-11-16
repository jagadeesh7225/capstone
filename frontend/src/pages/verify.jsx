import { useState } from "react";
import API from "../api";

export default function Verify() {
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    const res = await API.post("/send-verify-otp");
    alert(res.data.message);
  };

  const verifyOtp = async () => {
    const res = await API.post("/verify-account", { otp });
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <button onClick={sendOtp}>Send OTP</button>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
