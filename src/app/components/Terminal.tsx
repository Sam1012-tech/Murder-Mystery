import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

const commands = {
  help: {
    output: [
      'Available commands:',
      '  help        - Show this help message',
      '  clear       - Clear terminal screen',
      '  status      - Show case status',
      '  suspects    - List all suspects',
      '  evidence    - Show evidence summary',
      '  cctv        - Access CCTV feeds',
      '  scan        - Run forensic scan',
      '  decrypt     - Decrypt encrypted file',
      '  trace       - Trace phone call',
    ],
  },
  status: {
    output: [
      'CASE #731 - VICTORIA MANSION MURDER',
      'Status: ACTIVE INVESTIGATION',
      'Victim: Victoria Chambers, 45',
      'Time of Death: 23:47 PM',
      'Location: Chambers Mansion, Study Room',
      'Suspects: 4 individuals under investigation',
      'Evidence: 14 items collected',
    ],
  },
  suspects: {
    output: [
      'SUSPECT DATABASE:',
      '1. Marcus Chen - Security Guard [THREAT: HIGH]',
      '2. Sarah Miller - Business Partner [THREAT: CRITICAL]',
      '3. David Park - Ex-Husband [THREAT: HIGH]',
      '4. Elena Rodriguez - Housekeeper [THREAT: LOW]',
    ],
  },
  evidence: {
    output: [
      'EVIDENCE SUMMARY:',
      '• Broken crystal wine glass',
      '• Blood stain (Type O-negative)',
      '• Size 10 heavy duty boot print',
      '• Victim\'s phone (last call 23:42)',
      '• Burned letter fragments',
      '• $500K Cayman Islands bank transfer',
      '• CCTV footage',
      '• Forensic analysis pending...',
    ],
  },
  cctv: {
    output: ['Accessing CCTV monitoring system...', 'Redirecting...'],
    action: 'cctv',
  },
  scan: {
    output: [
      'Initiating forensic scan...',
      'Scanning crime scene data...',
      '████████████████████ 100%',
      'MATCH FOUND: Boot print matches Security Guard uniform',
      'ALERT: Fingerprints found on wine glass - DNA analysis pending',
    ],
  },
  decrypt: {
    output: [
      'Loading encrypted file...',
      'Running decryption algorithm...',
      '░░░░░░░░░░░░░░░░░░░░ 0%',
      '████░░░░░░░░░░░░░░░░ 25%',
      '████████░░░░░░░░░░░░ 50%',
      '████████████░░░░░░░░ 75%',
      '████████████████████ 100%',
      'DECRYPTED MESSAGE: "The transfer to the Caymans is complete. If she talks, we silence her tonight."',
    ],
  },
  trace: {
    output: [
      'Tracing last incoming call...',
      'Phone Number: BLOCKED',
      'Location: Signal bouncing through multiple towers',
      'Encryption: Military grade',
      'WARNING: Caller used sophisticated anti-tracking measures',
      'Partial trace obtained: Call originated within 5 mile radius',
    ],
  },
};

export default function Terminal() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'POLICE DATABASE TERMINAL v3.7.2' },
    { type: 'output', text: 'Type "help" for available commands' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === '') return;

    setCommandHistory(prev => [...prev, cmd]);
    setLines(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);

    if (trimmedCmd === 'clear') {
      setLines([]);
      return;
    }

    if (trimmedCmd in commands) {
      const command = commands[trimmedCmd as keyof typeof commands];
      const outputLines = command.output.map((text, index) => ({
        type: (text.includes('ERROR') ? 'error' :
          text.includes('MATCH FOUND') || text.includes('DECRYPTED') ? 'success' :
            'output') as TerminalLine['type'],
        text,
      }));

      // Simulate typing effect for long outputs
      if (outputLines.length > 3) {
        outputLines.forEach((line, index) => {
          setTimeout(() => {
            setLines(prev => [...prev, line]);
          }, index * 200);
        });
      } else {
        setLines(prev => [...prev, ...outputLines]);
      }

      // Handle special actions
      if ('action' in command && command.action) {
        setTimeout(() => {
          navigate(`/${command.action}`);
        }, 2000);
      }
    } else {
      setLines(prev => [
        ...prev,
        { type: 'error', text: `Command not found: ${trimmedCmd}` },
        { type: 'output', text: 'Type "help" for available commands' },
      ]);
    }

    setLines(prev => [...prev, { type: 'output', text: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="relative size-full bg-black overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)'
        }}
      />

      {/* CRT effect */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-30 bg-black/90 backdrop-blur-sm border-b border-green-500/30"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-green-500" />
            </button>
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-6 h-6 text-green-500" />
              <h1 className="text-xl font-bold text-green-500 font-mono">SYSTEM TERMINAL</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <span className="text-green-500 font-mono text-sm">ONLINE</span>
          </div>
        </div>
      </motion.div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="relative z-20 h-[calc(100%-73px)] overflow-y-auto p-6 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }}
            className={`mb-1 ${line.type === 'input' ? 'text-cyan-400' :
              line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-yellow-400' :
                  'text-green-400'
              }`}
          >
            {line.text}
          </motion.div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-cyan-400">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
            autoFocus
            spellCheck={false}
          />
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-green-400"
          />
        </form>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-20 left-6 w-8 h-8 border-l-2 border-t-2 border-green-500/50 pointer-events-none z-30" />
      <div className="absolute top-20 right-6 w-8 h-8 border-r-2 border-t-2 border-green-500/50 pointer-events-none z-30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-green-500/50 pointer-events-none z-30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-green-500/50 pointer-events-none z-30" />
    </div>
  );
}
