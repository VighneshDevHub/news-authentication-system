'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  ExternalLink, 
  Clock, 
  FileText,
  AlertCircle,
  Loader2,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SavedArticle {
  id: number;
  article_url: string;
  article_title: string;
  article_content: string;
  article_source: string;
  image_url: string;
  saved_at: string;
}

export default function LibraryPage() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/saved/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setArticles(response.data);
    } catch (err: any) {
      setError('Failed to load saved articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/saved/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      console.error('Failed to delete article', err);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.article_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.article_source?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4">Saved Content</p>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Neural <span className="text-gradient">Library</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold mt-4">Access your bookmarked analysis and verified articles.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Filter archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all w-full md:w-80 font-bold text-slate-900 dark:text-white shadow-sm"
            />
          </div>
          <button className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
            <Filter className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/30 animate-glow">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-[11px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] animate-pulse">Opening your vaults...</p>
        </div>
      ) : error ? (
        <div className="p-16 bg-rose-500/5 border border-rose-500/10 rounded-[3rem] text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{error}</h3>
          <button 
            onClick={fetchSavedArticles}
            className="px-10 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 text-[11px] uppercase tracking-widest"
          >
            Retry Access
          </button>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:border-indigo-500/30 transition-all duration-500 flex flex-col card-hover-effect"
              >
                <div className="p-10 flex-1 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                      {article.article_source || 'AI Analysis'}
                    </div>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                    {article.article_title}
                  </h3>
                  
                  <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 line-clamp-4 leading-relaxed opacity-80">
                    {article.article_content}
                  </p>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    {new Date(article.saved_at).toLocaleDateString()}
                  </div>
                  {article.article_url && (
                    <a 
                      href={article.article_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                    >
                      View Source
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center px-10 bg-white dark:bg-zinc-950 rounded-[4rem] border border-slate-100 dark:border-zinc-900 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full"></div>
          <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-10 shadow-inner relative z-10">
            <Bookmark className="w-10 h-10 text-slate-300 dark:text-zinc-700" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your library is empty</h3>
            <p className="text-slate-500 dark:text-zinc-500 font-bold max-w-sm mx-auto text-lg leading-relaxed">
              {searchQuery ? `No articles matching "${searchQuery}"` : "You haven't saved any articles yet. Verified news will appear here."}
            </p>
          </div>
          {!searchQuery && (
            <Link 
              href="/dashboard/verify"
              className="mt-12 px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 text-[11px] uppercase tracking-widest relative z-10"
            >
              Analyze News Now
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
