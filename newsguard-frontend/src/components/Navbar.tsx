'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800/50 py-3 shadow-sm' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">
              NewsGuard AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[13px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
              <Link href="/#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Demo</Link>
              <Link href="/#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
            </div>
            
            <div className="flex items-center gap-6 border-l border-slate-200 dark:border-zinc-800/50 pl-8">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signin" className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:text-indigo-600 transition-colors">
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    Start for Free
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 py-6 px-4 space-y-4 shadow-xl">
          <div className="flex flex-col gap-4 text-center">
            <Link href="/#demo" className="text-lg font-semibold text-slate-600 dark:text-slate-400" onClick={() => setIsOpen(false)}>Demo</Link>
            <Link href="/#pricing" className="text-lg font-semibold text-slate-600 dark:text-slate-400" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link href="/about" className="text-lg font-semibold text-slate-600 dark:text-slate-400" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/contact" className="text-lg font-semibold text-slate-600 dark:text-slate-400" onClick={() => setIsOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signin" className="w-full py-4 text-slate-600 dark:text-slate-400 font-bold" onClick={() => setIsOpen(false)}>Log In</Link>
                <Link 
                  href="/signup" 
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
