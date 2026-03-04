import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative size-full bg-black overflow-hidden">
      {/* Glitch effect */}
      <motion.div
        animate={{
          opacity: [0, 0.1, 0, 0.15, 0],
          x: [0, -5, 5, -5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        className="absolute inset-0 bg-red-500/10 mix-blend-screen"
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)'
        }}
      />

      <div className="relative z-10 size-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block mb-6"
          >
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </motion.div>

          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-red-500 font-mono text-8xl font-bold mb-4"
          >
            404
          </motion.div>

          <h1 className="text-white font-mono text-2xl font-bold mb-2">
            ACCESS DENIED
          </h1>

          <p className="text-gray-400 font-mono text-sm mb-8 max-w-md">
            The requested resource could not be found in the database.
            <br />
            This area may be restricted or the file has been deleted.
          </p>

          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            RETURN TO DASHBOARD
          </motion.button>

          <div className="mt-6 text-yellow-500 font-mono text-xs">
            ERROR CODE: FILE_NOT_FOUND
          </div>
        </motion.div>
      </div>
    </div>
  );
}
