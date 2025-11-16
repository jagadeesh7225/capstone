import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Calendar, TrendingUp, Check } from 'lucide-react';
import { saveMoodEntry, getMoodHistory, getMoodStats } from "../api/moodApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [stats, setStats] = useState({ avgMood: 'N/A', daysTracked: 0, topMood: 'N/A' });

  const moods = [
    { emoji: '😢', label: 'Very Sad', value: 1, color: 'from-red-400 to-red-300' },
    { emoji: '😔', label: 'Sad', value: 2, color: 'from-orange-400 to-orange-300' },
    { emoji: '😐', label: 'Okay', value: 3, color: 'from-yellow-400 to-yellow-300' },
    { emoji: '😊', label: 'Good', value: 4, color: 'from-green-400 to-green-300' },
    { emoji: '😄', label: 'Great', value: 5, color: 'from-blue-400 to-blue-300' }
  ];

  // Fetch mood history on mount
  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        getMoodHistory(7),
        getMoodStats()
      ]);

      if (historyRes.data?.success) {
        setMoodHistory(historyRes.data.moodEntries);
      }

      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Error fetching mood data:', err);
    }
  };

  // Build chart data from mood history
  const getChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const moodData = last7Days.map(date => {
      const entry = moodHistory.find(e => e.date === date);
      return entry ? entry.mood : null;
    });

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return {
      labels: dayLabels,
      datasets: [
        {
          label: 'Mood Level',
          data: moodData,
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          borderColor: 'rgb(147, 51, 234)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(147, 51, 234)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          spanGaps: false
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            if (context.parsed.y === null) return 'No data';
            const labels = ['', 'Very Sad', 'Sad', 'Okay', 'Good', 'Great'];
            return labels[context.parsed.y];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const labels = ['', '😢', '😔', '😐', '😊', '😄'];
            return labels[value];
          },
          font: { size: 20 }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: { grid: { display: false } }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setMessage('Please select a mood');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await saveMoodEntry({
        date: selectedDate,
        mood: selectedMood,
        note: moodNote
      });

      if (res.data?.success) {
        setMessage('✅ Mood saved successfully!');
        setSelectedMood(null);
        setMoodNote('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        
        // Refresh data
        setTimeout(() => {
          fetchMoodData();
          setMessage('');
        }, 1500);
      } else {
        setMessage('❌ ' + (res.data?.message || 'Failed to save mood'));
      }
    } catch (err) {
      console.error('Save mood error:', err);
      setMessage('❌ Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Mood Tracker
          </h1>
          <p className="text-gray-600">Track your emotional journey, one day at a time</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: FORM */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              Daily Check-In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.value}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 rounded-2xl transition-all relative ${
                        selectedMood === mood.value
                          ? `bg-gradient-to-br ${mood.color} shadow-lg`
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-4xl mb-2">{mood.emoji}</div>
                      <div className={`text-xs font-medium ${
                        selectedMood === mood.value ? 'text-white' : 'text-gray-600'
                      }`}>
                        {mood.label}
                      </div>
                      {selectedMood === mood.value && (
                        <Check className="absolute top-1 right-1 w-4 h-4 text-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="mood-note" className="block text-sm font-semibold text-gray-700 mb-3">
                  What's on your mind? (Optional)
                </label>
                <textarea
                  id="mood-note"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Share your thoughts, feelings, or what happened today..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  message.includes('✅') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={!selectedMood || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Mood Entry
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT: CHART & STATS */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Your Mood Journey
            </h2>

            <div className="mb-6" style={{ height: '300px' }}>
              <Line data={getChartData()} options={chartOptions} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {typeof stats.avgMood === 'number' ? stats.avgMood : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl text-center">
                <div className="text-2xl font-bold text-green-600">{stats.daysTracked}</div>
                <div className="text-sm text-gray-600">Days Tracked</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.topMood}</div>
                <div className="text-sm text-gray-600">Top Mood</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl">
              <p className="text-sm text-gray-700">
                <strong>Insight:</strong> {stats.daysTracked > 0 
                  ? `You've tracked ${stats.daysTracked} days with an average mood of ${stats.avgMood}. Keep it up! 🎯` 
                  : 'Start tracking your mood to see insights!'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}