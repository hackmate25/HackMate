    import React, { useRef } from 'react'
    import { motion } from 'framer-motion'
    import chimeSound from '../assets/Chime.wav' 
    import mainbg from '../assets/mainbg.png'
    import { useNavigate } from 'react-router-dom'

    const LandingScreen = () => {
     const audioRef = useRef(null)
  const navigate = useNavigate()

  const playChimeAndNavigate = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(chimeSound)
    }
    audioRef.current.play()
    setTimeout(() => {
      navigate('/login') 
    }, 700) 
  }

    return (
       <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
     style={{ backgroundImage: `url(${mainbg})` }}>
        <motion.h1
            className='text-[#14274E] text-center text-7xl font-normal font-["Lexend_Exa"]'
            style={{ textShadow: "0 4px 9px rgba(0, 0, 0, 0.25)" }}
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            HackMate
        </motion.h1>
        <motion.h3
            className="text-4xl text-black font-normal font-['Lexend_Exa']"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
            Find your <span className="text-[#395EAA] font-semibold">mate!</span>
        </motion.h3>
        <motion.button
            className="mt-5 px-10 py-3 bg-[#1D4B9AD6] text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-[#042f76] transition duration-200 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
            whileHover={{ scale: 1.08, delay: 0, ease: "easeOut" }}
            whileTap={{ scale: 0.95 }}
            onClick={playChimeAndNavigate}
        >
            Get Started
        </motion.button>

        </div>
    )
    }

    export default LandingScreen
