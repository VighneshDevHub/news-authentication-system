'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-24 lg:pt-32">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-50 dark:bg-zinc-900 p-8 lg:p-12 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          
          {/* Left Side: Info */}
          <div className="hidden lg:block space-y-8 p-6">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Join the elite circle of <span className="text-indigo-600">informed readers</span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Create an account to unlock advanced verification features and maintain your analysis history.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Unlimited AI verification scans",
                "Detailed source cross-referencing",
                "Analysis history & bookmarks",
                "Advanced bias detection reports",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Shield className="w-20 h-20 text-indigo-600" />
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-300 italic relative z-10 font-medium">
                "NewsGuard has completely changed how I consume information online. It's like having a team of fact-checkers in my pocket."
              </p>
              <div className="mt-6 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 border-2 border-white dark:border-zinc-700 shadow-md" />
                <div>
                  <p className="text-base font-black text-zinc-900 dark:text-white">Sarah Jenkins</p>
                  <p className="text-sm font-bold text-zinc-500">Journalist @ TechDaily</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white dark:bg-zinc-800 p-8 lg:p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-700 shadow-xl">
            <div className="text-center lg:text-left space-y-2 mb-8">
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Create Account</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">Start your AI-powered journey today.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white font-medium"
                      placeholder="yourusername"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white font-medium"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold">
                Already have an account?{' '}
                <Link href="/signin" className="font-black text-indigo-600 hover:text-indigo-700 transition-colors">
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
