import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { ZoomIn, ZoomOut, X, AlertCircle, Home } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Evidence {
  id: number;
  x: number;
  y: number;
  title: string;
  description: string;
  found: boolean;
}

export default function CrimeScene() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([
    { id: 1, x: 35, y: 40, title: 'BROKEN GLASS', description: 'Shattered crystal wine glass. Traces of a rare vintage. The scatter pattern suggests it was thrown, not dropped.', found: false },
    { id: 2, x: 65, y: 30, title: 'BLOOD STAIN', description: 'Small blood trace near the antique desk. Type O-negative. The victim was AB-positive... whose blood is this?', found: false },
    { id: 3, x: 50, y: 60, title: 'FOOTPRINT', description: 'Size 10 heavy duty boot print. Traces of distinct red clay found only at the construction site downtown.', found: false },
    { id: 4, x: 20, y: 70, title: 'PHONE', description: 'Victim\'s phone. Smashed screen. Last outgoing call at 23:42 to an encrypted offshore number.', found: false },
    { id: 5, x: 80, y: 55, title: 'BURNED LETTER', description: 'Partially destroyed document in the fireplace. Visible words: "...pay the $500K or the board finds out..."', found: false },
  ]);
  const [notes, setNotes] = useState('');

  const handleEvidenceClick = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setEvidenceList(prev =>
      prev.map(e => e.id === evidence.id ? { ...e, found: true } : e)
    );
  };

  const foundCount = evidenceList.filter(e => e.found).length;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-yellow-500/30"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white font-mono">CRIME SCENE ANALYSIS</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-400 font-mono text-sm">
              EVIDENCE: {foundCount}/{evidenceList.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                disabled={zoom <= 1}
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <span className="text-white font-mono text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                disabled={zoom >= 2}
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crime Scene Image with Evidence Markers */}
      <div className="absolute inset-0 flex items-center justify-center overflow-auto pt-20 pb-6">
        <motion.div
          style={{ scale: zoom }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?auto=format&fit=crop&q=80&w=1080"
            alt="Crime Scene"
            className="w-[1000px] h-[600px] object-cover rounded-lg border-2 border-yellow-500/30"
          />

          {/* Evidence Markers */}
          {evidenceList.map((evidence) => (
            <motion.div
              key={evidence.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: evidence.id * 0.2 }}
              style={{
                position: 'absolute',
                left: `${evidence.x}%`,
                top: `${evidence.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleEvidenceClick(evidence)}
              className="cursor-pointer group"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: evidence.found ? 0.6 : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className={`w-12 h-12 rounded-full border-4 ${evidence.found ? 'border-green-500 bg-green-500/20' : 'border-yellow-500 bg-yellow-500/20'
                  } flex items-center justify-center backdrop-blur-sm`}
              >
                <span className="text-white font-mono font-bold text-sm">{evidence.id}</span>
              </motion.div>

              {/* Pulse ring */}
              {!evidence.found && (
                <motion.div
                  animate={{
                    scale: [1, 2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 w-12 h-12 rounded-full border-2 border-yellow-500"
                />
              )}

              {/* Hover tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/90 border border-yellow-500 rounded px-3 py-2 whitespace-nowrap">
                  <div className="text-yellow-400 font-mono text-xs font-bold">
                    {evidence.title}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Notes Panel */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        className="absolute left-6 top-24 w-80 bg-slate-900/95 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm"
      >
        <h3 className="text-blue-400 font-mono font-bold mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          INVESTIGATION NOTES
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type your observations here..."
          className="w-full h-40 bg-black/50 border border-blue-500/30 rounded p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
        />
        <div className="mt-2 text-gray-400 font-mono text-xs">
          All notes are auto-saved
        </div>
      </motion.div>

      {/* Evidence Detail Modal */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvidence(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-yellow-500 rounded-lg p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="mb-4">
                <div className="inline-block px-3 py-1 bg-yellow-500 text-black font-mono font-bold text-sm rounded mb-3">
                  EVIDENCE #{selectedEvidence.id}
                </div>
                <h2 className="text-3xl font-bold text-white font-mono mb-2">
                  {selectedEvidence.title}
                </h2>
              </div>

              <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  {selectedEvidence.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Evidence logged to case file</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion notification */}
      <AnimatePresence>
        {foundCount === evidenceList.length && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-black font-mono font-bold px-6 py-3 rounded-lg shadow-2xl z-50"
          >
            ALL EVIDENCE COLLECTED! ANALYSIS COMPLETE.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
