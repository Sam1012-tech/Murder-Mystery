import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  Camera, 
  Users, 
  SearchX, 
  Terminal, 
  Clock,
  AlertTriangle,
  MapPin,
  Phone
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const panels = [
    {
      id: 'case',
      title: 'CASE FILE',
      icon: FileText,
      color: 'red',
      route: null,
      data: {
        caseNumber: '#731',
        victim: 'VICTORIA CHAMBERS',
        location: 'CHAMBERS MANSION',
        time: '23:47 PM',
        status: 'ACTIVE'
      }
    },
    {
      id: 'evidence',
      title: 'EVIDENCE',
      icon: SearchX,
      color: 'yellow',
      route: '/evidence-board',
      count: 12
    },
    {
      id: 'cctv',
      title: 'CCTV FEEDS',
      icon: Camera,
      color: 'blue',
      route: '/cctv',
      status: 'LIVE'
    },
    {
      id: 'suspects',
      title: 'SUSPECTS',
      icon: Users,
      color: 'red',
      route: '/interrogation',
      count: 4
    },
    {
      id: 'crime-scene',
      title: 'CRIME SCENE',
      icon: MapPin,
      color: 'yellow',
      route: '/crime-scene',
      status: 'ANALYZED'
    },
    {
      id: 'terminal',
      title: 'TERMINAL',
      icon: Terminal,
      color: 'green',
      route: '/terminal'
    }
  ];

  const handlePanelClick = (panel: typeof panels[0]) => {
    setActivePanel(panel.id);
    if (panel.route) {
      setTimeout(() => {
        navigate(panel.route!);
      }, 300);
    }
  };

  return (
    <div className="relative size-full bg-slate-950 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)'
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-20 border-b border-red-500/30 bg-black/80 backdrop-blur-sm"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-mono text-xs font-bold tracking-wider">
                CLASSIFIED
              </span>
            </div>
            <div className="h-4 w-px bg-red-500/30" />
            <h1 className="text-2xl font-bold text-white font-mono">
              INVESTIGATION DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>CASE #731</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-6 h-[calc(100%-73px)] overflow-auto">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {panels.map((panel, index) => {
            const Icon = panel.icon;
            const isActive = activePanel === panel.id;
            
            return (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePanelClick(panel)}
                className={`relative bg-slate-900/80 border ${
                  panel.color === 'red' ? 'border-red-500/30 hover:border-red-500/60' :
                  panel.color === 'yellow' ? 'border-yellow-500/30 hover:border-yellow-500/60' :
                  panel.color === 'blue' ? 'border-blue-500/30 hover:border-blue-500/60' :
                  'border-green-500/30 hover:border-green-500/60'
                } rounded-lg p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  isActive ? 'scale-95' : 'hover:scale-105'
                }`}
                whileHover={{ boxShadow: `0 0 20px ${
                  panel.color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                  panel.color === 'yellow' ? 'rgba(234, 179, 8, 0.3)' :
                  panel.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                  'rgba(34, 197, 94, 0.3)'
                }` }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-50" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-50" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50" />

                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${
                    panel.color === 'red' ? 'text-red-500' :
                    panel.color === 'yellow' ? 'text-yellow-500' :
                    panel.color === 'blue' ? 'text-blue-500' :
                    'text-green-500'
                  }`} />
                  {panel.count && (
                    <div className="px-2 py-1 bg-red-500 text-white font-mono text-xs font-bold rounded">
                      {panel.count}
                    </div>
                  )}
                  {panel.status && (
                    <div className={`px-2 py-1 ${
                      panel.status === 'LIVE' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-black font-mono text-xs font-bold rounded flex items-center gap-1`}>
                      {panel.status === 'LIVE' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      {panel.status}
                    </div>
                  )}
                </div>

                <h3 className="text-white font-mono font-bold text-lg mb-2">
                  {panel.title}
                </h3>

                {panel.data && (
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CASE:</span>
                      <span className="text-red-400">{panel.data.caseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VICTIM:</span>
                      <span className="text-white">{panel.data.victim}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LOCATION:</span>
                      <span className="text-white">{panel.data.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TIME:</span>
                      <span className="text-white">{panel.data.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">STATUS:</span>
                      <span className="text-yellow-400">{panel.data.status}</span>
                    </div>
                  </div>
                )}

                {!panel.data && (
                  <p className="text-gray-400 text-sm font-mono">
                    Click to access {panel.title.toLowerCase()}
                  </p>
                )}

                {/* Hover effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0"
                  whileHover={{ opacity: 0.5 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Incoming Call Notification */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => navigate('/phone-call')}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-red-900 to-black border border-red-500 rounded-lg p-4 shadow-2xl shadow-red-500/50 cursor-pointer hover:scale-105 transition-transform z-50"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="p-3 bg-red-500 rounded-full"
            >
              <Phone className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-white font-mono font-bold">INCOMING CALL</div>
              <div className="text-red-400 font-mono text-sm">UNKNOWN NUMBER</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}