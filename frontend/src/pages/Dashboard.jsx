import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import {
  TrendingUp,
  Activity,
  MessageCircle,
  BookOpen,
  Sparkles,
  Settings
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { getMoodHistory, getMoodStats } from "../api/moodApi";
import { getActivityStats } from "../api/activityApi";

import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // EMOJI FALLBACK
  const getEmoji = (mood) => {
    if (mood >= 4) return "😁";
    if (mood >= 3) return "🙂";
    if (mood >= 2) return "😐";
    if (mood >= 1) return "☹️";
    return "😢";
  };

  // POPUPS
  const [showSettings, setShowSettings] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [reportError, setReportError] = useState("");

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactError, setContactError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // API States
  const [moodHistory, setMoodHistory] = useState([]);
  const [stats, setStats] = useState({
    avgMood: 0,
    daysTracked: 0,
    emoji: "😐",
    moodName: "Neutral",
    quote: "Every day is a fresh start!"
  });

  const [activityStats, setActivityStats] = useState({
    chatbot: 0,
    mood_tracking: 0,
    resources: 0,
    meditation: 0,
    exercises: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [historyRes, statsRes, activityRes] = await Promise.all([
        getMoodHistory(30),
        getMoodStats(),
        getActivityStats(7)
      ]);

      if (historyRes.data.success) {
        setMoodHistory(historyRes.data.moodEntries);
      }

      if (statsRes.data.success) {
        const s = statsRes.data.stats;

        setStats({
          ...s,
          emoji: s.emoji || getEmoji(s.avgMood),
          moodName: s.moodName || "Your Current Mood",
          quote: s.quote || "Keep moving forward!"
        });
      }

      if (activityRes.data.success) {
        setActivityStats(activityRes.data.activities);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Weekly Aggregation
  const getWeeklyTrendData = () => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekMoods = moodHistory
        .filter((e) => {
          const d = new Date(e.date);
          return d >= weekStart && d <= weekEnd;
        })
        .map((e) => e.mood);

      const avg =
        weekMoods.length > 0
          ? (weekMoods.reduce((a, b) => a + b, 0) / weekMoods.length).toFixed(1)
          : null;

      weeks.push({
        label: `Week ${4 - i}`,
        data: avg ? parseFloat(avg) : null
      });
    }
    return weeks;
  };

  const weeklyTrend = getWeeklyTrendData();

  const moodTrendData = {
    labels: weeklyTrend.map((w) => w.label),
    datasets: [
      {
        label: "Average Mood",
        data: weeklyTrend.map((w) => w.data),
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgb(147, 51, 234)",
        spanGaps: true
      }
    ]
  };

  const activityData = {
    labels: ["Chatbot", "Mood Tracking", "Resources", "Meditation", "Exercises"],
    datasets: [
      {
        label: "Weekly Activity",
        data: [
          activityStats.chatbot,
          activityStats.mood_tracking,
          activityStats.resources,
          activityStats.meditation,
          activityStats.exercises
        ],
        backgroundColor: [
          "rgba(147, 51, 234, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)"
        ],
        borderRadius: 14,
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  const validEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // REPORT SUBMIT — FULLY FIXED
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportName || !reportEmail || !reportMsg || !reportType) {
      setReportError("Please fill all fields.");
      return;
    }

    if (!validEmail(reportEmail)) {
      setReportError("Invalid email.");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        name: reportName,
        email: reportEmail,
        issueType: reportType,
        message: reportMsg,
        createdAt: Timestamp.now()
      });

      // RESET
      setReportName("");
      setReportEmail("");
      setReportType("");
      setReportMsg("");
      setReportError("");

      // CLOSE MODAL
      setShowReportModal(false);

      // SUCCESS POPUP
      setSuccessMessage("Your issue has been reported!");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      setReportError("Something went wrong.");
    }
  };

  // CONTACT SUBMIT — FIXED
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactName || !contactEmail || !contactMsg) {
      setContactError("Please fill all fields.");
      return;
    }

    if (!validEmail(contactEmail)) {
      setContactError("Invalid email.");
      return;
    }

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: contactName,
        email: contactEmail,
        message: contactMsg,
        createdAt: Timestamp.now()
      });

      // RESET
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setContactError("");

      setShowContactModal(false);
      setSuccessMessage("Your message has been sent!");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      setContactError("Something went wrong.");
    }
  };

  const quickActions = [
    { icon: MessageCircle, label: "Chat Now", color: "from-purple-500 to-blue-500", path: "/chatbot" },
    { icon: Activity, label: "Track Mood", color: "from-blue-500 to-green-500", path: "/mood-tracker" },
    { icon: BookOpen, label: "Resources", color: "from-green-500 to-teal-500", path: "/resources" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#e0f7fa] to-[#fce7f3] p-6">

      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="text-4xl animate-float-slow absolute top-10 left-10">🌸</div>
        <div className="text-4xl animate-float absolute top-40 right-20">🌿</div>
        <div className="text-4xl animate-float-slow absolute bottom-20 left-1/4">🌟</div>
        <div className="text-4xl animate-float absolute bottom-32 right-1/4">💮</div>
      </div>

      {/* MAIN */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Welcome Back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-gray-700 mt-1">Here's your wellness summary</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="p-4 bg-white/40 backdrop-blur-lg rounded-3xl border shadow-xl"
          >
            <Settings className="w-7 h-7 text-gray-700" />
          </motion.button>
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {/* Average Mood */}
          <motion.div className="bg-blue-50 p-6 rounded-3xl shadow border">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {stats.avgMood ?? "N/A"}
            </div>
            <p className="text-gray-600 font-semibold">Average Mood</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </motion.div>

          {/* Days Tracked */}
          <motion.div className="bg-green-50 p-6 rounded-3xl shadow border">
            <div className="text-4xl font-bold text-green-600 mb-1">
              {stats.daysTracked}
            </div>
            <p className="text-gray-600 font-semibold">Days Tracked</p>
            <p className="text-sm text-gray-500">Keep it up 🎯</p>
          </motion.div>

          {/* Current Mood */}
          <motion.div className="bg-purple-50 p-6 rounded-3xl shadow border">
            <div className="text-5xl mb-2">{stats.emoji || "😐"}</div>
            <p className="text-gray-600 font-semibold">{stats.moodName}</p>
            <p className="text-sm italic text-gray-500">{stats.quote}</p>
          </motion.div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(action.path)}
              className={`bg-gradient-to-r ${action.color} p-7 rounded-3xl text-white shadow-xl`}
            >
              <action.icon className="w-10 h-10 mb-2" />
              <h3 className="text-xl font-bold">{action.label}</h3>
            </motion.button>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          <motion.div className="bg-white/40 p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-500" /> Monthly Mood Trend
            </h2>
            <div style={{ height: "260px" }}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full"></div>
                </div>
              ) : (
                <Line data={moodTrendData} options={chartOptions} />
              )}
            </div>
          </motion.div>

          <motion.div className="bg-white/40 p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Activity className="text-blue-500" /> Activity Breakdown
            </h2>
            <div style={{ height: "260px" }}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
                </div>
              ) : (
                <Bar data={activityData} options={chartOptions} />
              )}
            </div>
          </motion.div>

        </div>

        {/* AFFIRMATION */}
        <motion.div className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white p-8 rounded-3xl text-center shadow-2xl mb-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Today's Affirmation</h2>
          <p className="text-xl italic font-medium">
            "{stats.quote}"
          </p>
        </motion.div>

        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/40 p-8 rounded-3xl shadow-2xl max-w-md w-full relative">

              <button className="absolute top-4 right-4 text-2xl" onClick={() => setShowSettings(false)}>
                ×
              </button>

              <div className="text-center mb-6">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    className="w-24 h-24 rounded-full mx-auto shadow-lg border-4 border-purple-300"
                    alt=""
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-purple-400 flex items-center justify-center text-3xl text-white">
                    {user?.name ? user.name[0] : "U"}
                  </div>
                )}

                <h2 className="text-xl font-bold mt-3">{user?.name}</h2>
                <p className="text-sm text-gray-700">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowReportModal(true);
                }}
                className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
              >
                Report a Problem
              </button>

              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowContactModal(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/40 p-8 rounded-3xl max-w-lg w-full relative">

              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={() => setShowReportModal(false)}
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Report a Problem
              </h2>

              <form className="space-y-4" onSubmit={handleReportSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border"
                />

                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border"
                >
                  <option value="">Select Issue Type</option>
                  <option value="bug">Bug / Error</option>
                  <option value="chatbot">Incorrect Chatbot Response</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  placeholder="Describe the issue..."
                  value={reportMsg}
                  onChange={(e) => setReportMsg(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border h-32"
                />

                {reportError && (
                  <p className="text-red-600">{reportError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold"
                >
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CONTACT MODAL */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/40 p-8 rounded-3xl max-w-lg w-full relative">

              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={() => setShowContactModal(false)}
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-center">Contact Us</h2>

              <form className="space-y-4 mt-4" onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border"
                />

                <textarea
                  placeholder="Your Message..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border h-32"
                />

                {contactError && (
                  <p className="text-red-600">{contactError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold"
                >
                  Send Message
                </button>
              </form>

            </div>
          </div>
        )}

        {/* SUCCESS POPUP */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[999]">
            <div className="bg-white/60 p-6 rounded-3xl max-w-sm w-full text-center border shadow-xl">
              <h2 className="text-xl font-bold mb-3">🎉 Success!</h2>
              <p className="text-gray-800 mb-4">{successMessage}</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
