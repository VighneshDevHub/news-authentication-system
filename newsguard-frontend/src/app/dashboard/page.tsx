'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
  FileText,
  MousePointer2,
  Bookmark
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import Link from 'next/link';

interface DashboardStats {
  verifications_count: number;
  average_score: number;
  saved_articles_count: number;
  search_queries_count: number;
  by_score: Array<{ name: string; count: number }>;
  by_category: Array<{ name: string; value: number }>;
  activity_data: Array<{ date: string; scans: number }>;
}

interface HistoryItem {
  id: number;
  text: string;
  score: number;
  date: string;
  verdict: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const [statsRes, historyRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/dashboard/stats?days=${days}`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/dashboard/history`, config)
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
  }, [user, days]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
    if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-4 h-4" />;
    if (score >= 50) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-zinc-800 rounded-2xl" />
        ))}
        <div className="lg:col-span-3 h-96 bg-slate-100 dark:bg-zinc-800 rounded-2xl" />
        <div className="h-96 bg-slate-100 dark:bg-zinc-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Dashboard</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Welcome back, {user?.username}. Here's what's happening today.</p>
        </div>
        <Link 
          href="/dashboard/verify"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-heading font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Search className="w-5 h-5" />
          New Verification
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', value: stats?.verifications_count || 0, icon: Search, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Avg. Accuracy', value: `${stats?.average_score || 0}%`, icon: Activity, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Saved Articles', value: stats?.saved_articles_count || 0, icon: Bookmark, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Search Queries', value: stats?.search_queries_count || 0, icon: FileText, color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center gap-5 group hover:border-indigo-500/30 transition-all"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-heading font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Verification Activity
            </h3>
            <select 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-xs font-heading font-bold px-3 py-2 outline-none cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            {stats?.activity_data && stats.activity_data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activity_data}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No activity data yet</p>
                <p className="text-sm">Start verifying news to see your stats</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Score Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem]"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Trust Distribution</h3>
          <div className="h-[250px] w-full">
            {stats?.by_score && stats.by_score.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.by_score}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="count"
                    nameKey="name"
                  >
                    {stats.by_score.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Credible' ? '#10b981' : entry.name === 'Needs Review' ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
                <PieChart className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No data</p>
              </div>
            )}
          </div>
          <div className="space-y-3 mt-6">
            {['Credible', 'Needs Review', 'Misinformation'].map((label, i) => {
              const data = stats?.by_score?.find(d => d.name === label);
              const colors = ['bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[i]}`} />
                    <span className="text-sm font-bold text-slate-600 dark:text-zinc-400">{label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{data?.count || 0}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem]"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Recent Verifications
          </h3>
          <Link href="/dashboard/scans" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
            View All History
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100 dark:border-zinc-800">
                  <th className="pb-4 font-bold text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-wider">Article Title</th>
                  <th className="pb-4 font-bold text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-wider">Score</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4">
                      <div className="max-w-md">
                        <p className="font-bold text-slate-900 dark:text-white truncate mb-1">{item.text}</p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 truncate">{item.verdict}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border ${getScoreColor(item.score)}`}>
                        {getScoreIcon(item.score)}
                        {item.score >= 80 ? 'Credible' : item.score >= 50 ? 'Review' : 'Warning'}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{item.score}%</span>
                    </td>
                    <td className="py-4 text-right">
                      <Link 
                        href={`/dashboard/scans/${item.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No verifications yet</h4>
            <p className="text-slate-500 dark:text-zinc-400 max-w-xs mb-8">Run your first AI analysis to start building your credibility report.</p>
            <Link 
              href="/dashboard/verify"
              className="px-8 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <MousePointer2 className="w-4 h-4" />
              Analyze News Now
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
