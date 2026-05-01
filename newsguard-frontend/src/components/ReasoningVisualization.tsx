'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Zap,
  CheckCircle2,
  Database,
  Fingerprint
} from 'lucide-react';

const reasoningSteps = [
  {
    icon: <Search className="w-5 h-5" />,
    text: "Scraping content from source...",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: <Globe className="w-5 h-5" />,
    text: "Extracting search queries...",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  },
  {
    icon: <Database className="w-5 h-5" />,
    text: "Searching global sources...",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: <Fingerprint className="w-5 h-5" />,
    text: "Cross-checking claims...",
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10"
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    text: "Analyzing content integrity...",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    text: "Calculating authenticity...",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Detecting linguistic bias...",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    text: "Finalizing verification...",
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10"
  }
];

interface ReasoningVisualizationProps {
  currentStep?: number;
  isStreaming?: boolean;
}

export default function ReasoningVisualization({ currentStep: externalStep, isStreaming = false }: ReasoningVisualizationProps) {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    if (isStreaming) return;
    
    const interval = setInterval(() => {
      setInternalStep((prev) => (prev + 1) % reasoningSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const currentStep = externalStep !== undefined ? externalStep : internalStep;
  const displayStep = Math.min(currentStep, reasoningSteps.length - 1);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="relative">
        {/* Animated Background Rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -m-8 rounded-full bg-indigo-500/10 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -m-12 rounded-full bg-fuchsia-500/10 blur-3xl"
        />

        {/* Central Icon */}
        <div className="relative bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayStep}
              initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
              className={`p-4 rounded-2xl ${reasoningSteps[displayStep].bgColor} ${reasoningSteps[displayStep].color}`}
            >
              {reasoningSteps[displayStep].icon}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {reasoningSteps[displayStep].text}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2">
              Step {displayStep + 1} of {reasoningSteps.length}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {reasoningSteps.map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i === displayStep ? 1.2 : 1,
                backgroundColor: i === displayStep ? '#4f46e5' : i < displayStep ? '#10b981' : '#e2e8f0',
                width: i === displayStep ? '24px' : '8px'
              }}
              className="h-2 rounded-full transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Checklist of completed steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full px-6">
        {reasoningSteps.map((step, i) => (
          <div 
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
              i === displayStep 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm' 
                : i < displayStep 
                  ? 'bg-slate-50 dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 opacity-60'
                  : 'bg-transparent border-transparent opacity-20'
            }`}
          >
            <div className={`shrink-0 ${i <= displayStep ? step.color : 'text-slate-300'}`}>
              {i < displayStep ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : step.icon}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-wider ${
              i === displayStep ? 'text-slate-900 dark:text-white' : 'text-slate-500'
            }`}>
              {step.text.split('...')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
