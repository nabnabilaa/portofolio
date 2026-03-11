import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";
import { personalInfo } from "../data/mock";
import GalaxyParticles from "./GalaxyParticles";

const TypeWriter = ({ text, speed = 60 }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse text-[#00e5a0]">|</span>}
    </span>
  );
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#06060e" }}
    >
      {/* Galaxy Particles Background */}
      <GalaxyParticles />

      {/* Gradient Orbs Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-orb-1"
          style={{ background: "#00e5a0", top: "10%", left: "-10%" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-orb-2"
          style={{ background: "#38bdf8", bottom: "10%", right: "-5%" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] text-sm font-medium">
            <Sparkles size={14} />
            Available for Opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white font-space mb-6 leading-[1.1] tracking-tight"
        >
          Hi, I'm{" "}
          <span className="relative">
            <span className="hero-gradient-text">{personalInfo.firstName}</span>
            <motion.span
              className="absolute -bottom-2 left-0 h-1 bg-[#00e5a0] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-[#94a3b8] mb-4 font-medium font-space"
        >
          <TypeWriter text={`${personalInfo.role} & ${personalInfo.subtitle}`} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-base sm:text-lg text-[#64748b] max-w-2xl mx-auto mb-4"
        >
          {personalInfo.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 text-sm text-[#64748b] mb-10"
        >
          <MapPin size={14} />
          <span>{personalInfo.location}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,229,160,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 bg-[#00e5a0] text-[#06060e] font-semibold rounded-xl hover:bg-[#00cc8e] transition-colors duration-300 text-sm"
          >
            View My Projects
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document.querySelector("#game")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 border border-[#1a1d2e] text-white rounded-xl hover:bg-white/5 hover:border-[#00e5a0]/30 transition-all duration-300 text-sm font-medium"
          >
            Play a Game
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <button
          onClick={() =>
            document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex flex-col items-center gap-2 text-[#64748b] hover:text-[#00e5a0] transition-colors"
        >
          <span className="text-xs">Scroll Down</span>
          <ArrowDown size={16} />
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
