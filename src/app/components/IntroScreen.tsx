import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';

const bootSequence = [
  { text: "INITIALIZING SECURE CONNECTION...", delay: 0 },
  { text: "ACCESSING POLICE DATABASE...", delay: 1000 },
  { text: "DECRYPTING FILES...", delay: 2000 },
  { text: "LOADING CASE FILE #731...", delay: 3000 },
  { text: "VICTORIA MANSION MURDER", delay: 4000 },
  { text: "STATUS: ACTIVE INVESTIGATION", delay: 4500 },
  { text: "CLEARANCE LEVEL: DETECTIVE", delay: 5000 },
];

export default function IntroScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setCurrentLine(index + 1);
        setProgress(((index + 1) / bootSequence.length) * 100);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setShowButton(true), 500);
        }
      }, line.delay);
    });

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleAccess = () => {
    if (password.toUpperCase() === 'DETECTIVE731') {
      setError('');
      setGlitch(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } else {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }
  };

  return (
    <div className="relative size-full bg-black overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 60% 40%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
          }}
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/10 z-20 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 size-full flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div
            className="mb-12 text-center"
            animate={{ opacity: glitch ? 0.3 : 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-block mb-4"
            >
              <Lock className="w-16 h-16 text-red-500 mx-auto" />
            </motion.div>
            <div className="text-red-500 text-sm font-mono mb-2 tracking-wider">
              CLASSIFIED
            </div>
            <div className="text-4xl font-bold text-white mb-2 font-mono tracking-tight">
              POLICE DATABASE
            </div>
            <div className="text-yellow-400 text-xs font-mono tracking-widest">
              UNAUTHORIZED ACCESS PROHIBITED
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-gray-400 font-mono text-xs mt-1 text-right">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <div className="font-mono text-sm space-y-3">
              {bootSequence.slice(0, currentLine).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 ${
                    index === bootSequence.length - 2 || index === bootSequence.length - 1
                      ? 'text-red-400 font-bold'
                      : 'text-green-400'
                  }`}
                >
                  <span className="text-green-500">{'>'}</span>
                  <TypewriterText text={line.text} />
                  {index === currentLine - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-green-400 ml-1"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Access Form */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative w-64 pt-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                    placeholder="ENTER PASSWORD"
                    className="w-full bg-black/80 border-2 border-red-500/50 text-red-500 font-mono px-4 py-2 text-center outline-none focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all placeholder:text-red-900/50 uppercase tracking-widest"
                  />
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs font-mono font-bold whitespace-nowrap"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  onClick={handleAccess}
                  className="relative px-8 py-4 bg-red-600 text-white font-mono font-bold text-lg tracking-wider border-2 border-red-400 shadow-lg shadow-red-500/50 overflow-hidden group mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                    style={{ opacity: 0.1 }}
                  />
                  <span className="relative z-10">ACCESS CASE FILE</span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-300"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning text */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6 text-yellow-500 text-xs font-mono"
              >
                WARNING: All activity is being monitored and logged
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  return <span>{text}</span>;
}