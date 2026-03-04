import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home, Trash2, Link as LinkIcon } from 'lucide-react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Evidence {
  id: number;
  type: 'photo' | 'document' | 'note' | 'corrupted';
  title: string;
  content: string;
  image?: string;
  x: number;
  y: number;
}

interface Connection {
  from: number;
  to: number;
}

function DraggableEvidence({ evidence, onMove, onSelect, onAnalyze }: {
  evidence: Evidence;
  onMove: (id: number, x: number, y: number) => void;
  onSelect: (id: number) => void;
  onAnalyze?: (id: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'evidence',
    item: { id: evidence.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        onMove(item.id, offset.x, offset.y);
      }
    },
  }), [evidence.id]);

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      style={{
        position: 'absolute',
        left: evidence.x,
        top: evidence.y,
        cursor: 'move',
      }}
      className="group"
      onClick={() => onSelect(evidence.id)}
    >
      <div className="relative bg-yellow-50 border-2 border-yellow-600 p-3 shadow-lg rotate-1 hover:rotate-0 transition-transform w-48">
        {/* Thumb tack */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full border-2 border-red-800 shadow-md" />

        {evidence.image && (
          <ImageWithFallback
            src={evidence.image}
            alt={evidence.title}
            className="w-full h-32 object-cover mb-2"
          />
        )}

        <div className="font-handwriting text-sm mb-1 font-bold text-gray-900">
          {evidence.title}
        </div>
        <div className="font-mono text-xs text-gray-700">
          {evidence.content}
        </div>

        {evidence.type === 'corrupted' && (
          <div className="mt-2 flex justify-center relative z-10">
            <button
              className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-500 font-mono w-full font-bold tracking-widest"
              onClick={(e) => {
                e.stopPropagation();
                if (onAnalyze) onAnalyze(evidence.id);
              }}
            >
              ANALYZE
            </button>
          </div>
        )}

        {/* Selection indicator */}
        <div className="absolute -inset-1 border-2 border-blue-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
      </div>
    </motion.div>
  );
}

import { CorruptedEvidenceViewer } from './CorruptedEvidenceViewer';

