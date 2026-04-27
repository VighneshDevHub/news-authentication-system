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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/saved/`,
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/saved/${id}`,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Saved Library</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Access your bookmarked analysis and verified articles</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-violet-600 outline-none transition-all w-full md:w-72 font-bold shadow-sm"
            />
          </div>
          <button className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Filter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
          <p className="text-zinc-500 font-black animate-pulse">Opening your vaults...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-black text-rose-900 dark:text-rose-100">{error}</h3>
          <button 
            onClick={fetchSavedArticles}
            className="px-6 py-2 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition-all"
          >
            Retry
          </button>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-500 flex flex-col"
              >
                <div className="p-8 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {article.article_source || 'AI Analysis'}
                    </div>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-zinc-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight group-hover:text-violet-600 transition-colors">
                    {article.article_title}
                  </h3>
                  
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {article.article_content}
                  </p>
                </div>

                <div className="px-8 py-6 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                    <Clock className="w-4 h-4" />
                    {new Date(article.saved_at).toLocaleDateString()}
                  </div>
                  {article.article_url && (
                    <a 
                      href={article.article_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black text-violet-600 hover:text-violet-700 transition-colors"
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
        <div className="py-32 flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8">
            <Bookmark className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Your library is empty</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-10 text-lg">
            {searchQuery ? `No articles matching "${searchQuery}"` : "You haven't saved any articles yet. Verified news will appear here."}
          </p>
          {!searchQuery && (
            <button className="px-10 py-4 bg-violet-600 text-white font-black rounded-2xl shadow-lg shadow-violet-500/25 hover:bg-violet-700 transition-all hover:-translate-y-1">
              Browse Latest News
            </button>
          )}
        </div>
      )}
    </div>
  );
}
