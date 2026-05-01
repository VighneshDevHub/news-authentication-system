'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  ChevronRight, 
  Loader2, 
  Calendar,
  ShieldCheck,
  Search,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { getToken } from '@/utils/auth';
import { cn } from '@/utils/cn';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  date: string;
  score: number;
  text: string;
  verdict: string;
  category?: string;
  relevance?: number;
}

export default function RecentScansPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minScore: 0,
    search: ''
  });

  const categories = ['Politics', 'Technology', 'Health', 'Science', 'Business', 'Entertainment', 'General'];

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const params: any = { limit: 50 };
        if (filters.category) params.category = filters.category;
        if (filters.minScore > 0) params.min_score = filters.minScore;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/dashboard/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params
          }
        );
        setHistory(response.data.verification_history || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    const debounceTimer = setTimeout(fetchHistory, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters.category, filters.minScore]);

  const filteredHistory = history.filter(item => 
    item.text.toLowerCase().includes(filters.search.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-12 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4">Historical Data</p>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Neural <span className="text-gradient">History</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold mt-4">Review and manage your previous news analysis scans.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-6 bg-white dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-slate-200 dark:border-zinc-900 shadow-sm">
        <div className="relative flex-1 min-w-[280px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search neural records..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none"
          />
        </div>
        <select 
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 focus:ring-8 focus:ring-indigo-500/5 transition-all cursor-pointer outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-900 px-6 py-4 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Min Score</span>
          <input 
            type="range"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
            className="w-32 accent-indigo-600"
          />
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 min-w-[3ch]">{filters.minScore}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-[3rem] border border-slate-200 dark:border-zinc-900 shadow-sm overflow-hidden">
        {loading && history.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/30 animate-glow">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <p className="text-[11px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] animate-pulse">Retrieving neural records...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/50">
                  <th className="px-10 py-6">Scan Date</th>
                  <th className="px-10 py-6">Category</th>
                  <th className="px-10 py-6">Trust Score</th>
                  <th className="px-10 py-6">Content Sample</th>
                  <th className="px-10 py-6">Verdict</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                {filteredHistory.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-zinc-400">
                        <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 rounded-xl">
                          <Calendar className="w-4 h-4" />
                        </div>
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-200 dark:border-zinc-800">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest shadow-sm", getScoreColor(item.score))}>
                        <ShieldCheck className="w-4 h-4" />
                        {item.score}%
                      </div>
                    </td>
                    <td className="px-10 py-8 max-w-xs">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-relaxed">
                        {item.text}
                      </p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        item.verdict === 'Highly Credible' ? 'text-emerald-500' : 
                        item.verdict === 'Likely Misinformation' ? 'text-rose-500' : 'text-amber-500'
                      )}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Link 
                        href={`/dashboard/scans/${item.id}`}
                        className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-zinc-900 rounded-xl transition-all inline-block active:scale-90"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full"></div>
            <div className="p-6 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] shadow-inner mb-10 relative z-10">
              <Search className="w-12 h-12 text-slate-300 dark:text-zinc-700" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">No neural records found</h3>
              <p className="text-slate-500 dark:text-zinc-500 font-bold max-w-xs mx-auto leading-relaxed">
                We couldn't find any analysis scans matching your current filters.
              </p>
              <button 
                onClick={() => setFilters({ category: '', minScore: 0, search: '' })}
                className="mt-8 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
