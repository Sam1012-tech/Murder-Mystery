import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, Sun, Image as ImageIcon, X, Zap } from 'lucide-react';

interface CorruptedEvidenceProps {
    onClose: () => void;
}

export function CorruptedEvidenceViewer({ onClose }: CorruptedEvidenceProps) {
    const [brightness, setBrightness] = useState(0.2);
    const [contrast, setContrast] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // The secret is revealed if brightness is high and zoom is high
    const isRevealed = brightness > 1.8 && zoom >= 2.0;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-md">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="p-3 bg-red-900/80 hover:bg-red-600 text-white rounded-lg transition-colors border border-red-500/30 font-mono shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 h-[85vh]">
                {/* Controls Panel */}
                <div className="w-full lg:w-80 bg-gray-950 border border-gray-800 p-6 rounded-xl flex flex-col gap-8 text-gray-300 font-mono shadow-2xl relative overflow-hidden">

                    {/* Decorative background grid */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iIzMzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20 pointer-events-none" />

                    <div className="flex items-center gap-3 border-b border-gray-800 pb-5 relative z-10">
                        <Zap className="text-yellow-500 w-6 h-6 animate-pulse" />
                        <h2 className="text-xl font-bold text-white tracking-widest">DRM TOOLSET</h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                            <div className="flex justify-between mb-3">
                                <label className="text-sm flex items-center gap-2 text-cyan-400 font-bold">
                                    <Sun className="w-4 h-4" />
                                    EXPOSURE
                                </label>
                                <span className="text-cyan-400 text-xs bg-cyan-950 px-2 py-0.5 rounded">{Math.round(brightness * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.05"
                                value={brightness}
                                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all"
                            />
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                            <div className="flex justify-between mb-3">
                                <label className="text-sm flex items-center gap-2 text-orange-400 font-bold">
                                    <Sun className="w-4 h-4" />
                                    CONTRAST
                                </label>
                                <span className="text-orange-400 text-xs bg-orange-950 px-2 py-0.5 rounded">{Math.round(contrast * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.05"
                                value={contrast}
                                onChange={(e) => setContrast(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(251,146,60,0.8)] transition-all"
                            />
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                            <div className="flex justify-between mb-3">
                                <label className="text-sm flex items-center gap-2 text-purple-400 font-bold">
                                    <ZoomIn className="w-4 h-4" />
                                    MAGNIFY
                                </label>
                                <span className="text-purple-400 text-xs bg-purple-950 px-2 py-0.5 rounded">{zoom.toFixed(1)}x</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(192,132,252,0.8)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-auto bg-red-950/20 p-5 rounded-lg border border-red-900/50 relative z-10">
                        <h3 className="text-red-500 font-bold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            SYSTEM WARNING
                        </h3>
                        <div className="text-xs text-red-400/80 leading-relaxed font-mono space-y-1">
                            <p>FILE: <span className="text-gray-300">evidence_12.jpg</span></p>
                            <p>STATUS: <span className="text-yellow-500 font-bold">CORRUPTED</span></p>
                            <p>ENCRYPTION: <span className="text-gray-300">UNKNOWN</span></p>
                            <p className="mt-2 text-gray-400 italic">"Visual anomalies detected. Recommend extreme magnification and exposure adjustments."</p>
                        </div>
                    </div>
                </div>

                {/* Image Viewer Element */}
                <div className="flex-1 bg-[#050505] border border-gray-800 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* CRT Overlay effects */}
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.15]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
                    <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[100%] animate-scanBox opacity-50" />

                    <motion.div
                        style={{
                            x: position.x,
                            y: position.y,
                            scale: zoom,
                            filter: `brightness(${brightness}) contrast(${contrast}) grayscale(80%) sepia(20%)`,
                        }}
                        className="relative w-[600px] h-[600px] flex items-center justify-center transition-[filter,transform] duration-75 ease-out"
                    >
                        {/* The base corrupted image */}
                        <div
                            className="absolute inset-0 bg-[#0d0d0d] bg-[url('https://images.unsplash.com/photo-1620120935542-a7a51d8b7ea8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
                            style={{ opacity: 0.9, mixBlendMode: 'luminosity' }}
                        />

                        {/* Some visual noise/texture */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay" />

                        {/* The hidden text */}
                        <div
                            className={`absolute flex items-center justify-center w-full h-full p-10 transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-[0.01]'}`}
                        >
                            <div
                                className="font-serif italic font-black text-center rotate-[-5deg] tracking-[0.5em] leading-relaxed break-words"
                                style={{
                                    color: '#1a1a1a', // Extremely dark
                                    textShadow: '0 0 2px rgba(255,255,255,0.1), 0 0 20px rgba(255,0,0,0.2)',
                                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                                    mixBlendMode: 'multiply',
                                }}
                            >
                                HE IS<br />WATCHING
                            </div>
                        </div>

                        {/* A second hidden text element that relies pure on CSS filters without JS logic, as a hidden message in darkness */}
                        <div
                            className="absolute right-12 bottom-12 font-mono text-[#080808] text-[10px] font-bold tracking-widest"
                            style={{
                                textShadow: '0 0 0.5px rgba(255,255,255,0.05)',
                            }}
                        >
                            FILE_12 // ENCRYPTED_FRAG_99
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
