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

interface HistoryItem {
  id: number;
  date: string;
  score: number;
  text: string;
  verdict: string;
}

export default function RecentScansPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/dashboard/history`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setHistory(response.data.verification_history || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
            <p className="font-black animate-pulse">Retrieving your records...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                  <th className="px-8 py-5">Scan Date</th>
                  <th className="px-8 py-5">Trust Score</th>
                  <th className="px-8 py-5">Content Sample</th>
                  <th className="px-8 py-5">Verdict</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {history.map((item, idx) => (
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
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${getScoreColor(item.score)}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {item.score}%
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 max-w-xs group-hover:text-violet-600 transition-colors">
                        {item.text}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">{item.verdict}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-zinc-400 hover:text-violet-600 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">No scans found</h3>
            <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-8">
              You haven't verified any news yet. Start your first analysis to see it here.
            </p>
            <button className="px-8 py-4 bg-violet-600 text-white font-black rounded-2xl shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition-all">
              Start New Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
