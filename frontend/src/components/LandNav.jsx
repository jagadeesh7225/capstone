import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Home, MessageCircle, Heart, BookOpen, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const LandNav = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/dashboard', icon: User, label: 'Dashboard' },
    { path: '/login', icon: LogIn, label: 'Login' },
  ];

  const handleNavClick = (path) => {
    if (path === '/') {
      navigate('/');
    } else if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pastel-blue-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-r from-pastel-lavender-400 to-pastel-blue-400 rounded-xl"
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pastel-lavender-600 to-pastel-blue-600 bg-clip-text text-transparent">
              MindEase
            </span>
          </Link>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pastel-lavender-100 to-pastel-blue-100 text-pastel-lavender-600 shadow-sm'
                      : 'text-gray-600 hover:text-pastel-lavender-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandNav;