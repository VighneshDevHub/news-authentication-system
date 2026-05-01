'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon,
  Zap,
  Globe,
  Shield,
  Clock,
  ArrowUpRight,
  Target,
  Rocket,
  Sparkles,
  Bot,
  Fingerprint
} from 'lucide-react';
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
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

interface AnalyticsData {
  name: string;
  value: number;
}

interface Stats {
  by_score: AnalyticsData[];
  by_category: AnalyticsData[];
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'trends' | 'scope'>('trends');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/dashboard/stats?days=30`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const scoreData = stats?.by_score || [
    { name: '80-100%', value: 0 },
    { name: '60-80%', value: 0 },
    { name: '40-60%', value: 0 },
    { name: '20-40%', value: 0 },
    { name: '0-20%', value: 0 },
  ];

  const categoryData = stats?.by_category || [
    { name: 'General', value: 0 }
  ];

  const futureScope = [
    {
      title: "Real-time Social Monitoring",
      desc: "Live ingestion of social media feeds to detect viral misinformation trends as they emerge.",
      icon: Activity,
      status: "Q3 2026"
    },
    {
      title: "Deepfake Video Audit",
      desc: "Neural analysis of video frames to identify synthetic manipulations and frame-by-frame inconsistencies.",
      icon: Bot,
      status: "Q4 2026"
    },
    {
      title: "Collaborative Fact-Checking",
      desc: "Shared workspaces for newsrooms to collaboratively audit complex global reports in real-time.",
      icon: Globe,
      status: "Q1 2027"
    },
    {
      title: "NewsGuard Neural API 4.0",
      desc: "Advanced API endpoints for enterprise-grade automated content filtering and automated policy enforcement.",
      icon: Zap,
      status: "Q2 2027"
    }
  ];

  return (
    <div className="space-y-12 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4">Strategic Insights</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Neural <span className="text-gradient">Analytics</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold mt-4">Deep dive into verification trends and future system roadmap.</p>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('trends')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'trends' 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm" 
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
            )}
          >
            Usage Trends
          </button>
          <button 
            onClick={() => setActiveTab('scope')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'scope' 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm" 
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
            )}
          >
            Future Scope
          </button>
        </div>
      </div>

      {activeTab === 'trends' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[3rem] shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-500" />
              Score Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 900 }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {scoreData.map((entry: AnalyticsData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[3rem] shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              Category Breakdown
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: AnalyticsData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((item: AnalyticsData, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-10 bg-indigo-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Zap className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 tracking-tight">System Performance</h3>
              <p className="text-indigo-100 font-bold max-w-md">Our global infrastructure ensures sub-second latency for all neural verification requests worldwide.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 relative z-10">
              {[
                { label: 'Uptime', value: '99.99%' },
                { label: 'Latency', value: '184ms' },
                { label: 'Throughput', value: '12k/min' },
                { label: 'Nodes', value: '42' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {futureScope.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[3rem] shadow-sm group hover:border-indigo-500/30 transition-all card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <span className="px-4 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-200 dark:border-zinc-800">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Explore Research
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}

          {/* Vision Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-12 glass-morphism border-gradient rounded-[4rem] text-center"
          >
            <div className="max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-indigo-600/30">
                <Rocket className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Our Long-term Vision</h3>
              <p className="text-xl text-slate-600 dark:text-zinc-400 font-bold leading-relaxed mb-10">
                Building a decentralized truth layer for the internet. By 2028, NewsGuard aims to be the standard protocol for real-time information authentication across all digital surfaces.
              </p>
              <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-slate-100 dark:border-zinc-900">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Next-Gen AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Content Provenance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Zero Bias Core</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
