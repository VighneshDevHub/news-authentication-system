'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  ExternalLink,
  ChevronRight,
  Info,
  ArrowUpRight,
  Quote as QuoteIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getToken } from '@/utils/auth';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VerificationResult {
  id: number;
  score: number;
  key_points: string[];
  related_articles: Array<{
    title: string;
    url: string;
    source: string;
    snippet?: string;
    favicon?: string;
  }>;
  result: {
    authenticity_score: number;
    key_findings: string[];
    differences: string[];
    supporting_evidence: Array<{
      quote: string;
      source: string;
    }>;
    score_breakdown: {
      factual_accuracy: number;
      source_consistency: number;
      detail_accuracy: number;
      context_accuracy: number;
    };
  };
}

export default function NewsAnalyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const analyzeNews = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/analysis/`, {
        text: text
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze the news. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = async () => {
    if (!result || isSaved) return;
    
    setSaving(true);
    try {
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/saved/`,
        {
          article_title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
          article_content: text,
          article_source: result.related_articles?.[0]?.source || 'AI Analysis',
          article_url: result.related_articles?.[0]?.url || ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsSaved(true);
    } catch (err) {
      console.error('Error saving to library:', err);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-600 rounded-xl">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">New Verification</h2>
            <p className="text-sm text-zinc-500 font-bold">Paste the news text or claim you want to analyze</p>
          </div>
        </div>

        <div className="relative group">
          <textarea
            className="w-full h-48 p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all resize-none font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400"
            placeholder="e.g., A major tech company announced a new breakthrough in quantum computing today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <button
              onClick={analyzeNews}
              disabled={loading || !text.trim()}
              className="px-8 py-3.5 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2 group active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Run Neural Scan
                  <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-bold">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Result Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-10 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-4 ${getScoreColor(result.result.authenticity_score)}`}>
                      <span className="text-4xl font-black">{result.result.authenticity_score}%</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Authenticity Score</h3>
                      <div className="flex items-center gap-2">
                        {result.result.authenticity_score >= 80 ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Highly Credible
                          </div>
                        ) : result.result.authenticity_score >= 50 ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <Info className="w-3.5 h-3.5" />
                            Needs Verification
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Likely Misinformation
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={saveToLibrary}
                      disabled={isSaved || saving}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all active:scale-95",
                        isSaved 
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      )}
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isSaved ? (
                        <>
                          <BookmarkCheck className="w-5 h-5" />
                          Saved to Library
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-5 h-5" />
                          Save for Later
                        </>
                      )}
                    </button>
                    <button className="p-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-600" />
                        Key Findings
                      </h4>
                      <div className="space-y-4">
                        {(result.result.key_findings || []).map((finding, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-violet-500/30 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 font-bold leading-relaxed">{finding}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <QuoteIcon className="w-4 h-4 text-fuchsia-600" />
                        Supporting Evidence
                      </h4>
                      <div className="space-y-4">
                        {(result.result.supporting_evidence || []).map((evidence, i) => (
                          <div key={i} className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border-l-4 border-fuchsia-600">
                            <p className="text-zinc-600 dark:text-zinc-400 italic font-medium mb-4">"{evidence.quote}"</p>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center">
                                <ExternalLink className="w-3 h-3 text-fuchsia-600" />
                              </div>
                              <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">{evidence.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-6">Score Breakdown</h4>
                      <div className="space-y-6">
                        {[
                          { label: 'Factual Accuracy', score: result.result.score_breakdown.factual_accuracy },
                          { label: 'Source Consistency', score: result.result.score_breakdown.source_consistency },
                          { label: 'Detail Accuracy', score: result.result.score_breakdown.detail_accuracy },
                          { label: 'Context Integrity', score: result.result.score_breakdown.context_accuracy },
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm font-black uppercase tracking-wider">
                              <span className="text-zinc-500">{item.label}</span>
                              <span className="text-zinc-900 dark:text-white">{item.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                className={cn(
                                  "h-full rounded-full",
                                  item.score >= 80 ? "bg-emerald-500" : item.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-violet-600 rounded-3xl text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Zap className="w-24 h-24" />
                      </div>
                      <h4 className="text-xl font-black mb-2">Neural Insight</h4>
                      <p className="text-violet-100 font-bold leading-relaxed mb-6">
                        Our model detected {(result.result.differences || []).length > 0 ? result.result.differences.length : 'no'} significant discrepancies in this report compared to verified historical data.
                      </p>
                      {(result.result.differences || []).length > 0 && (
                        <div className="space-y-3">
                          {(result.result.differences || []).map((diff, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-black bg-white/10 p-2 rounded-xl border border-white/20">
                              <ChevronRight className="w-4 h-4" />
                              {diff}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-zinc-900 dark:text-white px-4">Verification Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(result.related_articles || []).map((article, i) => (
                  <motion.a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-500 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-violet-600 transition-colors">
                          {article.source}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-violet-600 transition-colors" />
                      </div>
                      <h5 className="text-lg font-black text-zinc-900 dark:text-white mb-3 group-hover:text-violet-600 transition-colors leading-snug">
                        {article.title}
                      </h5>
                      <p className="text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                        {article.snippet}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
