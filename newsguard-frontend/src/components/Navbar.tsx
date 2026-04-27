'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-violet-600 rounded-xl group-hover:bg-violet-500 transition-all duration-300 shadow-lg shadow-violet-500/20 group-hover:scale-105 group-active:scale-95">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                NewsGuard <span className="text-violet-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              How it Works
            </Link>
            <div className="flex items-center gap-6 border-l border-zinc-200 dark:border-zinc-800 ml-4 pl-8">
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/20 active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-violet-600 transition-colors">
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/20 active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-6 space-y-4 shadow-2xl"
        >
          <Link href="/#features" className="block text-base font-semibold text-zinc-600 dark:text-zinc-400">
            Features
          </Link>
          <Link href="/#how-it-works" className="block text-base font-semibold text-zinc-600 dark:text-zinc-400">
            How it Works
          </Link>
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-zinc-600 dark:text-zinc-400"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center justify-center px-4 py-3 text-base font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
