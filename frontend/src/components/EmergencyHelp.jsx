import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { useState } from 'react';

export default function EmergencyHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-2"
        aria-label="Emergency help"
      >
        <Phone className="w-6 h-6" />
        <span className="font-semibold pr-2">Help</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full z-50 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Crisis Support Resources
                </h2>
                <p className="text-gray-600">
                  If you're in crisis or need immediate help, please reach out:
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">National Crisis Hotline</h3>
                  <a
                    href="tel:988"
                    className="text-2xl font-bold text-red-600 hover:text-red-700"
                  >
                    NA
                  </a>
                  <p className="text-sm text-gray-600 mt-1">24/7 Support available</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">Crisis Text Line</h3>
                  <p className="text-lg font-bold text-blue-600">Text "HELLO" to 741741</p>
                  <p className="text-sm text-gray-600 mt-1">Free, 24/7 crisis counseling</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">Campus Counseling</h3>
                  <p className="text-lg font-bold text-green-600">Check your school's resources</p>
                  <p className="text-sm text-gray-600 mt-1">Many offer 24/7 support services</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-gray-800 mb-2">Emergency Services</h3>
                  <a
                    href="tel:911"
                    className="text-2xl font-bold text-orange-600 hover:text-orange-700"
                  >
                    911
                  </a>
                  <p className="text-sm text-gray-600 mt-1">For immediate emergencies</p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                You are not alone. Help is available.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
