'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Quote as QuoteIcon,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/utils/auth';
import { cn } from '@/utils/cn';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

interface VerificationResult {
  id: number;
  score: number;
  text: string;
  category?: string;
  related_articles: Array<{
    title: string;
    url: string;
    source: string;
    snippet?: string;
    favicon?: string;
  }>;
  result: {
    authenticity_score: number;
    verdict_summary?: string;
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
  bias: {
    overall_bias_score: number;
    bias_direction: string;
    bias_types: string[];
    loaded_language: string[];
    missing_perspectives: string[];
    recommendation: string;
  };
}

export default function ScanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!params.id) return;
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/analysis/${params.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResult(response.data);
      } catch (err: any) {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.detail || 'Failed to load analysis result.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [params.id]);

  const saveToLibrary = async () => {
    if (!result || isSaved) return;
    
    setSaving(true);
    try {
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/saved/`,
        {
          article_title: result.text.slice(0, 50) + (result.text.length > 50 ? '...' : ''),
          article_content: result.text,
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-zinc-500 font-black animate-pulse uppercase tracking-widest">Reconstructing Report...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <div className="p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-rose-900 dark:text-rose-100">Access Denied</h3>
            <p className="text-rose-600/70 dark:text-rose-400/70 font-medium">{error || "The report you're looking for doesn't exist or you don't have permission to view it."}</p>
          </div>
          <Link 
            href="/dashboard/scans"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/scans"
          className="group flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors font-bold"
        >
          <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to History
        </Link>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl text-xs font-black text-zinc-500 uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Archive ID: #{result.id}
        </div>
      </div>

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
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-4 font-heading ${getScoreColor(result.result.authenticity_score)}`}>
                  <span className="text-4xl font-black">{result.result.authenticity_score}%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-black text-zinc-900 dark:text-white mb-2">Authenticity Score</h3>
                  <div className="flex items-center gap-2">
                    {result.result.authenticity_score >= 80 ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Highly Credible
                      </div>
                    ) : result.result.authenticity_score >= 50 ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <ShieldAlert className="w-3.5 h-3.5" />
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

            {result.result.verdict_summary && (
              <div className="mb-12 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-heading font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Executive Verdict
                </h4>
                <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed font-heading">
                  {result.result.verdict_summary}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-heading font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Key Findings
                  </h4>
                  <div className="space-y-4">
                    {(result.result.key_findings || []).map((finding, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-indigo-500/30 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 font-bold leading-relaxed">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-heading font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
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
                  <h4 className="text-sm font-heading font-black text-zinc-400 uppercase tracking-widest mb-6">Score Breakdown</h4>
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

                {/* Bias Analysis Section */}
                <div className="p-8 bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-heading font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Bias Analysis
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-600">Bias Score</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-black",
                        result.bias.overall_bias_score < 30 ? "bg-emerald-100 text-emerald-700" : 
                        result.bias.overall_bias_score < 70 ? "bg-amber-100 text-amber-700" : 
                        "bg-rose-100 text-rose-700"
                      )}>
                        {result.bias.overall_bias_score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-600">Direction</span>
                      <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                        {result.bias.bias_direction}
                      </span>
                    </div>
                    {result.bias.bias_types?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {result.bias.bias_types.map((type, i) => (
                          <span key={i} className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-zinc-500 font-medium italic">
                      "{result.bias.recommendation}"
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                    <Zap className="w-24 h-24" />
                  </div>
                  <h4 className="text-xl font-heading font-black mb-2">Neural Insight</h4>
                  <p className="text-indigo-100 font-bold leading-relaxed mb-6 font-heading">
                    Our model detected {(result.result.differences || []).length > 0 ? result.result.differences.length : 'no'} significant discrepancies in this report compared to verified historical data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="space-y-6">
          <h4 className="text-xl font-heading font-black text-zinc-900 dark:text-white px-4">Verification Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(result.related_articles || []).map((article, i) => (
              <motion.a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-indigo-600 transition-colors">
                      {article.source}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h5 className="text-lg font-black text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
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

        {/* Integrated Chat Section */}
        <div className="pt-12 border-t border-slate-100 dark:border-zinc-900">
          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <MessageSquare className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-3xl font-black mb-4 tracking-tight">Interactive Audit Chat</h3>
              <p className="text-indigo-100 font-bold text-lg mb-8 leading-relaxed">
                Need more details on this specific report? Start a contextual chat session with our Neural Assistant to dive deeper into the bias patterns and source metadata.
              </p>
              <button 
                onClick={() => {
                  const assistantBtn = document.querySelector('button[aria-label="Toggle AIAssistant"]') as HTMLButtonElement;
                  if (assistantBtn) assistantBtn.click();
                  else {
                    // Fallback to finding the floating button by class if needed
                    const floatingBtn = document.querySelector('.fixed.bottom-10.right-10') as HTMLButtonElement;
                    if (floatingBtn) floatingBtn.click();
                  }
                }}
                className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-2xl shadow-indigo-950/20 hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm"
              >
                <MessageSquare className="w-5 h-5" />
                Initialize Neural Chat
              </button>
            </div>
          </div>
        </div>

        {/* AIAssistant for specific analysis */}
        <div className="mt-12">
          <AIAssistant 
            analysisId={result.id} 
            context={`
              Analysis Summary:
              - Score: ${result.result.authenticity_score}%
              - Verdict: ${result.result.verdict_summary}
              - Key Findings: ${result.result.key_findings.join(', ')}
              - Bias: ${result.bias.overall_bias_score}% (${result.bias.bias_direction})
              - Content Analyzed: ${result.text.slice(0, 1000)}
            `}
            initialMessage={`I've retrieved this archived analysis (Score: ${result.result.authenticity_score}%). How can I help you dive deeper into these findings?`}
          />
        </div>
      </motion.div>
    </div>
  );
}
