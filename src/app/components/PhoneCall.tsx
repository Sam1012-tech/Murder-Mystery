import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Phone, PhoneOff, Mic, MicOff, Volume2, X } from 'lucide-react';

export default function PhoneCall() {
  const navigate = useNavigate();
  const [callState, setCallState] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; time: number }>>([]);
  const [pulse, setPulse] = useState(true);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
    if (muted) {
      window.speechSynthesis.cancel();
    }
  }, [muted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  useEffect(() => {
    if (callState === 'active') {
      // Simulate mysterious caller messages
      const messageTimings = [
        { text: "Detective...", delay: 2000 },
        { text: "I know what you're looking for...", delay: 5000 },
        { text: "The truth is closer than you think...", delay: 9000 },
        { text: "Check the EVIDENCE BOARD...", delay: 13000 },
        { text: "Look for the connection...", delay: 16000 },
      ];

      messageTimings.forEach(({ text, delay }) => {
        setTimeout(() => {
          if (callState === 'active') { // Fixed: using setState callback to avoid closure issues
            setMessages(prev => [...prev, { text, time: Date.now() }]);
            if (!mutedRef.current) {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.pitch = 0.5; // Mysterious voice
              utterance.rate = 0.8;
              window.speechSynthesis.speak(utterance);
            }
          }
        }, delay);
      });
    }
  }, [callState]);

  const handleAnswer = () => {
    setPulse(false);
    setCallState('active');
  };

  const handleReject = () => {
    window.speechSynthesis.cancel();
    setCallState('ended');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative size-full bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)'
        }}
      />

      {/* Close button */}
      <button
        onClick={() => {
          window.speechSynthesis.cancel();
          navigate('/dashboard');
        }}
        className="absolute top-6 right-6 z-50 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors backdrop-blur-sm"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative z-10 size-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {callState === 'incoming' && (
            <motion.div
              key="incoming"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md"
            >
              {/* Phone ring animation */}
              <motion.div
                animate={pulse ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 2, 2.5], opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-red-500 rounded-full"
                  />
                  <div className="relative z-10 p-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-2xl shadow-red-500/50">
                    <Phone className="w-16 h-16 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Caller info */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-red-500 font-mono text-sm mb-2 tracking-wider"
                >
                  INCOMING CALL
                </motion.div>
                <h2 className="text-4xl font-bold text-white font-mono mb-2">
                  UNKNOWN
                </h2>
                <div className="text-gray-400 font-mono text-sm">
                  NUMBER BLOCKED
                </div>
              </div>

              {/* Call info */}
              <div className="bg-slate-900/50 border border-red-500/30 rounded-lg p-4 mb-8 backdrop-blur-sm">
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TRACE STATUS:</span>
                    <span className="text-yellow-400">IN PROGRESS...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ENCRYPTION:</span>
                    <span className="text-red-400">MILITARY GRADE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PRIORITY:</span>
                    <span className="text-red-400">HIGH</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleReject}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-gradient-to-br from-red-600 to-red-800 text-white font-mono font-bold rounded-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  IGNORE
                </motion.button>
                <motion.button
                  onClick={handleAnswer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-gradient-to-br from-green-600 to-green-800 text-white font-mono font-bold rounded-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  ANSWER
                </motion.button>
              </div>

              {/* Warning */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center mt-6 text-yellow-500 text-xs font-mono"
              >
                ⚠ WARNING: CALL MAY BE MONITORED
              </motion.div>
            </motion.div>
          )}

          {callState === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {/* Call header */}
              <div className="bg-gradient-to-br from-slate-900 to-black border border-green-500/30 rounded-lg p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-4 h-4 bg-green-500 rounded-full"
                    />
                    <div>
                      <div className="text-white font-mono font-bold text-xl">UNKNOWN CALLER</div>
                      <div className="text-gray-400 font-mono text-sm">Encrypted Line</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-2xl font-bold">
                      {formatDuration(callDuration)}
                    </div>
                    <div className="text-gray-400 font-mono text-xs">CALL DURATION</div>
                  </div>
                </div>

                {/* Waveform visualization */}
                <div className="flex items-center justify-center gap-1 h-16">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: muted ? '4px' : ['20%', '80%', '40%', '100%', '30%'],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                      className="w-2 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Messages/Transcript */}
              <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6 mb-6 backdrop-blur-sm h-64 overflow-y-auto">
                <div className="text-blue-400 font-mono text-xs mb-4 uppercase tracking-wider">
                  Live Transcript
                </div>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-3">
                          <p className="text-white font-mono text-sm">{msg.text}</p>
                        </div>
                        <div className="text-gray-500 font-mono text-xs mt-1">
                          {formatDuration(Math.floor((Date.now() - msg.time) / 1000))} ago
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Call controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => setMuted(!muted)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-full ${muted ? 'bg-yellow-500' : 'bg-slate-700'
                    } transition-colors`}
                >
                  {muted ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-slate-700 rounded-full"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </motion.button>

                <motion.button
                  onClick={handleReject}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg shadow-red-500/50"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {callState === 'ended' && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <div className="inline-block p-6 bg-red-500/20 rounded-full border-4 border-red-500 mb-4">
                  <PhoneOff className="w-16 h-16 text-red-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white font-mono mb-2">
                CALL ENDED
              </h2>
              <div className="text-gray-400 font-mono">
                Duration: {formatDuration(callDuration)}
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-500 font-mono text-sm mt-4"
              >
                Returning to dashboard...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
