'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden selection:bg-indigo-500/30 font-sans">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Animated Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-fuchsia-500/5 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-12 relative group"
          >
            <ShieldAlert className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-xl group-hover:blur-2xl transition-all -z-10 opacity-0 group-hover:opacity-100"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
              4<span className="text-gradient">0</span>4
            </h1>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-800 dark:text-zinc-100 mb-6 tracking-tight">
              Information Not Found
            </h2>
            <p className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
              The neural pathway to this page seems to have been corrupted or doesn't exist. Let's get you back to the truth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <Home className="w-5 h-5" />
              Back to Safety
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 glass-morphism text-slate-900 dark:text-white font-black rounded-2xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Page
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 pt-12 border-t border-slate-100 dark:border-zinc-900/50"
          >
            <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Scan</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
