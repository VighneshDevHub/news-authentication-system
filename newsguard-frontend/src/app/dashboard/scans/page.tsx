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
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/dashboard/history`,
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
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Verification History</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Review and manage your previous news analysis scans</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search scans..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        <select 
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl py-2 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-xl">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Min Score</span>
          <input 
            type="range"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
            className="w-24 accent-indigo-600"
          />
          <span className="text-sm font-black text-indigo-600 min-w-[2ch]">{filters.minScore}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading && history.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="font-black animate-pulse">Retrieving your records...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                  <th className="px-8 py-5">Scan Date</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Trust Score</th>
                  <th className="px-8 py-5">Content Sample</th>
                  <th className="px-8 py-5">Verdict</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredHistory.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                          <Calendar className="w-4 h-4" />
                        </div>
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 uppercase tracking-wider">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${getScoreColor(item.score)}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {item.score}%
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {item.text}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-bold ${
                        item.verdict === 'Highly Credible' ? 'text-emerald-600' : 
                        item.verdict === 'Likely Misinformation' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/dashboard/scans/${item.id}`}
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all inline-block"
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
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <Search className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-black text-zinc-900 dark:text-white">No scans found</p>
              <p className="text-sm font-medium">Try adjusting your filters or verify some news first.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
