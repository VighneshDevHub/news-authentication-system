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
  BarChart3,
  Shield,
  Zap,
  Info
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
  ResponsiveContainer
} from 'recharts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  reportData?: any;
}

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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/chat`,
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
      {/* Premium Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 p-5 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 rounded-[2rem] shadow-2xl z-50 flex items-center gap-4 border border-white/10 dark:border-zinc-200 transition-all active:scale-95 group"
        >
          <div className="relative">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-slate-900 dark:border-white"></span>
            </span>
          </div>
          <span className="font-black text-xs uppercase tracking-[0.2em]">Neural Support</span>
        </motion.button>
      )}

      {/* Modern SaaS Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              filter: 'blur(0px)',
              width: isMaximized ? 'calc(100vw - 80px)' : '440px',
              height: isMaximized ? 'calc(100vh - 80px)' : '720px',
              maxWidth: isMaximized ? '1400px' : '440px',
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            className="fixed bottom-10 right-10 glass-morphism p-1 rounded-[3rem] border-gradient shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          >
            <div className="bg-white dark:bg-zinc-950 rounded-[2.8rem] flex flex-col h-full overflow-hidden">
              {/* Elegant Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 animate-glow">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                      NewsGuard AI
                      <span className="px-2 py-0.5 bg-indigo-600 text-[9px] text-white font-black rounded-md uppercase tracking-widest shadow-sm">Pro</span>
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Neural Core Online
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl transition-all"
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={clearHistory}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl transition-all"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-5 bg-slate-200 dark:bg-zinc-900 mx-2"></div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950/50"
            >
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                        <Sparkles className="w-10 h-10 text-indigo-600" />
                      </div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-md border border-zinc-100 dark:border-zinc-800"
                      >
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Intelligent Analysis Chat</h4>
                      <p className="text-sm text-zinc-500 font-medium max-w-[240px] leading-relaxed">
                        I have full context of this report. Ask me about bias patterns, source reliability, or specific claims.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
                      {['Analyze bias', 'Fact-check sources', 'Summarize key points'].map((hint) => (
                        <button 
                          key={hint}
                          onClick={() => setInput(hint)}
                          className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-wider text-zinc-600 hover:border-indigo-500 transition-colors"
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  messages.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                          m.role === 'assistant' 
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>

                        {/* Bubble */}
                        <div className={`relative p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                          m.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-800'
                        }`}>
                          <div className="whitespace-pre-wrap">{m.content}</div>
                          
                          {/* Rich Report Data in Chat */}
                          {m.reportData && (
                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Analytical Insight</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                  <div className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">Reliability</div>
                                  <div className="text-lg font-black text-zinc-900 dark:text-white">{m.reportData.credibility_score}%</div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                  <div className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">Bias Risk</div>
                                  <div className="text-lg font-black text-fuchsia-600">{m.reportData.bias_score}%</div>
                                </div>
                              </div>

                              {m.reportData.source_reliability && (
                                <div className="h-32 w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl p-2 border border-zinc-100 dark:border-zinc-800">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={m.reportData.source_reliability}>
                                      <Tooltip 
                                        contentStyle={{ 
                                          backgroundColor: '#000', 
                                          border: 'none', 
                                          borderRadius: '8px',
                                          color: '#fff',
                                          fontSize: '9px',
                                          fontWeight: 'bold'
                                        }} 
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                      />
                                      <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 4, 4]} barSize={20} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Thinking</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Input */}
            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question about this report..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-5 pr-14 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <Shield className="w-2.5 h-2.5" />
                Secure Analysis Channel
                <Info className="w-2.5 h-2.5 ml-1 opacity-50 cursor-help" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Global CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
}
