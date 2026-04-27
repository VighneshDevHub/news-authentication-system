'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bookmark, 
  Clock, 
  ChevronRight,
  Loader2,
  TrendingUp,
  FileText,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { motion } from 'framer-motion';

interface DashboardStats {
  verifications_count: number;
  saved_articles_count: number;
  search_queries_count: number;
}

interface HistoryItem {
  id: number;
  date: string;
  score: number;
  text: string;
  verdict: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const [statsRes, historyRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/dashboard/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setStats(statsRes.data);
        setHistory(historyRes.data.verification_history || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10';
    return 'text-rose-500 bg-rose-500/10';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
        <div className="flex flex-col items-center">
          <p className="text-zinc-900 dark:text-white font-black">Initializing Dashboard</p>
          <p className="text-zinc-500 text-sm font-medium">Securing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold">Welcome back! Here's what's happening with your verification metrics.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-2.5 bg-violet-600 rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Efficiency</p>
            <p className="text-sm font-black text-zinc-900 dark:text-white">+12.5% this week</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Scans', value: stats?.verifications_count || 0, icon: Search, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/10', trend: '+5.2%', up: true },
          { label: 'Saved Articles', value: stats?.saved_articles_count || 0, icon: Bookmark, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/10', trend: '+12%', up: true },
          { label: 'Avg Accuracy', value: '94.2%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10', trend: '-0.4%', up: false },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:shadow-xl hover:shadow-violet-500/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${stat.bg} rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${stat.up ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart (Simplified SVG) */}
        <div className="lg:col-span-2 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">Verification Activity</h3>
              <p className="text-sm text-zinc-500 font-bold">Volume of scans over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                <div className="w-2 h-2 rounded-full bg-violet-600" />
                <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Scans</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 w-full flex items-end justify-between gap-2 pt-4">
            {[45, 62, 55, 80, 70, 95, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-violet-600/10 dark:bg-violet-600/20 rounded-t-xl group-hover:bg-violet-600/30 transition-all relative overflow-hidden"
                  >
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="absolute bottom-0 left-0 w-full bg-violet-600 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {height} Scans
                  </div>
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">Recent Scans</h3>
            <button className="text-xs font-black text-violet-600 hover:text-violet-500 uppercase tracking-widest transition-colors">View All</button>
          </div>

          <div className="space-y-6">
            {history.length > 0 ? (
              history.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
                      {item.text}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                      {new Date(item.date).toLocaleDateString()} • {item.verdict}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-violet-600 transition-colors" />
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-zinc-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-zinc-900 dark:text-white">No scans yet</p>
                  <p className="text-xs font-bold text-zinc-500">Your recent verification activity will appear here.</p>
                </div>
                <button className="px-6 py-2.5 bg-violet-600 text-white text-xs font-black rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
                  Start First Scan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
