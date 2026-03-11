import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { gameCards } from "../data/mock";

const GameCard = ({ card, isFlipped, isMatched, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={onClick}
      className="h-24 sm:h-32 cursor-pointer perspective"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base font-space bg-gradient-to-br from-[#1a1d2e] to-[#0d0f1a] border-2 border-[#00e5a0]/30 hover:border-[#00e5a0] transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          ?
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-xl flex flex-col items-center justify-center font-bold text-xs sm:text-sm font-space bg-gradient-to-br from-[#00e5a0] to-[#00cc8e] border-2 border-[#00e5a0] text-[#06060e]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-xl sm:text-2xl mb-1">{card.icon}</div>
          <div className="text-center text-[10px] sm:text-xs">{card.label}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Game = () => {
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [bestScore, setBestScore] = useState(localStorage.getItem("gameScore") || null);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffled = [...gameCards, ...gameCards]
      .sort(() => Math.random() - 0.5)
      .map((card, idx) => ({ ...card, uniqueId: idx }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMatches(0);
    setDisabled(false);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle card click
  const handleCardClick = (uniqueId) => {
    if (disabled || gameOver || flipped.includes(uniqueId) || matched.includes(uniqueId)) {
      return;
    }

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    // Play sound
    if (soundOn) playSound("flip");

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setDisabled(true);

      const card1 = cards.find((c) => c.uniqueId === newFlipped[0]);
      const card2 = cards.find((c) => c.uniqueId === newFlipped[1]);

      if (card1.id === card2.id) {
        // Match found
        setMatched([...matched, card1.id, card2.id]);
        setMatches(matches + 1);
        if (soundOn) playSound("match");
        setFlipped([]);
        setDisabled(false);
      } else {
        // No match
        if (soundOn) playSound("wrong");
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
    }
  };

  // Check game over
  useEffect(() => {
    if (matched.length === gameCards.length * 2 && matched.length > 0) {
      setGameOver(true);
      if (soundOn) playSound("win");

      // Update best score
      if (!bestScore || moves < parseInt(bestScore)) {
        setBestScore(moves);
        localStorage.setItem("gameScore", moves);
      }
    }
  }, [matched, moves, soundOn, bestScore]);

  // Simple sound effect
  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case "flip":
          oscillator.frequency.value = 800;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case "match":
          oscillator.frequency.value = 1200;
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case "wrong":
          oscillator.frequency.value = 400;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case "win":
          oscillator.frequency.value = 1500;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        default:
          break;
      }
    } catch (e) {
      // Silently fail if audio context not available
    }
  };

  if (cards.length === 0) {
    return <div>Loading game...</div>;
  }

  const totalCards = gameCards.length * 2;
  const progress = (matches / gameCards.length) * 100;

  return (
    <section
      id="game"
      className="relative py-24 lg:py-32"
      style={{ background: "#080a14" }}
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "#a78bfa", top: "10%", left: "-10%" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="text-[#a78bfa] text-sm font-mono tracking-wider uppercase">
            // Interactive Game
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            Memory Game Challenge
          </h2>
          <p className="text-[#64748b] text-lg mt-4 max-w-2xl mx-auto">
            Test your memory by matching pairs of tech skills and tools. Can you find them all?
          </p>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <div className="px-6 py-4 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e]">
            <p className="text-[#64748b] text-sm mb-1">Moves</p>
            <p className="text-white text-2xl font-bold font-space">{moves}</p>
          </div>

          <div className="px-6 py-4 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e]">
            <p className="text-[#64748b] text-sm mb-1">Matches</p>
            <p className="text-white text-2xl font-bold font-space">
              {matches}/{gameCards.length}
            </p>
          </div>

          {bestScore && (
            <div className="px-6 py-4 rounded-lg bg-[#0d0f1a] border border-[#a78bfa]">
              <p className="text-[#a78bfa] text-sm mb-1">Best Score</p>
              <p className="text-white text-2xl font-bold font-space">{bestScore}</p>
            </div>
          )}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-10 h-2 rounded-full bg-[#1a1d2e] overflow-hidden"
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#00e5a0] to-[#a78bfa]"
          />
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#0d0f1a] rounded-2xl border border-[#1a1d2e] p-6 md:p-10 mb-8"
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card) => (
              <GameCard
                key={card.uniqueId}
                card={card}
                isFlipped={flipped.includes(card.uniqueId)}
                isMatched={matched.includes(card.id)}
                onClick={() => handleCardClick(card.uniqueId)}
              />
            ))}
          </div>
        </motion.div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              <motion.div className="relative bg-[#0d0f1a] rounded-2xl border border-[#1a1d2e] p-8 max-w-md w-full text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#a78bfa]/20 border border-[#a78bfa]"
                >
                  <span className="text-3xl">🎉</span>
                </motion.div>

                <h3 className="text-3xl font-bold text-white mb-2 font-space">
                  Challenge Complete!
                </h3>
                <p className="text-[#64748b] mb-6">
                  You found all matches in{" "}
                  <span className="text-[#a78bfa] font-bold">{moves} moves</span>
                </p>

                {bestScore && parseInt(bestScore) === moves && (
                  <p className="text-[#00e5a0] font-semibold mb-4">
                    🏆 New Personal Best!
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initializeGame}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#a78bfa] text-white font-semibold rounded-lg hover:bg-[#9878d9] transition-colors mb-3"
                >
                  <RotateCcw size={18} />
                  Play Again
                </motion.button>

                <button
                  onClick={() => {
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full px-6 py-3 border border-[#1a1d2e] text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
                >
                  That was fun, let's connect!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeGame}
            className="flex items-center gap-2 px-6 py-3 bg-[#a78bfa] text-white font-semibold rounded-lg hover:bg-[#9878d9] transition-colors"
          >
            <RotateCcw size={18} />
            New Game
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundOn(!soundOn)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              soundOn
                ? "bg-[#00e5a0] text-[#06060e]"
                : "bg-[#0d0f1a] border border-[#1a1d2e] text-[#94a3b8]"
            }`}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundOn ? "Sound On" : "Sound Off"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Game;
