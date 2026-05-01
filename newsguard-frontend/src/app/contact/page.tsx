'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Send,
  Globe,
  Cpu,
  Shield,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-indigo-500/30 font-sans">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            {/* Left Column: Info */}
            <div className="space-y-12">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-morphism border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8"
                >
                  <MessageSquare className="w-3 h-3 fill-current" />
                  Get in touch
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-none"
                >
                  Let's talk <br />
                  <span className="text-gradient">Intelligence.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-slate-500 dark:text-zinc-400 font-medium max-w-md leading-relaxed"
                >
                  Have questions about our neural models or enterprise solutions? Our team of AI safety experts is here to help.
                </motion.p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "intelligence@newsguard-ai.com" },
                  { icon: Phone, label: "Phone", value: "+1 (888) NEWS-AI-0" },
                  { icon: MapPin, label: "Location", value: "Neural Valley, San Francisco, CA" }
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 flex gap-6">
                {[Globe, Cpu, Shield].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="w-12 h-12 rounded-full glass-morphism border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-morphism p-10 lg:p-16 rounded-[3.5rem] border border-slate-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-4">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl outline-none focus:border-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-4">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl outline-none focus:border-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-4">Subject</label>
                      <input 
                        type="text" 
                        required
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        placeholder="Inquiry about Pro Plan"
                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl outline-none focus:border-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-4">Message</label>
                      <textarea 
                        required
                        rows={6}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us how we can help..."
                        className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl outline-none focus:border-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-4 active:scale-95 group text-lg"
                    >
                      Send Transmission
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Transmission Received</h3>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-xs">
                      Our neural relay has processed your message. An intelligence officer will respond within 24 hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-12 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
