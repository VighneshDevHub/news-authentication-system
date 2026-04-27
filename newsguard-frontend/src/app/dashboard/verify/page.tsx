'use client';

import React from 'react';
import NewsAnalyzer from '@/components/NewsAnalyzer';
import { Search, Info } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Verify Content</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Verify news, claims, and articles using advanced AI analysis</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Info className="w-4 h-4" />
          <span className="text-sm font-bold">Free scans: Unlimited</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <NewsAnalyzer />
      </div>
    </div>
  );
}
