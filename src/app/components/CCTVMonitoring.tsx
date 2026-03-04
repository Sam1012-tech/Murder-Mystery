import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Play, Pause, SkipBack, SkipForward, Home, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Camera {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'offline' | 'warning';
  image: string;
}

export default function CCTVMonitoring() {
  const navigate = useNavigate();
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(true);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const cameras: Camera[] = [
    { id: 1, name: 'CAM 01', location: 'MAIN ENTRANCE', status: 'active', image: 'https://images.unsplash.com/photo-1720273238003-079301a7e9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXlzdGVyaW91cyUyMGRldGVjdGl2ZSUyMG9mZmljZXxlbnwxfHx8fDE3NzI1OTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'CAM 02', location: 'HALLWAY A', status: 'active', image: 'https://images.unsplash.com/photo-1720273238003-079301a7e9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXlzdGVyaW91cyUyMGRldGVjdGl2ZSUyMG9mZmljZXxlbnwxfHx8fDE3NzI1OTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'CAM 03', location: 'STUDY ROOM', status: 'warning', image: 'https://images.unsplash.com/photo-1571390689673-22becafc6414?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JlbnNpYyUyMGV2aWRlbmNlJTIwZG9jdW1lbnRzJTIwaW52ZXN0aWdhdGlvbnxlbnwxfHx8fDE3NzI1OTg1Njh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'CAM 04', location: 'PARKING LOT', status: 'active', image: 'https://images.unsplash.com/photo-1720273238003-079301a7e9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXlzdGVyaW91cyUyMGRldGVjdGl2ZSUyMG9mZmljZXxlbnwxfHx8fDE3NzI1OTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 5, name: 'CAM 05', location: 'STAIRWELL B', status: 'offline', image: 'https://images.unsplash.com/photo-1720273238003-079301a7e9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXlzdGVyaW91cyUyMGRldGVjdGl2ZSUyMG9mZmljZXxlbnwxfHx8fDE3NzI1OTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 6, name: 'CAM 06', location: 'BACK EXIT', status: 'active', image: 'https://images.unsplash.com/photo-1763799342720-363e8c925cdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmltZSUyMHNjZW5lJTIwaW52ZXN0aWdhdGlvbiUyMGV2aWRlbmNlfGVufDF8fHx8MTc3MjU5ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => (prev + 1) % 3600);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = () => {
    const date = new Date();
    date.setHours(23, 42, currentTime % 60);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="relative size-full bg-slate-950 overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)'
        }}
      />

      {/* Glitch effect */}
      <AnimatePresence>
        {glitchEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500/20 z-20 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-30 bg-black/90 backdrop-blur-sm border-b border-blue-500/30"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white font-mono">CCTV MONITORING SYSTEM</h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500 rounded text-red-400 font-mono text-sm"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>REC</span>
            </motion.div>
            <div className="text-blue-400 font-mono text-sm">
              {formatTimestamp()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 h-[calc(100%-73px)]">
        {selectedCamera === null ? (
          /* Grid View */
          <div className="p-6 h-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {cameras.map((camera, index) => (
                <motion.div
                  key={camera.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCamera(camera.id)}
                  className="relative bg-black border border-blue-500/30 rounded-lg overflow-hidden cursor-pointer group hover:border-blue-500 transition-all"
                >
                  {/* Camera Feed */}
                  <div className="relative h-full">
                    <ImageWithFallback
                      src={camera.image}
                      alt={camera.name}
                      className="size-full object-cover"
                      style={{
                        filter: camera.status === 'offline' ? 'grayscale(1) brightness(0.3)' : 'none'
                      }}
                    />

                    {/* Static noise for offline cameras */}
                    {camera.status === 'offline' && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-red-500 font-mono font-bold">SIGNAL LOST</div>
                      </div>
                    )}

                    {/* CCTV overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Top bar */}
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              camera.status === 'active' ? 'bg-green-500' :
                              camera.status === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-white font-bold">{camera.name}</span>
                          </div>
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-red-500 font-bold"
                          >
                            ●REC
                          </motion.div>
                        </div>
                        <div className="text-blue-400 text-xs mt-1">
                          {camera.location}
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="text-white text-xs font-mono">
                          {formatTimestamp()}
                        </div>
                      </div>

                      {/* Corner brackets */}
                      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-blue-500" />
                      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-blue-500" />
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-blue-500" />
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-500" />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="p-3 bg-black/80 rounded-lg border border-blue-500">
                        <Maximize2 className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Full Screen View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full bg-black"
          >
            <ImageWithFallback
              src={cameras.find(c => c.id === selectedCamera)?.image || ''}
              alt="Full Screen Camera"
              className="size-full object-contain"
            />

            {/* CCTV Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2 text-red-500 font-mono font-bold text-lg"
                    >
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                      <span>REC</span>
                    </motion.div>
                    <div className="text-white font-mono text-lg font-bold">
                      {cameras.find(c => c.id === selectedCamera)?.name} - {cameras.find(c => c.id === selectedCamera)?.location}
                    </div>
                  </div>
                  <div className="text-blue-400 font-mono text-lg">
                    {formatTimestamp()}
                  </div>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-blue-500" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-blue-500" />
              <div className="absolute bottom-24 left-4 w-12 h-12 border-l-4 border-b-4 border-blue-500" />
              <div className="absolute bottom-24 right-4 w-12 h-12 border-r-4 border-b-4 border-blue-500" />
            </div>

            {/* Controls */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-blue-500/30 p-6 pointer-events-auto"
            >
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Timeline */}
                <div className="flex items-center gap-4">
                  <div className="text-blue-400 font-mono text-sm min-w-[80px]">
                    {formatTime(currentTime)}
                  </div>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      style={{ width: `${(currentTime / 3600) * 100}%` }}
                    />
                  </div>
                  <div className="text-blue-400 font-mono text-sm min-w-[80px] text-right">
                    01:00:00
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <SkipBack className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => setCurrentTime(Math.min(3600, currentTime + 10))}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <SkipForward className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
                    >
                      {muted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCamera(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white font-mono text-sm"
                  >
                    GRID VIEW
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
