import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home, Send, AlertTriangle, User, Clock, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { generateSuspectResponse } from '../../lib/gemini';

interface Suspect {
  id: number;
  name: string;
  role: string;
  image: string;
  threat: 'low' | 'medium' | 'high';
  alibi: string;
}

interface Message {
  id: number;
  sender: 'detective' | 'suspect';
  text: string;
  timestamp: Date;
}

const suspects: Suspect[] = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Security Guard',
    image: 'https://images.unsplash.com/photo-1587568309673-bc206fd019c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjBzZXJpb3VzJTIwbWFufGVufDF8fHx8MTc3MjU5ODU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    threat: 'medium',
    alibi: 'Claims he was doing rounds',
  },
  {
    id: 2,
    name: 'Sarah Miller',
    role: 'Business Partner',
    image: 'https://images.unsplash.com/photo-1606534498512-1f073c93b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjB3b21hbiUyMHN1c3BpY2lvdXN8ZW58MXx8fHwxNzcyNTk4NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    threat: 'high',
    alibi: 'Says she was at home',
  },
  {
    id: 3,
    name: 'David Park',
    role: 'Ex-Husband',
    image: 'https://images.unsplash.com/photo-1735084487276-612a8987ea7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjBtYWxlJTIwY3JpbWluYWx8ZW58MXx8fHwxNzcyNTk4NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    threat: 'high',
    alibi: 'No solid alibi for 11:30 PM',
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Housekeeper',
    image: 'https://images.unsplash.com/photo-1606534498512-1f073c93b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWdzaG90JTIwcG9ydHJhaXQlMjB3b21hbiUyMHN1c3BpY2lvdXN8ZW58MXx8fHwxNzcyNTk4NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    threat: 'low',
    alibi: 'Left at 10:00 PM, confirmed',
  },
];

const questionBank = [
  'Where were you at 11:30 PM?',
  'What was your relationship with the victim?',
  'Did you see anything suspicious?',
  'Do you know anything about an offshore bank transfer?',
  'What do you know about the burned letter?',
];



export default function Interrogation() {
  const navigate = useNavigate();
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuspectSelect = (suspect: Suspect) => {
    setSelectedSuspect(suspect);
    setMessages([
      {
        id: Date.now(),
        sender: 'suspect',
        text: `I'm ${suspect.name}. What do you want to know?`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedSuspect || isTyping) return;

    const currentInput = input;
    // Add detective message
    const detectiveMsg: Message = {
      id: Date.now(),
      sender: 'detective',
      text: currentInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, detectiveMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Map current messages to Gemini format
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'detective' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }]
      }));

      const responseText = await generateSuspectResponse(selectedSuspect.id, chatHistory, currentInput);

      const suspectMsg: Message = {
        id: Date.now() + 1,
        sender: 'suspect',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, suspectMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: 'suspect',
        text: `[SYSTEM ERROR]: ${error.message || 'Connection failed.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="relative size-full bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)'
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-30 bg-black/90 backdrop-blur-sm border-b border-red-500/30"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white font-mono">SUSPECT INTERROGATION</h1>
          </div>
          {selectedSuspect && (
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 ${selectedSuspect.threat === 'high' ? 'bg-red-500/20 border-red-500 text-red-400' :
                selectedSuspect.threat === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                  'bg-green-500/20 border-green-500 text-green-400'
                } border rounded font-mono text-sm flex items-center gap-2`}>
                <AlertTriangle className="w-4 h-4" />
                THREAT: {selectedSuspect.threat.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative z-20 h-[calc(100%-73px)] flex">
        {/* Suspects List */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-slate-900/80 border-r border-slate-700 overflow-y-auto backdrop-blur-sm"
        >
          <div className="p-4">
            <h2 className="text-white font-mono font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              SUSPECTS ({suspects.length})
            </h2>
            <div className="space-y-3">
              {suspects.map((suspect, index) => (
                <motion.div
                  key={suspect.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuspectSelect(suspect)}
                  className={`relative bg-slate-800/50 border ${selectedSuspect?.id === suspect.id ? 'border-blue-500' : 'border-slate-700'
                    } rounded-lg p-3 cursor-pointer hover:border-blue-500/50 transition-all group`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <ImageWithFallback
                        src={suspect.image}
                        alt={suspect.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${suspect.threat === 'high' ? 'bg-red-500' :
                        suspect.threat === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-mono font-bold text-sm truncate">
                        {suspect.name}
                      </div>
                      <div className="text-gray-400 font-mono text-xs truncate">
                        {suspect.role}
                      </div>
                      <div className="text-gray-500 font-mono text-xs mt-1 truncate">
                        {suspect.alibi}
                      </div>
                    </div>
                  </div>

                  {selectedSuspect?.id === suspect.id && (
                    <motion.div
                      layoutId="selected"
                      className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSuspect ? (
            <>
              {/* Suspect Info Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/80 border-b border-slate-700 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={selectedSuspect.image}
                      alt={selectedSuspect.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-mono font-bold text-lg">
                      {selectedSuspect.name}
                    </h3>
                    <div className="text-gray-400 font-mono text-sm">
                      {selectedSuspect.role}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 font-mono text-xs">ALIBI</div>
                    <div className="text-white font-mono text-sm">
                      {selectedSuspect.alibi}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'detective' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${message.sender === 'detective' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-end gap-2 ${message.sender === 'detective' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`p-4 rounded-lg ${message.sender === 'detective'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-white'
                            }`}>
                            <p className="font-mono text-sm">{message.text}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs font-mono text-gray-500 ${message.sender === 'detective' ? 'justify-end' : 'justify-start'
                          }`}>
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex gap-2">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="bg-slate-900/50 border-t border-slate-700 p-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {questionBank.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs rounded-lg whitespace-nowrap transition-colors border border-slate-600"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="bg-slate-900/80 border-t border-slate-700 p-4 backdrop-blur-sm">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-mono font-bold"
                  >
                    <Send className="w-5 h-5" />
                    SEND
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-mono font-bold text-xl mb-2">
                  SELECT A SUSPECT
                </h3>
                <p className="text-gray-400 font-mono text-sm">
                  Choose a suspect from the list to begin interrogation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
