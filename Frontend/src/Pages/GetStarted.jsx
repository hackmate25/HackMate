import React from 'react'
import { ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  // Variants for animation
  const containerVariants = {
  };

  const itemVariants = {
    hover: { scale: 1.06, transition: { duration: 0.1 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.5 } },
    hover: { scale: 1.08 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7EEFF] to-[#B0D4FF] flex items-center justify-center ">
      {/* Help Icon */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-6 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <HelpCircle size={28} />
      </motion.button>

      <motion.div
        className="max-w-6xl w-full p-8 mr-20 h-full relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <motion.div
            className="bg-[#445A80] rounded-lg flex items-center justify-center p-12 w-72 flex-shrink-0 cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.08, transition: { duration: 0.1 } }}
             initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 90 }}
          >
            <h2 className="text-white text-3xl font-bold tracking-widest transform -rotate-90 whitespace-nowrap">
              WHAT IS HACKMATE?
            </h2>
          </motion.div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            <motion.h1
              className="text-slate-600 text-4xl font-semibold text-center mb-12 tracking-wide"
              variants={itemVariants}
            >
              GET STARTED
            </motion.h1>

            <motion.div className="space-y-4 flex-1">
              {/* Question 1 */}
              <motion.div
                className="bg-[#86B3FF] rounded-lg p-8 cursor-pointer"
                variants={itemVariants}
                whileHover="hover"
                 initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 90}}
              >
                <p className="text-[#14274E] font-bold text-2xl text-center">
                  No <span className="font-bold">teammates</span> for tech events?
                </p>
              </motion.div>

              {/* Question 2 */}
              <motion.div
                className="bg-[#6EA2D9] rounded-lg p-8 cursor-pointer"
                variants={itemVariants}
                whileHover="hover"
                 initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 90 }}
              >
                <p className="text-[#1D4B9A] text-2xl text-center">
                  Afraid of <span className="font-bold text-[#1D4B9A]">socializing</span>?
                </p>
              </motion.div>

              {/* Question 3 */}
              <motion.div
                className="bg-[#3C65AA] rounded-lg p-16 pb-35 cursor-pointer"
                variants={itemVariants}
                whileHover="hover"
                 initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 90 }}
              >
                <p className="text-white text-3xl text-center font-medium">
                  Don't worry, we got you!
                </p>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="flex items-center justify-end mt-8"
              variants={buttonVariants}
            >
              <motion.button
                className="bg-[#3DB659] hover:bg-green-600 text-white font-semibold px-8 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                onClick={() => navigate('/details')}
              >
                Next
                <ArrowRight size={20} />
              </motion.button>      
            </motion.div>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GetStarted;
