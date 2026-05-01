'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/signup`,
        formData
      );
      router.push('/signin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-12 hero-gradient">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center glass-morphism p-1 rounded-[4rem] border-gradient shadow-2xl">
          
          <div className="bg-white dark:bg-zinc-950 p-10 lg:p-16 rounded-[3.8rem] h-full flex flex-col justify-center">
            {/* Left Side: Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Neural Intelligence
                </div>
                <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.95] text-balance">
                  Join the elite circle of <span className="text-gradient">informed.</span>
                </h2>
                <p className="text-lg text-slate-500 dark:text-zinc-500 leading-relaxed font-bold max-w-md">
                  Create an account to unlock advanced verification features and maintain your analysis history.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Unlimited AI verification scans",
                  "Detailed source cross-referencing",
                  "Analysis history & bookmarks",
                  "Advanced bias detection reports",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-700 dark:text-zinc-300">
                    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-[11px] uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800/50 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Shield className="w-24 h-24 text-indigo-600" />
                </div>
                <p className="text-lg text-slate-600 dark:text-zinc-400 italic relative z-10 font-bold leading-relaxed">
                  "NewsGuard has completely changed how I consume information online. It's like having a team of fact-checkers in my pocket."
                </p>
                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 border-2 border-white dark:border-zinc-700 shadow-xl" />
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-white">Sarah Jenkins</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journalist @ TechDaily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 lg:p-16 space-y-10">
            <div className="text-center lg:text-left space-y-3">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Create Account</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-500 font-black uppercase tracking-[0.2em]">Start your AI journey today</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-black uppercase tracking-widest"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="block w-full pl-12 pr-6 py-4.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white font-bold"
                      placeholder="yourusername"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-12 pr-6 py-4.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white font-bold"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pl-12 pr-6 py-4.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-[11px] uppercase tracking-[0.2em]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-indigo-600 hover:text-indigo-700 transition-colors ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
