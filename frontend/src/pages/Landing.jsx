import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, BookOpen, Shield, Clock, Users, ArrowRight, Star } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LandNav from '../components/LandNav';
import AnimatedBackground from '../components/AnimatedBackground';


const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: '24/7 AI Support',
      description: 'Always available when you need someone to talk to',
      gradient: 'from-pastel-blue-400 to-pastel-blue-500'
    },
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Monitor your mental health journey with insightful analytics',
      gradient: 'from-pastel-lavender-400 to-pastel-lavender-500'
    },
    {
      icon: BookOpen,
      title: 'Curated Resources',
      description: 'Access articles, videos, and guided meditations',
      gradient: 'from-pastel-mint-400 to-pastel-mint-500'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your mental health data is encrypted and protected',
      gradient: 'from-pink-400 to-pink-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students Helped' },
    { number: '24/7', label: 'Available Support' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '50+', label: 'Universities' }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <LandNav isLoggedIn={false} />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pastel-lavender-600 via-pastel-blue-600 to-pastel-mint-600 bg-clip-text text-transparent">
                  MindEase
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
                Your 24/7 AI Mental Health Companion
              </p>
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Empowering students with personalized mental health support, 
                mood tracking, and curated wellness resources
              </p>
            </motion.div>

            {/* Illustration placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-pastel-blue-100 via-pastel-lavender-100 to-pastel-mint-100 rounded-3xl p-12 shadow-2xl">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-pastel-lavender-400 to-pastel-blue-400 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <div className="flex items-center space-x-2 text-pastel-lavender-500">
                      <ArrowRight className="h-6 w-6" />
                      <Heart className="h-6 w-6 animate-bounce-gentle text-red-400" />
                      <ArrowRight className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-pastel-mint-400 to-pastel-mint-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">AI Support</span>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 w-8 h-8 bg-pastel-lavender-300 rounded-full opacity-60"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -right-6 w-6 h-6 bg-pastel-mint-300 rounded-full opacity-60"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
                className="text-xl px-12 py-4 animate-pulse-glow"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pastel-blue-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pastel-lavender-200 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose MindEase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive mental health support designed specifically for students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="p-6 text-center h-full">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pastel-lavender-600 to-pastel-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pastel-lavender-100 to-pastel-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of students who trust MindEase for their mental wellness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign Up Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;