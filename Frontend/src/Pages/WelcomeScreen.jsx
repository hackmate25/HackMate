import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import mainbg from "../assets/mainbg.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // trigger fade out
      setTimeout(() => navigate("/discover"),700); // navigate after fade
    }, 5000); // 4 sec wait
    return () => clearTimeout(timer);
  }, [navigate]);

  const letters = "Welcome Back".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="h-screen w-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/40 to-transparent"></div>

      {/* Animated letters */}
      <h1 className="flex space-x-1 text-5xl md:text-7xl -mt-30 font-extrabold text-white drop-shadow-[10px_10px_15px_#14274E] z-10">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>

      {/* Hackmate glowing text */}
      <motion.h2
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-70 text-5xl md:text-7xl font-normal text-[#14274E] drop-shadow-[10px_10px_15px_#14274E]"
      >
        To HackMate
      </motion.h2>
    </motion.div>
  );
};

export default WelcomeScreen;