function EvidenceBoardContent() {
  const navigate = useNavigate();
  const [analyzingEvidence, setAnalyzingEvidence] = useState<number | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([
    {
      id: 1,
      type: 'photo',
      title: 'SUSPECT #1',
      content: 'Marcus Chen - Security Guard. Heavy duty boots.',
      image: 'https://images.unsplash.com/photo-1587568309673-bc206fd019c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjBzZXJpb3VzJTIwbWFufGVufDF8fHx8MTc3MjU5ODU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      x: 100,
      y: 100,
    },
    {
      id: 2,
      type: 'photo',
      title: 'SUSPECT #2',
      content: 'Sarah Miller - Business Partner. Motive: Money.',
      image: 'https://images.unsplash.com/photo-1606534498512-1f073c93b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjB3b21hbiUyMHN1c3BpY2lvdXN8ZW58MXx8fHwxNzcyNTk4NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      x: 400,
      y: 100,
    },
    {
      id: 3,
      type: 'photo',
      title: 'SUSPECT #3',
      content: 'David Park - Ex-Husband. Violent history.',
      image: 'https://images.unsplash.com/photo-1735084487276-612a8987ea7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjBtYWxlJTIwY3JpbWluYWx8ZW58MXx8fHwxNzcyNTk4NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      x: 700,
      y: 100,
    },
    {
      id: 4,
      type: 'document',
      title: 'PHONE RECORDS',
      content: 'Last call: 23:42 to encrypted offshore #',
      x: 150,
      y: 350,
    },
    {
      id: 5,
      type: 'document',
      title: 'BANK TRANSFER',
      content: '$500K to Cayman Islands from S. Miller.',
      image: 'https://images.unsplash.com/photo-1571390689673-22becafc6414?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JlbnNpYyUyMGV2aWRlbmNlJTIwZG9jdW1lbnRzJTIwaW52ZXN0aWdhdGlvbnxlbnwxfHx8fDE3NzI1OTg1Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      x: 450,
      y: 350,
    },
    {
      id: 6,
      type: 'note',
      title: 'BURNED LETTER',
      content: '"...pay the $500K or the board finds out..."',
      x: 750,
      y: 350,
    },
    {
      id: 7,
      type: 'note',
      title: 'CRIME SCENE CLUE',
      content: 'Size 10 boot prints with downtown red clay.',
      x: 450,
      y: 550,
    },
    {
      id: 8,
      type: 'corrupted',
      title: 'FILE: evidence_12.jpg',
      content: 'STATUS: CORRUPTED. Requires DRM analysis.',
      image: 'https://images.unsplash.com/photo-1620120935542-a7a51d8b7ea8?q=80&w=400&auto=format&fit=crop',
      x: 100,
      y: 550,
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: 1, to: 7 },
    { from: 2, to: 5 },
    { from: 5, to: 6 },
  ]);

  const [selectedEvidence, setSelectedEvidence] = useState<number | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMove = (id: number, x: number, y: number) => {
    setEvidences(prev =>
      prev.map(e => (e.id === id ? { ...e, x, y } : e))
    );
  };

  const handleSelect = (id: number) => {
    if (connectMode && selectedEvidence !== null && selectedEvidence !== id) {
      // Create connection
      setConnections(prev => [...prev, { from: selectedEvidence, to: id }]);
      setConnectMode(false);
      setSelectedEvidence(null);
    } else {
      setSelectedEvidence(id);
      if (connectMode) {
        // First selection in connect mode
      }
    }
  };

  const handleStartConnect = () => {
    if (selectedEvidence !== null) {
      setConnectMode(true);
    }
  };

  const handleDeleteConnection = (index: number) => {
    setConnections(prev => prev.filter((_, i) => i !== index));
  };

  const getEvidenceCenter = (id: number) => {
    const evidence = evidences.find(e => e.id === id);
    if (!evidence) return { x: 0, y: 0 };
    return {
      x: evidence.x + 96, // half of w-48
      y: evidence.y + 100,
    };
  };

  const [, drop] = useDrop(() => ({
    accept: 'evidence',
  }), []);

  return (
    <div ref={drop} className="relative size-full bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
      {/* Cork board texture */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-40 bg-gradient-to-r from-red-900 to-red-800 border-b-4 border-red-950 shadow-xl"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-red-950 hover:bg-red-900 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white font-mono drop-shadow-lg">
              EVIDENCE BOARD
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {selectedEvidence && (
              <button
                onClick={handleStartConnect}
                className={`px-4 py-2 ${connectMode ? 'bg-green-500' : 'bg-blue-500'
                  } hover:bg-blue-600 text-white font-mono font-bold rounded-lg transition-colors flex items-center gap-2`}
              >
                <LinkIcon className="w-4 h-4" />
                {connectMode ? 'SELECT TARGET' : 'CONNECT'}
              </button>
            )}
            <div className="px-4 py-2 bg-yellow-500 text-black font-mono font-bold rounded-lg">
              {evidences.length} ITEMS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Evidence Board */}
      <div className="relative h-[calc(100%-73px)] overflow-auto">
        {/* SVG for connections (red threads) */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ minWidth: '1400px', minHeight: '800px' }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {connections.map((conn, index) => {
            const from = getEvidenceCenter(conn.from);
            const to = getEvidenceCenter(conn.to);
            return (
              <g key={index}>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#dc2626"
                  strokeWidth="3"
                  filter="url(#glow)"
                  className="cursor-pointer"
                  onClick={() => handleDeleteConnection(index)}
                />
                {/* Connection node */}
                <circle
                  cx={(from.x + to.x) / 2}
                  cy={(from.y + to.y) / 2}
                  r="8"
                  fill="#dc2626"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => handleDeleteConnection(index)}
                />
              </g>
            );
          })}
        </svg>

        {/* Evidence items */}
        <div className="relative z-20" style={{ minWidth: '1400px', minHeight: '800px' }}>
          {evidences.map((evidence) => (
            <DraggableEvidence
              key={evidence.id}
              evidence={evidence}
              onMove={handleMove}
              onSelect={handleSelect}
              onAnalyze={setAnalyzingEvidence}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-yellow-500 rounded-lg px-6 py-3 z-50"
      >
        <div className="text-yellow-400 font-mono text-sm text-center">
          {connectMode
            ? '🔗 Click another evidence to create connection'
            : '📌 Drag evidence to arrange • Select and click CONNECT to link clues'}
        </div>
      </motion.div>

      {analyzingEvidence !== null && (
        <CorruptedEvidenceViewer onClose={() => setAnalyzingEvidence(null)} />
      )}
    </div>
  );
}

export default function EvidenceBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <EvidenceBoardContent />
    </DndProvider>
  );
}
