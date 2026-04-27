'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  X, 
  MessageSquare,
  Sparkles,
  RefreshCcw,
  Maximize2,
  Minimize2,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  reportData?: any;
}

const COLORS = ['#4f46e5', '#d946ef', '#06b6d4', '#10b981'];

interface AIAssistantProps {
  context?: string;
  initialMessage?: string;
  analysisId?: number | null;
}

export default function AIAssistant({ context, initialMessage, analysisId }: AIAssistantProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/chat`,
        {
          message: userMsg,
          analysis_id: analysisId,
          context: context,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.data.response,
        reportData: res.data.report_data
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isMaximized ? 'calc(100vw - 48px)' : '400px',
              height: isMaximized ? 'calc(100vh - 48px)' : '600px',
              maxWidth: isMaximized ? '1200px' : '400px',
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-6 right-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300`}
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white">NewsGuard AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Assistant Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={clearHistory}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Clear history"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-zinc-900 dark:text-white">How can I help you today?</p>
                    <p className="text-sm text-zinc-500 font-medium">Ask about news trends, fact-checking details, or media bias insights.</p>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      m.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      
                      {m.reportData && (
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wider font-black">Analytical Report</span>
                          </div>
                          
                          {m.reportData.source_reliability && (
                            <div className="h-40 w-full bg-white dark:bg-zinc-900/50 rounded-2xl p-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={m.reportData.source_reliability}>
                                  <XAxis dataKey="source" hide />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#18181b', 
                                      border: 'none', 
                                      borderRadius: '12px',
                                      color: '#fff',
                                      fontSize: '10px'
                                    }} 
                                  />
                                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-2xl">
                              <div className="text-[10px] text-zinc-500 uppercase font-black">Credibility</div>
                              <div className="text-lg font-black text-indigo-600">{m.reportData.credibility_score}%</div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-2xl">
                              <div className="text-[10px] text-zinc-500 uppercase font-black">Bias Level</div>
                              <div className="text-lg font-black text-fuchsia-600">{m.reportData.bias_score}%</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-800">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl py-3 pl-4 pr-12 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-600 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-zinc-500 font-bold uppercase tracking-widest">
                Powered by Advanced NewsGuard Logic
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
