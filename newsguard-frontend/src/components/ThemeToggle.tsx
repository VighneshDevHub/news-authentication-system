'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder with the same dimensions to avoid layout shift
  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-zinc-800 transition-all active:scale-90 group relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 180 : 0,
          scale: [1, 0.8, 1.1, 1]
        }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 fill-current" />
        ) : (
          <Sun className="w-5 h-5 fill-current" />
        )}
      </motion.div>
    </button>
  );
}
