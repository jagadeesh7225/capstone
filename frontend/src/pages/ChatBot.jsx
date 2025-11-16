import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      const response = await fetch('######', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: data.reply || data.response || "I didn’t understand that.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "⚠️ Unable to connect to the server.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }

    setIsTyping(false);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    simulateBotResponse(inputText);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* BLUR NEON BACKGROUND — SAME AS LOGIN PAGE */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl"></div>

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl h-[90vh] backdrop-blur-2xl bg-white/40 shadow-2xl border border-white/50 rounded-3xl flex flex-col overflow-hidden"
      >

        {/* HEADER — MATCHING LOGIN PAGE DESIGN */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-5 flex items-center gap-4 shadow-xl">
          <div className="bg-white/30 p-3 rounded-2xl backdrop-blur-xl">
            <Bot className="w-7 h-7 text-white drop-shadow" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">AI Companion</h1>
            <p className="text-purple-100 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start gap-3 max-w-[70%]">

                  {/* PROFILE ICON */}
                  {msg.sender === "bot" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white">
                      <Bot size={20} />
                    </div>
                  )}

                  {/* MESSAGE BUBBLE */}
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed backdrop-blur-xl border
                    ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white border-white/20"
                        : "bg-white/70 text-gray-800 border-white/40"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* TYPING ANIMATION */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div className="bg-white/70 px-5 py-3 rounded-2xl border border-white/40 backdrop-blur-xl">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT AREA — MATCHING LOGIN PAGE INPUT STYLE */}
        <div className="p-4 bg-white/40 backdrop-blur-xl border-t border-white/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3 rounded-full bg-white/80 border border-gray-200 focus:border-purple-500 outline-none shadow-sm"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Send />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
