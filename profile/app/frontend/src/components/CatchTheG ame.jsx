import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const CatchTheGame = () => {
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);
  const [gameState, setGameState] = useState("start"); // start, playing, over
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("catchGameScore")) || 0
  );
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const gameDataRef = useRef({
    score: 0,
    level: 1,
    lives: 3,
    playerX: 0,
  });

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const handleMouseMove = (e) => {
      const rect = gameArea.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      gameDataRef.current.playerX = Math.max(0, Math.min(100, x));

      if (playerRef.current) {
        playerRef.current.style.left = `${gameDataRef.current.playerX}%`;
      }
    };

    if (gameState === "playing") {
      gameArea.addEventListener("mousemove", handleMouseMove);
      return () => gameArea.removeEventListener("mousemove", handleMouseMove);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    gameDataRef.current = { score: 0, level: 1, lives: 3, playerX: 50 };
    setScore(0);
    setLevel(1);
    setLives(3);
    setItems([]);
    setMessage("");
    spawnItems();
  };

  const spawnItems = () => {
    const itemTypes = [
      { emoji: "☕", points: 1 },
      { emoji: "🍕", points: 2 },
      { emoji: "⭐", points: 5 },
      { emoji: "💎", points: 10 },
      { emoji: "🐛", points: -1, isEnemy: true },
      { emoji: "🪲", points: -1, isEnemy: true },
      { emoji: "🕷️", points: -1, isEnemy: true },
    ];

    const newItem = {
      id: Math.random(),
      ...itemTypes[Math.floor(Math.random() * itemTypes.length)],
      x: Math.random() * 100,
      y: -10,
    };

    setItems((prev) => [...prev, newItem]);
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      // Spawn new items
      if (Math.random() < 0.15 + gameDataRef.current.level * 0.05) {
        spawnItems();
      }

      // Update items
      setItems((prevItems) => {
        const updated = prevItems
          .map((item) => ({
            ...item,
            y: item.y + 2 + gameDataRef.current.level,
          }))
          .filter((item) => {
            if (item.y > 100) {
              if (!item.isEnemy) {
                handleMiss();
              }
              return false;
            }

            // Check collision with player
            const playerArea = 10; // Width of player zone
            const itemArea = 5;
            if (
              item.y > 85 &&
              Math.abs(item.x - gameDataRef.current.playerX) < playerArea
            ) {
              if (item.isEnemy) {
                gameDataRef.current.lives--;
                setLives(gameDataRef.current.lives);
                if (gameDataRef.current.lives <= 0) {
                  endGame();
                }
              } else {
                gameDataRef.current.score += item.points;
                setScore(gameDataRef.current.score);

                // Level up every 20 points
                const newLevel = Math.floor((gameDataRef.current.score || 1) / 20) + 1;
                if (newLevel > gameDataRef.current.level) {
                  gameDataRef.current.level = newLevel;
                  setLevel(newLevel);
                  setMessage("🎉 Level Up!");
                  setTimeout(() => setMessage(""), 1500);
                }
              }
              return false;
            }

            return true;
          });

        return updated;
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const handleMiss = () => {
    gameDataRef.current.lives--;
    setLives(gameDataRef.current.lives);
    if (gameDataRef.current.lives <= 0) {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("over");
    if (gameDataRef.current.score > bestScore) {
      setBestScore(gameDataRef.current.score);
      localStorage.setItem("catchGameScore", gameDataRef.current.score);
    }
  };

  return (
    <section
      id="mini-game"
      className="relative py-24 lg:py-32"
      style={{ background: "#080a14" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="text-[#a78bfa] text-sm font-mono tracking-wider uppercase">
            🎮 Quick Break
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            Catch the Coffee! ☕
          </h2>
          <p className="text-[#64748b] text-lg mt-4 max-w-2xl mx-auto">
            Bored? Take a break and play this mini game. Catch delicious treats and dodge the bugs!
          </p>
        </motion.div>

        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          ref={gameAreaRef}
          className="relative w-full h-96 bg-gradient-to-b from-[#0d0f1a] to-[#06060e] rounded-2xl border border-[#1a1d2e] overflow-hidden mb-8"
        >
          {/* Game HUD */}
          <div className="absolute top-6 left-6 right-6 z-20 flex justify-between text-sm">
            <div className="text-[#64748b]">
              <span className="text-[#00e5a0]">Score:</span> {score}
            </div>
            <div className="text-[#64748b]">
              <span className="text-[#a78bfa]">Level:</span> {level}
            </div>
            <div className="text-[#64748b]">
              <span className="text-[#fbbf24]">Lives:</span> {lives > 0 ? "❤️".repeat(lives) : "💀"}
            </div>
            <div className="text-[#64748b]">
              <span className="text-[#38bdf8]">Best:</span> {bestScore}
            </div>
          </div>

          {/* Start Overlay */}
          {gameState === "start" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-white text-2xl font-bold mb-4">Ready to Play?</h3>
                <p className="text-[#64748b] mb-6 text-sm max-w-xs">
                  Catch items: ☕ +1, 🍕 +2, ⭐ +5, 💎 +10 | Dodge: 🐛 −1❤️
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-[#a78bfa] text-white font-semibold rounded-lg hover:bg-[#9878d9] transition-colors"
                >
                  Play Now! 🚀
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Game Over Overlay */}
          {gameState === "over" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center z-30"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">😵</div>
                <h3 className="text-white text-2xl font-bold mb-4">Game Over!</h3>
                <p className="text-[#64748b] mb-2">Final Score: <span className="text-[#a78bfa] font-bold">{score}</span></p>
                {score === bestScore && score > 0 && (
                  <p className="text-[#00e5a0] font-semibold mb-4">🏆 New High Score!</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-[#a78bfa] text-white font-semibold rounded-lg hover:bg-[#9878d9] transition-colors"
                >
                  Try Again 🔄
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Falling Items */}
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ y: -20 }}
              exit={{ opacity: 0 }}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute text-4xl pointer-events-none"
            >
              {item.emoji}
            </motion.div>
          ))}

          {/* Player Basket */}
          <div
            ref={playerRef}
            className="absolute bottom-4 text-4xl transition-all"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            🧺
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold"
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#64748b]"
        >
          <p>Move your mouse to catch falling items. Each level gets faster! 🚀</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CatchTheGame;
