'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  Settings, 
  LogOut, 
  Shield,
  Menu,
  X,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AIAssistant from '@/components/AIAssistant';
import ThemeToggle from '@/components/ThemeToggle';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Search, label: 'Verify News', href: '/dashboard/verify' },
  { icon: Bookmark, label: 'Saved Library', href: '/dashboard/library' },
  { icon: Shield, label: 'Recent Scans', href: '/dashboard/scans' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/signin?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || (!user && pathname !== '/signin' && pathname !== '/signup')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-zinc-50 dark:bg-zinc-950">
        <Shield className="w-12 h-12 text-indigo-600 animate-pulse" />
        <p className="text-zinc-500 font-medium">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">NewsGuard</span>
          </Link>
          
          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.username || 'User'}</p>
                <p className="text-xs font-medium text-slate-500 truncate capitalize">{user?.role || 'member'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {pathname.split('/').pop() || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:border-zinc-800 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{user?.username}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
          <AIAssistant initialMessage="Hello! I'm your NewsGuard assistant. How can I help you analyze the news today?" />
        </main>
      </div>
    </div>
  );
}
