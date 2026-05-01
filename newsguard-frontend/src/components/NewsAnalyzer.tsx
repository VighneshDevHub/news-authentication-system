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
  Quote as QuoteIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/utils/auth';
import { cn } from '@/utils/cn';
import AIAssistant from '@/components/AIAssistant';
import ReasoningVisualization from '@/components/ReasoningVisualization';

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

export default function NewsAnalyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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
    setCurrentStep(0);

    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/analysis/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ text: text })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.step !== undefined) {
              setCurrentStep(data.step);
            }
            if (data.result) {
              setResult(data.result);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to analyze the news. Please check your connection and try again.');
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/saved/`,
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
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    if (score >= 50) return 'text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return 'shadow-emerald-500/20';
    if (score >= 50) return 'shadow-amber-500/20';
    return 'shadow-rose-500/20';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-1 rounded-[3rem] border-gradient shadow-2xl"
      >
        <div className="bg-white dark:bg-zinc-950 p-10 rounded-[2.8rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 animate-glow">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Neural Verification</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">AI-Powered Content Audit</p>
            </div>
          </div>

          <div className="relative group">
            <textarea
              className="w-full h-56 p-8 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-lg leading-relaxed shadow-inner"
              placeholder="Paste the news text or claim you want to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-8 right-8 flex items-center gap-4">
              <button
                onClick={analyzeNews}
                disabled={loading || !text.trim()}
                className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-3 group active:scale-95 text-sm uppercase tracking-widest"
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
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <ReasoningVisualization currentStep={currentStep} isStreaming={true} />
          </motion.div>
        )}

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
            className="space-y-12"
          >
            {/* Main Result Card */}
            <div className="bg-white dark:bg-zinc-950 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-right from-indigo-600 via-fuchsia-500 to-indigo-600"></div>
              
              <div className="p-10 lg:p-16">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
                  <div className="flex items-center gap-8">
                    <div className={cn(
                      "w-32 h-32 rounded-[2.5rem] flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-500",
                      getScoreColor(result.result.authenticity_score),
                      getScoreGlow(result.result.authenticity_score)
                    )}>
                      <span className="text-5xl font-black tracking-tighter">{result.result.authenticity_score}%</span>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Authentic</span>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Authenticity Report</h3>
                      <div className="flex items-center gap-3">
                        {result.result.authenticity_score >= 80 ? (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[11px] font-black uppercase tracking-widest border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4" />
                            Highly Credible
                          </div>
                        ) : result.result.authenticity_score >= 50 ? (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-[11px] font-black uppercase tracking-widest border border-amber-500/20">
                            <ShieldAlert className="w-4 h-4" />
                            Needs Verification
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-500 rounded-full text-[11px] font-black uppercase tracking-widest border border-rose-500/20">
                            <ShieldAlert className="w-4 h-4" />
                            Likely Misinformation
                          </div>
                        )}
                        <div className="px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-full text-[11px] font-black uppercase tracking-widest">
                          Scan ID: #{result.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={saveToLibrary}
                      disabled={isSaved || saving}
                      className={cn(
                        "flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 text-[11px] uppercase tracking-widest shadow-lg",
                        isSaved 
                          ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                          : "bg-slate-900 dark:bg-zinc-800 text-white hover:bg-indigo-600 shadow-indigo-600/10"
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
                    <button className="p-4 bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm border border-slate-200 dark:border-zinc-800">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {result.result.verdict_summary && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16 p-10 bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800/50 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-32 h-32 text-indigo-600" />
                    </div>
                    <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Executive Verdict
                    </h4>
                    <p className="text-2xl font-black text-slate-800 dark:text-white leading-[1.4] tracking-tight text-balance">
                      {result.result.verdict_summary}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                        Key Findings
                      </h4>
                      <div className="space-y-4">
                        {(result.result.key_findings || []).map((finding, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-5 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 group hover:border-indigo-500/30 transition-all card-hover-effect"
                          >
                            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-[12px] font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                              {i + 1}
                            </div>
                            <p className="text-slate-700 dark:text-zinc-300 font-bold leading-relaxed">{finding}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-600" />
                        Supporting Evidence
                      </h4>
                      <div className="space-y-6">
                        {(result.result.supporting_evidence || []).map((evidence, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-8 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-l-8 border-fuchsia-600 shadow-sm"
                          >
                            <p className="text-slate-600 dark:text-zinc-400 italic font-bold text-lg mb-6 leading-relaxed">"{evidence.quote}"</p>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center shadow-sm">
                                <ExternalLink className="w-4 h-4 text-fuchsia-600" />
                              </div>
                              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{evidence.source}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="p-10 bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800/50 shadow-inner">
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-10">Neural Breakdown</h4>
                      <div className="space-y-8">
                        {[
                          { label: 'Factual Accuracy', score: result.result.score_breakdown.factual_accuracy },
                          { label: 'Source Consistency', score: result.result.score_breakdown.source_consistency },
                          { label: 'Detail Accuracy', score: result.result.score_breakdown.detail_accuracy },
                          { label: 'Context Integrity', score: result.result.score_breakdown.context_accuracy },
                        ].map((item, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                              <span className="text-slate-500">{item.label}</span>
                              <span className="text-slate-900 dark:text-white">{item.score}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={cn(
                                  "h-full rounded-full shadow-lg",
                                  item.score >= 80 ? "bg-emerald-500" : item.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bias Analysis Section */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-10 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl"
                    >
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Bias Analysis
                      </h4>
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Overall Bias</span>
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                            result.bias.overall_bias_score < 30 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                            result.bias.overall_bias_score < 70 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                            "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}>
                            {result.bias.overall_bias_score}% Bias Detect
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Political Lean</span>
                          <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-xl">
                            {result.bias.bias_direction}
                          </span>
                        </div>
                        {result.bias.bias_types?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {result.bias.bias_types.map((type, i) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 rounded-xl text-[9px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest border border-slate-100 dark:border-zinc-800 shadow-sm">
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="pt-6 border-t border-slate-100 dark:border-zinc-900">
                          <p className="text-sm text-slate-500 dark:text-zinc-400 font-bold italic leading-relaxed">
                            "{result.bias.recommendation}"
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="p-10 bg-indigo-600 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/30"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <Zap className="w-32 h-32" />
                      </div>
                      <h4 className="text-2xl font-black mb-4 tracking-tight">Neural Insight</h4>
                      <p className="text-indigo-100 font-bold leading-relaxed mb-8 text-lg opacity-90">
                        Our model detected {(result.result.differences || []).length > 0 ? result.result.differences.length : 'no'} significant discrepancies in this report compared to verified historical data.
                      </p>
                      {(result.result.differences || []).length > 0 && (
                        <div className="space-y-4">
                          {(result.result.differences || []).map((diff, i) => (
                            <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm shadow-sm">
                              <ChevronRight className="w-5 h-5 text-indigo-300" />
                              {diff}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-10">
              <div className="flex items-center justify-between px-6">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verification Sources</h4>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  {result.related_articles?.length || 0} Sources Cross-Referenced
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(result.related_articles || []).map((article, i) => (
                  <motion.a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="p-8 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 transition-all group flex flex-col justify-between shadow-sm card-hover-effect"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="px-4 py-1.5 bg-slate-50 dark:bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-100 dark:border-zinc-800">
                          {article.source}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                      <h5 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors leading-[1.3] tracking-tight">
                        {article.title}
                      </h5>
                      <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold line-clamp-2 leading-relaxed opacity-80">
                        {article.snippet}
                      </p>
                    </div>
                  </motion.a>
                ))}
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
                  - Content Analyzed: ${text.slice(0, 1000)}
                `}
                initialMessage={`I've analyzed this article (Score: ${result.result.authenticity_score}%). Feel free to ask me anything about these findings!`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}